/**
 * Oberflächentest: Eine neue Version des Spielpakets auf dem Server wird beim Öffnen angezeigt und
 * geladen (Wunsch des Autors, 19.11.2026; anbindung/maiapflicht.ts, Feld neuerStand).
 * Ohne Service Worker: Seine Abrufe sieht page.route in WebKit nicht, der Test könnte dem Spiel
 * dort keine neue Version vorspielen.
 */
import { expect, test } from "@playwright/test";
import { ladeAbenteuerpaket } from "./abenteuer-paket";

test.use({ serviceWorkers: "block" });

test("Neue Version des Spiels: die Startkarte sagt es und lädt sie, danach „Spielen“ (19.11.2026)", async ({
  page,
}) => {
  await page.goto("/app/#abenteuer");
  await ladeAbenteuerpaket(page);
  await expect(page.getByTestId("abenteuer-spielen")).toBeVisible({ timeout: 30000 });
  // Der Server meldet ab jetzt eine neuere Version des Pakets (gleiche Dateien, andere Nummer).
  await page.route("**/abenteuer/paket.json", async (route) => {
    const antwort = await route.fetch();
    const verzeichnis = (await antwort.json()) as { version: string };
    await route.fulfill({
      response: antwort,
      json: { ...verzeichnis, version: `${verzeichnis.version}-neu` },
    });
  });
  await page.reload();
  await expect(page.getByTestId("abenteuer-start")).toContainText("neue Version des Spiels");
  await ladeAbenteuerpaket(page);
  await expect(page.getByTestId("abenteuer-spielen")).toBeVisible({ timeout: 30000 });
});
