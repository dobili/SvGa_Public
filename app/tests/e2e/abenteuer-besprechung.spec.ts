/**
 * Partiebesprechung mit Ambrose (Wunsch des Autors, 25.11.2026; docs/spiel/auftraege/
 * partiebesprechung_25-11.md): Im Tagebuch steht bei einer beendeten Partie „Besprechen“, sobald
 * Ambrose es angekündigt hat; die Besprechung zeigt seine Blase über dem Brett, die Marke am Feld
 * und springt zur nächsten wichtigen Stelle. Hoch und quer. Ohne Ankündigung fehlt der Knopf; im
 * Tiefpunkt bespricht der Held allein (Notiz ohne Porträt).
 * Die Partie liegt schon ausgewertet im Speicher (Werte, beste Züge), damit der Test nicht auf die
 * Engine wartet (mit BESPRECHUNG_FOTOS=ORDNER legt der Test Fotos ab): Schwarz (der Held) verliert durch das Schäfermatt, 3... Sf6?? ist der Patzer.
 */
import { devices, expect, test, type Page } from "@playwright/test";
import { EINLEITUNG_GESEHEN, GRUNDSTAND } from "./abenteuer-affe";
import { ladeAbenteuerpaket } from "./abenteuer-paket";
import { starteImBrowser } from "./hilfen";

const PARTIE_ID = "besprechung-probe";
const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const ZUEGE = ["e4", "e5", "Qh5", "Nc6", "Bc4", "Nf6", "Qxf7#"];
/** Wert je Stellung aus Sicht von Weiß; nach 3... Sf6?? ist es Matt (Grenze 10). */
const WERTE = [0.3, 0.3, 0.3, 0, 0.1, 0, 10, 10];
const BESTE = ["e2e4", "e7e5", "g1f3", "b8c6", "f1c4", "d8e7", "h5f7", ""];

const EINTRAG = {
  partie: {
    id: PARTIE_ID,
    begonnen: "2026-11-24T10:00:00.000Z",
    einstellung: {
      startFen: GRUNDSTELLUNG,
      eigeneFarbe: "black",
      stufe: 2,
      uhr: null,
      ruecknahmeErlaubt: false,
      abbildung: null,
      gegner: "engine",
      bot: null,
      hilfen: { symbole: false, werkzeuge: false },
      gewertet: false,
      eroeffnung: null,
      abenteuer: { kennung: "mapleFalls.clubkampf" },
    },
    zuege: ZUEGE.map((san, i) => ({
      san,
      von: i % 2 === 0 ? "engine" : "leser",
      quelle: i % 2 === 0 ? "engine" : "leser",
      fehler: null,
      verlust: 0,
    })),
    ruecknahmen: 0,
    uhr: null,
    ende: { art: "matt", sieger: "white" },
  },
  werte: WERTE,
  beste: BESTE,
  abstaende: WERTE.map(() => 0),
  varianten: BESTE.map((b) => (b ? [b] : [])),
};

const STAND = {
  ...GRUNDSTAND,
  position: { karte: "mapleFalls.park", x: 25, y: 14, richtung: "oben" },
  dialogvariablen: {
    ...EINLEITUNG_GESEHEN,
    ersteLektionBesprochen: true,
    besprechungAngekuendigt: true,
  },
};

/** Schreibt Spielstand und Partie in die Nutzerdaten (IndexedDB der App); läuft im Browser. */
function schreibeImBrowser(daten: { stand: object; eintrag: object }): Promise<boolean> {
  return new Promise<boolean>((fertig, fehler) => {
    const anfrage = indexedDB.open("schach-von-grund-auf");
    anfrage.onerror = () => fehler(anfrage.error);
    anfrage.onsuccess = () => {
      const db = anfrage.result;
      const bereich = db.transaction("nutzerdaten", "readwrite").objectStore("nutzerdaten");
      const lesen = bereich.get("aktuell");
      lesen.onsuccess = () => {
        const alt = lesen.result as { spiel?: { partien?: unknown[] } } | undefined;
        if (!alt?.spiel) {
          db.close();
          fertig(false);
          return;
        }
        const spiel = { ...alt.spiel, partien: [daten.eintrag, ...(alt.spiel.partien ?? [])] };
        const schreiben = bereich.put({ ...alt, spiel, abenteuer: daten.stand }, "aktuell");
        schreiben.onsuccess = () => {
          db.close();
          fertig(true);
        };
        schreiben.onerror = () => fehler(schreiben.error);
      };
    };
  });
}

/** Startet das Abenteuer mit Stand und Partie und öffnet das Tagebuch. */
async function oeffneTagebuch(seite: Page, stand: object): Promise<void> {
  await starteImBrowser(seite, { weitermachen: true });
  await expect
    .poll(() => seite.evaluate(schreibeImBrowser, { stand, eintrag: EINTRAG }))
    .toBe(true);
  await seite.reload();
  await seite.goto("/app/#abenteuer");
  const laden = seite.getByTestId("abenteuer-start").getByTestId("abenteuer-laden");
  const welt = seite.locator(".abenteuer-welt canvas");
  await expect(laden.or(welt)).toBeVisible({ timeout: 20000 });
  if (await laden.isVisible()) await ladeAbenteuerpaket(seite, laden);
  await expect(welt).toBeVisible({ timeout: 40000 });
  await seite.getByTestId("abenteuer-tagebuchknopf").click();
  await expect(seite.getByTestId("abenteuer-meine-partien")).toBeVisible();
}

