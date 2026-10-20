/**
 * Der Zug der Engine in einer Partie: Buchzüge vorbereiten, Zug wählen, als Partiezug ablegen.
 *
 * Rolle im Gesamtbild: Verbindet die Zugwahl der Stufen (engine/zugwahl.ts, seit AP 11 geeicht)
 * mit der Partie (spiel/partie.ts). Der Eröffnungsindex liefert Buchzüge in SAN,
 * die Zugwahl arbeitet in UCI, die Partie wieder in SAN; die Herkunft und ein absichtlicher Fehler
 * bleiben am Zug hängen, damit die Auswertung sie nennen kann.
 * Abhängigkeiten: engine/zugwahl.ts, engine/stufen.ts, spiel/zuege.ts.
 */
import type { Stufe } from "../engine/stufen";
import {
  BUCHTREUE,
  STANDARDPROFIL,
  waehleZug,
  type Gegnerprofil,
  type Spielbewerter,
} from "../engine/zugwahl";
import type { Partiezug } from "./partie";
import { sanZuUci, uciZuSan } from "./zuege";

/**
 * Wählt und schreibt den Zug der Engine.
 *
 * Eingaben: Bewerter (der Engine-Dienst), Stellung, Stufe, Buchzüge in SAN (leer außerhalb des
 * Buches oder ohne Eröffnungsindex), Zufallsquelle, Buchtreue (1 bei vorgegebener Eröffnung),
 * Profil eines eigenen Gegners (Fehlerarten, Stil; 0.2.42).
 * Ausgabe: Partiezug oder null, wenn es keinen legalen Zug gibt.
 * Beispiel: Grundstellung, Buchzüge [„e4“, „d4“] → meist „e4“ oder „d4“ mit Quelle „buch“.
 * Sonderfall: Ein Buchzug, der in der Stellung nicht geht, fällt still weg (die Daten sind
 * geprüft; das passiert nur bei gleichem Stellungsschlüssel mit anderem en-passant-Recht).
 */
export async function engineZug(
  bewerter: Spielbewerter,
  fen: string,
  stufe: Stufe,
  buchzuege: readonly string[],
  zufall: () => number,
  buchtreue: number = BUCHTREUE,
  profil: Gegnerprofil = STANDARDPROFIL,
): Promise<Partiezug | null> {
  const ergebnis = await engineZugMitLage(
    bewerter,
    fen,
    stufe,
    buchzuege,
    zufall,
    buchtreue,
    profil,
  );
  return ergebnis?.zug ?? null;
}

/**
 * Wie engineZug, dazu der Zug in UCI und die Breite der Wahl (für die Bedenkzeit der Bots,
 * spiel/botzeit.ts, seit 0.2.116). Die Breite bleibt außerhalb des Partiezugs, damit sie nicht
 * mit der Partie gespeichert wird.
 */
export async function engineZugMitLage(
  bewerter: Spielbewerter,
  fen: string,
  stufe: Stufe,
  buchzuege: readonly string[],
  zufall: () => number,
  buchtreue: number = BUCHTREUE,
  profil: Gegnerprofil = STANDARDPROFIL,
): Promise<{ zug: Partiezug; uci: string; breite?: number } | null> {
  const buchUci = buchzuege
    .map((san) => sanZuUci(fen, san))
    .filter((uci): uci is string => uci !== null);
  const wahl = await waehleZug(bewerter, fen, stufe, buchUci, zufall, buchtreue, profil);
  const san = wahl ? uciZuSan(fen, wahl.uci) : null;
  if (!wahl || !san) return null;
  const zug: Partiezug = {
    san,
    von: "engine",
    quelle: wahl.quelle,
    fehler: wahl.fehler,
    verlust: wahl.verlust,
  };
  return { zug, uci: wahl.uci, breite: wahl.breite };
}
