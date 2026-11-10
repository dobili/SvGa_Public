/**
 * Sperrkarte für die Tiere: welche Kacheln Wände (Kollision der Kachelebenen) oder Möbel belegen.
 *
 * Rolle im Gesamtbild: Tiere haben keinen Physikkörper (Leistung, Auftrag Runde 7); damit sie
 * beim Weglaufen nicht in Häuser oder Schränke laufen, fragt belebungsbewegung.ts diese Karte.
 * Ausgelagert aus oberwelt/szene.ts, damit die Szene klein bleibt.
 * Abhängigkeiten: Phaser.
 * Beispiel: Eine Theke von drei Kacheln Breite sperrt drei Kacheln; `frei(x, y)` ist dort false.
 */
import Phaser from "phaser";

/**
 * Baut die Abfrage „ist diese Kachel frei?“ aus den Kachelebenen und der Gruppe der Möbel.
 * Sonderfall: Kacheln außerhalb der Karte gelten als gesperrt.
 */
export function baueSperrkarte(
  karte: Phaser.Tilemaps.Tilemap,
  feste: readonly Phaser.Tilemaps.TilemapLayer[],
  moebel: Phaser.Physics.Arcade.StaticGroup,
  kachel: number,
): (x: number, y: number) => boolean {
  const gesperrt = new Set<string>();
  for (const ebene of feste) {
    ebene.forEachTile((k) => {
      if (k.collides) gesperrt.add(`${k.x},${k.y}`);
    });
  }
  for (const teil of moebel.getChildren()) {
    const k = (teil as Phaser.GameObjects.Rectangle).body;
    if (!(k instanceof Phaser.Physics.Arcade.StaticBody)) continue;
    for (let y = Math.floor(k.top / kachel); y * kachel < k.bottom; y++) {
      for (let x = Math.floor(k.left / kachel); x * kachel < k.right; x++)
        gesperrt.add(`${x},${y}`);
    }
  }
  const { width: breite, height: hoehe } = karte;
  return (x, y) => x >= 0 && y >= 0 && x < breite && y < hoehe && !gesperrt.has(`${x},${y}`);
}
