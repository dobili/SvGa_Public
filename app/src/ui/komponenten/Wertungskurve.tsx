/**
 * Verlauf der Wertung des Lesers (spiel/wertung.ts) als Kurve, oben in den Einstellungen
 * (Wunsch des Autors, 17.10.2026, Version 0.2.41).
 *
 * Rolle im Gesamtbild: Die Wertung ist eine Elo-Zahl aus allen gewerteten Partien. Die Karte zeigt
 * die aktuelle Zahl groß, darunter die Kurve mit einem Punkt je Partie (grün Sieg, rot Niederlage,
 * grau Remis) und einem Auswahlfeld für den Ausschnitt: die letzten 10, 25 oder 50 Partien oder
 * ein Zeitraum (1 Woche, 4 Wochen, 3 Monate, halbes Jahr, Jahr). Bei den Partien steht jede
 * gleich weit von der nächsten; beim Zeitraum liegt jede Partie an ihrer Zeit, der rechte Rand ist
 * jetzt. Für Bildschirmleser trägt jeder Punkt Datum, Ergebnis, Gegner und Wertung. „Wertung
 * zurücksetzen“ (nach Nachfrage) leert den Verlauf und macht alle bisherigen Partien dauerhaft
 * ungewertet (speicher/partien.ts, setzeWertungZurueck).
 * Abhängigkeiten: spiel/wertung.ts, speicher/, i18n.
 */
import { useState } from "react";
import { t, type Textschluessel } from "../../i18n/sprache";
import { setzeWertungZurueck } from "../../speicher/partien";
import { aendere } from "../../speicher/speicher";
import {
  aktuelleWertung,
  imBereich,
  type Punktwert,
  type Wertungsbereich,
  type Wertungspunkt,
} from "../../spiel/wertung";

/** Zeichenfläche in SVG-Einheiten; das Bild passt sich der Breite an. */
const BREITE = 300;
const HOEHE = 110;
/** Rand links für die Zahlen der Wertung, unten für die Daten. */
const RAND_LINKS = 34;
const RAND_RECHTS = 8;
const RAND_OBEN = 6;
const RAND_UNTEN = 14;
const PUNKTRADIUS = 3;
const SCHRIFT = 9;
/** Die Achse rastet auf runde Wertungen. */
const SCHRITT = 50;
/** So viele Rasterlinien höchstens. */
const RASTERLINIEN = 4;
const TAGE_WOCHE = 7;
const TAGE_4_WOCHEN = 28;
const TAGE_3_MONATE = 91;
const TAGE_HALBJAHR = 182;
const TAGE_JAHR = 365;

interface Ausschnitt {
  readonly kennung: string;
  readonly text: Textschluessel;
  readonly bereich: Wertungsbereich;
}

const AUSSCHNITTE: readonly Ausschnitt[] = [
  { kennung: "p10", text: "ich.wertung.bereich.p10", bereich: { art: "partien", anzahl: 10 } },
  { kennung: "p25", text: "ich.wertung.bereich.p25", bereich: { art: "partien", anzahl: 25 } },
  { kennung: "p50", text: "ich.wertung.bereich.p50", bereich: { art: "partien", anzahl: 50 } },
  { kennung: "w1", text: "ich.wertung.bereich.w1", bereich: { art: "zeit", tage: TAGE_WOCHE } },
  { kennung: "w4", text: "ich.wertung.bereich.w4", bereich: { art: "zeit", tage: TAGE_4_WOCHEN } },
  { kennung: "m3", text: "ich.wertung.bereich.m3", bereich: { art: "zeit", tage: TAGE_3_MONATE } },
  { kennung: "hj", text: "ich.wertung.bereich.hj", bereich: { art: "zeit", tage: TAGE_HALBJAHR } },
  { kennung: "j", text: "ich.wertung.bereich.j", bereich: { art: "zeit", tage: TAGE_JAHR } },
];
const STANDARD_AUSSCHNITT = "p25";

const ERGEBNISTEXT: Readonly<Record<Punktwert, Textschluessel>> = {
  1: "ich.wertung.sieg",
  0.5: "ich.wertung.remis",
  0: "ich.wertung.niederlage",
};
const ERGEBNISKLASSE: Readonly<Record<Punktwert, string>> = {
  1: "wertungskurve-sieg",
  0.5: "wertungskurve-remis",
  0: "wertungskurve-niederlage",
};

