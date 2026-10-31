/**
 * Oberflächentest des Maia-Zusatzpakets (0.2.143): Reiter „Bots“ in den Einstellungen, Laden mit
 * Fortschritt, Schalter, Löschen. Das Laden (etwa 96 MB aus dem lokalen Vorschau-Server) läuft nur
 * in Chromium; WebKit prüft den Reiter ohne Laden (Speichergrenzen des Testbrowsers).
 */
import { expect, test } from "@playwright/test";
import { oeffneEinstellungsseite, starteImBrowser } from "./hilfen";

const LADEZEIT = 180_000;

test("Seite „Bots und Wertung“: Maia laden, einschalten, löschen", async ({
  page,
  browserName,
}) => {
  await starteImBrowser(page);
  await oeffneEinstellungsseite(page, "Bots und Wertung");
  const wahl = page.getByTestId("maia-wahl");
  await expect(wahl).toContainText("Menschlichere Züge (Maia)");
  const laden = wahl.getByRole("button", { name: /^Maia laden \(etwa 96 MB\)$/ });
  await expect(laden).toBeVisible();
  test.skip(browserName !== "chromium", "Laden nur in Chromium (96 MB)");
  test.setTimeout(LADEZEIT + 60_000);
  await laden.click();
  const schalter = wahl.getByRole("radio", { name: "an" });
  await expect(schalter).toBeVisible({ timeout: LADEZEIT });
  await expect(schalter).toBeChecked();
  await wahl.getByRole("radio", { name: "aus" }).click();
  await expect(wahl.getByRole("radio", { name: "aus" })).toBeChecked();
  await wahl.getByRole("button", { name: "Maia vom Gerät löschen" }).click();
  await expect(laden).toBeVisible();
});

test("mit Maia: der Bot antwortet im Mittelspiel, die Laufzeit läuft unter der Sicherheitsregel", async ({
  page,
  browserName,
}) => {
  test.skip(browserName !== "chromium", "Laden nur in Chromium (96 MB)");
  test.setTimeout(LADEZEIT + 120_000);
  const fehler: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error" || m.type() === "warning") fehler.push(m.text());
  });
  await starteImBrowser(page);
  await oeffneEinstellungsseite(page, "Bots und Wertung");
  await page.getByRole("button", { name: /^Maia laden/ }).click();
  await expect(page.getByTestId("maia-wahl").getByRole("radio", { name: "an" })).toBeChecked({
    timeout: LADEZEIT,
  });
  await page.getByRole("navigation").getByRole("button", { name: "Spielen" }).click();
  await page.getByText("Eigene Stellung eingeben (FEN)").click();
  // Halbzug 28: Maia rechnet erst ab Halbzug 10 (Training ohne Eröffnung).
  await page
    .getByLabel("Stellung als FEN")
    .fill("r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQ1RK1 w - - 0 15");
  await page.getByRole("button", { name: "Stellung übernehmen" }).click();
  await page.getByRole("button", { name: "Partie beginnen" }).click();
  await page.getByRole("button", { name: /^h2, Bauer/ }).click();
  await page.getByRole("button", { name: "h3", exact: true }).click();
  await expect(page.getByTestId("partiestatus")).toHaveText("Du bist am Zug.", {
    timeout: 120_000,
  });
  const geladen = await page.evaluate(() =>
    performance.getEntriesByType("resource").some((e) => e.name.includes("ort.bundle")),
  );
  expect(geladen, "onnxruntime-web wurde für den Bot-Zug geladen").toBe(true);
  expect(fehler.filter((f) => /maia|onnx|wasm/i.test(f))).toEqual([]);
});
