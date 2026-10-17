/**
 * Oberflächentests für das Spiel gegen die Engine (AP 11): Partie beginnen, ziehen, Antwort der
 * Engine, Rücknahme, Fortsetzen nach dem Neuladen, Start an einer Abbildung mit Schwarz,
 * ein Zug, der ein Matt erlaubt, wird ohne Rückfrage gespielt (seit 0.2.32), Ergebnis und
 * Rücknahme nach dem Matt.
 */
import { expect, type Page } from "@playwright/test";
import { test } from "@playwright/test";
import { oeffneAbbildung, starteImBrowser } from "./hilfen";

/** Die Engine rechnet im Browser; der erste Start lädt die WASM-Datei. */
const ENGINE_FRIST = 30_000;

async function ziehe(seite: Page, von: RegExp, nach: string): Promise<void> {
  await seite.getByRole("button", { name: von }).click();
  await seite.getByRole("button", { name: nach, exact: true }).click();
}

async function warteAufLeser(seite: Page): Promise<void> {
  await expect(seite.getByTestId("partiestatus")).toHaveText("Du bist am Zug.", {
    timeout: ENGINE_FRIST,
  });
}

test("Partie aus der Grundstellung: Engine antwortet, Rücknahme, Fortsetzen nach Neuladen", async ({
  page,
}) => {
  await starteImBrowser(page);
  await page.getByRole("navigation").getByRole("button", { name: "Spielen" }).click();
  await expect(page.getByRole("heading", { name: "Spielen" })).toBeVisible();
  await page.getByRole("radio", { name: "5 + 3" }).click();
  // Gewertete Partien haben keine Rücknahme (S9); ungewertet ist sie da.
  await page.getByRole("checkbox", { name: /Gewertete Partie/ }).uncheck();
  await page.getByRole("button", { name: "Partie beginnen" }).click();
  await expect(page.getByRole("heading", { name: "Partie gegen die Engine" })).toBeVisible();
  await expect(page.getByText("Stufe 1 · Einsteiger · du spielst Weiß")).toBeVisible();
  await expect(page.getByTestId("uhr-white")).toContainText("5:00");
  await ziehe(page, /^e2, Bauer/, "e4");
  await expect(page.getByTestId("partiezuege")).toContainText("1. e4");
  await warteAufLeser(page);
  await expect(page.getByTestId("partiezuege").getByRole("button")).toHaveCount(2);
  await page.getByRole("button", { name: "Zurücknehmen" }).click();
  await expect(page.getByTestId("partiezuege")).toHaveText("Noch keine Züge.");
  await ziehe(page, /^d2, Bauer/, "d4");
  await warteAufLeser(page);
  await page.screenshot({ path: "test-results/bilder/partie.png", fullPage: true });
  await page.reload();
  await page.getByRole("navigation").getByRole("button", { name: "Spielen" }).click();
  await expect(page.getByTestId("laufende-partie")).toBeVisible();
  await page.getByRole("button", { name: "Weiterspielen" }).click();
  await expect(page.getByTestId("partiezuege")).toContainText("1. d4");
  await expect(page.getByTestId("partiezuege").getByRole("button")).toHaveCount(2);
});

test("Abb. 1.26: gegen die Engine mit Schwarz, ruhige Ansicht, Aufgeben", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneAbbildung(page, "1.26", "1.26");
  await page.getByRole("button", { name: "Gegen die Engine spielen" }).click();
  await expect(page.getByRole("heading", { name: "Aus der Stellung von Abb. 1.26" })).toBeVisible();
  await page.getByRole("radio", { name: "Schwarz" }).click();
  await page.getByRole("button", { name: "Partie beginnen" }).click();
  await warteAufLeser(page);
  await expect(page.getByTestId("partiezuege")).toContainText("6.");
  await page.getByRole("button", { name: "Ruhige Ansicht" }).click();
  await expect(page.getByRole("button", { name: "Aufgeben" })).toHaveCount(0);
  await expect(page.getByTestId("spielhinweis")).toHaveCount(0);
  await page.getByRole("button", { name: "Ruhige Ansicht" }).click();
  await page.getByRole("button", { name: "Aufgeben" }).click();
  await page.getByRole("button", { name: "Ja, aufgeben" }).click();
  await expect(page.getByTestId("partieende")).toContainText("Du hast aufgegeben.");
  await page.getByRole("navigation").getByRole("button", { name: "Spielen" }).click();
  await expect(page.getByText("Deine letzten Partien")).toBeVisible();
  await expect(page.getByTestId("laufende-partie")).toHaveCount(0);
});

