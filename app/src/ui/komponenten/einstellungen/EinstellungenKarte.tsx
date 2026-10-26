/**
 * Karte „Einstellungen“ (bis 0.2.84 „Darstellung und Training“): Nachtmodus, Brettfarben, Figurensatz,
 * Koordinaten, Ton, Erklärkacheln, dazu der Stand der Sprache.
 *
 * Rolle im Gesamtbild: Pflichtenheft 4 „Einstellungen: Sprache, Brettfarben, Figurensatz, Ton,
 * Auflage des Buches, Strenge des Modus ‚Erst selbst denken‘“. Was es noch nicht zu wählen gibt,
 * steht mit „folgt“ da (Sprache, bis es eine zweite gibt; seit 0.2.94 dann eine Auswahl). Die Auflage zeigt die Zeile „Datenstand“ darüber.
 * Seit 0.2.33 (Fragen des Autors vom 16.10.2026): Figurensatz (wie im Buch, klassisch, seit 0.2.39
 * auch Holz) und Ton
 * (aus, an) sind wählbar. „Erst selbst denken“ war bis AP 13 ausgeblendet; seit 0.2.37 wirkt es
 * bei den Übungen des Buches (Hinweise und Lösung erst nach eigenem Nachdenken) und ist wählbar.
 * Nachtmodus (seit 0.2.31, Wunsch des Autors): wie das Gerät, aus oder an (app/farbschema.ts).
 * Ebenfalls seit 0.2.31: ausgeblendete Erklärkacheln von Zählen und Ziehen wieder anzeigen.
 * Seit 0.2.80 (Wunsch des Autors, 18.10.2026): Reiter mit Symbolen (Brett, Figuren, Anzeige,
 * Ton, Training), damit nicht alles auf einmal untereinander steht; Brettfarben und Figurensätze
 * als Kacheln mit Vorschau. Seit 0.2.82 neun Figurensätze in den Gruppen Klassisch, Modern, Holz;
 * seit 0.2.84 zwölf Bretter in den Gruppen Farben, Holz und Material. Seit 0.2.92 unter „Brett“
 * der Schalter „Figuren per Wischen ziehen“ (Merker auf dem Gerät wie die Koordinaten).
 * Seit P8 (R52) unter „Anzeige“ der Schalter für das Toursymbol und der Knopf für den Rundgang.
 * Seit 0.2.134 (Wunsch des Autors, 25.10.2026: die Reiter waren nicht sinnvoll sortiert) neu
 * geordnet: Brett (Farben, Figuren, Koordinaten: wie das Brett aussieht), Bedienung (Ziehen per
 * Wischen, Zuganimation, Startanimation, Ton: wie die App reagiert), Anzeige (Nachtmodus, Schrift,
 * Sprache), Training (Erst selbst denken) und Hilfe (Toursymbol, Rundgang, Erklärkacheln). Vorher
 * hatte „Ton“ einen Reiter für eine Einstellung, die Startanimation stand unter „Brett“ und die
 * Hilfen unter „Anzeige“. Die Karte steht seit 0.2.134 auf dem Bildschirm „Einstellungen“ und
 * braucht keine eigene Überschrift mehr.
 * Abhängigkeiten: app/einstellungen.ts, app/farbschema.ts, app/merker.ts, Reiter, Vorschauwahl,
 * tour/, SprachWahl (seit V4 eigene Datei), i18n.
 */
import { Bot, Brain, Grid3x3, LifeBuoy, Palette, Pointer, type LucideIcon } from "lucide-react";
import { useState } from "react";
import {
  aendereEinstellungen,
  BILDSAETZE,
  useEinstellungen,
  type Brettfarben,
  type Figurensatz,
  type Strenge,
  type VorWerkzeugen,
  type Ton,
} from "../../../app/einstellungen";
import {
  FARBSCHEMATA,
  liesFarbschema,
  setzeFarbschema,
  type Farbschema,
} from "../../../app/farbschema";
import { liesMerker, schreibeMerker } from "../../../app/merker";
import { t, type Textschluessel } from "../../../i18n/sprache";
import { MERKER_WISCHEN } from "../../brett/useZiehen";
import { MERKER_ZUGANIMATION } from "../../brett/useZuganimation";
import { MaiaWahl } from "./MaiaWahl";
import { SchriftgroesseWahl } from "./SchriftgroesseWahl";
import { SprachWahl } from "./SprachWahl";
import { MERKER_STARTANIMATION } from "../rahmen/Startanimation";
import { Auswahl } from "../bausteine/Auswahl";
import { Reiter } from "../bausteine/Reiter";
import { Brettausschnitt, Vorschauwahl } from "../bausteine/Vorschauwahl";
import { zeigeErklaerungenWieder } from "../werkzeugkarten/useErklaerung";
import { setzeSymbol, useTourMerker } from "../../../tour/tourMerker";
import { starteTour } from "../../../tour/tourStand";

