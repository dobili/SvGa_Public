/**
 * Bedingungen einzelner Tourschritte (touren.ts, `nurWenn`).
 *
 * Rolle im Gesamtbild: Die erste Tour (starttouren.ts) zeigt den Hinweis zum Installieren nur,
 * wenn die App im Browser-Tab läuft; installiert wäre er überflüssig. Ohne Browser (Tests in
 * Node) gilt die Bedingung als nicht erfüllt, der Schritt fällt dann weg.
 * Abhängigkeiten: touren.ts (Typ).
 */
import type { Tourbedingung } from "./touren";

/** Ob die App als installierte App läuft (Startbildschirm), nicht im Browser-Tab. */
function installiert(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return true;
  const ios = (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
  return ios || window.matchMedia("(display-mode: standalone)").matches;
}

/**
 * Ob die Bedingung eines Schritts gerade gilt.
 * Beispiel: im Browser-Tab → „nichtInstalliert“ gilt; als installierte App → gilt nicht.
 */
export function bedingungErfuellt(bedingung: Tourbedingung): boolean {
  return bedingung === "nichtInstalliert" ? !installiert() : true;
}
