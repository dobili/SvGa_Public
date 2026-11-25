/**
 * Hauptfiguren sprechen den Helden an (Wunsch des Autors, 25.11.2026): Läuft der Held vor einer
 * Figur vorbei, deren Gespräch die Hauptgeschichte gerade voranbringt, geht sie auf ihn zu und
 * spricht ihn an. Draußen soll man nicht an der wichtigen Figur vorbeilaufen oder jede Figur
 * ansprechen müssen, bis man die richtige findet.
 *
 * Regeln (reine Rechnung, ohne Phaser und React):
 * - Kegel: Das Feld des Helden liegt in Blickrichtung der Figur 1 bis 3 Felder vor ihr und
 *   höchstens 1 Feld seitlich daneben (imKegel).
 * - Sicht: Zwischen Figur und Held sperrt kein Feld (Wand, Möbel; sichtFrei über die Sperrkarte).
 * - Höchstens einmal je Questschritt und Figur (Merker `ansprachen` im Spielstand).
 * - Sperren (ansprechGesperrt): in den ersten 2 Sekunden nach einem Kartenwechsel (wie die Ruhe der
 *   Blickpunkte, regeln/blickpunkte.ts: nichts löst im Eingang aus), wenn die Welt nicht frei ist
 *   (Dialog, Partie, Fenster, Menü, Meldung, Warten), und wenn der Held rennt und schon dicht dran
 *   ist (er liefe in die Figur hinein).
 * Rolle im Gesamtbild: gelesen von oberwelt/useAnsprechen.ts; welche Figur gemeint ist, sagt
 * oberwelt/ansprechziel.ts. Abhängigkeiten: oberwelt/gefuehrterweg.ts (Typen), schnittstelle.
 */
import type { Blick, Feld } from "../oberwelt/gefuehrterweg";
import type { Abenteuerstand } from "../schnittstelle/spielstand";

/** So viele Felder weit sieht die Figur nach vorn. */
export const ANSPRECHWEITE = 3;
/** So viele Felder seitlich neben der Blicklinie gelten noch als „vor ihr“. */
export const ANSPRECHBREITE = 1;
/** Ruhe nach einem Kartenwechsel (ms): Im Eingang einer Karte spricht niemand an. */
export const ANSPRECHRUHE_MS = 2000;
/** Bis zu so vielen Schritten geht die Figur auf den Helden zu; weiter weg dreht sie sich nur. */
export const ANSPRECHWEG_HOECHSTENS = 6;
/** Rennt der Held, spricht ihn die Figur ab diesem Abstand nach vorn nicht mehr an. */
const RENNEN_ZU_NAH = 1;

/** Die Richtung als Schritt (x, y) im Raster: „unten“ ist +y wie in der Karte. */
const VORWAERTS: Readonly<Record<Blick, Feld>> = {
  unten: { x: 0, y: 1 },
  oben: { x: 0, y: -1 },
  rechts: { x: 1, y: 0 },
  links: { x: -1, y: 0 },
};

/**
 * Wie weit der Held vor der Figur steht (1 bis 3), oder null, wenn er nicht in ihrem Kegel ist.
 * Eingaben in Kachelfeldern. Beispiel: Juno auf (54, 24) mit Blick nach unten, Held auf (55, 26)
 * → 2; Held auf (54, 23) (hinter ihr) → null; Held auf (56, 25) (zwei Felder seitlich) → null.
 */
export function imKegel(figur: Feld, blick: Blick, held: Feld): number | null {
  const v = VORWAERTS[blick];
  const dx = held.x - figur.x;
  const dy = held.y - figur.y;
  const vorn = dx * v.x + dy * v.y;
  const seitlich = Math.abs(dx * v.y - dy * v.x);
  if (vorn < 1 || vorn > ANSPRECHWEITE || seitlich > ANSPRECHBREITE) return null;
  return vorn;
}

