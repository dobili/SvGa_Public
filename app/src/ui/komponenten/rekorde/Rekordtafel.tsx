/**
 * Profilkarte „Deine Rekorde“ (Gamifizierung P5, seit dem Profil neu am 31.10.2026 nach Entwurf R1
 * „Erreichtes und Herausforderung“): groß die aufgestellten Rekorde mit Wert, Datum und „Teilen“;
 * darunter „Stell deinen ersten Rekord auf“ (oder „Noch mehr Rekorde“) mit zwei Vorschlägen und
 * Knopf „Los“, die übrigen zum Aufklappen.
 *
 * Rolle im Gesamtbild: Eintrag in PROFILKARTEN (ui/komponenten/profilkarten/profilkarten.ts,
 * Rang 20). Beim Öffnen prüft die Karte alle Werte aus den Nutzerdaten (Anlass „alle“), still und
 * ohne Meldung: So kommen Rekorde dazu, die erst nach dem Partieende feststehen (Wertung und
 * Zugklassen nach der Auswertung) oder vor der Rekordtafel entstanden sind. Die Einteilung steht in
 * rekordvorschlaege.ts; Quelle bleibt REKORDARTEN, eine neue Art erscheint hier von selbst.
 * Abhängigkeiten: training/rekordarten.ts, training/rekorde.ts, rekordtexte.ts,
 * rekordvorschlaege.ts, Rekordvorschlag.tsx, teilen/Teilenknopf.tsx, Navigation, Speicher, i18n,
 * Stil in ui/stil/rekorde.css.
 */
import { useEffect } from "react";
import { useNavigation } from "../../../app/navigationsKontext";
import type { Ansicht, Bereich } from "../../../app/stapel";
import { datumText, t, tZahl } from "../../../i18n/sprache";
import { aendere, useSpeicher } from "../../../speicher/speicher";
import { REKORDARTEN } from "../../../training/rekordarten";
import { ALLE_QUELLEN, pruefeRekorde, type Rekordart } from "../../../training/rekorde";
import "../../stil/rekorde.css";
import { Teilenknopf } from "../teilen/Teilenknopf";
import { rekordname, rekordtext } from "./rekordtexte";
import { rekordstand, rekordzeichen } from "./rekordvorschlaege";
import { Rekordkaestchen, Rekordvorschlag } from "./Rekordvorschlag";

/** Ansichten, die zugleich ein Hauptbereich sind: „Los“ wechselt dorthin. */
const BEREICHE: readonly string[] = ["buch", "training", "spielen", "nachschlagen"];

/**
 * Ein aufgestellter Rekord: Zeichen, Name, Wert groß, Datum, Teilen und „Verbessern“ (wie früher
 * „Versuchen“, zurückgeholt am 31.10.2026: wer einen Rekord hat, will ihn schlagen).
 */
function Erreicht({ art, oeffne }: { art: Rekordart; oeffne: (ziel: Ansicht) => void }) {
  const rekord = useSpeicher((z) => z.daten.rekorde[art.kennung]);
  if (!rekord) return null;
  const name = rekordname(art.kennung);
  const wert = rekordtext(art.kennung, rekord.wert);
  const ziel = art.versuchen;
  return (
    <li className="rekord-erreicht" data-testid={`rekord-${art.kennung}`}>
      <Rekordkaestchen zeichen={rekordzeichen(art.kennung)} />
      <span className="rekord-text">
        <span className="rekordname">{name}</span>
        <span className="rekordwert">{wert}</span>
        <span className="hinweis rekorddatum">
          {t("rekorde.datum", { datum: datumText(new Date(rekord.datum)) })}
          {rekord.vorher !== undefined &&
            ` · ${t("rekorde.vorher", { vorher: rekordtext(art.kennung, rekord.vorher) })}`}
        </span>
      </span>
      <span className="rekord-knoepfe">
        <Teilenknopf
          art="rekord"
          kennung={art.kennung}
          name={name}
          bild={null}
          zeile={wert}
          verdient={rekord.datum}
          klein
        />
        {ziel && (
          <button
            type="button"
            className="knopf-link"
            aria-label={t("profil.rekorde.verbessernName", { name })}
            onClick={() => oeffne(ziel)}
          >
            {t("profil.rekorde.verbessern")}
          </button>
        )}
      </span>
    </li>
  );
}

/** Die Herausforderung: zwei Vorschläge und die übrigen Arten zum Aufklappen. */
function Herausforderung({
  ersterRekord,
  vorschlaege,
  weitere,
  oeffne,
}: {
  ersterRekord: boolean;
  vorschlaege: readonly Rekordart[];
  weitere: readonly Rekordart[];
  oeffne: (ziel: Ansicht) => void;
}) {
  if (vorschlaege.length === 0 && weitere.length === 0) return null;
  return (
    <div className="rekord-herausforderung" data-testid="rekord-herausforderung">
      <h3>{t(ersterRekord ? "profil.rekorde.ersten" : "profil.rekorde.mehr")}</h3>
      <ul className="rekordliste">
        {vorschlaege.map((art) => (
          <Rekordvorschlag key={art.kennung} art={art} oeffne={oeffne} />
        ))}
      </ul>
      {weitere.length > 0 && (
        <details className="anleitung" data-testid="rekord-weitere">
          <summary>
            {tZahl("profil.rekorde.weitere", weitere.length, { anzahl: weitere.length })}
          </summary>
          <ul className="rekordliste">
            {weitere.map((art) => (
              <Rekordvorschlag key={art.kennung} art={art} oeffne={oeffne} />
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}

/** Die Karte im Profil. */
export function Rekordtafel() {
  const { navigiere, wechsleBereich } = useNavigation();
  const daten = useSpeicher((z) => z.daten);
  useEffect(() => {
    void aendere((d) => pruefeRekorde(d, { quelle: ALLE_QUELLEN }, new Date(), REKORDARTEN).daten);
  }, []);
  const oeffne = (ziel: Ansicht) => {
    if (BEREICHE.includes(ziel.bildschirm)) wechsleBereich(ziel.bildschirm as Bereich);
    else navigiere(ziel);
  };
  const stand = rekordstand(daten, REKORDARTEN);
  return (
    <section className="karte" data-testid="rekordtafel">
      <h2 className="karte-titel">{t("profil.rekorde.titel")}</h2>
      <p className="hinweis">{t("profil.rekorde.einleitung")}</p>
      {stand.aufgestellt.length > 0 && (
        <ul className="rekordliste rekord-erreichte">
          {stand.aufgestellt.map((art) => (
            <Erreicht key={art.kennung} art={art} oeffne={oeffne} />
          ))}
        </ul>
      )}
      <Herausforderung
        ersterRekord={stand.aufgestellt.length === 0}
        vorschlaege={stand.vorschlaege}
        weitere={stand.weitere}
        oeffne={oeffne}
      />
    </section>
  );
}
