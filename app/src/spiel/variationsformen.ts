/**
 * Pfeile, Feldrahmen, Nummerntexte und Legende einer Variante als PGN-Kommentar und zurück.
 *
 * Rolle im Gesamtbild: Variationsbrowser, Stufe 2 (Entwurf, Abschnitt 5 „PGN“). Lichess liest
 * Pfeile als „[%cal Ye2e4,Re5c6]“ und Felder als „[%csl Ye8]“ und kennt nur Grün (G), Rot (R),
 * Gelb (Y) und Blau (B). Die App bildet ab: Gold → Gelb, Rot → Rot, Grau → Blau, Grün → Grün,
 * Blau → Blau. Die genaue Farbe und die Reihenfolge (sie trägt die Nummern je Farbe) stehen
 * zusätzlich in einem eigenen Befehl „[%svga Ge2e4,Se8]“ mit den Farbbuchstaben der App
 * (training/variationsmarken.ts); Lichess überliest ihn, die App bevorzugt ihn beim Einlesen.
 * Texte je Nummer stehen lesbar als eigene Zeilen im Kommentar des Zuges („Rot 2: dann fällt die
 * Dame“), die Legende im Kommentar zur Variante („Legende Rot: Falle“). Beim Einlesen werden diese
 * Zeilen wieder zu Nummerntexten und Legende; erkannt werden die Farbnamen der eingestellten
 * Sprache und die deutschen. Seit Stufe 3 stehen dahinter die Engine-Werte („[%eval …]“,
 * spiel/variationseval.ts). Reine Funktionen (die Wörter kommen als Eingabe).
 * Abhängigkeiten: chessops/pgn (makeComment, parseComment), training/variationsmarken.ts.
 */
import type { Markierungsfarbe } from "../analyse/werkzeug";
import { makeComment, parseComment, type CommentShapeColor } from "chessops/pgn";
import { parseSquare, makeSquare } from "chessops/util";
import type { Knotendaten } from "../training/variationen";
import {
  markeAlsText,
  mitLegendentext,
  mitNummerntext,
  hatNummer,
  nummerierteMarken,
  STIFTFARBEN,
  type Nummernwahl,
} from "../training/variationsmarken";
import { evalbefehle, werteAusKommentar } from "./variationseval";

/** Die Farbnamen und das Wort „Legende“ einer Sprache. */
export interface Formwoerter {
  readonly farbe: Readonly<Record<Markierungsfarbe, string>>;
  readonly legende: string;
}

/** Farbe der App → Farbe bei Lichess (Entwurf, Abschnitt 5). */
const LICHESS: Readonly<Record<Markierungsfarbe, CommentShapeColor>> = {
  gold: "yellow",
  rot: "red",
  grau: "blue",
  gruen: "green",
  blau: "blue",
};

/** Farbe bei Lichess → Farbe der App, wenn der Befehl „%svga“ fehlt. */
const AUS_LICHESS: Readonly<Record<CommentShapeColor, Markierungsfarbe>> = {
  yellow: "gold",
  red: "rot",
  green: "gruen",
  blue: "blau",
};

/** Der eigene Befehl mit den genauen Farben (Buchstaben der App, Reihenfolge = Nummern). */
// Format 9: ein kleiner Farbbuchstabe heißt „ohne Nummer“ (gd4 = goldener Rahmen ohne Nummer).
const SVGA =
  /\s?\[%svga\s([GRSNBgrsnb][a-h][1-8](?:[a-h][1-8])?(?:,[GRSNBgrsnb][a-h][1-8](?:[a-h][1-8])?)*)\]\s?/;
const SVGA_ALLE = new RegExp(SVGA.source, "g");

/**
 * Die Befehle zu den Marken einer Stellung: „[%csl …] [%cal …] [%svga …]“; leer ohne Marken.
 * Beispiel: ["Ge2e4", "Se8"] → „[%csl Be8] [%cal Ye2e4] [%svga Ge2e4,Se8]“.
 */
export function formenbefehle(
  marken: readonly string[] | undefined,
  wahl: Nummernwahl = {},
): string {
  const liste = nummerierteMarken(marken, wahl);
  if (liste.length === 0) return "";
  const shapes = liste.flatMap((m) => {
    const von = parseSquare(m.von);
    const nach = parseSquare(m.nach ?? m.von);
    return von === undefined || nach === undefined
      ? []
      : [{ color: LICHESS[m.farbe], from: von, to: nach }];
  });
  const svga = liste.map((m) => (hatNummer(m) ? m.text : m.text.toLowerCase())).join(",");
  return `${makeComment({ shapes })} [%svga ${svga}]`.trim();
}

/** Die Zeilen „Rot 2: dann fällt die Dame“ zu den Nummerntexten, in der Reihenfolge der Marken. */
export function nummerntextzeilen(
  daten: Knotendaten,
  woerter: Formwoerter,
  farbenAus: readonly Markierungsfarbe[] = [],
): string[] {
  const wahl = { ohneNummer: daten.ohneNummer, farbenAus };
  return nummerierteMarken(daten.marken, wahl).flatMap((m) => {
    if (!hatNummer(m)) return [];
    const text = daten.nummerntexte?.[m.schluessel];
    return text ? [`${woerter.farbe[m.farbe]} ${m.nummer}: ${text}`] : [];
  });
}

/**
 * Der ganze PGN-Kommentar einer Stellung: Kommentar, Nummerntexte als Zeilen, dann die Befehle.
 * Ausgabe: leer, wenn es nichts zu sagen gibt.
 */
