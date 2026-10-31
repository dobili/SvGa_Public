/**
 * „Hätten die Warnsignale geholfen?“ für „Falle oder Köder“.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (30.10.2026): Die Warnsignale (Kapitel 4, W1 bis W5)
 * sind vor der Entscheidung ein freiwilliger Hinweis; nach der Entscheidung zeigt das Brett nur
 * die Lösung, und ein Satz sagt, ob ein Signal die Widerlegung vorhergesagt hätte. Der Abgleich
 * ist bewusst einfach: Ein rotes Signal (Gefahr für die eigene Seite) liegt auf einem Feld, von
 * dem oder auf das die Widerlegung zieht.
 * Abhängigkeiten: training/fallentrainer.ts (widerlegungszug), schach/weiterspielen.ts.
 * Buchbezug: Kapitel 4, „Fallen kündigen sich auf dem Brett an, bevor du überhaupt rechnest“.
 */
import type { Markierung } from "../analyse/werkzeug";
import type { Fallenaufgabe } from "../daten/trainerdaten";
import { stellungNach } from "./uebungsaufgabe";
import { zugFelder } from "../schach/weiterspielen";
import { widerlegungszug } from "./fallentrainer";

export type Warnnutzen =
  | { readonly art: "geholfen"; readonly feld: string; readonly zug: string }
  | { readonly art: "nichtGeholfen"; readonly zug: string }
  | { readonly art: "unnoetig" }
  | null;

/** Die Felder der roten Signale (Gefahren der eigenen Seite). */
function roteFelder(markierungen: readonly Markierung[]): Set<string> {
  const felder = new Set<string>();
  for (const m of markierungen) {
    if (m.farbe !== "rot") continue;
    if (m.typ === "feld") felder.add(m.feld);
    else {
      felder.add(m.von);
      felder.add(m.nach);
    }
  }
  return felder;
}

/**
 * Bewertet den Nutzen der Warnsignale für eine Aufgabe.
 *
 * Eingaben: Aufgabe, Markierungen der Warnsignale in der Stellung vor dem Nehmen.
 * Ausgabe: geholfen (mit Feld und Zug), nicht geholfen, unnötig (Geschenk trotz Signal) oder
 * null (Geschenk ohne rotes Signal: nichts zu sagen).
 * Beispiel: Ungedeckter Turm a1 (W1, rot), Widerlegung Lxa1 → „geholfen“, Feld a1.
 */
export function warnnutzen(aufgabe: Fallenaufgabe, markierungen: readonly Markierung[]): Warnnutzen {
  const rot = roteFelder(markierungen);
  if (aufgabe.antwort === "geschenk") return rot.size > 0 ? { art: "unnoetig" } : null;
  const zug = widerlegungszug(aufgabe);
  if (!zug) return null;
  const danach = stellungNach(aufgabe.fen, [aufgabe.angebot]);
  const felder = zugFelder(danach, zug);
  const treffer = felder ? [felder.nach, felder.von].find((f) => rot.has(f)) : undefined;
  return treffer ? { art: "geholfen", feld: treffer, zug } : { art: "nichtGeholfen", zug };
}
