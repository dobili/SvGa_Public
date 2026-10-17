/**
 * Oberflächentests der ersten Trainer (AP 13 Teil 2): Koordinaten (Feld finden, Zug aufschreiben,
 * Gangarten), Zähltrainer (Bilanz, hängende Figuren), Schach-Röntgen-Trainer. Die Aufgaben sind
 * zufällig; die Tests lesen deshalb den Auftrag oder prüfen nur den Ablauf.
 */
import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import { Chess } from "chessops/chess";
import { parseFen } from "chessops/fen";
import { makeSan } from "chessops/san";
import { starteImBrowser } from "./hilfen";

async function oeffneTrainer(page: Page, kennung: string): Promise<void> {
  await page
    .getByRole("navigation", { name: "Hauptbereiche" })
    .getByRole("button", { name: "Training" })
    .click();
  // Ein Trainer für zwei Kapitel (Endspieltrainer) steht zweimal in der Liste: die erste Karte.
  await page
    .getByTestId(`trainer-${kennung}`)
    .first()
    .getByRole("button", { name: "Trainieren" })
    .click();
  await expect(page.getByTestId("trainer")).toBeVisible();
}

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
  await runde
    .getByRole("group", { name: "Angreifer", exact: true })
    .getByRole("button", { name: "1", exact: true })
    .click();
  await runde
    .getByRole("group", { name: "Verteidiger" })
    .getByRole("button", { name: "1", exact: true })
    .click();
  await runde.getByRole("button", { name: "lohnt nicht" }).click();
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
  await wahl.getByRole("button", { name: /^Spieß/ }).click();
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
  await wahl.getByRole("button", { name: /^Mattführung/ }).click();
  await wahl.getByRole("button", { name: "1", exact: true }).click();
  await wahl.getByRole("button", { name: "Runde starten" }).click();
  const runde = page.getByTestId("trainerrunde");
  await expect(runde).toContainText("Aufgabe 1 von 6");
  await expect(page.getByTestId("endspiel-auftrag")).toContainText(/Gewinne|Halte/);
  await runde.getByRole("button", { name: "Hinweis 1" }).click();
  await expect(page.getByTestId("endspiel-merksatz")).toContainText("Merksatz:");
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
        .getByRole("button", { name: "ja", exact: true })
        .click();
    }
  }
  await pruefen.click();
  await expect(runde.getByText(/^App: (ja|teils|nein)$/)).toHaveCount(6);
  await expect(page.getByTestId("zielbilanz-begruendung")).toBeVisible();
  await page.screenshot({ path: "test-results/bilder/trainer-zielbilanz.png", fullPage: true });
  await runde.getByRole("button", { name: "Weiter" }).click();
  await expect(runde).toContainText("Aufgabe 2 von 5");
});

test("Faktorenbilanz-Trainer: vier Faktoren wählen, App zeigt ihre Bilanz", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneTrainer(page, "faktorenbilanz");
  const runde = page.getByTestId("trainerrunde");
  await expect(runde).toContainText("Aufgabe 1 von 5");
  for (const faktor of ["Material", "Zeit", "Königssicherheit", "Aktivität"]) {
    await runde
      .getByRole("group", { name: faktor, exact: true })
      .getByRole("button", { name: "gleich" })
      .click();
  }
  await runde.getByRole("button", { name: "Prüfen" }).click();
  // Seit 0.2.61 (W9) mit „Buch:“, wenn die Abbildung eine Faktorenbilanz im Buch hat.
  await expect(runde.getByText(/^(App|Buch): (Weiß|gleich|Schwarz)$/)).toHaveCount(4);
  await expect(page.getByTestId("faktoren-bilanz")).toBeVisible();
  await page.screenshot({ path: "test-results/bilder/trainer-faktoren.png", fullPage: true });
  await runde.getByRole("button", { name: "Weiter" }).click();
  await expect(runde).toContainText("Aufgabe 2 von 5");
});

test("Repertoire-Trainer: Spanisch als Weiß, falscher Zug zeigt den Buchzug", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneTrainer(page, "repertoire");
  const wahl = page.getByTestId("repertoire-wahl");
  await wahl.getByRole("button", { name: "Die Spanische Partie (Ruy Lopez)" }).click();
  await wahl.getByRole("button", { name: "Weiß", exact: true }).click();
  await wahl.getByRole("button", { name: "Runde starten" }).click();
  const runde = page.getByTestId("trainerrunde");
  await expect(runde).toContainText("Aufgabe 1 von");
  await feld(page, "e2").click();
  await feld(page, "e4").click();
  await expect(page.getByTestId("repertoire-zuege")).toHaveText("1. e4 e5");
  // Falsch: 2. d4 statt 2. Sf3.
  await feld(page, "d2").click();
  await feld(page, "d4").click();
  await expect(runde).toContainText("Nicht der Zug des Buches");
  await feld(page, "g1").click();
  await feld(page, "f3").click();
  await expect(page.getByTestId("repertoire-zuege")).toHaveText("1. e4 e5 2. Sf3 Sc6");
  await page.screenshot({ path: "test-results/bilder/trainer-repertoire.png", fullPage: true });
});

