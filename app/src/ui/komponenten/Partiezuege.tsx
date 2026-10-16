/**
 * Die gespielten Züge einer Partie mit Zugnavigation: Anfang, Halbzug zurück, vor, Ende.
 *
 * Rolle im Gesamtbild: Teil des Partie-Bildschirms (Bildschirmentwurf „Partie“, Zugliste unter
 * dem Brett). Ein Tipp auf einen Zug zeigt die Stellung danach; gezogen wird nur in der
 * aktuellen Stellung. Auch in der ruhigen Ansicht sichtbar (Wunsch des Autors: Brett,
 * Zugnavigation und gespielte Züge).
 * Abhängigkeiten: schach/weiterspielen.ts (Züge mit Nummern), i18n, lucide-react.
 */
import { ChevronFirst, ChevronLast, StepBack, StepForward } from "lucide-react";
import { Fragment } from "react";
import { sprache, t } from "../../i18n/sprache";
import { eigeneAlsText } from "../../schach/weiterspielen";

const SYMBOLGROESSE = 22;

/**
 * Eingaben: Startstellung, Züge in SAN, gezeigte Stelle (Zahl der Halbzüge), Zugzeichen der
 * Auswertung je Halbzug (nach dem Ende), Wechsel der Stelle.
 * Beispiel: 1. e4 e5 2. Sf3, Stelle 3 → „2. Sf3“ hervorgehoben.
 */
export function Partiezuege({
  startFen,
  zuege,
  stelle,
  zeichen = [],
  beiStelle,
}: {
  startFen: string;
  zuege: readonly string[];
  stelle: number;
  zeichen?: readonly (string | null)[];
  beiStelle: (stelle: number) => void;
}) {
  const texte = eigeneAlsText(startFen, zuege, sprache());
  const knopf = (
    richtung: "anfang" | "zurueck" | "vor" | "ende",
    ziel: number,
    symbol: React.ReactNode,
  ) => (
    <button
      type="button"
      className="knopf-symbol"
      aria-label={t(`zugleiste.${richtung}`)}
      disabled={ziel === stelle || ziel < 0 || ziel > zuege.length}
      onClick={() => beiStelle(ziel)}
    >
      {symbol}
    </button>
  );
  return (
    <section className="zugleiste partiezuege" aria-label={t("partie.zuege")}>
      <p className="zugzeile" data-testid="partiezuege">
        {texte.length === 0 && <span className="hinweis">{t("partie.nochKeineZuege")}</span>}
        {texte.map((text, index) => (
          <Fragment key={`${index}-${text}`}>
            <button
              type="button"
              className="zug"
              aria-current={index === stelle - 1 ? "step" : undefined}
              onClick={() => beiStelle(index + 1)}
            >
              {text}
              {zeichen[index] ?? ""}
            </button>{" "}
          </Fragment>
        ))}
      </p>
      <div className="zugknoepfe">
        {knopf("anfang", 0, <ChevronFirst size={SYMBOLGROESSE} />)}
        {knopf("zurueck", stelle - 1, <StepBack size={SYMBOLGROESSE} />)}
        {knopf("vor", stelle + 1, <StepForward size={SYMBOLGROESSE} />)}
        {knopf("ende", zuege.length, <ChevronLast size={SYMBOLGROESSE} />)}
      </div>
    </section>
  );
}
