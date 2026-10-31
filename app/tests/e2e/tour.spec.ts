/**
 * App-Tour (R52, P8): Frage nach dem Rundgang beim ersten Start, Toursymbol oben rechts, Ablauf
 * einer Tour mit Überspringen fehlender Ziele, Schalter in den Einstellungen, Tastatur und axe.
 * Dazu läuft jede Tour der Bereiche Buch, Training und Nachschlagen einmal bis zum Ende durch.
 */
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { oeffneAbbildung, oeffneTrainer, starteImBrowser } from "./hilfen";

/** Die Karte der laufenden Tour. */
function tourkarte(page: Page) {
  return page.getByTestId("tour").getByRole("dialog");
}

async function bereich(page: Page, name: string): Promise<void> {
  await page
    .getByRole("navigation", { name: "Hauptbereiche" })
    .getByRole("button", { name, exact: true })
    .click();
}

/** Startet die Tour des gezeigten Bildschirms über das Symbol oben rechts. */
async function starteTour(page: Page): Promise<void> {
  await page.getByRole("button", { name: /^Tour zu diesem Bildschirm/ }).click();
  await expect(tourkarte(page)).toBeVisible();
}

/** Tippt „Weiter“ bis „Fertig“ und gibt die Texte aller gezeigten Schritte zurück. */
async function bisZumEnde(page: Page): Promise<string[]> {
  const karte = tourkarte(page);
  const stand = await karte.getByText(/^Schritt \d+ von \d+$/).textContent();
  const anzahl = Number(/von (\d+)/.exec(stand ?? "")?.[1]);
  const texte: string[] = [];
  for (let schritt = 1; schritt <= anzahl; schritt += 1) {
    await expect(karte.getByText(`Schritt ${schritt} von ${anzahl}`)).toBeVisible();
    texte.push((await karte.locator(".tour-text").textContent()) ?? "");
    const name = schritt === anzahl ? "Fertig" : "Weiter";
    await karte.getByRole("button", { name }).click();
  }
  await expect(page.getByTestId("tour")).toHaveCount(0);
  return texte;
}

test("erster Start: Frage nach dem Rundgang, einmal; Rundgang über alle Bereiche", async ({
  page,
}) => {
  await starteImBrowser(page, { tourAngebot: true });
  const angebot = page.getByTestId("tour-angebot");
  await expect(angebot.getByRole("heading", { name: "Kleiner Rundgang?" })).toBeVisible();
  await angebot.getByRole("button", { name: "Rundgang starten" }).click();
  await expect(page.getByTestId("tour-angebot")).toHaveCount(0);
  const karte = tourkarte(page);
  await expect(karte.getByRole("heading", { name: "Rundgang durch die App" })).toBeVisible();
  await expect(karte.getByText("Schritt 1 von 8")).toBeVisible();
  await expect(karte).toBeFocused();
  await karte.getByRole("button", { name: "Weiter" }).click();
  // Schritt 2 zeigt den Bereich Buch der Leiste mit goldenem Rahmen, die Karte steht oben.
  await expect(karte).toContainText("Buch: jede Abbildung");
  await expect(page.locator(".tour-rahmen")).toBeVisible();
  await expect(page.locator(".tour-karte-oben")).toBeVisible();
  await karte.getByRole("button", { name: "Zurück" }).click();
  await expect(karte.getByText("Schritt 1 von 8")).toBeVisible();
  expect(await bisZumEnde(page)).toHaveLength(8);
  // Die Frage kommt nicht wieder, die Haupttour gilt als gesehen.
  await page.reload();
  await expect(page.getByRole("heading", { name: "Buch" })).toBeVisible();
  await expect(page.getByTestId("tour-angebot")).toHaveCount(0);
});

test("„Später“ schließt die Frage für immer, das Symbol bleibt", async ({ page }) => {
  await starteImBrowser(page, { tourAngebot: true });
  await page.getByRole("button", { name: "Später" }).click();
  await expect(page.getByTestId("tour-angebot")).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole("heading", { name: "Buch" })).toBeVisible();
  await expect(page.getByTestId("tour-angebot")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Tour zu diesem Bildschirm, noch nicht gesehen" }),
  ).toBeVisible();
});

