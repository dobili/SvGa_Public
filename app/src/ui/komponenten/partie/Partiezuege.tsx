/**
 * Die gespielten Züge einer Partie mit Zugnavigation: Anfang, Halbzug zurück, vor, Ende.
 *
 * Rolle im Gesamtbild: Teil des Partie-Bildschirms (Bildschirmentwurf „Partie“, Zugliste unter
 * dem Brett). Ein Tipp auf einen Zug zeigt die Stellung danach; gezogen wird nur in der
 * aktuellen Stellung. Auch in der ruhigen Ansicht sichtbar (Wunsch des Autors: Brett,
 * Zugnavigation und gespielte Züge). Vor dem ersten Zug des Mittelspiels steht ein „M“, vor dem
 * ersten Zug des Endspiels ein „E“, wie in der Kurve (Wunsch des Autors).
 * Nach der Auswertung steht hinter jedem Zug die runde Marke seiner Zugklasse wie in „Deine
 * Züge“ (Wunsch des Autors, 25.10.2026); Bildschirmleser hören den Namen der Klasse.
 * Wunsch des Autors (26.10.2026: „Die Liste der gespielten Züge ist nur eine Zeile hoch. Bitte
 * ausklappbar machen.“): Ein Knopf neben der Zeile klappt alle Züge auf, umbrochen über mehrere
 * Zeilen; das Gerät merkt sich die Wahl. Die Zugknöpfe stehen darunter, „Zum Anfang“ und „Zum
 * Ende“ abgesetzt von „Zurück“ und „Vor“ (Zugknoepfe.tsx).
 * Abhängigkeiten: schach/weiterspielen.ts (Züge mit Nummern), spiel/phasen.ts, i18n, lucide-react,
 * app/merker.ts, Auswertungssymbole.tsx, Zugknoepfe.tsx.
 */
import { ChevronDown, ChevronUp } from "lucide-react";
import { Fragment, useEffect, useRef, useState } from "react";
import { liesMerker, schreibeMerker } from "../../../app/merker";
import { sprache, t } from "../../../i18n/sprache";
import { eigeneAlsText } from "../../../schach/weiterspielen";
import type { Zugklasse } from "../../../spiel/auswertung";
import { phasenwechsel, type Phase } from "../../../spiel/phasen";
import { Klassenmarke } from "../auswertung/Auswertungssymbole";
import { Zugknoepfe, type Zugrichtung } from "../brettbedienung/Zugknoepfe";

const SYMBOLGROESSE = 22;
const PHASENBUCHSTABE: Readonly<Record<Phase, string>> = {
  eroeffnung: "",
  mittelspiel: "M",
  endspiel: "E",
};
/** Merker auf dem Gerät: Zugliste der Partie aufgeklappt („ja“) oder einzeilig (fehlt). */
const MERKER_AUFGEKLAPPT = "partiezuegeAufgeklappt";
const AUFGEKLAPPT = "ja";

/**
 * Rollt die Zugzeile, bis der gezeigte Zug (sonst der letzte) sichtbar ist: einzeilig waagerecht,
 * aufgeklappt senkrecht.
 * Warum nicht scrollIntoView: Das würde auch die ganze Seite verschieben (wie in Zugleiste.tsx).
 * Seit DS48 (0.2.131) steht die Zeile in der Partie einzeilig über den Zugknöpfen.
 */
function rolleZumZug(zeile: HTMLElement | null, aufgeklappt: boolean): void {
  if (!zeile) return;
  const knopf =
    zeile.querySelector<HTMLElement>('[aria-current="step"]') ??
    zeile.querySelector<HTMLElement>(".zug:last-of-type");
  if (!knopf) return;
  if (aufgeklappt) {
    const oben = knopf.offsetTop;
    const sichtbar =
      oben >= zeile.scrollTop && oben + knopf.offsetHeight <= zeile.scrollTop + zeile.clientHeight;
    if (!sichtbar) zeile.scrollTop = oben - zeile.clientHeight / 2;
    return;
  }
  const links = knopf.offsetLeft;
  const sichtbar =
    links >= zeile.scrollLeft && links + knopf.offsetWidth <= zeile.scrollLeft + zeile.clientWidth;
  if (!sichtbar) zeile.scrollLeft = links - zeile.clientWidth / 2;
}

