/**
 * Klappe „Eröffnungen nach Spielstärke“ in der Eröffnungswahl: Bänder von … bis … wählen, je Band
 * die drei häufigsten Eröffnungen für Weiß und für Schwarz, mit Buch- und Gambitmarke und
 * Häufigkeit; ein Tipp legt die Eröffnung für den Bot fest.
 *
 * Rolle im Gesamtbild: Eröffnungspaket der Ideensammlung, Stufe 2 (Wunsch des Autors,
 * 26.10.2026; Empfehlung Q3-2). Rechnung in spiel/eroeffnungsbaender.ts, Daten aus dem
 * Lichess-Monat (CC0). Die Wahl ist dieselbe wie in der Liste „Aus der Praxis“ („praxis:Name“,
 * spiel/partie.ts), es entsteht also kein neues Speicherformat. Seit 0.3.11 (Stufe 3) unter
 * jeder Eröffnung der Variantenbaum (Variantenbaum.tsx) und unten die Gambits (Gambitliste.tsx).
 * Seit Paket 9 auch im Gegnereditor mit Mehrfachauswahl (feste Eröffnungen eines eigenen Bots).
 * Abhängigkeiten: spiel/eroeffnungsbaender.ts, daten/laden.ts, useDaten, i18n.
 */
import { useState } from "react";
import { ladeEroeffnungsbaender } from "../../../daten/laden";
import { sprache, t } from "../../../i18n/sprache";
import {
  auswahlNachStaerke,
  type Bandfamilie,
  type Eroeffnungsbaender,
  type Eroeffnungsseite,
  type Staerkeeintrag,
} from "../../../spiel/eroeffnungsbaender";
import { PRAXIS_VORSILBE } from "../../../spiel/partie";
import { useDaten } from "../bausteine/useDaten";
import { Gambitliste } from "./Gambitliste";
import { Variantenbaum } from "./Variantenbaum";

/**
 * Wie gewählt wird: `ist` sagt, ob ein Wert („praxis:Name“) gewählt ist, `beiWahl` wählt ihn (im
 * Gegnereditor: schaltet ihn um); `beiSchnellwahl` nur bei Mehrfachauswahl (Variantenbaum).
 */
export interface Staerkewahlart {
  readonly ist: (wert: string) => boolean;
  readonly beiWahl: (wert: string) => void;
  readonly beiSchnellwahl?: (familie: Bandfamilie, anzahl: number | null) => void;
}

/** Vorgabe der Bänder: 1000 bis 1400, die Leser des Buches (Einsteiger bis Verein). */
const VORGABE_VON = 1000;
const VORGABE_BIS = 1400;
/** Nachkommastellen der Häufigkeit. */
const STELLEN = 1;

/** Die Zahl eines Bandes für die Auswahl, das letzte mit „+“. */
function bandname(daten: Eroeffnungsbaender, index: number): string {
  const wert = daten.baender[index] ?? 0;
  return index === daten.baender.length - 1 ? `${wert}+` : String(wert);
}

/** Auswahl eines Bandes (von oder bis). */
function Bandfeld({
  daten,
  kennung,
  text,
  wert,
  beiWahl,
}: {
  daten: Eroeffnungsbaender;
  kennung: string;
  text: string;
  wert: number;
  beiWahl: (index: number) => void;
}) {
  return (
    <label className="staerkewahl-band" htmlFor={kennung}>
      {text}
      <select
        id={kennung}
        className="auswahlfeld"
        value={wert}
        onChange={(e) => beiWahl(Number(e.target.value))}
      >
        {daten.baender.map((_, i) => (
          <option key={i} value={i}>
            {bandname(daten, i)}
          </option>
        ))}
      </select>
    </label>
  );
}

