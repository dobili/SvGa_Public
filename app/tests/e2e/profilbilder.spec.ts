/**
 * Bildschirmfotos der drei neuen Profilkarten (Profil neu, 31.10.2026) in Handybreite, hell und
 * dunkel: „Deine Erfolge“ mit Glanzstück, „Deine Wertung“ mit Kacheln, „Deine Rekorde“ mit
 * Erreichtem und Vorschlägen. Eingespielt wird ein kleiner Stand (drei gewertete Partien, zwei
 * Rekorde, zwei geprobte Orden, drei gefeierte Abzeichen); die Bilder landen in
 * test-results/bilder/ für den Bericht an den Autor.
 */
import { expect, test, type Page } from "@playwright/test";
import { oeffneProfil, starteImBrowser } from "./hilfen";

const TAG = (tag: number) => `2026-10-${tag}T10:00:00.000Z`;

/** Was in den gespeicherten Stand kommt (oberste Felder werden ersetzt, „spiel“ ergänzt). */
const STAND = {
  wertung: [
    { partieId: "w1", zeit: TAG(26), tempo: "rapid", wertung: 1290, ergebnis: 0 },
    { partieId: "w2", zeit: TAG(28), tempo: "rapid", wertung: 1305, ergebnis: 1 },
    { partieId: "w3", zeit: TAG(30), tempo: "rapid", wertung: 1325, ergebnis: 1 },
    { partieId: "w4", zeit: TAG(30), tempo: "blitz", wertung: 1180, ergebnis: 1 },
  ].map((p) => ({ ...p, gegner: 1300, phasen: {} })),
  rekorde: { bot: { wert: 1474, datum: TAG(31) }, lerntageWoche: { wert: 4, datum: TAG(30) } },
  verdient: {
    "orden:teil-grundlagen": TAG(30),
    "orden:bots-1-3-einmal": TAG(27),
    "abzeichen:erstePartie": TAG(20),
    "abzeichen:erstesMatt": TAG(29),
  },
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
        const alt = lesen.result as { spiel?: Record<string, unknown> } | undefined;
        if (!alt?.spiel) {
          db.close();
          fertig(false);
          return;
        }
        const neu = {
          ...alt,
          rekorde: stand.rekorde,
          verdient: stand.verdient,
          spiel: { ...alt.spiel, wertung: stand.wertung },
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

/** Merker der Proben: zwei Orden voll (schon gefeiert), drei Abzeichen gefeiert. */
async function setzeMerker(page: Page, schema: "hell" | "dunkel"): Promise<void> {
  await page.addInitScript((farbschema) => {
    const ringe = "ich-teil-grundlagen,ich-bots-1-3-einmal";
    window.localStorage.setItem("svga.ordenProbe", ringe);
    window.localStorage.setItem("svga.ringeGefeiert", ringe);
    window.localStorage.setItem("svga.abzeichenGefeiert", "erstePartie,ersterSieg,erstesMatt");
    window.localStorage.setItem("svga.farbschema", farbschema);
  }, schema);
}

for (const schema of ["dunkel", "hell"] as const) {
  test(`Profil neu: Bilder der drei Karten (${schema})`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 1400 });
    await starteImBrowser(page);
    await setzeMerker(page, schema);
    await page.goto("/app/");
    await expect.poll(() => page.evaluate(schreibeStand, STAND)).toBe(true);
    await page.reload();
    await oeffneProfil(page);
    const erfolge = page.getByTestId("erfolge");
    await expect(erfolge.getByTestId("erfolge-glanzstueck")).toContainText("Teil Grundlagen");
    await erfolge.screenshot({ path: `test-results/bilder/profil-erfolge-${schema}.png` });
    const wertung = page.getByTestId("wertung");
    await expect(wertung.getByTestId("wertung-zahl-blitz")).toHaveText("1180");
    await wertung.screenshot({ path: `test-results/bilder/profil-wertung-${schema}.png` });
    const rekorde = page.getByTestId("rekordtafel");
    await expect(rekorde.getByTestId("rekord-bot")).toContainText("1474");
    await rekorde.screenshot({ path: `test-results/bilder/profil-rekorde-${schema}.png` });
  });
}
