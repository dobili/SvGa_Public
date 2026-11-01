/**
 * Format 0: die Merker der ersten Testversionen im localStorage als Rohobjekt für wandleUm.
 *
 * Rolle im Gesamtbild: Aus speicher/format.ts ausgelagert (Welle 0 der Gamifizierung, damit die
 * Datei unter 400 Zeilen bleibt). Wer vor 0.2.20 die App nutzte, hatte Einstellungen und
 * Lernstand nur in Merkern; das erste Laden übernimmt sie (speicher/speicher.ts). Dazu die alten
 * Namen der Figurensätze (seit Format 8 hier, damit format.ts unter 400 Zeilen bleibt).
 * Abhängigkeiten: speicher/format.ts (nur Typen und die Liste der Bildsätze).
 */
import { BILDSAETZE, type Bildsatz, type Figurensatz } from "./format";

/**
 * Die Merker aus Format 0 als Rohobjekt (ohne schemaVersion).
 *
 * Eingaben: die Texte der Merker „einstellungen“ und „lernstand“ (null, wenn nicht vorhanden).
 * Ausgabe: Rohobjekt für wandleUm, kaputtes JSON zählt als nicht vorhanden.
 * Beispiel: {"brettfarben":"holz"} und {"1":[0,2]} → Holzbrett, in Kapitel 1 zwei Haken.
 */
export function merkerAlsFormat0(
  einstellungen: string | null,
  lernstand: string | null,
): Record<string, unknown> {
  const lies = (text: string | null): unknown => {
    if (!text) return undefined;
    try {
      return JSON.parse(text);
    } catch (fehler) {
      console.warn("Merker aus Version 0.2 nicht lesbar, wird leer übernommen:", fehler);
      return undefined;
    }
  };
  return { einstellungen: lies(einstellungen), lernstand: lies(lernstand) };
}

/**
 * Alte Namen der Figurensätze und ihr Nachfolger: „kontrastreich“ (bis 0.2.38) und „klassisch“
 * (bis 0.2.80) waren die Figuren von Colin Burnett; „holz“ (bis 0.2.80, umgefärbte Merida-Figuren)
 * wird der erste neue Holzsatz, damit der Leser weiter Holzfiguren sieht.
 */
const ALTE_SAETZE: ReadonlyMap<string, Bildsatz> = new Map([
  ["kontrastreich", "klassisch-cburnett"],
  ["klassisch", "klassisch-cburnett"],
  ["holz", "holz-kiefer-kirsche"],
]);

/** Der Figurensatz aus Rohdaten; alte Namen werden übernommen, Unbekanntes ist „buch“. */
export function figurensatzAus(roh: unknown): Figurensatz {
  if (typeof roh !== "string") return "buch";
  const alt = ALTE_SAETZE.get(roh);
  if (alt) return alt;
  return BILDSAETZE.find((satz) => satz === roh) ?? "buch";
}
