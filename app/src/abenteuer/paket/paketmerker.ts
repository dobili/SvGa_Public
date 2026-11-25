/**
 * Merklisten für Bilder des Pakets, die bis zur nächsten Änderung am Paket gelten.
 *
 * Warum: Nach einer Änderung (neue Version geladen, Paket gelöscht) gibt der Paketlader alle
 * Bildadressen frei (paketlader.ts, vergiss). Wer sie weiter in einer eigenen Liste hielt, zeigte
 * danach nichts mehr: Porträts fehlten im Dialog „immer wieder“ (Befund des Autors, 25.11.2026),
 * weil die App nach jeder Partie eine neue Version auf dem Server gleich nachlädt (Wunsch des
 * Autors, 19.11.2026). Bei den Fensterrahmen war es derselbe Fehler (pixelrahmen.ts, 18.11.2026).
 *
 * Rolle im Gesamtbild: Werkzeug für dialog/Portraet.tsx, dialog/Grossansicht.tsx und
 * anbindung/Spielkarte.tsx. Die Liste leert sich, bevor die Ansichten von der Änderung hören
 * (der Horcher hängt beim Laden des Moduls, also vor jeder Ansicht).
 * Abhängigkeiten: paket/paketlader.ts (beiPaketAenderung), React.
 */
import { useSyncExternalStore } from "react";
import { beiPaketAenderung } from "./paketlader";

/** Zählt die Änderungen am Paket in dieser Sitzung (Stand für usePaketstand). */
let stand = 0;
beiPaketAenderung(() => {
  stand += 1;
});

/**
 * Eine Liste, die sich bei jeder Änderung am Paket leert.
 * Beispiel: `const geladen = paketmerkliste<Promise<string | null>>();` in Grossansicht.tsx.
 */
export function paketmerkliste<T>(): Map<string, T> {
  const liste = new Map<string, T>();
  beiPaketAenderung(() => liste.clear());
  return liste;
}

/**
 * Der Stand des Pakets als Zahl: Sie wächst mit jeder Änderung. In die Abhängigkeiten eines
 * Ladeeffekts gesetzt, sucht eine offene Ansicht ihr Bild nach der Änderung neu.
 */
export function usePaketstand(): number {
  return useSyncExternalStore(
    beiPaketAenderung,
    () => stand,
    () => stand,
  );
}
