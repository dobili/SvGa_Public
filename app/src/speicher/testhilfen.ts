/**
 * Hilfen für die Tests des Speichers: frische IndexedDB und ein Gerätespeicher in Node.
 *
 * Rolle im Gesamtbild: Nur für Vitest. Die Tests laufen in Node; dort fehlen IndexedDB und
 * localStorage. fake-indexeddb bildet IndexedDB nach, ein Map-Ersatz den localStorage.
 * Abhängigkeiten: fake-indexeddb, vitest.
 */
import "fake-indexeddb/auto";
import { IDBFactory } from "fake-indexeddb";
import { vi } from "vitest";

/** localStorage-Ersatz auf einer Map. */
function geraetespeicher(): Storage {
  const werte = new Map<string, string>();
  return {
    get length() {
      return werte.size;
    },
    clear: () => werte.clear(),
    getItem: (schluessel) => werte.get(schluessel) ?? null,
    key: (stelle) => [...werte.keys()][stelle] ?? null,
    removeItem: (schluessel) => void werte.delete(schluessel),
    setItem: (schluessel, wert) => void werte.set(schluessel, String(wert)),
  };
}

/**
 * Setzt eine leere IndexedDB und einen leeren Gerätespeicher ein und lädt die Module neu.
 *
 * Ausgabe: der Gerätespeicher, um alte Merker vorzubelegen. Danach die Module mit
 * `await import("./speicher")` frisch laden (ihr Zustand liegt auf Modulebene).
 */
export function frischeUmgebung(): Storage {
  vi.resetModules();
  const speicher = geraetespeicher();
  vi.stubGlobal("indexedDB", new IDBFactory());
  vi.stubGlobal("window", { localStorage: speicher, sessionStorage: geraetespeicher() });
  return speicher;
}
