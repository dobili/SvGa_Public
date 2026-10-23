/**
 * Oberflächentests der ersten Trainer (AP 13 Teil 2): Koordinaten (Feld finden, Zug aufschreiben,
 * Gangarten), Zähltrainer (Bilanz, hängende Figuren), Schach-Röntgen-Trainer. Die Aufgaben sind
 * zufällig; die Tests lesen deshalb den Auftrag oder prüfen nur den Ablauf. Dazu Taktik, Falle
 * oder Köder, Strukturerkenner, Wiederholung, Endspiel, Zielbilanz und Faktorenbilanz; die übrigen
 * Trainer stehen seit 0.2.90 in trainer-kapitel2bis12.spec.ts.
 */
import { expect, test, type Page } from "@playwright/test";
import { oeffneTrainer, starteImBrowser } from "./hilfen";

const feld = (page: Page, name: string) =>
  page.getByRole("button", { name: new RegExp(`^${name}(,|$)`) });

test("Feld finden: sechzehn Felder aus beiden Perspektiven, Ergebnis mit Zeit", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneTrainer(page, "koordinaten");
  await page.getByRole("button", { name: /Feld finden/ }).click();
  const auftrag = page.getByTestId("feld-auftrag");
  for (let i = 0; i < 16; i += 1) {
    await expect(page.getByText(`Aufgabe ${i + 1} von 16`)).toBeVisible();
    const text = (await auftrag.textContent()) ?? "";
    const gesucht = text.replace("Tippe auf ", "").trim();
    if (i === 8) await page.screenshot({ path: "test-results/bilder/trainer-felder.png" });
    await feld(page, gesucht).click();
  }
  const ende = page.getByTestId("runde-ende");
  await expect(ende).toContainText("16 von 16 Aufgaben richtig");
  await expect(ende).toContainText("Sekunden");
  await ende.getByRole("button", { name: "Andere Übung" }).click();
  await expect(page.getByRole("button", { name: /Gangarten/ })).toBeVisible();
});

test("Zug aufschreiben: falsche Schreibweise, das Buch schreibt den Zug", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneTrainer(page, "koordinaten");
  await page.getByRole("button", { name: /Zug aufschreiben/ }).click();
  await page.getByRole("textbox", { name: "Zug in Notation" }).fill("Qa1");
  await page.getByRole("button", { name: "Prüfen" }).click();
  await expect(page.getByTestId("trainer")).toContainText("Das Buch schreibt");
});

test("Gangarten: Prüfen ohne Tipp zeigt die Zielfelder, Weiter zur zweiten Aufgabe", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneTrainer(page, "koordinaten");
  await page.getByRole("button", { name: /Gangarten/ }).click();
  await page.getByRole("button", { name: "Prüfen" }).click();
  await expect(page.getByTestId("trainer")).toContainText("Zielfelder");
  await page.getByRole("button", { name: "Weiter" }).click();
  await expect(page.getByText("Aufgabe 2 von 8")).toBeVisible();
});

test("Zähltrainer: Bilanz zählen zeigt die Rechnung der App", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneTrainer(page, "zaehlen");
  await page.getByRole("button", { name: /Bilanz zählen/ }).click();
  const runde = page.getByTestId("trainerrunde");
  // Seit 0.2.116 mit „−“ und „+“: der erste Tipp auf „+“ setzt den kleinsten Wert.
  await runde.getByRole("button", { name: "Angreifer: eins mehr" }).click();
  await runde.getByRole("button", { name: "Verteidiger: eins mehr" }).click();
  await runde
    .getByRole("button", { name: /eins mehr/ })
    .last()
    .click();
  await expect(runde.getByText("lohnt nicht")).toBeVisible();
  await runde.getByRole("button", { name: "Prüfen" }).click();
  await expect(page.getByTestId("zaehl-rechnung")).toBeVisible();
  await page.screenshot({ path: "test-results/bilder/trainer-zaehlen.png", fullPage: true });
});

test("Schach-Röntgen-Trainer: drei Schritte, dann Weiter", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneTrainer(page, "roentgen");
  const runde = page.getByTestId("trainerrunde");
  await expect(runde).toContainText("Schritt 1 von 3");
  for (const naechster of [true, true, false]) {
    await runde.getByRole("button", { name: "Prüfen" }).click();
    await expect(runde.getByRole("status")).toBeVisible();
    if (naechster) await runde.getByRole("button", { name: "Nächster Schritt" }).click();
  }
  await page.screenshot({ path: "test-results/bilder/trainer-roentgen.png", fullPage: true });
  await runde.getByRole("button", { name: "Weiter" }).click();
  await expect(runde).toContainText("Aufgabe 2 von 5");
});

