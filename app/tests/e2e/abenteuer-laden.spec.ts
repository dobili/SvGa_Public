/**
 * Schach-Abenteuer, Kiosk im Park (Schritt 12, docs/spiel/08 G1 bis G6): Ein Spielstand mit 50
 * Münzen steht vor Patels Kiosk; der Dialog öffnet den Laden, „Zweite Chance“ kostet 20, danach ist
 * Flüstern zu teuer, die Münzen oben rechts zeigen den neuen Stand.
 */
import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { feldDarunter, feldVon } from "./abenteuer-karte";
import { starteImBrowser } from "./hilfen";

/** So viele Zeichen eines Satzes vergleicht der Test (die Sprechblase bricht längere Sätze um). */
const SATZANFANG = 30;

/** Spielstand im Park, eine Kachel unter dem Kiosk (Feld aus der Karte), Blick nach oben. */
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
        const schreiben = bereich.put({ ...alt, abenteuer: stand }, "aktuell");
        schreiben.onsuccess = () => {
          db.close();
          fertig(true);
        };
        schreiben.onerror = () => fehler(schreiben.error);
      };
    };
  });
}

test("Patels Kiosk: Dialog öffnet den Laden, Kauf zieht Münzen ab", async ({ page }) => {
  await starteImBrowser(page);
  await expect.poll(() => page.evaluate(schreibeStand, STAND)).toBe(true);
  await page.reload();
  await page.goto("/app/#abenteuer");
  await page.getByTestId("abenteuer-laden").click();
  await expect(page.getByTestId("abenteuer-welt")).toBeVisible({ timeout: 30000 });
  await expect(page.getByTestId("abenteuer-muenzen")).toHaveText("50 Münzen", { timeout: 30000 });
  const aktion = page.getByTestId("abenteuer-aktion");
  await expect(aktion).toBeVisible({ timeout: 10000 });
  await aktion.click();
  // Dialog durchblättern, bis der Laden erscheint.
  const laden = page.getByRole("dialog", { name: "Patels Kiosk" });
  for (let i = 0; i < 20 && !(await laden.isVisible()); i++) {
    const weiter = page.locator(".abenteuer-dialog-weiter");
    const wahl = page.locator(".abenteuer-dialog-wahlen button").first();
    if (await wahl.isVisible()) await wahl.click();
    else if (await weiter.isVisible()) await weiter.click();
    else await page.waitForTimeout(100);
  }
  await expect(laden).toBeVisible();
  await expect(page.getByTestId("abenteuer-laden-muenzen")).toHaveText("Deine Münzen: 50");
  await laden.getByRole("button", { name: /Zweite Chance/ }).click();
  await expect(page.getByTestId("abenteuer-laden-muenzen")).toHaveText("Deine Münzen: 30");
  // Flüstern kostet 40: jetzt zu teuer.
  await expect(laden.getByRole("button", { name: /Flüstern/ })).toBeDisabled();
  await laden.getByRole("button", { name: "Fertig" }).click();
  await expect(page.getByTestId("abenteuer-muenzen")).toHaveText("30 Münzen");
});

test("Statist im Bergladen: ansprechen, Satz erscheint, beim nächsten Mal der nächste", async ({
  page,
}) => {
  // Runde 7: Statisten mit `sagt` sind ansprechbar (Dokument 16, Abschnitt 3.1).
  const stand = {
    ...STAND,
    position: {
      karte: "summitCity.bergladen",
      ...feldDarunter("summit-city-bergladen", "ladenhilfe"),
      richtung: "oben",
    },
  };
  await starteImBrowser(page);
  await expect.poll(() => page.evaluate(schreibeStand, stand)).toBe(true);
  await page.reload();
  await page.goto("/app/#abenteuer");
  await page.getByTestId("abenteuer-laden").click();
  await expect(page.getByTestId("abenteuer-welt")).toBeVisible({ timeout: 30000 });
  const aktion = page.getByTestId("abenteuer-aktion");
  await expect(aktion).toHaveText("Sprechen", { timeout: 30000 });
  await aktion.click();
  const blase = page.getByTestId("abenteuer-sprechblase");
  // Die Sätze kommen aus den Texten, damit die Helfer sie umschreiben können (erster Satz, dann .2).
  const texte = JSON.parse(
    readFileSync(new URL("../../../inhalte/abenteuer/texte/de.json", import.meta.url), "utf-8"),
  ) as Record<string, string>;
  const satz = (schluessel: string) => (texte[schluessel] ?? schluessel).slice(0, SATZANFANG);
  await expect(blase).toContainText(satz("statist.summitCity.bergladen.ladenhilfe"));
  await aktion.click();
  await expect(blase).toContainText(satz("statist.summitCity.bergladen.ladenhilfe.2"));
  await blase.getByRole("button", { name: "Weiter" }).click();
  await expect(blase).toHaveCount(0);
});

