/**
 * Karte „Heute“ und Profil in Zuständen, die sich durch Bedienen nur mühsam herstellen lassen
 * (Vortest der offenen Testpunkte, 17.11.2026): mitten im Buch, eigenes Ziel, 200 fällige
 * Karten, alles erledigt, Startweg „Spielen“, Wertung 900, schwache Eröffnung aus zehn
 * gewerteten Partien. Die Zustände schreibt zustand.ts in den Speicher.
 * Die zehn Partien in phasenpartien.json sind erzeugt (feste Eröffnung, dann zufällige Tausche
 * bis ins Endspiel); die Werte je Zug setzt der Test selbst: Weiß verliert in der Eröffnung.
 * Regeln: training/vorschlagsarten.ts, training/zielreichweite.ts, training/phasenschwaeche.ts.
 */
import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import { eintrag, spielePartienEin } from "./auswertungpartie";
import { oeffneProfil, oeffneReiter, starteImBrowser } from "./hilfen";
import { abbildungenVon, gesehenFuer, liesDaten, setzeDaten } from "./zustand";

const LEER = { gesehen: {}, uebungen: {}, trainer: {}, warum: {}, eingeschaetzt: {} };
const GESTERN = "2026-11-01T09:00:00.000Z";
/** Verlust je Zug von Weiß in der Eröffnung (Wert nach dem Zug, aus Sicht von Weiß). */
const ERÖFFNUNG_HALBZUEGE = 12;
const WERT_GUT = 0.2;
const WERT_NACH_FEHLER = -1.5;
/** Feiern kommen kurz nach dem Laden, je Ring eine. */
const FEIER_WARTEN_MS = 800;
const HOECHSTENS_FEIERN = 6;

interface Erzeugt {
  readonly san: readonly string[];
  readonly uci: readonly string[];
}
const PARTIEN = JSON.parse(
  readFileSync(new URL("./phasenpartien.json", import.meta.url), "utf-8"),
) as Erzeugt[];

/** Lerntag heute (Ortszeit des Browsers) als Schlüssel wie in der App. */
function heute(seite: Page): Promise<string> {
  return seite.evaluate(() => {
    const d = new Date();
    const z = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
  });
}

/** Alle Übungen der Kapitel als gelöst. */
function geloesteUebungen(kapitel: readonly number[]) {
  const ergebnis: Record<string, unknown> = {};
  for (const k of kapitel) {
    const datei = new URL(`../../public/daten/de/a1/kap0${k}.json`, import.meta.url);
    const daten = JSON.parse(readFileSync(datei, "utf-8")) as { uebungen: { id: string }[] };
    for (const u of daten.uebungen) {
      ergebnis[u.id] = { kapitel: k, versuche: 1, geloest: true, zuletzt: GESTERN };
    }
  }
  return ergebnis;
}

/** Kapitel 0 und 1 gelesen und geübt, Tagesaufgabe erledigt: Platz für die späten Vorschläge. */
async function allesErledigt(seite: Page): Promise<void> {
  await setzeDaten(seite, {
    fortschritt: { ...LEER, gesehen: gesehenFuer([0, 1]), uebungen: geloesteUebungen([0, 1]) },
    aktivitaet: { [await heute(seite)]: { tagesaufgabe: 1 } },
  });
  await schliesseFeiern(seite);
}

/** Die gelösten Übungen füllen Ringe; deren Feier deckt die Karte zu und wird geschlossen. */
async function schliesseFeiern(seite: Page): Promise<void> {
  const feier = seite.getByTestId("ringfeier");
  await seite.waitForTimeout(FEIER_WARTEN_MS);
  for (let i = 0; i < HOECHSTENS_FEIERN && (await feier.count()) > 0; i++) {
    await feier.getByRole("button", { name: "Weiter" }).click();
    await seite.waitForTimeout(FEIER_WARTEN_MS);
  }
  await expect(feier).toHaveCount(0);
}

/** Eine erzeugte Partie als ausgewertete, gewertete Partie mit schwacher Eröffnung. */
function gewertetePartie(p: Erzeugt, i: number) {
  const basis = eintrag();
  const werte = [
    WERT_GUT,
    ...p.san.map((_, h) => (h % 2 === 0 && h < ERÖFFNUNG_HALBZUEGE ? WERT_NACH_FEHLER : WERT_GUT)),
  ];
  const von = (h: number) => (h % 2 === 0 ? "leser" : "engine");
  return {
    ...basis,
    partie: {
      ...basis.partie,
      id: `phase-${i}`,
      begonnen: `2026-11-${String(i + 1).padStart(2, "0")}T10:00:00.000Z`,
      einstellung: { ...basis.partie.einstellung, gewertet: true },
      zuege: p.san.map((san, h) => ({
        san,
        von: von(h),
        quelle: von(h),
        fehler: null,
        verlust: 0,
        stufe: 2,
      })),
      ende: { art: "aufgabe", sieger: "black" },
    },
    werte,
    beste: [...p.uci, ""],
    abstaende: werte.map(() => 0),
    varianten: [...p.uci, ""].map((b) => (b ? [b] : [])),
  };
}

const karte = (seite: Page) => seite.getByTestId("heute");
const kachel = (seite: Page, art: string) => karte(seite).getByTestId(`heute-alternative-${art}`);

