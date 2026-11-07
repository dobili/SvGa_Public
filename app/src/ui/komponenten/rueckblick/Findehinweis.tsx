/**
 * Findezeile im Rückblick Zug für Zug: Mit welcher Idee des Buches der bessere Zug zu finden war
 * (F1 bis F10, Konzept „Fehler mit Buchbezug“, Abschnitt 4.1), mit „Üben“ im aufgeklappten Satz.
 *
 * Rolle im Gesamtbild: Die Rückblickkarte (Rueckblickkarte.tsx) zeigt bei „Besser war …“ den
 * besseren Zug als Zweig; darunter steht diese Zeile bei ungenau, Fehler, Verpasst und Patzer.
 * „Ungenau“ bekommt in der Zeitleiste keine eigene Karte (sie würde zu lang), deshalb erscheint
 * die Findezeile für diese Züge hier. Eine Warum-Zeile zeigt der Rückblick nicht: Dort steht schon
 * die Erklärung des Fehlers nach den Regeln des Buches (spiel/erklaerung.ts).
 * Abhängigkeiten: auswertung/buchzeilen.ts, auswertung/Buchzeilen.tsx, rueckblicktyp.ts.
 */
import { useMemo } from "react";
import type { Zugklasse, Zugurteil } from "../../../spiel/auswertung";
import type { Auswertungsdaten } from "../../../spiel/buchzuege";
import type { Partie } from "../../../spiel/partie";
import { Buchzeiletext } from "../auswertung/Buchzeilen";
import { useBuchzeilen } from "../auswertung/buchzeilen";
import type { Rueckblick } from "./rueckblicktyp";
import "../../stil/zeitleiste.css";

/** Im Rückblick keine Warum-Zeile (die Erklärung steht schon auf der Karte). */
const OHNE_WARUM: ReadonlySet<Zugklasse> = new Set<Zugklasse>();

/**
 * Die Findezeile zum gezeigten Zug; ohne Kategorie nichts.
 * Beispiel: 9... b5?! (ungenau), besser 9... Sbd7 → „Eröffnungsziel: Rochade, Entwicklung,
 * Zentrum (Kapitel 1, drei Eröffnungsziele)“.
 */
export function Findehinweis({
  rueckblick,
  partie,
  urteil,
}: {
  rueckblick: Rueckblick;
  partie: Partie;
  urteil: Zugurteil;
}) {
  const { werte, beste, abstaende, varianten } = rueckblick;
  const daten = useMemo<Auswertungsdaten>(
    () => ({
      partie,
      werte,
      beste,
      ...(abstaende ? { abstaende } : {}),
      ...(varianten ? { varianten } : {}),
    }),
    [partie, werte, beste, abstaende, varianten],
  );
  const { finde } = useBuchzeilen(daten, urteil, OHNE_WARUM);
  if (!finde) return null;
  return (
    <div className="rueckblick-findezeile">
      <Buchzeiletext zeile={finde} art="finde" ueben />
    </div>
  );
}
