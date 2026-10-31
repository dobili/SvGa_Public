/**
 * Bildschirmfotos von „Training neu“ (Entwurf C2) und der Gesamt-Checkliste (Entwurf D1) in
 * Handybreite (360 px), hell und dunkel, nach dem Vorbild von profilbilder.spec.ts. Eingespielt
 * wird ein kleiner Stand: drei fällige Trainer-Karten (zwei Taktik, eine „Falle oder Köder“), zwei
 * gespielte Trainer, ein Rekord der Taktikserie und Haken in der Checkliste (Kapitel 0 ganz,
 * Kapitel 1 zum Teil). Die Bilder landen in test-results/bilder/ für den Bericht an den Autor.
 */
import { expect, test, type Page } from "@playwright/test";
import { starteImBrowser } from "./hilfen";

const GESTERN = "2026-01-01T10:00:00.000Z";
const KARTE = { kasten: 1, faellig: GESTERN, verlauf: [] };

/** Was in den gespeicherten Stand kommt. */
const STAND = {
  karten: { "taktik:probe-1": KARTE, "taktik:probe-2": KARTE, "falle:probe-1": KARTE },
  trainer: {
    taktik: { durchgaenge: 3, aufgaben: 15, richtig: 12, zuletzt: GESTERN },
    zaehlen: { durchgaenge: 1, aufgaben: 5, richtig: 3, zuletzt: GESTERN },
  },
  rekorde: { taktikSerie: { wert: 6, datum: GESTERN } },
  lernstand: { 0: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 1: [0, 2, 3], 2: [1] },
};

/** Schreibt den Stand in IndexedDB; false, solange die App noch nichts gespeichert hat. */
function schreibeStand(stand: typeof STAND): Promise<boolean> {
  return new Promise<boolean>((fertig, fehler) => {
    const anfrage = indexedDB.open("schach-von-grund-auf");
    anfrage.onerror = () => fehler(anfrage.error);
    anfrage.onsuccess = () => {
      const db = anfrage.result;
      const bereich = db.transaction("nutzerdaten", "readwrite").objectStore("nutzerdaten");
      const lesen = bereich.get("aktuell");
      lesen.onsuccess = () => {
        const alt = lesen.result as { fortschritt?: Record<string, unknown> } | undefined;
        if (!alt?.fortschritt) {
          db.close();
          fertig(false);
          return;
        }
        const neu = {
          ...alt,
          karten: stand.karten,
          rekorde: stand.rekorde,
          lernstand: stand.lernstand,
          fortschritt: { ...alt.fortschritt, trainer: stand.trainer },
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

/** Farbschema als Merker, vor dem Start der App. */
async function setzeSchema(page: Page, schema: "hell" | "dunkel"): Promise<void> {
  await page.addInitScript((farbschema) => {
    window.localStorage.setItem("svga.farbschema", farbschema);
  }, schema);
}

for (const schema of ["dunkel", "hell"] as const) {
  test(`Training und Checkliste neu: Bilder (${schema})`, async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await starteImBrowser(page);
    await setzeSchema(page, schema);
    await page.goto("/app/");
    await expect.poll(() => page.evaluate(schreibeStand, STAND)).toBe(true);
    await page.reload();
    const leiste = page.getByRole("navigation", { name: "Hauptbereiche" });
    await leiste.getByRole("button", { name: "Training" }).click();
    await expect(page.getByTestId("stapel-zahl")).toContainText("3 Karten");
    await expect(page.getByTestId("trainer-taktik")).toContainText("2 fällig");
    await expect(page.getByTestId("trainer-taktik")).toContainText("3 Runden · 80 % richtig");
    await expect(page.getByTestId("trainer-taktik")).toContainText("Bestwert: 6 in Folge");
    await page.screenshot({
      path: `test-results/bilder/training-neu-${schema}.png`,
      fullPage: true,
    });
    await leiste.getByRole("button", { name: "Nachschlagen" }).click();
    await page.getByRole("button", { name: /^Gesamt-Checkliste/ }).click();
    await expect(page.getByTestId("lernkarte-0")).toContainText("fertig");
    await page.getByTestId("lernkarte-1").locator("summary").click();
    await expect(page.getByTestId("lernstand-gesamt")).toContainText("12 von");
    await page.screenshot({
      path: `test-results/bilder/checkliste-neu-${schema}.png`,
      fullPage: true,
    });
  });
}
