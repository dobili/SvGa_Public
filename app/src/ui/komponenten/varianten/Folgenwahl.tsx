/**
 * Die beiden Haken für die Engine-Folgen beim Öffnen einer ausgewerteten Partie als Variante:
 * „Engine-Folgen übernehmen“ und „auch an Fehlern des Gegners“.
 *
 * Rolle im Gesamtbild: Rückmeldungen des Autors (1.11.2026): Er hatte die Folgen erwartet und den
 * Schalter übersehen (deshalb vorab an), und in seinen Partien machte vor allem der Gegner Fehler
 * (deshalb der zweite Haken, ebenfalls vorab an). Genutzt am Gabel-Knopf der Partie
 * (PartieGabel.tsx) und unter Neue Variante › Partie (Neuquellen.tsx).
 * Abhängigkeiten: React, i18n.
 */
import { t } from "../../../i18n/sprache";
import type { Folgenstand } from "./folgenstand";

/** Die Haken; „Gegner“ ist nur wählbar, wenn die Folgen an sind. */
export function Folgenwahl({
  stand,
  setze,
}: {
  stand: Folgenstand;
  setze: (neu: Folgenstand) => void;
}) {
  return (
    <>
      <label className="schalterzeile">
        <input
          type="checkbox"
          checked={stand.engine}
          onChange={(e) => setze({ ...stand, engine: e.target.checked })}
        />
        <span>{t("varianten.engine.schalter")}</span>
      </label>
      <label className="schalterzeile">
        <input
          type="checkbox"
          checked={stand.engine && stand.gegner}
          disabled={!stand.engine}
          onChange={(e) => setze({ ...stand, gegner: e.target.checked })}
        />
        <span>{t("varianten.engine.gegner")}</span>
      </label>
    </>
  );
}
