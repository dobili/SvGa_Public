/**
 * Die acht Spielstufen der Engine mit Namen und Verfahren (Konzept 8.2, Pflichtenheft 5.2).
 *
 * Rolle im Gesamtbild: Die Stufe entscheidet, wie die Engine im Spiel ihren Zug wählt
 * (engine/zugwahl.ts). Jede Stufe hat eine Grundstärke (die eingebaute Stärkebegrenzung von
 * Stockfish, „Skill Level“, oder volle Stärke) und bis Stufe 4 eine Fehlerquote: so oft spielt
 * die Engine statt ihres Zuges einen typischen Anfängerfehler aus den Fehlerprofilen
 * (engine/fehlersuche.ts), protokolliert für die Auswertung.
 *
 * Kalibrierung (AP 11, Fable, 16.10.2026), gemessen mit `npm run messen:stufen`
 * (skripte/messe-stufen.mjs, Partien Stufe gegen Stufe mit der echten Engine):
 * - Der „Skill Level“ von Stockfish 19 wählt den Zug an der Suchtiefe Level + 1 unter den vier
 *   besten Zügen gewichtet zufällig. Die Stärke hängt damit von der Tiefe ab, nicht vom Gerät:
 *   ein langsames Handy spielt auf Stufe 4 bis 7 genauso stark wie ein PC. Die Elo-Begrenzung
 *   („UCI_Elo“) rechnet Stockfish selbst in ein Skill Level um (1600 Elo entspricht etwa Level 2,
 *   2000 Elo etwa Level 4); sie ist deshalb hier nicht nötig, der Engine-Dienst kann sie weiter.
 * - Stufe 1 bis 3: Skill Level 0 ist die „flache Suche“ aus Konzept 8.2 (Tiefe 1); dazu die
 *   Fehlerquoten des Konzepts (jeder dritte, vierte, achte Zug) mit fallendem Höchstverlust.
 * - Stufe 4: Skill Level 3, „selten ein typischer Fehler“ (Konzept 8.2): jeder sechzehnte Zug.
 * - Stufe 5 bis 7: Skill Level 6, 10 und 15 ohne Fehlerprofile; Stufe 8 volle Stärke.
 * Wer hier ändert, ändert nur diese Tabelle; die Oberfläche liest Namen und Nummer.
 * Abhängigkeiten: engine/engineDienst.ts (Staerke), i18n (Namen).
 */
import type { Textschluessel } from "../i18n/sprache";
import { VOLLE_STAERKE, type Staerke } from "./engineDienst";

export type Stufennummer = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface Stufe {
  readonly nummer: Stufennummer;
  readonly name: Textschluessel;
  /** Grundstärke für die normalen Züge der Engine. */
  readonly staerke: Staerke;
  /** Anteil der Züge, die ein typischer Anfängerfehler sein sollen; 0: keine Fehlerprofile. */
  readonly fehlerquote: number;
  /** Größter erlaubter Verlust eines Fehlerzuges in Bauerneinheiten (Konzept 8.2). */
  readonly hoechstverlust: number;
  /**
   * Darf ein Fehlerzug die Dame grundlos hergeben? Konzept 8.2: „Ein grundloses Damenopfer gibt
   * es ab Stufe 2 nicht.“ Nur Stufe 1 darf das; engine/fehlersuche.ts prüft es ausdrücklich mit
   * der Abtauschrechnung, unabhängig vom Höchstverlust.
   */
  readonly damenopferErlaubt: boolean;
  /** Rechenzeit je Zug in Millisekunden (Konzept 8.1: höchstens 2 bis 3 Sekunden). */
  readonly rechenzeitMs: number;
}

