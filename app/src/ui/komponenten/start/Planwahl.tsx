/**
 * Wahl des Übungsplans (Gamifizierung P11): Wochentage, Uhrzeit und ein freiwilliger Satz
 * „Wo oder nach was?“ (Wenn-dann-Plan).
 *
 * Rolle im Gesamtbild: Teil des Abschnitts „Wann übst du?“ der Wochenkarte (Planabschnitt.tsx).
 * Gespeichert wird im Feld `uebungsplan` (training/uebungsplan.ts, mitUebungsplan).
 * Abhängigkeiten: training/uebungsplan.ts, Speicher, i18n.
 */
import { useId, useState } from "react";
import { t, type Textschluessel } from "../../../i18n/sprache";
import type { Uebungsplan } from "../../../speicher/gamifizierung";
import { aendere } from "../../../speicher/speicher";
import { istPlan, mitUebungsplan, VORGABE_UHRZEIT } from "../../../training/uebungsplan";

const WOCHENTAGE = [0, 1, 2, 3, 4, 5, 6] as const;
/** Höchstlänge des Satzes (eine Zeile auf dem Handy, passt in die Kalenderbeschreibung). */
const SATZ_ZEICHEN = 80;

interface Eigenschaften {
  readonly plan: Uebungsplan | null;
  readonly fertig: () => void;
}

/** Speichert den Plan (null: entfernen) und meldet fertig. */
function speichere(plan: Uebungsplan | null, fertig: () => void): void {
  void aendere((d) => mitUebungsplan(d, plan)).then(fertig);
}

/** Die sieben Tagesknöpfe zum An- und Abwählen. */
function Tagwahl({ tage, schalte }: { tage: readonly number[]; schalte: (tag: number) => void }) {
  return (
    <div className="knopfzeile planwahl-tage" role="group" aria-label={t("plan.uebung.tage")}>
      {WOCHENTAGE.map((tag) => (
        <button
          key={tag}
          type="button"
          className="knopf-zweit"
          aria-pressed={tage.includes(tag)}
          aria-label={t(`woche.tagLang.${tag}` as Textschluessel)}
          onClick={() => schalte(tag)}
        >
          {t(`woche.tag.${tag}` as Textschluessel)}
        </button>
      ))}
    </div>
  );
}

/** Uhrzeit und Satz „Wo oder nach was?“. */
function Zeitfelder(e: {
  uhrzeit: string;
  satz: string;
  setzeUhrzeit: (uhrzeit: string) => void;
  setzeSatz: (satz: string) => void;
}) {
  const kennung = useId();
  return (
    <>
      <label htmlFor={`${kennung}-uhrzeit`}>{t("plan.uebung.uhrzeit")}</label>
      <input
        id={`${kennung}-uhrzeit`}
        type="time"
        value={e.uhrzeit}
        onChange={(ereignis) => e.setzeUhrzeit(ereignis.target.value)}
      />
      <label htmlFor={`${kennung}-satz`}>{t("plan.uebung.satz")}</label>
      <input
        id={`${kennung}-satz`}
        type="text"
        maxLength={SATZ_ZEICHEN}
        placeholder={t("plan.uebung.satzBeispiel")}
        value={e.satz}
        onChange={(ereignis) => e.setzeSatz(ereignis.target.value)}
      />
    </>
  );
}

/** Das Formular des Plans. */
export function Planwahl({ plan, fertig }: Eigenschaften) {
  const [tage, setzeTage] = useState<readonly number[]>(plan?.tage ?? []);
  const [uhrzeit, setzeUhrzeit] = useState(plan?.uhrzeit ?? VORGABE_UHRZEIT);
  const [satz, setzeSatz] = useState(plan?.satz ?? "");
  const neu = { tage, uhrzeit, satz };
  const schalte = (tag: number) =>
    setzeTage((alt) => (alt.includes(tag) ? alt.filter((x) => x !== tag) : [...alt, tag]));
  return (
    <div className="wochenkarte-abschnitt planwahl" data-testid="planwahl">
      <p className="karte-titel">{t("plan.uebung.titel")}</p>
      <Tagwahl tage={tage} schalte={schalte} />
      <Zeitfelder {...{ uhrzeit, satz, setzeUhrzeit, setzeSatz }} />
      <p className="hinweis">{t("plan.uebung.hinweis")}</p>
      <div className="knopfzeile">
        <button
          type="button"
          className="knopf-haupt"
          disabled={!istPlan(neu)}
          onClick={() => speichere(neu, fertig)}
        >
          {t("plan.uebung.speichern")}
        </button>
        <button type="button" className="knopf-zweit" onClick={fertig}>
          {t("plan.uebung.abbrechen")}
        </button>
        {plan && (
          <button type="button" className="knopf-zweit" onClick={() => speichere(null, fertig)}>
            {t("plan.uebung.entfernen")}
          </button>
        )}
      </div>
    </div>
  );
}
