/**
 * Endspieldatenbank König und Bauer gegen König (KPK): gewinnt die Bauernseite oder ist es remis?
 *
 * Rolle im Gesamtbild: Prüfstein für k8-opposition (C1.19, Entscheidung des Autors vom
 * 16.10.2026: „Die App nennt nur Oppositionszüge, die das Ergebnis halten; für König und Bauer
 * gegen König exakt“). Die Tabelle entsteht beim ersten Gebrauch durch rückwärtiges Auflösen
 * (wiederholtes Durchgehen aller Stellungen, bis sich nichts mehr ändert) und bleibt dann im
 * Speicher; das dauert einmalig etwa 0,2 Sekunden.
 * Abhängigkeiten: chessops (nur Feldarithmetik), stellung.ts.
 * Buchbezug: Kapitel 8, „Die Opposition“ bis „Holt der König ihn ein?“ (Abb. 8.19 bis 8.36): Die
 * Datenbank rechnet aus, was Opposition, Schlüsselfelder und Quadrat als Faustregeln beschreiben.
 *
 * Darstellung: Die Bauernseite heißt hier „stark“ und wird für die Tabelle immer zu Weiß gemacht
 * (Spiegelung an der Brettmitte), der Bauer steht immer auf den Linien a bis d (Spiegelung an der
 * d/e-Grenze). Index = Zugrecht × König stark × König schwach × Bauernfeld (24 Felder).
 */
import type { Board } from "chessops/board";
import type { Color, Square } from "chessops/types";
import { squareFile, squareRank } from "chessops/util";
import { gegner } from "./stellung";

/** Ergebnis aus Sicht der Bauernseite. */
export type KpkErgebnis = "gewinn" | "remis";

const FELDER = 64;
const LINIEN = 8;
/** Linien a bis d; die übrigen werden gespiegelt. */
const BAUERNLINIEN = 4;
/** Reihen 2 bis 7 (Index 1 bis 6), auf denen ein Bauer stehen kann. */
const BAUERNREIHEN = 6;
const BAUERNFELDER = BAUERNLINIEN * BAUERNREIHEN;
const ZWEITE_REIHE = 1;
const SIEBTE_REIHE = 6;
const SPIEGEL_SENKRECHT = 56;
const SPIEGEL_WAAGRECHT = 7;
const STARK_AM_ZUG = 0;
const SCHWACH_AM_ZUG = 1;

/** Zustände in der Tabelle. */
const UNBEKANNT = 0;
const UNGUELTIG = 1;
const REMIS = 2;
const GEWINN = 4;

const GROESSE = 2 * FELDER * FELDER * BAUERNFELDER;

/** Nachbarfelder jedes Feldes (Königszüge). */
const NACHBARN: readonly (readonly Square[])[] = Array.from({ length: FELDER }, (_, feld) => {
  const liste: Square[] = [];
  for (let dr = -1; dr <= 1; dr += 1) {
    for (let dl = -1; dl <= 1; dl += 1) {
      const l = squareFile(feld) + dl;
      const r = squareRank(feld) + dr;
      if ((dl !== 0 || dr !== 0) && l >= 0 && l < LINIEN && r >= 0 && r < LINIEN) {
        liste.push(r * LINIEN + l);
      }
    }
  }
  return liste;
});

/** Abstand in Königszügen. */
function abstand(a: Square, b: Square): number {
  return Math.max(Math.abs(squareFile(a) - squareFile(b)), Math.abs(squareRank(a) - squareRank(b)));
}

/** Greift ein weißer Bauer auf `bauer` das Feld an? */
function bauerGreiftAn(bauer: Square, feld: Square): boolean {
  return (
    squareRank(feld) === squareRank(bauer) + 1 &&
    Math.abs(squareFile(feld) - squareFile(bauer)) === 1
  );
}

/** Index einer normierten Stellung (Bauer weiß, Linie a bis d). */
function index(amZug: number, stark: Square, schwach: Square, bauer: Square): number {
  const bauernindex = (squareRank(bauer) - ZWEITE_REIHE) * BAUERNLINIEN + squareFile(bauer);
  return ((amZug * FELDER + stark) * FELDER + schwach) * BAUERNFELDER + bauernindex;
}

