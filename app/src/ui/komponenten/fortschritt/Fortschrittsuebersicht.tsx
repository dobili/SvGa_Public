/**
 * Karte „Dein Fortschritt“ im Bereich Ich: Summen über das ganze Buch und je Kapitel.
 *
 * Rolle im Gesamtbild: Konzept 10.1 nennt für den Bereich Ich „Fortschritt“; Pflichtenheft 4,
 * Stufe 2 den Fortschritt je Kapitel. Die Summen kommen aus dem Datenverzeichnis (Abbildungen je
 * Kapitel) und aus nachschlagen.json (Lernziele), damit Ich keine Kapiteldateien laden muss.
 * Gelöste Übungen und Trainer-Durchgänge erscheinen, sobald es welche gibt (AP 13).
 * Kreisanzeigen, je Kapitel ein kleiner Ring (Wunsch des Autors). In der ersten Zeile ein Ring
 * für Trainer aus „Training“, die schon einmal abgeschlossen wurden (mindestens ein Durchgang).
 * Oben stehen Stufe und Erfahrungspunkte (Erfahrung.tsx). Seit dem Profil neu (31.10.2026) stehen
 * die Ringe der Teile des Buches und der Bots und die Abzeichen in der Karte „Deine Erfolge“
 * (erfolge/Erfolge.tsx) als Orden und Abzeichen in Regalen.
 * Abhängigkeiten: Erfahrung.tsx, speicher, speicher/besiegt.ts, engine/gegner.ts, app/lernstand.ts,
 * daten/laden.ts, Symbolringe, Kreisanzeige, zeitartzeichen.ts, i18n, lucide-react.
 */
import { useNavigation } from "../../../app/navigationsKontext";
import type { Datenverzeichnis } from "../../../daten/laden";
import { t, tZahl } from "../../../i18n/sprache";
import type { Fortschritt } from "../../../speicher/format";
import { geloesteUebungen, kapitelfortschritt } from "../../../speicher/fortschritt";
import { useSpeicher } from "../../../speicher/speicher";
import { Ring } from "../bausteine/Kreisanzeige";
import { Erfahrung } from "./Erfahrung";
import { summe, useFortschrittsringe } from "./fortschrittsringe";
import { Symbolringreihe } from "./Symbolringe";
import { Titelsymbol } from "../bausteine/Titelsymbol";

/** Je Kapitel eine Zeile mit kleinem Ring; ein Tipp öffnet die Kapitelübersicht. */
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
          const geloest = geloesteUebungen(fortschritt, kapitel.kapitel);
          const text = tZahl("fortschritt.kapitelZeile", geloest, {
            nummer: kapitel.kapitel,
            gesehen: anteil.erreicht,
            anzahl: anteil.gesamt,
            geloest,
          });
          return (
            <li key={kapitel.kapitel}>
              <Ring anteil={anteil} beschriftung={text} klein />
              <button
                type="button"
                className="knopf-link links"
                onClick={() => navigiere({ bildschirm: "kapitel", nummer: kapitel.kapitel })}
              >
                {text}
              </button>
            </li>
          );
        })}
      </ul>
    </details>
  );
}

/**
 * Fortschritt über das ganze Buch.
 *
 * Beispiel: nach dem Öffnen von Abb. 1.26 und 1.27 → „Abbildungen angesehen: 2 von 850“.
 */
export function Fortschrittsuebersicht() {
  const fortschritt = useSpeicher((zustand) => zustand.daten.fortschritt);
  const ringe = useFortschrittsringe();
  if (!ringe) return null;
  const { index, buchringe } = ringe;
  const uebungen = Object.values(fortschritt.uebungen);
  const durchgaenge = summe(Object.values(fortschritt.trainer).map((s) => s.durchgaenge));
  // Beantwortete Warum-Fragen (0.2.99); die Gesamtzahl steht in den Kapiteln, hier die Summe.
  const warum = summe(Object.values(fortschritt.warum).map((stellen) => stellen.length));
  return (
    <section className="karte" data-testid="ich-fortschritt" data-tour="einstellungen-fortschritt">
      <h2 className="karte-titel">
        <Titelsymbol art="fortschritt" />
        {t("fortschritt.titel")}
      </h2>
      {/* Stufe, Erfahrungspunkte und Abzeichen (Wunsch des Autors, freigegeben 30.10.2026). */}
      <Erfahrung />
      <Symbolringreihe ringe={buchringe} />
      {(uebungen.length > 0 || durchgaenge > 0 || warum > 0) && (
        <dl className="fortschritt-liste">
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
          {warum > 0 && (
            <div className="fortschritt-zeile">
              <dt>{t("fortschritt.warum")}</dt>
              <dd>{warum}</dd>
            </div>
          )}
        </dl>
      )}
      <JeKapitel index={index} fortschritt={fortschritt} />
    </section>
  );
}
