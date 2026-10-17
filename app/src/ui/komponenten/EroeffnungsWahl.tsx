/**
 * Wahl einer Eröffnung für die Engine vor der Partie: eine Liste der Eröffnungen aus Kapitel 2
 * und 3, dazu die Hauptvariante als Vorschau.
 *
 * Rolle im Gesamtbild: Rückmeldung des Autors zum Nachtest von 0.2.38 (N178: „Wie bringe ich die
 * Engine zu einer bestimmten Eröffnung?“). Die Engine folgt der gewählten Eröffnung mit Buchtreue
 * 1, solange der Leser ihre Züge spielt (usePartie.ts, buchzuegeZu); verlässt er sie, spielt
 * die Engine die übrigen Buchzüge oder selbst. Die Liste kommt aus dem Eröffnungsindex.
 * Abhängigkeiten: schach/eroeffnungsindex.ts, useEroeffnungsindex, i18n.
 */
import { t } from "../../i18n/sprache";
import { eroeffnungsnamen, hauptlinieVon } from "../../schach/eroeffnungsindex";
import { sanInSprache } from "../../schach/notation";
import { useEroeffnungsindex } from "./useEroeffnungsindex";

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
    return `${nummer}${sanInSprache(san, "de")}`;
  });
  return `${teile.join(" ")}${zuege.length > VORSCHAU_HALBZUEGE ? " …" : ""}`;
}

export function EroeffnungsWahl({
  gewaehlt,
  beiWahl,
}: {
  gewaehlt: string | null;
  beiWahl: (eroeffnung: string | null) => void;
}) {
  const index = useEroeffnungsindex(KAPITEL_MIT_EROEFFNUNGEN);
  if (!index) return null;
  const namen = eroeffnungsnamen(index);
  const linie = gewaehlt ? hauptlinieVon(index, gewaehlt) : [];
  return (
    <section className="karte eroeffnungswahl" data-testid="eroeffnungswahl">
      <label className="einstellung-name" htmlFor="eroeffnung">
        {t("spielen.eroeffnung")}
      </label>
      <select
        id="eroeffnung"
        className="auswahlfeld"
        value={gewaehlt ?? FREI}
        onChange={(e) => beiWahl(e.target.value === FREI ? null : e.target.value)}
      >
        <option value={FREI}>{t("spielen.eroeffnung.frei")}</option>
        {namen.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
      {gewaehlt && linie.length > 0 && (
        <p className="hinweis">{t("spielen.eroeffnungZuege", { zuege: zugfolge(linie) })}</p>
      )}
      <p className="hinweis">
        {t(gewaehlt ? "spielen.eroeffnungHinweis" : "spielen.eroeffnungFrei")}
      </p>
    </section>
  );
}
