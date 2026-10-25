/**
 * Oberflächentests für den Durchstich (AP 1) und die Kernoberfläche (AP 5): eine Abbildung vom
 * LaTeX bis offline auf das Handy, Nachspielen, Weiterspielen, Brettknöpfe.
 * Dieselben Schritte prüft der Autor nach docs/TESTANLEITUNG.md von Hand. Die Werkzeuge stehen in
 * werkzeuge-k1-k5.spec.ts und werkzeuge-k6-k12.spec.ts, die Bedienung der Werkzeuge in
 * bedienung.spec.ts (aufgeteilt mit 0.2.30, damit jede Datei unter 400 Zeilen bleibt).
 */
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import {
  oeffneAbbildung,
  oeffneEinstellungen,
  starteImBrowser,
  waehleWerkzeug,
  warteAufOffline,
} from "./hilfen";

/** Höchstens so lange darf die Engine im Browser für eine Bewertung rechnen. */
const ENGINE_FRIST_MS = 30_000;

test("Startseite zeigt Cover, Anleitung und Offline-Fortschritt", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("img", { name: "Buchcover „Schach von Grund auf“" })).toBeVisible();
  await expect(page.getByRole("progressbar")).toBeVisible();
  await page.screenshot({ path: "test-results/bilder/installation.png", fullPage: true });
});

test("Abb. 1.26 öffnen, d4 antippen: drei gegen drei wie im Buch", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneAbbildung(page, "1,26", "1.26");
  await expect(page.getByText("Nach 5... Db6, Weiß am Zug.", { exact: false })).toBeVisible();
  // Seit 0.2.30 zählt ein Tipp aufs Feld nur mit gewähltem „Zählen“.
  await page.getByRole("button", { name: "Zählen" }).click();
  await page.getByRole("button", { name: "d4, Bauer (Weiß)" }).click();
  const karte = page.getByTestId("werkzeugkarte");
  await expect(karte.getByRole("heading", { name: "Feld d4 zählen" })).toBeVisible();
  await expect(karte).toContainText("Dame b6 (Batterie hinter c5)");
  await expect(karte).toContainText("Dame d1 (über die d-Linie)");
  await expect(karte).toContainText("3 gegen 3: Noch geht nichts");
  await page.screenshot({ path: "test-results/bilder/abbildung-1-26-zaehlen.png", fullPage: true });
});

test("Zurück-Taste führt von der Abbildung zum Buch, nicht aus der App", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneAbbildung(page, "1.28", "1.28");
  await page.goBack();
  await expect(page.getByRole("heading", { name: "Buch" })).toBeVisible();
});

test("Weitermachen (V2): nach dem Neuladen wieder auf der Abbildung, Zurück-Taste zum Buch", async ({
  page,
}) => {
  await starteImBrowser(page, { weitermachen: true });
  await oeffneAbbildung(page, "1.28", "1.28");
  await page.reload();
  await expect(page.getByRole("heading", { name: "Abb. 1.28" })).toBeVisible();
  await page.goBack();
  await expect(page.getByRole("heading", { name: "Buch" })).toBeVisible();
  await expect(page).toHaveURL(/\/app\/$/);
});

test("unbekannte Nummer: Meldung und Vorschläge", async ({ page }) => {
  await starteImBrowser(page);
  await page.getByLabel("Abbildung öffnen").fill("1.99");
  await page.getByRole("button", { name: "Öffnen", exact: true }).click();
  await expect(page.getByText("Abbildung 1.99 gibt es nicht.")).toBeVisible();
  await page.getByRole("button", { name: "1.43" }).click();
  await expect(page.getByRole("heading", { name: "Abb. 1.43" })).toBeVisible();
});

test("Engine bewertet Abb. 1.26 auf dem Gerät; Fortsetzung und letzter Zug auf Wunsch", async ({
  page,
}) => {
  test.setTimeout(ENGINE_FRIST_MS * 2);
  await starteImBrowser(page);
  await oeffneAbbildung(page, "1.26", "1.26");
  await page.getByRole("button", { name: "Engine", exact: true }).click();
  await expect(page.getByTestId("engine-messung")).toBeVisible({ timeout: ENGINE_FRIST_MS });
  const karte = page.getByTestId("engine-karte");
  // Seit 0.2.31 steht die beste Fortsetzung erst auf Wunsch da, mit Pfeil am Brett.
  await expect(karte).not.toContainText("Beste Züge");
  await karte.getByRole("button", { name: "Beste Fortsetzung zeigen" }).click();
  await expect(karte).toContainText("6.");
  // Urteil über den letzten Zug 5... Db6, mit Zeichen am Feld b6, falls die Engine eins vergibt.
  await karte.getByRole("button", { name: "Letzten Zug bewerten" }).click();
  await expect(page.getByTestId("engine-urteil")).toContainText("5... Db6", {
    timeout: ENGINE_FRIST_MS,
  });
  await page.screenshot({ path: "test-results/bilder/engine.png", fullPage: true });
});

