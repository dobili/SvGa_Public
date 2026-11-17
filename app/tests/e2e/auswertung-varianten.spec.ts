/**
 * Auswertung und Varianten in Zuständen aus dem Speicher (Vortest der offenen Testpunkte,
 * 17.11.2026): die ausgewertete Opernpartie (auswertungpartie.ts) als Variante mit
 * Engine-Folgen, übernommenen Werten, Analyse nur der neuen Stellungen und Balken im Baum;
 * die Zahl eigener Varianten; die Findezeile im Rückblick Zug für Zug; die Probepartie aus der
 * Gabel; eine verlorene Partie mit lauter besten Zügen (kein „?“, Rekord „ohne Patzer“);
 * Varianten aus einer Lichess-PGN mit Bewertungen und die Analyse im Hintergrund.
 * Regeln: spiel/auswertung.ts (Zugklassen), training/rekordwerte.ts, varianten/PartieGabel.tsx.
 */
import { expect, test, type Page } from "@playwright/test";
import { eintrag, oeffnePartie, spielePartienEin } from "./auswertungpartie";
import { oeffneProfil, starteImBrowser } from "./hilfen";

/** Die Züge der Opernpartie als UCI (wie in auswertungpartie.ts). */
const UCI_DER_PARTIE =
  "e2e4 e7e5 g1f3 d7d6 d2d4 c8g4 d4e5 g4f3 d1f3 d6e5 f1c4 g8f6 f3b3 d8e7 b1c3 c7c6 c1g5 b7b5 c3b5 c6b5 c4b5 b8d7 e1c1 a8d8 d1d7 d8d7 h1d1 e7e6 b5d7 f6d7".split(
    " ",
  );

/** Rechenzeit der echten Engine für ein paar Stellungen (wie varianten-stufe3.spec.ts). */
const ANALYSE_FRIST = 90_000;

/** Öffnet die Liste „Varianten“ über die Kachel im Training. */
async function oeffneVarianten(seite: Page): Promise<void> {
  await seite.getByRole("navigation").getByRole("button", { name: "Training" }).click();
  await seite.getByTestId("kachel-varianten").getByRole("button").click();
  await expect(seite.getByRole("heading", { name: "Varianten", level: 1 })).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 851 });
});

test("Partie als Variante: Engine-Folgen, Werte übernommen, Analyse nur neu, Balken im Baum, Zahl (N2509, N2510, N2571, N2580)", async ({
  page,
}) => {
  test.setTimeout(ANALYSE_FRIST * 2);
  await starteImBrowser(page);
  await oeffnePartie(page, "dunkel");
  await page.getByTestId("gabelschalter").first().click();
  const blatt = page.getByTestId("partiegabel");
  await expect(blatt.getByLabel(/Engine-Folgen übernehmen/)).toBeChecked();
  await blatt.getByRole("button", { name: "Öffnen", exact: true }).click();
  // Die Partiezüge tragen sofort ihre Zugarten aus der Auswertung.
  await expect(page.getByTestId("variantenzeile")).toContainText("Theoriezug");
  await page.getByTestId("variante-speichern").click();
  await expect(page.getByTestId("variantenstatus")).toContainText("Gespeichert");
  // Besser war (Engine) an 8. Sc3? und 12. O-O-O??, dazu am Patzer der Engine 12... Td8.
  await page.getByRole("button", { name: "Baum", exact: true }).click();
  const karten = page.getByTestId("abzweigbaum").getByTestId("abzweigkarte");
  await expect(karten).toHaveCount(3);
  await expect(karten.nth(0)).toContainText("8. Dxb7");
  await expect(karten.nth(0)).toContainText("Engine");
  await expect(karten.nth(1)).toContainText("12. Lxd7+");
  await expect(karten.nth(2)).toContainText("12... De6");
  // Gerechnet werden nur die drei neuen Stellungen der Abzweige.
  await page.getByTestId("analyseknopf").click();
  await expect(page.getByTestId("analysefortschritt")).toContainText("von 3 Stellungen");
  await expect(page.getByTestId("analysefortschritt")).toHaveCount(0, { timeout: ANALYSE_FRIST });
  await expect(page.getByTestId("abzweigbaum").getByTestId("bewertungsbalken")).toHaveCount(3);
  await expect(karten.nth(0)).toContainText("+1,6");
  // Zurück in der Partie und in der Partienliste: die Zahl der eigenen Varianten.
  await page.getByRole("button", { name: "Zurück" }).first().click();
  await expect(page.getByTestId("variantenzahl")).toContainText("1 eigene Variante");
  await oeffneProfil(page);
  await expect(page.getByTestId("variantenmarke").first()).toHaveAttribute(
    "aria-label",
    "1 eigene Variante",
  );
});

