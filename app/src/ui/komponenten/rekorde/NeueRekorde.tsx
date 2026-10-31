/**
 * Meldung „Neuer Rekord“ (Gamifizierung P5) am Ende einer Trainerrunde und der Zeitrunde.
 *
 * Rolle im Gesamtbild: training/rekorde.ts liefert die Verbesserungen; hier stehen sie als Sätze.
 * RekordNachRunde ist der Eintrag in NACH_DER_RUNDE (ui/trainer/nachDerRunde.ts): Sie prüft nach
 * dem Rundenende die Rekorde der Quelle „runde“ und zeigt, was neu ist. Die Zeitrunde
 * (ui/trainer/ZeitrundeBereich.tsx) prüft selbst und zeigt nur die Liste.
 * Abhängigkeiten: rekordtexte.ts, useRekordpruefung.ts, i18n.
 */
import { t } from "../../../i18n/sprache";
import type { Verbesserung } from "../../../training/rekorde";
import { rekordtext } from "./rekordtexte";
import { useRekordpruefung } from "./useRekordpruefung";

/** Ein Satz je Verbesserung; ohne Verbesserung nichts. */
export function NeueRekorde({ neue }: { neue: readonly Verbesserung[] }) {
  if (neue.length === 0) return null;
  return (
    <div data-testid="neuer-rekord">
      {neue.map(({ kennung, wert, vorher }) => (
        <p key={kennung} className="meldung gut" role="status">
          {vorher === null
            ? t("rekorde.neuErster", { text: rekordtext(kennung, wert) })
            : t("rekorde.neu", { text: rekordtext(kennung, wert), vorher })}
        </p>
      ))}
    </div>
  );
}

/** Eintrag am Rundenende: Rekorde der Quelle „runde“ prüfen und Neues melden. */
export function RekordNachRunde() {
  return <NeueRekorde neue={useRekordpruefung({ quelle: "runde" })} />;
}
