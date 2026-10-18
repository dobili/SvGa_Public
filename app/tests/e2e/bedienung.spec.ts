/**
 * Oberflächentests für die Bedienung der Werkzeuge nach den Rückmeldungen des Autors: nichts
 * gewählt zu Beginn, zweites Tippen, Sicht-Schalter (0.2.27), Tipp auf den Hintergrund (0.2.29),
 * Werkzeug-Umbau mit Bündeln, Reitern, Stufen und Legende (0.2.30), Erklärkacheln von Zählen und
 * Ziehen und Reihenfolge der Bündel (0.2.31).
 */
import { expect, test } from "@playwright/test";
import { gewaehlteWerkzeuge, oeffneAbbildung, starteImBrowser, waehleWerkzeug } from "./hilfen";

test("ohne Werkzeug zu Beginn; zweites Tippen wählt ab; Erklärkacheln von Zählen und Ziehen", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneAbbildung(page, "1.26", "1.26");
  // Seit 0.2.29 ist zu Beginn kein Werkzeug gewählt; seit 0.2.31 sitzt „Zählen“ am Brett.
  const amBrett = page.getByRole("group", { name: "Werkzeuge am Brett" });
  const zaehlen = amBrett.getByRole("button", { name: "Zählen", exact: true });
  const gedrueckt = gewaehlteWerkzeuge(page);
  await expect(zaehlen).toHaveAttribute("aria-pressed", "false");
  await expect(gedrueckt).toHaveCount(0);
  await expect(page.getByRole("toolbar", { name: "Werkzeuge" })).not.toContainText("Zählen");
  // Ohne Werkzeug bewirkt ein Tipp aufs Brett nichts (0.2.30).
  await page.getByRole("button", { name: "d4, Bauer (Weiß)" }).click();
  await expect(gedrueckt).toHaveCount(0);
  await expect(page.getByTestId("werkzeugkarte")).toHaveCount(0);
  // „Zählen“ wählen: Die Erklärkachel steht sofort da und bleibt, auch nach dem Zählen.
  await zaehlen.click();
  await expect(zaehlen).toHaveAttribute("aria-pressed", "true");
  const erklaerung = page.getByTestId("werkzeug-erklaerung");
  await expect(erklaerung).toContainText("So geht „Zählen“");
  await expect(erklaerung).toContainText("Maßgeblich ist das Buch.");
  await page.getByRole("button", { name: "d4, Bauer (Weiß)" }).click();
  await expect(page.getByTestId("werkzeugkarte")).toContainText("3 gegen 3");
  await expect(erklaerung).toBeVisible();
  // Zweites Tippen wählt ab, bei allen Werkzeugen.
  await zaehlen.click();
  await expect(gedrueckt).toHaveCount(0);
  await expect(erklaerung).toBeHidden();
  // „Ziehen“: ebenso eine Kachel; der Haken blendet sie dauerhaft aus, auch nach dem Neuladen.
  const ziehen = amBrett.getByRole("button", { name: "Ziehen", exact: true });
  await ziehen.click();
  await expect(erklaerung).toContainText("So geht „Ziehen“");
  await erklaerung.getByRole("checkbox", { name: "Nicht mehr anzeigen" }).click();
  await expect(erklaerung).toBeHidden();
  await expect(ziehen).toHaveAttribute("aria-pressed", "true");
  await ziehen.click();
  await expect(gedrueckt).toHaveCount(0);
  await page.reload();
  await oeffneAbbildung(page, "1.26", "1.26");
  await ziehen.click();
  await expect(erklaerung).toBeHidden();
  await zaehlen.click();
  await expect(erklaerung).toContainText("So geht „Zählen“");
  // Die Einstellungen holen die Kachel von „Ziehen“ zurück.
  await page.getByRole("button", { name: "Einstellungen", exact: true }).click();
  await page.getByRole("tab", { name: "Anzeige" }).click();
  await page.getByRole("button", { name: "Wieder anzeigen" }).click();
  await expect(page.getByText("Die Erklärkacheln erscheinen wieder.")).toBeVisible();
  await page.getByRole("button", { name: "Buch", exact: true }).click();
  await oeffneAbbildung(page, "1.26", "1.26");
  await ziehen.click();
  await expect(erklaerung).toContainText("So geht „Ziehen“");
  // Engine: zweites Tippen wählt sie ab.
  const engine = amBrett.getByRole("button", { name: "Engine", exact: true });
  await engine.click();
  await expect(engine).toHaveAttribute("aria-pressed", "true");
  const karte = page.getByTestId("engine-karte");
  await karte.getByRole("button", { name: "So rechnet die Engine" }).click();
  await expect(karte).toContainText("Stockfish");
  await engine.click();
  await expect(karte).toBeHidden();
  await expect(gedrueckt).toHaveCount(0);
  // Röntgen: ebenso; Erklärung und Regel stehen unter „So prüft die App“.
  const roentgen = amBrett.getByRole("button", { name: "Röntgen", exact: true });
  await roentgen.click();
  const werkzeugkarte = page.getByTestId("werkzeugkarte");
  await werkzeugkarte.getByRole("button", { name: "So prüft die App" }).click();
  await expect(werkzeugkarte).toContainText("Die vier Fragen der Schach-Röntgen-Regel");
  await expect(werkzeugkarte).toContainText("Maßgeblich ist das Buch.");
  await roentgen.click();
  await expect(werkzeugkarte).toBeHidden();
  await expect(gedrueckt).toHaveCount(0);
});

