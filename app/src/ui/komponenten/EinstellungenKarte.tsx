/**
 * Karte „Darstellung und Training“ in den Einstellungen: Nachtmodus, Brettfarben, Figurensatz,
 * Koordinaten, Ton, Erklärkacheln, dazu der Stand der Sprache.
 *
 * Rolle im Gesamtbild: Pflichtenheft 4 „Einstellungen: Sprache, Brettfarben, Figurensatz, Ton,
 * Auflage des Buches, Strenge des Modus ‚Erst selbst denken‘“. Was es noch nicht zu wählen gibt,
 * steht mit „folgt“ da (Sprache). Die Auflage zeigt die Zeile „Datenstand“ darüber.
 * Seit 0.2.33 (Fragen des Autors vom 16.10.2026): Figurensatz (wie im Buch, klassisch, seit 0.2.39
 * auch Holz) und Ton
 * (aus, an) sind wählbar. „Erst selbst denken“ war bis AP 13 ausgeblendet; seit 0.2.37 wirkt es
 * bei den Übungen des Buches (Hinweise und Lösung erst nach eigenem Nachdenken) und ist wählbar.
 * Nachtmodus (seit 0.2.31, Wunsch des Autors): wie das Gerät, aus oder an (app/farbschema.ts).
 * Ebenfalls seit 0.2.31: ausgeblendete Erklärkacheln von Zählen und Ziehen wieder anzeigen.
 * Seit 0.2.80 (Wunsch des Autors, 18.10.2026): Reiter mit Symbolen (Brett, Figuren, Anzeige,
 * Ton, Training), damit nicht alles auf einmal untereinander steht; Brettfarben und Figurensätze
 * als Kacheln mit Vorschau. Seit 0.2.82 neun Figurensätze in den Gruppen Klassisch, Modern, Holz.
 * Abhängigkeiten: app/einstellungen.ts, app/farbschema.ts, app/merker.ts, Reiter, Vorschauwahl,
 * i18n.
 */
import { Brain, Crown, Grid3x3, Palette, Volume2, type LucideIcon } from "lucide-react";
import { useState } from "react";
import {
  aendereEinstellungen,
  BILDSAETZE,
  useEinstellungen,
  type Brettfarben,
  type Figurensatz,
  type Strenge,
  type Ton,
} from "../../app/einstellungen";
import {
  FARBSCHEMATA,
  liesFarbschema,
  setzeFarbschema,
  type Farbschema,
} from "../../app/farbschema";
import { liesMerker, schreibeMerker } from "../../app/merker";
import { GENAUIGKEITSMODI } from "../../spiel/staerkemodell";
import { t, type Textschluessel } from "../../i18n/sprache";
import { Auswahl } from "./Auswahl";
import { Reiter } from "./Reiter";
import { Brettausschnitt, Vorschauwahl } from "./Vorschauwahl";
import { zeigeErklaerungenWieder } from "./useErklaerung";

const BRETTFARBEN: readonly Brettfarben[] = ["buch", "holz", "gruen"];
/** Figurensätze in Gruppen (seit 0.2.82): wie im Buch, dann je drei klassisch, modern, Holz. */
const FIGURENGRUPPEN: readonly { titel?: Textschluessel; werte: readonly Figurensatz[] }[] = [
  { werte: ["buch"] },
  {
    titel: "einstellungen.figurensatz.gruppe.klassisch",
    werte: BILDSAETZE.filter((s) => s.startsWith("klassisch-")),
  },
  {
    titel: "einstellungen.figurensatz.gruppe.modern",
    werte: BILDSAETZE.filter((s) => s.startsWith("modern-")),
  },
  {
    titel: "einstellungen.figurensatz.gruppe.holz",
    werte: BILDSAETZE.filter((s) => s.startsWith("holz-")),
  },
];
const TOENE: readonly Ton[] = ["aus", "an"];
const STRENGEN: readonly Strenge[] = ["locker", "streng"];
const KOORDINATEN = ["an", "aus"] as const;
type Koordinaten = (typeof KOORDINATEN)[number];

/** Koordinaten am Brett, gemerkt auf dem Gerät. Beispiel: „aus“ blendet a–h und 1–8 aus. */
function KoordinatenWahl() {
  const [wert, setzeWert] = useState<Koordinaten>(
    liesMerker("koordinaten") === "aus" ? "aus" : "an",
  );
  return (
    <Auswahl
      name={t("einstellungen.koordinaten")}
      werte={KOORDINATEN}
      gewaehlt={wert}
      text={(w) => t(`einstellungen.koordinaten.${w}`)}
      beiWahl={(neu) => {
        schreibeMerker("koordinaten", neu);
        setzeWert(neu);
      }}
    />
  );
}

/** Nachtmodus: wie das Gerät, aus (hell) oder an (dunkel); gilt sofort. */
function NachtmodusWahl() {
  const [wert, setzeWert] = useState<Farbschema>(liesFarbschema);
  return (
    <Auswahl
      name={t("einstellungen.nachtmodus")}
      werte={FARBSCHEMATA}
      gewaehlt={wert}
      text={(w) => t(`einstellungen.nachtmodus.${w}`)}
      beiWahl={(neu) => {
        setzeFarbschema(neu);
        setzeWert(neu);
      }}
    />
  );
}

