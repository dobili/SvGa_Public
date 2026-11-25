/**
 * Nachlauf der Auswertung: rechnet eine beendete Partie zu Ende, auch wenn ihre Ansicht schon
 * geschlossen ist.
 *
 * Rolle im Gesamtbild: useAuswertung.ts rechnet, solange eine Ansicht offen ist; schließt sie,
 * hört die Rechnung auf, und der Rest kommt beim nächsten Öffnen dran. Im Schach-Abenteuer geht
 * der Spieler nach der Partie sofort in die Oberwelt (Wunsch des Autors, 26.11.2026: „Besprechen“
 * im Tagebuch soll sofort bereit sein). Darum rechnet der Nachlauf die letzten Stellungen ohne
 * Ansicht weiter, mit derselben Auswertungs-Engine, demselben Zwischenspeicher je Stellung und
 * demselben Speichern (werteAus); eine offene Besprechung hängt sich an dieselben Rechnungen.
 * Beginnt eine neue Partie, hält der Nachlauf an (stoppeNachlaeufe), damit der Bot seinen Kern
 * behält; den Rest rechnet dann wie bisher die Besprechung beim Öffnen.
 * Abhängigkeiten: useAuswertung.ts (werteAus), speicher/ (liest, ob die Partie schon Werte hat).
 */
import type { Partie } from "../../../spiel/partie";
import { werteAus } from "./useAuswertung";

/** Laufende Nachläufe je Partie: die Marke, mit der sie aufhören. */
const laufende = new Map<string, { aktiv: boolean }>();

/**
 * Startet den Nachlauf einer beendeten Partie, wenn er nicht schon läuft.
 * Eingaben: die Partie, ob ihr Eintrag schon Werte hat. Ausgabe: das Versprechen der Rechnung
 * (true, wenn gespeichert), für Tests; die Aufrufer der Oberfläche warten nicht darauf.
 * Beispiel: Clubkampf in Maple Falls beendet, 30 von 34 Stellungen im Zwischenspeicher → vier
 * Stellungen, Nachprüfung, Speichern; das Tagebuch zeigt danach „Besprechen“ ohne Rechnen.
 * Sonderfälle: Laufende Partie oder schon ausgewertet → nichts (false). Ein Fehler der Engine wird
 * gemeldet, der Nachlauf endet; die Besprechung rechnet dann selbst.
 */
export function starteNachlauf(partie: Partie, schonAusgewertet: boolean): Promise<boolean> {
  if (partie.ende === null || schonAusgewertet || laufende.has(partie.id)) {
    return Promise.resolve(false);
  }
  const marke = { aktiv: true };
  laufende.set(partie.id, marke);
  return werteAus(partie, { nachher: true, laeuft: () => marke.aktiv })
    .catch((grund: unknown) => {
      console.error("Nachlauf der Auswertung fehlgeschlagen:", grund);
      return false;
    })
    .finally(() => {
      if (laufende.get(partie.id) === marke) laufende.delete(partie.id);
    });
}

/**
 * Hält alle Nachläufe an außer dem der genannten Partie (eine neue Partie beginnt).
 * Beispiel: Nachlauf der Wegsperre S15 läuft, der Spieler beginnt S16 → S15 hört auf.
 */
export function stoppeNachlaeufe(ausser: string | null = null): void {
  for (const [id, marke] of laufende) {
    if (id === ausser) continue;
    marke.aktiv = false;
    laufende.delete(id);
  }
}

/** Läuft für diese Partie ein Nachlauf? (Tests) */
export function nachlaufAktiv(id: string): boolean {
  return laufende.has(id);
}