test("offline: nach dem ersten Laden geht alles ohne Netz", async ({ page, context }) => {
  await starteImBrowser(page);
  await warteAufOffline(page);
  await context.setOffline(true);
  // Auch die Startseite des Buches kommt ohne Netz (Entscheidung 15.10.2026).
  await page.goto("/");
  await expect(page.getByTestId("installationsteil")).toBeVisible();
  await page.goto("/app/");
  await expect(page.getByRole("heading", { name: "Buch" })).toBeVisible();
  await oeffneAbbildung(page, "1.28", "1.28");
  await page.getByRole("button", { name: "Zählen" }).click();
  await page.getByRole("button", { name: "d4, Bauer (Weiß)" }).click();
  await expect(page.getByTestId("werkzeugkarte")).toContainText("2 gegen 1");
  await page.getByRole("button", { name: "Engine", exact: true }).click();
  await expect(page.getByTestId("engine-messung")).toBeVisible({ timeout: 30_000 });
  await context.setOffline(false);
});

test("Einstellungen zeigen App-Version und Datenstand", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneEinstellungen(page);
  await expect(page.getByTestId("app-version")).toHaveText(/^\d+\.\d+\.\d+ \(Beta\)$/);
  await expect(page.getByText("Auflage 1, Datenlauf vom")).toBeVisible();
});

test("Barrierefreiheit: keine schweren Verstöße auf Buch und Abbildung", async ({ page }) => {
  await starteImBrowser(page);
  const buch = await new AxeBuilder({ page }).analyze();
  expect(buch.violations.filter((v) => v.impact === "serious" || v.impact === "critical")).toEqual(
    [],
  );
  await oeffneAbbildung(page, "1.26", "1.26");
  await page.getByRole("button", { name: "Zählen" }).click();
  await page.getByRole("button", { name: "d4, Bauer (Weiß)" }).click();
  const abbildung = await new AxeBuilder({ page }).analyze();
  expect(
    abbildung.violations.filter((v) => v.impact === "serious" || v.impact === "critical"),
  ).toEqual([]);
  // Seit 0.2.30: Bündel mit Reitern, Vorschau späterer Kapitel und Symbole am Brett.
  await page
    .getByRole("button", { name: "spätere Werkzeuge als Vorschau zeigen (aus späteren Kapiteln)" })
    .click();
  await page.getByRole("button", { name: "Eröffnung prüfen" }).click();
  await expect(page.getByRole("tab", { name: "Todsünden" })).toBeVisible();
  const buendel = await new AxeBuilder({ page }).analyze();
  expect(
    buendel.violations.filter((v) => v.impact === "serious" || v.impact === "critical"),
  ).toEqual([]);
});

test("Einstellungen: alle Daten löschen nach Nachfrage", async ({ page }) => {
  await starteImBrowser(page);
  await warteAufOffline(page);
  await oeffneEinstellungen(page);
  await page.getByRole("button", { name: "Alle Daten dieser App löschen" }).click();
  await page.getByRole("button", { name: "Ja, alles löschen" }).click();
  await expect(page.getByText("Alle Daten sind gelöscht.")).toBeVisible();
  const reste = await page.evaluate(async () => ({
    dateien: (await caches.keys()).length,
    worker: (await navigator.serviceWorker.getRegistrations()).length,
    merker: localStorage.length,
  }));
  expect(reste).toEqual({ dateien: 0, worker: 0, merker: 0 });
});

test("Nachspielen: Abb. 1.26 vor und zurück, Sprung zu Abb. 1.28, Abzweigung", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneAbbildung(page, "1.26", "1.26");
  const leiste = page.getByTestId("zugleiste");
  await expect(leiste.locator('[aria-current="step"]')).toHaveText("Db6");
  await page.getByRole("button", { name: "Einen Halbzug vor" }).click();
  await expect(leiste.locator('[aria-current="step"]')).toHaveText("6. Ld3?!");
  await expect(
    page.getByRole("button", { name: "Diese Stellung ist Abb. 1.27 – öffnen" }),
  ).toBeVisible();
  await leiste.getByRole("button", { name: "Abb. 1.28" }).click();
  await expect(leiste.locator('[aria-current="step"]')).toHaveText("7. cxd4");
  await leiste.getByRole("button", { name: "7... Sxd4" }).click();
  await expect(leiste.getByRole("button", { name: "Zurück zur Hauptvariante" })).toBeVisible();
  await page.getByRole("button", { name: "Zum Anfang" }).click();
  await expect(leiste.locator('[aria-current="step"]')).toHaveCount(0);
  await page.screenshot({ path: "test-results/bilder/nachspielen.png", fullPage: true });
});

