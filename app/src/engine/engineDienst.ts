/**
 * Engine-Dienst: Stockfish im Hintergrund starten, Stellungen bewerten, Aufträge abbrechen.
 *
 * Rolle im Gesamtbild: Einzige Stelle, die mit der Engine spricht (Konzept Abschnitt 8). Die
 * Engine läuft in einem Web Worker, damit die Oberfläche nie hängt. Sie wird erst beim ersten
 * Bedarf gestartet. Es läuft immer nur ein Auftrag: Ein neuer Auftrag bricht den alten ab.
 * Ein Wachhund wacht über jeden Auftrag: Meldet die Engine lange nach der Rechenzeit
 * kein „bestmove“ (der Worker ist abgestürzt oder wurde vom Handy im Hintergrund beendet), startet
 * der Dienst die Engine neu und lehnt den Auftrag als abgebrochen ab; die Aufrufer versuchen es
 * dann wie nach jeder Unterbrechung noch einmal (Fehlerbericht des Autors: Auswertung startete
 * nach einer Partie nicht).
 * Abhängigkeiten: uci.ts. Die Verbindung zur Engine ist austauschbar (Kanal), damit Tests die
 * Engine auch unter Node starten können.
 */
import { leseBesterZug, leseInfozeile, type Variante } from "./uci";

/** Verbindung zur Engine: Befehle senden, Zeilen empfangen. */
export interface Kanal {
  senden(befehl: string): void;
  beiZeile(empfaenger: (zeile: string) => void): void;
  beenden(): void;
}

/** Ergebnis einer Bewertung (Konzept 8.1, „bewerte“). */
export interface Bewertung {
  readonly varianten: readonly Variante[];
  readonly tiefe: number;
  readonly knotenJeSekunde: number;
  /** Tatsächliche Rechenzeit in Millisekunden, für die Messung auf dem Handy. */
  readonly rechenzeitMs: number;
  /** Zeit vom Start der Engine bis „bereit“, in Millisekunden (nur beim ersten Auftrag > 0). */
  readonly startzeitMs: number;
  /** Bester Zug in UCI-Schreibweise oder null, wenn es keinen legalen Zug gibt. */
  readonly besterZug: string | null;
}

/**
 * Spielstärke für einen Auftrag (Konzept 8.2): volle Stärke, Stockfish-„Skill Level“ (0 bis 20)
 * oder die Elo-Begrenzung (UCI_LimitStrength mit UCI_Elo). Bewertungen rechnen immer voll.
 */
export type Staerke =
  | { readonly art: "voll" }
  | { readonly art: "skill"; readonly stufe: number }
  | { readonly art: "elo"; readonly elo: number }
  /** Volle Stärke, aber nur bis zu dieser Suchtiefe (Stufen 1 bis 3 seit 0.2.52, engine/menschlich.ts). */
  | { readonly art: "tiefe"; readonly tiefe: number };

/** Die Engine ohne Begrenzung der Stärke. */
export const VOLLE_STAERKE: Staerke = { art: "voll" };
/** Höchster „Skill Level“ von Stockfish (volle Stärke). */
const SKILL_VOLL = 20;

/** Die UCI-Befehle, die eine Stärke einstellen; jeder Auftrag setzt alle drei neu. */
export function staerkebefehle(staerke: Staerke): string[] {
  const begrenzt = staerke.art === "elo";
  const skill = staerke.art === "skill" ? staerke.stufe : SKILL_VOLL;
  const befehle = [
    `setoption name UCI_LimitStrength value ${begrenzt}`,
    `setoption name Skill Level value ${skill}`,
  ];
  if (staerke.art === "elo") befehle.push(`setoption name UCI_Elo value ${staerke.elo}`);
  return befehle;
}

/** Fehler, wenn ein Auftrag durch einen neueren ersetzt oder gestoppt wurde. */
export class AuftragAbgebrochen extends Error {
  constructor() {
    super("Auftrag abgebrochen");
    this.name = "AuftragAbgebrochen";
  }
}

