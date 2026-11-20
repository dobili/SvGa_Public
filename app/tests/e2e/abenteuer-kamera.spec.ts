/**
 * Schach-Abenteuer, Messung der Kamera beim Laufen und Stehenbleiben (Auftrag des Autors,
 * 19.11.2026: „der Ausschnitt ruckelt beim Vorauseilen und Zurückgehen“). Messwerkzeug wie
 * abenteuer-bildrate.spec.ts; läuft nur mit ABENTEUER_KAMERA=1.
 *
 * Gemessen wird auf einer großen Außenkarte in Handygröße quer: Der Held läuft 3 s nach rechts und
 * bleibt 2,5 s stehen. Die Kameraführung (oberwelt/kamerafuehrung.ts) schreibt je Bild ihren Stand
 * in window.__kameraprotokoll. Ausgewertet werden die Schritte des Bildausschnitts je Bild in
 * Bildschirmpixeln: beim Stehen die größte Sprungweite und die Zahl der Sprünge, beim Laufen die
 * Unruhe (Änderung der Schrittweite von Bild zu Bild, bezogen auf die Bildzeit).
 * Aufruf (gegen `npm run build`):
 * ABENTEUER_KAMERA=1 CHROMIUM_PFAD=… PLAYWRIGHT_NUR_CHROMIUM=1 npx playwright test abenteuer-kamera --trace off
 */
import { expect, test } from "@playwright/test";
import { feldVon } from "./abenteuer-karte";
import { ohneMaiaImHintergrund } from "./abenteuer-paket";
import { starteImBrowser } from "./hilfen";

const LAUF_MS = 3000;
const STEH_MS = 2500;

interface Eintrag {
  t: number;
  x: number;
  y: number;
  laeuft: boolean;
  zoom: number;
}

/** Spielstand auf Maple Falls außen am Startfeld (wie abenteuer-bildrate.spec.ts). */
function stand() {
  return {
    version: 1,
    begonnen: "2026-11-08T05:00:00.000Z",
    eingangswertung: 600,
    eingangPartien: 0,
    wertung: 600,
    appWertungZuletzt: null,
    wertungPartien: 0,
    held: { name: "Kim", variante: 0 },
    handlung: { akt: 1, szene: "akt1.start", liga: null, durchlauf: 1 },
    position: {
      karte: "mapleFalls.aussen",
      ...feldVon("maple-falls-aussen", "start"),
      richtung: "unten",
    },
    besuchteOrte: ["mapleFalls"],
    muenzen: 0,
    // Einleitung und Ankunft gelten als gesehen, sonst beginnt das Gespräch mit Mama.
    dialogvariablen: { einleitungGesehen: true, ankunftGesehen: true },
  };
}

/** Spielstand in die gespeicherten Nutzerdaten schreiben (false, solange es keine gibt). */
function schreibeStand(spielstand: object): Promise<boolean> {
  return new Promise<boolean>((fertig, fehler) => {
    const anfrage = indexedDB.open("schach-von-grund-auf");
    anfrage.onerror = () => fehler(anfrage.error);
    anfrage.onsuccess = () => {
      const db = anfrage.result;
      const bereich = db.transaction("nutzerdaten", "readwrite").objectStore("nutzerdaten");
      const lesen = bereich.get("aktuell");
      lesen.onsuccess = () => {
        const alt = lesen.result as Record<string, unknown> | undefined;
        if (!alt?.spiel) {
          db.close();
          fertig(false);
          return;
        }
        const schreiben = bereich.put({ ...alt, abenteuer: spielstand }, "aktuell");
        schreiben.onsuccess = () => {
          db.close();
          fertig(true);
        };
        schreiben.onerror = () => fehler(schreiben.error);
      };
    };
  });
}

/** Schritte je Bild in Bildschirmpixeln (waagerecht). */
function schritte(eintraege: readonly Eintrag[]): { d: number; dt: number; laeuft: boolean }[] {
  return eintraege.slice(1).map((e, i) => {
    const vorher = eintraege[i] ?? e;
    return { d: (e.x - vorher.x) * e.zoom, dt: e.t - vorher.t, laeuft: e.laeuft };
  });
}

/** Kennzahlen: Stehen (Sprünge) und Laufen (Unruhe der Geschwindigkeit). */
function auswerten(eintraege: readonly Eintrag[]) {
  const s = schritte(eintraege);
  const stehen = s.filter((x) => !x.laeuft && x.d !== 0);
  const laufen = s.filter((x) => x.laeuft && x.dt > 0).map((x) => x.d / x.dt);
  const unruhe = laufen.slice(1).map((v, i) => Math.abs(v - (laufen[i] ?? v)));
  const runde = (z: number) => Math.round(z * 100) / 100;
  return {
    bilder: s.length,
    stehenSpruenge: stehen.length,
    stehenGroesster: runde(Math.max(0, ...stehen.map((x) => Math.abs(x.d)))),
    stehenWeg: runde(stehen.reduce((a, x) => a + x.d, 0)),
    laufenUnruheMittel: runde(unruhe.reduce((a, b) => a + b, 0) / Math.max(1, unruhe.length)),
    laufenUnruheGroesste: runde(Math.max(0, ...unruhe)),
  };
}

test("Kamera: Vorauseilen und Zurücklaufen gleichmäßig", async ({ page }) => {
  test.skip(!process.env.ABENTEUER_KAMERA, "nur mit ABENTEUER_KAMERA=1");
  test.setTimeout(240_000);
  await page.setViewportSize({ width: 800, height: 420 });
  await starteImBrowser(page);
  await expect.poll(() => page.evaluate(schreibeStand, stand())).toBe(true);
  await page.reload();
  await page.goto("/app/#abenteuer");
  const laden = page.getByTestId("abenteuer-laden");
  await expect(laden).toBeVisible({ timeout: 30000 });
  await ohneMaiaImHintergrund(page);
  await laden.click();
  await expect(page.getByTestId("abenteuer-welt")).toBeVisible({ timeout: 120000 });
  await page.waitForTimeout(3000);
  const weiter = page.getByRole("button", { name: "Weiter" });
  for (let i = 0; i < 6 && (await weiter.count()) > 0; i++) {
    await weiter.first().click();
    await page.waitForTimeout(500);
  }
  await page.evaluate(() => {
    (window as unknown as { __kameraprotokoll: unknown[] }).__kameraprotokoll = [];
  });
  await page.keyboard.down("ArrowRight");
  await page.waitForTimeout(LAUF_MS);
  await page.keyboard.up("ArrowRight");
  await page.waitForTimeout(STEH_MS);
  const eintraege = await page.evaluate(
    () => (window as unknown as { __kameraprotokoll: Eintrag[] }).__kameraprotokoll,
  );
  const w = auswerten(eintraege);
  console.log(`Kamera: ${JSON.stringify(w)} laeuft=${eintraege.filter((e) => e.laeuft).length}`);
  if (process.env.ABENTEUER_KAMERA_FOLGE) {
    const folge = schritte(eintraege)
      .filter((x) => !x.laeuft)
      .map((x) => `${Math.round(x.d * 10) / 10}/${Math.round(x.dt)}`);
    console.log(`Folge: ${folge.join(" ")}`);
  }
  expect(w.bilder).toBeGreaterThan(100);
});