test("Sicht-Schalter (0.2.27): rechnet für die andere Seite, nach einem Zug wieder die Seite am Zug", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneAbbildung(page, "1.26", "1.26");
  await waehleWerkzeug(page, "Röntgen");
  const schalter = page.getByTestId("sichtschalter");
  await expect(schalter).toContainText("Sicht: Weiß");
  await expect(schalter).toContainText("am Zug");
  // Der Schalter steht oben rechts auf der Höhe des Werkzeugnamens (0.2.28).
  const name = await page.getByTestId("werkzeugkarte").getByRole("heading").first().boundingBox();
  const knopf = await schalter.boundingBox();
  const nebeneinander =
    name !== null &&
    knopf !== null &&
    knopf.x > name.x &&
    knopf.y < name.y + name.height &&
    knopf.y + knopf.height > name.y;
  expect(nebeneinander).toBe(true);
  await page
    .getByTestId("werkzeugkarte")
    .screenshot({ path: "test-results/bilder/sicht-kopf.png" });
  await schalter.click();
  await expect(schalter).toContainText("Sicht: Schwarz");
  await expect(schalter).toContainText("nicht am Zug");
  await expect(page.getByTestId("werkzeugkarte")).toContainText("1. Schachs: Schwarz");
  await page.getByRole("button", { name: "Einen Halbzug vor" }).click();
  await page.getByRole("button", { name: "Einen Halbzug zurück" }).click();
  await expect(schalter).toContainText("Sicht: Weiß");
});

test("Tipp auf den Hintergrund schaltet das Werkzeug ab (0.2.29: alles außer Inhalten)", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneAbbildung(page, "1.26", "1.26");
  const roentgen = page.getByRole("button", { name: "Röntgen", exact: true });
  const gedrueckt = gewaehlteWerkzeuge(page);
  // Echte Mausklicks an Stellen, die Leser für frei halten (Nachtest 0.2.28).
  const flaechen = [
    page.locator(".am-zug"),
    page.locator(".unterschrift").first(),
    page.locator(".fundstelle"),
  ];
  // Der Titel „Abb. 1.26“ ist seit 0.2.39 ein Knopf (Nummernsprung) und gehört nicht dazu.
  for (const flaeche of flaechen) {
    await roentgen.click();
    await expect(roentgen).toHaveAttribute("aria-pressed", "true");
    // Am linken oberen Rand, damit kein Verweis in der Bildunterschrift getroffen wird.
    await flaeche.click({ position: { x: 2, y: 2 } });
    await expect(gedrueckt).toHaveCount(0);
  }
  // Ein Tipp in die Karte, auf die Werkzeugleiste oder aufs Brett schaltet nichts ab.
  await roentgen.click();
  await page.getByTestId("werkzeugkarte").getByRole("heading").first().click();
  await page.locator(".werkzeugleiste").click({ position: { x: 1, y: 1 } });
  await expect(roentgen).toHaveAttribute("aria-pressed", "true");
  await expect(gedrueckt).toHaveCount(1);
  // Die Fläche neben der App auf breiten Bildschirmen zählt ebenfalls.
  await page.locator("body").evaluate((koerper) => (koerper as HTMLElement).click());
  await expect(gedrueckt).toHaveCount(0);
});

