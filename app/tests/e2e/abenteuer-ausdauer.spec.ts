/**
 * Schach-Abenteuer, Ausdauer über eine lange Sitzung (Nachtauftrag 19.11.2026): Das Spiel dauert
 * 13 bis 18 Stunden, der Autor spielt am Handy oft lange am Stück, ohne die App neu zu laden.
 * Läuft nur mit ABENTEUER_AUSDAUER=1 (rund 15 Minuten), nicht in CI.
 *
 * Ablauf ohne Neuladen: eine lange Aufgabenrunde (Vorgabe 25 Aufgaben, so viel wie fünf Runden,
 * jede mit der Testhilfe „Bestehen“ gelöst), dann Kartenwechsel über „Reisen“ zwischen sieben
 * Städten (Vorgabe 200). Vorher spricht der Held im Park von Maple Falls 30-mal den Kiosk an
 * (Dialoge); nach jeder Ankunft spricht er an, was vor ihm steht, und
 * alle 20 Wechsel spielt er eine Übungspartie an (Königsbauer, dann aufgeben; Vorgabe 10). Gemessen
 * wird mit den Messfühlern (abenteuer-ausdauer-messfuehler.ts) nach dem Einspielen und dann alle
 * 20 Wechsel.
 *
 * Rot wird die Prüfung, wenn vom Einspielen bis zum Ende deutlich etwas wächst (Grenzen unten):
 * Heap, DOM-Knoten, Listener, lebende WebGL-Kontexte und Texturen, Worker, AudioContexte; dazu
 * darf der dekodierte Ton (Ton an wie beim Autor) das Budget des Tonspielers nicht sprengen. Die
 * Bildrate steht nur im Bericht (kopflos nicht verlässlich).
 * Aufruf (gegen `npm run build`):
 *   ABENTEUER_AUSDAUER=1 CHROMIUM_PFAD=… PLAYWRIGHT_NUR_CHROMIUM=1 npx playwright test
 *   abenteuer-ausdauer --trace off
 * Weitere Angaben: AUSDAUER_KARTEN, AUSDAUER_PARTIEN, AUSDAUER_AUFGABEN; AUSDAUER_ZIEL schreibt
 * die Messreihe als JSON. Bericht: docs/spiel/auftraege/ausdauer_19-11.md.
 */
import { writeFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import { EINLEITUNG_GESEHEN, GRUNDSTAND, beobachte, starteMitStand } from "./abenteuer-affe";
import { feldDarunter } from "./abenteuer-karte";
import {
  miss,
  oeffneMessung,
  zaehlerSkript,
  zeile,
  type Messpunkt,
} from "./abenteuer-ausdauer-messfuehler";

const KARTEN = Number(process.env.AUSDAUER_KARTEN ?? "200");
const PARTIEN = Number(process.env.AUSDAUER_PARTIEN ?? "10");
const AUFGABEN = Number(process.env.AUSDAUER_AUFGABEN ?? "25");
const DIALOGE = Number(process.env.AUSDAUER_DIALOGE ?? "30");
/** Messen und eine Partie spielen je so viele Kartenwechsel. */
const TAKT = 20;
/** Kartenwechsel zum Einspielen (Zwischenspeicher, Schriften, erste Texturen), bevor die Basis gilt. */
const EINSPIELEN = 10;
const MINUTEN = 50;
const MS_JE_MINUTE = 60_000;
const ENGINE_FRIST = 30_000;
/** So viele Klicks darf das Aufräumen bis zur freien Welt brauchen (lange Runde: 25 × 3). */
const AUFRAEUMEN_HOECHSTENS = 200;

/** Grenzen des Wachstums von der Basis bis zum Ende. */
const GRENZE = {
  heapMB: 25,
  knotenAnteil: 0.25,
  knotenSockel: 400,
  listenerAnteil: 0.25,
  listenerSockel: 100,
  kontexte: 2,
  texturen: 200,
  worker: 2,
  audio: 1,
  tonMB: 200,
};

const STAEDTE = [
  "mapleFalls",
  "cedarCreek",
  "riverton",
  "ironwood",
  "siliconBay",
  "portDelacroix",
  "desertSprings",
];

/** Im Park von Maple Falls vor dem Kiosk (draußen: Reisen geht), mitten in einer langen Runde. */
const STAND = {
  ...GRUNDSTAND,
  position: {
    karte: "mapleFalls.park",
    ...feldDarunter("maple-falls-park", "kiosk"),
    richtung: "oben",
  },
  besuchteOrte: STAEDTE,
  muenzen: 500,
  laufendeAufgaben: {
    kennung: "summitCity.reiheKit#ausdauer",
    runde: "summitCity.reiheKit",
    steller: "figur.kit.name",
    kapitel: 0,
    buchuebungen: [],
    themen: ["umwandlung", "endspiel", "taktik"],
    anzahl: AUFGABEN,
    schwierigkeit: 1,
    versuch: 1,
    zaehltFuerApp: true,
  },
  dialogvariablen: EINLEITUNG_GESEHEN,
};

/** Schaltet den Ton der App in den Einstellungen an; läuft im Browser. */
function schalteTonAn(): Promise<boolean> {
  return new Promise<boolean>((fertig, fehler) => {
    const anfrage = indexedDB.open("schach-von-grund-auf");
    anfrage.onerror = () => fehler(anfrage.error);
    anfrage.onsuccess = () => {
      const db = anfrage.result;
      const bereich = db.transaction("nutzerdaten", "readwrite").objectStore("nutzerdaten");
      const lesen = bereich.get("aktuell");
      lesen.onsuccess = () => {
        const alt = lesen.result as Record<string, unknown> | undefined;
        if (!alt) {
          db.close();
          fertig(false);
          return;
        }
        const einstellungen = { ...(alt.einstellungen as object), ton: "an" };
        const schreiben = bereich.put({ ...alt, einstellungen }, "aktuell");
        schreiben.onsuccess = () => {
          db.close();
          fertig(true);
        };
        schreiben.onerror = () => fehler(schreiben.error);
      };
    };
  });
}

/** Klickt sichtbare Knöpfe weg, bis die Welt frei ist; Ausgabe: 1, wenn dabei ein Dialog lief. */
async function raeumeAuf(seite: Page): Promise<number> {
  let dialoge = 0;
  for (let i = 0; i < AUFRAEUMEN_HOECHSTENS; i++) {
    if (await weltFrei(seite)) return dialoge;
    // Ein Gespräch zählt einmal, auch wenn es zwischen den Zeilen kurz zugeht.
    if (
      await seite
        .getByTestId("abenteuer-dialog")
        .isVisible()
        .catch(() => false)
    )
      dialoge = 1;
    const kandidaten = [
      seite.getByRole("button", { name: "Bestehen" }),
      seite.locator(".abenteuer-dialog-wahlen button").first(),
      seite.locator(".abenteuer-dialog-weiter"),
      seite.getByRole("button", { name: /^(Weiter|Auswerten|Nächste Aufgabe|Zurück in die Welt)/ }),
      seite.getByTestId("abenteuer-meldung").getByRole("button"),
      // Laden, Reisen und andere Fenster: schließen wie ein Spieler.
      seite.getByRole("button", { name: /^(Schließen|Zurück|Weiterspielen|Fertig)$/ }),
    ];
    let gedrueckt = false;
    for (const k of kandidaten) {
      const letzter = k.last();
      if (!(await letzter.isVisible().catch(() => false))) continue;
      gedrueckt = await letzter.click({ timeout: 1500 }).then(
        () => true,
        () => false,
      );
      if (gedrueckt) break;
    }
    await seite.waitForTimeout(gedrueckt ? 120 : 150);
  }
  return dialoge;
}

/** Die Welt ist frei: Steuerkreuz da, kein Fenster, keine Meldung darüber. */
async function weltFrei(seite: Page): Promise<boolean> {
  return seite.evaluate(
    () =>
      document.querySelector(".abenteuer-steuerkreuz button") !== null &&
      document.querySelector(
        "[data-testid='abenteuer-dialog'], .abenteuer-menue, [data-testid='abenteuer-meldung'], .abenteuer-ergebnis, [data-testid='abenteuer-aufgaben'], [data-testid='partie']",
      ) === null,
  );
}

/** Reist in die nächste Stadt der Liste; Ausgabe: ob die Karte wechselte. */
async function reise(seite: Page, nummer: number): Promise<boolean> {
  const knopf = seite.getByTestId("abenteuer-reisenknopf");
  if (!(await knopf.isVisible().catch(() => false))) return false;
  await knopf.click();
  const ziele = seite.getByTestId("abenteuer-reisen").locator(".abenteuer-karte");
  await expect(ziele.first()).toBeVisible();
  const anzahl = await ziele.count();
  await ziele.nth(nummer % anzahl).click();
  await expect(seite.getByTestId("abenteuer-reisen")).toHaveCount(0);
  await expect(seite.locator(".abenteuer-welt canvas")).toHaveCount(1, { timeout: 20000 });
  await seite.waitForTimeout(400);
  return true;
}

/** Spricht an, was vor dem Helden steht, falls etwas da ist; Ausgabe: Zahl der Dialoge. */
async function sprichAn(seite: Page): Promise<number> {
  const aktion = seite.getByTestId("abenteuer-aktion");
  if (!(await aktion.isVisible().catch(() => false))) return 0;
  await aktion.click().catch(() => undefined);
  await seite.waitForTimeout(300);
  return raeumeAuf(seite);
}

/** Übungspartie: Königsbauer ziehen, auf die Antwort warten, aufgeben, zurück in die Welt. */
async function spielePartie(seite: Page): Promise<boolean> {
  const brett = seite.getByTestId("abenteuer-reisebrettknopf");
  if (!(await brett.isVisible().catch(() => false))) return false;
  await brett.click();
  await seite.getByTestId("abenteuer-deck-los").click();
  await expect(seite.getByTestId("partie")).toBeVisible({ timeout: 30000 });
  await expect(seite.getByTestId("partiestatus")).toHaveText("Du bist am Zug.", {
    timeout: ENGINE_FRIST,
  });
  const weiss = await seite.getByRole("button", { name: /^e2, Bauer \(Weiß\)/ }).isVisible();
  const von = weiss ? "e2" : "e7";
  await seite.getByRole("button", { name: new RegExp(`^${von}, Bauer`) }).click();
  await seite.getByRole("button", { name: weiss ? "e4" : "e5", exact: true }).click();
  await expect(seite.getByTestId("partiestatus")).toHaveText("Du bist am Zug.", {
    timeout: ENGINE_FRIST,
  });
  await seite.getByTestId("abenteuer-partie-aufgeben").click();
  await seite.getByRole("button", { name: "Ja, aufgeben" }).click();
  await seite.getByTestId("partie-zurueck-zur-stadt").click();
  await raeumeAuf(seite);
  return true;
}

/** Wachstum von der Basis bis zum Ende, das eine Grenze überschreitet (leer: in Ordnung). */
function ueberschritten(basis: Messpunkt, ende: Messpunkt): string[] {
  const funde: string[] = [];
  const pruefe = (name: string, zuwachs: number, grenze: number) => {
    if (zuwachs > grenze)
      funde.push(`${name} +${Math.round(zuwachs * 10) / 10} (Grenze ${grenze})`);
  };
  pruefe("Heap MB", ende.heapMB - basis.heapMB, GRENZE.heapMB);
  pruefe(
    "Knoten",
    ende.knoten - basis.knoten,
    basis.knoten * GRENZE.knotenAnteil + GRENZE.knotenSockel,
  );
  pruefe(
    "Listener",
    ende.listener - basis.listener,
    basis.listener * GRENZE.listenerAnteil + GRENZE.listenerSockel,
  );
  pruefe("WebGL-Kontexte", ende.kontexte - basis.kontexte, GRENZE.kontexte);
  pruefe("Texturen", ende.texturen - basis.texturen, GRENZE.texturen);
  pruefe("Worker", ende.worker - basis.worker, GRENZE.worker);
  pruefe("AudioContexte", ende.audio - basis.audio, GRENZE.audio);
  // Dekodierter Ton als Bestand, nicht als Zuwachs: das Budget des Tonspielers (160 MB) und Luft.
  pruefe("Ton MB", ende.tonMB, GRENZE.tonMB);
  return funde;
}

test("Ausdauer: lange Sitzung ohne Neuladen wächst nicht", async ({ page, browserName }) => {
  test.skip(!process.env.ABENTEUER_AUSDAUER, "nur mit ABENTEUER_AUSDAUER=1");
  test.skip(browserName !== "chromium", "Messung über CDP gibt es nur in Chromium");
  test.setTimeout(MINUTEN * MS_JE_MINUTE);
  const funde = beobachte(page);
  await page.addInitScript(zaehlerSkript);
  const cdp = await oeffneMessung(page);
  const reihe: Messpunkt[] = [];
  const merke = async (schritt: string, wechsel: number) => {
    const p = await miss(page, cdp, schritt, wechsel);
    reihe.push(p);
    console.log(`Ausdauer: ${zeile(p)}`);
  };

  await starteMitStand(page, STAND);
  // Ton an (wie beim Autor), sonst lädt keine Musik; eine Berührung entsperrt ihn wie am Handy.
  await expect.poll(() => page.evaluate(schalteTonAn)).toBe(true);
  await page.reload();
  await page.goto("/app/#abenteuer");
  await expect(page.locator(".abenteuer-welt canvas")).toBeVisible({ timeout: 40000 });
  await page
    .getByTestId("abenteuer-welt")
    .click({ position: { x: 5, y: 5 } })
    .catch(() => undefined);
  await merke("Start", 0);
  await page
    .getByRole("button", { name: "Weitermachen" })
    .click({ timeout: 10000 })
    .catch(() => undefined);
  let dialoge = await raeumeAuf(page);
  await merke(`Runde (${AUFGABEN} Aufgaben)`, 0);
  // Dialoge: den Kiosk immer wieder ansprechen (jedes Mal ein neuer Dialog mit Ink).
  for (let i = 0; i < DIALOGE; i++) dialoge += await sprichAn(page);
  await merke(`Dialoge (${dialoge})`, 0);

  let wechsel = 0;
  let partien = 0;
  let basis: Messpunkt | null = null;
  for (let i = 0; wechsel < KARTEN && i < KARTEN * 2; i++) {
    if (await reise(page, i)) wechsel += 1;
    else await raeumeAuf(page);
    dialoge += await raeumeAuf(page);
    dialoge += await sprichAn(page);
    if (wechsel === EINSPIELEN && !basis) {
      await merke("Basis", wechsel);
      basis = reihe[reihe.length - 1] ?? null;
    }
    if (wechsel > 0 && wechsel % TAKT === 0) {
      if (partien < PARTIEN && (await spielePartie(page))) partien += 1;
      await merke(`Kartenwechsel ${wechsel}`, wechsel);
    }
  }
  await merke("Ende", wechsel);
  console.log(`Ausdauer: ${wechsel} Kartenwechsel, ${dialoge} Dialoge, ${partien} Partien`);
  const ziel = process.env.AUSDAUER_ZIEL;
  if (ziel) writeFileSync(ziel, JSON.stringify({ wechsel, dialoge, partien, reihe }, null, 2));

  const ende = reihe[reihe.length - 1];
  expect(basis, "Basis gemessen").not.toBeNull();
  if (basis && ende) expect(ueberschritten(basis, ende)).toEqual([]);
  expect(funde).toEqual([]);
});
