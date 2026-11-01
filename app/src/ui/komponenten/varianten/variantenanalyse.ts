/**
 * Warteschlange der Variantenanalyse: die Engine rechnet im Hintergrund Stellung für Stellung,
 * abbrechbar, und schreibt die Ergebnisse in den Speicher.
 *
 * Rolle im Gesamtbild: Variationsbrowser, Stufe 3 (Entscheidung f = A des Autors, 1.11.2026:
 * „Analyse auf Knopfdruck“, die zweite Engine rechnet im Hintergrund, man kann dabei weiter
 * blättern). Die Warteschlange lebt außerhalb des Bildschirms: Wer die Variante verlässt, lässt
 * die Analyse weiterlaufen; die Ergebnisse kommen trotzdem in den Speicher. Gerechnet wird mit
 * der Engine der Partieauswertung (engine/engineDienst.ts, auswertungsEngine, eigener Worker) und
 * derselben Tiefe 18 (useAuswertung.ts, bewerteStellung), damit Zugarten in Varianten und
 * Partien gleich ausfallen. Die Bedienung blockiert nie: Jeder Auftrag ist ein Promise, die
 * Oberfläche erfährt den Fortschritt über `beobachte`. Ergebnisse gehören zur Stellung (FEN) und
 * bleiben für die Sitzung im Zwischenspeicher; dieselbe Stellung wird nie zweimal gerechnet.
 * Ins Speicherformat (Format 8, Felder w, b, a) schreibt training/variationswerte.ts (mitWerten);
 * geschrieben wird gebündelt (alle zwei Sekunden und am Ende), weil jedes Speichern den ganzen
 * Stand schreibt.
 * Abhängigkeiten: training/variationswerte.ts, spiel/partie.ts (spielbar), spiel/auswertung.ts
 * (endwert), engine/engineDienst.ts, auswertung/useAuswertung.ts, speicher/speicher.ts.
 */
import { endwert } from "../../../spiel/auswertung";
import { spielbar } from "../../../spiel/partie";
import { aendere } from "../../../speicher/speicher";
import { HUNDERTSTEL, mitWerten, type Engineergebnis } from "../../../training/variationswerte";
import { bewerteStellung } from "../auswertung/useAuswertung";

/** So lange sammelt die Warteschlange Ergebnisse, bevor sie sie in den Speicher schreibt. */
export const SPEICHERABSTAND_MS = 2000;

/** Stand der Analyse für die Anzeige. */
export type Analysestand =
  | { readonly art: "ruht" }
  | {
      readonly art: "laeuft";
      readonly id: string;
      readonly erledigt: number;
      readonly gesamt: number;
    }
  | { readonly art: "fehler"; readonly id: string; readonly meldung: string };

/** Was die Warteschlange von außen braucht (für Tests austauschbar). */
export interface Analysedienste {
  /** Ergebnis einer Stellung; null, wenn sie nicht bewertbar ist oder abgebrochen wurde. */
  readonly bewerte: (fen: string, laeuft: () => boolean) => Promise<Engineergebnis | null>;
  /** Schreibt Ergebnisse in die Variante mit dieser Kennung. */
  readonly speichere: (id: string, ergebnisse: ReadonlyMap<string, Engineergebnis>) => void;
}

/** So lange wartet ein neuer Lauf, bis ein abgebrochener seinen letzten Auftrag beendet hat. */
const WARTEN_MS = 50;

/**
 * Die Warteschlange. Eine Variante zur Zeit: Fordert eine andere Variante an, gilt ab dann sie.
 * Beispiel: Petroff-Falle mit 18 Stellungen → `fordere(id, fens)`, Stand „läuft 0 von 18“ …
 * „läuft 17 von 18“, dann „ruht“; die Variante hat in jedem Knoten w, b und a.
 */
export class Analysewarteschlange {
  private readonly bekannt = new Map<string, Engineergebnis | null>();
  private schlange: string[] = [];
  /** Die Stellung, die die Engine gerade rechnet (nicht mehr in der Schlange, noch nicht bekannt). */
  private inArbeit: string | null = null;
  private stand: Analysestand = { art: "ruht" };
  private lauf = 0;
  private aktiv = false;
  private ausstehend = new Map<string, Engineergebnis>();
  private ausstehendFuer = "";
  private zeit: ReturnType<typeof setTimeout> | null = null;
  private readonly beobachter = new Set<() => void>();

