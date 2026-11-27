/**
 * Schach-Abenteuer, ein Phaser-Spiel für die ganze Oberwelt (Wunsch des Autors, 26.11.2026):
 * Beim Kartenwechsel startet nur die Szene neu; Leinwand, WebGL-Kontext und die Bilder, die auf
 * mehreren Karten vorkommen, bleiben (oberweltspiel.ts, texturspeicher.ts).
 *
 * Was geprüft wird: 24 Durchgänge durch das Haus in Maple Falls (Haustür, Treppen, Dachboden und
 * zurück, je Karte viermal). Danach ist es dieselbe Leinwand wie am Anfang, es läuft genau eine
 * Szene, und bei jedem Besuch einer Karte hängen am Spiel so viele Hörer wie beim ersten (kein
 * Hörer bleibt von einer alten Szene übrig); Texturen und Animationen wachsen nicht, Hörer im
 * Dokument (CDP) und WebGL-Kontexte auch nicht. Ab dem zweiten Besuch lädt eine Karte nichts
 * Gemeinsames neu (Treffer im Texturspeicher). Zum Schluss verlässt der Spieler das Abenteuer und
 * kommt zurück: Das Spiel hat geschlafen, die Leinwand ist dieselbe.
 * Abhängigkeiten: abenteuer-ausdauer-haus.ts (Weg durchs Haus), abenteuer-ausdauer-messfuehler.ts.
 */
import { expect, test, type Page } from "@playwright/test";
import { leererAbenteuerstand } from "../../src/abenteuer/regeln/spielstand";
import { EINLEITUNG_GESEHEN, GRUNDSTAND, beobachte, starteMitStand } from "./abenteuer-affe";
import { raeumeAuf } from "./abenteuer-ausdauer-ablauf";
import { hauslauf, hausschritt, karteDesHelden, type Hausweg } from "./abenteuer-ausdauer-haus";
import { miss, oeffneMessung, zaehlerSkript } from "./abenteuer-ausdauer-messfuehler";

/** Durchgänge durch das Haus: viermal die Kette aus sechs Übergängen. */
const DURCHGAENGE = 24;
/** Hörer im Dokument dürfen so viel schwanken (React, Dialoge), wachsen aber nicht je Wechsel. */
const DOKUMENTHOERER_SPIEL = 40;
const FRIST_MS = 40_000;
/** Nach einem Schritt durchs Haus: so lange auf die neue Szene warten. */
const WECHSEL_FRIST_MS = 8000;
const ABFRAGE_MS = 100;

/** Kennzahlen, die das Spiel nach jedem Aufbau einer Szene an die Leinwand schreibt. */
interface Diagnose {
  readonly szene: number;
  readonly szenen: number;
  readonly hoerer: number;
  readonly animationen: number;
  readonly texturen: number;
  readonly bytes: number;
  readonly behalten: number;
  readonly geladen: number;
}

const STAND = {
  ...leererAbenteuerstand(new Date(0), "Kim", null, false),
  ...GRUNDSTAND,
  position: { karte: "mapleFalls.aussen", x: 3, y: 24, richtung: "unten" },
  dialogvariablen: {
    ...EINLEITUNG_GESEHEN,
    hinweisSteuerkreuz: true,
    hinweisAktion: true,
    hinweisTagebuch: true,
    hinweisMenue: true,
    hinweisRennen: true,
  },
};

/** Die Kennzahlen an der Leinwand, oder null (gerade keine Karte). */
async function liesDiagnose(seite: Page): Promise<Diagnose | null> {
  const roh = await seite
    .locator(".abenteuer-welt canvas")
    .getAttribute("data-diagnose", { timeout: 1000 })
    .catch(() => null);
  return roh ? (JSON.parse(roh) as Diagnose) : null;
}

/**
 * Wartet, bis eine Szene nach `vorher` steht, und liest ihre Kennzahlen; null, wenn in der Frist
 * keine kam (statt des Wechsels ging ein Dialog auf, etwa Mama vor der Haustür).
 */
async function diagnoseNach(
  seite: Page,
  vorher: number,
  frist = FRIST_MS,
): Promise<Diagnose | null> {
  const ende = Date.now() + frist;
  while (Date.now() < ende) {
    const d = await liesDiagnose(seite);
    if (d && d.szene > vorher) return d;
    await seite.waitForTimeout(ABFRAGE_MS);
  }
  return null;
}

