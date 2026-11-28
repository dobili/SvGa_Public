/**
 * Oberflächentest: Startbild, Hauptmenü und Speicherplätze des Schach-Abenteuers (Wunsch des
 * Autors, 27.11.2026). Ohne den Testschalter ohneHauptmenue: so, wie Leser das Spiel starten.
 *
 * Geprüft: Startbild beim Start, per Tipp weg; erstes Spiel ohne Hauptmenü (keine Plätze), danach
 * über das Spielmenü ins Hauptmenü; zweites Spiel auf neuem Platz; Ladeliste mit beiden, Laden
 * des ersten; Neuladen bleibt in der Welt (Sitzung des Tabs); ein neuer Tab beginnt im Hauptmenü;
 * Löschen mit Rückfrage; Zurück-Taste (Spieler-Durchlauf 27.11.2026): in der Rückfrage „Nein“,
 * in der Ladeliste ins Hauptmenü, erst im Hauptmenü aus dem Abenteuer.
 * Mit HAUPTMENUE_FOTOS=ORDNER legt der Test Bildschirmfotos für den Autor ab (nur lokal, mit Paket).
 */
import { expect, test, type Page } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { liesSpeicherImBrowser } from "./abenteuer-affe";
import { ladeAbenteuerpaket } from "./abenteuer-paket";

const FOTOS = process.env.HAUPTMENUE_FOTOS;

/** Ein Foto für den Autor, wenn HAUPTMENUE_FOTOS gesetzt ist. */
async function foto(seite: Page, name: string): Promise<void> {
  if (!FOTOS) return;
  mkdirSync(FOTOS, { recursive: true });
  await seite.screenshot({ path: join(FOTOS, `${name}.png`) });
}

/**
 * Ohne den Springer der App (ui/komponenten/rahmen/Startanimation.tsx): Er läuft beim ersten
 * Aufruf einer Sitzung und läge über dem Startbild des Spiels; alle Seiten des Kontexts.
 */
async function ohneSpringer(seite: Page): Promise<void> {
  await seite.context().addInitScript(() => {
    window.sessionStorage.setItem("svga.startanimation.sitzung", "ja");
  });
}

/** Neues Spiel mit Namen beginnen und warten, bis die Welt steht. */
async function beginne(seite: Page, name: string): Promise<void> {
  await seite.getByTestId("abenteuer-name").fill(name);
  await seite.getByTestId("abenteuer-spielen").click();
  await expect(seite.getByTestId("abenteuer-welt")).toBeVisible({ timeout: 40000 });
}

/** Über das Spielmenü ins Hauptmenü. */
async function insHauptmenue(seite: Page): Promise<void> {
  await seite.getByTestId("abenteuer-menueknopf").click();
  await seite.getByTestId("abenteuer-zum-hauptmenue").click();
  await expect(seite.getByTestId("abenteuer-hauptmenue")).toBeVisible();
}

