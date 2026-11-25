/**
 * Porträts im Dialog (Befund des Autors, 25.11.2026: „immer wieder“ kein Porträt, etwa bei Ambrose
 * geflüstert und bei Mama im Diner „Gibt es hier Ketchup?“). Zwei Fälle:
 * 1. Der Diner-Abend mit Mama: Jede Zeile mit Sprecher zeigt ein geladenes Porträt, auch Ambrose
 *    geflüstert („nur du hörst ihn“) und Mamas „Gibt es hier Ketchup?“.
 * 2. Neue Paketversion zwischendurch: Nach einer Partie öffnet die App das Spiel neu und lädt eine
 *    neue Version auf dem Server gleich nach (Wunsch des Autors, 19.11.2026). Der Paketlader gibt
 *    dabei alle Bildadressen frei (paketlader.ts, vergiss); das Porträt hielt seine alten Adressen
 *    fest und zeigte danach nichts mehr. Nachgestellt mit einer neuen Versionsnummer auf dem Server
 *    und dem Weg „Startseite, zurück ins Spiel“ statt der Partie (ohne Neuladen der Seite).
 * Geladen heißt: Die Bildadresse des Porträts lässt sich als Bild laden (eine freigegebene
 * Blob-Adresse nicht).
 */
import { expect, test, type Page } from "@playwright/test";
import { EINLEITUNG_GESEHEN, GRUNDSTAND, starteMitStand } from "./abenteuer-affe";
import { PAKET_FRIST_MS } from "./abenteuer-paket";

test.use({ serviceWorkers: "block" });

/** Im Wohnzimmer links neben Mama: Nach dem ersten Abend steht sie auf 17,7 (Karte „ausgepackt“). */
const NEBEN_MAMA = { karte: "mapleFalls.wohnzimmer", x: 16, y: 7, richtung: "rechts" };
const NACH_ERSTEM_ABEND = {
  ...EINLEITUNG_GESEHEN,
  brettBeruehrt: true,
  ambroseErwachtGesehen: true,
  ersteLektionBesprochen: true,
  treppeAbendGesehen: true,
  ersterAbendGesehen: true,
};
/** Höchstens so viele Schritte durch ein Gespräch. */
const SCHRITTE = 60;
const FRIST_MS = 15000;

/**
 * Zustand des Porträts im Dialogkopf: „ohne Kopf“ (Erzähler), „fehlt“, „kaputt“ oder „geladen“.
 * Läuft im Browser: lädt die Adresse (img oder Hintergrund) neu als Bild.
 */
async function portraetImBrowser(): Promise<string> {
  const kopf = document.querySelector(
    ".abenteuer-dialog:not(.abenteuer-sprechblase) .abenteuer-dialog-kopf",
  );
  if (!kopf) return "ohne Kopf";
  const el = kopf.querySelector<HTMLElement>(".abenteuer-dialog-portraet");
  if (!el) return "fehlt";
  const adresse =
    el instanceof HTMLImageElement
      ? el.src
      : (/url\("?([^")]+)"?\)/.exec(getComputedStyle(el).backgroundImage)?.[1] ?? "");
  if (!adresse) return "fehlt";
  const bild = new Image();
  const geladen = await new Promise<boolean>((fertig) => {
    bild.onload = () => fertig(bild.naturalWidth > 0);
    bild.onerror = () => fertig(false);
    bild.src = adresse;
  });
  return geladen ? "geladen" : "kaputt";
}

/** Wartet kurz, bis das Porträt zur Zeile da ist (es lädt nach dem ersten Bild der Zeile). */
async function portraetZurZeile(seite: Page): Promise<string> {
  let zustand = "fehlt";
  await expect
    .poll(async () => (zustand = await seite.evaluate(portraetImBrowser)), { timeout: 3000 })
    .not.toMatch(/fehlt|kaputt/)
    .catch(() => undefined);
  return zustand;
}

/** Ein Schritt im Dialog: erste Wahl oder „Weiter“. */
async function weiter(seite: Page): Promise<void> {
  const wahlen = seite.locator(".abenteuer-dialog-wahlen button");
  if ((await wahlen.count()) > 0) await wahlen.first().click();
  else await seite.locator(".abenteuer-dialog-weiter").click();
}