test("2. g4?? erlaubt Matt ohne Rückfrage, Auswertung, nach dem Matt zurücknehmen", async ({
  page,
}) => {
  await starteImBrowser(page);
  await page.getByRole("navigation").getByRole("button", { name: "Spielen" }).click();
  await page.getByText("Eigene Stellung eingeben (FEN)").click();
  await page
    .getByLabel("Stellung als FEN")
    .fill("rnbqkbnr/pppp1ppp/8/4p3/8/5P2/PPPPP1PP/RNBQKBNR w KQkq - 0 2");
  await page.getByRole("button", { name: "Stellung übernehmen" }).click();
  // Seit 0.2.40 drei Regler je Phase: alle auf Stufe 8 (Experte).
  for (const phase of ["Eröffnung", "Mittelspiel", "Endspiel"]) {
    await page.getByLabel(new RegExp(`^${phase}:`)).fill("8");
  }
  await expect(page.getByLabel(/^Mittelspiel:/)).toHaveValue("8");
  await page.getByRole("button", { name: "Partie beginnen" }).click();
  // Seit 0.2.32 ohne Rückfrage (Wunsch des Autors): Der Zug wird sofort gespielt.
  await ziehe(page, /^g2, Bauer/, "g4");
  await expect(page.getByTestId("partieende")).toContainText("Matt. Die Engine hat gewonnen.", {
    timeout: ENGINE_FRIST,
  });
  const auswertung = page.getByTestId("auswertung");
  await expect(auswertung).toContainText("Erste klare Abweichung: 2. g4??", {
    timeout: ENGINE_FRIST,
  });
  await expect(page.getByTestId("partiezuege")).toContainText("2. g4??");
  // Rückblick (Vorschlag H, 0.2.38): Kurve über der Auswertung, Balken links am Brett. Nach
  // 2. g4?? setzt Schwarz matt: Der Balken zeigt „−M“.
  await expect(page.getByTestId("verlaufskurve")).toBeVisible();
  await page.getByRole("button", { name: "2. g4??" }).click();
  await expect(page.getByTestId("bewertungsbalken")).toHaveAttribute("aria-label", /−M/);
  // Seit 0.2.39: Karte zum Zug unter dem Brett (Urteil, besserer Zug) und die Spielstärke.
  const karte = page.getByTestId("rueckblickkarte");
  await expect(karte).toContainText("2. g4?? kostet etwa");
  await expect(karte).toContainText("Besser war 2.");
  await expect(page.getByTestId("spielstaerke")).toContainText("Genauigkeit");
  await page.screenshot({ path: "test-results/bilder/rueckblick.png", fullPage: true });
  await auswertung.getByRole("button", { name: "Zur Stellung" }).click();
  await expect(page.getByRole("button", { name: "2. g4??" })).not.toHaveAttribute("aria-current");
  await auswertung.getByRole("button", { name: "PGN kopieren" }).click();
  await expect(auswertung).toContainText(/PGN/);
  await page.screenshot({ path: "test-results/bilder/auswertung.png", fullPage: true });
  await page.getByRole("button", { name: "Zurücknehmen" }).click();
  await expect(page.getByTestId("partieende")).toHaveCount(0);
  await expect(page.getByTestId("partiezuege")).toHaveText("Noch keine Züge.");
});

test("Werkzeuge in der Partie (0.2.33): Röntgen, W1–W7, Zählen am Brett, Bündel, Ziehen bleibt", async ({
  page,
}) => {
  await starteImBrowser(page);
  await page.getByRole("navigation").getByRole("button", { name: "Spielen" }).click();
  await page.getByRole("checkbox", { name: /Gewertete Partie/ }).uncheck();
  await page.getByRole("button", { name: "Partie beginnen" }).click();
  const werkzeuge = page.getByRole("group", { name: "Werkzeuge am Brett" });
  await werkzeuge.getByRole("button", { name: "Röntgen" }).click();
  await expect(page.getByTestId("werkzeugkarte")).toBeVisible();
  // Röntgen zeigt nur an: Der Zug geht weiter.
  await ziehe(page, /^e2, Bauer/, "e4");
  await warteAufLeser(page);
  await werkzeuge.getByRole("button", { name: "W1–W7" }).click();
  await expect(page.getByTestId("werkzeugkarte")).toBeVisible();
  // Zählen: Ein Tipp zählt das Feld, statt zu ziehen.
  await werkzeuge.getByRole("button", { name: "Zählen" }).click();
  await expect(page.getByText("Tippe ein Feld an")).toBeVisible();
  await page.getByRole("button", { name: /^e4, Bauer/ }).click();
  await expect(page.getByTestId("werkzeugkarte")).toBeVisible();
  await expect(page.getByTestId("partiezuege").getByRole("button")).toHaveCount(2);
  // Abwählen: wieder ziehen.
  await werkzeuge.getByRole("button", { name: "Zählen" }).click();
  await expect(page.getByTestId("werkzeugkarte")).toHaveCount(0);
  // Bündel unter dem Brett, mit Reitern; sie zeigen nur an, gezogen wird weiter.
  await page.getByRole("toolbar").getByRole("button", { name: "Denkroutine" }).click();
  await page.getByRole("tab", { name: "Phase" }).click();
  await expect(page.getByTestId("werkzeugkarte")).toContainText("Eröffnung");
  await ziehe(page, /^d2, Bauer/, "d4");
  await expect(page.getByTestId("partiezuege")).toContainText("2. d4");
});