test("Konstruierte Zugfolge (0.2.96): Abb. 8.25 mit Hinweis, nicht aus dem Buch", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneAbbildung(page, "8.25", "8.25");
  const leiste = page.getByTestId("zugleiste");
  // Die Partie endet an der Abbildung: der letzte Zug ist markiert, die Grundstellung ist der Anfang.
  await expect(leiste.locator('[aria-current="step"]')).toBeVisible();
  await expect(page.getByTestId("zugfolge-konstruiert")).toContainText(
    "Zugfolge von einer KI konstruiert, nicht aus dem Buch",
  );
  await page.screenshot({ path: "test-results/bilder/konstruiert.png", fullPage: true });
  await page.getByRole("button", { name: "Zum Anfang" }).click();
  await expect(leiste.locator('[aria-current="step"]')).toHaveCount(0);
});

test("Weiterspielen: eigener Zug, zurück zur Buchvariante, Buchzug trifft das Buch", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneAbbildung(page, "1.26", "1.26");
  // Pfeilspitzen des Buches: beim Ziehen ausgeblendet, damit die Zielpunkte frei bleiben.
  const pfeilspitzen = page.locator(".brettbereich .brett svg polygon");
  await expect(pfeilspitzen).not.toHaveCount(0);
  await page.getByRole("button", { name: "Ziehen" }).click();
  await expect(pfeilspitzen).toHaveCount(0);
  await page.getByRole("button", { name: "f3, Springer (Weiß)" }).click();
  await page.getByRole("button", { name: "g5", exact: true }).click();
  const eigene = page.getByTestId("eigene-zuege");
  await expect(eigene).toContainText("6. Sg5");
  await page.getByRole("button", { name: "Zurück zur Buchvariante" }).click();
  await expect(eigene).toBeHidden();
  await page.getByRole("button", { name: "f1, Läufer (Weiß)" }).click();
  await page.getByRole("button", { name: "d3", exact: true }).click();
  await expect(page.getByTestId("zugleiste").locator('[aria-current="step"]')).toHaveText(
    "6. Ld3?!",
  );
  await expect(eigene).toBeHidden();
});

test("Rochade über das Zielfeld des Königs (Abb. 0.12), wie bei Chess.com", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneAbbildung(page, "0.12", "0.12");
  await page.getByRole("button", { name: "Ziehen" }).click();
  await page.getByRole("button", { name: "e1, König (Weiß)" }).click();
  await page.getByRole("button", { name: "g1", exact: true }).click();
  await expect(page.getByRole("button", { name: "g1, König (Weiß)" })).toBeVisible();
  await expect(page.getByRole("button", { name: "f1, Turm (Weiß)" })).toBeVisible();
});

test("Brett drehen; Koordinaten in den Einstellungen; Skelett-Ansicht im Bündel Skelett-Röntgen (0.2.30)", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneEinstellungen(page);
  await page.getByRole("tab", { name: "Brett" }).click();
  await page.getByRole("radio", { name: "ausblenden" }).click();
  await page.getByRole("button", { name: "Buch", exact: true }).click();
  await oeffneAbbildung(page, "5.17", "5.17");
  const drehen = page.getByRole("button", { name: "Brett drehen" });
  await drehen.click();
  await expect(drehen).toHaveAttribute("aria-pressed", "true");
  const beschriftung = page.locator(".brettbereich .brett svg text");
  await expect(beschriftung.filter({ hasText: /^a$/ })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Koordinaten zeigen" })).toHaveCount(0);
  // Die Kürzel der schwachen Bauern sind Text am Brett; die Skelett-Ansicht blendet sie aus.
  await waehleWerkzeug(page, "Bauern");
  await expect(beschriftung).not.toHaveCount(0);
  const skelett = page.getByRole("button", { name: "Skelett zeigen" });
  await skelett.click();
  await expect(skelett).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("Skelett-Ansicht: Die übrigen Figuren")).toBeVisible();
  await expect(beschriftung).toHaveCount(0);
  await page.screenshot({ path: "test-results/bilder/brettknoepfe.png", fullPage: true });
  // Abwählen des Bündels schaltet auch die Skelett-Ansicht ab.
  await page.getByRole("button", { name: "Skelett-Röntgen", exact: true }).click();
  await expect(page.getByText("Skelett-Ansicht: Die übrigen Figuren")).toHaveCount(0);
});

