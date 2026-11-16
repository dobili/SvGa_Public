/**
 * Schach-Abenteuer, Messung von Startzeit und Downloadgröße (Auftrag „Leistung“, 16.11.2026):
 * keine Prüfung, sondern ein Messwerkzeug. Läuft nur mit ABENTEUER_MESSUNG=1, sonst übersprungen.
 *
 * Gemessen wird gegen `npm run build` und die Vorschau, mit leerem Cache:
 * - Kaltstart: Tippen auf „Spiel herunterladen“ bis zur ersten Karte (Aktionsknopf sichtbar) und
 *   die Bytes unter /abenteuer/ bis dahin;
 * - danach: Bytes, bis der Hintergrund still ist (Ton des Akts, Musik der Karte), das ist die
 *   Downloadgröße beim Start;
 * - Warmstart: Seite neu laden bis zur ersten Karte (alles aus dem Cache).
 * Der Ton der App ist an, damit die Musik der Karte wirklich verlangt wird.
 * Aufruf: ABENTEUER_MESSUNG=1 CHROMIUM_PFAD=… PLAYWRIGHT_NUR_CHROMIUM=1 npx playwright test
 * abenteuer-messung --trace off; die Werte stehen in der Ausgabe (Zeile „Messung:“).
 */
import { readFileSync } from "node:fs";
import { expect, test, type BrowserContext, type Page } from "@playwright/test";
import { feldDarunter } from "./abenteuer-karte";
import { starteImBrowser } from "./hilfen";

const STAND = {
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
    karte: "mapleFalls.park",
    ...feldDarunter("maple-falls-park", "kiosk"),
    richtung: "oben",
  },
  besuchteOrte: ["mapleFalls"],
  muenzen: 50,
};

/** Spielstand schreiben und den Ton der App einschalten. */
function schreibeStand(stand: object): Promise<boolean> {
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
        const einstellungen = { ...(alt.einstellungen as object), ton: "an" };
        const schreiben = bereich.put({ ...alt, einstellungen, abenteuer: stand }, "aktuell");
        schreiben.onsuccess = () => {
          db.close();
          fertig(true);
        };
        schreiben.onerror = () => fehler(schreiben.error);
      };
    };
  });
}

/**
 * Zählt die Dateien des Pakets, die unter /abenteuer/ angefragt wurden, mit ihrer Größe laut
 * paket.json (die Größenangaben des Browsers fehlen bei Abrufen des Service Workers oft).
 */
function zaehler(kontext: BrowserContext): { bytes: () => number; anzahl: () => number } {
  const groessen = new Map<string, number>(
    (
      JSON.parse(
        readFileSync(new URL("../../public/abenteuer/paket.json", import.meta.url), "utf8"),
      ) as {
        dateien: { pfad: string; bytes: number }[];
      }
    ).dateien.map((d) => [d.pfad, d.bytes]),
  );
  const gesehen = new Set<string>();
  kontext.on("requestfinished", (anfrage) => {
    const pfad = new URL(anfrage.url()).pathname.split("/abenteuer/")[1];
    if (pfad && groessen.has(pfad)) gesehen.add(pfad);
  });
  const bytes = () => [...gesehen].reduce((s, p) => s + (groessen.get(p) ?? 0), 0);
  return { bytes, anzahl: () => gesehen.size };
}

/** Wartet, bis `still_ms` lang keine neuen Bytes kommen (Hintergrundladen fertig). */
async function warteAufRuhe(seite: Page, bytes: () => number, stillMs = 4000): Promise<void> {
  let zuletzt = -1;
  for (let i = 0; i < 120; i++) {
    if (bytes() === zuletzt) return;
    zuletzt = bytes();
    await seite.waitForTimeout(stillMs);
  }
}

const KB = 1024;

test("Messung: Startzeit und Downloadgröße", async ({ page, context }) => {
  test.skip(!process.env.ABENTEUER_MESSUNG, "nur mit ABENTEUER_MESSUNG=1");
  test.setTimeout(600_000);
  await starteImBrowser(page);
  await expect.poll(() => page.evaluate(schreibeStand, STAND)).toBe(true);
  await page.reload();
  await page.goto("/app/#abenteuer");
  const z = zaehler(context);
  const knopf = page.getByTestId("abenteuer-laden");
  await expect(knopf).toBeVisible({ timeout: 30000 });
  const vorher = z.bytes();
  const beginn = Date.now();
  await knopf.click();
  await expect(page.getByTestId("abenteuer-aktion")).toBeVisible({ timeout: 300000 });
  const bisKarte = Date.now() - beginn;
  const bytesKarte = z.bytes() - vorher;
  // Eine Berührung entsperrt den Ton (wie am Handy), dann lädt die Musik der Karte.
  await page.getByTestId("abenteuer-welt").click({ position: { x: 5, y: 5 } });
  await warteAufRuhe(page, z.bytes);
  const bytesStart = z.bytes() - vorher;
  const beginnWarm = Date.now();
  await page.reload();
  await page.goto("/app/#abenteuer");
  await expect(page.getByTestId("abenteuer-aktion")).toBeVisible({ timeout: 120000 });
  const warm = Date.now() - beginnWarm;
  console.log(
    `Messung: Kaltstart bis Karte ${bisKarte} ms, ${Math.round(bytesKarte / KB)} KB; ` +
      `Download beim Start ${Math.round(bytesStart / KB)} KB (${z.anzahl()} Anfragen); ` +
      `Warmstart bis Karte ${warm} ms`,
  );
});
