/**
 * Oberflächentest der eigenen Ziele (Gamifizierung P13): Mit vorbereitetem `besiegt` (Lotte in
 * Blitz besiegt) schlägt die Wochenkarte „Besiege Lotte in Schnellschach.“ vor; das Ziel lässt sich
 * anheften und lösen, „Spielen“ öffnet den Spielstart, und mit dem Sieg in Schnellschach feiert
 * die Karte das Ziel und das Profil zeigt es unter „Erreichte Ziele“.
 */
import { expect, test, type Page } from "@playwright/test";
import { oeffneProfil, oeffneReiter, starteImBrowser } from "./hilfen";

const JETZT = "2026-10-29T12:00:00";

/** Ein Teil des gespeicherten Stands, der eingespielt wird. */
interface Vorbereitung {
  readonly besiegt: Record<string, string[]>;
}

/** Schreibt Lerntag, Wochenziel und `besiegt` in den Stand; false, solange es ihn nicht gibt. */
function bereiteVor(vorbereitung: Vorbereitung): Promise<boolean> {
  return new Promise<boolean>((fertig, fehler) => {
    const anfrage = indexedDB.open("schach-von-grund-auf");
    anfrage.onerror = () => fehler(anfrage.error);
    anfrage.onsuccess = () => {
      const db = anfrage.result;
      const bereich = db.transaction("nutzerdaten", "readwrite").objectStore("nutzerdaten");
      const lesen = bereich.get("aktuell");
      lesen.onsuccess = () => {
        const stand = lesen.result as Record<string, Record<string, unknown>> | undefined;
        if (!stand?.aktivitaet || !stand.spiel) {
          db.close();
          fertig(false);
          return;
        }
        const neu = {
          ...stand,
          aktivitaet: { "2026-10-27": { abbildung: 1 } },
          wochen: { ...stand.wochen, ziel: 3 },
          spiel: { ...stand.spiel, besiegt: vorbereitung.besiegt },
        };
        const schreiben = bereich.put(neu, "aktuell");
        schreiben.onsuccess = () => {
          db.close();
          fertig(true);
        };
        schreiben.onerror = () => fehler(schreiben.error);
      };
    };
  });
}

async function spieleEin(page: Page, besiegt: Record<string, string[]>): Promise<void> {
  await expect.poll(() => page.evaluate(bereiteVor, { besiegt })).toBe(true);
  await page.reload();
}

test("Eigene Ziele: Vorschlag anheften, lösen, Spielen, erreicht mit Feier und im Profil", async ({
  page,
}) => {
  await page.clock.setFixedTime(JETZT);
  await starteImBrowser(page);
  await spieleEin(page, { blitz: ["lotte"], rapid: [], classical: [] });
  await oeffneReiter(page, "ziele");
  const ziele = page.getByTestId("ziele");
  const vorschlag = ziele
    .getByTestId("ziel-vorschlag")
    .filter({ hasText: "Besiege Lotte in Schnellschach." });
  await expect(vorschlag).toBeVisible();
  await expect(ziele.getByTestId("ziel-vorschlag")).toHaveCount(5);

  await vorschlag.getByRole("button", { name: "Anheften" }).click();
  const angeheftet = ziele.getByTestId("ziel-angeheftet");
  await expect(angeheftet).toHaveText(/Besiege Lotte in Schnellschach\./);
  await expect(ziele.getByTestId("ziel-wahl")).toHaveCount(0);
  await page.setViewportSize({ width: 400, height: 900 });
  await ziele.screenshot({ path: "test-results/bilder/ziele.png" });

  // Lösen mit einem Tipp: wieder die Vorschläge.
  await angeheftet.getByRole("button", { name: "Lösen" }).click();
  await expect(angeheftet).toHaveCount(0);
  await expect(ziele.getByTestId("ziel-wahl")).toBeVisible();

  // Eigenes Ziel über die Bot-Auswahl: Lotte in Blitz ist schon geschafft.
  await ziele.getByRole("button", { name: "Eigenes Ziel: Bot besiegen" }).click();
  const wahl = ziele.getByTestId("ziel-botwahl");
  await wahl.locator("details", { hasText: "Lotte" }).first().locator("summary").click();
  await wahl.getByRole("radio", { name: /Lotte/ }).click();
  const zeitart = wahl.getByRole("radiogroup", { name: "In welcher Zeitart?" });
  await zeitart.getByRole("radio", { name: "Blitz" }).click();
  await expect(wahl.getByText("Das hast du schon geschafft.", { exact: false })).toBeVisible();
  await zeitart.getByRole("radio", { name: "Schnellschach" }).click();
  await wahl.getByRole("button", { name: "Anheften" }).click();
  await expect(angeheftet).toHaveText(/Besiege Lotte in Schnellschach\./);

  // „Spielen“ öffnet den Spielstart mit Lotte.
  await angeheftet.getByRole("button", { name: "Spielen" }).click();
  await expect(page.getByRole("button", { name: "Beginnen" }).first()).toBeVisible();
  await page.goBack();

  // Sieg in Schnellschach (wie nach einer Partie): erreicht, Feier, Profil.
  await spieleEin(page, { blitz: ["lotte"], rapid: ["lotte"], classical: [] });
  await oeffneReiter(page, "ziele");
  await expect(ziele.getByTestId("ziel-feier")).toHaveText(
    "Ziel erreicht: Lotte in Schnellschach besiegt!",
  );
  await expect(angeheftet).toHaveCount(0);
  await oeffneProfil(page);
  const karte = page.getByTestId("profilkarte-ziele");
  await expect(karte.getByText("1 eigenes Ziel erreicht.")).toBeVisible();
  await expect(karte.getByText(/Lotte in Schnellschach besiegt/)).toBeVisible();
});