test("Rückblick Zug für Zug: Findezeile mit Üben am Fehler; Probepartie aus der Gabel (N2603, N2512)", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffnePartie(page, "dunkel");
  const rueckblick = page.getByTestId("rueckblickkarte");
  await page
    .getByRole("button", { name: /^8\. Sc3/ })
    .first()
    .click();
  const zeile = rueckblick.getByTestId("findezeile");
  await expect(zeile).toContainText("Guter Schlag ausgelassen (Kapitel 1)");
  await zeile.locator("summary").click();
  await expect(zeile.getByRole("button", { name: /^Üben/ })).toBeVisible();
  // Ein Theoriezug bekommt keine Findezeile.
  await page
    .getByRole("button", { name: /^1\. e4/ })
    .first()
    .click();
  await expect(rueckblick.getByTestId("findezeile")).toHaveCount(0);
  // Von hier spielen: Probepartie mit der eigenen Farbe; „Verwerfen“ speichert nichts.
  await page.getByTestId("gabelschalter").first().click();
  await page
    .getByTestId("partiegabel")
    .getByRole("button", { name: /Von hier spielen/ })
    .click();
  const vorschlag = page.getByTestId("vorschlagskarte");
  await expect(page.locator("main")).toContainText("Probepartie: zählt nicht");
  await expect(vorschlag).toContainText("Weiß");
  await vorschlag.getByRole("button", { name: /^Spielen/ }).click();
  await expect(page.getByTestId("probeabschluss")).toBeVisible();
  await page.getByRole("navigation").getByRole("button", { name: "Spielen" }).click();
  const karte = page.getByTestId("probekarte");
  await karte.getByRole("button", { name: "Beenden" }).click();
  await karte.getByRole("button", { name: "Verwerfen" }).click();
  await expect(karte).toHaveCount(0);
  await oeffneVarianten(page);
  await expect(page.getByTestId("varianten-leer")).toBeVisible();
});

/**
 * Die Opernpartie bis 15. Lxd7+ Sxd7 (30 Halbzüge), aber Weiß steht ab Zug 8 klar verloren,
 * spielt nur noch beste Züge und gibt am Ende auf. Stimmige Werte: Sonst rechnet die App die
 * Auswertung neu (ein Matt von Weiß passt nicht zu Werten für Schwarz).
 */
function verloreneBestePartie() {
  const basis = eintrag();
  const HALBZUEGE = 30;
  const VERLOREN_AB = 14;
  const SCHRITT = 0.4;
  const zuege = basis.partie.zuege
    .slice(0, HALBZUEGE)
    .map((z) => ({ ...z, quelle: z.von, fehler: null, verlust: 0 }));
  const werte = basis.werte
    .slice(0, HALBZUEGE + 1)
    .map((w, i) => (i < VERLOREN_AB ? w : -3 - (i - VERLOREN_AB) * SCHRITT));
  // Beste Züge sind die gespielten (die Auswertung kennt keinen besseren Zug).
  const beste = [
    ...basis.partie.zuege.slice(0, HALBZUEGE).map((_, i) => UCI_DER_PARTIE[i] ?? ""),
    "",
  ];
  return {
    ...basis,
    partie: { ...basis.partie, id: "p-verloren", zuege, ende: { art: "aufgabe", sieger: "black" } },
    werte,
    beste,
    abstaende: werte.map(() => 0),
    varianten: beste.map((b) => (b ? [b] : [])),
  };
}

