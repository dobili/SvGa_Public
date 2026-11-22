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
 * Mit ABENTEUER_DROSSEL_MBIT=10 (Auftrag „Größe und Startzeit“, 20.11.2026) drosselt Chromium das
 * Netz wie Mobilfunk (Bandbreite in Mbit/s, 40 ms Laufzeit). Die Vorschau komprimiert nicht; der
 * Server der App liefert JSON gzip-komprimiert, gedrosselt gemessen ist also eher zu langsam.
 * Die Zeile „Gruppen:“ nennt die Bytes bis zur Karte je Paketgruppe.
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
  held: { name: "Kim", figur: "held-0" },
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

const KB = 1024;
/** Laufzeit der gedrosselten Leitung (Mobilfunk) in Millisekunden. */
const LAUFZEIT_MS = 40;
const BIT_JE_BYTE = 8;
const MILLION = 1_000_000;

/** Drosselt das Netz der Seite wie Mobilfunk, wenn ABENTEUER_DROSSEL_MBIT gesetzt ist. */
async function drossle(seite: Page, kontext: BrowserContext): Promise<void> {
  const mbit = Number(process.env.ABENTEUER_DROSSEL_MBIT ?? 0);
  if (!mbit) return;
  const cdp = await kontext.newCDPSession(seite);
  const bytesJeSekunde = (mbit * MILLION) / BIT_JE_BYTE;
  await cdp.send("Network.enable");
  await cdp.send("Network.emulateNetworkConditions", {
    offline: false,
    latency: LAUFZEIT_MS,
    downloadThroughput: bytesJeSekunde,
    uploadThroughput: bytesJeSekunde,
  });
}

/**
 * Zählt die Dateien des Pakets, die unter /abenteuer/ angefragt wurden, mit ihrer Größe laut
 * paket.json (die Größenangaben des Browsers fehlen bei Abrufen des Service Workers oft).
 */
function zaehler(kontext: BrowserContext): {
  bytes: () => number;
  anzahl: () => number;
  gruppen: () => string;
} {
  const dateien = (
    JSON.parse(
      readFileSync(new URL("../../public/abenteuer/paket.json", import.meta.url), "utf8"),
    ) as { dateien: { pfad: string; bytes: number; gruppe: string; akt?: number }[] }
  ).dateien;
  const groessen = new Map<string, number>(dateien.map((d) => [d.pfad, d.bytes]));
  const gruppeVon = new Map(dateien.map((d) => [d.pfad, `${d.gruppe}${d.akt ?? ""}`]));
  const gesehen = new Set<string>();
  // Erste und letzte fertige Datei je Gruppe (ms seit Beginn der Zählung): zeigt, was parallel lud.
  const beginn = Date.now();
  const zeiten = new Map<string, [number, number]>();
  kontext.on("requestfinished", (anfrage) => {
    const pfad = new URL(anfrage.url()).pathname.split("/abenteuer/")[1];
    if (!pfad || !groessen.has(pfad)) return;
    gesehen.add(pfad);
    const g = gruppeVon.get(pfad) ?? "?";
    const jetzt = Date.now() - beginn;
    zeiten.set(g, [zeiten.get(g)?.[0] ?? jetzt, jetzt]);
  });
  const bytes = () => [...gesehen].reduce((s, p) => s + (groessen.get(p) ?? 0), 0);
  const gruppen = () => {
    const summe = new Map<string, number>();
    for (const p of gesehen) {
      const g = gruppeVon.get(p) ?? "?";
      summe.set(g, (summe.get(g) ?? 0) + (groessen.get(p) ?? 0));
    }
    return [...summe]
      .map(([g, b]) => {
        const [von, bis] = zeiten.get(g) ?? [0, 0];
        return `${g} ${Math.round(b / KB)} KB (${von}–${bis} ms)`;
      })
      .join(", ");
  };
  return { bytes, anzahl: () => gesehen.size, gruppen };
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

test("Messung: Startzeit und Downloadgröße", async ({ page, context }) => {
  test.skip(!process.env.ABENTEUER_MESSUNG, "nur mit ABENTEUER_MESSUNG=1");
  test.setTimeout(600_000);
  await starteImBrowser(page);
  await expect.poll(() => page.evaluate(schreibeStand, STAND)).toBe(true);
  await page.reload();
  await page.goto("/app/#abenteuer");
  const zaehlbeginn = Date.now();
  const z = zaehler(context);
  const knopf = page.getByTestId("abenteuer-laden");
  await expect(knopf).toBeVisible({ timeout: 30000 });
  await drossle(page, context);
  const vorher = z.bytes();
  const beginn = Date.now();
  await knopf.click();
  await expect(page.getByTestId("abenteuer-aktion")).toBeVisible({ timeout: 300000 });
  const bisKarte = Date.now() - beginn;
  const versatz = beginn - zaehlbeginn;
  const bytesKarte = z.bytes() - vorher;
  const gruppenKarte = z.gruppen();
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
  console.log(
    `Gruppen bis Karte (Zeiten ab Seitenaufruf, Klick bei ${versatz} ms): ${gruppenKarte}`,
  );
});
