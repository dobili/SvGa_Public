/**
 * Die Karte einer Variante als frei verschiebbare und zoombare Zeichnung: ein Knoten je Zug,
 * Äste als Linien, Hauptvariante hervorgehoben.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (1.11.2026): der ganze Baum als „in alle Richtungen
 * scrollbare Karte/Mindmap“ auf einer eigenen Seite (ui/bildschirme/Variantenkarte.tsx). Die Lage
 * der Knoten kommt aus schach/baumlayout.ts, Verschieben und Zoomen aus useKartenbewegung.ts.
 * Gezeichnet wird mit SVG und den Farbmerkmalen aus basis.css (hell und dunkel): Hauptvariante
 * mit goldener Linie und kräftigem Rahmen, eigene Züge in Gold, Züge der Engine gestrichelt und
 * kursiv, Kommentar als goldener Punkt, die gezeigte Stellung gefüllt. Die Zeichnung ist für
 * Bildschirmleser verborgen; sie bekommen die Liste (Kartenliste.tsx).
 * Abhängigkeiten: schach/baumlayout.ts, kartenmasse.ts, useKartenbewegung.ts, React.
 */
import { memo, useImperativeHandle, useRef, type Ref, type RefObject } from "react";
import type { Kartenknoten, Kartenlayout } from "../../../schach/baumlayout";
import { KARTE, kartengroesse, knotenmitte, PUNKT, SCHRIFTVERSATZ } from "./kartenmasse";
import { begrenzt, useKartenbewegung, type Ansichtslage } from "./useKartenbewegung";

/** Pfad einer Linie: gerade in derselben Zeile, sonst senkrecht zwischen den Spalten hinunter. */
function linienpfad(von: Kartenknoten, nach: Kartenknoten): string {
  const a = knotenmitte(von);
  const b = knotenmitte(nach);
  const start = a.x + KARTE.breite / 2;
  const ende = b.x - KARTE.breite / 2;
  if (a.y === b.y) return `M${start} ${a.y}H${ende}`;
  const knick = (start + ende) / 2;
  return `M${start} ${a.y}H${knick}V${b.y}H${ende}`;
}

/** Die Klassen eines Knotens für die Farben in variantenkarte.css. */
function knotenklassen(k: Kartenknoten, aktuell: boolean): string {
  const teile = ["kk-knoten"];
  if (k.haupt) teile.push("haupt");
  if (k.herkunft === undefined) teile.push("eigen");
  if (k.herkunft === "engine") teile.push("engine");
  if (aktuell) teile.push("aktuell");
  return teile.join(" ");
}

/** Ein Knoten: Rechteck mit Zug, wahlweise Kommentarpunkt und Zahl der Abzweige. */
function Knoten({ k, stelle, aktuell }: { k: Kartenknoten; stelle: number; aktuell: boolean }) {
  const m = knotenmitte(k);
  const links = m.x - KARTE.breite / 2;
  const oben = m.y - KARTE.hoehe / 2;
  return (
    <g className={knotenklassen(k, aktuell)} data-knoten={stelle} data-testid="kartenknoten">
      <rect x={links} y={oben} width={KARTE.breite} height={KARTE.hoehe} rx={KARTE.ecke} />
      <text x={m.x} y={m.y + SCHRIFTVERSATZ} textAnchor="middle">
        {k.text}
      </text>
      {k.kommentiert && (
        <circle
          className="kk-punkt"
          cx={links + KARTE.breite - PUNKT.abstand}
          cy={oben + PUNKT.abstand}
          r={PUNKT.radius}
        />
      )}
    </g>
  );
}

/** Alle Linien und Knoten; ändert sich nur mit Layout oder gezeigter Stellung (nicht beim Schieben). */
const Zeichnung = memo(function Zeichnung({
  layout,
  aktuell,
}: {
  layout: Kartenlayout;
  aktuell: number;
}) {
  return (
    <>
      {layout.kanten.map((kante) => {
        const von = layout.knoten[kante.von];
        const nach = layout.knoten[kante.nach];
        if (!von || !nach) return null;
        return (
          <path
            key={kante.nach}
            className={kante.haupt ? "kk-kante haupt" : "kk-kante"}
            d={linienpfad(von, nach)}
          />
        );
      })}
      {layout.knoten.map((k, i) => (
        <Knoten key={k.pfad.join(" ")} k={k} stelle={i} aktuell={i === aktuell} />
      ))}
    </>
  );
});