/** Eine Zeile: Name, Marken, Häufigkeit im Band, das sie brachte. */
function Zeile({
  daten,
  eintrag,
  wahl,
}: {
  daten: Eroeffnungsbaender;
  eintrag: Staerkeeintrag;
  wahl: Staerkewahlart;
}) {
  const { familie, band } = eintrag;
  const wert = `${PRAXIS_VORSILBE}${familie.name}`;
  const anteil = (familie.anteil[band] ?? 0).toLocaleString(sprache(), {
    maximumFractionDigits: STELLEN,
  });
  return (
    <li>
      <button
        type="button"
        className="staerkewahl-zeile"
        aria-pressed={wahl.ist(wert)}
        onClick={() => wahl.beiWahl(wert)}
      >
        <span className="staerkewahl-name">
          {sprache() === "de" ? familie.nameDe : familie.name}
        </span>
        {familie.buch && (
          <span className="staerkewahl-marke">
            {t("spielen.staerkewahl.buch", { abschnitt: familie.buch })}
          </span>
        )}
        {familie.gambit && (
          <span className="staerkewahl-marke">{t("spielen.staerkewahl.gambit")}</span>
        )}
        <span className="hinweis">
          {t("spielen.staerkewahl.anteil", { anteil, band: bandname(daten, band) })}
        </span>
      </button>
      <Variantenbaum
        daten={daten}
        familie={familie}
        ist={wahl.ist}
        beiWahl={wahl.beiWahl}
        {...(wahl.beiSchnellwahl ? { beiSchnellwahl: wahl.beiSchnellwahl } : {})}
      />
    </li>
  );
}

/** Die Liste einer Seite. */
function Seite({
  daten,
  seite,
  von,
  bis,
  wahl,
}: {
  daten: Eroeffnungsbaender;
  seite: Eroeffnungsseite;
  von: number;
  bis: number;
  wahl: Staerkewahlart;
}) {
  const liste = auswahlNachStaerke(daten, seite, von, bis);
  return (
    <div className="staerkewahl-seite">
      <h4>{t(seite === "w" ? "spielen.staerkewahl.weiss" : "spielen.staerkewahl.schwarz")}</h4>
      <ul className="staerkewahl-liste">
        {liste.map((e) => (
          <Zeile key={e.familie.name} daten={daten} eintrag={e} wahl={wahl} />
        ))}
      </ul>
    </div>
  );
}

/**
 * Die Klappe mit Bändern und den beiden Listen. Seit Paket 9 mit `wahl` statt eines einzelnen
 * Wertes: Im Spielfenster ist genau ein Wert gewählt, im Gegnereditor mehrere (Haken).
 * `praefix` hält die Kennungen der Bandfelder eindeutig, wenn zwei Klappen auf dem Bildschirm sind.
 */
export function Staerkewahl({
  wahl,
  praefix = "staerke",
}: {
  wahl: Staerkewahlart;
  praefix?: string;
}) {
  const daten = useDaten(ladeEroeffnungsbaender, "eroeffnungsbaender");
  const [von, setzeVon] = useState<number | null>(null);
  const [bis, setzeBis] = useState<number | null>(null);
  if (daten.art !== "fertig") return null;
  const d = daten.wert;
  const a = von ?? Math.max(0, d.baender.indexOf(VORGABE_VON));
  const b = bis ?? Math.max(0, d.baender.indexOf(VORGABE_BIS));
  return (
    <details className="unterabschnitt staerkewahl" data-testid="staerkewahl">
      <summary>{t("spielen.staerkewahl.titel")}</summary>
      <p className="hinweis">{t("spielen.staerkewahl.erklaerung")}</p>
      <div className="staerkewahl-baender">
        <Bandfeld
          daten={d}
          kennung={`${praefix}-von`}
          text={t("spielen.staerkewahl.von")}
          wert={a}
          beiWahl={setzeVon}
        />
        <Bandfeld
          daten={d}
          kennung={`${praefix}-bis`}
          text={t("spielen.staerkewahl.bis")}
          wert={b}
          beiWahl={setzeBis}
        />
      </div>
      {(["w", "s"] as const).map((seite) => (
        <Seite key={seite} daten={d} seite={seite} von={a} bis={b} wahl={wahl} />
      ))}
      <Gambitliste
        daten={d}
        von={a}
        bis={b}
        bandname={(i) => bandname(d, i)}
        ist={wahl.ist}
        beiWahl={wahl.beiWahl}
      />
      <p className="hinweis">{t("spielen.staerkewahl.quelle")}</p>
    </details>
  );
}