test("Studien lösen: Saavedra-Studie, 1. c7 und die Antwort aus dem Buch", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneTrainer(page, "studien");
  const runde = page.getByTestId("trainerrunde");
  await expect(runde).toContainText("Die Saavedra-Studie");
  await page
    .getByTestId("studien-pruefungen")
    .getByText(/vier Prüfungen/)
    .click();
  await expect(page.getByTestId("studien-pruefungen")).toContainText("Unterverwandlung");
  await feld(page, "c6").click();
  await feld(page, "c7").click();
  await expect(page.getByTestId("repertoire-zuege")).toContainText("1. c7");
  await page.screenshot({ path: "test-results/bilder/trainer-studien.png", fullPage: true });
});

test("Zug erraten: Opernpartie als Weiß, Treffer und aufgedeckter Partiezug", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneTrainer(page, "zugErraten");
  const wahl = page.getByTestId("zugerraten-wahl");
  await wahl.getByRole("button", { name: /^Morphys Opernpartie/ }).click();
  await wahl.getByRole("button", { name: "Runde starten" }).click();
  const runde = page.getByTestId("trainerrunde");
  await feld(page, "e2").click();
  await feld(page, "e4").click();
  await expect(runde).toContainText("Getroffen!");
  await expect(page.getByTestId("zugerraten-stand")).toHaveText("Getroffen: 1 von 1");
  await feld(page, "d2").click();
  await feld(page, "d4").click();
  await expect(runde).toContainText("In der Partie geschah Sf3.");
  await expect(page.getByTestId("zugerraten-stand")).toHaveText("Getroffen: 1 von 2");
  // W12: Die Engine vergleicht 2. d4 mit 2. Sf3, dazu die Frage aus Kapitel 12.
  const vergleich = page.getByTestId("zugerraten-vergleich");
  await expect(vergleich).toContainText("warum der Meister anders zog");
  await expect(vergleich).toContainText(/Dein Zug ist laut Engine/, { timeout: 20_000 });
  await page.screenshot({ path: "test-results/bilder/trainer-zugerraten.png", fullPage: true });
});

test("Fehlerdatenbank: Eintrag mit FEN, Auswertung mit Vorschlag, Löschen", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneTrainer(page, "fehlerdatenbank");
  await expect(page.getByTestId("fehlerdb-leer")).toBeVisible();
  const neu = page.getByTestId("fehlerdb-neu");
  await neu
    .getByLabel("Stellung vor dem Fehler (FEN)")
    .fill("rnbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR b KQkq - 0 2");
  await neu.getByLabel(/^Fehlerart/).selectOption({ index: 2 });
  await neu.getByLabel(/^Ein Satz/).fill("Nach f3 und g4 nicht an Dh4 gedacht.");
  await neu.getByRole("button", { name: "In die Fehlerdatenbank" }).click();
  const auswertung = page.getByTestId("fehlerdb-auswertung");
  await expect(auswertung).toContainText("Kapitel 1");
  await expect(auswertung.getByRole("button")).toHaveCount(1);
  const eintrag = page.getByTestId("fehlerdb-eintrag");
  await expect(eintrag).toHaveCount(1);
  await eintrag.locator("summary").click();
  await expect(eintrag).toContainText("Nach f3 und g4 nicht an Dh4 gedacht.");
  await page.screenshot({
    path: "test-results/bilder/trainer-fehlerdatenbank.png",
    fullPage: true,
  });
  await eintrag.getByRole("button", { name: "Eintrag löschen" }).click();
  await expect(page.getByTestId("fehlerdb-leer")).toBeVisible();
});

test("Denkroutine: eine Minute, dann Eingabe; ohne Antwort unvollständig", async ({ page }) => {
  await page.clock.install();
  await starteImBrowser(page);
  await oeffneTrainer(page, "denkroutine");
  const runde = page.getByTestId("trainerrunde");
  await expect(runde).toContainText("Aufgabe 1 von 3");
  const weiter = page.getByTestId("denk-weiter");
  await expect(weiter).toBeDisabled();
  await expect(weiter).toContainText("Sekunden nachdenken");
  await page.clock.fastForward(61_000);
  // Danach läuft die Zeit normal weiter (sonst warten Klicks auf Animationsbilder).
  await page.clock.resume();
  await expect(weiter).toBeEnabled();
  await weiter.click();
  await runde.getByLabel("Kandidat 1", { exact: true }).fill("Zz9");
  await runde.getByRole("button", { name: "Prüfen" }).click();
  await expect(page.getByTestId("denk-pruefung")).toContainText("ist hier kein regelgerechter Zug");
  await expect(page.getByTestId("denk-pruefung")).toContainText("Kandidat 2 fehlt.");
  await expect(runde).toContainText("Zu jedem Kandidaten gehört die stärkste Antwort");
  await page.screenshot({ path: "test-results/bilder/trainer-denkroutine.png", fullPage: true });
  await runde.getByRole("button", { name: "Weiter" }).click();
  await expect(runde).toContainText("Aufgabe 2 von 3");
});

