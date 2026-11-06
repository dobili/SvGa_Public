/**
 * Der Zug des Lesers am Brett der Partie: Tippen auf Figur und Zielfeld spielt den Zug sofort.
 * Ist „Zählen“ gewählt, zählt ein Tipp stattdessen das Feld.
 *
 * Rolle im Gesamtbild: Teil des Partie-Bildschirms (ui/bildschirme/Partie.tsx); ausgelagert am
 * 6.11.2026, damit der Bildschirm unter 400 Zeilen bleibt, als die Linien des Rückblicks dazukamen.
 * Abhängigkeiten: brettbedienung/useBrettbedienung.ts, schach/weiterspielen.ts, usePartie.ts (Typ).
 */
import { spieleZug } from "../../../schach/weiterspielen";
import { useBrettbedienung } from "../brettbedienung/useBrettbedienung";
import type { Partiesteuerung } from "./usePartie";

/**
 * Bedienung des Brettes für die gezeigte Stellung. Eingaben: Steuerung der Partie, gezeigte
 * Stellung (FEN), ob „Zählen“ gewählt ist. Beispiel: e2 und e4 antippen spielt 1. e4.
 */
export function useLeserzug(s: Partiesteuerung, gezeigt: string, zaehlen: boolean) {
  return useBrettbedienung(
    {
      fen: gezeigt,
      spiele: (von, nach, rolle) => {
        const versuch = spieleZug(gezeigt, von, nach, rolle);
        if (versuch.art === "gespielt") s.spieleLeser(versuch.san);
        return versuch.art;
      },
    },
    zaehlen ? "zaehlen" : "ziehen",
    () => undefined,
  );
}