/** „17.10.2026“ aus einer ISO-Zeit. */
function datum(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
}

/** Der Wertebereich der Achse: runde Grenzen um die Punkte, mindestens ein Schritt Luft. */
function achse(punkte: readonly Wertungspunkt[]): { unten: number; oben: number } {
  const werte = punkte.map((p) => p.wertung);
  const unten = Math.floor((Math.min(...werte) - 1) / SCHRITT) * SCHRITT;
  const oben = Math.ceil((Math.max(...werte) + 1) / SCHRITT) * SCHRITT;
  return { unten, oben };
}

/** Die Lage der Punkte in der Zeichenfläche. */
function lagen(
  punkte: readonly Wertungspunkt[],
  bereich: Wertungsbereich,
  jetzt: Date,
): { x: number; y: number; punkt: Wertungspunkt }[] {
  const { unten, oben } = achse(punkte);
  const breite = BREITE - RAND_LINKS - RAND_RECHTS;
  const hoehe = HOEHE - RAND_OBEN - RAND_UNTEN;
  const y = (w: number) => RAND_OBEN + hoehe - ((w - unten) / (oben - unten)) * hoehe;
  if (bereich.art === "partien") {
    const schritt = punkte.length > 1 ? breite / (punkte.length - 1) : 0;
    return punkte.map((punkt, i) => ({
      x: RAND_LINKS + (punkte.length > 1 ? i * schritt : breite),
      y: y(punkt.wertung),
      punkt,
    }));
  }
  const ende = jetzt.getTime();
  const anfang = ende - bereich.tage * 24 * 60 * 60 * 1000;
  return punkte.map((punkt) => ({
    x: RAND_LINKS + ((new Date(punkt.zeit).getTime() - anfang) / (ende - anfang)) * breite,
    y: y(punkt.wertung),
    punkt,
  }));
}

/** Die Rasterlinien mit Beschriftung: Zwischenwerte in ganzen Schritten. */
function raster(punkte: readonly Wertungspunkt[]): number[] {
  const { unten, oben } = achse(punkte);
  const stufen = Math.max(1, Math.ceil((oben - unten) / SCHRITT / RASTERLINIEN));
  const linien: number[] = [];
  for (let w = unten; w <= oben; w += stufen * SCHRITT) linien.push(w);
  return linien;
}

function Kurve({
  punkte,
  bereich,
  jetzt,
}: {
  punkte: readonly Wertungspunkt[];
  bereich: Wertungsbereich;
  jetzt: Date;
}) {
  const { unten, oben } = achse(punkte);
  const hoehe = HOEHE - RAND_OBEN - RAND_UNTEN;
  const yVon = (w: number) => RAND_OBEN + hoehe - ((w - unten) / (oben - unten)) * hoehe;
  const lage = lagen(punkte, bereich, jetzt);
  const erste = punkte[0];
  const letzte = punkte[punkte.length - 1];
  return (
    <svg
      className="wertungskurve"
      viewBox={`0 0 ${BREITE} ${HOEHE}`}
      role="img"
      aria-label={t("ich.wertung.kurve")}
      data-testid="wertungskurve"
    >
      {raster(punkte).map((w) => (
        <g key={w} className="wertungskurve-raster">
          <line x1={RAND_LINKS} y1={yVon(w)} x2={BREITE - RAND_RECHTS} y2={yVon(w)} />
          <text x={RAND_LINKS - 3} y={yVon(w) + SCHRIFT / 3} fontSize={SCHRIFT} textAnchor="end">
            {w}
          </text>
        </g>
      ))}
      <polyline
        className="wertungskurve-linie"
        points={lage.map((l) => `${l.x},${l.y}`).join(" ")}
      />
      {lage.map((l) => (
        <circle
          key={l.punkt.partieId}
          className={ERGEBNISKLASSE[l.punkt.ergebnis]}
          cx={l.x}
          cy={l.y}
          r={PUNKTRADIUS}
        >
          <title>
            {t("ich.wertung.punkt", {
              datum: datum(l.punkt.zeit),
              ergebnis: t(ERGEBNISTEXT[l.punkt.ergebnis]),
              gegner: l.punkt.gegner,
              wertung: l.punkt.wertung,
            })}
          </title>
        </circle>
      ))}
      {erste && letzte && (
        <g className="wertungskurve-daten">
          <text x={RAND_LINKS} y={HOEHE - 3} fontSize={SCHRIFT}>
            {datum(erste.zeit)}
          </text>
          <text x={BREITE - RAND_RECHTS} y={HOEHE - 3} fontSize={SCHRIFT} textAnchor="end">
            {bereich.art === "zeit" ? t("ich.wertung.jetzt") : datum(letzte.zeit)}
          </text>
        </g>
      )}
    </svg>
  );
}

