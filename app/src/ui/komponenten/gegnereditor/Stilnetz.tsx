/**
 * Stil eines eigenen Gegners als Spinnennetz über die drei Stilachsen (Teil E).
 *
 * Rolle im Gesamtbild: Im Formular eigener Gegner (GegnerEditor.tsx) stehen die sieben Stile der
 * vorgefertigten Bots (engine/stile.ts; Entscheidung des Autors, 23.10.2026: „Stil als
 * Spinnennetz über die drei Achsen, sechs Speichen, mit Anzeige des nächsten Stils, dazu
 * Auswahlliste“). Die drei Achsen kommen aus 3 889 Lichess-Spielern: Königsangriff (Angreifer
 * gegen Positionsspieler), Aktivität (Taktiker gegen Verteidiger), Bauernsturm gegen Vereinfachen
 * (Draufgänger gegen Vereinfacher); gegenüberliegende Speichen sind die beiden Enden einer Achse,
 * die Mitte ist „Universell“. Ein Tipp auf eine Speiche wählt den Stil, die Mitte setzt auf
 * „Universell“ zurück. Jede Speiche trägt vier Punkte (Wunsch des Autors): 50, 75, 100 und 125 %
 * der geeichten Verschiebung (engine/stile.ts; 125 % geht über das hinaus, was echte Spieler
 * zeigen). Mehrere Stile lassen sich kombinieren, nur die beiden Enden einer Achse nicht, denn sie
 * höben sich auf: Ein Tipp auf das Gegenüber ersetzt den Stil dieser Achse, ein zweiter Tipp auf
 * denselben Punkt nimmt ihn weg. Neben dem Netz steht je Achse eine Auswahlliste.
 * Abhängigkeiten: engine/stile.ts, i18n.
 */
import {
  mitStil,
  ohneStile,
  STILACHSEN,
  STILPROZENTE,
  STILPROZENT_GEEICHT,
  type Richtungsstil,
  type Stilmix,
} from "../../../engine/stile";
import { t, type Textschluessel } from "../../../i18n/sprache";
import { stilProzent } from "./stiltext";
import { MitInfo } from "../bausteine/InfoKnopf";

/** Größe der Zeichenfläche und Radien (Bildpunkte im viewBox); das Netz bleibt so groß wie vorher. */
const BREITE = 320;
const HOEHE = 280;
const MITTE_X = BREITE / 2;
const MITTE_Y = HOEHE / 2;
const RADIUS = 96;
const INNEN = 0.18;
const BESCHRIFTUNG = 1.28;
/** Der äußerste Ring ist 125 %. */
const AUSSEN_PROZENT: number = STILPROZENTE[STILPROZENTE.length - 1] ?? STILPROZENT_GEEICHT;
/** Punkt außen und innen, Trefferfläche, Abstand der Beschriftung unter der Mitte. */
const PUNKT_AUSSEN = 8;
const PUNKT_INNEN = 5;
const TREFFER = 10;
const UNTER_DER_MITTE = 22;
/** Unsichtbare Tippfläche hinter einer Beschriftung (WebKit trifft Text allein schlecht). */
const SCHRIFT_BREITE = 108;
const SCHRIFT_HOEHE = 22;
const GRAD = Math.PI / 180;

