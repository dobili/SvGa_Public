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
 * Sprecherkennung aus dem Textschlüssel eines Figurennamens (Aufgabenrunde: wer die Aufgaben stellt).
 * Beispiel: „figur.coachDelgado.name“ → „coachDelgado“; ein anderer Schlüssel → null.
 */
export function sprecherAusSchluessel(schluessel: string): string | null {
  const teile = schluessel.split(".");
  return teile[0] === "figur" && teile[1] ? teile[1] : null;
}
