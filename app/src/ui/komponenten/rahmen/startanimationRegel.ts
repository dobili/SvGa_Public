/**
 * Regel der Startanimation bei der Rückkehr aus dem Hintergrund (Wunsch des Autors, 24.10.2026):
 * reine Rechnung ohne Browser, damit sie testbar ist; Startanimation.tsx ruft sie.
 * Abhängigkeiten: keine.
 */

/** Dauer bei der Rückkehr aus dem Hintergrund (ms), Klasse startanimation-kurz in brett.css. */
export const RUECKKEHR_MS = 1800;
/** So lange muss die App im Hintergrund gewesen sein, damit sie bei der Rückkehr wieder läuft. */
export const RUECKKEHR_AB_MS = 30 * 60 * 1000;

/**
 * Läuft die Animation bei der Rückkehr? Nur auf Touch-Geräten (Handy, Tablet: dort liegt die App
 * wirklich im Hintergrund; am Rechner wechselt man zwischen Fenstern hin und her), nur nach
 * mindestens 30 Minuten, nicht bei abgeschalteter Animation.
 * Beispiel: Handy, 45 Minuten im Hintergrund → ja; 10 Minuten → nein; Rechner → nein.
 */
export function rueckkehrFaellig(
  verstecktSeitMs: number | null,
  jetztMs: number,
  touch: boolean,
  erlaubt: boolean,
): boolean {
  if (verstecktSeitMs === null || !touch || !erlaubt) return false;
  return jetztMs - verstecktSeitMs >= RUECKKEHR_AB_MS;
}
