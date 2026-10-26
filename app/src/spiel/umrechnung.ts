/**
 * Umrechnung der eigenen Wertung auf chess.com (alle drei Zeitklassen) und FIDE (Klassisch) als
 * Bereich („etwa 1320 bis 1530“), dazu die Kurvenrechnung, die auch die Eichung nutzt.
 *
 * Rolle im Gesamtbild: Die eigene Wertung je Zeitklasse (spiel/elomodell.ts) ist auf dem Maßstab
 * von Lichess geeicht. Der Autor wollte (23.10.2026) dazu die grobe Entsprechung auf chess.com und
 * beim Weltschachbund, seit 26.10.2026 als Bereich und für jede Zeitklasse auf chess.com: Wer mit
 * der App trainiert, soll ungefähr wissen, wo er auf seiner Plattform steht, und die Breite zeigt,
 * wie unsicher das ist. Die Zahlen stammen aus dem Wertungsvergleich von chessgoals.com
 * (spiel/umrechnung-daten.ts). Außerhalb der Tabellen gibt es keine Entsprechung (null).
 *
 * Der Weg über die Brücke: Die Quelle wertet jede Spalte gegen chess.com Blitz aus. Eine eigene
 * Zahl (Lichess) wird deshalb zuerst auf chess.com Blitz zurückgerechnet und von dort auf die
 * Zielspalte. Für Klassisch gibt es auf chess.com keine eigene Wertung: chess.com wertet alle
 * Partien ab zehn Minuten Bedenkzeit als Schnellschach („Rapid“), also auch 30 + 20 oder 60 + 0.
 * Ziel für Klassisch ist deshalb chess.com Schnellschach, über dieselbe Brücke (so setzt die Quelle
 * auch ihre Tabelle „Lichess vs. FIDE“ zusammen).
 * Seit 0.3.3 gilt zuerst die eigene Messung aus echten Spielerpaaren (spiel/plattformvergleich.ts);
 * der Umweg über chessgoals.com bleibt für Zeitklassen und Listen ohne Messung. Je Zeitklasse und
 * Liste gilt immer genau eine Quelle, damit der Bereich nicht an einer Grenze springt.
 * Abhängigkeiten: spiel/umrechnung-daten.ts, spiel/plattformvergleich.ts, spiel/elomodell-daten.ts.
 */
import type { Wertungstempo } from "./elomodell-daten";
import { gemessenerBereich, gemessenerVergleichsbereich, istGemessen } from "./plattformvergleich";
import { SPALTE, STREUUNG, VERGLEICHSTABELLE, type Spalte } from "./umrechnung-daten";

/** Eine Kurve als Stützstellen [x, y], aufsteigend in x. */
export type Kurve = readonly (readonly [number, number])[];

/** Die Listen, auf die umgerechnet wird. */
export type Zielliste = "chesscom" | "fide";

/** Ein Bereich auf der Zielliste, auf 10 gerundet: Mitte und die Ränder (50 % der Spieler). */
export interface Wertungsbereich {
  readonly von: number;
  readonly bis: number;
  readonly mitte: number;
}

/** Die eigene Wertung je Zeitklasse ist die Lichess-Spalte dieser Zeitklasse. */
const LICHESS_SPALTE: Readonly<Record<Wertungstempo, Spalte>> = {
  blitz: "lichessBlitz",
  rapid: "lichessSchnell",
  classical: "lichessKlassisch",
};

/**
 * Die Spalte auf chess.com je Zeitklasse. Klassisch → Schnellschach, weil chess.com keine Wertung
 * für Klassisch hat und alle Partien ab zehn Minuten als Schnellschach wertet.
 */
export const CHESSCOM_ZEITKLASSE: Readonly<Record<Wertungstempo, "blitz" | "rapid">> = {
  blitz: "blitz",
  rapid: "rapid",
  classical: "rapid",
};

/** Ränder und Mitte werden auf so viele Punkte gerundet („etwa“). */
const RUNDUNG = 10;

/**
 * Halbe Breite des Fensters auf chess.com Blitz, über das die Steigung einer Spalte gemessen wird.
 * Warum nicht die Steigung zwischen zwei Nachbarzeilen: Die Quelle rundet auf 5, bei 50 Punkten
 * Zeilenabstand wären das bis zu 10 % Fehler in der Steigung; über 200 Punkte sind es 2,5 %.
 */
const STEIGUNGSFENSTER = 100;

/** Wert der Kurve an einer Stelle, linear dazwischen, außerhalb der Randwert. */
export function kurvenwert(kurve: Kurve, x: number): number {
  const erste = kurve[0];
  const letzte = kurve.at(-1);
  if (!erste || !letzte) return Number.NaN;
  if (x <= erste[0]) return erste[1];
  if (x >= letzte[0]) return letzte[1];
  for (let i = 1; i < kurve.length; i += 1) {
    const [x0, y0] = kurve[i - 1] ?? erste;
    const [x1, y1] = kurve[i] ?? letzte;
    if (x <= x1) return y0 + ((x - x0) / (x1 - x0)) * (y1 - y0);
  }
  return letzte[1];
}

