/**
 * Varianten (Variationsbrowser): eigene Zugbäume mit Kommentaren, gespeichert als eigene Einträge.
 *
 * Rolle im Gesamtbild: Wunsch des Autors „Variationsbrowser“, Entwurf vom 1.11.2026 (Fragen a bis
 * i, überall die Empfehlung gewählt). Eine Variante ist eine Kopie: Buch, Partie, Fehler und
 * Lernsammlung bleiben unverändert (Regel 1). Die Einträge liegen in den Nutzerdaten (Feld
 * „variationen“ ab Format 8, speicher/format.ts) und ziehen mit der Datensicherung um. Diese Datei
 * hält die Typen, die Grenzen und das Ändern der Liste; das Lesen aus Rohdaten steht in
 * variationenLesen.ts, die Arbeit am Baum in schach/variationsbaum.ts. Reine Funktionen.
 * Das Format trägt schon die Felder der Stufen 2 und 3 (Markierungen, Legende, Engine-Werte),
 * damit eine spätere Stufe kein neues Format braucht und Stufe 1 sie beim Lesen nicht verliert.
 * Abhängigkeiten: analyse/werkzeug.ts (Markierungsfarbe), schach/variationsbaum.ts (Zählen).
 * Buchbezug: Kapitel 0, „Wie liest man Schachzüge?“ (Hauptvariante, Nebenvariante, Zugzeichen).
 */
import type { Markierungsfarbe } from "../analyse/werkzeug";
import { knotenzahl } from "../schach/variationsbaum";

/** Die Zugzeichen des Buches (Kapitel 0); dieselben sechs kennt PGN als $1 bis $6. */
export const ZUGZEICHEN = ["!", "?", "!!", "??", "!?", "?!"] as const;
export type Zugzeichen = (typeof ZUGZEICHEN)[number];

/** Woher ein Zug stammt, wenn ihn nicht der Leser selbst gezogen hat. */
export const ZUGHERKUENFTE = ["buch", "partie", "engine"] as const;
export type Zugherkunft = (typeof ZUGHERKUENFTE)[number];

/** Woher eine Variante stammt; die Quelle selbst bleibt unverändert. */
export type Variationsquelle =
  | { readonly art: "grund" | "fen" | "pgn" | "stellung" }
  | { readonly art: "abbildung"; readonly nummer: string }
  | { readonly art: "partie" | "fehler" | "sammlung"; readonly id: string };

/** Was zu einer Stellung gehört (Wurzel und jeder Zug). Stufe 1 nutzt nur den Kommentar. */
export interface Knotendaten {
  /** Kommentar zur Stellung nach diesem Zug, höchstens ZUGKOMMENTAR_HOECHSTENS Zeichen. */
  readonly kommentar?: string;
  /** Stufe 2: Pfeile und Felder kompakt wie Lichess („Ge2e4“ Pfeil, „Re8“ Feld). */
  readonly marken?: readonly string[];
  /** Stufe 2: Texte je Nummer und Farbe („R2“ → „dann fällt die Dame“). */
  readonly nummerntexte?: Readonly<Record<string, string>>;
  /** Stufe 3: Engine-Wert aus Sicht von Weiß in Hundertstel. */
  readonly w?: number;
  /** Stufe 3: bester Zug der Engine (UCI). */
  readonly b?: string;
  /** Stufe 3: Abstand zum zweitbesten Zug in Hundertstel. */
  readonly a?: number;
}

/** Ein Zug im Baum; die erste Fortsetzung ist die Hauptvariante. */
export interface Variationsknoten extends Knotendaten {
  /** Zug in englischer Kurznotation, wie in den Buchdaten („Nf3“). */
  readonly zug: string;
  readonly zeichen?: Zugzeichen;
  /**
   * Buch-, Partie- oder Engine-Zug („Besser war …“, „So wird bestraft“ aus der Auswertung); fehlt
   * bei eigenen Zügen (die Leiste zeigt sie in Gold).
   */
  readonly herkunft?: Zugherkunft;
  readonly weiter: readonly Variationsknoten[];
}

/** Eine gespeicherte Variante (ab Format 8). */
export interface Variation {
  /** „var-<Zeit>-<Zufall>“. */
  readonly id: string;
  readonly titel: string;
  /** ISO 8601. */
  readonly angelegt: string;
  /** ISO 8601, für die Reihenfolge der Liste (zuletzt geändert zuerst). */
  readonly geaendert: string;
  readonly quelle: Variationsquelle;
  /** Wurzel des Baums. */
  readonly startFen: string;
  /**
   * Wo die Variante öffnet (Züge ab startFen). Ergänzung zum Entwurf: Eine Abbildung bringt den
   * ganzen Buchbaum mit, geöffnet wird an der Abbildung; eine Partie an der gewählten Stelle.
   */
  readonly startpfad: readonly string[];
  /** Kommentar und Marken der Startstellung. */
  readonly start: Knotendaten;
  readonly zuege: readonly Variationsknoten[];
  /** Kommentar zur ganzen Variante. */
  readonly kommentar: string;
  /** Stufe 2: Text je Farbe („Rot = Falle“). */
  readonly legende: Readonly<Partial<Record<Markierungsfarbe, string>>>;
  /** Stufe 3: Analyse gewünscht. */
  readonly analysiert: boolean;
}

