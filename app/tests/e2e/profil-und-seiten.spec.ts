/**
 * Profil, Lernpfad, Touren und Seiten in Zuständen aus dem Speicher (Vortest der offenen
 * Testpunkte, 17.11.2026): Warum-Fragen und Lernziele im Lernpfad (N2593), Kennzahlen, Ring der
 * Trainer und Tour im Profil (N2374, N2412, N2361), Ziele der Touren auf Spielen (N2362), die
 * Kapitelseite bei 150 % Schrift (N2446), „Lizenzen“ in den Fußzeilen der Website (N2423), neue
 * Lizenzeinträge auf Englisch (N2424) und „Zuletzt gespielt“ mit Revanche (N2339).
 */
import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import { eintrag, spielePartienEin } from "./auswertungpartie";
import { oeffneEinstellungen, oeffneProfil, starteImBrowser } from "./hilfen";
import { oeffneSpielen, oeffneSpielseite } from "./spielenhilfen";
import { gesehenFuer, setzeDaten } from "./zustand";

const LERNZIELE_KAPITEL_0 = [0, 1, 2, 3, 4, 5, 6, 7];
const GROSSE_SCHRIFT = "150";
const HOECHSTENS_SCHRITTE = 40;

function geloesteUebungen(kapitel: number) {
  const datei = new URL(`../../public/daten/de/a1/kap0${kapitel}.json`, import.meta.url);
  const daten = JSON.parse(readFileSync(datei, "utf-8")) as { uebungen: { id: string }[] };
  return Object.fromEntries(
    daten.uebungen.map((u) => [
      u.id,
      { kapitel, versuche: 1, geloest: true, zuletzt: "2026-11-10T09:00:00Z" },
    ]),
  );
}

async function schliesseFeiern(seite: Page): Promise<void> {
  const feier = seite.getByTestId("ringfeier");
  for (let i = 0; i < 5; i++) {
    await seite.waitForTimeout(800);
    if ((await feier.count()) === 0) return;
    await feier.getByRole("button", { name: "Weiter" }).click();
  }
}

/** Geht eine Tour durch und gibt je Schritt zurück, ob er ein Ziel hervorhebt, und seinen Text. */
async function tourschritte(seite: Page): Promise<{ ziel: boolean; text: string }[]> {
  await seite.getByRole("button", { name: /^Tour zu diesem Bildschirm/ }).click();
  const karte = seite.getByTestId("tour");
  const schritte: { ziel: boolean; text: string }[] = [];
  for (let i = 0; i < HOECHSTENS_SCHRITTE; i++) {
    const text = (await karte.locator(".tour-text").textContent()) ?? "";
    schritte.push({ ziel: (await seite.locator(".tour-rahmen").count()) > 0, text });
    const fertig = karte.getByRole("button", { name: "Fertig" });
    if (await fertig.count()) {
      await fertig.click();
      break;
    }
    await karte.getByRole("button", { name: "Weiter" }).click();
  }
  return schritte;
}

test("Lernpfad: Warum-Fragen und Lernziele von Kapitel 1 sinken je um eins (N2593)", async ({
  page,
}) => {
  await starteImBrowser(page);
  const basis = {
    gesehen: gesehenFuer([0, 1]),
    uebungen: geloesteUebungen(0),
    trainer: {},
    warum: {},
    eingeschaetzt: {},
  };
  await setzeDaten(page, { fortschritt: basis, lernstand: { 0: LERNZIELE_KAPITEL_0 } });
  await schliesseFeiern(page);
  await page.getByTestId("lernpfad-knopf-buch").click();
  const kopf = page.locator(".lernpfadkopf");
  await expect(kopf).toContainText("18 Warum-Fragen");
  await expect(kopf).toContainText("6 Lernziele");
  await setzeDaten(page, {
    fortschritt: { ...basis, warum: { "1.6": [0] } },
    lernstand: { 0: LERNZIELE_KAPITEL_0, 1: [0] },
  });
  await schliesseFeiern(page);
  await page.getByTestId("lernpfad-knopf-buch").click();
  await expect(kopf).toContainText("17 Warum-Fragen");
  await expect(kopf).toContainText("5 Lernziele");
});

