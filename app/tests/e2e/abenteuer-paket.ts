/**
 * Paket des Schach-Abenteuers in den Oberflächentests laden, mit einer Frist für alle Tests.
 *
 * Warum: Mit echter Grafik (app/inhalte-privat/quelle) dauerte das Laden lokal länger als die
 * verstreuten Fristen von 30 s und die 60 s je Test (Messung „zugang“, 15.11.2026). Jetzt gilt
 * eine Frist an einer Stelle (ABENTEUER_PAKET_FRIST_MS, Vorgabe 180 s), und der Test bekommt sie
 * zusätzlich zu seiner eigenen Zeit, damit langsame Rechner nicht an der Gesamtzeit scheitern.
 * Abhängigkeiten: Playwright.
 */
import { expect, test, type Locator, type Page } from "@playwright/test";

/** Vorgabe: so lange darf das Grundpaket laden. */
const VORGABE_MS = 180_000;
/** So lange wartet der Test höchstens darauf, dass das Laden sichtbar beginnt. */
const BEGINN_MS = 2000;

/** Frist für das Laden des Grundpakets (Umgebungsvariable ABENTEUER_PAKET_FRIST_MS). */
export const PAKET_FRIST_MS = Number(process.env.ABENTEUER_PAKET_FRIST_MS ?? VORGABE_MS);

/**
 * Tippt „Spiel herunterladen“ und wartet, bis das Laden vorbei ist (der Fortschrittsbalken ist
 * weg: danach erscheint „Spielen“, die Welt oder eine Fehlermeldung, je nach Test). Verlängert
 * die Zeit des Tests um die Paketfrist. Eingabe: Seite und optional der Knopf (Vorgabe: der
 * Knopf „abenteuer-laden“).
 */
export async function ladeAbenteuerpaket(seite: Page, knopf?: Locator): Promise<void> {
  test.info().setTimeout(test.info().timeout + PAKET_FRIST_MS);
  await (knopf ?? seite.getByTestId("abenteuer-laden")).click();
  const balken = seite.locator(".abenteuer-fortschritt");
  // Aus dem Cache kann das Laden schon vorbei sein, bevor der Balken zu sehen ist.
  await balken.waitFor({ state: "visible", timeout: BEGINN_MS }).catch(() => undefined);
  await expect(balken).toHaveCount(0, { timeout: PAKET_FRIST_MS });
  await warteAufHintergrund(seite);
}

/**
 * Wartet, bis Geräusche, Großbilder und Maia im Hintergrund geladen sind (paket/aktton.ts schreibt
 * den Stand an das Wurzelelement). Warum (WebKit-Läufe vom 20.11.2026): Seit Maia nach dem Start im
 * Hintergrund lädt, liefen in jedem Test 92 MB Laden, Prüfsumme und Cache-Schreiben mit. Wer dann
 * neu lud, brach offene Cache-Vorgänge ab; WebKit meldet das als „Cache API operation failed: Context
 * is stopped“ der alten Seite, und das Spiel lief zäh. Die Tests prüfen das Spiel, nicht das
 * Nachladen; wie vor der Änderung beginnen sie erst, wenn alles da ist.
 * Sonderfall: Ohne Netz zu Maia endet das Laden mit „unvollstaendig“; auch das ist ein Ende.
 */
export async function warteAufHintergrund(seite: Page): Promise<void> {
  await expect
    .poll(() => seite.evaluate(() => document.documentElement.dataset.abenteuerTon ?? ""), {
      timeout: PAKET_FRIST_MS,
    })
    .toMatch(/^(vollstaendig|unvollstaendig)$/);
}
