/**
 * Der Zugbaum einer Variante: Knoten finden, Zeile durch einen Pfad, Zug einfügen, zur
 * Hauptvariante machen, ab hier löschen, Zugdaten ändern, Abzweige zählen.
 *
 * Rolle im Gesamtbild: Verallgemeinert schach/variantenbaum.ts (Buchbeispiele, nur lesen) für die
 * eigenen Varianten (training/variationen.ts): Der Baum wächst mit jedem Zug des Lesers. Ein Pfad
 * ist wie dort die Liste der Züge (englische Kurznotation) ab der Startstellung; der leere Pfad ist
 * die Startstellung. Alle Funktionen sind rein und geben neue Bäume zurück, der alte bleibt
 * unverändert. Die Abzweigpunkte tragen später die Baum-Ansicht und die Karte (Stufe 2).
 * Abhängigkeiten: chessops, schach/notation.ts, training/variationen.ts (Typen).
 * Buchbezug: Kapitel 0, „Wie liest man Schachzüge?“ (Hauptvariante zuerst, „...“ für Schwarz).
 */
import { Chess } from "chessops/chess";
import { makeFen, parseFen } from "chessops/fen";
import { parseSan } from "chessops/san";
import type { Variationsknoten } from "../training/variationen";
import { sanInSprache } from "./notation";

/** Der Teil einer Variante, den der Baum braucht. */
export interface Zugbaum {
  readonly startFen: string;
  readonly zuege: readonly Variationsknoten[];
}

export type Pfad = readonly string[];

/** Ein Halbzug der Leiste, mit allem, was die Anzeige braucht. */
export interface Leistenzug {
  readonly san: string;
  /** Zug in der Sprache mit Zugzeichen („Sxe4?!“). */
  readonly text: string;
  readonly nummer: number;
  readonly weiss: boolean;
  /** Pfad bis einschließlich dieses Zuges. */
  readonly pfad: Pfad;
  /** Zahl der Fortsetzungen nach diesem Zug, wenn es mehr als eine gibt; sonst 0. */
  readonly abzweige: number;
  readonly kommentiert: boolean;
  /** Eigener Zug des Lesers (nicht aus Buch oder Partie). */
  readonly eigen: boolean;
}

/** Die Stellung als chessops-Objekt; null bei einer FEN ohne Regeln (Lehrbild ohne König). */
export function stellungAus(fen: string): Chess | null {
  const setup = parseFen(fen);
  if (setup.isErr) return null;
  const pos = Chess.fromSetup(setup.value);
  return pos.isOk ? pos.value : null;
}

/** Die Knoten entlang eines Pfades; null, wenn ein Zug im Baum nicht vorkommt. */
export function knotenEntlang(baum: Zugbaum, pfad: Pfad): Variationsknoten[] | null {
  const knoten: Variationsknoten[] = [];
  let auswahl = baum.zuege;
  for (const san of pfad) {
    const naechster = auswahl.find((k) => k.zug === san);
    if (!naechster) return null;
    knoten.push(naechster);
    auswahl = naechster.weiter;
  }
  return knoten;
}

/** Der Knoten am Ende des Pfades; null für die Startstellung oder einen fremden Pfad. */
export function knotenAm(baum: Zugbaum, pfad: Pfad): Variationsknoten | null {
  return knotenEntlang(baum, pfad)?.at(-1) ?? null;
}

/** Steht der Pfad im Baum? Der leere Pfad (Startstellung) immer. */
export function pfadImBaum(baum: Zugbaum, pfad: Pfad): boolean {
  return knotenEntlang(baum, pfad) !== null;
}

/** Die Fortsetzungen nach einem Pfad, die erste ist die Hauptvariante; [] bei fremdem Pfad. */
export function fortsetzungenAm(baum: Zugbaum, pfad: Pfad): readonly Variationsknoten[] {
  const knoten = knotenEntlang(baum, pfad);
  if (!knoten) return [];
  return knoten.at(-1)?.weiter ?? baum.zuege;
}

/** Der Pfad bis zum Ende der Hauptvariante ab hier (immer die erste Fortsetzung). */
export function hauptlinieBisEnde(baum: Zugbaum, pfad: Pfad): Pfad {
  const weg = [...pfad];
  for (let k = fortsetzungenAm(baum, pfad)[0]; k; k = k.weiter[0]) weg.push(k.zug);
  return weg;
}

