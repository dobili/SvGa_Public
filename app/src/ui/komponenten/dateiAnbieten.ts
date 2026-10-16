/**
 * Text als Datei zum Speichern anbieten (Datensicherung, PGN einer Partie).
 *
 * Rolle im Gesamtbild: Gemeinsame Hilfe für alles, was der Leser als Datei sichert. Im Browser
 * ein Herunterladen, auf dem iPhone „Sichern in Dateien“.
 * Abhängigkeiten: keine.
 */

/** So lange bleibt die Datei abrufbar; Safari liest sie nach dem Klick noch. */
const FREIGABE_NACH_MS = 60_000;

/** Bietet den Text als Datei zum Speichern an (Herunterladen; auf dem iPhone „Sichern in Dateien“). */
export function bieteDateiAn(text: string, name: string, typ = "application/json"): void {
  const adresse = URL.createObjectURL(new Blob([text], { type: typ }));
  const verweis = document.createElement("a");
  verweis.href = adresse;
  verweis.download = name;
  document.body.append(verweis);
  verweis.click();
  verweis.remove();
  // Erst später freigeben: Safari liest die Datei nach dem Klick noch.
  window.setTimeout(() => URL.revokeObjectURL(adresse), FREIGABE_NACH_MS);
}
