/**
 * Bewegung der Teilchen über der Karte (Atmosphäre T8): Staub im Licht, Sternschnuppen, Nebel.
 * Reine Rechnung in Anteilen des Bildausschnitts (0 bis 1), getestet in teilchenbahn.test.ts;
 * gezeichnet wird in oberwelt/teilchen.ts.
 * Abhängigkeiten: keine.
 */

/** Ein Teilchen: Lage, Geschwindigkeit (Anteile je Sekunde), Größe in Weltpixeln, Phase. */
export interface Teilchen {
  x: number;
  y: number;
  readonly vx: number;
  readonly vy: number;
  readonly groesse: number;
  readonly phase: number;
}

/** Auf dem Handy höchstens so viele Teilchen (Plan T8). */
export const HOECHSTENS_TEILCHEN = 40;
const VOLLKREIS = Math.PI * 2;
/** Staub treibt sehr langsam, in alle Richtungen, leicht nach oben. */
const STAUB_TEMPO = 0.008;
const STAUB_AUFTRIEB = -0.004;
/** Nebelschwaden: wenige, groß, ziehen waagerecht. */
export const NEBEL_SCHWADEN = 6;
const NEBEL_TEMPO = 0.01;
const NEBEL_GROESSE_MIN = 60;
const NEBEL_GROESSE_STREUUNG = 60;

/** Staubkörner, über den Bildausschnitt verteilt; `zufall` liefert Zahlen in [0, 1). */
export function neuerStaub(anzahl: number, zufall: () => number): Teilchen[] {
  return Array.from({ length: Math.min(anzahl, HOECHSTENS_TEILCHEN) }, () => ({
    x: zufall(),
    y: zufall(),
    vx: (zufall() - 0.5) * 2 * STAUB_TEMPO,
    vy: STAUB_AUFTRIEB + (zufall() - 0.5) * STAUB_TEMPO,
    groesse: 1,
    phase: VOLLKREIS * zufall(),
  }));
}

/** Nebelschwaden in der unteren Hälfte des Bildausschnitts. */
export function neuerNebel(zufall: () => number): Teilchen[] {
  return Array.from({ length: NEBEL_SCHWADEN }, () => ({
    x: zufall(),
    y: 0.4 + 0.6 * zufall(),
    vx: NEBEL_TEMPO * (0.5 + zufall()),
    vy: 0,
    groesse: NEBEL_GROESSE_MIN + NEBEL_GROESSE_STREUUNG * zufall(),
    phase: VOLLKREIS * zufall(),
  }));
}

/** Ein Bild weiter: Teilchen wandern und kommen am anderen Rand wieder herein. */
export function bewegeTeilchen(teilchen: readonly Teilchen[], dt: number): void {
  for (const t of teilchen) {
    t.x = (((t.x + t.vx * dt) % 1) + 1) % 1;
    t.y = (((t.y + t.vy * dt) % 1) + 1) % 1;
  }
}

/** Funkeln eines Staubkorns (Deckkraft 0 bis 1) zur Zeit `sekunden`. */
export function funkeln(t: Teilchen, sekunden: number): number {
  return 0.5 + 0.5 * Math.sin(t.phase + sekunden);
}

/** Eine Sternschnuppe: Start (Anteile), Richtung und Lebenszeit in Sekunden. */
export interface Schnuppe {
  readonly x: number;
  readonly y: number;
  readonly alter: number;
}

/** Mittlerer Abstand zwischen zwei Sternschnuppen (Sekunden): selten, wie im Plan. */
export const SCHNUPPE_ABSTAND_S = 7;
/** So lange zieht eine Sternschnuppe (Sekunden). */
export const SCHNUPPE_DAUER_S = 0.7;

/**
 * Nächster Stand der Sternschnuppe: altert, verschwindet nach ihrer Dauer; ohne Schnuppe entsteht
 * mit der Wahrscheinlichkeit dt / Abstand eine neue im oberen Drittel.
 * Beispiel: keine Schnuppe, zufall 0 → neue Schnuppe; Alter über der Dauer → null.
 */
export function naechsteSchnuppe(
  jetzt: Schnuppe | null,
  dt: number,
  zufall: () => number,
): Schnuppe | null {
  if (jetzt) {
    const alter = jetzt.alter + dt;
    return alter > SCHNUPPE_DAUER_S ? null : { ...jetzt, alter };
  }
  if (zufall() >= dt / SCHNUPPE_ABSTAND_S) return null;
  return { x: zufall(), y: zufall() / 3, alter: 0 };
}
