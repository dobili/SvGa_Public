/**
 * Maßstab der Oberwelt auf dem Bildschirm (Variante B, Wunsch des Autors, 16.11.2026).
 *
 * Die Karten (Kachel 16 px) erscheinen mit drei Bildschirmpixeln je Kartenpixel, die PixelLab-
 * Figuren (Rahmen 32 × 32, sichtbar bis etwa 30 px hoch) mit zwei Bildschirmpixeln je
 * Figurenpixel. Im Verhältnis zur Karte sind die Figuren damit 2/3 so groß wie ihr Bogen und
 * passen in die Türen der Grafiksätze, ohne dass ein Figurenpixel verloren geht.
 *
 * Umsetzung: Das Bild des Spiels hat die volle Auflösung der Seite (ein Bildpunkt je CSS-Pixel),
 * die Kamera vergrößert die Welt mit ZOOM. Die Welt rechnet weiter in Kartenpixeln (Kachel 16),
 * so bleiben Karten, Kollision, Wege und Daten unverändert; nur die PixelLab-Figuren werden mit
 * GROSS_MASSSTAB (2/3) gezeichnet und landen dadurch ganzzahlig mit zwei Pixeln auf dem Schirm.
 * Das ist dasselbe Bild wie „Welt mit 150 %, Kamera mal 2“, aber ohne jede Position umzurechnen.
 *
 * Rolle im Gesamtbild: eine Quelle für szene.ts, oberweltspiel.ts, kameraregie.ts und
 * figurbilder.ts. Abhängigkeiten: keine.
 */

/** Bildschirmpixel je Kartenpixel: Vergrößerung der Kamera (ganzzahlig, sonst unscharf). */
export const ZOOM = 3;

/** Bildschirmpixel je Figurenpixel der PixelLab-Bögen. */
export const FIGUR_SCHIRMPIXEL = 2;

/**
 * Zeichenmaßstab der PixelLab-Figuren in der Welt: 2/3. Beispiel: Rahmen 32 → 21⅓ Kartenpixel,
 * auf dem Schirm 64 Pixel; der Held (30 px hoch) ist so hoch wie 20 Kartenpixel.
 */
export const GROSS_MASSSTAB = FIGUR_SCHIRMPIXEL / ZOOM;

/**
 * Faktor auf den Maßstab der PixelLab-Figuren in Innenräumen: 4/3 (Entscheidung des Autors auf der
 * Vergleichsseite, 20.11.2026: „innen 1,33“, für alle PixelLab-Figuren). Die Möbel innen stammen aus
 * LimeZu Modern Interiors und sind für größere Figuren gezeichnet; bei 20 Kartenpixeln waren Stühle so
 * hoch wie der Held. Mit 4/3 ist er 26⅔ Kartenpixel hoch, ein Figurenpixel wird 2⅔ Bildschirmpixel
 * (aus dem Original 32 × 32 nur verkleinert, bis 1,5 wird nichts vergrößert). Außen bleiben die
 * Figuren, wie sie sind: Dort passen sie zu den Türen (Regel 10.92), zu große Möbel außen bekommen
 * einen Maßstab (pipeline/abenteuer/proportionen.py). Nur das Bild wächst, der Körper bleibt die
 * Fußkachel (figurbilder.ts, stelleAufKachel).
 */
export const INNEN_FIGURFAKTOR = 4 / 3;

/** Rahmenbreite der PixelLab-Bögen (32 × 32); schmalere Rahmen sind alte LimeZu-Bögen (16 × 32). */
export const PIXELLAB_RAHMEN = 32;

/**
 * Zeichenmaßstab einer Figur aus Rahmenbreite und Faktor der Karte (ohne Phaser, testbar).
 * Beispiel: PixelLab innen (32, 4/3) → 8/9; PixelLab außen (32, 1) → 2/3; LimeZu (16, 4/3) → 1.
 */
export function figurzeichenmassstab(rahmenbreite: number, faktor: number): number {
  return rahmenbreite >= PIXELLAB_RAHMEN ? GROSS_MASSSTAB * faktor : 1;
}
