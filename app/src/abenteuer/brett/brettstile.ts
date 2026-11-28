/**
 * Die Brettstile des Schach-Abenteuers: zwanzig Bretter je Ort und Lage, mit Pixelfiguren.
 *
 * Rolle im Gesamtbild: Das Brett zeigt, wo man ist und gegen wen man spielt
 * (docs/spiel/30_Bedienung_und_Brettstile.md, Abschnitt 5). Diese Tabelle hält je Stil die
 * Feldfarben, die feine Pixelstruktur (feldstruktur.ts), den Pixelrahmen, das Material der
 * Figuren (materialien.ts) und die Farben der Markierungen. Welcher Stil gilt, entscheidet
 * stilwahl.ts aus orte.json und begegnungen.json (Feld „brett“). Die Kennungen stehen gleich im
 * Schema (schemas/abenteuer-orte.schema.json, abenteuer-begegnungen.schema.json, „brett“).
 * Lesbarkeit: Jede Markierung hat Fläche und Kontur; brettstile.test.ts prüft für jeden Stil
 * 3:1 gegen beide Feldfarben (kontrast.ts). Blindschach bleibt ohne Stil (stilwahl.ts).
 * Abhängigkeiten: materialien.ts, analyse/werkzeug.ts (Markierungsfarben).
 */
import type { Markierungsfarbe } from "../../analyse/werkzeug";
import { MATERIALFARBEN, type Figurfarben, type Figurmaterial } from "./materialien";

/**
 * Die zwanzig Stile in der Reihenfolge der Tabelle im Dokument; die letzten sieben kamen mit der
 * Leitidee des Autors (28.11.2026): „Die verwendeten Bretterdesigns sollen Ausdruck der
 * Atmosphäre und der Persönlichkeit der Städte, Orte und Clubs sein.“
 */
export const BRETTSTILE = [
  "dachboden",
  "turniervinyl",
  "abgegriffen",
  "nussbaum",
  "ahorn",
  "steintisch",
  "stahl",
  "glas",
  "treibholz",
  "sandstein",
  "schiefer",
  "turnier",
  "sepia",
  "kreidetafel",
  "sternenhimmel",
  "grubenlampe",
  "resopal",
  "rotholz",
  "zypresse",
  "scheune",
] as const;
export type Brettstilkennung = (typeof BRETTSTILE)[number];

/**
 * Stil, wenn weder Ort noch Begegnung einen nennen: Wege, Dörfer, kleine Orte ohne eigenes Brett.
 * Wunsch des Autors (28.11.2026): als Standard „Ahorn & Nussbaum“ wie das Holzbrett der App;
 * nur Club, Region, Stadt oder Figur mit einem Grund aus der Geschichte haben ein eigenes Brett.
 */
export const VORGABESTIL: Brettstilkennung = "nussbaum";

/** Arten der feinen Pixelstruktur auf den Feldern (feldstruktur.ts). */
export type Strukturart =
  | "maserung"
  | "kratzer"
  | "koernung"
  | "platten"
  | "glanz"
  | "salz"
  | "schichten"
  | "vinyl"
  | "kreide"
  | "sterne"
  | "aeste"
  | "moos";

/** Ein Stil. Alle Farben in Hex-Schreibweise, damit die Tests ihren Kontrast rechnen können. */
export interface Brettstil {
  readonly hell: string;
  readonly dunkel: string;
  readonly struktur: readonly Strukturart[];
  /** Pixelrahmen um das Brett, von außen nach innen. */
  readonly rahmen: readonly [string, string, string];
  readonly material: Figurmaterial;
  /**
   * Umriss der schwarzen Figuren statt des Materials auf dunklen Brettern: eine farbige Kante in
   * mittlerer Helligkeit (Kupfer, Gold), nie fast Weiß, sonst wirken die Figuren wie weiße.
   */
  readonly kanteSchwarz?: string;
  /** Körper der schwarzen Figuren statt des Materials, wenn das Feld ihn sonst verschluckt. */
  readonly koerperSchwarz?: string;
  /** Markierungen (Pfeile, Feldrahmen, Karten wie Fingerzeig): Kontur und Flächen. */
  readonly kontur: string;
  readonly marken: Readonly<Record<Markierungsfarbe, string>>;
  /** Letzter Zug: Rahmen im Feld (Farbe mit Kante) und durchscheinender Schimmer darunter. */
  readonly zug: { readonly farbe: string; readonly kante: string; readonly schimmer: string };
}

