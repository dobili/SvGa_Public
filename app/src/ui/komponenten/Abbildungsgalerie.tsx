/**
 * Galerie der Abbildungen eines Kapitels: kleine Bretter nach Abschnitten, mit Haken zum Abhaken.
 *
 * Rolle im Gesamtbild: Hauptteil der Kapitelübersicht (Konzept 10.1, Pflichtenheft 4
 * „Kapitelübersicht mit kleinen Brettern“). Die kleinen Bretter zeigen Pfeile und Felder wie im
 * Buch; ein Tipp öffnet die Abbildung. Angesehene Abbildungen tragen einen Haken, den der Leser
 * auch von Hand setzen kann (einzeln oder alle, 0.2.27).
 * Seit 0.2.80 (Wunsch des Autors, 18.10.2026): „Alle abhaken“ und „Alle zurücksetzen“ stehen
 * direkt über der Galerie; jeder Abschnitt (1.1, 1.2 …) ist aufklappbar, zeigt seinen Stand als
 * kleinen Ring und hat einen eigenen Knopf „Abschnitt 1.1 abhaken“ oder „Haken in 1.1 lösen“.
 * Seit 0.2.82 (Wunsch des Autors) sind alle Abschnitte anfangs eingeklappt; ein Pfeil vorn zeigt,
 * ob ein Abschnitt auf- oder zugeklappt ist.
 * Seit 0.2.99 (Wunsch des Autors): Abbildungen mit Warum-Fragen tragen oben rechts ein Zeichen
 * (gesperrt, offen, beantwortet), erklärt in der Legende über der Galerie (Zusatzsymbol.tsx).
 * Abhängigkeiten: daten/laden.ts, ui/brett, Navigation, Speicher, MitInfo, Ring, i18n.
 */
import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useNavigation } from "../../app/navigationsKontext";
import type { Abbildung, Kapitel, Textteil } from "../../daten/laden";
import { t } from "../../i18n/sprache";
import { setzeGesehen } from "../../speicher/fortschritt";
import { aendere, useSpeicher } from "../../speicher/speicher";
import { Brett } from "../brett/Brett";
import { buchmarkierungen } from "./buchmarkierungen";
import { MitInfo } from "./InfoKnopf";
import { Ring } from "./Kreisanzeige";
import { Zusatzlegende, Zusatzsymbol } from "./Zusatzsymbol";
import { Titelsymbol } from "./Titelsymbol";

/** Größe des Hakens im Kästchen an angesehenen Abbildungen. */
const HAKEN_GROESSE = 15;
/** Größe des Pfeils, der auf- und zugeklappt zeigt. */
const PFEIL_GROESSE = 18;
/** So viele Zeichen der Bildunterschrift stehen unter dem kleinen Brett. */
const KURZTEXT_ZEICHEN = 60;

/** Der Anfang der Bildunterschrift als schlichter Text, etwa „Nach 2... Sc6“. */
function kurztext(teile: readonly Textteil[]): string {
  const text = teile
    .filter((teil) => teil.art !== "absatz")
    .map((teil) => teil.text)
    .join("")
    .trim();
  return text.length > KURZTEXT_ZEICHEN ? `${text.slice(0, KURZTEXT_ZEICHEN).trimEnd()} …` : text;
}

/** Hakt Abbildungen ab oder nimmt die Haken zurück (sofort gespeichert). */
function hake(nummern: readonly string[], gesehen: boolean): void {
  void aendere((daten) => setzeGesehen(daten, nummern, gesehen, new Date()));
}

/**
 * Ein kleines Brett mit Nummer und Anfang der Unterschrift; ein Tipp öffnet die Abbildung. Oben
 * rechts ein Kästchen zum Abhaken von Hand (Wunsch des Autors, Nachtest 0.2.26).
 */
