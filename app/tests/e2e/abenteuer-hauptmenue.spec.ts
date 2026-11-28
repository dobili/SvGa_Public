/**
 * Oberflächentest: Startbild, Hauptmenü und Speicherplätze des Schach-Abenteuers (Wunsch des
 * Autors, 27.11.2026). Ohne den Testschalter ohneHauptmenue: so, wie Leser das Spiel starten.
 *
 * Geprüft: Startbild beim Start, per Tipp weg; erstes Spiel ohne Hauptmenü (keine Plätze), danach
 * über das Spielmenü ins Hauptmenü; zweites Spiel auf neuem Platz; Ladeliste mit beiden, Laden
 * des ersten; Neuladen bleibt in der Welt (Sitzung des Tabs); ein neuer Tab beginnt im Hauptmenü;
 * Löschen mit Rückfrage; Zurück-Taste (Spieler-Durchlauf 27.11.2026): in der Rückfrage „Nein“,
 * in der Ladeliste ins Hauptmenü, erst im Hauptmenü aus dem Abenteuer. Titelmusik (28.11.2026):
 * unter Startbild, Wahl und Hauptmenü das Stück „titel“, in der Welt die Musik der Karte. Dazu
 * (28.11.2026) Speichern und Laden einer Sicherung über das Spielmenü, Löschen mit Rückfrage,
 * gesperrtes Speichern im Gespräch, kein Namensfeld mehr im Spielmenü.
 * Mit HAUPTMENUE_FOTOS=ORDNER legt der Test Bildschirmfotos für den Autor ab (nur lokal, mit Paket).
 */
import { expect, test, type Page } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import {
  EINLEITUNG_GESEHEN,
  GRUNDSTAND,
  liesSpeicherImBrowser,
  starteMitStand,
} from "./abenteuer-affe";
import { ladeAbenteuerpaket } from "./abenteuer-paket";

const FOTOS = process.env.HAUPTMENUE_FOTOS;

/** Ein Foto für den Autor, wenn HAUPTMENUE_FOTOS gesetzt ist. */
async function foto(seite: Page, name: string): Promise<void> {
  if (!FOTOS) return;
  mkdirSync(FOTOS, { recursive: true });
  await seite.screenshot({ path: join(FOTOS, `${name}.png`) });
}

/**
 * Ohne den Springer der App (ui/komponenten/rahmen/Startanimation.tsx): Er läuft beim ersten
 * Aufruf einer Sitzung und läge über dem Startbild des Spiels; alle Seiten des Kontexts.
 */
async function ohneSpringer(seite: Page): Promise<void> {
  await seite.context().addInitScript(() => {
    window.sessionStorage.setItem("svga.startanimation.sitzung", "ja");
  });
}

/** Ein Stand vor dem Haus in Maple Falls, freie Welt ohne Gespräch (wie in abenteuer-spieluhr.spec.ts). */
const WELTSTAND = {
  ...GRUNDSTAND,
  position: { karte: "mapleFalls.aussen", x: 3, y: 24, richtung: "unten" },
  dialogvariablen: {
    ...EINLEITUNG_GESEHEN,
    hinweisSteuerkreuz: true,
    hinweisAktion: true,
    muenzenErklaert: true,
  },
};

/** Zahl der Sicherungen im Speicher des Browsers (Feld abenteuersicherungen). */
function zaehleSicherungen(): Promise<number> {
  return new Promise((fertig, fehler) => {
    const anfrage = indexedDB.open("schach-von-grund-auf");
    anfrage.onerror = () => fehler(anfrage.error);
    anfrage.onsuccess = () => {
      const lesen = anfrage.result
        .transaction("nutzerdaten", "readonly")
        .objectStore("nutzerdaten");
      const r = lesen.get("aktuell");
      r.onsuccess = () => {
        const daten = r.result as { abenteuersicherungen?: unknown[] } | undefined;
        fertig(daten?.abenteuersicherungen?.length ?? 0);
      };
      r.onerror = () => fehler(r.error);
    };
  });
}

