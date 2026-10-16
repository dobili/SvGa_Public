/**
 * Maße und Farben des Brettes, umgerechnet aus den Buchdiagrammen.
 *
 * Rolle im Gesamtbild: Das Brett soll aussehen wie im Buch (Konzept 10.2 und 10.3). Die Werte
 * stammen aus preamble.tex und preamble_zusatz.tex (Teil 1, Linienart zum Farbcode). Im Buch ist
 * ein Feld 22 pt breit; hier sind es 1000 Einheiten, passend zu den Figurenpfaden.
 * Abhängigkeiten: keine.
 */
import { EINHEITEN_JE_FELD } from "./figurenpfade.generiert";

/** Feldbreite im Buch in Punkt (boardfontsize=22pt in preamble.tex). */
const BUCHFELD_PT = 22;

/** Rechnet eine Länge aus dem Buch (Punkt) in Einheiten des Brettes um. */
function ausPunkt(punkt: number): number {
  return (punkt / BUCHFELD_PT) * EINHEITEN_JE_FELD;
}

export const FELD = EINHEITEN_JE_FELD;
export const BRETT = 8 * FELD;

/** Farben wie im Buch (Konzept 10.3). */
export const FARBEN = {
  hell: "#F5F0E6",
  dunkel: "#7F8794",
  navy: "#16253D",
  creme: "#F5F0E6",
  gold: "#D9A514",
  rot: "#DC4444",
  grau: "#8A93A0",
  /**
   * Schimmer für ein angetipptes Feld und den letzten Zug: nie Gold, Rot oder Grau (Konzept
   * 10.2). Ein helles Blau, weil Weiß auf den hellen Feldern nicht zu sehen war (Test 0.2.0).
   */
  auswahl: "rgba(80, 150, 255, 0.38)",
} as const;

/**
 * Brettfarben zur Wahl in den Einstellungen. „buch“ ist der Standard wie im Buch; die anderen
 * sind übliche Farben anderer Schachseiten für Leser, die sie gewohnt sind (Pflichtenheft 8).
 */
export const BRETTFARBEN = {
  buch: { hell: FARBEN.hell, dunkel: FARBEN.dunkel, schimmer: FARBEN.auswahl, figur: FARBEN.navy },
  /**
   * Auf Holz wirkt Blau gräulich (verwechselbar mit Grau): Schimmer Gelbgrün wie bei Lichess, und
   * die Figuren schlicht schwarz statt im Navy des Buches (Wunsch des Autors nach dem Test von 0.2.2).
   */
  holz: {
    hell: "#E4C38E",
    dunkel: "#8E5E36",
    schimmer: "rgba(155, 199, 0, 0.45)",
    figur: "#111111",
  },
  gruen: { hell: "#EEEED2", dunkel: "#769656", schimmer: FARBEN.auswahl, figur: FARBEN.navy },
} as const;

/**
 * Holzbilder für die Brettfarbe „Holz“ (Holzfelder.tsx), kein Buchwert: zwei Fotos echten Holzes
 * aus ambientCG (Wood095 hell, Wood026 dunkel, CC0, siehe docs/LIZENZEN.md), so gedreht, dass die
 * Faser längs läuft wie beim Holzbrett von Lichess (Wunsch des Autors). Pfade relativ zur App.
 */
export const HOLZ = {
  hell: "holz/hell.webp",
  dunkel: "holz/dunkel.webp",
} as const;

/** Kennung des Holzmusters für helle oder dunkle Felder eines Brettes (Holzfelder.tsx). */
export function holzmuster(kennung: string, hell: boolean): string {
  return `${kennung}-holz-${hell ? "hell" : "dunkel"}`;
}

/** Pfeile: linewidth=2.4pt, Kontur 0,4 pt je Seite (preamble.tex, preamble_zusatz.tex). */
export const PFEIL = {
  breite: ausPunkt(2.4),
  kontur: ausPunkt(0.4),
  /** Roter Strich und Lücke: \pfeilstrichrot = {5.2pt}{2.6pt}. */
  strichRot: [ausPunkt(5.2), ausPunkt(2.6)],
  /** Graue Punkte: \pfeilpunktgrau = {0pt}{4.1pt}, runde Enden. */
  punktGrau: [0, ausPunkt(4.1)],
  /** Spitze im Stil „stealth“ von TikZ. */
  spitzeLaenge: ausPunkt(7.2),
  spitzeHalbeBreite: ausPunkt(3.6),
  /** Abstand des Pfeilanfangs vom Feldmittelpunkt (0.1em in \@la@pfeilpfad). */
  verkuerzungStart: ausPunkt(2.2),
  /**
   * Abstand zweier übereinanderliegender Pfeile (versatz.ts): Pfeilbreite mit Kontur
   * (2,4 + 2 × 0,4 pt) und eine schmale Lücke von 0,6 pt. Kein Buchwert, nur App-Darstellung.
   */
  versatz: ausPunkt(3.8),
} as const;

/** Feldrahmen: \feldrahmenbreite = 2.25pt; Rot {4.2pt}{2.2pt}, Grau {0pt}{4.2pt}. */
export const RAHMEN = {
  breite: ausPunkt(2.25),
  strichRot: [ausPunkt(4.2), ausPunkt(2.2)],
  punktGrau: [0, ausPunkt(4.2)],
  /** Goldene Felder nur an den Ecken; Schenkellänge 0,22 Feldbreiten (\eckrahmenschenkel). */
  eckschenkel: 0.22 * EINHEITEN_JE_FELD,
} as const;

/** Schriftgröße der Koordinaten am Rand, als Anteil der Feldbreite. */
export const KOORDINATEN_GROESSE = 0.22 * EINHEITEN_JE_FELD;
