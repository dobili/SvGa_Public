/**
 * Elo-Zahl der Stufen und der vorgefertigten Bots (erzeugt vom Messlauf
 * engine/botstaerke.messung.ts am 2026-10-21, nicht von Hand ändern).
 *
 * Rolle im Gesamtbild: Daten für engine/botstaerke.ts. Elo-Leiter aus den Ergebnissen der
 * Bot-Messung, verankert an Stufen, die gegen sich selbst spielten, über die Rechnung von
 * „Deine Spielstärke“. Herleitung und Unsicherheit: docs/ENTSCHEIDUNGEN.md, „Elo-Zahl der Bots“.
 * Abhängigkeiten: engine/stufen.ts (Typ).
 */
import type { Stufennummer } from "./stufen";

export const STUFEN_STAERKE: Readonly<Record<Stufennummer, number>> = {
  1: 248,
  2: 396,
  3: 715,
  4: 1046,
  5: 1348,
  6: 1702,
  7: 2136,
  8: 2444,
  9: 2699,
  10: 2966,
};

export const BOT_STAERKE: Readonly<Record<string, number>> = {
  ella: 222,
  marie: 294,
  tom: 266,
  luis: 266,
  "oma-erna": 251,
  henry: 251,
  lina: 744,
  moritz: 638,
  "opa-heinz": 506,
  "onkel-bernd": 638,
  clara: 456,
  "herr-krause": 689,
  leyla: 506,
  jakob: 726,
  johanna: 947,
  rolf: 930,
  derya: 1016,
  svenja: 1016,
  felix: 880,
  marco: 1052,
  ronja: 1132,
  "herr-wolff": 1048,
  pia: 1099,
  yusuf: 1165,
  holger: 1116,
  dennis: 1083,
  "frau-albrecht": 1065,
  philipp: 1439,
  mara: 1439,
  "herr-kuehn": 1439,
  samira: 1309,
  erik: 1474,
  guenter: 1542,
  "frau-romero": 1474,
  lars: 1783,
  katrin: 1822,
  "herr-vogel": 1723,
  nele: 1614,
  simon: 1681,
  "frau-demir": 1763,
  jana: 1842,
  igor: 1999,
  miriam: 2022,
  "herr-hartmann": 1975,
  defne: 1948,
  luca: 1919,
  "frau-sommer": 1975,
  david: 2065,
  "doktor-falk": 2495,
  "trainer-maier": 2479,
  amaya: 2395,
  "herr-lorenz": 2447,
  elias: 2413,
  "frau-wagner": 2413,
  arjun: 2689,
  "frau-prof-reich": 2616,
  "gm-novak": 2723,
  "im-becker": 2706,
  "wgm-tanaka": 2689,
  "fm-duarte": 3012,
  "gm-ivanova": 2977,
  "im-kraft": 3012,
  "wim-okafor": 2994,
  "gm-berglund": 2960,
  kiki: 429,
  "onkel-otto": 822,
  "tante-hilde": 935,
  bodo: 1179,
};

/** Was die Uhr je Bedenkzeit („300+3“) und Stufe kostet (Elo, meist negativ; seit 0.2.117). */
export const UHR_ABZUG: Readonly<Record<string, Readonly<Record<number, number>>>> = {
  "180+0": {
    1: -265,
    2: -265,
    3: -265,
    4: -265,
    5: -265,
    6: -265,
    7: -265,
    8: -265,
    9: -265,
    10: -265,
  },
  "180+2": { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0 },
  "1800+20": { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0 },
  "300+3": { 1: -2, 2: -2, 3: -2, 4: -2, 5: -2, 6: -2, 7: -2, 8: -2, 9: -2, 10: -2 },
  "600+0": { 1: -98, 2: -98, 3: -98, 4: -98, 5: -98, 6: -98, 7: -98, 8: -98, 9: -98, 10: -98 },
  "900+10": { 1: -16, 2: -16, 3: -16, 4: -16, 5: -16, 6: -16, 7: -16, 8: -16, 9: -16, 10: -16 },
};

/** Was alle Zusatzfehler der Menschen je Stufe kosten (Elo, negativ; seit 0.2.117). */
export const ZUSATZ_ABZUG: Readonly<Partial<Record<Stufennummer, number>>> = {
  1: 0,
  2: 0,
  3: -58,
  4: -23,
  5: -176,
  6: -280,
  7: -382,
  8: -512,
  9: -382,
  10: -512,
};
