/**
 * Der Text einer Zeile „Geräusche als Text“ aus den Spieltexten (ton/untertitel.ts).
 *
 * Rolle im Gesamtbild: Getrennt von ton/untertitel.ts, weil die Tonregie mit der App geladen wird
 * und die großen Spieltexte nicht mitziehen soll; nur ton/Untertitelzeile.tsx (im Spielbaustein)
 * liest die Texte. Fehlt ein Text, erscheint zu diesem Klang nichts (lieber still als eine rohe
 * Kennung).
 * Abhängigkeiten: ton/untertitel.ts, texte/texte.ts.
 */
import { hatSpieltext, tSpiel } from "../texte/texte";
import { untertitelschluessel, type Untertitel } from "./untertitel";

/**
 * Der Text einer Zeile: der erste vorhandene Schlüssel, in den Rahmen der Art gesetzt; sonst null.
 * Beispiel: Musik „musik/maple-falls.ogg“ → „[Musik: warm, tastend]“; Geräusch „wasserfall“ →
 * „[Wasserfall rauscht]“.
 */
export function untertiteltext(zeile: Pick<Untertitel, "art" | "angabe">): string | null {
  const schluessel = untertitelschluessel(zeile.art, zeile.angabe).find(hatSpieltext);
  if (!schluessel) return null;
  const rahmen = zeile.art === "musik" ? "untertitel.rahmenMusik" : "untertitel.rahmen";
  return tSpiel(rahmen, { text: tSpiel(schluessel) });
}