/** Kontur der Marken auf hellen und mittleren Brettern: fast Schwarz. */
const KONTUR_DUNKEL = "#101010";
/** Markenfarben zur dunklen Kontur: die Farben des Buches, etwas aufgehellt. */
const MARKEN_HELL: Brettstil["marken"] = {
  gold: "#F2C230",
  rot: "#FF6464",
  grau: "#B8C0CA",
  gruen: "#4CC77E",
  blau: "#66A3FF",
};
/** Markenfarben auf Brettern mit dunklen Feldern: Rot, Blau und Grün heller als im Buch. */
const MARKEN_LEUCHTEND: Brettstil["marken"] = {
  ...MARKEN_HELL,
  rot: "#FF7A7A",
  blau: "#8CC0FF",
  gruen: "#5EE08F",
};
/** Letzter Zug auf dunklen Feldern: helleres Gelb. */
const ZUG_HELLGELB = {
  farbe: "#FFE870",
  kante: KONTUR_DUNKEL,
  schimmer: "rgba(255, 232, 112, 0.30)",
};
/** Schwarze Holzfiguren auf rötlichen oder olivgrünen Feldern: fast schwarzer Körper. */
const KOERPER_DUNKELHOLZ = "#2A160A";
/** Letzter Zug auf warmen Brettern: Gelb mit dunkler Kante. */
const ZUG_GELB = { farbe: "#FFE36E", kante: KONTUR_DUNKEL, schimmer: "rgba(255, 227, 110, 0.30)" };
/** Letzter Zug auf kühlen Brettern: Cyan mit dunkler Kante. */
const ZUG_CYAN = { farbe: "#7FF3FF", kante: KONTUR_DUNKEL, schimmer: "rgba(127, 243, 255, 0.28)" };

