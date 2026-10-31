/**
 * Die ruhige Zeile „Aus deinen Zügen: etwa … (von–bis, aus N Partien)“ unter den Kacheln der Karte
 * „Deine Wertung“ (zurückgeholt am 31.10.2026, Wunsch des Autors).
 *
 * Rolle im Gesamtbild: Die Wertung folgt den Ergebnissen; die Schätzung aus den Zügen
 * (spiel/wertung.ts, staerkeLetzterPartien, wie „Deine Spielstärke“ unter Spielen) folgt der
 * Zugqualität. Bis 0.3.30 stand sie hinter dem Fragezeichen der Karte; seit „Profil neu“ fehlte
 * sie. Jetzt steht sie für die gewählte Zeitklasse im gewählten Maßstab unter den Kacheln, damit
 * Ergebnis und Zugqualität nebeneinander stehen. Außerhalb der Vergleichstabellen keine Zeile.
 * Abhängigkeiten: spiel/wertung.ts, fortschritt/wertungsmassstab.ts, wertungskacheln.ts, i18n.
 */
import { useMemo } from "react";
import { tZahl } from "../../../i18n/sprache";
import type { Wertungstempo } from "../../../spiel/elomodell";
import type { Partieeintrag } from "../../../speicher/partien";
import { staerkeLetzterPartien } from "../../../spiel/wertung";
import { spanneImMassstab, type Wertungsmassstab } from "../fortschritt/wertungsmassstab";
import { zahlInMassstab } from "./wertungskacheln";

/** Beispiel: Schnellschach, drei ausgewertete Partien → „Aus deinen Zügen: etwa 1550 (1150–1950, aus 3 Partien).“ */
export function Zugschaetzung({
  partien,
  tempo,
  massstab,
}: {
  partien: readonly Partieeintrag[];
  tempo: Wertungstempo;
  massstab: Wertungsmassstab;
}) {
  const zuege = useMemo(() => staerkeLetzterPartien(partien, tempo), [partien, tempo]);
  if (!zuege) return null;
  const mitte = zahlInMassstab(tempo, zuege.mitte, massstab);
  const spanne = spanneImMassstab(tempo, zuege.von, zuege.bis, massstab);
  if (mitte === null || !spanne) return null;
  return (
    <p className="hinweis wertung-zuege" data-testid="wertung-zuege">
      {tZahl("profil.wertung.ausZuegen", zuege.partien, {
        mitte,
        von: spanne.von,
        bis: spanne.bis,
        partien: zuege.partien,
      })}
    </p>
  );
}
