/**
 * Die Zeichnung des Lernpfads: geschwungene Linie, Stationen als Knöpfe, Orden am Ende jeder
 * Etappe und die eigene Figur an der aktuellen Station.
 *
 * Rolle im Gesamtbild: Teil des Bildschirms „Dein Weg durchs Buch“ (Lernpfad.tsx, Gamifizierung
 * P2). Die Linie ist ein SVG im Koordinatensystem aus wegform.ts; bis zur aktuellen Station ist sie
 * gold, danach gestrichelt. Die Stationen sind echte Knöpfe (Bildschirmleser, Tastatur) und
 * liegen in Prozent über der Zeichnung; ein Tipp öffnet das Kapitel (Stationen.tsx). Seit der
 * Gestaltung B1 (31.10.2026) liegt darunter je Teil des Buches eine Landschaft (Landschaft.tsx).
 * Abhängigkeiten: wegform.ts, lernpfad.ts, Stationen.tsx, Landschaft.tsx, Wegfigur.
 */
import type { Etappe } from "./lernpfad";
import { Landschaftsbild, Teilnamen } from "./Landschaft";
import { Ordenknoten, Stationsknopf } from "./Stationen";
import { baender, BREITE, hoehe, inProzent, knoten, linie } from "./wegform";
import { Wegfigur } from "./Wegfigur";

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
  const flaeche = hoehe(alle.length, etappen.length);
  const streifen = baender(alle, flaeche);
  const offen = (teil: string) =>
    etappen.find((e) => e.teil === teil)?.stationen.filter((s) => !s.fertig).length ?? 0;
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
      <Landschaftsbild baender={streifen} hoehe={flaeche} />
      <Teilnamen baender={streifen} hoehe={flaeche} />
      <svg viewBox={`0 0 ${BREITE} ${flaeche}`} aria-hidden="true" className="lernpfad-linie">
        <path d={linie(alle)} className="lernpfad-linie-offen" />
        <path d={linie(alle.slice(0, index + 1))} className="lernpfad-linie-schein" />
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
          <Ordenknoten
            key={`o${k.teil}`}
            knoten={k}
            lage={inProzent(k.x, k.y, flaeche)}
            rechts={k.x <= BREITE / 2}
            offen={offen(k.teil)}
          />
        ),
      )}
      <Wegfigur ziel={lageVon(aktuell)} start={lageVon(vorher)} kapitel={aktuell} />
    </div>
  );
}
