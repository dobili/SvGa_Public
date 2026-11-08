/**
 * Vorprüfung älterer Testpunkte des Autors (0.3.14 bis 0.3.43), Sammeldatei vom 8.11.2026.
 *
 * Rolle im Gesamtbild: Die Punkte N1023, N1064, N1078, N2266, N2309, N2344, N2353, N2361, N2362
 * und N2406 aus
 * docs/AUFGABEN_AUTOR.md lassen sich maschinell belegen; diese Tests halten den Beleg dauerhaft fest,
 * damit der Autor auf dem Handy nur noch Geschmacksfragen prüft. Bildschirmfotos in Handygröße
 * (393 × 851) landen in test-results/vorpruefung/.
 * Abhängigkeiten: hilfen.ts, offlinehilfen.ts.
 */
import { expect, test, type Page } from "@playwright/test";
import {
  oeffneAbbildung,
  oeffneEinstellungen,
  oeffneProfil,
  oeffneTrainer,
  starteImBrowser,
  waehleInZeile,
  waehleWerkzeug,
  warteAufOffline,
} from "./hilfen";
import { gibNetzFrei, sperreNetz } from "./offlinehilfen";
import {
  oeffneSpielen,
  oeffneSpielseite,
  spieleVorschlag,
  startknopf,
  ungewertet,
} from "./spielenhilfen";

/** Ordner der Bildschirmfotos dieser Vorprüfung. */
const BILD = "test-results/vorpruefung";

test.use({ viewport: { width: 393, height: 851 } });

/** Startet die Tour des Bildschirms und gibt je Schritt zurück, ob er ein Ziel hat, und den Text. */
async function tourschritte(page: Page): Promise<{ ziel: boolean; text: string }[]> {
  await page.getByRole("button", { name: /^Tour zu diesem Bildschirm/ }).click();
  const karte = page.getByTestId("tour").getByRole("dialog");
  const schritte: { ziel: boolean; text: string }[] = [];
  const HOECHSTENS = 30;
  for (let nummer = 1; nummer <= HOECHSTENS; nummer += 1) {
    const stand = karte.getByText(new RegExp(`^Schritt ${nummer} von \\d+$`));
    await expect(stand).toBeVisible();
    const anzahl = Number(/von (\d+)/.exec((await stand.textContent()) ?? "")?.[1]);
    schritte.push({
      ziel: (await page.locator(".tour-rahmen").count()) > 0,
      text: (await karte.locator(".tour-text").textContent()) ?? "",
    });
    if (nummer >= anzahl) {
      await karte.getByRole("button", { name: "Fertig" }).click();
      break;
    }
    await karte.getByRole("button", { name: "Weiter" }).click();
  }
  return schritte;
}

test("N2361, N2309: Touren von Profil und Einstellungen zeigen jeden Schritt an einem Ziel", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneProfil(page);
  const profil = await tourschritte(page);
  expect(profil.every((s) => s.ziel)).toBe(true);
  const texte = profil.map((s) => s.text).join(" ");
  for (const teil of [
    "Deine Erfolge",
    "Dein Weg durchs Buch",
    "Deine Themen",
    "Deine Rekorde",
    "Dein Aussehen",
    "als Kacheln",
    "Das ⓘ",
  ]) {
    expect(texte).toContain(teil);
  }
  expect(texte).not.toContain("Reiter Blitz");
  await oeffneEinstellungen(page);
  const einstellungen = await tourschritte(page);
  expect(einstellungen).toHaveLength(7);
  expect(einstellungen.every((s) => s.ziel)).toBe(true);
});

test("N2362: Touren auf Spielen und allen Unterseiten zeigen nur auf Vorhandenes", async ({
  page,
}) => {
  await starteImBrowser(page);
  await page.getByRole("navigation").getByRole("button", { name: "Spielen" }).click();
  expect((await tourschritte(page)).every((s) => s.ziel)).toBe(true);
  for (const kennung of ["gegner", "stufe", "eigene", "frei"]) {
    await page.getByTestId(`spielkachel-${kennung}`).click();
    const schritte = await tourschritte(page);
    expect(schritte.length).toBeGreaterThan(1);
    expect(schritte.every((s) => s.ziel)).toBe(true);
    await page.locator(".kopfzeile").getByRole("button", { name: "Spielen", exact: true }).click();
  }
});

test("N2406: „Los geht's“ aus den Nebenaufgaben öffnet Übung und Checkliste", async ({ page }) => {
  await starteImBrowser(page);
  await page.getByTestId("lernpfad-knopf-buch").click();
  const fenster = page.getByTestId("infofenster");
  await page.getByTestId("nebenaufgaben-1").click();
  await fenster.getByTestId("nebenaufgabe-aufgabe-uebungen-1").getByRole("button").click();
  await fenster.getByRole("button", { name: "Los geht's" }).click();
  // Die Übungen sind durchnummeriert: Kapitel 0 hat 1 bis 3, die erste von Kapitel 1 ist Übung 4.
  await expect(page.getByRole("heading", { name: "Übung 4" })).toBeVisible();
  await page.screenshot({ path: `${BILD}/n2406-uebung.png` });
  // Die Zurück-Taste führt wieder auf den Lernpfad.
  await page.goBack();
  await page.getByTestId("nebenaufgaben-2").click();
  await fenster.getByTestId("nebenaufgabe-aufgabe-lernziele-2").getByRole("button").click();
  await fenster.getByRole("button", { name: "Los geht's" }).click();
  await expect(page.getByRole("heading", { level: 1, name: /Checkliste/ })).toBeVisible();
  await page.screenshot({ path: `${BILD}/n2406-checkliste.png` });
});

