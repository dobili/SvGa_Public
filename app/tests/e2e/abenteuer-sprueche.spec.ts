/**
 * Schach-Abenteuer, Bedenkzeit und Sprüche (Schritt 13, docs/spiel/10, S1 bis S4): Vor dem
 * Duell mit Skater Jo wählt der Leser Blitz 3 + 2 und nimmt „Großes Maul“ mit; in der Partie
 * läuft die Uhr, der Spruch ist spielbar, Jo antwortet, und Ambrose erklärt beim ersten Spruch,
 * wo Sprüche hingehören. Die Karte ist danach verbraucht.
 */
import { expect, test } from "@playwright/test";
import { feldDarunter } from "./abenteuer-karte";
import { starteImBrowser } from "./hilfen";

/** Spielstand im Park, eine Kachel unter Skater Jo (Feld aus der Karte), Blick nach oben, mit einem Spruch. */
const STAND = {
  version: 1,
  begonnen: "2026-11-08T05:00:00.000Z",
  eingangswertung: 600,
  eingangPartien: 0,
  wertung: 600,
  appWertungZuletzt: null,
  wertungPartien: 0,
  held: { name: "Kim", variante: 0 },
  handlung: { akt: 1, szene: "akt1.start", liga: null, durchlauf: 1 },
  position: {
    karte: "mapleFalls.park",
    ...feldDarunter("maple-falls-park", "skaterJo"),
    richtung: "oben",
  },
  besuchteOrte: ["mapleFalls"],
  karten: [{ kennung: "grossesMaul", anzahl: 1, erhalten: "2026-11-08T05:00:00.000Z" }],
};

function schreibeStand(stand: object): Promise<boolean> {
  return new Promise<boolean>((fertig, fehler) => {
    const anfrage = indexedDB.open("schach-von-grund-auf");
    anfrage.onerror = () => fehler(anfrage.error);
    anfrage.onsuccess = () => {
      const db = anfrage.result;
      const bereich = db.transaction("nutzerdaten", "readwrite").objectStore("nutzerdaten");
      const lesen = bereich.get("aktuell");
      lesen.onsuccess = () => {
        const alt = lesen.result as Record<string, unknown> | undefined;
        if (!alt?.spiel) {
          db.close();
          fertig(false);
          return;
        }
        const schreiben = bereich.put({ ...alt, abenteuer: stand }, "aktuell");
        schreiben.onsuccess = () => {
          db.close();
          fertig(true);
        };
        schreiben.onerror = () => fehler(schreiben.error);
      };
    };
  });
}

test("Blitz gegen Skater Jo und der Spruch „Großes Maul“", async ({ page }) => {
  await starteImBrowser(page);
  await expect.poll(() => page.evaluate(schreibeStand, STAND)).toBe(true);
  await page.reload();
  await page.goto("/app/#abenteuer");
  await page.getByTestId("abenteuer-laden").click();
  await expect(page.getByTestId("abenteuer-welt")).toBeVisible({ timeout: 30000 });
  const aktion = page.getByTestId("abenteuer-aktion");
  await expect(aktion).toBeVisible({ timeout: 10000 });
  await aktion.click();
  // Dialog durchblättern („Abgemacht.“ ist die erste Wahl), bis die Deckwahl erscheint.
  const deckwahl = page.getByTestId("abenteuer-deckwahl");
  for (let i = 0; i < 20 && !(await deckwahl.isVisible()); i++) {
    const weiter = page.locator(".abenteuer-dialog-weiter");
    const wahl = page.locator(".abenteuer-dialog-wahlen button").first();
    if (await wahl.isVisible()) await wahl.click();
    else if (await weiter.isVisible()) await weiter.click();
    else await page.waitForTimeout(100);
  }
  await expect(deckwahl).toBeVisible();
  await page.getByTestId("abenteuer-zeit-blitz").click();
  await expect(page.getByTestId("abenteuer-zeit-blitz")).toHaveAttribute("aria-checked", "true");
  await deckwahl.getByRole("button", { name: "Großes Maul" }).click();
  await page.getByTestId("abenteuer-deck-los").click();

  await expect(page.getByTestId("abenteuer-kartenleiste")).toBeVisible({ timeout: 30000 });
  await expect(page.getByTestId("uhr-white")).toContainText("3:00");
  const karte = page.getByTestId("abenteuer-karte-grossesMaul");
  await expect(karte).toHaveAttribute("data-ansicht", "hell", { timeout: 15000 });
  await karte.click();
  await page.getByTestId("abenteuer-karte-ausspielen").click();
  // Seit dem Tischgespräch (docs/spiel/29) spricht der Held unten, Jo antwortet oben, danach
  // erklärt Ambrose unten, wo Sprüche hingehören; die Leiste nennt nur die Wirkung.
  await expect(page.getByTestId("abenteuer-spruch-held")).toBeVisible();
  await expect(page.getByTestId("abenteuer-spruch-antwort")).toBeVisible();
  await expect(page.getByTestId("abenteuer-spruch-held")).toHaveAttribute("data-lage", "unten");
  await page.getByTestId("abenteuer-spruch-held").click();
  await expect(page.getByTestId("abenteuer-spruch-erklaerung")).toContainText("im Park redet man");
  await expect(page.locator(".abenteuer-karte-meldung")).toContainText("Ein frecher Satz");
  // Verbraucht: Die Karte liegt umgedreht im Fächer.
  await expect(karte).toHaveAttribute("data-ansicht", "rueckseite");
});

