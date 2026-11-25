/**
 * Zeitraffer beim Warten und Schlafen (Wunsch des Autors, 25.11.2026): zwei bis drei Sekunden,
 * in denen Sonne oder Mond über den Horizontbogen ziehen, der Himmel sich färbt, nachts Sterne
 * aufgehen und die Uhrzeiger zur Zielzeit laufen. Ein Tippen überspringt.
 *
 * Ablauf: Nach gut der Hälfte stellt die Oberwelt die Karte neu auf (beiNeuaufbau, einmal); die
 * Blende wird zum Ende durchsichtig, so sieht man das neue Licht der Karte. Bei reduzierter
 * Bewegung steht gleich das Bild der Zielzeit da, kurz und ohne Lauf.
 * Rolle im Gesamtbild: gezeigt von oberwelt/useWarten.tsx; Rechnung in regeln/zeitraffer.ts,
 * Stil in abenteuer-atmosphaere.css. Abhängigkeiten: regeln/zeitraffer.ts, texte/texte.ts.
 */
import { useEffect, useRef, useState } from "react";
import { rafferbild } from "../regeln/zeitraffer";
import { tSpiel } from "../texte/texte";

/** Dauer des Zeitraffers (Wunsch: 2 bis 3 Sekunden). */
export const RAFFER_MS = 2600;
/** Dauer bei reduzierter Bewegung. */
const RAFFER_RUHIG_MS = 700;
/** Ab diesem Fortschritt steht die Karte im neuen Licht. */
const NEUAUFBAU_AB = 0.6;
/** Ab diesem Fortschritt wird die Blende durchsichtig. */
const AUSBLENDEN_AB = 0.85;
/** Maße der Zeichnung (SVG-Einheiten): Bogen über dem Horizont. */
const BREITE = 200;
const HORIZONT = 100;
const RADIUS = 80;
const MITTE = BREITE / 2;
/** Ein paar Sterne (feste Lagen, damit nichts springt). */
const STERNE = [
  [24, 22],
  [52, 40],
  [78, 14],
  [118, 30],
  [146, 12],
  [170, 44],
  [96, 52],
  [186, 24],
] as const;

/** Bewegung reduziert? (Systemeinstellung) */
function ruhig(): boolean {
  return typeof window.matchMedia === "function"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;
}

export function Zeitraffer({
  von,
  nach,
  schlafen,
  beiNeuaufbau,
  beiEnde,
}: {
  readonly von: number;
  readonly nach: number;
  readonly schlafen: boolean;
  readonly beiNeuaufbau: () => void;
  readonly beiEnde: () => void;
}) {
  const [fortschritt, setzeFortschritt] = useState(() => (ruhig() ? 1 : 0));
  const rueckruf = useRef({ beiNeuaufbau, beiEnde, neu: false, fertig: false });
  useEffect(() => {
    rueckruf.current.beiNeuaufbau = beiNeuaufbau;
    rueckruf.current.beiEnde = beiEnde;
  });
  const schritt = (p: number) => {
    const r = rueckruf.current;
    if (p >= NEUAUFBAU_AB && !r.neu) {
      r.neu = true;
      r.beiNeuaufbau();
    }
    if (p >= 1 && !r.fertig) {
      r.fertig = true;
      r.beiEnde();
    }
  };
  useEffect(() => {
    const dauer = ruhig() ? RAFFER_RUHIG_MS : RAFFER_MS;
    const beginn = performance.now();
    let rahmen = 0;
    const lauf = (jetzt: number) => {
      const p = Math.min(1, (jetzt - beginn) / dauer);
      if (!ruhig()) setzeFortschritt(p);
      schritt(p);
      if (p < 1) rahmen = requestAnimationFrame(lauf);
    };
    rahmen = requestAnimationFrame(lauf);
    return () => cancelAnimationFrame(rahmen);
  }, []);
  const ueberspringe = () => {
    setzeFortschritt(1);
    schritt(1);
  };
  const bild = rafferbild(von, nach, fortschritt);
  const winkel = Math.PI * (1 - bild.bahn);
  const x = MITTE + RADIUS * Math.cos(winkel);
  const y = HORIZONT - RADIUS * Math.sin(winkel);
  return (
    <button
      type="button"
      className={`abenteuer-warteblende${fortschritt >= AUSBLENDEN_AB ? " abenteuer-warteblende-ende" : ""}`}
      data-testid="abenteuer-warteblende"
      data-gestirn={bild.gestirn}
      aria-label={tSpiel("warten.ueberspringen")}
      onClick={ueberspringe}
    >
      <svg
        className="abenteuer-zeitraffer"
        viewBox={`0 0 ${BREITE} ${HORIZONT + 20}`}
        aria-hidden="true"
      >
        <rect width={BREITE} height={HORIZONT} fill={bild.himmel} />
        {STERNE.map(([sx, sy]) => (
          <circle
            key={`${sx}-${sy}`}
            cx={sx}
            cy={sy}
            r={1.4}
            className="abenteuer-zeitraffer-stern"
            opacity={bild.sterne}
          />
        ))}
        <path
          d={`M ${MITTE - RADIUS} ${HORIZONT} A ${RADIUS} ${RADIUS} 0 0 1 ${MITTE + RADIUS} ${HORIZONT}`}
          className="abenteuer-zeitraffer-bogen"
        />
        {bild.gestirn === "sonne" ? (
          <circle cx={x} cy={y} r={11} className="abenteuer-zeitraffer-sonne" />
        ) : (
          <g className="abenteuer-zeitraffer-mond">
            <circle cx={x} cy={y} r={9} />
            <circle cx={x + 4} cy={y - 3} r={8} fill={bild.himmel} />
          </g>
        )}
        <rect y={HORIZONT} width={BREITE} height={20} className="abenteuer-zeitraffer-boden" />
      </svg>
      <svg className="abenteuer-zeitraffer-uhr" viewBox="-20 -20 40 40" aria-hidden="true">
        <circle r={18} />
        <line y2={-9} transform={`rotate(${bild.zeigerStunde})`} />
        <line y2={-14} transform={`rotate(${bild.zeigerMinute})`} />
      </svg>
      <p aria-live="polite">
        {tSpiel(schlafen ? "warten.schlaeft" : "warten.laeuft")}{" "}
        <span className="abenteuer-zeitraffer-zeit">{bild.uhrzeit}</span>
      </p>
      <p className="abenteuer-zeitraffer-hinweis">{tSpiel("warten.ueberspringen")}</p>
    </button>
  );
}
