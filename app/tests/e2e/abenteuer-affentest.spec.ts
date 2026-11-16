/**
 * Affentest des Schach-Abenteuers (Wunsch des Autors, 14.11.2026): In jedem Bereich des Spiels
 * tippt, drückt, lädt und geht ein Affe mit festem Startwert zurück; danach muss ein Spieler aus
 * jedem Zustand in die begehbare Welt zurückfinden, ohne Ausnahme und ohne Fehler in der Konsole.
 *
 * Die normale Reihe macht wenige Schritte je Bereich (unter zwei Minuten); `AFFE_LANG=1` macht
 * viel mehr und probiert mehrere Startwerte (`AFFE_STARTWERT` legt den ersten fest).
 * Abhängigkeiten: tests/e2e/abenteuer-affe.ts, tests/e2e/abenteuer-karte.ts.
 */
import { expect, test, type Page } from "@playwright/test";
import {
  beobachte,
  findeAusweg,
  GRUNDSTAND,
  lasseAffenLos,
  liesSpeicherImBrowser,
  starteMitStand,
} from "./abenteuer-affe";
import { feldDarunter, feldVon } from "./abenteuer-karte";

const LANG = process.env.AFFE_LANG === "1";
/** Schritte je Bereich: kurz in der normalen Reihe, lang nur bei Bedarf. */
const SCHRITTE = LANG ? 600 : 35;
const STARTWERT = Number(process.env.AFFE_STARTWERT ?? "20261114");

/** Ein Bereich des Spiels: Spielstand und wie man von der Welt aus hineinkommt. */
interface Bereich {
  readonly name: string;
  readonly stand: object;
  readonly hinein: (seite: Page) => Promise<void>;
}

/** Den Aktionsknopf drücken, bis ein Fenster mit dieser Testkennung offen ist. */
async function sprichAn(seite: Page, ziel: string): Promise<void> {
  await expect(async () => {
    const fenster = seite.getByTestId(ziel);
    if (!(await fenster.isVisible())) await seite.getByTestId("abenteuer-aktion").click();
    await expect(fenster).toBeVisible({ timeout: 3000 });
  }).toPass({ timeout: 30000 });
}

/** Mit dem Reisebrett in die Deckwahl. */
async function zurDeckwahl(seite: Page): Promise<void> {
  await seite.getByTestId("abenteuer-reisebrettknopf").click();
  await expect(seite.getByTestId("abenteuer-deckwahl")).toBeVisible();
}

const BEREICHE: readonly Bereich[] = [
  { name: "Oberwelt", stand: GRUNDSTAND, hinein: async () => undefined },
  {
    name: "Dialog",
    stand: {
      ...GRUNDSTAND,
      position: {
        karte: "mapleFalls.park",
        ...feldDarunter("maple-falls-park", "kiosk"),
        richtung: "oben",
      },
    },
    hinein: (s) => sprichAn(s, "abenteuer-dialog"),
  },
  { name: "Deckwahl", stand: GRUNDSTAND, hinein: zurDeckwahl },
  {
    name: "Partie",
    stand: GRUNDSTAND,
    hinein: async (s) => {
      await zurDeckwahl(s);
      await s.getByTestId("abenteuer-deck-los").click();
      await expect(s.getByTestId("partie")).toBeVisible({ timeout: 30000 });
    },
  },
  {
    name: "Aufgabenrunde",
    stand: {
      ...GRUNDSTAND,
      position: { karte: "mapleFalls.dachboden", x: 2, y: 9, richtung: "unten" },
      laufendeAufgaben: {
        kennung: "mapleFalls.reiheSam#affe",
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
    },
    hinein: async (s) => {
      await s.getByRole("button", { name: "Weitermachen" }).click();
      await expect(s.getByTestId("abenteuer-aufgaben")).toBeVisible({ timeout: 20000 });
    },
  },
  {
    name: "Vorführung",
    stand: {
      ...GRUNDSTAND,
      position: {
        karte: "summitCity.bergladen",
        ...feldDarunter("summit-city-bergladen", "kunde"),
        richtung: "oben",
      },
    },
    hinein: async (s) => {
      await sprichAn(s, "abenteuer-sprechblase");
      await s.getByTestId("abenteuer-vorfuehrung-zeigen").click();
      await expect(s.getByTestId("abenteuer-vorfuehrung")).toBeVisible();
    },
  },
  {
    name: "Gedächtnisstellung",
    stand: {
      ...GRUNDSTAND,
      dialogvariablen: { versoehnungGesehen: true, seilschaftBegonnen: true },
      position: {
        karte: "wegDelacroixDesert.felsbogen",
        ...feldDarunter("weg-delacroix-desert-felsbogen", "ereignisSeilschaft"),
        richtung: "oben",
      },
    },
    hinein: async (s) => {
      await sprichAn(s, "abenteuer-dialog");
      for (let i = 0; i < 20 && !(await s.getByTestId("abenteuer-gedaechtnis").isVisible()); i++) {
        await s
          .locator(".abenteuer-dialog-weiter")
          .click({ timeout: 2000 })
          .catch(() => undefined);
      }
      await expect(s.getByTestId("abenteuer-gedaechtnis")).toBeVisible();
    },
  },
];

// Ungenutzt, solange kein Bereich am Start einer Karte beginnt; bleibt für lange Läufe da.
void feldVon;

test.describe.configure({ mode: "parallel" });

for (const [nr, bereich] of BEREICHE.entries()) {
  test(`Affe: ${bereich.name}`, async ({ page }) => {
    test.setTimeout(LANG ? 900_000 : 180_000);
    const funde = beobachte(page);
    await starteMitStand(page, bereich.stand);
    await bereich.hinein(page);
    const laeufe = LANG ? 3 : 1;
    for (let lauf = 0; lauf < laeufe; lauf++) {
      const startwert = STARTWERT + nr * 1000 + lauf;
      const { protokoll, auffaellig } = await lasseAffenLos(page, startwert, SCHRITTE);
      if (auffaellig.length > 0) console.log(`${bereich.name} (${startwert}):`, auffaellig);
      await findeAusweg(page).catch((e: Error) => {
        throw new Error(
          `${e.message}\nProtokoll ${startwert}: ${protokoll.slice(-20).join(" | ")}`,
        );
      });
    }
    // Nach allem: Spielstand lesbar, höchstens eine Partie des Spiels läuft noch.
    const speicher = await page.evaluate(liesSpeicherImBrowser);
    expect(speicher.abenteuer).not.toBeNull();
    expect(speicher.partien.filter((p) => p.kennung !== null && !p.ende).length).toBeLessThan(2);
    expect(funde).toEqual([]);
  });
}
