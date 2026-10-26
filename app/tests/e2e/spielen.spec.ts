/**
 * Oberflächentests für das Spiel gegen die Engine (AP 11): Partie beginnen, ziehen, Antwort der
 * Engine, Rücknahme, Fortsetzen nach dem Neuladen, Start an einer Abbildung mit Schwarz,
 * ein Zug, der ein Matt erlaubt, wird ohne Rückfrage gespielt (seit 0.2.32), Ergebnis und
 * Rücknahme nach dem Matt; Neuladen mitten im Nachdenken behält die verbrauchte Zeit (N180);
 * die Zugliste klappt auf und bleibt nach dem Neuladen aufgeklappt (26.10.2026).
 */
import { expect, type Page } from "@playwright/test";
import { test } from "@playwright/test";
import { oeffneAbbildung, oeffneProfil, starteImBrowser } from "./hilfen";

/** Die Engine rechnet im Browser; der erste Start lädt die WASM-Datei. */
const ENGINE_FRIST = 30_000;
/** Bedenkzeit vor dem Neuladen im Test zu N180: genug, dass die Uhr unter 5:00 fällt. */
const BEDENKZEIT_MS = 6_000;

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
  await page.getByRole("radio", { name: "Blitz 5 + 3" }).click();
  // Gewertete Partien haben keine Rücknahme (S9); ungewertet ist sie da.
  await page.getByRole("checkbox", { name: /Gewertete Partie/ }).uncheck();
  await page.getByRole("button", { name: "Partie beginnen" }).click();
  await expect(page.getByRole("heading", { name: "Partie gegen die Engine" })).toBeVisible();
  await expect(page.getByText("Stufe 1 · Neuling · du spielst Weiß")).toBeVisible();
  await expect(page.getByTestId("uhr-white")).toContainText("5:00");
  await ziehe(page, /^e2, Bauer/, "e4");
  await expect(page.getByTestId("partiezuege")).toContainText("1. e4");
  await warteAufLeser(page);
  await expect(page.getByTestId("partiezuege").getByRole("button")).toHaveCount(2);
  await page.getByRole("button", { name: "Zurücknehmen" }).click();
  await expect(page.getByTestId("partiezuege")).toHaveText("Noch keine Züge.");
  await ziehe(page, /^d2, Bauer/, "d4");
  await warteAufLeser(page);
  // Zugliste aufklappbar (Wunsch des Autors, 26.10.2026); das Gerät merkt sich die Wahl.
  await page.getByRole("button", { name: "Alle Züge zeigen" }).click();
  await expect(page.getByRole("button", { name: "Weniger Züge zeigen" })).toHaveAttribute(
    "aria-expanded",
    "true",
  );
  await page.screenshot({ path: "test-results/bilder/partie.png", fullPage: true });
  await page.reload();
  await page.getByRole("navigation").getByRole("button", { name: "Spielen" }).click();
  await expect(page.getByTestId("laufende-partie")).toBeVisible();
  await page.getByRole("button", { name: "Weiterspielen" }).click();
  await expect(page.getByTestId("partiezuege")).toContainText("1. d4");
  await expect(page.getByTestId("partiezuege").getByRole("button")).toHaveCount(2);
  await page.getByRole("button", { name: "Weniger Züge zeigen" }).click();
  await expect(page.getByRole("button", { name: "Alle Züge zeigen" })).toHaveAttribute(
    "aria-expanded",
    "false",
  );
});

test("Weitermachen (V2): nach dem Neuladen auf Spielen mit „Weiterspielen“, nicht in der Partie", async ({
  page,
}) => {
  await starteImBrowser(page, { weitermachen: true });
  await page.getByRole("navigation").getByRole("button", { name: "Spielen" }).click();
  await page.getByRole("button", { name: "Partie beginnen" }).click();
  await expect(page.getByRole("heading", { name: "Partie gegen die Engine" })).toBeVisible();
  await page.reload();
  // Die Uhr soll nicht ohne Zutun weiterlaufen: Der Stapel endet vor der Partie.
  await expect(page.getByTestId("laufende-partie")).toBeVisible();
  await expect(page.getByTestId("partie")).toHaveCount(0);
  await page.getByRole("button", { name: "Weiterspielen" }).click();
  await expect(page.getByRole("heading", { name: "Partie gegen die Engine" })).toBeVisible();
});

