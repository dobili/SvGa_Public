/**
 * Oberflächentests für den Variationsbrowser, Stufe 1 (1.11.2026): Variante aus Abb. 2.40,
 * Abzweig anlegen, blaue Fortsetzungspfeile, Kommentar, Hauptvariante, ab hier löschen mit
 * Rückgängig, PGN-Export und -Import, Neuladen behält alles; Laden aus jeder Quelle; Sicherung im
 * Format 7 einspielen; Sicherung aus einer neueren App abgewiesen; Grenze; zwei Tabs.
 */
import { readFile } from "node:fs/promises";
import { expect, test, type Page } from "@playwright/test";
import { oeffneAbbildung, oeffneEinstellungsseite, oeffneProfil, starteImBrowser } from "./hilfen";

const GRUND = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
/** So lange darf das Einlesen einer Partie samt Auswertung dauern (ms). */
const AUSWERTUNG_FRIST = 30_000;

/** Öffnet die Liste „Varianten“ über die Kachel im Training. */
async function oeffneVarianten(seite: Page): Promise<void> {
  await seite.getByRole("navigation").getByRole("button", { name: "Training" }).click();
  await seite.getByTestId("kachel-varianten").getByRole("button").click();
  await expect(seite.getByRole("heading", { name: "Varianten", level: 1 })).toBeVisible();
}

/** Zieht von Feld zu Feld durch zwei Tipps aufs Brett. */
async function ziehe(seite: Page, von: string, nach: string): Promise<void> {
  const tasten = seite.locator(".bildschirm-variante .brett-tasten");
  await tasten.locator(`button[aria-label^="${von}"]`).click();
  await tasten.locator(`button[aria-label^="${nach}"]`).click();
}

/** Spielt eine Sicherung ein (Deine Daten), nach der Rückfrage. */
async function spieleEin(seite: Page, daten: object, version = "0.3.44"): Promise<void> {
  await oeffneEinstellungsseite(seite, "Deine Daten");
  const datei = {
    art: "schach-von-grund-auf/nutzerdaten",
    appVersion: version,
    exportiert: "2026-10-30T10:00:00.000Z",
    daten,
  };
  await seite.getByTestId("sicherung-datei").setInputFiles({
    name: "sicherung.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(datei)),
  });
}

