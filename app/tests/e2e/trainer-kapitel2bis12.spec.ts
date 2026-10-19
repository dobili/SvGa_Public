/**
 * Oberflächentests der Trainer ab dem Repertoire-Trainer (Kapitel 2 bis 12, AP 13 Teil 3 und
 * Stufe 3): Repertoire, Studien, Zug erraten, Fehlerdatenbank, Denkroutine, Planbilanz,
 * Abweichungsmodus. Seit 0.2.90 aus trainer.spec.ts ausgelagert (Dateien unter 400 Zeilen).
 * Die Aufgaben sind teils zufällig; die Tests lesen dann den Auftrag oder prüfen nur den Ablauf.
 */
import { readFileSync } from "node:fs";
import { expect, test, type Locator, type Page } from "@playwright/test";
import { Chess } from "chessops/chess";
import { parseFen } from "chessops/fen";
import { makeSan } from "chessops/san";
import { makeSquare } from "chessops/util";
import { oeffneTrainer, starteImBrowser } from "./hilfen";

const feld = (page: Page | Locator, name: string) =>
  page.getByRole("button", { name: new RegExp(`^${name}(,|$)`) });

test("Repertoire-Trainer: Spanisch als Weiß, falscher Zug zeigt den Buchzug", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneTrainer(page, "repertoire");
  const wahl = page.getByTestId("repertoire-wahl");
  await wahl.getByLabel("Eröffnung").selectOption({ label: "Die Spanische Partie (Ruy Lopez)" });
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
  const partien = wahl.getByLabel("Partie");
  const opern = await partien
    .locator("option", { hasText: /^Morphys Opernpartie/ })
    .first()
    .getAttribute("value");
  await partien.selectOption(opern ?? "0");
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

test("Denkroutine: eine Minute, dann Kandidaten am Brett; Zurücknehmen", async ({ page }) => {
  await page.clock.install();
  await starteImBrowser(page);
  await oeffneTrainer(page, "denkroutine");
  const runde = page.getByTestId("trainerrunde");
  await expect(runde).toContainText("Aufgabe 1 von 3");
  const brett = runde.getByRole("img", { name: /^Stellung aus Abb\. / });
  const nummer = ((await brett.getAttribute("aria-label")) ?? "").replace("Stellung aus Abb. ", "");
  const weiter = page.getByTestId("denk-weiter");
  await expect(weiter).toBeDisabled();
  await expect(weiter).toContainText("Sekunden nachdenken");
  await page.clock.fastForward(61_000);
  // Danach läuft die Zeit normal weiter (sonst warten Klicks auf Animationsbilder).
  await page.clock.resume();
  await expect(weiter).toBeEnabled();
  await weiter.click();
  // F2 (seit 0.2.117): Kandidat und Antwort am Brett ziehen statt als Text.
  const eingabe = page.getByTestId("denk-eingabe");
  await expect(eingabe).toContainText("Ziehe deinen Kandidaten 1");
  const [erstes] = kandidatenFuer(nummer);
  if (!erstes) throw new Error(`Keine Kandidaten für Abb. ${nummer}`);
  await ziehe(page, erstes.kandidat);
  await expect(eingabe).toContainText("Ziehe jetzt die stärkste Antwort");
  await page.screenshot({ path: "test-results/bilder/trainer-denkroutine.png", fullPage: true });
  await eingabe.getByRole("button", { name: "Letzten Zug zurücknehmen" }).click();
  await expect(eingabe).toContainText("Ziehe deinen Kandidaten 1");
  await expect(page.getByTestId("denk-paare").locator("li")).toHaveCount(0);
});

/** Zug als Start- und Zielfeld. */
interface Felderzug {
  readonly von: string;
  readonly nach: string;
}

/** Ein Zug mit Antwort: Felder zum Tippen (ohne Rochade und Umwandlung). */
interface Kandidatenpaar {
  readonly kandidat: Felderzug;
  readonly antwort: Felderzug;
}

/** Erste Züge ohne Rochade und Umwandlung in einer Stellung. */
function einfacheZuege(pos: Chess): { from: number; to: number }[] {
  return [...pos.allDests()].flatMap(([von, ziele]) =>
    [...ziele]
      .map((nach) => ({ from: von, to: nach }))
      .filter((z) => pos.board.get(z.from)?.role !== "king" || Math.abs(z.to - z.from) <= 9)
      .filter((z) => !makeSan(pos, z).includes("=")),
  );
}

const alsFelder = (z: { from: number; to: number }): Felderzug => ({
  von: makeSquare(z.from),
  nach: makeSquare(z.to),
});

/** Zwei regelgerechte Kandidaten mit je einer Antwort für eine Abbildung (aus den Buchdaten). */
function kandidatenFuer(nummer: string): Kandidatenpaar[] {
  const datei = `public/daten/de/a1/kap${nummer.split(".")[0]?.padStart(2, "0")}.json`;
  const kapitel = JSON.parse(readFileSync(datei, "utf8")) as {
    abbildungen: { id: string; fen: string }[];
  };
  const fen = kapitel.abbildungen.find((a) => a.id === nummer)?.fen ?? "";
  const pos = Chess.fromSetup(parseFen(fen).unwrap()).unwrap();
  const paare: Kandidatenpaar[] = [];
  for (const zug of einfacheZuege(pos)) {
    const danach = pos.clone();
    danach.play(zug);
    const [antwort] = einfacheZuege(danach);
    if (antwort) paare.push({ kandidat: alsFelder(zug), antwort: alsFelder(antwort) });
    if (paare.length === 2) return paare;
  }
  return paare;
}

/** Tippt Start- und Zielfeld eines Zuges auf dem Eingabebrett. */
async function ziehe(page: Page, zug: Felderzug): Promise<void> {
  const eingabe = page.getByTestId("denk-eingabe");
  await feld(eingabe, zug.von).click();
  await feld(eingabe, zug.nach).click();
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
  for (const paar of kandidatenFuer(nummer)) {
    await ziehe(page, paar.kandidat);
    await ziehe(page, paar.antwort);
  }
  await expect(page.getByTestId("denk-paare").locator("li")).toHaveCount(2);
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

test("Abweichungsmodus: Spanisch als Weiß, Engine verlässt das Buch, Antwort wird bewertet", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneTrainer(page, "abweichung");
  const wahl = page.getByTestId("abweichung-wahl");
  await wahl.getByLabel("Eröffnung").selectOption({ label: "Die Spanische Partie (Ruy Lopez)" });
  await wahl.getByRole("button", { name: "Weiß", exact: true }).click();
  await wahl.getByRole("button", { name: "Runde starten" }).click();
  const runde = page.getByTestId("trainerrunde");
  await expect(page.getByTestId("abweichung-zug")).toContainText("Die Engine verlässt das Buch", {
    timeout: 30_000,
  });
  // Ein Randbauernzug ist in den Stellungen der Spanischen Partie nach wenigen Zügen fast immer
  // möglich; geht h2–h3 nicht (Zufallsstellung), dann a2–a3.
  const zuege = page.getByTestId("abweichung-zuege");
  const vorher = (await zuege.textContent()) ?? "";
  await feld(page, "h2").click();
  await feld(page, "h3").click();
  if ((await zuege.textContent()) === vorher) {
    await feld(page, "a2").click();
    await feld(page, "a3").click();
  }
  await expect(runde).toContainText(/[ha]3 ist (eine gute Antwort|ungenau|ein Fehler)/, {
    timeout: 30_000,
  });
  await expect(page.getByTestId("abweichung-einschaetzung")).toContainText("Zielbilanz");
  await page.screenshot({ path: "test-results/bilder/trainer-abweichung.png", fullPage: true });
  await runde.getByRole("button", { name: "Weiter" }).click();
  await expect(runde).toContainText("Aufgabe 2 von 3");
});