/** Die Zielspalte einer Zeitklasse auf einer Liste. */
function zielspalte(tempo: Wertungstempo, liste: Zielliste): Spalte {
  if (liste === "fide") return "fide";
  return CHESSCOM_ZEITKLASSE[tempo] === "blitz" ? "chesscomBlitz" : "chesscomSchnell";
}

/**
 * Die Kurven über die Brücke: Lichess → chess.com Blitz, chess.com Blitz → Ziel und
 * chess.com Blitz → Lichess (für die Steigung der Lichess-Spalte).
 */
interface Bruecke {
  readonly zurBruecke: Kurve;
  readonly vonDerBruecke: Kurve;
  readonly quelleUeberBlitz: Kurve;
  readonly quellspalte: Spalte;
  readonly zielspalte: Spalte;
}

/** Die Brücke für Zeitklasse und Liste, nur aus Zeilen, in denen das Ziel einen Wert hat. */
function bruecke(tempo: Wertungstempo, liste: Zielliste): Bruecke {
  const quelle = LICHESS_SPALTE[tempo];
  const ziel = zielspalte(tempo, liste);
  const zeilen = VERGLEICHSTABELLE.filter((z) => z[SPALTE[ziel]] !== null);
  const wert = (zeile: (typeof zeilen)[number], spalte: Spalte) => zeile[SPALTE[spalte]] ?? 0;
  return {
    zurBruecke: zeilen.map((z) => [wert(z, quelle), wert(z, "chesscomBlitz")] as const),
    vonDerBruecke: zeilen.map((z) => [wert(z, "chesscomBlitz"), wert(z, ziel)] as const),
    quelleUeberBlitz: zeilen.map((z) => [wert(z, "chesscomBlitz"), wert(z, quelle)] as const),
    quellspalte: quelle,
    zielspalte: ziel,
  };
}

/** Steigung einer Kurve um die Stelle x, gemessen über das Fenster ±STEIGUNGSFENSTER. */
function steigung(kurve: Kurve, x: number): number {
  const unten = Math.max(kurve[0]?.[0] ?? x, x - STEIGUNGSFENSTER);
  const oben = Math.min(kurve.at(-1)?.[0] ?? x, x + STEIGUNGSFENSTER);
  return (kurvenwert(kurve, oben) - kurvenwert(kurve, unten)) / (oben - unten);
}

/** Auf RUNDUNG gerundet. */
function gerundet(wert: number): number {
  return Math.round(wert / RUNDUNG) * RUNDUNG;
}

/**
 * Der Bereich auf der Zielliste, in dem etwa die Hälfte der Spieler mit dieser eigenen Wertung
 * steht, auf 10 gerundet; null außerhalb der Tabelle.
 * Warum so breit: Die Quelle nennt je Spalte das Fenster, in dem 50 % der Spieler liegen (Streuung
 * s, in Punkten der Spalte, gegen chess.com Blitz). Rückweg Lichess → chess.com Blitz: s_Lichess
 * geteilt durch die Steigung der Lichess-Spalte (wo die Lichess-Spalte flach ist, sagt eine
 * Lichess-Zahl wenig über chess.com Blitz, der Bereich wird breit). Hinweg chess.com Blitz → Ziel:
 * dieser Anteil mal der Steigung der Zielspalte, dazu s_Ziel. Beide Teile sind unabhängig, die
 * halben Breiten addieren sich deshalb quadratisch (für Normalverteilungen ist das 50-%-Fenster
 * 0,674 σ, das Verhältnis bleibt). Dünne Daten machen den Bereich so von selbst breiter: Lichess
 * Klassisch ist flach (N = 240), dort ist der Bereich auf chess.com etwa doppelt so breit wie bei
 * Blitz.
 * Eingaben: Zeitklasse, eigene Wertung (Lichess-Maßstab), Liste (Vorgabe chess.com).
 * Ausgabe: { von, bis, mitte } oder null.
 * Beispiel: Blitz 1550 → chess.com Blitz etwa 1080 bis 1300; Schnellschach 1680 → chess.com
 * Schnellschach etwa 1170 bis 1510; Klassisch 2120 → FIDE etwa 1830 bis 2100.
 * Sonderfälle: Klassisch auf chess.com ab 1505, auf FIDE erst ab 1730 (darunter hat die Quelle
 * keine FIDE-Zeilen); oberhalb der letzten Zeile null. Die Streuung der Quelle gilt für die ganze
 * Spalte, an den Rändern der Tabelle ist der Bereich deshalb eher zu schmal.
 */
