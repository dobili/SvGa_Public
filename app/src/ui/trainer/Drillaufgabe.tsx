/**
 * Eine Kurzübung des Endspieltrainers: Stellung, Frage, Antwortknöpfe, danach die Regel des
 * Buches und die Lösung am Brett (Quadrat wie im Buch, Schlüsselfelder, der richtige Zug).
 *
 * Rolle im Gesamtbild: Teil des Endspieltrainers (EndspielBereich.tsx), seit 0.2.90; seit P4
 * (R47) mit den Zug-Übungen und dem Plan zum Erkennungsbild. Die Aufgaben erzeugen
 * training/endspieldrills.ts und endspielzugdrills.ts; die Antwort rechnen die Bausteine der
 * Werkzeuge aus Kapitel 8 und 9. Pflichtenheft 7: Kurzdrills zu Quadrat, Opposition,
 * Schlüsselfeldern und das Quiz „Welches Erkennungsbild?“.
 * Abhängigkeiten: training/endspieldrills.ts, Trainerbrett, Rundenrahmen, i18n.
 */
import { useState } from "react";
import { sprache, t, type Textschluessel } from "../../i18n/sprache";
import { sanInSprache } from "../../schach/notation";
import type { Drill } from "../../training/endspieldrills";
import { Antwortmeldung } from "./Rundenrahmen";
import { Trainerbrett } from "./Trainerbrett";
import type { Runde } from "./useRunde";

/** Arten, deren Antworten Züge sind (Kurznotation, in der Sprache der App). */
const ZUGARTEN: ReadonlySet<Drill["art"]> = new Set(["quadratzug", "oppositionszug"]);
/** Arten mit langen Antworten, die untereinander stehen. */
const LANGE_ANTWORTEN: ReadonlySet<Drill["art"]> = new Set(["bildplan"]);

/** Beschriftung einer Antwortmöglichkeit je Art. */
function optionsname(drill: Drill, option: string): string {
  if (drill.art === "bild") return t(`bilder.${option}.name` as Textschluessel);
  if (drill.art === "bildplan") return t(`bilder.${option}.plan` as Textschluessel);
  if (drill.art === "schluesselfelder") return option;
  if (ZUGARTEN.has(drill.art)) return sanInSprache(option, sprache());
  return t(`drill.antwort.${option}` as Textschluessel);
}

/** Die Frage; bei der Opposition als Zug mit der Seite am Zug. */
function fragetext(drill: Drill): string {
  const amZug = drill.fen.split(" ")[1] === "b" ? t("farbe.b") : t("farbe.w");
  return t(`drill.${drill.art}.frage`, { farbe: amZug });
}

/** Der Satz nach der Antwort: die Regel des Buches, beim Erkennungsbild Plan oder Name. */
function regelsatz(drill: Drill): string {
  if (drill.art === "bild")
    return t("drill.bild.regel", { plan: t(`bilder.${drill.richtig}.plan` as Textschluessel) });
  if (drill.art === "bildplan")
    return t("drill.bildplan.regel", { name: t(`bilder.${drill.richtig}.name` as Textschluessel) });
  return t(`drill.${drill.art}.regel`);
}

export function Drillaufgabe({ drill, runde }: { drill: Drill; runde: Runde }) {
  const [gewaehlt, setzeGewaehlt] = useState<string | null>(null);
  const waehle = (option: string) => {
    if (gewaehlt !== null) return;
    setzeGewaehlt(option);
    runde.beantworte(option === drill.richtig);
  };
  const lang = LANGE_ANTWORTEN.has(drill.art);
  return (
    <>
      <p className="trainer-auftrag">{fragetext(drill)}</p>
      <Trainerbrett
        fen={drill.fen}
        markierungen={gewaehlt === null ? [] : [...drill.loesung]}
        gedreht={drill.fen.split(" ")[1] === "b" && ZUGARTEN.has(drill.art)}
        beschriftung={t("drill.brett")}
      />
      <div className={lang ? "antworten" : "knopfreihe"} role="group" aria-label={fragetext(drill)}>
        {drill.optionen.map((option) => (
          <button
            key={option}
            type="button"
            className={lang ? "antwort" : "knopf-zweit"}
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
