/**
 * Karte „Dein nächster Schritt“ oben im Buch (Gamifizierung P1, Liste STARTKARTEN, Rang 10).
 *
 * Rolle im Gesamtbild: Stellt die Lage zusammen (Speicher, Datenverzeichnis, Übungen der fast
 * gelesenen Kapitel, Merker „zuletzt“ und „tagesserie“) und zeigt den ersten Vorschlag aus
 * training/naechsterSchritt.ts mit Knopf. „Lieber etwas anderes?“ klappt zwei Alternativen auf,
 * „Nicht jetzt“ blendet die Karte bis morgen aus.
 * Abhängigkeiten: training/naechsterSchritt.ts, naechsterLage.ts (Lage und Satz), Navigation, Merker.
 */
import { useState } from "react";
import { useNavigation } from "../../../app/navigationsKontext";
import { t } from "../../../i18n/sprache";
import { vorschlaege, type Vorschlag } from "../../../training/naechsterSchritt";
import { useLage, vorschlagstext } from "./naechsterLage";
import { blendeNaechsterSchrittAus } from "./naechsterSchrittMerker";

/** Die Alternativen hinter „Lieber etwas anderes?“. */
function Alternativen({ liste }: { liste: readonly Vorschlag[] }) {
  const { navigiere } = useNavigation();
  if (liste.length === 0) return null;
  return (
    <details className="naechster-andere" data-testid="naechster-andere">
      <summary>{t("naechster.andere")}</summary>
      <ul className="naechster-liste">
        {liste.map((v) => (
          <li key={v.art}>
            <p>{vorschlagstext(v)}</p>
            <button type="button" className="knopf-zweit" onClick={() => navigiere(v.ziel)}>
              {t(v.knopf)}
            </button>
          </li>
        ))}
      </ul>
    </details>
  );
}

/** Die Karte; ohne Vorschlag oder nach „Nicht jetzt“ nichts. */
export function NaechsterSchritt() {
  const { navigiere } = useNavigation();
  const lage = useLage();
  const [aus, setzeAus] = useState(false);
  const [erster, ...weitere] = lage ? vorschlaege(lage) : [];
  if (aus || !erster) return null;
  const nichtJetzt = () => {
    blendeNaechsterSchrittAus(new Date());
    setzeAus(true);
  };
  return (
    <section className="karte naechster-schritt" data-testid="naechster-schritt">
      <h2 className="karte-titel">{t("naechster.titel")}</h2>
      <p data-testid="naechster-text">{vorschlagstext(erster)}</p>
      <button type="button" className="knopf-haupt" onClick={() => navigiere(erster.ziel)}>
        {t(erster.knopf)}
      </button>
      <Alternativen liste={weitere} />
      <button type="button" className="knopf-link" onClick={nichtJetzt}>
        {t("naechster.nichtJetzt")}
      </button>
    </section>
  );
}
