/**
 * Marke der Zugklasse am Brett: beim Nachspielen einer ausgewerteten Partie sitzt die runde
 * Marke (etwa „??“ auf Rot) oben rechts am Zielfeld des gezeigten Zuges, wie bei chess.com.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (25.10.2026): Die Symbole der Zugbewertungen aus
 * „Deine Züge“ sollen auch an den Zügen der Zugliste und am Brett an der gezogenen Figur stehen.
 * Die Zugliste zeigt dieselbe Marke (Partiezuege.tsx); hier nur die Lage auf dem Brett. Die Marke
 * ist Schmuck (aria-hidden), Bildschirmleser hören die Klasse in der Zugliste.
 * Abhängigkeiten: zugmarke.ts (Lage am Feld), Auswertungssymbole.tsx.
 */
import type { Zugklasse } from "../../../spiel/auswertung";
import { Klassenmarke } from "../auswertung/Auswertungssymbole";
import { markenlage } from "./zugmarke";

/** Die Marke am Feld; ohne Feld oder Klasse nichts. */
export function Zugmarke({
  feld,
  klasse,
  gedreht,
}: {
  feld: string | null;
  klasse: Zugklasse | null;
  gedreht: boolean;
}) {
  const lage = feld && klasse ? markenlage(feld, gedreht) : null;
  if (!lage || !klasse) return null;
  return (
    <span
      className="zugmarke-brett"
      style={{ left: `${lage.links}%`, top: `${lage.oben}%` }}
      data-testid="zugmarke-brett"
      data-klasse={klasse}
    >
      <Klassenmarke klasse={klasse} />
    </span>
  );
}