export function kommentarMitFormen(
  daten: Knotendaten,
  woerter: Formwoerter,
  farbenAus: readonly Markierungsfarbe[] = [],
): string {
  const zeilen = [daten.kommentar ?? "", ...nummerntextzeilen(daten, woerter, farbenAus)].filter(
    Boolean,
  );
  const wahl = { ohneNummer: daten.ohneNummer, farbenAus };
  return [zeilen.join("\n"), formenbefehle(daten.marken, wahl), evalbefehle(daten)]
    .filter(Boolean)
    .join(" ");
}

/** Die Legende als Zeilen „Legende Rot: Falle“, in der Reihenfolge der Farbpunkte. */
export function legendenzeilen(
  legende: Readonly<Partial<Record<Markierungsfarbe, string>>>,
  woerter: Formwoerter,
): string[] {
  return STIFTFARBEN.flatMap((f) => {
    const text = legende[f];
    return text ? [`${woerter.legende} ${woerter.farbe[f]}: ${text}`] : [];
  });
}

/** Die Farbe zu einem Farbnamen in einer der Sprachen; undefined bei Fremdem. */
function farbeVonName(name: string, woerter: readonly Formwoerter[]): Markierungsfarbe | undefined {
  const klein = name.trim().toLowerCase();
  for (const w of woerter) {
    const treffer = STIFTFARBEN.find((f) => w.farbe[f].toLowerCase() === klein);
    if (treffer) return treffer;
  }
  return undefined;
}

/** Marken aus „%svga“ (bevorzugt) oder aus den Lichess-Formen; dazu der Rest des Kommentars. */
function markenAus(kommentar: string): { marken: string[]; ohneNummer: string[]; rest: string } {
  const svga = SVGA.exec(kommentar);
  const ohneSvga = kommentar.replace(SVGA_ALLE, " ");
  const gelesen = parseComment(ohneSvga);
  if (svga?.[1]) {
    const roh = svga[1].split(",");
    // Kleiner Farbbuchstabe: Marke ohne Nummer (Format 9).
    const klein = new Set(roh.filter((m) => m.charAt(0) !== m.charAt(0).toUpperCase()));
    const gross = roh.map((m) => m.charAt(0).toUpperCase() + m.slice(1));
    const marken = nummerierteMarken(gross).map((m) => m.text);
    const ohneNummer = [...klein].map((m) => m.charAt(0).toUpperCase() + m.slice(1));
    return { marken, ohneNummer: ohneNummer.filter((m) => marken.includes(m)), rest: gelesen.text };
  }
  const marken = gelesen.shapes.map((s) =>
    markeAlsText(
      AUS_LICHESS[s.color],
      makeSquare(s.from),
      s.from === s.to ? null : makeSquare(s.to),
    ),
  );
  return { marken, ohneNummer: [], rest: gelesen.text };
}

/** Eine Zeile „Rot 2: Text“ → Schlüssel „R2“ und Text; null, wenn die Zeile anders aussieht. */
function nummerntextAus(
  zeile: string,
  woerter: readonly Formwoerter[],
): { farbe: Markierungsfarbe; nummer: number; text: string } | null {
  const teile = /^(\S+) (\d{1,2}): (.+)$/.exec(zeile.trim());
  const farbe = teile ? farbeVonName(teile[1] ?? "", woerter) : undefined;
  if (!teile || !farbe) return null;
  return { farbe, nummer: Number(teile[2]), text: (teile[3] ?? "").trim() };
}

/**
 * Liest einen PGN-Kommentar eines Zuges: Text, Marken, Nummerntexte.
 * Beispiel: „Dame deckt e5\nRot 1: Falle [%cal Rd1h5] [%svga Rd1h5]“ → Kommentar „Dame deckt e5“,
 * Marke „Rd1h5“, Nummerntext R1 „Falle“.
 * Sonderfall: Eine Textzeile zu einer Nummer, die es nicht gibt, bleibt Kommentar.
 */
export function formenAusKommentar(
  kommentar: string,
  woerter: readonly Formwoerter[],
): Knotendaten {
  const werte = werteAusKommentar(kommentar);
  const { marken, ohneNummer, rest } = markenAus(werte.rest);
  let daten: Knotendaten = {
    ...werte.werte,
    ...(marken.length > 0 ? { marken } : {}),
    ...(ohneNummer.length > 0 ? { ohneNummer } : {}),
  };
  const bleibt: string[] = [];
  const nummern = nummerierteMarken(marken, { ohneNummer });
  for (const zeile of rest.split("\n")) {
    const gelesen = nummerntextAus(zeile, woerter);
    const marke =
      gelesen && nummern.find((m) => m.farbe === gelesen.farbe && m.nummer === gelesen.nummer);
    if (gelesen && marke) daten = mitNummerntext(daten, marke.schluessel, gelesen.text);
    else bleibt.push(zeile);
  }
  const text = bleibt.join("\n").trim();
  return text ? { ...daten, kommentar: text } : daten;
}

/**
 * Trennt die Zeilen „Legende Rot: Falle“ aus dem Kommentar zur Variante.
 * Ausgabe: der übrige Text und die Legende je Farbe.
 */
export function legendeAusKommentar(
  kommentar: string,
  woerter: readonly Formwoerter[],
): { text: string; legende: Partial<Record<Markierungsfarbe, string>> } {
  let legende: Partial<Record<Markierungsfarbe, string>> = {};
  const bleibt: string[] = [];
  for (const zeile of kommentar.split("\n")) {
    const teile = /^(\S+) (\S+): (.+)$/.exec(zeile.trim());
    const istLegende =
      teile && woerter.some((w) => w.legende.toLowerCase() === teile[1]?.toLowerCase());
    const farbe = teile && istLegende ? farbeVonName(teile[2] ?? "", woerter) : undefined;
    if (teile && farbe) legende = mitLegendentext(legende, farbe, (teile[3] ?? "").trim());
    else bleibt.push(zeile);
  }
  return { text: bleibt.join("\n").trim(), legende };
}