/**
 * Fehlerwürfe für die Sollquoten aus Konzept 8.2 (etwa jeder dritte, vierte, achte Zug; Stufe 4
 * „selten“). Die Würfe liegen über dem Soll, weil die Fehlersuche nicht in jeder Stellung einen
 * Zug in den Grenzen der Stufe findet (ohne Damenopfer, Höchstverlust): Gemessen trafen 1/3, 1/4,
 * 1/8 und 1/16 nur 30 %, 18 %, 10 % und 5 % der Züge; mit 0,36, 0,33, 0,15 und 0,075 dann
 * 36 %, 29 %, 13 % und 6 % (16.10.2026, `npm run messen:stufen`). Stufe 1 und 2 danach leicht
 * gesenkt, erwartet etwa 34 % und 26 %.
 */
const JEDER_DRITTE = 0.34;
const JEDER_VIERTE = 0.3;
const JEDER_ACHTE = 0.15;
const JEDER_SECHZEHNTE = 0.075;
const NIE = 0;
/** Höchstverluste in Bauerneinheiten (Faustwerte aus Kapitel 1). */
const DAME = 9;
const TURM = 5;
const LEICHTFIGUR = 3;

/** Die Skill Level von Stockfish je Stufe (0 bis 20; 20 ist die volle Stärke). */
const SKILL_FLACH = 0;
const SKILL_STUFE_4 = 3;
const SKILL_STUFE_5 = 6;
const SKILL_STUFE_6 = 10;
const SKILL_STUFE_7 = 15;

function skill(stufe: number): Staerke {
  return { art: "skill", stufe };
}

const EINSTEIGER: Stufe = {
  nummer: 1,
  name: "stufe.1",
  staerke: skill(SKILL_FLACH),
  fehlerquote: JEDER_DRITTE,
  hoechstverlust: DAME,
  damenopferErlaubt: true,
  rechenzeitMs: 300,
};

export const STUFEN: readonly Stufe[] = [
  EINSTEIGER,
  {
    nummer: 2,
    name: "stufe.2",
    staerke: skill(SKILL_FLACH),
    fehlerquote: JEDER_VIERTE,
    hoechstverlust: TURM,
    damenopferErlaubt: false,
    rechenzeitMs: 400,
  },
  {
    nummer: 3,
    name: "stufe.3",
    staerke: skill(SKILL_FLACH),
    fehlerquote: JEDER_ACHTE,
    hoechstverlust: LEICHTFIGUR,
    damenopferErlaubt: false,
    rechenzeitMs: 500,
  },
  {
    nummer: 4,
    name: "stufe.4",
    staerke: skill(SKILL_STUFE_4),
    fehlerquote: JEDER_SECHZEHNTE,
    hoechstverlust: LEICHTFIGUR,
    damenopferErlaubt: false,
    rechenzeitMs: 600,
  },
  {
    nummer: 5,
    name: "stufe.5",
    staerke: skill(SKILL_STUFE_5),
    fehlerquote: NIE,
    hoechstverlust: 0,
    damenopferErlaubt: false,
    rechenzeitMs: 800,
  },
  {
    nummer: 6,
    name: "stufe.6",
    staerke: skill(SKILL_STUFE_6),
    fehlerquote: NIE,
    hoechstverlust: 0,
    damenopferErlaubt: false,
    rechenzeitMs: 1000,
  },
  {
    nummer: 7,
    name: "stufe.7",
    staerke: skill(SKILL_STUFE_7),
    fehlerquote: NIE,
    hoechstverlust: 0,
    damenopferErlaubt: false,
    rechenzeitMs: 1500,
  },
  {
    nummer: 8,
    name: "stufe.8",
    staerke: VOLLE_STAERKE,
    fehlerquote: NIE,
    hoechstverlust: 0,
    damenopferErlaubt: false,
    rechenzeitMs: 2000,
  },
];

/** Die Stufe zu einer Nummer; unbekannte Nummern (alte Daten) ergeben Stufe 1. */
export function stufe(nummer: number): Stufe {
  return STUFEN.find((s) => s.nummer === nummer) ?? EINSTEIGER;
}
