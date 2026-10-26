/**
 * Zugleiste über dem Brett: Züge der Zeile, Abbildungen, Abzweigungen, darunter Halbzug vor und zurück.
 *
 * Rolle im Gesamtbild: Komponente aus Konzept 10.2 für „Nachspielen“ (Pflichtenheft 4): Jeder
 * Halbzug vor und zurück, Sprung zu den Stellungen, die im Buch als Abbildung stehen,
 * Abzweigungen wählbar. Zugnummern wie im Buch: „5... Db6“ für Schwarz. Die vier Knöpfe stehen
 * ganz unten im Kasten, direkt über dem Brett, damit sie ohne Scrollen erreichbar sind (Wunsch
 * des Autors, 14.10.2026).
 * Abhängigkeiten: schach/variantenbaum.ts, i18n, Zugknoepfe.tsx.
 */
import { Fragment, useEffect, useRef } from "react";
import { sprache, t } from "../../i18n/sprache";
import { eigeneAlsText } from "../../schach/weiterspielen";
import { Zugknoepfe } from "./Zugknoepfe";
import type { Nachspielstand } from "./useNachspielen";
import {
  abzweigungen,
  inNebenvariante,
  zeile,
  type Beispiel,
  type Halbzug,
} from "../../schach/variantenbaum";

/** „5.“ vor weißen Zügen, „5...“ vor einem schwarzen Zug am Anfang oder nach einer Abzweigung. */
function nummerVor(halbzug: Halbzug, erster: boolean): string {
  if (halbzug.weiss) return `${halbzug.nummer}. `;
  return erster ? `${halbzug.nummer}... ` : "";
}

/** Der Teil des Pfades, der noch auf der Hauptvariante liegt. */
function hauptvariantenAnteil(beispiel: Beispiel, pfad: readonly string[]): string[] {
  const anteil: string[] = [];
  let auswahl = beispiel.zuege;
  for (const san of pfad) {
    if (auswahl[0]?.zug !== san) break;
    anteil.push(san);
    auswahl = auswahl[0].weiter;
  }
  return anteil;
}

/** Anfang, Halbzug zurück, Halbzug vor, Ende (Anfang und Ende abgesetzt, Zugknoepfe.tsx). */
function Knoepfe({ stand }: { stand: Nachspielstand }) {
  const zurueckAus = !stand.kann.zurueck;
  const vorAus = !stand.kann.vor;
  return (
    <Zugknoepfe
      gesperrt={{ anfang: zurueckAus, zurueck: zurueckAus, vor: vorAus, ende: vorAus }}
      beiRichtung={(richtung) => stand.schritt(richtung)}
    />
  );
}

/** Die eigenen Züge hinter der Buchstellung, mit „Zurück zur Buchvariante“. */
function EigeneZeile({ stand }: { stand: Nachspielstand }) {
  const texte = eigeneAlsText(stand.buchFen, stand.eigene.zuege, sprache());
  return (
    <div className="eigene-zuege" data-testid="eigene-zuege">
      <p className="zugzeile">
        <span className="eigene-titel">{t("zugleiste.eigene")} </span>
        {texte.map((text, index) => (
          <Fragment key={`${index}-${text}`}>
            <button
              type="button"
              className="zug eigen"
              aria-current={index === stand.eigene.stelle - 1 ? "step" : undefined}
              onClick={() => stand.setzeEigeneStelle(index + 1)}
            >
              {text}
            </button>{" "}
          </Fragment>
        ))}
      </p>
      <button
        type="button"
        className="knopf-link klein"
        onClick={() => stand.setzePfad(stand.pfad)}
      >
        {t("zugleiste.zurBuchvariante")}
      </button>
    </div>
  );
}

interface ZeilenEigenschaften {
  readonly halbzuege: readonly Halbzug[];
  readonly pfad: readonly string[];
  readonly beiPfad: (pfad: readonly string[]) => void;
}

/**
 * Scrollt nur die Zugzeile, bis der aktuelle Zug sichtbar ist.
 *
 * Warum nicht scrollIntoView: Das würde auch die ganze Seite verschieben, und beim Öffnen einer
 * Abbildung spränge der Bildschirm vom Brett weg zur Zugleiste.
 */
