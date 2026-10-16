/**
 * Oberflächentests der Werkzeuge aus Kapitel 6 bis 12 (AP 9 und AP 10) an Abbildungen und Übungen
 * des Buches. Jeder Test wählt das Werkzeug wie ein Leser (hilfen.ts) und prüft Karte und Brett;
 * Engine-Werkzeuge bekommen mehr Zeit. Dieselben Schritte stehen in docs/TESTANLEITUNG.md.
 */
import { expect, test } from "@playwright/test";
import { oeffneAbbildung, starteImBrowser, waehleWerkzeug } from "./hilfen";

/** Höchstens so lange darf die Engine im Browser für eine Prüfung rechnen. */
const ENGINE_FRIST_MS = 30_000;

test("Werkzeug Wo? (Abb. 6.6): Weiß stürmt in zwei Zügen, Schwarz in drei", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneAbbildung(page, "6.6", "6.6");
  await waehleWerkzeug(page, "Wo?");
  const karte = page.getByTestId("werkzeugkarte");
  await expect(karte).toContainText("Du: h2–h5 in 2 Zügen gegen g6");
  await expect(karte).toContainText("Gegner: a7–a3 in 3 Zügen gegen b2");
  await page.screenshot({ path: "test-results/bilder/wo.png", fullPage: true });
});

test("Werkzeug LAP (Abb. 6.20): der Läufer c1 steht noch zu Hause und gehört nach e3", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneAbbildung(page, "6.20", "6.20");
  await waehleWerkzeug(page, "LAP");
  const karte = page.getByTestId("werkzeugkarte");
  await expect(karte).toContainText(
    "Läufer c1: 5 freie Felder (d2, e3, f4, g5 und h6), noch zu Hause",
  );
  await expect(karte).toContainText("Verbessere Läufer c1: nach e3.");
});

test("Werkzeug Planbilanz (Abb. 6.20): beide Seiten und der Verweis aufs Buch", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneAbbildung(page, "6.20", "6.20");
  await waehleWerkzeug(page, "Planbilanz");
  const karte = page.getByTestId("werkzeugkarte");
  await expect(karte).toContainText("Schwarz: Am Königsflügel: Die Kette d6–e5 zeigt dorthin");
  await expect(karte).toContainText("Vergleiche deine Planbilanz mit der Planbilanz im Buch");
  await page.screenshot({ path: "test-results/bilder/planbilanz.png", fullPage: true });
});

test("Werkzeug Gegner? (Abb. 6.13): die Engine sieht Lxh7+ und sucht den Vorbeugezug", async ({
  page,
}) => {
  test.setTimeout(ENGINE_FRIST_MS * 2);
  await starteImBrowser(page);
  await oeffneAbbildung(page, "6.13", "6.13");
  await waehleWerkzeug(page, "Gegner?");
  await expect(page.getByTestId("werkzeugkarte")).toContainText("Sichern: e6 und h7");
  // Seit 0.2.32 in derselben Karte (Vorschlag D4): Plan des Gegners und Vorbeugezug.
  const karte = page.getByTestId("werkzeugkarte").getByTestId("gegner-karte");
  await expect(karte).toContainText("Was Weiß vorhat (Engine)");
  await expect(karte).toContainText("Lxh7+", { timeout: ENGINE_FRIST_MS });
  await expect(karte).toContainText("Vorbeugen: der Zug für Schwarz (Engine)", {
    timeout: ENGINE_FRIST_MS,
  });
  await expect(karte).toContainText(/verhindert den Plan|keinen, nach dem Weiß/, {
    timeout: ENGINE_FRIST_MS,
  });
  await page.screenshot({ path: "test-results/bilder/gegner.png", fullPage: true });
});

test("Werkzeug W1–W7 (Abb. 7.18): Gabelgeometrie des Springers d5 und Kennungen am Brett", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneAbbildung(page, "7.18", "7.18");
  await waehleWerkzeug(page, "W1–W7");
  const karte = page.getByTestId("werkzeugkarte");
  await expect(karte).toContainText("W6 Gabelgeometrie: Springer d5 nach e7 trifft c8 und g8");
  await expect(karte).toContainText("W6: Gabel, Hinlenkung");
  await expect(page.locator(".brett svg text", { hasText: "W6" }).first()).toBeVisible();
  await page.screenshot({ path: "test-results/bilder/warnsignale7.png", fullPage: true });
});

