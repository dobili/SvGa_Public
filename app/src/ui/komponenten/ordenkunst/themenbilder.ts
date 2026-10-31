/**
 * Medaillen der Meisterschaft je Thema (Gamifizierung P3): Form und Motiv je Thema, Rand in
 * Bronze, Silber oder Gold, offen als Silhouette.
 *
 * Rolle im Gesamtbild: Die Profilkarte „Deine Themen“, die Meldung am Rundenende und das Bild zum
 * Teilen zeigen dieselbe Medaille. Sie folgt dem Stil „Nacht und Gold“ der Abzeichen (dunkler
 * Grund, Motiv aus motive.ts), aber der Rand ist aus dem Metall der Stufe. Welche Form und welches
 * Motiv ein Thema bekommt, steht in zwei Listen: je Präfix des Trainers (THEMENBILDER) und, wo es
 * lohnt, je einzelnem Thema (MOTIV_JE_THEMA). Ein neuer Trainer bekommt ohne Eintrag eine runde
 * Medaille mit Stern; eine Zeile hier gibt ihm eine eigene.
 * Abhängigkeiten: motive.ts, zeichnen.ts, training/meisterschaft.ts (Typ).
 */
import type { Medaillenstufe } from "../../../training/meisterschaft";
import { FORM, motiv, type Formname, type Motivangabe } from "./motive";
import { metall, neueId, type Metallart } from "./zeichnen";

/** Bild eines Präfixes: Form, Motiv, Farbe der Akzente. */
export interface Themenbild {
  readonly form: Formname;
  readonly motiv: Motivangabe;
  readonly akzent: string;
}

/** Je Präfix des Trainers eine Zeile; ein neuer Trainer trägt hier sein Bild ein. */
export const THEMENBILDER: Readonly<Record<string, Themenbild>> = {
  taktik: { form: "stern8", motiv: "figur:springer", akzent: "#ff5a5a" },
  endspiel: { form: "strahl24", motiv: "figur:koenig", akzent: "#b07cff" },
  struktur: { form: "sechseck", motiv: "figur:bauer", akzent: "#7cc86f" },
  falle: { form: "dreieck", motiv: "blick", akzent: "#ffd84a" },
};

/** Ohne Eintrag: runde Medaille mit Stern. */
const VORGABE: Themenbild = { form: "kreis", motiv: "stern", akzent: "#5fc3ff" };

/** Eigene Motive einzelner Themen (die zwölf Taktikmotive aus Kapitel 7 unterscheiden sich). */
export const MOTIV_JE_THEMA: Readonly<Record<string, Motivangabe>> = {
  "taktik:doppelangriff": "figur:springer",
  "taktik:fesselung": "figur:turm",
  "taktik:spiess": "schwerter",
  "taktik:abzug": "blitz",
  "taktik:doppelschach": "zahl:+2",
  "taktik:hinlenkung": "kreispfeil",
  "taktik:beseitigung": "koenigFaellt",
  "taktik:ueberlastung": "hantel",
  "taktik:zwischenzug": "uhr",
  "taktik:gefangen": "figur:dame",
  "taktik:umwandlung": "krone",
  "taktik:rettung": "haken",
  "endspiel:opposition": "figur:koenig",
  "endspiel:quadrat": "brett",
};

/** Metall des Randes je Stufe. */
const METALL_DER_STUFE: Readonly<Record<Medaillenstufe, Metallart>> = {
  bronze: "bronze",
  silber: "silber",
  gold: "gold",
};

const MITTE = 50;
const RADIUS = 40;
const GRUND = "#0b0f1a";
const TIEFES_BLAU = "#1d2a48";
const SILHOUETTE_DECKKRAFT = 0.32;

/** Das Bild zu einem Thema aus beiden Listen. */
export function themenbild(thema: string): Themenbild {
  const praefix = thema.split(":")[0] ?? thema;
  const grund = THEMENBILDER[praefix] ?? VORGABE;
  return { ...grund, motiv: MOTIV_JE_THEMA[thema] ?? grund.motiv };
}

/** Grund, Rand und Motiv; der Rand im Metall der Stufe (ohne Stufe Gold für die Silhouette). */
function medaillenInhalt(
  bild: Themenbild,
  stufe: Medaillenstufe | null,
): { defs: string; inhalt: string } {
  const m = metall(METALL_DER_STUFE[stufe ?? "gold"]);
  const grund = neueId("g");
  const aussen = FORM[bild.form](MITTE, MITTE, RADIUS);
  const innen = FORM[bild.form](MITTE, MITTE, RADIUS * 0.8);
  const defs =
    m.defs +
    `<radialGradient id="${grund}" cx="0.5" cy="0.35" r="0.8"><stop offset="0" stop-color="${TIEFES_BLAU}"/><stop offset="1" stop-color="#05070d"/></radialGradient>`;
  const farben = { haupt: m.hell, akzent: bild.akzent, grund: GRUND };
  const inhalt =
    `<path d="${aussen}" fill="url(#${grund})" stroke="${m.hell}" stroke-width="6" stroke-linejoin="round"/>` +
    `<path d="${aussen}" fill="none" stroke="${m.fase}" stroke-width="2" stroke-linejoin="round"/>` +
    `<path d="${innen}" fill="none" stroke="${m.hell}" stroke-width="1" stroke-opacity="0.7" stroke-linejoin="round"/>` +
    motiv(bild.motiv, MITTE, MITTE, RADIUS * 1.05, farben);
  return { defs, inhalt };
}

/**
 * Das fertige SVG der Medaille eines Themas als Text.
 * Beispiel: medailleSvg("taktik:fesselung", "silber") → Stern mit Silberrand und Turm.
 * Sonderfall: Stufe null → Silhouette in der Textfarbe (currentColor), blass.
 */
export function medailleSvg(thema: string, stufe: Medaillenstufe | null): string {
  const { defs, inhalt } = medaillenInhalt(themenbild(thema), stufe);
  const flach = neueId("f");
  const koerper =
    stufe === null
      ? `<g filter="url(#${flach})" opacity="${SILHOUETTE_DECKKRAFT}">${inhalt}</g>`
      : inhalt;
  const filter = `<filter id="${flach}"><feFlood flood-color="currentColor"/><feComposite in2="SourceAlpha" operator="in"/></filter>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true" focusable="false"><defs>${defs}${filter}</defs>${koerper}</svg>`;
}
