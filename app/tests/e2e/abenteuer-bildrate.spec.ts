/**
 * Schach-Abenteuer, Messung der Bildrate beim Laufen (Auftrag „Leistung nach Variante B“,
 * 17.11.2026): keine Prüfung, sondern ein Messwerkzeug. Läuft nur mit ABENTEUER_BILDRATE=1.
 *
 * Warum: Seit Variante B hat das Spielbild die volle Auflösung der Seite (Kamera-Zoom 3,
 * weltmassstab.ts), etwa neunmal so viele Pixel wie vorher. Der Autor fürchtet Ruckeln auf älteren
 * Handys. Gemessen wird in Chromium mit gedrosselter CPU (CDP Emulation.setCPUThrottlingRate) in
 * Handygröße hoch und quer auf großen Außenkarten: Der Held läuft je 5 s nach rechts und nach links,
 * dabei zählt ein requestAnimationFrame-Zähler Bildrate und Bildzeiten (Phaser zeichnet im selben
 * Takt). Drosselstufen über ABENTEUER_DROSSELUNG (Vorgabe „4,6“). Ergebnis vom 17.11.2026 in
 * docs/spiel/auftraege/rueckmeldung/leistung_17-11.md.
 * Aufruf (gegen `npm run build`):
 * ABENTEUER_BILDRATE=1 CHROMIUM_PFAD=… PLAYWRIGHT_NUR_CHROMIUM=1 npx playwright test abenteuer-bildrate --trace off
 * Die Werte stehen in der Ausgabe (Zeilen „Bildrate:“).
 */
import { expect, test, type Page } from "@playwright/test";
import { feldVon } from "./abenteuer-karte";
import { starteImBrowser } from "./hilfen";

const KARTEN = [
  { kennung: "mapleFalls.aussen", datei: "maple-falls-aussen", ort: "mapleFalls" },
  { kennung: "riverton.aussen", datei: "riverton-aussen", ort: "riverton" },
  { kennung: "capitalArena.aussen", datei: "capital-arena-aussen", ort: "capitalArena" },
];
const GROESSEN = [
  { name: "hoch", width: 420, height: 800 },
  { name: "quer", width: 800, height: 420 },
];
const DROSSELUNG = (process.env.ABENTEUER_DROSSELUNG ?? "4,6").split(",").map(Number);
const LAUF_MS = 5000;
/** Bildzeit über dieser Grenze zählt als Ruckler (unter 30 Bildern je Sekunde). */
const RUCKLER_MS = 1000 / 30;

function stand(karte: (typeof KARTEN)[number]) {
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
    position: { karte: karte.kennung, ...feldVon(karte.datei, "start"), richtung: "unten" },
    besuchteOrte: ["mapleFalls", karte.ort],
    muenzen: 0,
  };
}

/** Spielstand des Abenteuers in die gespeicherten Nutzerdaten schreiben. */
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

/** Startet den Zähler: Zeitstempel jedes Bildes in window.__bildzeiten. */
function starteZaehler(seite: Page): Promise<void> {
  return seite.evaluate(() => {
    const zeiten: number[] = [];
    (window as unknown as { __bildzeiten: number[] }).__bildzeiten = zeiten;
    const schritt = (t: number) => {
      zeiten.push(t);
      requestAnimationFrame(schritt);
    };
    requestAnimationFrame(schritt);
  });
}

interface Werte {
  bilder: number;
  bildrate: number;
  mittel: number;
  p95: number;
  ruckler: number;
}

async function auswerten(seite: Page): Promise<Werte> {
  const zeiten = await seite.evaluate(
    () => (window as unknown as { __bildzeiten: number[] }).__bildzeiten,
  );
  const abstaende = zeiten.slice(1).map((t, i) => t - (zeiten[i] ?? t));
  const sortiert = [...abstaende].sort((a, b) => a - b);
  const dauer = (zeiten.at(-1) ?? 0) - (zeiten[0] ?? 0);
  const summe = abstaende.reduce((s, a) => s + a, 0);
  return {
    bilder: abstaende.length,
    bildrate: Math.round((abstaende.length / dauer) * 1000 * 10) / 10,
    mittel: Math.round((summe / abstaende.length) * 10) / 10,
    p95: Math.round((sortiert[Math.floor(sortiert.length * 0.95)] ?? 0) * 10) / 10,
    ruckler: Math.round((abstaende.filter((a) => a > RUCKLER_MS).length / abstaende.length) * 100),
  };
}

for (const karte of KARTEN) {
  for (const groesse of GROESSEN) {
    test(`Bildrate ${karte.datei} ${groesse.name}`, async ({ page }) => {
      test.skip(!process.env.ABENTEUER_BILDRATE, "nur mit ABENTEUER_BILDRATE=1");
      test.setTimeout(300_000);
      await page.setViewportSize({ width: groesse.width, height: groesse.height });
      await starteImBrowser(page);
      await expect.poll(() => page.evaluate(schreibeStand, stand(karte))).toBe(true);
      await page.reload();
      await page.goto("/app/#abenteuer");
      const laden = page.getByTestId("abenteuer-laden");
      await expect(laden).toBeVisible({ timeout: 30000 });
      await laden.click();
      await expect(page.getByTestId("abenteuer-welt")).toBeVisible({ timeout: 120000 });
      await page.waitForTimeout(3000);
      // Hinweise beim ersten Betreten (Münzen, Steuerung) wegklicken, sonst läuft der Held nicht.
      const weiter = page.getByRole("button", { name: "Weiter" });
      for (let i = 0; i < 6 && (await weiter.count()) > 0; i++) {
        await weiter.first().click();
        await page.waitForTimeout(500);
      }
      const cdp = await page.context().newCDPSession(page);
      for (const rate of DROSSELUNG) {
        await cdp.send("Emulation.setCPUThrottlingRate", { rate });
        await page.waitForTimeout(1000);
        const vorher = await page.getByTestId("abenteuer-welt").screenshot();
        await starteZaehler(page);
        let bewegt = false;
        for (const taste of ["ArrowRight", "ArrowLeft"]) {
          await page.keyboard.down(taste);
          await page.waitForTimeout(LAUF_MS);
          await page.keyboard.up(taste);
          // Nach der ersten Strecke: Hat sich das Bild verändert, lief der Held (zurück steht er
          // wieder am selben Fleck, deshalb nicht erst am Ende vergleichen).
          if (taste === "ArrowRight") {
            bewegt = !vorher.equals(await page.getByTestId("abenteuer-welt").screenshot());
          }
        }
        const w = await auswerten(page);
        console.log(
          `Bildrate: ${karte.datei} ${groesse.name} ${groesse.width}×${groesse.height} ` +
            `Drosselung ${rate}×: ${w.bildrate} B/s, Bildzeit Mittel ` +
            `${w.mittel} ms, 95 % ${w.p95} ms, Ruckler ${w.ruckler} % (${w.bilder} Bilder)${bewegt ? "" : ", HELD STAND STILL"}`,
        );
      }
      await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });
    });
  }
}
