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
import { istGestoppterTon, mitTon, verwirfTonerzeuger } from "../../app/ton";
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
import type { Geraeuschquelle } from "./geraeuschraum";
import { KEINE_NAEHE, naehe, type Klangort, type Naehe } from "./klangquelle";
import { artVon, Raumregie, type Raumuhr } from "./raumregie";
import { Mischregie } from "./mischregie";
import type { Musikmessung } from "./musikspuren";
import type { Mischlage } from "./spurenmischung";
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
  /** Pegel des Dauergeräuschs nach Ort und Ankunft (ton/raumregie.ts); im Test entbehrlich. */
  setzeRaum?(faktor: number): void;
  /** Lage der Spurenmischung (ton/mischregie.ts); im Test entbehrlich. */
  setzeMischlage?(lage: Mischlage): void;
  /** Neue Karte: Ausdünnen zählt neu; im Test entbehrlich. */
  neueKarte?(): void;
  /** Musik unter einer Dialogzeile 3 dB leiser; im Test entbehrlich. */
  setzeDialog?(aktiv: boolean): void;
  /** Was an Musikspuren klingt (Tonmesser); im Test entbehrlich. */
  musikmessung?(): Musikmessung | null;
}

/** Was der Tonmesser meldet (Oberflächentests, Pegelprotokoll): Musik, Spuren, Dialog, Raum. */
export interface Tonmessung {
  readonly musik: string | null;
  readonly spuren: Musikmessung | null;
  readonly dialog: boolean;
  readonly raum: number | null;
  readonly mischlage: Mischlage;
}

/**
 * Ein Ton, der nicht spielt, ist kein Fehler für den Leser: Safari wirft etwa „Context is stopped“,
 * wenn der Tonerzeuger beim Seitenwechsel oder im Hintergrund angehalten ist. Vermerkt für die
 * Fehlersuche, statt als unbehandelte Ausnahme die Seite zu stören (Affentest in WebKit). Ist der
 * Erzeuger gestoppt, wird er samt Spieler verworfen; der nächste Ton legt beide neu an.
 */
