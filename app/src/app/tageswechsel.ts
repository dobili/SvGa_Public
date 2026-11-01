/**
 * Neuer Tag bei offener App: Die Hülle zeichnet neu, sobald ein neuer Tag beginnt (um Mitternacht
 * oder wenn die App nach der Nacht wieder in den Vordergrund kommt).
 *
 * Rolle im Gesamtbild: Karten wie „Heute“, das Wochenziel, die Tagesaufgabe und „Dein Oktober ist
 * fertig“ rechnen beim Zeichnen mit `new Date()`. Ohne neues Zeichnen stand nach Mitternacht oder
 * am nächsten Morgen noch der alte Tag da, bis der Leser etwas antippte (Fehlertest f3,
 * 01.11.2026). App.tsx ruft useTageswechsel einmal in der Hülle auf; die Bildschirme bleiben
 * erhalten (kein neuer Schlüssel), sie zeichnen nur neu.
 * Abhängigkeiten: React, training/kurzplaene.ts (Tagesschlüssel der Ortszeit).
 */
import { useEffect, useState } from "react";
import { tagesschluessel } from "../training/kurzplaene";

/** Kleiner Puffer nach Mitternacht, damit der Zeitgeber sicher schon im neuen Tag feuert (ms). */
const PUFFER_MS = 1000;

/**
 * Millisekunden bis zum nächsten Tagesbeginn in Ortszeit, mit kleinem Puffer.
 * Beispiel: 31.10.2026, 23:59:00 → 61 000. Sonderfall: Am Tag der Zeitumstellung zählt die
 * echte Länge (Mitternacht über das Datum, nicht über 24 Stunden).
 */
export function msBisMorgen(jetzt: Date): number {
  const morgen = new Date(jetzt.getFullYear(), jetzt.getMonth(), jetzt.getDate() + 1);
  return morgen.getTime() - jetzt.getTime() + PUFFER_MS;
}

/** Zeichnet die Komponente neu, sobald ein neuer Tag beginnt; gibt den Tagesschlüssel zurück. */
export function useTageswechsel(): string {
  const [tag, setzeTag] = useState(() => tagesschluessel(new Date()));
  useEffect(() => {
    const pruefe = () => setzeTag(tagesschluessel(new Date()));
    const zeit = setTimeout(pruefe, msBisMorgen(new Date()));
    const beiSicht = () => {
      if (document.visibilityState === "visible") pruefe();
    };
    document.addEventListener("visibilitychange", beiSicht);
    return () => {
      clearTimeout(zeit);
      document.removeEventListener("visibilitychange", beiSicht);
    };
  }, [tag]);
  return tag;
}
