/**
 * Zeilen der Reiter „Bedienung“ und „Hilfe“: Schalter, die auf dem Gerät gemerkt werden, dazu Ton,
 * Toursymbol, Rundgang und die Erklärkacheln.
 *
 * Rolle im Gesamtbild: Entwurf K2 (Wahl des Autors, 31.10.2026): je Einstellung eine Zeile mit
 * Schalter, die Erklärung hinter dem Fragezeichen. Die Bedienungsschalter stehen als Liste
 * (`BEDIENUNGSSCHALTER`); ein neuer Schalter ist eine Zeile darin (eintragen statt umbauen).
 * Merker wie Wischen gelten für das Gerät (app/merker.ts); der Ton gilt für die Einstellungen.
 * Abhängigkeiten: app/merker.ts, app/einstellungen.ts, app/feiereffekte.ts, brett/useZiehen,
 * brett/useZuganimation, rahmen/Startanimation, tour/, werkzeugkarten/useErklaerung, i18n.
 */
import {
  Compass,
  Footprints,
  Hand,
  Lightbulb,
  Play,
  Route,
  Sparkles,
  Volume2,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { aendereEinstellungen, useEinstellungen } from "../../../app/einstellungen";
import { MERKER_FEIEREFFEKTE } from "../../../app/feiereffekte";
import { liesMerker, schreibeMerker } from "../../../app/merker";
import { t, type Textschluessel } from "../../../i18n/sprache";
import { setzeSymbol, useTourMerker } from "../../../tour/tourMerker";
import { starteTour } from "../../../tour/tourStand";
import { MERKER_WISCHEN } from "../../brett/useZiehen";
import { MERKER_ZUGANIMATION } from "../../brett/useZuganimation";
import { MERKER_STARTANIMATION } from "../rahmen/Startanimation";
import { zeigeErklaerungenWieder } from "../werkzeugkarten/useErklaerung";
import { Einstellungszeile, Schalter } from "./Einstellungszeile";

/** Ein Schalter, gemerkt auf dem Gerät (Voreinstellung: an, gespeichert als „an“ oder „aus“). */
export interface Merkerschalter {
  readonly merker: string;
  readonly symbol: LucideIcon;
  readonly name: Textschluessel;
  readonly erklaerung: Textschluessel;
}

/** Schalter des Reiters „Bedienung“ in der Reihenfolge des Entwurfs; der Ton steht dazwischen. */
const BEDIENUNGSSCHALTER: readonly Merkerschalter[] = [
  {
    merker: MERKER_WISCHEN,
    symbol: Hand,
    name: "einstellungen.wischen",
    erklaerung: "einstellungen.wischen.hinweis",
  },
  {
    merker: MERKER_ZUGANIMATION,
    symbol: Route,
    name: "einstellungen.zuganimation",
    erklaerung: "einstellungen.zuganimation.hinweis",
  },
];
const FEIERSCHALTER: readonly Merkerschalter[] = [
  {
    merker: MERKER_FEIEREFFEKTE,
    symbol: Sparkles,
    name: "einstellungen.feiereffekte",
    erklaerung: "einstellungen.feiereffekte.hinweis",
  },
  {
    merker: MERKER_STARTANIMATION,
    symbol: Play,
    name: "einstellungen.startanimation",
    erklaerung: "einstellungen.startanimation.hinweis",
  },
];

/**
 * Eine Zeile mit Schalter für einen Merker auf dem Gerät.
 * Beispiel: Merker „wischen“ auf „aus“ lässt Figuren nur noch antippen.
 */
export function MerkerZeile({ schalter }: { schalter: Merkerschalter }) {
  const [an, setzeAn] = useState(liesMerker(schalter.merker) !== "aus");
  const name = t(schalter.name);
  return (
    <Einstellungszeile
      symbol={schalter.symbol}
      name={name}
      erklaerung={t(schalter.erklaerung)}
      rechts={
        <Schalter
          name={name}
          an={an}
          beiWechsel={(neu) => {
            schreibeMerker(schalter.merker, neu ? "an" : "aus");
            setzeAn(neu);
          }}
        />
      }
    />
  );
}

/** Ton bei Zug und Schlag (Einstellung „ton“, nicht nur auf dem Gerät gemerkt). */
function TonZeile() {
  const { ton } = useEinstellungen();
  const name = t("einstellungenneu.ton");
  return (
    <Einstellungszeile
      symbol={Volume2}
      name={name}
      erklaerung={t("einstellungen.ton.hinweis")}
      rechts={
        <Schalter
          name={name}
          an={ton === "an"}
          beiWechsel={(an) => aendereEinstellungen({ ton: an ? "an" : "aus" })}
        />
      }
    />
  );
}

/** Reiter „Bedienung“: Wischen, Gleiten, Ton, Feiereffekte, Startbild (wie die App reagiert). */
export function BedienungZeilen() {
  return (
    <>
      {BEDIENUNGSSCHALTER.map((s) => (
        <MerkerZeile key={s.merker} schalter={s} />
      ))}
      <TonZeile />
      {FEIERSCHALTER.map((s) => (
        <MerkerZeile key={s.merker} schalter={s} />
      ))}
    </>
  );
}

/** Toursymbol oben rechts an oder aus (seit P8, R52). */
function ToursymbolZeile() {
  const merker = useTourMerker();
  const name = t("einstellungenneu.toursymbol");
  return (
    <Einstellungszeile
      symbol={Compass}
      name={name}
      erklaerung={t("einstellungenneu.toursymbol.hinweis")}
      rechts={<Schalter name={name} an={merker.symbolAn} beiWechsel={setzeSymbol} />}
    />
  );
}

/** Holt die ausgeblendeten Erklärkacheln zurück und bestätigt es. */
function ErklaerungenZeile() {
  const [gezeigt, setzeGezeigt] = useState(false);
  return (
    <Einstellungszeile
      symbol={Lightbulb}
      name={t("einstellungen.erklaerungen")}
      rechts={
        <button
          type="button"
          className="knopf-zweit einstellungszeile-knopf"
          onClick={() => {
            zeigeErklaerungenWieder();
            setzeGezeigt(true);
          }}
        >
          {t("einstellungen.erklaerungen.zeigen")}
        </button>
      }
      unten={
        gezeigt && (
          <p className="hinweis einstellungszeile-erklaerung" role="status">
            {t("einstellungen.erklaerungen.gezeigt")}
          </p>
        )
      }
    />
  );
}

/** Reiter „Hilfe“: Toursymbol, Rundgang, ausgeblendete Erklärkacheln wieder zeigen. */
export function HilfeZeilen() {
  return (
    <>
      <ToursymbolZeile />
      <Einstellungszeile
        symbol={Footprints}
        name={t("einstellungen.rundgang")}
        rechts={
          <button
            type="button"
            className="knopf-zweit einstellungszeile-knopf"
            aria-label={t("einstellungen.rundgang")}
            onClick={() => starteTour("haupt")}
          >
            {t("einstellungenneu.starten")}
          </button>
        }
      />
      <ErklaerungenZeile />
    </>
  );
}
