/**
 * Speichert die Wahl im Feld „Variante“ (Variantenwahl.tsx) zusammen mit dem Eintrag.
 *
 * Rolle im Gesamtbild: Bindeglied zwischen dem Formular der Lernsammlung bzw. Fehlerdatenbank und
 * der reinen Rechnung (training/variantenverknuepfung.ts). Geschrieben wird über `aendere` mit
 * einer Funktion des aktuellen Standes wie überall (speicher.ts, Abgleich der Tabs).
 * Dazu der Zustand des Feldes für die Formulare (useVariantenwahl).
 * Abhängigkeiten: React, speicher/speicher.ts, training/variantenverknuepfung.ts, i18n.
 */
import { useState } from "react";
import { t } from "../../../i18n/sprache";
import { aendere, speicherzustand } from "../../../speicher/speicher";
import type { Variation } from "../../../training/variationen";
import {
  KEINE_WAHL,
  mitVariantenwahl,
  WAHL_KEINE,
  type Variantenwahl,
  type Verknuepfungsziel,
} from "../../../training/variantenverknuepfung";

/**
 * Wendet die Wahl an. Ausgabe: eine Meldung, wenn eine neue Variante nicht mehr passt (Grenze von
 * Format 8), sonst null. Beispiel: Wahl „neu“ am Eintrag s-1 → neue Variante mit Quelle s-1.
 */
export function speichereVariantenwahl(
  ziel: Verknuepfungsziel,
  wahl: Variantenwahl,
  neu: () => Variation | null,
): string | null {
  if (wahl.wahl === WAHL_KEINE && wahl.loesen.length === 0) return null;
  const jetzt = new Date();
  const probe = mitVariantenwahl(speicherzustand().daten.variationen, ziel, wahl, neu, jetzt);
  void aendere((daten) => ({
    ...daten,
    variationen: mitVariantenwahl(daten.variationen, ziel, wahl, neu, jetzt).liste,
  }));
  return probe.grenze ? t("varianten.grenze.varianten") : null;
}

/**
 * Zustand des Feldes „Variante“ in einem Formular: Wahl, Meldung an der Grenze und Anwenden.
 * ``wende`` gibt true zurück, wenn alles gespeichert ist (dann darf das Formular zugehen).
 */
export function useVariantenwahl() {
  const [wahl, setzeWahl] = useState<Variantenwahl>(KEINE_WAHL);
  const [meldung, setzeMeldung] = useState<string | null>(null);
  const wende = (ziel: Verknuepfungsziel, neu: () => Variation | null): boolean => {
    const grenze = speichereVariantenwahl(ziel, wahl, neu);
    setzeMeldung(grenze);
    return grenze === null;
  };
  return { wahl, setzeWahl, meldung, wende };
}
