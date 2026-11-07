/**
 * Warum- und Finde-Kategorie eines Zuges einer ausgewerteten Partie, nach den Regeln der Karte:
 * welche Zeilen sie zeigt, in welcher Reihenfolge, und was als doppelt wegfällt.
 *
 * Rolle im Gesamtbild: Konzept docs/KONZEPT_FEHLER_BUCHBEZUG.md, Abschnitt 4.1 (vom Autor
 * freigegeben). Die Erkennung steht in spiel/warumkategorie.ts (W1 bis W10) und
 * analyse/findekategorien.ts (F1 bis F10); diese Datei baut ihnen die Eingaben aus den
 * gespeicherten Werten (Werte, beste Züge, Abstände, Varianten je Stellung) und wendet die Regeln
 * der Karte an. Dieselbe Rechnung dient der Zeitleiste, dem Rückblick Zug für Zug und den
 * gespeicherten Kürzeln für die Startseite (spiel/buchkuerzel.ts): So sagen alle dasselbe.
 * Regeln (Konzept 4.1): Warum bei Fehler und Patzer (für die Statistik auch bei „ungenau“), nie
 * bei „Verpasst“; Finden bei ungenau, Fehler, Verpasst und Patzer. F10 (Faustregel LAP) nur ohne
 * taktischen Warum-Grund W1 bis W7; F9 und F10 nie bei Patzer und „Verpasst“ (Messlauf
 * 7.11.2026). Meinen beide Zeilen dasselbe Feld (W4 hängende Figur, W5 Schlagfeld) oder öffnen sie
 * dieselbe Übung, bleibt nur die Warum-Zeile.
 * Rein: keine Engine, kein Speicher.
 * Abhängigkeiten: spiel/warumkategorie.ts, analyse/findekategorien.ts, spiel/findetext.ts,
 * spiel/buchbezug.ts, spiel/erklaerung.ts
 * (widerlegungAus), spiel/partie.ts, spiel/phasen.ts, spiel/zuege.ts.
 */
import { findeKategorie, type Findeeingabe, type Findetreffer } from "../analyse/findekategorien";
import type { Fallenindex } from "../analyse/warumfalle";
import type { Eroeffnungsindex } from "../schach/eroeffnungsindex";
import type { Zugklasse, Zugurteil } from "./auswertung";
import { BUCHBEZUG, type Buchkennung, type Findekennung, type Warumkennung } from "./buchbezug";
import { findesatz } from "./findetext";
import { widerlegungAus } from "./erklaerung";
import { stellungen, type Partie } from "./partie";
import { phasenJeStellung, type Phase } from "./phasen";
import { warumKategorie, type Warumbefund } from "./warumkategorie";
import { sanZuUci } from "./zuege";

/** Was von der Auswertung einer Partie gebraucht wird; ein Partieeintrag passt. */
export interface Auswertungsdaten {
  readonly partie: Partie;
  /** Wert je Stellung aus Sicht von Weiß. */
  readonly werte: readonly number[];
  readonly beste: readonly string[];
  readonly abstaende?: readonly number[];
  readonly varianten?: readonly (readonly string[])[];
}

/** Buchdaten, die einzelne Kategorien brauchen; fehlt etwas, schweigt nur diese Kategorie. */
export interface Buchkontextdaten {
  /** Fallen des Kapitels 4 für W1. */
  readonly fallenindex?: Fallenindex;
  /** Buchvarianten der Kapitel 2 und 3 für F8. */
  readonly eroeffnungsindex?: Eroeffnungsindex;
}

/** Die Kategorien eines Zuges, wie die Karte sie zeigt (höchstens eine je Richtung). */
export interface Buchbefunde {
  readonly warum: Warumbefund | null;
  readonly finde: Findetreffer | null;
}

