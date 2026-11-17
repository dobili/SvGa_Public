/**
 * Die Tonregie des Abenteuers: hält die Lage (ton/tonplan.ts) und sagt dem Spieler, was klingen
 * soll. Oberwelt, Dialog und Ansicht rufen nur diese Funktionen auf (Atmosphäre T1, T2).
 *
 * Rolle im Gesamtbild: Eine Regie für das ganze Abenteuer, weil Musik über Dialog, Karte und
 * Partie hinweg weiterläuft. Ohne Web Audio oder vor der ersten Berührung (iPhone) bleibt sie
 * stumm, merkt sich aber die Lage, damit nach dem Entsperren das Richtige spielt.
 * Geräusche als Text (ton/untertitel.ts): Ist die Einstellung an, meldet die Regie Musik beim
 * Wechsel, das Dauergeräusch beim Betreten einer Karte oder beim Wechsel im Dialog und jedes
 * einmalige Geräusch, auch wenn der Ton aus ist (wer nicht hört, schaltet ihn oft gar nicht ein).
 * Abhängigkeiten: ton/tonplan.ts, ton/tonspieler.ts, ton/untertitel.ts, app/ton.ts (Tonerzeuger),
 * paket/paketlader.ts (Dateien).
 */
import { tonErzeuger } from "../../app/ton";
import { beiTonladestand, tonladestand } from "../paket/aktton";
import { liesPaketdatei } from "../paket/paketlader";
import {
  befehleAus,
  betritt,
  dialogEnde,
  pegel,
  soll,
  STILLE_LAGE,
  wende,
  type Abenteuerton,
  type Tonlage,
} from "./tonplan";
import { KEINE_NAEHE, naehe, type Klangort, type Naehe } from "./klangquelle";
import { Tonspieler, type Laden } from "./tonspieler";
import { leereUntertitel, meldeUntertitel, type Untertitelart } from "./untertitel";

/** Was zuletzt als Text gemeldet wurde je Spur; undefined heißt „beim nächsten Mal melden“. */
type Gemeldet = Partial<Record<"musik" | "geraeusch" | "quelle", string | null>>;

/** Was die Regie vom Spieler braucht (im Test ein Mitschreiber). */
export interface Spielwerk {
  setzePegel(musik: number, geraeusche: number): void;
  spieleSchleife(spur: "musik" | "geraeusch" | "quelle", angabe: string | null): Promise<void>;
  setzeNaehe(anteil: number): void;
  spieleEinmal(angabe: string): Promise<void>;
  stoppeAlles(): void;
  /** Fehlende Stücke vergessen (nach dem Nachladen des Tons); im Test entbehrlich. */
  vergissFehlende?(): void;
}

/**
 * Ein Ton, der nicht spielt, ist kein Fehler für den Leser: Safari wirft etwa „Context is stopped“,
 * wenn der Tonerzeuger beim Seitenwechsel oder im Hintergrund angehalten ist. Vermerkt für die
 * Fehlersuche, statt als unbehandelte Ausnahme die Seite zu stören (Affentest in WebKit).
 */
function tonfehler(fehler: unknown): void {
  console.warn("Ton nicht gespielt:", fehler);
}

export class Tonregie {
  private lage: Tonlage = STILLE_LAGE;
  private laut = false;
  /** Klangquellen der aktuellen Karte (T28) und was davon gerade beim Helden klingt. */
  private orte: readonly Klangort[] = [];
  private nah: Naehe = KEINE_NAEHE;
  private untertitelAn = false;
  private gemeldet: Gemeldet = {};

  constructor(
    private readonly werk: () => Spielwerk | null,
    private readonly melde: (art: Untertitelart, angabe: string) => void = meldeUntertitel,
  ) {}

  /** Ist Ton zu hören (Ton der App an, nicht stumm, ein Regler über 0)? */
  get hoerbar(): boolean {
    return this.laut;
  }

  /** Lautstärken und Stummschalter (Einstellungen); `tonAn` ist der allgemeine Ton der App. */
  stelleEin(e: Abenteuerton, tonAn: boolean): void {
    const p = pegel(e, tonAn);
    this.laut = p.musik > 0 || p.geraeusche > 0;
    // Frisch eingeschaltet: Was gerade klingt, gleich als Text zeigen.
    if (e.untertitel && !this.untertitelAn) this.gemeldet = {};
    if (!e.untertitel) leereUntertitel();
    this.untertitelAn = e.untertitel;
    this.werk()?.setzePegel(p.musik, p.geraeusche);
    this.spiele();
  }