/** Neues Spiel mit Namen beginnen und warten, bis die Welt steht. */
async function beginne(seite: Page, name: string): Promise<void> {
  await seite.getByTestId("abenteuer-name").fill(name);
  await seite.getByTestId("abenteuer-spielen").click();
  await expect(seite.getByTestId("abenteuer-welt")).toBeVisible({ timeout: 40000 });
}

/** Über das Spielmenü ins Hauptmenü. */
async function insHauptmenue(seite: Page): Promise<void> {
  await seite.getByTestId("abenteuer-menueknopf").click();
  await seite.getByTestId("abenteuer-zum-hauptmenue").click();
  await expect(seite.getByTestId("abenteuer-hauptmenue")).toBeVisible();
}

test("Hauptmenü: Startbild, zwei Spielstände, laden, neu laden, neuer Tab, löschen (27.11.2026)", async ({
  page,
  context,
}) => {
  test.slow();
  await ohneSpringer(page);
  await page.goto("/app/#abenteuer");
  const startbild = page.getByTestId("abenteuer-startbild");
  await expect(startbild).toBeVisible();
  await expect(startbild).toContainText("Chessfare");
  await startbild.click();
  await expect(startbild).toHaveCount(0);
  await ladeAbenteuerpaket(page, undefined, { mitHauptmenue: true });
  // Erstes Spiel: noch kein Platz, also gleich die Wahl ohne „Zurück zum Hauptmenü“.
  await expect(page.getByTestId("abenteuer-neu-zurueck")).toHaveCount(0);
  await beginne(page, "Kim");
  await insHauptmenue(page);
  await expect(page.getByTestId("abenteuer-fortsetzen")).toContainText("Kim");
  await expect(page.getByTestId("abenteuer-fortsetzen")).toContainText("Akt 1 · Maple Falls");
  await foto(page, "hauptmenue-hoch");

  // Zweites Spiel auf neuem Platz; der erste ruht.
  await page.getByTestId("abenteuer-neues-spiel").click();
  await expect(page.getByTestId("abenteuer-neu-zurueck")).toBeVisible();
  await beginne(page, "Alex");
  await insHauptmenue(page);
  await expect(page.getByTestId("abenteuer-fortsetzen")).toContainText("Alex");
  await page.getByTestId("abenteuer-ladeliste-knopf").click();
  const plaetze = page.getByTestId("abenteuer-platz");
  await expect(plaetze).toHaveCount(2);
  await expect(plaetze.nth(0)).toContainText("Alex");
  await expect(plaetze.nth(1)).toContainText("Kim");
  await foto(page, "ladeliste-hoch");

  // Kim laden: die Welt mit Kims Stand.
  await plaetze.nth(1).getByTestId("abenteuer-platz-laden").click();
  await expect(page.getByTestId("abenteuer-welt")).toBeVisible({ timeout: 40000 });
  await expect
    .poll(async () => (await page.evaluate(liesSpeicherImBrowser)).abenteuer?.held)
    .toMatchObject({ name: "Kim" });

  // Neu laden im selben Tab: weiter in der Welt, ohne Startbild und Hauptmenü.
  await page.reload();
  await expect(page.getByTestId("abenteuer-welt")).toBeVisible({ timeout: 40000 });
  await expect(page.getByTestId("abenteuer-hauptmenue")).toHaveCount(0);

  // Ein neuer Tab (wie ein neuer Start der App): Startbild, dann Hauptmenü mit Kim zum Fortsetzen.
  const zweite = await context.newPage();
  await zweite.goto("/app/#abenteuer");
  await zweite.getByTestId("abenteuer-startbild").click();
  await expect(zweite.getByTestId("abenteuer-fortsetzen")).toContainText("Kim", {
    timeout: 30000,
  });
  await zweite.close();

  // Alex löschen, mit Rückfrage; danach bleibt nur Kim.
  await page.bringToFront();
  await insHauptmenue(page);
  await page.getByTestId("abenteuer-ladeliste-knopf").click();
  const alex = plaetze.filter({ hasText: "Alex" });
  await alex.getByTestId("abenteuer-platz-loeschen").click();
  await expect(page.getByTestId("abenteuer-platz-frage")).toContainText("endgültig");
  await page.getByTestId("abenteuer-platz-loeschen-ja").click();
  await expect(plaetze).toHaveCount(1);
  await expect(plaetze.first()).toContainText("Kim");
  await expect(page.locator(".abenteuer-platz-status")).toContainText("gelöscht");

  // Zurück-Taste: schließt zuerst die Rückfrage, dann die Ladeliste, erst dann das Abenteuer.
  await plaetze.first().getByTestId("abenteuer-platz-loeschen").click();
  await expect(page.getByTestId("abenteuer-platz-frage")).toBeVisible();
  await page.goBack();
  await expect(page.getByTestId("abenteuer-platz-frage")).toHaveCount(0);
  await expect(plaetze).toHaveCount(1);
  await page.goBack();
  await expect(page.getByTestId("abenteuer-ladeliste")).toHaveCount(0);
  await expect(page.getByTestId("abenteuer-hauptmenue")).toBeVisible();
  // Noch einmal über den Knopf hinein und hinaus: der Verlauf bleibt stimmig.
  await page.getByTestId("abenteuer-ladeliste-knopf").click();
  await page.getByTestId("abenteuer-ladeliste-zurueck").click();
  await expect(page.getByTestId("abenteuer-hauptmenue")).toBeVisible();
  await page.waitForTimeout(500);
  await expect(page.getByTestId("abenteuer-hauptmenue")).toBeVisible();
  await page.goBack();
  await expect(page.getByTestId("abenteuer-hauptmenue")).toHaveCount(0);
  await expect(page.getByTestId("abenteuer")).toHaveCount(0);
});

