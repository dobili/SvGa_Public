/**
 * Porträt eines eigenen Bots als Profilbild lesen und zurückschreiben (seit 0.2.140, Wunsch des
 * Autors: den Baukasten auch für eigene Bots).
 *
 * Rolle im Gesamtbild: Der Bot speichert wie bisher `portraet` (Kennung der Porträtwahl) oder
 * neu `portraetBau` (selbst gebaut, engine/gegner.ts); die Porträtwahl (Portraetwahl.tsx) rechnet
 * mit Profilbildern. Nur eines der beiden Felder ist gesetzt.
 * Abhängigkeiten: engine/gegner.ts, speicher/profil.ts.
 */
import type { EigenerGegner } from "../../engine/gegner";
import type { Profilbild } from "../../speicher/profil";

/** Das Porträt des Bots als Profilbild; ohne Porträt null. */
export function bildVon(g: EigenerGegner): Profilbild | null {
  if (g.portraetBau) return { art: "bau", ...g.portraetBau };
  return g.portraet ? { art: "wahl", kennung: g.portraet } : null;
}

/**
 * Der Bot mit diesem Porträt (null: kein Bild). Beispiel: gebautes Bild → `portraetBau` gesetzt,
 * `portraet` entfernt.
 */
export function mitBild(g: EigenerGegner, bild: Profilbild | null): EigenerGegner {
  const ohne: EigenerGegner = { ...g };
  delete (ohne as { portraet?: unknown }).portraet;
  delete (ohne as { portraetBau?: unknown }).portraetBau;
  if (!bild) return ohne;
  if (bild.art === "wahl") return { ...ohne, portraet: bild.kennung };
  return { ...ohne, portraetBau: { merkmale: bild.merkmale, svg: bild.svg } };
}
