/**
 * Oberflächentexte des Abenteuers: eigene kleine Textdatei je Sprache, getrennt von i18n/de.json
 * der App (docs/spiel/04_Architektur.md, Abschnitt 9; Baustein F11; Mehrsprachigkeit:
 * docs/spiel/17_Mehrsprachigkeit.md, Abschnitt 3).
 *
 * Rolle im Gesamtbild: Die deutsche Quelle ist inhalte/abenteuer/texte/de.json (Schema
 * schemas/abenteuer-texte.schema.json); sie wird hier direkt eingebunden, damit die Schlüssel
 * beim Bauen geprüft sind (Typ Spieltextschluessel), und ist die Rückfallsprache. Weitere Sprachen
 * (`texte/<sprache>.json` im Zusatzpaket) lädt `ladeSpieltexte` nach der Sprache der App; jeder
 * Schlüssel, der dort fehlt, kommt auf Deutsch. So wird das Spiel nie halb leer, höchstens
 * stellenweise deutsch, solange eine Übersetzung unfertig ist.
 * Abhängigkeiten: inhalte/abenteuer/texte/de.json, paket/paketlader.ts, schnittstelle/spielfehler.ts.
 */
import de from "../../../../inhalte/abenteuer/texte/de.json";
import { liesPaketJson } from "../paket/paketlader";
import { Spielfehler } from "../schnittstelle/spielfehler";

export type Spieltextschluessel = keyof typeof de;

/** Die Rückfallsprache und Sprache der Quelle. */
export const GRUNDSPRACHE = "de";

const TEXTE: Readonly<Record<string, string>> = de;

/** Texte der gewählten Sprache (leer bei Deutsch) und ihr Kürzel. */
let uebersetzung: Readonly<Record<string, string>> = {};
let gewaehlt = GRUNDSPRACHE;

/** Liest eine Textdatei der Sprache; im Test austauschbar. */
export type Textlader = (pfad: string) => Promise<Readonly<Record<string, string>>>;

/**
 * Lädt die Spieltexte einer Sprache aus dem Paket (`texte/<sprache>.json`). Gibt es die Datei
 * nicht, bleibt alles deutsch. Ausgabe: die Sprache, die jetzt gilt.
 * Beispiel: App auf Englisch, Paket ohne en.json → „de“; mit en.json → „en“.
 */
export async function ladeSpieltexte(
  sprache: string,
  lade: Textlader = (pfad) => liesPaketJson<Record<string, string>>(pfad),
): Promise<string> {
  if (sprache === gewaehlt) return gewaehlt;
  if (sprache === GRUNDSPRACHE) {
    uebersetzung = {};
    gewaehlt = GRUNDSPRACHE;
    return gewaehlt;
  }
  try {
    uebersetzung = await lade(`texte/${sprache}.json`);
    gewaehlt = sprache;
  } catch {
    // Keine Übersetzung im Paket: Deutsch bleibt (gewollter Rückfall, kein Fehler für den Spieler).
    uebersetzung = {};
    gewaehlt = GRUNDSPRACHE;
  }
  return gewaehlt;
}

/** Die Sprache, in der das Spiel gerade spricht (für Dialoge: `dialoge/<sprache>/`). */
export function spielsprache(): string {
  return gewaehlt;
}

/**
 * Ein Text des Spiels mit Platzhaltern wie {name}.
 * Beispiel: tSpiel("oberwelt.zurueckZurStadt", { ort: "Maple Falls" }) → „Zurück nach Maple Falls“.
 * Sonderfall: Ein Schlüssel aus den Spieldaten (Name einer Figur), der fehlt, kommt als Schlüssel
 * zurück, damit der Fehler sichtbar ist und nichts abstürzt.
 */
export function tSpiel(
  schluessel: Spieltextschluessel | string,
  werte: Readonly<Record<string, string | number>> = {},
): string {
  const text = uebersetzung[schluessel] ?? TEXTE[schluessel] ?? schluessel;
  return text.replace(/\{(\w+)\}/g, (_, name: string) => String(werte[name] ?? `{${name}}`));
}

/** Gibt es diesen Text? Für Listen mit Lücken, etwa die Antworten der Gegner auf Sprüche. */
export function hatSpieltext(schluessel: string): boolean {
  return uebersetzung[schluessel] !== undefined || TEXTE[schluessel] !== undefined;
}

/**
 * Die Meldung zu einem Fehler für den Spieler: ein `Spielfehler` über seinen Schlüssel, alles
 * andere (Programmfehler) mit seiner technischen Meldung im übersetzten Rahmen der Oberwelt.
 * Beispiel: Spielfehler("fehler.paket.datei", { pfad: "karten/x.json", status: 404 }) →
 * „Die Spieldatei karten/x.json fehlt (404).“
 */
export function fehlertext(fehler: unknown): string {
  if (fehler instanceof Spielfehler) return tSpiel(fehler.schluessel, fehler.werte);
  return fehler instanceof Error ? fehler.message : String(fehler);
}