/** Markiert die Leinwand im Browser; später zeigt die Marke, ob es noch dieselbe ist. */
function markiere(seite: Page): Promise<void> {
  return seite.evaluate(() => {
    const c = document.querySelector(".abenteuer-welt canvas");
    if (c) (c as unknown as { __einSpiel: boolean }).__einSpiel = true;
  });
}

function dieselbe(seite: Page): Promise<boolean> {
  return seite.evaluate(() => {
    const c = document.querySelector(".abenteuer-welt canvas");
    return Boolean(c && (c as unknown as { __einSpiel?: boolean }).__einSpiel);
  });
}

test("Ein Phaser-Spiel über alle Kartenwechsel, ohne Lecks", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "Hörer im Dokument zählt CDP nur in Chromium");
  test.setTimeout(10 * 60_000);
  const funde = beobachte(page);
  await page.addInitScript(zaehlerSkript);
  await page.addInitScript(() => window.localStorage.setItem("svga.safariHinweis", "aus"));
  await starteMitStand(page, STAND);
  await raeumeAuf(page);
  const cdp = await oeffneMessung(page);
  let letzte = await diagnoseNach(page, 0);
  if (!letzte) throw new Error("keine Szene nach dem Start");
  await markiere(page);
  const basis = await miss(page, cdp, "Start", 0);
  const lauf = hauslauf(page, cdp);
  const weg: Hausweg = { glied: 0 };
  /** Je Karte die Kennzahlen aller Besuche. */
  const besuche = new Map<string, Diagnose[]>();
  for (let i = 0, n = 0; n < DURCHGAENGE && i < DURCHGAENGE * 3; i++) {
    if (!(await hausschritt(lauf, weg))) {
      await raeumeAuf(page);
      continue;
    }
    const neu = await diagnoseNach(page, letzte.szene, WECHSEL_FRIST_MS);
    await raeumeAuf(page);
    if (!neu) continue; // ein Dialog statt des Wechsels
    n += 1;
    letzte = neu;
    const karte = await karteDesHelden(page);
    besuche.set(karte, [...(besuche.get(karte) ?? []), letzte]);
    expect(letzte.szenen, `eine Szene auf ${karte}`).toBe(1);
  }
  const ende = await miss(page, cdp, "Ende", DURCHGAENGE);
  console.log(`Ein Spiel: ${JSON.stringify([...besuche].map(([k, d]) => [k, d.at(-1)]))}`);
  expect(await dieselbe(page), "dieselbe Leinwand nach allen Wechseln").toBe(true);
  expect(page.locator("canvas")).toHaveCount(1);
  for (const [karte, liste] of besuche) {
    const erster = liste[0];
    const zweiter = liste[1];
    if (!erster || !zweiter) continue;
    for (const d of liste.slice(1)) {
      expect(d.hoerer, `Hörer am Spiel auf ${karte}`).toBeLessThanOrEqual(erster.hoerer);
      expect(d.animationen, `Animationen auf ${karte}`).toBeLessThanOrEqual(zweiter.animationen);
      expect(d.texturen, `Texturen auf ${karte}`).toBeLessThanOrEqual(zweiter.texturen);
    }
    // Ab dem zweiten Besuch kommt alles Gemeinsame aus dem Speicher.
    expect(zweiter.behalten, `Treffer auf ${karte}`).toBeGreaterThan(0);
  }
  expect(ende.kontexte, "WebGL-Kontexte").toBeLessThanOrEqual(basis.kontexte);
  expect(ende.listener - basis.listener, "Hörer im Dokument").toBeLessThan(DOKUMENTHOERER_SPIEL);

  // Abenteuer verlassen und zurück: das Spiel hat geschlafen und zeigt dieselbe Leinwand.
  await page.getByTestId("abenteuer-menueknopf").click();
  await page.getByRole("button", { name: "Zurück zur App" }).click();
  await expect(page.locator(".abenteuer-welt canvas")).toHaveCount(0, { timeout: FRIST_MS });
  await page.goto("/app/#abenteuer");
  await page
    .getByRole("button", { name: "Weitermachen" })
    .click({ timeout: 10_000 })
    .catch(() => undefined);
  expect(await diagnoseNach(page, letzte.szene), "Szene nach dem Zurückkommen").not.toBeNull();
  expect(await dieselbe(page), "dieselbe Leinwand nach dem Schlaf").toBe(true);
  expect(funde).toEqual([]);
});
