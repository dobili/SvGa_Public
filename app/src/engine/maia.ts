/**
 * Maia-2 für die Zugwahl der Bots (0.2.143, Freigabe des Autors 25.10.2026): Wie wahrscheinlich
 * spielt ein Mensch dieser Wertung jeden legalen Zug? Die Wahrscheinlichkeit geht als Merkmal
 * „maia“ in das Wahlmodell ein (Variante C, engine/wahlmodell.ts).
 *
 * Rolle im Gesamtbild: Maia-2 (University of Toronto, MIT-Lizenz) ist ein neuronales Netz, das
 * an Lichess-Partien gelernt hat, welche Züge Menschen je Wertung spielen. Der Vergleich an
 * 320 000 Lichess-Stellungen (docs/ENTSCHEIDUNGEN.md, „Maia im Wahlmodell“) ergab: Mit Maia trifft
 * das Wahlmodell den gespielten Zug in 53 bis 55 % statt 40 bis 42 % der Stellungen, bei gleich
 * menschlichen Fehlerraten. Diese Datei bereitet die Stellung genau wie beim Training vor
 * (maia2.inference.preprocessing): Brett als 18 Ebenen zu 8 × 8, bei Schwarz am Zug gespiegelt,
 * Wertung als eine von elf Klassen, Ausgabe über die Zugliste des Trainings. Das Netz selbst
 * rechnet eine Laufzeit (onnxruntime-web in der App, engine/maia-web.ts; onnxruntime-node in der
 * Messung, engine/messung/maia-node.testhilfe.ts).
 * Sonderfall: Maia-2 ist ohne die ersten 10 Halbzüge einer Partie trainiert; davor gibt es keine
 * Werte (dort wählen Praxisbuch und Wahlmodell ohne Maia).
 * Abhängigkeiten: engine/maia-zuege-daten.ts, engine/wahlmodell-daten.ts (Typ), chessops.
 */
import { Chess } from "chessops/chess";
import { parseFen } from "chessops/fen";
import type { Square } from "chessops/types";
import { makeSquare, squareFile, squareRank } from "chessops/util";
import { MAIA_ZUEGE } from "./maia-zuege-daten";
import type { Wahltempo } from "./wahlmodell-daten";

/** Die zwei Netze von Maia-2; Klassisch rechnet mit dem Schnellschach-Netz (wie im Vergleich). */
export type Maiamodell = "blitz" | "rapid";

/** Erst ab diesem Halbzug (Training ohne die ersten zehn Halbzüge). */
export const MAIA_AB_HALBZUG = 10;
const EBENEN = 18;
const FELDER = 64;
/** Länge der Brett-Eingabe je Stellung. */
export const BRETTLAENGE = EBENEN * FELDER;
const EBENE_ZUG = 12;
const EBENE_ROCHADE = 13;
const EBENE_EN_PASSANT = 17;
/** Klassen der Wertung: unter 1100, je 100 bis 1999, ab 2000 (maia2.utils.map_to_category). */
const ELO_UNTEN = 1100;
const ELO_OBEN = 2000;
const ELO_SCHRITT = 100;
const LETZTE_KLASSE = (ELO_OBEN - ELO_UNTEN) / ELO_SCHRITT + 1;
const FIGURENEBENE: Readonly<Record<string, number>> = { p: 0, n: 1, b: 2, r: 3, q: 4, k: 5 };
const UMWANDLUNGEN = ["q", "r", "b", "n"] as const;
const ZUGINDEX = new Map<string, number>(MAIA_ZUEGE.map((zug, i) => [zug, i]));

/** Das Netz zur Zeitklasse: Blitz mit dem Blitz-Netz, sonst Schnellschach. */
export function maiamodellFuer(tempo: Wahltempo): Maiamodell {
  return tempo === "blitz" ? "blitz" : "rapid";
}

/** Halbzüge seit Partiebeginn laut FEN. Beispiel: „… w KQkq - 0 6“ → 10. */
export function halbzugAus(fen: string): number {
  const teile = fen.split(" ");
  const zugnummer = Number(teile[5] ?? 1);
  return (Number.isFinite(zugnummer) ? zugnummer - 1 : 0) * 2 + (teile[1] === "b" ? 1 : 0);
}

/** Die Klasse einer Wertung. Beispiel: 1050 → 0, 1500 → 5, 2400 → 10. */
export function eloKlasse(elo: number): number {
  if (elo < ELO_UNTEN) return 0;
  if (elo >= ELO_OBEN) return LETZTE_KLASSE;
  return 1 + Math.floor((elo - ELO_UNTEN) / ELO_SCHRITT);
}

function tauscheFarbe(zeichen: string): string {
  const klein = zeichen.toLowerCase();
  return zeichen === klein ? zeichen.toUpperCase() : klein;
}

