/**
 * Eine Variante abfragen: „Welcher Zug kommt jetzt?“ Zug für Zug, eine Seite spielt der Leser,
 * die andere die App; die Abzweige kommen nacheinander dran.
 *
 * Rolle im Gesamtbild: Variationsbrowser, Stufe 4 (Konzept „später denkbar“, Wunsch des Autors
 * vom 1.11.2026): wie der Repertoire-Trainer, aber auf dem eigenen Zugbaum. Genutzt im Bildschirm
 * „Variante abfragen“ und in der Abfrage der Lernsammlung (Plan und verknüpfte Varianten). Jeder
 * Weg vom Startpunkt bis zum Ende eines Astes ist eine Linie, die Hauptvariante zuerst. Ab der
 * zweiten Linie spielt die App den gemeinsamen Anfang mit der vorigen Linie selbst; gefragt wird
 * erst ab dem Abzweig. Gespeichert wird nichts (zählt für keine Wertung). Reine Funktionen.
 * Abhängigkeiten: chessops (Typ Color), schach/variationsbaum.ts.
 * Buchbezug: Kapitel 2, „Deine Entscheidung: Welche Eröffnungen spielst du?“ (Varianten üben);
 * Kapitel 12, Lernsammlung abfragen.
 */
import type { Color } from "chessops/types";
import { fortsetzungenAm, pfadImBaum, type Pfad, type Zugbaum } from "../schach/variationsbaum";

/** Eine Linie der Abfrage: der ganze Weg ab der Wurzel und ab wo gefragt wird. */
export interface Abfragelinie {
  readonly pfad: Pfad;
  /** Ab diesem Halbzug (Index in ``pfad``) fragt die App; davor zieht sie selbst. */
  readonly ab: number;
}

/** Stand der Abfrage; jede Änderung gibt einen neuen Stand. */
export interface Abfragestand {
  readonly linie: number;
  /** So viele Züge der Linie stehen auf dem Brett. */
  readonly stelle: number;
  /** Falsche Versuche am aktuellen Zug. */
  readonly fehlerHier: number;
  /** Der Zug ist als Pfeil gezeigt (nach einem Fehler oder „Zug zeigen“). */
  readonly gezeigt: boolean;
  /** Züge, die auf Anhieb stimmten, und alle gefragten Züge. */
  readonly richtig: number;
  readonly gefragt: number;
  /** Die Linie ist geschafft; „Nächste Linie“ geht weiter. */
  readonly linieFertig: boolean;
  readonly fertig: boolean;
}

/** Antwort auf einen Zug des Lesers. */
export type Abfrageantwort =
  /** Der Zug der Linie. */
  | "richtig"
  /** Ein anderer Zug, der an dieser Stelle auch in der Variante steht (kommt in einer anderen Linie). */
  | "andere"
  | "falsch";

/** Was die Abfrage über den Baum wissen muss. */
export interface Abfrage {
  readonly baum: Zugbaum;
  readonly linien: readonly Abfragelinie[];
  readonly seite: Color;
}

/** Zieht Weiß den Halbzug mit diesem Index (ab der Startstellung des Baums)? */
function weissZieht(startFen: string, index: number): boolean {
  const weissBeginnt = startFen.split(" ")[1] !== "b";
  return (index % 2 === 0) === weissBeginnt;
}

/** Ist der Halbzug mit diesem Index ein Zug des Lesers? */
export function lesersZug(abfrage: Pick<Abfrage, "baum" | "seite">, index: number): boolean {
  return weissZieht(abfrage.baum.startFen, index) === (abfrage.seite === "white");
}

/** Alle Wege vom Pfad bis zum Ende eines Astes, Hauptvariante zuerst. */
function wegeAb(baum: Zugbaum, pfad: Pfad): Pfad[] {
  const weiter = fortsetzungenAm(baum, pfad);
  if (weiter.length === 0) return [pfad];
  return weiter.flatMap((k) => wegeAb(baum, [...pfad, k.zug]));
}

/** Wie viele Züge zwei Wege am Anfang gemeinsam haben. */
function gemeinsam(a: Pfad, b: Pfad): number {
  let i = 0;
  while (i < a.length && a[i] === b[i]) i += 1;
  return i;
}

/**
 * Die Linien der Abfrage ab einem Startpunkt für eine Seite.
 *
 * Warum: „Abzweige nacheinander“ (Wunsch des Autors): Jede Linie fragt nur, was neu ist; den
 * gemeinsamen Anfang mit der vorigen Linie zieht die App. Linien ohne eigenen Zug des Lesers ab
 * dort fallen weg (nichts zu fragen).
 * Beispiel: Petroff ab der Grundstellung mit 3... d6 und 3... Sxe4?!, Seite Schwarz → zwei Linien;
 * die zweite fragt ab 3... Sxe4.
 * Sonderfall: Ein Pfad, der nicht im Baum steht, ergibt keine Linien.
 */
