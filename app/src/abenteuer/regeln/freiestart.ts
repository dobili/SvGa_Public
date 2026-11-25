/**
 * Freie Revanche (Wunsch des Autors, 25.11.2026): Gegen Straßengegner mit fester Startstellung
 * (Jo im Park aus Abb. 1.21, Rosa, Nia, Harlan …) gilt die vorgegebene Stellung nur, bis man sie
 * einmal gewonnen hat. Danach ist jede weitere Partie eine ganze Partie aus der Grundstellung:
 * Immer dieselbe Stellung nach dem Sieg und der Limo war eintönig.
 *
 * Wo die Stellung Teil der Geschichte ist, bleibt sie: Story-, Club- und Clubchef-Gegner (Victor,
 * Dots Fernpartie, Erinnerung 1858, Meisterproblem, Testteams der Wegsperren S15 bis S17,
 * Simultan) gehören nicht zur Rolle „strasse“ und bleiben unberührt; dazu die Ausnahmen in
 * BLEIBT, jede mit Grund.
 * Rolle im Gesamtbild: reine Regel für oberwelt/auftraege.ts (auftragFuer). Abhängigkeiten:
 * daten/laden.ts (Typen), regeln/dialogvariablen.ts (Name der Siegvariable).
 */
import type { Begegnungsdaten } from "../daten/laden";
import { siegvariable } from "./dialogvariablen";

/** Straßengegner, deren Startstellung auch nach dem Sieg bleibt, mit Grund. */
export const BLEIBT: Readonly<Record<string, string>> = {
  "wegIronwoodSilicon.stream":
    "Der Stream auf Weg 4 lässt die Zuschauer den ersten Zug wählen (kandidaten); die Szene ist die Stellung.",
  "wegGhostCapital.simultan5":
    "Ein Brett der Simultanvorstellung: Jedes Brett hat seine Stellung, die Vorstellung ist einmalig.",
};

/**
 * Startstellungen, die jedes Mal gleich sind. „vorrat“ (neue Stellung je Partie aus
 * stellungsvorrat.json) und „eroeffnung“ (Dime: mehrere Eröffnungen zur Wahl) wechseln schon von
 * selbst und bleiben deshalb, wie sie sind.
 */
const FESTE_ARTEN: ReadonlySet<string> = new Set(["abbildung", "fen"]);

/** Rolle der Straßengegner (gegner.json). */
const STRASSE = "strasse";

/**
 * Spielt diese Begegnung jetzt frei aus der Grundstellung? Ja, wenn der Gegner ein Straßengegner
 * ist, die Begegnung eine feste Startstellung hat (Abbildung oder FEN, auch Endspiele), nicht in BLEIBT steht und der Held sie schon
 * einmal gewonnen hat (Variable `siege<Begegnung>` ab 1).
 * Beispiel: Jo nach dem ersten Sieg (siegeMapleFallsSkaterJo 1) → true; vor dem Sieg → false;
 * Victor (Rolle „story“) → immer false.
 */
export function freieRevanche(
  b: Pick<Begegnungsdaten, "kennung" | "startstellung" | "variante">,
  rolle: string | undefined,
  variablen: Readonly<Record<string, unknown>>,
): boolean {
  if (rolle !== STRASSE || b.variante || !FESTE_ARTEN.has(b.startstellung.art)) return false;
  if (b.kennung in BLEIBT) return false;
  const siege = variablen[siegvariable(b.kennung)];
  return typeof siege === "number" && siege >= 1;
}
