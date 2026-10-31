/**
 * Kopf der Gesamt-Checkliste (Entwurf D1, 31.10.2026): große Summe „14 von 77 Punkten“, rechts
 * „1 Kapitel fertig“, darunter ein Fortschrittsband mit einem Abschnitt je Kapitel und der kurze
 * Hinweis mit Fragezeichen.
 *
 * Rolle im Gesamtbild: Steht über der Liste der Kapitel (ui/bildschirme/Checkliste.tsx). Jeder
 * Abschnitt ist so breit, wie das Kapitel Punkte hat, und füllt sich gold mit den Haken; die
 * Kapitelnummern stehen darunter. Das Band ist ein Bild für die Augen (aria-hidden); die Zahlen
 * stehen für Bildschirmleser in der Summe und in jeder Kapitelzeile.
 * Abhängigkeiten: app/lernstand.ts, InfoKnopf, i18n.
 */
import type { CSSProperties } from "react";
import { abgehakt, type Lernstand } from "../../../app/lernstand";
import type { Nachschlagen } from "../../../daten/laden";
import { t, tZahl } from "../../../i18n/sprache";
import { MitInfo } from "../bausteine/InfoKnopf";

type Lernziele = Nachschlagen["lernziele"][number];

const PROZENT = 100;

/** Stand eines Kapitels: erledigt, alle. */
interface Kapitelanteil {
  readonly kapitel: number;
  readonly erledigt: number;
  readonly alle: number;
}

/** Die Anteile aller Kapitel. Beispiel: Kapitel 1 mit 4 von 6 Haken → { 1, 4, 6 }. */
function kapitelanteile(lernziele: readonly Lernziele[], stand: Lernstand): Kapitelanteil[] {
  return lernziele.map((ziele) => ({
    kapitel: ziele.kapitel,
    erledigt: abgehakt(stand, ziele.kapitel, ziele.punkte.length),
    alle: ziele.punkte.length,
  }));
}

/** Das Band: ein Abschnitt je Kapitel, Breite nach Zahl der Punkte, gold gefüllt nach Haken. */
function Fortschrittsband({ anteile }: { anteile: readonly Kapitelanteil[] }) {
  return (
    <div className="checkband" aria-hidden="true">
      {anteile.map(({ kapitel, erledigt, alle }) => {
        const stil = {
          flexGrow: alle,
          "--fuellung": `${String(alle > 0 ? (erledigt / alle) * PROZENT : 0)}%`,
        } as CSSProperties;
        return (
          <span key={kapitel} className="checkband-abschnitt" style={stil}>
            <span className="checkband-balken" />
            <span className="checkband-nummer">{kapitel}</span>
          </span>
        );
      })}
    </div>
  );
}

/** Der Kopf. Beispiel: „14 von 77 Punkten“, „1 Kapitel fertig“, Band mit 13 Abschnitten. */
export function Checklistenkopf({
  lernziele,
  stand,
  titel,
}: {
  lernziele: readonly Lernziele[];
  stand: Lernstand;
  /** Überschrift der Tabelle aus dem Buch, für die Erklärung hinter dem Fragezeichen. */
  titel: string;
}) {
  const anteile = kapitelanteile(lernziele, stand);
  const erledigt = anteile.reduce((summe, a) => summe + a.erledigt, 0);
  const alle = anteile.reduce((summe, a) => summe + a.alle, 0);
  const fertig = anteile.filter((a) => a.alle > 0 && a.erledigt >= a.alle).length;
  return (
    <section className="karte checkkopf" data-tour="checkliste-stand">
      <div className="checkkopf-zeile">
        <p className="checkkopf-summe" data-testid="lernstand-gesamt">
          <strong>{erledigt}</strong> {t("trainingslook.checkVon", { alle })}
        </p>
        {fertig > 0 && (
          <span className="checkkopf-fertig">
            {tZahl("trainingslook.checkFertig", fertig, { anzahl: fertig })}
          </span>
        )}
      </div>
      <Fortschrittsband anteile={anteile} />
      <MitInfo
        zeile={<p className="hinweis">{t("trainingslook.checkHinweis")}</p>}
        erklaerung={
          <>
            <p>{t("checkliste.hinweis")}</p>
            <p>{titel}</p>
          </>
        }
        thema={t("checkliste.titel")}
      />
    </section>
  );
}
