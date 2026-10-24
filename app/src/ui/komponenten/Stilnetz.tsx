/**
 * Stil eines eigenen Gegners als Spinnennetz über die drei Stilachsen (Teil E, 0.2.126).
 *
 * Rolle im Gesamtbild: Ersetzt im Formular eigener Gegner (GegnerEditor.tsx) den Regler „sehr
 * defensiv bis sehr aggressiv“ durch die sieben Stile der vorgefertigten Bots (engine/stile.ts;
 * Entscheidung des Autors, 23.10.2026: „Stil als Spinnennetz über die drei Achsen, sechs Speichen,
 * mit Anzeige des nächsten Stils, dazu Auswahlliste“). Die drei Achsen kommen aus 3 889
 * Lichess-Spielern: Königsangriff (Angreifer gegen Positionsspieler), Aktivität (Taktiker gegen
 * Verteidiger), Bauernsturm gegen Vereinfachen (Draufgänger gegen Vereinfacher); gegenüberliegende
 * Speichen sind die beiden Enden einer Achse, die Mitte ist „Universell“. Ein Tipp auf eine
 * Speiche oder die Mitte wählt den Stil, die Auswahlliste darunter tut dasselbe.
 * Abhängigkeiten: engine/stile.ts, i18n.
 */
import { STILNAMEN, type Stilname } from "../../engine/stile";
import { t } from "../../i18n/sprache";

/** Größe der Zeichenfläche und Radien (Bildpunkte im viewBox). */
const BREITE = 320;
const HOEHE = 280;
const MITTE_X = BREITE / 2;
const MITTE_Y = HOEHE / 2;
const RADIUS = 96;
const RINGE = [1 / 3, 2 / 3, 1];
const INNEN = 0.22;
const BESCHRIFTUNG = 1.28;
const PUNKT = 9;
/** Trefferfläche um einen Punkt und Abstand der Beschriftung unter der Mitte, in Punktgrößen. */
const TREFFER = 2.2;
const UNTER_DER_MITTE = 2.6;
const GRAD = Math.PI / 180;

/** Die sechs Speichen im Uhrzeigersinn ab oben; gegenüber liegt das andere Ende derselben Achse. */
const SPEICHEN: readonly {
  readonly stil: Exclude<Stilname, "universell">;
  readonly winkel: number;
}[] = [
  { stil: "angreifer", winkel: 90 },
  { stil: "taktiker", winkel: 30 },
  { stil: "draufgaenger", winkel: -30 },
  { stil: "positionsspieler", winkel: -90 },
  { stil: "verteidiger", winkel: -150 },
  { stil: "vereinfacher", winkel: 150 },
];

/** Punkt auf einer Speiche: Anteil r des Radius (y nach oben positiv wie in der Mathematik). */
function punkt(winkel: number, r: number): { x: number; y: number } {
  return {
    x: MITTE_X + Math.cos(winkel * GRAD) * RADIUS * r,
    y: MITTE_Y - Math.sin(winkel * GRAD) * RADIUS * r,
  };
}

/** Die Fläche des gewählten Stils: außen an seiner Speiche, sonst innen. */
function flaeche(stil: Stilname): string {
  return SPEICHEN.map((s) => punkt(s.winkel, s.stil === stil ? 1 : INNEN))
    .map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");
}

/** Sechseck eines Rings. */
function ring(r: number): string {
  return SPEICHEN.map((s) => punkt(s.winkel, r))
    .map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");
}

/** Das Netz mit Speichen, wählbaren Enden und der Mitte. */
function Netz({ stil, beiWahl }: { stil: Stilname; beiWahl: (s: Stilname) => void }) {
  return (
    <svg
      className="stilnetz-bild"
      viewBox={`0 0 ${BREITE} ${HOEHE}`}
      role="radiogroup"
      aria-label={t("spielen.stil")}
    >
      {RINGE.map((r) => (
        <polygon key={r} points={ring(r)} className="stilnetz-ring" />
      ))}
      {SPEICHEN.map((s) => {
        const aussen = punkt(s.winkel, 1);
        return (
          <line
            key={s.stil}
            x1={MITTE_X}
            y1={MITTE_Y}
            x2={aussen.x}
            y2={aussen.y}
            className="stilnetz-speiche"
          />
        );
      })}
      <polygon points={flaeche(stil)} className="stilnetz-flaeche" />
      {SPEICHEN.map((s) => (
        <Wahlpunkt
          key={s.stil}
          stil={s.stil}
          winkel={s.winkel}
          gewaehlt={stil === s.stil}
          beiWahl={beiWahl}
        />
      ))}
      <Wahlpunkt
        stil="universell"
        winkel={0}
        gewaehlt={stil === "universell"}
        beiWahl={beiWahl}
        mitte
      />
    </svg>
  );
}

/** Ein wählbares Ende einer Speiche (oder die Mitte) mit Beschriftung. */
function Wahlpunkt({
  stil,
  winkel,
  gewaehlt,
  beiWahl,
  mitte = false,
}: {
  stil: Stilname;
  winkel: number;
  gewaehlt: boolean;
  beiWahl: (s: Stilname) => void;
  mitte?: boolean;
}) {
  const p = mitte ? { x: MITTE_X, y: MITTE_Y } : punkt(winkel, 1);
  const b = mitte
    ? { x: MITTE_X, y: MITTE_Y + PUNKT * UNTER_DER_MITTE }
    : punkt(winkel, BESCHRIFTUNG);
  return (
    <g
      role="radio"
      aria-checked={gewaehlt}
      aria-label={t(`stil.${stil}`)}
      tabIndex={0}
      className={gewaehlt ? "stilnetz-punkt gewaehlt" : "stilnetz-punkt"}
      onClick={() => beiWahl(stil)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          beiWahl(stil);
        }
      }}
    >
      <circle cx={p.x} cy={p.y} r={PUNKT * TREFFER} className="stilnetz-treffer" />
      <circle cx={p.x} cy={p.y} r={PUNKT} />
      <text x={b.x} y={b.y} textAnchor="middle" dominantBaseline="middle">
        {t(`stil.${stil}`)}
      </text>
    </g>
  );
}

/** Spinnennetz, Auswahlliste und die Beschreibung des gewählten Stils. */
export function Stilnetz({ stil, beiWahl }: { stil: Stilname; beiWahl: (s: Stilname) => void }) {
  return (
    <div className="stilnetz" data-testid="stilnetz">
      <span className="einstellung-name">{t("spielen.stil")}</span>
      <Netz stil={stil} beiWahl={beiWahl} />
      <label className="stilnetz-liste">
        <span className="nur-vorlesen">{t("spielen.stil")}</span>
        <select value={stil} onChange={(e) => beiWahl(e.target.value as Stilname)}>
          {STILNAMEN.map((s) => (
            <option key={s} value={s}>
              {t(`stil.${s}`)}
            </option>
          ))}
        </select>
      </label>
      <p className="hinweis">{t("spielen.stilnetz.hinweis")}</p>
      <p className="hinweis" data-testid="stilnetz-text">
        <strong>{t(`stil.${stil}`)}:</strong> {t(`stil.${stil}.text`)}
      </p>
    </div>
  );
}