// 0.2.41: Stellung aufbauen, Mensch gegen Mensch, Spielhilfen abgeschaltet, Ergebnis in der Liste.
test("Stellung aufbauen (K e6, D a3 gegen K e8), zu zweit ohne Werkzeuge spielen, 1. De7 matt", async ({
  page,
}) => {
  await starteImBrowser(page);
  await page.getByRole("navigation").getByRole("button", { name: "Spielen" }).click();
  await page.getByRole("button", { name: "Stellung aufbauen" }).click();
  const editor = page.getByTestId("stellungseditor");
  await editor.getByRole("button", { name: "Brett leeren" }).click();
  await expect(editor.getByRole("button", { name: "Stellung übernehmen" })).toBeDisabled();
  await editor.getByRole("radio", { name: "König (Weiß)" }).click();
  await editor.getByRole("button", { name: "e6", exact: true }).click();
  await editor.getByRole("radio", { name: "Dame (Weiß)" }).click();
  await editor.getByRole("button", { name: "a3", exact: true }).click();
  await editor.getByRole("radio", { name: "König (Schwarz)" }).click();
  await editor.getByRole("button", { name: "e8", exact: true }).click();
  await expect(editor.getByRole("button", { name: "e8, König (Schwarz)" })).toBeVisible();
  await editor.getByRole("button", { name: "Stellung übernehmen" }).click();
  await expect(page.getByRole("heading", { name: "Aus einer eigenen Stellung" })).toBeVisible();
  await page.getByRole("radio", { name: "Mensch (beide Seiten selbst)" }).click();
  await page.getByRole("checkbox", { name: /Werkzeuge und Hinweis/ }).uncheck();
  await page.getByRole("button", { name: "Partie beginnen" }).click();
  await expect(page.getByRole("heading", { name: "Partie zu zweit" })).toBeVisible();
  await expect(page.getByTestId("partiestatus")).toHaveText("Weiß am Zug.");
  await expect(page.getByTestId("spielhinweis")).toHaveCount(0);
  await ziehe(page, /^a3,/, "e7");
  await expect(page.getByTestId("partieende")).toContainText("Matt! Weiß hat gewonnen.");
  await page.locator(".kopfzeile").getByRole("button", { name: "Spielen", exact: true }).click();
  await expect(page.getByTestId("spielen")).toContainText("1–0");
});

// 0.2.42: eigene Gegner anlegen, wählen, im Untertitel sehen, löschen.
test("Eigener Gegner „Rambo“ (sehr aggressiv, ohne Fehlerarten): anlegen, spielen, löschen", async ({
  page,
}) => {
  await starteImBrowser(page);
  await page.getByRole("navigation").getByRole("button", { name: "Spielen" }).click();
  const karte = page.getByTestId("eigene-gegner");
  await karte.getByRole("button", { name: "Neuen Gegner anlegen" }).click();
  await page.getByLabel("Name").fill("Rambo");
  await page.getByLabel(/^Spielstil/).fill("2");
  await expect(page.getByLabel(/^Spielstil/)).toHaveValue("2");
  await page.getByRole("checkbox", { name: "eine Figur hängen lassen (W1)" }).uncheck();
  await karte.getByRole("button", { name: "Gegner speichern" }).click();
  await expect(karte).toContainText("Rambo · 3 · 3 · 3 · sehr aggressiv");
  await page.getByRole("radio", { name: "Rambo" }).click();
  await expect(page.getByTestId("gegner-sprechblase")).toContainText("Rambo");
  await page.getByRole("button", { name: "Partie beginnen" }).click();
  await expect(page.locator(".partie-untertitel")).toContainText("Rambo");
  await ziehe(page, /^e2,/, "e4");
  await warteAufLeser(page);
  await page.locator(".kopfzeile").getByRole("button", { name: "Spielen", exact: true }).click();
  await expect(page.getByTestId("spielen")).toContainText("Rambo");
  await page.getByRole("button", { name: "Rambo löschen" }).click();
  await page.getByRole("button", { name: "Ja, löschen" }).click();
  await expect(page.getByTestId("eigene-gegner")).toContainText("Noch kein eigener Gegner");
  // Die gespielte Partie behält den Namen.
  await expect(page.getByTestId("laufende-partie")).toContainText("Rambo");
});

test("Gewertete Partie (S9): Rücknahme und Spielhilfen gesperrt", async ({ page }) => {
  await starteImBrowser(page);
  await page.getByRole("navigation").getByRole("button", { name: "Spielen" }).click();
  await expect(page.getByRole("checkbox", { name: /Gewertete Partie/ })).toBeChecked();
  await expect(page.getByRole("checkbox", { name: /zurücknehmen erlauben/ })).toBeDisabled();
  await expect(page.getByRole("checkbox", { name: /Symbole am Brett/ })).toBeDisabled();
  await expect(page.getByText(/keine Zugrücknahme und keine Spielhilfen/)).toBeVisible();
  await page.getByRole("button", { name: "Partie beginnen" }).click();
  await expect(page.getByRole("button", { name: "Zurücknehmen" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Röntgen" })).toHaveCount(0);
});
