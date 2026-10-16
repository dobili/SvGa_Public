/**
 * Lädt die Buchvarianten aus Kapitel 2 und 3 und baut daraus den Eröffnungsindex, dazu seit
 * 0.2.32 die Namen der Eröffnungen außerhalb des Buches (Lichess-Liste).
 *
 * Rolle im Gesamtbild: Das Werkzeug k2-eroeffnung erkennt Eröffnungen über den
 * Stellungsvergleich (Pflichtenheft 6.2); dafür braucht es die Beispiele beider Kapitel, auch wenn
 * gerade eine Abbildung aus einem anderen Kapitel offen ist. Vor Kapitel 2 lädt nichts.
 * Abhängigkeiten: daten/laden.ts, schach/eroeffnungsindex.ts, useDaten.
 */
import { useMemo } from "react";
import { ladeEroeffnungsliste, ladeKapitel } from "../../daten/laden";
import { eroeffnungsnamenAus } from "../../schach/eroeffnungsnamen";
import { baueEroeffnungsindex, type Eroeffnungsindex } from "../../schach/eroeffnungsindex";
import { useDaten } from "./useDaten";

/** Ab diesem Kapitel gibt es das Werkzeug „Eröffnung“. */
const ERSTES_KAPITEL = 2;
const KAPITEL_MIT_VARIANTEN = [2, 3];

/** Der Index, sobald geladen; vor Kapitel 2 und während des Ladens undefined. */
export function useEroeffnungsindex(kapitel: number): Eroeffnungsindex | undefined {
  const noetig = kapitel >= ERSTES_KAPITEL;
  const daten = useDaten(
    () =>
      noetig
        ? Promise.all([Promise.all(KAPITEL_MIT_VARIANTEN.map(ladeKapitel)), ladeEroeffnungsliste()])
        : Promise.resolve(null),
    noetig ? "eroeffnungen" : "keine-eroeffnungen",
  );
  return useMemo(() => {
    if (daten.art !== "fertig" || !daten.wert) return undefined;
    const [kapitel, liste] = daten.wert;
    return baueEroeffnungsindex(kapitel, eroeffnungsnamenAus(liste));
  }, [daten]);
}