/**
 * Die Felder zwischen zwei Feldern auf der geraden Linie (ohne Anfang und Ende), in Schritten der
 * längeren Achse gerundet. Beispiel: (0, 0) → (3, 1) → (1, 0), (2, 1).
 */
export function felderDazwischen(von: Feld, zu: Feld): Feld[] {
  const dx = zu.x - von.x;
  const dy = zu.y - von.y;
  const schritte = Math.max(Math.abs(dx), Math.abs(dy));
  const felder: Feld[] = [];
  for (let i = 1; i < schritte; i++) {
    felder.push({
      x: Math.round(von.x + (dx * i) / schritte),
      y: Math.round(von.y + (dy * i) / schritte),
    });
  }
  return felder;
}

/**
 * Sieht die Figur den Helden? Kein Feld dazwischen ist gesperrt (`frei` aus der Sperrkarte der
 * Szene: Wände und Möbel). Beispiel: Mama hinter dem Tresen, Held davor → frei; eine Wand
 * dazwischen → nicht frei.
 */
export function sichtFrei(von: Feld, zu: Feld, frei: (x: number, y: number) => boolean): boolean {
  return felderDazwischen(von, zu).every((f) => frei(f.x, f.y));
}

/** Was gegen ein Ansprechen in diesem Augenblick spricht. */
export interface Ansprechlage {
  /** Die Welt ist frei: kein Dialog, keine Partie, kein Fenster, kein Menü, keine Meldung. */
  readonly frei: boolean;
  /** Seit dem Kartenwechsel vergangene Zeit (ms). */
  readonly seitKarte: number;
  /** Der Held rennt. */
  readonly rennt: boolean;
  /** Abstand nach vorn im Kegel (imKegel). */
  readonly abstand: number;
}

/**
 * Ist das Ansprechen jetzt gesperrt? Beispiel: eine Sekunde nach dem Kartenwechsel → gesperrt;
 * Held rennt und steht direkt vor der Figur → gesperrt; ruhig vorbeigehend zwei Felder davor → frei.
 */
export function ansprechGesperrt(lage: Ansprechlage): boolean {
  if (!lage.frei || lage.seitKarte < ANSPRECHRUHE_MS) return true;
  return lage.rennt && lage.abstand <= RENNEN_ZU_NAH;
}

/**
 * Der Schlüssel im Merker: Quest, Schritt und Figur. Beispiel: ("mapleFalls.ersterAbend", 0,
 * "mutter") → "mapleFalls.ersterAbend#0:mutter". Zwischen zwei Quests (wasjetzt.ts) steht der
 * Textschlüssel der Lücke an Stelle der Quest, ohne Schritt.
 */
export function ansprechschluessel(quelle: string, schritt: number | null, figur: string): string {
  return schritt === null ? `${quelle}:${figur}` : `${quelle}#${schritt}:${figur}`;
}

/** Hat diese Figur in diesem Schritt schon angesprochen? */
export function schonAngesprochen(stand: Abenteuerstand, schluessel: string): boolean {
  return (stand.ansprachen ?? []).includes(schluessel);
}

/**
 * Der Stand nach dem Ansprechen: Schlüssel gemerkt, Dialogvariable `angesprochen` auf true (Ink
 * kann damit eine erste Zeile wie „Hey, warte mal!“ wählen; useAusloeser.ts setzt sie beim
 * gewöhnlichen Ansprechen auf false).
 */
export function nachAnsprechen(stand: Abenteuerstand, schluessel: string): Abenteuerstand {
  return {
    ...stand,
    ansprachen: [...(stand.ansprachen ?? []), schluessel],
    dialogvariablen: { ...stand.dialogvariablen, [ANGESPROCHEN]: true },
  };
}

/** Dialogvariable: true, wenn die Figur den Helden angesprochen hat (nicht umgekehrt). */
export const ANGESPROCHEN = "angesprochen";