/** Klassen mit Warum-Zeile auf der Karte (Konzept 4.1). */
export const WARUM_KLASSEN: ReadonlySet<Zugklasse> = new Set<Zugklasse>(["fehler", "patzer"]);
/** Klassen mit Warum-Kategorie für die Statistik (dazu „ungenau“, Konzept 3). */
export const WARUM_STATISTIK: ReadonlySet<Zugklasse> = new Set<Zugklasse>([
  "ungenau",
  "fehler",
  "patzer",
]);
/** Klassen mit Findezeile: jeder Zug mit „Besser war …“ außer „gut“ und „sehr gut“. */
export const FINDE_KLASSEN: ReadonlySet<Zugklasse> = new Set<Zugklasse>([
  "ungenau",
  "fehler",
  "verpasst",
  "patzer",
]);
/** Taktische Warum-Gründe; mit einem davon schweigt die Faustregel F10 (Konzept 4.1). */
const TAKTISCH: ReadonlySet<Warumkennung> = new Set<Warumkennung>([
  "W1",
  "W2",
  "W3",
  "W4",
  "W5",
  "W6",
  "W7",
]);

/** Die Faustregeln unter den Finde-Kategorien (Konzept 5, Grenze 1). */
const FAUSTREGELN: ReadonlySet<Findekennung> = new Set<Findekennung>(["F9", "F10"]);

/** Klassen mit großem Ausschlag, bei denen die Faustregeln schweigen. */
const GROSSE: ReadonlySet<Zugklasse> = new Set<Zugklasse>(["patzer", "verpasst"]);

/** Phasen je Partie, einmal gerechnet (die Karte fragt je Zug). */
const PHASEN = new WeakMap<Partie, readonly Phase[]>();

function phasenVon(partie: Partie): readonly Phase[] {
  const bekannt = PHASEN.get(partie);
  if (bekannt) return bekannt;
  const neu = phasenJeStellung(partie);
  PHASEN.set(partie, neu);
  return neu;
}

/** Stellung vor dem Zug und der Zug als UCI; null ohne Daten. */
function zugVon(d: Auswertungsdaten, index: number): { fen: string; uci: string } | null {
  const fen = stellungen(d.partie)[index];
  const san = d.partie.zuege[index]?.san;
  const uci = fen && san ? sanZuUci(fen, san) : null;
  return fen && uci ? { fen, uci } : null;
}

/** Die Warum-Kategorie eines Zuges (ohne Prüfung der Klasse). */
function warumFuer(
  d: Auswertungsdaten,
  urteil: Zugurteil,
  kontext: Buchkontextdaten,
): Warumbefund | null {
  const zug = zugVon(d, urteil.index);
  if (!zug) return null;
  const { index } = urteil;
  return warumKategorie({
    vorherFen: zug.fen,
    uci: zug.uci,
    widerlegung: widerlegungAus(d.beste[index + 1], d.varianten?.[index + 1]),
    verlust: urteil.verlust,
    bester: d.beste[index] || null,
    ...(kontext.fallenindex ? { fallenindex: kontext.fallenindex } : {}),
  });
}

/**
 * Die Eingabe der Finde-Prüfung für einen Halbzug, aus den gespeicherten Werten; null ohne
 * besten Zug oder ohne Stellung. Werte aus Sicht der Seite am Zug: Der beste Zug hält den Wert
 * vor dem Zug, der gespielte führt zum Wert danach.
 * Beispiel: Opernpartie, 16. Td2 statt 16. Db8+ → Weiß am Zug, Wert vorher Matt, danach +3.
 */
export function findeeingabeAus(
  d: Auswertungsdaten,
  index: number,
  kontext: Buchkontextdaten = {},
): Findeeingabe | null {
  const zug = zugVon(d, index);
  const bester = d.beste[index];
  if (!zug || !bester) return null;
  const vorzeichen = zug.fen.split(" ")[1] === "b" ? -1 : 1;
  const vorher = vorzeichen * (d.werte[index] ?? 0);
  const davor = stellungen(d.partie)[index - 1];
  const abstand = d.abstaende?.[index];
  return {
    fenVorher: zug.fen,
    gespielterZugUci: zug.uci,
    besterZugUci: bester,
    varianteBest: d.varianten?.[index] ?? [bester],
    varianteNachGespielt: widerlegungAus(d.beste[index + 1], d.varianten?.[index + 1]),
    wertVorher: vorher,
    wertNachBest: vorher,
    wertNachGespielt: vorzeichen * (d.werte[index + 1] ?? 0),
    phase: phasenVon(d.partie)[index] ?? "mittelspiel",
    ...(davor ? { fenDavor: davor } : {}),
    ...(abstand !== undefined ? { abstandZweitbester: abstand } : {}),
    ...(kontext.eroeffnungsindex
      ? { buchkontext: { eroeffnungsindex: kontext.eroeffnungsindex } }
      : {}),
  };
}

