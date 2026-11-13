/**
 * Klangquellen mit Reichweite (Atmosphäre T28): Musik, die nur um ein Ding der Karte klingt, etwa
 * um Rosies Wagen oder Remys Trompete (Roman Kapitel 31 und 35).
 *
 * Rolle im Gesamtbild: reine Rechnung für ton/tonregie.ts. Die Quellen stehen in orte.json je Karte
 * (`klangquellen`); ihr Ort ist ein benanntes Objekt der Tiled-Karte, so bleibt die Karte selbst
 * unberührt. Die lauteste Quelle gewinnt; die Musik der Karte weicht im selben Maß.
 * Abhängigkeiten: keine.
 */

/** Reichweite in Feldern, wenn orte.json keine nennt. */
export const REICHWEITE_VORGABE = 20;
/** Bis zu diesem Anteil der Reichweite klingt die Quelle voll. */
const VOLL_BIS = 0.5;

/** Eine Quelle, wie orte.json sie nennt. */
export interface Klangquellangabe {
  readonly objekt: string;
  readonly musik: string;
  readonly reichweite?: number;
}

/** Eine Quelle mit ihrem Feld auf der Karte. */
export interface Klangort {
  readonly musik: string;
  readonly x: number;
  readonly y: number;
  readonly reichweite: number;
}

/** Was um den Helden klingt: die Quelle (oder keine) und ihr Anteil 0 bis 1. */
export interface Naehe {
  readonly musik: string | null;
  readonly anteil: number;
}

export const KEINE_NAEHE: Naehe = { musik: null, anteil: 0 };

/** Ein Objekt einer Tiled-Ebene, so weit hier gebraucht (Pixel). */
interface Objekt {
  readonly name?: string;
  readonly x?: number;
  readonly y?: number;
}

/**
 * Die Felder der Quellen auf einer Tiled-Karte. Gesucht wird das Objekt mit dem Namen in allen
 * Objektebenen, gleich welcher Art (Figur, Möbel, Auslöser). Fehlt es, fehlt die Quelle.
 * Beispiel: Objekt „rosiesWagen“ bei (320, 160), Kachel 16 → Feld (20, 10).
 */
export function klangorte(
  karte: object,
  angaben: readonly Klangquellangabe[],
  kachel: number,
): Klangort[] {
  const ebenen = (karte as { layers?: readonly { objects?: readonly Objekt[] }[] }).layers ?? [];
  const objekte = ebenen.flatMap((e) => e.objects ?? []);
  return angaben.flatMap((a) => {
    const o = objekte.find((x) => x.name === a.objekt);
    if (!o) return [];
    return [
      {
        musik: a.musik,
        x: Math.round((o.x ?? 0) / kachel),
        y: Math.round((o.y ?? 0) / kachel),
        reichweite: a.reichweite ?? REICHWEITE_VORGABE,
      },
    ];
  });
}

/** Anteil 0 bis 1 nach Abstand: voll bis zur halben Reichweite, dann gleichmäßig bis still. */
export function anteilNachAbstand(abstand: number, reichweite: number): number {
  const voll = reichweite * VOLL_BIS;
  if (abstand <= voll) return 1;
  if (abstand >= reichweite) return 0;
  return (reichweite - abstand) / (reichweite - voll);
}

/**
 * Die lauteste Quelle um das Feld des Helden. Abstand in Feldern (gerade Linie).
 * Beispiel: Wagen auf (20, 10), Reichweite 20, Held auf (35, 10) → Anteil 0,5.
 */
export function naehe(orte: readonly Klangort[], x: number, y: number): Naehe {
  let beste: Naehe = KEINE_NAEHE;
  for (const o of orte) {
    const anteil = anteilNachAbstand(Math.hypot(o.x - x, o.y - y), o.reichweite);
    if (anteil > beste.anteil) beste = { musik: o.musik, anteil };
  }
  return beste;
}
