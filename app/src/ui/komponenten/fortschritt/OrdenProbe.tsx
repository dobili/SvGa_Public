/**
 * Karte „Orden testen“ auf der Aufgabenseite des Autors: jeden Ring zur Probe auf 100 % setzen.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (26.10.2026): im Menü mit seinen Aufgaben Ereignisse
 * auslösen, etwa „Ring XY ist gerade voll geworden“, um Gratulation mit Ton, Orden im Profil und die
 * Orden in der Startanimation zu prüfen. Die Probe ändert keine echten Daten (ordenprobe.ts);
 * „Probe beenden“ stellt alles zurück, „Neu starten“ zeigt die Startanimation.
 * Abhängigkeiten: ordenprobe.ts, fortschrittsringe.ts, ringrechnung.ts, i18n.
 */
import { t } from "../../../i18n/sprache";
import { useFortschrittsringe } from "./fortschrittsringe";
import { beendeProbe, probeRing, useOrdenprobe } from "./ordenprobe";
import { istVoll } from "./ringrechnung";

/** Die Karte mit einem Knopf je Ring. */
export function OrdenProbe() {
  const ringe = useFortschrittsringe();
  const probe = useOrdenprobe();
  if (!ringe) return null;
  const alle = [...ringe.buchringe, ...ringe.teilringe, ...ringe.botringe];
  return (
    <details className="karte anleitung" data-testid="orden-probe">
      <summary>{t("ordenprobe.titel")}</summary>
      <p className="hinweis">{t("ordenprobe.erklaerung")}</p>
      <ul className="ordenprobe-liste">
        {alle.map((ring) => (
          <li key={ring.testid}>
            <button
              type="button"
              className="knopf-link links"
              disabled={istVoll(ring.anteil)}
              onClick={() => probeRing(ring.testid)}
            >
              {t("ordenprobe.voll", { name: ring.name })}
            </button>
          </li>
        ))}
      </ul>
      <div className="knopfreihe">
        <button
          type="button"
          className="knopf-zweit"
          disabled={probe.size === 0}
          onClick={beendeProbe}
        >
          {t("ordenprobe.beenden")}
        </button>
        <button type="button" className="knopf-zweit" onClick={() => window.location.reload()}>
          {t("ordenprobe.neustart")}
        </button>
      </div>
    </details>
  );
}
