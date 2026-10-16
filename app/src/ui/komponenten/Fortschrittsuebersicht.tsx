/**
 * Karte „Dein Fortschritt“ im Bereich Ich: Summen über das ganze Buch und je Kapitel.
 *
 * Rolle im Gesamtbild: Konzept 10.1 nennt für den Bereich Ich „Fortschritt“; Pflichtenheft 4,
 * Stufe 2 den Fortschritt je Kapitel. Die Summen kommen aus dem Datenverzeichnis (Abbildungen je
 * Kapitel) und aus nachschlagen.json (Lernziele), damit Ich keine Kapiteldateien laden muss.
 * Gelöste Übungen und Trainer-Durchgänge erscheinen, sobald es welche gibt (AP 13).
 * Abhängigkeiten: speicher, app/lernstand.ts, daten/laden.ts, Kapitelfortschritt, i18n.
 */
import { abgehakt, useLernstand } from "../../app/lernstand";
import { useNavigation } from "../../app/navigationsKontext";
import { ladeIndex, ladeNachschlagen, type Datenverzeichnis } from "../../daten/laden";
import { t } from "../../i18n/sprache";
import type { Fortschritt } from "../../speicher/format";
import { geloesteUebungen, kapitelfortschritt } from "../../speicher/fortschritt";
import { useSpeicher } from "../../speicher/speicher";
import { Fortschrittsbalken } from "./Fortschrittsbalken";
import { Fortschrittszeile } from "./Kapitelfortschritt";
import { useDaten } from "./useDaten";

function summe(zahlen: readonly number[]): number {
  return zahlen.reduce((gesamt, zahl) => gesamt + zahl, 0);
}

/** Je Kapitel eine Zeile mit Balken; ein Tipp öffnet die Kapitelübersicht. */
function JeKapitel({ index, fortschritt }: { index: Datenverzeichnis; fortschritt: Fortschritt }) {
  const { navigiere } = useNavigation();
  return (
    <details className="anleitung">
      <summary>{t("fortschritt.jeKapitel")}</summary>
      <ul className="fortschritt-kapitel">
        {index.kapitel.map((kapitel) => {
          const anteil = kapitelfortschritt(
            fortschritt,
            kapitel.kapitel,
            kapitel.abbildungen,
            [],
          ).abbildungen;
          const text = t("fortschritt.kapitelZeile", {
            nummer: kapitel.kapitel,
            gesehen: anteil.erreicht,
            anzahl: anteil.gesamt,
            geloest: geloesteUebungen(fortschritt, kapitel.kapitel),
          });
          return (
            <li key={kapitel.kapitel}>
              <button
                type="button"
                className="knopf-link links"
                onClick={() => navigiere({ bildschirm: "kapitel", nummer: kapitel.kapitel })}
              >
                {text}
              </button>
              <Fortschrittsbalken anteil={anteil} beschriftung={text} />
            </li>
          );
        })}
      </ul>
    </details>
  );
}

/** Lernziele über alle Kapitel. */
function AlleLernziele() {
  const nachschlagen = useDaten(ladeNachschlagen, "nachschlagen");
  const stand = useLernstand();
  if (nachschlagen.art !== "fertig") return null;
  const ziele = nachschlagen.wert.lernziele;
  const anteil = {
    erreicht: summe(ziele.map((z) => abgehakt(stand, z.kapitel, z.punkte.length))),
    gesamt: summe(ziele.map((z) => z.punkte.length)),
  };
  if (anteil.gesamt === 0) return null;
  return (
    <Fortschrittszeile name={t("fortschritt.lernziele")} anteil={anteil} testid="ich-lernziele" />
  );
}

/**
 * Fortschritt über das ganze Buch.
 *
 * Beispiel: nach dem Öffnen von Abb. 1.26 und 1.27 → „Abbildungen angesehen: 2 von 850“.
 */
export function Fortschrittsuebersicht() {
  const index = useDaten(ladeIndex, "index");
  const fortschritt = useSpeicher((zustand) => zustand.daten.fortschritt);
  if (index.art !== "fertig") return null;
  const alle = index.wert.kapitel.flatMap((kapitel) => kapitel.abbildungen);
  const abbildungen = {
    erreicht: alle.filter((id) => fortschritt.gesehen[id] !== undefined).length,
    gesamt: alle.length,
  };
  const uebungen = Object.values(fortschritt.uebungen);
  const durchgaenge = summe(Object.values(fortschritt.trainer).map((s) => s.durchgaenge));
  return (
    <section className="karte" data-testid="ich-fortschritt">
      <h2 className="karte-titel">{t("fortschritt.titel")}</h2>
      <dl className="fortschritt-liste">
        <Fortschrittszeile
          name={t("fortschritt.abbildungen")}
          anteil={abbildungen}
          testid="ich-abbildungen"
        />
        <AlleLernziele />
        {uebungen.length > 0 && (
          <div className="fortschritt-zeile">
            <dt>{t("fortschritt.uebungen")}</dt>
            <dd>
              {t("fortschritt.uebungenGesamt", {
                geloest: uebungen.filter((s) => s.geloest).length,
              })}
            </dd>
          </div>
        )}
        {durchgaenge > 0 && (
          <div className="fortschritt-zeile">
            <dt>{t("fortschritt.trainerDurchgaenge")}</dt>
            <dd>{durchgaenge}</dd>
          </div>
        )}
      </dl>
      <JeKapitel index={index.wert} fortschritt={fortschritt} />
    </section>
  );
}
