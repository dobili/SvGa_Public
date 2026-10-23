/**
 * Pfeile zum Vergleich eines verfehlten Zuges: rot der eigene Zug, gold der Zug der Partie oder
 * der Studie.
 *
 * Rolle im Gesamtbild: „Studien lösen“ (R46) und „Zug erraten“ (R45) zeichnen damit beide Züge in
 * der Stellung davor; den Text dazu schreibt Zugvergleich.tsx.
 * Abhängigkeiten: schach/weiterspielen.ts (Felder eines Zuges), analyse/werkzeug.ts (Markierung).
 */
import type { Markierung } from "../../analyse/werkzeug";
import { zugFelder } from "../../schach/weiterspielen";
import type { Fehlversuch } from "./useRatevergleich";

/**
 * Rot der eigene Zug, gold der Zug der Partie oder Studie, in der Stellung davor.
 *
 * Beispiel: Saavedra-Studie, 1. Kb7 statt 1. c7 → roter Pfeil b6–b7, goldener Pfeil c6–c7.
 * Sonderfall: Ein unlesbarer Zug bekommt keinen Pfeil.
 */
export function vergleichspfeile(versuch: Fehlversuch): Markierung[] {
  const eigen = zugFelder(versuch.vorherFen, versuch.eigen);
  const richtig = zugFelder(versuch.vorherFen, versuch.partie);
  return [
    ...(eigen ? [{ typ: "pfeil" as const, farbe: "rot" as const, ...eigen }] : []),
    ...(richtig ? [{ typ: "pfeil" as const, farbe: "gold" as const, ...richtig }] : []),
  ];
}
