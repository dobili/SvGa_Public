/**
 * Maße und Farben des Brettes, umgerechnet aus den Buchdiagrammen.
 *
 * Rolle im Gesamtbild: Das Brett soll aussehen wie im Buch (Konzept 10.2 und 10.3). Die Werte
 * stammen aus preamble.tex und preamble_zusatz.tex (Teil 1, Linienart zum Farbcode). Im Buch ist
 * ein Feld 22 pt breit; hier sind es 1000 Einheiten, passend zu den Figurenpfaden.
 * Abhängigkeiten: keine.
 */
import type { Brettfarben } from "../../speicher/format";
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
  /** Nur für die Zugklassen im Rückblick (bester Zug, starkes Opfer), kein Buchwert. */
  gruen: "#2E8B57",
  blau: "#2F6FD1",
  /**
   * Schimmer für ein angetipptes Feld und den letzten Zug: nie Gold, Rot oder Grau (Konzept
   * 10.2). Ein helles Blau, weil Weiß auf den hellen Feldern nicht zu sehen war (Test 0.2.0).
   */
  auswahl: "rgba(80, 150, 255, 0.38)",
} as const;

/** Farben eines Brettes; Materialbretter haben dazu ein ganzes Brettbild. */
export interface Brettpalette {
  readonly hell: string;
  readonly dunkel: string;
  /** Schimmer für angetipptes Feld und letzten Zug. */
  readonly schimmer: string;
  /** Farbe der Figuren im Buchsatz (Figur.tsx). */
  readonly figur: string;
  /** Ganzes Brettbild (8 × 8 Felder, a8 oben links hell), Pfad relativ zur App. */
  readonly bild?: string;
}

/**
 * Schimmer in Gelbgrün wie bei Lichess: auf braunen, blauen und violetten Brettern wirkt das Blau
 * des Buches gräulich oder geht unter.
 */
const SCHIMMER_GELBGRUEN = "rgba(155, 199, 0, 0.45)";
/** Figuren des Buchsatzes auf Holz und Holzbildern schlicht schwarz (Wunsch des Autors, 0.2.2). */
const FIGUR_SCHWARZ = "#111111";

/**
 * Brettfarben zur Wahl in den Einstellungen. „buch“ ist der Standard wie im Buch; die anderen
 * sind übliche Farben anderer Schachseiten für Leser, die sie gewohnt sind (Pflichtenheft 8).
 * Seit 0.2.84 die Auswahl des Autors (pipeline/bretter/farben.json): acht Farben, Holz und drei
 * Materialbretter. Bei den Materialbrettern sind hell und dunkel die Mittelwerte der Felder des
 * Bildes; sie gelten für kleine Bretter, Koordinaten und solange das Bild lädt.
 */
export const BRETTFARBEN: Readonly<Record<Brettfarben, Brettpalette>> = {
  buch: { hell: FARBEN.hell, dunkel: FARBEN.dunkel, schimmer: FARBEN.auswahl, figur: FARBEN.navy },
  /**
   * Auf Holz wirkt Blau gräulich (verwechselbar mit Grau): Schimmer Gelbgrün wie bei Lichess, und
   * die Figuren schlicht schwarz statt im Navy des Buches (Wunsch des Autors nach dem Test von 0.2.2).
   */
  holz: { hell: "#E4C38E", dunkel: "#8E5E36", schimmer: SCHIMMER_GELBGRUEN, figur: FIGUR_SCHWARZ },
  gruen: { hell: "#EEEED2", dunkel: "#769656", schimmer: FARBEN.auswahl, figur: FARBEN.navy },
  braun: { hell: "#F0D9B5", dunkel: "#B58863", schimmer: SCHIMMER_GELBGRUEN, figur: FARBEN.navy },
  blau: { hell: "#DEE3E6", dunkel: "#8CA2AD", schimmer: SCHIMMER_GELBGRUEN, figur: FARBEN.navy },
  sand: { hell: "#EFE6D2", dunkel: "#B9A27E", schimmer: FARBEN.auswahl, figur: FARBEN.navy },
  koralle: { hell: "#F2E6DC", dunkel: "#C98B73", schimmer: FARBEN.auswahl, figur: FARBEN.navy },
  lavendel: {
    hell: "#ECE8F2",
    dunkel: "#9D92B8",
    schimmer: SCHIMMER_GELBGRUEN,
    figur: FARBEN.navy,
  },
  nacht: { hell: "#9AA5B1", dunkel: "#56616E", schimmer: SCHIMMER_GELBGRUEN, figur: FARBEN.navy },
  "intarsie-ahorn": {
    hell: "#E0C59D",
    dunkel: "#AC765C",
    schimmer: SCHIMMER_GELBGRUEN,
    figur: FIGUR_SCHWARZ,
    bild: "bretter/intarsie-ahorn.webp",
  },
  "holz-klassisch": {
    hell: "#C3A36F",
    dunkel: "#7E5532",
    schimmer: SCHIMMER_GELBGRUEN,
    figur: FIGUR_SCHWARZ,
    bild: "bretter/holz-klassisch.webp",
  },
  "marmor-gruen": {
    hell: "#829883",
    dunkel: "#647A63",
    schimmer: FARBEN.auswahl,
    figur: FARBEN.navy,
    bild: "bretter/marmor-gruen.webp",
  },
};

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
