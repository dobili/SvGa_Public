/**
 * Laufhilfe quer zur Laufrichtung: wohin der Held seitlich rückt, während er geht.
 *
 * Warum: Bisher rückte der Held beim Gehen immer sanft zur Mitte seiner Kachel, damit er an Ecken
 * von Möbeln und Wänden nicht hängen bleibt (auf dem Handy trifft man selten genau). Mit feinen
 * Sperren (Karteneditor 1.6, feinsperren.ts) kann eine Lücke aber 12 Pixel breit sein und neben der
 * Kachelmitte liegen: Der Held (12 Pixel) passt hindurch, die Mitte zöge ihn aber an die Kante. Die
 * Pipeline (pipeline/abenteuer/engstelle.py) nennt solche Lücken begehbar; damit das Spiel
 * übereinstimmt, gleitet der Held bis zu 4 Pixel neben die Mitte, wenn dort vor ihm frei ist.
 * Rolle: reine Logik für oberwelt/szene.ts (rueckeZurMitte); die Zellkarte baut sperrkarte.ts.
 * Abhängigkeiten: keine.
 * Beispiel: Kachel 6 (96..112) mit gesperrtem rechten Viertel (108..112) vor dem Helden, Mitte 104 →
 * Ziel 102 (Körper 96..108).
 */

/** Halbe Breite des Heldenkörpers in Pixeln (12 × 12, szene.ts und figurbilder.ts). */
export const KOERPER_HALB = 6;
/** Kantenlänge einer Zelle in Pixeln (vier Zellen je Kachel, feinsperren.ts). */
const ZELLE = 4;
/** Höchstens so weit gleitet der Held neben die Kachelmitte. */
const SPIEL = 4;

type Richtung = "oben" | "unten" | "links" | "rechts";

/**
 * Die Querlage, zu der der Held rücken soll (x beim Gehen nach oben oder unten, sonst y).
 * Eingaben: Mitte des Körpers in Pixeln, Laufrichtung, Kachelgröße, Abfrage „ist diese Zelle frei?“
 * (Zellen von 4 Pixeln). Ausgabe: die Kachelmitte, wenn der Körper dort vor sich frei hat, sonst
 * die nächste Lage höchstens 4 Pixel daneben, die frei ist; ohne solche wieder die Kachelmitte.
 * Sonderfall: Ohne Sperren vor dem Helden ändert sich nichts gegenüber der alten Laufhilfe.
 */
export function querziel(
  mitte: { readonly x: number; readonly y: number },
  richtung: Richtung,
  kachel: number,
  frei: (zx: number, zy: number) => boolean,
): number {
  const senkrecht = richtung === "oben" || richtung === "unten";
  const quer = senkrecht ? mitte.x : mitte.y;
  const passt = (q: number): boolean => passtVor(mitte, richtung, q, frei);
  const kachelmitte = Math.floor(quer / kachel) * kachel + kachel / 2;
  if (passt(kachelmitte)) return kachelmitte;
  for (let d = 1; d <= SPIEL; d++) {
    for (const q of [kachelmitte - d, kachelmitte + d]) if (passt(q)) return q;
  }
  return kachelmitte;
}

/**
 * Hat der Körper in Querlage `q` die nächsten 4 Pixel vor sich frei (Zellen von 4 Pixeln)?
 * Eingaben wie querziel; `q` ist x beim Gehen nach oben oder unten, sonst y.
 * Auch für das Rutschen an Wänden beim Schräglaufen (schraeglauf.ts).
 * Beispiel: Körper bei (102, 100), Lücke 96..108 über ihm → nach oben bei q = 102 frei.
 */
export function passtVor(
  mitte: { readonly x: number; readonly y: number },
  richtung: Richtung,
  q: number,
  frei: (zx: number, zy: number) => boolean,
): boolean {
  const senkrecht = richtung === "oben" || richtung === "unten";
  const laengs = senkrecht ? mitte.y : mitte.x;
  // Die Zellreihen der nächsten 4 Pixel vor dem Körper (vorn: oben oder links ist kleiner).
  const vorn = richtung === "oben" || richtung === "links" ? -1 : 1;
  const kante = vorn < 0 ? laengs - KOERPER_HALB - 1 : laengs + KOERPER_HALB;
  const reihen = [Math.floor(kante / ZELLE), Math.floor((kante + vorn * (ZELLE - 1)) / ZELLE)];
  for (let z = Math.floor((q - KOERPER_HALB) / ZELLE); z * ZELLE < q + KOERPER_HALB; z++) {
    for (const r of reihen) if (!(senkrecht ? frei(z, r) : frei(r, z))) return false;
  }
  return true;
}
