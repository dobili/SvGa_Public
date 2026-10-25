/**
 * Baukasten für das eigene Porträt: Merkmale, ihre Werte, Zufall und das Bauen des SVG (seit
 * 0.2.140, Wunsch des Autors vom 25.10.2026).
 *
 * Rolle im Gesamtbild: Die Porträts der Bots stammen aus DiceBear „Personas“ (Zeichnungen
 * Draftbit, CC BY 4.0; Code Florian Körner, MIT; docs/LIZENZEN.md), zusammengesetzt aus Frisur,
 * Haar- und Hautfarbe, Augen, Nase, Mund, Bart und Kleidung (skripte/erzeuge-portraetwahl.mjs).
 * Dieselben Teile kann der Leser hier selbst wählen. Die Bibliothek lädt erst der Baukasten nach
 * (dynamischer Import); gespeichert wird das fertige SVG (speicher/profil.ts). Hintergrund und
 * Rundung wie bei den Bots, die Grundfarbe legt die App dahinter (--portraet-grund). Seit 0.2.142
 * kommen eigene Formen für Augen, Nase, Mund, Bart und Oberteil dazu (eigeneTeile.ts).
 * Abhängigkeiten: @dicebear/core, @dicebear/personas (nachgeladen), speicher/profil.ts, eigeneTeile.ts.
 */
import type { Merkmale } from "../../speicher/profil";
import { grundform, mitEigenenTeilen } from "./eigeneTeile";

/** Die Felder des Baukastens in der Reihenfolge der Anzeige mit ihren Werten. */
export const MERKMALE = {
  haar: [
    "long",
    "extraLong",
    "bobCut",
    "bobBangs",
    "pigtails",
    "straightBun",
    "curlyBun",
    "bunUndercut",
    "curly",
    "curlyHighTop",
    "sideShave",
    "shortCombover",
    "shortComboverChops",
    "fade",
    "buzzcut",
    "mohawk",
    "balding",
    "bald",
    "cap",
    "beanie",
  ],
  // Seit 0.2.141 mehr Farben (Wunsch des Autors): DiceBear nimmt jede Farbe als Hexwert; die
  // ersten sieben sind die der Bots, neue stehen dahinter, damit gespeicherte Werte gültig bleiben.
  haarfarbe: [
    "362c47",
    "6c4545",
    "f27d65",
    "f29c65",
    "e15c66",
    "e16381",
    "dee1f5",
    "1c1410",
    "4a3020",
    "8d5524",
    "b5651d",
    "e6be8a",
    "f5e6b8",
    "a3a3a3",
    "ffffff",
    "4a7bd1",
    "4caf7a",
    "8e5cc4",
  ],
  haut: [
    "eeb4a4",
    "e7a391",
    "e5a07e",
    "d78774",
    "b16a5b",
    "92594b",
    "623d36",
    "f8d9c8",
    "f1c27d",
    "c68642",
    "8d5524",
    "4a2c20",
  ],
  // Seit 0.2.142 doppelt so viele Formen (Wunsch des Autors): die hinteren sind eigene
  // Zeichnungen im Stil von Personas (eigeneTeile.ts).
  augen: [
    "open",
    "happy",
    "wink",
    "sleep",
    "glasses",
    "sunglasses",
    "big",
    "brows",
    "lashes",
    "roundGlasses",
    "surprised",
    "narrow",
  ],
  nase: ["smallRound", "mediumRound", "wrinkles", "pointed", "broad", "button"],
  mund: [
    "smile",
    "bigSmile",
    "smirk",
    "lips",
    "surprise",
    "frown",
    "laugh",
    "tongue",
    "neutral",
    "whistle",
    "wavy",
    "gapTooth",
  ],
  bart: [
    "keiner",
    "shadow",
    "goatee",
    "soulPatch",
    "pyramid",
    "beardMustache",
    "walrus",
    "shortBeard",
    "longBeard",
    "thinMustache",
    "sideburns",
    "chinStrap",
    "henriquatre",
  ],
  koerper: ["rounded", "squared", "small", "checkered", "collar", "stripes", "hoodie", "tie"],
  kleidung: [
    "456dff",
    "54d7c7",
    "7555ca",
    "6dbb58",
    "e24553",
    "f3b63a",
    "f55d81",
    "16253d",
    "c9a227",
    "ffffff",
    "2b2b2b",
    "9aa5b1",
    "8b5a2b",
    "ff8c42",
    "1f8a70",
    "87ceeb",
  ],
} as const;

