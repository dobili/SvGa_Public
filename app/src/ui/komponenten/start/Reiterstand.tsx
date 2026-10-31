/**
 * Kurzer Stand eines Wochenabschnitts im Reiter der Karte „Heute“ (Gestaltung A2, 31.10.2026):
 * „1/3“ mit dünnem goldenem Strich darunter.
 *
 * Rolle im Gesamtbild: Jeder Eintrag in WOCHENABSCHNITTE kann seinen Stand so zeigen (Aufträge,
 * Ziele, später Abschnitte neuer Trainer). Der Strich ist nur Schmuck; Vorlesehilfen hören die Zahl.
 * Abhängigkeiten: i18n.
 */
import { t } from "../../../i18n/sprache";

const PROZENT = 100;

/** „erreicht/gesamt“ mit Strich; ohne Gesamtzahl nichts. Beispiel: 1, 3 → „1/3“, Drittel gold. */
export function Reiterstand({ erreicht, gesamt }: { erreicht: number; gesamt: number }) {
  if (gesamt <= 0) return null;
  const anteil = Math.min(1, erreicht / gesamt);
  return (
    <span className="reiterstand">
      <span>{t("buchlook.stand", { erreicht, gesamt })}</span>
      <span className="reiterstand-strich" aria-hidden="true">
        <span style={{ width: `${anteil * PROZENT}%` }} />
      </span>
    </span>
  );
}

/** Ein kurzes Wort statt einer Zahl, etwa „heute“ beim Übungsplan. */
export function Reiterwort({ text, betont }: { text: string; betont?: boolean }) {
  return <span className={betont ? "reiterstand betont" : "reiterstand"}>{text}</span>;
}
