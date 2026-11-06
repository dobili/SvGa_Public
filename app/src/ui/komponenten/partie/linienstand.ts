/**
 * Stand der Zugnavigation im Rückblick: Partie oder eine Engine-Folge („Besserer Zug“,
 * „Bestrafung“) an der gezeigten Fehlerstelle, und was die Zugknöpfe und Pfeiltasten daraus machen.
 *
 * Rolle im Gesamtbild: Fehlermeldung des Autors (6.11.2026): Wer in der Auswertung eine
 * Engine-Folge abspielte, sah oben keine Verzweigung, kam mit den Pfeilen nicht zurück, und das
 * Brett sprang mehrere Züge, weil die Zugknöpfe nur die Stelle in der Partie kannten und den
 * Zweig stillschweigend fallen ließen. Jetzt gehen die Knöpfe wie im Variantenmodus
 * (useVariante.ts) Schritt für Schritt durch die gewählte Linie; links am Abzweig geht es zurück
 * in die Partie. Reine Funktionen; den Zustand hält useLinie.ts, die Züge der Zweige
 * ui/komponenten/rueckblick/useRueckblick.tsx.
 * Abhängigkeiten: spiel/nebenzweig.ts, spiel/auswertung.ts, brettbedienung/Zugknoepfe.tsx (Typen).
 */
import type { Zugklasse } from "../../../spiel/auswertung";
import type { Zweigart, Zweigzug } from "../../../spiel/nebenzweig";
import type { Zugrichtung } from "../brettbedienung/Zugknoepfe";

/** Der gezeigte Zug eines Zweigs: welcher Zweig und wie weit (1 = nach seinem ersten Zug). */
export interface Zweigschritt {
  readonly art: Zweigart;
  readonly schritt: number;
}

/**
 * Was Brett und Zugliste zeigen: die Stelle in der Partie (Zahl der Halbzüge) und, falls gewählt,
 * den Zug eines Zweigs. Die Zweige gehören zum Zug, der zur Stelle führt (Index Stelle − 1).
 */
export interface Linienstand {
  readonly stelle: number;
  readonly zweig: Zweigschritt | null;
}

/** Länge beider Zweige am gezeigten Zug; 0 heißt: Diesen Zweig gibt es hier nicht. */
export type Zweiglaengen = Readonly<Record<Zweigart, number>>;

/** Keine Zweige (während der Partie oder an einem Zug ohne Engine-Folge). */
export const OHNE_ZWEIGE: Zweiglaengen = { besser: 0, strafe: 0 };

/**
 * Die Stelle in der Partie, an der ein Zweig abzweigt.
 *
 * Warum: „Besser war …“ ersetzt den gespielten Zug, beginnt also in der Stellung davor; die
 * Bestrafung antwortet auf ihn, beginnt also in der Stellung danach.
 * Beispiel: Stelle 4 nach 2. g4?? (1. f3 e5 2. g4): „besser“ zweigt an Stelle 3 ab (vor 2. g4),
 * „strafe“ an Stelle 4 (2... Dh4#).
 */
export function abzweigstelle(stelle: number, art: Zweigart): number {
  return art === "besser" ? stelle - 1 : stelle;
}

/** Ein Schritt in der Partie ohne Zweig, begrenzt auf Anfang und Ende. */
function partieschritt(stelle: number, richtung: Zugrichtung, anzahl: number): number {
  if (richtung === "anfang") return 0;
  if (richtung === "ende") return anzahl;
  const ziel = stelle + (richtung === "vor" ? 1 : -1);
  return Math.max(0, Math.min(anzahl, ziel));
}

/**
 * Der Stand nach einem Zugknopf oder einer Pfeiltaste.
 *
 * Eingaben: Stand, Richtung, Längen der Zweige am gezeigten Zug, Zahl der Halbzüge der Partie.
 * Ausgabe: der neue Stand. Im Zweig geht „Vor“ bis zu seinem letzten Zug und „Zurück“ bis zum
 * ersten; ein weiteres „Zurück“ führt an den Abzweig in der Partie (wie im Variantenmodus),
 * „Zum Anfang“ an den Anfang der Partie, „Zum Ende“ an das Ende des Zweigs.
 * Beispiel: Stelle 4 nach 2. g4??, Zweig „besser“ Schritt 1 (2. e4): „Zurück“ → Stelle 3 ohne
 * Zweig (vor 2. g4), dieselbe Stellung wie vor dem ersten Zug des Zweigs.
 * Sonderfall: Ein Zweig, den es am Zug nicht (mehr) gibt, gilt als Partie.
 */
