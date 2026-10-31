/**
 * Links für Herausforderungen (Gamifizierung P9): „#aufgabe-<trainer>-<aufgabe>“ bauen und lesen.
 *
 * Rolle im Gesamtbild: Ein Leser schickt einem Freund eine gelöste Aufgabe als Link; die App des
 * Freundes öffnet genau diese Aufgabe (Sprung in app/spruenge.ts, Bildschirm über
 * app/zusatzansichten.ts). Welche Trainer Herausforderungen anbieten, steht in der Liste
 * HERAUSFORDERUNGEN (herausforderungen.ts); hier nur die reine Rechnung mit den Adressen, damit
 * sie ohne Oberfläche prüfbar ist. Erlaubt sind nur Aufgaben aus freien Quellen (E7).
 * Abhängigkeiten: teilbild.ts (Adresse der App).
 */
import { APP_ADRESSE } from "./teilbild";

/** Vorsilbe aller Herausforderungen in der Adresse. */
export const HERAUSFORDERUNG_VORSILBE = "#aufgabe-";
/** Kennung der Zusatzansicht, die eine Herausforderung zeigt. */
export const HERAUSFORDERUNG_ANSICHT = "herausforderung";
/** Erlaubte Zeichen der Aufgabenkennung in der Adresse (Lichess-Kennungen, Bindestriche). */
const KENNUNG = /^[A-Za-z0-9_-]{1,40}$/;

/** Was in der Adresse steht: Trainer und Kennung der Aufgabe in der Adresse („l-1Vybh“). */
export interface Herausforderungsziel {
  readonly trainer: string;
  readonly aufgabe: string;
}

/**
 * Der Link zu einer Aufgabe.
 * Beispiel: ("taktik", "l-1Vybh") → „https://schach-von-grund-auf.com/app/#aufgabe-taktik-l-1Vybh“.
 */
export function herausforderungslink(trainer: string, aufgabe: string): string {
  return `${APP_ADRESSE}${HERAUSFORDERUNG_VORSILBE}${trainer}-${aufgabe}`;
}

/**
 * Liest eine Adresse; nur Trainer aus der Liste `trainer` zählen (der längste passende gewinnt,
 * damit Kennungen mit Bindestrich eindeutig bleiben). Null bei allem anderen.
 * Beispiel: („#aufgabe-taktik-l-1Vybh“, ["taktik"]) → { trainer: "taktik", aufgabe: "l-1Vybh" }.
 */
export function leseHerausforderung(
  hash: string,
  trainer: readonly string[],
): Herausforderungsziel | null {
  if (!hash.startsWith(HERAUSFORDERUNG_VORSILBE)) return null;
  const rest = hash.slice(HERAUSFORDERUNG_VORSILBE.length);
  const passend = [...trainer]
    .sort((a, b) => b.length - a.length)
    .find((k) => rest.startsWith(`${k}-`));
  if (!passend) return null;
  const aufgabe = rest.slice(passend.length + 1);
  return KENNUNG.test(aufgabe) ? { trainer: passend, aufgabe } : null;
}

/** Wert der Zusatzansicht („taktik:l-1Vybh“) und zurück. */
export function alsAnsichtswert(ziel: Herausforderungsziel): string {
  return `${ziel.trainer}:${ziel.aufgabe}`;
}

/** Liest den Wert der Zusatzansicht; null bei Unsinn. */
export function ausAnsichtswert(wert: string | null): Herausforderungsziel | null {
  const stelle = wert?.indexOf(":") ?? -1;
  if (!wert || stelle <= 0) return null;
  return { trainer: wert.slice(0, stelle), aufgabe: wert.slice(stelle + 1) };
}
