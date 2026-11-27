/**
 * Oberflächentest: Wechsel zwischen zwei Spielständen mitten im Spiel (Hauptmenü, 27.11.2026).
 *
 * Warum: Das Phaser-Spiel lebt seit dem 26.11.2026 über Kartenwechsel und Unmounts weiter
 * (oberwelt/oberweltspiel.ts), und die Oberwelt wird beim Wechsel des Platzes nur neu gemountet
 * (key in AbenteuerAnsicht.tsx). Vom alten Stand darf danach nichts sichtbar bleiben: weder
 * Begleiter noch Uhrzeit, Licht, Karte oder Name. Geprüft wird, dass die Welt nach dem Wechsel
 * genauso aussieht wie nach einem frischen Laden desselben Stands (Neuladen im selben Tab).
 * Stand A: nachts auf der Landstraße mit Juno als Begleiterin; Stand B: morgens im Park, allein,
 * mit der Heldin (anderer Figurbogen im selben Phaser-Spiel).
 * Abhängigkeiten: abenteuer-affe.ts (Stand einspielen), abenteuer-paket.ts.
 */
import { expect, test, type Page } from "@playwright/test";
import { beobachte, EINLEITUNG_GESEHEN, GRUNDSTAND, starteMitStand } from "./abenteuer-affe";

const FRIST_MS = 40000;
const MINUTEN_JE_STUNDE = 60;
/** Stunde der Spieluhr im Stand A (nachts) und B (morgens). */
const NACHT = 22;
const MORGEN = 9;

/** Nach dem Aufbruch mit Juno (wie abenteuer-gefolge.spec.ts). */
const UNTERWEGS = {
  ...EINLEITUNG_GESEHEN,
  brettBeruehrt: true,
  ersteLektionBesprochen: true,
  ersterAbendGesehen: true,
  ersteNachtGesehen: true,
  clubBeigetreten: true,
  junoGetroffen: true,
  nadelMapleFalls: 1,
  aufbruchGesehen: true,
};

const STAND_A = {
  ...GRUNDSTAND,
  begonnen: "2026-11-08T05:00:00.000Z",
  zuletztGespielt: "2026-11-27T08:00:00.000Z",
  held: { name: "Kim", figur: "held-0" },
  position: { karte: "wegMapleCedar.landstrasse", x: 47, y: 17, richtung: "unten" },
  spieluhr: NACHT * MINUTEN_JE_STUNDE,
  dialogvariablen: { ...UNTERWEGS, begleiter: "juno" },
};

const STAND_B = {
  ...GRUNDSTAND,
  begonnen: "2026-11-20T05:00:00.000Z",
  zuletztGespielt: "2026-11-26T08:00:00.000Z",
  held: { name: "Alex", figur: "heldin-0" },
  spieluhr: MORGEN * MINUTEN_JE_STUNDE,
};

/** Legt einen ruhenden Platz in die Nutzerdaten (IndexedDB der App); läuft im Browser. */
function legePlatzImBrowser(stand: object): Promise<boolean> {
  return new Promise<boolean>((fertig, fehler) => {
    const anfrage = indexedDB.open("schach-von-grund-auf");
    anfrage.onerror = () => fehler(anfrage.error);
    anfrage.onsuccess = () => {
      const db = anfrage.result;
      const bereich = db.transaction("nutzerdaten", "readwrite").objectStore("nutzerdaten");
      const lesen = bereich.get("aktuell");
      lesen.onsuccess = () => {
        const alt = lesen.result as Record<string, unknown> | undefined;
        const schreiben = bereich.put(
          { ...alt, abenteuerplaetze: [{ stand, laufend: null }] },
          "aktuell",
        );
        schreiben.onsuccess = () => {
          db.close();
          fertig(true);
        };
        schreiben.onerror = () => fehler(schreiben.error);
      };
    };
  });
}

/** Was von der Welt sichtbar ist: Feld des Helden, Statisten, Stunde, Tönung, Begleiter, Fassung der Karte. */
async function weltbild(seite: Page): Promise<Record<string, string | null>> {
  const welt = seite.getByTestId("abenteuer-welt");
  const leinwand = seite.locator(".abenteuer-welt canvas");
  await expect(leinwand).toBeVisible({ timeout: FRIST_MS });
  // Die Szene meldet Gefolge und Statisten erst nach ihrem Aufbau.
  await seite.waitForTimeout(1500);
  return {
    kachel: await seite.getByTestId("abenteuer-kachel").textContent(),
    statisten: await welt.getAttribute("data-statisten"),
    stunde: await welt.getAttribute("data-stunde"),
    toenung: await welt.getAttribute("data-toenung"),
    fassung: await welt.getAttribute("data-fassung"),
    gefolge: (await leinwand.getAttribute("data-gefolge"))?.split("@")[0] ?? null,
  };
}

/** Über Spielmenü, Hauptmenü und Ladeliste den Platz mit dem Helden `name` laden. */
async function wechsleZu(seite: Page, name: string): Promise<void> {
  await seite.getByTestId("abenteuer-menueknopf").click();
  await seite.getByTestId("abenteuer-zum-hauptmenue").click();
  await seite.getByTestId("abenteuer-ladeliste-knopf").click();
  await seite
    .getByTestId("abenteuer-platz")
    .filter({ hasText: name })
    .getByTestId("abenteuer-platz-laden")
    .click();
  await expect(seite.getByTestId("abenteuer-welt")).toBeVisible({ timeout: FRIST_MS });
}

test("Platzwechsel mitten im Spiel: nichts vom alten Stand bleibt sichtbar (27.11.2026)", async ({
  page,
}) => {
  test.slow();
  const funde = beobachte(page);
  await starteMitStand(page, STAND_A);
  await expect.poll(() => page.evaluate(legePlatzImBrowser, STAND_B)).toBe(true);
  const a = await weltbild(page);
  expect(a.stunde).toBe(String(NACHT));
  expect(a.gefolge).toBe("juno");

  await wechsleZu(page, "Alex");
  const bNachWechsel = await weltbild(page);
  expect(bNachWechsel.stunde).toBe(String(MORGEN));
  expect(bNachWechsel.gefolge).toBeNull();
  // Neu laden im selben Tab bleibt bei B: so sieht B frisch geladen aus.
  await page.reload();
  expect(await weltbild(page)).toEqual(bNachWechsel);

  await wechsleZu(page, "Kim");
  expect(await weltbild(page)).toEqual(a);
  expect(funde).toEqual([]);
});