function Kachel({ abbildung }: { abbildung: Abbildung }) {
  const { navigiere } = useNavigation();
  const gesehen = useSpeicher(
    (zustand) => zustand.daten.fortschritt.gesehen[abbildung.id] !== undefined,
  );
  const titel = t("abbildung.titel", { nummer: abbildung.id });
  return (
    <div className="abbildungskachel-rahmen">
      <button
        type="button"
        className="abbildungskachel"
        onClick={() => navigiere({ bildschirm: "abbildung", nummer: abbildung.id })}
      >
        <Brett
          fen={abbildung.fen}
          markierungen={buchmarkierungen(abbildung)}
          koordinaten={false}
          beschriftung={titel}
        />
        <Zusatzsymbol abbildung={abbildung} />
        <span className="kachel-nummer">{titel}</span>
        <span className="kachel-text">{kurztext(abbildung.unterschrift)}</span>
      </button>
      <button
        type="button"
        className="kachel-haken"
        aria-pressed={gesehen}
        aria-label={t("fortschritt.abhaken", { titel })}
        onClick={() => hake([abbildung.id], !gesehen)}
      >
        {gesehen && <Check size={HAKEN_GROESSE} aria-hidden="true" />}
        {t(gesehen ? "fortschritt.gesehen" : "fortschritt.nichtGesehen")}
      </button>
    </div>
  );
}

/** Welche Rückfrage gerade offen ist: alle abhaken oder alle zurücksetzen. */
type Rueckfrage = "abhaken" | "zuruecksetzen" | null;

/** Die Rückfrage vor „Alle abhaken“ oder „Alle zurücksetzen“. */
function Nachfrage({
  frage,
  kapitel,
  beiEnde,
}: {
  frage: "abhaken" | "zuruecksetzen";
  kapitel: Kapitel;
  beiEnde: () => void;
}) {
  const abhaken = frage === "abhaken";
  return (
    <div
      className="nachfrage"
      role="alertdialog"
      aria-label={t(abhaken ? "fortschritt.alleAbhaken" : "fortschritt.alleZuruecksetzen")}
    >
      <p>
        {t(abhaken ? "fortschritt.abhakenFrage" : "fortschritt.zuruecksetzenFrage", {
          kapitel: kapitel.kapitel,
        })}
      </p>
      <div className="knopfreihe">
        <button
          type="button"
          className={abhaken ? "knopf-haupt" : "knopf-gefahr"}
          onClick={() => {
            hake(
              kapitel.abbildungen.map((a) => a.id),
              abhaken,
            );
            beiEnde();
          }}
        >
          {t(abhaken ? "fortschritt.abhakenJa" : "fortschritt.zuruecksetzenJa")}
        </button>
        <button type="button" className="knopf-zweit" onClick={beiEnde}>
          {t("loeschen.nein")}
        </button>
      </div>
    </div>
  );
}

/**
 * Kopf der Galerie: Titel „Abbildungen“ mit Erklärung hinter dem Fragezeichen, darunter „Alle
 * abhaken“ und „Alle zurücksetzen“, beide mit Rückfrage (Wunsch des Autors nach dem Test von
 * 0.2.27: Ein versehentliches „Alle abhaken“ verwischt, was man wirklich schon angesehen hat).
 */
function Galeriekopf({ kapitel }: { kapitel: Kapitel }) {
  const [frage, setzeFrage] = useState<Rueckfrage>(null);
  return (
    <div className="galeriekopf">
      <MitInfo
        zeile={
          <h2 className="abschnitt-titel">
            <Titelsymbol art="abbildungen" />
            {t("kapitel.abbildungen")}
          </h2>
        }
        erklaerung={<p>{t("fortschritt.verweilen")}</p>}
        thema={t("kapitel.abbildungen")}
      />
      <Zusatzlegende kapitel={kapitel} />
      {frage ? (
        <Nachfrage frage={frage} kapitel={kapitel} beiEnde={() => setzeFrage(null)} />
      ) : (
        <div className="knopfreihe" data-tour="kapitel-abhaken">
          <button type="button" className="knopf-zweit" onClick={() => setzeFrage("abhaken")}>
            {t("fortschritt.alleAbhaken")}
          </button>
          <button type="button" className="knopf-zweit" onClick={() => setzeFrage("zuruecksetzen")}>
            {t("fortschritt.alleZuruecksetzen")}
          </button>
        </div>
      )}
    </div>
  );
}

