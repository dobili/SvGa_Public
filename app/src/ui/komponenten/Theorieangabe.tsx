/**
 * Theoriezug im Rückblick: Satz „… ist ein Theoriezug: Teil einer Eröffnung“ mit dem Wort als
 * Aufklapper und die Liste der zutreffenden Eröffnungen und Gambits.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (25.10.2026). Die Karte unter dem Brett
 * (Rueckblickkarte.tsx) zeigt den Satz an Stelle des Urteils; das Wort „Eröffnung“ bzw. „Gambits“
 * ist ein Knopf (aria-expanded), der die Liste darunter auf- und zuklappt. Die Namen rechnet
 * schach/theorienamen.ts (höchstens fünf, darüber „und N weitere“), die Auskunft zum Zug
 * useTheorie.ts (useTheorieauskunft).
 * Abhängigkeiten: schach/theorienamen.ts, i18n.
 */
import { ChevronDown } from "lucide-react";
import { t } from "../../i18n/sprache";
import type { Theorieauskunft } from "../../schach/theorienamen";

/** Platzhalter für den Knopf im Satz der Sprachdatei. */
const KNOPF = "{knopf}";
/** Pfeil wie bei den anderen Aufklappern (Aufklapper.tsx), etwas kleiner im Fließtext. */
const PFEILGROESSE = 16;

/**
 * Der Satz mit dem Aufklapper; der Knopf steht an der Stelle von {knopf} in der Sprachdatei,
 * damit Artikel und Wortstellung je Sprache stimmen („Teil eines Gambits“, „part of a gambit“).
 */
export function Theoriesatz({
  zug,
  auskunft,
  offen,
  beiUmschalten,
  listenId,
}: {
  zug: string;
  auskunft: Theorieauskunft;
  offen: boolean;
  beiUmschalten: () => void;
  listenId: string;
}) {
  const satz = t(auskunft.gambit ? "rueckblick.theorieGambit" : "rueckblick.theorieEroeffnung", {
    zug,
  });
  const [vorher = "", nachher = ""] = satz.split(KNOPF);
  return (
    <>
      {vorher}
      <button
        type="button"
        className="theorie-knopf"
        aria-expanded={offen}
        aria-controls={listenId}
        onClick={beiUmschalten}
      >
        {t(auskunft.gambit ? "rueckblick.theorieWortGambit" : "rueckblick.theorieWortEroeffnung")}
        <ChevronDown
          size={PFEILGROESSE}
          aria-hidden="true"
          className={offen ? "aufklapper-pfeil offen" : "aufklapper-pfeil"}
        />
      </button>
      {nachher}
    </>
  );
}

/** Die Liste der zutreffenden Namen; zugeklappt verborgen (der Knopf zeigt auf sie). */
export function Theorieliste({
  auskunft,
  offen,
  id,
}: {
  auskunft: Theorieauskunft;
  offen: boolean;
  id: string;
}) {
  return (
    <ul
      id={id}
      className="theorie-liste"
      data-testid="theorie-liste"
      aria-label={t("rueckblick.theorieListe")}
      hidden={!offen}
    >
      {auskunft.namen.map((n) => (
        <li key={`${n.herkunft} ${n.name}`}>
          {n.name}
          {n.herkunft === "buch" && (
            <span className="theorie-imbuch"> · {t("rueckblick.theorieImBuch")}</span>
          )}
        </li>
      ))}
      {auskunft.weitere > 0 && (
        <li className="theorie-weitere">
          {t("rueckblick.theorieWeitere", { anzahl: auskunft.weitere })}
        </li>
      )}
    </ul>
  );
}
