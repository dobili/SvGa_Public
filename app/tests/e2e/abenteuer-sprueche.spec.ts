/**
 * Schach-Abenteuer, Bedenkzeit und Sprüche (Schritt 13, docs/spiel/10, S1 bis S4): Vor dem
 * Duell mit Skater Jo wählt der Leser Blitz 3 + 2 und nimmt „Großes Maul“ mit; in der Partie
 * läuft die Uhr, der Spruch ist spielbar, Jo antwortet, und Ambrose erklärt beim ersten Spruch,
 * wo Sprüche hingehören. Die Karte ist danach verbraucht.
 */
import { expect, test, type Page } from "@playwright/test";
import { feldDarunter } from "./abenteuer-karte";
import { starteImBrowser } from "./hilfen";
import { ladeAbenteuerpaket } from "./abenteuer-paket";

/** Spielstand im Park, eine Kachel unter Skater Jo (Feld aus der Karte), Blick nach oben, mit einem Spruch. */
const STAND = {
  version: 1,
  begonnen: "2026-11-08T05:00:00.000Z",
  eingangswertung: 600,
  eingangPartien: 0,
  wertung: 600,
  appWertungZuletzt: null,
  wertungPartien: 0,
  held: { name: "Kim", figur: "held-0" },
  handlung: { akt: 1, szene: "akt1.start", liga: null, durchlauf: 1 },
  position: {
    karte: "mapleFalls.park",
    ...feldDarunter("maple-falls-park", "skaterJo"),
    richtung: "oben",
  },
  besuchteOrte: ["mapleFalls"],
  karten: [{ kennung: "grossesMaul", anzahl: 1, erhalten: "2026-11-08T05:00:00.000Z" }],
};

/** Schneidet die Blase mit dieser Testkennung das Brett der Spielhülle? */
async function schneidetBrett(page: Page, testid: string): Promise<boolean> {
  const blase = await page.getByTestId(testid).boundingBox();
  const brett = await page.locator(".abenteuer-huelle .brett").first().boundingBox();
  if (!blase || !brett) return false;
  const waagerecht = blase.x < brett.x + brett.width && brett.x < blase.x + blase.width;
  const senkrecht = blase.y < brett.y + brett.height && brett.y < blase.y + blase.height;
  return waagerecht && senkrecht;
}

/** Tippt auf die Zeile im Kopf, bis sie fort ist (ein langer Satz blättert erst weiter). */
async function tippeWeg(page: Page, testid: string): Promise<void> {
  const zeile = page.getByTestId(testid);
  for (let i = 0; i < 5 && (await zeile.isVisible().catch(() => false)); i++) {
    await zeile.click().catch(() => undefined);
    await page.waitForTimeout(250);
  }
  await expect(zeile).toHaveCount(0);
}

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
  await ladeAbenteuerpaket(page);
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
  // Seit dem Sprechkopf (Wunsch des Autors, 28.11.2026) sprechen alle nacheinander im Kopf der
  // Partie neben dem Porträt: erst der Held (ohne Porträt), dann Jo (sein Porträt), dann erklärt
  // Ambrose (sein Porträt statt Jos), wo Sprüche hingehören; die Leiste nennt nur die Wirkung.
  const kopf = page.getByTestId("abenteuer-huelle-kopf");
  await expect(kopf.getByTestId("abenteuer-spruch-held")).toBeVisible();
  await expect(page.getByTestId("abenteuer-spruch-held")).toHaveAttribute("data-lage", "unten");
  await expect(kopf).toHaveAttribute("data-bild", "ohne");
  // Kein Fenster über dem Brett (Wunsch des Autors, 19. und 28.11.2026).
  expect(await schneidetBrett(page, "abenteuer-spruch-held")).toBe(false);
  await expect(page.locator(".abenteuer-tischblase")).toHaveCount(0);
  await tippeWeg(page, "abenteuer-spruch-held");
  await expect(kopf.getByTestId("abenteuer-spruch-antwort")).toBeVisible();
  await expect(kopf).toHaveAttribute("data-bild", "gegner");
  await expect(kopf).toHaveAttribute("data-art", "rede");
  expect(await schneidetBrett(page, "abenteuer-spruch-antwort")).toBe(false);
  await tippeWeg(page, "abenteuer-spruch-antwort");
  await expect(page.getByTestId("abenteuer-spruch-erklaerung")).toContainText("im Park redet man");
  await expect(kopf).toHaveAttribute("data-bild", "andere");
  await expect(kopf.locator(".abenteuer-sprechkopf-bild")).toHaveAttribute(
    "data-erscheinung",
    "geisterhaft",
  );
  if (process.env.SPRECHKOPF_FOTOS) {
    await page.screenshot({ path: `${process.env.SPRECHKOPF_FOTOS}/ambrose.png` });
  }
  await tippeWeg(page, "abenteuer-spruch-erklaerung");
  // Danach wieder Jo und der Ort.
  await expect(kopf).toHaveAttribute("data-art", "ort", { timeout: 15000 });
  await expect(kopf).toHaveAttribute("data-bild", "gegner");
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
  await ladeAbenteuerpaket(page);
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
  await ladeAbenteuerpaket(page);
  await expect(page.getByTestId("abenteuer-welt")).toBeVisible({ timeout: 30000 });
  await expect(page.getByTestId("abenteuer-aktion")).toBeVisible({ timeout: 10000 });
  const kachel = page.getByTestId("abenteuer-kachel");
  const vorher = await kachel.textContent();
  await page.keyboard.down("ArrowUp");
  await page.waitForTimeout(1000);
  await page.keyboard.up("ArrowUp");
  await expect(kachel).toHaveText(vorher ?? "");
});

test("Steckbrief je Gegner: Jos Schwäche ohne Lupe in Tagebuch und Deckwahl (N2621)", async ({
  page,
}) => {
  // Nach der Limo: Jo hat Zeile 0 freigeschaltet und ist analysiert, eine Lupe gibt es nicht.
  const stand = {
    ...STAND,
    figuren: [
      {
        kennung: "mapleFalls.skaterJo",
        abgelenkt: null,
        analysiert: true,
        dialogvariablen: {},
        steckbrief: [0],
      },
    ],
  };
  await starteImBrowser(page);
  await expect.poll(() => page.evaluate(schreibeStand, stand)).toBe(true);
  await page.reload();
  await page.goto("/app/#abenteuer");
  await ladeAbenteuerpaket(page);
  await expect(page.getByTestId("abenteuer-welt")).toBeVisible({ timeout: 30000 });
  await page.getByTestId("abenteuer-tagebuchknopf").click();
  const akten = page.getByTestId("abenteuer-gegnerakten");
  await expect(akten).toContainText("Jo (vorbereitet)");
  await expect(akten).toContainText("Rückzüge");
  await page.getByRole("button", { name: "Schließen" }).click();
  await page.getByTestId("abenteuer-aktion").click();
  const deckwahl = page.getByTestId("abenteuer-deckwahl");
  for (let i = 0; i < 20 && !(await deckwahl.isVisible()); i++) {
    const weiter = page.locator(".abenteuer-dialog-weiter");
    const wahl = page.locator(".abenteuer-dialog-wahlen button").first();
    if (await wahl.isVisible()) await wahl.click();
    else if (await weiter.isVisible()) await weiter.click();
    else await page.waitForTimeout(100);
  }
  const kasten = page.getByTestId("abenteuer-lupe");
  await expect(kasten).toContainText("Was du über den Gegner weißt");
  await expect(kasten).toContainText("Rückzüge");
});
