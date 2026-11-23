/**
 * Sitzende Figuren und Statisten, reine Regeln ohne Phaser (Wunsch des Autors seit Runde 11,
 * R020: „Schachspieler sitzen“). Eine Figur der Szene mit `"sitzt": "unten"` (oder `true`), ein
 * Statist mit der Eigenschaft `sitzt` sitzt auf einem Stuhl, einer Bank oder einem Sofa und
 * schaut in diese Richtung.
 *
 * Bild: Hat der Bogen eine dritte Reihe (PixelLab-Export mit `animations/Sitting/<richtung>/`,
 * skripte/figurenbogen.mjs; Doc 24), stehen dort die Sitzbilder ab Rahmen 48 in der Ordnung
 * rechts, oben, links, unten. Sonst gilt das Standbild der Richtung, um SITZ_HUB Pixel höher
 * gezeichnet (oberwelt/figurensitz.ts).
 * Seit dem 21.11.2026 (Zustände aus PixelLab, skripte/figurenzustaende.mjs) kann der Bogen zwei
 * weitere Reihen haben: Sitzen am Boden ab Rahmen 72 (Schneidersitz, für Sitzende ohne Sitzmöbel,
 * BODENSITZ) und Liegen ab Rahmen 96 (Kopf rechts, Kopf links; im Bett, fuehrungsschicht.ts). Fehlt
 * die Bodenreihe, sitzt die Figur am Boden wie bisher im Stuhlbild oder im Standbild; fehlt die
 * Liegereihe, kippt die Szene das Standbild.
 * Stehende Figuren und Statisten schauen nach unten, außer sie tragen die Eigenschaft `blick`
 * (oben, unten, links, rechts; Rückmeldung R008 des Autors: „Stehen sie still, müssen sie logisch
 * platziert sein, mit sinnvoller Blickrichtung“). Dann zeigen sie das Standbild dieser Richtung,
 * etwa die Verkäuferin, die über ihren Tresen nach links zur Kundschaft schaut.
 * Rolle im Gesamtbild: gelesen von ausloeserebene.ts und belebung.ts, gezeichnet von
 * figurensitz.ts, figurenaufstellung.ts und belebungsschicht.ts. Abhängigkeiten: szene.ts (Typ Richtung).
 */
import type { Richtung } from "./szene";

/** So viele Pixel höher steht ein sitzendes Standbild (ohne eigenes Sitzbild). */
export const SITZ_HUB = 6;
/** Erster Rahmen der Sitzreihe im Bogen (dritte Reihe bei 24 Rahmen je Reihe). */
export const SITZ_BEGINN = 48;
/** Erster Rahmen der Bodenreihe (vierte Reihe) und der Liegereihe (fünfte Reihe). */
export const BODEN_BEGINN = 72;
export const LIEGE_BEGINN = 96;
/** Datenschlüssel am Sprite: Die Figur liegt (`#stelle … >liegt`); szene.ts lässt dann ihre Tiefe. */
export const LIEGT = "liegt";
/** Liegebilder: Kopf rechts, Kopf links. */
const KOPFSEITEN: readonly Kopfseite[] = ["rechts", "links"];

/** Wo der Kopf eines Liegenden liegt (vom Bett vorgegeben). */
export type Kopfseite = "rechts" | "links";

/** Reihenfolge der Richtungen bei LimeZu, wie die Standbilder (figurbilder.ts). */
const REIHENFOLGE: readonly Richtung[] = ["rechts", "oben", "links", "unten"];

/**
 * Blickrichtung einer sitzenden Figur aus der Eigenschaft `sitzt`, sonst null.
 * Beispiel: "links" → "links"; "ja" oder true → "unten"; "" oder fehlend → null.
 */
export function sitzrichtung(wert: unknown): Richtung | null {
  if (wert === true || wert === "ja") return "unten";
  return REIHENFOLGE.find((r) => r === wert) ?? null;
}

/**
 * Blickrichtung einer stehenden Figur aus der Eigenschaft `blick` (R008), sonst null; dann gilt
 * die Vorgabe „unten“. Beispiel: "links" → "links"; "ja", "" oder fehlend → null.
 */
export function blickrichtung(wert: unknown): Richtung | null {
  return REIHENFOLGE.find((r) => r === wert) ?? null;
}

/** Hat ein Bogen mit so vielen Rahmen eine Sitzreihe? */
export function hatSitzbilder(rahmen: number): boolean {
  return rahmen >= SITZ_BEGINN + REIHENFOLGE.length;
}

/**
 * Rahmen des Sitzbilds: am Boden aus der Bodenreihe, wenn es sie gibt; sonst aus der Sitzreihe,
 * sonst das Standbild der Richtung.
 * Beispiel: Bogen mit fünf Reihen (120 Rahmen), Juno am Boden nach links → 74; auf dem Stuhl → 50.
 */
export function sitzbild(rahmen: number, richtung: Richtung, amBoden = false): number {
  const index = REIHENFOLGE.indexOf(richtung);
  if (amBoden && rahmen >= BODEN_BEGINN + REIHENFOLGE.length) return BODEN_BEGINN + index;
  return hatSitzbilder(rahmen) ? SITZ_BEGINN + index : index;
}

/**
 * Rahmen des Liegebilds mit dem Kopf auf dieser Seite, oder null ohne Liegereihe (dann kippt die
 * Szene das Standbild). Beispiel: 120 Rahmen, Kopf rechts → 96; 72 Rahmen → null.
 */
export function liegebild(rahmen: number, kopf: Kopfseite): number | null {
  return rahmen >= LIEGE_BEGINN + KOPFSEITEN.length
    ? LIEGE_BEGINN + KOPFSEITEN.indexOf(kopf)
    : null;
}

/** Wörter im Namen eines Betts für das Kopfende (Katalog: rv5BettKopfRechts, es15BettKopfWest). */
const KOPF_RECHTS = /Kopf(Rechts|Ost)/;
const KOPF_LINKS = /Kopf(Links|West)/;

/** Katalogangabe `ende` eines waagrechten Betts (die Seite des Kopfendes im Bild) → Kopfseite. */
const KOPF_AUS_ENDE: Readonly<Record<string, Kopfseite>> = { ost: "rechts", west: "links" };

/**
 * Kopfseite eines Betts aus seinem Namen, sonst aus der Katalogangabe `ende` (waagrechte Betten:
 * die Seite des Kopfendes), gespiegelt vertauscht; null, wenn beides fehlt (ein Bett mit dem
 * Kopfende oben: dann liegt die Figur mit dem Kopf rechts, der einzigen Ansicht von der Seite,
 * fuehrungsschicht.ts).
 * Warum `ende`: iw5BettLila (Oma Ruths Bett) trägt keine Kopfseite im Namen, aber „ende: west“;
 * mit der Vorgabe rechts lag sie mit dem Kopf am Fußende (Verdeckungsfotos, 23.11.2026).
 * Beispiel: "rv5BettKopfRechts" → "rechts"; gespiegelt → "links"; ("iw5BettLila", false, "west")
 * → "links"; "rv5Bett" → null.
 */
export function kopfseiteDesBetts(
  name: string,
  gespiegelt = false,
  ende?: string,
): Kopfseite | null {
  const ausName = KOPF_RECHTS.test(name) ? "rechts" : KOPF_LINKS.test(name) ? "links" : null;
  const seite = ausName ?? (ende ? (KOPF_AUS_ENDE[ende] ?? null) : null);
  if (!seite || !gespiegelt) return seite;
  return seite === "rechts" ? "links" : "rechts";
}
