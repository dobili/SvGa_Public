/**
 * Die Sprecher, die als Geist erscheinen (Figuren mit geist: true in orte.json, regeln/geist.ts),
 * für die Porträts im Dialog. Die Spieldaten sind dann meist schon geladen (daten/laden.ts hält
 * sie vor); bis dahin ist die Menge leer.
 * Rolle im Gesamtbild: Hook für dialog/Dialog.tsx, in der Oberwelt wie in Partiemomenten.
 * Abhängigkeiten: React, daten/laden.ts, regeln/geist.ts.
 */
import { useEffect, useState } from "react";
import { ladeSpieldaten } from "../daten/laden";
import { geistsprecher } from "../regeln/geist";

const KEINE: ReadonlySet<string> = new Set();

/** Kurznamen der geisterhaften Sprecher. Beispiel: { "ambrose" }. Ohne Spieldaten leer. */
export function useGeistsprecher(): ReadonlySet<string> {
  const [geister, setzeGeister] = useState(KEINE);
  useEffect(() => {
    let aktiv = true;
    ladeSpieldaten().then(
      (daten) => {
        if (aktiv) setzeGeister(geistsprecher(daten.orte));
      },
      (fehler: unknown) => {
        // Ohne Spieldaten sieht das Porträt aus wie bisher; der Dialog selbst läuft weiter.
        console.warn("Geisterhafte Sprecher nicht geladen:", fehler);
      },
    );
    return () => {
      aktiv = false;
    };
  }, []);
  return geister;
}
