/**
 * Wer in der Sprechblase spricht (docs/spiel/29_Tischgespraech.md, Abschnitte 2 und 6): fertige
 * Blasenzeilen für den Gegner (oben), Ambrose (unten, halb durchsichtig) und den Held (unten),
 * dazu die Zeilen der Karten und des Schutzengels.
 *
 * Rolle im Gesamtbild: Hilfe für Tischgespraech.tsx, Schutzengelzeile.tsx, Momentzeile.tsx und
 * die Kartenleiste; die Texte sucht anbindung/tischtexte.ts. Ambroses Karten (Mentor-Zug,
 * Schutzengel, Fingerzeig, Flüstern) spricht Ambrose, alle übrigen Karten der Held.
 * Abhängigkeiten: anbindung/tischblasen.ts, anbindung/tischtexte.ts, regeln/abwesenheit.ts,
 * regeln/schutzengel.ts (Typ), texte/texte.ts.
 */
import { AMBROSE, istAmbrosesKarte } from "../regeln/abwesenheit";
import type { Schutzgrund } from "../regeln/schutzengel";
import type { Kartensorte } from "../schnittstelle/karten";
import { tSpiel } from "../texte/texte";
import type { Blasenzeile, Vorrang } from "./tischblasen";
import { stimmungDerGruppe, zieheAus, type Tischtext } from "./tischtexte";

/** Was jede Zeile außer dem Sprecher braucht. */
interface Zeilenangaben {
  readonly schluessel: string;
  readonly vorrang: Vorrang;
  readonly testid: string;
}

/** Die Zeile des Gegners oder dessen, der die Aufgabe stellt, oben über dem Brett. */
export function gegnerzeile(
  text: Tischtext,
  sprecher: string | null,
  name: string,
  angaben: Zeilenangaben,
): Blasenzeile {
  return { ...angaben, ...text, lage: "oben", sprecher, name, geist: false };
}

/** Ambroses Zeile unten, halb durchsichtig wie in der Welt. */
export function ambrosezeile(text: Tischtext, angaben: Zeilenangaben): Blasenzeile {
  const name = tSpiel(`figur.${AMBROSE}.name`);
  return { ...angaben, ...text, lage: "unten", sprecher: AMBROSE, name, geist: true };
}

/** Die Zeile des Helden unten (ohne Porträt; der Held ist der Leser). */
export function heldenzeile(text: string, angaben: Zeilenangaben): Blasenzeile {
  const name = tSpiel("figur.held.standard");
  return { ...angaben, text, stimmung: null, lage: "unten", sprecher: null, name, geist: false };
}

/** Stimmung des Porträts, wenn der Schutzengel aufhält (Abschnitt 6). */
const ENGELSTIMMUNG: Readonly<Record<Schutzgrund, string>> = {
  haengt: "ernst",
  koenig: "ueberrascht",
  matt: "ueberrascht",
};

/**
 * Ambroses Zeile, wenn der Schutzengel einen Zug aufhält: eine Variante von „Das spielst du besser
 * nicht.“ und eine zur Art des Fehlers, nie der bessere Zug.
 * Beispiel: „haengt“ → „Halt, halt. Da hängt etwas.“, Stimmung „ernst“.
 */
export function schutzengeltext(grund: Schutzgrund, partiekennung: string): Tischtext {
  const halt = zieheAus(["schutzengel.halt"], 0, partiekennung) ?? "schutzengel.halt";
  const art = zieheAus([`schutzengel.${grund}`], 0, partiekennung) ?? `schutzengel.${grund}`;
  return { text: `${tSpiel(halt)} ${tSpiel(art)}`, stimmung: ENGELSTIMMUNG[grund] };
}

/**
 * Die Zeile einer gespielten Werkzeug-, Zeit- oder Ambrose-Karte (`karte.<kennung>.zeile.<n>`),
 * oder null, wenn die Karte keine hat. Ambroses Karten spricht Ambrose, die übrigen der Held.
 * Beispiel: „abzaehlen“ → Held „Eins, zwei … und wer verteidigt?“; „fingerzeig“ → Ambrose.
 */
export function kartenzeile(
  sorte: Kartensorte,
  partiekennung: string,
  ambroseDa: boolean,
): Blasenzeile | null {
  const gruppe = `karte.${sorte.kennung}.zeile`;
  const schluessel = zieheAus([gruppe], 0, partiekennung);
  if (!schluessel) return null;
  const angaben = {
    schluessel: `${partiekennung}:karte:${sorte.kennung}`,
    vorrang: "geschrieben" as const,
    testid: "abenteuer-kartenstimme",
  };
  const text = { text: tSpiel(schluessel), stimmung: stimmungDerGruppe(gruppe) };
  if (istAmbrosesKarte(sorte)) return ambroseDa ? ambrosezeile(text, angaben) : null;
  return heldenzeile(text.text, angaben);
}
