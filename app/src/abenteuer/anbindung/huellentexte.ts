/**
 * Texte und kleine Rechnungen der Spielhülle (docs/spiel/18_Spielhuelle.md): Name des Gegners,
 * Statuszeile in der Sprache der Geschichte, Sprecherkennung aus dem Porträtpfad.
 *
 * Rolle im Gesamtbild: Reine Funktionen für anbindung/Huelle.tsx und anbindung/PartieHuelle.tsx,
 * getrennt von den Komponenten, damit sie ohne Oberfläche prüfbar sind (huellentexte.test.ts).
 * Abhängigkeiten: spiel/partie.ts (Typ), ui/komponenten/partie/usePartie.ts (Typ), texte/texte.ts.
 */
import type { Partie } from "../../spiel/partie";
import type { Partiesteuerung } from "../../ui/komponenten/partie/usePartie";
import { tSpiel } from "../texte/texte";

/**
 * Sprecherkennung aus dem Porträtpfad des Gegnerprofils.
 * Beispiel: „portraets/coach-delgado.svg“ → „coach-delgado“; ohne Pfad null.
 */
export function sprecherAusPfad(pfad: string | undefined): string | null {
  const name = pfad
    ?.split("/")
    .pop()
    ?.replace(/\.[a-z]+$/, "");
  return name ? name : null;
}

/** Name des Gegners für Kopf, Uhr und Status; ohne Namen „Gegner“. */
export function gegnerName(partie: Partie | null): string {
  return partie?.einstellung.botName ?? tSpiel("huelle.gegner");
}

/**
 * Die Statuszeile in der Sprache der Geschichte.
 * Beispiel: Jo ist am Zug → „Skater Jo überlegt …“; der Leser → „Du bist am Zug.“
 */
export function statustext(
  s: Pick<Partiesteuerung, "fehler" | "engineDenkt">,
  gegner: string,
): string {
  if (s.fehler) return tSpiel("huelle.fehler", { fehler: s.fehler });
  return s.engineDenkt
    ? tSpiel("huelle.gegnerUeberlegt", { gegner })
    : tSpiel("huelle.duBistAmZug");
}

/**
 * Der Grund unter dem Ergebnis der Blende in der Sprache der Geschichte, für Enden mit Sieger.
 * Warum: Die App sagt „Die Engine hat aufgegeben.“; im Abenteuer sitzt ein Mensch gegenüber.
 * Beispiel: Skater Jo gibt auf → „Skater Jo gibt auf.“; Matt gegen den Leser → „Matt. Skater Jo
 * hat gewonnen.“ Sonderfall: Remis und laufende Partien → null (der Satz der App passt dort).
 */
export function endgrund(partie: Partie, gegner: string): string | null {
  const ende = partie.ende;
  // Varianten sagen ihr Ende selbst („Dreimal Schach!“, „Der König steht auf dem Hügel.“).
  if (ende?.art === "variante" || ende?.art === "varianteRemis") return tSpiel(ende.grund);
  if (!ende || !("sieger" in ende)) return null;
  const wer = ende.sieger === partie.einstellung.eigeneFarbe ? "du" : "gegner";
  return tSpiel(`huelle.ende.${ende.art}.${wer}`, { gegner });
}

/**
 * Sprecherkennung aus dem Textschlüssel eines Figurennamens (Aufgabenrunde: wer die Aufgaben stellt).
 * Beispiel: „figur.coachDelgado.name“ → „coachDelgado“; ein anderer Schlüssel → null.
 */
export function sprecherAusSchluessel(schluessel: string): string | null {
  const teile = schluessel.split(".");
  return teile[0] === "figur" && teile[1] ? teile[1] : null;
}
