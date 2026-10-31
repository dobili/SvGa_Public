/**
 * Stationen und Orden auf dem Lernpfad (Gestaltung B1 „Fünf Landschaften“, 31.10.2026).
 *
 * Rolle im Gesamtbild: Weg.tsx legt diese Knöpfe in Prozent über Linie und Landschaft. Drei
 * Zustände sind deutlich verschieden: fertig (goldene Scheibe mit Nummer und kleinem Haken),
 * aktuell (größer, mit goldenem Ring für den Stand, Schein und der Marke „Du bist hier“), offen
 * (dunkle Scheibe mit grauem Rand; angefangen mit teilweise goldenem Ring). Unter dem Titel steht
 * ein kurzer Stand („fertig“, „12 von 40“). Der Orden am Ende jeder Etappe ist die echte
 * Ordenkunst, offen als Silhouette, daneben „Orden „Teil …““ und „verdient“ bzw. „noch 2 Kapitel“.
 * Titel und Stände liegen auf einem leicht deckenden Grund, damit sie auf jeder Landschaft lesbar
 * bleiben; Vorlesehilfen hören den Namen des Knopfes.
 * Abhängigkeiten: lernpfad.ts, Ordenkunst, Navigation, i18n, lucide-react.
 */
import { Check } from "lucide-react";
import type { CSSProperties } from "react";
import { useNavigation } from "../../../app/navigationsKontext";
import { t, tZahl } from "../../../i18n/sprache";
import { Ordenkunst } from "../ordenkunst/Ordenkunst";
import { ordenname, type Station } from "./lernpfad";
import type { Knoten } from "./wegform";

type Lage = { left: string; top: string };
const PROZENT = 100;
const HAKEN = 12;

/** Die runde Marke mit Nummer; der Ring zeigt den Stand (nur bei angefangenen Stationen). */
function Stationsmarke({ station }: { station: Station }) {
  const { erreicht, gesamt } = station.anteil;
  const anteil = gesamt > 0 ? Math.round((erreicht / gesamt) * PROZENT) : 0;
  const stil = { "--anteil": `${anteil}%` } as CSSProperties;
  const art = station.fertig ? "fertig" : erreicht > 0 ? "angefangen" : "offen";
  return (
    <span className={`station-marke ${art}`} style={stil} aria-hidden="true">
      {station.kapitel}
      {station.fertig && (
        <span className="station-haken">
          <Check size={HAKEN} strokeWidth={3.5} />
        </span>
      )}
    </span>
  );
}

/** Kurzer Stand unter dem Titel; nichts bei offenen Stationen. */
function stationsstand(station: Station): string | null {
  if (station.fertig) return t("buchlook.station.fertig");
  if (station.anteil.erreicht === 0) return null;
  return t("buchlook.station.stand", { ...station.anteil });
}

/** Ein Knopf für eine Station, mit Titel auf der Seite, die vom Weg wegzeigt. */
export function Stationsknopf(props: {
  station: Station;
  titel: string;
  aktuell: boolean;
  lage: Lage;
  rechts: boolean;
}) {
  const { station, titel, aktuell, lage, rechts } = props;
  const { navigiere } = useNavigation();
  const beschriftung = station.fertig
    ? t("lernpfad.stationFertig", { nummer: station.kapitel, titel })
    : t("lernpfad.station", { nummer: station.kapitel, titel, ...station.anteil });
  const stand = stationsstand(station);
  return (
    <button
      type="button"
      className={`lernpfad-station${rechts ? " titel-rechts" : " titel-links"}${aktuell ? " aktuell" : ""}`}
      style={lage}
      aria-label={beschriftung}
      aria-current={aktuell ? "step" : undefined}
      data-testid={`lernpfad-station-${station.kapitel}`}
      data-fertig={station.fertig ? "ja" : "nein"}
      onClick={() => navigiere({ bildschirm: "kapitel", nummer: station.kapitel })}
    >
      <Stationsmarke station={station} />
      <span className="lernpfad-titel" aria-hidden="true">
        {aktuell && <span className="lernpfad-hier">{t("buchlook.hier")}</span>}
        <span className="lernpfad-name">{titel}</span>
        {stand && <span className="lernpfad-stand">{stand}</span>}
      </span>
    </button>
  );
}

/** Der Orden am Ende einer Etappe mit Namen und Stand daneben. */
export function Ordenknoten({
  knoten: k,
  lage,
  rechts,
  offen,
}: {
  knoten: Knoten & { art: "orden" };
  lage: Lage;
  rechts: boolean;
  /** Unfertige Kapitel der Etappe. */
  offen: number;
}) {
  const name = ordenname(k.teil);
  const stand = k.verdient
    ? t("buchlook.orden.verdient")
    : tZahl("buchlook.orden.noch", offen, { n: offen });
  return (
    <span
      className={`lernpfad-orden${k.verdient ? " verdient" : ""}${rechts ? " titel-rechts" : " titel-links"}`}
      style={lage}
      data-testid={`lernpfad-orden-${k.teil}`}
    >
      <Ordenkunst
        art="orden"
        kennung={`teil-${k.teil}`}
        silhouette={!k.verdient}
        beschriftung={t(k.verdient ? "lernpfad.ordenVerdient" : "lernpfad.ordenOffen", {
          orden: name,
        })}
      />
      <span className="lernpfad-titel" aria-hidden="true">
        <span className="lernpfad-name">{t("buchlook.orden.name", { orden: name })}</span>
        <span className="lernpfad-stand">{stand}</span>
      </span>
    </span>
  );
}
