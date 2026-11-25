/**
 * Hauptfiguren sprechen den Helden an (Wunsch des Autors, 25.11.2026; regeln/ansprechen.ts,
 * oberwelt/useAnsprechen.ts): Zwischen erster Nacht und Club wartet Juno an der Bushaltestelle von
 * Maple Falls (54, 24, Blick nach unten). Geht der Held auf der Straße an ihr vorbei, hält die
 * Steuerung an, Juno kommt heran, und ihr Gespräch beginnt, ohne dass der Spieler etwas drückt.
 * Danach spricht sie im selben Schritt nicht noch einmal an.
 *
 * Mit ANSPRECHEN_FOTOS=ORDNER entstehen drei Fotos für den Autor (vorher, Juno kommt, Gespräch);
 * sie bleiben lokal (Paketbilder).
 */
import { expect, test, type Page } from "@playwright/test";
import { EINLEITUNG_GESEHEN, GRUNDSTAND, starteMitStand } from "./abenteuer-affe";

/** Unten links von Juno auf der Straße, Blick nach rechts: drei Felder vor ihr vorbei, sie kommt heran. */
const STAND = {
  ...GRUNDSTAND,
  position: { karte: "mapleFalls.aussen", x: 49, y: 27, richtung: "rechts" },
  dialogvariablen: {
    ...EINLEITUNG_GESEHEN,
    hinweisSteuerkreuz: true,
    hinweisAktion: true,
    hinweisRennen: true,
    muenzenErklaert: true,
    staerkeErklaert: true,
    ersterAbendGesehen: true,
    ersteNachtGesehen: true,
    // Wie im Spiel an dieser Stelle: erste Lektion gespielt, Calloway schon getroffen (sonst
    // erzählt Junos Gespräch nur „ihr Bus kommt gerade“, juno_frueh).
    ausgangMapleFallsErsteLektion: "sieg",
    callowayGetroffen: true,
  },
  quests: [],
};
/** Ruhe nach dem Laden der Karte, bevor der Held losgeht (ms; das Ansprechen ruht 2 s). */
const RUHE_MS = 2500;
/** So lange darf es höchstens dauern, bis Juno angesprochen hat (ms). */
const HOECHSTENS_MS = 8000;
const FOTOS = process.env.ANSPRECHEN_FOTOS;

async function foto(seite: Page, name: string): Promise<void> {
  if (FOTOS) await seite.screenshot({ path: `${FOTOS}/${name}.png` });
}

test("Juno spricht den Helden an, wenn er an der Bushaltestelle vorbeigeht", async ({ page }) => {
  await starteMitStand(page, STAND);
  const flaeche = page.locator(".abenteuer-welt canvas");
  await expect(page.getByTestId("abenteuer-kachel")).toHaveText("49,27", { timeout: 30000 });
  await page.waitForTimeout(RUHE_MS);
  await foto(page, "1-vorher");
  await page.keyboard.down("ArrowRight");
  await expect(flaeche).toHaveAttribute("data-ansprechen", "juno", { timeout: HOECHSTENS_MS });
  await page.waitForTimeout(250);
  await foto(page, "2-juno-kommt");
  const dialog = page.getByTestId("abenteuer-dialog");
  await expect(dialog).toBeVisible({ timeout: HOECHSTENS_MS });
  // Die Taste ist noch gedrückt: Der Held steht trotzdem, solange das Gespräch läuft.
  const kachel = await page.getByTestId("abenteuer-kachel").textContent();
  await page.waitForTimeout(500);
  await expect(page.getByTestId("abenteuer-kachel")).toHaveText(kachel ?? "");
  await page.keyboard.up("ArrowRight");
  await expect(dialog).toContainText(/\S/);
  await foto(page, "3-gespraech");
});