/** Die sechs Speichen im Uhrzeigersinn ab oben; gegenüber liegt das andere Ende derselben Achse. */
const SPEICHEN: readonly { readonly stil: Richtungsstil; readonly winkel: number }[] = [
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

function alsPunkte(r: (stil: Richtungsstil) => number): string {
  return SPEICHEN.map((s) => punkt(s.winkel, r(s.stil)))
    .map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");
}

/** Das Netz mit Speichen, vier wählbaren Punkten je Speiche und der Mitte. */
function Netz({ mix, beiWahl }: Wahlprops) {
  const flaeche = alsPunkte((stil) => Math.max(INNEN, (mix[stil] ?? 0) / AUSSEN_PROZENT));
  return (
    <svg
      className="stilnetz-bild"
      viewBox={`0 0 ${BREITE} ${HOEHE}`}
      role="group"
      aria-label={t("spielen.stil")}
    >
      {STILPROZENTE.map((p) => (
        <polygon key={p} points={alsPunkte(() => p / AUSSEN_PROZENT)} className="stilnetz-ring" />
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
      <polygon points={flaeche} className="stilnetz-flaeche" />
      {SPEICHEN.flatMap((s) =>
        STILPROZENTE.map((p) => (
          <Wahlpunkt
            key={`${s.stil}-${p}`}
            name={stilProzent(s.stil, p)}
            ort={punkt(s.winkel, p / AUSSEN_PROZENT)}
            beschriftung={
              p === AUSSEN_PROZENT
                ? {
                    text: t(`stil.${s.stil}`),
                    aktiv: mix[s.stil] !== undefined,
                    ...punkt(s.winkel, BESCHRIFTUNG),
                  }
                : null
            }
            gewaehlt={mix[s.stil] === p}
            beiWahl={() => beiWahl(mitStil(mix, s.stil, p))}
          />
        )),
      )}
      <Wahlpunkt
        name={t("stil.universell")}
        ort={{ x: MITTE_X, y: MITTE_Y }}
        beschriftung={{
          text: t("stil.universell"),
          aktiv: Object.keys(mix).length === 0,
          x: MITTE_X,
          y: MITTE_Y + UNTER_DER_MITTE,
        }}
        gewaehlt={Object.keys(mix).length === 0}
        tippflaeche={false}
        beiWahl={() => beiWahl({})}
      />
    </svg>
  );
}

/** Ein wählbarer Punkt (Speiche und Ausprägung, oder die Mitte), außen mit Beschriftung. */
function Wahlpunkt({
  name,
  ort,
  beschriftung,
  gewaehlt,
  beiWahl,
  tippflaeche = true,
}: {
  name: string;
  ort: { x: number; y: number };
  /** Außen: Name des Stils, hervorgehoben, wenn er in der Mischung vorkommt. */
  beschriftung: { text: string; aktiv: boolean; x: number; y: number } | null;
  /** Tippfläche hinter der Beschriftung; nicht in der Mitte, dort lägen die inneren Punkte. */
  tippflaeche?: boolean;
  gewaehlt: boolean;
  beiWahl: () => void;
}) {
  return (
    <g
      role="checkbox"
      aria-checked={gewaehlt}
      aria-label={name}
      tabIndex={0}
      className={gewaehlt ? "stilnetz-punkt gewaehlt" : "stilnetz-punkt"}
      onClick={beiWahl}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          beiWahl();
        }
      }}
    >
      <circle cx={ort.x} cy={ort.y} r={TREFFER} className="stilnetz-treffer" />
      <circle cx={ort.x} cy={ort.y} r={beschriftung ? PUNKT_AUSSEN : PUNKT_INNEN} />
      {beschriftung && tippflaeche && (
        <rect
          x={beschriftung.x - SCHRIFT_BREITE / 2}
          y={beschriftung.y - SCHRIFT_HOEHE / 2}
          width={SCHRIFT_BREITE}
          height={SCHRIFT_HOEHE}
          className="stilnetz-treffer"
        />
      )}
      {beschriftung && (
        <text
          x={beschriftung.x}
          y={beschriftung.y}
          textAnchor="middle"
          dominantBaseline="middle"
          className={beschriftung.aktiv ? "aktiv" : undefined}
        >
          {beschriftung.text}
        </text>
      )}
    </g>
  );
}

interface Wahlprops {
  mix: Stilmix;
  beiWahl: (mix: Stilmix) => void;
}

/** Je Achse eine Auswahlliste: keiner, oder eines der beiden Enden mit Ausprägung. */
function Achsenliste({
  mix,
  beiWahl,
  achse,
}: Wahlprops & { achse: readonly [Richtungsstil, Richtungsstil] }) {
  const [a, b] = achse;
  const wert =
    mix[a] !== undefined ? `${a}:${mix[a]}` : mix[b] !== undefined ? `${b}:${mix[b]}` : "";
  const waehle = (neu: string) => {
    const ohne = ohneStile(mix, [a, b]);
    const [stil, prozent] = neu.split(":");
    beiWahl(stil ? { ...ohne, [stil]: Number(prozent) } : ohne);
  };
  return (
    <label className="stilnetz-liste">
      <span className="einstellung-name">{t(`spielen.stilachse.${a}` as Textschluessel)}</span>
      <select className="auswahlfeld" value={wert} onChange={(e) => waehle(e.target.value)}>
        <option value="">{t("spielen.stilachse.keine")}</option>
        {[a, b].flatMap((stil) =>
          STILPROZENTE.map((p) => (
            <option key={`${stil}:${p}`} value={`${stil}:${p}`}>
              {stilProzent(stil, p)}
            </option>
          )),
        )}
      </select>
    </label>
  );
}

/** Spinnennetz, je Achse eine Auswahlliste und die Beschreibung der gewählten Stile. */
export function Stilnetz({ mix, beiWahl }: Wahlprops) {
  const gewaehlt = Object.entries(mix) as [Richtungsstil, number][];
  return (
    <div className="stilnetz" data-testid="stilnetz">
      {/* Die lange Bedienhilfe steht seit 0.2.129 hinter dem Fragezeichen (DS39). */}
      <MitInfo
        zeile={<span className="einstellung-name">{t("spielen.stil")}</span>}
        erklaerung={t("spielen.stilnetz.hinweis")}
        thema={t("spielen.stil")}
      />
      <Netz mix={mix} beiWahl={beiWahl} />
      <div className="stilnetz-listen">
        {STILACHSEN.map((achse) => (
          <Achsenliste key={achse[0]} achse={achse} mix={mix} beiWahl={beiWahl} />
        ))}
      </div>
      <div className="hinweis" data-testid="stilnetz-text">
        {gewaehlt.length === 0 ? (
          <p>
            <strong>{t("stil.universell")}:</strong> {t("stil.universell.text")}
          </p>
        ) : (
          gewaehlt.map(([stil, prozent]) => (
            <p key={stil}>
              <strong>{stilProzent(stil, prozent)}:</strong> {t(`stil.${stil}.text`)}
            </p>
          ))
        )}
      </div>
    </div>
  );
}
