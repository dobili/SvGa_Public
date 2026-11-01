/**
 * Zustand beim Laden des Maia-Pakets (MaiaWahl.tsx): Ruhe, Fortschritt, Fehler oder kein Netz.
 *
 * Rolle im Gesamtbild: Eigene Datei, damit MaiaWahl.tsx nur Komponenten ausgibt (schnelles
 * Neuladen in der Entwicklung) und die Wahl der Meldung ohne Oberfläche prüfbar ist.
 * Abhängigkeiten: keine.
 */

/** Was die Seite „Bots und Wertung“ beim Laden zeigt. */
export type Ladezustand =
  | { readonly art: "ruhe" }
  | { readonly art: "laedt"; readonly geladen: number; readonly gesamt: number }
  | { readonly art: "fehler"; readonly meldung: string }
  /** Ohne Netz (Fehlertest f3): ein klarer Satz statt der Meldung des Browsers („Failed to fetch“). */
  | { readonly art: "ohneNetz" };

/**
 * Der Zustand nach einem Fehler beim Laden. Ohne Netz ein eigener, verständlicher Satz statt der
 * Meldung des Browsers, die nur Englisch kennt (Fehlertest f3, 01.11.2026).
 * Eingaben: der Fehler, ob das Gerät gerade online ist. Ausgabe: der Zustand für die Anzeige.
 * Beispiel: (TypeError „Failed to fetch“, offline) → { art: "ohneNetz" }; (Error „Prüfsumme
 * falsch“, online) → { art: "fehler", meldung: "Prüfsumme falsch" }.
 */
export function zustandNachFehler(fehler: unknown, online: boolean): Ladezustand {
  if (!online) return { art: "ohneNetz" };
  return { art: "fehler", meldung: fehler instanceof Error ? fehler.message : String(fehler) };
}
