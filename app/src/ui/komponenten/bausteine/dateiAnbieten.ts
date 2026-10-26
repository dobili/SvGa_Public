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

/** Die Datei als File-Objekt für das Teilen-Menü des Geräts. */
function alsDatei(text: string, name: string, typ: string): File {
  return new File([text], name, { type: typ });
}

/**
 * Kann das Gerät Dateien über sein Teilen-Menü weitergeben (iPhone, Android)? Am Rechner meist nein.
 * Warum: Auf manchen iPhones landet das Herunterladen nicht dort, wo der Leser die Datei findet
 * (FORTSCHRITT Q3); „Teilen“ öffnet das gewohnte Menü mit Mail, Dateien und Nachrichten.
 */
export function kannDateiTeilen(): boolean {
  if (typeof navigator.canShare !== "function") return false;
  return navigator.canShare({ files: [alsDatei("{}", "probe.json", "application/json")] });
}

/**
 * Gibt den Text als Datei ins Teilen-Menü des Geräts (seit 0.2.91, Ausweg für die Sicherung auf
 * dem iPhone). Ausgabe: true, wenn geteilt; false, wenn der Leser abbricht.
 * Sonderfall: Andere Fehler (etwa ohne Berechtigung) gehen an den Aufrufer weiter.
 */
export async function teileDatei(
  text: string,
  name: string,
  typ = "application/json",
): Promise<boolean> {
  try {
    await navigator.share({ files: [alsDatei(text, name, typ)], title: name });
    return true;
  } catch (fehler) {
    if (fehler instanceof DOMException && fehler.name === "AbortError") return false;
    throw fehler;
  }
}
