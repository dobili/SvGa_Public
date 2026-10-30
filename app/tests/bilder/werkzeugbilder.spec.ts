/**
 * Erzeugt die Bildschirmfotos der Werkzeuge für das Werkzeugverzeichnis (Paket F der
 * Ideensammlung, 26.10.2026): je Werkzeug die Beispiel-Abbildung öffnen, das Werkzeug wie ein
 * Leser wählen und Leiste, Brett und Karte fotografieren. Gold umrandet mit Nummer: was der Leser
 * antippt, in dieser Reihenfolge (Bündel, Reiter, bei „Zählen“ das Feld); gold umrandet ohne
 * Nummer: Brett und Karte mit dem Ergebnis. Aufruf: `npm run bilder:werkzeuge`
 * (playwright.bilder.config.ts). Die Bilder landen als WebP in public/bilder/werkzeuge/.
 */
import { mkdirSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import sharp from "sharp";
import {
  WERKZEUGBEISPIELE,
  werkzeugbildpfad,
} from "../../src/ui/komponenten/nachschlagen/werkzeugbeispiele";
import de from "../../src/i18n/de.json" with { type: "json" };
import { oeffneAbbildung, starteImBrowser, waehleWerkzeug } from "../e2e/hilfen";

/** Zielbreite der Bilder in Bildpunkten. */
const BILDBREITE = 480;
/** Qualität der WebP-Bilder (0–100): klein genug für den Offline-Speicher, scharf genug für Text. */
const WEBP_QUALITAET = 72;
/** Höchstens so lange darf die Engine für ein Bild rechnen. */
const ENGINE_FRIST_MS = 45_000;
/** Ruhe nach dem Ergebnis, bis Pfeile und Übergänge stehen. */
const RUHE_MS = 800;
/** Rand um den fotografierten Bereich in CSS-Pixeln. */
const RAND = 16;
/** Höchstens so hoch wird das Bild (CSS-Pixel), damit lange Karten nicht ausufern. */
const HOECHSTE_HOEHE = 1100;
/** Wurzel der App-Dateien, in die die Bilder geschrieben werden. */
const OEFFENTLICH = new URL("../../public/", import.meta.url);

/** Was der Leser antippt, in der Reihenfolge der Seite (Leiste, Reiter). */
const SCHRITTE = [
  '.bildschirm-abbildung [role="group"] [aria-pressed="true"]',
  '.bildschirm-abbildung [role="toolbar"] [aria-pressed="true"]',
  '.bildschirm-abbildung [role="tab"][aria-selected="true"]',
].join(", ");

/**
 * Legt die goldenen Rahmen über die Seite und liefert den Ausschnitt fürs Foto. Läuft im Browser;
 * `feld` ist der Name eines angetippten Feldes (nur „Zählen“).
 */
function rahmenImBrowser(a: {
  schritte: string;
  feld: string | null;
  engine: string | null;
  rand: number;
  hoehe: number;
}) {
  const GOLD = "#c9a227";
  const boxen: { y: number; h: number }[] = [];
  const rahmen = (ziel: Element, nummer: number | null) => {
    const r = ziel.getBoundingClientRect();
    const box = { x: r.left + window.scrollX, y: r.top + window.scrollY, w: r.width, h: r.height };
    boxen.push({ y: box.y, h: box.h });
    const el = document.createElement("div");
    Object.assign(el.style, {
      position: "absolute",
      left: `${box.x - 3}px`,
      top: `${box.y - 3}px`,
      width: `${box.w + 6}px`,
      height: `${box.h + 6}px`,
      border: `3px solid ${GOLD}`,
      borderRadius: "8px",
      pointerEvents: "none",
      zIndex: "9999",
    });
    if (nummer !== null) {
      const marke = document.createElement("span");
      marke.textContent = String(nummer);
      Object.assign(marke.style, {
        position: "absolute",
        right: "-13px",
        top: "-13px",
        width: "26px",
        height: "26px",
        borderRadius: "50%",
        background: GOLD,
        color: "#14213d",
        font: "700 16px/26px sans-serif",
        textAlign: "center",
      });
      el.append(marke);
    }
    document.body.append(el);
  };
  for (const kachel of document.querySelectorAll('[data-testid="werkzeug-erklaerung"]')) {
    (kachel as HTMLElement).style.display = "none";
  }
  // Leiste unten und klebende Kopfzeilen stünden im Ganzseitenfoto mitten im Bild.
  for (const el of document.querySelectorAll("body *")) {
    const lage = getComputedStyle(el).position;
    if (lage === "fixed" || lage === "sticky") (el as HTMLElement).style.visibility = "hidden";
  }
  const schritte = [...document.querySelectorAll(a.schritte)];
  const feld = a.feld ? document.querySelector(`[aria-label="${a.feld}"]`) : null;
  [...schritte, ...(feld ? [feld] : [])].forEach((ziel, i) => rahmen(ziel, i + 1));
  for (const ziel of [
    document.querySelector(".bildschirm-abbildung .brett"),
    document.querySelector('[data-testid="werkzeugkarte"]'),
    a.engine ? document.querySelector(`[data-testid="${a.engine}"]`) : null,
  ]) {
    // Eine Engine-Karte in der Werkzeugkarte bekommt keinen eigenen Rahmen.
    const innen = ziel?.parentElement?.closest('[data-testid="werkzeugkarte"]');
    if (ziel && !innen) rahmen(ziel, null);
  }
  const oben = Math.max(0, Math.min(...boxen.map((b) => b.y)) - a.rand);
  const unten = Math.max(...boxen.map((b) => b.y + b.h)) + a.rand;
  const hoehe = Math.min(a.hoehe, unten - oben);
  if (unten - oben > a.hoehe) {
    // Abgeschnittene Karte: unten weich ausblenden.
    const blende = document.createElement("div");
    Object.assign(blende.style, {
      position: "absolute",
      left: "0",
      right: "0",
      top: `${oben + hoehe - 80}px`,
      height: "80px",
      background: `linear-gradient(transparent, ${getComputedStyle(document.body).backgroundColor})`,
      zIndex: "10000",
    });
    document.body.append(blende);
  }
  return { x: 0, y: oben, width: document.documentElement.clientWidth, height: hoehe };
}

/** Rahmen setzen und den Ausschnitt fürs Foto holen. */
function markiere(seite: Page, feld: string | null, engine: string | null) {
  return seite.evaluate(rahmenImBrowser, {
    schritte: SCHRITTE,
    feld,
    engine,
    rand: RAND,
    hoehe: HOECHSTE_HOEHE,
  });
}

for (const [kennung, beispiel] of Object.entries(WERKZEUGBEISPIELE)) {
  const name = de[`werkzeug.${kennung}.name` as keyof typeof de];
  test(`Bild ${kennung} (${name}) an Abb. ${beispiel.abbildung}`, async ({ page }) => {
    test.setTimeout(ENGINE_FRIST_MS * 2);
    await starteImBrowser(page);
    await oeffneAbbildung(page, beispiel.abbildung, beispiel.abbildung);
    if (beispiel.feld) {
      const amBrett = page.getByRole("group", { name: "Werkzeuge am Brett" });
      await amBrett.getByRole("button", { name, exact: true }).click();
      await page.getByRole("button", { name: beispiel.feld }).click();
    } else {
      await waehleWerkzeug(page, name);
    }
    const karte = page.getByTestId("werkzeugkarte");
    await expect(karte).toBeVisible();
    if (beispiel.engine) {
      await expect(page.getByTestId(beispiel.engine.karte)).toContainText(beispiel.engine.text, {
        timeout: ENGINE_FRIST_MS,
      });
    }
    await page.waitForTimeout(RUHE_MS);
    const ausschnitt = await markiere(page, beispiel.feld ?? null, beispiel.engine?.karte ?? null);
    const roh = await page.screenshot({ clip: ausschnitt, fullPage: true });
    const ziel = new URL(werkzeugbildpfad(kennung as keyof typeof WERKZEUGBEISPIELE), OEFFENTLICH);
    mkdirSync(new URL(".", ziel), { recursive: true });
    await sharp(roh)
      .resize({ width: BILDBREITE })
      .webp({ quality: WEBP_QUALITAET })
      .toFile(ziel.pathname);
  });
}
