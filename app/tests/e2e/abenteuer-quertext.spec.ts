/**
 * Texte im Querformat als Seitenspalte (Wunsch des Autors, 20.11.2026, querformat.css): Quer
 * steht das Dialogfenster rechts in voller Höhe, gegenüber dem Steuerkreuz. Text und alle Wahlen
 * sind im Bild oder durch Rollen erreichbar, auch mit dem Finger. Nichts liegt unter dem Rand, und
 * Menü und Steuerkreuz überdecken die Spalte nicht. Ein Großbild steht in der freien Fläche
 * daneben. Geprüft auf iPhone 15 quer (734 × 343), Pixel 7 quer (863 × 360) und einem großen
 * iPhone als Web-App (932 × 430).
 * Die Bretter quer prüft abenteuer-querbretter.spec.ts.
 * Mit QUER_FOTOS=ORDNER legt der Test kleine Fotos jeder Lage ab (für den Bericht).
 */
import { expect, test, type Page } from "@playwright/test";
import { foto, GERAETE, imBild, rechteck, wischeHoch, WISCHVERSUCHE } from "./abenteuer-quer";
import { EINLEITUNG_GESEHEN, GRUNDSTAND, starteMitStand } from "./abenteuer-affe";

/** Wahlen blenden nach der Schutzzeit ein (dialog/wahlschutz.ts, 0,4 s Übergang). */
const EINBLENDEN_MS = 900;
/** So viele lange Antworten hängt der Rolltest an. */
const LANGE_ANTWORTEN = 6;
/** Mama im Wohnzimmer, nach der ersten Lektion: ihr erster Abend hat Porträt und Wahlen. */
const MAMA = {
  ...GRUNDSTAND,
  position: { karte: "mapleFalls.wohnzimmer", x: 15, y: 7, richtung: "rechts" },
  dialogvariablen: {
    ...EINLEITUNG_GESEHEN,
    brettBeruehrt: true,
    ambroseErwachtGesehen: true,
    ersteLektionBesprochen: true,
    treppeAbendGesehen: true,
  },
};

/** Liegt die letzte lange Antwort ganz im sichtbaren Teil der rollenden Spalte? */
async function ganzInDerSpalte(seite: Page): Promise<boolean> {
  return seite.evaluate(() => {
    const spalte = document.querySelector(".abenteuer-dialog");
    const knopf = [
      ...document.querySelectorAll(".abenteuer-dialog-wahlen button[data-lang]"),
    ].pop();
    if (!spalte || !knopf) return false;
    const s = spalte.getBoundingClientRect();
    const k = knopf.getBoundingClientRect();
    const innen = s.top + spalte.clientTop;
    return k.top >= innen && k.bottom <= innen + spalte.clientHeight && k.bottom <= innerHeight;
  });
}

/** Mamas Gespräch öffnen und „Weiter“ tippen, bis Wahlen da sind. */
async function oeffneMamaBisWahl(seite: Page): Promise<void> {
  await starteMitStand(seite, MAMA);
  await seite.getByTestId("abenteuer-aktion").click({ timeout: 15000 });
  const wahl = seite.locator(".abenteuer-dialog-wahlen button").first();
  for (let i = 0; i < 20 && !(await wahl.isVisible()); i++) {
    const weiter = seite.locator(".abenteuer-dialog-weiter");
    if (await weiter.isVisible()) await weiter.click({ timeout: 8000 });
    else await seite.waitForTimeout(200);
  }
  await expect(wahl).toBeEnabled();
  await seite.waitForTimeout(EINBLENDEN_MS);
}