export function linienschritt(
  stand: Linienstand,
  richtung: Zugrichtung,
  laengen: Zweiglaengen,
  anzahl: number,
): Linienstand {
  const zweig = stand.zweig;
  const laenge = zweig ? laengen[zweig.art] : 0;
  if (!zweig || laenge === 0 || richtung === "anfang") {
    return { stelle: partieschritt(stand.stelle, richtung, anzahl), zweig: null };
  }
  if (richtung === "ende") return { stelle: stand.stelle, zweig: { ...zweig, schritt: laenge } };
  if (richtung === "vor") {
    return {
      stelle: stand.stelle,
      zweig: { ...zweig, schritt: Math.min(laenge, zweig.schritt + 1) },
    };
  }
  if (zweig.schritt > 1)
    return { stelle: stand.stelle, zweig: { ...zweig, schritt: zweig.schritt - 1 } };
  return { stelle: abzweigstelle(stand.stelle, zweig.art), zweig: null };
}

/**
 * Welche Zugknöpfe gesperrt sind: die, die nichts ändern würden.
 * Beispiel: am letzten Zug der Bestrafung sind „Vor“ und „Zum Ende“ gesperrt, „Zurück“ nicht.
 */
export function liniensperren(
  stand: Linienstand,
  laengen: Zweiglaengen,
  anzahl: number,
): Readonly<Record<Zugrichtung, boolean>> {
  const gleich = (richtung: Zugrichtung) => {
    const neu = linienschritt(stand, richtung, laengen, anzahl);
    return (
      neu.stelle === stand.stelle &&
      neu.zweig?.art === stand.zweig?.art &&
      neu.zweig?.schritt === stand.zweig?.schritt
    );
  };
  return {
    anfang: gleich("anfang"),
    zurueck: gleich("zurueck"),
    vor: gleich("vor"),
    ende: gleich("ende"),
  };
}

/**
 * Wahl einer Linie an der gezeigten Stelle: null = Partie (der gespielte Zug), sonst der erste Zug
 * des Zweigs. Ein Zweig ohne Züge lässt den Stand, wie er ist.
 * Beispiel: Stelle 4, „strafe“ mit einem Zug → Zweig „strafe“, Schritt 1 (2... Dh4#).
 */
export function waehleLinie(
  stand: Linienstand,
  art: Zweigart | null,
  laengen: Zweiglaengen,
): Linienstand {
  if (art === null) return { stelle: stand.stelle, zweig: null };
  if (laengen[art] === 0) return stand;
  return { stelle: stand.stelle, zweig: { art, schritt: 1 } };
}

/**
 * Tasten der Zugnavigation: Pfeil links und rechts, ein Halbzug zurück und vor. Pos1 und Ende
 * bleiben beim Blättern der Seite (sonst sprängen sie beim Lesen der Auswertung das Brett um).
 */
const TASTEN: Readonly<Record<string, Zugrichtung>> = {
  ArrowLeft: "zurueck",
  ArrowRight: "vor",
};

/** Die Richtung zu einer Taste, sonst null. Beispiel: „ArrowLeft“ → „zurueck“. */
export function richtungZurTaste(taste: string): Zugrichtung | null {
  return TASTEN[taste] ?? null;
}

/** Nach diesen Zügen stehen die Zweige auch dann in der Zugliste, wenn keiner gewählt ist. */
const FEHLERKLASSEN: ReadonlySet<Zugklasse> = new Set<Zugklasse>([
  "ungenau",
  "fehler",
  "verpasst",
  "patzer",
]);

/** Was die Zugliste über die Zweige am gezeigten Zug wissen muss. */
export interface Partiezweige {
  /** Züge beider Zweige; leer, wo es den Zweig nicht gibt. */
  readonly linien: Readonly<Record<Zweigart, readonly Zweigzug[]>>;
  /** Der gezeigte Zug eines Zweigs, null in der Partie. */
  readonly zweig: Zweigschritt | null;
  /** Klasse des gezeigten Zuges der Partie (für die Regel oben), null ohne Auswertung. */
  readonly klasse: Zugklasse | null;
  /** Zeigt einen Zug eines Zweigs am Brett. */
  readonly beiZug: (art: Zweigart, schritt: number) => void;
}

/**
 * Ob die Zweige in der Zugliste stehen: im Zweig immer, sonst nach einem Zug mit Fehlerzeichen
 * (?!, ?, ??), damit die Zeile beim Durchgehen guter Züge nicht ständig länger und kürzer wird.
 * Beispiel: 2. g4?? mit „besser“ und „strafe“ → ja; 1. e4 (bester Zug) ohne Zweige → nein.
 */
export function zweigeSichtbar(z: Partiezweige): boolean {
  const vorhanden = z.linien.besser.length > 0 || z.linien.strafe.length > 0;
  if (!vorhanden) return false;
  return z.zweig !== null || (z.klasse !== null && FEHLERKLASSEN.has(z.klasse));
}
