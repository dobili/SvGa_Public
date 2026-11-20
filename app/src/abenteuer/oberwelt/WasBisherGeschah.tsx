/**
 * „Was bisher geschah“ als Abschnitt im Tagebuch (regeln/rueckblick.ts, 20.11.2026): je
 * abgeschlossenem Akt eine Zusammenfassung, für den laufenden Akt die Sätze der erledigten
 * Hauptquests.
 *
 * Warum: Wer nach einer Pause zurückkommt, soll im Tagebuch nachlesen können, was bisher geschah,
 * ohne neuen Bildschirm; der Abschnitt steht zwischen den Aufgaben und den Zahlen.
 * Rolle im Gesamtbild: Teil von oberwelt/Tagebuch.tsx (ausgelagert, Größengrenze).
 * Abhängigkeiten: regeln/rueckblick.ts, texte/texte.ts.
 */
import { rueckblick } from "../regeln/rueckblick";
import type { Abenteuerstand } from "../schnittstelle/spielstand";
import { tSpiel } from "../texte/texte";

/** Der Abschnitt; ohne erledigte Hauptquest nichts. */
export function WasBisherGeschah({ stand }: { readonly stand: Abenteuerstand }) {
  const eintraege = rueckblick(stand);
  if (eintraege.length === 0) return null;
  return (
    <div data-testid="abenteuer-rueckblick">
      <h3>{tSpiel("tagebuch.bisher")}</h3>
      {eintraege.map((e) => (
        <p key={e.akt} data-testid={`abenteuer-rueckblick-akt${e.akt}`}>
          <strong>
            {tSpiel(
              e.abgeschlossen
                ? "rueckblick.ueberschrift.abgeschlossen"
                : "rueckblick.ueberschrift.laufend",
              { akt: e.akt },
            )}
          </strong>
          <br />
          {e.saetze.map((s) => tSpiel(s)).join(" ")}
        </p>
      ))}
    </div>
  );
}
