/**
 * Schach-Abenteuer, Ausdauer über eine lange Sitzung (Nachtauftrag 19.11.2026): Das Spiel dauert
 * 13 bis 18 Stunden, der Autor spielt am Handy oft lange am Stück, ohne die App neu zu laden.
 * Läuft nur mit ABENTEUER_AUSDAUER=1 (rund 15 Minuten), nicht in CI.
 *
 * Ablauf ohne Neuladen: eine lange Aufgabenrunde (Vorgabe 25 Aufgaben, so viel wie fünf Runden,
 * jede mit der Testhilfe „Bestehen“ gelöst), dann Kartenwechsel über „Reisen“ zwischen sieben
 * Städten (Vorgabe 200). Vorher spricht der Held im Park von Maple Falls 30-mal den Kiosk an
 * (Dialoge); nach jeder Ankunft spricht er an, was vor ihm steht, und
 * alle 20 Wechsel spielt er eine Übungspartie an (drei Randbauernzüge außerhalb des Eröffnungsbuchs, dann aufgeben; Vorgabe 10). Gemessen
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
import { expect, test } from "@playwright/test";
import { EINLEITUNG_GESEHEN, GRUNDSTAND, beobachte } from "./abenteuer-affe";
import {
  raeumeAuf,
  reise,
  spielePartie,
  sprichAn,
  starteMitTon,
} from "./abenteuer-ausdauer-ablauf";
import { feldDarunter } from "./abenteuer-karte";
import {
  fundeMitBild,
  hauslauf,
  hausschritt,
  siehFensterbankAn,
  type Hausweg,
} from "./abenteuer-ausdauer-haus";
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
const TUEREN = Number(process.env.AUSDAUER_TUEREN ?? "120");
/** Im Haus: messen je so viele Durchgänge, Basis nach dem ersten Takt. */
const HAUSTAKT = 24;
/** Messen und eine Partie spielen je so viele Kartenwechsel. */
const TAKT = 20;
/** Kartenwechsel zum Einspielen (Zwischenspeicher, Schriften, erste Texturen), bevor die Basis gilt. */
const EINSPIELEN = 10;
const MINUTEN = 50;
const MS_JE_MINUTE = 60_000;

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

  await starteMitTon(page, STAND);
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

/** Zählt im Browser die Bilder, die als Großansicht (#bild) oder als Fundbild erschienen. */
function zaehleGrossbilder(): void {
  const gesehen = new Set<string>();
  (window as unknown as { __grossbilder: Set<string> }).__grossbilder = gesehen;
  new MutationObserver(() => {
    const bilder = ".abenteuer-grossansicht img, [data-testid='abenteuer-fundbild']";
    for (const bild of document.querySelectorAll(bilder)) {
      gesehen.add(bild.getAttribute("src") ?? "");
    }
  }).observe(document, { subtree: true, childList: true, attributes: true });
}

/**
 * Innenräume: Einleitung vor dem Haus und Ankunft im Wohnzimmer (Dialoge mit Großansicht #bild),
 * dann immer wieder Haustür, Treppe ins Zimmer (dort die Fensterbank mit 30 Fundbildern ansehen),
 * Treppe zum Dachboden und zurück (Vorgabe 120
 * Durchgänge, AUSDAUER_TUEREN). Gleiche Grenzen wie oben, Basis nach 24 Durchgängen.
 */
test("Ausdauer: Türen und Treppen im Haus wachsen nicht", async ({ page, browserName }) => {
  test.skip(!process.env.ABENTEUER_AUSDAUER, "nur mit ABENTEUER_AUSDAUER=1");
  test.skip(browserName !== "chromium", "Messung über CDP gibt es nur in Chromium");
  test.setTimeout(MINUTEN * MS_JE_MINUTE);
  const funde = beobachte(page);
  await page.addInitScript(zaehlerSkript);
  await page.addInitScript(zaehleGrossbilder);
  const cdp = await oeffneMessung(page);
  const reihe: Messpunkt[] = [];
  const merke = async (schritt: string, wechsel: number) => {
    const p = await miss(page, cdp, schritt, wechsel);
    reihe.push(p);
    console.log(`Ausdauer Haus: ${zeile(p)}`);
  };
  // Vor dem Haus, Einleitung noch nicht gesehen: Sie läuft sofort, die Ankunft beim Eintreten.
  await starteMitTon(page, {
    ...GRUNDSTAND,
    position: { karte: "mapleFalls.aussen", x: 3, y: 24, richtung: "unten" },
    dialogvariablen: {},
    // Funde mit Bild: Die Fensterbank im Zimmer zeigt sie bei jedem Besuch (T15).
    funde: fundeMitBild(30),
  });
  await merke("Start", 0);
  let dialoge = await raeumeAuf(page);
  const lauf = hauslauf(page, cdp);
  const weg: Hausweg = { glied: 0 };
  let wechsel = 0;
  let basis: Messpunkt | null = null;
  let fensterbank = 0;
  for (let i = 0; wechsel < TUEREN && i < TUEREN * 2; i++) {
    if (await siehFensterbankAn(lauf)) {
      fensterbank += 1;
      dialoge += await raeumeAuf(page);
    }
    if (await hausschritt(lauf, weg)) wechsel += 1;
    dialoge += await raeumeAuf(page);
    if (wechsel > 0 && wechsel % HAUSTAKT === 0 && reihe.at(-1)?.kartenwechsel !== wechsel) {
      await merke(`Durchgänge ${wechsel}`, wechsel);
      basis ??= reihe.at(-1) ?? null;
    }
  }
  await merke("Ende", wechsel);
  const bilder = await page.evaluate(
    () => (window as unknown as { __grossbilder: Set<string> }).__grossbilder.size,
  );
  console.log(
    `Ausdauer Haus: ${wechsel} Durchgänge, ${dialoge} Dialoge, ${fensterbank}× Fensterbank, ` +
      `${bilder} verschiedene Bilder`,
  );
  const ende = reihe.at(-1);
  expect(wechsel, "Durchgänge").toBeGreaterThanOrEqual(TUEREN);
  expect(basis, "Basis gemessen").not.toBeNull();
  if (basis && ende) expect(ueberschritten(basis, ende)).toEqual([]);
  expect(funde).toEqual([]);
});
