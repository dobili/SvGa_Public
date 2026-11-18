/**
 * Gezielte Randfälle des Schach-Abenteuers (Affentest, Wunsch des Autors 14.11.2026): Neuladen in
 * Partie und Dialog (auch: Quest geht danach weiter), Zurück-Taste in der Aufgabenrunde, Aufgeben im ersten Zug, Uhr auf null,
 * Karte während der Rechnung, zwei Tabs, schnelle Kartenwechsel, voller oder fehlender Speicher,
 * Sprachwechsel. Jeder Fall endet in der begehbaren Welt und ohne Ausnahme.
 * Abhängigkeiten: tests/e2e/abenteuer-affe.ts, tests/e2e/abenteuer-karte.ts, tests/e2e/hilfen.ts.
 */
import { expect, test, type Page } from "@playwright/test";
import {
  beobachte,
  findeAusweg,
  GRUNDSTAND,
  liesSpeicherImBrowser,
  starteMitStand,
} from "./abenteuer-affe";
import { feldDarunter } from "./abenteuer-karte";
import { oeffneEinstellungen } from "./hilfen";
import { ladeAbenteuerpaket } from "./abenteuer-paket";

// Die Tests dieser Datei teilen keinen Zustand (jeder startet seinen eigenen Spielstand); parallel
// verteilt Playwright sie auf Worker und Shards, statt die ganze Datei in einem Worker abzuarbeiten
// (eine der längsten Dateien der Oberfläche, CI vom 18.11.2026).
test.describe.configure({ mode: "parallel" });

/** So lange darf der Gegner für einen Zug rechnen (ms). */
const ENGINE_FRIST = 30_000;

/** Mit dem Reisebrett eine Übungspartie ohne Karten beginnen (Uhr nach Wahl). */
async function starteUebungspartie(seite: Page, zeit?: "blitz"): Promise<void> {
  await seite.getByTestId("abenteuer-reisebrettknopf").click();
  if (zeit) await seite.getByTestId(`abenteuer-zeit-${zeit}`).click();
  await seite.getByTestId("abenteuer-deck-los").click();
  await expect(seite.getByTestId("partie")).toBeVisible({ timeout: 30000 });
}

/** Eigene Farbe und Zahl der Züge der laufenden Partie (aus dem Speicher). */
async function laufende(seite: Page): Promise<{ farbe: string; zuege: number }> {
  return seite.evaluate(
    () =>
      new Promise<{ farbe: string; zuege: number }>((fertig) => {
        const a = indexedDB.open("schach-von-grund-auf");
        a.onsuccess = () => {
          const r = a.result.transaction("nutzerdaten").objectStore("nutzerdaten").get("aktuell");
          r.onsuccess = () => {
            const p = (
              r.result as {
                spiel: { laufend: { einstellung: { eigeneFarbe: string }; zuege: unknown[] } };
              }
            ).spiel.laufend;
            fertig({ farbe: p.einstellung.eigeneFarbe, zuege: p.zuege.length });
          };
        };
      }),
  );
}

/** Wartet, bis der Leser am Zug ist, und zieht den Königsbauern zwei Felder. */
async function zieheKoenigsbauern(seite: Page): Promise<void> {
  const weiss = (await laufende(seite)).farbe === "white";
  // Schwarz wartet auf den ersten Zug des Gegners.
  if (!weiss) {
    await expect
      .poll(async () => (await laufende(seite)).zuege, { timeout: ENGINE_FRIST })
      .toBeGreaterThan(0);
  }
  await expect(seite.getByTestId("partiestatus")).toHaveText("Du bist am Zug.", {
    timeout: ENGINE_FRIST,
  });
  await seite.getByRole("button", { name: new RegExp(`^${weiss ? "e2" : "e7"}, Bauer`) }).click();
  await seite.getByRole("button", { name: weiss ? "e4" : "e5", exact: true }).click();
}

