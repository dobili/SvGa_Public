/**
 * Wahl einer Eröffnung für die Engine vor der Partie: eine Liste der Eröffnungen aus Kapitel 2
 * und 3, dazu die Hauptvariante als Vorschau.
 *
 * Rolle im Gesamtbild: Rückmeldung des Autors zum Nachtest (N178: „Wie bringe ich die Engine zu
 * einer bestimmten Eröffnung?“). Die Engine folgt der gewählten Eröffnung mit Buchtreue 1,
 * solange der Leser ihre Züge spielt (usePartie.ts, buchzuegeZu); verlässt er sie, spielt die
 * Engine die übrigen Buchzüge oder selbst. „frei“ heißt: ohne Buch, die Engine spielt die
 * Eröffnung selbst (Wunsch des Autors); „eine Eröffnung des Buches (zufällig)“ wählt mit
 * Buchtreue 0,85. Die Liste kommt aus dem Eröffnungsindex.
 * Die Vorgabe ist „wie Menschen dieser Stärke“ (Wunsch des Autors): Der Bot eröffnet nach dem
 * Praxisbuch (engine/praxisbuch.ts). Dazu kommen die häufigsten benannten Eröffnungen aus der
 * Praxis (Lichess-Namen), denen der Bot folgt, solange du ihre Züge spielst.
 * Abhängigkeiten: schach/eroeffnungsindex.ts, engine/praxisbuch.ts, daten/laden.ts,
 * useEroeffnungsindex, useDaten, i18n.
 */
import { sprache, t } from "../../../i18n/sprache";
import { eroeffnungsnamen, hauptlinieVon } from "../../../schach/eroeffnungsindex";
import { ladePraxisbuch } from "../../../daten/laden";
import { praxislinie } from "../../../engine/praxisbuch";
import { EROEFFNUNG_BUCH, EROEFFNUNG_PRAXIS, PRAXIS_VORSILBE } from "../../../spiel/partie";
import { useDaten } from "../bausteine/useDaten";
import { sanInSprache } from "../../../schach/notation";
import { useEroeffnungsindex } from "../bausteine/useEroeffnungsindex";
import { Titelsymbol } from "../bausteine/Titelsymbol";

/** Kapitel 2: ab dort gibt es den Index. */
const KAPITEL_MIT_EROEFFNUNGEN = 2;
/** So viele Halbzüge der Hauptvariante zeigt die Vorschau. */
const VORSCHAU_HALBZUEGE = 8;
/** Wert der Auswahl „frei“. */
const FREI = "";

/** „1. e4 e5 2. Sf3 Sc6 3. Lb5 a6 …“ aus Zügen in englischer Kurznotation. */
function zugfolge(zuege: readonly string[]): string {
  const teile = zuege.slice(0, VORSCHAU_HALBZUEGE).map((san, i) => {
    const nummer = i % 2 === 0 ? `${i / 2 + 1}. ` : "";
    return `${nummer}${sanInSprache(san, sprache())}`;
  });
  return `${teile.join(" ")}${zuege.length > VORSCHAU_HALBZUEGE ? " …" : ""}`;
}

/**
 * Wahl einer Eröffnung aus Kapitel 2 und 3 vor der Partie, mit Vorschau der Hauptvariante: Die
 * Engine folgt ihr, solange der Leser ihre Züge spielt.
 */
export function EroeffnungsWahl({
  gewaehlt,
  beiWahl,
  eingebettet = false,
}: {
  gewaehlt: string | null;
  beiWahl: (eroeffnung: string | null) => void;
  /** In der Klappe „Eröffnung festlegen“ über „Partie beginnen“ ohne eigene Karte (0.2.116). */
  eingebettet?: boolean;
}) {
  const index = useEroeffnungsindex(KAPITEL_MIT_EROEFFNUNGEN);
  const praxisdaten = useDaten(ladePraxisbuch, "praxisbuch");
  if (!index) return null;
  const praxis = praxisdaten.art === "fertig" ? praxisdaten.wert : null;
  const namen = eroeffnungsnamen(index);
  const praxisnamen = (praxis?.eroeffnungen ?? []).map(([name]) => name).sort();
  const ausDerPraxis = gewaehlt?.startsWith(PRAXIS_VORSILBE) ?? false;
  const linie = ausDerPraxis
    ? praxis
      ? praxislinie(praxis, (gewaehlt ?? "").slice(PRAXIS_VORSILBE.length))
      : []
    : gewaehlt && gewaehlt !== EROEFFNUNG_BUCH && gewaehlt !== EROEFFNUNG_PRAXIS
      ? hauptlinieVon(index, gewaehlt)
      : [];
  const hinweis =
    gewaehlt === null
      ? "spielen.eroeffnungFrei"
      : gewaehlt === EROEFFNUNG_BUCH
        ? "spielen.eroeffnungBuch"
        : gewaehlt === EROEFFNUNG_PRAXIS
          ? "spielen.eroeffnungPraxis"
          : ausDerPraxis
            ? "spielen.eroeffnungPraxisLinie"
            : "spielen.eroeffnungHinweis";
  return (
    <section
      className={eingebettet ? "eroeffnungswahl" : "karte eroeffnungswahl"}
      data-testid="eroeffnungswahl"
    >
      <label className="einstellung-name" htmlFor="eroeffnung">
        <Titelsymbol art="eroeffnung" />
        {t("spielen.eroeffnung")}
      </label>
      <select
        id="eroeffnung"
        className="auswahlfeld"
        value={gewaehlt ?? FREI}
        onChange={(e) => beiWahl(e.target.value === FREI ? null : e.target.value)}
      >
        <option value={EROEFFNUNG_PRAXIS}>{t("spielen.eroeffnung.praxis")}</option>
        <option value={FREI}>{t("spielen.eroeffnung.frei")}</option>
        <option value={EROEFFNUNG_BUCH}>{t("spielen.eroeffnung.buch")}</option>
        <optgroup label={t("spielen.eroeffnung.ausDemBuch")}>
          {namen.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </optgroup>
        {praxisnamen.length > 0 && (
          <optgroup label={t("spielen.eroeffnung.ausDerPraxis")}>
            {praxisnamen.map((name) => (
              <option key={name} value={`${PRAXIS_VORSILBE}${name}`}>
                {name}
              </option>
            ))}
          </optgroup>
        )}
      </select>
      {gewaehlt && linie.length > 0 && (
        <p className="hinweis">{t("spielen.eroeffnungZuege", { zuege: zugfolge(linie) })}</p>
      )}
      <p className="hinweis">{t(hinweis)}</p>
    </section>
  );
}