/** Die Stellung nach einem Pfad als FEN; null, wenn der Pfad nicht im Baum steht. */
export function fenAm(baum: Zugbaum, pfad: Pfad): string | null {
  if (!pfadImBaum(baum, pfad)) return null;
  const pos = stellungAus(baum.startFen);
  if (!pos) return null;
  for (const san of pfad) {
    const zug = parseSan(pos, san);
    if (!zug) return null;
    pos.play(zug);
  }
  return makeFen(pos.toSetup());
}

/**
 * Die Zeile durch einen Pfad: die Züge bis dorthin, danach die Hauptvariante bis zum Ende.
 *
 * Warum: Die Leiste zeigt immer nur die Linie, auf der der Leser gerade ist (Frage b, Empfehlung
 * B); Abzweige zeigt eine Gabel-Marke mit Zahl hinter dem Zug.
 * Eingaben: Baum, Pfad, Sprache. Ausgabe: Halbzüge mit Nummer, Text, Abzweigen, Kommentar.
 * Beispiel aus dem Buch: Abb. 2.40 (Petroff) mit 3... Sxe4?! und 3... d6 → nach 3. Sxe5 die
 * Marke „2“, danach die Hauptvariante 3... d6 4. Sf3 …
 * Sonderfall: Ein unspielbarer Zug beendet die Zeile.
 */
export function zeileDurch(baum: Zugbaum, pfad: Pfad, sprachcode: string): Leistenzug[] {
  const weg = pfadImBaum(baum, pfad) ? hauptlinieBisEnde(baum, pfad) : [];
  const knoten = knotenEntlang(baum, weg) ?? [];
  const pos = stellungAus(baum.startFen);
  const zeile: Leistenzug[] = [];
  for (const k of knoten) {
    const zug = pos ? parseSan(pos, k.zug) : undefined;
    if (!pos || !zug) break;
    const weiss = pos.turn === "white";
    const nummer = pos.fullmoves;
    pos.play(zug);
    zeile.push({
      san: k.zug,
      text: sanInSprache(k.zug, sprachcode) + (k.zeichen ?? ""),
      nummer,
      weiss,
      pfad: weg.slice(0, zeile.length + 1),
      abzweige: k.weiter.length > 1 ? k.weiter.length : 0,
      kommentiert: (k.kommentar ?? "") !== "",
      eigen: k.herkunft === undefined,
    });
  }
  return zeile;
}

/** Der Teil des Pfades, der noch auf der Hauptvariante liegt (für „zurück zur Hauptvariante“). */
export function hauptvariantenAnteil(baum: Zugbaum, pfad: Pfad): Pfad {
  const anteil: string[] = [];
  let auswahl = baum.zuege;
  for (const san of pfad) {
    if (auswahl[0]?.zug !== san) break;
    anteil.push(san);
    auswahl = auswahl[0].weiter;
  }
  return anteil;
}

/** Zahl aller Züge (Knoten) eines Baums. */
export function knotenzahl(zuege: readonly Variationsknoten[]): number {
  return zuege.reduce((summe, k) => summe + 1 + knotenzahl(k.weiter), 0);
}

/** Zahl der Stellungen mit mehr als einer Fortsetzung, die Startstellung eingeschlossen. */
export function abzweigzahl(baum: Zugbaum): number {
  const zaehle = (zuege: readonly Variationsknoten[]): number =>
    (zuege.length > 1 ? 1 : 0) + zuege.reduce((s, k) => s + zaehle(k.weiter), 0);
  return zaehle(baum.zuege);
}

/** Ein Abzweig: Stellung mit mehreren Fortsetzungen (für Baum-Ansicht und Karte, Stufe 2). */
export interface Abzweigpunkt {
  readonly pfad: Pfad;
  readonly fortsetzungen: readonly string[];
  /** Wie viele Abzweige auf dem Weg dorthin liegen (0: auf der Hauptvariante). */
  readonly tiefe: number;
}

/**
 * Alle Abzweige des Baums in Lesereihenfolge (erst die Hauptvariante, dann die Nebenvarianten).
 * Beispiel: Petroff mit 3... d6 und 3... Sxe4?! → ein Punkt nach 3. Sxe5, Tiefe 0.
 */
export function abzweigpunkte(baum: Zugbaum): Abzweigpunkt[] {
  const punkte: Abzweigpunkt[] = [];
  const lauf = (zuege: readonly Variationsknoten[], pfad: Pfad, tiefe: number): void => {
    if (zuege.length > 1) punkte.push({ pfad, fortsetzungen: zuege.map((k) => k.zug), tiefe });
    zuege.forEach((k, i) => lauf(k.weiter, [...pfad, k.zug], i === 0 ? tiefe : tiefe + 1));
  };
  lauf(baum.zuege, [], 0);
  return punkte;
}
