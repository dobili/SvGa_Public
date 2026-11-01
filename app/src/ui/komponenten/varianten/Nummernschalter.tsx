/**
 * Schalter für Marken ohne Nummer in der Legende: je Farbe „Nummern“ an oder aus, je Marke „ohne
 * Nummer“ oder „Nummer geben“.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (1.11.2026): Ein Bereich aus mehreren Feldern oder
 * mehrere gleichartige Pfeile (etwa alle möglichen Schläge in Gold) brauchen nicht je eine Nummer;
 * die Markierung bleibt, nur die Zahl fällt weg (Format 9, training/variationsmarken.ts). Beide
 * Schalter stehen nur im Stift-Modus in der aufgeklappten Legende (Legende.tsx).
 * Abhängigkeiten: training/variationsmarken.ts, useMarkierstift.ts, useVariante.ts, i18n, lucide.
 */
import { Hash } from "lucide-react";
import type { Markierungsfarbe } from "../../../analyse/werkzeug";
import { t } from "../../../i18n/sprache";
import { hatNummer, mitNummerAus, type Nummerierte } from "../../../training/variationsmarken";
import { knotendatenAm, variationMitDaten } from "./useMarkierstift";
import type { Variantenstand } from "./useVariante";

const SYMBOL = 14;

/** Haken „Nummern“ je Farbe; aus heißt: keine Marke dieser Farbe trägt eine Nummer. */
export function Farbnummern({
  stand,
  farbe,
  name,
}: {
  stand: Variantenstand;
  farbe: Markierungsfarbe;
  name: string;
}) {
  const v = stand.variation;
  const aus = v.nummernAus?.includes(farbe) === true;
  const schalte = (an: boolean) => {
    const liste = (v.nummernAus ?? []).filter((f) => f !== farbe);
    const nummernAus = an ? liste : [...liste, farbe];
    stand.aendereVariation({ ...v, nummernAus }, "sofort");
  };
  return (
    <label className="schalterzeile legendenschalter">
      <input
        type="checkbox"
        checked={!aus}
        aria-label={t("varianten.legende.nummernFarbe", { farbe: name })}
        onChange={(e) => schalte(e.target.checked)}
      />
      <Hash size={SYMBOL} aria-hidden="true" />
      <span>{t("varianten.legende.nummern")}</span>
    </label>
  );
}

/** Knopf je Marke: „ohne Nummer“ oder „Nummer geben“. */
export function Markennummer({ stand, marke }: { stand: Variantenstand; marke: Nummerierte }) {
  const v = stand.variation;
  const mit = hatNummer(marke);
  const schalte = () => {
    const daten = mitNummerAus(knotendatenAm(v, stand.pfad), marke.text, mit, v.nummernAus);
    stand.aendereVariation(variationMitDaten(v, stand.pfad, daten), "sofort");
  };
  return (
    <button
      type="button"
      className="knopf-link klein"
      data-testid="markennummer-schalter"
      onClick={schalte}
    >
      {t(mit ? "varianten.legende.ohneNummer" : "varianten.legende.mitNummer")}
    </button>
  );
}
