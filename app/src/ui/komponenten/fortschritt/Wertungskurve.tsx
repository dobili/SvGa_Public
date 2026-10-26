/**
 * Karte „Deine Wertung“ oben in den Einstellungen (Wunsch des Autors, 17.10.2026): die
 * Elo-Wertung aus den gewerteten Partien (spiel/wertung.ts) mit Kurve.
 *
 * Rolle im Gesamtbild: Die Karte zeigt die aktuelle Zahl groß, darunter die Kurve mit einem Punkt
 * je Partie und ein Auswahlfeld für den Ausschnitt (letzte 10, 25, 50 Partien oder ein Zeitraum).
 * Reiterzeile „Ansicht“: „Wertung“ zeigt die Elo-Wertung; „Eröffnung“, „Mittelspiel“, „Endspiel“
 * zeigen die Schätzung des Elo-Modells für die Phase aus den jeweils letzten zehn Partien
 * (spiel/wertung.ts, phasenverlauf), nur wo die Spanne schmal ist (aus einer Partie ist sie das
 * nie, deshalb keine Werte je Partie). Dazu (Empfehlung, vom Autor am 24.10.2026 angenommen):
 * Reiter „Zeitklasse“ (Blitz, Schnellschach, Klassisch) mit eigener Wertung wie bei Lichess,
 * sobald mehr als eine Zeitklasse Partien hat; „vorläufig“ in den ersten zehn Partien; die
 * Schätzung aus den Zügen („Deine Spielstärke“) als Zeile darunter, damit Ergebnisse und
 * Zugqualität nebeneinander stehen. „Wertung zurücksetzen“ (nach Nachfrage) leert den Verlauf und
 * macht alle bisherigen Partien dauerhaft ungewertet (speicher/partien.ts).
 * Das Fragezeichen sitzt an der Überschrift und nimmt alle Erklärtexte auf (vorläufig, Schätzung
 * aus den Zügen, Phasen; Wunsch des Autors, 25.10.2026); sichtbar bleiben die Zahl mit der Marke
 * „vorläufig“ und eine kurze Zeile zum Stand.
 * „Lichess | chess.com | FIDE“ schaltet Zahl und Spanne auf Bereiche, die Änderung auf die
 * Mitte (wertungsmassstab.ts, Wunsch des Autors, 26.10.2026); die Kurve bleibt im Maßstab von Lichess
 * und sagt das (außerhalb der Tabellen gäbe es keine Punkte).
 * Abhängigkeiten: spiel/wertung.ts, spiel/elomodell.ts, speicher/, Wertungskurvenbild, Reiter,
 * InfoKnopf, wertungstext, wertungsmassstab, Massstabwahl, i18n.
 */
import { useMemo, useState } from "react";
import { t, type Textschluessel } from "../../../i18n/sprache";
import { setzeWertungZurueck } from "../../../speicher/partien";
import type { Partieeintrag } from "../../../speicher/partien";
import { aendere } from "../../../speicher/speicher";
import type { Wertungstempo } from "../../../spiel/elomodell";
import { PHASEN, type Phase } from "../../../spiel/phasen";
import {
  aktuelleWertung,
  imBereich,
  istVorlaeufig,
  kennzahlenJePartie,
  phasenverlauf,
  staerkeLetzterPartien,
  tempoDesPunkts,
  verlaufDerZeitklasse,
  zeitklassenMitWertung,
  type Wertungsbereich,
  type Wertungspunkt,
} from "../../../spiel/wertung";
import { MitInfo } from "../bausteine/InfoKnopf";
import { Listenname, Massstabtext, Massstabwahl } from "./Massstabwahl";
import { Reiter } from "../bausteine/Reiter";
import { Titelsymbol } from "../bausteine/Titelsymbol";
import { Kurve } from "./Wertungskurvenbild";
import {
  aenderungImMassstab,
  ausserhalbText,
  spanneImMassstab,
  useWertungsmassstab,
  zahlImMassstab,
  type Wertungsmassstab,
} from "./wertungsmassstab";
import { zeitklassenname } from "./wertungstext";

/** Was die Kurve zeigt: die Wertung oder die Schätzung je Phase. */
type Ansicht = "gesamt" | Phase;
const ANSICHTEN: readonly Ansicht[] = ["gesamt", ...PHASEN];

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