/** Die Tabelle aus docs/spiel/30, Abschnitt 5. */
export const STILTABELLE: Readonly<Record<Brettstilkennung, Brettstil>> = {
  // Dachboden (Ambrose): altes Holzbrett, warm.
  dachboden: {
    hell: "#DDB97F",
    dunkel: "#9A6237",
    struktur: ["maserung"],
    rahmen: ["#2A160A", "#6B3E1E", "#C08A50"],
    material: "holz",
    kontur: KONTUR_DUNKEL,
    marken: MARKEN_HELL,
    zug: ZUG_GELB,
  },
  // Maple Falls, Schulclub: Turnier-Vinyl grün und weiß.
  turniervinyl: {
    hell: "#F2F0E2",
    dunkel: "#5E8F58",
    struktur: ["vinyl"],
    rahmen: ["#1E2A1C", "#3F6B3A", "#E6E4D2"],
    material: "plastik",
    kontur: KONTUR_DUNKEL,
    marken: MARKEN_HELL,
    zug: ZUG_GELB,
  },
  // Straßengegner mit eigenem, abgenutztem Brett (Jo, Juno, Kreidespringer): abgegriffenes Holz.
  abgegriffen: {
    hell: "#CDAB78",
    dunkel: "#80593A",
    struktur: ["maserung", "kratzer"],
    rahmen: ["#241409", "#5A3A22", "#A57B4F"],
    material: "holz",
    kontur: KONTUR_DUNKEL,
    marken: MARKEN_HELL,
    zug: ZUG_GELB,
  },
  // Vorgabe für Wege und Orte ohne eigenes Brett: „Ahorn & Nussbaum“ mit den Feldfarben des
  // Holzbretts der App (ui/brett/masse.ts, BRETTFARBEN.holz), Faser als Maserung, Rahmen aus
  // dunklem Nussbaum. Wunsch des Autors, 28.11.2026.
  nussbaum: {
    hell: "#E4C38E",
    dunkel: "#8E5E36",
    struktur: ["maserung"],
    rahmen: ["#1F1108", "#5B3519", "#C9A06A"],
    material: "holz",
    kontur: KONTUR_DUNKEL,
    marken: MARKEN_HELL,
    zug: ZUG_GELB,
  },
  // Cedar Creek, Bibliothek: Intarsie aus Ahorn mit Nussbaum.
  ahorn: {
    hell: "#EDD5A6",
    dunkel: "#A9744A",
    struktur: ["maserung"],
    rahmen: ["#2B170B", "#7A4B2A", "#E0C08A"],
    material: "holz",
    kontur: KONTUR_DUNKEL,
    marken: MARKEN_HELL,
    zug: ZUG_GELB,
  },
  // Riverton, Park: Steintisch grau.
  steintisch: {
    hell: "#C4C7C3",
    dunkel: "#7E8381",
    struktur: ["koernung"],
    rahmen: ["#232627", "#565B5C", "#A3A8A6"],
    material: "stein",
    kontur: KONTUR_DUNKEL,
    marken: MARKEN_HELL,
    zug: ZUG_GELB,
  },
  // Ironwood: Stahlplatten, blau angelaufen.
  stahl: {
    hell: "#9FB2C6",
    dunkel: "#3F5574",
    struktur: ["platten", "kratzer"],
    rahmen: ["#0E141D", "#2C3B52", "#7C93AE"],
    material: "metall",
    kanteSchwarz: "#DA9A5E",
    kontur: KONTUR_DUNKEL,
    marken: MARKEN_LEUCHTEND,
    zug: { ...ZUG_GELB, farbe: "#FFE870" },
  },
  // Silicon Bay, Konzern: Glas, kühles Weiß und Cyan.
  glas: {
    hell: "#EEF8F9",
    dunkel: "#7CC6D2",
    struktur: ["glanz"],
    rahmen: ["#16303A", "#3E8B99", "#D8F2F5"],
    material: "glatt",
    kontur: KONTUR_DUNKEL,
    marken: MARKEN_HELL,
    zug: { farbe: "#FFD84A", kante: KONTUR_DUNKEL, schimmer: "rgba(255, 216, 74, 0.32)" },
  },
  // Port Delacroix: verwittertes Holz mit Salzspuren.
  treibholz: {
    hell: "#CFC8B5",
    dunkel: "#857A66",
    struktur: ["maserung", "salz"],
    rahmen: ["#211D17", "#4F4738", "#A79C86"],
    material: "holz",
    kontur: KONTUR_DUNKEL,
    marken: MARKEN_HELL,
    zug: ZUG_CYAN,
  },
  // Desert Springs: Sandstein.
  sandstein: {
    hell: "#EAD2A4",
    dunkel: "#C08A5A",
    struktur: ["koernung", "schichten"],
    rahmen: ["#3A1F0E", "#8A5531", "#E0BC86"],
    material: "ton",
    kontur: KONTUR_DUNKEL,
    marken: MARKEN_HELL,
    zug: ZUG_CYAN,
  },
  // Summit City: Schiefer.
  // Rückmeldung des Autors (14.11.2026): Schwarz war zu schwach. Deshalb hellere Felder, fast
  // schwarze Körper und eine kräftigere Bronzekante (Test „schiefer“ in brettstile.test.ts).
  schiefer: {
    hell: "#B3BAC1",
    dunkel: "#6F7883",
    struktur: ["schichten", "koernung"],
    rahmen: ["#0D1014", "#262B32", "#6A727C"],
    material: "stein",
    kanteSchwarz: "#D29A4E",
    koerperSchwarz: "#15171A",
    kontur: KONTUR_DUNKEL,
    marken: MARKEN_LEUCHTEND,
    zug: { ...ZUG_GELB, farbe: "#FFE870" },
  },
  // Capital Arena: Turnierbrett, edel (Mahagoni und Elfenbein, poliert).
  turnier: {
    hell: "#EFDFC1",
    dunkel: "#6A3A2A",
    struktur: ["glanz"],
    rahmen: ["#120806", "#5A2E20", "#C9A24A"],
    material: "poliert",
    kanteSchwarz: "#C9A24A",
    kontur: KONTUR_DUNKEL,
    marken: { ...MARKEN_HELL, rot: "#FF7070", blau: "#7DB2FF" },
    zug: ZUG_CYAN,
  },
  // Erinnerungen 1857/1858: Sepia-Holz.
  sepia: {
    hell: "#E8D5B0",
    dunkel: "#9C7B55",
    struktur: ["maserung", "koernung"],
    rahmen: ["#2A1E12", "#5E4630", "#C9AE84"],
    material: "sepia",
    kontur: KONTUR_DUNKEL,
    marken: MARKEN_HELL,
    zug: { farbe: "#FFF1C2", kante: KONTUR_DUNKEL, schimmer: "rgba(255, 241, 194, 0.32)" },
  },
  // Lockport: Kreidetafel im Holzrahmen. Imogens Rätseltafel am Steg und Rubens Kreidetafel am
  // Kahn (14_Akt2_Leben_teil1.md, 4.2 und 4.3): Gelöst wird hier an der Tafel.
  kreidetafel: {
    hell: "#93A99A",
    dunkel: "#2F4B3E",
    struktur: ["kreide"],
    rahmen: ["#20140A", "#6B4A2A", "#B58A55"],
    material: "holz",
    kanteSchwarz: "#BE945A",
    koerperSchwarz: KOERPER_DUNKELHOLZ,
    kontur: KONTUR_DUNKEL,
    marken: MARKEN_LEUCHTEND,
    zug: ZUG_HELLGELB,
  },
  // Sternwarte am Canyon: Nachthimmel mit Sternpunkten, Silberfiguren. Dr. Ngata sammelt
  // Mattbilder „für lange Nächte“ (sternwarte.ink), Lucía zeichnet das Sternbild Springer.
  sternenhimmel: {
    hell: "#AEB9D6",
    dunkel: "#1E2A4E",
    struktur: ["sterne"],
    rahmen: ["#070B18", "#1A2444", "#8C97B8"],
    material: "metall",
    kanteSchwarz: "#C79A4E",
    kontur: KONTUR_DUNKEL,
    marken: MARKEN_LEUCHTEND,
    zug: ZUG_HELLGELB,
  },
  // Goldmine: Bahnschwellen im Licht der Grubenlampe, Messingfiguren. Pruitt malt kleine Endspiele
  // mit Kreide auf die Schwellen (goldmine.ink); helle Körner wie Goldglimmer im Fels.
  grubenlampe: {
    hell: "#D8B572",
    dunkel: "#4A3524",
    struktur: ["maserung", "kratzer", "salz"],
    rahmen: ["#120C06", "#3A2A1A", "#B98A38"],
    material: "messing",
    kanteSchwarz: "#B98A38",
    kontur: KONTUR_DUNKEL,
    marken: MARKEN_LEUCHTEND,
    zug: ZUG_CYAN,
  },
  // Crossroads, Raststätte: Resopal in Mint und Creme mit Chromrand wie die Tische des Diners;
  // Darlenes Varianten-Tisch, an dem jeder ein Spiel mitbringt (crossroads-raststaette.ink).
  resopal: {
    hell: "#F4EBD6",
    dunkel: "#6FB39C",
    struktur: ["vinyl", "glanz"],
    rahmen: ["#2B3033", "#9AA3A8", "#E8EDEF"],
    material: "plastik",
    kontur: KONTUR_DUNKEL,
    marken: MARKEN_HELL,
    zug: ZUG_GELB,
  },
  // Pinewood Camp: helle Kiefer und Rotholz der Riesenbäume (Red Giants), mit Ästen; Tandem und
  // Räuberschach am Lagerfeuer, Hollis' Brett auf einer Wurzel (09, 5.12; pinewood-camp-aussen.ink).
  rotholz: {
    hell: "#EACB8E",
    dunkel: "#A65E3E",
    struktur: ["maserung", "aeste"],
    rahmen: ["#2A1208", "#6E2E1A", "#E0B97E"],
    material: "holz",
    koerperSchwarz: KOERPER_DUNKELHOLZ,
    kontur: KONTUR_DUNKEL,
    marken: MARKEN_HELL,
    zug: ZUG_GELB,
  },
  // Bayou: graugrünes Zypressenholz mit Moos, Therons Nebelschach am Bootssteg und das Brett mit
  // dem Stein gegen den Wind auf der Bank des Luftboots (bayou.ink; 09, 5.9 „Bayou Noir“).
  zypresse: {
    hell: "#C9CBA3",
    dunkel: "#627150",
    struktur: ["maserung", "moos"],
    rahmen: ["#151810", "#3E4430", "#A9A585"],
    material: "holz",
    koerperSchwarz: KOERPER_DUNKELHOLZ,
    kontur: KONTUR_DUNKEL,
    marken: MARKEN_HELL,
    zug: ZUG_CYAN,
  },
  // Kürbishof Miller: Scheunenrot und weiß gekalkte Bretter, rissig; die Stellungen hängen an den
  // Kreuzungen des Maisirrgartens, Morphy trägt Schachbrettflicken (orte/kuerbishof.md).
  scheune: {
    hell: "#F1E8D4",
    dunkel: "#B8402F",
    struktur: ["maserung", "kratzer"],
    rahmen: ["#2A1008", "#8A2A20", "#F1E8D4"],
    material: "holz",
    koerperSchwarz: KOERPER_DUNKELHOLZ,
    kontur: KONTUR_DUNKEL,
    marken: MARKEN_HELL,
    zug: ZUG_GELB,
  },
};

/** Ist ein Wert aus den Spieldaten eine bekannte Stilkennung? */
export function istBrettstil(wert: unknown): wert is Brettstilkennung {
  return typeof wert === "string" && (BRETTSTILE as readonly string[]).includes(wert);
}

/**
 * Farben der Figuren einer Seite auf einem Brett: das Material, bei Schwarz mit der Kante des
 * Brettes, wenn es eine hat.
 *
 * Beispiel: „schiefer“, Schwarz → Stein mit fast schwarzem Körper und Bronzeumriss „#D29A4E“, damit die dunklen Figuren
 * auf den dunklen Schieferfeldern nicht verschwinden.
 */
export function figurfarben(kennung: Brettstilkennung, weiss: boolean): Figurfarben {
  const stil = STILTABELLE[kennung];
  const farben = MATERIALFARBEN[stil.material];
  if (weiss) return farben.weiss;
  return {
    ...farben.schwarz,
    ...(stil.kanteSchwarz ? { umriss: stil.kanteSchwarz } : {}),
    ...(stil.koerperSchwarz ? { koerper: stil.koerperSchwarz } : {}),
  };
}
