/**
 * Ende und Erkennung eigener Variantenpartien (Tandem, Ente, Nebel; 26.11.2026): das Ergebnis der
 * Komponente als Ende der Partie der App, und ob eine Partie so läuft.
 *
 * Warum so: Die Oberwelt liest nach dem Rückweg das Ende der Partie (partieergebnis.ts). Schreibt
 * die Hülle das Ergebnis der Komponente als Ende nach den Regeln der Variante hinein, laufen
 * Ergebniskarte, Dialogknoten danach und Belohnung wie bei jeder Variantenpartie, ohne eigenen Weg.
 * Abgebrochen heißt aufgegeben (wie „Aufgeben“ in der Hülle).
 * Abhängigkeiten: variantenpartien.ts, spiel/partie.ts, ui/komponenten/partie/variantenbotzug.ts.
 */
import type { Color } from "chessops/types";
import { gibAuf, type Partie } from "../../spiel/partie";
import { hatEigenenAblauf } from "../../ui/komponenten/partie/variantenbotzug";
import { variantenpartie, type Variantenergebnis } from "./variantenpartien";

/** Das Ende der Partie zum Ergebnis der Komponente, aus Sicht des Lesers mit Farbe `eigene`. */
export function endeAusErgebnis(partie: Partie, ergebnis: Variantenergebnis): Partie {
  if (partie.ende) return partie;
  const eigene = partie.einstellung.eigeneFarbe;
  const gegner: Color = eigene === "white" ? "black" : "white";
  const kennung = partie.einstellung.abenteuer?.variante ?? "";
  const grund = `variante.${kennung}.ende`;
  const halbzuege = ergebnis.halbzuege;
  switch (ergebnis.ausgang) {
    case "abgebrochen":
      return gibAuf(partie);
    case "remis":
      return { ...partie, ende: { art: "varianteRemis", grund, halbzuege } };
    case "sieg":
      return { ...partie, ende: { art: "variante", sieger: eigene, grund, halbzuege } };
    case "niederlage":
      return { ...partie, ende: { art: "variante", sieger: gegner, grund, halbzuege } };
  }
}

/**
 * Spielt diese Partie in einer eigenen Komponente? Die Variante sagt „eigene_partie“, und ihre
 * Komponente ist angemeldet. Fehlt die Komponente, zeigt die Hülle einen Hinweis statt des Bretts.
 */
export function eigenerAblauf(partie: Partie): "komponente" | "fehlt" | null {
  const kennung = partie.einstellung.abenteuer?.variante;
  if (!hatEigenenAblauf(kennung)) return null;
  return variantenpartie(kennung ?? "") ? "komponente" : "fehlt";
}