/** Bretter in Gruppen (seit 0.2.84): Farben, Holz, Material. */
const BRETTGRUPPEN: readonly { titel: Textschluessel; werte: readonly Brettfarben[] }[] = [
  {
    titel: "einstellungen.brettfarben.gruppe.farben",
    werte: ["buch", "gruen", "braun", "blau", "sand", "koralle", "lavendel", "nacht"],
  },
  // Holz und Material in einer Gruppe (0.2.87, Wunsch des Autors).
  {
    titel: "einstellungen.brettfarben.gruppe.holzMaterial",
    werte: ["holz", "intarsie-ahorn", "holz-klassisch", "marmor-gruen"],
  },
];
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
const VOR_WERKZEUGEN: readonly VorWerkzeugen[] = ["aus", "an"];
const KOORDINATEN = ["an", "aus"] as const;
type Koordinaten = (typeof KOORDINATEN)[number];

/**
 * Ein Schalter an/aus, gemerkt auf dem Gerät (Voreinstellung: an).
 * Beispiel: Merker „koordinaten“ auf „aus“ blendet a–h und 1–8 aus; Merker „wischen“ auf „aus“
 * lässt Figuren nur noch antippen.
 */
function MerkerWahl({
  merker,
  schluessel,
}: {
  merker: string;
  schluessel:
    | "einstellungen.koordinaten"
    | "einstellungen.wischen"
    | "einstellungen.zuganimation"
    | "einstellungen.startanimation";
}) {
  const [wert, setzeWert] = useState<Koordinaten>(liesMerker(merker) === "aus" ? "aus" : "an");
  return (
    <Auswahl
      name={t(schluessel)}
      werte={KOORDINATEN}
      gewaehlt={wert}
      text={(w) => t(`${schluessel}.${w}`)}
      beiWahl={(neu) => {
        schreibeMerker(merker, neu);
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

type Bereich = "brett" | "bedienung" | "anzeige" | "training" | "bots" | "hilfe";
const BEREICHE: readonly {
  wert: Bereich;
  text: Textschluessel;
  symbol: LucideIcon;
  /** Ziel-Kennung für die Tour der Einstellungen (tour/touren.ts). */
  tour: string;
}[] = [
  {
    wert: "brett",
    text: "einstellungen.reiter.brett",
    symbol: Grid3x3,
    tour: "einstellungen-reiter-brett",
  },
  {
    wert: "bedienung",
    text: "einstellungen.reiter.bedienung",
    symbol: Pointer,
    tour: "einstellungen-reiter-bedienung",
  },
  {
    wert: "anzeige",
    text: "einstellungen.reiter.anzeige",
    symbol: Palette,
    tour: "einstellungen-reiter-anzeige",
  },
  {
    wert: "training",
    text: "einstellungen.reiter.training",
    symbol: Brain,
    tour: "einstellungen-reiter-training",
  },
  // Seit 0.2.143: Maia-Zusatzpaket für menschlichere Bots (MaiaWahl.tsx).
  {
    wert: "bots",
    text: "einstellungen.reiter.bots",
    symbol: Bot,
    tour: "einstellungen-reiter-bots",
  },
  {
    wert: "hilfe",
    text: "einstellungen.reiter.hilfe",
    symbol: LifeBuoy,
    tour: "einstellungen-reiter-hilfe",
  },
];

/** Brett: Farben und Figuren mit Vorschau, Koordinaten (wie das Brett aussieht). */
function BrettBereich() {
  const einstellungen = useEinstellungen();
  return (
    <>
      <Vorschauwahl
        name={t("einstellungen.brettfarben")}
        gruppen={BRETTGRUPPEN.map((g) => ({ ...g, titel: t(g.titel) }))}
        gewaehlt={einstellungen.brettfarben}
        text={(wert) => t(`einstellungen.brettfarben.${wert}`)}
        vorschau={(wert) => <Brettausschnitt farben={wert} satz={einstellungen.figurensatz} />}
        beiWahl={(brettfarben) => aendereEinstellungen({ brettfarben })}
      />
      <FigurenBereich />
      <MerkerWahl merker="koordinaten" schluessel="einstellungen.koordinaten" />
    </>
  );
}

/** Bedienung: Ziehen per Wischen, Bewegungen und Ton (wie die App reagiert). */
function BedienungBereich() {
  return (
    <>
      <MerkerWahl merker={MERKER_WISCHEN} schluessel="einstellungen.wischen" />
      <p className="hinweis">{t("einstellungen.wischen.hinweis")}</p>
      <MerkerWahl merker={MERKER_ZUGANIMATION} schluessel="einstellungen.zuganimation" />
      <p className="hinweis">{t("einstellungen.zuganimation.hinweis")}</p>
      <MerkerWahl merker={MERKER_STARTANIMATION} schluessel="einstellungen.startanimation" />
      <p className="hinweis">{t("einstellungen.startanimation.hinweis")}</p>
      <TonBereich />
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

/**
 * Toursymbol an oder aus und der Rundgang durch die App (seit P8, Wunsch des Autors R52). Ist das
 * Symbol aus, bleibt der Rundgang über den Knopf erreichbar.
 */
function TourWahl() {
  const merker = useTourMerker();
  return (
    <>
      <Auswahl
        name={t("einstellungen.toursymbol")}
        werte={KOORDINATEN}
        gewaehlt={merker.symbolAn ? "an" : "aus"}
        text={(w) => t(`einstellungen.toursymbol.${w}`)}
        beiWahl={(neu) => setzeSymbol(neu === "an")}
      />
      <div className="einstellung-rundgang">
        <p className="hinweis">{t("einstellungen.toursymbol.hinweis")}</p>
        <button type="button" className="knopf-zweit" onClick={() => starteTour("haupt")}>
          {t("einstellungen.rundgang")}
        </button>
      </div>
    </>
  );
}

/** Anzeige: Nachtmodus, Schriftgröße, Sprache. */
function AnzeigeBereich() {
  return (
    <>
      <NachtmodusWahl />
      <SchriftgroesseWahl />
      <SprachWahl />
    </>
  );
}

/** Hilfe: Toursymbol, Rundgang und ausgeblendete Erklärkacheln wieder zeigen. */
function HilfeBereich() {
  return (
    <>
      <TourWahl />
      <ErklaerungenWahl />
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
 * Training: „Erst selbst denken“. Der Schalter „Genauigkeit wie“ (0.2.83 bis 0.2.86 hier) steht
 * seit 0.2.87 nur noch in der Auswertung einer Partie (Spielstaerke.tsx): Nur dort zeigt die App
 * Genauigkeiten (Wunsch des Autors).
 */
function TrainingBereich() {
  const einstellungen = useEinstellungen();
  return (
    <>
      <Auswahl
        name={t("einstellungen.strenge")}
        werte={STRENGEN}
        gewaehlt={einstellungen.strenge}
        text={(wert) => t(`einstellungen.strenge.${wert}`)}
        beiWahl={(strenge) => aendereEinstellungen({ strenge })}
      />
      <p className="hinweis">{t(`einstellungen.strenge.${einstellungen.strenge}.text`)}</p>
      <Auswahl
        name={t("einstellungen.vorWerkzeugen")}
        werte={VOR_WERKZEUGEN}
        gewaehlt={einstellungen.vorWerkzeugen}
        text={(wert) => t(`einstellungen.vorWerkzeugen.${wert}`)}
        beiWahl={(vorWerkzeugen) => aendereEinstellungen({ vorWerkzeugen })}
      />
      <p className="hinweis">{t("einstellungen.vorWerkzeugen.text")}</p>
    </>
  );
}

const INHALT: Readonly<Record<Bereich, () => React.ReactNode>> = {
  brett: () => <BrettBereich />,
  bedienung: () => <BedienungBereich />,
  anzeige: () => <AnzeigeBereich />,
  training: () => <TrainingBereich />,
  bots: () => <MaiaWahl />,
  hilfe: () => <HilfeBereich />,
};

/**
 * Die Einstellungen in Reitern (Training, Brett, Bedienung, Anzeige, Bots, Hilfe), etwa
 * Brettfarben, Figurensatz, Ton, Strenge und Sprache.
 */
export function EinstellungenKarte() {
  // Beim Öffnen steht der Reiter „Training“ vorn (Wunsch des Autors, 19.10.2026): Dort stellt man
  // am häufigsten etwas um; Brett und Figuren wählt man meist nur einmal.
  const [bereich, setzeBereich] = useState<Bereich>("training");
  return (
    <section className="karte" data-testid="darstellung">
      <Reiter
        name={t("ich.titel")}
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
