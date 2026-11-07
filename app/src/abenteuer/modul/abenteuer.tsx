/**
 * Einstieg des Bausteins „Abenteuer“ (assets/abenteuer-*.js): alles, was die App erst auf Wunsch
 * lädt (Vertrag Abenteuermodul in schnittstelle/modul.ts).
 *
 * Rolle im Gesamtbild: Die Hülle (anbindung/AbenteuerAnsicht.tsx) importiert diese Datei
 * dynamisch; Phaser, inkjs und die Spiellogik hängen nur hier, deshalb landen sie in diesem
 * Baustein und nicht im Kern (vite.config.ts, chunkFileNames). `verbinde` nimmt die Dienste der
 * App entgegen; `useDienste` gibt sie der Oberwelt.
 * Abhängigkeiten: oberwelt/Oberwelt.tsx, schnittstelle/modul.ts.
 */
import { Oberwelt } from "../oberwelt/Oberwelt";
import { abenteuerErweiterung } from "../anbindung/Kartenleiste";
import type { Abenteuermodul, Appdienste } from "../schnittstelle/modul";

let dienste: Appdienste | null = null;

/** Die Dienste der App; wirft, wenn die Hülle `verbinde` nicht aufgerufen hat. */
export function appdienste(): Appdienste {
  if (!dienste) throw new Error("Abenteuer: Dienste der App nicht verbunden");
  return dienste;
}

export const modul: Abenteuermodul = {
  verbinde: (neue) => {
    dienste = neue;
  },
  Oberwelt,
  partieerweiterung: abenteuerErweiterung,
  kurzstand: () => {
    const stand = dienste?.liesStand();
    if (!stand) return null;
    return {
      clubs: stand.clubs.filter((c) => c.nadel !== null).length,
      nadeln: stand.clubs.filter((c) => c.nadel !== null).length,
    };
  },
};
