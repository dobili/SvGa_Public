/**
 * Welches Bild zu welchem Orden und Abzeichen gehört, und das fertige SVG dazu.
 *
 * Rolle im Gesamtbild: Wahl des Autors auf der Entwurfsseite (30.10.2026): alle Abzeichen und die
 * Orden der Buch- und Teilringe im Nachtstil (Variante C), die Bot-Orden und die Engine klassisch
 * (Variante A). Seine Notizen sind eingearbeitet: das Auge bei „Erst selbst denken“ tiefer, das
 * Fragezeichen bei „Nachgefragt“ größer und mittig, die Flammen bei „Eine Woche dabei“ mit Abstand
 * zum Rand. Orden werden über die Kennung ihres Rings gefunden (testid „ich-teil-endspiel“ →
 * „teil-endspiel“), Abzeichen über ihre Kennung aus fortschritt/abzeichen.ts.
 * Abhängigkeiten: nachtstil.ts, botorden.ts, zeichnen.ts.
 */
import { BUENDELBILDER, botordenAlle, botordenEinmal, engineorden } from "./botorden";
import { nacht, type Nachtangabe, type Zeichnung } from "./nachtstil";
import { neueId } from "./zeichnen";

/** Die Orden der Buch- und Teilringe im Nachtstil. */
const NACHTORDEN: Readonly<Record<string, Nachtangabe>> = {
  abbildungen: { form: "achteck", motiv: "brett:schraeg", akzent: "#4f9fd8" },
  uebungen: { form: "kreis", motiv: "brett", akzent: "#ff5a5a" },
  lernziele: { form: "rosette", motiv: "haken", akzent: "#3ddc84" },
  trainer: { form: "zahnrad", motiv: "hantel", akzent: "#ff8a2b" },
  "teil-grundlagen": { form: "kreis", motiv: "figur:bauer", akzent: "#7cc86f" },
  "teil-eroeffnung": { form: "sechseck", motiv: "figur:springer", akzent: "#5fc3ff" },
  "teil-mittelspiel": { form: "raute", motiv: "schwerter:turm", akzent: "#ff4d4d" },
  "teil-endspiel": { form: "strahl24", motiv: "krone", akzent: "#b07cff" },
  "teil-praxis": { form: "kreis", motiv: "uhr", akzent: "#f5f0e6" },
};

/** Alle 18 Abzeichen im Nachtstil (Kennungen wie in fortschritt/abzeichen.ts). */
const NACHTABZEICHEN: Readonly<Record<string, Nachtangabe>> = {
  erstePartie: { form: "banner", motiv: "figur:bauer", akzent: "#2ee6d6" },
  ersterSieg: { form: "schild", motiv: "pokal", akzent: "#ffd166" },
  partien10: { form: "kreis", motiv: "schwerter", akzent: "#e0a06a" },
  partien50: { form: "schild", motiv: "zahl:50", akzent: "#dfe4ea" },
  partien100: { form: "rosette", motiv: "stern:100", akzent: "#ffd166" },
  erstesMatt: { form: "kreis", motiv: "koenigFaellt", akzent: "#ff5a5a" },
  siegOhneHilfe: { form: "stern8", motiv: "figur:dame", akzent: "#ffa94d" },
  siegGegenStaerkeren: { form: "dreieck", motiv: "figur:bauer", akzent: "#a78bfa" },
  remisGegenStaerkeren: { form: "sechseck", motiv: "turmHalb", akzent: "#9fb6dd" },
  brillant: { form: "achteck", motiv: "edelstein", akzent: "#38e8ff" },
  ersteUebung: { form: "kreis", motiv: "rosette:1", akzent: "#5ea8ff" },
  kapitelUebungen: { form: "schild", motiv: "buchHaken", akzent: "#3ddc84" },
  warum: { form: "kreis", motiv: "frage", akzent: "#ffd84a" },
  eingeschaetzt: { form: "tropfen", motiv: "blick", akzent: "#ffd84a", tiefer: 9 },
  sammlung: { form: "rundquadrat", motiv: "lesezeichen", akzent: "#ff6bc1" },
  fehler: { form: "kreis", motiv: "kreispfeil", akzent: "#ff7f6b" },
  trainer: { form: "zahnrad", motiv: "blitz:100", akzent: "#ffd166" },
  woche: { form: "rundquadrat", motiv: "kalender", akzent: "#ff7a1a" },
};

