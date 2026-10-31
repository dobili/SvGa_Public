/**
 * Wie weit der Leser bis zu einem gesperrten Extra ist (Gestaltung „Deine Extras neu“,
 * 31.10.2026): für den kleinen Balken unter der Bedingung („Ab Stufe 9“, 6 von 9).
 *
 * Rolle im Gesamtbild: training/extras.ts sagt nur ja oder nein; die Kachel zeigt zusätzlich, wie
 * nah das Ziel ist. Je Bedingungsart eine Zeile in `FORTSCHRITTE`; eine Art ohne zählbaren Stand
 * (Orden: die Lage kennt nur volle Gruppen) gibt null, dann zeigt die Kachel keinen Balken.
 * Abhängigkeiten: training/extras.ts, training/meisterschaftsstand.ts.
 */
import type { Bedingung, Extralage } from "../../../training/extras";
import { zaehleThemen } from "../../../training/meisterschaftsstand";

/** Erreichter Stand und Ziel; erreicht ist nie größer als das Ziel. */
export interface Extrafortschritt {
  readonly erreicht: number;
  readonly ziel: number;
}

/** Je Bedingungsart der Stand; eine neue Art bekommt hier eine Zeile. */
const FORTSCHRITTE: {
  readonly [A in Bedingung["art"]]: (
    bedingung: Extract<Bedingung, { art: A }>,
    lage: Extralage,
  ) => Extrafortschritt | null;
} = {
  stufe: (b, lage) => ({ erreicht: lage.stufe, ziel: b.ab }),
  orden: () => null,
  meisterschaft: (b, lage) => ({
    erreicht: zaehleThemen(lage.themenstufen, b.stufe, b.praefix),
    ziel: b.anzahl,
  }),
};

/**
 * Stand bis zur Bedingung oder null.
 * Beispiel: { art: "stufe", ab: 9 } bei Stufe 6 → { erreicht: 6, ziel: 9 }.
 */
export function extrafortschritt(bedingung: Bedingung, lage: Extralage): Extrafortschritt | null {
  // Die Rechnung gehört zur Art der Bedingung (FORTSCHRITTE ist danach getippt).
  const rechne = FORTSCHRITTE[bedingung.art] as (
    b: Bedingung,
    l: Extralage,
  ) => Extrafortschritt | null;
  const stand = rechne(bedingung, lage);
  return stand && { erreicht: Math.min(stand.erreicht, stand.ziel), ziel: stand.ziel };
}
