/**
 * Kurzes Antippen des Steuerkreuzes = genau ein Schritt (Spieltest „einstieg“, 15.11.2026, R7).
 *
 * Warum: Kinder tippen oft nur kurz. Gemessen: 80 ms Druck bewegte den Helden gar nicht (er lief
 * ein paar Pixel und blieb auf seiner Kachel stehen), erst ab etwa 120 ms ein Feld. Wie in
 * Rollenspielen mit Feldern läuft der Held deshalb nach dem Loslassen bis zur Mitte der nächsten
 * Kachel weiter, solange er seine Kachel beim Loslassen noch nicht verlassen hatte. Wer hält,
 * läuft wie bisher; die Tastatur bleibt unverändert (dort gibt es das Problem nicht).
 * Rolle im Gesamtbild: reine Logik für oberwelt/szene.ts (getestet in tippschritt.test.ts).
 * Abhängigkeiten: keine.
 */

/** Blickrichtung wie in szene.ts (Weltposition["richtung"]). */
type Richtung = "oben" | "unten" | "links" | "rechts";

/** Ein Punkt in Kachelpixeln (Mitte des Helden). */
export interface Punkt {
  readonly x: number;
  readonly y: number;
}

/** Ein laufender Tippschritt: Richtung und Zielpunkt (Mitte der Nachbarkachel). */
export interface Tippschritt {
  readonly richtung: Richtung;
  readonly ziel: Punkt;
}

/** Versatz je Richtung in Kacheln. */
const VERSATZ: Readonly<Record<Richtung, Punkt>> = {
  oben: { x: 0, y: -1 },
  unten: { x: 0, y: 1 },
  links: { x: -1, y: 0 },
  rechts: { x: 1, y: 0 },
};

/** Die Kachel eines Punkts („x,y“), um Druckbeginn und Loslassen zu vergleichen. */
export function kachelVon(punkt: Punkt, kachel: number): string {
  return `${Math.floor(punkt.x / kachel)},${Math.floor(punkt.y / kachel)}`;
}

/**
 * Der Tippschritt beim Loslassen, oder null, wenn der Held seine Kachel schon verlassen hat.
 * Eingaben: Richtung, Kachel beim Drücken („x,y“), Mitte des Helden jetzt, Kachelgröße.
 * Beispiel: Druck auf „rechts“ auf Kachel 4,5, nach 80 ms losgelassen bei x = 75 → Ziel ist die
 * Mitte von Kachel 5,5 (x = 88, y = 88).
 * Sonderfall: Schon auf der Nachbarkachel → null (der Druck war lang genug, nichts nachlaufen).
 */
export function tippschrittBeimLoslassen(
  richtung: Richtung,
  kachelBeimDruck: string,
  jetzt: Punkt,
  kachel: number,
): Tippschritt | null {
  if (kachelVon(jetzt, kachel) !== kachelBeimDruck) return null;
  const v = VERSATZ[richtung];
  const mitte = (wert: number, schritt: number) =>
    (Math.floor(wert / kachel) + schritt) * kachel + kachel / 2;
  return { richtung, ziel: { x: mitte(jetzt.x, v.x), y: mitte(jetzt.y, v.y) } };
}

/**
 * Hat der Held das Ziel erreicht oder überschritten? Dann setzt die Szene ihn genau auf das Ziel.
 * Beispiel: Richtung „rechts“, Ziel x = 88, Held bei x = 88,4 → ja.
 */
export function zielErreicht(schritt: Tippschritt, jetzt: Punkt): boolean {
  const v = VERSATZ[schritt.richtung];
  const rest = (schritt.ziel.x - jetzt.x) * v.x + (schritt.ziel.y - jetzt.y) * v.y;
  return rest <= 0;
}
