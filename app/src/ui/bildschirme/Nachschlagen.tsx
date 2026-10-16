/**
 * Bereich Nachschlagen: Glossar, Denkroutine, Gesamt-Checkliste (Pflichtenheft 8, Navigation).
 *
 * Rolle im Gesamtbild: Startseite des Bereichs in der Leiste unten. Die Suche im Glossar beginnt
 * direkt hier, weil Leser meist einen Begriff aus dem Buch nachschlagen wollen.
 * Abhängigkeiten: daten/laden.ts, Navigation, i18n, lucide-react.
 */
import { BookA, ListChecks, Route } from "lucide-react";
import { useNavigation } from "../../app/navigationsKontext";
import { ladeGlossar } from "../../daten/laden";
import { t } from "../../i18n/sprache";
import { useDaten } from "../komponenten/useDaten";

const SYMBOLGROESSE = 24;

/** Eine große Schaltfläche mit Symbol, Titel und Zusatz. */
function Eintrag({
  symbol,
  titel,
  zusatz,
  beiKlick,
}: {
  symbol: React.ReactNode;
  titel: string;
  zusatz: string;
  beiKlick: () => void;
}) {
  return (
    <button type="button" className="nachschlage-eintrag" onClick={beiKlick}>
      <span className="nachschlage-symbol" aria-hidden="true">
        {symbol}
      </span>
      <span className="kapitel-text">
        <span className="kapitel-titel">{titel}</span>
        <span className="kapitel-zusatz">{zusatz}</span>
      </span>
    </button>
  );
}

export function Nachschlagen() {
  const { navigiere } = useNavigation();
  const glossar = useDaten(ladeGlossar, "glossar");
  const anzahl = glossar.art === "fertig" ? glossar.wert.eintraege.length : 0;
  return (
    <div className="bildschirm">
      <header className="seitenkopf">
        <h1>{t("nachschlagen.titel")}</h1>
      </header>
      <Eintrag
        symbol={<BookA size={SYMBOLGROESSE} />}
        titel={t("glossar.titel")}
        zusatz={t("glossar.anzahl", { anzahl })}
        beiKlick={() => navigiere({ bildschirm: "glossar" })}
      />
      <Eintrag
        symbol={<Route size={SYMBOLGROESSE} />}
        titel={t("denkroutine.titel")}
        zusatz={t("denkroutine.zusatz")}
        beiKlick={() => navigiere({ bildschirm: "denkroutine" })}
      />
      <Eintrag
        symbol={<ListChecks size={SYMBOLGROESSE} />}
        titel={t("checkliste.titel")}
        zusatz={t("checkliste.zusatz")}
        beiKlick={() => navigiere({ bildschirm: "checkliste" })}
      />
    </div>
  );
}