/** Höchstens so viele Varianten; an der Grenze meldet die App es, statt Älteres zu löschen. */
export const HOECHSTENS_VARIATIONEN = 200;
/** Höchstens so viele Halbzüge (Knoten) je Variante. */
export const HOECHSTENS_KNOTEN = 600;
/** Höchstens so viele Fortsetzungen je Stellung. */
export const HOECHSTENS_FORTSETZUNGEN = 30;
/** Höchstens so viele Knoten in allen Varianten zusammen. */
export const HOECHSTENS_KNOTEN_GESAMT = 40_000;
export const TITEL_HOECHSTENS = 80;
export const KOMMENTAR_HOECHSTENS = 2000;
export const ZUGKOMMENTAR_HOECHSTENS = 500;
/** Stufe 2: Länge eines Legendentextes und Zahl der Marken je Stellung. */
export const LEGENDE_HOECHSTENS = 60;
export const MARKEN_HOECHSTENS = 24;

/** Welche Grenze erreicht ist; die Oberfläche sagt es dem Leser (nie stilles Löschen). */
export type Grenze = "varianten" | "knoten" | "fortsetzungen" | "gesamt";

/** Ziffern des Zufallsteils einer Kennung (Basis 36). */
const ZUFALL_BASIS = 36;
const ZUFALL_ANFANG = 2;
const ZUFALL_ENDE = 8;

/** Eine neue Kennung, etwa „var-1761990000000-k3j9x2“. */
export function neueVariationskennung(jetzt: Date, zufall: () => number = Math.random): string {
  const teil = zufall().toString(ZUFALL_BASIS).slice(ZUFALL_ANFANG, ZUFALL_ENDE);
  return `var-${jetzt.getTime()}-${teil}`;
}

/** Alle Knoten aller Varianten (für die Grenze HOECHSTENS_KNOTEN_GESAMT). */
export function knotenInsgesamt(liste: readonly Variation[]): number {
  return liste.reduce((summe, v) => summe + knotenzahl(v.zuege), 0);
}

/**
 * Prüft, ob eine geänderte oder neue Variante in die Liste passt.
 *
 * Warum: An einer Grenze sagt die App es dem Leser, statt still Älteres zu löschen (Entwurf,
 * Abschnitt 5: hier steckt eigene Arbeit drin, anders als in der Lernsammlung).
 * Ausgabe: null, wenn sie passt, sonst die erreichte Grenze.
 * Beispiel: 200 Varianten gespeichert, eine neue → „varianten“; eine mit 601 Zügen → „knoten“.
 */
export function grenzeFuer(liste: readonly Variation[], variation: Variation): Grenze | null {
  const andere = liste.filter((v) => v.id !== variation.id);
  if (andere.length === liste.length && liste.length >= HOECHSTENS_VARIATIONEN) return "varianten";
  const eigene = knotenzahl(variation.zuege);
  if (eigene > HOECHSTENS_KNOTEN) return "knoten";
  if (knotenInsgesamt(andere) + eigene > HOECHSTENS_KNOTEN_GESAMT) return "gesamt";
  return null;
}

/**
 * Speichert eine Variante in der Liste: ersetzt sie an ihrem Platz oder hängt sie an.
 * Ausgabe: neue Liste, oder die Grenze, an der sie nicht mehr passt (die Liste bleibt dann gleich).
 */
export function mitVariation(
  liste: readonly Variation[],
  variation: Variation,
): { readonly liste: readonly Variation[] } | { readonly grenze: Grenze } {
  const grenze = grenzeFuer(liste, variation);
  if (grenze) return { grenze };
  const vorhanden = liste.some((v) => v.id === variation.id);
  return {
    liste: vorhanden
      ? liste.map((v) => (v.id === variation.id ? variation : v))
      : [...liste, variation],
  };
}

/** Entfernt eine Variante (nach der Rückfrage des Lesers). */
export function ohneVariation(liste: readonly Variation[], id: string): Variation[] {
  return liste.filter((v) => v.id !== id);
}

/** Die Liste für die Anzeige: zuletzt geänderte zuerst. */
export function nachAenderung(liste: readonly Variation[]): Variation[] {
  return [...liste].sort((a, b) => b.geaendert.localeCompare(a.geaendert));
}

/** Gehört die Variante zu dieser Quelle (gleiche Art und gleiche Abbildung oder Kennung)? */
export function gleicheQuelle(a: Variationsquelle, b: Variationsquelle): boolean {
  if (a.art !== b.art) return false;
  if ("nummer" in a && "nummer" in b) return a.nummer === b.nummer;
  if ("id" in a && "id" in b) return a.id === b.id;
  return !("nummer" in a) && !("id" in a);
}

/**
 * Die Varianten zu einer Quelle, für den Hinweis „2 eigene Varianten“ an Abbildung und Partie.
 * Beispiel: zwei Varianten aus Abb. 2.40 und eine aus einer Partie → für Abb. 2.40 zwei.
 */
export function variationenZu(
  liste: readonly Variation[],
  quelle: Variationsquelle,
): readonly Variation[] {
  return liste.filter((v) => gleicheQuelle(v.quelle, quelle));
}
