/**
 * Laufzeit von Maia-2 in der App: schickt jede Rechnung an den Maia-Worker (engine/maiaWorker.ts).
 *
 * Rolle im Gesamtbild: Rechnet das Netz für engine/maia.ts, wenn der Leser das Zusatzpaket geladen
 * und eingeschaltet hat (app/maiapaket.ts). Bis 0.3.38 lief onnxruntime-web im Hauptthread (etwa
 * 150 ms je Zug in Chromium, auf älteren Handys ein Vielfaches); dabei stockten Zuganimation und
 * Uhranzeige (Befund des Autors, 31.10.2026). Seit 0.3.39 rechnet ein eigener Worker: Die App
 * liest Laufzeit und Netz wie bisher aus dem Speicher des Pakets (auch ohne Netz) und schickt sie
 * beim ersten Zug mit einem Modell hinüber, danach je Zug nur das Brett.
 * Sonderfall: Schlägt etwas fehl (Paket gelöscht, zu wenig Speicher, Worker abgestürzt), wirft
 * rechne(); die Zugwahl spielt dann ohne Maia weiter (engine/maia.ts, maiaabfrage). Beim nächsten
 * Zug wird neu versucht.
 * Abhängigkeiten: engine/maia.ts, engine/maiaNachrichten.ts, engine/maiaWorker.ts, app/maiapaket.ts.
 */
import { maialaufzeitBytes, maiamodellBytes } from "../app/maiapaket";
import type { Maialaufzeit, Maiamodell } from "./maia";
import type { AnMaia, VonMaia } from "./maiaNachrichten";

/** Was die Verbindung vom Worker braucht (in Tests ein Ersatz ohne echten Thread). */
export interface Maiakanal {
  onmessage: ((ereignis: MessageEvent<VonMaia>) => void) | null;
  onerror: ((ereignis: ErrorEvent) => void) | null;
  postMessage(nachricht: AnMaia, uebergabe: Transferable[]): void;
  terminate(): void;
}

/** Woher Laufzeit und Netze kommen (in der App aus dem Speicher des Pakets). */
export interface Maiaspeicher {
  laufzeit(): Promise<ArrayBuffer>;
  netz(modell: Maiamodell): Promise<ArrayBuffer>;
}

type OhneNummer<T> = T extends unknown ? Omit<T, "nr"> : never;

interface Offen {
  readonly fertig: (logits: Float32Array | undefined) => void;
  readonly fehler: (grund: Error) => void;
}

/**
 * Die Verbindung zum Worker: startet ihn beim ersten Gebrauch, lädt jedes Modell einmal und ordnet
 * die Antworten über ihre Nummer den Anfragen zu.
 * Beispiel: `await verbindung.rechne("rapid", brett, 1500, 1500)` → Logits des Netzes.
 */
export class Maiaverbindung implements Maialaufzeit {
  private kanal: Maiakanal | null = null;
  private naechste = 1;
  private readonly offen = new Map<number, Offen>();
  private readonly geladen = new Map<Maiamodell, Promise<void>>();

  constructor(
    private readonly erzeuge: () => Maiakanal,
    private readonly speicher: Maiaspeicher,
  ) {}

  async rechne(
    modell: Maiamodell,
    brett: Float32Array,
    eloSelbst: number,
    eloGegner: number,
  ): Promise<Float32Array> {
    await this.lade(modell);
    // Eine Kopie reist hinüber; das Brett des Aufrufers bleibt unberührt.
    const kopie = Float32Array.from(brett);
    const auftrag = { art: "rechne", modell, brett: kopie, eloSelbst, eloGegner } as const;
    const logits = await this.sende(auftrag, [kopie.buffer]);
    if (!logits) throw new Error("Maia: keine Logits vom Worker");
    return logits;
  }

  /** Beendet den Worker und gibt die Netze frei (nach dem Löschen des Pakets). */
  freigeben(): void {
    this.kanal?.terminate();
    this.kanal = null;
    this.geladen.clear();
    this.scheitere(new Error("Maia: freigegeben"));
  }

  private lade(modell: Maiamodell): Promise<void> {
    let laden = this.geladen.get(modell);
    if (!laden) {
      laden = (async () => {
        const [laufzeit, netz] = await Promise.all([
          this.speicher.laufzeit(),
          this.speicher.netz(modell),
        ]);
        await this.sende({ art: "lade", modell, laufzeit, netz }, [laufzeit, netz]);
      })();
      // Fehlgeschlagen: beim nächsten Zug neu versuchen (etwa nach erneutem Laden des Pakets).
      laden.catch(() => this.geladen.delete(modell));
      this.geladen.set(modell, laden);
    }
    return laden;
  }

  private sende(
    auftrag: OhneNummer<AnMaia>,
    uebergabe: Transferable[],
  ): Promise<Float32Array | undefined> {
    const kanal = this.verbunden();
    const nr = this.naechste++;
    return new Promise((fertig, fehler) => {
      this.offen.set(nr, { fertig, fehler });
      kanal.postMessage({ ...auftrag, nr } as AnMaia, uebergabe);
    });
  }

  private verbunden(): Maiakanal {
    if (this.kanal) return this.kanal;
    const kanal = this.erzeuge();
    kanal.onmessage = (ereignis) => this.antwort(ereignis.data);
    kanal.onerror = (ereignis) => {
      // Der Worker ist abgestürzt: alles Offene scheitert, der nächste Zug startet ihn neu.
      ereignis.preventDefault();
      kanal.terminate();
      this.kanal = null;
      this.geladen.clear();
      this.scheitere(new Error(`Maia: Worker abgestürzt (${ereignis.message})`));
    };
    this.kanal = kanal;
    return kanal;
  }

  private antwort(nachricht: VonMaia): void {
    const offen = this.offen.get(nachricht.nr);
    if (!offen) return;
    this.offen.delete(nachricht.nr);
    if (nachricht.art === "fehler") offen.fehler(new Error(nachricht.meldung));
    else offen.fertig(nachricht.logits);
  }

  private scheitere(grund: Error): void {
    for (const offen of this.offen.values()) offen.fehler(grund);
    this.offen.clear();
  }
}

/** Der Worker der App (Vite bündelt ihn als eigene Datei, der Service Worker hält ihn offline). */
function maiaWorker(): Maiakanal {
  return new Worker(new URL("./maiaWorker.ts", import.meta.url), { type: "module" });
}

const verbindung = new Maiaverbindung(maiaWorker, {
  laufzeit: maialaufzeitBytes,
  netz: maiamodellBytes,
});

/** Die Laufzeit der App (eine für alle Bots; die Netze werden beim ersten Gebrauch geladen). */
export const MAIA_WEB: Maialaufzeit = verbindung;

/** Gibt die geladenen Netze frei (nach dem Löschen des Pakets). */
export function maiaFreigeben(): void {
  verbindung.freigeben();
}