test("N2266: Kapitel 1 nennt in „Training und Übungen“ die Trainingsseite der Website", async ({
  page,
}) => {
  await starteImBrowser(page);
  await page
    .getByRole("button", { name: /Kapitel 1\b/ })
    .first()
    .click();
  const karte = page.getByTestId("kapitel-training");
  const link = karte.getByRole("link", { name: "Training zu diesem Kapitel (Website)" });
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute("href", "/training/kap01/");
});

test("N1078, N1064: Lichess-Zusatzaufgaben und Zusatzpartien gehen ohne Netz", async ({
  page,
  context,
}) => {
  await starteImBrowser(page);
  await warteAufOffline(page);
  await sperreNetz(context);
  await page.reload();
  await oeffneTrainer(page, "taktik");
  await waehleInZeile(page, "taktik-quelle", "Zusätzlich Lichess");
  await waehleInZeile(page, "zeile-motiv", /^Matt in einem Zug/);
  await page.getByTestId("taktik-start-runde").click();
  await expect(page.getByTestId("trainerrunde")).toContainText("Aufgabe 1 von");
  await expect(page.getByTestId("zusatz-herkunft")).toBeVisible();
  await oeffneTrainer(page, "zugErraten");
  const liste = page.getByTestId("zugerraten-partieliste");
  for (const quelle of ["Berühmte Partien", "Aktuelle Turniere"]) {
    await waehleInZeile(page, "zugerraten-quelle", quelle);
    await expect(page.getByTestId("zusatzpartie-karte")).toBeVisible();
    await expect.poll(() => liste.locator("option").count()).toBeGreaterThan(1);
  }
  await page.screenshot({ path: `${BILD}/n1064-offline.png` });
  await gibNetzFrei(context);
});

/** So lange darf die Engine für die Kandidaten rechnen (ms), wie in werkzeuge-k6-k12.spec.ts. */
const ENGINE_FRIST_MS = 45_000;
/** Kandidaten an Abb. 12.1 (Lxh7+ und zwei weitere). */
const KANDIDATEN_12_1 = 3;

test("N2344: Abb. 12.1, Kandidaten: jede Zeile bekommt einen Wert der Engine", async ({ page }) => {
  test.setTimeout(ENGINE_FRIST_MS * 2);
  await starteImBrowser(page);
  await oeffneAbbildung(page, "12.1", "12.1");
  await waehleWerkzeug(page, "Kandidaten");
  const engine = page.getByTestId("kandidaten-karte");
  await expect(engine).toContainText("Stellung jetzt", { timeout: ENGINE_FRIST_MS });
  const werte = engine.locator(".kandidat-wert");
  await expect(werte).toHaveCount(KANDIDATEN_12_1);
  for (const wert of await werte.allTextContents()) expect(wert).toMatch(/\d/);
  await engine.screenshot({ path: `${BILD}/n2344-kandidaten.png` });
});

test("N1023: Taktik auf Zeit endet mitten in einer Aufgabe sauber mit dem Ergebnis", async ({
  page,
}) => {
  await page.clock.install();
  await starteImBrowser(page);
  await oeffneTrainer(page, "kurzplaene");
  await page.getByRole("button", { name: /Taktik auf Zeit/ }).click();
  await page.getByRole("button", { name: "Zeitrunde starten" }).click();
  await expect(page.getByTestId("zeitrunde")).toContainText("Noch 2:5");
  // Drei Minuten verstreichen, ohne dass die gerade gezeigte Aufgabe gelöst wird.
  await page.clock.runFor("03:01");
  await expect(page.getByTestId("zeitrunde")).toHaveCount(0);
  await expect(page.getByTestId("zeit-ergebnis")).toHaveText(
    "Zeitrunde vorbei: 0 richtig, 0 falsch.",
  );
  await expect(page.getByRole("button", { name: "Noch eine Zeitrunde" })).toBeVisible();
});

test("N2353: Partiekopf mit Farbe, Eröffnungswort und ⓘ, auch über der Auswertung; zu zweit ohne", async ({
  page,
}) => {
  test.setTimeout(ENGINE_FRIST_MS * 2);
  await starteImBrowser(page);
  await oeffneSpielen(page);
  await ungewertet(page);
  await spieleVorschlag(page);
  const kopf = page.getByTestId("partie-gegnerzeile");
  await expect(kopf.getByRole("img", { name: /^du spielst (Weiß|Schwarz)$/ })).toBeVisible();
  await expect(kopf.getByRole("img", { name: /^Eröffnung: (Praxis|Buch|Gewählt)$/ })).toBeVisible();
  await kopf.getByRole("button", { name: /Gegner, Stufe, Farbe und Eröffnung/ }).click();
  await expect(kopf.locator(".partie-untertitel")).toHaveText(/\(Stufe \d+ · .+\) · du spielst/);
  await kopf.screenshot({ path: `${BILD}/n2353-kopf-info.png` });
  await page.getByRole("button", { name: "Aufgeben" }).click();
  await page.getByRole("button", { name: "Ja, aufgeben" }).click();
  await expect(page.getByTestId("partieende")).toBeVisible({ timeout: ENGINE_FRIST_MS });
  await expect(kopf.getByTestId("partiekopf-portraet")).toBeVisible();
  // Zu zweit: die alte Textzeile, kein Porträt.
  await oeffneSpielen(page);
  await oeffneSpielseite(page, "frei");
  await page.getByRole("switch", { name: "Mensch (beide Seiten selbst)" }).check();
  await startknopf(page).click();
  await expect(page.getByRole("heading", { name: "Partie zu zweit" })).toBeVisible();
  await expect(page.getByTestId("partiekopf-portraet")).toHaveCount(0);
});