export function abfragelinien(baum: Zugbaum, start: Pfad, seite: Color): Abfragelinie[] {
  if (!pfadImBaum(baum, start)) return [];
  const wege = wegeAb(baum, start);
  const linien: Abfragelinie[] = [];
  wege.forEach((pfad, i) => {
    const vorige = wege[i - 1];
    const ab = Math.max(start.length, vorige ? gemeinsam(pfad, vorige) : 0);
    const zuFragen = pfad.some((_, index) => index >= ab && lesersZug({ baum, seite }, index));
    if (zuFragen) linien.push({ pfad, ab });
  });
  return linien;
}

/** Die Stelle des nächsten Zuges des Lesers ab ``stelle`` (Züge der Gegenseite zieht die App). */
function naechsteFrage(abfrage: Abfrage, linie: Abfragelinie, stelle: number): number {
  let i = stelle;
  while (i < linie.pfad.length && !lesersZug(abfrage, i)) i += 1;
  return i;
}

/** Der Stand am Anfang einer Linie (oder fertig, wenn es keine mehr gibt). */
function anLinie(abfrage: Abfrage, alt: Pick<Abfragestand, "richtig" | "gefragt">, linie: number) {
  const l = abfrage.linien[linie];
  const stelle = l ? naechsteFrage(abfrage, l, l.ab) : 0;
  return { ...alt, linie, stelle, fehlerHier: 0, gezeigt: false, linieFertig: false, fertig: !l };
}

/** Der Anfang der Abfrage: erste Linie, die App zieht bis zum ersten Zug des Lesers. */
export function abfrageAnfang(abfrage: Abfrage): Abfragestand {
  return anLinie(abfrage, { richtig: 0, gefragt: 0 }, 0);
}

/** Der gesuchte Zug im aktuellen Stand; null, wenn nichts gefragt ist. */
export function gesuchterZug(abfrage: Abfrage, stand: Abfragestand): string | null {
  if (stand.fertig || stand.linieFertig) return null;
  return abfrage.linien[stand.linie]?.pfad[stand.stelle] ?? null;
}

/** Die Züge, die auf dem Brett stehen (Pfad ab der Wurzel). */
export function gezogeneZuege(abfrage: Abfrage, stand: Abfragestand): Pfad {
  return abfrage.linien[stand.linie]?.pfad.slice(0, stand.stelle) ?? [];
}

const ohneSchach = (san: string) => san.replace(/[+#]$/, "");

/**
 * Prüft einen Zug des Lesers (Kurznotation, wie chessops sie schreibt).
 * Beispiel: gefragt 3... d6, gezogen 3... Sxe4 (steht auch im Baum) → „andere“; 3... De7 → „falsch“.
 */
export function pruefeAbfragezug(abfrage: Abfrage, stand: Abfragestand, san: string): Abfrageantwort {
  const gesucht = gesuchterZug(abfrage, stand);
  if (gesucht !== null && ohneSchach(gesucht) === ohneSchach(san)) return "richtig";
  const daneben = fortsetzungenAm(abfrage.baum, gezogeneZuege(abfrage, stand));
  return daneben.some((k) => ohneSchach(k.zug) === ohneSchach(san)) ? "andere" : "falsch";
}

/**
 * Der Stand nach einer Antwort: richtig → Zug und Antwort der Gegenseite, am Ende der Linie
 * „geschafft“; falsch → Fehler zählt, der Zug wird gezeigt; anders → nichts ändert sich.
 */
export function nachAntwort(abfrage: Abfrage, stand: Abfragestand, antwort: Abfrageantwort): Abfragestand {
  if (antwort === "andere") return stand;
  if (antwort === "falsch") return { ...stand, fehlerHier: stand.fehlerHier + 1, gezeigt: true };
  const linie = abfrage.linien[stand.linie];
  if (!linie) return stand;
  const aufAnhieb = stand.fehlerHier === 0 && !stand.gezeigt;
  const stelle = naechsteFrage(abfrage, linie, stand.stelle + 1);
  const ende = stelle >= linie.pfad.length;
  return {
    ...stand,
    stelle: ende ? linie.pfad.length : stelle,
    fehlerHier: 0,
    gezeigt: false,
    richtig: stand.richtig + (aufAnhieb ? 1 : 0),
    gefragt: stand.gefragt + 1,
    linieFertig: ende,
  };
}

/** „Zug zeigen“: der gesuchte Zug als Pfeil; der Zug zählt dann nicht als „auf Anhieb“. */
export function mitGezeigtemZug(stand: Abfragestand): Abfragestand {
  return { ...stand, gezeigt: true };
}

/** „Nächste Linie“ nach einer geschafften Linie; nach der letzten ist die Abfrage fertig. */
export function naechsteLinie(abfrage: Abfrage, stand: Abfragestand): Abfragestand {
  return anLinie(abfrage, stand, stand.linie + 1);
}
