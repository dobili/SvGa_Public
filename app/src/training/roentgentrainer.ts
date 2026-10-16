/**
 * Schach-Röntgen-Trainer (Kapitel 1): Der Leser markiert Schachs, Schläge und Drohungen beider
 * Seiten, die App gleicht ab und zeigt, was fehlte.
 *
 * Rolle im Gesamtbild: Trainer „roentgen“ (Pflichtenheft 7, AP 13). Die Lösung kommt aus
 * derselben Rechnung wie das Werkzeug „Röntgen“ (k1-roentgen.ts, Stellungsprofil). Die Aufgabe
 * hat drei Schritte in der Reihenfolge der Regel:
 *   1. deine Schachs, 2. deine Schläge, 3. was der Gegner hätte, wenn er jetzt am Zug wäre
 *      (seine Schachs und Schläge ohne Verlust; seine Drohungen sind genau diese Schläge mit
 *      Gewinn und seine Matts).
 * Die eigenen drohenden Züge (Frage 3 für die eigene Seite) zeigt die App nach der Aufgabe nur
 * an; sie sind oft zu viele, um sie vollständig zu markieren. Reine Funktionen.
 * Abhängigkeiten: analyse/stellungsprofil.ts, schach/drohungen.ts, training/zufall.ts.
 * Buchbezug: Kapitel 1, „Dein eingebauter Fehler-Radar: die Schach-Röntgen-Regel“.
 */
import { makeFen } from "chessops/fen";
import type { Color } from "chessops/types";
import { profil } from "../analyse/stellungsprofil";
import { nullzug, type Zugangabe } from "../schach/drohungen";
import { feldname, gegner, type Stellung } from "../schach/stellung";
import type { Buchstellung } from "./buchstellungen";
import { mische, type Zufall } from "./zufall";

/** Höchstens so viele Pfeile soll eine Aufgabe verlangen; mehr wäre auf dem Handy mühsam. */
export const HOECHSTENS_PFEILE = 10;
/** Mindestens so viele, sonst ist die Aufgabe zu leer. */
const MINDESTENS_PFEILE = 2;

export type Roentgenschritt = "schachs" | "schlaege" | "gegner";
export const SCHRITTE: readonly Roentgenschritt[] = ["schachs", "schlaege", "gegner"];

/** Ein Pfeil als Text „von-nach“, etwa „f3-e5“. */
export type Pfeil = string;

/** Was in einem Schritt verlangt ist und was zusätzlich nicht falsch ist. */
export interface Schrittloesung {
  /** Die Seite, deren Züge markiert werden. */
  readonly farbe: Color;
  /** Diese Pfeile gehören dazu. */
  readonly verlangt: readonly Pfeil[];
  /** Schläge, die Material verlieren: Wer sie markiert, liegt nicht falsch, muss aber nicht. */
  readonly erlaubt: readonly Pfeil[];
}

export interface Roentgenaufgabe {
  readonly nummer: string;
  readonly fen: string;
  readonly eigen: Color;
  readonly schritte: Readonly<Record<Roentgenschritt, Schrittloesung>>;
  /** Eigene Züge, die etwas drohen (nur zur Anzeige nach der Aufgabe). */
  readonly drohende: readonly Pfeil[];
}

/** Der Pfeil eines Zuges; Rochaden zählen nicht (sie geben in Buchstellungen kaum Schach). */
function pfeil(zug: Zugangabe): Pfeil | null {
  if (zug.san.startsWith("O-O")) return null;
  return `${feldname(zug.von)}-${feldname(zug.nach)}`;
}

function pfeile(zuege: readonly Zugangabe[]): Pfeil[] {
  return [...new Set(zuege.map(pfeil).filter((p): p is Pfeil => p !== null))];
}

