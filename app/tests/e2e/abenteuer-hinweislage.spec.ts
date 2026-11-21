/**
 * Kurze Infotexte verdecken den Helden nicht (Wunsch des Autors, 20.11.2026): Der Hinweis zur
 * Steuerung und die Meldung „Deine ersten Münzen“ liegen am Rand fern vom Helden (heldhaelfte.ts,
 * data-held an der Welt) und nicht auf Steuerkreuz, Aktionsknopf oder Symbolknöpfen.
 * Die Lage des Helden auf dem Bildschirm schreibt die Kameraführung in window.__kameraprotokoll
 * (wie abenteuer-kamera.spec.ts), als Anteil des Bildes; das Rechteck darum ist großzügig.
 */
import { expect, test, type Page } from "@playwright/test";
import { EINLEITUNG_GESEHEN, GRUNDSTAND, starteMitStand } from "./abenteuer-affe";

interface Rechteck {
  readonly links: number;
  readonly oben: number;
  readonly rechts: number;
  readonly unten: number;
}

/** Halbe Breite und Höhe über und unter dem Fußpunkt des Helden, in CSS-Pixeln (Figur ~64 px). */
const HALBE_BREITE = 28;
const UEBER_FUSS = 72;
const UNTER_FUSS = 24;

const FORMATE = [
  { name: "hoch", viewport: { width: 390, height: 844 } },
  { name: "quer", viewport: { width: 844, height: 390 } },
];
/** Mitten im Park und am oberen Kartenrand (die Kamera hält dort an, der Held steht oben). */
const LAGEN = [
  { name: "Mitte", position: { karte: "mapleFalls.park", x: 25, y: 14, richtung: "oben" } },
  { name: "oberer Rand", position: { karte: "mapleFalls.park", x: 25, y: 3, richtung: "unten" } },
];
const TEXTE = [
  {
    name: "Steuerhinweis",
    testid: "abenteuer-steuerhinweis",
    variablen: { ...EINLEITUNG_GESEHEN, muenzenErklaert: true },
  },
  { name: "Meldung", testid: "abenteuer-meldung", variablen: EINLEITUNG_GESEHEN },
];

function schneiden(a: Rechteck, b: Rechteck): boolean {
  return a.links < b.rechts && b.links < a.rechts && a.oben < b.unten && b.oben < a.unten;
}

/** Das Rechteck um den Helden aus dem letzten Eintrag der Kameraführung. */
async function heldRechteck(seite: Page): Promise<Rechteck> {
  const lage = await seite.evaluate(() => {
    const p = (window as { __kameraprotokoll?: { heldX: number; heldY: number }[] })
      .__kameraprotokoll;
    const letzter = p?.[p.length - 1];
    const bild = document.querySelector(".abenteuer-welt canvas")?.getBoundingClientRect();
    if (!letzter || !bild) return null;
    return { x: bild.x + letzter.heldX * bild.width, y: bild.y + letzter.heldY * bild.height };
  });
  if (!lage) throw new Error("Keine Heldenlage im Protokoll");
  return {
    links: lage.x - HALBE_BREITE,
    rechts: lage.x + HALBE_BREITE,
    oben: lage.y - UEBER_FUSS,
    unten: lage.y + UNTER_FUSS,
  };
}

async function rechteckVon(seite: Page, selektor: string): Promise<Rechteck[]> {
  return seite.locator(selektor).evaluateAll((liste) =>
    liste.map((e) => {
      const r = e.getBoundingClientRect();
      return { links: r.left, oben: r.top, rechts: r.right, unten: r.bottom };
    }),
  );
}

for (const format of FORMATE) {
  test.describe(`Hinweislage ${format.name}`, () => {
    test.use({ viewport: format.viewport });
    for (const lage of LAGEN) {
      for (const text of TEXTE) {
        test(`${text.name}, Held ${lage.name}: nicht über dem Helden und der Bedienung`, async ({
          page,
        }) => {
          await page.addInitScript(() => {
            window.localStorage.setItem("svga.safariHinweis", "aus");
            (window as { __kameraprotokoll?: unknown[] }).__kameraprotokoll = [];
          });
          await starteMitStand(page, {
            ...GRUNDSTAND,
            position: lage.position,
            dialogvariablen: text.variablen,
          });
          const zeile = page.getByTestId(text.testid);
          await expect(zeile).toBeVisible({ timeout: 20000 });
          // Die Kamera ist angekommen, die Lage der Zeile folgt data-held.
          await page.waitForTimeout(800);
          const box = await zeile.boundingBox();
          if (!box) throw new Error("Zeile ohne Lage");
          const r = {
            links: box.x,
            oben: box.y,
            rechts: box.x + box.width,
            unten: box.y + box.height,
          };
          expect(schneiden(r, await heldRechteck(page)), "Text über dem Helden").toBe(false);
          const bedienung = await rechteckVon(
            page,
            ".abenteuer-steuerkreuz, .abenteuer-aktion, .abenteuer-tagebuchknopf, .abenteuer-menueknopf",
          );
          for (const b of bedienung) expect(schneiden(r, b), "Text über der Bedienung").toBe(false);
        });
      }
    }
  });
}
