/**
 * Hilfe für die Tests „Fehler mit Buchbezug“: die ausgewertete Opernpartie gegen Derya wie in den
 * Oberflächentests (tests/e2e/auswertungpartie.ts, Werte erfunden): ein Fehler 8. Sc3? (besser
 * 8. Dxb7), ein Patzer 12. O-O-O?? (besser 12. Lxd7+). Kein Test im Namen, damit Vitest die Datei
 * nicht als Testdatei sammelt.
 */
import { zugurteile, type Zugurteil } from "./auswertung";
import type { Auswertungsdaten } from "./buchzuege";
import { neuePartie, ziehe, type Partie, type Partiezug } from "./partie";

const SANS =
  "e4 e5 Nf3 d6 d4 Bg4 dxe5 Bxf3 Qxf3 dxe5 Bc4 Nf6 Qb3 Qe7 Nc3 c6 Bg5 b5 Nxb5 cxb5 Bxb5+ Nbd7 O-O-O Rd8 Rxd7 Rxd7 Rd1 Qe6 Bxd7+ Nxd7 Qb8+ Nxb8 Rd8#".split(
    " ",
  );
const UCIS =
  "e2e4 e7e5 g1f3 d7d6 d2d4 c8g4 d4e5 g4f3 d1f3 d6e5 f1c4 g8f6 f3b3 d8e7 b1c3 c7c6 c1g5 b7b5 c3b5 c6b5 c4b5 b8d7 e1c1 a8d8 d1d7 d8d7 h1d1 e7e6 b5d7 f6d7 b3b8 d7b8 d1d8".split(
    " ",
  );
/** Wert je Stellung aus Sicht von Weiß (erfunden); Matt am Ende. */
const WERTE = [
  0.3, 0.3, 0.3, 0.3, 0.5, 0.5, 0.8, 0.8, 1.2, 1.2, 1.2, 1.2, 1.5, 1.5, 1.6, 0.2, 0.4, 0.4, 3.5,
  3.5, 3.5, 3.5, 3.6, -1.5, 4.0, 4.0, 4.0, 4.0, 6, 6, 8, 8, 10, 10,
];
/** Beste Züge, wo sie vom gespielten abweichen. */
const ANDERS: Readonly<Record<number, string>> = { 14: "b3b7", 22: "b5d7", 23: "e7e6" };

/** Index des Fehlers 8. Sc3? und des Patzers 12. O-O-O??. */
export const SC3 = 14;
export const OOO = 22;

/** Die Partie mit Weiß als Leser und Schwarz als Engine. */
function opernpartie(): Partie {
  let partie: Partie | null = neuePartie(
    {
      startFen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      eigeneFarbe: "white",
      stufe: 2,
      stufenJePhase: { eroeffnung: 1, mittelspiel: 1, endspiel: 1 },
      uhr: null,
      ruecknahmeErlaubt: false,
      abbildung: null,
      gegner: "engine",
      bot: null,
      hilfen: { symbole: false, werkzeuge: false },
      gewertet: false,
      eroeffnung: null,
    },
    "oper",
    "2026-10-31T10:00:00.000Z",
  );
  for (const [i, san] of SANS.entries()) {
    const von = i % 2 === 0 ? "leser" : "engine";
    const zug: Partiezug = { san, von, quelle: von, fehler: null, verlust: 0 };
    partie = partie ? ziehe(partie, zug) : null;
  }
  if (!partie) throw new Error("Opernpartie nicht spielbar");
  return partie;
}

/** Auswertung der Opernpartie (Varianten nur der beste Zug, wie in den Oberflächentests). */
export function opernauswertung(): Auswertungsdaten {
  const beste = [...UCIS.map((u, i) => ANDERS[i] ?? u), ""];
  return {
    partie: opernpartie(),
    werte: WERTE,
    beste,
    abstaende: WERTE.map(() => 0),
    varianten: beste.map((b) => (b ? [b] : [])),
  };
}

/** Die Urteile der Opernpartie. */
export function opernurteile(d: Auswertungsdaten): Zugurteil[] {
  return zugurteile(d.partie, d.werte, d.beste, d.abstaende ?? []);
}
