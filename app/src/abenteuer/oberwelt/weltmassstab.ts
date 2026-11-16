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
