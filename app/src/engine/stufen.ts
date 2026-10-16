/**
 * Die acht Spielstufen der Engine mit Namen und Verfahren (Konzept 8.2, Pflichtenheft 5.2).
 *
 * Rolle im Gesamtbild: Die Stufe entscheidet, wie die Engine im Spiel ihren Zug wählt
 * (engine/zugwahl.ts). Stufen 1 bis 3 schwächt die App selbst mit Fehlerprofilen (typische
 * Anfängerfehler, protokolliert für die Auswertung), ab Stufe 4 die Engine mit ihrer eingebauten
 * Stärkebegrenzung („Skill Level“, dann Elo-Begrenzung), Stufe 8 spielt voll.
 *
 * PLATZHALTER (AP 11, Opus, 15.10.2026): Die Zahlen sind die Startwerte aus Konzept 8.2, nicht
 * kalibriert. Fehlerquoten, Rechenzeiten, Skill- und Elo-Werte stimmt Fable in AP 11 ab („Die
 * Stufen werden grob kalibriert. Der Autor prüft im Test, ob sich die Abstufung richtig anfühlt“).
 * Wer hier ändert, ändert nur diese Tabelle; die Oberfläche liest Namen und Nummer.
 * Abhängigkeiten: engine/engineDienst.ts (Staerke), i18n (Namen).
 */
import type { Textschluessel } from "../i18n/sprache";
import type { Staerke } from "./engineDienst";

export type Stufennummer = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/** Wie eine Stufe ihren Zug findet. */
export type Verfahren =
  /** Bester Zug der vollen Engine, aber mit der Quote ein typischer Fehlerzug (Stufen 1 bis 3). */
  | {
      readonly art: "profil";
      readonly fehlerquote: number;
      /** Größter erlaubter Verlust eines Fehlerzuges in Bauerneinheiten (Konzept 8.2). */
      readonly hoechstverlust: number;
    }
  /** Eingebaute Stärkebegrenzung der Engine (Stufen 4 bis 8). */
  | { readonly art: "engine"; readonly staerke: Staerke };

export interface Stufe {
  readonly nummer: Stufennummer;
  readonly name: Textschluessel;
  readonly verfahren: Verfahren;
  /** Rechenzeit je Zug in Millisekunden (Konzept 8.1: höchstens 2 bis 3 Sekunden). */
  readonly rechenzeitMs: number;
}

/** Fehlerquoten aus Konzept 8.2: etwa jeder dritte, vierte, achte Zug. */
const JEDER_DRITTE = 1 / 3;
const JEDER_VIERTE = 1 / 4;
const JEDER_ACHTE = 1 / 8;
/** Ab Stufe 2 kein grundloses Damenopfer (Konzept 8.2): höchstens ein Turm Verlust. */
const DAME = 9;
const TURM = 5;
const LEICHTFIGUR = 3;

const EINSTEIGER: Stufe = {
  nummer: 1,
  name: "stufe.1",
  verfahren: { art: "profil", fehlerquote: JEDER_DRITTE, hoechstverlust: DAME },
  rechenzeitMs: 300,
};

export const STUFEN: readonly Stufe[] = [
  EINSTEIGER,
  {
    nummer: 2,
    name: "stufe.2",
    verfahren: { art: "profil", fehlerquote: JEDER_VIERTE, hoechstverlust: TURM },
    rechenzeitMs: 400,
  },
  {
    nummer: 3,
    name: "stufe.3",
    verfahren: { art: "profil", fehlerquote: JEDER_ACHTE, hoechstverlust: LEICHTFIGUR },
    rechenzeitMs: 500,
  },
  {
    nummer: 4,
    name: "stufe.4",
    verfahren: { art: "engine", staerke: { art: "skill", stufe: 3 } },
    rechenzeitMs: 600,
  },
  {
    nummer: 5,
    name: "stufe.5",
    verfahren: { art: "engine", staerke: { art: "skill", stufe: 8 } },
    rechenzeitMs: 800,
  },
  {
    nummer: 6,
    name: "stufe.6",
    verfahren: { art: "engine", staerke: { art: "elo", elo: 1600 } },
    rechenzeitMs: 1000,
  },
  {
    nummer: 7,
    name: "stufe.7",
    verfahren: { art: "engine", staerke: { art: "elo", elo: 2000 } },
    rechenzeitMs: 1500,
  },
  {
    nummer: 8,
    name: "stufe.8",
    verfahren: { art: "engine", staerke: { art: "voll" } },
    rechenzeitMs: 2000,
  },
];

/** Die Stufe zu einer Nummer; unbekannte Nummern (alte Daten) ergeben Stufe 1. */
export function stufe(nummer: number): Stufe {
  return STUFEN.find((s) => s.nummer === nummer) ?? EINSTEIGER;
}
