/**
 * Begründungen im Strukturerkenner: warum ein Bauer schwach ist oder warum nicht.
 *
 * Rolle im Gesamtbild: Regel L des Nebenchats (Wunsch des Autors, 30.10.2026): Ist eine Antwort
 * falsch, sagt die App, warum. Nach dem Prüfen der schwachen Bauern bekommt jeder übersehene
 * Bauer seinen Grund (isoliert, doppelt, rückständig) und jedes zu viel getippte Feld den Grund,
 * warum es nicht dazugehört (bei „rückständig“ die Bedingung, an der es scheitert).
 * Abhängigkeiten: schach/bauernschwaechen.ts, schach/stellung.ts, i18n.
 * Buchbezug: Kapitel 5, Tabelle der Bauernschwächen und „Der rückständige Bauer“ mit den
 * Festlegungen des Autors (P3, 23.10.2026).
 */
import type { Color, Square } from "chessops/types";
import type { Strukturaufgabe } from "../daten/trainerdaten";
import { t } from "../i18n/sprache";
import {
  bauernschwaechen,
  fehlendeRueckstandsbedingungen,
  type Bauernschwaechen,
} from "../schach/bauernschwaechen";
import { feldAusName, stellungAusFen } from "../schach/stellung";

/** Die Gründe, warum ein schwacher Bauer schwach ist: jede zutreffende Art ein Satz. */
function schwaecheTexte(feld: string, quadrat: Square, b: Bauernschwaechen): string[] {
  const arten = [
    b.isolani.includes(quadrat) && ("isoliert" as const),
    b.doppelbauern.flat().includes(quadrat) && ("doppelt" as const),
    b.rueckstaendige.includes(quadrat) && ("rueckstaendig" as const),
  ].filter((art) => art !== false);
  return arten.map((art) => t(`strukturtrainer.bauernGrund.${art}`, { feld }));
}

/**
 * Begründungen zu den übersehenen und den zu viel getippten Feldern des Schritts „schwache
 * Bauern“, je Feld ein Satz.
 *
 * Beispiel: Aufgabe aus Abb. 6.x, getippt f7 → „f7 ist nicht schwach: … g7 steht nicht vor ihm …“.
 * Sonderfall: Ein getipptes Feld ohne Bauern bekommt „Hier steht kein Bauer.“
 */
export function bauernbegruendungen(
  aufgabe: Strukturaufgabe,
  fehlend: readonly string[],
  falsch: readonly string[],
): string[] {
  const gelesen = stellungAusFen(aufgabe.fen);
  if (!gelesen.ok) return [];
  const brett = gelesen.wert.brett;
  const schwaechen: Record<Color, Bauernschwaechen> = {
    white: bauernschwaechen(brett, "white"),
    black: bauernschwaechen(brett, "black"),
  };
  const satz = (feld: string, uebersehen: boolean): string[] => {
    const quadrat = feldAusName(feld);
    const stein = quadrat === null ? undefined : brett.get(quadrat);
    if (quadrat === null || stein?.role !== "pawn") {
      return [t("strukturtrainer.bauernGrund.keinBauer", { feld })];
    }
    if (uebersehen) return schwaecheTexte(feld, quadrat, schwaechen[stein.color]);
    const gruende = fehlendeRueckstandsbedingungen(brett, quadrat, stein.color).map((b) =>
      t(`strukturtrainer.rueckstand.${b}`),
    );
    return [t("strukturtrainer.bauernGrund.nichtSchwach", { feld, gruende: gruende.join(" ") })];
  };
  return [...fehlend.flatMap((f) => satz(f, true)), ...falsch.flatMap((f) => satz(f, false))];
}