test("Neuladen mitten im Nachdenken: die Bedenkzeit bleibt verbraucht (N180)", async ({ page }) => {
  await starteImBrowser(page);
  await page.getByRole("navigation").getByRole("button", { name: "Spielen" }).click();
  await page.getByRole("radio", { name: "Blitz 5 + 3" }).click();
  await page.getByRole("button", { name: "Partie beginnen" }).click();
  await ziehe(page, /^e2, Bauer/, "e4");
  await warteAufLeser(page);
  // Nachdenken: Die Uhr von Weiß läuft (5:03 nach dem Zuschlag), dann sofort neu laden.
  await page.waitForTimeout(BEDENKZEIT_MS);
  await page.reload();
  await page.getByRole("navigation").getByRole("button", { name: "Spielen" }).click();
  await page.getByRole("button", { name: "Weiterspielen" }).click();
  await expect(page.getByTestId("uhr-white")).toContainText(/4:5\d/);
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
  await expect(page.getByTestId("laufende-partie")).toHaveCount(0);
  // Seit 0.2.134 stehen die gespielten Partien im Profil.
  await oeffneProfil(page);
  await expect(page.getByRole("heading", { name: "Deine Partien" })).toBeVisible();
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
  // Seit 0.2.40 drei Regler je Phase: alle auf Stufe 10 (volle Engine). Stufe 8 spielt mit
  // menschlichen Fehlern und übersieht das Matt 2. … Dh4# gelegentlich (wie in brett.spec.ts).
  for (const phase of ["Eröffnung", "Mittelspiel", "Endspiel"]) {
    await page.getByLabel(new RegExp(`^${phase}:`)).fill("10");
  }
  await expect(page.getByLabel(/^Mittelspiel:/)).toHaveValue("10");
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
  // Seit 0.2.131 steht die Klasse als Marke am Zug; Bildschirmleser hören „2. g4, Patzer (??)“.
  await page.getByTestId("partiezuege").getByRole("button", { name: "2. g4, Patzer (??)" }).click();
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
  // Seit 0.3.0 spielen Knöpfe unter dem Brett die Varianten langsam ab, bis zum letzten Zug.
  const abspielen = page.getByTestId("abspielen-besser");
  await abspielen.click();
  await expect(abspielen).toHaveText("Anhalten");
  await expect(zweig.locator(".zweigzug").last()).toHaveAttribute("aria-pressed", "true", {
    timeout: ENGINE_FRIST,
  });
  await expect(abspielen).toHaveText("Besserer Zug", { timeout: ENGINE_FRIST });
  await page.getByTestId("abspielen-strafe").click();
  await expect(page.getByTestId("nebenzweig-strafe").locator(".zweigzug").first()).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page
    .getByTestId("nebenzweig-strafe")
    .getByRole("button", { name: "Zurück zur Partie" })
    .click();
  // Seit 0.2.121 ohne Schalter „Genauigkeit wie“: Genauigkeit nach Lichess, Spielstärke aus dem
  // Elo-Modell je Zeitklasse, Erklärung hinter dem Fragezeichen.
  const spielstaerke = page.getByTestId("spielstaerke");
  await expect(spielstaerke).toContainText("Genauigkeit");
  await expect(spielstaerke.getByRole("radiogroup")).toHaveCount(0);
  await spielstaerke.getByRole("button", { name: "Erklärung: Spielstärke" }).click();
  await expect(spielstaerke).toContainText("Wertung auf Lichess");
  // R56: Ring, fünf Balken und die Zugklassen der eigenen Seite; der Umschalter wechselt die Seite.
  await expect(page.getByTestId("balken-taktik")).toBeVisible();
  await expect(page.getByTestId("zugklasse-patzer")).toContainText("1");
  const seiten = auswertung.getByRole("radiogroup", { name: "Seite" });
  await expect(seiten.getByRole("radio", { name: "Weiß (du)" })).toHaveAttribute(
    "aria-checked",
    "true",
  );
  // R55: Fehler und Patzer eingeklappt, mit der Anzahl.
  const fehler = page.getByTestId("grobe-patzer");
  await expect(fehler.getByRole("button", { name: /2\. g4\?\?/ })).toBeHidden();
  await fehler.locator("summary").click();
  await expect(fehler.getByRole("button", { name: /2\. g4\?\?/ })).toBeVisible();
  await seiten.getByRole("radio", { name: /^Schwarz/ }).click();
  await expect(page.getByTestId("grobe-patzer")).toHaveCount(0);
  await seiten.getByRole("radio", { name: "Weiß (du)" }).click();
  await page.screenshot({ path: "test-results/bilder/rueckblick.png", fullPage: true });
  await auswertung.getByRole("button", { name: "Zur Stellung" }).click();
  await expect(
    page.getByTestId("partiezuege").getByRole("button", { name: "2. g4, Patzer (??)" }),
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
  await page.getByTestId("spielhilfen-klappe").locator("summary").click();
  await page.getByRole("checkbox", { name: /Werkzeuge und Engine/ }).uncheck();
  await page.getByRole("button", { name: "Partie beginnen" }).click();
  await expect(page.getByRole("heading", { name: "Partie zu zweit" })).toBeVisible();
  await expect(page.getByTestId("partiestatus")).toHaveText("Weiß am Zug.");
  await expect(page.getByTestId("spielengine")).toHaveCount(0);
  await ziehe(page, /^a3,/, "e7");
  await expect(page.getByTestId("partieende")).toContainText("Matt! Weiß hat gewonnen.");
  // Zu zweit spielt keine Engine: kein Satz über ihre absichtlichen Fehler (bis 0.2.89 stand er da).
  await expect(page.getByTestId("auswertung")).toBeVisible();
  await expect(page.getByText(/Die Engine hat in dieser Partie/)).toHaveCount(0);
  await oeffneProfil(page);
  await expect(page.locator(".partienliste")).toContainText("1–0");
});

// 0.2.42: eigene Gegner anlegen, wählen, im Untertitel sehen, löschen.
test("Eigener Gegner „Rambo“ (Angreifer, ohne „Figur hängen“): anlegen, spielen, löschen", async ({
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
  // Seit 0.2.126 (Teil E): Stil im Spinnennetz statt Regler, Regler auf menschlichen Quantilen.
  // Seit 0.2.129 (DS39) in Reitern: Stärke, Stil, Fehler, Flecken.
  await page.getByRole("tab", { name: "Stil" }).click();
  const netz = page.getByTestId("stilnetz");
  await netz.getByRole("checkbox", { name: "Angreifer 100 %" }).click();
  await expect(netz.getByRole("checkbox", { name: "Angreifer 100 %" })).toHaveAttribute(
    "aria-checked",
    "true",
  );
  await expect(page.getByTestId("stilnetz-text")).toContainText("sucht Schach");
  // Seit 0.2.135 (Variante A): fünf Achsen im Netz, neun Feinregler hinter einem Haken.
  await page.getByRole("tab", { name: "Fehler (9)" }).click();
  await page.getByTestId("fehlernetz").getByRole("radio", { name: "Figuren: aus" }).click();
  await expect(page.getByRole("tab", { name: "Fehler (7)" })).toBeVisible();
  await expect(page.getByTestId("menschlichkeit")).toHaveAttribute("data-urteil", "menschlich");
  await page.getByRole("checkbox", { name: "Feinregler für jede Fehlerart" }).check();
  // Seit 0.2.139 ist die Auswahlliste der Vorlagen gesperrt, solange die Feinregler offen sind.
  await expect(
    page.getByTestId("fehlerprofil").getByRole("combobox", { name: "Vorlage" }),
  ).toBeDisabled();
  // Unmenschliche Stufen erst nach dem Haken.
  const dame = page.getByTestId("stufe-eroeffnungsfehler");
  await expect(dame.getByRole("radio", { name: "extrem" })).toHaveCount(0);
  await page.getByRole("checkbox", { name: "Auch unmenschliche Werte anbieten" }).check();
  await dame.getByRole("radio", { name: "extrem" }).click();
  await expect(page.getByTestId("menschlichkeit")).toHaveAttribute("data-urteil", "unmenschlich");
  await karte.getByRole("button", { name: "Gegner speichern" }).click();
  await expect(karte).toContainText("Rambo · 3 · 3 · 3 · Angreifer");
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
  await page.getByTestId("spielhilfen-klappe").locator("summary").click();
  await expect(page.getByRole("checkbox", { name: /zurücknehmen erlauben/ })).toBeDisabled();
  await expect(page.getByRole("checkbox", { name: /Symbole am Brett/ })).toBeDisabled();
  // Seit 0.2.137 steht der Satz hinter dem Fragezeichen an „Gewertete Partie“.
  await page.getByRole("button", { name: /^Erklärung: Gewertete Partie/ }).click();
  await expect(page.getByText(/keine Zugrücknahme und keine Spielhilfen/)).toBeVisible();
  await page.getByRole("button", { name: "Partie beginnen" }).click();
  await expect(page.getByRole("button", { name: "Zurücknehmen" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Röntgen" })).toHaveCount(0);
});

test("Gewertete Partie (R32): der Haken bleibt beim Wechsel der Art des Gegners aus", async ({
  page,
}) => {
  await starteImBrowser(page);
  await page.getByRole("navigation").getByRole("button", { name: "Spielen" }).click();
  const haken = page.getByRole("checkbox", { name: /Gewertete Partie/ });
  await haken.uncheck();
  await page.getByRole("radio", { name: "Mensch (beide Seiten selbst)" }).click();
  await page.getByRole("radio", { name: "Engine", exact: true }).click();
  await expect(haken).not.toBeChecked();
});

test("Gegnerwahl in drei Kategorien: nur der Inhalt der gewählten ist zu sehen (0.2.80)", async ({
  page,
}) => {
  await starteImBrowser(page);
  await page.getByRole("navigation").getByRole("button", { name: "Spielen" }).click();
  // Anfangs „Eigene Stufe“: Regler und Fehlerarten, keine Porträts.
  await expect(page.getByLabel(/^Mittelspiel:/)).toBeVisible();
  await expect(page.getByTestId("gegnerreiter")).toBeVisible();
  // Seit 0.2.82 auch die blinden Flecken der eigenen Stufe; seit 0.2.135 als Netz mit fünf Gruppen.
  await page.getByRole("tab", { name: "Blinde Flecken (0)" }).click();
  const rueckzug = page.getByTestId("fleckennetz").getByRole("radio", { name: "Rückzüge: selten" });
  await rueckzug.click();
  await expect(rueckzug).toHaveAttribute("aria-checked", "true");
  await expect(page.getByTestId("flecken-text")).toContainText("auch die der Springer");
  await expect(page.getByRole("tab", { name: "Blinde Flecken (1)" })).toBeVisible();
  await page.getByRole("tab", { name: "Stärke" }).click();
  await expect(page.getByRole("radiogroup", { name: "Vorgefertigter Gegner" })).toHaveCount(0);
  await page.getByRole("radio", { name: "Vorgefertigte Bots" }).click();
  await expect(page.getByLabel(/^Mittelspiel:/)).toHaveCount(0);
  await expect(page.getByTestId("gegnerreiter")).toHaveCount(0);
  const gitter = page.getByRole("radiogroup", { name: "Vorgefertigter Gegner" });
  // Der Wechsel wählt gleich den ersten Bot der Stufe im Mittelspiel (anfangs Stufe 1).
  await expect(gitter.getByRole("radio", { checked: true })).toHaveCount(1);
  // Seit 0.2.85: Stufen aufklappbar, anfangs die des gewählten Bots offen; die App merkt sich
  // die Wahl.
  // Seit 0.2.88 steht vor Stufe 1 die Gruppe „Zum Spaß“ (anfangs zu).
  const stufen = page.locator("details.gegnerstufe");
  await expect(stufen.nth(0)).not.toHaveAttribute("open", "");
  await expect(stufen.nth(1)).toHaveAttribute("open", "");
  await expect(stufen.nth(2)).not.toHaveAttribute("open", "");
  await stufen.nth(2).locator("summary").click();
  await expect(stufen.nth(2)).toHaveAttribute("open", "");
  // Seit 0.2.129 (DS40) steht „Partie beginnen“ in der festen Startleiste: immer im Bild.
  await expect(page.getByRole("button", { name: "Partie beginnen" })).toBeInViewport();
  // Elo-Zahl an Stufe, Kachel und Sprechblase (0.2.84, S23), mit Erklärung hinter dem Fragezeichen.
  await expect(
    gitter.getByRole("heading", { name: /^Stufe 1 · Neuling · (etwa|unter) \d+( bis .*\d+)?$/ }),
  ).toBeVisible();
  await expect(gitter.getByRole("radio", { checked: true })).toContainText(/etwa|unter|über/);
  const staerke = page.getByTestId("gegner-staerke");
  await expect(staerke).toContainText(/(etwa|unter|über) \d+ \(Stufe 1\)/);
  await page.getByRole("button", { name: "Erklärung: Stärke der Bots" }).click();
  await expect(page.getByTestId("gegner-sprechblase")).toContainText("Wertung auf Lichess");
  // Spaß-Bots (0.2.88): eigene Gruppe mit Bereich, Sprechblase „(zum Spaß)“.
  await stufen.nth(0).locator("summary").click();
  await expect(
    gitter.getByRole("heading", { name: /^Zum Spaß · (etwa|unter) \d+ bis (etwa )?\d+$/ }),
  ).toBeVisible();
  await gitter.getByRole("radio", { name: /Kiki/ }).click();
  // Seit 0.2.117 spielen die Spaß-Bots eigene Stufen mit Zufallszügen (Kiki etwa 450).
  await expect(staerke).toContainText(/(etwa|unter) \d+ \(zum Spaß\)/);
  // Gleich große Kacheln (0.2.89): Stufe 9 hat lange Namen („Frau Prof. Reich“).
  await stufen.nth(9).locator("summary").click();
  const breiten = await stufen
    .nth(9)
    .locator(".gegner-portraet")
    .evaluateAll((bilder) => bilder.map((b) => b.getBoundingClientRect().width));
  expect(breiten.length).toBeGreaterThan(1);
  expect(Math.max(...breiten) - Math.min(...breiten)).toBeLessThan(1);
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

test("Maia-Hinweis (26.10.2026): einmal beim ersten Antippen eines vorgefertigten Bots", async ({
  page,
}) => {
  await starteImBrowser(page, { maiaHinweis: true });
  await page.getByRole("navigation").getByRole("button", { name: "Spielen" }).click();
  await page.getByRole("radio", { name: "Vorgefertigte Bots" }).click();
  const gitter = page.getByRole("radiogroup", { name: "Vorgefertigter Gegner" });
  // Die Vorauswahl beim Wechsel zählt nicht, erst das Antippen eines Bots.
  await expect(page.getByTestId("maia-hinweis")).toHaveCount(0);
  await gitter.getByRole("radio", { checked: false }).first().click();
  const hinweis = page.getByTestId("maia-hinweis");
  await expect(hinweis).toContainText("Zusatzpaket Maia");
  await expect(hinweis.getByRole("button", { name: /Maia laden/ })).toBeVisible();
  await expect(hinweis).toContainText("Reiter „Bots“");
  await hinweis.getByRole("button", { name: "Weiter" }).click();
  await expect(hinweis).toHaveCount(0);
  await gitter.getByRole("radio", { checked: false }).first().click();
  await page.reload();
  await page.getByRole("navigation").getByRole("button", { name: "Spielen" }).click();
  await page.getByRole("radio", { name: "Vorgefertigte Bots" }).click();
  await gitter.getByRole("radio", { checked: false }).first().click();
  await expect(page.getByTestId("maia-hinweis")).toHaveCount(0);
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

/** Beginnt eine ungewertete Partie mit der Farbe und gibt gleich auf. */
async function aufgegebenePartie(seite: Page, farbe: "Weiß" | "Schwarz"): Promise<void> {
  await seite.getByRole("navigation").getByRole("button", { name: "Spielen" }).click();
  await seite.getByRole("radio", { name: farbe, exact: true }).click();
  await seite.getByRole("checkbox", { name: /Gewertete Partie/ }).uncheck();
  await seite.getByRole("button", { name: "Partie beginnen" }).click();
  await seite.getByRole("button", { name: "Aufgeben" }).click();
  await seite.getByRole("button", { name: "Ja, aufgeben" }).click();
  await expect(seite.getByTestId("partieende")).toContainText("Du hast aufgegeben.");
}

test("Partienliste: Filter und Sortieren mit Listen in Worten, Chips (R22, R54)", async ({
  page,
}) => {
  await starteImBrowser(page);
  for (const farbe of ["Weiß", "Schwarz", "Weiß", "Schwarz"] as const) {
    await aufgegebenePartie(page, farbe);
  }
  await oeffneProfil(page);
  const liste = page.locator(".partienliste li.partieeintrag");
  const filter = page.getByTestId("partienfilter");
  await expect(liste).toHaveCount(4);
  await filter.getByRole("button", { name: "Filter", exact: true }).click();
  await filter.getByRole("checkbox", { name: "mit Schwarz" }).click();
  await expect(liste).toHaveCount(2);
  // Zwei Gruppen zugleich: Schwarz und gewonnen → nichts; dazu verloren (oder) → wieder zwei.
  await filter.getByRole("checkbox", { name: "gewonnen" }).click();
  await expect(liste).toHaveCount(0);
  await expect(page.getByText("Keine Partie passt zu diesem Filter.")).toBeVisible();
  await filter.getByRole("checkbox", { name: "verloren" }).click();
  await expect(liste).toHaveCount(2);
  await expect(filter.getByRole("button", { name: "Filter (3)" })).toBeVisible();
  await page.screenshot({ path: "test-results/bilder/partienfilter.png", fullPage: true });
  // Ein Chip nimmt einen Filter weg; „Filter zurücksetzen“ alle.
  await filter.getByRole("button", { name: "Filter „gewonnen“ entfernen" }).click();
  await expect(filter.getByRole("button", { name: "Filter (2)" })).toBeVisible();
  await filter.getByRole("button", { name: "Filter zurücksetzen" }).click();
  await expect(liste).toHaveCount(4);
  // Sortierung: neueste zuerst (Schwarz), „Älteste zuerst“ → Weiß oben.
  await expect(liste.first().getByRole("img", { name: "Du hast Schwarz gespielt" })).toBeVisible();
  await filter.getByRole("button", { name: "Neueste zuerst" }).click();
  await filter.getByRole("radio", { name: "Älteste zuerst" }).click();
  await expect(liste.first().getByRole("img", { name: "Du hast Weiß gespielt" })).toBeVisible();
  await expect(filter.getByRole("button", { name: "Älteste zuerst" })).toBeVisible();
  // Löschmodus (0.2.142): Papierkorb neben Filter, zwei Partien antippen, löschen.
  await filter.getByRole("button", { name: "Partien löschen" }).click();
  const zeilen = liste.locator(".partiezeile-oeffnen");
  await zeilen.nth(0).click();
  await zeilen.nth(1).click();
  await expect(zeilen.nth(0)).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("2 ausgewählt")).toBeVisible();
  await page.getByRole("button", { name: "Ausgewählte löschen" }).click();
  await page.getByRole("button", { name: "Ja, löschen" }).click();
  await expect(liste).toHaveCount(2);
});

test("PGN einlesen (R23): Partie erscheint ungewertet, wird geöffnet und ausgewertet", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneProfil(page);
  await page.getByRole("button", { name: "Partie einlesen (PGN)", exact: true }).click();
  const formular = page.getByTestId("pgnimport");
  await formular.getByRole("button", { name: "Einlesen und auswerten" }).click();
  await expect(formular).toContainText("Füge zuerst eine Partie ein.");
  await formular
    .getByLabel("PGN der Partie")
    .fill('[White "Anna"]\n[Black "Ben"]\n[Result "0-1"]\n\n1. f3 e5 2. g4 Qh4# 0-1');
  await formular.getByRole("radio", { name: "Schwarz" }).click();
  await formular.getByRole("button", { name: "Einlesen und auswerten" }).click();
  await expect(page.getByTestId("partieende")).toContainText("Matt", { timeout: ENGINE_FRIST });
  await page.screenshot({ path: "test-results/bilder/pgnimport.png", fullPage: true });
  await oeffneProfil(page);
  const eintrag = page.locator(".partienliste li.partieeintrag").first();
  // Seit 0.2.142 links der Gegner aus dem PGN unter einem Dateizeichen (Leser spielte Schwarz).
  await expect(eintrag.locator(".partie-wer-name")).toHaveText("Anna");
  await expect(eintrag.locator(".ergebnis-gewonnen")).toContainText("0–1");
});

// 0.2.126 (Wunsch des Autors): „Eigene Stufe“ hat dieselben Einstellungen wie „Eigene Bots“.
test("Eigene Stufe: Spinnennetz, Regler auf Quantilen, ohne Fehlerart die Zahl der reinen Stufe", async ({
  page,
}) => {
  await starteImBrowser(page);
  await page.getByRole("navigation").getByRole("button", { name: "Spielen" }).click();
  await page.getByRole("tab", { name: "Stil" }).click();
  const netz = page.getByTestId("stilnetz");
  // Seit 0.2.126: vier Ausprägungen, mehrere Stile, nur nicht beide Enden einer Achse
  const punkt = (name: string) => netz.getByRole("checkbox", { name, exact: true });
  await punkt("Taktiker 75 %").click();
  await punkt("Angreifer 50 %").click();
  await expect(punkt("Taktiker 75 %")).toHaveAttribute("aria-checked", "true");
  await expect(punkt("Angreifer 50 %")).toHaveAttribute("aria-checked", "true");
  // Außen steht die Beschriftung mit im Punkt: auf den Kreis selbst tippen
  await punkt("Positionsspieler 125 %").locator("circle").nth(1).click();
  await expect(punkt("Angreifer 50 %")).toHaveAttribute("aria-checked", "false");
  await expect(page.getByTestId("stilnetz-text")).toContainText("Positionsspieler 125 %");
  await punkt("Positionsspieler 125 %").locator("circle").nth(1).click();
  await expect(punkt("Positionsspieler 125 %")).toHaveAttribute("aria-checked", "false");
  await page.getByRole("tab", { name: "Fehler (9)" }).click();
  await expect(page.getByTestId("menschlichkeit")).toHaveAttribute("data-urteil", "menschlich");
  await page.getByRole("checkbox", { name: "Feinregler für jede Fehlerart" }).check();
  await page.getByRole("checkbox", { name: "Auch unmenschliche Werte anbieten" }).check();
  await page.getByTestId("stufe-eroeffnungsfehler").getByRole("radio", { name: "ständig" }).click();
  await expect(page.getByTestId("menschlichkeit")).toHaveAttribute("data-urteil", "unmenschlich");
  const blase = page.getByTestId("gegner-sprechblase");
  await page.getByRole("tab", { name: "Stärke" }).click();
  await page.getByLabel(/^Mittelspiel:/).fill("5");
  await page.getByLabel(/^Eröffnung:/).fill("5");
  await page.getByLabel(/^Endspiel:/).fill("5");
  // Stufe 5 nach der Neumessung von Plan C (0.2.143, ohne Maia: 1434).
  await expect(blase).toContainText("etwa 1450");
  await page.getByRole("tab", { name: "Fehler (9)" }).click();
  // Mit unmenschlichem Wert beginnen die Feinregler offen; die Vorlagen erst nach dem Haken.
  await page.getByRole("checkbox", { name: "Feinregler für jede Fehlerart" }).uncheck();
  // Seit 0.2.139 stehen die Vorlagen in einer Auswahlliste wie bei den Stilachsen.
  await page
    .getByTestId("fehlerprofil")
    .getByRole("combobox", { name: "Vorlage" })
    .selectOption({ label: "Keine Fehler" });
  await expect(page.getByRole("tab", { name: "Fehler (0)" })).toBeVisible();
  // Ohne Fehlerart spielt die Stufe nur ihre Grundschicht: gemessen etwa 720.
  await expect(blase).toContainText("etwa 700");
  // Stil und Haken überstehen das Neuladen.
  await page.reload();
  await page.getByRole("navigation").getByRole("button", { name: "Spielen" }).click();
  await expect(page.getByRole("tab", { name: "Fehler (0)" })).toBeVisible();
  await page.getByRole("tab", { name: "Stil" }).click();
  await expect(
    page.getByTestId("stilnetz").getByRole("checkbox", { name: "Taktiker 75 %", exact: true }),
  ).toHaveAttribute("aria-checked", "true");
});
