/**
 * Dialogdateien aus dem Zusatzpaket laden, ohne Phaser (Oberwelt und Spielhülle nutzen sie).
 *
 * Rolle im Gesamtbild: früher in oberwelt/weltdaten.ts; ausgelagert, weil die Spielhülle der
 * Partie (anbindung/Momentdialog.tsx, T11) sonst Phaser mitlädt. weltdaten.ts gibt sie weiter.
 * Abhängigkeiten: paket/paketlader.ts, texte/texte.ts.
 */
import { liesPaketJson } from "../paket/paketlader";
import { GRUNDSPRACHE, spielsprache } from "../texte/texte";

/**
 * Ein Dialog („datei“ ohne Endung) in der Sprache des Spiels; fehlt er dort, der deutsche
 * (Dokument 17, Abschnitt 3: Knoten und Variablen sind in allen Sprachen gleich).
 * Beispiel: Spiel auf Englisch, „ambrose“ nur deutsch übersetzt → dialoge/de/ambrose.json.
 */
export async function ladeDialog(datei: string): Promise<object> {
  const eigene = spielsprache();
  if (eigene !== GRUNDSPRACHE) {
    try {
      return await liesPaketJson<object>(`dialoge/${eigene}/${datei}.json`);
    } catch {
      // Dieser Dialog ist noch nicht übersetzt: der deutsche gilt (gewollter Rückfall).
    }
  }
  return liesPaketJson<object>(`dialoge/${GRUNDSPRACHE}/${datei}.json`);
}