  constructor(
    private readonly dienste: Analysedienste,
    private readonly speicherabstandMs = SPEICHERABSTAND_MS,
  ) {}

  /** Der Stand für die Anzeige (gleiches Objekt, solange sich nichts ändert). */
  aktuell(): Analysestand {
    return this.stand;
  }

  /** Alle Ergebnisse der Sitzung (nur bewertbare Stellungen). */
  ergebnisse(): ReadonlyMap<string, Engineergebnis> {
    const liste = [...this.bekannt].flatMap(([fen, e]) => (e ? [[fen, e] as const] : []));
    return new Map(liste);
  }

  /** Wurde die Stellung schon gerechnet (oder als nicht bewertbar erkannt)? */
  kennt(fen: string): boolean {
    return this.bekannt.has(fen);
  }

  /** Meldet jede Änderung von Stand oder Ergebnissen; Ausgabe: Abmelden. */
  beobachte(rueckruf: () => void): () => void {
    this.beobachter.add(rueckruf);
    return () => this.beobachter.delete(rueckruf);
  }

  /**
   * Nimmt Stellungen einer Variante auf. Läuft die Analyse schon für sie, kommen die neuen hinten
   * an (neue Züge während der Analyse); für eine andere Variante beginnt sie neu.
   */
  fordere(id: string, fens: readonly string[]): void {
    const neu = fens.filter((f) => !this.bekannt.has(f));
    const stand = this.stand;
    if (stand.art === "laeuft" && stand.id === id) {
      const dazu = [...new Set(neu)].filter(
        (f) => !this.schlange.includes(f) && f !== this.inArbeit,
      );
      if (dazu.length === 0) return;
      this.schlange.push(...dazu);
      this.setze({ ...stand, gesamt: stand.gesamt + dazu.length });
      return;
    }
    if (neu.length === 0) return;
    this.schreibeAusstehendes();
    this.lauf += 1;
    this.schlange = [...new Set(neu)];
    this.setze({ art: "laeuft", id, erledigt: 0, gesamt: this.schlange.length });
    void this.arbeite(this.lauf, id);
  }

  /**
   * Bricht ab: Es kommt keine weitere Stellung dran, Fertiges bleibt gespeichert. Der laufende
   * Auftrag der Engine endet von selbst (höchstens die Rechenzeit einer Stellung); ein „stop“
   * könnte sonst einen Auftrag der Partieauswertung auf derselben Engine kürzen.
   */
  brichAb(): void {
    if (this.stand.art !== "laeuft") return;
    this.lauf += 1;
    this.schlange = [];
    this.schreibeAusstehendes();
    this.setze({ art: "ruht" });
  }

  private setze(stand: Analysestand): void {
    this.stand = stand;
    for (const b of this.beobachter) b();
  }

  /** Rechnet die Schlange ab; ein neuer Lauf (andere Variante, Abbrechen) beendet diesen. */
  private async arbeite(lauf: number, id: string): Promise<void> {
    // Nur ein Lauf rechnet: Ein älterer, der gerade auf die Engine wartet, endet danach selbst.
    while (this.aktiv) await new Promise((fertig) => setTimeout(fertig, WARTEN_MS));
    this.aktiv = true;
    try {
      await this.schleife(lauf, id);
    } catch (grund: unknown) {
      console.error("Analyse der Variante fehlgeschlagen:", grund);
      const meldung = grund instanceof Error ? grund.message : String(grund);
      if (lauf === this.lauf) this.setze({ art: "fehler", id, meldung });
    } finally {
      this.aktiv = false;
    }
  }

