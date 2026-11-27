/**
 * Eine Figur aus ihrem Bogen im Paket, außerhalb von Phaser gezeichnet: als Standbild (Ladeliste
 * des Hauptmenüs) oder gehend (Startbild). Für Hauptmenü und Startbild (27.11.2026).
 *
 * Rolle im Gesamtbild: Dieselben Bögen wie in der Welt (oberwelt/figurbogen.ts: zuerst PixelLab
 * unter figuren32/, sonst LimeZu unter figuren/), dieselbe Ordnung der Rahmen wie
 * oberwelt/figurbilder.ts: Reihen zu 24 Rahmen, Standbilder 0 bis 3 (rechts, oben, links, unten),
 * Gehen ab Rahmen 24 mit sechs Bildern je Richtung. Das öffentliche Repository enthält keine
 * Paketbilder; den Bogen lädt useFigurbogen.ts, ohne ihn zeichnet der Aufrufer nichts.
 * Abhängigkeiten: useFigurbogen.ts (Typ), hauptmenue.css (Schrittfolge).
 */
import type { CSSProperties } from "react";
import type { Figurbogen } from "./useFigurbogen";
import "../hauptmenue.css";

/** Erster Rahmen des Gehens nach rechts und Zahl der Gehbilder (oberwelt/figurbilder.ts). */
const GEHEN_RECHTS = 24;
const GEHBILDER = 6;
/** Standbild mit Blick nach unten (Reihenfolge rechts, oben, links, unten). */
const STEHT_UNTEN = 3;

/** Lage eines Rahmens im Bogen in Bildpunkten des Bogens. */
function lage(bogen: Figurbogen, rahmen: number): { x: number; y: number } {
  return {
    x: (rahmen % bogen.spalten) * bogen.rahmenbreite,
    y: Math.floor(rahmen / bogen.spalten) * bogen.rahmenhoehe,
  };
}

/**
 * Die Figur in `massstab`-facher Größe. `gehend`: die sechs Gehbilder nach rechts als
 * Schrittfolge (CSS-Animation „figurrahmen-gehen“ in hauptmenue.css), sonst das Standbild `rahmen`.
 */
export function Figurrahmen({
  bogen,
  massstab,
  gehend = false,
  rahmen = STEHT_UNTEN,
  klasse = "",
}: {
  readonly bogen: Figurbogen;
  readonly massstab: number;
  readonly gehend?: boolean;
  readonly rahmen?: number;
  readonly klasse?: string;
}) {
  const start = lage(bogen, gehend ? GEHEN_RECHTS : rahmen);
  const stil: CSSProperties & Record<`--${string}`, string> = {
    width: `${bogen.rahmenbreite * massstab}px`,
    height: `${bogen.rahmenhoehe * massstab}px`,
    backgroundImage: `url("${bogen.adresse}")`,
    backgroundSize: `${bogen.breite * massstab}px ${bogen.hoehe * massstab}px`,
    backgroundPosition: `${-start.x * massstab}px ${-start.y * massstab}px`,
    "--figur-y": `${-start.y * massstab}px`,
    "--figur-x0": `${-start.x * massstab}px`,
    "--figur-x1": `${-(start.x + GEHBILDER * bogen.rahmenbreite) * massstab}px`,
  };
  return (
    <span
      className={`figurrahmen ${gehend ? "figurrahmen-gehend" : ""} ${klasse}`}
      style={stil}
      aria-hidden="true"
    />
  );
}
