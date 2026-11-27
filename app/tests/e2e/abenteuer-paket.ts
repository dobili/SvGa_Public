/**
 * Paket des Schach-Abenteuers in den Oberflächentests laden, mit einer Frist für alle Tests.
 *
 * Warum: Mit echter Grafik (app/inhalte-privat/quelle) dauerte das Laden lokal länger als die
 * verstreuten Fristen von 30 s und die 60 s je Test (Messung „zugang“, 15.11.2026). Jetzt gilt
 * eine Frist an einer Stelle (ABENTEUER_PAKET_FRIST_MS, Vorgabe 180 s), und der Test bekommt sie
 * zusätzlich zu seiner eigenen Zeit, damit langsame Rechner nicht an der Gesamtzeit scheitern.
 * Maia lädt in den Oberflächentests nicht im Hintergrund nach (Auftrag 20.11.2026: der Job
 * „Chromium, Abenteuer“ brauchte damit 26 statt etwa 11 Minuten); abenteuer-hintergrund.spec.ts
 * prüft das Nachladen gezielt mit `mitMaia`.
 * Abhängigkeiten: Playwright, anbindung/maiapflicht.ts (Name des Testschalters).
 */
import { expect, test, type Locator, type Page } from "@playwright/test";

/** Vorgabe: so lange darf das Grundpaket laden. */
const VORGABE_MS = 180_000;
/** So lange wartet der Test höchstens darauf, dass das Laden sichtbar beginnt. */
const BEGINN_MS = 2000;

/** Frist für das Laden des Grundpakets (Umgebungsvariable ABENTEUER_PAKET_FRIST_MS). */
export const PAKET_FRIST_MS = Number(process.env.ABENTEUER_PAKET_FRIST_MS ?? VORGABE_MS);

/** Wie TESTSCHALTER_OHNE_MAIA in anbindung/maiapflicht.ts (die Tests binden die App nicht ein). */
const TESTSCHALTER_OHNE_MAIA = "__abenteuerOhneMaia";

/**
 * Schaltet das Nachladen von Maia im Hintergrund für alle Seiten des Tests ab, auch nach Neuladen
 * und in weiteren Tabs (addInitScript am Kontext), und sofort in der offenen Seite. Das echte
 * Spiel lädt Maia immer; ohne Maia spielt der Bot wie vor dem Ende des Ladens.
 */
export async function ohneMaiaImHintergrund(
  seite: Page,
  { mitHauptmenue = false }: { readonly mitHauptmenue?: boolean } = {},
): Promise<void> {
  const setze = (name: string) => Reflect.set(window, name, true);
  await seite.context().addInitScript(setze, TESTSCHALTER_OHNE_MAIA);
  await seite.evaluate(setze, TESTSCHALTER_OHNE_MAIA);
  // Wer Maia abschaltet, testet das Spiel, nicht den Einstieg (Hauptmenü, 27.11.2026).
  if (!mitHauptmenue) await ohneHauptmenue(seite);
}

/** Wie TESTSCHALTER_OHNE_HAUPTMENUE in anbindung/spielsitzung.ts. */
const TESTSCHALTER_OHNE_HAUPTMENUE = "__abenteuerOhneHauptmenue";

/**
 * Ein vorhandener Spielstand führt gleich in die Welt, ohne Startbild und Hauptmenü (seit
 * 27.11.2026), für alle Seiten des Tests, auch nach Neuladen. Ein schon laufendes Startbild wird
 * weggetippt. Die meisten Tests prüfen das Spiel, nicht den Einstieg; abenteuer-hauptmenue.spec.ts
 * prüft den Einstieg ohne diesen Schalter.
 */
export async function ohneHauptmenue(seite: Page): Promise<void> {
  const setze = (name: string) => {
    Reflect.set(window, name, true);
    document.querySelector<HTMLElement>("[data-testid='abenteuer-startbild']")?.click();
  };
  await seite.context().addInitScript(setze, TESTSCHALTER_OHNE_HAUPTMENUE);
  await seite.evaluate(setze, TESTSCHALTER_OHNE_HAUPTMENUE);
}

/** Wie MERKER_AUTORGERAET in autor/autorgeraet.ts, mit der Vorsilbe aus app/merker.ts. */
const MERKER_AUTORGERAET = "svga.autorgeraet";

/**
 * Gibt sich als Gerät des Autors aus (als hätte es die Aufgabenseite geöffnet), damit das Spiel
 * seine Testleiste zeigt (abenteuer/anbindung/testende.ts, seit 20.11.2026 nur dort). Gilt für alle
 * Seiten des Tests, auch nach Neuladen.
 */
export async function alsAutorgeraet(seite: Page): Promise<void> {
  const setze = (name: string) => window.localStorage.setItem(name, "ja");
  await seite.context().addInitScript(setze, MERKER_AUTORGERAET);
  await seite.evaluate(setze, MERKER_AUTORGERAET);
}

/**
 * Tippt „Spiel herunterladen“ und wartet, bis das Laden vorbei ist (der Fortschrittsbalken ist
 * weg: danach erscheint „Spielen“, die Welt oder eine Fehlermeldung, je nach Test). Verlängert
 * die Zeit des Tests um die Paketfrist. Eingabe: Seite und optional der Knopf (Vorgabe: der
 * Knopf „abenteuer-laden“). Das Gerät gilt als Gerät des Autors (alsAutorgeraet, für die
 * Testleiste). Ohne `mitMaia` lädt Maia nicht im Hintergrund (ohneMaiaImHintergrund);
 * mit `mitMaia` wie im echten Spiel, und der Test wartet auch darauf. Ohne `mitHauptmenue` führt
 * ein vorhandener Spielstand gleich in die Welt (ohneHauptmenue).
 */
export async function ladeAbenteuerpaket(
  seite: Page,
  knopf?: Locator,
  {
    mitMaia = false,
    mitHauptmenue = false,
  }: { readonly mitMaia?: boolean; readonly mitHauptmenue?: boolean } = {},
): Promise<void> {
  test.info().setTimeout(test.info().timeout + PAKET_FRIST_MS);
  if (!mitMaia) await ohneMaiaImHintergrund(seite, { mitHauptmenue });
  else if (!mitHauptmenue) await ohneHauptmenue(seite);
  await alsAutorgeraet(seite);
  await (knopf ?? seite.getByTestId("abenteuer-laden")).click();
  const balken = seite.locator(".abenteuer-fortschritt");
  // Aus dem Cache kann das Laden schon vorbei sein, bevor der Balken zu sehen ist.
  await balken.waitFor({ state: "visible", timeout: BEGINN_MS }).catch(() => undefined);
  await expect(balken).toHaveCount(0, { timeout: PAKET_FRIST_MS });
  await warteAufHintergrund(seite);
}

/**
 * Wartet, bis Geräusche, Großbilder und (falls nicht abgeschaltet) Maia im Hintergrund geladen sind (paket/aktton.ts schreibt
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
