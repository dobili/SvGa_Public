/**
 * Karte „Abzeichen testen“ auf der Aufgabenseite des Autors: jedes Abzeichen und den nächsten
 * Stufenaufstieg zur Probe auslösen, ohne echte Daten zu ändern.
 *
 * Rolle im Gesamtbild: Vorbild ist „Orden testen“ (OrdenProbe.tsx, Wunsch des Autors,
 * 26.10.2026): Der Autor soll Meldung, Gitter und Stufe prüfen können, ohne erst 100 Partien zu
 * spielen. Die Probe steht in Merkern auf dem Gerät (abzeichenstand.ts); „Probe beenden“ stellt
 * alles zurück und vergisst die Meldungen der geprobten Abzeichen.
 * Abhängigkeiten: abzeichenstand.ts, abzeichen.ts, i18n.
 */
import { t } from "../../../i18n/sprache";
import { ABZEICHEN, abzeichenname } from "./abzeichen";
import {
  beendeAbzeichenprobe,
  probeAbzeichen,
  probeNaechsteStufe,
  useAbzeichenprobeAktiv,
  useAbzeichenstand,
} from "./abzeichenstand";

/** Die Karte mit einem Knopf je Abzeichen und einem für den Aufstieg. */
export function AbzeichenProbe() {
  const stand = useAbzeichenstand();
  const aktiv = useAbzeichenprobeAktiv();
  if (!stand) return null;
  return (
    <details className="karte anleitung" data-testid="abzeichen-probe">
      <summary>{t("abzeichenprobe.titel")}</summary>
      <p className="hinweis">{t("abzeichenprobe.erklaerung")}</p>
      <ul className="ordenprobe-liste">
        <li>
          <button
            type="button"
            className="knopf-link links"
            disabled={stand.stufe.naechsteAb === null}
            onClick={() => probeNaechsteStufe(stand.stufe)}
          >
            {t("abzeichenprobe.stufe")}
          </button>
        </li>
        {ABZEICHEN.map((a) => (
          <li key={a.kennung}>
            <button
              type="button"
              className="knopf-link links"
              disabled={stand.verdient.has(a.kennung)}
              onClick={() => probeAbzeichen(a.kennung)}
            >
              {t("abzeichenprobe.verdienen", { name: abzeichenname(a.kennung) })}
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="knopf-zweit"
        disabled={!aktiv}
        onClick={() => beendeAbzeichenprobe(stand.stufe.ep)}
      >
        {t("abzeichenprobe.beenden")}
      </button>
    </details>
  );
}