/**
 * Die gespiegelte Stellung wie python-chess `Board.mirror()`: Reihen vertauscht, Farben
 * getauscht, Weiß am Zug, Rochaderechte und En-passant-Feld gespiegelt.
 * Beispiel: „4k3/8/8/8/8/8/4P3/4K3 b - - 0 1“ → „4k3/4p3/8/8/8/8/8/4K3 w - - 0 1“.
 */
export function gespiegelt(fen: string): string {
  const [brett = "", zug = "w", rochade = "-", ep = "-", halb = "0", voll = "1"] = fen.split(" ");
  const reihen = brett
    .split("/")
    .reverse()
    .map((r) => [...r].map(tauscheFarbe).join(""));
  const rechte =
    rochade === "-"
      ? "-"
      : ["K", "Q", "k", "q"].filter((r) => rochade.includes(tauscheFarbe(r))).join("") || "-";
  const epNeu = ep === "-" ? "-" : `${ep[0]}${ep[1] === "3" ? "6" : "3"}`;
  return [reihen.join("/"), zug === "w" ? "b" : "w", rechte, epNeu, halb, voll].join(" ");
}

/** Spiegelt einen Zug zurück (Reihen 1 ↔ 8). Beispiel: „e2e4“ → „e7e5“. */
export function gespiegelterZug(uci: string): string {
  const reihe = (r: string) => String(9 - Number(r));
  return `${uci[0]}${reihe(uci[1] ?? "1")}${uci[2]}${reihe(uci[3] ?? "1")}${uci.slice(4)}`;
}

/** Brett als 18 Ebenen: zwölf Figuren, Zug, vier Rochaderechte, En passant (Weiß am Zug). */
function brettEbenen(fen: string): Float32Array {
  const [brett = "", , rochade = "-", ep = "-"] = fen.split(" ");
  const ebenen = new Float32Array(BRETTLAENGE);
  brett.split("/").forEach((reihe, zeile) => {
    const rang = 7 - zeile;
    let linie = 0;
    for (const z of reihe) {
      if (/\d/.test(z)) {
        linie += Number(z);
        continue;
      }
      const ebene = (FIGURENEBENE[z.toLowerCase()] ?? 0) + (z === z.toUpperCase() ? 0 : 6);
      ebenen[ebene * FELDER + rang * 8 + linie] = 1;
      linie += 1;
    }
  });
  ebenen.fill(1, EBENE_ZUG * FELDER, (EBENE_ZUG + 1) * FELDER);
  ["K", "Q", "k", "q"].forEach((recht, i) => {
    const ebene = EBENE_ROCHADE + i;
    if (rochade.includes(recht)) ebenen.fill(1, ebene * FELDER, (ebene + 1) * FELDER);
  });
  if (ep !== "-") {
    const feld = (Number(ep[1]) - 1) * 8 + (ep.charCodeAt(0) - "a".charCodeAt(0));
    ebenen[EBENE_EN_PASSANT * FELDER + feld] = 1;
  }
  return ebenen;
}

/** Legale Züge in der Schreibweise von python-chess (Rochade als Königszug e1g1). */
function legaleZuege(fen: string): string[] {
  const setup = parseFen(fen);
  if (setup.isErr) return [];
  const stellung = Chess.fromSetup(setup.value);
  if (stellung.isErr) return [];
  const pos = stellung.value;
  const aus = new Set<string>();
  for (const [von, ziele] of pos.allDests()) {
    const figur = pos.board.get(von);
    for (const nach of ziele) {
      for (const zug of zugtexte(von, nach, figur?.role, pos.board.get(nach))) aus.add(zug);
    }
  }
  return [...aus];
}

/** Ein Zug als Text; Rochade (König auf eigenen Turm) als Königszug, Umwandlung viermal. */
function zugtexte(
  von: Square,
  nach: Square,
  rolle: string | undefined,
  ziel: { role: string; color: string } | undefined,
): string[] {
  const start = makeSquare(von);
  if (rolle === "king" && ziel?.role === "rook" && ziel.color === "white") {
    const rechts = squareFile(nach) > squareFile(von);
    return [`${start}${rechts ? "g" : "c"}${squareRank(von) + 1}`];
  }
  if (rolle === "pawn" && squareRank(nach) === 7)
    return UMWANDLUNGEN.map((u) => `${start}${makeSquare(nach)}${u}`);
  return [`${start}${makeSquare(nach)}`];
}

/** Eingabe des Netzes für eine Stellung und die legalen Züge mit ihrem Platz im Ausgang. */
export interface Maiaeingabe {
  readonly brett: Float32Array;
  /** Index im Ausgang und Zug in der Schreibweise der echten Stellung (vor dem Spiegeln). */
  readonly zuege: readonly { readonly index: number; readonly uci: string }[];
}

/**
 * Bereitet eine Stellung vor (maia2.inference.preprocessing). Schwarz am Zug: gespiegelt, die
 * Züge zurückgespiegelt. Ausgabe null ohne legalen Zug oder bei ungültiger FEN.
 */