test("Werkzeug Erzwingende Züge (Abb. 7.14): Kandidaten mit Kürzel, die Engine rechnet jeden bis zur Ruhe", async ({
  page,
}) => {
  test.setTimeout(ENGINE_FRIST_MS * 2);
  await starteImBrowser(page);
  await oeffneAbbildung(page, "7.14", "7.14");
  await waehleWerkzeug(page, "Erzwingende Züge");
  const karte = page.getByTestId("werkzeugkarte");
  await expect(karte).toContainText("1. Te8+");
  await expect(karte).toContainText("2. Th8+");
  await expect(page.locator(".brett svg text", { hasText: "2+" }).first()).toBeVisible();
  // Seit 0.2.33 (Vorschlag B1): jeder Kandidat bis zur Ruhe, der stärkste mit „!“ am Brett.
  const engine = karte.getByTestId("erzwingend-karte");
  await expect(engine).toContainText("Bis zur Ruhe gerechnet (Engine)");
  await expect(engine).toContainText("2. Th8+ Kxh8 Sxf7+", { timeout: ENGINE_FRIST_MS });
  await expect(engine).toContainText("gewinnt die Dame");
  await expect(engine).toContainText("Am stärksten: 2. Th8+", { timeout: ENGINE_FRIST_MS });
  await expect(page.locator(".brett svg text", { hasText: "2+!" }).first()).toBeVisible();
  await page.screenshot({ path: "test-results/bilder/erzwingend.png", fullPage: true });
});

test("Werkzeug Motiv (Übung an Abb. 7.46): Ablenkung, Grundreihenmatt, Motiv laut Buch", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneAbbildung(page, "7.46", "7.46");
  await waehleWerkzeug(page, "Motiv");
  const karte = page.getByTestId("werkzeugkarte");
  await expect(karte).toContainText("Ablenkung:");
  await expect(karte).toContainText("Mattbild: Grundreihenmatt");
  await expect(karte).toContainText("Motiv: Damenopfer und Grundreihenmatt");
  await page.screenshot({ path: "test-results/bilder/motiv.png", fullPage: true });
});

test("Werkzeug Ruhe (Abb. 7.14): die Engine rechnet Th8+ bis zur Ruhe", async ({ page }) => {
  test.setTimeout(ENGINE_FRIST_MS * 2);
  await starteImBrowser(page);
  await oeffneAbbildung(page, "7.14", "7.14");
  await waehleWerkzeug(page, "Ruhe");
  await expect(page.getByTestId("werkzeugkarte")).toContainText("Die vier Prüfpunkte");
  const karte = page.getByTestId("ruhe-karte");
  await expect(karte).toContainText("Schritt 1: 1. Th8+", { timeout: ENGINE_FRIST_MS });
  await expect(karte).toContainText("Bilanz: vorher 0");
  await page.screenshot({ path: "test-results/bilder/ruhe.png", fullPage: true });
});

test("Werkzeug Opposition (Abb. 8.19): Schwarz hat sie, e5 grau", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneAbbildung(page, "8.19", "8.19");
  await waehleWerkzeug(page, "Opposition");
  const karte = page.getByTestId("werkzeugkarte");
  await expect(karte).toContainText("Die Opposition hat Schwarz");
  await expect(karte).toContainText("Kein Königszug nimmt jetzt die Opposition");
});

test("Werkzeug Elementarmatt (Abb. 8.6): Dg7# gold, Df7 als Pattfalle rot", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneAbbildung(page, "8.6", "8.6");
  await waehleWerkzeug(page, "Elementarmatt");
  const karte = page.getByTestId("werkzeugkarte");
  await expect(karte).toContainText("Matt: Dg7# (gold).");
  await expect(karte).toContainText("Vorsicht, Patt: Df7 (rot).");
  await page.screenshot({ path: "test-results/bilder/elementarmatt.png", fullPage: true });
});

test("Werkzeug Quadrat (Abb. 8.35): der König g5 erreicht das Quadrat nicht", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneAbbildung(page, "8.35", "8.35");
  await waehleWerkzeug(page, "Quadrat");
  const karte = page.getByTestId("werkzeugkarte");
  // Wie im Buch am Bauern gezeichnet; nach dem Bauernzug schrumpft es auf b5–e8 (0.2.27).
  await expect(karte).toContainText("Das Quadrat reicht von b4 bis f8 (grau).");
  await expect(karte).toContainText("schrumpft das Quadrat auf b5–e8");
  await expect(karte).toContainText("Der Bauer b4 läuft durch");
});