/** Partie aufgeben (mit Nachfrage) und über „Weiter“ zur Ergebniskarte in der Welt. */
async function gibAufUndZurueck(seite: Page): Promise<void> {
  await seite.getByTestId("abenteuer-partie-aufgeben").click();
  await seite.getByRole("button", { name: "Ja, aufgeben" }).click();
  await seite.getByTestId("partie-zurueck-zur-stadt").click();
  await expect(seite.getByTestId("abenteuer-ergebnis")).toBeVisible({ timeout: 30000 });
}

test("Partie: neu laden, „Partie läuft noch“, doppelt weiterspielen, aufgeben", async ({
  page,
}) => {
  const funde = beobachte(page);
  await starteMitStand(page, GRUNDSTAND);
  await starteUebungspartie(page);
  await zieheKoenigsbauern(page);
  await page.reload();
  // Mit Weitermachen kommt der Leser in die Partie zurück, sonst in die Welt mit der Frage.
  await expect(page.getByTestId("partie").or(page.getByTestId("abenteuer-welt"))).toBeVisible({
    timeout: 30000,
  });
  await page.goto("/app/#abenteuer");
  await expect(page.getByText("Deine Partie läuft noch.")).toBeVisible({ timeout: 30000 });
  await page.getByRole("button", { name: "Weiterspielen" }).dblclick();
  await expect(page.getByTestId("partie")).toBeVisible({ timeout: 20000 });
  await expect(page.getByTestId("abenteuer-huelle-kopf")).toContainText("Ambrose");
  await gibAufUndZurueck(page);
  // „Weiter“ doppelt: keine zweite Karte, keine Ausnahme.
  await page
    .getByTestId("abenteuer-ergebnis")
    .getByRole("button", { name: "Weiter", exact: true })
    .dblclick();
  await findeAusweg(page);
  const speicher = await page.evaluate(liesSpeicherImBrowser);
  expect(speicher.partien.filter((p) => p.kennung !== null && !p.ende)).toEqual([]);
  expect(speicher.abenteuer?.laufendePartie ?? null).toBeNull();
  expect(funde).toEqual([]);
});

test("Deckwahl quer gehalten: Zurück und Spielen erreichbar; Aufgeben vor dem ersten Zug", async ({
  page,
}) => {
  const funde = beobachte(page);
  await starteMitStand(page, GRUNDSTAND);
  // Quer gehaltenes kleines Handy: Die Deckwahl rollt, statt unten abgeschnitten zu sein.
  await page.setViewportSize({ width: 568, height: 320 });
  await page.getByTestId("abenteuer-reisebrettknopf").click();
  // Playwright rollt auch versteckte Ränder; ein Finger nur, wenn das Fenster selbst rollt.
  await expect(page.getByTestId("abenteuer-deckwahl")).toHaveCSS("overflow-y", "auto");
  await page.getByTestId("abenteuer-deck-zurueck").click();
  await expect(page.getByTestId("abenteuer-deckwahl")).toHaveCount(0);
  await page.getByTestId("abenteuer-reisebrettknopf").click();
  await page.getByTestId("abenteuer-deck-los").click();
  await expect(page.getByTestId("partie")).toBeVisible({ timeout: 30000 });
  await page.setViewportSize({ width: 412, height: 839 });
  await gibAufUndZurueck(page);
  await findeAusweg(page);
  expect(funde).toEqual([]);
});

test("Partie: die Uhr läuft auf null (Blitz), das Ergebnis übersteht das Neuladen", async ({
  page,
}) => {
  const funde = beobachte(page);
  await starteMitStand(page, GRUNDSTAND);
  await starteUebungspartie(page, "blitz");
  await zieheKoenigsbauern(page);
  // Erst wenn der Gegner geantwortet hat, schreibt die App die Partie nicht mehr selbst.
  await expect
    .poll(
      async () => {
        const l = await laufende(page);
        return l.zuege > 1 && l.zuege % 2 === (l.farbe === "white" ? 0 : 1);
      },
      { timeout: ENGINE_FRIST },
    )
    .toBe(true);
  await expect(page.getByTestId("partiestatus")).toHaveText("Du bist am Zug.");
  // Die Uhr der Seite vorspulen: Die eigenen drei Minuten laufen ab.
  await page.clock.install();
  await page.clock.fastForward("04:00");
  // Die Uhr fällt in der laufenden Partie; danach übersteht das Ergebnis das Neuladen.
  await expect(page.getByTestId("partie-zurueck-zur-stadt")).toBeVisible({ timeout: 15000 });
  await page.reload();
  await page.goto("/app/#abenteuer");
  const ergebnis = page.getByTestId("abenteuer-ergebnis");
  await expect(ergebnis).toBeVisible({ timeout: 30000 });
  await findeAusweg(page);
  expect(funde).toEqual([]);
});

