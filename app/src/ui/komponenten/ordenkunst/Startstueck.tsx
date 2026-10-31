/**
 * Das Orden oder Abzeichen in der Startanimation: neues Stück mit Flug ins Profil oder das Stück
 * des Tages. Springer und Titel bleiben unverändert (Wunsch des Autors, 30.10.2026).
 *
 * Rolle im Gesamtbild: useStartorden.tsx entscheidet, was erscheint; diese Ebene zeigt es. Sie liegt
 * über allem (Portal in document.body), damit das Stück beim Ausblenden der Fläche noch zum Reiter
 * „Profil“ fliegen kann. Die Abläufe stehen als CSS-Animationen in ui/stil/ordenkunst.css, mit
 * Verzögerung ab dem Stillstand des Logos. Lage unter dem Titel, Ziel des Flugs und Versatz (so
 * viel später als die Startanimation erscheint die Ebene) setzt sie als CSS-Variablen. Ein Tipp
 * beendet die Startanimation; dann verschwindet auch diese Ebene, der goldene Punkt bleibt.
 * Abhängigkeiten: startorden.ts, entwuerfe.ts, Ordenkunst.tsx, i18n.
 */
import { useEffect, useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { t } from "../../../i18n/sprache";
import { ABZEICHENKENNUNGEN, ORDENKENNUNGEN } from "./entwuerfe";
import { Ordenkunst } from "./Ordenkunst";
import { merkeUngesehen, type Startplan } from "./startorden";

/** Alle Stücke mit eigenem Bild (für „14 von 36“). */
const GESAMT = ORDENKENNUNGEN.length + ABZEICHENKENNUNGEN.length;
/** Anteil des Raums zwischen Titel und unterem Rand, in dem das Stück steht. */
const LAGE_UNTER_TITEL = 0.42;
/** So viel Platz bleibt mindestens unter dem Stück für Name und Leiste (px). */
const PLATZ_UNTEN = 90;
/** Ohne Titel (sollte nicht vorkommen): Lage als Anteil der Höhe. */
const LAGE_OHNE_TITEL = 0.62;
/** Das Stück fliegt auf diese Höhe im Reiter (Mitte des Symbols, px unter seiner Oberkante). */
const SYMBOLMITTE = 12;

/** Setzt Lage, Ziel des Flugs und Versatz als CSS-Variablen an die Ebene. */
function setzeLage(ebene: HTMLElement, beginn: number): void {
  const titel = document.querySelector(".startanimation-titel")?.getBoundingClientRect();
  const profil = document
    .querySelector('.leiste [data-tour="leiste-einstellungen"]')
    ?.getBoundingClientRect();
  const hoehe = window.innerHeight;
  const oben = titel ? titel.bottom : hoehe * LAGE_OHNE_TITEL;
  const mitte = Math.min(oben + (hoehe - oben) * LAGE_UNTER_TITEL, hoehe - PLATZ_UNTEN);
  const zielX = profil ? profil.left + profil.width / 2 - window.innerWidth / 2 : 0;
  const zielY = profil ? profil.top + SYMBOLMITTE - mitte : hoehe - mitte;
  ebene.style.setProperty("--startstueck-versatz", `${Date.now() - beginn}ms`);
  ebene.style.setProperty("--startstueck-y", `${Math.round(mitte)}px`);
  ebene.style.setProperty("--startstueck-ziel-x", `${Math.round(zielX)}px`);
  ebene.style.setProperty("--startstueck-ziel-y", `${Math.round(zielY)}px`);
}

/**
 * Die Ebene. `beginn`: Zeitpunkt des Starts der Startanimation (Date.now()).
 * Beispiel: neuer Orden „Teil Endspiel“ → Strahlenstern unter dem Titel, „Neuer Orden“, Name,
 * dann Flug zu „Profil“. Sonderfall: Überspringen vor der Ankunft setzt den Punkt trotzdem.
 */
export function Startstueck({
  plan,
  beginn,
}: {
  plan: Exclude<Startplan, { art: "nichts" }>;
  beginn: number;
}) {
  const ebene = useRef<HTMLDivElement>(null);
  const gemerkt = useRef(false);
  const neu = plan.art === "neu";
  useLayoutEffect(() => {
    if (ebene.current) setzeLage(ebene.current, beginn);
  }, [beginn]);
  useEffect(() => {
    const merke = gemerkt;
    return () => {
      if (neu && !merke.current) merkeUngesehen(plan.stueck);
      merke.current = true;
    };
  }, [neu, plan.stueck]);
  const ankunft = (name: string) => {
    if (name !== "startstueck-flug" || !neu || gemerkt.current) return;
    gemerkt.current = true;
    merkeUngesehen(plan.stueck);
  };
  const oben = neu
    ? t(plan.stueck.art === "orden" ? "startorden.neuerOrden" : "startorden.neuesAbzeichen")
    : t("startorden.sammlung", { verdient: String(plan.verdient), gesamt: String(GESAMT) });
  const weitere =
    neu && plan.weitere > 0 ? t("startorden.weitere", { anzahl: String(plan.weitere) }) : "";
  return createPortal(
    <div
      ref={ebene}
      className={`startstueck ${neu ? "startstueck-neu" : "startstueck-tag"}`}
      aria-hidden="true"
      data-testid="startstueck"
    >
      <div className="startstueck-bild" onAnimationEnd={(e) => ankunft(e.animationName)}>
        <span className="startstueck-strahlen" />
        <Ordenkunst
          art={plan.stueck.art}
          kennung={plan.stueck.kennung}
          beschriftung={plan.stueck.name}
        />
      </div>
      <div className="startstueck-zeile">
        <div className="startstueck-art">{oben}</div>
        <div className="startstueck-name">{plan.stueck.name}</div>
        {weitere && <div className="startstueck-weitere">{weitere}</div>}
      </div>
    </div>,
    document.body,
  );
}