test("Klar verloren, aber beste Züge: kein „?“, Rekord „ohne Patzer“ (N2481, N2145)", async ({
  page,
}) => {
  await starteImBrowser(page);
  await spielePartienEin(page, [verloreneBestePartie()]);
  await oeffneProfil(page);
  await page
    .locator(".partienliste li.partieeintrag")
    .first()
    .locator(".partiezeile-oeffnen")
    .click();
  const zuege = page.getByTestId("partiezuege");
  await expect(zuege).toContainText("15. Lxd7+");
  // Nirgends ?!, ? oder ??, obwohl die Gewinnchance von Weiß weiter fällt.
  await expect(zuege).not.toContainText("?");
  await expect(zuege.getByRole("button", { name: /^10\. Sxb5, Bester Zug/ })).toBeVisible();
  await expect(page.getByTestId("zeitleiste")).toContainText("Gut gespielt!");
  await expect(page.getByTestId("moment-fehler")).toHaveCount(0);
  // Profil › Deine Rekorde: die Partie zählt als längste ohne Patzer.
  await oeffneProfil(page);
  await expect(page.getByTestId("rekordtafel")).toContainText("30 Halbzüge ohne Patzer");
});

test("Lichess-PGN mit Bewertungen: Balken sofort, Zugarten erst nach der Analyse; Analyse läuft im Hintergrund weiter (N2567, N2565)", async ({
  page,
}) => {
  test.setTimeout(ANALYSE_FRIST * 2);
  await starteImBrowser(page);
  await oeffneVarianten(page);
  await page.getByRole("button", { name: "PGN", exact: true }).click();
  const feld = page.getByTestId("varianten-einfuegen");
  const pgn =
    '[Event "Studie"]\n\n1. e4 { [%eval 0.3] } e5 { [%eval 0.25] } 2. Nf3 { [%eval 0.3] } ' +
    "Nc6 { [%eval 0.3] } 3. Bc4 { [%eval 0.2] } Nf6 { [%eval 0.3] } 4. Ng5 { [%eval 0.1] } *";
  await feld.getByLabel("PGN oder FEN").fill(pgn);
  await feld.getByRole("button", { name: "Einlesen" }).click();
  await expect(page.getByTestId("variantenstatus")).toContainText("Gespeichert");
  // Geöffnet wird am Anfang (dort steht kein Wert); am Ende der Linie steht der Balken sofort.
  await page.getByRole("button", { name: "Zum Ende" }).click();
  await expect(page.getByTestId("bewertungsbalken")).toBeVisible();
  await expect(page.getByTestId("variantenzeile").locator("[class*='klassenmarke']")).toHaveCount(
    0,
  );
  // Analyse starten und die Variante verlassen; später zurück ist sie fertig.
  await page.getByTestId("analyseknopf").click();
  await expect(page.getByTestId("analysefortschritt")).toContainText("Stellungen");
  await page.getByRole("navigation").getByRole("button", { name: "Buch" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Buch" })).toBeVisible();
  await expect
    .poll(
      async () => {
        await oeffneVarianten(page);
        await page.getByTestId("variantenkarte").getByRole("button").first().click();
        const fertig = (await page.getByTestId("analysefortschritt").count()) === 0;
        if (!fertig)
          await page.getByRole("navigation").getByRole("button", { name: "Buch" }).click();
        return fertig;
      },
      { timeout: ANALYSE_FRIST, intervals: [5000] },
    )
    .toBe(true);
  await expect(
    page.getByTestId("variantenzeile").locator("[class*='klassenmarke']").first(),
  ).toBeVisible();
});
