/**
 * Der Installationsdialog von Android, Chrome und Edge („App installieren“), ohne React.
 *
 * Rolle im Gesamtbild: Diese Browser melden mit dem Ereignis „beforeinstallprompt“, dass die App
 * installierbar ist. Das Ereignis kommt früh und nur einmal; es wird hier aufbewahrt, bis der
 * Leser auf der Startseite des Buches tippt (Konzept 11.1, Entscheidung 15.10.2026).
 * Abhängigkeiten: keine.
 */

/** Das Ereignis der Browser; in den Standard-Typen von TypeScript (noch) nicht enthalten. */
interface InstallationsEreignis extends Event {
  prompt(): Promise<void>;
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

let ereignis: InstallationsEreignis | null = null;
let installiert = false;
const abonnenten = new Set<() => void>();

function melde(): void {
  abonnenten.forEach((abonnent) => abonnent());
}

/** Beginnt, auf das Installationsereignis zu hören. Einmal beim Start aufrufen. */
export function hoereAufInstallation(): void {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    ereignis = e as InstallationsEreignis;
    melde();
  });
  window.addEventListener("appinstalled", () => {
    installiert = true;
    ereignis = null;
    melde();
  });
}

/**
 * Öffnet den Installationsdialog des Browsers.
 * Ausgabe: true, wenn der Leser installiert hat.
 */
export async function installiere(): Promise<boolean> {
  if (!ereignis) {
    return false;
  }
  const aktuell = ereignis;
  ereignis = null;
  melde();
  await aktuell.prompt();
  const wahl = await aktuell.userChoice;
  return wahl.outcome === "accepted";
}

/** Ob der Knopf den Dialog öffnen kann und ob gerade installiert wurde. */
export function installationsstand(): { kannInstallieren: boolean; installiert: boolean } {
  return { kannInstallieren: ereignis !== null, installiert };
}

/** Meldet jede Änderung; gibt eine Funktion zum Abmelden zurück. */
export function abonniereInstallation(abonnent: () => void): () => void {
  abonnenten.add(abonnent);
  return () => abonnenten.delete(abonnent);
}