test("Taktiktrainer: Thema und Stufe wählen, Hilfen, Lösung zeigen, Motiv benennen", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneTrainer(page, "taktik");
  const wahl = page.getByTestId("taktik-wahl");
  {
    const liste = wahl.getByLabel("Thema");
    const wert = await liste
      .locator("option", { hasText: /^Spieß/ })
      .first()
      .getAttribute("value");
    await liste.selectOption(wert ?? "");
  }
  await wahl.getByRole("button", { name: "2", exact: true }).click();
  await wahl.getByRole("button", { name: "Runde starten" }).click();
  const runde = page.getByTestId("trainerrunde");
  await expect(runde).toContainText("Aufgabe 1 von 8");
  await runde.getByRole("button", { name: "Hinweis 1" }).click();
  await expect(runde).toContainText("Warnsignal:");
  await runde.getByRole("button", { name: "Hinweis 2" }).click();
  await expect(page.getByTestId("taktik-motiv")).toContainText("Spieß");
  await runde.getByRole("button", { name: "Lösung zeigen" }).click();
  await expect(runde).toContainText("Lösung:");
  const benennen = page.getByTestId("motiv-benennen");
  await benennen.getByRole("button", { name: "Spieß" }).click();
  await expect(benennen).toContainText("Richtig!");
  await page.screenshot({ path: "test-results/bilder/trainer-taktik.png", fullPage: true });
  await runde.getByRole("button", { name: "Weiter" }).click();
  await expect(runde).toContainText("Aufgabe 2 von 8");
});

test("Falle oder Köder: Warnsignale prüfen, entscheiden, Auflösung", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneTrainer(page, "falle");
  await page.getByTestId("falle-wahl").getByRole("button", { name: "Runde starten" }).click();
  const runde = page.getByTestId("trainerrunde");
  await expect(runde).toContainText("Falle oder Geschenk?");
  await runde.getByRole("button", { name: /Warnsignale prüfen/ }).click();
  await expect(page.getByTestId("falle-warnsignale")).toBeVisible();
  await runde.getByRole("button", { name: "Nicht nehmen" }).click();
  await expect(runde).toContainText(/Eine Falle|Ein Geschenk/);
  await expect(runde).toContainText("Fortsetzung laut Engine:");
  await page.screenshot({ path: "test-results/bilder/trainer-falle.png", fullPage: true });
  await runde.getByRole("button", { name: "Weiter" }).click();
  await expect(runde).toContainText("Aufgabe 2 von 8");
});

test("Strukturerkenner: starke Felder und schwache Bauern prüfen, Plan wählen", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneTrainer(page, "struktur");
  await page.getByTestId("struktur-wahl").getByRole("button", { name: "Runde starten" }).click();
  const runde = page.getByTestId("trainerrunde");
  await expect(runde).toContainText(/Schritt 1 von [23]/);
  // W5: Mit starken Feldern hat die Aufgabe drei Schritte, sonst zwei.
  const dreiSchritte = (await runde.textContent())?.includes("Schritt 1 von 3") ?? false;
  await runde.getByRole("button", { name: "Prüfen" }).click();
  if (dreiSchritte) {
    await expect(runde).toContainText("Schritt 2 von 3");
    await runde.getByRole("button", { name: "Prüfen" }).click();
  }
  await expect(runde).toContainText("Welcher Plan passt");
  await runde.locator(".plan-satz").first().click();
  await expect(runde).toContainText("Struktur:");
  await expect(runde).toContainText("Nicht ganz");
  await page.screenshot({ path: "test-results/bilder/trainer-struktur.png", fullPage: true });
  await runde.getByRole("button", { name: "Weiter" }).click();
  await expect(runde).toContainText("Aufgabe 2 von 8");
});

