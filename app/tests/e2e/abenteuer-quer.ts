/**
 * Hilfen für die Querformat-Tests (abenteuer-quertext.spec.ts, abenteuer-querbretter.spec.ts):
 * Geräte quer, Rechtecke, „ganz im Bild“, kleine Fotos für den Bericht und ein Wisch mit dem
 * Finger (CDP in Chromium; WebKit rollt per Skript).
 * Mit QUER_FOTOS=ORDNER legen die Tests kleine Fotos jeder Lage ab.
 */
import { devices, type Page } from "@playwright/test";

const FOTOS = process.env.QUER_FOTOS ?? "";
/** So weit wischt der Finger im Rolltest nach oben (CSS-Pixel), in so vielen Schritten. */
const WISCHWEG = 220;
const WISCHSCHRITTE = 8;
/** So oft wischt er höchstens. */
export const WISCHVERSUCHE = 6;

export const GERAETE = [
  { name: "iPhone 15 quer", ...geraet("iPhone 15 landscape") },
  { name: "Pixel 7 quer", ...geraet("Pixel 7 landscape") },
  {
    name: "großes iPhone als Web-App",
    ...geraet("iPhone 15 landscape"),
    viewport: { width: 932, height: 430 },
  },
];

/** Gerät quer: nur Fenster, Maßstab, Touch und Kennung (der Browser bleibt der des Projekts). */
export function geraet(name: "iPhone 15 landscape" | "Pixel 7 landscape") {
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
export async function rechteck(seite: Page, auswahl: string) {
  return seite.evaluate((s) => {
    const e = [...document.querySelectorAll(s)].pop();
    if (!e) return null;
    const r = e.getBoundingClientRect();
    return { oben: r.top, unten: r.bottom, links: r.left, rechts: r.right, breite: r.width };
  }, auswahl);
}

/** Ganz im Bild? */
export async function imBild(seite: Page, auswahl: string): Promise<boolean> {
  const r = await rechteck(seite, auswahl);
  const { width, height } = seite.viewportSize() ?? { width: 0, height: 0 };
  return !!r && r.oben >= 0 && r.links >= 0 && r.unten <= height && r.rechts <= width;
}

export async function foto(seite: Page, name: string, geraetname: string): Promise<void> {
  if (!FOTOS) return;
  const datei = `${FOTOS}/${geraetname.replace(/\W+/g, "-")}-${name}.jpg`;
  await seite.screenshot({ path: datei, type: "jpeg", quality: 55, scale: "css" });
}

/** Wischt mit einem Finger über die Mitte des Elements nach oben (CDP; WebKit: Mausrad). */
export async function wischeHoch(seite: Page, auswahl: string): Promise<void> {
  const r = await rechteck(seite, auswahl);
  if (!r) throw new Error(`${auswahl} fehlt`);
  const x = Math.round(r.links + r.breite / 2);
  const start = Math.round(r.unten - 40);
  if (seite.context().browser()?.browserType().name() !== "chromium") {
    // WebKit hat kein CDP für Touch: dort rollt der Test das Fenster selbst; die Fingergesten
    // erlauben dort die Stilwerte, die der Test prüft (touch-action, overflow).
    await seite.evaluate(
      ([s, weg]) => [...document.querySelectorAll(s)].pop()?.scrollBy(0, weg as number),
      [auswahl, WISCHWEG] as const,
    );
    return;
  }
  const cdp = await seite.context().newCDPSession(seite);
  const punkt = (y: number) => [{ x, y, id: 1 }];
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: punkt(start) });
  for (let i = 1; i <= WISCHSCHRITTE; i++) {
    const y = start - Math.round((WISCHWEG * i) / WISCHSCHRITTE);
    await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: punkt(y) });
  }
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
}
