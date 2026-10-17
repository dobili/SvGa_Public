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
 * - Stufe 1 bis 3 (seit 0.2.52, Empfehlung R4, engine/menschlich.ts): volle Stärke bis zu einer
 *   Tiefengrenze (3, 5, 7 Halbzüge: Taktik dahinter sieht die Engine nicht) und gewichtete Wahl
 *   unter den Kandidaten mit einer Temperatur (1,0, 0,7, 0,45 Bauerneinheiten: kleine Fehler
 *   oft, große selten). Dazu die Fehlerprofile des Konzepts (jeder dritte, vierte, achte Zug)
 *   mit fallendem Höchstverlust, die erklärbare Fehler liefern. Bis 0.2.51: Skill Level 0, die
 *   „flache Suche“ aus Konzept 8.2 (Tiefe 1), die alles Einzügige fehlerfrei spielte.
 * - Stufe 4: Skill Level 3, „selten ein typischer Fehler“ (Konzept 8.2): jeder sechzehnte Zug.
 * - Stufe 5 bis 7: Skill Level 6, 10 und 15 ohne Fehlerprofile; Stufe 8 volle Stärke.
 * Wer hier ändert, ändert nur diese Tabelle; die Oberfläche liest Namen und Nummer.
 * Abhängigkeiten: engine/engineDienst.ts (Staerke), i18n (Namen).
 */
import type { Textschluessel } from "../i18n/sprache";
import { VOLLE_STAERKE, type Staerke } from "./engineDienst";
import type { Menschlich } from "./menschlich";

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
  /** Gewichtete Zugwahl mit Temperatur (Stufen 1 bis 3); null: der beste Zug der Grundstärke. */
  readonly menschlich: Menschlich | null;
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

/** Tiefengrenzen und Temperaturen der Stufen 1 bis 3 (engine/menschlich.ts). */
const TIEFE_STUFE_1 = 3;
const TIEFE_STUFE_2 = 5;
const TIEFE_STUFE_3 = 7;
const TEMPERATUR_STUFE_1 = 1.0;
const TEMPERATUR_STUFE_2 = 0.7;
const TEMPERATUR_STUFE_3 = 0.45;
/** So viele Kandidaten rechnet die Engine für die gewichtete Wahl. */
const KANDIDATEN_MENSCHLICH = 6;

function menschlich(tiefe: number, temperatur: number): Pick<Stufe, "staerke" | "menschlich"> {
  return {
    staerke: { art: "tiefe", tiefe },
    menschlich: { temperatur, kandidaten: KANDIDATEN_MENSCHLICH },
  };
}

/** Die Skill Level von Stockfish je Stufe (0 bis 20; 20 ist die volle Stärke). */
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
  ...menschlich(TIEFE_STUFE_1, TEMPERATUR_STUFE_1),
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
    ...menschlich(TIEFE_STUFE_2, TEMPERATUR_STUFE_2),
    fehlerquote: JEDER_VIERTE,
    hoechstverlust: TURM,
    damenopferErlaubt: false,
    rechenzeitMs: 400,
  },
  {
    nummer: 3,
    name: "stufe.3",
    ...menschlich(TIEFE_STUFE_3, TEMPERATUR_STUFE_3),
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
    menschlich: null,
  },
  {
    nummer: 5,
    name: "stufe.5",
    staerke: skill(SKILL_STUFE_5),
    fehlerquote: NIE,
    hoechstverlust: 0,
    damenopferErlaubt: false,
    rechenzeitMs: 800,
    menschlich: null,
  },
  {
    nummer: 6,
    name: "stufe.6",
    staerke: skill(SKILL_STUFE_6),
    fehlerquote: NIE,
    hoechstverlust: 0,
    damenopferErlaubt: false,
    rechenzeitMs: 1000,
    menschlich: null,
  },
  {
    nummer: 7,
    name: "stufe.7",
    staerke: skill(SKILL_STUFE_7),
    fehlerquote: NIE,
    hoechstverlust: 0,
    damenopferErlaubt: false,
    rechenzeitMs: 1500,
    menschlich: null,
  },
  {
    nummer: 8,
    name: "stufe.8",
    staerke: VOLLE_STAERKE,
    fehlerquote: NIE,
    hoechstverlust: 0,
    damenopferErlaubt: false,
    rechenzeitMs: 2000,
    menschlich: null,
  },
];

/** Die Stufe zu einer Nummer; unbekannte Nummern (alte Daten) ergeben Stufe 1. */
/**
 * Der nächste Schritt von einer Stufe zur Zielstufe, um höchstens eine Stufe je Zug (Wunsch des
 * Autors, 0.2.40: Beim Wechsel der Phase ändert sich die Stärke Zug für Zug, nicht ruckartig).
 * Beispiel: Eröffnung Stufe 1, Mittelspiel Stufe 4 → im ersten Zug des Mittelspiels 2, dann 3, dann 4.
 */
export function naechsteStufe(von: Stufennummer, ziel: Stufennummer): Stufennummer {
  if (von === ziel) return ziel;
  return (von < ziel ? von + 1 : von - 1) as Stufennummer;
}

export function stufe(nummer: number): Stufe {
  return STUFEN.find((s) => s.nummer === nummer) ?? EINSTEIGER;
}
