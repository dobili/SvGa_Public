/**
 * Zugleiste einer Variante: Pfad in der Nebenvariante, die Zeile mit Gabel-Marken und
 * Kommentarpunkten, die Chips „Weiter: …“ am Abzweig und die vier Zugknöpfe.
 *
 * Rolle im Gesamtbild: Frage b des Entwurfs (Empfehlung B): eine Zeile wie an den Abbildungen
 * (brettbedienung/Zugleiste.tsx), nur die Linie, auf der der Leser ist. Hinter einem Zug mit
 * mehreren Fortsetzungen steht eine Gabel mit Zahl; ein goldener Punkt zeigt einen Kommentar
 * (Frage d). Eigene Züge stehen in Gold, Züge der Engine mit kleinem Chip-Zeichen. Langes Drücken
 * auf einen Zug öffnet das Menü am Zug (Zugmenue.tsx). Die Chips tragen dieselben Zeichen wie die
 * blauen Pfeile am Brett (Fortsetzungspfeile.tsx): Stern für die Hauptfortsetzung, sonst die Zahl.
 * Stufe 3: Nach der Analyse steht hinter jedem Zug die Marke seiner Zugart (dieselbe wie in der
 * Partieauswertung, Klassenmarke), solange der Schalter „Symbole“ an ist.
 * Abhängigkeiten: schach/variationsbaum.ts, Zugknoepfe.tsx, useLangerDruck.ts, i18n, lucide.
 */
import { Cpu, GitFork, Undo2 } from "lucide-react";
import { Fragment, useEffect, useRef } from "react";
import { sprache, t } from "../../../i18n/sprache";
import {
  hauptvariantenAnteil,
  zeileDurch,
  type Leistenzug,
  type Pfad,
} from "../../../schach/variationsbaum";
import type { Zugklasse } from "../../../spiel/auswertung";
import { pfadSchluessel } from "../../../spiel/variationsurteile";
import { Klassenmarke } from "../auswertung/Auswertungssymbole";
import { useLangerDruck } from "../bausteine/useLangerDruck";
import { Zugknoepfe } from "../brettbedienung/Zugknoepfe";
import { fortsetzungschips } from "./fortsetzungen";
import type { Variantenanalyse } from "./useVariantenanalyse";
import type { Variantenstand } from "./useVariante";
import { nummerVor } from "./variantentexte";

const SYMBOL = 14;
/** So lange drückt man auf einen Zug, bis das Menü aufgeht (wie lange Druck sonst im Handy). */
const LANGER_DRUCK_MS = 500;

/** Marke der Zugart (Stufe 3) mit Text für Bildschirmleser; ohne Klasse nichts. */
function Zugartmarke({ klasse }: { klasse: Zugklasse | null }) {
  if (!klasse) return null;
  return (
    <>
      <Klassenmarke klasse={klasse} />
      <span className="nur-vorlesen">{t(`zugklasse.${klasse}`)}</span>
    </>
  );
}

/** Ein Zug der Zeile: Tipp springt hin, langer Druck öffnet das Menü. */
function Zugknopf({
  zug,
  erster,
  aktuell,
  klassenmarke,
  beiTipp,
  beiMenue,
}: {
  zug: Leistenzug;
  erster: boolean;
  aktuell: boolean;
  /** Zugart nach der Analyse (Stufe 3), sonst null. */
  klassenmarke: Zugklasse | null;
  beiTipp: () => void;
  beiMenue: () => void;
}) {
  const druck = useLangerDruck(LANGER_DRUCK_MS, beiMenue);
  const { warLang, ...ereignisse } = druck;
  const klasse = ["zug", zug.eigen ? "eigen" : "", zug.engine ? "engine" : ""].join(" ").trim();
  return (
    <button
      type="button"
      className={klasse}
      aria-current={aktuell ? "step" : undefined}
      onClick={() => {
        if (!warLang()) beiTipp();
      }}
      {...ereignisse}
    >
      {nummerVor(zug, erster)}
      {zug.text}
      {zug.engine && (
        <Cpu className="zug-engine" size={SYMBOL} aria-label={t("varianten.engineZug")} />
      )}
      <Zugartmarke klasse={klassenmarke} />
      {zug.kommentiert && (
        <span className="kommentarpunkt" aria-label={t("varianten.hatKommentar")} />
      )}
    </button>
  );
}

/** Gabel mit Zahl hinter einem Zug mit mehreren Fortsetzungen. */
function Gabel({ anzahl }: { anzahl: number }) {
  return (
    <span className="gabelmarke" title={t("varianten.abzweige", { anzahl })}>
      <GitFork size={SYMBOL} aria-hidden="true" />
      <span aria-label={t("varianten.abzweige", { anzahl })}>{anzahl}</span>
    </span>
  );
}

