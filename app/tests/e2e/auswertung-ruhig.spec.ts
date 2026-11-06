/**
 * Oberflächentest: Beim Durchgehen einer ausgewerteten Partie bleiben Brett und Zugknöpfe, wo sie
 * sind (Wunsch des Autors, 6.11.2026: Die Linienknöpfe tauchten nur an Fehlern auf und
 * verschwanden wieder, die Ansicht sprang, und er tippte neben „Vor“).
 * Eingespielt wird die Opernpartie gegen Derya (auswertungpartie.ts) auf Handygröße 390 × 844.
 * Geprüft wird nach jedem Schritt (Knopf „Vor“, Pfeiltasten, Zug für Zug, einzeilig und
 * aufgeklappt): Die obere Kante von Brett und „Vor“ ändert sich nicht, die Linienknöpfe stehen in
 * einer Zeile, an Zügen ohne Engine-Folge sind „Besserer Zug“ und „Bestrafung“ gesperrt.
 * Dazu das Vorspielen über die Linienknöpfe (die Knöpfe unter dem Brett sind entfallen).
 */
import { expect, test, type Page } from "@playwright/test";
import { eintrag, oeffnePartie } from "./auswertungpartie";
import { starteImBrowser } from "./hilfen";

const HANDY = { width: 390, height: 844 };
/** Halbzüge der Opernpartie: so viele Schritte „Vor“ von der Grundstellung bis zum Matt. */
const HALBZUEGE = eintrag().partie.zuege.length;
/** Spielraum für Rundungen beim Messen, in Pixeln. */
const TOLERANZ = 0.5;

test.use({ viewport: HANDY });

/** Obere Kanten von Brett und „Vor“ sowie die Lage der drei Linienknöpfe. */
async function lage(page: Page) {
  const oben = async (ort: ReturnType<Page["locator"]>) => {
    const box = await ort.boundingBox();
    if (!box) throw new Error("Element ohne Lage");
    return box.y;
  };
  return {
    brett: await oben(page.locator('[data-tour="brett"]')),
    vor: await oben(page.getByRole("button", { name: "Einen Halbzug vor" })),
    linien: await Promise.all(
      ["partie", "besser", "strafe"].map((art) => oben(page.getByTestId(`linie-${art}`))),
    ),
  };
}

/** Geht die ganze Partie durch und vergleicht nach jedem Schritt die Lage mit dem Anfang. */
async function geheDurch(page: Page, schritt: () => Promise<void>) {
  await page.getByRole("button", { name: "Zum Anfang" }).click();
  // Seite so rollen, dass die Zugleiste oben steht: wie beim Durchgehen auf dem Handy.
  await page.getByTestId("partiezuege").evaluate((e) => e.scrollIntoView({ block: "start" }));
  const anfang = await lage(page);
  // Die drei Linienknöpfe in einer Zeile.
  const zeile = anfang.linien[0] ?? 0;
  for (const y of anfang.linien) expect(Math.abs(y - zeile)).toBeLessThan(1);
  for (let i = 0; i < HALBZUEGE; i += 1) {
    await schritt();
    const jetzt = await lage(page);
    expect(Math.abs(jetzt.brett - anfang.brett), `Brett nach Schritt ${i + 1}`).toBeLessThan(
      TOLERANZ,
    );
    expect(Math.abs(jetzt.vor - anfang.vor), `„Vor“ nach Schritt ${i + 1}`).toBeLessThan(TOLERANZ);
    for (const y of jetzt.linien) expect(Math.abs(y - zeile)).toBeLessThan(TOLERANZ);
  }
  await expect(page.getByRole("button", { name: "Einen Halbzug vor" })).toBeDisabled();
}

test("Durchgehen der ausgewerteten Partie: Brett und Knöpfe bleiben an ihrem Platz", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffnePartie(page, "hell");
  await expect(page.getByTestId("linie-partie")).toBeVisible();
  // An 1. e4 (Theorie) gibt es keine Engine-Folge: beide Zweigknöpfe gesperrt, aber da.
  await page.getByRole("button", { name: "Zum Anfang" }).click();
  await page.getByRole("button", { name: "Einen Halbzug vor" }).click();
  await expect(page.getByTestId("linie-besser")).toBeDisabled();
  await expect(page.getByTestId("linie-strafe")).toBeDisabled();
  await expect(page.getByTestId("linie-partie")).toHaveAttribute("aria-pressed", "true");

  const vor = page.getByRole("button", { name: "Einen Halbzug vor" });
  await geheDurch(page, () => vor.click());
  await geheDurch(page, () => page.locator("body").press("ArrowRight"));
  // Aufgeklappt: die Zweige stehen dann in eigenen Zeilen, die Zeile wächst trotzdem nicht.
  await page.getByRole("button", { name: "Alle Züge zeigen" }).click();
  await geheDurch(page, () => vor.click());
});

test("Linienknöpfe spielen die Folge vor, „Partie“ führt zurück", async ({ page }) => {
  await starteImBrowser(page);
  await oeffnePartie(page, "hell");
  const zuege = page.getByTestId("partiezuege");
  await zuege.getByRole("button", { name: /^8\. Sc3, / }).click();
  await expect(page.getByTestId("variantenknoepfe")).toHaveCount(0);
  await page.getByTestId("linie-strafe").click();
  await expect(zuege.locator('[aria-current="step"]')).toHaveText("8... c6");
  await expect(page.getByTestId("linienname")).toHaveText("Bestrafung");
  await expect(page.getByTestId("linie-strafe")).toHaveAttribute("aria-pressed", "true");
  // Die Folge hat nur einen Zug: Das Vorspielen endet sofort, der Knopf heißt wieder „Bestrafung“.
  await expect(page.getByTestId("linie-strafe")).toHaveAttribute("aria-label", "Bestrafung");
  await page.getByTestId("linie-partie").click();
  await expect(zuege.locator('[aria-current="step"]')).toHaveText(/8\. Sc3/);
  await expect(page.getByTestId("linienname")).toHaveText("Partie");
});
