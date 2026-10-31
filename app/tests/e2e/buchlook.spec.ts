/**
 * Buchseite und Lernpfad neu (Gestaltung A2 und B1 nach Wahl des Autors, 31.10.2026): Bilder in
 * Handybreite, hell und dunkel, und die Bedingung des Autors, dass die Kapitel in der oberen
 * Bildschirmhälfte beginnen. Eingespielt wird ein Stand mitten im Buch: Wochenziel 4 Tage mit drei
 * Lerntagen, Kapitel 0 bis 4 ganz, Kapitel 5 ohne Übungen, Kapitel 6 zur Hälfte. Die Bilder landen
 * in test-results/bilder/ für den Bericht an den Autor.
 */
import { expect, test, type Page } from "@playwright/test";
import { UEBUNGEN_JE_KAPITEL } from "../../src/daten/uebungsliste-daten";
import { starteImBrowser } from "./hilfen";

/** Freitag vormittag; Montag, Dienstag und Donnerstag sind Lerntage. */
const JETZT = "2026-10-30T10:00:00";
const LERNTAGE = ["2026-10-26", "2026-10-27", "2026-10-29"];
const GANZ = [0, 1, 2, 3, 4];
/** Breite und Höhe eines üblichen Handys (Android, 360 × 800). */
const HANDY = { width: 360, height: 800 };

/** Schreibt Woche und Fortschritt in den Stand; false, solange es ihn noch nicht gibt. */
function schreibeStand(eingabe: {
  lerntage: readonly string[];
  ziel: number | null;
  uebungen: readonly string[];
}): Promise<boolean> {
  return new Promise<boolean>((fertig, fehler) => {
    void fetch("/daten/de/a1/index.json")
      .then((antwort) => antwort.json())
      .then((index: { kapitel: { kapitel: number; abbildungen: string[] }[] }) => {
        const gesehen: Record<string, string> = {};
        for (const k of index.kapitel) {
          const anzahl = k.kapitel <= 5 ? k.abbildungen.length : k.kapitel === 6 ? 19 : 0;
          for (const n of k.abbildungen.slice(0, anzahl)) gesehen[n] = "2026-10-20T10:00:00.000Z";
        }
        const uebungen = Object.fromEntries(
          eingabe.uebungen.map((id) => [
            id,
            { kapitel: 0, versuche: 1, geloest: true, zuletzt: "2026-10-20T10:00:00.000Z" },
          ]),
        );
        const anfrage = indexedDB.open("schach-von-grund-auf");
        anfrage.onerror = () => fehler(anfrage.error);
        anfrage.onsuccess = () => {
          const db = anfrage.result;
          const bereich = db.transaction("nutzerdaten", "readwrite").objectStore("nutzerdaten");
          const lesen = bereich.get("aktuell");
          lesen.onsuccess = () => {
            const alt = lesen.result as Record<string, Record<string, unknown>> | undefined;
            if (!alt?.aktivitaet || !alt.fortschritt) {
              db.close();
              fertig(false);
              return;
            }
            const neu = {
              ...alt,
              aktivitaet: Object.fromEntries(eingabe.lerntage.map((t) => [t, { abbildung: 3 }])),
              wochen: { ...alt.wochen, ziel: eingabe.ziel },
              fortschritt: { ...alt.fortschritt, gesehen, uebungen },
            };
            const schreiben = bereich.put(neu, "aktuell");
            schreiben.onsuccess = () => {
              db.close();
              fertig(true);
            };
            schreiben.onerror = () => fehler(schreiben.error);
          };
        };
      }, fehler);
  });
}

/** Startet mit Farbschema, festem Tag und eingespieltem Stand. */
async function starte(page: Page, schema: "hell" | "dunkel", ziel: number | null): Promise<void> {
  await page.clock.setFixedTime(JETZT);
  await page.setViewportSize(HANDY);
  await starteImBrowser(page);
  await page.addInitScript((farbschema) => {
    window.localStorage.setItem("svga.farbschema", farbschema);
    window.localStorage.setItem("svga.zuletzt", "6.19");
    // Die Gratulation zu den vollen Ringen gehört nicht ins Bild.
    const ringe = ["grundlagen", "eroeffnung"].map((teil) => `ich-teil-${teil}`).join(",");
    window.localStorage.setItem("svga.ringeGefeiert", ringe);
  }, schema);
  const uebungen = GANZ.flatMap((k) => UEBUNGEN_JE_KAPITEL[k] ?? []);
  const eingabe = { lerntage: LERNTAGE, ziel, uebungen };
  await expect.poll(() => page.evaluate(schreibeStand, eingabe)).toBe(true);
  await page.reload();
}

for (const schema of ["dunkel", "hell"] as const) {
  test(`Buchseite: Karte „Heute“, Kapitel in der oberen Hälfte (${schema})`, async ({ page }) => {
    await starte(page, schema, 4);
    const karte = page.getByTestId("heute");
    await expect(karte.getByTestId("wochenziel-stand")).toHaveText("3 von 4 Tagen");
    await expect(karte.getByTestId("heute-vorschlag")).toBeVisible();
    const kapitel = page.locator(".kapitelliste");
    const oben = (await kapitel.boundingBox())?.y ?? HANDY.height;
    expect(oben).toBeLessThan(HANDY.height / 2);
    await page.screenshot({ path: `test-results/bilder/buch-heute-${schema}.png` });
    // „Zuletzt“ steht nach einem Tipp ins Nummernfeld bereit (nichts fällt weg).
    await page.getByLabel("Abbildung öffnen").click();
    await expect(page.getByRole("button", { name: "Zuletzt: Abb. 6.19" })).toBeVisible();
    await karte.getByTestId("reiter-auftraege").click();
    await karte.screenshot({ path: `test-results/bilder/buch-heute-auftraege-${schema}.png` });
  });

  test(`Buchseite: ohne Wochenziel nur die Tagesknöpfe (${schema})`, async ({ page }) => {
    await starte(page, schema, null);
    const karte = page.getByTestId("heute");
    await expect(karte.getByRole("button", { name: "3 Tage" })).toBeVisible();
    await karte.screenshot({ path: `test-results/bilder/buch-heute-ohne-ziel-${schema}.png` });
  });

  test(`Lernpfad: fünf Landschaften (${schema})`, async ({ page }) => {
    await starte(page, schema, 4);
    await page.getByTestId("lernpfad-knopf-buch").click();
    await expect(page.locator(".lernpfad-station")).toHaveCount(13);
    await page.screenshot({ path: `test-results/bilder/lernpfad-${schema}.png`, fullPage: true });
  });
}