test("Nachtmodus in den Einstellungen: an, aus, wie das Gerät, auch nach dem Neuladen (0.2.31)", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneEinstellungen(page);
  await page.getByRole("tab", { name: "Anzeige" }).click();
  const nacht = page.getByRole("radiogroup", { name: "Nachtmodus" });
  const wurzel = page.locator("html");
  await nacht.getByRole("radio", { name: "an" }).click();
  await expect(wurzel).toHaveAttribute("data-farbschema", "dunkel");
  const grund = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(await grund()).toBe("rgb(15, 27, 46)");
  await page.reload();
  await expect(wurzel).toHaveAttribute("data-farbschema", "dunkel");
  await oeffneEinstellungen(page);
  await page.getByRole("tab", { name: "Anzeige" }).click();
  await nacht.getByRole("radio", { name: "aus" }).click();
  await expect(wurzel).toHaveAttribute("data-farbschema", "hell");
  expect(await grund()).toBe("rgb(245, 240, 230)");
  await nacht.getByRole("radio", { name: "wie das Gerät" }).click();
  await expect(wurzel).not.toHaveAttribute("data-farbschema", /.*/);
});

test("Nummernsprung (0.2.39): ein Tipp auf den Titel öffnet das Nummernfeld, „1.28“ wechselt die Abbildung", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneAbbildung(page, "1.26", "1.26");
  await page.getByRole("button", { name: /^Abb\. 1\.26\./ }).click();
  const feld = page.getByTestId("nummernsprung");
  await feld.getByRole("textbox").fill("1.99");
  await feld.getByRole("button", { name: "Öffnen" }).click();
  await expect(feld).toContainText("Abbildung 1.99 gibt es nicht.");
  await feld.getByRole("textbox").fill("1,28");
  await feld.getByRole("button", { name: "Öffnen" }).click();
  await expect(page.getByRole("button", { name: /^Abb\. 1\.28\./ })).toBeVisible();
  await expect(page.getByTestId("nummernsprung")).toHaveCount(0);
  // „Zurück“ führt dorthin, woher Abb. 1.26 kam (Buch), nicht zu Abb. 1.26: Die Nummer ersetzt die Ansicht.
  await page.locator(".kopfzeile").getByRole("button", { name: "Zurück", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Buch" })).toBeVisible();
});

test("Figurensatz und Ton in den Einstellungen (0.2.33): klassische Figuren am Brett", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneEinstellungen(page);
  // „Erst selbst denken“ ist seit 0.2.37 wieder da (wirkt bei den Übungen, AP 13); seit 0.2.80
  // stehen die Bereiche der Darstellung auf Reitern.
  await page.getByRole("tab", { name: "Training" }).click();
  await expect(page.getByRole("radiogroup", { name: "Erst selbst denken" })).toHaveCount(1);
  await page.getByRole("tab", { name: "Brett" }).click();
  await page
    .getByRole("radiogroup", { name: "Figurensatz" })
    .getByRole("radio", { name: "Chessnut" })
    .click();
  await page.getByRole("tab", { name: "Bedienung" }).click();
  const ton = page.getByRole("radiogroup", { name: "Ton" });
  await ton.getByRole("radio", { name: "an" }).click();
  await expect(ton.getByRole("radio", { name: "an" })).toBeChecked();
  await page.getByRole("button", { name: "Buch" }).click();
  await oeffneAbbildung(page, "1.26", "1.26");
  // Seit 0.2.82 neun Bildsätze; Chessnut steht in der Gruppe „Klassisch“.
  const bilder = page.locator(".brettbereich .brett svg image[href$='klassisch-chessnut/wK.svg']");
  await expect(bilder).toHaveCount(1);
  // Ein Zug mit Ton an läuft ohne Fehler (der Ton selbst ist im Test nicht hörbar).
  await page.getByRole("button", { name: "Ziehen" }).click();
  await page.getByRole("button", { name: "f3, Springer (Weiß)" }).click();
  await page.getByRole("button", { name: "g5", exact: true }).click();
  await expect(page.getByTestId("eigene-zuege")).toContainText("6. Sg5");
});