test("Dialog: neu laden mitten im Gespräch, danach wieder ansprechbar", async ({ page }) => {
  const funde = beobachte(page);
  const stand = {
    ...GRUNDSTAND,
    position: {
      karte: "mapleFalls.park",
      ...feldDarunter("maple-falls-park", "kiosk"),
      richtung: "oben",
    },
  };
  await starteMitStand(page, stand);
  await page.getByTestId("abenteuer-aktion").click();
  await expect(page.getByTestId("abenteuer-dialog")).toBeVisible({ timeout: 15000 });
  await page.reload();
  await expect(page.locator(".abenteuer-welt canvas")).toBeVisible({ timeout: 30000 });
  await expect(page.getByTestId("abenteuer-dialog")).toHaveCount(0);
  await expect(page.getByTestId("abenteuer-aktion")).toBeVisible({ timeout: 15000 });
  await page.getByTestId("abenteuer-aktion").click();
  await expect(page.getByTestId("abenteuer-dialog")).toBeVisible({ timeout: 15000 });
  await findeAusweg(page);
  expect(funde).toEqual([]);
});

/** Dialogvariablen und Stand einer Quest aus dem gespeicherten Spielstand. */
async function questUndVariable(
  seite: Page,
  quest: string,
  variable: string,
): Promise<{ erledigt: boolean | null; wert: unknown }> {
  const { abenteuer } = await seite.evaluate(liesSpeicherImBrowser);
  const quests = (abenteuer?.quests ?? []) as { kennung: string; erledigt: boolean }[];
  const variablen = (abenteuer?.dialogvariablen ?? {}) as Record<string, unknown>;
  return {
    erledigt: quests.find((q) => q.kennung === quest)?.erledigt ?? null,
    wert: variablen[variable],
  };
}

test("Dialog: neu laden mitten im Gespräch, danach geht die Quest weiter", async ({ page }) => {
  // Befund der Chaos-Simulation (14.11.2026): Der Quest-Schritt stand sofort im Stand, die
  // Variable des Dialogs erst am Ende. Jo fragt nach Limo (Quest beginnt, limoGefragt), dann lädt
  // der Leser neu; die Limo ist schon im Gepäck (sonst vom Kiosk), also muss Jo sie beim nächsten
  // Ansprechen annehmen (Quest erledigt). Ohne gesicherte Variable fragte sie wieder nach Limo.
  const funde = beobachte(page);
  const stand = {
    ...GRUNDSTAND,
    position: {
      karte: "mapleFalls.park",
      ...feldDarunter("maple-falls-park", "skaterJo"),
      richtung: "oben",
    },
    gegenstaende: [...GRUNDSTAND.gegenstaende, "limo"],
    dialogvariablen: { joGetroffen: true, ausgangMapleFallsSkaterJo: "sieg" },
  };
  await starteMitStand(page, stand);
  await page.getByTestId("abenteuer-aktion").click();
  const dialog = page.getByTestId("abenteuer-dialog");
  await expect(dialog).toContainText("Limo", { timeout: 15000 });
  await dialog.getByRole("button", { name: "Weiter" }).click();
  await expect
    .poll(() => questUndVariable(page, "mapleFalls.limo", "limoGefragt"), { timeout: 10000 })
    .toEqual({ erledigt: false, wert: true });
  await page.reload();
  await expect(page.locator(".abenteuer-welt canvas")).toBeVisible({ timeout: 30000 });
  await expect(dialog).toHaveCount(0);
  await page.getByTestId("abenteuer-aktion").click();
  await expect(dialog).toContainText("Zitronenlimo", { timeout: 15000 });
  await findeAusweg(page);
  await expect
    .poll(() => questUndVariable(page, "mapleFalls.limo", "limoGebracht"), { timeout: 10000 })
    .toEqual({ erledigt: true, wert: true });
  expect(funde).toEqual([]);
});

