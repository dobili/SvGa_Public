/**
 * Schach-Abenteuer, Tiere im Weg (Befund des Autors, 25.11.2026: Tiere liefen auf Figuren, „als
 * säßen sie auf dem Schoß“): Tiere am Boden halten den Helden auf, und er kann sie verscheuchen
 * (oberwelt/tierweg.ts, useVerscheuchen.ts).
 *
 * Geprüft in Maple Falls an der Katze vor dem Whitlock-Haus (sitzt auf (4, 24)): Der Held steht
 * direkt über ihr mit Blick nach unten, der Aktionsknopf heißt „Verscheuchen“; nach dem Tipp
 * läuft die Katze weg, und der Held kommt auf ihr Feld.
 * Ohne private Grafik legt die App keine Tiere an (weltdaten.ts, belebungsbilderFuer); in GitHub
 * Actions fehlt das Bild der Katze, dort werden die Tests übersprungen (sie scheiterten dort seit
 * dem 25.11.2026 mit leerem Aktionsknopf).
 * Abhängigkeiten: abenteuer-affe.ts (Spielstand).
 */
import { existsSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import { EINLEITUNG_GESEHEN, GRUNDSTAND, starteMitStand } from "./abenteuer-affe";

const KATZE = { x: 4, y: 24 };
/** Das Bild der Katze im gebauten Paket: nur mit privater Grafik da. */
const KATZENBILD = new URL("../../dist/abenteuer/tiere/katze.webp", import.meta.url);
const OHNE_TIERBILD = "ohne private Grafik gibt es keine Tiere (Bild der Katze fehlt)";
/** Taste halten: genug für zwei Kacheln. */
const LAUFZEIT_MS = 900;
/** Zeit, bis die verscheuchte Katze aus dem Weg ist (4 Kacheln je Sekunde, höchstens 4 Kacheln). */
const WEGLAUFEN_MS = 1500;

/** Startet über der Katze mit Blick nach unten und schließt die Meldung der ersten Münzen. */
async function starteUeberKatze(seite: Page): Promise<void> {
  await starteMitStand(seite, {
    ...GRUNDSTAND,
    position: { karte: "mapleFalls.aussen", x: KATZE.x, y: KATZE.y - 1, richtung: "unten" },
    dialogvariablen: { ...EINLEITUNG_GESEHEN },
  });
  // Mit diesem Stand kommt zuerst die Meldung der ersten Münzen; sie hält die Welt an.
  const weiter = seite.getByRole("button", { name: "Weiter" });
  await expect(weiter).toBeVisible({ timeout: 15000 });
  await weiter.click();
}

async function kachel(seite: Page): Promise<{ x: number; y: number }> {
  const text = (await seite.getByTestId("abenteuer-kachel").textContent()) ?? "0,0";
  const [x, y] = text.split(",").map(Number);
  return { x: x ?? 0, y: y ?? 0 };
}

test("die Katze hält auf, „Verscheuchen“ macht ihr Feld frei", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "Laufen mit gehaltener Taste nur in Chromium");
  test.skip(!existsSync(KATZENBILD), OHNE_TIERBILD);
  await starteUeberKatze(page);
  const aktion = page.getByTestId("abenteuer-aktion");
  await expect(aktion).toHaveText("Verscheuchen", { timeout: 15000 });
  await aktion.click();
  await page.waitForTimeout(WEGLAUFEN_MS);
  await page.keyboard.down("ArrowDown");
  await page.waitForTimeout(LAUFZEIT_MS);
  await page.keyboard.up("ArrowDown");
  await page.waitForTimeout(200);
  expect((await kachel(page)).y).toBeGreaterThanOrEqual(KATZE.y);
});

test("ohne Verscheuchen bleibt der Held vor der Katze stehen", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "Laufen mit gehaltener Taste nur in Chromium");
  test.skip(!existsSync(KATZENBILD), OHNE_TIERBILD);
  await starteUeberKatze(page);
  await expect(page.getByTestId("abenteuer-aktion")).toHaveText("Verscheuchen", { timeout: 15000 });
  // Ein kurzer Schritt (unter einer Sekunde Drängen): die Katze bleibt, der Held auch.
  await page.keyboard.down("ArrowDown");
  await page.waitForTimeout(400);
  await page.keyboard.up("ArrowDown");
  await page.waitForTimeout(200);
  expect(await kachel(page)).toEqual({ x: KATZE.x, y: KATZE.y - 1 });
});