export function maiaEingabe(fen: string): Maiaeingabe | null {
  const schwarz = fen.split(" ")[1] === "b";
  const weissSicht = schwarz ? gespiegelt(fen) : fen;
  const zuege = legaleZuege(weissSicht).flatMap((uci) => {
    const index = ZUGINDEX.get(uci);
    return index === undefined ? [] : [{ index, uci: schwarz ? gespiegelterZug(uci) : uci }];
  });
  return zuege.length === 0 ? null : { brett: brettEbenen(weissSicht), zuege };
}

/** Wahrscheinlichkeit je legalem Zug aus den Ausgaben des Netzes (Softmax über die legalen). */
export function wahrscheinlichkeitenAus(
  logits: Float32Array,
  eingabe: Maiaeingabe,
): Map<string, number> {
  const werte = eingabe.zuege.map((z) => logits[z.index] ?? Number.NEGATIVE_INFINITY);
  const maxi = Math.max(...werte);
  const ex = werte.map((w) => Math.exp(w - maxi));
  const summe = ex.reduce((a, b) => a + b, 0);
  return new Map(eingabe.zuege.map((z, i) => [z.uci, (ex[i] ?? 0) / summe]));
}

/** Rechnet das Netz für eine Stellung: Ausgang mit einem Wert je Zug der Zugliste. */
export interface Maialaufzeit {
  rechne(
    modell: Maiamodell,
    brett: Float32Array,
    eloSelbst: number,
    eloGegner: number,
  ): Promise<Float32Array>;
}

/** Woher ein Bot Maia-Werte bekommt: Laufzeit und Wertung des Gegners (fehlend: die eigene). */
export interface Maiaquelle {
  readonly laufzeit: Maialaufzeit;
  readonly gegnerwertung?: number;
}

/** Abfrage der Maia-Werte einer Stellung für einen Bot (null: ohne Maia wählen). */
export type Maiaabfrage = (fen: string) => Promise<ReadonlyMap<string, number> | null>;

/** Zuletzt gerechnete Stellungen je Laufzeit (Gruppenmodus: viele Bots, dieselbe Klasse). */
const ZWISCHENSPEICHER = new WeakMap<
  Maialaufzeit,
  Map<string, Promise<ReadonlyMap<string, number> | null>>
>();
const SPEICHER_GROESSE = 32;

/**
 * Maia-Wahrscheinlichkeiten der legalen Züge für einen Bot.
 * Eingaben: Laufzeit, Stellung, eigene Wertung und die des Gegners (in der Zeitklasse), Zeitklasse.
 * Ausgabe: Zug → Wahrscheinlichkeit, oder null vor Halbzug 10 und ohne legalen Zug.
 * Beispiel: nach 1. e4 e5 2. Sf3 Sc6 3. Lc4 Sf6 (Halbzug 6) → null; im Mittelspiel eine Karte.
 */
export async function maiawerte(
  laufzeit: Maialaufzeit,
  fen: string,
  eloSelbst: number,
  eloGegner: number,
  tempo: Wahltempo,
): Promise<ReadonlyMap<string, number> | null> {
  if (halbzugAus(fen) < MAIA_AB_HALBZUG) return null;
  const modell = maiamodellFuer(tempo);
  const selbst = eloKlasse(eloSelbst);
  const gegner = eloKlasse(eloGegner);
  const speicher = ZWISCHENSPEICHER.get(laufzeit) ?? new Map();
  ZWISCHENSPEICHER.set(laufzeit, speicher);
  const schluessel = `${modell}|${selbst}|${gegner}|${fen}`;
  const da = speicher.get(schluessel);
  if (da) return da;
  const neu = rechneStellung(laufzeit, modell, fen, selbst, gegner);
  neu.catch(() => speicher.delete(schluessel));
  speicher.set(schluessel, neu);
  if (speicher.size > SPEICHER_GROESSE) speicher.delete(speicher.keys().next().value ?? "");
  return neu;
}

async function rechneStellung(
  laufzeit: Maialaufzeit,
  modell: Maiamodell,
  fen: string,
  selbst: number,
  gegner: number,
): Promise<ReadonlyMap<string, number> | null> {
  const eingabe = maiaEingabe(fen);
  if (!eingabe) return null;
  return wahrscheinlichkeitenAus(
    await laufzeit.rechne(modell, eingabe.brett, selbst, gegner),
    eingabe,
  );
}

/** Die Abfrage eines Bots aus seiner Quelle, Wertung und Zeitklasse (für den Wahlkontext). */
export function maiaabfrage(quelle: Maiaquelle, wertung: number, tempo: Wahltempo): Maiaabfrage {
  // Ein Fehler der Laufzeit (Paket gelöscht, zu wenig Speicher) darf keinen Zug verhindern: Der
  // Bot wählt dann ohne Maia.
  return (fen) =>
    maiawerte(quelle.laufzeit, fen, wertung, quelle.gegnerwertung ?? wertung, tempo).catch(
      (fehler: unknown) => {
        console.warn("Maia nicht verfügbar, der Bot wählt ohne Maia:", fehler);
        return null;
      },
    );
}
