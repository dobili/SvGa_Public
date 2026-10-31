/**
 * Extras in den Kacheln der Einstellungen (Gamifizierung P7): eigene Gruppe „Verdient“ für Brett
 * und Figuren, Sperre je Kachel und Namen.
 *
 * Rolle im Gesamtbild: Die Karte „Einstellungen“ (einstellungen/EinstellungenKarte.tsx) zeigt
 * Brettfarben und Figurensätze als Kacheln. Die Extras dieser Arten stehen in einer eigenen
 * Gruppe; gesperrte erscheinen als Silhouette mit Bedingung (Vorschauwahl.tsx). Ein neues Extra
 * der Art „brett“ oder „figuren“ erscheint dort von selbst, sobald es in training/extras.ts steht.
 * Abhängigkeiten: training/extras.ts, extralage.ts, extratexte.ts, i18n.
 */
import type { Textschluessel } from "../../../i18n/sprache";
import { extrasDerArt, extraZu, type Extraart } from "../../../training/extras";
import { useSperre } from "./extralage";
import { bedingungstext, extraname } from "./extratexte";

/** Die Kachelgruppe der Extras einer Art. Beispiel: „figuren“ → Gruppe „Verdient“ mit „gold“. */
export function extragruppe<T extends string>(
  art: Extraart,
): { titel: Textschluessel; werte: T[] } {
  return { titel: "extras.gruppe", werte: extrasDerArt(art).map((e) => e.wert as T) };
}

/** Sperre je Kachel als Text der Bedingung; frei oder gewählt ergibt undefined. */
export function useKachelsperre(
  art: Extraart,
  gewaehlt: string,
): (wert: string) => string | undefined {
  const sperre = useSperre(art, gewaehlt);
  return (wert) => {
    const extra = sperre(wert);
    return extra && bedingungstext(extra.bedingung);
  };
}

/**
 * Name einer Kachel: für ein Extra sein Name, sonst der Text der Einstellungen (`sonst`).
 * Beispiel: („brett“, „nacht-gold“) → „Nacht und Gold“; („brett“, „holz“) → sonst() → „Holz“.
 */
export function kachelname(art: Extraart, wert: string, sonst: () => string): string {
  const extra = extraZu(art, wert);
  return extra ? extraname(extra) : sonst();
}
