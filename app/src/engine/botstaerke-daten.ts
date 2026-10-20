/**
 * Elo-Zahl der Stufen und der vorgefertigten Bots: VORLÄUFIG (Wertung der Menschen, die die
 * Stufen nachspielen; bis die Messung der neuen Bots läuft, engine/botstaerke.messung.ts).
 *
 * Rolle im Gesamtbild: Daten für engine/botstaerke.ts. Nach der Messung erzeugt der Messlauf diese
 * Datei neu (Elo-Leiter, verankert an Stufen gegen sich selbst); nicht von Hand ändern.
 * Abhängigkeiten: engine/stufen.ts (Typ).
 */
import type { Stufennummer } from "./stufen";

export const STUFEN_STAERKE: Readonly<Record<Stufennummer, number>> = {
  1: 600,
  2: 900,
  3: 1200,
  4: 1500,
  5: 1800,
  6: 2100,
  7: 2400,
  8: 2800,
};

export const BOT_STAERKE: Readonly<Record<string, number>> = {
  kiki: 350,
  "onkel-otto": 440,
  "tante-hilde": 500,
  bodo: 550,
  ella: 600,
  marie: 700,
  tom: 600,
  luis: 700,
  "oma-erna": 700,
  henry: 700,
  lina: 600,
  moritz: 600,
  "opa-heinz": 1000,
  "onkel-bernd": 900,
  clara: 900,
  "herr-krause": 1000,
  leyla: 1000,
  jakob: 800,
  johanna: 900,
  rolf: 900,
  derya: 1200,
  svenja: 1200,
  felix: 1200,
  marco: 1300,
  ronja: 1200,
  "herr-wolff": 1200,
  pia: 1100,
  yusuf: 1300,
  holger: 1500,
  dennis: 1600,
  "frau-albrecht": 1600,
  philipp: 1400,
  mara: 1400,
  "herr-kuehn": 1500,
  samira: 1600,
  erik: 1500,
  guenter: 1900,
  "frau-romero": 1800,
  lars: 1800,
  katrin: 1800,
  "herr-vogel": 1800,
  nele: 1900,
  simon: 1700,
  "frau-demir": 1800,
  jana: 2100,
  igor: 2200,
  miriam: 2100,
  "herr-hartmann": 2100,
  defne: 2200,
  luca: 2000,
  "frau-sommer": 2100,
  david: 2100,
  "doktor-falk": 2400,
  "trainer-maier": 2400,
  amaya: 2433,
  "herr-lorenz": 2433,
  elias: 2300,
  "frau-wagner": 2400,
  arjun: 2300,
  "frau-prof-reich": 2400,
  "gm-novak": 2800,
  "im-becker": 2667,
  "wgm-tanaka": 2667,
  "fm-duarte": 2533,
  "gm-ivanova": 2800,
  "im-kraft": 2533,
  "wim-okafor": 2667,
  "gm-berglund": 2800,
};

/** Was die Uhr je Bedenkzeit („300+3“) und Stufe kostet (Elo, meist negativ; seit 0.2.116). */
export const UHR_ABZUG: Readonly<Record<string, Readonly<Record<number, number>>>> = {};