test("Aufgabenrunde: Zurück-Taste mitten in der Runde, weitermachen", async ({ page }) => {
  const funde = beobachte(page);
  const stand = {
    ...GRUNDSTAND,
    position: { karte: "mapleFalls.dachboden", x: 2, y: 9, richtung: "unten" },
    laufendeAufgaben: {
      kennung: "mapleFalls.reiheSam#rand",
      runde: "mapleFalls.reiheSam",
      steller: "figur.sam.name",
      kapitel: 0,
      buchuebungen: ["ueb:droh-ignorieren"],
      themen: ["haengend"],
      anzahl: 2,
      schwierigkeit: 1,
      versuch: 1,
      zaehltFuerApp: true,
    },
  };
  await starteMitStand(page, stand);
  // Solange die Fortsetzungskarte offen ist, öffnet die Kopfleiste kein zweites Fenster (vorher
  // lag „Übungspartie“ über „Weitermachen“).
  await expect(page.getByText("Deine Aufgabenrunde läuft noch.")).toBeVisible();
  await expect(page.getByTestId("abenteuer-reisebrettknopf")).toHaveCount(0);
  await page.getByRole("button", { name: "Weitermachen" }).click();
  await expect(page.getByTestId("trainerrunde")).toContainText("Aufgabe 1 von 3", {
    timeout: 20000,
  });
  await page.goBack();
  await expect(page.getByText("Deine Aufgabenrunde läuft noch.")).toBeVisible({ timeout: 30000 });
  await page.getByRole("button", { name: "Weitermachen" }).click();
  await expect(page.getByTestId("trainerrunde")).toContainText("Aufgabe 1 von 3", {
    timeout: 20000,
  });
  await findeAusweg(page);
  expect(funde).toEqual([]);
});

test("Karte: Mentor-Zug ausspielen und sofort selbst ziehen", async ({ page }) => {
  const funde = beobachte(page);
  const stand = {
    ...GRUNDSTAND,
    karten: [{ kennung: "mentorzug", anzahl: 1, erhalten: "2026-11-13T10:00:00.000Z" }],
  };
  await starteMitStand(page, stand);
  await page.getByTestId("abenteuer-reisebrettknopf").click();
  await page.getByTestId("abenteuer-deckkarte-mentorzug").click();
  await page.getByTestId("abenteuer-deck-los").click();
  await expect(page.getByTestId("partie")).toBeVisible({ timeout: 30000 });
  const { farbe } = await laufende(page);
  if (farbe === "black") {
    await expect
      .poll(async () => (await laufende(page)).zuege, { timeout: ENGINE_FRIST })
      .toBeGreaterThan(0);
  }
  const karte = page.getByTestId("abenteuer-karte-mentorzug");
  await expect(karte).toHaveAccessibleName(/spielbar/, { timeout: ENGINE_FRIST });
  await karte.click();
  await page.getByTestId("abenteuer-karte-ausspielen").click();
  // Während die Engine für den Mentor rechnet, zieht der Leser selbst.
  await zieheKoenigsbauern(page);
  await page.waitForTimeout(5000);
  const zuege = await page.evaluate(
    () =>
      new Promise<string[]>((fertig) => {
        const a = indexedDB.open("schach-von-grund-auf");
        a.onsuccess = () => {
          const r = a.result.transaction("nutzerdaten").objectStore("nutzerdaten").get("aktuell");
          r.onsuccess = () =>
            fertig(
              (
                r.result as { spiel: { laufend: { zuege: { von: string }[] } } }
              ).spiel.laufend.zuege.map((z) => z.von),
            );
        };
      }),
  );
  // Nie zwei Züge des Lesers hintereinander (der Mentor zog früher in die neue Stellung).
  expect(zuege.join(",")).not.toContain("leser,leser");
  await gibAufUndZurueck(page);
  await findeAusweg(page);
  expect(funde).toEqual([]);
});