/** Kennungen aller Orden mit eigenem Bild, in der Reihenfolge der Ringe im Profil. */
export const ORDENKENNUNGEN: readonly string[] = [
  ...Object.keys(NACHTORDEN),
  ...Object.keys(BUENDELBILDER).flatMap((b) => [`bots-${b}-einmal`, `bots-${b}-alle`]),
  "engine",
];

/** Kennungen aller Abzeichen mit eigenem Bild. */
export const ABZEICHENKENNUNGEN: readonly string[] = Object.keys(NACHTABZEICHEN);

/**
 * Kennung des Ordens zu einem Ring aus seiner testid (fortschritt/fortschrittsringe.ts).
 * Beispiel: „ich-bots-4-5-alle“ → „bots-4-5-alle“; „ich-bots-10“ → „engine“.
 */
export function ordenkennungAusRing(testid: string): string {
  const kennung = testid.replace(/^ich-/, "");
  return kennung === "bots-10" ? "engine" : kennung;
}

const BOTORDEN = /^bots-(1-3|4-5|6-7|8-9)-(einmal|alle)$/;

/** Die Zeichnung eines Ordens; null bei unbekannter Kennung. */
function ordenzeichnung(kennung: string): Zeichnung | null {
  const nachtangabe = NACHTORDEN[kennung];
  if (nachtangabe) return nacht(nachtangabe, true);
  if (kennung === "engine") return engineorden();
  const treffer = BOTORDEN.exec(kennung);
  if (!treffer) return null;
  const bild = BUENDELBILDER[treffer[1] as keyof typeof BUENDELBILDER];
  return treffer[2] === "einmal" ? botordenEinmal(bild) : botordenAlle(bild);
}

/** Orden oder Abzeichen. */
export type Stueckart = "orden" | "abzeichen";

/** Wie ein Bild gezeigt wird. */
export interface Bildart {
  /** Noch nicht verdient: nur die Form in einer flachen, blassen Farbe (currentColor). */
  readonly silhouette?: boolean;
  /** Lichtstreif, der ab und zu über ein verdientes Stück läuft (Stil in ordenkunst.css). */
  readonly glanz?: boolean;
}

/** Glanzschicht und Silhouettenfilter um die Zeichnung legen. */
function huelle(z: Zeichnung, art: Bildart): { defs: string; inhalt: string } {
  const clip = neueId("c");
  const licht = neueId("l");
  const flach = neueId("f");
  const defs =
    z.defs +
    `<clipPath id="${clip}"><path d="${z.umriss}"/></clipPath>` +
    `<linearGradient id="${licht}" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.5" stop-color="#fff" stop-opacity="0.75"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>` +
    `<filter id="${flach}"><feFlood flood-color="currentColor"/><feComposite in2="SourceAlpha" operator="in"/></filter>`;
  if (art.silhouette)
    return { defs, inhalt: `<g filter="url(#${flach})" opacity="0.32">${z.inhalt}</g>` };
  const glanz = art.glanz
    ? `<g clip-path="url(#${clip})"><rect class="ordenkunst-glanz" x="-60" y="0" width="34" height="140" fill="url(#${licht})" transform="skewX(-20)"/></g>`
    : "";
  return { defs, inhalt: z.inhalt + glanz };
}

/**
 * Das fertige SVG eines Stücks als Text; null, wenn es kein eigenes Bild gibt (dann zeigt der
 * Aufrufer das alte Bild mit Zeichen).
 * Beispiel: stueckSvg("abzeichen", "warum", { glanz: true }) → Kreis mit goldenem Fragezeichen.
 */
export function stueckSvg(art: Stueckart, kennung: string, bildart: Bildart = {}): string | null {
  const angabe = art === "abzeichen" ? NACHTABZEICHEN[kennung] : undefined;
  const z = art === "orden" ? ordenzeichnung(kennung) : angabe ? nacht(angabe, false) : null;
  if (!z) return null;
  const { defs, inhalt } = huelle(z, bildart);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${z.ansicht}" aria-hidden="true" focusable="false"><defs>${defs}</defs>${inhalt}</svg>`;
}

/** Hat dieses Stück ein eigenes Bild? Beispiel: hatOrdenkunst("orden", "engine") → true. */
export function hatOrdenkunst(art: Stueckart, kennung: string): boolean {
  return art === "orden" ? ORDENKENNUNGEN.includes(kennung) : kennung in NACHTABZEICHEN;
}
