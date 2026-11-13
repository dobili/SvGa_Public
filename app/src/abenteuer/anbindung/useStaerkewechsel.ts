/**
 * Wendet die Stärkewechsel der Begegnung während der Partie an (regeln/staerkewechsel.ts): Sobald
 * ein Dialog in der Partie eine Variable setzt (Partiemoment, Momentdialog.tsx), spielt der
 * Gegner für den Rest der Partie anders.
 *
 * Rolle im Gesamtbild: Teil der Spielhülle (PartieHuelle.tsx). Schreibt die neue Einstellung in
 * die laufende Partie; die Engine liest sie beim nächsten Zug des Gegners.
 * Abhängigkeiten: anbindung/useBegegnung.ts, anbindung/dienste.ts, speicher/speicher.ts.
 */
import { useEffect } from "react";
import { mitLaufender } from "../../speicher/partien";
import { aendere } from "../../speicher/speicher";
import type { Partie } from "../../spiel/partie";
import { mitStaerkewechsel } from "../regeln/staerkewechsel";
import { useAbenteuerstand } from "./dienste";
import { useBegegnung } from "./useBegegnung";

/** Eingabe: die laufende Partie. Ausgabe: keine (schreibt in den Speicher). */
export function useStaerkewechsel(partie: Partie): void {
  const begegnung = useBegegnung(partie.einstellung.abenteuer?.kennung ?? "");
  const variablen = useAbenteuerstand()?.dialogvariablen;
  const wechsel = begegnung?.staerkeNach;
  useEffect(() => {
    if (!wechsel || !variablen || partie.ende) return;
    void aendere((d) => {
      const laufend = d.spiel.laufend;
      if (!laufend || laufend.id !== partie.id) return d;
      const neu = mitStaerkewechsel(laufend.einstellung, wechsel, variablen);
      return neu ? { ...d, spiel: mitLaufender(d.spiel, { ...laufend, einstellung: neu }) } : d;
    });
  }, [wechsel, variablen, partie.id, partie.ende]);
}
