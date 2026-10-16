/**
 * Oberflächentests der Werkzeuge aus Kapitel 1 bis 5 (AP 8 und AP 9) an Abbildungen des Buches.
 * Jeder Test wählt das Werkzeug wie ein Leser (Symbol am Brett oder Bündel und Reiter, hilfen.ts)
 * und prüft, was die Karte und das Brett zeigen. Dieselben Schritte stehen in
 * docs/TESTANLEITUNG.md.
 */
import { expect, test } from "@playwright/test";
import { oeffneAbbildung, starteImBrowser, waehleWerkzeug } from "./hilfen";

/** Höchstens so lange darf die Engine im Browser für eine Prüfung rechnen. */
const ENGINE_FRIST_MS = 30_000;

test("Werkzeug Röntgen (Abb. 1.23): Schachs, Schläge, Drohungen; als Symbol am Brett ab Kapitel 1", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneAbbildung(page, "1.23", "1.23");
  await waehleWerkzeug(page, "Röntgen");
  const karte = page.getByTestId("werkzeugkarte");
  await expect(karte).toContainText("Schach-Röntgen-Regel für Weiß");
  await expect(karte).toContainText("Sf6+");
  await expect(karte).toContainText("Sxc5: nur Abtausch");
  await page.screenshot({ path: "test-results/bilder/roentgen.png", fullPage: true });
  await page
    .getByRole("navigation", { name: "Hauptbereiche" })
    .getByRole("button", { name: "Buch" })
    .click();
  // Seit 0.2.30 steht Röntgen am Brett, sobald das Buch es eingeführt hat; Warnsignale ab Kap. 4.
  await oeffneAbbildung(page, "2.1", "2.1");
  const symbole = page.getByRole("group", { name: "Werkzeuge am Brett" });
  await expect(symbole.getByRole("button", { name: "Röntgen", exact: true })).toBeVisible();
  await expect(symbole.getByRole("button", { name: "Warnsignale", exact: true })).toHaveCount(0);
});

test("Werkzeug Warnsignale (Abb. 4.11): W5 Lxf3, W3 König e8, Kennungen am Brett", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneAbbildung(page, "4.11", "4.11");
  await waehleWerkzeug(page, "Warnsignale");
  const karte = page.getByTestId("werkzeugkarte");
  await expect(karte).toContainText("Lxf3 (+6)");
  await expect(karte).toContainText("W3 Ohne Luft: König e8");
  await expect(page.locator(".brett svg text", { hasText: "W5" })).toHaveCount(1);
  await page.screenshot({ path: "test-results/bilder/warnsignale.png", fullPage: true });
});

test("Werkzeug Prüffragen (Abb. 4.21): zweite Fesselung nach dem nächsten Buchzug axb4", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneAbbildung(page, "4.21", "4.21");
  await waehleWerkzeug(page, "Prüffragen");
  const karte = page.getByTestId("werkzeugkarte");
  await expect(karte).toContainText("F3 nach axb4: Entsteht eine zweite Fesselung?");
  await expect(karte).toContainText("aufgehoben: Läufer b4 fesselt Springer d2 an König e1");
  await expect(karte).toContainText("Nach axb4 steht eine Fesselung gegen dich");
  // F2: Die Engine zeigt die stärkste Antwort auf axb4, das Matt Sd3#.
  await expect(page.getByTestId("antworten-karte")).toContainText("Sd3#", {
    timeout: ENGINE_FRIST_MS,
  });
  await page.screenshot({ path: "test-results/bilder/prueffragen.png", fullPage: true });
});

test("Werkzeug Zielbilanz (Abb. 2.71): Tabelle wie im Buch, offene Leichtfiguren rot", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneAbbildung(page, "2.71", "2.71");
  await waehleWerkzeug(page, "Zielbilanz");
  const karte = page.getByTestId("werkzeugkarte");
  await expect(karte).toContainText("Entwicklung: teils – Noch auf dem Startfeld: Springer b1");
  await expect(karte).toContainText("Königssicherheit: nein – Der König steht auf e8");
  await page.screenshot({ path: "test-results/bilder/zielbilanz.png", fullPage: true });
});

test("Werkzeug Zielbilanz (Abb. 2.40): e4 ist nur angegriffen, die Engine widerlegt Sxe4", async ({
  page,
}) => {
  test.setTimeout(ENGINE_FRIST_MS * 2);
  await starteImBrowser(page);
  await oeffneAbbildung(page, "2.40", "2.40");
  await waehleWerkzeug(page, "Zielbilanz");
  const karte = page.getByTestId("werkzeugkarte");
  await expect(karte).toContainText("Zentrum: ja – Bauer im Zentrum: e4; e4 ist angegriffen");
  // C1.1: Die Engine rechnet nach, ob 3... Sxe4 den Bauern wirklich gewinnt (4. De2!).
  await expect(page.getByTestId("zentrum-engine")).toContainText(
    "Engine: Sxe4 gewinnt den Bauern e4 nicht: 3... Sxe4 4. De2",
    { timeout: ENGINE_FRIST_MS },
  );
});

test("Werkzeug Faktorenbilanz (Abb. 3.10): Waage bei Material und Zeit", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneAbbildung(page, "3.10", "3.10");
  await waehleWerkzeug(page, "Faktorenbilanz");
  const karte = page.getByTestId("werkzeugkarte");
  await expect(karte.getByRole("img", { name: "Schwarz liegt vorn: +3" })).toBeVisible();
  await expect(karte.getByRole("img", { name: "Weiß liegt vorn: +2 Figuren" })).toBeVisible();
  await expect(karte).toContainText("Weiß: 3 im Spiel (Lc4, Df3 und Tf1)");
  await page.screenshot({ path: "test-results/bilder/faktorenbilanz.png", fullPage: true });
});