/** Standard-Rechenzeit in Millisekunden (Konzept 8.1: 2,5 Sekunden). */
export const STANDARD_RECHENZEIT_MS = 2500;
/** Standardzahl der Varianten, die die Abbildung zeigt. */
export const STANDARD_VARIANTEN = 3;
/** Hash-Speicher der Engine in MB: klein halten, damit auch ältere Handys mitkommen. */
const HASH_MB = 16;
/** So lange darf die Engine zum Starten brauchen, bevor ein Fehler gemeldet wird. */
const STARTFRIST_MS = 30_000;
/**
 * Zuschlag zur Rechenzeit, nach dem ein Auftrag als hängend gilt. Jeder Auftrag hat „movetime“,
 * die Engine meldet also spätestens kurz nach der Rechenzeit; 10 s lassen langsamen Handys Luft.
 */
const WACHHUND_ZUSCHLAG_MS = 10_000;

interface LaufenderAuftrag {
  readonly weissAmZug: boolean;
  readonly beginn: number;
  readonly varianten: Map<number, Variante>;
  tiefe: number;
  knotenJeSekunde: number;
  abgebrochen: boolean;
  /** Zeitgeber des Wachhunds. */
  wachhund?: ReturnType<typeof setTimeout>;
  readonly erfuellen: (bewertung: Bewertung) => void;
  readonly ablehnen: (fehler: Error) => void;
}

/** Ein Engine-Dienst mit einer eigenen Engine. In der App gibt es genau einen (siehe unten). */
export class EngineDienst {
  private kanal: Kanal | null = null;
  private bereit: Promise<void> | null = null;
  private startzeitMs = 0;
  private auftrag: LaufenderAuftrag | null = null;
  /** Aufträge laufen nacheinander: Der nächste beginnt erst, wenn die Engine „bestmove“ meldete. */
  private kette: Promise<void> = Promise.resolve();
  /** Nummer des neuesten Auftrags. Ältere, die noch nicht begonnen haben, entfallen. */
  private neuesterAuftrag = 0;
  /** Aufträge, die angenommen und noch nicht abgeschlossen sind. */
  private offene = 0;
  private wartendeZeilen: ((zeile: string) => boolean)[] = [];

  constructor(private readonly oeffneKanal: () => Kanal) {}

  /**
   * Startet die Engine einmalig (Konzept 8.1, „starte“).
   *
   * Ausgabe: erfüllt, sobald die Engine „readyok“ meldet. Ein Fehler beim Laden (etwa fehlende
   * Datei) wird als verständliche Meldung weitergegeben, nicht verschluckt.
   */
  starte(): Promise<void> {
    if (!this.bereit) {
      const beginn = performance.now();
      this.bereit = this.verbinde().then(() => {
        this.startzeitMs = performance.now() - beginn;
      });
      this.bereit.catch(() => {
        this.bereit = null;
      });
    }
    return this.bereit;
  }

  private async verbinde(): Promise<void> {
    const kanal = this.oeffneKanal();
    this.kanal = kanal;
    kanal.beiZeile((zeile) => this.empfange(zeile));
    // Erst auf die Antwort warten, dann senden: Manche Engines antworten sofort im selben Aufruf.
    const uciBereit = this.warteAuf((zeile) => zeile.trim() === "uciok");
    kanal.senden("uci");
    await uciBereit;
    kanal.senden(`setoption name Hash value ${HASH_MB}`);
    const bereit = this.warteAuf((zeile) => zeile.trim() === "readyok");
    kanal.senden("isready");
    await bereit;
  }

  /** Wartet auf eine bestimmte Zeile der Engine, mit Frist. */
  private warteAuf(passt: (zeile: string) => boolean): Promise<void> {
    return new Promise((erfuellen, ablehnen) => {
      const frist = setTimeout(
        () => ablehnen(new Error("Die Engine hat nicht rechtzeitig geantwortet.")),
        STARTFRIST_MS,
      );
      this.wartendeZeilen.push((zeile) => {
        if (!passt(zeile)) return false;
        clearTimeout(frist);
        erfuellen();
        return true;
      });
    });
  }

