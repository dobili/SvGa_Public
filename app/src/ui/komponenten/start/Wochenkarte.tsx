/**
 * Startkarte „Deine Woche“ (Gamifizierung P4): selbst gewähltes Wochenziel mit sieben Punkten
 * (Mo bis So), Ring „2 von 3 Tagen“, Bilanz ohne Zurücksetzen und darunter die Abschnitte anderer
 * Pakete (Übungsplan P11, später Aufträge P6 und Ziele P13).
 *
 * Rolle im Gesamtbild: Eintrag in STARTKARTEN (Rang 20). Ohne Ziel zeigt die Karte die Zielwahl.
 * Erreicht der Leser sein Ziel, hält die Karte die Woche im Feld `verdient` fest (so bleibt sie
 * erreicht, auch wenn er das Ziel später erhöht) und feiert einmal je Woche mit einem kleinen
 * Feuerwerk (Schalter „Feiereffekte“). Eine verpasste Woche wird nicht erwähnt.
 * Abhängigkeiten: training/wochenziel.ts, wochenabschnitte.ts, Zielwahl.tsx, Wochenring.tsx,
 * Feuerwerk.tsx, Speicher, i18n.
 */
import { useEffect, useState } from "react";
import { feiereffekteAn } from "../../../app/feiereffekte";
import { t } from "../../../i18n/sprache";
import type { Nutzerdaten } from "../../../speicher/format";
import { aendere, useSpeicher } from "../../../speicher/speicher";
import { mitVerdient } from "../../../speicher/verdient";
import {
  besteFolge,
  erreichteWochen,
  FOLGE_AB,
  neuErreichteWochen,
  WOCHE_VERDIENT,
  wochenlage,
  type Wochenlage,
} from "../../../training/wochenziel";
import { Feuerwerk } from "../bausteine/Feuerwerk";
import { merkeSpaeter, spaeterDieseWoche } from "./wochensichtbar";
import { sichtbareAbschnitte, WOCHENABSCHNITTE } from "./wochenabschnitte";
import { Wochenpunkte, Wochenring } from "./Wochenring";
import { Zielwahl } from "./Zielwahl";

/**
 * Hält neu erreichte Wochen fest; true, wenn dabei die laufende Woche war (dann feiern).
 * Sonderfall: frühere Wochen (etwa nach dem ersten Wählen des Ziels) kommen still dazu.
 */
function useWochenfeier(daten: Nutzerdaten, montag: string): boolean {
  const [feiern, setzeFeiern] = useState(false);
  const neu = neuErreichteWochen(daten).join(",");
  useEffect(() => {
    if (neu === "") return;
    const schluessel = neu.split(",");
    void aendere((d) => mitVerdient(d, schluessel, new Date())).then((gespeichert) => {
      if (gespeichert && schluessel.includes(WOCHE_VERDIENT + montag)) setzeFeiern(true);
    });
  }, [neu, montag]);
  return feiern;
}

/** Bilanz: erreichte Wochen und beste Folge; nichts, solange noch keine Woche erreicht ist. */
function Bilanz({ daten }: { daten: Nutzerdaten }) {
  const wochen = erreichteWochen(daten);
  if (wochen.length === 0) return null;
  const folge = besteFolge(wochen);
  return (
    <p className="hinweis" data-testid="wochenziel-bilanz">
      {t("woche.wochenErreicht", { n: wochen.length })}
      {folge >= FOLGE_AB && <> · {t("woche.besteFolge", { n: folge })}</>}
    </p>
  );
}

/** Die Abschnitte der anderen Pakete unter dem Wochenstand. */
function Abschnitte({ daten, jetzt }: { daten: Nutzerdaten; jetzt: Date }) {
  return sichtbareAbschnitte(WOCHENABSCHNITTE, daten, jetzt).map(({ kennung, Abschnitt }) => (
    <Abschnitt key={kennung} />
  ));
}

/** Stand der Woche mit Ziel: Ring, Punkte, Meldungen, Bilanz und Abschnitte. */
function Wochenstand({
  daten,
  lage,
  jetzt,
}: {
  daten: Nutzerdaten;
  lage: Wochenlage;
  jetzt: Date;
}) {
  return (
    <>
      <div className="wochenkarte-stand">
        <Wochenring gelernt={lage.gelernt} ziel={lage.ziel ?? 0} />
        <Wochenpunkte tage={lage.tage} />
      </div>
      {lage.erreicht && <p className="wochenkarte-erreicht">{t("woche.erreicht")}</p>}
      {lage.nochEinTag && <p className="hinweis">{t("woche.nochEinTag")}</p>}
      <Bilanz daten={daten} />
      <Abschnitte daten={daten} jetzt={jetzt} />
    </>
  );
}

/** Die Wochenkarte. */
export function Wochenkarte() {
  const daten = useSpeicher((z) => z.daten);
  const [aendern, setzeAendern] = useState(false);
  const [spaeter, setzeSpaeter] = useState(false);
  const jetzt = new Date();
  const lage = wochenlage(daten, jetzt);
  const feiern = useWochenfeier(daten, lage.montag);
  const mitZiel = lage.ziel !== null;
  // Ohne Wochenziel stehen die Abschnitte (etwa eigene Ziele, P13) unter der Zielwahl; nach
  // „Später“ bleiben nur sie, und ohne angeheftete Ziele verschwindet die Karte wie bisher.
  const nurAbschnitte = !mitZiel && (spaeter || spaeterDieseWoche(jetzt));
  if (nurAbschnitte && daten.ziele.angeheftet.length === 0) return null;
  return (
    <article className="karte wochenkarte" data-testid="wochenkarte">
      {feiern && feiereffekteAn() && <Feuerwerk umfang="klein" />}
      <div className="karte-kopf">
        <h2>{t("woche.titel")}</h2>
        {mitZiel && !aendern && (
          <button type="button" className="knopf-zweit" onClick={() => setzeAendern(true)}>
            {t("woche.zielAendern")}
          </button>
        )}
      </div>
      {mitZiel && !aendern && <Wochenstand daten={daten} lage={lage} jetzt={jetzt} />}
      {(!mitZiel || aendern) && !nurAbschnitte && (
        <Zielwahl
          aendern={mitZiel}
          fertig={() => setzeAendern(false)}
          spaeter={() => {
            merkeSpaeter(jetzt);
            setzeSpaeter(true);
          }}
        />
      )}
      {!mitZiel && <Abschnitte daten={daten} jetzt={jetzt} />}
    </article>
  );
}