test("Abbildung: Tour über das Symbol, Zugleiste nur mit Zugfolge, danach ohne Punkt", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneAbbildung(page, "1.26", "1.26");
  await starteTour(page);
  const karte = tourkarte(page);
  await expect(karte.getByRole("heading", { name: "Abbildung" })).toBeVisible();
  await expect(karte).toContainText("Die Nummer wie im Buch");
  // Während der Tour fängt die Sperre jeden Tipp ab: Die Leiste wechselt nicht den Bereich.
  await page
    .getByTestId("tour")
    .locator(".tour-sperre")
    .click({ position: { x: 5, y: 5 } });
  await expect(karte).toBeVisible();
  const mitZugleiste = await bisZumEnde(page);
  expect(mitZugleiste.some((text) => text.startsWith("Diese Abbildung hat eine Zugfolge"))).toBe(
    true,
  );
  await expect(page.getByRole("button", { name: "Tour zu diesem Bildschirm" })).toBeVisible();
  // Abb. 0.4 ist ein Lehrbild ohne Zugfolge: Der Schritt zur Zugleiste fällt weg.
  await bereich(page, "Buch");
  await oeffneAbbildung(page, "0.4", "0.4");
  await starteTour(page);
  const ohneZugleiste = await bisZumEnde(page);
  expect(ohneZugleiste.some((text) => text.startsWith("Diese Abbildung hat eine Zugfolge"))).toBe(
    false,
  );
  expect(ohneZugleiste.length).toBeLessThan(mitZugleiste.length);
});

test("Tastatur: Pfeiltasten blättern, Tab bleibt in der Karte, Esc beendet; axe ohne Befund", async ({
  page,
}) => {
  await starteImBrowser(page);
  await starteTour(page);
  const karte = tourkarte(page);
  // Buch beim ersten Start: Nummernfeld, Kapitel, Rundgang (ohne „Zuletzt“, das fehlt noch).
  await expect(karte.getByText("Schritt 1 von 3")).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(karte.getByText("Schritt 2 von 3")).toBeVisible();
  await page.keyboard.press("ArrowLeft");
  await expect(karte.getByText("Schritt 1 von 3")).toBeVisible();
  for (let i = 0; i < 4; i += 1) await page.keyboard.press("Tab");
  expect(await karte.evaluate((k) => k.contains(document.activeElement))).toBe(true);
  const ergebnis = await new AxeBuilder({ page }).include("[data-testid='tour']").analyze();
  const schwer = ergebnis.violations.filter(
    (v) => v.impact === "serious" || v.impact === "critical",
  );
  expect(schwer.map((v) => v.id)).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("tour")).toHaveCount(0);
  // Der Fokus kehrt zum Symbol zurück.
  await expect(page.getByRole("button", { name: "Tour zu diesem Bildschirm" })).toBeFocused();
});

test("Einstellungen: Symbol aus blendet es überall aus, der Rundgang bleibt erreichbar", async ({
  page,
}) => {
  await starteImBrowser(page);
  await bereich(page, "Profil");
  await page.getByRole("button", { name: "Einstellungen", exact: true }).click();
  await page.getByRole("tab", { name: "Hilfe" }).click();
  await page
    .getByRole("radiogroup", { name: "Toursymbol" })
    .getByRole("radio", { name: "aus" })
    .click();
  await expect(page.getByRole("button", { name: /^Tour zu diesem Bildschirm/ })).toHaveCount(0);
  await page.getByRole("button", { name: "Rundgang durch die App" }).click();
  const karte = tourkarte(page);
  // Ohne Symbol steht der Schritt dazu in der Mitte statt am Ziel.
  for (let i = 0; i < 6; i += 1) await karte.getByRole("button", { name: "Weiter" }).click();
  await expect(karte).toContainText("Dieses Symbol steht oben rechts");
  await expect(page.locator(".tour-karte-mitte")).toBeVisible();
  await page.keyboard.press("Escape");
  await bereich(page, "Buch");
  await expect(page.getByRole("button", { name: /^Tour zu diesem Bildschirm/ })).toHaveCount(0);
});

