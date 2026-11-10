/**
 * Lauftest für Übergänge: Kommt ein Spieler zu Fuß zu jedem Übergang, und löst er dort aus?
 *
 * Rolle im Gesamtbild: Reine Logik für uebergangslauf.test.ts. Die Gesamtsimulation springt über
 * Auslöser und merkte deshalb nicht, dass der Autor beim ersten Spielen vom Dachboden nicht
 * herunterkam (10.11.2026). Hier geht der Held Kachel für Kachel über die Begehbarkeit der Karte
 * (begehbar.ts) und meldet mit derselben Regel wie die Szene (ausloeserebene.ts, meldeschritt).
 * Abhängigkeiten: ausloeserebene.ts.
 * Beispiel: Dachboden, Start auf „start“, Ziel „treppe“: Weg um den Tisch, letzter Schritt auf
 * die Luke → Meldung { name: "treppe", darauf: true }.
 */
import { MELDE_START, meldeschritt, type Ausloeser, type Meldung } from "./ausloeserebene";

/** Eine Kachel der Karte. */
export interface Kachelort {
  readonly x: number;
  readonly y: number;
}

const SCHRITTE = [
  { x: 0, y: -1, richtung: "oben" },
  { x: 0, y: 1, richtung: "unten" },
  { x: -1, y: 0, richtung: "links" },
  { x: 1, y: 0, richtung: "rechts" },
] as const;

/**
 * Kürzester Weg über freie Kacheln (vier Richtungen) vom Start zu einem der Ziele; die Liste
 * beginnt mit dem Start. null, wenn kein Ziel erreichbar ist. Start und Ziele müssen selbst nicht
 * frei sein: Der Held steht nach einem Kartenwechsel dort, wo der Auslöser liegt.
 */
export function kuerzesterWeg(
  frei: (x: number, y: number) => boolean,
  start: Kachelort,
  ziele: readonly Kachelort[],
): Kachelort[] | null {
  const ziel = new Set(ziele.map((z) => `${z.x},${z.y}`));
  const woher = new Map<string, Kachelort | null>([[`${start.x},${start.y}`, null]]);
  const offen: Kachelort[] = [start];
  for (let i = 0; i < offen.length; i++) {
    const hier = offen[i] as Kachelort;
    if (ziel.has(`${hier.x},${hier.y}`) && i > 0) return zurueck(woher, hier);
    for (const s of SCHRITTE) {
      const naechste = { x: hier.x + s.x, y: hier.y + s.y };
      const schluessel = `${naechste.x},${naechste.y}`;
      if (woher.has(schluessel) || !frei(naechste.x, naechste.y)) continue;
      woher.set(schluessel, hier);
      offen.push(naechste);
    }
  }
  return null;
}

function zurueck(woher: ReadonlyMap<string, Kachelort | null>, ende: Kachelort): Kachelort[] {
  const weg: Kachelort[] = [];
  for (let k: Kachelort | null = ende; k; k = woher.get(`${k.x},${k.y}`) ?? null) weg.unshift(k);
  return weg;
}

/**
 * Geht einen Weg ab und sammelt, was die Szene dabei meldet: zuerst das Bild am Start, dann je
 * Schritt die neue Blickrichtung auf der alten Kachel und danach die neue Kachel (so dreht sich
 * der Held im Spiel, bevor er die Kachel wechselt).
 */
export function gehe(alle: readonly Ausloeser[], weg: readonly Kachelort[]): Meldung[] {
  const meldungen: Meldung[] = [];
  let zustand = MELDE_START;
  let richtung = "unten";
  const bild = (ort: Kachelort) => {
    const schritt = meldeschritt(zustand, alle, { ...ort, richtung });
    zustand = schritt.zustand;
    if (schritt.meldung !== undefined) meldungen.push(schritt.meldung);
  };
  const start = weg[0];
  if (!start) return meldungen;
  bild(start);
  for (let i = 1; i < weg.length; i++) {
    const von = weg[i - 1] as Kachelort;
    const nach = weg[i] as Kachelort;
    const dx = nach.x - von.x;
    const dy = nach.y - von.y;
    richtung = SCHRITTE.find((s) => s.x === dx && s.y === dy)?.richtung ?? richtung;
    bild(von);
    bild(nach);
  }
  return meldungen;
}

/** Hat der Weg den Übergang ausgelöst (Meldung mit diesem Namen und darauf: true)? */
export function loestAus(meldungen: readonly Meldung[], name: string): boolean {
  return meldungen.some((m) => m?.name === name && m.typ === "ausloeser" && m.darauf);
}
