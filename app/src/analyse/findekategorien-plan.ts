/**
 * Finde-Kategorien aus Buchzügen und Faustregeln: F8 Buchzug deiner Eröffnung, F9
 * Eröffnungsziel (Rochade, Entwicklung, Zentrum), F10 am wenigsten aktive Figur (LAP).
 *
 * Rolle im Gesamtbild: Teil der Erkennungsschicht (findekategorien.ts). F8 ist ein genauer
 * Nachschlag im Eröffnungsindex der Kapitel 2 und 3. F9 und F10 sind Faustregeln: Sie gelten
 * nur in ruhigen Stellungen (Zugart „strategie“ wie bei der Spielstärke, spiel/taktik.ts), nur
 * ab einem halben Bauern Verlust und nur, wenn der beste Zug klar vor dem zweitbesten liegt
 * (Konzept, Abschnitt 5, Grenzen 1 und 2). Die Engine wählt ihren Zug nicht wegen einer
 * Faustregel; deshalb schweigen diese Kategorien lieber.
 * Abhängigkeiten: schach/eroeffnungsindex.ts, schach/aktivitaet.ts, schach/zielbilanz.ts,
 * spiel/taktik.ts, analyse/planfragen.ts, analyse/stellungsprofil.ts.
 * Buchbezug: Kapitel 1 (drei Eröffnungsziele), Kapitel 2 (Zielbilanz, Steckbriefe), Kapitel 3,
 * Kapitel 6 (Frage 3 „Welche Figur bringe ich dorthin?“, LAP).
 */
import { makeFen } from "chessops/fen";
import { parseSan } from "chessops/san";
import { makeSquare, squareFile } from "chessops/util";
import { zuHause } from "../schach/aktivitaet";
import {
  buchzuegeAb,
  stellungsschluessel,
  type Eroeffnungseintrag,
  type Eroeffnungsindex,
} from "../schach/eroeffnungsindex";
import { ZENTRUM } from "../schach/zielbilanz";
import { zugartVon } from "../spiel/taktik";
import {
  materialgewinn,
  type Findelage,
  type Findetreffer,
  type Halbzug,
} from "./findekategorien-lage";
import { lapVon } from "./planfragen";
import { profil } from "./stellungsprofil";

/** Bei der Rochade zieht der König mindestens zwei Linien weit (auch „König auf Turm“). */
const ROCHADE_LINIEN = 2;

/**
 * F8 Buchzug deiner Eröffnung: Die Stellung steht in einer Buchvariante, der gespielte Zug ist
 * kein Buchzug (mit „?“ markierte Buchzüge zählen nicht). Genannt werden der Buchzug (der beste
 * Zug der Engine, wenn er im Buch steht, sonst der erste) und die Eröffnung. Ob der Buchzug der
 * beste Zug der Engine ist, sagt die Kategorie nicht.
 *
 * Regel: Kapitel 2 und 3, Steckbriefe und Varianten.
 * Beispiel: nach 1. e4 e5 2. Sf3 spielt das Buch 2... Sc6; gespielt 2... a6 → Buchzug Nc6.
 * Sonderfall: Ohne Eröffnungsindex im Buchkontext schweigt F8.
 */
export function f8Buchzug(lage: Findelage): Findetreffer | null {
  const index = lage.eingabe.buchkontext?.eroeffnungsindex;
  if (!index) return null;
  const buchzuege = buchzuegeAb(index, lage.eingabe.fenVorher);
  if (buchzuege.length === 0 || buchzuege.includes(lage.gespielt.san)) return null;
  const buchzug = buchzuege.includes(lage.best.san) ? lage.best.san : buchzuege[0];
  if (!buchzug) return null;
  const eintrag = eintragZu(index, lage, buchzug);
  const abbildung = eintrag?.abbildung ? { abbildung: eintrag.abbildung } : {};
  const eroeffnung = eintrag ? { eroeffnung: eintrag.name } : {};
  return { kennung: "F8", details: { zug: lage.best.san, buchzug, ...eroeffnung, ...abbildung } };
}

/**
 * Der Eintrag des Index zur Stellung nach dem Buchzug, sonst der zur Stellung davor. Warum diese
 * Reihenfolge (Messlauf 7.11.2026): Nach 1. e4 e5 2. Sf3 Sc6 nannte die Karte zum Buchzug 3. d4
 * die „Spanische Partie“ (die Eröffnung der Stellung davor), obwohl der Buchzug woandershin führt.
 */
function eintragZu(
  index: Eroeffnungsindex,
  lage: Findelage,
  buchzug: string,
): Eroeffnungseintrag | null {
  const vorher = index.stellungen.get(stellungsschluessel(lage.eingabe.fenVorher))?.[0] ?? null;
  const zug = parseSan(lage.regeln, buchzug);
  if (!zug) return vorher;
  const danach = lage.regeln.clone();
  danach.play(zug);
  return index.stellungen.get(stellungsschluessel(makeFen(danach.toSetup())))?.[0] ?? vorher;
}

