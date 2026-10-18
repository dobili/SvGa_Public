/**
 * Genauigkeitsmodus und Spielstärke nach der Eichung vom 18.10.2026 (Plan „Genauigkeit und
 * Spielstärke neu eichen“, Schritt d).
 *
 * Rolle im Gesamtbild: Die Genauigkeit, die der Leser sieht, folgt seinem Schalter in den
 * Einstellungen: „Lichess“ (Rechnung von Lichess), „nahe chess.com“ (Züge in entschiedener
 * Stellung zählen kaum) oder „Mittelweg“ (Standard). Die Spielstärke und die Urteilswörter je
 * Phase hängen dagegen an der inneren Genauigkeit (Lichess-Rechnung), damit der Schalter sie nicht
 * verschiebt. Die Spielstärke ist die Mitte zweier Kurven Genauigkeit → Wertungszahl, geeicht an
 * je 300 gewerteten Schnellschach-Partien von chess.com und Lichess (Tiefe 18, Engine der App);
 * beide Einzelwerte stehen in der Erklärung, die Mitte gehört zu keiner echten Liste.
 * Kontrolle an zurückgelegten Partien: je Partie etwa ±450 Punkte daneben, über zehn Partien
 * etwa ±250 bis ±400 (Bericht an den Autor vom 18.10.2026). Deshalb zeigt die App eine Spanne.
 * Abhängigkeiten: keine (reine Rechnung).
 */

/** Die drei Stellungen des Schalters „Genauigkeit wie“. */
export const GENAUIGKEITSMODI = ["lichess", "mittelweg", "chesscom"] as const;
export type Genauigkeitsmodus = (typeof GENAUIGKEITSMODI)[number];
export const STANDARD_GENAUIGKEITSMODUS: Genauigkeitsmodus = "mittelweg";

/**
 * Gewicht der Züge in entschiedener Stellung je Modus (Polster, genauigkeitsmodell.ts). Der
 * Abfall der Zugkurve bleibt bei allen der von Lichess (0,04354): Die Eichung fand für chess.com
 * 0,040 bis 0,0435 je nach Partien, der Unterschied lag im Rauschen.
 * Beispiel: „nahe chess.com“ zählt einen Zug in längst gewonnener Stellung nur zu einem Zehntel.
 */
export const POLSTER: Readonly<Record<Genauigkeitsmodus, number>> = {
  lichess: 1,
  mittelweg: 0.55,
  chesscom: 0.1,
};

/** Eine Kurve als Stützstellen [Genauigkeit, Wertungszahl], aufsteigend. */
export type Kurve = readonly (readonly [number, number])[];

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

/**
 * Kurven Genauigkeit → mittlere Wertungszahl (für eine Partie die beste Schätzung), monoton
 * ausgeglichen; gerundet aus `buch/arbeit/eichung/ergebnis.json` (nur lokal).
 */
const KURVE_CHESSCOM: Kurve = [
  [42.7, 840],
  [53.3, 1050],
  [67.3, 1050],
  [72, 1310],
  [76, 1310],
  [79, 1500],
  [84.7, 1500],
  [87.3, 1610],
  [89.6, 1680],
  [94.2, 1780],
];
const KURVE_LICHESS: Kurve = [
  [38.4, 1000],
  [53, 1050],
  [60.7, 1260],
  [66.8, 1260],
  [71.3, 1430],
  [75.2, 1430],
  [78.5, 1450],
  [81.1, 1630],
  [86.4, 1630],
  [90.1, 1700],
  [96.2, 1700],
];
/**
 * Umgekehrte Kurven: je Wertungsband die mittlere Genauigkeit, aufgelöst nach der Wertung. Sie
 * ziehen nicht zur Mitte und gehen deshalb in die Schätzung über mehrere Partien ein.
 */
const UMKEHR_CHESSCOM: Kurve = [
  [49.9, 280],
  [60.7, 500],
  [66.3, 710],
  [71.2, 890],
  [73.5, 1330],
  [80.3, 1780],
  [81.6, 2080],
  [84.8, 2300],
  [87.3, 2440],
  [93.8, 2680],
];
const UMKEHR_LICHESS: Kurve = [
  [63.9, 760],
  [70.1, 1090],
  [71.2, 1310],
  [76.5, 1500],
  [78.8, 1790],
  [80.4, 2090],
  [83.4, 2380],
];

/** Halbe Breite der Spanne bei einer Partie und bei zehn Partien (Kontrolle der Eichung). */
const SPANNE_EINE = 400;
const SPANNE_ZEHN = 250;
const ZEHN = 10;
const RUNDUNG = 50;

function gerundet(wert: number): number {
  return Math.round(wert / RUNDUNG) * RUNDUNG;
}

/** Eine Schätzung: Mitte, Spanne und die beiden Einzelwerte. */
export interface Staerkeschaetzung {
  readonly mitte: number;
  readonly von: number;
  readonly bis: number;
  readonly chesscom: number;
  readonly lichess: number;
}

/** Halbe Spanne für n Partien: 400 bei einer, 250 ab zehn, dazwischen linear. */
function halbeSpanne(partien: number): number {
  const n = Math.max(1, Math.min(ZEHN, partien));
  return SPANNE_EINE - ((SPANNE_EINE - SPANNE_ZEHN) * (n - 1)) / (ZEHN - 1);
}

function schaetzung(chesscom: number, lichess: number, partien: number): Staerkeschaetzung {
  const mitte = gerundet((chesscom + lichess) / 2);
  const halb = halbeSpanne(partien);
  return {
    mitte,
    von: gerundet(mitte - halb),
    bis: gerundet(mitte + halb),
    chesscom: gerundet(chesscom),
    lichess: gerundet(lichess),
  };
}

/**
 * Spielstärke aus der inneren Genauigkeit einer Partie.
 * Beispiel: 80 % → chess.com etwa 1500, Lichess etwa 1550, Mitte 1550 (1150 bis 1950).
 */
export function staerkeAusGenauigkeit(innen: number): Staerkeschaetzung {
  return schaetzung(kurvenwert(KURVE_CHESSCOM, innen), kurvenwert(KURVE_LICHESS, innen), 1);
}

/**
 * Spielstärke über mehrere Partien (höchstens die letzten zehn): je Skala das Mittel aus dem
 * Schnitt der Einzelschätzungen und der umgekehrten Kurve am Schnitt der Genauigkeiten; die
 * Spanne wird mit der Zahl der Partien enger. Null ohne Partien.
 * Beispiel: zehn Partien mit je 75 % → chess.com etwa 1350, Lichess etwa 1450, Mitte 1400
 * (1150 bis 1650).
 */
export function staerkeUeberPartien(innen: readonly number[]): Staerkeschaetzung | null {
  const letzte = innen.slice(-ZEHN);
  if (letzte.length === 0) return null;
  const schnitt = letzte.reduce((s, x) => s + x, 0) / letzte.length;
  const je = (vor: Kurve, umkehr: Kurve) => {
    const vorwaerts = letzte.reduce((s, x) => s + kurvenwert(vor, x), 0) / letzte.length;
    return (vorwaerts + kurvenwert(umkehr, schnitt)) / 2;
  };
  return schaetzung(
    je(KURVE_CHESSCOM, UMKEHR_CHESSCOM),
    je(KURVE_LICHESS, UMKEHR_LICHESS),
    letzte.length,
  );
}