/** Was der Tonmesser als Musik meldet (ton/tonregie.ts; null, solange nichts zu hören ist). */
function musik(seite: Page): Promise<string | null> {
  return seite.evaluate(() => {
    const messer = (globalThis as { __tonmesser?: () => { musik: string | null } }).__tonmesser;
    return messer ? messer().musik : null;
  });
}

test("Titelmusik: unter Startbild und Hauptmenü, in der Welt die Musik der Karte (28.11.2026)", async ({
  page,
}) => {
  test.slow();
  await ohneSpringer(page);
  // Musik des Abenteuers spielt nur mit dem Ton der App (Einstellungen, Vorgabe „aus“).
  await page.addInitScript(() => {
    const alt = JSON.parse(localStorage.getItem("svga.einstellungen") ?? "{}") as object;
    localStorage.setItem("svga.einstellungen", JSON.stringify({ ...alt, ton: "an" }));
  });
  await page.goto("/app/#abenteuer");
  const startbild = page.getByTestId("abenteuer-startbild");
  await expect(startbild).toBeVisible();
  await expect.poll(() => musik(page)).toBe("titel");
  await startbild.click();
  await ladeAbenteuerpaket(page, undefined, { mitHauptmenue: true });
  // Wahl für das erste Spiel: dieselbe Musik weiter.
  await expect.poll(() => musik(page)).toBe("titel");
  await beginne(page, "Kim");
  await expect.poll(() => musik(page)).not.toBe("titel");
  await insHauptmenue(page);
  await expect.poll(() => musik(page)).toBe("titel");
});

test("Hauptmenü quer und Startbild in Standbildern (nur mit HAUPTMENUE_FOTOS)", async ({
  page,
}) => {
  test.skip(!FOTOS, "nur für Fotos des Autors");
  test.slow();
  await ohneSpringer(page);
  await page.goto("/app/#abenteuer");
  await page.getByTestId("abenteuer-startbild").click();
  await ladeAbenteuerpaket(page, undefined, { mitHauptmenue: true });
  await beginne(page, "Kim");
  await insHauptmenue(page);
  await page.setViewportSize({ width: 844, height: 390 });
  await foto(page, "hauptmenue-quer");
  // Startbild in Standbildern: neuer Tab, Fotos etwa 0,6 s, 1,4 s, 2,4 s und 3,3 s nach dem Erscheinen.
  await page.setViewportSize({ width: 390, height: 844 });
  const neu = await page.context().newPage();
  await neu.setViewportSize({ width: 390, height: 844 });
  await neu.goto("/app/#abenteuer");
  await neu.getByTestId("abenteuer-startbild").waitFor();
  const beginn = Date.now();
  for (const ms of [600, 1400, 2400, 3300]) {
    await neu.waitForTimeout(Math.max(0, ms - (Date.now() - beginn)));
    await foto(neu, `startbild-${ms}ms`);
  }
  // „Bewegung reduzieren“: ein stilles Titelbild.
  const still = await page.context().newPage();
  await still.setViewportSize({ width: 390, height: 844 });
  await still.emulateMedia({ reducedMotion: "reduce" });
  await still.goto("/app/#abenteuer");
  await still.getByTestId("abenteuer-startbild").waitFor();
  await still.waitForTimeout(500);
  await foto(still, "startbild-still");
});

