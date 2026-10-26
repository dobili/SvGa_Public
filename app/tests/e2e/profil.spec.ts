/**
 * Oberflächentests des Spielerprofils (0.2.140): Name und selbst gebautes Porträt festlegen, das
 * übersteht das Neuladen und erscheint in der Partie an der eigenen Uhr. Seit 26.10.2026 dazu der
 * Maßstab der Wertung (Lichess oder als Bereich auf chess.com umgerechnet, seit 0.3.2).
 */
import { expect, test, type Page } from "@playwright/test";
import { oeffneProfil, starteImBrowser } from "./hilfen";

test("Profil: Name und Porträt festlegen, in der Partie sichtbar", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneProfil(page);
  await expect(page.getByTestId("profilname")).toHaveText("Noch ohne Namen");
  await page.getByRole("button", { name: "Name und Porträt" }).click();
  await page.getByLabel("Dein Name (freiwillig)").fill("Dana");
  await page.getByRole("radio", { name: "Selbst gestalten" }).click();
  await page.getByRole("radio", { name: "Zöpfe" }).click();
  await page.getByRole("radio", { name: "Kupfer" }).click();
  // Die Vorschau zeigt das gebaute Bild, sobald der Baukasten geladen ist.
  await expect(
    page.getByTestId("profileditor").getByTestId("spielerbild").locator("img"),
  ).toHaveAttribute("src", /^data:image\/svg\+xml/);
  await page.getByRole("button", { name: "Speichern" }).click();
  await expect(page.getByTestId("profilname")).toHaveText("Dana");
  await page.reload();
  await oeffneProfil(page);
  await expect(page.getByTestId("profilname")).toHaveText("Dana");
  await expect(page.getByTestId("profilkarte").locator("img")).toHaveCount(1);
  // In der Partie steht der eigene Name an der eigenen Uhr.
  await page
    .getByRole("navigation", { name: "Hauptbereiche" })
    .getByRole("button", { name: "Spielen" })
    .click();
  await page.getByRole("button", { name: "Partie beginnen" }).click();
  await expect(page.getByTestId("partie-spielername")).toHaveText("Dana");
});

test("Profil: ein Porträt aus der Auswahl und wieder kein Bild", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneProfil(page);
  await page.getByRole("button", { name: "Name und Porträt" }).click();
  await page.getByRole("radio", { name: "Auswählen" }).click();
  await page.getByTestId("profileditor").getByRole("radio").nth(5).click();
  await page.getByRole("button", { name: "Speichern" }).click();
  await expect(page.getByTestId("profilkarte").locator("img")).toHaveAttribute(
    "src",
    /gegner\/wahl-\d\d\.svg$/,
  );
  await page.getByRole("button", { name: "Name und Porträt" }).click();
  await page.getByRole("radio", { name: "Kein Bild" }).click();
  await page.getByRole("button", { name: "Speichern" }).click();
  await expect(page.getByTestId("profilkarte").locator("img")).toHaveCount(0);
});

/** Gewertete Partien zum Einspielen: einmal Klassisch (unter der FIDE-Tabelle), zweimal Schnellschach. */
const WERTUNGSPUNKTE = [
  { partieId: "w1", zeit: "2026-10-20T10:00:00.000Z", tempo: "classical", wertung: 1500 },
  { partieId: "w2", zeit: "2026-10-21T10:00:00.000Z", tempo: "rapid", wertung: 1660 },
  { partieId: "w3", zeit: "2026-10-22T10:00:00.000Z", tempo: "rapid", wertung: 1680 },
].map((p) => ({ ...p, gegner: 1500, ergebnis: 1, phasen: {} }));

/** Schreibt die Punkte in den gespeicherten Stand; false, solange die App ihn nicht gespeichert hat. */
function schreibePunkte(punkte: typeof WERTUNGSPUNKTE): Promise<boolean> {
  return new Promise<boolean>((fertig, fehler) => {
    const anfrage = indexedDB.open("schach-von-grund-auf");
    anfrage.onerror = () => fehler(anfrage.error);
    anfrage.onsuccess = () => {
      const db = anfrage.result;
      const bereich = db.transaction("nutzerdaten", "readwrite").objectStore("nutzerdaten");
      const lesen = bereich.get("aktuell");
      lesen.onsuccess = () => {
        const stand = lesen.result as { spiel?: Record<string, unknown> } | undefined;
        if (!stand?.spiel) {
          db.close();
          fertig(false);
          return;
        }
        const schreiben = bereich.put(
          { ...stand, spiel: { ...stand.spiel, wertung: punkte } },
          "aktuell",
        );
        schreiben.onsuccess = () => {
          db.close();
          fertig(true);
        };
        schreiben.onerror = () => fehler(schreiben.error);
      };
    };
  });
}

/** Spielt die Wertungspunkte in IndexedDB ein (Eintrag „aktuell“) und lädt neu. */
async function spieleWertungEin(page: Page): Promise<void> {
  await expect.poll(() => page.evaluate(schreibePunkte, WERTUNGSPUNKTE)).toBe(true);
  await page.reload();
}

test("Profil: Wertung als Bereich auf chess.com, die Wahl bleibt (26.10.2026)", async ({
  page,
}) => {
  await starteImBrowser(page);
  await spieleWertungEin(page);
  await oeffneProfil(page);
  const karte = page.getByTestId("wertung");
  await expect(karte.getByTestId("wertung-zahl")).toHaveText(/^1680/);
  const massstab = karte.getByRole("radiogroup", { name: "Maßstab der Wertung" });
  await massstab.getByRole("radio", { name: "chess.com" }).click();
  await expect(karte.getByTestId("wertung-zahl")).toHaveText(/^\d{3,4}–\d{4}chess\.com/);
  await expect(karte.getByTestId("wertungskurve-massstab")).toHaveText(
    "Die Kurve zeigt den Maßstab von Lichess.",
  );
  await page.setViewportSize({ width: 400, height: 900 });
  await karte.screenshot({ path: "test-results/bilder/wertung-umschalter.png" });
  // Klassisch 1500 liegt unter der Tabelle (chess.com für Klassisch erst ab 1505): „–“ und die Grenze.
  await karte.getByRole("tab", { name: "Klassisch" }).click();
  await expect(karte.getByTestId("wertung-zahl")).toHaveText(/^–chess\.com/);
  await expect(karte.getByTestId("massstab-ausserhalb")).toHaveText(
    "chess.com erst ab etwa 1505 (Lichess Klassisch)",
  );
  // Die Wahl gilt je Gerät: nach dem Neuladen und in „Deine Spielstärke“ unter Spielen.
  await page.reload();
  await oeffneProfil(page);
  await expect(massstab.getByRole("radio", { name: "chess.com" })).toHaveAttribute(
    "aria-checked",
    "true",
  );
  await page
    .getByRole("navigation", { name: "Hauptbereiche" })
    .getByRole("button", { name: "Spielen" })
    .click();
  const kachel = page.getByTestId("letzte-spielstaerke-rapid");
  await expect(kachel).toContainText("chess.com");
  await expect(kachel).toContainText(/Wertung \d{3,4}–\d{4}/);
  await page.getByTestId("letzte-spielstaerke").getByRole("radio", { name: "Lichess" }).click();
  await expect(kachel).toContainText("Wertung 1680");
});