/** Gelten Faustregeln hier: ruhige Stellung, merklicher Verlust, kein knapper Zweitbester? */
function faustregelErlaubt(lage: Findelage): boolean {
  const { eingabe, schwellen } = lage;
  if (lage.verlust < schwellen.faustregelVerlustAb) return false;
  const abstand = eingabe.abstandZweitbester;
  if (abstand !== undefined && abstand < schwellen.abstandZweitbesterAb) return false;
  return zugartVon(eingabe.fenVorher) === "strategie";
}

/** Welches Eröffnungsziel ein Zug erfüllt: Rochade, Entwicklung einer Leichtfigur, Zentrum. */
function eroeffnungsziel(h: Halbzug): "rochade" | "entwicklung" | "zentrum" | null {
  const { figur, zug } = h;
  if (
    figur.role === "king" &&
    Math.abs(squareFile(zug.to) - squareFile(zug.from)) >= ROCHADE_LINIEN
  )
    return "rochade";
  const leicht = figur.role === "knight" || figur.role === "bishop";
  if (leicht && zuHause(zug.from, figur)) return "entwicklung";
  if (figur.role === "pawn" && ZENTRUM.includes(zug.to)) return "zentrum";
  return null;
}

/**
 * F9 Eröffnungsziel: Eröffnungsphase, ruhige Stellung. Der beste Zug rochiert, entwickelt eine
 * Leichtfigur vom Startfeld oder bringt einen Bauern nach d4, e4, d5 oder e5 (auch schlagend).
 * Der gespielte Zug erfüllt keines der drei Ziele.
 *
 * Regel: Kapitel 1, „Die drei Eröffnungsziele“; Kapitel 2, Zielbilanz.
 * Beispiel: nach 1. e4 e5 2. Sf3 Sc6 ist 3. Lc4 Entwicklung; gespielt 3. h3 erfüllt kein Ziel.
 */
export function f9Eroeffnungsziel(lage: Findelage): Findetreffer | null {
  if (lage.eingabe.phase !== "eroeffnung") return null;
  const ziel = eroeffnungsziel(lage.best);
  if (!ziel || eroeffnungsziel(lage.gespielt) !== null || !faustregelErlaubt(lage)) return null;
  const feld = makeSquare(lage.best.zug.to);
  return { kennung: "F9", details: { zug: lage.best.san, feld, ziel } };
}

/**
 * F10 Am wenigsten aktive Figur: Mittelspiel, ruhige Stellung. Der beste Zug zieht die Figur mit
 * den wenigsten freien Feldern (Reihenfolge des LAP-Werkzeugs), der gespielte Zug eine andere.
 * Hat der Fehler einen taktischen Grund (die Widerlegung gewinnt Material oder setzt matt), passt
 * die Faustregel nicht; dann gehört der Zug zu einer Warum-Kategorie W2 bis W7. Seit dem Messlauf
 * (7.11.2026) nur, wenn der beste Zug ruhig ist (kein Schlag, kein Schach) und die Figur höchstens
 * fünf freie Felder hat wie der Läufer c1 in Abb. 6.20 (FINDE_SCHWELLEN.lapFreieFelderBis).
 *
 * Regel: Kapitel 6, Frage 3 „Welche Figur bringe ich dorthin?“ (LAP-Prinzip).
 * Beispiel: Abb. 6.16: Der Springer d2 ist die am wenigsten aktive Figur von Weiß.
 */
export function f10Lap(lage: Findelage): Findetreffer | null {
  if (lage.eingabe.phase !== "mittelspiel") return null;
  const { best, gespielt, schwellen } = lage;
  if (best.zug.from === gespielt.zug.from) return null;
  const verlust = -materialgewinn(lage, lage.folgeGespielt, schwellen.motivMaterialNach);
  if (verlust >= schwellen.taktischerGrundAb) return null;
  // Ein Schlag oder Schach ist kein ruhiger Planzug; die Faustregel erklärt ihn nicht.
  if (best.geschlagen || best.nachher.isCheck()) return null;
  const fund = lapVon(profil(lage.stellung), lage.seite);
  if (!fund || fund.lap.stand.feld !== best.zug.from || !faustregelErlaubt(lage)) return null;
  if (fund.lap.freie.length > schwellen.lapFreieFelderBis) return null;
  return {
    kennung: "F10",
    details: {
      zug: best.san,
      feld: makeSquare(fund.lap.stand.feld),
      figur: fund.lap.stand.figur.role,
      freieFelder: fund.lap.freie.length,
    },
  };
}
