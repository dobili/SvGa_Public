/**
 * Bereich Nachschlagen: Glossar, Denkroutine, Gesamt-Checkliste (Pflichtenheft 8, Navigation),
 * dazu die Steckbriefe (Eröffnungen und Fallenchecks) und die Werkzeuge des Buches.
 *
 * Rolle im Gesamtbild: Startseite des Bereichs in der Leiste unten. Die Suche im Glossar beginnt
 * direkt hier, weil Leser meist einen Begriff aus dem Buch nachschlagen wollen.
 * Abhängigkeiten: daten/laden.ts, Navigation, i18n, lucide-react.
 */
import { BookA, IdCard, ListChecks, Route, Wrench } from "lucide-react";
import { useNavigation } from "../../app/navigationsKontext";
import { ladeGlossar } from "../../daten/laden";
import { t } from "../../i18n/sprache";
import { useDaten } from "../komponenten/bausteine/useDaten";
import { TourKnopf } from "../../tour/TourKnopf";

const SYMBOLGROESSE = 24;

/** Eine große Schaltfläche mit Symbol, Titel und Zusatz. */
function Eintrag({
  symbol,
  titel,
  zusatz,
  beiKlick,
  tour,
}: {
  symbol: React.ReactNode;
  titel: string;
  zusatz: string;
  beiKlick: () => void;
  /** Ziel-Kennung für die Tour (tour/touren.ts). */
  tour: string;
}) {
  return (
    <button type="button" className="nachschlage-eintrag" onClick={beiKlick} data-tour={tour}>
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

/**
 * Die Startseite des Bereichs „Nachschlagen“: Suche im Glossar und Wege zu Denkroutine, Checkliste,
 * Steckbriefen und Werkzeugen.
 */
export function Nachschlagen() {
  const { navigiere } = useNavigation();
  const glossar = useDaten(ladeGlossar, "glossar");
  const anzahl = glossar.art === "fertig" ? glossar.wert.eintraege.length : 0;
  return (
    <div className="bildschirm">
      <header className="seitenkopf">
        <h1>{t("nachschlagen.titel")}</h1>
        <TourKnopf />
      </header>
      <Eintrag
        symbol={<BookA size={SYMBOLGROESSE} />}
        titel={t("glossar.titel")}
        zusatz={t("glossar.anzahl", { anzahl })}
        beiKlick={() => navigiere({ bildschirm: "glossar" })}
        tour="nachschlagen-glossar"
      />
      <Eintrag
        symbol={<Route size={SYMBOLGROESSE} />}
        titel={t("denkroutine.titel")}
        zusatz={t("denkroutine.zusatz")}
        beiKlick={() => navigiere({ bildschirm: "denkroutine" })}
        tour="nachschlagen-denkroutine"
      />
      <Eintrag
        symbol={<ListChecks size={SYMBOLGROESSE} />}
        titel={t("checkliste.titel")}
        zusatz={t("checkliste.zusatz")}
        beiKlick={() => navigiere({ bildschirm: "checkliste" })}
        tour="nachschlagen-checkliste"
      />
      <Eintrag
        symbol={<IdCard size={SYMBOLGROESSE} />}
        titel={t("steckbrief.titel")}
        zusatz={t("steckbrief.zusatz")}
        beiKlick={() => navigiere({ bildschirm: "steckbriefe" })}
        tour="nachschlagen-steckbriefe"
      />
      <Eintrag
        symbol={<Wrench size={SYMBOLGROESSE} />}
        titel={t("werkzeuge.titel")}
        zusatz={t("werkzeuge.zusatz")}
        beiKlick={() => navigiere({ bildschirm: "werkzeuge" })}
        tour="nachschlagen-werkzeuge"
      />
    </div>
  );
}
