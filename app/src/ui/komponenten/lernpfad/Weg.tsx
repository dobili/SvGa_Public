/**
 * Die Zeichnung des Lernpfads: geschwungene Linie, Stationen als Knöpfe, Orden am Ende jeder
 * Etappe und die eigene Figur an der aktuellen Station.
 *
 * Rolle im Gesamtbild: Teil des Bildschirms „Dein Weg durchs Buch“ (Lernpfad.tsx, Gamifizierung
 * P2). Die Linie ist ein SVG im Koordinatensystem aus wegform.ts; bis zur aktuellen Station ist sie
 * gold, danach gestrichelt. Die Stationen sind echte Knöpfe (Bildschirmleser, Tastatur) und
 * liegen in Prozent über der Zeichnung; ein Tipp öffnet das Kapitel. Die Station zeigt die
 * Kapitelnummer mit Ring (Kapitelnummer.tsx, gold mit Haken, wenn fertig), daneben den Titel.
 * Der Orden steht als Silhouette, bis er verdient ist (Ordenkunst.tsx).
 * Abhängigkeiten: wegform.ts, lernpfad.ts, Kapitelnummer, Ordenkunst, Wegfigur, Navigation, i18n.
 */
import { useNavigation } from "../../../app/navigationsKontext";
import { t } from "../../../i18n/sprache";
import { Kapitelnummer } from "../kapitel/Kapitelnummer";
import { Ordenkunst } from "../ordenkunst/Ordenkunst";
import { ordenname, type Etappe, type Station } from "./lernpfad";
import { BREITE, hoehe, inProzent, knoten, linie, type Knoten } from "./wegform";
import { Wegfigur } from "./Wegfigur";

/** Ein Knopf für eine Station, mit Titel auf der Seite, die vom Weg wegzeigt. */
function Stationsknopf({
  station,
  titel,
  aktuell,
  lage,
  rechts,
}: {
  station: Station;
  titel: string;
  aktuell: boolean;
  lage: { left: string; top: string };
  rechts: boolean;
}) {
  const { navigiere } = useNavigation();
  const beschriftung = station.fertig
    ? t("lernpfad.stationFertig", { nummer: station.kapitel, titel })
    : t("lernpfad.station", { nummer: station.kapitel, titel, ...station.anteil });
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
      <Kapitelnummer nummer={station.kapitel} anteil={station.anteil} />
      <span className="lernpfad-titel" aria-hidden="true">
        {titel}
      </span>
    </button>
  );
}

/** Der Orden am Ende einer Etappe. */
function Ordenknoten({
  knoten: k,
  lage,
}: {
  knoten: Knoten & { art: "orden" };
  lage: { left: string; top: string };
}) {
  const name = ordenname(k.teil);
  return (
    <span
      className={`lernpfad-orden${k.verdient ? " verdient" : ""}`}
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
    </span>
  );
}

/**
 * Der ganze Weg.
 *
 * Eingaben: Etappen, Titel je Kapitel, Kapitelnummer der aktuellen Station und der beim letzten
 * Öffnen gemerkten (für die kleine Bewegung der Figur).
 */
export function Weg({
  etappen,
  titel,
  aktuell,
  vorher,
}: {
  etappen: readonly Etappe[];
  titel: (kapitel: number) => string;
  aktuell: number;
  vorher: number | null;
}) {
  const alle = knoten(etappen);
  const flaeche = hoehe(alle.length);
  const index = alle.findIndex((k) => k.art === "station" && k.station.kapitel === aktuell);
  const lageVon = (kapitel: number | null) => {
    const k = alle.find((x) => x.art === "station" && x.station.kapitel === kapitel);
    return k ? inProzent(k.x, k.y, flaeche) : null;
  };
  return (
    <div
      className="lernpfad-flaeche"
      style={{ aspectRatio: `${BREITE} / ${flaeche}` }}
      data-testid="lernpfad-weg"
    >
      <svg viewBox={`0 0 ${BREITE} ${flaeche}`} aria-hidden="true" className="lernpfad-linie">
        <path d={linie(alle)} className="lernpfad-linie-offen" />
        <path d={linie(alle.slice(0, index + 1))} className="lernpfad-linie-gegangen" />
      </svg>
      {alle.map((k) =>
        k.art === "station" ? (
          <Stationsknopf
            key={`s${k.station.kapitel}`}
            station={k.station}
            titel={titel(k.station.kapitel)}
            aktuell={k.station.kapitel === aktuell}
            lage={inProzent(k.x, k.y, flaeche)}
            rechts={k.x <= BREITE / 2}
          />
        ) : (
          <Ordenknoten key={`o${k.teil}`} knoten={k} lage={inProzent(k.x, k.y, flaeche)} />
        ),
      )}
      <Wegfigur ziel={lageVon(aktuell)} start={lageVon(vorher)} kapitel={aktuell} />
    </div>
  );
}