test("Hauptmenü: Startbild, zwei Spielstände, laden, neu laden, neuer Tab, löschen (27.11.2026)", async ({
  page,
  context,
}) => {
  test.slow();
  await ohneSpringer(page);
  await page.goto("/app/#abenteuer");
  const startbild = page.getByTestId("abenteuer-startbild");
  await expect(startbild).toBeVisible();
  await expect(startbild).toContainText("Chessfare");
  await startbild.click();
  await expect(startbild).toHaveCount(0);
  await ladeAbenteuerpaket(page, undefined, { mitHauptmenue: true });
  // Erstes Spiel: noch kein Platz, also gleich die Wahl ohne „Zurück zum Hauptmenü“.
  await expect(page.getByTestId("abenteuer-neu-zurueck")).toHaveCount(0);
  await beginne(page, "Kim");
  await insHauptmenue(page);
  await expect(page.getByTestId("abenteuer-fortsetzen")).toContainText("Kim");
  await expect(page.getByTestId("abenteuer-fortsetzen")).toContainText("Akt 1 · Maple Falls");
  await foto(page, "hauptmenue-hoch");

  // Zweites Spiel auf neuem Platz; der erste ruht.
  await page.getByTestId("abenteuer-neues-spiel").click();
  await expect(page.getByTestId("abenteuer-neu-zurueck")).toBeVisible();
  await beginne(page, "Alex");
  await insHauptmenue(page);
  await expect(page.getByTestId("abenteuer-fortsetzen")).toContainText("Alex");
  await page.getByTestId("abenteuer-ladeliste-knopf").click();
  const plaetze = page.getByTestId("abenteuer-platz");
  await expect(plaetze).toHaveCount(2);
  await expect(plaetze.nth(0)).toContainText("Alex");
  await expect(plaetze.nth(1)).toContainText("Kim");
  await foto(page, "ladeliste-hoch");

  // Kim laden: die Welt mit Kims Stand.
  await plaetze.nth(1).getByTestId("abenteuer-platz-laden").click();
  await expect(page.getByTestId("abenteuer-welt")).toBeVisible({ timeout: 40000 });
  await expect
    .poll(async () => (await page.evaluate(liesSpeicherImBrowser)).abenteuer?.held)
    .toMatchObject({ name: "Kim" });

  // Neu laden im selben Tab: weiter in der Welt, ohne Startbild und Hauptmenü.
  await page.reload();
  await expect(page.getByTestId("abenteuer-welt")).toBeVisible({ timeout: 40000 });
  await expect(page.getByTestId("abenteuer-hauptmenue")).toHaveCount(0);

  // Ein neuer Tab (wie ein neuer Start der App): Startbild, dann Hauptmenü mit Kim zum Fortsetzen.
  const zweite = await context.newPage();
  await zweite.goto("/app/#abenteuer");
  await zweite.getByTestId("abenteuer-startbild").click();
  await expect(zweite.getByTestId("abenteuer-fortsetzen")).toContainText("Kim", {
    timeout: 30000,
  });
  await zweite.close();

  // Alex löschen, mit Rückfrage; danach bleibt nur Kim.
  await page.bringToFront();
  await insHauptmenue(page);
  await page.getByTestId("abenteuer-ladeliste-knopf").click();
  const alex = plaetze.filter({ hasText: "Alex" });
  await alex.getByTestId("abenteuer-platz-loeschen").click();
  await expect(page.getByTestId("abenteuer-platz-frage")).toContainText("endgültig");
  await page.getByTestId("abenteuer-platz-loeschen-ja").click();
  await expect(plaetze).toHaveCount(1);
  await expect(plaetze.first()).toContainText("Kim");
  await expect(page.getByRole("status")).toContainText("gelöscht");

  // Zurück-Taste: schließt zuerst die Rückfrage, dann die Ladeliste, erst dann das Abenteuer.
  await plaetze.first().getByTestId("abenteuer-platz-loeschen").click();
  await expect(page.getByTestId("abenteuer-platz-frage")).toBeVisible();
  await page.goBack();
  await expect(page.getByTestId("abenteuer-platz-frage")).toHaveCount(0);
  await expect(plaetze).toHaveCount(1);
  await page.goBack();
  await expect(page.getByTestId("abenteuer-ladeliste")).toHaveCount(0);
  await expect(page.getByTestId("abenteuer-hauptmenue")).toBeVisible();
  // Noch einmal über den Knopf hinein und hinaus: der Verlauf bleibt stimmig.
  await page.getByTestId("abenteuer-ladeliste-knopf").click();
  await page.getByTestId("abenteuer-ladeliste-zurueck").click();
  await expect(page.getByTestId("abenteuer-hauptmenue")).toBeVisible();
  await page.waitForTimeout(500);
  await expect(page.getByTestId("abenteuer-hauptmenue")).toBeVisible();
  await page.goBack();
  await expect(page.getByTestId("abenteuer-hauptmenue")).toHaveCount(0);
  await expect(page.getByTestId("abenteuer")).toHaveCount(0);
});

test("Hauptmenü quer und Startbild in Standbildern (nur mit HAUPTMENUE_FOTOS)", async ({
  page,
}) => {
  test.skip(!FOTOS, "nur für Fotos des Autors");
  test.slow();
  await ohneSpringer(page);
  await page.goto("/app/#abenteuer");
  await page.getByTestId("abenteuer-startbild").click();
  await ladeAbenteuerpaket(page, undefined, { mitHauptmenue: true });
  await beginne(page, "Kim");
  await insHauptmenue(page);
  await page.setViewportSize({ width: 844, height: 390 });
  await foto(page, "hauptmenue-quer");
  // Startbild in Standbildern: neuer Tab, Fotos etwa 0,6 s, 1,4 s, 2,4 s und 3,3 s nach dem Erscheinen.
  await page.setViewportSize({ width: 390, height: 844 });
  const neu = await page.context().newPage();
  await neu.setViewportSize({ width: 390, height: 844 });
  await neu.goto("/app/#abenteuer");
  await neu.getByTestId("abenteuer-startbild").waitFor();
  const beginn = Date.now();
  for (const ms of [600, 1400, 2400, 3300]) {
    await neu.waitForTimeout(Math.max(0, ms - (Date.now() - beginn)));
    await foto(neu, `startbild-${ms}ms`);
  }
  // „Bewegung reduzieren“: ein stilles Titelbild.
  const still = await page.context().newPage();
  await still.setViewportSize({ width: 390, height: 844 });
  await still.emulateMedia({ reducedMotion: "reduce" });
  await still.goto("/app/#abenteuer");
  await still.getByTestId("abenteuer-startbild").waitFor();
  await still.waitForTimeout(500);
  await foto(still, "startbild-still");
});
