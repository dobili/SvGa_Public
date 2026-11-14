/**
 * Porträt des Gegners auf der Ergebnisblende der Partie (docs/spiel/30_Bedienung_und_Brettstile.md,
 * Abschnitt 4: „Die Ergebnisblende ist eine Karte des Spiels … Porträt des Gegners in der
 * passenden Stimmung“).
 *
 * Rolle im Gesamtbild: PartieHuelle.tsx reicht es der Ergebnisblende der App als Bild herein;
 * die Blende selbst bleibt die der App, ihr Aussehen als Spielkarte steht in spielfarben.css.
 * Abhängigkeiten: dialog/Portraet.tsx, anbindung/huellentexte.ts, spiel/partienfilter.ts.
 */
import type { Partie } from "../../spiel/partie";
import { ergebnisFuerLeser } from "../../spiel/partienfilter";
import { Portraet } from "../dialog/Portraet";
import { sprecherAusPfad } from "./huellentexte";

/** Stimmung des Gegners nach dem Ergebnis des Lesers: verliert der Leser, freut sich der Gegner. */
const STIMMUNG_NACH_ERGEBNIS: Readonly<Record<string, string | null>> = {
  gewonnen: "bitter",
  verloren: "froh",
  remis: null,
};

/**
 * Das Porträt oder nichts (Partie ohne Porträt, etwa die Übungspartie ohne Bild).
 * Beispiel: Sieg gegen Skater Jo → Jo mit der Fassung zu „bitter“.
 */
export function Gegnerbild({ partie }: { readonly partie: Partie }) {
  const sprecher = sprecherAusPfad(partie.einstellung.abenteuer?.portraet);
  if (!sprecher) return null;
  const ergebnis = ergebnisFuerLeser(partie) ?? "remis";
  return <Portraet sprecher={sprecher} stimmung={STIMMUNG_NACH_ERGEBNIS[ergebnis] ?? null} />;
}
