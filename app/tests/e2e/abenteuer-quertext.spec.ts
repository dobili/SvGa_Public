/**
 * Texte im Querformat als Seitenspalte (Wunsch des Autors, 20.11.2026, querformat.css): Quer
 * steht das Dialogfenster rechts in voller Höhe, gegenüber dem Steuerkreuz. Text und alle Wahlen
 * sind im Bild oder durch Rollen erreichbar, auch mit dem Finger. Nichts liegt unter dem Rand, und
 * Menü und Steuerkreuz überdecken die Spalte nicht. Ein Großbild steht in der freien Fläche
 * daneben. Geprüft auf iPhone 15 quer (734 × 343), Pixel 7 quer (863 × 360) und einem großen
 * iPhone als Web-App (932 × 430).
 * Mit QUER_FOTOS=ORDNER legt der Test kleine Fotos jeder Lage ab (für den Bericht).
 */
import { devices, expect, test, type Page } from "@playwright/test";
import { EINLEITUNG_GESEHEN, GRUNDSTAND, starteMitStand } from "./abenteuer-affe";

const FOTOS = process.env.QUER_FOTOS ?? "";
/** Wahlen blenden nach der Schutzzeit ein (dialog/wahlschutz.ts, 0,4 s Übergang). */
const EINBLENDEN_MS = 900;
/** So viele lange Antworten hängt der Rolltest an. */
const LANGE_ANTWORTEN = 6;
/** So weit wischt der Finger im Rolltest nach oben (CSS-Pixel), in so vielen Schritten. */
const WISCHWEG = 220;
const WISCHSCHRITTE = 8;
/** So oft wischt er höchstens. */
const WISCHVERSUCHE = 6;

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

const GERAETE = [
  { name: "iPhone 15 quer", ...geraet("iPhone 15 landscape") },
  { name: "Pixel 7 quer", ...geraet("Pixel 7 landscape") },
  {
    name: "großes iPhone als Web-App",
    ...geraet("iPhone 15 landscape"),
    viewport: { width: 932, height: 430 },
  },
];

/** Gerät quer: nur Fenster, Maßstab, Touch und Kennung (der Browser bleibt der des Projekts). */
function geraet(name: "iPhone 15 landscape" | "Pixel 7 landscape") {
  const d = devices[name];
  return {
    viewport: d.viewport,
    deviceScaleFactor: d.deviceScaleFactor,
    isMobile: d.isMobile,
    hasTouch: d.hasTouch,
    userAgent: d.userAgent,
  };
}

/** Rechteck eines Elements (das letzte sichtbare zur Auswahl) oder null. */
async function rechteck(seite: Page, auswahl: string) {
  return seite.evaluate((s) => {
    const e = [...document.querySelectorAll(s)].pop();
    if (!e) return null;
    const r = e.getBoundingClientRect();
    return { oben: r.top, unten: r.bottom, links: r.left, rechts: r.right, breite: r.width };
  }, auswahl);
}

/** Ganz im Bild? */
async function imBild(seite: Page, auswahl: string): Promise<boolean> {
  const r = await rechteck(seite, auswahl);
  const { width, height } = seite.viewportSize() ?? { width: 0, height: 0 };
  return !!r && r.oben >= 0 && r.links >= 0 && r.unten <= height && r.rechts <= width;
}

async function foto(seite: Page, name: string, geraetname: string): Promise<void> {
  if (!FOTOS) return;
  const datei = `${FOTOS}/${geraetname.replace(/\W+/g, "-")}-${name}.jpg`;
  await seite.screenshot({ path: datei, type: "jpeg", quality: 55, scale: "css" });
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

/** Wischt mit einem Finger über die Mitte des Elements nach oben (CDP, nur Chromium). */
async function wischeHoch(seite: Page, auswahl: string): Promise<void> {
  const r = await rechteck(seite, auswahl);
  if (!r) throw new Error(`${auswahl} fehlt`);
  const x = Math.round(r.links + r.breite / 2);
  const start = Math.round(r.unten - 40);
  const cdp = await seite.context().newCDPSession(seite);
  const punkt = (y: number) => [{ x, y, id: 1 }];
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: punkt(start) });
  for (let i = 1; i <= WISCHSCHRITTE; i++) {
    const y = start - Math.round((WISCHWEG * i) / WISCHSCHRITTE);
    await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: punkt(y) });
  }
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
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
        if (await imBild(page, ".abenteuer-dialog-wahlen button[data-lang]:last-child")) break;
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

    test("Brett der Übungspartie ganz im Bild", async ({ page }) => {
      test.slow();
      await starteMitStand(page, { ...GRUNDSTAND, dialogvariablen: EINLEITUNG_GESEHEN });
      const hinweis = page.getByTestId("abenteuer-meldung").getByRole("button", { name: "Weiter" });
      await expect(page.getByTestId("abenteuer-reisebrettknopf")).toBeVisible({ timeout: 20000 });
      if (await hinweis.isVisible()) await hinweis.click();
      await page.getByTestId("abenteuer-reisebrettknopf").click();
      await page.getByTestId("abenteuer-deck-los").click();
      await expect(page.locator(".brett").first()).toBeVisible({ timeout: 20000 });
      await page.waitForTimeout(EINBLENDEN_MS);
      expect(await imBild(page, ".brett")).toBe(true);
      await foto(page, "partie", g.name);
    });
  });
}