for (const g of GERAETE) {
  test.describe(g.name, () => {
    test.use({
      viewport: g.viewport,
      deviceScaleFactor: g.deviceScaleFactor,
      isMobile: g.isMobile,
      hasTouch: g.hasTouch,
      userAgent: g.userAgent,
    });

    test("Dialog als Seitenspalte: Porträt, Text und alle Wahlen im Bild", async ({ page }) => {
      test.slow();
      await oeffneMamaBisWahl(page);
      const spalte = await rechteck(page, ".abenteuer-dialog");
      const breite = g.viewport.width;
      expect(spalte).not.toBeNull();
      // Rechts, in voller Höhe, ganz im Bild.
      expect(await imBild(page, ".abenteuer-dialog")).toBe(true);
      expect(spalte?.links ?? 0).toBeGreaterThan(breite / 2);
      expect((spalte?.unten ?? 0) - (spalte?.oben ?? 0)).toBeGreaterThan(g.viewport.height * 0.9);
      // Porträt und Wahlen im Bild, jede Wahl ganz.
      expect(await imBild(page, ".abenteuer-dialog-kopf")).toBe(true);
      const wahlen = page.locator(".abenteuer-dialog-wahlen button");
      for (let i = 0; i < (await wahlen.count()); i++) {
        await expect(wahlen.nth(i)).toBeInViewport({ ratio: 1 });
      }
      // Menü links neben der Spalte, kein Steuerkreuz über der Spalte.
      const menue = await rechteck(page, ".bildschirm-abenteuer > .abenteuer-menueknopf");
      expect(menue?.rechts ?? 0).toBeLessThanOrEqual(spalte?.links ?? 0);
      const kreuz = await rechteck(page, ".abenteuer-steuerkreuz");
      if (kreuz && kreuz.breite > 0) expect(kreuz.rechts).toBeLessThanOrEqual(spalte?.links ?? 0);
      await foto(page, "dialog-wahlen", g.name);
    });

    test("Viele lange Antworten: die Spalte rollt, auch mit dem Finger", async ({ page }) => {
      test.slow();
      await oeffneMamaBisWahl(page);
      await page.evaluate((anzahl) => {
        const wahlen = document.querySelector(".abenteuer-dialog-wahlen");
        const vorlage = wahlen?.querySelector("button");
        for (let i = 0; i < anzahl && vorlage && wahlen; i++) {
          const kopie = vorlage.cloneNode() as HTMLButtonElement;
          kopie.textContent = `„Eine sehr lange Antwort Nummer ${i + 1}, die über mehrere Zeilen geht.“`;
          kopie.dataset.lang = "ja";
          wahlen.append(kopie);
        }
      }, LANGE_ANTWORTEN);
      const stil = await page.locator(".abenteuer-dialog").evaluate((e) => {
        const s = getComputedStyle(e);
        return { y: s.overflowY, gesten: s.touchAction, hoehe: e.scrollHeight - e.clientHeight };
      });
      expect(stil.y).toBe("auto");
      expect(stil.gesten).toBe("pan-y");
      expect(stil.hoehe).toBeGreaterThan(0);
      await foto(page, "lange-antworten-oben", g.name);
      // Mit dem Finger nach oben wischen, bis die letzte Antwort ganz zu sehen ist.
      const letzte = page.locator(".abenteuer-dialog-wahlen button[data-lang]").last();
      for (let i = 0; i < WISCHVERSUCHE; i++) {
        // Ganz im sichtbaren Teil der Spalte, nicht nur im Bild: Unter dem Rand der Spalte ist
        // die Antwort im Bild, aber abgeschnitten (WebKit, großes iPhone, 20.11.2026).
        if (await ganzInDerSpalte(page)) break;
        await wischeHoch(page, ".abenteuer-dialog");
      }
      expect(await page.locator(".abenteuer-dialog").evaluate((e) => e.scrollTop)).toBeGreaterThan(
        0,
      );
      await expect(letzte).toBeInViewport({ ratio: 1 });
      expect(await imBild(page, ".abenteuer-dialog")).toBe(true);
      await foto(page, "lange-antworten-gerollt", g.name);
    });

    test("Großbild steht groß neben der Spalte, nicht darüber", async ({ page }) => {
      test.slow();
      await oeffneMamaBisWahl(page);
      // Das Bild kommt im Test nicht aus dem Paket; die Ansicht wird wie in Dialog.tsx eingesetzt.
      await page.evaluate(() => {
        const leinwand = document.createElement("canvas");
        leinwand.width = 320;
        leinwand.height = 200;
        const z = leinwand.getContext("2d");
        if (z) {
          z.fillStyle = "#8a6d3b";
          z.fillRect(0, 0, 320, 200);
        }
        const ansicht = document.createElement("div");
        ansicht.className = "abenteuer-grossansicht";
        const bild = document.createElement("img");
        bild.src = leinwand.toDataURL();
        ansicht.append(bild);
        document.querySelector(".abenteuer-dialog")?.prepend(ansicht);
      });
      await page.waitForTimeout(500);
      const spalte = await rechteck(page, ".abenteuer-dialog");
      const bild = await rechteck(page, ".abenteuer-grossansicht img");
      expect(await imBild(page, ".abenteuer-grossansicht img")).toBe(true);
      expect(bild?.rechts ?? 0).toBeLessThanOrEqual(spalte?.links ?? 0);
      expect(bild?.breite ?? 0).toBeGreaterThan(g.viewport.width * 0.3);
      // Die Wahlen bleiben im Bild.
      await expect(page.locator(".abenteuer-dialog-wahlen button").first()).toBeInViewport({
        ratio: 1,
      });
      await foto(page, "grossbild", g.name);
    });

    test("Tagebuch in voller Höhe, rollt mit dem Finger, „Schließen“ im Bild", async ({ page }) => {
      test.slow();
      await starteMitStand(page, MAMA);
      await page.getByTestId("abenteuer-tagebuchknopf").click({ timeout: 15000 });
      const buch = page.getByTestId("abenteuer-tagebuch");
      await expect(buch).toBeVisible();
      const r = await rechteck(page, "[data-testid='abenteuer-tagebuch']");
      // Nicht erst unter der Kopfzeile: Fast die ganze Höhe gehört dem Tagebuch.
      expect((r?.unten ?? 0) - (r?.oben ?? 0)).toBeGreaterThan(g.viewport.height * 0.85);
      expect(await imBild(page, "[data-testid='abenteuer-tagebuch']")).toBe(true);
      await expect(buch.locator(":scope > .knopf-haupt")).toBeInViewport({ ratio: 1 });
      await wischeHoch(page, "[data-testid='abenteuer-tagebuch']");
      expect(await buch.evaluate((e) => e.scrollTop)).toBeGreaterThan(0);
      await foto(page, "tagebuch", g.name);
    });
  });
}