test("Werkzeug-Umbau (0.2.30): Bündel des Kapitels, frühere und spätere, Reiter, Stufen, Legende", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneAbbildung(page, "6.20", "6.20");
  const leiste = page.getByRole("toolbar", { name: "Werkzeuge" });
  // Am Brett: Zählen, Ziehen, Engine, Röntgen und (Kapitel 4 bis 6) die Warnsignale W1–W5.
  const amBrett = page.getByRole("group", { name: "Werkzeuge am Brett" });
  for (const name of ["Zählen", "Ziehen", "Engine", "Röntgen", "Warnsignale", "Brett drehen"]) {
    await expect(amBrett.getByRole("button", { name, exact: true })).toBeVisible();
  }
  // Kapitel 6: nur Planfindung; frühere und spätere auf Wunsch, in der Reihenfolge des Buches.
  await expect(leiste.getByRole("button", { name: "Planfindung" })).toBeVisible();
  await expect(leiste.getByRole("button", { name: "Skelett-Röntgen" })).toHaveCount(0);
  await leiste
    .getByRole("button", { name: "frühere Werkzeuge zeigen (aus früheren Kapiteln)" })
    .click();
  await expect(leiste.getByRole("button", { name: "Skelett-Röntgen" })).toBeVisible();
  await leiste
    .getByRole("button", { name: "spätere Werkzeuge als Vorschau zeigen (aus späteren Kapiteln)" })
    .click();
  await expect(leiste.getByRole("button", { name: /Taktik/ })).toContainText("Kap. 7");
  // Zuschalten ändert die Reihenfolge nicht: alle Bündel nach ihrer Einführung im Buch (0.2.31).
  await expect(leiste.locator(".chip:not(.chip-leise)")).toHaveText([
    "Eröffnung prüfen",
    "Angriffsregel",
    "Fallencheck",
    "Skelett-Röntgen",
    "Planfindung",
    /Taktik/,
    /Endspiel/,
    /Denkroutine/,
  ]);
  // Ein Tipp aufs Bündel öffnet den Reiter des Kapitels, die Reiter in der Reihenfolge des Buches.
  await leiste.getByRole("button", { name: "Planfindung" }).click();
  const reiter = page.getByRole("tablist", { name: "Teile von Planfindung" }).getByRole("tab");
  await expect(reiter).toHaveText(["Wo?", "Angriffsregel", "Gegner?", "LAP", "Planbilanz"]);
  await expect(reiter.first()).toHaveAttribute("aria-selected", "true");
  // Ein Tipp zwischen die Reiter ist kein Tipp auf den Hintergrund.
  await page.locator(".reiterleiste").evaluate((element) => (element as HTMLElement).click());
  await expect(reiter.first()).toHaveAttribute("aria-selected", "true");
  // Seit 0.2.85 zeigt die Karte gleich alles (kein „Mehr …“); Legende der Markierungen immer da.
  await page.getByRole("tab", { name: "Planbilanz" }).click();
  const karte = page.getByTestId("werkzeugkarte");
  await expect(karte).toContainText("Am Brett:");
  await expect(karte).toContainText("Vergleiche deine Planbilanz");
  await expect(karte.getByRole("button", { name: "Mehr …" })).toHaveCount(0);
  await page.screenshot({ path: "test-results/bilder/werkzeug-umbau.png", fullPage: true });
  // Zweites Tippen aufs Bündel wählt ab.
  await leiste.getByRole("button", { name: "Planfindung" }).click();
  await expect(karte).toHaveCount(0);
  await expect(page.getByRole("tablist")).toHaveCount(0);
});