/** „+24“, „−12“ oder „±0“. */
function vorzeichen(wert: number): string {
  if (wert > 0) return `+${wert}`;
  if (wert < 0) return `−${-wert}`;
  return "±0";
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

/** Die leere Karte, solange keine Partie gewertet ist. */
function LeereKarte() {
  return (
    <section className="karte wertung" data-testid="wertung" data-tour="einstellungen-wertung">
      <h2 className="karte-titel">
        <Titelsymbol art="wertung" />
        {t("ich.wertung.titel")}
      </h2>
      <p className="hinweis">{t("ich.wertung.leer")}</p>
    </section>
  );
}

/** Die Zeile unter der Zahl in der Ansicht „Wertung“: „Schnellschach: 3 gewertete Partien …“. */
function Standzeile({
  kette,
  sichtbar,
  tempo,
  massstab,
}: {
  kette: readonly Wertungspunkt[];
  sichtbar: readonly Wertungspunkt[];
  tempo: Wertungstempo;
  massstab: Wertungsmassstab;
}) {
  const aktuell = aktuelleWertung(kette) ?? 0;
  const start = sichtbar[0];
  const aenderung = start ? aenderungImMassstab(tempo, start.wertung, aktuell, massstab) : 0;
  return (
    <p className="hinweis">
      {t(kette.length === 1 ? "ich.wertung.standKlasseEins" : "ich.wertung.standKlasse", {
        zeitklasse: zeitklassenname(tempo),
        anzahl: kette.length,
        aenderung: aenderung === null ? "–" : vorzeichen(aenderung),
      })}
    </p>
  );
}

/**
 * Die große Zahl im gewählten Maßstab (umgerechnet ein Bereich), mit Liste und Marke „vorläufig“;
 * außerhalb der Tabelle „–“ und darunter die Grenze. Beispiel: Klassisch 1500 umgerechnet →
 * „– chess.com“, „chess.com erst ab etwa 1505 (Lichess Klassisch)“ (Grenzen je Liste).
 */
function Zahlzeile({
  tempo,
  wert,
  massstab,
  vorlaeufig,
}: {
  tempo: Wertungstempo;
  wert: number | null;
  massstab: Wertungsmassstab;
  vorlaeufig: boolean;
}) {
  const zahl = wert === null ? null : zahlImMassstab(tempo, wert, massstab);
  return (
    <>
      <p
        className={zahl?.bereich ? "wertung-zahl bereich" : "wertung-zahl"}
        data-testid="wertung-zahl"
      >
        {zahl ? <Massstabtext zahl={zahl} /> : "–"}
        {zahl && <Listenname liste={zahl.liste} />}
        {vorlaeufig && (
          <span className="wertung-vorlaeufig-marke">{t("ich.wertung.vorlaeufigMarke")}</span>
        )}
      </p>
      {zahl?.ausserhalb && wert !== null && massstab !== "lichess" && (
        <p className="hinweis" data-testid="massstab-ausserhalb">
          {ausserhalbText(tempo, wert, massstab)}
        </p>
      )}
    </>
  );
}

/** Unter der Zahl einer Phase: „Spanne 1600–1760“ im Maßstab, sonst „Noch zu wenige Partien“. */
function Phasenspanne({
  tempo,
  phase,
  massstab,
}: {
  tempo: Wertungstempo;
  phase: { readonly von: number; readonly bis: number } | null;
  massstab: Wertungsmassstab;
}) {
  if (!phase) return <p className="hinweis">{t("ich.wertung.phasenZuWenigKurz")}</p>;
  const spanne = spanneImMassstab(tempo, phase.von, phase.bis, massstab);
  return spanne ? <p className="hinweis">{t("ich.wertung.spanneKurz", spanne)}</p> : null;
}

/**
 * Hinter dem Fragezeichen an der Überschrift: kurz, was die Zahl ist; „vorläufig“; die Schätzung
 * aus den Zügen; in einer Phasenansicht, warum noch keine Zahl steht; dann die lange Erklärung.
 */
function Erklaerung({
  kette,
  partien,
  tempo,
  phaseOhneZahl,
}: {
  kette: readonly Wertungspunkt[];
  partien: readonly Partieeintrag[];
  tempo: Wertungstempo;
  phaseOhneZahl: Phase | null;
}) {
  const zuege = useMemo(() => staerkeLetzterPartien(partien, tempo), [partien, tempo]);
  return (
    <>
      <p>{t("ich.wertung.kurz")}</p>
      {istVorlaeufig(kette) && (
        <p data-testid="wertung-vorlaeufig">
          {t("ich.wertung.vorlaeufig", { anzahl: kette.length })}
        </p>
      )}
      {zuege && (
        <p>
          {t(zuege.partien === 1 ? "ich.wertung.ausZuegenEins" : "ich.wertung.ausZuegen", {
            mitte: zuege.mitte,
            von: zuege.von,
            bis: zuege.bis,
            partien: zuege.partien,
          })}
        </p>
      )}
      {phaseOhneZahl && (
        <p>{t("ich.wertung.phasenZuWenig", { phase: t(`phase.name.${phaseOhneZahl}`) })}</p>
      )}
      <p>{t("ich.wertung.erklaerung")}</p>
      <p>{t("wertung.massstab.erklaerung")}</p>
    </>
  );
}

/**
 * Die Karte mit Wertung, Zeitklasse, Ausschnitt und Kurve. `jetzt` für die Zeiträume (in Tests
 * fest). Beispiel: drei gewertete Schnellschach-Partien, Wertung 1424 → „1424“, Zeile
 * „Schnellschach: 3 gewertete Partien …“, „Vorläufig …“, Kurve mit drei Punkten.
 */
export function Wertungskurve({
  punkte,
  partien,
  jetzt = new Date(),
}: {
  punkte: readonly Wertungspunkt[];
  partien: readonly Partieeintrag[];
  jetzt?: Date;
}) {
  const [kennung, setzeKennung] = useState(STANDARD_AUSSCHNITT);
  const [ansicht, setzeAnsicht] = useState<Ansicht>("gesamt");
  const [tempoWahl, setzeTempo] = useState<Wertungstempo | null>(null);
  const [massstab, setzeMassstab] = useWertungsmassstab();
  const zeitklassen = zeitklassenMitWertung(punkte);
  const letzter = punkte.at(-1);
  // Gezeigt wird die gewählte Zeitklasse, sonst die der letzten gewerteten Partie.
  const tempo =
    tempoWahl && zeitklassen.includes(tempoWahl)
      ? tempoWahl
      : letzter
        ? tempoDesPunkts(letzter)
        : "rapid";
  const kette = useMemo(() => verlaufDerZeitklasse(punkte, tempo), [punkte, tempo]);
  const kennzahlen = useMemo(
    () =>
      ansicht === "gesamt"
        ? new Map()
        : kennzahlenJePartie(partien, new Set(kette.map((p) => p.partieId))),
    [ansicht, partien, kette],
  );
  const ausschnitt = AUSSCHNITTE.find((a) => a.kennung === kennung) ?? AUSSCHNITTE[0];
  const aktuell = aktuelleWertung(kette);
  if (aktuell === null || !ausschnitt) return <LeereKarte />;
  const sichtbar = imBereich(kette, ausschnitt.bereich, jetzt);
  const phasenpunkte = ansicht === "gesamt" ? [] : phasenverlauf(kette, kennzahlen, tempo, ansicht);
  const imAusschnitt = new Set(sichtbar.map((p) => p.partieId));
  const phasenSichtbar = phasenpunkte.filter((p) => imAusschnitt.has(p.punkt.partieId));
  const letztePhase = phasenSichtbar.at(-1)?.schaetzung ?? null;
  const kurvenpunkte: readonly Wertungspunkt[] =
    ansicht === "gesamt"
      ? sichtbar
      : phasenSichtbar.map((p) => ({ ...p.punkt, wertung: p.schaetzung.mitte }));
  return (
    <section className="karte wertung" data-testid="wertung" data-tour="einstellungen-wertung">
      <MitInfo
        zeile={
          <h2 className="karte-titel">
            <Titelsymbol art="wertung" />
            {t("ich.wertung.titel")}
          </h2>
        }
        erklaerung={
          <Erklaerung
            kette={kette}
            partien={partien}
            tempo={tempo}
            phaseOhneZahl={ansicht !== "gesamt" && !letztePhase ? ansicht : null}
          />
        }
        thema={t("ich.wertung.titel")}
      />
      {zeitklassen.length > 1 && (
        <Reiter
          name={t("ich.wertung.zeitklasse")}
          eintraege={zeitklassen.map((z) => ({ wert: z, text: zeitklassenname(z) }))}
          gewaehlt={tempo}
          beiWahl={setzeTempo}
        />
      )}
      <Reiter
        name={t("ich.wertung.ansicht")}
        eintraege={ANSICHTEN.map((a) => ({
          wert: a,
          text: t(a === "gesamt" ? "ich.wertung.ansicht.gesamt" : `phase.name.${a}`),
        }))}
        gewaehlt={ansicht}
        beiWahl={setzeAnsicht}
      />
      <Massstabwahl massstab={massstab} beiWahl={setzeMassstab} />
      <Zahlzeile
        tempo={tempo}
        wert={ansicht === "gesamt" ? aktuell : (letztePhase?.mitte ?? null)}
        massstab={massstab}
        vorlaeufig={ansicht === "gesamt" && istVorlaeufig(kette)}
      />
      {ansicht === "gesamt" ? (
        <Standzeile kette={kette} sichtbar={sichtbar} tempo={tempo} massstab={massstab} />
      ) : (
        <Phasenspanne tempo={tempo} phase={letztePhase} massstab={massstab} />
      )}
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
      {kurvenpunkte.length > 0 ? (
        <>
          <Kurve punkte={kurvenpunkte} bereich={ausschnitt.bereich} jetzt={jetzt} />
          {massstab !== "lichess" && (
            <p className="hinweis" data-testid="wertungskurve-massstab">
              {t("wertung.massstab.kurve")}
            </p>
          )}
        </>
      ) : (
        <p className="hinweis">{t("ich.wertung.keineImBereich")}</p>
      )}
      <Zuruecksetzen />
    </section>
  );
}
