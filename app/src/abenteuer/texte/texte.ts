/**
 * Oberflächentexte des Abenteuers: eigene kleine Textdatei je Sprache, getrennt von i18n/de.json
 * der App (docs/spiel/04_Architektur.md, Abschnitt 9; Baustein F11).
 *
 * Rolle im Gesamtbild: Die Quelle ist inhalte/abenteuer/texte/de.json (Schema
 * schemas/abenteuer-texte.schema.json); sie wird hier direkt eingebunden, damit die Schlüssel
 * beim Bauen geprüft sind (Typ Spieltextschluessel), und liegt zusätzlich im Zusatzpaket für
 * spätere Sprachen. Figuren- und Ortsnamen aus den Spieldaten sind ebenfalls Schlüssel hier.
 * Abhängigkeiten: inhalte/abenteuer/texte/de.json.
 */
import de from "../../../../inhalte/abenteuer/texte/de.json";

export type Spieltextschluessel = keyof typeof de;

const TEXTE: Readonly<Record<string, string>> = de;

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
  const text = TEXTE[schluessel] ?? schluessel;
  return text.replace(/\{(\w+)\}/g, (_, name: string) => String(werte[name] ?? `{${name}}`));
}

/** Gibt es diesen Text? Für Listen mit Lücken, etwa die Antworten der Gegner auf Sprüche. */
export function hatSpieltext(schluessel: string): boolean {
  return TEXTE[schluessel] !== undefined;
}