/** Scrollt nur die Zeile, bis der aktuelle Zug sichtbar ist (wie Zugleiste.tsx). */
function useSichtbar(pfad: Pfad) {
  const behaelter = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const knopf = behaelter.current?.querySelector<HTMLElement>('[aria-current="step"]');
    const kasten = behaelter.current;
    if (!knopf || !kasten) return;
    const oben = knopf.offsetTop;
    const drin =
      oben >= kasten.scrollTop &&
      oben + knopf.offsetHeight <= kasten.scrollTop + kasten.clientHeight;
    if (!drin) kasten.scrollTop = oben - kasten.clientHeight / 2;
  }, [pfad]);
  return behaelter;
}

/** Die Zugart eines Zuges, wenn die Symbole an sind (Stufe 3). */
function klasseAm(analyse: Variantenanalyse, pfad: Pfad): Zugklasse | null {
  if (!analyse.zeige.symbole) return null;
  return analyse.urteile.get(pfadSchluessel(pfad))?.klasse ?? null;
}

/** Die Zeile durch den gezeigten Pfad. */
function Zeile({
  stand,
  analyse,
  beiMenue,
}: {
  stand: Variantenstand;
  analyse: Variantenanalyse;
  beiMenue: (p: Pfad) => void;
}) {
  const zeile = zeileDurch(stand.variation, stand.pfad, sprache());
  const behaelter = useSichtbar(stand.pfad);
  if (zeile.length === 0) return <p className="hinweis">{t("varianten.nochKeineZuege")}</p>;
  return (
    <p
      ref={behaelter}
      className="zugzeile"
      aria-label={t("zugleiste.zeile")}
      data-testid="variantenzeile"
    >
      {zeile.map((zug, index) => (
        <Fragment key={zug.pfad.join(" ")}>
          <span className="zug-gruppe">
            <Zugknopf
              zug={zug}
              erster={index === 0}
              aktuell={index === stand.pfad.length - 1}
              klassenmarke={klasseAm(analyse, zug.pfad)}
              beiTipp={() => stand.springe(zug.pfad)}
              beiMenue={() => beiMenue(zug.pfad)}
            />
            {zug.abzweige > 0 && <Gabel anzahl={zug.abzweige} />}
          </span>{" "}
        </Fragment>
      ))}
    </p>
  );
}

/** „Hauptvariante › 3... Sxe4?!“ mit Rücksprung, nur in einer Nebenvariante. */
function Pfadzeile({ stand }: { stand: Variantenstand }) {
  const anteil = hauptvariantenAnteil(stand.variation, stand.pfad);
  if (anteil.length === stand.pfad.length) return null;
  const abzweig = zeileDurch(stand.variation, stand.pfad, sprache())[anteil.length];
  return (
    <p className="variantenpfad" data-testid="variantenpfad">
      <GitFork size={SYMBOL} aria-hidden="true" />
      <span>{t("varianten.hauptvariante")}</span>
      <span aria-hidden="true">›</span>
      <strong>{abzweig ? nummerVor(abzweig, true) + abzweig.text : ""}</strong>
      <button type="button" className="knopf-link klein" onClick={() => stand.springe(anteil)}>
        <Undo2 size={SYMBOL} aria-hidden="true" /> {t("varianten.zurHauptvariante")}
      </button>
    </p>
  );
}

/** „Weiter:“ mit allen Fortsetzungen, nur an einem Abzweig. */
function Weiterchips({ stand }: { stand: Variantenstand }) {
  const chips = fortsetzungschips(stand.variation, stand.pfad, sprache());
  if (chips.length < 2) return null;
  return (
    <p className="abzweigungen weiterchips" data-testid="weiterchips">
      <span>{t("varianten.weiter")}</span>
      {chips.map((chip) => (
        <button
          key={chip.pfad.join(" ")}
          type="button"
          className={chip.haupt ? "chip weiterchip haupt" : "chip weiterchip"}
          onClick={() => stand.springe(chip.pfad)}
        >
          <span className="weiterchip-marke" aria-hidden="true">
            {chip.marke}
          </span>
          {chip.text}
        </button>
      ))}
    </p>
  );
}

/** Die Zugleiste der Variante mit Knöpfen; ``beiMenue`` öffnet das Menü am Zug. */
export function Variantenleiste({
  stand,
  analyse,
  beiMenue,
}: {
  stand: Variantenstand;
  analyse: Variantenanalyse;
  beiMenue: (pfad: Pfad) => void;
}) {
  const zurueckAus = !stand.kann.zurueck;
  const vorAus = !stand.kann.vor;
  return (
    <section
      className="zugleiste variantenleiste"
      aria-label={t("zugleiste.titel")}
      data-tour="variante-leiste"
    >
      <Pfadzeile stand={stand} />
      <Zeile stand={stand} analyse={analyse} beiMenue={beiMenue} />
      <Weiterchips stand={stand} />
      <Zugknoepfe
        gesperrt={{ anfang: zurueckAus, zurueck: zurueckAus, vor: vorAus, ende: vorAus }}
        beiRichtung={stand.schritt}
      />
    </section>
  );
}