  /** Verteilt jede Zeile der Engine an wartende Starts und an den laufenden Auftrag. */
  private empfange(zeile: string): void {
    this.wartendeZeilen = this.wartendeZeilen.filter((wartend) => !wartend(zeile));
    const auftrag = this.auftrag;
    if (!auftrag) return;
    const info = leseInfozeile(zeile, auftrag.weissAmZug);
    if (info) {
      auftrag.varianten.set(info.variante.nummer, info.variante);
      auftrag.tiefe = Math.max(auftrag.tiefe, info.tiefe);
      auftrag.knotenJeSekunde = info.knotenJeSekunde || auftrag.knotenJeSekunde;
      return;
    }
    const besterZug = leseBesterZug(zeile);
    if (besterZug !== undefined) {
      this.beende(auftrag, besterZug);
    }
  }

  /** Schließt einen Auftrag ab, sobald die Engine „bestmove“ meldet. */
  private beende(auftrag: LaufenderAuftrag, besterZug: string | null): void {
    clearTimeout(auftrag.wachhund);
    this.auftrag = null;
    if (auftrag.abgebrochen) {
      auftrag.ablehnen(new AuftragAbgebrochen());
      return;
    }
    const varianten = [...auftrag.varianten.values()].sort((a, b) => a.nummer - b.nummer);
    auftrag.erfuellen({
      varianten,
      tiefe: auftrag.tiefe,
      knotenJeSekunde: auftrag.knotenJeSekunde,
      rechenzeitMs: performance.now() - auftrag.beginn,
      startzeitMs: this.startzeitMs,
      besterZug,
    });
  }

  /**
   * Bewertet eine Stellung (Konzept 8.1, „bewerte“).
   *
   * Warum: Der Knopf „Engine-Bewertung“ auf jeder Abbildung zeigt Wert und beste Züge.
   * Eingaben: FEN, Rechenzeit in Millisekunden, Zahl der Varianten.
   * Ausgabe: Bewertung, Werte immer aus Sicht von Weiß. Ein neuer Auftrag bricht diesen ab;
   * dann wird mit AuftragAbgebrochen abgelehnt.
   * Beispiel: Abb. 1.26 nach 2,5 s etwa „+0,3 · ausgeglichen“ mit 6. a3 oder 6. Le2.
   * Sonderfall: Mit einer begrenzten Stärke (Spiel gegen die Engine, Stufen 1 bis 7) zählt vor
   * allem „besterZug“; die Werte der Varianten sind dann weniger verlässlich.
   * Sonderfall: Mit „nurZuege“ (UCI) rechnet die Engine nur diese Züge („searchmoves“), je Zug
   * eine Variante; so bewerten die Fehlerprofile (engine/fehlersuche.ts) gezielt Fehlerzüge.
   */
  bewerte(
    fen: string,
    rechenzeitMs = STANDARD_RECHENZEIT_MS,
    varianten = STANDARD_VARIANTEN,
    staerke: Staerke = VOLLE_STAERKE,
    nurZuege: readonly string[] = [],
  ): Promise<Bewertung> {
    this.neuesterAuftrag += 1;
    const nummer = this.neuesterAuftrag;
    this.stoppe();
    this.offene += 1;
    const ergebnis = this.kette
      .then(async () => {
        await this.starte();
        if (nummer !== this.neuesterAuftrag) {
          throw new AuftragAbgebrochen();
        }
        return this.fuehreAus(fen, rechenzeitMs, varianten, staerke, nurZuege);
      })
      .finally(() => {
        this.offene -= 1;
      });
    this.kette = ergebnis.then(
      () => undefined,
      () => undefined,
    );
    return ergebnis;
  }

  /**
   * Rechnet die Engine gerade, oder wartet ein Auftrag? Die Auswertung im Hintergrund während der
   * Partie (ui/komponenten/useAuswertung.ts) fragt das vor jeder Stellung, damit sie keinen
   * Auftrag des Lesers (Hinweis, Werkzeug, Zug der Engine) verdrängt.
   */
  beschaeftigt(): boolean {
    return this.auftrag !== null || this.offene > 0;
  }