function tonfehler(fehler: unknown): void {
  if (istGestoppterTon(fehler)) verwirfSpielwerk();
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
  /** Pegel des Dauergeräuschs nach Ort und Ankunft (räumliche Geräusche, 22.11.2026). */
  private readonly raum: Raumregie;
  /** Lage der Spurenmischung: Innenraum, Siege, Musiker (Klangplan A0.1). */
  private readonly mischung: Mischregie;
  private dialogAktiv = false;

  constructor(
    private readonly werk: () => Spielwerk | null,
    private readonly melde: (art: Untertitelart, angabe: string) => void = meldeUntertitel,
    uhr?: Raumuhr,
  ) {
    this.raum = new Raumregie((faktor) => this.mitWerk((w) => w.setzeRaum?.(faktor)), uhr);
    this.mischung = new Mischregie((arbeit) =>
      this.mitWerk((w) =>
        arbeit({ setzeMischlage: (l) => w.setzeMischlage?.(l), neueKarte: () => w.neueKarte?.() }),
      ),
    );
  }

  /** Was gerade klingt, für Oberflächentests und das Pegelprotokoll (ton/tonmesser). */
  messung(): Tonmessung {
    const werk = this.werk();
    return {
      musik: this.laut ? soll(this.lage).musik : null,
      spuren: werk?.musikmessung?.() ?? null,
      dialog: this.dialogAktiv,
      raum: this.raum.pegel,
      mischlage: this.mischung.lage,
    };
  }

  /** Eine Partie oder Runde ist zu Ende (Steigerung des Kampfthemas je Sieg). */
  ergebnis(sieg: boolean): void {
    this.mischung.ergebnis(sieg);
  }

  /** Der zuletzt gesetzte Pegel des Dauergeräuschs (Pegelprotokoll, Tests). */
  get raumpegel(): number | null {
    return this.raum.pegel;
  }

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
    this.mitWerk((w) => w.setzePegel(p.musik, p.geraeusche));
    this.spiele();
  }

  /**
   * Eine Karte wurde betreten: ihre Musik und ihr Dauergeräusch aus orte.json, die Klangquellen
   * der Musik (T28) und die Stellen, von denen das Dauergeräusch kommt (ton/geraeuschraum.ts).
   */
  karteBetreten(
    musik?: string | null,
    geraeusch?: string | null,
    quellen: readonly Klangort[] = [],
    geraeuschquellen: readonly Geraeuschquelle[] = [],
    karte: { readonly kennung: string; readonly innen: boolean } | null = null,
  ): void {
    this.lage = betritt(this.lage, musik, geraeusch);
    this.mischung.betreten(karte?.kennung ?? null, karte?.innen ?? false, geraeuschquellen);
    this.raum.betreten(artVon(soll(this.lage).geraeusch), geraeuschquellen);
    this.orte = quellen;
    this.nah = KEINE_NAEHE;
    // Das Dauergeräusch erscheint bei jedem Betreten als Text, die Musik nur beim Wechsel.
    this.gemeldet = { musik: this.gemeldet.musik };
    this.spiele();
  }

  /** Der Held steht auf einem neuen Feld: Klangquellen in der Nähe lauter oder leiser (T28). */
  heldBei(x: number, y: number): void {
    this.raum.heldBei(x, y);
    this.mischung.heldBei(x, y);
    if (this.orte.length === 0) return;
    this.nah = naehe(this.orte, x, y);
    this.spiele();
  }

  /** Die Marken einer neuen Dialogzeile (`#musik`, `#geraeusch`, `#klang`). */
  dialogzeile(tags: Readonly<Record<string, string>>): void {
    for (const befehl of befehleAus(tags)) {
      if (befehl.art === "klang") {
        if (this.untertitelAn) this.melde("klang", befehl.kennung);
        if (this.laut) this.mitWerk((w) => void w.spieleEinmal(befehl.kennung).catch(tonfehler));
      } else this.lage = wende(this.lage, befehl);
    }
    this.setzeDialog(true);
    this.spiele();
  }

  /** Der Dialog ist zu Ende: zurück zum Ton der Karte (außer `#musik:bleibt`). */
  dialogBeendet(): void {
    this.lage = dialogEnde(this.lage);
    this.setzeDialog(false);
    this.spiele();
  }

  /** Unter Dialogzeilen klingt die Musik 3 dB leiser (Klangplan A0, Regel 3). */
  private setzeDialog(aktiv: boolean): void {
    if (aktiv === this.dialogAktiv) return;
    this.dialogAktiv = aktiv;
    this.mitWerk((w) => w.setzeDialog?.(aktiv));
  }

  /** Der Ton ist nachgeladen (paket/aktton.ts): Was eben fehlte, jetzt spielen. */
  nachgeladen(): void {
    this.mitWerk((w) => w.vergissFehlende?.());
    this.spiele();
  }

  /** Das Abenteuer wird verlassen: alles blendet aus, die Lage beginnt neu. */
  verlassen(): void {
    this.lage = STILLE_LAGE;
    this.orte = [];
    this.nah = KEINE_NAEHE;
    this.gemeldet = {};
    this.setzeDialog(false);
    leereUntertitel();
    this.mitWerk((w) => w.stoppeAlles());
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
    // Ein Geräusch aus dem Dialog (`#geraeusch`) hat eigene Quellen nicht: Es klingt im Grundpegel.
    this.raum.geraeusch(artVon(soll(this.lage).geraeusch));
    this.mischung.musikJetzt(soll(this.lage).musik, this.lage.szeneMusik);
    const s = this.laut ? soll(this.lage) : { musik: null, geraeusch: null };
    this.mitWerk((werk) => {
      void werk.spieleSchleife("musik", s.musik).catch(tonfehler);
      void werk.spieleSchleife("geraeusch", s.geraeusch).catch(tonfehler);
      // Die Quelle schweigt im Dialog mit eigener Musik nicht: Sie gehört zum Ort, nicht zur Szene.
      void werk.spieleSchleife("quelle", this.laut ? this.nah.musik : null).catch(tonfehler);
      werk.setzeNaehe(this.laut && this.nah.musik ? this.nah.anteil : 0);
    });
  }

  /**
   * Arbeit am Spieler, wenn es einen gibt. Ist der Tonerzeuger gestoppt (WebKit beim Neuladen:
   * „Context is stopped“), wird er verworfen und der Ton fällt diesmal aus; andere Fehler gehen
   * weiter an den Aufrufer (keine verschluckten Fehler).
   */
  private mitWerk(arbeit: (werk: Spielwerk) => void): void {
    const werk = this.werk();
    if (!werk) return;
    try {
      arbeit(werk);
    } catch (fehler: unknown) {
      if (!istGestoppterTon(fehler)) throw fehler;
      tonfehler(fehler);
    }
  }
}

/** Liest eine Paketdatei als Bytes; fehlt sie, null (erwartet: Es gibt noch keine Tondatei). */
const ausDemPaket: Laden = (pfad) =>
  liesPaketdatei(pfad)
    .then((antwort) => (antwort.ok ? antwort.arrayBuffer() : null))
    .catch(() => null);

let spieler: { readonly werk: Tonspieler; readonly ctx: AudioContext } | null = null;

/**
 * Der Spieler über dem gemeinsamen Tonerzeuger; null ohne Web Audio oder bei gestopptem Erzeuger.
 * Wechselt der Erzeuger (der alte war gestoppt), entsteht ein neuer Spieler.
 */
function spielwerk(): Spielwerk | null {
  return (
    mitTon((ctx) => {
      if (spieler?.ctx !== ctx) spieler = { werk: new Tonspieler(ctx, ausDemPaket), ctx };
      return spieler.werk;
    }) ?? null
  );
}

/** Vergisst Spieler und Tonerzeuger, nachdem der Browser den Erzeuger gestoppt hat. */
function verwirfSpielwerk(): void {
  if (spieler) verwirfTonerzeuger();
  spieler = null;
}

/** Die eine Tonregie des Abenteuers. */
export const tonregie = new Tonregie(spielwerk);

// Tonmesser für Oberflächentests und das Pegelprotokoll: liest nur, ändert nichts.
(globalThis as { __tonmesser?: () => Tonmessung }).__tonmesser = () => tonregie.messung();

// Ist der Ton im Hintergrund fertig geladen, spielt, was beim Betreten der Karte noch fehlte.
beiTonladestand(() => {
  if (tonladestand().art === "vollstaendig") tonregie.nachgeladen();
});
