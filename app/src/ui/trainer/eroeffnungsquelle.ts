/**
 * Die Zeile „Aus“ der Eröffnungstrainer: Eröffnungen aus Kapitel 2, Gambits aus Kapitel 3 und,
 * im Repertoire-Trainer nach Wunsch, Eröffnungen aus der Praxis (Lichess).
 *
 * Rolle im Gesamtbild: Der Abweichungsmodus bot Kapitel 2 und 3 schon zur Wahl (Empfehlung im
 * Nebenchat, vom Autor freigegeben am 30.10.2026); der Repertoire-Trainer bekommt dieselbe Zeile
 * (Wunsch des Autors, 1.11.2026: „dieselbe Funktion auch für Gambits“), dazu die Praxis.
 * Abhängigkeiten: startkarte/einstellung.ts, i18n.
 */
import { t } from "../../i18n/sprache";
import { einstellung, type Einstellung } from "./startkarte/einstellung";

/** Die Quellen aus dem Buch. */
export const BUCHQUELLEN = ["kapitel2", "kapitel3"] as const;
/** Alle Quellen, mit der Praxis (Lichess) zuletzt. */
export const ALLE_QUELLEN = [...BUCHQUELLEN, "praxis"] as const;
export type Eroeffnungsquelle = (typeof ALLE_QUELLEN)[number];

/**
 * Die Zeile „Aus: Eröffnungen (Kapitel 2) | Gambits (Kapitel 3) | Praxis (Lichess)“.
 *
 * Eingaben: angebotene Quellen, gewählte Quelle, Rückruf, Prüfkennung.
 * Beispiel: Abweichungsmodus → nur die beiden Buchquellen.
 */
export function quellenzeile(
  quellen: readonly Eroeffnungsquelle[],
  quelle: Eroeffnungsquelle,
  setze: (q: Eroeffnungsquelle) => void,
  testkennung: string,
): Einstellung {
  return einstellung({
    kennung: "kapitel",
    titel: t("trainerstart.zeile.gambit"),
    symbol: "quelle",
    optionen: quellen.map((q) => ({ wert: q, text: t(`abweichung.wahl.${q}`) })),
    wert: quelle,
    setze,
    testkennung,
  });
}