/** Führt das Gespräch bis zum Ende; Ausgabe: je Zeile „Sprecher: Text → Zustand des Porträts“. */
async function gespraechMitPortraets(seite: Page): Promise<string[]> {
  const dialog = seite.getByTestId("abenteuer-dialog");
  await expect(dialog).toBeVisible({ timeout: FRIST_MS });
  const zeilen: string[] = [];
  for (let i = 0; i < SCHRITTE && (await dialog.isVisible()); i++) {
    await expect(seite.locator(".abenteuer-dialog-weiter, .abenteuer-dialog-wahlen button").first())
      .toBeEnabled({ timeout: FRIST_MS })
      .catch(() => undefined);
    const sprecher = (await dialog.getAttribute("aria-label")) ?? "";
    const text = (await dialog.locator(".abenteuer-dialog-text").first().textContent()) ?? "";
    zeilen.push(`${sprecher}: ${text.slice(0, 40)} → ${await portraetZurZeile(seite)}`);
    await weiter(seite).catch(() => undefined);
  }
  return zeilen;
}

test("Diner-Abend: jede Zeile mit Sprecher zeigt ein Porträt, auch Ambrose geflüstert", async ({
  page,
}) => {
  test.slow();
  await starteMitStand(page, {
    ...GRUNDSTAND,
    position: NEBEN_MAMA,
    dialogvariablen: { ...NACH_ERSTEM_ABEND, joGetroffen: true },
  });
  await page.getByTestId("abenteuer-aktion").click({ timeout: FRIST_MS });
  const zeilen = await gespraechMitPortraets(page);
  expect(zeilen.some((z) => z.includes("Ketchup"))).toBe(true);
  expect(zeilen.some((z) => z.startsWith("Ambrose"))).toBe(true);
  expect(zeilen.filter((z) => /→ (fehlt|kaputt)$/.test(z))).toEqual([]);
});

test("Nach einer neuen Paketversion zeigt das Porträt weiter ein Bild", async ({
  page,
  browserName,
}) => {
  // Wie abenteuer-update.spec.ts: page.route und Cache-Speicher sind in WebKit nicht nachstellbar.
  test.skip(browserName === "webkit", "Cache-Speicher und page.route in WebKit nicht nachstellbar");
  test.slow();
  await starteMitStand(page, {
    ...GRUNDSTAND,
    position: NEBEN_MAMA,
    dialogvariablen: NACH_ERSTEM_ABEND,
  });
  await page.getByTestId("abenteuer-aktion").click({ timeout: FRIST_MS });
  const vorher = await gespraechMitPortraets(page);
  expect(vorher.filter((z) => z.startsWith("Mama"))[0]).toMatch(/→ geladen$/);
  // Der Server meldet ab jetzt eine neuere Version (gleiche Dateien, andere Nummer).
  await page.route("**/abenteuer/paket.json", async (route) => {
    const antwort = await route.fetch();
    const verzeichnis = (await antwort.json()) as { version: string };
    await route.fulfill({
      response: antwort,
      json: { ...verzeichnis, version: `${verzeichnis.version}-neu` },
    });
  });
  // Wie nach einer Partie: Das Spiel öffnet sich neu (Sprung „#abenteuer“ baut die Ansicht neu
  // auf), ohne dass die Seite neu lädt; die Merklisten der Bilder im Speicher bleiben.
  const alteWelt = await page.locator(".abenteuer-welt canvas").elementHandle();
  await page.evaluate(() => (location.hash = "#abenteuer"));
  await expect.poll(() => alteWelt?.evaluate((c) => c.isConnected)).toBe(false);
  // Die neue Version lädt von selbst (AbenteuerAnsicht, neuerStand), danach geht es in die Welt.
  await expect(page.locator(".abenteuer-welt canvas")).toBeVisible({ timeout: PAKET_FRIST_MS });
  await page.waitForTimeout(500);
  await page.getByTestId("abenteuer-aktion").click({ timeout: FRIST_MS });
  const nachher = await gespraechMitPortraets(page);
  expect(nachher.filter((z) => z.startsWith("Mama"))[0]).toMatch(/→ geladen$/);
});
