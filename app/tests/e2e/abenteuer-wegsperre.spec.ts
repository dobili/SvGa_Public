/**
 * Schach-Abenteuer, Wegsperre S15 im Zedernwald (docs/spiel/32_Wegsperren.md): Vor dem Übergang zum
 * Bahndamm steht das Testteam. Solange die Sperre zu ist, kommt am Übergang das Gespräch mit der
 * Truppe, und der Held bleibt auf der Karte; mit `testteamWaldDurch` wechselt die Karte sofort,
 * ohne dass ein leeres Dialogfenster die Bedienung für ein Bild wegnimmt.
 *
 * Nebenbei geprüft: Der Held geht auf der unteren Wegreihe direkt über Benji und Imani vorbei
 * (Figuren sperren nur ihre Fußkachel, oberwelt/figurbilder.ts), und das Dialogfenster hat direkt
 * nach dem Laden des Pakets noch seinen Rahmen (anbindung/pixelrahmen.ts).
 * Abhängigkeiten: tests/e2e/abenteuer-affe.ts (Spielstand einspielen), Karte des Zedernwalds.
 */
import { expect, test, type Page } from "@playwright/test";
import {
  GRUNDSTAND,
  liesSpeicherImBrowser,
  schreibeStandImBrowser,
  starteMitStand,
} from "./abenteuer-affe";
import { feldVon } from "./abenteuer-karte";

/** Karte des Zedernwalds (Dateiname ohne Endung). */
const KARTE = "weg-cedar-riverton-zedernwald";
/** Der Übergang liegt auf dem Ostrand, zwei Reihen hoch; der Held kommt auf der unteren. */
const UEBERGANG = feldVon(KARTE, "weiterBahndamm");
const BENJI = feldVon(KARTE, "testteamBenji");
const IMANI = feldVon(KARTE, "testteamImani");
/** Reihe des Wegs direkt über Benji und Imani. */
const WEGREIHE = BENJI.y - 1;
/** Letzte Kachel vor dem Übergang: direkt über Imani. */
const RANDKACHEL = `${UEBERGANG.x - 1},${WEGREIHE}`;
/** Höchstens so viele Schritte bis zum Rand. */
const MAX_SCHRITTE = 12;

/** Spielstand nach dem Ende von Akt 1, vor der Ankunft in Riverton: Der Held steht über Benji. */
function standAmWald(dialogvariablen: Record<string, boolean>): object {
  return {
    ...GRUNDSTAND,
    position: {
      karte: "wegCedarRiverton.zedernwald",
      x: BENJI.x,
      y: WEGREIHE,
      richtung: "rechts",
    },
    dialogvariablen: { endeAkt1Gesehen: true, ...dialogvariablen },
  };
}

/** Die Kachel des Helden („x,y“) aus dem versteckten Feld der Oberwelt. */
async function kachel(seite: Page): Promise<string> {
  return (await seite.getByTestId("abenteuer-kachel").textContent()) ?? "";
}

/** Geht Kachel für Kachel nach rechts bis zur letzten Kachel vor dem Übergang. */
async function geheZumRand(seite: Page): Promise<void> {
  for (let i = 0; i < MAX_SCHRITTE && (await kachel(seite)) !== RANDKACHEL; i++) {
    const vorher = await kachel(seite);
    await seite.keyboard.down("ArrowRight");
    try {
      await expect.poll(() => kachel(seite), { timeout: 3000, intervals: [20] }).not.toBe(vorher);
    } finally {
      await seite.keyboard.up("ArrowRight");
    }
    // Der Held beendet den angefangenen Schritt; erst danach zählt die Kachel.
    await seite.waitForTimeout(150);
  }
  await expect.poll(() => kachel(seite), { timeout: 2000 }).toBe(RANDKACHEL);
}

/**
 * Lädt das Rahmenbild des Dialogfensters noch (`border-image`)? Läuft im Browser am Fenster.
 * Warum: Nach dem Laden des Pakets waren die Adressen der Pixelrahmen freigegeben, das Fenster
 * hatte keinen Grund mehr und die weiße Schrift stand auf der Karte (anbindung/pixelrahmen.ts).
 * Ohne Rahmenbild (kein Paketrahmen) gilt die Prüfung als bestanden.
 */