export type Merkmalfeld = keyof typeof MERKMALE;
export const MERKMALFELDER = Object.keys(MERKMALE) as Merkmalfeld[];
/** Felder mit Farben: als Farbfelder zum Antippen statt als Auswahlliste. */
export const FARBFELDER: readonly Merkmalfeld[] = ["haarfarbe", "haut", "kleidung"];

type Vollstaendig = { readonly [F in Merkmalfeld]: (typeof MERKMALE)[F][number] };

/** Ein freundlicher Anfang: kurzes braunes Haar, mittlere Haut, offene Augen, Lächeln. */
export const START_MERKMALE: Vollstaendig = {
  haar: "shortCombover",
  haarfarbe: "6c4545",
  haut: "e5a07e",
  augen: "open",
  nase: "smallRound",
  mund: "smile",
  bart: "keiner",
  koerper: "rounded",
  kleidung: "456dff",
};

/** Merkmale aus dem Speicher vervollständigen: Unbekanntes wird der Startwert. */
export function vollstaendig(m: Merkmale): Vollstaendig {
  const aus: Record<string, string> = { ...START_MERKMALE };
  for (const feld of MERKMALFELDER) {
    const wert = m[feld];
    if (wert && (MERKMALE[feld] as readonly string[]).includes(wert)) aus[feld] = wert;
  }
  return aus as Vollstaendig;
}

/** Zufällige Merkmale; `zufall` liefert Zahlen von 0 bis unter 1 (für Tests fest). */
export function zufaelligeMerkmale(zufall: () => number = Math.random): Vollstaendig {
  const aus: Record<string, string> = {};
  for (const feld of MERKMALFELDER) {
    const werte: readonly string[] = MERKMALE[feld];
    aus[feld] = werte[Math.floor(zufall() * werte.length)] ?? START_MERKMALE[feld];
  }
  return aus as Vollstaendig;
}

const GROESSE = 128;
const RUNDUNG = 18;
/** Hintergrund, den DiceBear braucht und die App danach wieder entfernt (wie im Skript der Bots). */
const HINTERGRUND = "3b4a6b";
const HINTERGRUND_RECHTECK = /<rect fill="#3b4a6b" width="64" height="64" x="0" y="0" \/>/;
const SICHER = 100;

/** Baut aus vollständigen Merkmalen das SVG (ohne Laden); siehe ladeBauer. */
export type Bauer = (m: Merkmale) => string;

let geladen: Promise<Bauer> | null = null;

/**
 * Lädt DiceBear einmal und liefert eine Funktion, die sofort baut (für die vielen kleinen
 * Vorschaubilder im Baukasten, seit 0.2.141).
 */
export function ladeBauer(): Promise<Bauer> {
  geladen ??= Promise.all([import("@dicebear/core"), import("@dicebear/personas")]).then(
    ([{ createAvatar }, personas]) =>
      (m: Merkmale) => {
        const v = vollstaendig(m);
        const mitBart = v.bart !== "keiner";
        const svg = createAvatar(personas, {
          seed: "profil",
          size: GROESSE,
          radius: RUNDUNG,
          backgroundColor: [HINTERGRUND],
          hair: [v.haar],
          hairColor: [v.haarfarbe],
          skinColor: [v.haut],
          eyes: [grundform("augen", v.augen)],
          nose: [grundform("nase", v.nase)],
          mouth: [grundform("mund", v.mund)],
          body: [grundform("koerper", v.koerper)],
          clothingColor: [v.kleidung],
          ...(mitBart ? { facialHair: [grundform("bart", v.bart)] } : {}),
          facialHairProbability: mitBart ? SICHER : 0,
        } as Parameters<typeof createAvatar<typeof personas>>[1]).toString();
        return mitEigenenTeilen(svg.replace(HINTERGRUND_RECHTECK, ""), v, {
          haar: v.haarfarbe,
          kleidung: v.kleidung,
        });
      },
  );
  return geladen;
}

/**
 * Baut das SVG aus den Merkmalen (lädt DiceBear beim ersten Mal nach).
 * Beispiel: START_MERKMALE → Porträt mit kurzem braunem Haar und blauem Oberteil.
 */
export async function baueSvg(m: Merkmale): Promise<string> {
  return (await ladeBauer())(m);
}