test("Vorführung im Bergladen: der Kunde zeigt das Schäfermatt Zug für Zug", async ({ page }) => {
  // Dokument 16, 3.4: Ein Statist mit `zeigt` bietet nach seinem Satz ein kleines Brett an.
  const stand = {
    ...STAND,
    position: {
      karte: "summitCity.bergladen",
      ...feldDarunter("summit-city-bergladen", "kunde"),
      richtung: "oben",
    },
  };
  await starteImBrowser(page);
  await expect.poll(() => page.evaluate(schreibeStand, stand)).toBe(true);
  await page.reload();
  await page.goto("/app/#abenteuer");
  await page.getByTestId("abenteuer-laden").click();
  await expect(page.getByTestId("abenteuer-welt")).toBeVisible({ timeout: 30000 });
  const aktion = page.getByTestId("abenteuer-aktion");
  await expect(aktion).toHaveText("Sprechen", { timeout: 30000 });
  await aktion.click();
  await expect(page.getByTestId("abenteuer-sprechblase")).toContainText("Soll ich ihn dir zeigen?");
  await page.getByTestId("abenteuer-vorfuehrung-zeigen").click();
  const vorfuehrung = page.getByTestId("abenteuer-vorfuehrung");
  await expect(vorfuehrung).toContainText("Das Schäfermatt");
  await page.getByTestId("abenteuer-vorfuehrung-vor").click();
  await expect(page.getByTestId("abenteuer-vorfuehrung-satz")).toContainText(
    "Weiß zieht den Königsbauern",
  );
  await vorfuehrung.getByRole("button", { name: "Weiter" }).click();
  await expect(vorfuehrung).toHaveCount(0);
});

test("Dunkler Stollen: mit Laterne leuchtet ein Lichtkreis um den Helden", async ({ page }) => {
  // Runde 6: Tönung „dunkel“ aus der Karte, Lichtkreis von vier Feldern mit Laterne (S4).
  const stand = {
    ...STAND,
    gegenstaende: ["laterne"],
    position: {
      karte: "steinbruch.stollen",
      ...feldVon("steinbruch-stollen", "start"),
      richtung: "unten",
    },
  };
  await starteImBrowser(page);
  await expect.poll(() => page.evaluate(schreibeStand, stand)).toBe(true);
  await page.reload();
  await page.goto("/app/#abenteuer");
  await page.getByTestId("abenteuer-laden").click();
  const welt = page.getByTestId("abenteuer-welt");
  await expect(page.locator(".abenteuer-welt canvas")).toBeVisible({ timeout: 30000 });
  await expect(welt).toHaveAttribute("data-toenung", "dunkel");
});

test("Musikhaus: nach musikhausOffen lädt die zweite Fassung der Karte", async ({ page }) => {
  // Runde 6 und 8: orte.json `zustaende` wählt die Datei nach der Bedingung; der Name ist der
  // Teil des Dateinamens hinter der Grundkarte (port-delacroix-musikhaus-neu → „neu“).
  const stand = {
    ...STAND,
    dialogvariablen: { musikhausOffen: true },
    position: {
      karte: "portDelacroix.musikhaus",
      ...feldVon("port-delacroix-musikhaus-neu", "start"),
      richtung: "oben",
    },
  };
  await starteImBrowser(page);
  await expect.poll(() => page.evaluate(schreibeStand, stand)).toBe(true);
  await page.reload();
  await page.goto("/app/#abenteuer");
  await page.getByTestId("abenteuer-laden").click();
  await expect(page.locator(".abenteuer-welt canvas")).toBeVisible({ timeout: 30000 });
  await expect(page.getByTestId("abenteuer-welt")).toHaveAttribute("data-fassung", "neu");
});

test("Tagebuch: Sammelkarte der Finch-Jagd zeigt die gefundene Figur", async ({ page }) => {
  // Runde 6, Teil 5: 16 Kästchen, Fortschritt aus den Funden.
  const stand = {
    ...STAND,
    funde: [{ kennung: "finchLaeuferA", gefunden: "2026-11-10T08:00:00.000Z" }],
  };
  await starteImBrowser(page);
  await expect.poll(() => page.evaluate(schreibeStand, stand)).toBe(true);
  await page.reload();
  await page.goto("/app/#abenteuer");
  await page.getByTestId("abenteuer-laden").click();
  await expect(page.getByTestId("abenteuer-welt")).toBeVisible({ timeout: 30000 });
  await page.getByTestId("abenteuer-tagebuchknopf").click();
  const karte = page.getByTestId("abenteuer-finchkarte");
  await expect(karte.locator("li")).toHaveCount(16);
  await expect(karte.locator("li.gefunden")).toHaveCount(1);
  await expect(page.getByTestId("abenteuer-tagebuch")).toContainText("1 von 16 Figuren gefunden.");
});