/** Liegt das Element ganz im Fenster? */
async function imBild(seite: Page, testid: string): Promise<boolean> {
  const r = await seite.getByTestId(testid).boundingBox();
  const f = seite.viewportSize();
  return (
    !!r &&
    !!f &&
    r.y >= 0 &&
    r.x >= 0 &&
    r.y + r.height <= f.height + 1 &&
    r.x + r.width <= f.width + 1
  );
}

async function besprechungAblaufen(seite: Page): Promise<void> {
  await oeffneTagebuch(seite, STAND);
  await seite.getByTestId("abenteuer-partie-besprechen").first().click();
  const blase = seite.getByTestId("abenteuer-besprechung-blase");
  await expect(blase).toBeVisible({ timeout: 20000 });
  // Auftakt in Ambroses Stimme, mit Porträt (Geist).
  await expect(blase).toHaveAttribute("data-erscheinung", "geist");
  await expect(blase).toContainText("Ambrose");
  // Nächste wichtige Stelle bis zum Patzer 3... Sf6 (Halbzug 6), davor höchstens das Ende der
  // bekannten Wege; dort die Marke am Feld f6.
  const stand = seite.getByTestId("abenteuer-besprechung-stand");
  for (let i = 0; i < 3 && !(await stand.textContent())?.startsWith("Halbzug 6 "); i++) {
    await seite.getByTestId("abenteuer-besprechung-naechste").click();
  }
  await expect(stand).toHaveText("Halbzug 6 von 7");
  await expect(seite.getByTestId("zugmarke-brett")).toHaveAttribute("data-klasse", "patzer");
  // Mit BESPRECHUNG_FOTOS=ORDNER ein Foto je Lage (nur lokal, nie ins Repository).
  const fotos = process.env.BESPRECHUNG_FOTOS;
  if (fotos)
    await seite.screenshot({ path: `${fotos}/besprechung-${seite.viewportSize()?.width}.png` });
  await expect(blase).not.toBeEmpty();
  expect(await imBild(seite, "abenteuer-besprechung-blase")).toBe(true);
  expect(await imBild(seite, "abenteuer-besprechung-naechste")).toBe(true);
  // Blase über dem Brett (hoch) oder rechts daneben (quer), nie darauf.
  const b = await blase.boundingBox();
  const brett = await seite.locator(".abenteuer-huelle .brett").first().boundingBox();
  expect(b && brett && (b.y + b.height <= brett.y + 1 || b.x >= brett.x + brett.width - 1)).toBe(
    true,
  );
  // Bis zum Ende: Schluss nach der Niederlage, dann „Fertig“ zurück in die Welt.
  await seite.getByTestId("abenteuer-besprechung-vor").click();
  await expect(stand).toHaveText("Halbzug 7 von 7");
  await seite.getByTestId("abenteuer-besprechung-ende").click();
  await expect(seite.locator(".abenteuer-welt canvas")).toBeVisible({ timeout: 20000 });
}

test("Besprechung aus dem Tagebuch, hoch", async ({ page }) => {
  test.slow();
  await besprechungAblaufen(page);
});

test.describe("quer", () => {
  const d = devices["Pixel 7 landscape"];
  test.use({
    viewport: d.viewport,
    deviceScaleFactor: d.deviceScaleFactor,
    isMobile: d.isMobile,
    hasTouch: d.hasTouch,
  });
  test("Besprechung aus dem Tagebuch, quer", async ({ page }) => {
    test.slow();
    await besprechungAblaufen(page);
  });
});

test("ohne Ankündigung kein „Besprechen“", async ({ page }) => {
  test.slow();
  const ohne = {
    ...STAND,
    dialogvariablen: { ...EINLEITUNG_GESEHEN, ersteLektionBesprochen: true },
  };
  await oeffneTagebuch(page, ohne);
  await expect(page.getByTestId("abenteuer-partie-besprechen")).toHaveCount(0);
});

test("im Tiefpunkt bespricht der Held allein", async ({ page }) => {
  test.slow();
  const tief = { ...STAND, dialogvariablen: { ...STAND.dialogvariablen, tiefpunktGesehen: true } };
  await oeffneTagebuch(page, tief);
  await page.getByTestId("abenteuer-partie-besprechen").first().click();
  const blase = page.getByTestId("abenteuer-besprechung-blase");
  await expect(blase).toHaveAttribute("data-erscheinung", "notiz", { timeout: 20000 });
  await expect(blase).toContainText(/Ambrose ist nicht da|Niemand flüstert/);
});
