/**
 * Begleiter auf Wegen (Wunsch des Autors, 25.11.2026): Eine Figur, die mit dem Helden unterwegs ist,
 * geht wirklich hinter ihm her, über die Strecke und die Kartenwechsel hinweg, wie die Kette in
 * klassischen Rollenspielen. Vorher sagte das Tagebuch „mit Juno nach Cedar Creek“, und am Obststand
 * legte Juno einen Dollar in die Dose, aber Juno war nicht da.
 *
 * Gesteuert aus Ink über die Dialogvariable `begleiter` (Kurznamen wie im Tag `#sprecher`, mehrere
 * mit Komma: „juno“ oder „juno,mutter“; leer: niemand). Sie liegt im Spielstand wie jede
 * Dialogvariable. Solange eine Figur begleitet, steht sie nicht zugleich an ihrem Platz auf der
 * Karte (oberwelt/gefolgedaten.ts blendet sie dort aus).
 *
 * Rolle im Gesamtbild: reine Regeln ohne Phaser. oberwelt/gefolgeschicht.ts zeichnet, die Prüfung
 * pipeline/abenteuer/anwesenheit.py zählt Begleiter als anwesend.
 * Dazu kommen Begleiter je Ort aus orte.json (Feld `begleiter` mit Bedingung, 26.11.2026): Juno ab
 * dem Ende von Akt 1 auf den Reisen, Mama ab Desert Springs. So folgt die Figur auf jedem Weg dorthin,
 * auch mit Bus oder Zug, ohne dass jede Reise in Ink gesetzt werden muss.
 * Abhängigkeiten: regeln/bedingung.ts.
 */
import { erfuellt } from "./bedingung";

/** Name der Dialogvariable mit den Begleitern. */
export const BEGLEITER_VARIABLE = "begleiter";

/** So viele Schritte (Felder) geht der erste Begleiter hinter dem Helden, jeder weitere einen mehr. */
export const FOLGEABSTAND = 1;

/** Ein Feld der Karte in Kachelkoordinaten. */
export interface Spurfeld {
  readonly x: number;
  readonly y: number;
}

/**
 * Die Begleiter aus den Dialogvariablen, in ihrer Reihenfolge, ohne Leeres und Doppeltes.
 * Beispiel: { begleiter: "juno, mutter" } → ["juno", "mutter"]; { begleiter: "" } → [].
 * Sonderfall: kein Text (fehlt, Zahl) → [].
 */
export function begleiterAus(variablen: Readonly<Record<string, unknown>>): string[] {
  const wert = variablen[BEGLEITER_VARIABLE];
  if (typeof wert !== "string") return [];
  const namen = wert
    .split(",")
    .map((n) => n.trim())
    .filter(Boolean);
  return [...new Set(namen)];
}

/**
 * Weichen die Begleiter nach einem Gespräch (begleiterFuer) von denen ab, mit denen die Karte
 * aufgestellt ist? Beispiel: Karte ohne Begleiter, danach ["juno"] → ja (neu aufstellen).
 */
export function begleiterGeaendert(
  aufgestellt: readonly string[],
  nachher: readonly string[],
): boolean {
  return aufgestellt.join(",") !== nachher.join(",");
}

/**
 * Die Spur des Helden: die zuletzt betretenen Felder, das neueste zuerst. Ein Begleiter steht auf
 * dem Feld `abstand` Schritte hinter dem Helden; so geht er denselben Weg (um Ecken, durch Türen)
 * und läuft nie durch Wände.
 * Beispiel: Held geht von (5, 5) nach (6, 5) und (7, 5) → Spur [(7,5), (6,5), (5,5)];
 * ziel(1) = (6, 5).
 */
export class Spur {
  private felder: Spurfeld[];

  /** Beginnt mit dem Feld des Helden und dem Feld, auf dem der Begleiter erscheint. */
  constructor(held: Spurfeld, begleiter: readonly Spurfeld[] = []) {
    this.felder = [held, ...begleiter];
  }

  /**
   * Merkt das Feld des Helden, wenn es neu ist; die Spur wird nie länger als nötig.
   * Schräg (Joystick, 26.11.2026), nur mit `frei` (Sperrkarte der Szene):
   * - Springt der Held über die Ecke auf ein schräges Nachbarfeld und ist eins der beiden Eckfelder
   *   gesperrt, kommt das freie dazwischen (eckfeld): Der Begleiter geht nicht durch die Wandecke.
   * - Läuft der Held eine Treppe (rechts, unten, rechts …) und sind beide Eckfelder frei, fällt die
   *   Stufe weg (glaette): Der Begleiter geht schräg hinterher wie der Held.
   * Ohne `frei` bleibt die Spur genau der Weg des Helden in Kachelschritten.
   * Beispiel mit freier Wiese: (5, 5) → (6, 5) → (6, 6) → Spur [(6,6), (5,5)].
   */
  merke(feld: Spurfeld, laenge: number, frei?: (x: number, y: number) => boolean): void {
    const erstes = this.felder[0];
    if (erstes && erstes.x === feld.x && erstes.y === feld.y) return;
    const ecke = erstes && frei ? eckfeld(erstes, feld, frei) : null;
    if (ecke) this.schiebe(ecke, laenge);
    this.schiebe(feld, laenge);
    if (frei) this.glaette(frei);
  }