test("Weg 3: Kreidespringer an der Brücke, Rätsel lösen, Losungswort", async ({ page }) => {
  // Runde 6, Ereignis „Die Brückenbauern“ (Dokument 15, 2.3): Td8 ist das Wort.
  const stand = {
    ...STAND,
    position: {
      karte: "wegRivertonIronwood.bruecke",
      ...feldDarunter("weg-riverton-ironwood-2", "kreide1"),
      richtung: "oben",
    },
  };
  await starteImBrowser(page);
  await expect.poll(() => page.evaluate(schreibeStand, stand)).toBe(true);
  await page.reload();
  await page.goto("/app/#abenteuer");
  await page.getByTestId("abenteuer-laden").click();
  await expect(page.getByTestId("abenteuer-welt")).toBeVisible({ timeout: 30000 });
  const aktion = page.getByTestId("abenteuer-aktion");
  await expect(aktion).toHaveText("Ansehen", { timeout: 30000 });
  await aktion.click();
  const td8 = page.locator(".abenteuer-dialog-wahlen button", { hasText: "Td8" });
  for (let i = 0; i < 10 && !(await td8.isVisible()); i++) {
    const weiter = page.locator(".abenteuer-dialog-weiter");
    if (await weiter.isVisible()) await weiter.click();
    else await page.waitForTimeout(100);
  }
  await td8.click();
  await expect(page.locator(".abenteuer-dialog")).toContainText("Matt auf der Grundreihe");
});

test("Erinnerung London 1851: Sepia, kein Tagebuch, keine Münzen", async ({ page }) => {
  const stand = {
    ...STAND,
    position: { karte: "erinnerungLondon.strand", x: 2, y: 10, richtung: "rechts" },
  };
  await starteImBrowser(page);
  await expect.poll(() => page.evaluate(schreibeStand, stand)).toBe(true);
  await page.reload();
  await page.goto("/app/#abenteuer");
  await page.getByTestId("abenteuer-laden").click();
  const welt = page.getByTestId("abenteuer-welt");
  await expect(welt).toBeVisible({ timeout: 30000 });
  await expect(page.locator(".abenteuer-welt canvas")).toBeVisible({ timeout: 30000 });
  await expect(welt).toHaveClass(/abenteuer-welt-erinnerung/);
  await expect(page.getByTestId("abenteuer-tagebuchknopf")).toHaveCount(0);
  await expect(page.getByTestId("abenteuer-muenzen")).toHaveCount(0);
});

test("Monatskarte: Reisen in eine besuchte Stadt", async ({ page }) => {
  const stand = {
    ...STAND,
    besuchteOrte: ["mapleFalls", "cedarCreek"],
    gegenstaende: ["monatskarte"],
  };
  await starteImBrowser(page);
  await expect.poll(() => page.evaluate(schreibeStand, stand)).toBe(true);
  await page.reload();
  await page.goto("/app/#abenteuer");
  await page.getByTestId("abenteuer-laden").click();
  await expect(page.locator(".abenteuer-welt canvas")).toBeVisible({ timeout: 30000 });
  await page.getByTestId("abenteuer-reisenknopf").click();
  const reisen = page.getByTestId("abenteuer-reisen");
  await expect(reisen).toBeVisible();
  await reisen.getByRole("button", { name: "Cedar Creek" }).click();
  await expect(reisen).toHaveCount(0);
  // In der Stadt kann eine Meldung kommen (etwa eine Quest); eine fehlende Karte darf es nicht sein.
  await expect(page.locator(".abenteuer-welt canvas")).toBeVisible({ timeout: 30000 });
  await expect(page.getByText(/noch nicht gebaut|fehlt noch/)).toHaveCount(0);
});

test("Reisebrett: Übungspartie gegen Ambrose von draußen", async ({ page }) => {
  const stand = { ...STAND, gegenstaende: ["reisebrett"] };
  await starteImBrowser(page);
  await expect.poll(() => page.evaluate(schreibeStand, stand)).toBe(true);
  await page.reload();
  await page.goto("/app/#abenteuer");
  await page.getByTestId("abenteuer-laden").click();
  await expect(page.locator(".abenteuer-welt canvas")).toBeVisible({ timeout: 30000 });
  await page.getByTestId("abenteuer-reisebrettknopf").click();
  await expect(page.getByTestId("abenteuer-deckwahl")).toBeVisible();
  await page.getByTestId("abenteuer-deck-los").click();
  await expect(page.getByTestId("abenteuer-kartenleiste")).toBeVisible({ timeout: 30000 });
});