test("Wiederholung (U9): falsch gelöste Taktikaufgabe kommt nach einem Tag wieder", async ({
  page,
}) => {
  await page.clock.install();
  await starteImBrowser(page);
  await oeffneTrainer(page, "taktik");
  await expect(page.getByTestId("trainer-wiederholung")).toHaveCount(0);
  await page.getByTestId("taktik-wahl").getByRole("button", { name: "Runde starten" }).click();
  const runde = page.getByTestId("trainerrunde");
  await runde.getByRole("button", { name: "Hinweis 1" }).click();
  await runde.getByRole("button", { name: "Hinweis 2" }).click();
  await runde.getByRole("button", { name: "Lösung zeigen" }).click();
  await expect(runde).toContainText("Lösung:");
  const training = page
    .getByRole("navigation", { name: "Hauptbereiche" })
    .getByRole("button", { name: "Training" });
  await training.click();
  await expect(page.getByTestId("faellig")).toContainText("Als Nächstes am");
  await page.clock.fastForward("48:00:00");
  await page
    .getByRole("navigation", { name: "Hauptbereiche" })
    .getByRole("button", { name: "Buch" })
    .click();
  await training.click();
  await page
    .getByTestId("faellig")
    .getByRole("button", { name: /Taktiktrainer: 1 fällig/ })
    .click();
  await page.getByTestId("trainer-wiederholung").getByRole("button").click();
  await expect(page.getByTestId("trainerrunde")).toContainText("Aufgabe 1 von 1");
});

test("Endspieltrainer: Mattführung Stufe 1, Merksatz als Hinweis, Aufgabe abbrechen", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneTrainer(page, "endspiel");
  const wahl = page.getByTestId("endspiel-wahl");
  {
    const liste = wahl.getByLabel("Was üben?");
    const wert = await liste
      .locator("option", { hasText: /^Mattführung/ })
      .first()
      .getAttribute("value");
    await liste.selectOption(wert ?? "");
  }
  await wahl.getByRole("button", { name: "1", exact: true }).click();
  await wahl.getByRole("button", { name: "Runde starten" }).click();
  const runde = page.getByTestId("trainerrunde");
  await expect(runde).toContainText("Aufgabe 1 von 6");
  await expect(page.getByTestId("endspiel-auftrag")).toContainText(/Gewinne|Halte/);
  await runde.getByRole("button", { name: "Hinweis 1" }).click();
  await expect(page.getByTestId("endspiel-merksatz")).toContainText("Merksatz:");
  // Hinweis 3 zeigt den Zug der Engine als goldenen Pfeil, auch bei Figurenzügen (Dame, König):
  // Die Engine liefert UCI, der Pfeil braucht die Felder (Befund beim Prüfen von N255, 0.2.95).
  await runde.getByRole("button", { name: "Hinweis 2" }).click();
  await runde.getByRole("button", { name: "Hinweis 3" }).click();
  await expect(page.locator(".trainerrunde .brett svg polygon")).not.toHaveCount(0, {
    timeout: 30_000,
  });
  await page.screenshot({ path: "test-results/bilder/trainer-endspiel.png", fullPage: true });
  await runde.getByRole("button", { name: "Aufgabe abbrechen" }).click();
  await expect(runde.getByRole("status").last()).toContainText("Abgebrochen");
  await runde.getByRole("button", { name: "Weiter" }).click();
  await expect(runde).toContainText("Aufgabe 2 von 6");
});

test("Zielbilanz-Übung: Tabelle für beide Seiten ausfüllen, App zeigt ihre Wertung", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneTrainer(page, "zielbilanz");
  const runde = page.getByTestId("trainerrunde");
  await expect(runde).toContainText("Aufgabe 1 von 5");
  const pruefen = runde.getByRole("button", { name: "Prüfen" });
  await expect(pruefen).toBeDisabled();
  for (const seite of ["white", "black"]) {
    const tabelle = page.getByTestId(`zielbilanz-${seite}`);
    for (const ziel of ["Zentrum", "Entwicklung", "Königssicherheit"]) {
      await tabelle
        .getByRole("group", { name: ziel })
        .getByRole("button", { name: "✓ ja", exact: true })
        .click();
    }
  }
  await pruefen.click();
  await expect(runde.getByText(/^App: (✓ ja|◐ teils|✗ nein)$/)).toHaveCount(6);
  await expect(page.getByTestId("zielbilanz-begruendung")).toBeVisible();
  await page.screenshot({ path: "test-results/bilder/trainer-zielbilanz.png", fullPage: true });
  await runde.getByRole("button", { name: "Weiter" }).click();
  await expect(runde).toContainText("Aufgabe 2 von 5");
});