test("Profil: Kennzahlen, Ring der Trainer bis 17, Tour mit allen Karten (N2374, N2412, N2361)", async ({
  page,
}) => {
  await starteImBrowser(page);
  const uebung = { kapitel: 1, versuche: 1, geloest: true, zuletzt: "2026-11-10T09:00:00Z" };
  await setzeDaten(page, {
    fortschritt: {
      gesehen: {},
      uebungen: { "ueb:droh-ignorieren": uebung },
      trainer: {},
      warum: { "1.6": [0] },
      eingeschaetzt: {},
    },
  });
  await oeffneProfil(page);
  const kennzahlen = page.getByTestId("fortschritt-kennzahlen").locator("li");
  await expect(kennzahlen).toHaveCount(3);
  await expect(kennzahlen.nth(0)).toContainText("1Übungen gelöst");
  await expect(kennzahlen.nth(1)).toHaveClass(/leer/);
  await expect(kennzahlen.nth(2)).toContainText("1Warum-Fragen");
  await expect(
    page
      .getByTestId("ich-fortschritt")
      .getByRole("button", { name: "Trainings erstmalig absolviert: 0 von 17" }),
  ).toBeVisible();
  const texte = (await tourschritte(page)).map((s) => s.text).join(" ");
  for (const teil of [
    "Deine Erfolge",
    "Dein Weg durchs Buch",
    "Deine Themen",
    "Deine Rekorde",
    "Dein Aussehen",
  ]) {
    expect(texte).toContain(teil);
  }
  expect(texte).toContain("als Kacheln");
  expect(texte).not.toContain("Reiter „Blitz");
});

test("Spielen: jeder Tourschritt auf jeder Seite hebt ein Ziel hervor (N2362)", async ({
  page,
}) => {
  await starteImBrowser(page);
  for (const seite of [null, "gegner", "stufe", "eigene", "frei"]) {
    await oeffneSpielen(page);
    if (seite) await oeffneSpielseite(page, seite);
    const ohneZiel = (await tourschritte(page)).filter((s) => !s.ziel).map((s) => s.text);
    expect(ohneZiel, `Seite ${seite ?? "Spielen"}`).toEqual([]);
  }
});

test("Kapitelseite bei 150 % Schrift: nichts ragt über den Rand (N2446)", async ({ page }) => {
  await page.addInitScript(
    (wert) => window.localStorage.setItem("svga.schriftgroesse", wert),
    GROSSE_SCHRIFT,
  );
  await starteImBrowser(page);
  await page
    .locator(".kapitelliste")
    .getByRole("button", { name: /Dein Einstieg ins Schachbuch/ })
    .click();
  await expect(page.getByRole("button", { name: "Alle abhaken" })).toBeVisible();
  const breite = await page.evaluate(() => ({
    inhalt: document.documentElement.scrollWidth,
    fenster: window.innerWidth,
  }));
  expect(breite.inhalt).toBeLessThanOrEqual(breite.fenster);
  for (const name of ["Alle abhaken", "Alle zurücksetzen"]) {
    const kasten = await page.getByRole("button", { name }).boundingBox();
    if (kasten) expect(kasten.x + kasten.width).toBeLessThanOrEqual(breite.fenster);
  }
});

test("Website: Fußzeile der Trainingsseite und des Datenschutzes nennt „Lizenzen“ (N2423)", async ({
  page,
}) => {
  for (const pfad of ["/training/", "/datenschutz/"]) {
    await page.goto(pfad);
    await expect(page.locator("footer").getByRole("link", { name: "Lizenzen" })).toBeVisible();
  }
});

test("Lizenzen auf Englisch: die neuen Einträge (N2424)", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneEinstellungen(page);
  await page.getByRole("tab", { name: "Anzeige" }).click();
  await page.getByRole("radio", { name: "English (preview)" }).click();
  // Ohne Neuladen springen: Die Sprache „English (preview)“ gilt nur bis zum Neuladen.
  await page.evaluate(() => {
    window.location.hash = "#lizenzen";
  });
  for (const eintragName of [
    "Included in onnxruntime-web: protobuf.js, long.js, FlatBuffers, guid-typescript",
    "Libraries in the WebAssembly runtime of onnxruntime",
    "Typeface Source Serif 4 (Adobe)",
    "Common opening moves “From practice”",
    "Helper code of the build tools",
  ]) {
    await expect(page.getByText(eintragName, { exact: false }).first()).toBeVisible();
  }
});

test("Spielen: „Zuletzt gespielt“ mit Ergebnis, Revanche schlägt denselben Bot vor (N2339)", async ({
  page,
}) => {
  await starteImBrowser(page);
  const basis = eintrag();
  const heute = new Date().toISOString();
  const mitUhr = { grundzeitMs: 600_000, zuschlagMs: 0 };
  const partie = (id: string, bot: string, botName: string) => ({
    ...basis,
    partie: {
      ...basis.partie,
      id,
      begonnen: heute,
      einstellung: { ...basis.partie.einstellung, bot, botName, uhr: mitUhr },
    },
  });
  await spielePartienEin(page, [partie("z1", "derya", "Derya"), partie("z2", "tom", "Tom")]);
  await oeffneSpielen(page);
  const zuletzt = page.getByTestId("zuletzt-gespielt");
  await expect(zuletzt).toContainText("Derya");
  await expect(zuletzt).toContainText("heute · 10 + 0");
  await zuletzt
    .getByRole("button", { name: /Revanche/ })
    .first()
    .click();
  const vorschlag = page.getByTestId("vorschlagskarte");
  await expect(vorschlag).toContainText("dein gewählter Gegner");
  await expect(vorschlag).toContainText("Derya");
  await expect(vorschlag).toContainText("10 + 0");
});