/** Öffnen beide Zeilen dieselbe Übung (Trainer und Thema)? Dann lehren sie dieselbe Buchidee. */
function gleicheUebung(warum: Warumbefund, finde: Findetreffer): boolean {
  const thema = (k: Buchkennung, eigenes: string | null) => eigenes ?? BUCHBEZUG[k].thema;
  return (
    BUCHBEZUG[warum.kennung].trainer === BUCHBEZUG[finde.kennung].trainer &&
    thema(warum.kennung, warum.thema) === thema(finde.kennung, findesatz(finde).thema)
  );
}

/**
 * Lässt die Findezeile weg, wenn sie neben der Warum-Zeile nichts Neues sagt (Konzept 4.1):
 * F10 nach einem taktischen Grund, dasselbe Feld wie W4 oder W5, oder dieselbe Übung. Warum das
 * Letzte (Messlauf und Höhentest 7.11.2026): Bei 12. O-O-O?? standen „Drohung stehen gelassen“
 * und „Schach, Schlag oder Drohung zuerst“ untereinander, beide mit der Schach-Röntgen-Regel
 * aus Kapitel 1; die zweite Zeile machte die Karte nur höher.
 */
export function ohneDoppeltes(warum: Warumbefund | null, finde: Findetreffer | null): Buchbefunde {
  if (!warum || !finde) return { warum, finde };
  if (finde.kennung === "F10" && TAKTISCH.has(warum.kennung)) return { warum, finde: null };
  if (warum.feld !== undefined && warum.feld === finde.details.feld) return { warum, finde: null };
  if (gleicheUebung(warum, finde)) return { warum, finde: null };
  return { warum, finde };
}

/**
 * Warum- und Findezeile eines Zuges, wie die Karte sie zeigt.
 *
 * Warum: Höchstens eine Zeile je Richtung, Warum vor Finden, nichts doppelt (Konzept 4.1).
 * Eingaben: Auswertungsdaten der Partie, Urteil des Zuges, ob die Warum-Zeile gefragt ist
 * (`warum`: Klassen der Karte oder der Statistik), Buchkontext.
 * Ausgabe: beide Befunde, je null, wenn nichts sicher passt.
 * Beispiel: Opernpartie gegen Derya, 12. O-O-O?? → W3 „Drohung stehen gelassen“, keine Findezeile.
 * Sonderfall: Bei „Verpasst“ nie eine Warum-Zeile, auch wenn `warum` sie zuließe.
 */
export function buchbefundeFuer(
  d: Auswertungsdaten,
  urteil: Zugurteil,
  warumKlassen: ReadonlySet<Zugklasse>,
  kontext: Buchkontextdaten = {},
): Buchbefunde {
  const mitWarum = warumKlassen.has(urteil.klasse) && urteil.klasse !== "verpasst";
  const warum = mitWarum ? warumFuer(d, urteil, kontext) : null;
  const eingabe = FINDE_KLASSEN.has(urteil.klasse)
    ? findeeingabeAus(d, urteil.index, kontext)
    : null;
  const finde = eingabe ? findeKategorie(eingabe) : null;
  // Patzer und verpasster Gewinn sind große Ausschläge; eine Faustregel erklärt sie nicht
  // (Messlauf 7.11.2026: „b4?? Besser war e4: Zentrum“).
  const faust = finde !== null && FAUSTREGELN.has(finde.kennung) && GROSSE.has(urteil.klasse);
  return ohneDoppeltes(warum, faust ? null : finde);
}
