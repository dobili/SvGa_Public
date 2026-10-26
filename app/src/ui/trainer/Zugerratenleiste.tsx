/**
 * Zug erraten: Blättern durch die schon gespielten Züge und der Analysemodus (R45).
 *
 * Rolle im Gesamtbild: Wunsch des Autors (23.10.2026): „Zugnavigation durch die schon richtig
 * gespielten Züge“ und „optional Analysemodus: von der aktuellen Stellung Varianten
 * durchspielen, bevor man den Zug festlegt“. Die Leiste sieht aus wie die Zugleiste beim
 * Nachspielen (gleiche Klassen); geraten wird nur in der aktuellen Stellung.
 * Abhängigkeiten: schach/weiterspielen.ts (Zugtexte), i18n, komponenten/brettbedienung/Zugknoepfe.tsx.
 */
import { Fragment, useEffect, useRef } from "react";
import { sprache, t } from "../../i18n/sprache";
import { eigeneAlsText } from "../../schach/weiterspielen";
import { Zugknoepfe, type Zugrichtung } from "../komponenten/brettbedienung/Zugknoepfe";

/**
 * Die gespielten Züge als Tippflächen, darunter Anfang, zurück, vor, Ende.
 *
 * Eingaben: Startstellung, gespielte Züge (SAN, englisch), gezeigte Stelle (Zahl der Halbzüge;
 * null für die aktuelle Stellung), Wahl einer Stelle.
 */
export function Zugerratenleiste({
  startFen,
  zuege,
  stelle,
  setzeStelle,
}: {
  startFen: string;
  zuege: readonly string[];
  stelle: number | null;
  setzeStelle: (stelle: number | null) => void;
}) {
  const behaelter = useRef<HTMLParagraphElement>(null);
  const gezeigt = stelle ?? zuege.length;
  const texte = eigeneAlsText(startFen, zuege, sprache());
  // In der aktuellen Stellung bleibt der neueste Zug sichtbar.
  useEffect(() => {
    const zeile = behaelter.current;
    if (zeile && stelle === null) zeile.scrollTop = zeile.scrollHeight;
  }, [stelle, zuege.length]);
  const gehe = (ziel: number) => setzeStelle(ziel >= zuege.length ? null : Math.max(0, ziel));
  const ziele: Readonly<Record<Zugrichtung, number>> = {
    anfang: 0,
    zurueck: gezeigt - 1,
    vor: gezeigt + 1,
    ende: zuege.length,
  };
  const amAnfang = gezeigt === 0;
  const amEnde = stelle === null;
  return (
    <div className="zugleiste" data-testid="zugerraten-navigation">
      <p ref={behaelter} className="zugzeile" aria-label={t("zugerraten.navigation")}>
        {texte.length === 0 && t("repertoiretrainer.nochKeinZug")}
        {texte.map((text, index) => (
          <Fragment key={`${index}-${text}`}>
            <button
              type="button"
              className="zug"
              aria-current={index === gezeigt - 1 ? "step" : undefined}
              onClick={() => gehe(index + 1)}
            >
              {text}
            </button>{" "}
          </Fragment>
        ))}
      </p>
      <Zugknoepfe
        gesperrt={{ anfang: amAnfang, zurueck: amAnfang, vor: amEnde, ende: amEnde }}
        beiRichtung={(richtung) => gehe(ziele[richtung])}
      />
      {stelle !== null && <p className="hinweis">{t("zugerraten.ansicht")}</p>}
    </div>
  );
}

/**
 * Der Analysemodus: aus, oder die Analysezüge ab der aktuellen Stellung mit „Zug zurück“ und
 * „Analyse beenden“.
 */
export function Analysebereich({
  fen,
  analyse,
  setzeAnalyse,
  moeglich,
}: {
  /** Die aktuelle Stellung der Partie, ab der analysiert wird. */
  fen: string;
  analyse: readonly string[] | null;
  setzeAnalyse: (analyse: readonly string[] | null) => void;
  /** Nur in der aktuellen Stellung und vor dem Ende der Partie. */
  moeglich: boolean;
}) {
  if (!analyse)
    return (
      <button
        type="button"
        className="knopf-zweit"
        disabled={!moeglich}
        onClick={() => setzeAnalyse([])}
      >
        {t("zugerraten.analysieren")}
      </button>
    );
  const texte = eigeneAlsText(fen, analyse, sprache());
  return (
    <div className="karte" data-testid="zugerraten-analyse">
      <p className="hinweis">{t("zugerraten.analyseHinweis")}</p>
      <p>{texte.join(" ") || t("zugerraten.analyseLeer")}</p>
      <div className="knopfzeile">
        <button
          type="button"
          className="knopf-zweit"
          disabled={analyse.length === 0}
          onClick={() => setzeAnalyse(analyse.slice(0, -1))}
        >
          {t("zugerraten.analyseZurueck")}
        </button>
        <button type="button" className="knopf-haupt" onClick={() => setzeAnalyse(null)}>
          {t("zugerraten.analyseBeenden")}
        </button>
      </div>
    </div>
  );
}
