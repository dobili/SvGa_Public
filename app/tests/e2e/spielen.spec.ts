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
  await expect(page.getByTestId("spielengine")).toHaveCount(0);
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
  await page.getByTestId("partiezuege").getByRole("button", { name: "2. g4??" }).click();
  await expect(page.getByTestId("bewertungsbalken")).toHaveAttribute("aria-label", /−M/);
  // Seit 0.2.39: Karte zum Zug unter dem Brett (Urteil, besserer Zug) und die Spielstärke.
  const karte = page.getByTestId("rueckblickkarte");
  // Seit 0.2.85 mit der Gewinnchance statt der Bauerneinheiten der Engine.
  await expect(karte).toContainText(
    /2\. g4\?\?: Die Gewinnchance von Weiß fällt von \d+ % auf \d+ %/,
  );
  await expect(karte).toContainText("Besser war 2.");
  // Seit 0.2.85 ist die Variante ein Nebenzweig: Ein Tipp zeigt sie am Brett, dann zurück.
  const zweig = page.getByTestId("nebenzweig-besser");
  await zweig.locator(".zweigzug").first().click();
  await expect(zweig.locator(".zweigzug").first()).toHaveAttribute("aria-pressed", "true");
  await zweig.getByRole("button", { name: "Zurück zur Partie" }).click();
  await expect(zweig.getByRole("button", { name: "Zurück zur Partie" })).toHaveCount(0);
  // Dazu die Strafe: 2... Dh4# als eigener Zweig.
  await expect(page.getByTestId("nebenzweig-strafe")).toContainText("So wird der Fehler bestraft");
  await expect(page.getByTestId("nebenzweig-strafe")).toContainText("Dh4#");
  // Seit 0.2.83 mit dem Modus (Standard „App“, bis 0.2.86 „Mittelweg“); seit 0.2.87 schaltet
  // man ihn nur hier um, mit Erklärung hinter dem Fragezeichen.
  const spielstaerke = page.getByTestId("spielstaerke");
  await expect(spielstaerke).toContainText("Genauigkeit (App)");
  const modus = spielstaerke.getByRole("radiogroup", { name: "Genauigkeit wie" });
  await expect(modus.getByRole("radio", { name: "App" })).toHaveAttribute("aria-checked", "true");
  await modus.getByRole("radio", { name: "chess.com" }).click();
  await expect(spielstaerke).toContainText("Genauigkeit (chess.com)");
  await spielstaerke.getByRole("button", { name: "Erklärung: Genauigkeit wie" }).click();
  await expect(spielstaerke).toContainText("Züge in entschiedener Stellung zählen kaum");
  await modus.getByRole("radio", { name: "App" }).click();
  await page.screenshot({ path: "test-results/bilder/rueckblick.png", fullPage: true });
  await auswertung.getByRole("button", { name: "Zur Stellung" }).click();
  await expect(
    page.getByTestId("partiezuege").getByRole("button", { name: "2. g4??" }),
  ).not.toHaveAttribute("aria-current");
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
  await page.getByRole("checkbox", { name: /Werkzeuge und Engine/ }).uncheck();
  await page.getByRole("button", { name: "Partie beginnen" }).click();
  await expect(page.getByRole("heading", { name: "Partie zu zweit" })).toBeVisible();
  await expect(page.getByTestId("partiestatus")).toHaveText("Weiß am Zug.");
  await expect(page.getByTestId("spielengine")).toHaveCount(0);
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
  // Seit 0.2.80 unter der Kategorie „Eigene Bots“; ohne gewählten eigenen Bot kein Beginnen.
  await page.getByRole("radio", { name: "Eigene Bots" }).click();
  await expect(page.getByRole("button", { name: "Partie beginnen" })).toBeDisabled();
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