test("Variante aus Abb. 2.40: Abzweig, Pfeile, Kommentar, Hauptvariante, Löschen, PGN, Neuladen", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneVarianten(page);
  await expect(page.getByTestId("varianten-leer")).toBeVisible();
  await page.getByRole("button", { name: "Buch" }).click();
  await oeffneAbbildung(page, "2.40", "2.40");
  await page.getByTestId("gabelschalter").click();
  await expect(page.getByTestId("variantenstatus")).toContainText("Entwurf");
  // Am Abzweig nach 3. Sxe5: zwei Chips und zwei blaue Pfeile (Stern und „2“).
  await expect(page.getByTestId("weiterchips").getByRole("button")).toHaveCount(2);
  await expect(page.getByTestId("fortsetzungspfeil")).toHaveCount(2);
  await expect(page.locator(".fortsetzungspfeile text").first()).toHaveText("★");
  // Eigener Zug 3... De7 wird dritte Fortsetzung und speichert die Variante.
  await ziehe(page, "d8", "e7");
  await expect(page.getByTestId("variantenstatus")).toContainText("Gespeichert");
  await expect(page.getByTestId("variantenzeile").locator(".gabelmarke")).toContainText("3");
  await expect(page.getByTestId("variantenzeile").locator(".zug.eigen")).toHaveText("De7");
  // Kommentar zum Zug, gespeichert beim Verlassen des Feldes.
  await page.getByRole("button", { name: "+ Notiz zu diesem Zug" }).click();
  await page.getByLabel("Kommentar zum Zug").fill("Dame deckt e5");
  await page.getByTestId("variantenstatus").click();
  await expect(page.getByTestId("kommentarzeile")).toContainText("Dame deckt e5");
  // Zur Hauptvariante machen über das Menü am Zug.
  await page.getByRole("button", { name: "Menü am Zug" }).click();
  await page.getByRole("button", { name: "Zur Hauptvariante machen" }).click();
  await page.getByRole("button", { name: "Zum Anfang" }).click();
  await page.getByRole("button", { name: "Zum Ende" }).click();
  await expect(page.getByTestId("variantenzeile")).toContainText(/Sxe5 ?3 De7/);
  await expect(page.getByTestId("kommentarzeile")).toContainText("Dame deckt e5");

  // Neuladen: Liste mit einer Variante, Kommentar und Hauptvariante bleiben.
  await page.reload();
  await oeffneVarianten(page);
  await expect(page.getByTestId("kachel-varianten")).toHaveCount(0);
  const karte = page.getByTestId("variantenkarte");
  await expect(karte).toHaveCount(1);
  await expect(karte).toContainText("Abb. 2.40");
  await karte.getByRole("button").click();
  await page.getByRole("button", { name: "Zum Ende" }).click();
  await expect(page.getByTestId("kommentarzeile")).toContainText("Dame deckt e5");

  // Ab hier löschen und Rückgängig.
  await page.getByRole("button", { name: "Menü am Zug" }).click();
  await page.getByRole("button", { name: "Ab hier löschen" }).click();
  await expect(page.getByTestId("variantenzeile")).not.toContainText("De7");
  await page.getByRole("button", { name: "Rückgängig" }).click();
  await expect(page.getByTestId("variantenzeile")).toContainText("De7");

  // PGN-Export mit Kommentar und Nebenvarianten.
  await page.getByTestId("variantentitel").click();
  const herunterladen = page.waitForEvent("download");
  await page.getByRole("button", { name: "Als PGN-Datei sichern" }).click();
  const pgn = await readFile(await (await herunterladen).path(), "utf8");
  expect(pgn).toContain('[Event "Abb. 2.40"]');
  expect(pgn).toContain("3. Nxe5 Qe7 { Dame deckt e5 }");
  expect(pgn).toContain("( 3... d6! 4. Nf3");
  expect(pgn).toContain("( 3... Nxe4?! 4. Qe2!");
  await page.keyboard.press("Escape");
});

test("PGN einlesen, umbenennen, Partie-Hinweis und Variante löschen", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneVarianten(page);
  await page.getByRole("button", { name: "PGN", exact: true }).click();
  const feld = page.getByTestId("varianten-einfuegen");
  await feld
    .getByLabel("PGN oder FEN")
    .fill('[Event "Sizilianisch"]\n\n1. e4 c5 (1... e5 {Offen} 2. Sf3) 2. Sf3 d6 $1 *');
  await feld.getByRole("button", { name: "Einlesen" }).click();
  await expect(page.getByTestId("variantentitel")).toHaveText("Sizilianisch");
  await expect(page.getByTestId("variantenstatus")).toContainText("Gespeichert");
  // Geöffnet wird am Anfang; dort zweigt 1... c5 und 1... e5 ab, nach 1. e4.
  await page.getByRole("button", { name: "Einen Halbzug vor" }).click();
  await expect(page.getByTestId("weiterchips")).toContainText("1... c5");
  await expect(page.getByTestId("weiterchips")).toContainText("1... e5");
  await page.getByRole("button", { name: "Zum Ende" }).click();
  await expect(page.getByTestId("variantenzeile")).toContainText("d6!");
  // Umbenennen und löschen im Blatt der Variante.
  await page.getByTestId("variantentitel").click();
  await page.getByLabel("Name").fill("Mein Sizilianer");
  await page.getByRole("button", { name: "Variante löschen" }).click();
  await page.getByRole("button", { name: "Ja, löschen" }).click();
  await expect(page.getByTestId("varianten-leer")).toBeVisible();
});

