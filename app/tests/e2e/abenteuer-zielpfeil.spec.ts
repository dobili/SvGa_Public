/**
 * Zielpfeil nur auf Wunsch (Wunsch des Autors, 19.11.2026): Ohne Wahl zeigt kein Pfeil. Im Tagebuch
 * hat jede laufende Aufgabe ein Symbol; Antippen zeigt den Pfeil zu ihrem Ziel (hier zu Mama),
 * noch einmal Antippen schaltet ihn ab. Erreicht der Held das Ziel und ist die Aufgabe erledigt,
 * verschwindet der Pfeil. Wohin er zeigt, steht in einem versteckten Feld (Orientierung.tsx), weil
 * die Welt ein Phaser-Canvas ist.
 */
import { expect, test, type Page } from "@playwright/test";
import { EINLEITUNG_GESEHEN, GRUNDSTAND, starteMitStand } from "./abenteuer-affe";

/** Im Wohnzimmer zwei Kacheln links von Mama (16, 7), nach der ersten Lektion: Quest „Erster Abend“. */
const STAND = {
  ...GRUNDSTAND,
  position: { karte: "mapleFalls.wohnzimmer", x: 14, y: 7, richtung: "rechts" },
  quests: [
    {
      kennung: "mapleFalls.ersterAbend",
      schritt: 0,
      erledigt: false,
      angenommen: "2026-11-19T10:00:00.000Z",
      erledigtAm: null,
    },
  ],
  dialogvariablen: {
    ...EINLEITUNG_GESEHEN,
    brettBeruehrt: true,
    ambroseErwachtGesehen: true,
    ersteLektionBesprochen: true,
    // Die Treppe am Abend (Eingang des Wohnzimmers, erzaehlzeit) ist schon erzählt.
    treppeAbendGesehen: true,
  },
};

const QUEST = "mapleFalls.ersterAbend";

async function zielfeld(seite: Page): Promise<string> {
  return (await seite.getByTestId("abenteuer-zielpfeil-feld").textContent()) ?? "";
}

async function kachel(seite: Page): Promise<string> {
  return (await seite.getByTestId("abenteuer-kachel").textContent()) ?? "";
}

/** Im offenen Dialog immer die erste Wahl, sonst „Weiter“, bis der Dialog zu ist. */
async function klickeDurch(seite: Page): Promise<void> {
  const dialog = seite.getByTestId("abenteuer-dialog");
  for (let i = 0; i < 60 && (await dialog.isVisible()); i++) {
    const wahl = seite.locator(".abenteuer-dialog-wahlen button").first();
    if (await wahl.isVisible()) await wahl.click();
    else {
      const weiter = seite.locator(".abenteuer-dialog-weiter");
      if (await weiter.isVisible()) await weiter.click();
      else await seite.waitForTimeout(100);
    }
  }
}

test("Zielpfeil auf Wunsch: aus, im Tagebuch an, zum Ziel, nach dem Ziel wieder aus", async ({
  page,
}) => {
  test.slow();
  await starteMitStand(page, STAND);
  await expect.poll(() => kachel(page), { timeout: 10000 }).toBe("14,7");
  // Standardmäßig aus, obwohl eine Aufgabe läuft.
  await expect.poll(() => zielfeld(page), { timeout: 5000 }).toBe("aus");

  // Tagebuch: Symbol der Aufgabe, nicht gedrückt; antippen → gedrückt.
  await page.getByTestId("abenteuer-tagebuchknopf").click();
  const symbol = page.getByTestId(`abenteuer-zielpfeil-${QUEST}`);
  await expect(symbol).toHaveAttribute("aria-pressed", "false");
  await expect(symbol).toHaveAccessibleName(/Pfeil zum Ziel von/);
  await symbol.click();
  await expect(symbol).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Schließen" }).click();
  // Der Pfeil zeigt auf Mama.
  await expect.poll(() => zielfeld(page), { timeout: 10000 }).toBe("16,7");

  // Noch einmal antippen schaltet ihn ab, ein drittes Mal wieder an.
  await page.getByTestId("abenteuer-tagebuchknopf").click();
  await symbol.click();
  await expect(symbol).toHaveAttribute("aria-pressed", "false");
  await page.getByRole("button", { name: "Schließen" }).click();
  await expect.poll(() => zielfeld(page), { timeout: 5000 }).toBe("aus");
  await page.getByTestId("abenteuer-tagebuchknopf").click();
  await symbol.click();
  await page.getByRole("button", { name: "Schließen" }).click();
  await expect.poll(() => zielfeld(page), { timeout: 10000 }).toBe("16,7");

  // Zu Mama gehen und sie ansprechen: Der Abend erledigt die Aufgabe, der Pfeil verschwindet.
  await page.keyboard.down("ArrowRight");
  await expect.poll(() => kachel(page), { timeout: 5000, intervals: [50] }).toBe("15,7");
  await page.keyboard.up("ArrowRight");
  const aktion = page.getByTestId("abenteuer-aktion");
  await expect(aktion).toBeVisible({ timeout: 5000 });
  await aktion.click();
  await expect(page.getByTestId("abenteuer-dialog")).toBeVisible({ timeout: 10000 });
  await klickeDurch(page);
  await expect.poll(() => zielfeld(page), { timeout: 10000 }).toBe("aus");
  await page.getByTestId("abenteuer-tagebuchknopf").click();
  await expect(page.getByTestId(`abenteuer-zielpfeil-${QUEST}`)).toHaveCount(0);
});
