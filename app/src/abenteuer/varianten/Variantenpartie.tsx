/**
 * Einstieg der Sonderformen für die Partiehülle: zeigt je nach Variante das Brett mit Nebel, mit
 * Ente oder die beiden Tandembretter.
 *
 * Warum: Nebel, Ente und Tandem passen nicht in die Partie der App (Schachregeln von chessops,
 * Speicherformat der App): Im Nebel und mit Ente gibt es kein Schach, im Tandem zwei Bretter.
 * Deshalb bringen sie eigene Regeln, Brett und Bot mit; die Hülle (mittel-3, PartieHuelle) reicht
 * Engine, Stil, Farbe und Gegner herein und bekommt das Ergebnis zurück (Auftrag des Hauptchats,
 * 26.11.2026).
 * Abhängigkeiten: Nebelbrett.tsx, Entenbrett.tsx, Tandembretter.tsx, varianten.css.
 */
import { Entenbrett } from "./Entenbrett";
import { Nebelbrett } from "./Nebelbrett";
import { Tandembretter } from "./Tandembretter";
import type { Sonderform } from "./sonderform";
import type { Variantenumgebung } from "./useBotzug";
import "./varianten.css";

/** Das Brett der Sonderform. */
export function Variantenpartie({
  variante,
  umgebung,
}: {
  readonly variante: Sonderform;
  readonly umgebung: Variantenumgebung;
}) {
  if (variante === "nebel") return <Nebelbrett u={umgebung} />;
  if (variante === "ente") return <Entenbrett u={umgebung} />;
  return <Tandembretter u={umgebung} />;
}