/** Knopf „Wertung zurücksetzen“ mit Nachfrage. */
function Zuruecksetzen() {
  const [nachfrage, setzeNachfrage] = useState(false);
  const zuruecksetzen = () => {
    void aendere((d) => ({ ...d, spiel: setzeWertungZurueck(d.spiel) }));
    setzeNachfrage(false);
  };
  if (!nachfrage) {
    return (
      <button type="button" className="knopf-zweit" onClick={() => setzeNachfrage(true)}>
        {t("ich.wertung.zuruecksetzen")}
      </button>
    );
  }
  return (
    <div className="nachfrage">
      <p>{t("ich.wertung.zuruecksetzenFrage")}</p>
      <div className="knopfreihe">
        <button type="button" className="knopf-gefahr" onClick={zuruecksetzen}>
          {t("ich.wertung.zuruecksetzenJa")}
        </button>
        <button type="button" className="knopf-zweit" onClick={() => setzeNachfrage(false)}>
          {t("loeschen.nein")}
        </button>
      </div>
    </div>
  );
}

/** „+24“, „−12“ oder „±0“. */
function vorzeichen(wert: number): string {
  if (wert > 0) return `+${wert}`;
  if (wert < 0) return `−${-wert}`;
  return "±0";
}

/**
 * Die Karte mit Wertung, Ausschnitt und Kurve. `jetzt` für die Zeiträume (in Tests fest).
 * Beispiel: drei gewertete Partien, Wertung 1424 → „1424“, Kurve mit drei Punkten.
 */
export function Wertungskurve({
  punkte,
  jetzt = new Date(),
}: {
  punkte: readonly Wertungspunkt[];
  jetzt?: Date;
}) {
  const [kennung, setzeKennung] = useState(STANDARD_AUSSCHNITT);
  const ausschnitt = AUSSCHNITTE.find((a) => a.kennung === kennung) ?? AUSSCHNITTE[0];
  const aktuell = aktuelleWertung(punkte);
  if (aktuell === null || !ausschnitt) {
    return (
      <section className="karte wertung" data-testid="wertung">
        <h2 className="karte-titel">{t("ich.wertung.titel")}</h2>
        <p className="hinweis">{t("ich.wertung.leer")}</p>
      </section>
    );
  }
  const sichtbar = imBereich(punkte, ausschnitt.bereich, jetzt);
  const start = sichtbar[0];
  return (
    <section className="karte wertung" data-testid="wertung">
      <h2 className="karte-titel">{t("ich.wertung.titel")}</h2>
      <p className="wertung-zahl" data-testid="wertung-zahl">
        {aktuell}
      </p>
      <p className="hinweis">
        {t("ich.wertung.stand", {
          anzahl: punkte.length,
          aenderung: start ? vorzeichen(aktuell - start.wertung) : "±0",
        })}
      </p>
      <label className="einstellung-name" htmlFor="wertung-bereich">
        {t("ich.wertung.bereich")}
      </label>
      <select
        id="wertung-bereich"
        className="auswahlfeld"
        value={kennung}
        onChange={(e) => setzeKennung(e.target.value)}
      >
        {AUSSCHNITTE.map((a) => (
          <option key={a.kennung} value={a.kennung}>
            {t(a.text)}
          </option>
        ))}
      </select>
      {sichtbar.length > 0 ? (
        <Kurve punkte={sichtbar} bereich={ausschnitt.bereich} jetzt={jetzt} />
      ) : (
        <p className="hinweis">{t("ich.wertung.keineImBereich")}</p>
      )}
      <p className="hinweis">{t("ich.wertung.erklaerung")}</p>
      <Zuruecksetzen />
    </section>
  );
}
