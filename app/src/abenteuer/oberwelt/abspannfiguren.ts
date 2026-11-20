/**
 * Die Figuren des Abspanns: alle Figuren der Welt, je Name einmal.
 *
 * Warum eigene Datei: Abspann.tsx exportiert nur die Komponente; die Liste wird für sich geprüft
 * (Abspann.test.ts).
 * Abhängigkeiten: daten/laden.ts (Spieldaten).
 */
import type { Spieldaten } from "../daten/laden";

/**
 * Alle Figuren der Welt, je Name einmal, in der Reihenfolge der Orte. Warum je Name: Manche Figur
 * steht an mehreren Orten unter eigener Kennung (Mama zu Hause, vor dem Haus, in Ironwood); nach der
 * Kennung gezählt stand sie dreimal im Abspann, zweimal ohne Porträt (Spieler-Durchlauf quer,
 * 20.11.2026). Das Porträt kommt von der Kennung, die zum Namen gehört („figur.pratt.name“ →
 * „pratt“, nicht „prattSteg“), sonst von der ersten.
 * Beispiel: mutter, mutterAussen, mama → einmal „Mama“ mit dem Porträt „mutter“.
 */
export function figurenDerWelt(daten: Spieldaten): { kennung: string; name: string }[] {
  const jeName = new Map<string, string>();
  for (const f of daten.orte.flatMap((o) => o.figuren)) {
    const kurz = f.kennung.split(".").at(-1) ?? f.kennung;
    const vorhanden = jeName.get(f.name);
    if (vorhanden === undefined || f.name === `figur.${kurz}.name`) jeName.set(f.name, kurz);
  }
  return [...jeName].map(([name, kennung]) => ({ kennung, name }));
}