  /** Schickt einen Auftrag an die Engine; erfüllt bei „bestmove“. */
  private fuehreAus(
    fen: string,
    rechenzeitMs: number,
    varianten: number,
    staerke: Staerke,
    nurZuege: readonly string[],
  ): Promise<Bewertung> {
    const kanal = this.kanal;
    if (!kanal) {
      return Promise.reject(new Error("Die Engine ist nicht gestartet."));
    }
    const ergebnis = new Promise<Bewertung>((erfuellen, ablehnen) => {
      this.auftrag = {
        weissAmZug: fen.split(" ")[1] !== "b",
        beginn: performance.now(),
        varianten: new Map(),
        tiefe: 0,
        knotenJeSekunde: 0,
        abgebrochen: false,
        erfuellen,
        ablehnen,
      };
    });
    staerkebefehle(staerke).forEach((befehl) => kanal.senden(befehl));
    kanal.senden(`setoption name MultiPV value ${Math.max(varianten, nurZuege.length)}`);
    kanal.senden(`position fen ${fen}`);
    const auswahl = nurZuege.length > 0 ? ` searchmoves ${nurZuege.join(" ")}` : "";
    // Mit Tiefengrenze hält die Engine an, sobald die Tiefe oder die Zeit erreicht ist.
    const tiefe = staerke.art === "tiefe" ? `depth ${staerke.tiefe} ` : "";
    kanal.senden(`go ${tiefe}movetime ${rechenzeitMs}${auswahl}`);
    const auftrag = this.auftrag;
    if (auftrag) {
      auftrag.wachhund = setTimeout(
        () => this.starteNeu(auftrag),
        rechenzeitMs + WACHHUND_ZUSCHLAG_MS,
      );
    }
    return ergebnis;
  }

  /**
   * Die Engine antwortet nicht mehr: Worker beenden, beim nächsten Auftrag neu starten, den
   * hängenden Auftrag als abgebrochen ablehnen (die Aufrufer versuchen es dann noch einmal).
   */
  private starteNeu(auftrag: LaufenderAuftrag): void {
    if (this.auftrag !== auftrag) return;
    console.warn("Die Engine antwortet nicht mehr und wird neu gestartet.");
    this.auftrag = null;
    this.kanal?.beenden();
    this.kanal = null;
    this.bereit = null;
    auftrag.ablehnen(new AuftragAbgebrochen());
  }

  /** Bricht den laufenden Auftrag ab (Konzept 8.1, „stoppe“). Ohne Auftrag passiert nichts. */
  stoppe(): void {
    if (this.auftrag && !this.auftrag.abgebrochen) {
      this.auftrag.abgebrochen = true;
      this.kanal?.senden("stop");
    }
  }

  /** Beendet die Engine ganz, etwa in Tests. */
  beendeEngine(): void {
    this.stoppe();
    this.kanal?.beenden();
    this.kanal = null;
    this.bereit = null;
  }
}

/** Adresse der Engine-Datei; die WASM-Datei liegt daneben (siehe skripte/kopiere-engine.mjs). */
const ENGINE_ADRESSE = "/engine/stockfish-19-lite-single.js";

/** Öffnet die Engine im Browser als Web Worker. */
function workerKanal(): Kanal {
  const worker = new Worker(ENGINE_ADRESSE);
  return {
    senden: (befehl) => worker.postMessage(befehl),
    beiZeile: (empfaenger) => {
      worker.onmessage = (ereignis: MessageEvent<unknown>) => {
        if (typeof ereignis.data === "string") empfaenger(ereignis.data);
      };
      worker.onerror = (ereignis) => {
        console.error("Engine-Fehler:", ereignis.message);
      };
    },
    beenden: () => worker.terminate(),
  };
}

/** Der Engine-Dienst der App. Startet die Engine erst beim ersten Auftrag. */
export const engine = new EngineDienst(workerKanal);