test("Speichern und Laden: Sicherung im Spielmenü, laden und löschen in der Ladeliste (28.11.2026)", async ({
  page,
}) => {
  test.slow();
  await starteMitStand(page, WELTSTAND);
  await page.getByTestId("abenteuer-menueknopf").click();
  const menue = page.getByTestId("abenteuer-menue");
  // Der Name steht nur zur Ansicht da (nur beim Start wählbar), der Rivale gar nicht.
  await expect(menue.getByTestId("abenteuer-name")).toHaveCount(0);
  await expect(menue.getByTestId("abenteuer-wahlanzeige")).not.toContainText("Vict");
  // In der freien Welt: Speichern legt eine Sicherung an und bestätigt es.
  const speichern = menue.getByTestId("abenteuer-speichern");
  await expect(speichern).toBeEnabled({ timeout: 10000 });
  await speichern.click();
  await expect(menue.getByTestId("abenteuer-sichern-status")).toHaveText("Gespeichert.");
  await expect.poll(() => page.evaluate(zaehleSicherungen)).toBe(1);
  await foto(page, "spielmenue-gespeichert");

  // „Laden“ öffnet die Ladeliste; unter dem Spielstand steht die Sicherung.
  await menue.getByTestId("abenteuer-menue-laden").click();
  await expect(page.getByTestId("abenteuer-ladeliste")).toBeVisible();
  const sicherung = page.getByTestId("abenteuer-sicherung");
  await expect(sicherung).toHaveCount(1);
  await expect(sicherung).toContainText("Gesichert am");
  await foto(page, "ladeliste-sicherung");
  // Seit der Sicherung nur gelaufen, nichts gewonnen: Laden ohne Rückfrage, zurück in die Welt.
  await sicherung.getByTestId("abenteuer-sicherung-laden").click();
  await expect(page.getByTestId("abenteuer-sicherung-frage")).toHaveCount(0);
  await expect(page.getByTestId("abenteuer-welt")).toBeVisible({ timeout: 40000 });
  await expect
    .poll(async () => (await page.evaluate(liesSpeicherImBrowser)).abenteuer?.position)
    .toMatchObject({ karte: "mapleFalls.aussen" });

  // Löschen mit Rückfrage; die Zurück-Taste heißt dort „Nein“.
  await page.getByTestId("abenteuer-menueknopf").click();
  await page.getByTestId("abenteuer-menue-laden").click();
  await sicherung.getByTestId("abenteuer-sicherung-loeschen").click();
  await expect(page.getByTestId("abenteuer-sicherung-frage")).toContainText("löschen?");
  await page.goBack();
  await expect(page.getByTestId("abenteuer-sicherung-frage")).toHaveCount(0);
  await expect(sicherung).toHaveCount(1);
  await sicherung.getByTestId("abenteuer-sicherung-loeschen").click();
  await page.getByTestId("abenteuer-sicherung-loeschen-ja").click();
  await expect(sicherung).toHaveCount(0);
  await expect(page.locator(".abenteuer-platz-status")).toContainText("Sicherung gelöscht");
  await expect.poll(() => page.evaluate(zaehleSicherungen)).toBe(0);
  // Zurück-Taste in der Ladeliste: ins Hauptmenü.
  await page.goBack();
  await expect(page.getByTestId("abenteuer-hauptmenue")).toBeVisible();
});
