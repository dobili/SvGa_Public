/**
 * Lädt die Buchvarianten aus Kapitel 2 und 3 und baut daraus den Eröffnungsindex, dazu seit
 * 0.2.32 die Namen der Eröffnungen außerhalb des Buches (Lichess-Liste).
 *
 * Rolle im Gesamtbild: Das Werkzeug k2-eroeffnung erkennt Eröffnungen über den
 * Stellungsvergleich (Pflichtenheft 6.2); dafür braucht es die Beispiele beider Kapitel, auch wenn
 * gerade eine Abbildung aus einem anderen Kapitel offen ist. Vor Kapitel 2 lädt nichts.
 * Seit V6 (Nutzungsprüfung 25.10.2026) kommt der Index aus dem Vorrat (schach/
 * eroeffnungsindexVorrat.ts), und das erste Bauen wartet bis nach dem nächsten Bild: So erscheint
 * „Spielen“ sofort, die Eröffnungsliste einen Augenblick später.
 * Abhängigkeiten: daten/laden.ts, schach/eroeffnungsindexVorrat.ts, nachDemNaechstenBild, useDaten.
 */
import { ladeEroeffnungsliste, ladeKapitel, type Eroeffnungsliste } from "../../daten/laden";
import {
  eroeffnungsindexBereit,
  eroeffnungsindexFuer,
  eroeffnungsnamenFuer,
} from "../../schach/eroeffnungsindexVorrat";
import type { Eroeffnungsindex } from "../../schach/eroeffnungsindex";
import { nachDemNaechstenBild } from "./nachDemNaechstenBild";
import { useDaten } from "./useDaten";

/** Ab diesem Kapitel gibt es das Werkzeug „Eröffnung“. */
const ERSTES_KAPITEL = 2;
/** Die Kapitel mit den Buchvarianten der Eröffnungen. */
export const KAPITEL_MIT_VARIANTEN: readonly number[] = [2, 3];

/**
 * Lädt Kapitel 2 und 3 und liefert den Eröffnungsindex (aus dem Vorrat oder neu gebaut).
 *
 * Warum: Das Bauen kostet gedrosselt gut 100 ms. Lag es im selben Bild wie der Tipp auf „Spielen“
 * oder „Partie beginnen“, erschien der Bildschirm entsprechend später (V6). Ist der Index noch
 * nicht im Vorrat, wartet das Bauen deshalb bis nach dem nächsten Bild.
 * Eingabe: optional die Namen der Lichess-Liste. Ausgabe: der Index.
 * Beispiel: usePartie (Buchzüge der Engine) ohne Namen, die Eröffnungswahl mit Namen; gebaut
 * wird für beide einmal.
 */
export async function ladeEroeffnungsindex(
  ladeNamen?: () => Promise<Eroeffnungsliste>,
): Promise<Eroeffnungsindex> {
  const [kapitel, liste] = await Promise.all([
    Promise.all(KAPITEL_MIT_VARIANTEN.map(ladeKapitel)),
    ladeNamen ? ladeNamen() : Promise.resolve(null),
  ]);
  if (!eroeffnungsindexBereit(kapitel)) await nachDemNaechstenBild();
  return eroeffnungsindexFuer(kapitel, liste ? eroeffnungsnamenFuer(liste) : undefined);
}

/** Der Index, sobald geladen; vor Kapitel 2 und während des Ladens undefined. */
export function useEroeffnungsindex(kapitel: number): Eroeffnungsindex | undefined {
  const noetig = kapitel >= ERSTES_KAPITEL;
  const daten = useDaten(
    () => (noetig ? ladeEroeffnungsindex(ladeEroeffnungsliste) : Promise.resolve(undefined)),
    noetig ? "eroeffnungen" : "keine-eroeffnungen",
  );
  return daten.art === "fertig" ? daten.wert : undefined;
}