interface Gruppe {
  readonly nummer: string;
  readonly titel: string;
  readonly abbildungen: readonly Abbildung[];
}

/** Abbildungen nach Abschnitten; Abbildungen vor dem ersten Abschnitt stehen vorn ohne Titel. */
function nachAbschnitten(kapitel: Kapitel): Gruppe[] {
  const gruppen = [
    { nummer: "", titel: "", abbildungen: kapitel.abbildungen.filter((a) => !a.abschnitt) },
    ...kapitel.abschnitte.map((abschnitt) => ({
      nummer: abschnitt.nummer,
      titel: abschnitt.titel,
      abbildungen: kapitel.abbildungen.filter((a) => a.abschnitt?.nummer === abschnitt.nummer),
    })),
  ];
  return gruppen.filter((gruppe) => gruppe.abbildungen.length > 0);
}

function Raster({ abbildungen }: { abbildungen: readonly Abbildung[] }) {
  return (
    <div className="kachelraster">
      {abbildungen.map((abbildung) => (
        <Kachel key={abbildung.id} abbildung={abbildung} />
      ))}
    </div>
  );
}

/**
 * Ein aufklappbarer Abschnitt mit Ring, Stand und eigenem Abhak-Knopf.
 * Beispiel: „1.4 Angreifer und Verteidiger zählen“ mit Abb. 1.26 bis 1.29; nach „Abschnitt 1.4
 * abhaken“ heißt der Knopf „Haken in 1.4 lösen“. Die kleinen Bretter entstehen erst beim
 * Aufklappen, damit lange Kapitel schnell öffnen.
 */
function Abschnitt({ gruppe }: { gruppe: Gruppe }) {
  const gesehen = useSpeicher((zustand) => zustand.daten.fortschritt.gesehen);
  const nummern = gruppe.abbildungen.map((a) => a.id);
  const anteil = {
    erreicht: nummern.filter((n) => gesehen[n] !== undefined).length,
    gesamt: nummern.length,
  };
  const fertig = anteil.erreicht === anteil.gesamt;
  const [offen, setzeOffen] = useState(false);
  const stand = t("fortschritt.anteil", anteil);
  return (
    <details
      className="abschnittsklappe"
      open={offen}
      onToggle={(ereignis) => setzeOffen(ereignis.currentTarget.open)}
    >
      <summary>
        <Ring anteil={anteil} beschriftung={stand} klein />
        <h2 className="abschnittsklappe-titel">
          {gruppe.nummer} {gruppe.titel}
        </h2>
        <span className="abschnittsklappe-stand">{stand}</span>
        <ChevronDown className="aufklapper" size={PFEIL_GROESSE} aria-hidden="true" />
      </summary>
      {offen && (
        <>
          <button
            type="button"
            className="knopf-link abschnitt-haken"
            onClick={() => hake(nummern, !fertig)}
          >
            {t(fertig ? "kapitel.abschnittLoesen" : "kapitel.abschnittAbhaken", {
              nummer: gruppe.nummer,
            })}
          </button>
          <Raster abbildungen={gruppe.abbildungen} />
        </>
      )}
    </details>
  );
}

/**
 * Die ganze Galerie eines Kapitels mit Kopf und Abschnitten.
 *
 * Eingabe: geladenes Kapitel. Beispiel: Kapitel 1 mit den Abschnitten 1.1 bis 1.6.
 */
export function Abbildungsgalerie({ kapitel }: { kapitel: Kapitel }) {
  return (
    <section className="abschnitt" data-testid="abbildungsgalerie" data-tour="kapitel-galerie">
      <Galeriekopf kapitel={kapitel} />
      {nachAbschnitten(kapitel).map((gruppe) =>
        gruppe.nummer ? (
          <Abschnitt key={gruppe.nummer} gruppe={gruppe} />
        ) : (
          <Raster key="vorn" abbildungen={gruppe.abbildungen} />
        ),
      )}
    </section>
  );
}