test("Laden aus Grundstellung, FEN, Stellungseditor, Partie (mit Engine-Folgen), Fehler und Lernsammlung", async ({
  page,
}) => {
  await starteImBrowser(page);
  // Format 7 mit einem Fehler und einem Eintrag der Lernsammlung: wird still zu Format 8.
  await spieleEin(page, {
    schemaVersion: 7,
    fehler: [
      {
        id: "f1",
        datum: "2026-10-28T10:00:00.000Z",
        fen: GRUND,
        satz: "Zu schnell",
        fehlerart: 1,
        zug: "f3",
      },
    ],
    sammlung: [
      {
        id: "s1",
        datum: "2026-10-29T10:00:00.000Z",
        fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        herkunft: "fen",
        quelle: "",
        eroeffnung: "Königsbauernspiel",
        plan: "Springer raus",
        notiz: "",
        verlauf: { startFen: GRUND, zuege: ["e4", "e5"] },
      },
    ],
  });
  await page.getByRole("button", { name: "Ja, Daten ersetzen" }).click();
  await expect(page.getByText("Sicherung eingespielt.")).toBeVisible();
  // Eine Partie einlesen (für die Quelle „Partie“).
  await oeffneProfil(page);
  await page.getByRole("button", { name: "Partie einlesen (PGN)", exact: true }).click();
  const formular = page.getByTestId("pgnimport");
  await formular.getByLabel("PGN der Partie").fill("1. e4 e5 2. Qh5 Nc6 3. Bc4 Nf6 4. Qxf7# 1-0");
  await formular.getByRole("button", { name: "Einlesen und auswerten" }).click();
  await expect(page.getByTestId("partieende")).toContainText("Matt", { timeout: AUSWERTUNG_FRIST });

  const quelle = async (name: string) => {
    await oeffneVarianten(page);
    await page.getByRole("button", { name: "Neue Variante" }).click();
    await page.getByTestId("varianten-neu").getByRole("button", { name, exact: true }).click();
  };
  await quelle("Grundstellung");
  await expect(page.getByTestId("variantentitel")).toHaveText("Neue Variante");
  await quelle("PGN / FEN einfügen");
  await page.getByLabel("PGN oder FEN").fill("4k3/8/8/8/8/8/4P3/4K3 w - - 0 1");
  await page.getByRole("button", { name: "Einlesen" }).click();
  await expect(page.getByTestId("variantentitel")).toHaveText("Eigene Stellung");
  await quelle("Stellung aufbauen");
  await page.getByRole("button", { name: "Grundstellung" }).last().click();
  await page.getByRole("button", { name: "Stellung übernehmen" }).click();
  await expect(page.getByTestId("variantentitel")).toHaveText("Eigene Stellung");
  await quelle("Fehlerdatenbank");
  await page.getByRole("button", { name: /Zu schnell/ }).click();
  await expect(page.getByTestId("variantentitel")).toContainText("Fehler vom");
  await expect(page.getByTestId("kommentarzeile")).toContainText("Zu schnell");
  await quelle("Lernsammlung");
  await page.getByRole("button", { name: /Königsbauernspiel/ }).click();
  await expect(page.getByTestId("variantentitel")).toHaveText("Königsbauernspiel");
  await expect(page.getByTestId("variantenkommentar")).toContainText("Springer raus");
  await quelle("Partie");
  await page.getByLabel(/Engine-Folgen übernehmen/).check();
  await page
    .getByTestId("varianten-neu")
    .getByRole("button", { name: /Halbzüge/ })
    .click();
  await expect(page.getByTestId("variantentitel")).toContainText("Partie vom");
  await quelle("Abbildung");
  await page.getByLabel("Nummer der Abbildung").fill("2.2");
  await page.getByRole("button", { name: "Öffnen", exact: true }).click();
  await expect(page.getByTestId("variantentitel")).toHaveText("Abb. 2.2");
  // Entwürfe ohne eigenen Zug werden nicht gespeichert.
  await oeffneVarianten(page);
  await expect(page.getByTestId("varianten-leer")).toBeVisible();
});

