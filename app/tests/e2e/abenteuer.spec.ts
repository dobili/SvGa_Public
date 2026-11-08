/**
 * Schach-Abenteuer, Prototyp (Schritt 5): Startkarte → Paket laden → Oberwelt → zum Brett laufen →
 * Dialog mit Ambrose → Partie der App mit Kartenleiste → zurück in die Welt (Partie läuft noch).
 * Die Welt ist ein Phaser-Canvas; geprüft wird über die React-Teile (Testkennungen) und die
 * Tastatur (Pfeile), die die Szene wie das Steuerkreuz behandelt.
 */
import { expect, test, type Page } from "@playwright/test";

/** Die Kachel des Helden („x,y“), die die Oberwelt in ein verstecktes Feld schreibt. */
async function kachel(seite: Page): Promise<string> {
  return (await seite.getByTestId("abenteuer-kachel").textContent()) ?? "";
}

/** Höchstens so viele Schritte je Weg (die Räume sind kleiner). */
const MAX_SCHRITTE = 20;

/**
 * Läuft Kachel für Kachel zum Ziel: Taste drücken, bis der Held die Kachel wechselt, loslassen,
 * prüfen. Gehaltene Tasten taugen nicht: WebKit auf dem iPhone fragt die Kachel zu selten ab, und
 * der Held lief am Ziel vorbei bis zur Wand (CI 8.11.2026).
 */
async function laufeBis(seite: Page, taste: string, ziel: string): Promise<void> {
  for (let i = 0; i < MAX_SCHRITTE && (await kachel(seite)) !== ziel; i++) {
    const vorher = await kachel(seite);
    await seite.keyboard.down(taste);
    try {
      await expect.poll(() => kachel(seite), { timeout: 3000, intervals: [20] }).not.toBe(vorher);
    } finally {
      await seite.keyboard.up(taste);
    }
    // Der Held beendet den angefangenen Schritt; erst danach zählt die Kachel.
    await seite.waitForTimeout(150);
  }
  await expect.poll(() => kachel(seite), { timeout: 2000 }).toBe(ziel);
}

test("vom Dachboden in die erste Partie und zurück", async ({ page }) => {
  await page.goto("/app/#abenteuer");
  await expect(page.getByTestId("abenteuer-start")).toBeVisible();
  await page.getByTestId("abenteuer-laden").click();
  await expect(page.getByTestId("abenteuer-spielen")).toBeVisible({ timeout: 30000 });
  // Namenswahl vor dem ersten Start (Schritt 8g); der Name steht später im Spielmenü.
  await page.getByTestId("abenteuer-name").fill("Kim");
  await page.getByTestId("abenteuer-spielen").click();
  await expect(page.getByTestId("abenteuer-welt")).toBeVisible();
  await page.getByTestId("abenteuer-menueknopf").click();
  await expect(page.getByTestId("abenteuer-menue").getByTestId("abenteuer-name")).toHaveValue(
    "Kim",
  );
  await page.getByRole("button", { name: "Weiterspielen" }).click();
  await expect(page.locator(".abenteuer-welt canvas")).toBeVisible({ timeout: 30000 });
  await page.waitForTimeout(800);

  // Der Held steht auf (2,7) und schaut nach oben; das Brett liegt auf (5,4): rechts bis (5,7),
  // dann hoch bis (5,5), das Brett ist Kollision und liegt dann vor ihm.
  await expect.poll(() => kachel(page), { timeout: 10000 }).toBe("2,7");
  await laufeBis(page, "ArrowRight", "5,7");
  await laufeBis(page, "ArrowUp", "5,5");
  const aktion = page.getByTestId("abenteuer-aktion");
  await expect(aktion).toBeVisible({ timeout: 5000 });
  // WebKit auf dem iPhone lädt die Dialogdatei aus dem Zwischenspeicher manchmal langsam, und ein
  // Klick kann in einen Wechsel des Auslösers fallen; deshalb geduldig und notfalls noch einmal.
  await expect(async () => {
    const dialog = page.getByTestId("abenteuer-dialog");
    if (!(await dialog.isVisible())) await aktion.click();
    await expect(dialog).toBeVisible({ timeout: 3000 });
  }).toPass({ timeout: 20000 });
  await expect(page.getByTestId("abenteuer-dialog")).toContainText("Staub, Kisten");
  // Die Hauptquest hat beim Betreten begonnen und steht im Tagebuch; der Dialog bleibt offen.
  await page.getByTestId("abenteuer-tagebuchknopf").click();
  await expect(page.getByTestId("abenteuer-tagebuch")).toContainText("Das Brett auf dem Dachboden");
  await page.getByRole("button", { name: "Schließen" }).click();

  // Immer die erste Wahl, sonst „Weiter“, bis die Partie beginnt.
  for (let i = 0; i < 40; i++) {
    if (await page.getByTestId("partie").isVisible()) break;
    const wahl = page.locator(".abenteuer-dialog-wahlen button").first();
    if (await wahl.isVisible()) await wahl.click();
    else {
      const weiter = page.locator(".abenteuer-dialog-weiter");
      if (await weiter.isVisible()) await weiter.click();
      else await page.waitForTimeout(100);
    }
  }
  // Ambrose hat den Fingerzeig gegeben: Deckwahl vor der Partie, die Karte ins Deck.
  await expect(page.getByTestId("abenteuer-deckwahl")).toBeVisible({ timeout: 10000 });
  await page.getByRole("button", { name: "Fingerzeig" }).click();
  await page.getByRole("button", { name: "Mit 1 Karten spielen" }).click();
  await expect(page.getByTestId("partie")).toBeVisible({ timeout: 20000 });
  await expect(page.getByTestId("abenteuer-kartenleiste")).toBeVisible();
  await expect(page.getByText("gegen Ambrose")).toBeVisible();
  // Die Karte spielen: Die Engine markiert das Startfeld, die Karte ist danach verbraucht.
  const karte = page.getByTestId("abenteuer-karte-fingerzeig");
  await expect(karte).toBeEnabled({ timeout: 10000 });
  await karte.click();
  await expect(karte).toHaveAttribute("aria-pressed", "true", { timeout: 20000 });
  await expect(karte).toBeDisabled();

  // Zurück in die Welt: Die Partie läuft noch, „Weiterspielen“ führt zur selben Partie.
  await page.goto("/app/#abenteuer");
  // Mit Spielstand öffnet sich die Welt von selbst, ohne Startkarte.
  await expect(page.getByText("Deine Partie läuft noch.")).toBeVisible({ timeout: 20000 });
  await page.getByRole("button", { name: "Weiterspielen" }).click();
  await expect(page.getByTestId("partie")).toBeVisible({ timeout: 20000 });
});