test("Zwei Tabs mit demselben Spielstand", async ({ page, context }) => {
  test.setTimeout(120_000);
  const funde = beobachte(page);
  await starteMitStand(page, GRUNDSTAND);
  const zweite = await context.newPage();
  const funde2 = beobachte(zweite);
  await zweite.goto("/app/#abenteuer");
  await expect(zweite.locator(".abenteuer-welt canvas")).toBeVisible({ timeout: 40000 });
  // Im zweiten Tab beginnt eine Partie; der erste, noch in der Welt, reist danach in eine andere
  // Stadt und schreibt dabei den Spielstand. Die Partie des zweiten darf dabei nicht verloren gehen.
  await starteUebungspartie(zweite);
  // Ein Tab im Hintergrund zeichnet kaum (Chromium drosselt ihn): vorher nach vorn holen.
  await page.bringToFront();
  await page.getByTestId("abenteuer-reisenknopf").click();
  await page.getByTestId("abenteuer-reisen").getByRole("button", { name: "Cedar Creek" }).click();
  // Erst wenn die alte Welt weg ist, gibt es genau eine Leinwand (sonst strenger Modus in WebKit).
  await expect(page.locator(".abenteuer-welt canvas")).toHaveCount(1, { timeout: 30000 });
  await expect(page.locator(".abenteuer-welt canvas")).toBeVisible({ timeout: 30000 });
  await expect
    .poll(async () => (await page.evaluate(liesSpeicherImBrowser)).abenteuer?.position)
    .toMatchObject({ karte: expect.stringMatching(/^cedarCreek/) });
  const nachReise = await page.evaluate(liesSpeicherImBrowser);
  expect(nachReise.abenteuer?.laufendePartie ?? null).not.toBeNull();
  await page.reload();
  await expect(
    page.getByText("Deine Partie läuft noch.").or(page.getByTestId("partie")),
  ).toBeVisible({
    timeout: 30000,
  });
  await findeAusweg(page);
  await zweite.bringToFront();
  await zweite.reload();
  await findeAusweg(zweite);
  const speicher = await page.evaluate(liesSpeicherImBrowser);
  expect(speicher.abenteuer).not.toBeNull();
  expect(speicher.partien.filter((p) => p.kennung !== null && !p.ende)).toEqual([]);
  expect([...funde, ...funde2]).toEqual([]);
});

test("Schnell zwischen Karten reisen", async ({ page }) => {
  const funde = beobachte(page);
  await starteMitStand(page, GRUNDSTAND);
  for (let i = 0; i < 6; i++) {
    const ziel = i % 2 === 0 ? "Cedar Creek" : "Maple Falls";
    const knopf = page.getByTestId("abenteuer-reisenknopf");
    // Eine Meldung bei der Ankunft (neue Aufgabe) liegt über dem Knopf: erst schließen.
    await expect(async () => {
      const offen = page.getByTestId("abenteuer-meldung");
      if (await offen.isVisible()) await offen.getByRole("button").click();
      await knopf.click({ timeout: 1000 });
    }).toPass({ timeout: 30000 });
    const reisen = page.getByTestId("abenteuer-reisen");
    const wahl = reisen.getByRole("button", { name: ziel });
    if (await wahl.isVisible().catch(() => false)) await wahl.click();
    else await reisen.getByRole("button").first().click();
    // Kaum angekommen, gleich weiter: nicht auf die Karte warten.
    await page.waitForTimeout(150);
    const meldung = page.getByTestId("abenteuer-meldung");
    if (await meldung.isVisible().catch(() => false)) await meldung.getByRole("button").click();
  }
  await findeAusweg(page);
  await expect(page.getByText(/noch nicht gebaut|fehlt noch/)).toHaveCount(0);
  expect(funde).toEqual([]);
});

