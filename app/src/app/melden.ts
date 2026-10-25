/**
 * Meldungen an den Autor schicken (R57): Fehler, Wünsche, Buchbefunde, Absturzberichte.
 *
 * Rolle im Gesamtbild: Bis R57 kopierte „Fehler melden“ nur die Angaben in die Zwischenablage.
 * Jetzt geht die Meldung an POST /api/melden (worker/meldungen.ts) und erscheint im Dashboard des
 * Autors. Bei einem Fehler des Servers bleibt der alte Weg: Angaben kopieren. Fehlt das Netz,
 * wartet die Meldung seit V9 (Nutzungsprüfung 25.10.2026) auf dem Gerät und geht beim Ereignis
 * `online` oder beim nächsten Start hinaus (app/meldeschlange.ts).
 * Gesendet wird nur, was der Leser abschickt (Datenschutzerklärung, „Meldungen aus der App“).
 * Abhängigkeiten: app/meldeschlange.ts, app/version.ts, i18n.
 */
import { sprache } from "../i18n/sprache";
import { liesSchlange, merkeVor, ohne, schreibeSchlange, type Meldekoerper } from "./meldeschlange";
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
/** Ab hier antwortet der Server mit einem eigenen Fehler (5xx), nicht die Meldung ist schuld. */
const SERVERFEHLER_AB = 500;

/** „vorgemerkt“: ohne Netz auf dem Gerät gespeichert, geht später hinaus (V9). */
export type Sendeergebnis =
  | { art: "gesendet"; nummer: number }
  | { art: "vorgemerkt" }
  | { art: "zuViele" }
  | { art: "fehler"; grund: string };

/** Ergebnis eines einzelnen Versuchs; „ohneNetz“ und „abgelehnt“ (4xx) nur intern. */
type Versuch =
  | { art: "gesendet"; nummer: number }
  | { art: "zuViele" }
  | { art: "abgelehnt"; grund: string }
  | { art: "serverfehler"; grund: string }
  | { art: "ohneNetz"; grund: string };

/** Angaben zum Gerät: App-Version, Browser, Bildschirm, Sprache. */
export function geraeteangaben(): Record<"version" | "geraet" | "bildschirm" | "sprache", string> {
  return {
    version: APP_VERSION,
    geraet: navigator.userAgent.slice(0, 300),
    bildschirm: `${window.screen.width}×${window.screen.height} @${window.devicePixelRatio}`,
    sprache: sprache(),
  };
}

/** Der Körper der Anfrage: ohne Häkchen nichts außer Art, Text und Ort (Datenschutzerklärung). */
function meldekoerper(meldung: Meldung, mitGeraet: boolean): Meldekoerper {
  return {
    ...meldung,
    text: meldung.text.slice(0, TEXT_ZEICHEN),
    ...(mitGeraet ? geraeteangaben() : {}),
  };
}

/** Wertet die Antwort des Servers aus. */
async function auswertung(antwort: Response): Promise<Versuch> {
  const grund = String(antwort.status);
  if (antwort.status === ZU_VIELE) return { art: "zuViele" };
  if (antwort.status >= SERVERFEHLER_AB) return { art: "serverfehler", grund };
  if (!antwort.ok) return { art: "abgelehnt", grund };
  try {
    const { nummer } = (await antwort.json()) as { nummer: number };
    return { art: "gesendet", nummer };
  } catch (fehler) {
    return { art: "serverfehler", grund: String(fehler) };
  }
}

/** Ein Sendeversuch. Ohne Netz (offline gemeldet oder Netzwerkfehler) → „ohneNetz“. */
async function versuche(koerper: Meldekoerper): Promise<Versuch> {
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    return { art: "ohneNetz", grund: "offline" };
  }
  let antwort: Response;
  try {
    antwort = await fetch(SCHNITTSTELLE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(koerper),
    });
  } catch (grund) {
    // fetch scheitert nur ohne Verbindung (oder wenn sie abreißt); Serverfehler kommen als Status.
    return { art: "ohneNetz", grund: String(grund) };
  }
  return auswertung(antwort);
}

/**
 * Schickt eine Meldung; nie eine Ausnahme, das Ergebnis sagt, was passiert ist.
 * Beispiel: { art: "buch", text: "Pfeil zeigt auf e5", abbildung: "3.12" } → { art: "gesendet", nummer: 17 }.
 * Sonderfälle: ohne Netz → auf dem Gerät vorgemerkt ({ art: "vorgemerkt" }, V9); Serverfehler
 * oder Ablehnung → { art: "fehler" }; Drossel → { art: "zuViele" }. Nach einem Erfolg gehen
 * auch wartende Meldungen hinaus, denn dann ist das Netz offensichtlich da.
 */
export async function sendeMeldung(meldung: Meldung, mitGeraet: boolean): Promise<Sendeergebnis> {
  const koerper = meldekoerper(meldung, mitGeraet);
  const versuch = await versuche(koerper);
  switch (versuch.art) {
    case "ohneNetz":
      merkeVor(koerper, new Date());
      return { art: "vorgemerkt" };
    case "gesendet":
      void sendeVorgemerkte();
      return versuch;
    case "zuViele":
      return versuch;
    case "abgelehnt":
    case "serverfehler":
      return { art: "fehler", grund: versuch.grund };
  }
}

/** Läuft gerade ein Nachsenden? Dann wartet ein zweiter Anstoß nicht doppelt. */
let nachsendenLaeuft = false;

/**
 * Schickt die wartenden Meldungen nacheinander, älteste zuerst (V9).
 *
 * Warum: Wer ohne Netz einen Fehler meldet, soll ihn nicht später noch einmal tippen müssen.
 * Ausgabe: Zahl der gesendeten Meldungen.
 * Sonderfälle: Wieder ohne Netz, gedrosselt oder Serverfehler → aufhören, der Rest wartet auf
 * den nächsten Anstoß. Eine Ablehnung (4xx) wird nie gelingen; diese Meldung fällt weg.
 * Neue Meldungen, die währenddessen dazukommen, bleiben erhalten (Entfernen nach Kennung).
 */
export async function sendeVorgemerkte(jetzt: Date = new Date()): Promise<number> {
  if (nachsendenLaeuft) return 0;
  nachsendenLaeuft = true;
  let gesendet = 0;
  try {
    for (const eintrag of liesSchlange(jetzt)) {
      const versuch = await versuche(eintrag.koerper);
      if (versuch.art !== "gesendet" && versuch.art !== "abgelehnt") break;
      if (versuch.art === "gesendet") gesendet += 1;
      schreibeSchlange(ohne(liesSchlange(jetzt), eintrag.kennung));
    }
  } finally {
    nachsendenLaeuft = false;
  }
  return gesendet;
}

/**
 * Sendet wartende Meldungen beim Start und jedes Mal, wenn das Gerät wieder online ist.
 * Einmal beim Start der App aufrufen (main.tsx).
 */
export function starteNachsenden(): void {
  window.addEventListener("online", () => void sendeVorgemerkte());
  void sendeVorgemerkte();
}
