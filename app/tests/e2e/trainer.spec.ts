/**
 * Oberflächentests der ersten Trainer (AP 13 Teil 2): Koordinaten (Feld finden, Zug aufschreiben,
 * Gangarten), Zähltrainer (Bilanz, hängende Figuren), Schach-Röntgen-Trainer. Die Aufgaben sind
 * zufällig; die Tests lesen deshalb den Auftrag oder prüfen nur den Ablauf. Dazu Taktik, Falle
 * oder Köder, Strukturerkenner, Wiederholung, Endspiel, Zielbilanz und Faktorenbilanz; die übrigen
 * Trainer stehen seit 0.2.90 in trainer-kapitel2bis12.spec.ts.
 */
import { expect, test, type Locator, type Page } from "@playwright/test";
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
  // Seit dem Nebenchat (30.10.2026) Bausteine statt Handytastatur: „K“, „a“, „1“.
  const tastatur = page.getByTestId("notationstastatur");
  await tastatur.getByRole("button", { name: "K", exact: true }).click();
  await tastatur.getByRole("button", { name: "a", exact: true }).click();
  await tastatur.getByRole("button", { name: "1", exact: true }).click();
  await expect(tastatur).toContainText("Ka1");
  await page.getByRole("button", { name: "Prüfen" }).click();
  await expect(page.getByTestId("trainer")).toContainText("Das Buch schreibt");
  await page.screenshot({ path: "test-results/bilder/notationstastatur.png", fullPage: true });
});

test("Zug aufschreiben: umschaltbar auf das Eingabefeld", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneTrainer(page, "koordinaten");
  await page.getByRole("button", { name: /Zug aufschreiben/ }).click();
  await page.getByRole("button", { name: "Lieber mit der Tastatur tippen" }).click();
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
  // Seit dem Nebenchat: Zu jedem übersehenen Feld steht der Grund da.
  await expect(page.getByTestId("gangart-begruendung")).toContainText("Dorthin darf die Figur");
  await page.getByRole("button", { name: "Weiter" }).click();
  await expect(page.getByText("Aufgabe 2 von 8")).toBeVisible();
});

test("Zähltrainer: Bilanz zählen zeigt die Rechnung der App", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneTrainer(page, "zaehlen");
  await page.getByRole("button", { name: /Bilanz zählen/ }).click();
  const runde = page.getByTestId("trainerrunde");
  // Seit dem Nebenchat (30.10.2026): Ein Tipp auf das Ergebnis prüft sofort.
  await runde.getByTestId("zaehl-ergebnisse").getByRole("button", { name: "lohnt nicht" }).click();
  await expect(page.getByTestId("zaehl-rechnung")).toBeVisible();
  await page.screenshot({ path: "test-results/bilder/trainer-zaehlen.png", fullPage: true });
  await page.getByRole("button", { name: "Weiter" }).click();
  // Genauer Modus: Angreifer und Verteidiger mit „−“ und „+“, dann Prüfen.
  await runde.getByRole("button", { name: /Genauer üben/ }).click();
  await runde.getByRole("button", { name: "Angreifer: eins mehr" }).click();
  await runde.getByRole("button", { name: "Verteidiger: eins mehr" }).click();
  await runde.getByTestId("zaehl-ergebnisse").getByRole("button", { name: "+1" }).click();
  await runde.getByRole("button", { name: "Prüfen" }).click();
  await expect(page.getByTestId("zaehl-rechnung")).toBeVisible();
});