test("Speicher voll: Meldung statt Absturz, das Spiel läuft weiter", async ({ page }) => {
  const funde = beobachte(page);
  await starteMitStand(page, GRUNDSTAND);
  // Ab jetzt meldet jeder Schreibvorgang „Speicher voll“.
  await page.evaluate(() => {
    IDBObjectStore.prototype.put = function () {
      throw new DOMException("Speicher voll (Test)", "QuotaExceededError");
    };
  });
  await page.getByTestId("abenteuer-reisebrettknopf").click();
  await page.getByTestId("abenteuer-deck-los").click();
  await expect(page.locator(".speicher-hinweis")).toBeVisible({ timeout: 20000 });
  await expect(page.getByTestId("partie").or(page.getByTestId("abenteuer-welt"))).toBeVisible();
  await page.locator(".speicher-hinweis").getByRole("button").click();
  await findeAusweg(page);
  expect(funde.filter((f) => !f.includes("Speichern fehlgeschlagen"))).toEqual([]);
});

test("Ohne IndexedDB: Meldung, das Spiel startet trotzdem", async ({ page }) => {
  const funde = beobachte(page);
  await page.addInitScript(() => {
    Object.defineProperty(window, "indexedDB", {
      get() {
        throw new DOMException("gesperrt (Test)", "SecurityError");
      },
    });
  });
  await page.goto("/app/#abenteuer");
  const start = page.getByTestId("abenteuer-start");
  await expect(start).toBeVisible({ timeout: 30000 });
  await expect(page.locator(".speicher-hinweis")).toBeVisible({ timeout: 20000 });
  await ladeAbenteuerpaket(page, start.getByTestId("abenteuer-laden"));
  await page.getByTestId("abenteuer-spielen").click({ timeout: 60000 });
  await expect(page.locator(".abenteuer-welt canvas")).toBeVisible({ timeout: 40000 });
  await findeAusweg(page);
  // Erwartet: Fehler beim Laden und Speichern; sonst nichts.
  expect(funde.filter((f) => !/Speicher|IndexedDB|indexedDB|gesperrt/.test(f))).toEqual([]);
});

test("Sprache wechseln mitten im Spiel", async ({ page }) => {
  const funde = beobachte(page);
  await starteMitStand(page, GRUNDSTAND);
  await page.getByTestId("abenteuer-menueknopf").click();
  await page.getByRole("button", { name: "Zurück zur App" }).click();
  await oeffneEinstellungen(page);
  await page.getByRole("tab", { name: "Anzeige" }).click();
  await page.getByRole("radio", { name: "English (preview)" }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.goto("/app/#abenteuer");
  await expect(page.locator(".abenteuer-welt canvas")).toBeVisible({ timeout: 40000 });
  await page.getByTestId("abenteuer-menueknopf").click();
  await expect(page.getByRole("button", { name: "Back to the app" })).toBeVisible();
  await page.getByRole("button", { name: "Keep playing" }).click();
  await starteUebungspartie(page);
  await gibAufUndZurueckEnglisch(page);
  expect(funde).toEqual([]);
});

/** Wie gibAufUndZurueck, nur ohne deutsche Knopftexte (Spieltexte bleiben ohne en.json deutsch). */
async function gibAufUndZurueckEnglisch(seite: Page): Promise<void> {
  await seite.getByTestId("abenteuer-partie-aufgeben").click();
  await seite.locator(".abenteuer-huelle-fuss .knopf-gefahr").click();
  await seite.getByTestId("partie-zurueck-zur-stadt").click();
  await expect(seite.getByTestId("abenteuer-ergebnis")).toBeVisible({ timeout: 30000 });
  await seite.getByTestId("abenteuer-ergebnis").getByRole("button").last().click();
  await expect(seite.locator(".abenteuer-steuerkreuz")).toBeVisible();
}
