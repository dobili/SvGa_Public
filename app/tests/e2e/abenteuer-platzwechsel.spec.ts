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
import { ladeAbenteuerpaket } from "./abenteuer-paket";

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

/** Zwei Stände auf derselben Karte an verschiedenen Feldern (zweiter Test). */
const PARK_KIM = { ...STAND_B, held: { name: "Kim", figur: "held-0" }, begonnen: STAND_A.begonnen };
const PARK_ALEX = {
  ...STAND_B,
  position: { karte: "mapleFalls.park", x: 40, y: 14, richtung: "rechts" },
};

/** Liest Name und Feld des gespielten Stands; läuft im Browser. */
function gespielterStandImBrowser(): Promise<string> {
  return new Promise<string>((fertig, fehler) => {
    const anfrage = indexedDB.open("schach-von-grund-auf");
    anfrage.onerror = () => fehler(anfrage.error);
    anfrage.onsuccess = () => {
      const db = anfrage.result;
      const lesen = db.transaction("nutzerdaten", "readonly").objectStore("nutzerdaten");
      const r = lesen.get("aktuell");
      r.onsuccess = () => {
        type Stand = { held: { name: string }; position: { x: number; y: number } };
        const a = (r.result as { abenteuer?: Stand | null } | undefined)?.abenteuer;
        db.close();
        fertig(a ? `${a.held.name}@${a.position.x},${a.position.y}` : "keiner");
      };
    };
  });
}

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

/** Zahl der ruhenden Plätze in den Nutzerdaten; läuft im Browser. */
function zahlDerRuhendenPlaetze(): Promise<number> {
  return new Promise<number>((fertig, fehler) => {
    const anfrage = indexedDB.open("schach-von-grund-auf");
    anfrage.onerror = () => fehler(anfrage.error);
    anfrage.onsuccess = () => {
      const db = anfrage.result;
      const lesen = db.transaction("nutzerdaten", "readonly").objectStore("nutzerdaten");
      const r = lesen.get("aktuell");
      r.onsuccess = () => {
        const d = r.result as { abenteuerplaetze?: unknown[] } | undefined;
        db.close();
        fertig(d?.abenteuerplaetze?.length ?? 0);
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

/** Spielt `stand` und legt `ruhend` als zweiten Platz an (bis er nach dem Neuladen noch da ist). */
async function zweiPlaetze(seite: Page, stand: object, ruhend: object): Promise<void> {
  await starteMitStand(seite, stand);
  // Die App hält die Nutzerdaten im Speicher und schreibt sie beim nächsten Speichern ganz:
  // Den ruhenden Platz liest sie erst nach dem Neuladen.
  await expect
    .poll(async () => {
      await seite.evaluate(legePlatzImBrowser, ruhend);
      await seite.reload();
      await expect(seite.locator(".abenteuer-welt canvas")).toBeVisible({ timeout: FRIST_MS });
      return seite.evaluate(zahlDerRuhendenPlaetze);
    })
    .toBe(1);
}

test("Platzwechsel mitten im Spiel: nichts vom alten Stand bleibt sichtbar (27.11.2026)", async ({
  page,
}) => {
  test.slow();
  const funde = beobachte(page);
  await zweiPlaetze(page, STAND_A, STAND_B);
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

test("Anderer Tab lädt einen anderen Stand auf derselben Karte: dieser Tab gibt ab (27.11.2026)", async ({
  page,
  context,
}) => {
  test.slow();
  await zweiPlaetze(page, PARK_KIM, PARK_ALEX);
  await expect.poll(() => page.evaluate(gespielterStandImBrowser)).toBe("Kim@25,14");
  // Ein zweiter Tab (ohne Hauptmenü gleich in der Welt mit Kim) lädt Alex.
  const zweite = await context.newPage();
  await zweite.goto("/app/#abenteuer");
  await expect(zweite.locator(".abenteuer-welt canvas")).toBeVisible({ timeout: FRIST_MS });
  await wechsleZu(zweite, "Alex");
  // Der erste Tab spielt nicht mit fremdem Stand weiter, und sein Abbau schreibt Kims Feld
  // nicht in Alex' Stand (useWeltladen.ts, sichereSitzung).
  await expect(page.getByTestId("abenteuer-hauptmenue")).toBeVisible({ timeout: FRIST_MS });
  await zweite.waitForTimeout(1000);
  expect(await zweite.evaluate(gespielterStandImBrowser)).toBe("Alex@40,14");
  await zweite.close();
});

/**
 * Gesicherter Stapel der App (app/stapelMerker.ts, Merker svga.stapel): Spielen, Abenteuer und
 * darüber eine Aufgabenrunde, die es nicht mehr gibt. So steht die App nach einem Neustart in
 * einer Ansicht des Abenteuers, ohne Spielsitzung im neuen Tab.
 */
function stapelMitRunde(): string {
  return JSON.stringify({
    format: 1,
    zeit: Date.now(),
    stapel: {
      bereich: "spielen",
      ansichten: [
        { bildschirm: "spielen" },
        { bildschirm: "zusatz", kennung: "abenteuer" },
        { bildschirm: "zusatz", kennung: "abenteuer-aufgaben", wert: "weg" },
      ],
    },
  });
}

test("„Weiter“ nach einem Neustart in einer Runde führt in die Welt, nicht ins Hauptmenü (27.11.2026)", async ({
  page,
  context,
}) => {
  test.slow();
  // Ohne den Springer der App, auch in weiteren Tabs (wie abenteuer-hauptmenue.spec.ts).
  await context.addInitScript(() => {
    window.sessionStorage.setItem("svga.startanimation.sitzung", "ja");
  });
  await page.goto("/app/#abenteuer");
  await page.getByTestId("abenteuer-startbild").click();
  await ladeAbenteuerpaket(page, undefined, { mitHauptmenue: true });
  await page.getByTestId("abenteuer-name").fill("Kim");
  await page.getByTestId("abenteuer-spielen").click();
  await expect(page.getByTestId("abenteuer-welt")).toBeVisible({ timeout: FRIST_MS });
  // Neustart der App (neuer Tab, leerer Sitzungsspeicher) mitten in der Runde.
  const zweite = await context.newPage();
  await zweite.addInitScript((stapel) => {
    window.localStorage.setItem("svga.stapel", stapel);
  }, stapelMitRunde());
  await zweite.goto("/app/");
  await zweite.getByTestId("abenteuer-aufgaben-zurueck").click({ timeout: FRIST_MS });
  await expect(zweite.getByTestId("abenteuer-welt")).toBeVisible({ timeout: FRIST_MS });
  await expect(zweite.getByTestId("abenteuer-hauptmenue")).toHaveCount(0);
  await expect(zweite.getByTestId("abenteuer-startbild")).toHaveCount(0);
  await zweite.close();
});
