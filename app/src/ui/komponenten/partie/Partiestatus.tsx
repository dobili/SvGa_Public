/**
 * Zeile unter der Zugliste: wer am Zug ist oder wie die Partie endete, dazu Zurücknehmen und
 * Aufgeben.
 *
 * Rolle im Gesamtbild: Teil des Partie-Bildschirms. Zurücknehmen nimmt den eigenen Zug samt
 * Antwort zurück (Pflichtenheft 5.2, abschaltbar beim Start der Partie), aber nur bis zum Ende:
 * Nach dem Ende fehlt der Knopf (Entscheidung des Autors Q12-2, 1.11.2026; eine erneut beendete
 * Partie zählte sonst doppelt in Tagesprotokoll, Siegen, Rekorden, Rivale und Zielen).
 * Aufgeben fragt einmal nach. In der ruhigen Ansicht bleibt nur die Zeile.
 * Abhängigkeiten: spiel/partie.ts, ui/komponenten/partie/usePartie.ts, i18n.
 */
import { useState } from "react";
import { t } from "../../../i18n/sprache";
import { amZug, type Partie } from "../../../spiel/partie";
import type { Partiesteuerung } from "./usePartie";
import { Knopfsymbol } from "../bausteine/Knopfsymbol";

function statustext(s: Partiesteuerung, partie: Partie): string {
  if (s.fehler) return t("partie.engineFehler", { fehler: s.fehler });
  if (partie.einstellung.gegner === "mensch") {
    return t(amZug(partie) === "white" ? "partie.weissAmZug" : "partie.schwarzAmZug");
  }
  return t(s.engineDenkt ? "partie.engineDenkt" : "partie.duBistAmZug");
}

/**
 * Die Zeile unter der Zugliste: wer am Zug ist oder wie die Partie endete, dazu Zurücknehmen und
 * Aufgeben.
 */
export function Partiestatus({
  s,
  partie,
  ruhig,
}: {
  s: Partiesteuerung;
  partie: Partie;
  ruhig: boolean;
}) {
  const [aufgeben, setzeAufgeben] = useState(false);
  const eigenerZug = partie.zuege.some((z) => z.von === "leser");
  // Q12-2: nach dem Ende kein Zurücknehmen (spiel/partie.ts, nimmZurueck).
  const zuruecknehmbar = partie.einstellung.ruecknahmeErlaubt && !partie.ende;
  return (
    // Tourziel nur während der Partie: Danach steht hier nichts mehr, der Text der Tour („Wer am
    // Zug ist …“) stimmte nicht mehr (Befund der Tourprüfung, 25.10.2026).
    <section className="partiestatus" data-tour={partie.ende ? undefined : "partie-status"}>
      {/* Nach dem Ende steht das Ergebnis in der Karte darunter (Partieende). */}
      {!partie.ende && (
        <p className="partiestatus-text" role="status" data-testid="partiestatus">
          {statustext(s, partie)}
        </p>
      )}
      {!ruhig && !aufgeben && (
        <div className="knopfreihe">
          {zuruecknehmbar && (
            <button
              type="button"
              className="knopf-zweit"
              disabled={!eigenerZug}
              onClick={s.nimmZurueck}
            >
              <Knopfsymbol art="zuruecknehmen" />
              {t("partie.zuruecknehmen")}
            </button>
          )}
          {!partie.ende && (
            <button
              type="button"
              className="knopf-zweit knopf-aufgeben"
              onClick={() => setzeAufgeben(true)}
            >
              <Knopfsymbol art="aufgeben" />
              {t("partie.aufgeben")}
            </button>
          )}
        </div>
      )}
      {aufgeben && !partie.ende && (
        <div className="nachfrage">
          <p>{t("partie.aufgebenFrage")}</p>
          <div className="knopfreihe">
            <button type="button" className="knopf-gefahr" onClick={s.gibAuf}>
              {t("partie.aufgebenJa")}
            </button>
            <button type="button" className="knopf-zweit" onClick={() => setzeAufgeben(false)}>
              {t("loeschen.nein")}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
