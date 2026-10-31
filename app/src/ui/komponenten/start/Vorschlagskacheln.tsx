/**
 * Die Vorschläge der Karte „Heute“ als Kacheln (Gestaltung A2, 31.10.2026): eine große Kachel mit
 * dem ersten Vorschlag, darunter bis zu zwei kleine mit den Alternativen, dazu dezent „Nicht jetzt“ als kleines Kreuz
 * am Ende der Zeile (Name für Vorlesehilfen „Nicht jetzt“).
 *
 * Rolle im Gesamtbild: Ersetzt die Textkarte „Dein nächster Schritt“ (Gamifizierung P1). Die
 * Vorschläge selbst rechnet training/naechsterSchritt.ts aus der Liste VORSCHLAGSARTEN; Symbol und
 * Kurztext kommen aus vorschlagskacheln.ts. Jede Kachel ist ein einziger Knopf; sein Name für
 * Vorlesehilfen ist der ganze Satz des Vorschlags, damit nichts verloren geht.
 * Abhängigkeiten: training/naechsterSchritt.ts, naechsterLage.ts, vorschlagskacheln.ts, Navigation.
 */
import { Play, X } from "lucide-react";
import { useNavigation } from "../../../app/navigationsKontext";
import { t } from "../../../i18n/sprache";
import type { Vorschlag } from "../../../training/naechsterSchritt";
import { vorschlagstext } from "./naechsterLage";
import { kachelart, kacheltexte } from "./vorschlagskacheln";

/** Größe der Symbole in Bildpunkten: groß in der Hauptkachel, klein in den Alternativen. */
const SYMBOL_GROSS = 24;
const SYMBOL_KLEIN = 20;

/** Eine Kachel; `gross` ist die Hauptkachel mit Pfeil. */
function Kachel({ vorschlag, gross }: { vorschlag: Vorschlag; gross: boolean }) {
  const { navigiere } = useNavigation();
  const { Symbol } = kachelart(vorschlag);
  const { titel, kurz } = kacheltexte(vorschlag);
  return (
    <button
      type="button"
      className={gross ? "heute-kachel gross" : "heute-kachel"}
      aria-label={`${titel}: ${vorschlagstext(vorschlag)}`}
      data-testid={gross ? "heute-vorschlag" : `heute-alternative-${vorschlag.art}`}
      data-art={vorschlag.art}
      onClick={() => navigiere(vorschlag.ziel)}
    >
      <span className="heute-kachel-symbol" aria-hidden="true">
        <Symbol size={gross ? SYMBOL_GROSS : SYMBOL_KLEIN} />
      </span>
      <span className="heute-kachel-text" aria-hidden="true">
        <strong>{titel}</strong>
        <span>{kurz}</span>
      </span>
      {gross && <Play className="heute-kachel-pfeil" size={SYMBOL_GROSS} aria-hidden="true" />}
    </button>
  );
}

/** Hauptkachel, Alternativen und „Nicht jetzt“; ohne Vorschlag nichts. */
export function Vorschlagskacheln({
  liste,
  nichtJetzt,
}: {
  liste: readonly Vorschlag[];
  nichtJetzt: () => void;
}) {
  const [erster, ...weitere] = liste;
  if (!erster) return null;
  return (
    <div className="heute-vorschlaege" data-testid="heute-vorschlaege">
      <Kachel vorschlag={erster} gross />
      <div className="heute-alternativen">
        {weitere.map((v) => (
          <Kachel key={v.art} vorschlag={v} gross={false} />
        ))}
        <button
          type="button"
          className="knopf-symbol heute-nicht-jetzt"
          aria-label={t("naechster.nichtJetzt")}
          title={t("naechster.nichtJetzt")}
          onClick={nichtJetzt}
        >
          <X size={SYMBOL_KLEIN} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
