/**
 * Sichtbarer Umriss der Sitzmöbel einer Karte: misst im geladenen Bild, welche Pixel nicht
 * durchsichtig sind, und legt das Ergebnis mit der Form des Möbels auf die Karte (sitzplatz.ts,
 * umrissInWelt). Warum: Ein Stuhl von LimeZu ist 16 × 32 groß, zeichnet aber nur die oberen
 * 22 Pixel; sitzende Figuren sollen an seine sichtbare Unterkante rücken (Spieltest Variante B,
 * 16.11.2026, F2). Die Vorschau misst dasselbe mit Pillow (pipeline/abenteuer/sitzplatz.py).
 * Rolle im Gesamtbild: Hilfe für szene.ts beim Aufbau; gemessen wird je Rahmen einmal.
 * Abhängigkeiten: Phaser, moebel.ts (rahmenname), sitzplatz.ts.
 */
import type Phaser from "phaser";
import { rahmenname, type Moebel } from "./moebel";
import { umrissInWelt, type Umriss } from "./sitzplatz";

/** Ab dieser Deckkraft (0–255) zählt ein Pixel als sichtbar (Schatten unter 40 nicht). */
const SICHTBAR_AB = 40;

/** Kleinstes Rechteck um alle sichtbaren Pixel eines RGBA-Felds, sonst null. */
export function umrissAusPixeln(
  daten: ArrayLike<number>,
  breite: number,
  hoehe: number,
): Umriss | null {
  let [links, oben, rechts, unten] = [breite, hoehe, -1, -1];
  for (let y = 0; y < hoehe; y += 1) {
    for (let x = 0; x < breite; x += 1) {
      if ((daten[(y * breite + x) * 4 + 3] ?? 0) < SICHTBAR_AB) continue;
      [links, oben] = [Math.min(links, x), Math.min(oben, y)];
      [rechts, unten] = [Math.max(rechts, x), Math.max(unten, y)];
    }
  }
  if (rechts < 0) return null;
  return { x: links, y: oben, breite: rechts - links + 1, hoehe: unten - oben + 1 };
}

/** Misst einen Rahmen einer geladenen Textur; ohne Bild oder Zeichenfläche null. */
function misseRahmen(rahmen: Phaser.Textures.Frame): Umriss | null {
  const bild = rahmen.source.image as CanvasImageSource | undefined;
  const [b, h] = [rahmen.cutWidth, rahmen.cutHeight];
  if (!bild || b <= 0 || h <= 0) return null;
  const flaeche = document.createElement("canvas");
  [flaeche.width, flaeche.height] = [b, h];
  const pinsel = flaeche.getContext("2d", { willReadFrequently: true });
  if (!pinsel) return null;
  pinsel.drawImage(bild, rahmen.cutX, rahmen.cutY, b, h, 0, 0, b, h);
  return umrissAusPixeln(pinsel.getImageData(0, 0, b, h).data, b, h);
}

/**
 * Liefert zu einem Möbel seinen sichtbaren Umriss in Kartenpixeln (für sitzmoebelAus). Gemessen
 * wird jeder Rahmen einmal. Beispiel: mf8SchulstuhlRechts bei (85, 117) → 88, 118, 12 × 21.
 * Sonderfall: Rahmen fehlt oder ist leer → null (dann gilt das ganze Rechteck).
 */
export function sichtbarMesser(szene: Phaser.Scene): (m: Moebel) => Umriss | null {
  const gemessen = new Map<string, Umriss | null>();
  return (m) => {
    const name = rahmenname(m);
    if (!szene.textures.exists(m.schluessel)) return null;
    const rahmen = szene.textures.getFrame(m.schluessel, name);
    if (!rahmen) return null;
    const schluessel = `${m.schluessel}|${name ?? ""}`;
    if (!gemessen.has(schluessel)) gemessen.set(schluessel, misseRahmen(rahmen));
    const innen = gemessen.get(schluessel);
    if (!innen) return null;
    const lage = m.form
      ? {
          mitteX: m.x + m.angabe.breite / 2,
          mitteY: m.y + m.angabe.hoehe / 2,
          massstab: m.form.massstab,
          spiegeln: m.form.spiegeln,
          drehung: m.form.drehung,
        }
      : undefined;
    return umrissInWelt(innen, rahmen.cutWidth, rahmen.cutHeight, m, lage);
  };
}
