/**
 * Sperrkarte für die Tiere und die Laufhilfe: welche Kacheln und Zellen Wände (Kollision der
 * Kachelebenen) oder Möbel belegen.
 *
 * Rolle im Gesamtbild: Tiere haben keinen Physikkörper (Leistung, Auftrag Runde 7); damit sie
 * beim Weglaufen nicht in Häuser oder Schränke laufen, fragt belebungsbewegung.ts diese Karte.
 * Ausgelagert aus oberwelt/szene.ts, damit die Szene klein bleibt. Die Gruppe der Möbel enthält
 * auch die feinen Sperren der Karte (Karteneditor 1.6, feinsperren.ts): Eine Kachel mit einer
 * gesperrten Zelle ist für Tiere und den Tippschritt gesperrt. Die Zellkarte (4 Pixel) braucht die
 * Laufhilfe des Helden (laufhilfe.ts).
 * Abhängigkeiten: Phaser.
 * Beispiel: Eine Theke von drei Kacheln Breite sperrt drei Kacheln; `kachel(x, y)` ist dort false.
 */
import Phaser from "phaser";

/** Zellen je Kachelkante (feinsperren.ts). */
const ZELLEN = 4;

/** Die Abfragen „ist diese Kachel frei?“ und „ist diese Zelle (4 Pixel) frei?“. */
export interface Sperrkarte {
  readonly kachel: (x: number, y: number) => boolean;
  readonly zelle: (x: number, y: number) => boolean;
}

/** Trägt alle Felder der Größe `groesse` ein, die ein Körper berührt. */
function sperreKoerper(ziel: Set<string>, k: Phaser.Physics.Arcade.StaticBody, groesse: number) {
  for (let y = Math.floor(k.top / groesse); y * groesse < k.bottom; y++) {
    for (let x = Math.floor(k.left / groesse); x * groesse < k.right; x++) ziel.add(`${x},${y}`);
  }
}

/**
 * Baut beide Abfragen aus den Kachelebenen und der Gruppe der Möbel.
 * Sonderfall: Kacheln und Zellen außerhalb der Karte gelten als gesperrt.
 */
export function baueSperrkarte(
  karte: Phaser.Tilemaps.Tilemap,
  feste: readonly Phaser.Tilemaps.TilemapLayer[],
  moebel: Phaser.Physics.Arcade.StaticGroup,
  kachel: number,
): Sperrkarte {
  const gesperrt = new Set<string>();
  const zellen = new Set<string>();
  for (const ebene of feste) {
    ebene.forEachTile((k) => {
      if (!k.collides) return;
      gesperrt.add(`${k.x},${k.y}`);
      for (let i = 0; i < ZELLEN * ZELLEN; i++) {
        zellen.add(`${k.x * ZELLEN + (i % ZELLEN)},${k.y * ZELLEN + Math.floor(i / ZELLEN)}`);
      }
    });
  }
  for (const teil of moebel.getChildren()) {
    const k = (teil as Phaser.GameObjects.Rectangle).body;
    if (!(k instanceof Phaser.Physics.Arcade.StaticBody)) continue;
    sperreKoerper(gesperrt, k, kachel);
    sperreKoerper(zellen, k, kachel / ZELLEN);
  }
  const { width: breite, height: hoehe } = karte;
  const innen = (x: number, y: number, n: number) =>
    x >= 0 && y >= 0 && x < breite * n && y < hoehe * n;
  return {
    kachel: (x, y) => innen(x, y, 1) && !gesperrt.has(`${x},${y}`),
    zelle: (x, y) => innen(x, y, ZELLEN) && !zellen.has(`${x},${y}`),
  };
}
