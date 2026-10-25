/**
 * Spinnennetz mit fünf Achsen für Fehler und blinde Flecken eigener Gegner (seit 0.2.135, Netz-
 * Vorschau E1 und E4, vom Autor am 25.10.2026 freigegeben).
 *
 * Rolle im Gesamtbild: Wunsch des Autors, Fehler und Flecken so einzustellen wie den Spielstil
 * (Stilnetz.tsx). Jede Achse trägt sechs Punkte: innen „aus“ (gestrichelt), dann „sehr selten“
 * bis „sehr oft“; der gestrichelte goldene Ring ist „normal“, also wie Menschen dieser Stärke,
 * wie der Strich in „Deine Züge“. Die goldene Fläche zeigt das Profil auf einen Blick, unter
 * jedem Achsennamen steht das Wort. Unmenschliche Stufen (über ±2, nur über die Feinregler)
 * liegen auf dem äußersten oder innersten Ring, das Wort nennt sie. Jede Achse ist eine Gruppe
 * von Optionsfeldern: Tab springt von Achse zu Achse, die Pfeiltasten wählen auf der Achse.
 * Abhängigkeiten: fehlerprofil.ts (Wörter der Stufen), i18n.
 */
import type { KeyboardEvent } from "react";
import { stufenwort } from "./fehlerprofil";

const BREITE = 420;
const HOEHE = 336;
const MITTE_X = BREITE / 2;
const MITTE_Y = 176;
const RADIUS = 102;
/** Die sechs Punkte je Achse und ihr Anteil am Radius; Index 0 ist „aus“. */
const NETZSTUFEN: readonly (number | null)[] = [null, -2, -1, 0, 1, 2];
const RADIEN = [0.13, 0.32, 0.49, 0.66, 0.83, 1];
const NORMAL = 0;
const NETZ_MIN = -2;
const NETZ_MAX = 2;
const BESCHRIFTUNG = 1.28;
const PUNKT = 6.5;
const PUNKT_AUS = 5;
const TREFFER = 13;
/** Abstand der Beschriftung zur Speiche, waagerecht und zur zweiten Zeile. */
const SEITLICH = 14;
const MITTIG = 8;
const ZEILE = 19;
const VOLLKREIS = 2 * Math.PI;
const OBEN = -Math.PI / 2;

export interface Netzachse {
  readonly kennung: string;
  readonly name: string;
}

/** Index des Punktes, auf dem ein Wert liegt; unmenschliche Stufen auf dem Rand. */
function punktIndex(wert: number | null): number {
  if (wert === null) return 0;
  const begrenzt = Math.max(NETZ_MIN, Math.min(NETZ_MAX, Math.round(wert)));
  return NETZSTUFEN.indexOf(begrenzt);
}

function ort(i: number, n: number, r: number): { x: number; y: number } {
  const winkel = OBEN + (VOLLKREIS * i) / n;
  return { x: MITTE_X + Math.cos(winkel) * RADIUS * r, y: MITTE_Y + Math.sin(winkel) * RADIUS * r };
}

function ring(n: number, r: number): string {
  return Array.from({ length: n }, (_, i) => ort(i, n, r))
    .map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");
}

/** Pfeiltasten: nach außen (hoch, rechts) oder innen (runter, links); sonst null. */
function schrittVon(taste: string): number | null {
  if (taste === "ArrowUp" || taste === "ArrowRight") return 1;
  if (taste === "ArrowDown" || taste === "ArrowLeft") return -1;
  return null;
}

/** Beschriftung außen: Name und darunter das Wort der Stufe. */
function Beschriftung({
  i,
  n,
  achse,
  wert,
}: {
  i: number;
  n: number;
  achse: Netzachse;
  wert: number | null;
}) {
  const p = ort(i, n, BESCHRIFTUNG);
  const anker = Math.abs(p.x - MITTE_X) < MITTIG ? "middle" : p.x > MITTE_X ? "start" : "end";
  const x = p.x + (anker === "start" ? -SEITLICH : anker === "end" ? SEITLICH : 0);
  return (
    <g className="profilnetz-beschriftung" aria-hidden="true">
      <text x={x} y={p.y - 2} textAnchor={anker} className="profilnetz-name">
        {achse.name}
      </text>
      <text
        x={x}
        y={p.y + ZEILE - 2}
        textAnchor={anker}
        className={wert === null ? "profilnetz-wert ist-aus" : "profilnetz-wert"}
      >
        {stufenwort(wert)}
      </text>
    </g>
  );
}