  private async schleife(lauf: number, id: string): Promise<void> {
    const laeuft = () => lauf === this.lauf;
    for (let fen = this.schlange.shift(); fen !== undefined; fen = this.schlange.shift()) {
      if (!laeuft()) return;
      if (!this.bekannt.has(fen)) {
        this.inArbeit = fen;
        const ergebnis = await this.dienste.bewerte(fen, laeuft).finally(() => {
          this.inArbeit = null;
        });
        // Ein Ergebnis bleibt auch nach dem Abbrechen gültig; „nicht bewertbar“ zählt nur, wenn
        // der Lauf noch gilt (sonst stand null für „abgebrochen“).
        if (ergebnis) this.bekannt.set(fen, ergebnis);
        if (!laeuft()) return;
        if (!ergebnis) this.bekannt.set(fen, null);
        if (ergebnis) this.merke(id, fen, ergebnis);
      }
      if (this.stand.art === "laeuft")
        this.setze({ ...this.stand, erledigt: this.stand.erledigt + 1 });
    }
    if (!laeuft()) return;
    this.schreibeAusstehendes();
    this.setze({ art: "ruht" });
  }

  /** Merkt ein Ergebnis zum Schreiben vor; geschrieben wird nach dem Speicherabstand. */
  private merke(id: string, fen: string, ergebnis: Engineergebnis): void {
    this.ausstehend.set(fen, ergebnis);
    this.ausstehendFuer = id;
    if (this.zeit) return;
    this.zeit = setTimeout(() => this.schreibeAusstehendes(), this.speicherabstandMs);
  }

  /** Schreibt, was noch nicht im Speicher steht. */
  private schreibeAusstehendes(): void {
    if (this.zeit) clearTimeout(this.zeit);
    this.zeit = null;
    if (this.ausstehend.size === 0) return;
    const ergebnisse = this.ausstehend;
    this.ausstehend = new Map();
    this.dienste.speichere(this.ausstehendFuer, ergebnisse);
  }
}

/**
 * Hauptvarianten der Engine je Stellung, nur für die Sitzung (nicht im Speicherformat): Daraus
 * legt „Engine-Folgen übernehmen“ nach der Analyse „Besser war“ und „So wird bestraft“ an
 * (Analysefolgen.tsx). Fehlt eine, nimmt die App den gespeicherten besten Zug.
 */
const FOLGEN = new Map<string, readonly string[]>();

/** Die Hauptvariante der Engine (UCI) zu einer Stellung aus dieser Sitzung; leer, wenn keine. */
export function engineFolgeAm(fen: string): readonly string[] {
  return FOLGEN.get(fen) ?? [];
}

/** Ein Ergebnis von bewerteStellung (Bauern) für den Speicher (Hundertstel, ganze Zahlen). */
function alsErgebnis(wert: number, bester: string, abstand: number): Engineergebnis {
  return {
    w: Math.round(wert * HUNDERTSTEL),
    a: Math.round(abstand * HUNDERTSTEL),
    ...(bester ? { b: bester } : {}),
  };
}

/**
 * Bewertet eine Stellung mit der Engine der Auswertung. Stellungen, die Stockfish nicht annimmt
 * (Lehrbild ohne König, unmögliche Stellung), bekommen kein Ergebnis; Endstellungen ihren Wert
 * ohne Engine.
 */
async function bewerteMitEngine(
  fen: string,
  laeuft: () => boolean,
): Promise<Engineergebnis | null> {
  if (endwert(fen) === null && !spielbar(fen)) return null;
  const wert = await bewerteStellung(fen, laeuft);
  if (wert && wert.variante.length > 0) FOLGEN.set(fen, wert.variante);
  return wert ? alsErgebnis(wert.wert, wert.bester, wert.abstand) : null;
}

/** Schreibt Ergebnisse in die gespeicherte Variante; ohne Änderung bleibt der Speicher, wie er war. */
function inDenSpeicher(id: string, ergebnisse: ReadonlyMap<string, Engineergebnis>): void {
  void aendere((daten) => {
    let geaendert = false;
    const variationen = daten.variationen.map((v) => {
      if (v.id !== id) return v;
      const neu = mitWerten(v, ergebnisse);
      geaendert ||= neu !== v;
      return neu;
    });
    return geaendert ? { ...daten, variationen } : daten;
  });
}

/** Die Warteschlange der App. */
export const variantenanalyse = new Analysewarteschlange({
  bewerte: bewerteMitEngine,
  speichere: inDenSpeicher,
});