function zeigeImBehaelter(behaelter: HTMLElement | null, knopf: HTMLElement | null): void {
  if (!behaelter || !knopf) return;
  const oben = knopf.offsetTop;
  const sichtbar =
    oben >= behaelter.scrollTop &&
    oben + knopf.offsetHeight <= behaelter.scrollTop + behaelter.clientHeight;
  if (!sichtbar) behaelter.scrollTop = oben - behaelter.clientHeight / 2;
}

function Zuege({ halbzuege, pfad, beiPfad }: ZeilenEigenschaften) {
  const behaelter = useRef<HTMLParagraphElement>(null);
  const aktuell = useRef<HTMLButtonElement>(null);
  useEffect(() => zeigeImBehaelter(behaelter.current, aktuell.current), [pfad]);
  return (
    <p ref={behaelter} className="zugzeile" aria-label={t("zugleiste.zeile")}>
      {halbzuege.map((halbzug, index) => {
        const istAktuell = index === pfad.length - 1;
        return (
          <Fragment key={halbzug.pfad.join(" ")}>
            <span className="zug-gruppe">
              <button
                ref={istAktuell ? aktuell : undefined}
                type="button"
                className="zug"
                aria-current={istAktuell ? "step" : undefined}
                onClick={() => beiPfad(halbzug.pfad)}
              >
                {nummerVor(halbzug, index === 0)}
                {halbzug.text}
              </button>
              {halbzug.abbildungen.map((nummer) => (
                <button
                  key={nummer}
                  type="button"
                  className="zug-abbildung"
                  onClick={() => beiPfad(halbzug.pfad)}
                >
                  {t("abbildung.titel", { nummer })}
                </button>
              ))}
            </span>{" "}
          </Fragment>
        );
      })}
    </p>
  );
}

/**
 * Zugleiste: Buchzüge eines Beispiels und eigene Züge.
 *
 * Eingaben: der Zustand aus useNachspielen.
 * Beispiel aus dem Buch: Abb. 1.26 steht nach 5... Db6; „Vor“ zeigt 6. Ld3?!, „Anfang“ die
 * Grundstellung. Zieht der Leser selbst, erscheinen seine Züge darunter.
 */
export function Zugleiste({ stand }: { stand: Nachspielstand }) {
  const sprachcode = sprache();
  const { beispiel, pfad, setzePfad: beiPfad } = stand;
  const halbzuege = beispiel ? zeile(beispiel, pfad, sprachcode) : [];
  const andere =
    beispiel && stand.eigene.zuege.length === 0 ? abzweigungen(beispiel, pfad, sprachcode) : [];
  return (
    <section
      className="zugleiste"
      aria-label={t("zugleiste.titel")}
      data-testid="zugleiste"
      data-tour="zugleiste"
    >
      {beispiel && <Zuege halbzuege={halbzuege} pfad={pfad} beiPfad={beiPfad} />}
      {stand.eigene.zuege.length > 0 && <EigeneZeile stand={stand} />}
      {andere.length > 0 && (
        <p className="abzweigungen">
          <span>{t("zugleiste.andere")}</span>
          {andere.map((halbzug) => (
            <button
              key={halbzug.san}
              type="button"
              className="chip"
              onClick={() => beiPfad(halbzug.pfad)}
            >
              {nummerVor(halbzug, true)}
              {halbzug.text}
            </button>
          ))}
        </p>
      )}
      {beispiel && inNebenvariante(beispiel, pfad) && (
        <button
          type="button"
          className="knopf-link klein"
          onClick={() => beiPfad(hauptvariantenAnteil(beispiel, pfad))}
        >
          {t("zugleiste.zurHauptvariante")}
        </button>
      )}
      {beispiel?.status === "entwurf" && <p className="hinweis">{t("zugleiste.entwurf")}</p>}
      {/* Regel 1: Das Buch ist die einzige Quelle; konstruierte Partien deutlich kennzeichnen (0.2.96). */}
      {beispiel?.status === "konstruiert" && (
        <p className="hinweis" data-testid="zugfolge-konstruiert">
          {t("zugleiste.konstruiert")}
        </p>
      )}
      <Knoepfe stand={stand} />
    </section>
  );
}
