/**
 * Abschnitt „Wann übst du?“ der Wochenkarte (Gamifizierung P11): Plan zeigen, ändern und als
 * Kalenderdatei weitergeben; an geplanten Tagen „Heute ist dein Übungstag.“
 *
 * Rolle im Gesamtbild: Eintrag in WOCHENABSCHNITTE (Rang 30). Ohne Server kann die App nicht
 * erinnern; der Leser trägt den Plan in seinen eigenen Kalender ein (training/uebungsplan.ts).
 * Weitergabe wie bei der Datensicherung: Herunterladen (iPhone: „Zum Kalender hinzufügen“) und,
 * wo das Gerät es kann, das Teilen-Menü. Nichts geht an einen Server.
 * Abhängigkeiten: training/uebungsplan.ts, bausteine/dateiAnbieten.ts, Planwahl.tsx, Speicher.
 */
import { useState } from "react";
import { t, type Textschluessel } from "../../../i18n/sprache";
import type { Uebungsplan } from "../../../speicher/gamifizierung";
import { useSpeicher } from "../../../speicher/speicher";
import { heuteGeplant, ICS_DATEI, ICS_TYP, kalenderdatei } from "../../../training/uebungsplan";
import { bieteDateiAn, kannDateiTeilen, teileDatei } from "../bausteine/dateiAnbieten";
import { Planwahl } from "./Planwahl";

/** Die Kalenderdatei zum Plan in der Sprache der Oberfläche. */
function datei(plan: Uebungsplan): string {
  return kalenderdatei(
    plan,
    {
      titel: t("plan.uebung.termin.titel"),
      beschreibung: t("plan.uebung.termin.beschreibung"),
      erinnerung: t("plan.uebung.termin.erinnerung"),
    },
    new Date(),
  );
}

/** Meldung zu einem Fehler beim Anbieten oder Teilen. */
function fehlermeldung(fehler: unknown): { text: string; fehler: boolean } {
  const grund = fehler instanceof Error ? fehler.message : String(fehler);
  return { text: t("plan.uebung.fehler", { fehler: grund }), fehler: true };
}

/** „Mo, Mi, Fr um 18:00“. */
function zusammenfassung(plan: Uebungsplan): string {
  const tage = plan.tage.map((tag) => t(`woche.tag.${tag}` as Textschluessel)).join(", ");
  return t("plan.uebung.zusammenfassung", { tage, uhrzeit: plan.uhrzeit });
}

/** Knöpfe zur Weitergabe der Kalenderdatei mit Meldung darunter. */
function Kalenderknoepfe({ plan }: { plan: Uebungsplan }) {
  const [meldung, setzeMeldung] = useState<{ text: string; fehler: boolean } | null>(null);
  const anbieten = () => {
    try {
      bieteDateiAn(datei(plan), ICS_DATEI, ICS_TYP);
      setzeMeldung({ text: t("plan.uebung.angeboten", { datei: ICS_DATEI }), fehler: false });
    } catch (fehler) {
      console.error("Kalenderdatei nicht angeboten:", fehler);
      setzeMeldung(fehlermeldung(fehler));
    }
  };
  const teilen = async () => {
    try {
      if (await teileDatei(datei(plan), ICS_DATEI, ICS_TYP))
        setzeMeldung({ text: t("plan.uebung.geteilt"), fehler: false });
    } catch (fehler) {
      console.error("Kalenderdatei nicht geteilt:", fehler);
      setzeMeldung(fehlermeldung(fehler));
    }
  };
  return (
    <>
      <div className="knopfzeile">
        <button type="button" className="knopf-zweit" onClick={anbieten}>
          {t("plan.uebung.kalender")}
        </button>
        {kannDateiTeilen() && (
          <button type="button" className="knopf-zweit" onClick={() => void teilen()}>
            {t("plan.uebung.teilen")}
          </button>
        )}
      </div>
      {meldung && (
        <p className={meldung.fehler ? "fehlertext" : "hinweis"} role="status">
          {meldung.text}
        </p>
      )}
    </>
  );
}

/** Der Abschnitt mit Plan, Hinweis für heute und Kalender. */
export function Planabschnitt() {
  const plan = useSpeicher((z) => z.daten.uebungsplan);
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
  return (
    <div className="wochenkarte-abschnitt" data-testid="uebungsplan">
      {heuteGeplant(plan, new Date()) && (
        <p className="wochenkarte-heute">{t("plan.uebung.heute")}</p>
      )}
      <div className="karte-kopf">
        <p>{zusammenfassung(plan)}</p>
        <button type="button" className="knopf-zweit" onClick={() => setzeWaehlen(true)}>
          {t("plan.uebung.aendern")}
        </button>
      </div>
      {plan.satz && <p className="hinweis">{plan.satz}</p>}
      <Kalenderknoepfe plan={plan} />
    </div>
  );
}
