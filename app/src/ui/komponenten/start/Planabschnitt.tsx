/**
 * Abschnitt „Wann übst du?“ der Wochenkarte (Gamifizierung P11, neu gefasst am 6.11.2026): Plan
 * zeigen und ändern; an Übungstagen der Stand „7 von 20 Minuten geschafft“ mit Knopf „Jetzt üben“.
 *
 * Rolle im Gesamtbild: Eintrag in WOCHENABSCHNITTE (Rang 30). Wunsch des Autors (Q15-2): statt
 * Kalendertermin Wochentage und Dauer, das Training zählt mit (app/uebungszeit.ts), und die Karte
 * „Heute“ erinnert beim Öffnen der App. „Jetzt üben“ öffnet die Kurzpläne, die eine Einheit fertig
 * zusammenstellen.
 * Abhängigkeiten: training/uebungsplan.ts, Planwahl.tsx, Speicher, Navigation, i18n.
 */
import { useState } from "react";
import { useNavigation } from "../../../app/navigationsKontext";
import { t, type Textschluessel } from "../../../i18n/sprache";
import type { Uebungsplan } from "../../../speicher/gamifizierung";
import { useSpeicher } from "../../../speicher/speicher";
import { planstandHeute, type Planstand } from "../../../training/uebungsplan";
import { Planwahl } from "./Planwahl";
import { Reiterwort } from "./Reiterstand";

/** „Mo, Mi, Fr, je 20 Minuten“. */
function zusammenfassung(plan: Uebungsplan): string {
  const tage = plan.tage.map((tag) => t(`woche.tag.${tag}` as Textschluessel)).join(", ");
  return t("plan.uebung.zusammenfassung", { tage, minuten: plan.minuten });
}

/** Der Stand von heute mit Balken und Knopf zu den Kurzplänen. */
function Heutestand({ stand }: { stand: Planstand }) {
  const { navigiere } = useNavigation();
  const werte = { geschafft: Math.min(stand.geschafft, stand.geplant), geplant: stand.geplant };
  return (
    <div data-testid="planstand-heute">
      <p className="wochenkarte-heute">
        {t(stand.fertig ? "plan.uebung.heuteFertig" : "plan.uebung.heute", {
          ...werte,
          geschafft: stand.geschafft,
        })}
      </p>
      <progress max={stand.geplant} value={werte.geschafft} aria-label={t("plan.uebung.titel")} />
      {!stand.fertig && (
        <button
          type="button"
          className="knopf-haupt"
          onClick={() => navigiere({ bildschirm: "trainer", kennung: "kurzplaene" })}
        >
          {t("plan.uebung.losgehen")}
        </button>
      )}
    </div>
  );
}

/** Der Abschnitt mit Plan und Stand von heute. */
export function Planabschnitt() {
  const daten = useSpeicher((z) => z.daten);
  const plan = daten.uebungsplan;
  const [waehlen, setzeWaehlen] = useState(false);
  if (waehlen) return <Planwahl plan={plan} fertig={() => setzeWaehlen(false)} />;
  if (plan === null)
    return (
      <div className="wochenkarte-abschnitt" data-testid="uebungsplan">
        <button type="button" className="knopf-zweit" onClick={() => setzeWaehlen(true)}>
          {t("plan.uebung.planen")}
        </button>
      </div>
    );
  const stand = planstandHeute(daten, new Date());
  return (
    <div className="wochenkarte-abschnitt" data-testid="uebungsplan">
      {stand && <Heutestand stand={stand} />}
      <div className="karte-kopf">
        <p>{zusammenfassung(plan)}</p>
        <button type="button" className="knopf-zweit" onClick={() => setzeWaehlen(true)}>
          {t("plan.uebung.aendern")}
        </button>
      </div>
      {plan.satz && <p className="hinweis">{plan.satz}</p>}
    </div>
  );
}

/** Stand im Reiter der Karte „Heute“: „7/20 Min“ an einem Übungstag, sonst die Dauer; ohne Plan nichts. */
export function PlanStand() {
  const daten = useSpeicher((z) => z.daten);
  const plan = daten.uebungsplan;
  if (plan === null) return null;
  const stand = planstandHeute(daten, new Date());
  if (!stand) return <Reiterwort text={t("plan.uebung.dauerWert", { minuten: plan.minuten })} />;
  return (
    <Reiterwort
      text={t("buchlook.planStand", { geschafft: stand.geschafft, geplant: stand.geplant })}
      betont={!stand.fertig}
    />
  );
}
