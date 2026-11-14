/**
 * Die Zeilen des Tischgesprächs und der sprechenden Karten aus den Spieltexten
 * (docs/spiel/29_Tischgespraech.md, Abschnitte 5 und 6).
 *
 * Rolle im Gesamtbild: Brücke zwischen den Regeln (regeln/tischgespraech.ts: wer spricht, welche
 * Nummer) und den Texten in inhalte/abenteuer/texte/de.json. Schlüssel:
 * - `tisch.<temperament>.<ereignis>.<n>`, Stimmung unter `….stimmung`;
 * - eigene Zeilen einer Figur gehen vor: `tisch.figur.<ort>.<name>.<ereignis>.<n>` (eine bestimmte
 *   Begegnung, etwa Victor im Finale), sonst `tisch.figur.<name>.<ereignis>.<n>`;
 * - Ambrose: `tisch.ambrose.<ereignis>.<n>`;
 * - Karten: `spruch.<karte>.<n>`, `spruch.konter.<name|temperament>.<n>`,
 *   `spruch.immun.<temperament>.<n>`, `karte.<karte>.zeile.<n>`, `schutzengel.<grund>[.<n>]`.
 * Gezogen wird ohne Wiederholung in einer Partie, mit festem Zufall je Partie.
 * Abhängigkeiten: texte/texte.ts, regeln/tischgespraech.ts.
 */
import { zeilennummer, type Temperament } from "../regeln/tischgespraech";
import { hatSpieltext, tSpiel } from "../texte/texte";

/** Höchstens so viele nummerierte Varianten sucht die Suche (Schutz gegen Endlosschleifen). */
const HOECHSTENS_VARIANTEN = 99;

/**
 * Alle vorhandenen Varianten einer Gruppe: der Schlüssel selbst, wenn es ihn gibt, und
 * `<basis>.1`, `<basis>.2`, … bis zur ersten Lücke.
 * Beispiel: „schutzengel.halt“ → [„schutzengel.halt“, „schutzengel.halt.1“, …, „….6“].
 */
export function varianten(basis: string): readonly string[] {
  const liste = hatSpieltext(basis) ? [basis] : [];
  for (let n = 1; n <= HOECHSTENS_VARIANTEN && hatSpieltext(`${basis}.${n}`); n++) {
    liste.push(`${basis}.${n}`);
  }
  return liste;
}

/**
 * Eine Zeile aus mehreren Gruppen zusammen, ohne Wiederholung in der Partie.
 * Eingaben: Gruppen (alle zusammen bilden den Vorrat), wie oft der Vorrat schon gebraucht wurde,
 * Kennung der Partie. Ausgabe: der Schlüssel oder null bei leerem Vorrat.
 */
export function zieheAus(
  gruppen: readonly string[],
  nutzung: number,
  partiekennung: string,
): string | null {
  const vorrat = gruppen.flatMap(varianten);
  const nummer = zeilennummer(vorrat.length, nutzung, partiekennung, gruppen.join("+"));
  return vorrat[nummer - 1] ?? null;
}

/** Wer spricht: Kennung des Gegners und sein Temperament (oder nur ein Temperament). */
export interface Stimme {
  /** Kennung wie in gegner.json („mapleFalls.skaterJo“); leer ohne Profil. */
  readonly kennung: string;
  readonly temperament: Temperament;
}

/** Die Gruppen eines Ereignisses für eine Stimme, vom Eigenen zum Allgemeinen. */
function gruppenDer(stimme: Stimme, ereignis: string): readonly string[] {
  const [ort, name] = stimme.kennung.split(".");
  const eigene =
    ort && name
      ? [`tisch.figur.${ort}.${name}.${ereignis}`, `tisch.figur.${name}.${ereignis}`]
      : [];
  return [...eigene, `tisch.${stimme.temperament}.${ereignis}`];
}

/** Text und Stimmung einer Zeile. */
export interface Tischtext {
  readonly text: string;
  readonly stimmung: string | null;
}

/**
 * Die Zeile einer Stimme zu einem Ereignis: die erste Gruppe mit Zeilen gilt (eigene Zeilen der
 * Figur vor denen des Temperaments), Stimmung aus derselben Gruppe oder der des Temperaments.
 * Beispiel: Jo, „schlaegtFigur“, erste Nutzung → eine von Jos eigenen Zeilen, Stimmung „lacht“.
 * Sonderfall: Gibt es gar keine Zeile, null (dann schweigt der Tisch).
 */
export function tischtext(
  stimme: Stimme,
  ereignis: string,
  nutzung: number,
  partiekennung: string,
): Tischtext | null {
  const gruppen = gruppenDer(stimme, ereignis);
  const gruppe = gruppen.find((g) => varianten(g).length > 0);
  if (!gruppe) return null;
  const schluessel = zieheAus([gruppe], nutzung, partiekennung);
  if (!schluessel) return null;
  return {
    text: tSpiel(schluessel),
    stimmung: stimmungDerGruppe(gruppe, gruppen.at(-1) ?? gruppe),
  };
}

/**
 * Stimmung des Porträts einer Gruppe (`<gruppe>.stimmung`), sonst die der allgemeinen Gruppe,
 * sonst null. Beispiel: „tisch.frech.schlaegtFigur“ → „lacht“.
 */
export function stimmungDerGruppe(gruppe: string, allgemein: string = gruppe): string | null {
  for (const g of [gruppe, allgemein]) {
    if (hatSpieltext(`${g}.stimmung`)) return tSpiel(`${g}.stimmung`);
  }
  return null;
}

/** Ambroses Zeile zu einem Ereignis. Beispiel: „hinten“ → „Tief durchatmen. …“, Stimmung „ernst“. */
export function ambrosetext(
  ereignis: string,
  nutzung: number,
  partiekennung: string,
): Tischtext | null {
  const gruppe = `tisch.ambrose.${ereignis}`;
  const schluessel = zieheAus([gruppe], nutzung, partiekennung);
  if (!schluessel) return null;
  return { text: tSpiel(schluessel), stimmung: stimmungDerGruppe(gruppe) };
}

/** Kurzname einer Gegnerkennung („cedarCreek.rosa“ → „rosa“). */
export function kurzname(kennung: string): string {
  return kennung.split(".").at(-1) ?? kennung;
}