/** Bauernfeld aus dem Bauernindex. */
function bauernfeld(bauernindex: number): Square {
  const reihe = Math.floor(bauernindex / BAUERNLINIEN) + ZWEITE_REIHE;
  return reihe * LINIEN + (bauernindex % BAUERNLINIEN);
}

/** Startzustand: ungültig, sofort entschieden oder noch unbekannt. */
function startzustand(amZug: number, stark: Square, schwach: Square, bauer: Square): number {
  if (stark === schwach || stark === bauer || schwach === bauer || abstand(stark, schwach) <= 1) {
    return UNGUELTIG;
  }
  if (amZug === STARK_AM_ZUG) {
    // Der schwache König stünde im Schach, obwohl die starke Seite am Zug ist.
    if (bauerGreiftAn(bauer, schwach)) return UNGUELTIG;
    const umwandlung = bauer + LINIEN;
    const sicher = abstand(schwach, umwandlung) > 1 || abstand(stark, umwandlung) === 1;
    if (squareRank(bauer) === SIEBTE_REIHE && stark !== umwandlung && sicher) return GEWINN;
    return UNBEKANNT;
  }
  return UNBEKANNT;
}

/** Wertet die Züge der starken Seite aus: Gewinn, sobald ein Zug gewinnt. */
function werteStark(tabelle: Uint8Array, stark: Square, schwach: Square, bauer: Square): number {
  let alleRemis = true;
  for (const ziel of NACHBARN[stark] ?? []) {
    if (ziel === bauer || abstand(ziel, schwach) <= 1) continue;
    const wert = tabelle[index(SCHWACH_AM_ZUG, ziel, schwach, bauer)];
    if (wert === GEWINN) return GEWINN;
    if (wert !== REMIS) alleRemis = false;
  }
  const vor = bauer + LINIEN;
  // Die Umwandlung ohne sofortigen Gewinn (siehe startzustand) führt zum Verlust des Bauern.
  if (squareRank(bauer) < SIEBTE_REIHE && vor !== stark && vor !== schwach) {
    const wert = tabelle[index(SCHWACH_AM_ZUG, stark, schwach, vor)];
    if (wert === GEWINN) return GEWINN;
    if (wert !== REMIS) alleRemis = false;
    const doppelt = vor + LINIEN;
    if (squareRank(bauer) === ZWEITE_REIHE && doppelt !== stark && doppelt !== schwach) {
      const weit = tabelle[index(SCHWACH_AM_ZUG, stark, schwach, doppelt)];
      if (weit === GEWINN) return GEWINN;
      if (weit !== REMIS) alleRemis = false;
    }
  }
  return alleRemis ? REMIS : UNBEKANNT;
}

/** Wertet die Züge der schwachen Seite aus: Remis, sobald ein Zug remis hält. */
function werteSchwach(tabelle: Uint8Array, stark: Square, schwach: Square, bauer: Square): number {
  let zuege = 0;
  let alleGewinn = true;
  for (const ziel of NACHBARN[schwach] ?? []) {
    if (abstand(ziel, stark) <= 1 || bauerGreiftAn(bauer, ziel)) continue;
    zuege += 1;
    // Schlägt der König den ungedeckten Bauern, bleibt König gegen König: remis.
    if (ziel === bauer) return REMIS;
    const wert = tabelle[index(STARK_AM_ZUG, stark, ziel, bauer)];
    if (wert === REMIS) return REMIS;
    if (wert !== GEWINN) alleGewinn = false;
  }
  if (zuege === 0) return bauerGreiftAn(bauer, schwach) ? GEWINN : REMIS;
  return alleGewinn ? GEWINN : UNBEKANNT;
}

/** Ein Durchgang über alle offenen Stellungen; gibt zurück, ob sich etwas geändert hat. */
function durchgang(tabelle: Uint8Array): boolean {
  let geaendert = false;
  for (let i = 0; i < GROESSE; i += 1) {
    if (tabelle[i] !== UNBEKANNT) continue;
    const bauer = bauernfeld(i % BAUERNFELDER);
    const schwach = Math.floor(i / BAUERNFELDER) % FELDER;
    const stark = Math.floor(i / (BAUERNFELDER * FELDER)) % FELDER;
    const amZug = Math.floor(i / (BAUERNFELDER * FELDER * FELDER));
    const wert =
      amZug === STARK_AM_ZUG
        ? werteStark(tabelle, stark, schwach, bauer)
        : werteSchwach(tabelle, stark, schwach, bauer);
    if (wert !== UNBEKANNT) {
      tabelle[i] = wert;
      geaendert = true;
    }
  }
  return geaendert;
}