test("Gegnerwahl in drei Kategorien: nur der Inhalt der gewählten ist zu sehen (0.2.80)", async ({
  page,
}) => {
  await starteImBrowser(page);
  await page.getByRole("navigation").getByRole("button", { name: "Spielen" }).click();
  // Anfangs „Eigene Stufe“: Regler und Fehlerarten, keine Porträts.
  await expect(page.getByLabel(/^Mittelspiel:/)).toBeVisible();
  await expect(page.getByTestId("fehlerarten-abhakliste")).toBeVisible();
  // Seit 0.2.82 auch die blinden Flecken der eigenen Stufe.
  await page.getByTestId("blinde-flecken").locator("summary").click();
  await page.getByRole("checkbox", { name: /Rückzüge/ }).check();
  await expect(page.getByTestId("blinde-flecken").locator("summary")).toContainText("1 gewählt");
  await expect(page.getByRole("radiogroup", { name: "Vorgefertigter Gegner" })).toHaveCount(0);
  await page.getByRole("radio", { name: "Vorgefertigte Bots" }).click();
  await expect(page.getByLabel(/^Mittelspiel:/)).toHaveCount(0);
  await expect(page.getByTestId("fehlerarten-abhakliste")).toHaveCount(0);
  const gitter = page.getByRole("radiogroup", { name: "Vorgefertigter Gegner" });
  // Der Wechsel wählt gleich den ersten Bot der Stufe im Mittelspiel (anfangs Stufe 1).
  await expect(gitter.getByRole("radio", { checked: true })).toHaveCount(1);
  // Seit 0.2.85: Stufen aufklappbar, anfangs die des gewählten Bots offen; die App merkt sich
  // die Wahl. „Partie beginnen“ steht über dem Gitter, direkt unter den drei Kacheln.
  // Seit 0.2.88 steht vor Stufe 1 die Gruppe „Zum Spaß“ (anfangs zu).
  const stufen = page.locator("details.gegnerstufe");
  await expect(stufen.nth(0)).not.toHaveAttribute("open", "");
  await expect(stufen.nth(1)).toHaveAttribute("open", "");
  await expect(stufen.nth(2)).not.toHaveAttribute("open", "");
  await stufen.nth(2).locator("summary").click();
  await expect(stufen.nth(2)).toHaveAttribute("open", "");
  const knopf = await page.getByRole("button", { name: "Partie beginnen" }).boundingBox();
  const gitterBox = await gitter.boundingBox();
  expect((knopf?.y ?? Infinity) < (gitterBox?.y ?? 0)).toBe(true);
  // Elo-Zahl an Stufe, Kachel und Sprechblase (0.2.84, S23), mit Erklärung hinter dem Fragezeichen.
  await expect(
    gitter.getByRole("heading", { name: /^Stufe 1 · Einsteiger · (etwa|unter) \d+( bis .*\d+)?$/ }),
  ).toBeVisible();
  await expect(gitter.getByRole("radio", { checked: true })).toContainText(/etwa|unter|über/);
  const staerke = page.getByTestId("gegner-staerke");
  await expect(staerke).toContainText(/(etwa|unter|über) \d+ \(Stufe 1\)/);
  await page.getByRole("button", { name: "Erklärung: Stärke der Bots" }).click();
  await expect(page.getByTestId("gegner-sprechblase")).toContainText("Elo-Leiter");
  // Spaß-Bots (0.2.88): eigene Gruppe mit Bereich, Sprechblase „(zum Spaß)“.
  await stufen.nth(0).locator("summary").click();
  await expect(
    gitter.getByRole("heading", { name: /^Zum Spaß · etwa \d+ bis \d+$/ }),
  ).toBeVisible();
  await gitter.getByRole("radio", { name: /Fritzi/ }).click();
  await expect(staerke).toContainText(/etwa \d+ \(zum Spaß\)/);
  await page.screenshot({ path: "test-results/bilder/spielen-kategorien.png", fullPage: true });
  await page.getByRole("radio", { name: "Eigene Stufe" }).click();
  await expect(page.getByLabel(/^Mittelspiel:/)).toBeVisible();
  await expect(page.getByTestId("gegner-sprechblase")).toContainText("Eigene Stufen");
  await expect(staerke).toContainText(/Deine Einstellung \d · \d · \d · .*\(geschätzt\)/);
  // Anderer Bereich und zurück: Das Gitter entsteht neu und liest den Merker.
  await page.getByRole("navigation").getByRole("button", { name: "Buch" }).click();
  await page.getByRole("navigation").getByRole("button", { name: "Spielen" }).click();
  await page.getByRole("radio", { name: "Vorgefertigte Bots" }).click();
  await expect(stufen.nth(2)).toHaveAttribute("open", "");
});

test("Engine-Knopf während der Partie: Bewertung, eigener Zug, bester Zug (0.2.80)", async ({
  page,
}) => {
  await starteImBrowser(page);
  await page.getByRole("navigation").getByRole("button", { name: "Spielen" }).click();
  await page.getByRole("checkbox", { name: /Gewertete Partie/ }).uncheck();
  await page.getByRole("button", { name: "Partie beginnen" }).click();
  await ziehe(page, /^e2, Bauer/, "e4");
  await warteAufLeser(page);
  // Seit 0.2.82 das Symbol „Engine“ am Brett statt eines Knopfes darunter.
  await expect(page.getByTestId("spielengine")).toHaveCount(0);
  await page.getByRole("button", { name: "Engine", exact: true }).click();
  const karte = page.getByTestId("spielengine");
  await expect(karte.locator(".engine-wert")).toBeVisible({ timeout: ENGINE_FRIST });
  await karte.getByRole("button", { name: "Deinen letzten Zug bewerten" }).click();
  await expect(page.getByTestId("spielengine-urteil")).toContainText("1. e4", {
    timeout: ENGINE_FRIST,
  });
  // 1. e4 ist kein Fehler: kein „Warum?“, gleich der beste Zug.
  await expect(karte.getByRole("button", { name: "Warum?" })).toHaveCount(0);
  await karte.getByRole("button", { name: "Besten Zug zeigen" }).click();
  await expect(karte).toContainText("Die Engine schlägt jetzt", { timeout: ENGINE_FRIST });
  await expect(karte).not.toContainText("Besser war");
  await page.screenshot({ path: "test-results/bilder/spielengine.png", fullPage: true });
  await expect(karte.getByRole("button")).toHaveCount(0);
});

test("Genauigkeit wie: seit 0.2.87 nur in der Auswertung, nicht mehr in den Einstellungen", async ({
  page,
}) => {
  await starteImBrowser(page);
  await page.getByRole("button", { name: "Einstellungen", exact: true }).click();
  await page.getByRole("tab", { name: "Training" }).click();
  await expect(page.getByRole("radiogroup", { name: "Genauigkeit wie" })).toHaveCount(0);
});