/** Holt die ausgeblendeten Erklärkacheln zurück und bestätigt es. */
function ErklaerungenWahl() {
  const [gezeigt, setzeGezeigt] = useState(false);
  return (
    <div className="einstellung-knopf">
      <span>{t("einstellungen.erklaerungen")}</span>
      <button
        type="button"
        className="knopf-zweit"
        onClick={() => {
          zeigeErklaerungenWieder();
          setzeGezeigt(true);
        }}
      >
        {t("einstellungen.erklaerungen.zeigen")}
      </button>
      {gezeigt && (
        <p className="hinweis" role="status">
          {t("einstellungen.erklaerungen.gezeigt")}
        </p>
      )}
    </div>
  );
}

type Bereich = "brett" | "figuren" | "anzeige" | "ton" | "training";
const BEREICHE: readonly { wert: Bereich; text: Textschluessel; symbol: LucideIcon }[] = [
  { wert: "brett", text: "einstellungen.reiter.brett", symbol: Grid3x3 },
  { wert: "figuren", text: "einstellungen.reiter.figuren", symbol: Crown },
  { wert: "anzeige", text: "einstellungen.reiter.anzeige", symbol: Palette },
  { wert: "ton", text: "einstellungen.reiter.ton", symbol: Volume2 },
  { wert: "training", text: "einstellungen.reiter.training", symbol: Brain },
];

/** Brett: Farben mit Vorschau, Koordinaten. */
function BrettBereich() {
  const einstellungen = useEinstellungen();
  return (
    <>
      <Vorschauwahl
        name={t("einstellungen.brettfarben")}
        werte={BRETTFARBEN}
        gewaehlt={einstellungen.brettfarben}
        text={(wert) => t(`einstellungen.brettfarben.${wert}`)}
        vorschau={(wert) => <Brettausschnitt farben={wert} satz={einstellungen.figurensatz} />}
        beiWahl={(brettfarben) => aendereEinstellungen({ brettfarben })}
      />
      <KoordinatenWahl />
    </>
  );
}

/** Figuren: Sätze mit Vorschau auf dem gewählten Brett. */
function FigurenBereich() {
  const einstellungen = useEinstellungen();
  return (
    <Vorschauwahl
      name={t("einstellungen.figurensatz")}
      gruppen={FIGURENGRUPPEN.map((g) => ({ ...g, titel: g.titel && t(g.titel) }))}
      gewaehlt={einstellungen.figurensatz}
      text={(wert) => t(`einstellungen.figurensatz.${wert}`)}
      vorschau={(wert) => <Brettausschnitt farben={einstellungen.brettfarben} satz={wert} />}
      beiWahl={(figurensatz) => aendereEinstellungen({ figurensatz })}
    />
  );
}

/** Anzeige: Nachtmodus, Erklärkacheln, Sprache. */
function AnzeigeBereich() {
  return (
    <>
      <NachtmodusWahl />
      <ErklaerungenWahl />
      <dl className="einstellungen">
        <div className="einstellung">
          <dt>{t("einstellungen.sprache")}</dt>
          <dd>{t("einstellungen.sprache.wert")}</dd>
        </div>
      </dl>
    </>
  );
}

function TonBereich() {
  const einstellungen = useEinstellungen();
  return (
    <>
      <Auswahl
        name={t("einstellungen.ton")}
        werte={TOENE}
        gewaehlt={einstellungen.ton}
        text={(wert) => t(`einstellungen.ton.${wert}`)}
        beiWahl={(ton) => aendereEinstellungen({ ton })}
      />
      <p className="hinweis">{t("einstellungen.ton.hinweis")}</p>
    </>
  );
}

/**
 * Training: „Erst selbst denken“ und seit 0.2.83 der Schalter „Genauigkeit wie“ (Lichess,
 * Mittelweg, nahe chess.com) für die Auswertung der Partien (spiel/staerkemodell.ts).
 */
function TrainingBereich() {
  const einstellungen = useEinstellungen();
  return (
    <>
      <Auswahl
        name={t("einstellungen.genauigkeit")}
        werte={GENAUIGKEITSMODI}
        gewaehlt={einstellungen.genauigkeitsmodus}
        text={(wert) => t(`einstellungen.genauigkeit.${wert}`)}
        beiWahl={(genauigkeitsmodus) => aendereEinstellungen({ genauigkeitsmodus })}
      />
      <p className="hinweis">
        {t(`einstellungen.genauigkeit.${einstellungen.genauigkeitsmodus}.text`)}
      </p>
      <Auswahl
        name={t("einstellungen.strenge")}
        werte={STRENGEN}
        gewaehlt={einstellungen.strenge}
        text={(wert) => t(`einstellungen.strenge.${wert}`)}
        beiWahl={(strenge) => aendereEinstellungen({ strenge })}
      />
      <p className="hinweis">{t(`einstellungen.strenge.${einstellungen.strenge}.text`)}</p>
    </>
  );
}

const INHALT: Readonly<Record<Bereich, () => React.ReactNode>> = {
  brett: () => <BrettBereich />,
  figuren: () => <FigurenBereich />,
  anzeige: () => <AnzeigeBereich />,
  ton: () => <TonBereich />,
  training: () => <TrainingBereich />,
};

export function EinstellungenKarte() {
  const [bereich, setzeBereich] = useState<Bereich>("brett");
  return (
    <section className="karte" data-testid="darstellung">
      <h2 className="karte-titel">{t("einstellungen.titel")}</h2>
      <Reiter
        name={t("einstellungen.titel")}
        eintraege={BEREICHE.map((b) => ({ ...b, text: t(b.text) }))}
        gewaehlt={bereich}
        beiWahl={setzeBereich}
      />
      <div className="reiterinhalt" role="tabpanel">
        {INHALT[bereich]()}
      </div>
    </section>
  );
}
