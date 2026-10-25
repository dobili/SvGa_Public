/**
 * Die gespielten Züge einer Partie mit Zugnavigation: Anfang, Halbzug zurück, vor, Ende.
 *
 * Rolle im Gesamtbild: Teil des Partie-Bildschirms (Bildschirmentwurf „Partie“, Zugliste unter
 * dem Brett). Ein Tipp auf einen Zug zeigt die Stellung danach; gezogen wird nur in der
 * aktuellen Stellung. Auch in der ruhigen Ansicht sichtbar (Wunsch des Autors: Brett,
 * Zugnavigation und gespielte Züge). Seit 0.2.43 (Wunsch des Autors) steht vor dem ersten Zug
 * des Mittelspiels ein „M“ und vor dem ersten Zug des Endspiels ein „E“, wie in der Kurve.
 * Seit 0.2.130 (Wunsch des Autors, 25.10.2026) steht nach der Auswertung hinter jedem Zug die
 * runde Marke seiner Zugklasse wie in „Deine Züge“ (statt des Zeichens als Text); Bildschirmleser
 * hören den Namen der Klasse.
 * Abhängigkeiten: schach/weiterspielen.ts (Züge mit Nummern), spiel/phasen.ts, i18n, lucide-react,
 * Auswertungssymbole.tsx.
 */
import { ChevronFirst, ChevronLast, StepBack, StepForward } from "lucide-react";
import { Fragment, useEffect, useRef } from "react";
import { sprache, t } from "../../i18n/sprache";
import { eigeneAlsText } from "../../schach/weiterspielen";
import type { Zugklasse } from "../../spiel/auswertung";
import { phasenwechsel, type Phase } from "../../spiel/phasen";
import { Klassenmarke } from "./Auswertungssymbole";

const SYMBOLGROESSE = 22;
const PHASENBUCHSTABE: Readonly<Record<Phase, string>> = {
  eroeffnung: "",
  mittelspiel: "M",
  endspiel: "E",
};

/**
 * Rollt die Zugzeile waagerecht, bis der gezeigte Zug (sonst der letzte) sichtbar ist.
 * Warum nicht scrollIntoView: Das würde auch die ganze Seite verschieben (wie in Zugleiste.tsx).
 * Seit DS48 (0.2.130) steht die Zeile in der Partie einzeilig neben den Zugknöpfen.
 */
function rolleZumZug(zeile: HTMLElement | null): void {
  if (!zeile) return;
  const knopf =
    zeile.querySelector<HTMLElement>('[aria-current="step"]') ??
    zeile.querySelector<HTMLElement>(".zug:last-of-type");
  if (!knopf) return;
  const links = knopf.offsetLeft;
  const sichtbar =
    links >= zeile.scrollLeft && links + knopf.offsetWidth <= zeile.scrollLeft + zeile.clientWidth;
  if (!sichtbar) zeile.scrollLeft = links - zeile.clientWidth / 2;
}

/** Je Halbzug (Index) die Phase, die mit der Stellung nach ihm beginnt, falls eine beginnt. */
function phasenmarken(phasen: readonly Phase[]): ReadonlyMap<number, Phase> {
  const wechsel = phasenwechsel(phasen);
  const marken = new Map<number, Phase>();
  for (const ph of ["mittelspiel", "endspiel"] as const) {
    const stelle = wechsel[ph];
    // Stelle ist der Index der ersten Stellung der Phase; der Zug davor hat den Index Stelle − 1.
    if (stelle !== null && stelle > 0) marken.set(stelle - 1, ph);
  }
  return marken;
}

/** Text des Zuges mit Marke der Klasse (falls bekannt), sonst mit dem Zugzeichen als Text. */
function Zugtext({
  text,
  zeichen,
  klasse,
}: {
  text: string;
  zeichen: string | null;
  klasse: Zugklasse | null;
}) {
  if (!klasse) return <>{`${text}${zeichen ?? ""}`}</>;
  return (
    <>
      {text}
      <Klassenmarke klasse={klasse} />
    </>
  );
}

/**
 * Eingaben: Startstellung, Züge in SAN, gezeigte Stelle (Zahl der Halbzüge), Zugzeichen und
 * Zugklassen der Auswertung je Halbzug (nach dem Ende), Phase je Stellung (für „M“ und „E“),
 * Wechsel der Stelle.
 * Beispiel: 1. e4 e5 2. Sf3, Stelle 3 → „2. Sf3“ hervorgehoben.
 */
export function Partiezuege({
  startFen,
  zuege,
  stelle,
  zeichen = [],
  klassen = [],
  phasen = [],
  beiStelle,
}: {
  startFen: string;
  zuege: readonly string[];
  stelle: number;
  zeichen?: readonly (string | null)[];
  klassen?: readonly (Zugklasse | null)[];
  phasen?: readonly Phase[];
  beiStelle: (stelle: number) => void;
}) {
  const texte = eigeneAlsText(startFen, zuege, sprache());
  const marken = phasenmarken(phasen);
  const zeile = useRef<HTMLParagraphElement>(null);
  useEffect(() => rolleZumZug(zeile.current), [stelle, zuege.length]);
  const knopf = (
    richtung: "anfang" | "zurueck" | "vor" | "ende",
    ziel: number,
    symbol: React.ReactNode,
  ) => (
    <button
      type="button"
      className="knopf-symbol"
      aria-label={t(`zugleiste.${richtung}`)}
      disabled={ziel === stelle || ziel < 0 || ziel > zuege.length}
      onClick={() => beiStelle(ziel)}
    >
      {symbol}
    </button>
  );
  return (
    <section
      className="zugleiste partiezuege"
      aria-label={t("partie.zuege")}
      data-tour="partie-zuege"
    >
      <p className="zugzeile" data-testid="partiezuege" ref={zeile}>
        {texte.length === 0 && <span className="hinweis">{t("partie.nochKeineZuege")}</span>}
        {texte.map((text, index) => (
          <Fragment key={`${index}-${text}`}>
            {marken.has(index) && (
              <span
                className="zugphase"
                title={t(`phase.name.${marken.get(index) ?? "mittelspiel"}`)}
                aria-label={t(`phase.name.${marken.get(index) ?? "mittelspiel"}`)}
              >
                {PHASENBUCHSTABE[marken.get(index) ?? "mittelspiel"]}
              </span>
            )}
            <button
              type="button"
              className="zug"
              aria-current={index === stelle - 1 ? "step" : undefined}
              aria-label={
                klassen[index] ? `${text}, ${t(`zugklasse.${klassen[index]}`)}` : undefined
              }
              onClick={() => beiStelle(index + 1)}
            >
              <Zugtext
                text={text}
                zeichen={zeichen[index] ?? null}
                klasse={klassen[index] ?? null}
              />
            </button>{" "}
          </Fragment>
        ))}
      </p>
      <div className="zugknoepfe">
        {knopf("anfang", 0, <ChevronFirst size={SYMBOLGROESSE} />)}
        {knopf("zurueck", stelle - 1, <StepBack size={SYMBOLGROESSE} />)}
        {knopf("vor", stelle + 1, <StepForward size={SYMBOLGROESSE} />)}
        {knopf("ende", zuege.length, <ChevronLast size={SYMBOLGROESSE} />)}
      </div>
    </section>
  );
}