test("Sicherung aus einer neueren App wird abgewiesen, Grenze von 200 Varianten wird gemeldet", async ({
  page,
}) => {
  await starteImBrowser(page);
  await spieleEin(page, { schemaVersion: 9 }, "9.9.9");
  await expect(page.getByText(/aus einer neueren Version der App/)).toBeVisible();
  const variante = (i: number) => ({
    id: `var-${i}`,
    titel: `V${i}`,
    angelegt: "2026-11-01T10:00:00.000Z",
    geaendert: "2026-11-01T10:00:00.000Z",
    quelle: { art: "grund" },
    startFen: GRUND,
    startpfad: [],
    start: {},
    zuege: [],
    kommentar: "",
    legende: {},
    analysiert: false,
  });
  await page.getByTestId("sicherung-datei").setInputFiles({
    name: "voll.json",
    mimeType: "application/json",
    buffer: Buffer.from(
      JSON.stringify({
        art: "schach-von-grund-auf/nutzerdaten",
        appVersion: "0.3.45",
        exportiert: "2026-11-01T10:00:00.000Z",
        daten: {
          schemaVersion: 8,
          variationen: Array.from({ length: 200 }, (_, i) => variante(i)),
        },
      }),
    ),
  });
  await expect(page.getByRole("alertdialog")).toContainText("Varianten: 200");
  await page.getByRole("button", { name: "Ja, Daten ersetzen" }).click();
  await oeffneVarianten(page);
  await expect(page.getByTestId("variantenkarte")).toHaveCount(200);
  await page.getByRole("button", { name: "Neue Variante" }).click();
  await page.getByTestId("varianten-neu").getByRole("button", { name: "Grundstellung" }).click();
  await ziehe(page, "e2", "e4");
  await expect(page.getByTestId("variante-grenze")).toContainText("200 Varianten");
  await expect(page.getByTestId("variantenstatus")).toContainText("Entwurf");
});

test("zwei Tabs: eine Variante im ersten Tab überlebt eine Änderung im zweiten", async ({
  page,
  context,
}) => {
  await starteImBrowser(page);
  const zweite = await context.newPage();
  await zweite.goto("/app/");
  await oeffneVarianten(page);
  await page.getByRole("button", { name: "Neue Variante" }).click();
  await page.getByTestId("varianten-neu").getByRole("button", { name: "Grundstellung" }).click();
  await ziehe(page, "e2", "e4");
  await expect(page.getByTestId("variantenstatus")).toContainText("Gespeichert");
  // Der zweite Tab ändert etwas anderes und speichert seinen ganzen Stand.
  await oeffneProfil(zweite);
  await zweite.getByRole("button", { name: "Partie einlesen (PGN)", exact: true }).click();
  const formular = zweite.getByTestId("pgnimport");
  await formular.getByLabel("PGN der Partie").fill("1. f3 e5 2. g4 Qh4# 0-1");
  await formular.getByRole("button", { name: "Einlesen und auswerten" }).click();
  await expect(zweite.getByTestId("partieende")).toContainText("Matt");
  // Der erste Tab zieht weiter: Partie und Variante bleiben beide.
  await ziehe(page, "e7", "e5");
  await page.reload();
  await oeffneVarianten(page);
  await expect(page.getByTestId("variantenkarte")).toContainText("2 Züge");
  await oeffneProfil(page);
  await expect(page.locator(".partienliste li.partieeintrag")).toHaveCount(1);
});

test("Probepartie von hier: zählt nicht, Züge als Abzweig in die Variante", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneVarianten(page);
  await page.getByRole("button", { name: "Neue Variante" }).click();
  await page.getByTestId("varianten-neu").getByRole("button", { name: "Grundstellung" }).click();
  await ziehe(page, "e2", "e4");
  await page.getByRole("button", { name: "Von hier spielen" }).click();
  await expect(page.getByTestId("probehinweis")).toBeVisible();
  await page
    .getByTestId("vorschlagskarte")
    .getByRole("button", { name: /^Spielen/ })
    .click();
  await expect(page.getByTestId("probeabschluss")).toBeVisible();
  // Abbrechen bietet „Als Variante speichern“ an; die Züge kommen an die Stelle nach 1. e4.
  await page.getByRole("button", { name: "Probepartie beenden" }).click();
  await page.getByRole("button", { name: "Als Variante speichern" }).click();
  await expect(page.getByTestId("variantenstatus")).toContainText("Gespeichert");
  await expect(page.getByTestId("variantenzeile")).toContainText("1. e4");
  // Nichts davon steht in der Partienliste.
  await oeffneProfil(page);
  await expect(page.locator(".partienliste li.partieeintrag")).toHaveCount(0);
});