/** Was der Bildschirm von außen an der Fläche bedienen kann (Knöpfe über der Karte). */
export interface Kartensteuerung {
  readonly zoome: (faktor: number) => void;
  readonly einpassen: () => void;
  readonly zentriere: (stelle: number) => void;
}

/** Lage, in der die ganze Karte in die Fläche passt (höchstens Zoom 1). */
function eingepasst(
  layout: Kartenlayout,
  flaeche: { width: number; height: number },
): Ansichtslage {
  const groesse = kartengroesse(layout);
  const s = begrenzt(Math.min(1, flaeche.width / groesse.breite, flaeche.height / groesse.hoehe));
  // Passt die Karte auch beim kleinsten Zoom nicht, beginnt sie links oben (bei der Startstellung).
  return {
    s,
    x: Math.max(0, (flaeche.width - groesse.breite * s) / 2),
    y: Math.max(0, (flaeche.height - groesse.hoehe * s) / 2),
  };
}

/** Die Knöpfe über der Karte bedienen die Fläche: zoomen, einpassen, Knoten in die Mitte. */
function useSteuerung(
  steuerung: Ref<Kartensteuerung>,
  layout: Kartenlayout,
  flaeche: RefObject<HTMLDivElement | null>,
  bewegung: ReturnType<typeof useKartenbewegung>,
) {
  const { setzeLage, zoome, mitte } = bewegung;
  useImperativeHandle(steuerung, () => ({
    zoome,
    einpassen: () => {
      const rahmen = flaeche.current?.getBoundingClientRect();
      if (rahmen) setzeLage(eingepasst(layout, rahmen));
    },
    zentriere: (stelle: number) => {
      const k = layout.knoten[stelle];
      if (!k) return;
      const m = knotenmitte(k);
      const ziel = mitte();
      // Der Knoten kommt in die Mitte, aber links und oben bleibt kein leerer Streifen.
      setzeLage((l) => ({
        ...l,
        x: Math.min(ziel.x, m.x * l.s) - m.x * l.s,
        y: Math.min(ziel.y, m.y * l.s) - m.y * l.s,
      }));
    },
  }));
}

/**
 * Die Fläche mit der Karte.
 * Eingaben: Layout, Stelle der gezeigten Stellung, Anfangslage, was ein Tipp auf einen Knoten tut,
 * Steuerung für die Knöpfe (ref), Beschriftung für Bildschirmleser und Tastatur.
 */
export function Kartenflaeche({
  layout,
  aktuell,
  anfang,
  beiWahl,
  steuerung,
  beschriftung,
}: {
  layout: Kartenlayout;
  aktuell: number;
  anfang: Ansichtslage;
  beiWahl: (stelle: number) => void;
  steuerung: Ref<Kartensteuerung>;
  beschriftung: string;
}) {
  const flaeche = useRef<HTMLDivElement>(null);
  const bewegung = useKartenbewegung(flaeche, anfang, beiWahl);
  const { lage, ereignisse, taste } = bewegung;
  useSteuerung(steuerung, layout, flaeche, bewegung);
  return (
    <div
      ref={flaeche}
      className="kartenflaeche"
      data-testid="kartenflaeche"
      data-tour="karte-flaeche"
      tabIndex={0}
      role="group"
      aria-label={beschriftung}
      onKeyDown={taste}
      {...ereignisse}
    >
      <svg aria-hidden="true">
        <g transform={`translate(${lage.x} ${lage.y}) scale(${lage.s})`} data-testid="kartenlage">
          <Zeichnung layout={layout} aktuell={aktuell} />
        </g>
      </svg>
    </div>
  );
}