export function bereichUeberChessgoals(
  tempo: Wertungstempo,
  wertung: number,
  liste: Zielliste = "chesscom",
): Wertungsbereich | null {
  const b = bruecke(tempo, liste);
  const erste = b.zurBruecke[0];
  const letzte = b.zurBruecke.at(-1);
  if (!erste || !letzte || wertung < erste[0] || wertung > letzte[0]) return null;
  const blitz = kurvenwert(b.zurBruecke, wertung);
  const mitte = kurvenwert(b.vonDerBruecke, blitz);
  const aufDerBruecke = STREUUNG[b.quellspalte] / steigung(b.quelleUeberBlitz, blitz);
  const halb = Math.hypot(aufDerBruecke * steigung(b.vonDerBruecke, blitz), STREUUNG[b.zielspalte]);
  return { von: gerundet(mitte - halb), bis: gerundet(mitte + halb), mitte: gerundet(mitte) };
}

/** Woher der Bereich für Zeitklasse und Liste kommt: eigene Messung oder chessgoals.com. */
export function quelleDerUmrechnung(
  tempo: Wertungstempo,
  liste: Zielliste,
): "messung" | "chessgoals" {
  return istGemessen(tempo, liste) ? "messung" : "chessgoals";
}

/**
 * Der Bereich auf der Zielliste, in dem etwa die Hälfte der Spieler mit dieser eigenen Wertung
 * steht; null außerhalb. Aus der eigenen Messung, wo es sie gibt, sonst über chessgoals.com.
 * Beispiel und Herleitung: gemessenerBereich (spiel/plattformvergleich.ts) und
 * bereichUeberChessgoals (oben).
 */
export function bereichEtwa(
  tempo: Wertungstempo,
  wertung: number,
  liste: Zielliste = "chesscom",
): Wertungsbereich | null {
  return quelleDerUmrechnung(tempo, liste) === "messung"
    ? gemessenerBereich(tempo, wertung, liste)
    : bereichUeberChessgoals(tempo, wertung, liste);
}

/**
 * Die Mitte des Bereichs auf der Zielliste („entspricht etwa“), auf 10 gerundet; null außerhalb.
 * Warum noch nötig: Änderungen („+80 auf chess.com“) rechnen mit der Mitte, die Breite des
 * Bereichs hebt sich dabei auf.
 * Beispiel: Schnellschach 1680 → 1340; Klassisch 2120 auf FIDE → 1965; Klassisch 1500 → null.
 */
export function entsprichtEtwa(
  tempo: Wertungstempo,
  wertung: number,
  liste: Zielliste = "chesscom",
): number | null {
  return bereichEtwa(tempo, wertung, liste)?.mitte ?? null;
}

/**
 * Eine Spanne der eigenen Wertung (90 % der Spieler, spiel/elomodell.ts) als Bereich auf der
 * Zielliste: vom unteren Rand des Bereichs zu `von` bis zum oberen Rand des Bereichs zu `bis`.
 * Warum die äußere Hülle: Die Spanne sagt, wie unsicher die eigene Zahl ist, der Bereich, wie
 * unsicher die Umrechnung ist; beide zusammen sind breiter als jede allein. Die Hülle ist einfach
 * zu erklären und lieber zu breit als zu schmal.
 * Beispiel: Schnellschach 1600 bis 1760 → chess.com etwa 1060 bis 1620.
 * Sonderfall: null, wenn ein Ende außerhalb der Tabelle liegt.
 */
export function bereichDerSpanne(
  tempo: Wertungstempo,
  von: number,
  bis: number,
  liste: Zielliste = "chesscom",
): Wertungsbereich | null {
  const unten = bereichEtwa(tempo, von, liste);
  const oben = bereichEtwa(tempo, bis, liste);
  if (!unten || !oben) return null;
  return { von: unten.von, bis: oben.bis, mitte: gerundet((unten.mitte + oben.mitte) / 2) };
}

/**
 * Von welcher bis zu welcher eigenen Wertung (Lichess-Maßstab) die Tabelle für Zeitklasse und
 * Liste reicht.
 * Warum: Außerhalb gibt es keine Entsprechung; die Oberfläche nennt dann die Grenze.
 * Beispiel: Klassisch auf chess.com → 1505 bis 2465; Klassisch auf FIDE → 1730 bis 2465.
 * Sonderfall: eine leere Tabelle liefert null.
 */
export function vergleichsbereich(
  tempo: Wertungstempo,
  liste: Zielliste = "chesscom",
): { von: number; bis: number } | null {
  if (quelleDerUmrechnung(tempo, liste) === "messung") {
    return gemessenerVergleichsbereich(tempo, liste);
  }
  const kurve = bruecke(tempo, liste).zurBruecke;
  const erste = kurve[0];
  const letzte = kurve.at(-1);
  return erste && letzte ? { von: erste[0], bis: letzte[0] } : null;
}
