/**
 * Karte „Dein Fortschritt“ im Bereich Ich: Summen über das ganze Buch und je Kapitel.
 *
 * Rolle im Gesamtbild: Konzept 10.1 nennt für den Bereich Ich „Fortschritt“; Pflichtenheft 4,
 * Stufe 2 den Fortschritt je Kapitel. Die Summen kommen aus dem Datenverzeichnis (Abbildungen je
 * Kapitel) und aus nachschlagen.json (Lernziele), damit Ich keine Kapiteldateien laden muss.
 * Gelöste Übungen und Trainer-Durchgänge erscheinen, sobald es welche gibt (AP 13).
 * Seit 0.2.80 Kreisanzeigen statt Balken, je Kapitel ein kleiner Ring (Wunsch des Autors).
 * Seit 25.10.2026 (Wunsch des Autors) dazu je Zeitart ein Ring mit den schon gewertet besiegten
 * vorgefertigten Bots (gezählt wie die Siegmarken am Porträt, speicher/besiegt.ts); alle Ringe
 * tragen ein Zeichen in der Mitte, eine Legende darunter erklärt die Zeichen (Symbolringe.tsx).
 * Seit 0.2.139 (Wunsch des Autors, 25.10.2026) ein dritter Ring in der ersten Zeile: Trainer aus
 * „Training“, die schon einmal abgeschlossen wurden (mindestens ein Durchgang).
 * Abhängigkeiten: speicher, speicher/besiegt.ts, engine/gegner.ts, app/lernstand.ts,
 * daten/laden.ts, Symbolringe, Kreisanzeige, zeitartzeichen.ts, i18n, lucide-react.
 */
import { Dumbbell, LayoutGrid, ListChecks } from "lucide-react";
import { abgehakt, useLernstand } from "../../app/lernstand";
import { useNavigation } from "../../app/navigationsKontext";
import { ladeIndex, ladeNachschlagen, type Datenverzeichnis } from "../../daten/laden";
import { GEGNER } from "../../engine/gegner";
import { t, tZahl } from "../../i18n/sprache";
import { botsiegeJeTempo } from "../../speicher/besiegt";
import type { Fortschritt } from "../../speicher/format";
import {
  erstmalsTrainiert,
  geloesteUebungen,
  kapitelfortschritt,
  type Anteil,
} from "../../speicher/fortschritt";
import { useSpeicher } from "../../speicher/speicher";
import { Ring } from "./Kreisanzeige";
import { Ringlegende, Symbolringreihe, type Symbolringangabe } from "./Symbolringe";
import { useDaten } from "./useDaten";
import { Titelsymbol } from "./Titelsymbol";
import { ZEITARTZEICHEN, zeitartname } from "./zeitartzeichen";

/** Kennungen aller vorgefertigten Bots, auch der Spaß-Bots (sie tragen ebenso Siegmarken). */
const VORGEFERTIGTE = GEGNER.map((g) => g.kennung);

function summe(zahlen: readonly number[]): number {
  return zahlen.reduce((gesamt, zahl) => gesamt + zahl, 0);
}

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

/** Abgehakte Lernziele über alle Kapitel; null, solange nachschlagen.json lädt oder ohne Ziele. */
function useLernzielanteil(): Anteil | null {
  const nachschlagen = useDaten(ladeNachschlagen, "nachschlagen");
  const stand = useLernstand();
  if (nachschlagen.art !== "fertig") return null;
  const ziele = nachschlagen.wert.lernziele;
  const gesamt = summe(ziele.map((z) => z.punkte.length));
  if (gesamt === 0) return null;
  return { erreicht: summe(ziele.map((z) => abgehakt(stand, z.kapitel, z.punkte.length))), gesamt };
}

/** Je Zeitart ein Ring: besiegte vorgefertigte Bots (Blitz, Schnellschach, Klassisch). */
function useBotringe(): Symbolringangabe[] {
  const besiegt = useSpeicher((zustand) => zustand.daten.spiel.besiegt);
  return botsiegeJeTempo(besiegt, VORGEFERTIGTE).map(({ tempo, erreicht, gesamt }) => ({
    name: t("fortschritt.botsiege", { zeitart: zeitartname(tempo) }),
    legende: zeitartname(tempo),
    symbol: ZEITARTZEICHEN[tempo],
    anteil: { erreicht, gesamt },
    testid: `ich-bots-${tempo}`,
  }));
}

/**
 * Fortschritt über das ganze Buch.
 *
 * Beispiel: nach dem Öffnen von Abb. 1.26 und 1.27 → „Abbildungen angesehen: 2 von 850“.
 */
export function Fortschrittsuebersicht() {
  const index = useDaten(ladeIndex, "index");
  const fortschritt = useSpeicher((zustand) => zustand.daten.fortschritt);
  const lernziele = useLernzielanteil();
  const botringe = useBotringe();
  if (index.art !== "fertig") return null;
  const alle = index.wert.kapitel.flatMap((kapitel) => kapitel.abbildungen);
  const abbildungen = {
    erreicht: alle.filter((id) => fortschritt.gesehen[id] !== undefined).length,
    gesamt: alle.length,
  };
  const uebungen = Object.values(fortschritt.uebungen);
  const durchgaenge = summe(Object.values(fortschritt.trainer).map((s) => s.durchgaenge));
  // Beantwortete Warum-Fragen (0.2.99); die Gesamtzahl steht in den Kapiteln, hier die Summe.
  const warum = summe(Object.values(fortschritt.warum).map((stellen) => stellen.length));
  const buchringe: Symbolringangabe[] = [
    {
      name: t("fortschritt.abbildungen"),
      symbol: LayoutGrid,
      anteil: abbildungen,
      testid: "ich-abbildungen",
    },
    ...(lernziele
      ? [
          {
            name: t("fortschritt.lernziele"),
            symbol: ListChecks,
            anteil: lernziele,
            testid: "ich-lernziele",
          },
        ]
      : []),
    {
      name: t("fortschritt.trainerErstmals"),
      symbol: Dumbbell,
      anteil: erstmalsTrainiert(fortschritt),
      testid: "ich-trainer",
    },
  ];
  return (
    <section className="karte" data-testid="ich-fortschritt" data-tour="einstellungen-fortschritt">
      <h2 className="karte-titel">
        <Titelsymbol art="fortschritt" />
        {t("fortschritt.titel")}
      </h2>
      <Symbolringreihe ringe={buchringe} />
      <Symbolringreihe ringe={botringe} titel={t("fortschritt.bots")} />
      <Ringlegende ringe={[...buchringe, ...botringe]} />
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
      <JeKapitel index={index.wert} fortschritt={fortschritt} />
    </section>
  );
}