test("Werkzeug Quadrat (Abb. 8.46, C1.22): Nach dem Buchzug a6 läuft der a-Bauer durch", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneAbbildung(page, "8.46", "8.46");
  await waehleWerkzeug(page, "Quadrat");
  const karte = page.getByTestId("werkzeugkarte");
  await expect(karte).toContainText("Nach a6 läuft der Bauer a6 durch");
});

test("Werkzeug Opposition (Abb. 8.36, C1.19): Hier entscheidet das Quadrat", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneAbbildung(page, "8.36", "8.36");
  await waehleWerkzeug(page, "Opposition");
  const karte = page.getByTestId("werkzeugkarte");
  await expect(karte).toContainText("Hier entscheidet nicht die Opposition, sondern das Quadrat");
  await expect(karte).not.toContainText("Kh5 nimmt");
});

test("Werkzeug Turmendspiel (Abb. 9.2): kurze Seite, Schachdistanz vier Linien", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneAbbildung(page, "9.2", "9.2");
  await waehleWerkzeug(page, "Turmendspiel");
  const karte = page.getByTestId("werkzeugkarte");
  await expect(karte).toContainText("Der König g8 steht auf der kurzen Seite (richtig).");
  await expect(karte).toContainText("Zwischen dem Turm a6 und dem Bauern f5: 4 Linien");
});

test("Werkzeug Erkennungsbild (Abb. 9.8): Lucena mit Brückenbau", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneAbbildung(page, "9.8", "9.8");
  await waehleWerkzeug(page, "Erkennungsbild");
  const karte = page.getByTestId("werkzeugkarte");
  await expect(karte).toContainText("Lucena-Stellung (Plan für Weiß)");
  await expect(karte).toContainText("Brückenbau");
  await page.screenshot({ path: "test-results/bilder/erkennungsbild.png", fullPage: true });
});

test("Werkzeug Phase (Übung 12.6): Endspiel, die Werkzeuge aus Kapitel 8", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneAbbildung(page, "12.6", "12.6");
  await waehleWerkzeug(page, "Phase");
  const karte = page.getByTestId("werkzeugkarte");
  await expect(karte).toContainText("Endspiel: Die vier Prüffragen ergeben überwiegend Ja.");
  await expect(karte).toContainText("Die sechs Endspielregeln (Kapitel 8)");
});

test("Werkzeug Erfassen (Abb. 12.2): letzter Zug Sg5+, im Schach", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneAbbildung(page, "12.2", "12.2");
  await waehleWerkzeug(page, "Erfassen");
  const karte = page.getByTestId("werkzeugkarte");
  await expect(karte).toContainText("Letzter Zug von Weiß: Sg5+.");
  await expect(karte).toContainText("Du stehst im Schach: Erst das Schach abwehren.");
});

test("Werkzeug Kandidaten (Abb. 12.1): 1. Lxh7+ zuerst, stärkste Antwort Kxh7", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneAbbildung(page, "12.1", "12.1");
  await waehleWerkzeug(page, "Kandidaten");
  const karte = page.getByTestId("werkzeugkarte");
  await expect(karte).toContainText("1. Lxh7+ (Schach)");
  await expect(karte).toContainText("Auf Lxh7+: Kxh7 (Schlag mit Gewinn)");
  await page.screenshot({ path: "test-results/bilder/denkroutine.png", fullPage: true });
});

test("Werkzeug Kandidaten (Abb. 12.3, im Schach): Abwehrzüge, auf f5 folgt Sxe6", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneAbbildung(page, "12.3", "12.3");
  await waehleWerkzeug(page, "Kandidaten");
  const karte = page.getByTestId("werkzeugkarte");
  await expect(karte).toContainText("1. f5 (Abwehr: dazwischenstellen, der Buchzug)");
  await expect(karte).toContainText("Schwarz steht im Schach: 4 Abwehrzüge als Kandidaten.");
  await expect(karte).toContainText(
    "Auf f5: Sxe6 (Schlag mit Gewinn), danach Gabel gegen Dame c7 und Turm f8",
  );
});

test("Werkzeug Sicherheitsblick (Übung 12.6, Buchzug g3): gedeckt, nichts zu beanstanden", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneAbbildung(page, "12.6", "12.6");
  await waehleWerkzeug(page, "Sicherheitsblick");
  const karte = page.getByTestId("werkzeugkarte");
  await expect(karte).toContainText("Sicherheitsblick: g3");
  await expect(karte).toContainText("g3: Der Sicherheitsblick ergibt nichts.");
});