test("Faktorenbilanz-Trainer: Waagen und ✓ ◐ ✗ wie im Buch, App zeigt ihre Bilanz", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneTrainer(page, "faktorenbilanz");
  const runde = page.getByTestId("trainerrunde");
  await expect(runde).toContainText("Aufgabe 1 von 5");
  const pruefen = runde.getByRole("button", { name: "Prüfen" });
  // R20: Material und Zeit mit der Waage, die sich zur gewählten Seite neigt.
  const material = runde.getByRole("group", { name: "Material", exact: true });
  await material.getByRole("button", { name: "◀ Weiß vorn" }).click();
  await expect(material.getByRole("img", { name: "Weiß liegt vorn" })).toBeVisible();
  await material.getByRole("button", { name: "gerade" }).click();
  await runde
    .getByRole("group", { name: "Zeit", exact: true })
    .getByRole("button", { name: "gerade" })
    .click();
  // Königssicherheit und Aktivität je Seite ✓ ◐ ✗ wie die Tabelle im Buch.
  for (const faktor of ["Königssicherheit", "Aktivität"]) {
    const gruppe = runde.getByRole("group", { name: faktor, exact: true });
    await gruppe.getByRole("button", { name: "Weiß: teils" }).click();
    await expect(pruefen).toBeDisabled();
    await gruppe.getByRole("button", { name: "Schwarz: teils" }).click();
  }
  await pruefen.click();
  // Seit 0.2.61 (W9) mit „Buch:“, wenn die Abbildung eine Faktorenbilanz im Buch hat.
  await expect(runde.getByText(/^(App|Buch): (Weiß|gleich|Schwarz)$/)).toHaveCount(4);
  await expect(page.getByTestId("faktoren-bilanz")).toBeVisible();
  await page.screenshot({ path: "test-results/bilder/trainer-faktoren.png", fullPage: true });
  await runde.getByRole("button", { name: "Weiter" }).click();
  await expect(runde).toContainText("Aufgabe 2 von 5");
});

test("Wiederholung (0.2.90): ein falsch gelöstes Skelett des Strukturerkenners kommt wieder", async ({
  page,
}) => {
  // Fester Zufall (23.10.2026): Mit Math.random kam ab und zu eine Aufgabe, bei der „nichts
  // antippen, ersten Plan-Satz wählen“ richtig ist; dann wird nichts fällig und der Test scheitert.
  await page.addInitScript(() => {
    const MODUL = 2147483647;
    const FAKTOR = 16807;
    let saat = 7;
    Math.random = () => {
      saat = (saat * FAKTOR) % MODUL;
      return (saat - 1) / (MODUL - 1);
    };
  });
  await page.clock.install();
  await starteImBrowser(page);
  await oeffneTrainer(page, "struktur");
  await page.getByTestId("struktur-wahl").getByRole("button", { name: "Runde starten" }).click();
  const runde = page.getByTestId("trainerrunde");
  // Ohne angetippte Felder ist die Leitfrage falsch beantwortet, die Aufgabe also nicht gelöst.
  const dreiSchritte = (await runde.textContent())?.includes("Schritt 1 von 3") ?? false;
  await runde.getByRole("button", { name: "Prüfen" }).click();
  if (dreiSchritte) await runde.getByRole("button", { name: "Prüfen" }).click();
  await runde.locator(".plan-satz").first().click();
  await expect(runde).toContainText("Struktur:");
  await expect(runde).toContainText("Nicht ganz");
  await page.clock.fastForward("48:00:00");
  const leiste = page.getByRole("navigation", { name: "Hauptbereiche" });
  await leiste.getByRole("button", { name: "Buch" }).click();
  await leiste.getByRole("button", { name: "Training" }).click();
  await page
    .getByTestId("faellig")
    .getByRole("button", { name: /Strukturerkenner: 1 fällig/ })
    .click();
  await page.getByTestId("trainer-wiederholung").getByRole("button").click();
  await expect(page.getByTestId("trainerrunde")).toContainText("Aufgabe 1 von 1");
});

test("Endspiel-Kurzübungen (0.2.90): Frage beantworten, Regel des Buches, acht Aufgaben", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneTrainer(page, "endspiel");
  await page.getByRole("button", { name: "Kurzübungen starten" }).click();
  const runde = page.getByTestId("trainerrunde");
  await expect(runde).toContainText("Aufgabe 1 von 8");
  await expect(runde).toContainText("Holt der schwarze König den Bauern ein?");
  await runde.getByRole("button", { name: "Ja, er holt ihn ein" }).click();
  await expect(page.getByTestId("drill-regel")).toContainText("Regel: Kapitel 8, die Quadratregel");
  await page.screenshot({ path: "test-results/bilder/trainer-kurzuebung.png", fullPage: true });
  await runde.getByRole("button", { name: "Weiter" }).click();
  await expect(runde).toContainText("Wer hat die Opposition?");
  await runde.getByRole("button", { name: "Keiner" }).click();
  await expect(page.getByTestId("drill-regel")).toContainText("die Opposition");
});