/** Zwei regelgerechte Kandidaten mit je einer Antwort für eine Abbildung (aus den Buchdaten). */
function kandidatenFuer(nummer: string): [string, string][] {
  const datei = `public/daten/de/a1/kap${nummer.split(".")[0]?.padStart(2, "0")}.json`;
  const kapitel = JSON.parse(readFileSync(datei, "utf8")) as {
    abbildungen: { id: string; fen: string }[];
  };
  const fen = kapitel.abbildungen.find((a) => a.id === nummer)?.fen ?? "";
  const pos = Chess.fromSetup(parseFen(fen).unwrap()).unwrap();
  const paare: [string, string][] = [];
  for (const [von, ziele] of pos.allDests()) {
    for (const nach of ziele) {
      const zug = { from: von, to: nach };
      const danach = pos.clone();
      const san = makeSan(pos, zug);
      danach.play(zug);
      const antwort = [...danach.allDests()].flatMap(([v, z]) =>
        [...z].map((n) => ({ from: v, to: n })),
      )[0];
      if (antwort && !san.includes("=")) paare.push([san, makeSan(danach, antwort)]);
      if (paare.length === 2) return paare;
    }
  }
  return paare;
}

test("Denkroutine: zwei Kandidaten mit Antwort, Vergleich mit der Engine", async ({ page }) => {
  await page.clock.install();
  await starteImBrowser(page);
  await oeffneTrainer(page, "denkroutine");
  const runde = page.getByTestId("trainerrunde");
  const brett = runde.getByRole("img", { name: /^Stellung aus Abb\. / });
  const nummer = ((await brett.getAttribute("aria-label")) ?? "").replace("Stellung aus Abb. ", "");
  await page.clock.fastForward(61_000);
  await page.clock.resume();
  await page.getByTestId("denk-weiter").click();
  for (const [i, [kandidat, antwort]] of kandidatenFuer(nummer).entries()) {
    await runde.getByLabel(`Kandidat ${i + 1}`, { exact: true }).fill(kandidat);
    await runde.getByLabel(`Stärkste Antwort auf Kandidat ${i + 1}`).fill(antwort);
  }
  await runde.getByRole("button", { name: "Prüfen" }).click();
  await expect(page.getByTestId("denk-pruefung")).toContainText("vollständig");
  const vergleich = page.getByTestId("denk-vergleich");
  await expect(vergleich).toContainText("Bester Zug laut Engine", { timeout: 30_000 });
  await expect(vergleich).toContainText("Dein Kandidat");
  await expect(runde.getByRole("button", { name: "Weiter" })).toBeVisible();
});

test("Planbilanz-Übung: Planfragen, LAP und Wettrennen", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneTrainer(page, "planbilanz");
  await page.getByRole("button", { name: /Drei Planfragen/ }).click();
  const runde = page.getByTestId("trainerrunde");
  await expect(runde).toContainText("Aufgabe 1 von 4");
  for (const gruppe of await runde.locator(".antworten").all()) {
    await gruppe.getByRole("button").first().click();
  }
  await expect(runde.getByRole("button", { name: "Weiter" })).toBeVisible();
  await page.screenshot({ path: "test-results/bilder/trainer-planfragen.png", fullPage: true });
  await page.getByRole("button", { name: "Training" }).first().click();
  await oeffneTrainer(page, "planbilanz");
  await page.getByRole("button", { name: /Wettrennen der Bauern/ }).click();
  for (const seite of ["Weiß", "Schwarz"]) {
    await runde.getByRole("group", { name: seite }).getByRole("button", { name: "2" }).click();
  }
  await runde.getByRole("button", { name: "Prüfen" }).click();
  await expect(runde).toContainText(/schneller|gleich viele/);
  await page.getByRole("button", { name: "Training" }).first().click();
  await oeffneTrainer(page, "planbilanz");
  await page.getByRole("button", { name: /LAP/ }).click();
  await feld(page, "a1").click();
  await feld(page, "h8").click();
  await runde.getByRole("button", { name: "Prüfen" }).click();
  await expect(runde).toContainText("Nach dem LAP-Prinzip");
});