test("Werkzeugkarten im Duell: Abzählen und Waage", async ({ page }) => {
  const stand = {
    ...STAND,
    karten: [
      { kennung: "abzaehlen", anzahl: 1, erhalten: "2026-11-08T05:00:00.000Z" },
      { kennung: "waage", anzahl: 1, erhalten: "2026-11-08T05:00:00.000Z" },
    ],
    gegenstaende: ["lupe"],
  };
  await starteImBrowser(page);
  await expect.poll(() => page.evaluate(schreibeStand, stand)).toBe(true);
  await page.reload();
  await page.goto("/app/#abenteuer");
  await page.getByTestId("abenteuer-laden").click();
  await expect(page.getByTestId("abenteuer-welt")).toBeVisible({ timeout: 30000 });
  await page.getByTestId("abenteuer-aktion").click();
  const deckwahl = page.getByTestId("abenteuer-deckwahl");
  for (let i = 0; i < 20 && !(await deckwahl.isVisible()); i++) {
    const weiter = page.locator(".abenteuer-dialog-weiter");
    const wahl = page.locator(".abenteuer-dialog-wahlen button").first();
    if (await wahl.isVisible()) await wahl.click();
    else if (await weiter.isVisible()) await weiter.click();
    else await page.waitForTimeout(100);
  }
  // Die Lupe des Uhrmachers verrät Jos Steckbrief (ihr blinder Fleck: Rückzüge).
  await expect(page.getByTestId("abenteuer-lupe")).toContainText("Rückzüge");
  await deckwahl.getByRole("button", { name: "Abzählen" }).click();
  await deckwahl.getByRole("button", { name: "Waage" }).click();
  await page.getByTestId("abenteuer-deck-los").click();
  const abzaehlen = page.getByTestId("abenteuer-karte-abzaehlen");
  await expect(abzaehlen).toHaveAttribute("data-ansicht", "hell", { timeout: 30000 });
  await abzaehlen.click();
  await page.getByTestId("abenteuer-karte-ausspielen").click();
  const meldung = page.locator(".abenteuer-karte-meldung");
  await expect(meldung).toBeVisible();
  // Dauerhaft: Sie glänzt, solange ihre Anzeige gilt, und ist in dieser Partie gespielt.
  await expect(abzaehlen).toHaveAttribute("data-ansicht", "glanz");
});

test("Figuren sperren: der Held läuft nicht durch Skater Jo", async ({ page }) => {
  // Befund des Autors (10.11.2026): Der Held soll nicht durch Figuren laufen können. Er steht eine
  // Kachel unter Skater Jo mit Blick nach oben und drückt eine Sekunde lang nach oben.
  await starteImBrowser(page);
  await expect.poll(() => page.evaluate(schreibeStand, STAND)).toBe(true);
  await page.reload();
  await page.goto("/app/#abenteuer");
  await page.getByTestId("abenteuer-laden").click();
  await expect(page.getByTestId("abenteuer-welt")).toBeVisible({ timeout: 30000 });
  await expect(page.getByTestId("abenteuer-aktion")).toBeVisible({ timeout: 10000 });
  const kachel = page.getByTestId("abenteuer-kachel");
  const vorher = await kachel.textContent();
  await page.keyboard.down("ArrowUp");
  await page.waitForTimeout(1000);
  await page.keyboard.up("ArrowUp");
  await expect(kachel).toHaveText(vorher ?? "");
});