test("Heute mitten im Buch, mit eigenem Ziel und mit 200 fälligen Karten (N2440 bis N2442)", async ({
  page,
}) => {
  await starteImBrowser(page);
  // Kapitel 0 bis 5 gelesen, in Kapitel 6 begonnen: Übungen des zuletzt fertigen Kapitels 5.
  const gesehen = gesehenFuer([0, 1, 2, 3, 4, 5], abbildungenVon(6).slice(0, 3));
  await setzeDaten(page, { fortschritt: { ...LEER, gesehen } });
  await expect(kachel(page, "uebungen")).toContainText("Kapitel 5");
  // Eigenes Ziel Kapitel 3: dessen Übungen, auch ungelesen.
  await setzeDaten(page, {
    fortschritt: { ...LEER, gesehen: gesehenFuer([0, 1]) },
    ziele: { angeheftet: [{ art: "kapitel", kapitel: 3 }] },
  });
  await expect(kachel(page, "uebungen")).toContainText("Kapitel 3");
  // 200 fällige Karten: eine Portion von 20 statt der ganzen Dauer.
  const faellig = { kasten: 1, faellig: GESTERN, verlauf: [] };
  const karten = Object.fromEntries(
    Array.from({ length: 200 }, (_, i) => [`taktik:t-${i}`, faellig]),
  );
  await setzeDaten(page, { ziele: { angeheftet: [] }, karten });
  const gross = karte(page).getByTestId("heute-vorschlag");
  await expect(gross).toContainText("200 fällig · 20 in etwa 14 Min");
  await expect(gross).toHaveAttribute("aria-label", /Fang mit 20 an, das dauert etwa 14 Minuten/);
});

test("Alles erledigt: Kurzplan und zuletzt Partie; Startweg „Spielen“ zieht Partie vor (N2443, N2590, N2591)", async ({
  page,
}) => {
  await starteImBrowser(page);
  await allesErledigt(page);
  await expect(kachel(page, "kurzplan")).toContainText("Kurzplan");
  await expect(karte(page).locator("[data-testid^='heute-alternative-']").last()).toHaveAttribute(
    "data-testid",
    "heute-alternative-partie",
  );
  await kachel(page, "kurzplan").click();
  await expect(page.getByTestId("kurzplan-kurz")).toBeVisible();
  // Startweg „Spielen“ (Einstellungen › Bedienung): Partie zuerst.
  await page.evaluate(() => window.localStorage.setItem("svga.startweg", "spielen"));
  await page.goto("/app/");
  await expect(karte(page).getByTestId("heute-vorschlag")).toContainText("Partie");
});

test("Zielvorschläge bei Wertung 900: Bots bis Stufe 5 und Kapitelziele, keine Engine-Bots (N2592)", async ({
  page,
}) => {
  await starteImBrowser(page);
  const punkte = Array.from({ length: 10 }, (_, i) => ({
    partieId: `w${i}`,
    zeit: `2026-11-0${(i % 9) + 1}T10:00:00.000Z`,
    gegner: 900,
    ergebnis: 0.5,
    wertung: 900,
    phasen: { eroeffnung: null, mittelspiel: null, endspiel: null },
    tempo: "rapid",
  }));
  const spiel = (await liesDaten(page)).spiel as object;
  await setzeDaten(page, {
    spiel: { ...spiel, wertung: punkte },
    wochen: { ziel: 3 },
    aktivitaet: { "2026-11-10": { abbildung: 1 } },
  });
  await oeffneReiter(page, "ziele");
  const ziele = page.getByTestId("ziele");
  await expect(ziele.getByTestId("ziel-vorschlag").first()).toBeVisible();
  await expect(ziele).toContainText("Stufe 4–5");
  await expect(ziele).toContainText("Teil Grundlagen");
  await expect(ziele).not.toContainText(/Stufe (6|7|8|9|10)/);
  await expect(ziele).not.toContainText("Engine");
});

test("Zehn gewertete Partien mit schwacher Eröffnung: Hinweis auf Heute, Verlauf im Profil (N2598, N2310)", async ({
  page,
}) => {
  await starteImBrowser(page);
  const partien = PARTIEN.map(gewertetePartie);
  await spielePartienEin(page, [...partien].reverse());
  await allesErledigt(page);
  const phase = kachel(page, "phase");
  await expect(phase).toContainText("Aus deinen Partien");
  await expect(phase).toHaveAttribute(
    "aria-label",
    /letzten 10 Partien: In der Eröffnung spielst du etwa/,
  );
  await expect(phase).toHaveAttribute("aria-label", /Kapitel 2 im Buch und der Repertoire-Trainer/);
  // Profil › Deine Wertung › Nach Phasen: ein Balken öffnet die Kurve der Phase mit Spanne.
  const wertung = partien.map((p, i) => ({
    partieId: p.partie.id,
    zeit: p.partie.begonnen,
    gegner: 1200,
    ergebnis: 0,
    wertung: 1300 - i * 10,
    phasen: { eroeffnung: null, mittelspiel: null, endspiel: null },
    tempo: "rapid",
  }));
  await setzeDaten(page, { spiel: { ...((await liesDaten(page)).spiel as object), wertung } });
  await oeffneProfil(page);
  const profilkarte = page.locator("section").filter({ hasText: "Nach Phasen" }).first();
  const balken = profilkarte.getByRole("button", { name: /^Eröffnung/ });
  await balken.click();
  await expect(profilkarte).toContainText(/Spanne \d+–\d+/);
  await balken.click();
  await expect(profilkarte).not.toContainText(/Spanne \d+–\d+/);
});
