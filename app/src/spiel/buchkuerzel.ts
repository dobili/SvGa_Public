/**
 * Die Kürzel „Fehler mit Buchbezug“ einer ausgewerteten Partie (W1 bis W10, F1 bis F10 je Zug
 * des Lesers), einmal gerechnet und mit der Partie gespeichert.
 *
 * Rolle im Gesamtbild: Konzept docs/KONZEPT_FEHLER_BUCHBEZUG.md, Abschnitt 4.2 (vom Autor
 * freigegeben). Die Startseite schaut über zehn Partien („Muster aus deinen Partien“,
 * training/musterausPartien.ts); bei jedem Start alles neu zu rechnen, kostete am Handy mehrere
 * Sekunden. Deshalb rechnet die App die Kürzel einmal nach der Auswertung (oder für ältere
 * Partien im Leerlauf nach, ui/komponenten/auswertung/useBuchkuerzelNachtrag.ts) und legt sie
 * zur Partie. Steigt BUCHBEZUG_REGELN, weil sich eine Regel oder Schwelle geändert hat, gelten
 * die alten Kürzel als veraltet und werden neu gerechnet. Alles lässt sich aus den gespeicherten
 * Werten wieder rechnen; der Zusatz ist also jederzeit verzichtbar.
 * Gespeichert werden nur Züge des Lesers mit ungenau, Fehler, Patzer oder Verpasst und
 * mindestens einem Kürzel, höchstens zwei Kürzel je Zug (wie die Karte: Warum, Finden).
 * Abhängigkeiten: spiel/buchzuege.ts, spiel/auswertung.ts (Typen), spiel/buchbezug.ts.
 */
import type { Zugklasse, Zugurteil } from "./auswertung";
import { BUCHBEZUG, type Buchkennung } from "./buchbezug";
import {
  buchbefundeFuer,
  FINDE_KLASSEN,
  WARUM_STATISTIK,
  type Auswertungsdaten,
  type Buchkontextdaten,
} from "./buchzuege";

/**
 * Version der Regeln und Schwellen. Jede Änderung an Erkennung, Schwellen oder Auswahl erhöht sie;
 * gespeicherte Kürzel einer älteren Version werden nachgerechnet.
 * 1: erste Fassung (7.11.2026, Schwellen nach dem Messlauf, docs/MESSUNG_BUCHBEZUG.md).
 */
export const BUCHBEZUG_REGELN = 1;

/** Die Kürzel eines Halbzuges. */
export interface Buchkuerzelzug {
  /** Index des Halbzuges in der Partie. */
  readonly index: number;
  readonly klasse: Zugklasse;
  /** Warum vor Finden, höchstens zwei. */
  readonly kuerzel: readonly Buchkennung[];
}

/** Die Kürzel einer Partie mit der Version der Regeln. */
export interface Buchkuerzelstand {
  readonly regeln: number;
  readonly zuege: readonly Buchkuerzelzug[];
}

/** Alle Kennungen, für das Lesen gespeicherter Daten. */
const KENNUNGEN: ReadonlySet<string> = new Set(Object.keys(BUCHBEZUG));

/** Ist der Text eine bekannte Kennung? Beispiel: „W3“ → ja, „W11“ → nein. */
export function istBuchkennung(text: unknown): text is Buchkennung {
  return typeof text === "string" && KENNUNGEN.has(text);
}

/**
 * Rechnet die Kürzel einer Partie.
 *
 * Eingaben: Auswertungsdaten, Urteile je Halbzug (spiel/auswertung.ts, zugurteile), Buchkontext
 * (Fallen, Buchvarianten; fehlt einer, schweigen W1 bzw. F8).
 * Ausgabe: Stand mit der aktuellen Regelversion; nur Züge des Lesers mit Kürzel.
 * Beispiel: Opernpartie gegen Derya → { regeln: 1, zuege: [{ index: 22, klasse: „patzer“,
 * kuerzel: [„W3“] }, …] }.
 * Sonderfall: Gegen einen Menschen am selben Gerät zählen die Züge beider Seiten (beide „leser“).
 */
export function buchkuerzelDerPartie(
  d: Auswertungsdaten,
  urteile: readonly Zugurteil[],
  kontext: Buchkontextdaten = {},
): Buchkuerzelstand {
  const zuege = urteile.flatMap((urteil) => buchkuerzelDesZuges(d, urteil, kontext) ?? []);
  return { regeln: BUCHBEZUG_REGELN, zuege };
}

/**
 * Die Kürzel eines Halbzuges, oder null (Zug der Engine, Klasse ohne Kürzel, keine Kategorie).
 * Einzeln, damit das Nachrechnen im Leerlauf zwischen zwei Zügen dem Bildschirm Luft lässt.
 */
export function buchkuerzelDesZuges(
  d: Auswertungsdaten,
  urteil: Zugurteil,
  kontext: Buchkontextdaten = {},
): Buchkuerzelzug | null {
  if (d.partie.zuege[urteil.index]?.von !== "leser") return null;
  if (!FINDE_KLASSEN.has(urteil.klasse)) return null;
  const { warum, finde } = buchbefundeFuer(d, urteil, WARUM_STATISTIK, kontext);
  const kuerzel = [warum?.kennung, finde?.kennung].filter(istBuchkennung);
  return kuerzel.length > 0 ? { index: urteil.index, klasse: urteil.klasse, kuerzel } : null;
}

/** Sind die Kürzel da und nach den aktuellen Regeln gerechnet? */
export function kuerzelAktuell(stand: Buchkuerzelstand | undefined): boolean {
  return stand !== undefined && stand.regeln === BUCHBEZUG_REGELN;
}

type Roh = Readonly<Record<string, unknown>>;

function istObjekt(wert: unknown): wert is Roh {
  return typeof wert === "object" && wert !== null && !Array.isArray(wert);
}

/** Eine gespeicherte Klasse, wenn sie zu den Klassen mit Kürzeln gehört. */
function klasseAus(wert: unknown): Zugklasse | null {
  return [...FINDE_KLASSEN].find((k) => k === wert) ?? null;
}

/** Ein gespeicherter Zug aus Rohdaten; null, wenn ein Feld nicht passt. */
function kuerzelzugAus(roh: unknown): Buchkuerzelzug | null {
  if (!istObjekt(roh)) return null;
  const { index, kuerzel } = roh;
  const klasse = klasseAus(roh.klasse);
  if (typeof index !== "number" || !Number.isInteger(index) || index < 0) return null;
  if (!klasse || !Array.isArray(kuerzel)) return null;
  const gueltig = kuerzel.filter(istBuchkennung);
  return gueltig.length > 0 ? { index, klasse, kuerzel: gueltig } : null;
}

/**
 * Liest gespeicherte Kürzel (Format 10, speicher/partienLesen.ts); was nicht passt, fällt weg.
 * Beispiel: { regeln: 1, zuege: [{ index: 22, klasse: "patzer", kuerzel: ["W3"] }] } → derselbe
 * Stand; ohne Feld oder kaputt → undefined (die App rechnet bei Bedarf nach).
 */
export function buchkuerzelAus(roh: unknown): Buchkuerzelstand | undefined {
  if (!istObjekt(roh)) return undefined;
  const { regeln, zuege } = roh;
  if (typeof regeln !== "number" || !Number.isInteger(regeln) || !Array.isArray(zuege))
    return undefined;
  return { regeln, zuege: zuege.flatMap((z) => kuerzelzugAus(z) ?? []) };
}
