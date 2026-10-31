/**
 * Kopf der Karte „Heute“ (Gestaltung A2, 31.10.2026) und die kurze Meldung unter der Tageskette.
 *
 * Rolle im Gesamtbild: Links „Heute“, rechts der Stand der Woche mit Flamme („3 von 4 Tagen“) und
 * einem Stift zum Ändern des Ziels. Ohne Wochenziel steht rechts „Wochenziel?“: Es klappt die
 * Erklärung des Lerntags und „Später“ auf, statt sie immer als langen Satz zu zeigen.
 * Abhängigkeiten: training/wochenziel.ts, i18n.
 */
import { Flame, Pencil } from "lucide-react";
import { useState } from "react";
import { t, tZahl } from "../../../i18n/sprache";
import type { Nutzerdaten } from "../../../speicher/format";
import {
  besteFolge,
  erreichteWochen,
  FOLGE_AB,
  type Wochenlage,
} from "../../../training/wochenziel";

/** Größe der kleinen Symbole im Kopf (Bildpunkte). */
const SYMBOL = 18;

/** Stand mit Flamme und Stift; der Stift öffnet die Wahl zum Ändern. */
function Wochenstand({ lage, aendern }: { lage: Wochenlage; aendern: () => void }) {
  return (
    <div className="heute-stand">
      <Flame size={SYMBOL} aria-hidden="true" className="heute-flamme" />
      <span data-testid="wochenziel-stand">
        {t("woche.stand", { gelernt: lage.gelernt, ziel: lage.ziel ?? 0 })}
      </span>
      <button
        type="button"
        className="heute-stift"
        aria-label={t("woche.zielAendern")}
        onClick={aendern}
      >
        <Pencil size={SYMBOL} aria-hidden="true" />
      </button>
    </div>
  );
}

/** Kopfzeile; `spaeter` nur bei der ersten Wahl (ohne Ziel), sonst null. */
export function Heutekopf({
  lage,
  wahl,
  aendern,
  spaeter,
}: {
  lage: Wochenlage;
  wahl: boolean;
  aendern: () => void;
  spaeter: (() => void) | null;
}) {
  const [hilfe, setzeHilfe] = useState(false);
  const ersteWahl = wahl && spaeter !== null;
  return (
    <>
      <div className="karte-kopf heute-kopf">
        <h2>{t("buchlook.heute")}</h2>
        {lage.ziel !== null && !wahl && <Wochenstand lage={lage} aendern={aendern} />}
        {ersteWahl && (
          <button
            type="button"
            className="knopf-link heute-hilfe"
            aria-expanded={hilfe}
            onClick={() => setzeHilfe(!hilfe)}
          >
            {t("buchlook.wochenzielFrage")}
          </button>
        )}
      </div>
      {ersteWahl && hilfe && (
        <div className="heute-erklaerung">
          <p className="hinweis">{t("woche.lerntag")}</p>
          <button type="button" className="knopf-zweit" onClick={spaeter}>
            {t("woche.spaeter")}
          </button>
        </div>
      )}
    </>
  );
}

/** „Wochenziel geschafft“ und die Bilanz in einer leisen Zeile; sonst nichts. */
export function Wochenmeldung({ daten, lage }: { daten: Nutzerdaten; lage: Wochenlage }) {
  const wochen = erreichteWochen(daten);
  const folge = besteFolge(wochen);
  if (!lage.erreicht && wochen.length === 0) return null;
  return (
    <p className="heute-meldung">
      {lage.erreicht && <strong className="heute-erreicht">{t("buchlook.erreicht")}</strong>}
      {wochen.length > 0 && (
        <span data-testid="wochenziel-bilanz">
          {tZahl("buchlook.bilanz", wochen.length, { n: wochen.length })}
          {folge >= FOLGE_AB && <> · {t("buchlook.folge", { n: folge })}</>}
        </span>
      )}
    </p>
  );
}
