/**
 * Die Momente einer Partiebesprechung: über welche Züge Ambrose etwas sagt, je Stufe.
 *
 * Rolle im Gesamtbild: reine Auswahl für anbindung/Besprechung.tsx (Entwurf
 * docs/spiel/auftraege/partiebesprechung_25-11.md, Abschnitt 2). Grundlage sind die Zugklassen der
 * App (spiel/auswertung.ts, zugurteile). Stufe 1 ist knapp: nur die Züge des Helden mit Patzer,
 * Fehler, verpasster Chance, brillantem oder starkem Zug, höchstens vier. Ab Stufe 2 kommen Fehler
 * des Gegners und ungenaue Züge dazu, ab Stufe 3 mehr Momente. Ein Theoriemoment (Ende der
 * bekannten Wege) gibt es auf jeder Stufe, wenn mindestens zwei Züge bekannt waren.
 * Abhängigkeiten: spiel/auswertung.ts (Typen), regeln/besprechung.ts (Typen).
 */
import type { Zugklasse, Zugurteil } from "../../spiel/auswertung";
import type { Besprechungsstufe } from "./besprechung";

/** Worüber Ambrose an einem Moment spricht. */
export type Momentkategorie =
  | "brillant"
  | "stark"
  | "fehler"
  | "patzer"
  | "verpasst"
  | "ungenau"
  | "theorie"
  | "bekannt"
  | "gegnerfehler";

/** Ein Moment der Besprechung: Index des Halbzuges und Kategorie. */
export interface Besprechungsmoment {
  readonly index: number;
  readonly kategorie: Momentkategorie;
}

/** Höchstzahl der Momente je Stufe (Stufe 0 bespricht nichts). */
const HOECHSTENS: Readonly<Record<Besprechungsstufe, number>> = { 0: 0, 1: 4, 2: 6, 3: 8 };

/** Rang: kleinere Zahl zuerst, wenn es mehr Momente gibt als Platz. */
const RANG: Readonly<Record<Momentkategorie, number>> = {
  patzer: 0,
  verpasst: 1,
  fehler: 2,
  brillant: 3,
  stark: 4,
  gegnerfehler: 5,
  theorie: 6,
  bekannt: 6,
  ungenau: 7,
};

/** Lobende Kategorien: Einer davon bekommt immer einen Platz, wenn es ihn gibt. */
const LOB: ReadonlySet<Momentkategorie> = new Set<Momentkategorie>(["brillant", "stark"]);

/** Klassen der Züge des Helden, die eine eigene Kategorie haben (ungenau erst ab Stufe 2). */
const HELDENKLASSEN: Readonly<Partial<Record<Zugklasse, Momentkategorie>>> = {
  brillant: "brillant",
  stark: "stark",
  fehler: "fehler",
  patzer: "patzer",
  verpasst: "verpasst",
  ungenau: "ungenau",
};

/** Ab so vielen Theoriezügen in Folge lohnt der Theoriemoment. */
const THEORIE_AB = 2;

/** Was die Auswahl über die Partie wissen muss. */
export interface Momentgrundlage {
  readonly urteile: readonly Zugurteil[];
  /** Je Halbzug: Hat ihn der Held gespielt? */
  readonly vomHelden: readonly boolean[];
  readonly stufe: Besprechungsstufe;
  /** Kennt der Held das Wort „Theorie“ (regeln/besprechung.ts)? */
  readonly theorieBekannt: boolean;
}

/** Kategorie eines Zuges des Helden, oder null; „ungenau“ erst ab Stufe 2. */
function heldenkategorie(u: Zugurteil, stufe: Besprechungsstufe): Momentkategorie | null {
  const kategorie = HELDENKLASSEN[u.klasse] ?? null;
  if (kategorie === "ungenau" && stufe < 2) return null;
  return kategorie;
}

/**
 * Fehler des Gegners ab Stufe 2, aber nicht, wenn der Held die Chance gleich danach verpasst hat
 * (dann spricht Ambrose am verpassten Zug darüber).
 */
function gegnerkategorie(g: Momentgrundlage, u: Zugurteil): Momentkategorie | null {
  if (g.stufe < 2 || (u.klasse !== "fehler" && u.klasse !== "patzer")) return null;
  const antwort = g.urteile[u.index + 1];
  return antwort?.klasse === "verpasst" ? null : "gegnerfehler";
}

/** Der letzte Theoriezug, wenn es mindestens zwei gab. */
function theoriemoment(g: Momentgrundlage): Besprechungsmoment | null {
  const buch = g.urteile.filter((u) => u.klasse === "buch");
  const letzter = buch.at(-1);
  if (!letzter || buch.length < THEORIE_AB) return null;
  return { index: letzter.index, kategorie: g.theorieBekannt ? "theorie" : "bekannt" };
}

/** Alle Kandidaten der Partie in Zugfolge. */
function kandidaten(g: Momentgrundlage): Besprechungsmoment[] {
  const liste: Besprechungsmoment[] = [];
  for (const u of g.urteile) {
    const kategorie = g.vomHelden[u.index] ? heldenkategorie(u, g.stufe) : gegnerkategorie(g, u);
    if (kategorie) liste.push({ index: u.index, kategorie });
  }
  const theorie = theoriemoment(g);
  return theorie ? [theorie, ...liste] : liste;
}

/**
 * Die Momente der Besprechung in Zugfolge.
 *
 * Eingaben: Urteile aller Züge, wer gezogen hat, Stufe, ob „Theorie“ bekannt ist. Ausgabe: höchstens
 * so viele Momente, wie die Stufe erlaubt; bei mehr Kandidaten die wichtigsten (Patzer zuerst), dabei
 * immer ein lobender Moment, wenn es einen gibt (Kinder sollen auch hören, was gut war).
 * Beispiel: Stufe 1, Held mit 2. Dh5?? und 5. Lxf7!! → [Patzer bei 2, brillant bei 8].
 * Sonderfall: Stufe 0 oder keine Urteile → leer.
 */
export function besprechungsmomente(g: Momentgrundlage): Besprechungsmoment[] {
  const hoechstens = HOECHSTENS[g.stufe];
  const alle = kandidaten(g);
  const geordnet = [...alle].sort(
    (a, b) => RANG[a.kategorie] - RANG[b.kategorie] || a.index - b.index,
  );
  let gewaehlt = geordnet.slice(0, hoechstens);
  const lob = geordnet.find((m) => LOB.has(m.kategorie));
  if (lob && hoechstens > 0 && !gewaehlt.includes(lob)) {
    gewaehlt = [...gewaehlt.slice(0, hoechstens - 1), lob];
  }
  return gewaehlt.sort((a, b) => a.index - b.index);
}

/**
 * Der nächste Moment ab einer Stelle (Halbzüge gezeigt) in einer Richtung, für „vorige / nächste
 * Stelle“. Ein Moment am Zug i liegt an der Stelle i + 1 (Stellung nach dem Zug).
 * Beispiel: Momente an den Zügen 3 und 9 (Stellen 4 und 10): Stelle 4, vor → 10; Stelle 4,
 * zurück → null; Stelle 7, zurück → 4. Sonderfall: kein Moment in der Richtung → null.
 */
export function naechsteMomentstelle(
  momente: readonly Besprechungsmoment[],
  stelle: number,
  richtung: "vor" | "zurueck",
): number | null {
  const stellen = momente.map((m) => m.index + 1);
  if (richtung === "vor") return stellen.find((s) => s > stelle) ?? null;
  return [...stellen].reverse().find((s) => s < stelle) ?? null;
}
