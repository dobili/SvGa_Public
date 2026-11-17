/**
 * Anzeigen der kurzen Partieformen in der Spielhülle: das Ziel mit den restlichen Zügen, der
 * erzählte Einstieg vor dem ersten Zug und der Satz nach dem Ende (Wunsch des Autors vom
 * 17.11.2026: „Ihr liefert euch ein zähes Spiel … nach 23 Zügen steht es so:“).
 *
 * Rolle im Gesamtbild: PartieHuelle.tsx bindet die drei Teile ein; die Daten kommen aus der
 * Begegnung (begegnungen.json, Feld `erzaehlung`) und der Partieeinstellung (`kurzform`), die
 * Texte aus den Spieltexten (inhalte/abenteuer/texte/de.json). Den bisherigen Verlauf zeigt der
 * Einstieg in der Notation des Buches, bei „Eröffnung fremd“ (R13c) die Züge der Eröffnung.
 * Abhängigkeiten: anbindung/useKurzform.ts, regeln/kurzform.ts, schach/notation.ts, texte.ts.
 */
import { useState } from "react";
import { sprache } from "../../i18n/sprache";
import type { Partie } from "../../spiel/partie";
import type { Begegnungsdaten } from "../daten/laden";
import { tSpiel } from "../texte/texte";
import { ausgangAus } from "./partieergebnis";
import { verlaufAlsText, zieltext } from "./kurzformtexte";
import type { Kurzformstand } from "./useKurzform";

/** Ziel und restliche Züge, solange die Partie läuft. */
export function Kurzformzeile({ stand }: { stand: Kurzformstand }) {
  const rest = stand.rechnet
    ? tSpiel("huelle.kurzform.wertung")
    : stand.rest === 1
      ? tSpiel("huelle.kurzform.restEins")
      : tSpiel("huelle.kurzform.rest", { zuege: stand.rest });
  return (
    <p className="abenteuer-kurzform" role="status" data-testid="abenteuer-kurzform">
      <span>{zieltext(stand)}</span> <span>{rest}</span>
    </p>
  );
}

/** Die Züge, die der Einstieg zeigt: aus der Erzählung oder aus der Eröffnung der Begegnung. */
function verlaufDer(begegnung: Begegnungsdaten): readonly string[] {
  if (begegnung.erzaehlung?.verlauf) return begegnung.erzaehlung.verlauf;
  return begegnung.startstellung.art === "eroeffnung" ? begegnung.startstellung.zuege : [];
}

/**
 * Erzählter Einstieg vor dem ersten eigenen Zug; „Ans Brett“ schließt ihn. Wer mitten in der
 * Partie neu lädt, sieht ihn nicht noch einmal.
 */
export function Erzaehlvorhang({
  begegnung,
  partie,
}: {
  begegnung: Begegnungsdaten | null;
  partie: Partie;
}) {
  const schonGezogen = partie.zuege.some((z) => z.von === "leser");
  const [zu, setzeZu] = useState(schonGezogen);
  const vorher = begegnung?.erzaehlung?.vorher;
  if (!begegnung || !vorher || zu || schonGezogen || partie.ende) return null;
  const verlauf = verlaufAlsText(verlaufDer(begegnung), sprache());
  return (
    <section className="abenteuer-erzaehlung" role="dialog" data-testid="abenteuer-erzaehlung">
      <p>{tSpiel(vorher)}</p>
      {verlauf && <p className="abenteuer-erzaehlung-verlauf">{verlauf}</p>}
      <button
        type="button"
        className="knopf-haupt"
        data-testid="abenteuer-erzaehlung-weiter"
        onClick={() => setzeZu(true)}
      >
        {tSpiel("huelle.erzaehlung.weiter")}
      </button>
    </section>
  );
}

/** Der Satz nach dem Ende, je Ausgang; ohne passenden Text nichts. */
export function Nachwort({
  begegnung,
  partie,
}: {
  begegnung: Begegnungsdaten | null;
  partie: Partie;
}) {
  const nachher = begegnung?.erzaehlung?.nachher;
  if (!partie.ende || !nachher) return null;
  const ausgang = ausgangAus(partie);
  const schluessel = ausgang === "abgebrochen" ? undefined : nachher[ausgang];
  if (!schluessel) return null;
  return (
    <p className="abenteuer-nachwort" data-testid="abenteuer-nachwort">
      {tSpiel(schluessel)}
    </p>
  );
}