  /** Eine Karte wurde betreten: ihre Musik und ihr Dauergeräusch aus orte.json. */
  karteBetreten(
    musik?: string | null,
    geraeusch?: string | null,
    quellen: readonly Klangort[] = [],
  ): void {
    this.lage = betritt(this.lage, musik, geraeusch);
    this.orte = quellen;
    this.nah = KEINE_NAEHE;
    // Das Dauergeräusch erscheint bei jedem Betreten als Text, die Musik nur beim Wechsel.
    this.gemeldet = { musik: this.gemeldet.musik };
    this.spiele();
  }

  /** Der Held steht auf einem neuen Feld: Klangquellen in der Nähe lauter oder leiser (T28). */
  heldBei(x: number, y: number): void {
    if (this.orte.length === 0) return;
    this.nah = naehe(this.orte, x, y);
    this.spiele();
  }

  /** Die Marken einer neuen Dialogzeile (`#musik`, `#geraeusch`, `#klang`). */
  dialogzeile(tags: Readonly<Record<string, string>>): void {
    for (const befehl of befehleAus(tags)) {
      if (befehl.art === "klang") {
        if (this.untertitelAn) this.melde("klang", befehl.kennung);
        if (this.laut) void this.werk()?.spieleEinmal(befehl.kennung).catch(tonfehler);
      } else this.lage = wende(this.lage, befehl);
    }
    this.spiele();
  }

  /** Der Dialog ist zu Ende: zurück zum Ton der Karte (außer `#musik:bleibt`). */
  dialogBeendet(): void {
    this.lage = dialogEnde(this.lage);
    this.spiele();
  }

  /** Der Ton ist nachgeladen (paket/aktton.ts): Was eben fehlte, jetzt spielen. */
  nachgeladen(): void {
    this.werk()?.vergissFehlende?.();
    this.spiele();
  }

  /** Das Abenteuer wird verlassen: alles blendet aus, die Lage beginnt neu. */
  verlassen(): void {
    this.lage = STILLE_LAGE;
    this.orte = [];
    this.nah = KEINE_NAEHE;
    this.gemeldet = {};
    leereUntertitel();
    this.werk()?.stoppeAlles();
  }

  /** Was gerade klingen soll (für Tests und die Anzeige). */
  get soll() {
    return soll(this.lage);
  }

  /** Meldet als Text, was sich seit der letzten Meldung geändert hat (nur Neues, nicht Stille). */
  private meldeAenderungen(): void {
    const s = soll(this.lage);
    const spuren = [
      ["musik", "musik", s.musik],
      ["geraeusch", "klang", s.geraeusch],
      ["quelle", "musik", this.nah.musik],
    ] as const;
    for (const [spur, art, angabe] of spuren) {
      if (this.gemeldet[spur] === angabe) continue;
      this.gemeldet[spur] = angabe;
      if (this.untertitelAn && angabe) this.melde(art, angabe);
    }
  }

  private spiele(): void {
    this.meldeAenderungen();
    const werk = this.werk();
    if (!werk) return;
    const s = this.laut ? soll(this.lage) : { musik: null, geraeusch: null };
    void werk.spieleSchleife("musik", s.musik).catch(tonfehler);
    void werk.spieleSchleife("geraeusch", s.geraeusch).catch(tonfehler);
    // Die Quelle schweigt im Dialog mit eigener Musik nicht: Sie gehört zum Ort, nicht zur Szene.
    void werk.spieleSchleife("quelle", this.laut ? this.nah.musik : null).catch(tonfehler);
    werk.setzeNaehe(this.laut && this.nah.musik ? this.nah.anteil : 0);
  }
}

/** Liest eine Paketdatei als Bytes; fehlt sie, null (erwartet: Es gibt noch keine Tondatei). */
const ausDemPaket: Laden = (pfad) =>
  liesPaketdatei(pfad)
    .then((antwort) => (antwort.ok ? antwort.arrayBuffer() : null))
    .catch(() => null);

let spieler: Tonspieler | null = null;

/** Der Spieler über dem gemeinsamen Tonerzeuger; null ohne Web Audio. */
function spielwerk(): Spielwerk | null {
  if (spieler) return spieler;
  const ctx = tonErzeuger();
  if (!ctx) return null;
  spieler = new Tonspieler(ctx, ausDemPaket);
  return spieler;
}

/** Die eine Tonregie des Abenteuers. */
export const tonregie = new Tonregie(spielwerk);

// Ist der Ton im Hintergrund fertig geladen, spielt, was beim Betreten der Karte noch fehlte.
beiTonladestand(() => {
  if (tonladestand().art === "vollstaendig") tonregie.nachgeladen();
});