test("jede Tour der Bereiche läuft bis zum Ende durch", async ({ page }) => {
  await starteImBrowser(page);
  const laeuft = async () => {
    await starteTour(page);
    expect((await bisZumEnde(page)).length).toBeGreaterThan(0);
  };
  await laeuft(); // Buch
  await page
    .getByRole("button", { name: /Kapitel 1\b/ })
    .first()
    .click();
  // Erst wenn die Kapiteldaten da sind, gibt es Ziele; sonst zeigt die Tour keine Karte (unter
  // hoher Last am 25.10.2026 einmal so gesehen).
  await expect(page.getByTestId("kapitelfortschritt")).toBeVisible();
  await laeuft();
  await bereich(page, "Training");
  await laeuft();
  await oeffneTrainer(page, "taktik");
  await laeuft();
  await bereich(page, "Nachschlagen");
  await laeuft();
  for (const eintrag of ["Glossar", "Denkroutine", "Gesamt-Checkliste", "Steckbriefe"]) {
    await bereich(page, "Nachschlagen");
    await page.getByRole("button", { name: new RegExp(`^${eintrag}`) }).click();
    // Die Ziele der Tour (etwa die Steckbriefe) kommen erst mit den Daten; ohne sie zeigt die Tour
    // keine Karte (im Gesamtlauf am 25.10.2026 einmal so gesehen).
    await page.waitForLoadState("networkidle");
    // Seit 0.2.144 lädt die Hülle Index und Nachschlagen schon beim Start (Ringfeier), „networkidle“
    // kommt deshalb vor dem Zeichnen der Seite; erst auf ihre Überschrift warten.
    await expect(page.getByRole("heading", { level: 1, name: new RegExp(eintrag) })).toBeVisible();
    if (eintrag === "Steckbriefe") {
      await expect(page.getByRole("heading", { level: 2, name: "Eröffnungen" })).toBeVisible();
    }
    await laeuft();
  }
  await bereich(page, "Profil");
  await laeuft();
});

test("Teil B: Touren für Spielen und Partie, mit Auswertung nach dem Ende", async ({ page }) => {
  await starteImBrowser(page);
  await bereich(page, "Spielen");
  await starteTour(page);
  const spielen = await bisZumEnde(page);
  expect(spielen.join(" ")).toContain("Art des Gegners");
  expect(spielen.join(" ")).toContain("Gegen wen du spielst");
  expect(spielen.join(" ")).toContain("„Beginnen“ startet die Partie");
  await page.getByRole("checkbox", { name: /Gewertete Partie/ }).uncheck();
  await page.getByRole("button", { name: "Partie beginnen" }).click();
  await starteTour(page);
  const waehrend = await bisZumEnde(page);
  expect(waehrend.join(" ")).toContain("Die Züge der Partie");
  expect(waehrend.join(" ")).toContain("Wer am Zug ist");
  expect(waehrend.join(" ")).not.toContain("rechnet die Engine jeden Zug nach");
  await page.getByRole("button", { name: "Aufgeben" }).click();
  await page.getByRole("button", { name: "Ja, aufgeben" }).click();
  await expect(page.getByTestId("partieende")).toBeVisible();
  await starteTour(page);
  const danach = await bisZumEnde(page);
  expect(danach.join(" ")).toContain("Das Ergebnis.");
  // Nach dem Ende stimmt „Wer am Zug ist …“ nicht mehr; der Schritt fällt weg.
  expect(danach.join(" ")).not.toContain("Wer am Zug ist");
});

test("Trainer: Beschreibung auf der Auswahl sichtbar, ohne Auswahl der Schritt in der Mitte", async ({
  page,
}) => {
  await starteImBrowser(page);
  // Taktik hat eine Auswahl: Die Beschreibung steht darüber, die Tour zeigt auf sie.
  await oeffneTrainer(page, "taktik");
  await expect(page.getByTestId("taktik-wahl")).toBeVisible();
  await expect(page.locator(".trainer-ablauf")).toBeVisible();
  await starteTour(page);
  await expect(tourkarte(page)).toContainText("Hier steht in einem Satz");
  await page.keyboard.press("Escape");
  // Die Zielbilanz beginnt gleich mit der Runde: Beschreibung aus, der erste Schritt in der Mitte
  // (Röntgen hat seit dem Nebenchat, 30.10.2026, eine Stufenwahl).
  await oeffneTrainer(page, "zielbilanz");
  await expect(page.locator(".trainer-ablauf")).toBeHidden();
  await starteTour(page);
  await expect(tourkarte(page)).toContainText("das Fragezeichen an seiner Karte");
  await expect(page.locator(".tour-karte-mitte")).toBeVisible();
});
