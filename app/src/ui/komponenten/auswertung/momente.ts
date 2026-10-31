/**
 * Momente der Partie für die Zeitleiste der Auswertung (Entwurf F2, Wahl des Autors 31.10.2026).
 *
 * Rolle im Gesamtbild: Statt eigener Listen („Erste klare Abweichung“, „Fehler und Patzer“,
 * „Absichtliche Fehler der Engine“) stehen die wichtigen Züge als markierte Momente in einer
 * Zeitleiste (Zeitleiste.tsx). Diese Datei rechnet nur, welche Momente es gibt; Texte und Bretter
 * stehen in momentdarstellung.ts. Wunsch des Autors: weitere Momente sollen dazukommen, ohne
 * umzubauen. Deshalb sammelt jede Momentart ihre Momente selbst; eine neue Art ist ein Eintrag in
 * MOMENTQUELLEN und einer in MOMENTDARSTELLUNG.
 * Regeln: Die erste klare Abweichung ist der erste Zug des Lesers mit „?“ oder „??“
 * (spiel/auswertung.ts, ersteAbweichung; Konzept 8.3); Fehler sind die Klassen „Fehler“,
 * „Verpasst“ und „Patzer“ (wie bisher in der Liste „Fehler und Patzer“, R55).
 * Abhängigkeiten: spiel/auswertung.ts, spiel/partie.ts (nur Typen und Stellungen).
 */
import type { Color } from "chessops/types";
import {
  enginefehler,
  ersteAbweichung,
  type Zugklasse,
  type Zugurteil,
} from "../../../spiel/auswertung";
import { stellungen, type Partie } from "../../../spiel/partie";

/** Die Arten der Momente; die Reihenfolge entscheidet bei gleichem Zug, was zuerst steht. */
export type Momentart = "theorie" | "abweichung" | "fehler" | "engine" | "ende";

/** Ein Moment: ein Zug der Partie, der in der Zeitleiste eine eigene Karte bekommt. */
export interface Moment {
  readonly art: Momentart;
  /** Index des Halbzuges in der Partie (0 = erster Zug). */
  readonly index: number;
  /** Klasse des Zuges für die Marke (Fehler, Abweichung), sonst null. */
  readonly klasse: Zugklasse | null;
  /** Eine Zahl zum Moment, etwa die Zahl der Theoriezüge; sonst 0. */
  readonly zahl: number;
}

/** Was die Quellen brauchen: Partie, Urteile beider Seiten, gewählte Seite. */
export interface Momentkontext {
  readonly partie: Partie;
  readonly urteile: readonly Zugurteil[];
  readonly seite: Color;
}

/** Eine Momentart mit ihrer Rechnung. */
export interface Momentquelle {
  readonly art: Momentart;
  readonly sammle: (k: Momentkontext) => readonly Moment[];
}

/** Klassen, die als Fehler-Moment erscheinen (wie die frühere Liste „Fehler und Patzer“). */
export const FEHLERKLASSEN: ReadonlySet<Zugklasse> = new Set<Zugklasse>([
  "fehler",
  "verpasst",
  "patzer",
]);

/** Die Seite, die den Halbzug an dieser Stelle gemacht hat. */
export function seiteAn(partie: Partie, index: number): Color {
  return stellungen(partie)[index]?.split(" ")[1] === "b" ? "black" : "white";
}

/** Spielt die gewählte Seite in dieser Partie der Leser? Gegen die Engine nur seine Farbe. */
function istLeserseite(k: Momentkontext): boolean {
  return k.partie.einstellung.gegner !== "engine" || k.seite === k.partie.einstellung.eigeneFarbe;
}

/** Die Urteile der gewählten Seite. */
function urteileDerSeite(k: Momentkontext): readonly Zugurteil[] {
  return k.urteile.filter((u) => seiteAn(k.partie, u.index) === k.seite);
}

/** Die erste klare Abweichung, nur für die Seite des Lesers (spiel/auswertung.ts). */
function abweichung(k: Momentkontext): Zugurteil | null {
  return istLeserseite(k) ? ersteAbweichung(k.partie, urteileDerSeite(k)) : null;
}

/**
 * Ende der Theorie: der letzte Theoriezug der Partie, mit der Zahl der Theoriezüge der Seite.
 * Beispiel: Italienisch, vier Theoriezüge je Seite → Moment bei 4... Lc5, Zahl 4.
 */
function theorie(k: Momentkontext): readonly Moment[] {
  const buch = k.urteile.filter((u) => u.klasse === "buch");
  const letzter = buch[buch.length - 1];
  if (!letzter) return [];
  const eigene = buch.filter((u) => seiteAn(k.partie, u.index) === k.seite).length;
  return [{ art: "theorie", index: letzter.index, klasse: "buch", zahl: eigene }];
}

/** Fehler, verpasste Gewinne und Patzer der Seite; die erste Abweichung steht schon als eigene. */
function fehler(k: Momentkontext): readonly Moment[] {
  const erste = abweichung(k)?.index ?? null;
  return urteileDerSeite(k)
    .filter((u) => FEHLERKLASSEN.has(u.klasse) && u.index !== erste)
    .map((u) => ({ art: "fehler", index: u.index, klasse: u.klasse, zahl: 0 }));
}

/** Die absichtlichen Fehler der Engine (Protokoll der Partie), gleich welche Seite gewählt ist. */
function engine(k: Momentkontext): readonly Moment[] {
  return enginefehler(k.partie).map((f) => ({
    art: "engine",
    index: f.index,
    klasse: null,
    zahl: 0,
  }));
}

/** Der letzte Zug der Partie, wenn sie beendet ist. */
function ende(k: Momentkontext): readonly Moment[] {
  const letzter = k.partie.zuege.length - 1;
  if (!k.partie.ende || letzter < 0) return [];
  return [{ art: "ende", index: letzter, klasse: null, zahl: 0 }];
}

/**
 * Alle Momentarten. Eine neue Art: hier eintragen (mit Rechnung) und in MOMENTDARSTELLUNG
 * (momentdarstellung.ts) mit Titel, Text und Brett.
 */
export const MOMENTQUELLEN: readonly Momentquelle[] = [
  { art: "theorie", sammle: theorie },
  {
    art: "abweichung",
    sammle: (k) => {
      const u = abweichung(k);
      return u ? [{ art: "abweichung", index: u.index, klasse: u.klasse, zahl: 0 }] : [];
    },
  },
  { art: "fehler", sammle: fehler },
  { art: "engine", sammle: engine },
  { art: "ende", sammle: ende },
];

/**
 * Die Momente der Partie für die gewählte Seite, nach Zügen geordnet; bei gleichem Zug in der
 * Reihenfolge von MOMENTQUELLEN.
 * Beispiel: 1. f3 e5 2. g4?? Dh4# (Leser Weiß) → Abweichung bei 2. g4??, Ende bei 2... Dh4#.
 * Sonderfall: Gibt es keine Abweichung, meldet `gutGespielt` das (Karte „Gut gespielt!“).
 */
export function momente(k: Momentkontext): readonly Moment[] {
  const rang = (art: Momentart) => MOMENTQUELLEN.findIndex((q) => q.art === art);
  return MOMENTQUELLEN.flatMap((q) => q.sammle(k)).sort(
    (a, b) => a.index - b.index || rang(a.art) - rang(b.art),
  );
}

/** Hat die Seite des Lesers ohne klare Abweichung gespielt? Nur dann steht „Gut gespielt!“. */
export function gutGespielt(k: Momentkontext): boolean {
  return istLeserseite(k) && k.urteile.length > 0 && abweichung(k) === null;
}
