/**
 * Fortsetzungen: Nachfragen zu einer offenen Aufgabenrunde oder Partie in der Oberwelt.
 *
 * Rolle im Gesamtbild: Teil des Oberwelt-Bildschirms (Oberwelt.tsx), ausgelagert, damit die Datei
 * unter 400 Zeilen bleibt (Regel 4, CLAUDE.md). Zeigt je offenem Vorgang eine Fortsetzungskarte.
 * Abhängigkeiten: Ergebniskarten.tsx, useAufgabenrunde.ts, usePartiestart.ts.
 */
import type { Appdienste } from "../schnittstelle/modul";
import { Fortsetzungskarte } from "./Ergebniskarten";
import type { Runden } from "./useAufgabenrunde";
import type { Partien } from "./usePartiestart";

/**
 * Karten zum Weitermachen oder Abbrechen einer offenen Runde und einer offenen Partie.
 * Warum: Kehrt der Leser ohne Ergebnis in die Oberwelt zurück, soll er wählen, statt dass der
 * Vorgang still verfällt. Eingaben: Appdienste, Runden- und Partien-Hook. Ausgabe: null bis zwei
 * Karten. Sonderfall: Kennt die App die Partie nicht mehr, räumt „Weiter“ die Karte auf.
 */
export function Fortsetzungen(props: {
  readonly dienste: Appdienste;
  readonly runden: Runden;
  readonly partie: Partien;
  /** Aufgegeben: Die Rückmeldung nach dem Ergebnis entfällt (nachergebnis.ts, vergiss). */
  readonly beiAufgeben: () => void;
}) {
  const { dienste, runden, partie, beiAufgeben } = props;
  const { offeneRunde } = runden;
  const { offenePartie } = partie;
  return (
    <>
      {offeneRunde && (
        <Fortsetzungskarte
          text="aufgaben.laeuft"
          weiter="aufgaben.weiter"
          abbrechen="aufgaben.abbrechen"
          beiWeiter={() => void dienste.starteAufgaben(offeneRunde)}
          beiAbbrechen={() => {
            runden.brichRundeAb();
            beiAufgeben();
          }}
        />
      )}
      {offenePartie && (
        <Fortsetzungskarte
          text="ergebnis.partieLaeuft"
          weiter="ergebnis.weiterspielen"
          abbrechen="ergebnis.aufgeben"
          beiWeiter={() => {
            // Kennt die App die Partie nicht mehr (Affentest, 14.11.2026), räumt die Karte auf,
            // statt einen toten Knopf zu zeigen; die Begegnung lässt sich neu beginnen.
            if (!dienste.zeigePartie(offenePartie)) partie.gibOffenePartieAuf();
          }}
          beiAbbrechen={() => {
            partie.gibOffenePartieAuf();
            beiAufgeben();
          }}
        />
      )}
    </>
  );
}