/** Die sechs Punkte einer Achse als Optionsfelder. */
function Achse({
  i,
  n,
  achse,
  wert,
  gesperrt,
  beiWahl,
}: {
  i: number;
  n: number;
  achse: Netzachse;
  wert: number | null;
  gesperrt: boolean;
  beiWahl: (stufe: number | null, fokus: number) => void;
}) {
  const gewaehlt = punktIndex(wert);
  const taste = (e: KeyboardEvent, k: number) => {
    const schritt = schrittVon(e.key);
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      beiWahl(NETZSTUFEN[k] ?? null, k);
    } else if (schritt !== null) {
      e.preventDefault();
      const ziel = Math.max(0, Math.min(NETZSTUFEN.length - 1, k + schritt));
      beiWahl(NETZSTUFEN[ziel] ?? null, ziel);
    }
  };
  return (
    <g role="radiogroup" aria-label={achse.name} aria-disabled={gesperrt || undefined}>
      {NETZSTUFEN.map((s, k) => {
        const p = ort(i, n, RADIEN[k] ?? 1);
        const klasse = `profilnetz-punkt${s === null ? " aus" : ""}${k === gewaehlt ? " gewaehlt" : ""}`;
        return (
          <g
            key={String(s)}
            role="radio"
            aria-checked={k === gewaehlt}
            aria-label={`${achse.name}: ${stufenwort(s)}`}
            tabIndex={!gesperrt && k === gewaehlt ? 0 : -1}
            data-punkt={`${i}-${k}`}
            className={klasse}
            onClick={() => !gesperrt && beiWahl(s, k)}
            onKeyDown={(e) => !gesperrt && taste(e, k)}
          >
            <circle cx={p.x} cy={p.y} r={TREFFER} className="profilnetz-treffer" />
            <circle cx={p.x} cy={p.y} r={s === null ? PUNKT_AUS : PUNKT} />
          </g>
        );
      })}
    </g>
  );
}

/**
 * Das Netz. `werte[i]` ist die Stufe der Achse i (null: aus); `beiWahl` meldet Achse und Stufe.
 * `gesperrt` (Feinregler offen): grau, ohne Bedienung, zeigt nur den Mittelwert.
 * Beispiel: Vorlage „Leichtsinnig“ → Figuren „sehr oft“, Taktik „oft“, Rest auf dem Ring.
 */
export function Profilnetz({
  name,
  achsen,
  werte,
  beiWahl,
  gesperrt = false,
  testid,
}: {
  name: string;
  achsen: readonly Netzachse[];
  werte: readonly (number | null)[];
  beiWahl: (achse: number, stufe: number | null) => void;
  gesperrt?: boolean;
  testid: string;
}) {
  const n = achsen.length;
  const flaeche = achsen
    .map((_, i) => ort(i, n, RADIEN[punktIndex(werte[i] ?? null)] ?? 1))
    .map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");
  const waehle = (i: number) => (stufe: number | null, fokus: number) => {
    beiWahl(i, stufe);
    requestAnimationFrame(() =>
      document
        .querySelector<SVGGElement>(`[data-testid="${testid}"] [data-punkt="${i}-${fokus}"]`)
        ?.focus(),
    );
  };
  return (
    <svg
      className={gesperrt ? "profilnetz gesperrt" : "profilnetz"}
      viewBox={`0 0 ${BREITE} ${HOEHE}`}
      role="group"
      aria-label={name}
      data-testid={testid}
    >
      {RADIEN.slice(1).map((r, k) => (
        <polygon
          key={r}
          points={ring(n, r)}
          className={NETZSTUFEN[k + 1] === NORMAL ? "profilnetz-ring normal" : "profilnetz-ring"}
        />
      ))}
      {achsen.map((a, i) => {
        const p = ort(i, n, 1);
        return (
          <line
            key={a.kennung}
            x1={MITTE_X}
            y1={MITTE_Y}
            x2={p.x}
            y2={p.y}
            className="profilnetz-speiche"
          />
        );
      })}
      <polygon points={flaeche} className="profilnetz-flaeche" />
      {achsen.map((a, i) => (
        <Achse
          key={a.kennung}
          i={i}
          n={n}
          achse={a}
          wert={werte[i] ?? null}
          gesperrt={gesperrt}
          beiWahl={waehle(i)}
        />
      ))}
      {achsen.map((a, i) => (
        <Beschriftung key={a.kennung} i={i} n={n} achse={a} wert={werte[i] ?? null} />
      ))}
    </svg>
  );
}
