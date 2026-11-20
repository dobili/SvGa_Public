/**
 * Erinnerung nach einer Pause (regeln/wiedereinstieg.ts): Beim ersten Laden der Welt in dieser
 * Sitzung prüft die Oberwelt, wann zuletzt gespielt wurde. War es mehr als ein Tag, erscheint,
 * sobald die Welt frei ist, einmal eine Meldung mit Aufgabe und nächstem Schritt aus dem Tagebuch.
 *
 * Warum: Das Spiel wird über viele Tage gespielt; nach zwei Tagen weiß man nicht mehr, was der
 * Held gerade vorhatte (Durchgang „Wiedereinstieg“, 20.11.2026).
 * Rolle im Gesamtbild: Teil von oberwelt/Orientierung.tsx. „Einmal je Sitzung“ heißt einmal je
 * Laden der Seite: Der Merker liegt im Modul, nicht im Spielstand.
 * Abhängigkeiten: kern.ts, regeln/wiedereinstieg.ts, texte/texte.ts.
 */
import { useEffect } from "react";
import { erinnerungNachPause } from "../regeln/wiedereinstieg";
import { tSpiel } from "../texte/texte";
import type { Oberweltkern } from "./kern";

/** Wie die Prüfung in dieser Sitzung ausging: offen, gezeigt oder nicht nötig. */
let sitzung: "offen" | "erledigt" = "offen";

/** Nur für Tests: die Sitzung neu beginnen. */
export function neueSitzungFuerTests(): void {
  sitzung = "offen";
}

/**
 * Zeigt die Erinnerung einmal je Sitzung, wenn die Pause lang genug war.
 * Eingaben: Kern der Oberwelt, ob die Welt frei ist (kein Fenster, keine Meldung).
 * Beispiel: zwei Tage Pause, „Ein Abend im neuen Haus“ läuft → Meldung „Willkommen zurück! Ein
 * Abend im neuen Haus: Schlafen gehen …“.
 * Sonderfall: Ohne Pause oder ohne laufende Aufgabe gilt die Sitzung trotzdem als geprüft; ein
 * späterer Kartenwechsel fragt nicht noch einmal.
 */
export function useWiedereinstieg(k: Oberweltkern, frei: boolean): void {
  const { stand, welt } = k;
  useEffect(() => {
    if (sitzung !== "offen" || !stand || !welt || !frei) return;
    sitzung = "erledigt";
    const zeile = erinnerungNachPause(stand, welt.daten.quests, new Date());
    if (!zeile) return;
    k.setzeMeldung(
      tSpiel("wiedereinstieg.meldung", {
        titel: tSpiel(zeile.titel),
        schritt: tSpiel(zeile.schritt),
      }),
    );
    // Kern bleibt gleich; es zählen Stand, Welt und ob sie frei ist.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stand, welt, frei]);
}
