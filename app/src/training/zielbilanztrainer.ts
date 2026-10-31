/**
 * Zielbilanz-Übung (Kapitel 2): Nach etwa zehn Zügen die Zielbilanz für beide Seiten ausfüllen.
 *
 * Rolle im Gesamtbild: Trainer „zielbilanz“ (Pflichtenheft 7, AP 13). Die Stellungen sind
 * Eröffnungsstellungen aus den Kapiteln 2 und 3; die richtige Tabelle liefert dieselbe Prüfung
 * wie das Werkzeug „Zielbilanz“ (schach/zielbilanz.ts). Stellungen, in denen ein Zentrumsbauer
 * angegriffen ist, fallen weg: Dort entscheidet im Werkzeug erst die Engine, ob er hängt
 * (ZentrumKarte.tsx), und eine Übung ohne Engine soll kein strittiges „teils“ abfragen.
 * Reine Funktionen.
 * Abhängigkeiten: analyse/stellungsprofil.ts, schach/zielbilanz.ts, training/zufall.ts.
 * Buchbezug: Kapitel 2, „Die Zielbilanz“ (Zentrum, Entwicklung, Königssicherheit).
 */
import type { Color } from "chessops/types";
import { profil } from "../analyse/stellungsprofil";
import { geeignet } from "./eignung";
import { rundeNachStufe, zielbilanzstufe, type Trainerstufe } from "./stufen";
import { zielbilanz, type Wertung, type Zielbilanz } from "../schach/zielbilanz";
import type { Buchstellung } from "./buchstellungen";
import type { Zufall } from "./zufall";

/** Die drei Ziele in Buchreihenfolge. */
export const ZIELE = ["zentrum", "entwicklung", "koenig"] as const;
export type Ziel = (typeof ZIELE)[number];
/** Die zwei Seiten, je mit eigener Wertung der drei Ziele. */
export const SEITEN: readonly Color[] = ["white", "black"];
/** Die drei möglichen Wertungen je Ziel, in der Reihenfolge der Knöpfe. */
export const WERTUNGEN: readonly Wertung[] = ["ja", "teils", "nein"];

/** Kapitel mit Eröffnungsstellungen. */
const KAPITEL = new Set([2, 3]);
/** „Nach etwa zehn Zügen“: Zugnummern in der FEN von 6 bis 20. */
const ERSTER_ZUG = 6;
const LETZTER_ZUG = 20;
const ZUGNUMMER_FELD = 5;

/** Die Tabelle: je Seite und Ziel eine Wertung. */
export type Tabelle = Readonly<Record<Color, Readonly<Record<Ziel, Wertung>>>>;

export interface Zielbilanzaufgabe {
  readonly nummer: string;
  readonly fen: string;
  readonly loesung: Tabelle;
  /** Stufe nach der Zahl der „teils“ in der Lösung (training/stufen.ts). */
  readonly stufe: Trainerstufe;
}

function zeileAus(b: Zielbilanz): Record<Ziel, Wertung> {
  return {
    zentrum: b.zentrum.wertung,
    entwicklung: b.entwicklung.wertung,
    koenig: b.koenig.wertung,
  };
}

function zugnummer(fen: string): number {
  return Number(fen.split(" ")[ZUGNUMMER_FELD] ?? 0);
}

/**
 * Die Aufgabe zu einer Buchstellung, oder null, wenn sie nicht passt (falsches Kapitel, zu früh
 * oder zu spät, König fehlt, angegriffener Zentrumsbauer).
 *
 * Beispiel: Abb. 2.11 → beide Seiten ja, ja, ja (wie die Tabelle im Buch).
 */
export function zielbilanzaufgabe(buch: Buchstellung): Zielbilanzaufgabe | null {
  const { stellung } = buch;
  const zug = zugnummer(stellung.fen);
  if (!KAPITEL.has(buch.kapitel) || zug < ERSTER_ZUG || zug > LETZTER_ZUG) return null;
  if (!stellung.brett.kingOf("white") || !stellung.brett.kingOf("black")) return null;
  // Eignung je Trainer (training/eignung.ts): kein Schach, kein Ende, kein laufender Abtausch.
  if (!geeignet("zielbilanz", stellung)) return null;
  const karte = profil(stellung).angriffskarte;
  const [weiss, schwarz] = SEITEN.map((farbe) =>
    zielbilanz(stellung.brett, karte, farbe, stellung.amZug),
  );
  if (!weiss || !schwarz) return null;
  if (weiss.zentrum.angegriffen.length > 0 || schwarz.zentrum.angegriffen.length > 0) return null;
  const loesung = { white: zeileAus(weiss), black: zeileAus(schwarz) };
  const teils = SEITEN.flatMap((f) => ZIELE.map((z) => loesung[f][z])).filter((w) => w === "teils");
  return { nummer: buch.nummer, fen: stellung.fen, loesung, stufe: zielbilanzstufe(teils.length) };
}

/** Eine Runde aus zufälligen passenden Stellungen. */
export function zielbilanzrunde(
  stellungen: readonly Buchstellung[],
  anzahl: number,
  zufall: Zufall,
  stufe: Trainerstufe | null = null,
): Zielbilanzaufgabe[] {
  const passende = stellungen.flatMap((b) => zielbilanzaufgabe(b) ?? []);
  return rundeNachStufe(passende, stufe, anzahl, zufall);
}

/** Die Felder der Tabelle, in denen die Antwort von der Prüfung abweicht. */
export function abweichungen(
  aufgabe: Zielbilanzaufgabe,
  antwort: Tabelle,
): { readonly seite: Color; readonly ziel: Ziel }[] {
  return SEITEN.flatMap((seite) =>
    ZIELE.filter((ziel) => antwort[seite][ziel] !== aufgabe.loesung[seite][ziel]).map((ziel) => ({
      seite,
      ziel,
    })),
  );
}
