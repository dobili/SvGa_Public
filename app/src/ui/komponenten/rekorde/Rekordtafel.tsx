/**
 * Profilkarte „Deine Rekorde“ (Gamifizierung P5): je Rekordart Wert, Datum und „Versuchen“.
 *
 * Rolle im Gesamtbild: Eintrag in PROFILKARTEN (ui/komponenten/profilkarten/profilkarten.ts,
 * Rang 20). Beim Öffnen prüft die Karte alle Werte aus den Nutzerdaten (Anlass „alle“), still und
 * ohne Meldung: So kommen Rekorde dazu, die erst nach dem Partieende feststehen (Wertung und
 * Zugklassen nach der Auswertung) oder vor der Rekordtafel entstanden sind. Die Reihenfolge und
 * die Knöpfe kommen aus REKORDARTEN; eine neue Art erscheint hier von selbst.
 * Abhängigkeiten: training/rekordarten.ts, training/rekorde.ts, rekordtexte.ts,
 * Navigation, Speicher, i18n, Stil in ui/stil/rekorde.css.
 */
import { useEffect } from "react";
import { useNavigation } from "../../../app/navigationsKontext";
import type { Ansicht, Bereich } from "../../../app/stapel";
import { datumText, t } from "../../../i18n/sprache";
import { aendere, useSpeicher } from "../../../speicher/speicher";
import { REKORDARTEN } from "../../../training/rekordarten";
import { ALLE_QUELLEN, pruefeRekorde, type Rekordart } from "../../../training/rekorde";
import "../../stil/rekorde.css";
import { rekordname, rekordtext } from "./rekordtexte";

/** Ansichten, die zugleich ein Hauptbereich sind: „Versuchen“ wechselt dorthin. */
const BEREICHE: readonly string[] = ["buch", "training", "spielen", "nachschlagen"];

/** Eine Zeile der Tafel. */
function Zeile({ art, oeffne }: { art: Rekordart; oeffne: (ziel: Ansicht) => void }) {
  const rekord = useSpeicher((z) => z.daten.rekorde[art.kennung]);
  const ziel = art.versuchen;
  return (
    <li className="rekordzeile" data-testid={`rekord-${art.kennung}`}>
      <span className="rekordname">{rekordname(art.kennung)}</span>
      <span className="rekordwert">
        {rekord ? rekordtext(art.kennung, rekord.wert) : t("rekorde.keiner")}
      </span>
      {rekord && (
        <span className="hinweis rekorddatum">
          {t("rekorde.datum", { datum: datumText(new Date(rekord.datum)) })}
        </span>
      )}
      {ziel && (
        <button type="button" className="knopf-link" onClick={() => oeffne(ziel)}>
          {t("rekorde.versuchen")}
        </button>
      )}
    </li>
  );
}

/** Die Karte im Profil. */
export function Rekordtafel() {
  const { navigiere, wechsleBereich } = useNavigation();
  useEffect(() => {
    void aendere((d) => pruefeRekorde(d, { quelle: ALLE_QUELLEN }, new Date(), REKORDARTEN).daten);
  }, []);
  const oeffne = (ziel: Ansicht) => {
    if (BEREICHE.includes(ziel.bildschirm)) wechsleBereich(ziel.bildschirm as Bereich);
    else navigiere(ziel);
  };
  return (
    <section className="karte" data-testid="rekordtafel">
      <h2 className="karte-titel">{t("rekorde.titel")}</h2>
      <p className="hinweis">{t("rekorde.einleitung")}</p>
      <ul className="rekordliste">
        {REKORDARTEN.map((art) => (
          <Zeile key={art.kennung} art={art} oeffne={oeffne} />
        ))}
      </ul>
    </section>
  );
}