/**
 * Die Röntgen-Aufgabe zu einer Stellung, aus Sicht der Seite am Zug.
 *
 * Sonderfälle: Steht die Seite am Zug im Schach, entfällt die Frage nach dem Gegner; solche
 * Stellungen sind keine Aufgabe (null), ebenso Stellungen mit zu wenigen oder zu vielen Pfeilen.
 */
export function roentgenaufgabe(buch: Buchstellung): Roentgenaufgabe | null {
  const { stellung } = buch;
  if (!stellung.regeln || stellung.regeln.isCheck()) return null;
  const p = profil(stellung);
  const eigen = stellung.amZug;
  const andere = gegner(eigen);
  const schlaege = p.schlaegeVon(eigen) ?? [];
  const gegnerSchlaege = p.schlaegeVon(andere) ?? [];
  const schritte: Record<Roentgenschritt, Schrittloesung> = {
    schachs: { farbe: eigen, verlangt: pfeile(p.schachsVon(eigen) ?? []), erlaubt: [] },
    schlaege: {
      farbe: eigen,
      verlangt: pfeile(schlaege.filter((s) => s.bilanz >= 0)),
      erlaubt: pfeile(schlaege.filter((s) => s.bilanz < 0)),
    },
    gegner: {
      farbe: andere,
      verlangt: pfeile([...(p.schachsVon(andere) ?? []), ...gegnerSchlaege.filter((s) => s.bilanz >= 0)]),
      erlaubt: pfeile(gegnerSchlaege.filter((s) => s.bilanz < 0)),
    },
  };
  const anzahl = SCHRITTE.reduce((summe, s) => summe + schritte[s].verlangt.length, 0);
  if (anzahl < MINDESTENS_PFEILE || anzahl > HOECHSTENS_PFEILE) return null;
  const drohende = pfeile(p.erzwingend()?.drohende ?? []);
  return { nummer: buch.nummer, fen: stellung.fen, eigen, schritte, drohende };
}

/** Eine Runde Röntgen-Aufgaben aus zufälligen Buchstellungen. */
export function roentgenrunde(
  stellungen: readonly Buchstellung[],
  anzahl: number,
  zufall: Zufall,
): Roentgenaufgabe[] {
  const runde: Roentgenaufgabe[] = [];
  for (const buch of mische(stellungen, zufall)) {
    const aufgabe = roentgenaufgabe(buch);
    if (aufgabe) runde.push(aufgabe);
    if (runde.length >= anzahl) break;
  }
  return runde;
}

/** Ergebnis eines Schrittes: gefunden, fehlend, falsch markiert. */
export interface Schrittvergleich {
  readonly gefunden: readonly Pfeil[];
  readonly fehlend: readonly Pfeil[];
  readonly falsch: readonly Pfeil[];
  readonly richtig: boolean;
}

/**
 * Gleicht die Pfeile des Lesers mit der Lösung ab.
 *
 * Beispiel: verlangt [„f3-e5“], erlaubt [„d1-d7“], markiert [„f3-e5“, „d1-d7“] → richtig.
 */
export function vergleicheSchritt(
  loesung: Schrittloesung,
  markiert: readonly Pfeil[],
): Schrittvergleich {
  const gefunden = loesung.verlangt.filter((p) => markiert.includes(p));
  const fehlend = loesung.verlangt.filter((p) => !markiert.includes(p));
  const falsch = markiert.filter((p) => !loesung.verlangt.includes(p) && !loesung.erlaubt.includes(p));
  return { gefunden, fehlend, falsch, richtig: fehlend.length === 0 && falsch.length === 0 };
}

/**
 * Die Stellung als FEN mit einer bestimmten Seite am Zug (für die Eingabe der gegnerischen
 * Züge: „als wäre er jetzt noch einmal am Zug“, Konzept 7.2).
 */
export function fenMitZugrecht(stellung: Stellung, farbe: Color): string {
  if (!stellung.regeln || stellung.amZug === farbe) return stellung.fen;
  return makeFen(nullzug(stellung.regeln, farbe).toSetup());
}