test("Werkzeug Angriffsregel (Abb. 1.37): drei Angreifer gegen den Turm f8", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneAbbildung(page, "1.37", "1.37");
  await waehleWerkzeug(page, "Angriffsregel");
  const karte = page.getByTestId("werkzeugkarte");
  await expect(karte).toContainText("Angreifer (3): Sf3, Ld3 und Dd1");
  await expect(karte).toContainText("Die Übermacht steht");
  await page.screenshot({ path: "test-results/bilder/angriffsregel.png", fullPage: true });
});

test("Werkzeug Eröffnung (Abb. 2.2): Spanische Partie, Kurzfassung und Sprung ins Buch", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneAbbildung(page, "2.2", "2.2");
  await waehleWerkzeug(page, "Eröffnung");
  const karte = page.getByTestId("werkzeugkarte");
  await expect(karte).toContainText("Spanische Partie");
  await expect(karte).toContainText("Den ganzen Steckbrief findest du im Buch, Abschnitt 2.2.");
  await expect(karte).not.toContainText("Wer wählt sie?");
  await page.screenshot({ path: "test-results/bilder/eroeffnung.png", fullPage: true });
  await karte.getByRole("button", { name: "Zum Abschnitt im Buch (Abb. 2.1)" }).click();
  await expect(page.getByRole("heading", { name: "Abb. 2.1" })).toBeVisible();
});

test("Werkzeug Eröffnung außerhalb des Buches (Abb. 2.2, 3... g5): Name nach Lichess", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneAbbildung(page, "2.2", "2.2");
  await page.getByRole("button", { name: "Ziehen" }).click();
  await page.getByRole("button", { name: "g7, Bauer (Schwarz)" }).click();
  await page.getByRole("button", { name: "g5", exact: true }).click();
  await expect(page.getByTestId("eigene-zuege")).toContainText("3... g5");
  await waehleWerkzeug(page, "Eröffnung");
  const karte = page.getByTestId("werkzeugkarte");
  await expect(karte).toContainText("Nicht im Buch");
  await expect(karte).toContainText("Bekannt als Spanische Partie: Brentano Gambit (C60).");
});

test("Werkzeug Todsünden (Abb. 1.8): 3... Df6 ist eine mögliche verfrühte Dame", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneAbbildung(page, "1.8", "1.8");
  await waehleWerkzeug(page, "Todsünden");
  const karte = page.getByTestId("werkzeugkarte");
  await expect(karte).toContainText("3... Df6: mögliche verfrühte Dame");
  // Nur Kandidaten (Wunsch des Autors zu C2.3): Der Hinweis steht gut sichtbar oben.
  await expect(karte.getByTestId("werkzeug-hinweis")).toContainText("Nur Kandidaten");
});

test("Werkzeug Falle? (Abb. 4.21): Engine erkennt axb4 als Falle, Verweis auf den Fallencheck", async ({
  page,
}) => {
  test.setTimeout(ENGINE_FRIST_MS * 2);
  await starteImBrowser(page);
  await oeffneAbbildung(page, "4.21", "4.21");
  await waehleWerkzeug(page, "Falle?");
  await expect(page.getByTestId("werkzeugkarte")).toContainText(
    "Vergleiche mit dem Fallencheck „Kieninger-Falle“ im Buch bei Abb. 4.21.",
  );
  const engineKarte = page.getByTestId("falle-karte");
  await expect(engineKarte).toContainText("Falle: Nach axb4 folgt Matt.", {
    timeout: ENGINE_FRIST_MS,
  });
  await page.screenshot({ path: "test-results/bilder/falle.png", fullPage: true });
});

test("Werkzeug Bauern (Abb. 5.17): Isolani d4 mit Kürzel I, drei Bauerninseln", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneAbbildung(page, "5.17", "5.17");
  await waehleWerkzeug(page, "Bauern");
  const karte = page.getByTestId("werkzeugkarte");
  await expect(karte).toContainText("d4: Isolani – keine Nachbarn mehr");
  await expect(karte).toContainText("3 Bauerninseln.");
  await expect(page.locator(".brett svg text", { hasText: "I" })).toHaveCount(1);
  await page.screenshot({ path: "test-results/bilder/bauern.png", fullPage: true });
});

test("Werkzeug Vorher (Abb. 5.3): der nächste Buchzug 3... c5 ist ein Hebel gegen d4", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneAbbildung(page, "5.3", "5.3");
  await waehleWerkzeug(page, "Vorher");
  const karte = page.getByTestId("werkzeugkarte");
  await expect(karte).toContainText("Vorher: c5 (der nächste Zug)");
  await expect(karte).toContainText("Richtung: ja – Hebel gegen d4");
});

test("Werkzeug Richtung (Abb. 5.32): Minderheit am Damenflügel, Hebel b2–…–b5", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneAbbildung(page, "5.32", "5.32");
  await waehleWerkzeug(page, "Richtung");
  const karte = page.getByTestId("werkzeugkarte");
  await expect(karte).toContainText("Minderheit am Damenflügel (2 gegen 3)");
  await expect(karte).toContainText("Hebel b2–…–b5 gegen c6");
  await page.screenshot({ path: "test-results/bilder/richtung.png", fullPage: true });
});
