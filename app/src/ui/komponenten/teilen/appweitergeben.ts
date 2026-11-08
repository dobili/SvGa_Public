/**
 * „App weitergeben“ (Wunsch des Autors, 8.11.2026): Adresse, Links für WhatsApp und E-Mail,
 * Teilen über das Teilen-Menü des Geräts und Kopieren in die Zwischenablage.
 *
 * Rolle im Gesamtbild: Kinder sollen die App per Klick an Freunde weitergeben können. Ziel ist
 * die Installationsseite (/installieren/, Entscheidung 15.10.2026): Sie zeigt nur, wie man die App
 * bekommt, ohne Buchbeschreibung und Shop-Links, und leitet eine schon installierte App gleich
 * nach /app/. Nichts geht an einen Server der App; was das Gerät verlässt, schickt der Leser
 * selbst über die App seiner Wahl. Die Oberfläche steht in AppWeitergeben.tsx; hier nur die
 * Rechnung, damit sie ohne Oberfläche prüfbar ist.
 * Abhängigkeiten: teilbild.ts (Adresse der Website).
 */
import { TEILADRESSE } from "./teilbild";

/** Die Seite, auf der ein Neuling die App bekommt. */
export const WEITERGABE_ADRESSE = `https://${TEILADRESSE}/installieren/`;

/** Was geteilt wird: Betreff (für Mail und Teilen-Menü), kurzer Satz und Adresse. */
export interface Weitergabe {
  readonly betreff: string;
  readonly text: string;
  readonly adresse: string;
}

/** Satz und Adresse in einer Nachricht. Beispiel: „Lern Schach mit mir! … https://…/installieren/“. */
export function nachricht(weitergabe: Weitergabe): string {
  return `${weitergabe.text} ${weitergabe.adresse}`;
}

/**
 * Link, der WhatsApp mit fertiger Nachricht öffnet (Empfänger wählt man dort).
 * Beispiel: → „https://wa.me/?text=Lern%20Schach%20…%20https%3A%2F%2F…%2Finstallieren%2F“.
 */
export function whatsappLink(weitergabe: Weitergabe): string {
  return `https://wa.me/?text=${encodeURIComponent(nachricht(weitergabe))}`;
}

/**
 * Link, der das Mailprogramm mit Betreff und Text öffnet (Empfänger leer).
 * Beispiel: → „mailto:?subject=Schach%20von%20Grund%20auf%20…&body=Lern%20Schach%20…“.
 */
export function mailLink(weitergabe: Weitergabe): string {
  const betreff = encodeURIComponent(weitergabe.betreff);
  return `mailto:?subject=${betreff}&body=${encodeURIComponent(nachricht(weitergabe))}`;
}

/** Ob das Gerät ein Teilen-Menü hat (Handys, Safari, Edge; Firefox am Rechner meist nicht). */
export function kannTeilen(): boolean {
  return typeof navigator.share === "function";
}

/** Wie das Teilen ausging. */
export type Weitergabeergebnis = "geteilt" | "abgebrochen";

/**
 * Öffnet das Teilen-Menü des Geräts mit Titel, Satz und Adresse; dort erscheinen WhatsApp,
 * Signal, Telegram, Mail …
 * Sonderfall: Schließt der Leser das Menü, ist das „abgebrochen“, kein Fehler; andere Fehler
 * (etwa fehlende Erlaubnis) wirft die Funktion weiter, der Knopf meldet sie.
 */
export async function teileApp(weitergabe: Weitergabe): Promise<Weitergabeergebnis> {
  try {
    await navigator.share({
      title: weitergabe.betreff,
      text: weitergabe.text,
      url: weitergabe.adresse,
    });
    return "geteilt";
  } catch (fehler) {
    if (fehler instanceof DOMException && fehler.name === "AbortError") return "abgebrochen";
    throw fehler;
  }
}

/**
 * Legt nur die Adresse in die Zwischenablage (zum Einfügen in jede Nachricht).
 * Sonderfall: Ohne Zwischenablage (alter Browser, keine Erlaubnis) wirft die Funktion.
 */
export async function kopiereAdresse(adresse: string): Promise<void> {
  if (!navigator.clipboard) throw new Error("Keine Zwischenablage");
  await navigator.clipboard.writeText(adresse);
}