  /** Nimmt die Stufe einer Treppe heraus, wenn die Schräge an beiden Ecken frei ist. */
  private glaette(frei: (x: number, y: number) => boolean): void {
    const [neu, stufe, alt] = this.felder;
    if (!neu || !stufe || !alt) return;
    if (Math.abs(neu.x - alt.x) !== 1 || Math.abs(neu.y - alt.y) !== 1) return;
    const andere = stufe.x === neu.x ? { x: alt.x, y: neu.y } : { x: neu.x, y: alt.y };
    if (frei(andere.x, andere.y) && frei(stufe.x, stufe.y)) this.felder.splice(1, 1);
  }

  /** Legt ein Feld vorn auf die Spur (mit Abschneiden beim Zurückgehen). */
  private schiebe(feld: Spurfeld, laenge: number): void {
    // Geht der Held auf ein Feld der Spur zurück, wird sie dort abgeschnitten: Der Begleiter
    // weicht dann nicht im Kreis aus, sondern bleibt hinter ihm.
    const zurueck = this.felder.findIndex((f) => f.x === feld.x && f.y === feld.y);
    const rest = zurueck >= 0 ? this.felder.slice(zurueck + 1) : this.felder;
    this.felder = [feld, ...rest].slice(0, laenge + 1);
  }

  /** Das Feld `abstand` Schritte hinter dem Helden; ist die Spur kürzer, ihr letztes Feld. */
  ziel(abstand: number): Spurfeld {
    const feld = this.felder[Math.min(abstand, this.felder.length - 1)];
    // Die Spur hat immer mindestens das Feld des Helden (Konstruktor).
    return feld ?? { x: 0, y: 0 };
  }
}

/**
 * Das Eckfeld, über das ein Begleiter zwischen zwei schräg benachbarten Feldern gehen muss: null,
 * wenn sie nicht schräg benachbart sind oder beide Eckfelder frei sind (dann geht er schräg);
 * sonst das freie (sind beide zu, das waagrechte).
 * Beispiel: (5, 5) → (6, 4), (6, 5) gesperrt → (5, 4); beide frei → null.
 */
export function eckfeld(
  von: Spurfeld,
  nach: Spurfeld,
  frei: (x: number, y: number) => boolean,
): Spurfeld | null {
  if (Math.abs(nach.x - von.x) !== 1 || Math.abs(nach.y - von.y) !== 1) return null;
  const waag = { x: nach.x, y: von.y };
  const senk = { x: von.x, y: nach.y };
  const waagFrei = frei(waag.x, waag.y);
  if (waagFrei && frei(senk.x, senk.y)) return null;
  return waagFrei || !frei(senk.x, senk.y) ? waag : senk;
}

/** Begleiter eines Orts mit Bedingung (orte.json, Feld `begleiter`). */
export interface Ortsbegleiter {
  readonly name: string;
  readonly wenn?: string;
}

/**
 * Die Begleiter auf einer Karte dieses Orts: aus der Dialogvariable, dazu die des Orts, deren
 * Bedingung gilt; ohne Doppelte, Ink zuerst.
 * Beispiel: Riverton mit { name: "juno", wenn: "endeAkt1Gesehen und nicht abschiedGesehen" } und
 * endeAkt1Gesehen → ["juno"]; in Maple Falls ohne Variable → [].
 */
export function begleiterFuer(
  ortsbegleiter: readonly Ortsbegleiter[] | undefined,
  variablen: Readonly<Record<string, unknown>>,
): string[] {
  const vomOrt = (ortsbegleiter ?? []).filter((b) => !b.wenn || erfuellt(b.wenn, variablen));
  return [...new Set([...begleiterAus(variablen), ...vomOrt.map((b) => b.name)])];
}

/** Blickrichtung wie in der Szene. */
export type Schrittblick = "oben" | "unten" | "links" | "rechts";

/**
 * Richtung eines Schritts von `von` nach `nach` (die größere Achse zählt); null bei gleichem Ort.
 * Beispiel: (5, 5) → (6, 5) „rechts“; (5, 5) → (5, 4) „oben“.
 */
export function schrittrichtung(
  von: { readonly x: number; readonly y: number },
  nach: { readonly x: number; readonly y: number },
): Schrittblick | null {
  const dx = nach.x - von.x;
  const dy = nach.y - von.y;
  if (dx === 0 && dy === 0) return null;
  if (Math.abs(dx) >= Math.abs(dy)) return dx > 0 ? "rechts" : "links";
  return dy > 0 ? "unten" : "oben";
}
