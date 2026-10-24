/**
 * Meldungen an den Autor schicken (R57): Fehler, Wünsche, Buchbefunde, Absturzberichte.
 *
 * Rolle im Gesamtbild: Bis R57 kopierte „Fehler melden“ nur die Angaben in die Zwischenablage.
 * Jetzt geht die Meldung an POST /api/melden (worker/meldungen.ts) und erscheint im Dashboard des
 * Autors. Ohne Netz oder bei einem Fehler bleibt der alte Weg: Angaben kopieren.
 * Gesendet wird nur, was der Leser abschickt (Datenschutzerklärung, „Meldungen aus der App“).
 * Abhängigkeiten: app/version.ts, i18n.
 */
import { sprache } from "../i18n/sprache";
import { APP_VERSION } from "./version";

export const MELDEARTEN = ["fehler", "wunsch", "buch"] as const;
export type Meldeart = (typeof MELDEARTEN)[number] | "absturz";

/** Was der Leser schickt; Angaben zum Gerät nur mit seinem Häkchen. */
export interface Meldung {
  art: Meldeart;
  text: string;
  abbildung?: string;
  stellung?: string;
  seite?: string;
}

/** Höchstlänge des Texts (wie im Worker). */
export const TEXT_ZEICHEN = 4000;
const SCHNITTSTELLE = "/api/melden";
/** HTTP-Status für „zu viele Meldungen“ (Drossel des Workers). */
const ZU_VIELE = 429;

export type Sendeergebnis =
  { art: "gesendet"; nummer: number } | { art: "zuViele" } | { art: "fehler"; grund: string };

/** Angaben zum Gerät: App-Version, Browser, Bildschirm, Sprache. */
export function geraeteangaben(): Record<"version" | "geraet" | "bildschirm" | "sprache", string> {
  return {
    version: APP_VERSION,
    geraet: navigator.userAgent.slice(0, 300),
    bildschirm: `${window.screen.width}×${window.screen.height} @${window.devicePixelRatio}`,
    sprache: sprache(),
  };
}

/**
 * Schickt eine Meldung; nie eine Ausnahme, das Ergebnis sagt, was passiert ist.
 * Beispiel: { art: "buch", text: "Pfeil zeigt auf e5", abbildung: "3.12" } → { art: "gesendet", nummer: 17 }.
 * Sonderfälle: ohne Netz oder bei Serverfehler → { art: "fehler" }; Drossel → { art: "zuViele" }.
 */
export async function sendeMeldung(meldung: Meldung, mitGeraet: boolean): Promise<Sendeergebnis> {
  const koerper = {
    ...meldung,
    text: meldung.text.slice(0, TEXT_ZEICHEN),
    ...(mitGeraet ? geraeteangaben() : { version: APP_VERSION }),
  };
  try {
    const antwort = await fetch(SCHNITTSTELLE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(koerper),
    });
    if (antwort.status === ZU_VIELE) return { art: "zuViele" };
    if (!antwort.ok) return { art: "fehler", grund: String(antwort.status) };
    const { nummer } = (await antwort.json()) as { nummer: number };
    return { art: "gesendet", nummer };
  } catch (grund) {
    return { art: "fehler", grund: String(grund) };
  }
}
