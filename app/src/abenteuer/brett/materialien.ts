/**
 * Materialien der Pixelfiguren: je Material drei Farben für Weiß und drei für Schwarz.
 *
 * Rolle im Gesamtbild: Die Figuren haben eine Zeichnung (pixelfiguren.ts); das Material färbt
 * sie nur um, wie die Tabelle in docs/spiel/30_Bedienung_und_Brettstile.md, Abschnitt 5 verlangt
 * („Farbvarianten je Material als Tönung, nicht als neue Zeichnung“). Welches Brett welches
 * Material nimmt, steht in brettstile.ts.
 * Abhängigkeiten: pixelfiguren.ts (Pixelklassen).
 */
import type { Pixelklasse } from "./pixelfiguren";

/** Die Materialien aus der Tabelle des Dokuments (Messing seit 28.11.2026 für die Goldmine). */
export const FIGURMATERIALIEN = [
  "holz",
  "plastik",
  "stein",
  "metall",
  "glatt",
  "ton",
  "poliert",
  "sepia",
  "messing",
] as const;
export type Figurmaterial = (typeof FIGURMATERIALIEN)[number];

/** Farben einer Seite: Umriss, Körper, Schatten. */
export type Figurfarben = Readonly<Record<Pixelklasse, string>>;

/** Farben eines Materials für beide Seiten. */
export interface Materialfarben {
  readonly weiss: Figurfarben;
  readonly schwarz: Figurfarben;
}

/**
 * Die Tönungen. Weiß bleibt immer hell, Schwarz immer dunkel (Abstand der Körper mindestens
 * 4,5:1, geprüft in brettstile.test.ts); Holz ist Kiefer und Kirsche wie das Original.
 */
export const MATERIALFARBEN: Readonly<Record<Figurmaterial, Materialfarben>> = {
  holz: {
    weiss: { umriss: "#3B2414", koerper: "#F2DDB0", schatten: "#CFA46A" },
    schwarz: { umriss: "#1C0F07", koerper: "#5C3218", schatten: "#3E200E" },
  },
  plastik: {
    weiss: { umriss: "#2A2A2A", koerper: "#FAFAF5", schatten: "#D2D2C8" },
    schwarz: { umriss: "#0E0E0E", koerper: "#2B2B2B", schatten: "#161616" },
  },
  stein: {
    weiss: { umriss: "#2D3033", koerper: "#ECEAE4", schatten: "#BDBAB2" },
    schwarz: { umriss: "#0F1113", koerper: "#3A3D42", schatten: "#26282C" },
  },
  metall: {
    weiss: { umriss: "#1F2A36", koerper: "#E6EDF3", schatten: "#A9B8C6" },
    schwarz: { umriss: "#0B0F14", koerper: "#2E3946", schatten: "#1C242E" },
  },
  glatt: {
    weiss: { umriss: "#24414A", koerper: "#FFFFFF", schatten: "#C6ECF1" },
    schwarz: { umriss: "#061A20", koerper: "#1E3540", schatten: "#102229" },
  },
  ton: {
    weiss: { umriss: "#4A2A14", koerper: "#F6E2C4", schatten: "#D9B48A" },
    schwarz: { umriss: "#1E0E06", koerper: "#6A2E17", schatten: "#4A1D0D" },
  },
  poliert: {
    weiss: { umriss: "#2B1D12", koerper: "#FFF6E0", schatten: "#D8C08F" },
    schwarz: { umriss: "#050505", koerper: "#221C18", schatten: "#100C0A" },
  },
  sepia: {
    weiss: { umriss: "#3A2A18", koerper: "#F3E6CC", schatten: "#CDB48C" },
    schwarz: { umriss: "#1E140A", koerper: "#5A4128", schatten: "#3E2C1A" },
  },
  // Goldmine (28.11.2026): Weiß blankes Messing, Schwarz geschwärztes Eisen wie die Loren.
  messing: {
    weiss: { umriss: "#3A2508", koerper: "#F6DE8C", schatten: "#D1A94E" },
    schwarz: { umriss: "#120C06", koerper: "#3B2A1C", schatten: "#261A10" },
  },
};