test("Schach-Röntgen-Trainer: drei Schritte, dann Weiter", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneTrainer(page, "roentgen");
  await page.getByTestId("roentgen-wahl").getByRole("button", { name: "schwer" }).click();
  await page.getByRole("button", { name: "Runde starten" }).click();
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

test("Taktiktrainer: ein Motiv wählen, Hilfen, Lösung zeigen, ohne Motivfrage", async ({
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
  // Nur ein Motiv gewählt: Die Frage nach dem Motiv entfällt (R30).
  await expect(page.getByTestId("motiv-benennen")).toHaveCount(0);
  await page.screenshot({ path: "test-results/bilder/trainer-taktik.png", fullPage: true });
  await runde.getByRole("button", { name: "Weiter" }).click();
  await expect(runde).toContainText("Aufgabe 2 von 8");
});

test("Falle oder Köder: Warnsignale als Hinweis vorher, danach Lösung mit Balken", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneTrainer(page, "falle");
  await page.getByTestId("falle-wahl").getByRole("button", { name: "Runde starten" }).click();
  const runde = page.getByTestId("trainerrunde");
  await expect(runde).toContainText("Der Gegner hat gerade");
  await expect(runde).toContainText("Falle oder Geschenk?");
  // Seit dem Nebenchat (30.10.2026): Die Warnsignale sind vorher ein freiwilliger Hinweis.
  await expect(page.getByTestId("falle-warnsignale")).toHaveCount(0);
  await runde.getByRole("button", { name: "Hinweis: Warnsignale zeigen" }).click();
  await expect(page.getByTestId("falle-warnsignale")).toBeVisible();
  await runde.getByRole("button", { name: "Nicht nehmen" }).click();
  await expect(runde).toContainText(/Eine Falle|Ein Geschenk/);
  // Danach nur die Lösung: Fortsetzung mit Bewertungsbalken, keine Warnsignal-Marken mehr.
  await expect(page.getByTestId("falle-warnsignale")).toHaveCount(0);
  await expect(runde).toContainText("Fortsetzung laut Engine:");
  const folge = page.getByTestId("falle-folge");
  await expect(folge.getByTestId("bewertungsbalken")).toBeVisible();
  await folge.getByRole("button", { name: "Einen Zug vor" }).click();
  await page.screenshot({ path: "test-results/bilder/trainer-falle.png", fullPage: true });
  await runde.getByRole("button", { name: "Weiter" }).click();
  await expect(runde).toContainText("Aufgabe 2 von 8");
});

/**
 * Strukturerkenner: die Schritte vor der Planwahl durchklicken (Prüfen ohne Felder; bei der
 * Feldart-Frage die erste Art), bis „Welcher Plan passt“ dasteht (R49: zwei bis vier Schritte).
 */
async function schritteBisZumPlan(runde: Locator): Promise<void> {
  const HOECHSTENS_SCHRITTE = 4;
  const plan = runde.getByText("Welcher Plan passt");
  const pruefen = runde.getByRole("button", { name: "Prüfen" });
  const loch = runde.getByRole("button", { name: "Loch", exact: true });
  for (let i = 0; i < HOECHSTENS_SCHRITTE; i++) {
    // Warten, bis der nächste Schritt (oder die Planwahl) da ist, sonst klickt der Test ins Leere.
    await expect(plan.or(pruefen).or(loch).first()).toBeVisible();
    if ((await plan.count()) > 0) return;
    if ((await pruefen.count()) > 0) await pruefen.click();
    else await loch.click();
  }
}

test("Strukturerkenner: starke Felder und schwache Bauern prüfen, Plan wählen", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneTrainer(page, "struktur");
  await page.getByTestId("struktur-wahl").getByRole("button", { name: "Runde starten" }).click();
  const runde = page.getByTestId("trainerrunde");
  await expect(runde).toContainText(/Schritt 1 von [234]/);
  // R49: echte Stellung, Skelett per Knopf.
  await runde.getByRole("button", { name: "Nur das Skelett zeigen" }).click();
  await expect(runde.getByRole("button", { name: "Alle Figuren zeigen" })).toBeVisible();
  // W5/R49: Tipp-Schritte (starke Felder, schwache Bauern), dann je nach Stellung die Feldart.
  await schritteBisZumPlan(runde);
  await expect(runde).toContainText("Welcher Plan passt");
  await runde.locator(".plan-satz").first().click();
  await expect(runde).toContainText("Struktur:");
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
  // Die Karte des Trainers trägt die Plakette „1 fällig“ (Training neu, 31.10.2026).
  await page
    .getByTestId("trainer-taktik")
    .getByRole("button", { name: /1 fällig/ })
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
  // Seit dem Nebenchat (Punkt B3): Die Engine urteilt mit, Balken und Fortsetzung zum Durchspielen.
  await expect(page.getByTestId("engine-einschaetzung")).toContainText("Nach der Bilanz", {
    timeout: 30_000,
  });
  await expect(page.getByTestId("engine-folge").getByTestId("bewertungsbalken")).toBeVisible();
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
  await schritteBisZumPlan(runde);
  await runde.locator(".plan-satz").first().click();
  await expect(runde).toContainText("Struktur:");
  await expect(runde).toContainText("Nicht ganz");
  await page.clock.fastForward("48:00:00");
  const leiste = page.getByRole("navigation", { name: "Hauptbereiche" });
  await leiste.getByRole("button", { name: "Buch" }).click();
  await leiste.getByRole("button", { name: "Training" }).click();
  // Die Karte des Trainers trägt die Plakette „1 fällig“ (Training neu, 31.10.2026).
  await page
    .getByTestId("trainer-struktur")
    .getByRole("button", { name: /1 fällig/ })
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
