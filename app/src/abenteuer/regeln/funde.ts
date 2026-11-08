/**
 * Funde (docs/spiel/08, E1 bis E5): Ein Dialog ruft `gibFund(kennung)`, der Fund kommt einmal in
 * den Spielstand. Reine Funktion; Münzen und Extras wirken, sobald Schritt 12 und die Extras der
 * App angebunden sind (die Felder stehen schon in funde.json).
 * Beispiel: `mitFund(stand, "formular1857", jetzt)` → `funde` enthält das alte Partieformular.
 */
import type { Abenteuerstand } from "../schnittstelle/spielstand";

/** Der Stand mit dem Fund; schon gefunden → unverändert (derselbe Stand). */
export function mitFund(stand: Abenteuerstand, kennung: string, jetzt: Date): Abenteuerstand {
  if (stand.funde.some((f) => f.kennung === kennung)) return stand;
  return { ...stand, funde: [...stand.funde, { kennung, gefunden: jetzt.toISOString() }] };
}
