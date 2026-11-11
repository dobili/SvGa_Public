/**
 * Schach-Abenteuer, Aufgabenrunde (Schritt 8f, Regelwerk R30 bis R32): Ein Spielstand mit einer
 * offenen Runde von Sam wird eingespielt; die Oberwelt bietet „Weitermachen“, die App spielt die
 * Runde im Trainerrahmen (hier mit „Lösung zeigen“, also alles falsch), „Zurück zur Stadt“ zeigt
 * „Das reicht noch nicht“ mit dem Angebot einer leichteren Runde.
 */
import { expect, test, type Page } from "@playwright/test";
import { starteImBrowser } from "./hilfen";

/** Ein Spielstand mit laufender Runde; fehlende Listen füllt die App beim Lesen. */
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
  position: { karte: "mapleFalls.dachboden", x: 2, y: 5, richtung: "unten" },
  laufendeAufgaben: {
    kennung: "mapleFalls.reiheSam#e2e",
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

/** Schreibt den Spielstand in die Nutzerdaten (IndexedDB der App). */
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

/** Beantwortet die aktuelle Aufgabe mit „Ich komme nicht drauf“ (Lösung zeigen) und geht weiter. */
async function loeseFalsch(seite: Page): Promise<void> {
  // Im Spiel sprechen die Knöpfe die Sprache der Geschichte (docs/spiel/18, Abschnitt 6).
  await expect(seite.getByRole("button", { name: "Ambrose fragen" })).toBeVisible();
  await seite.getByRole("button", { name: "Ich komme nicht drauf" }).click();
  const weiter = seite.getByRole("button", { name: "Weiter", exact: true });
  await expect(weiter).toBeVisible({ timeout: 10000 });
  // Im Spiel fehlen die Knöpfe der App nach der Antwort (Wunsch des Autors, 10.11.2026).
  await expect(seite.getByRole("button", { name: "Als Variante öffnen" })).toHaveCount(0);
  await expect(seite.getByText("In die Lernsammlung")).toHaveCount(0);
  await expect(seite.getByRole("button", { name: "Aufgabe wiederholen" })).toHaveCount(0);
  await weiter.click();
}

test("Aufgabenrunde von Sam: weitermachen, durchspielen, Ergebnis in der Stadt", async ({
  page,
}) => {
  await starteImBrowser(page);
  await expect.poll(() => page.evaluate(schreibeStand, STAND)).toBe(true);
  // Neu laden, damit die App den Spielstand liest (ein Wechsel nur der Adresse lädt nicht neu).
  await page.reload();
  await page.goto("/app/#abenteuer");
  await expect(page.getByTestId("abenteuer-start")).toBeVisible();
  await page.getByTestId("abenteuer-laden").click();
  // Mit Spielstand öffnet sich die Welt nach dem Laden von selbst, ohne Namenswahl.
  await expect(page.getByText("Deine Aufgabenrunde läuft noch.")).toBeVisible({ timeout: 30000 });
  await page.getByRole("button", { name: "Weitermachen" }).click();

  await expect(page.getByTestId("abenteuer-aufgaben")).toBeVisible();
  // Spielhülle (docs/spiel/18): Kopf mit Sam, der die Aufgaben stellt; keine Knöpfe der App.
  await expect(page.getByTestId("abenteuer-huelle-kopf")).toContainText("Sam");
  // Eine Buchübung (Abb. 1.40) und zwei Hängeaufgaben: „Aufgabe 1 von 3“.
  await expect(page.getByTestId("trainerrunde")).toContainText("Aufgabe 1 von 3", {
    timeout: 20000,
  });
  await expect(page.getByRole("button", { name: "Brett drehen" })).toBeHidden();
  for (let i = 0; i < 3; i++) await loeseFalsch(page);
  await expect(page.getByTestId("abenteuer-aufgaben-ende")).toBeVisible();
  await expect(page.getByTestId("abenteuer-aufgaben-ende")).toContainText("0 von 3");
  await page.getByTestId("abenteuer-aufgaben-zurueck").click();

  // Zurück in der Stadt: nicht bestanden, leichtere Runde im Angebot; die Runde ist abgeräumt.
  const ergebnis = page.getByTestId("abenteuer-rundenergebnis");
  await expect(ergebnis).toBeVisible({ timeout: 30000 });
  await expect(ergebnis).toContainText("0 von 3 Punkten");
  await expect(page.getByTestId("abenteuer-runde-nochmal")).toBeVisible();
  await page.getByRole("button", { name: "Weiter", exact: true }).click();
  await expect(ergebnis).toHaveCount(0);
  await expect(page.getByText("Deine Aufgabenrunde läuft noch.")).toHaveCount(0);
});

test("Testhilfe: „Bestehen“ beendet die Runde von Sam als bestanden", async ({ page }) => {
  await starteImBrowser(page);
  await expect.poll(() => page.evaluate(schreibeStand, STAND)).toBe(true);
  await page.reload();
  await page.goto("/app/#abenteuer");
  await page.getByTestId("abenteuer-laden").click();
  await expect(page.getByText("Deine Aufgabenrunde läuft noch.")).toBeVisible({ timeout: 30000 });
  await page.getByRole("button", { name: "Weitermachen" }).click();
  await expect(page.getByTestId("trainerrunde")).toContainText("Aufgabe 1 von 3", {
    timeout: 20000,
  });
  await page.getByTestId("abenteuer-test-bestehen").click();
  await expect(page.getByTestId("abenteuer-aufgaben-ende")).toContainText("3 von 3");
  await page.getByTestId("abenteuer-aufgaben-zurueck").click();
  const ergebnis = page.getByTestId("abenteuer-rundenergebnis");
  await expect(ergebnis).toBeVisible({ timeout: 30000 });
  await expect(ergebnis).toContainText("3 von 3 Punkten");
  await expect(page.getByTestId("abenteuer-runde-nochmal")).toHaveCount(0);
});

test("Erinnerung New York 1857: Zugerraten der Partie Paulsen gegen Morphy", async ({ page }) => {
  const stand = {
    ...STAND,
    position: { karte: "cedarCreek.archiv", x: 2, y: 5, richtung: "oben" },
    laufendeAufgaben: {
      ...STAND.laufendeAufgaben,
      kennung: "cedarCreek.erinnerungNewYork#e2e",
      runde: "cedarCreek.erinnerungNewYork",
      steller: "figur.okafor.name",
      buchuebungen: [],
      themen: [],
      anzahl: 1,
      erinnerung: { partie: "klassik-paulsen-morphy", abZug: 13, seite: "black" },
    },
  };
  await starteImBrowser(page);
  await expect.poll(() => page.evaluate(schreibeStand, stand)).toBe(true);
  await page.reload();
  await page.goto("/app/#abenteuer");
  await page.getByTestId("abenteuer-laden").click();
  await expect(page.getByText("Deine Aufgabenrunde läuft noch.")).toBeVisible({ timeout: 30000 });
  await page.getByRole("button", { name: "Weitermachen" }).click();
  await expect(page.getByTestId("abenteuer-aufgaben")).toBeVisible();
  await expect(page.locator(".trainer-auftrag")).toContainText("Paulsen", { timeout: 20000 });
  await expect(page.locator(".trainer-auftrag")).toContainText("Schwarz");
});
