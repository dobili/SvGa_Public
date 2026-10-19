/**
 * Eine Kurzübung des Endspieltrainers: Stellung, Frage, Antwortknöpfe, danach die Regel des
 * Buches und (bei Quadrat und Schlüsselfeldern) die Lösung am Brett.
 *
 * Rolle im Gesamtbild: Teil des Endspieltrainers (EndspielBereich.tsx), seit 0.2.90. Die Aufgaben
 * erzeugt training/endspieldrills.ts; die Antwort rechnen die Bausteine der Werkzeuge aus
 * Kapitel 8 und 9. Pflichtenheft 7: Kurzdrills zu Quadrat, Opposition, Schlüsselfeldern und das
 * Quiz „Welches Erkennungsbild?“.
 * Abhängigkeiten: training/endspieldrills.ts, Trainerbrett, Rundenrahmen, i18n.
 */
import { useState } from "react";
import type { Markierung } from "../../analyse/werkzeug";
import { t, type Textschluessel } from "../../i18n/sprache";
import type { Drill } from "../../training/endspieldrills";
import { Antwortmeldung } from "./Rundenrahmen";
import { Trainerbrett } from "./Trainerbrett";
import type { Runde } from "./useRunde";

/** Beschriftung einer Antwortmöglichkeit je Art. */
function optionsname(drill: Drill, option: string): string {
  if (drill.art === "bild") return t(`bilder.${option}.name` as Textschluessel);
  if (drill.art === "schluesselfelder") return option;
  return t(`drill.antwort.${option}` as Textschluessel);
}

/** Der Satz nach der Antwort: die Regel des Buches, beim Erkennungsbild der Plan in Kürze. */
function regelsatz(drill: Drill): string {
  if (drill.art !== "bild") return t(`drill.${drill.art}.regel`);
  return t("drill.bild.regel", { plan: t(`bilder.${drill.richtig}.plan` as Textschluessel) });
}

export function Drillaufgabe({ drill, runde }: { drill: Drill; runde: Runde }) {
  const [gewaehlt, setzeGewaehlt] = useState<string | null>(null);
  const waehle = (option: string) => {
    if (gewaehlt !== null) return;
    setzeGewaehlt(option);
    runde.beantworte(option === drill.richtig);
  };
  const loesung: Markierung[] =
    gewaehlt === null
      ? []
      : drill.loesungsfelder.map((feld) => ({ typ: "feld", farbe: "gold", feld }));
  return (
    <>
      <p className="trainer-auftrag">{t(`drill.${drill.art}.frage`)}</p>
      <Trainerbrett fen={drill.fen} markierungen={loesung} beschriftung={t("drill.brett")} />
      <div className="knopfreihe" role="group" aria-label={t(`drill.${drill.art}.frage`)}>
        {drill.optionen.map((option) => (
          <button
            key={option}
            type="button"
            className="knopf-zweit"
            aria-pressed={gewaehlt === option}
            disabled={gewaehlt !== null}
            onClick={() => waehle(option)}
          >
            {optionsname(drill, option)}
          </button>
        ))}
      </div>
      {gewaehlt !== null && (
        <>
          <Antwortmeldung richtig={gewaehlt === drill.richtig}>
            {t("drill.richtigeAntwort", { antwort: optionsname(drill, drill.richtig) })}
          </Antwortmeldung>
          <p className="hinweis" data-testid="drill-regel">
            {regelsatz(drill)}
          </p>
        </>
      )}
    </>
  );
}
