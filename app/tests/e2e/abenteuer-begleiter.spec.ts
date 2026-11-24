/**
 * Ambrose als Begleiter (Wunsch des Autors, 24.11.2026; regeln/begleiter.ts, regeln/blickpunkte.ts):
 * Steht der Held im Park von Maple Falls zum ersten Mal in der Nähe des Kiosks (Blickpunkt aus
 * ambrose_blickpunkte.json), sagt Ambrose etwas dazu (Knoten aus ambrose-blick.ink). Solange er
 * spricht, steht er als Geist auf einem Nachbarfeld des Helden; der Held antwortet in Gedanken;
 * nach dem Gespräch ist der Geist weg, und der Blickpunkt kommt kein zweites Mal. Die Szene meldet
 * den Geist für die Tests am Attribut `data-begleiter` der Spielfläche („ambrose@x,y“, danach
 * „weg“).
 * Mit AMBROSE_FOTOS=ORDNER legt der Test Fotos hoch und quer ab (für den Bericht an den Autor).
 */
import { expect, test, type Page } from "@playwright/test";
import { EINLEITUNG_GESEHEN, GRUNDSTAND, starteMitStand } from "./abenteuer-affe";
import { geraet } from "./abenteuer-quer";

const FOTOS = process.env.AMBROSE_FOTOS ?? "";
/** Ankunftsruhe (regeln/blickpunkte.ts) mit Luft für langsame Rechner. */
const BLICK_FRIST_MS = 20_000;
/** So lange bleibt es nach dem Blickpunkt still (länger als die Ankunftsruhe). */
const KEIN_ZWEITER_MS = 4000;
/** Ein Blickpunkt hat höchstens drei Zeilen, eine Wahl und eine Antwort. */
const HOECHSTENS = 8;

/** Feld im Park, drei Felder unter dem Kiosk (Blickpunkt auf 25,13 mit Radius 3), ohne Auslöser davor. */
const POSITION = { karte: "mapleFalls.park", x: 25, y: 16, richtung: "unten" };

/** Im Park, Ambrose ist wach (erste Lektion besprochen), alle Hinweise und Erklärungen gesehen. */
const STAND = {
  ...GRUNDSTAND,
  position: POSITION,
  dialogvariablen: {
    ...EINLEITUNG_GESEHEN,
    ersteLektionBesprochen: true,
    hinweisSteuerkreuz: true,
    hinweisAktion: true,
    hinweisTagebuch: true,
    hinweisMenue: true,
    hinweisRennen: true,
    muenzenErklaert: true,
    staerkeErklaert: true,
  },
};

/** Spielt den Blickpunkt am Kiosk durch und prüft Geist, Gedankenwahl und Ausblenden. */
async function pruefeBlickpunkt(seite: Page, foto: string): Promise<void> {
  await starteMitStand(seite, STAND);
  const flaeche = seite.locator(".abenteuer-welt canvas");
  const dialog = seite.getByTestId("abenteuer-dialog");
  await expect(dialog).toBeVisible({ timeout: BLICK_FRIST_MS });
  await expect(dialog).toHaveAttribute("aria-label", "Ambrose");
  // Der Geist steht auf einem Nachbarfeld des Helden (POSITION).
  await expect(flaeche).toHaveAttribute("data-begleiter", /^ambrose@\d+,\d+$/);
  const [x, y] = ((await flaeche.getAttribute("data-begleiter")) ?? "").slice(8).split(",");
  const abstand = Math.max(Math.abs(Number(x) - POSITION.x), Math.abs(Number(y) - POSITION.y));
  expect(abstand).toBe(1);
  // Die Antworten sind Gedanken des Helden.
  const gedanke = seite.locator(".abenteuer-dialog-wahlen button[data-gedanke='ja']");
  await expect(gedanke.first()).toBeVisible();
  // Einblenden abwarten, dann das Foto.
  if (FOTOS) await seite.waitForTimeout(800);
  if (FOTOS) await seite.screenshot({ path: `${FOTOS}/${foto}.png` });
  await expect(gedanke.first()).toBeEnabled();
  await gedanke.first().click();
  for (let i = 0; i < HOECHSTENS && (await dialog.isVisible()); i++) {
    await seite.locator(".abenteuer-dialog-weiter").click();
    await seite.waitForTimeout(150);
  }
  await expect(dialog).toBeHidden();
  await expect(flaeche).toHaveAttribute("data-begleiter", "weg");
  // Nur einmal: Der Held steht weiter im Radius, und der Blickpunkt kommt nicht wieder.
  await seite.waitForTimeout(KEIN_ZWEITER_MS);
  await expect(dialog).toBeHidden();
}

test("Blickpunkt am Kiosk: Ambrose steht neben dem Helden und ist danach weg", async ({ page }) => {
  await pruefeBlickpunkt(page, "blickpunkt-hoch");
});

test.describe("quer", () => {
  test.use(geraet("iPhone 15 landscape"));
  test("Blickpunkt am Kiosk im Querformat", async ({ page }) => {
    await pruefeBlickpunkt(page, "blickpunkt-quer");
  });
});
