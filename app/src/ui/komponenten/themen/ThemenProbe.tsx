/**
 * Karte „Themen testen“ auf der Aufgabenseite des Autors (Gamifizierung P3): ein Thema zur Probe
 * auf Silber oder Gold setzen, ohne echte Antworten zu ändern.
 *
 * Rolle im Gesamtbild: Vorbild ist „Orden testen“ (fortschritt/OrdenProbe.tsx). Angeboten werden
 * alle Themen, die schon im Protokoll stehen, und die Taktikmotive des Taktiktrainers (MOTIVE),
 * damit die Probe auch auf einem frischen Gerät etwas zeigt. „Probe beenden“ stellt alles zurück.
 * Abhängigkeiten: themenprobe.ts, useMeisterschaft.ts, thementexte.ts, training/taktiktrainer.ts,
 * speicher/themenprotokoll.ts, i18n.
 */
import { t } from "../../../i18n/sprache";
import { themaTaktik } from "../../../speicher/themenprotokoll";
import { MOTIVE } from "../../../training/taktiktrainer";
import { beendeThemenprobe, probeThema, useThemenprobe } from "./themenprobe";
import { themenname } from "./thementexte";
import { useThemenmedaillen } from "./useMeisterschaft";

/** Die Karte mit zwei Knöpfen je Thema. */
export function ThemenProbe() {
  const probe = useThemenprobe();
  const medaillen = useThemenmedaillen();
  const themen = [...new Set([...medaillen.map((m) => m.thema), ...MOTIVE.map(themaTaktik)])];
  return (
    <details className="karte anleitung" data-testid="themen-probe">
      <summary>{t("themen.probe.titel")}</summary>
      <p className="hinweis">{t("themen.probe.erklaerung")}</p>
      <ul className="ordenprobe-liste">
        {themen.map((thema) => (
          <li key={thema}>
            <button
              type="button"
              className="knopf-link links"
              onClick={() => probeThema(thema, "silber")}
            >
              {t("themen.probe.silber", { name: themenname(thema) })}
            </button>
            <button
              type="button"
              className="knopf-link links"
              onClick={() => probeThema(thema, "gold")}
            >
              {t("themen.probe.gold", { name: themenname(thema) })}
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="knopf-zweit"
        disabled={Object.keys(probe).length === 0}
        onClick={beendeThemenprobe}
      >
        {t("themen.probe.beenden")}
      </button>
    </details>
  );
}