/** Aufgeklappt oder einzeilig, mit Merker auf dem Gerät (geht er verloren, ist es einzeilig). */
function useAufgeklappt(): readonly [boolean, () => void] {
  const [aufgeklappt, setzeAufgeklappt] = useState(
    () => liesMerker(MERKER_AUFGEKLAPPT) === AUFGEKLAPPT,
  );
  const umschalten = () => {
    const neu = !aufgeklappt;
    setzeAufgeklappt(neu);
    schreibeMerker(MERKER_AUFGEKLAPPT, neu ? AUFGEKLAPPT : "");
  };
  return [aufgeklappt, umschalten];
}

/** Knopf neben der Zugzeile: alle Züge zeigen oder wieder einzeilig. */
function Aufklappknopf({ offen, beiTipp }: { offen: boolean; beiTipp: () => void }) {
  return (
    <button
      type="button"
      className="knopf-symbol zugliste-aufklappen"
      aria-expanded={offen}
      aria-label={t(offen ? "partie.wenigerZuegeZeigen" : "partie.alleZuegeZeigen")}
      title={t(offen ? "partie.wenigerZuegeZeigen" : "partie.alleZuegeZeigen")}
      onClick={beiTipp}
    >
      {offen ? <ChevronUp size={SYMBOLGROESSE} /> : <ChevronDown size={SYMBOLGROESSE} />}
    </button>
  );
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

/** „M“ oder „E“ vor dem ersten Zug des Mittel- oder Endspiels; sonst nichts. */
function Phasenmarke({ phase }: { phase: Phase | undefined }) {
  if (!phase) return null;
  const name = t(`phase.name.${phase}`);
  return (
    <span className="zugphase" title={name} aria-label={name}>
      {PHASENBUCHSTABE[phase]}
    </span>
  );
}

/**
 * Die vier Zugknöpfe der Partie; gesperrt ist ein Knopf, dessen Ziel die gezeigte Stelle ist
 * oder außerhalb der Partie liegt.
 */
function Partieknoepfe({
  stelle,
  anzahl,
  beiStelle,
}: {
  stelle: number;
  anzahl: number;
  beiStelle: (stelle: number) => void;
}) {
  const ziele: Readonly<Record<Zugrichtung, number>> = {
    anfang: 0,
    zurueck: stelle - 1,
    vor: stelle + 1,
    ende: anzahl,
  };
  const gesperrt = (ziel: number) => ziel === stelle || ziel < 0 || ziel > anzahl;
  return (
    <Zugknoepfe
      gesperrt={{
        anfang: gesperrt(ziele.anfang),
        zurueck: gesperrt(ziele.zurueck),
        vor: gesperrt(ziele.vor),
        ende: gesperrt(ziele.ende),
      }}
      beiRichtung={(richtung) => beiStelle(ziele[richtung])}
    />
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
  const [aufgeklappt, umschalten] = useAufgeklappt();
  useEffect(() => rolleZumZug(zeile.current, aufgeklappt), [stelle, zuege.length, aufgeklappt]);
  return (
    <section
      className={aufgeklappt ? "zugleiste partiezuege aufgeklappt" : "zugleiste partiezuege"}
      aria-label={t("partie.zuege")}
      data-tour="partie-zuege"
    >
      <p className="zugzeile" data-testid="partiezuege" ref={zeile}>
        {texte.length === 0 && <span className="hinweis">{t("partie.nochKeineZuege")}</span>}
        {texte.map((text, index) => (
          <Fragment key={`${index}-${text}`}>
            <Phasenmarke phase={marken.get(index)} />
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
      <Aufklappknopf offen={aufgeklappt} beiTipp={umschalten} />
      <Partieknoepfe stelle={stelle} anzahl={zuege.length} beiStelle={beiStelle} />
    </section>
  );
}
