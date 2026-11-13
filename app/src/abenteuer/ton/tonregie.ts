/**
 * Die Tonregie des Abenteuers: hält die Lage (ton/tonplan.ts) und sagt dem Spieler, was klingen
 * soll. Oberwelt, Dialog und Ansicht rufen nur diese Funktionen auf (Atmosphäre T1, T2).
 *
 * Rolle im Gesamtbild: Eine Regie für das ganze Abenteuer, weil Musik über Dialog, Karte und
 * Partie hinweg weiterläuft. Ohne Web Audio oder vor der ersten Berührung (iPhone) bleibt sie
 * stumm, merkt sich aber die Lage, damit nach dem Entsperren das Richtige spielt.
 * Abhängigkeiten: ton/tonplan.ts, ton/tonspieler.ts, app/ton.ts (Tonerzeuger),
 * paket/paketlader.ts (Dateien).
 */
import { tonErzeuger } from "../../app/ton";
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
import { Tonspieler, type Laden } from "./tonspieler";

/** Was die Regie vom Spieler braucht (im Test ein Mitschreiber). */
export interface Spielwerk {
  setzePegel(musik: number, geraeusche: number): void;
  spieleSchleife(spur: "musik" | "geraeusch", angabe: string | null): Promise<void>;
  spieleEinmal(angabe: string): Promise<void>;
  stoppeAlles(): void;
}

export class Tonregie {
  private lage: Tonlage = STILLE_LAGE;
  private laut = false;

  constructor(private readonly werk: () => Spielwerk | null) {}

  /** Lautstärken und Stummschalter (Einstellungen); `tonAn` ist der allgemeine Ton der App. */
  stelleEin(e: Abenteuerton, tonAn: boolean): void {
    const p = pegel(e, tonAn);
    this.laut = p.musik > 0 || p.geraeusche > 0;
    this.werk()?.setzePegel(p.musik, p.geraeusche);
    this.spiele();
  }

  /** Eine Karte wurde betreten: ihre Musik und ihr Dauergeräusch aus orte.json. */
  karteBetreten(musik?: string | null, geraeusch?: string | null): void {
    this.lage = betritt(this.lage, musik, geraeusch);
    this.spiele();
  }

  /** Die Marken einer neuen Dialogzeile (`#musik`, `#geraeusch`, `#klang`). */
  dialogzeile(tags: Readonly<Record<string, string>>): void {
    for (const befehl of befehleAus(tags)) {
      if (befehl.art === "klang") {
        if (this.laut) void this.werk()?.spieleEinmal(befehl.kennung);
      } else this.lage = wende(this.lage, befehl);
    }
    this.spiele();
  }

  /** Der Dialog ist zu Ende: zurück zum Ton der Karte (außer `#musik:bleibt`). */
  dialogBeendet(): void {
    this.lage = dialogEnde(this.lage);
    this.spiele();
  }

  /** Das Abenteuer wird verlassen: alles blendet aus, die Lage beginnt neu. */
  verlassen(): void {
    this.lage = STILLE_LAGE;
    this.werk()?.stoppeAlles();
  }

  /** Was gerade klingen soll (für Tests und die Anzeige). */
  get soll() {
    return soll(this.lage);
  }

  private spiele(): void {
    const werk = this.werk();
    if (!werk) return;
    const s = this.laut ? soll(this.lage) : { musik: null, geraeusch: null };
    void werk.spieleSchleife("musik", s.musik);
    void werk.spieleSchleife("geraeusch", s.geraeusch);
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