let gespeichert: Uint8Array | null = null;

/** Die Tabelle, beim ersten Gebrauch berechnet. Was danach offen bleibt, ist remis. */
function tabelle(): Uint8Array {
  if (gespeichert) return gespeichert;
  const neu = new Uint8Array(GROESSE);
  for (let i = 0; i < GROESSE; i += 1) {
    const bauer = bauernfeld(i % BAUERNFELDER);
    const schwach = Math.floor(i / BAUERNFELDER) % FELDER;
    const stark = Math.floor(i / (BAUERNFELDER * FELDER)) % FELDER;
    neu[i] = startzustand(Math.floor(i / (BAUERNFELDER * FELDER * FELDER)), stark, schwach, bauer);
  }
  while (durchgang(neu)) {
    // weiter, bis sich nichts mehr ändert
  }
  for (let i = 0; i < GROESSE; i += 1) if (neu[i] === UNBEKANNT) neu[i] = REMIS;
  gespeichert = neu;
  return neu;
}

/** Die Teile einer KPK-Stellung, oder null, wenn es keine ist. */
function teile(brett: Board): { bauer: Square; farbe: Color } | null {
  if (brett.occupied.size() !== 3 || brett.king.size() !== 2 || brett.pawn.size() !== 1) {
    return null;
  }
  const bauer = brett.pawn.first();
  const farbe = bauer === undefined ? undefined : brett.get(bauer)?.color;
  return bauer === undefined || farbe === undefined ? null : { bauer, farbe };
}

/**
 * Ist das eine Stellung König und Bauer gegen König?
 *
 * Beispiel: Abb. 8.23 (Kg2, Bd2 gegen Kf7) ja; Abb. 8.53 (vier Bauern) nein.
 */
export function istKpk(brett: Board): boolean {
  return teile(brett) !== null;
}

/**
 * Gewinnt die Bauernseite in dieser Stellung König und Bauer gegen König?
 *
 * Warum: Die Faustregeln des Kapitels 8 (Opposition, Schlüsselfelder, Quadrat) beschreiben genau
 * dieses Endspiel; die Datenbank sagt, welcher Zug das Ergebnis wirklich hält.
 * Eingaben: Brett, Seite am Zug. Ausgabe: „gewinn“ oder „remis“ aus Sicht der Bauernseite; null,
 * wenn es keine KPK-Stellung ist oder die Stellung ungültig ist (etwa der Gegner im Schach).
 * Beispiel: Abb. 8.23 (Weiß am Zug) → gewinn; Abb. 8.19 (Weiß am Zug) → remis; Abb. 8.28
 * (Schwarz am Zug) → remis, Abb. 8.27 (dieselbe Stellung, Weiß am Zug) → gewinn.
 * Sonderfall: Ein Bauer auf der 7. Reihe, der sicher umwandelt, zählt sofort als Gewinn.
 */
export function kpkErgebnis(brett: Board, amZug: Color): KpkErgebnis | null {
  const kpk = teile(brett);
  if (!kpk) return null;
  const starkFeld = brett.kingOf(kpk.farbe);
  const schwachFeld = brett.kingOf(gegner(kpk.farbe));
  if (starkFeld === undefined || schwachFeld === undefined) return null;
  const senkrecht = kpk.farbe === "white" ? 0 : SPIEGEL_SENKRECHT;
  const waagrecht = squareFile(kpk.bauer) < BAUERNLINIEN ? 0 : SPIEGEL_WAAGRECHT;
  const norm = (feld: Square): Square => feld ^ senkrecht ^ waagrecht;
  const bauer = norm(kpk.bauer);
  if (squareRank(bauer) < ZWEITE_REIHE || squareRank(bauer) > SIEBTE_REIHE) return null;
  const zug = amZug === kpk.farbe ? STARK_AM_ZUG : SCHWACH_AM_ZUG;
  const wert = tabelle()[index(zug, norm(starkFeld), norm(schwachFeld), bauer)];
  if (wert === UNGUELTIG) return null;
  return wert === GEWINN ? "gewinn" : "remis";
}
