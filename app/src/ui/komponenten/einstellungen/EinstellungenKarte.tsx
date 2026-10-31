/**
 * Karte „Einstellungen“: Brett, Figuren, Bedienung, Anzeige, Bots und Hilfen in Reitern.
 *
 * Rolle im Gesamtbild: Pflichtenheft 4 „Einstellungen: Sprache, Brettfarben, Figurensatz, Ton,
 * Auflage des Buches, Strenge des Modus ‚Erst selbst denken‘“. Die Auflage zeigt die Zeile
 * „Datenstand“ darüber. Die Karte steht auf dem Bildschirm „Einstellungen“ und braucht keine
 * eigene Überschrift.
 * Reiter mit Symbolen (Wunsch des Autors, 18.10.2026: nicht alles auf einmal untereinander),
 * geordnet nach dem Wunsch des Autors vom 25.10.2026:
 * - Brett: wie das Brett aussieht (Brettfarben und Figurensätze als Kacheln mit Vorschau, in
 *   Gruppen; Koordinaten),
 * - Bedienung: wie die App reagiert (Figuren per Wischen ziehen, Zuganimation, Startanimation,
 *   Ton aus oder an),
 * - Anzeige: Nachtmodus (wie das Gerät, aus oder an, app/farbschema.ts), Schrift, Sprache,
 * - Bots: das Maia-Zusatzpaket (MaiaWahl.tsx),
 * - Hilfe: Toursymbol, Rundgang (P8, R52) und ausgeblendete Erklärkacheln wieder anzeigen.
 * Seit 0.3.2 gibt es den Reiter „Training“ nicht mehr (Wunsch des Autors, 26.10.2026): „Erst selbst
 * denken“ gilt fest in der lockeren Form, und die Einschätzung vor den Werkzeugen ist immer aus.
 * Merker wie Wischen und Koordinaten gelten für das Gerät (app/merker.ts).
 * Abhängigkeiten: app/einstellungen.ts, app/farbschema.ts, app/merker.ts, Reiter, Vorschauwahl,
 * tour/, SprachWahl, i18n.
 */
import { Bot, Grid3x3, LifeBuoy, Palette, Pointer, type LucideIcon } from "lucide-react";
import { useState } from "react";
import {
  aendereEinstellungen,
  BILDSAETZE,
  useEinstellungen,
  type Brettfarben,
  type Figurensatz,
  type Ton,
} from "../../../app/einstellungen";
import {
  FARBSCHEMATA,
  liesFarbschema,
  setzeFarbschema,
  type Farbschema,
} from "../../../app/farbschema";
import { MERKER_FEIEREFFEKTE } from "../../../app/feiereffekte";
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
    | "einstellungen.startanimation"
    | "einstellungen.feiereffekte";
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

type Bereich = "brett" | "bedienung" | "anzeige" | "bots" | "hilfe";
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
      <MerkerWahl merker={MERKER_FEIEREFFEKTE} schluessel="einstellungen.feiereffekte" />
      <p className="hinweis">{t("einstellungen.feiereffekte.hinweis")}</p>
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

const INHALT: Readonly<Record<Bereich, () => React.ReactNode>> = {
  brett: () => <BrettBereich />,
  bedienung: () => <BedienungBereich />,
  anzeige: () => <AnzeigeBereich />,
  bots: () => <MaiaWahl />,
  hilfe: () => <HilfeBereich />,
};

/**
 * Die Einstellungen in Reitern (Brett, Bedienung, Anzeige, Bots, Hilfe), etwa
 * Brettfarben, Figurensatz, Ton und Sprache.
 */
export function EinstellungenKarte() {
  // Beim Öffnen steht der Reiter „Brett“ vorn (seit 0.3.2, nachdem „Training“ entfallen ist).
  const [bereich, setzeBereich] = useState<Bereich>("brett");
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