function rahmenbildLaedt(fenster: Element): Promise<boolean> {
  const adresse = /url\("(.*)"\)/.exec(getComputedStyle(fenster).borderImageSource)?.[1];
  if (!adresse) return Promise.resolve(true);
  return new Promise<boolean>((fertig) => {
    const bild = new Image();
    bild.onload = () => fertig(true);
    bild.onerror = () => fertig(false);
    bild.src = adresse;
  });
}

/**
 * Merkt im Browser, ob vor dem Kartenwechsel etwas aufblitzt: ein Dialogfenster, oder das
 * Steuerkreuz verschwindet, während die Karte noch steht (so sah der leere Dialog aus).
 */
function beobachteAufblitzen(): void {
  const funde: string[] = [];
  (window as unknown as { aufblitzen: string[] }).aufblitzen = funde;
  const da = (auswahl: string) => document.querySelector(auswahl) !== null;
  new MutationObserver(() => {
    if (da("[data-testid='abenteuer-dialog']")) funde.push("Dialogfenster");
    if (da(".abenteuer-welt canvas") && !da(".abenteuer-steuerkreuz"))
      funde.push("Steuerkreuz weg");
  }).observe(document.body, { subtree: true, childList: true });
}

test("Wegsperre im Zedernwald: zu mit Gespräch, offen ohne Aufblitzen", async ({
  page,
  browserName,
}) => {
  test.skip(
    browserName !== "chromium",
    "Laufen mit gehaltener Taste nur in Chromium (wie Affentest)",
  );
  test.slow();
  expect(IMANI).toEqual({ x: UEBERGANG.x - 1, y: BENJI.y });
  const dialog = page.getByTestId("abenteuer-dialog");
  const schild = page.getByTestId("abenteuer-ortsschild");

  // Sperre zu: Am Übergang kommt die Truppe, „Später.“ lässt den Helden auf der Karte.
  await starteMitStand(page, standAmWald({}));
  await geheZumRand(page);
  await page.keyboard.down("ArrowRight");
  await expect(dialog).toContainText("Klapptisch", { timeout: 15000 });
  await page.keyboard.up("ArrowRight");
  expect(await dialog.evaluate(rahmenbildLaedt)).toBe(true);
  const spaeter = dialog.getByRole("button", { name: "„Später.“" });
  for (let i = 0; i < MAX_SCHRITTE && !(await spaeter.isVisible()); i++) {
    await dialog.getByRole("button", { name: "Weiter" }).click();
  }
  await expect(dialog).toContainText("Zehn Züge gegen Benji");
  await spaeter.click();
  await expect(dialog).toContainText("Der Wald läuft nicht weg.");
  await dialog.getByRole("button", { name: "Weiter" }).click();
  await expect(dialog).toHaveCount(0);
  await expect(schild).toHaveText("Zedernwald");
  // Der Held steht auf dem Übergangsfeld am Kartenrand und kommt nicht weiter.
  expect(await kachel(page)).toBe(`${UEBERGANG.x},${WEGREIHE}`);
  await expect
    .poll(async () => (await page.evaluate(liesSpeicherImBrowser)).abenteuer?.dialogvariablen)
    .toMatchObject({ testteamWaldGesehen: true, testteamWaldDurch: false });

  // Sperre offen: derselbe Übergang wechselt sofort zum Bahndamm, nichts blitzt auf.
  const offen = standAmWald({ testteamWaldGesehen: true, testteamWaldDurch: true });
  await expect.poll(() => page.evaluate(schreibeStandImBrowser, offen)).toBe(true);
  await page.reload();
  await expect(page.locator(".abenteuer-welt canvas")).toBeVisible({ timeout: 40000 });
  await expect.poll(() => kachel(page), { timeout: 10000 }).toBe(`${BENJI.x},${WEGREIHE}`);
  await geheZumRand(page);
  await page.evaluate(beobachteAufblitzen);
  await page.keyboard.down("ArrowRight");
  await expect(schild).toHaveText("Am Bahndamm", { timeout: 15000 });
  await page.keyboard.up("ArrowRight");
  expect(
    await page.evaluate(() => (window as unknown as { aufblitzen: string[] }).aufblitzen),
  ).toEqual([]);
  await expect(dialog).toHaveCount(0);
});
