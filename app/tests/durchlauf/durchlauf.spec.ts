/**
 * Spieler-Durchlauf des Schach-Abenteuers (Wunsch des Autors, 18.11.2026): das Spiel von der
 * Startkarte an nur mit den Eingaben eines Spielers spielen (Steuerkreuz, Aktionsknopf,
 * Dialogknöpfe, Brett per Antippen) und dabei je Akt Laufzeit, Lesemenge, Partien und Ladezeiten
 * messen. Kein Spielstand wird gesetzt, keine Funktion der App aufgerufen, kein Testknopf gedrückt;
 * gelesen wird (Anzeige, Speicher der App, Karten aus inhalte/abenteuer), um zu entscheiden.
 *
 * Etappen: Der Browser behält sein Profil in DURCHLAUF_ORDNER; jeder Aufruf spielt DURCHLAUF_MINUTEN
 * weiter und sichert Messung, Funde und Protokoll (messung.ts). Der Zwischenstand ist also immer
 * ein erspielter Stand.
 * Zusatz (Erweiterung des Auftrags): Mit DURCHLAUF_STAND beginnt ein frisches Profil mit einem
 * Stand, den die Gesamtsimulation bis zum Beginn eines Akts erspielt hat (simstand.ts); Messungen
 * daraus heißen „ab simuliertem Aktbeginn“.
 * Läuft nur mit der eigenen Einstellung (playwright.durchlauf.config.ts), nie in CI.
 * Abhängigkeiten: welt.ts, lage.ts, eingabe.ts, laufen.ts, fenster.ts, partie.ts, aufgaben.ts,
 * planer.ts, weltschritt.ts, messung.ts.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { chromium, devices, test, type Page } from "@playwright/test";
import type { Abenteuerstand } from "../../src/abenteuer/schnittstelle/spielstand";
import { schreibeStandImBrowser } from "../e2e/abenteuer-affe";
import { beendeSpielerDesProzesses } from "../e2e/abenteuer-zugwahl";
import { spieleRunde } from "./aufgaben";
import { tabellen } from "./auswertung";
import { tippe, type Lauf } from "./eingabe";
import {
  bedieneFenster,
  bedieneUpdate,
  neuesFenstergedaechtnis,
  vergissWiederholungen,
} from "./fenster";
import { liesLage, liesSpeicher, signatur, type Lage } from "./lage";
import { Messung } from "./messung";
import { spielePartie } from "./partie";
import { Planer } from "./planer";
import { Randpruefung } from "./randpruefung";
import { Rueckmeldungsbeobachter } from "./rueckmeldung";
import { blaettereTagebuch, dreheUm, Eiliger } from "./eilig";
import { Schwaechling } from "./schwach";
import { standAus } from "./simstand";
import { ladeSpieldaten, type Spieldaten } from "./welt";
import { holeWachfunde, installiereWache } from "./wache";
import { weltschritt } from "./weltschritt";

const ORDNER = process.env.DURCHLAUF_ORDNER ?? "";
const FORMAT = process.env.DURCHLAUF_FORMAT === "quer" ? "quer" : "hoch";
const MS_JE_MINUTE = 60_000;
const DAUER_MS = Number(process.env.DURCHLAUF_MINUTEN ?? "30") * MS_JE_MINUTE;
const BIS_AKT = Number(process.env.DURCHLAUF_BIS_AKT ?? "0");
/** Der Lauf endet, sobald der Held diesen Ort betreten hat (etwa ghostTown nach Pinewood Camp). */
const BIS_ORT = process.env.DURCHLAUF_BIS_ORT ?? "";
/**
 * Der Lauf endet, sobald diese Quest erledigt ist (etwa mapleFalls.epilog); dann spielt er auch
 * nach dem Abspann weiter, bis zum Epilog.
 */
const BIS_QUEST = process.env.DURCHLAUF_BIS_QUEST ?? "";
const ADRESSE = `http://localhost:${process.env.PLAYWRIGHT_PORT ?? "4183"}`;
/** Stand der Simulation zu Beginn eines Akts (aktstand.cjs), sonst leer: Spiel von vorn. */
const STAND_DATEI = process.env.DURCHLAUF_STAND ?? "";
/** So lange wartet der Durchlauf auf die Nutzerdaten der App, um den Stand einzuspielen (ms). */
const STAND_FRIST_MS = 30_000;
/** So oft schreibt der Lauf ein Lebenszeichen, mit so vielen Knöpfen (ms). */
const PULS_MS = 60_000;
const PULS_KNOEPFE = 12;
/** Nach so vielen Lesungen ohne Antwort des Speichers lädt der Lauf die Seite neu. */
const OHNE_SPEICHER_NEULADEN = 3;
/** So lange wartet ein Griff nach einem Element und ein Seitenwechsel höchstens (ms). */
const GRIFF_FRIST_MS = 5000;
const SEITEN_FRIST_MS = 60_000;
/** Name des Helden im Durchlauf. */
const HELDNAME = "Kim";
/** So lange darf das Grundpaket laden (ms). */
const PAKET_FRIST_MS = 300_000;
/** So lange darf ein Bild ohne Welt, Partie oder Runde stehen, bevor neu angesteuert wird (ms). */
const FREMD_MS = 8000;

test.afterAll(() => beendeSpielerDesProzesses());

/** Startkarte: Name eintragen, Spiel herunterladen, „Spielen“. Zählt die Ladezeit des Pakets. */
async function bedieneStart(lauf: Lauf, lage: Lage): Promise<void> {
  const seite = lauf.seite;
  const name = seite.getByTestId("abenteuer-start").getByTestId("abenteuer-name");
  if ((await name.isVisible().catch(() => false)) && (await name.inputValue()) === "") {
    await name.fill(HELDNAME);
  }
  if (lage.kennungen.includes("abenteuer-spielen")) {
    await tippe(lauf, seite.getByTestId("abenteuer-spielen"), "Startkarte „Spielen“");
    await seite.waitForTimeout(500);
    return;
  }
  const laden = seite.getByTestId("abenteuer-start").getByTestId("abenteuer-laden");
  if (await laden.isVisible().catch(() => false)) {
    const beginn = Date.now();
    if (!(await tippe(lauf, laden, "Startkarte „Spiel herunterladen“"))) {
      await seite.waitForTimeout(300);
      return;
    }
    await seite
      .getByTestId("abenteuer-spielen")
      .or(seite.locator(".abenteuer-welt canvas"))
      .first()
      .waitFor({ state: "visible", timeout: PAKET_FRIST_MS })
      .catch(() => lauf.messung.fund("laden", "Spielpaket lädt nicht in 300 s"));
    lauf.messung.jetzt.ladeMs += Date.now() - beginn;
    lauf.messung.jetzt.ladevorgaenge += 1;
    lauf.messung.log(`Paket geladen in ${Date.now() - beginn} ms`);
    return;
  }
  await seite.waitForTimeout(300);
}

/** So lange darf ein einzelner Schritt des Durchlaufs dauern (eine lange Partie eingerechnet). */
const SCHRITT_FRIST_MS = 20 * MS_JE_MINUTE;

/** Lässt einen Schritt höchstens SCHRITT_FRIST_MS laufen; danach wirft sie (der Lauf hängt). */
async function mitFrist<T>(schritt: Promise<T>, name: string): Promise<T> {
  let wecker: NodeJS.Timeout | undefined;
  const frist = new Promise<never>((_, fehler) => {
    wecker = setTimeout(() => fehler(new Error(`Schritt „${name}“ hängt`)), SCHRITT_FRIST_MS);
  });
  try {
    return await Promise.race([schritt, frist]);
  } finally {
    clearTimeout(wecker);
  }
}

/**
 * Aktbeginn aus der Simulation (DURCHLAUF_STAND, simstand.ts): Hat das Profil noch keinen
 * Spielstand des Abenteuers, schreibt der Durchlauf den simulierten Stand in den Speicher der App,
 * bevor das Abenteuer zum ersten Mal öffnet. Das ist die einzige Stelle, an der der Durchlauf
 * schreibt; danach gelten nur noch Spielereingaben. Spätere Läufe desselben Profils spielen den
 * erspielten Stand weiter.
 */
async function spieleStandEin(seite: Page, daten: Spieldaten, messung: Messung): Promise<void> {
  await seite.goto("/app/");
  const frist = Date.now() + STAND_FRIST_MS;
  while (Date.now() < frist) {
    if ((await liesSpeicher(seite)).stand) return;
    const stand = standAus(daten, STAND_DATEI);
    if (await seite.evaluate(schreibeStandImBrowser, stand).catch(() => false)) {
      // Neu laden, bevor die App weiterschreibt: Sonst überschriebe sie den Stand mit dem, den
      // sie beim Start im Kopf hatte (ohne Abenteuer), und das Spiel begänne von vorn.
      await seite.reload();
      messung.log(
        `=== Simulierter Aktbeginn eingespielt: Akt ${stand.handlung.akt}, ${stand.position.karte} ===`,
      );
      return;
    }
    await seite.waitForTimeout(500);
  }
  throw new Error("Der simulierte Stand ließ sich nicht einspielen (Nutzerdaten fehlen)");
}

/** Hält das Bild fest (für Funde und zum Nachsehen). */
async function foto(seite: Page, ordner: string, name: string): Promise<void> {
  await seite.screenshot({ path: join(ordner, "bilder", `${name}.png`) }).catch(() => undefined);
}

/**
 * Die Hast des eiligen Spielers (eilig.ts) in der freien Welt: gleich wieder zurück durch den
 * Eingang (`zurueckNach`), oder Tagebuch auf und zu. Ausgabe: ob er etwas davon getan hat.
 */
async function eileWeiter(
  lauf: Lauf,
  daten: Spieldaten,
  stand: Abenteuerstand,
  zurueckNach: string,
): Promise<boolean> {
  if (!lauf.eilig.an) return false;
  if (zurueckNach && (await dreheUm(lauf, daten, stand, zurueckNach))) return true;
  if (!lauf.eilig.tagebuchJetzt()) return false;
  return blaettereTagebuch(lauf, lauf.messung.jetzt.kartenwechsel % 2 === 0);
}

test("Spieler-Durchlauf des Schach-Abenteuers", async () => {
  test.skip(ORDNER === "", "nur mit DURCHLAUF_ORDNER");
  const ordner = join(ORDNER, FORMAT);
  const messung = new Messung(ordner);
  mkdirSync(join(ordner, "bilder"), { recursive: true });
  const beschreibung = devices[FORMAT === "quer" ? "Pixel 7 landscape" : "Pixel 7"];
  const geraet = {
    viewport: beschreibung.viewport,
    userAgent: beschreibung.userAgent,
    deviceScaleFactor: beschreibung.deviceScaleFactor,
    isMobile: beschreibung.isMobile,
    hasTouch: beschreibung.hasTouch,
  };
  const pfad = process.env.CHROMIUM_PFAD;
  const kontext = await chromium.launchPersistentContext(join(ORDNER, `profil-${FORMAT}`), {
    ...geraet,
    baseURL: ADRESSE,
    serviceWorkers: "allow",
    ...(pfad ? { executablePath: pfad } : {}),
  });
  // Ohne Frist wartete jeder Griff nach einem Element endlos (etwa nach dem Steuerkreuz, während
  // ein Fenster offen ist): Der Lauf stand dann minutenlang still (18. und 19.11.2026).
  kontext.setDefaultTimeout(GRIFF_FRIST_MS);
  kontext.setDefaultNavigationTimeout(SEITEN_FRIST_MS);
  const seite = kontext.pages()[0] ?? (await kontext.newPage());
  await installiereWache(seite);
  seite.on("pageerror", (e) => messung.fund("ausnahme", e.message.slice(0, 300)));
  const lauf: Lauf = {
    seite,
    cdp: await kontext.newCDPSession(seite),
    messung,
    tasten: process.env.DURCHLAUF_EINGABE === "tasten",
    frist: Date.now() + DAUER_MS,
    gehalten: null,
    schwach: new Schwaechling(ordner),
    eilig: new Eiliger(),
  };
  const daten = ladeSpieldaten();
  const planer = new Planer(daten);
  const g = neuesFenstergedaechtnis();
  const rueck = new Rueckmeldungsbeobachter();
  if (STAND_DATEI) await spieleStandEin(seite, daten, messung);
  await seite.goto("/app/#abenteuer");
  messung.log(
    `=== Lauf ${messung.abbild.laeufe} beginnt (${FORMAT}, ${DAUER_MS / MS_JE_MINUTE} min) ===`,
  );
  const ende = lauf.frist;
  let fremdSeit = 0;
  let grund = "Zeit um";
  let takt = Date.now();
  let puls = Date.now();
  let ohneSpeicher = 0;
  let fotos = 0;
  /** Eiliger Spieler: die Karte, in die er gleich zurückläuft (leer: keine). */
  let umdrehenNach = "";
  const rand = new Randpruefung(ordner);
  while (Date.now() < ende) {
    const lage = await liesLage(seite);
    const jetzt = Date.now();
    messung.jetzt.echtMs += jetzt - takt;
    takt = jetzt;
    if (jetzt - puls > PULS_MS) {
      // Lebenszeichen: Was liegt auf dem Bildschirm? (Hilft, wenn der Lauf still steht.)
      puls = jetzt;
      const knoepfe = lage.knoepfe.map((k) => k.text.slice(0, 24)).slice(0, PULS_KNOEPFE);
      messung.log(`Puls: Bild ${lage.bild}, Kachel ${lage.kachel}, Knöpfe: ${knoepfe.join(" | ")}`);
      if (lage.bild !== "welt") await foto(seite, ordner, "puls");
    }
    await holeWachfunde(lauf);
    if (await bedieneUpdate(lauf, lage)) continue;
    await rand.pruefe(lauf, lage);
    if (lage.bild === "partie") {
      rueck.vorher((await liesSpeicher(seite)).stand?.nachErgebnis);
      const partie = await mitFrist(spielePartie(lauf, g), "Partie");
      const beendet = partie !== null && partie.ausgang !== "offen";
      rueck.nachher(`Partie ${partie?.kennung ?? "?"} (${partie?.ausgang ?? "?"})`, beendet);
    } else if (lage.bild === "aufgaben") {
      rueck.vorher((await liesSpeicher(seite)).stand?.nachErgebnis);
      rueck.nachher(
        `Runde auf ${messung.karte}`,
        await mitFrist(spieleRunde(lauf), "Aufgabenrunde"),
      );
    } else if (lage.bild === "start") {
      await bedieneStart(lauf, lage);
    } else if (lage.bild === "welt") {
      fremdSeit = 0;
      const stand = (await liesSpeicher(seite)).stand;
      if (!stand) {
        // Welt da, aber der Speicher antwortet nicht: melden und neu laden wie ein Mensch.
        ohneSpeicher += 1;
        if (ohneSpeicher === OHNE_SPEICHER_NEULADEN) {
          messung.fund("speicher", "Der Speicher der App antwortet nicht; Seite neu geladen");
          await seite.reload().catch(() => undefined);
          ohneSpeicher = 0;
        }
        await seite.waitForTimeout(500);
        continue;
      }
      ohneSpeicher = 0;
      if (stand) {
        g.signatur = signatur(stand);
        messung.akt = stand.handlung.akt;
        if (stand.position.karte !== messung.karte) {
          messung.jetzt.kartenwechsel += 1;
          if (lauf.eilig.drehtUm(stand.position.karte)) umdrehenNach = messung.karte;
          vergissWiederholungen(g);
        }
        messung.karte = stand.position.karte;
        if (BIS_AKT > 0 && stand.handlung.akt >= BIS_AKT) {
          grund = `Akt ${BIS_AKT} erreicht`;
          break;
        }
      }
      const fenster = await bedieneFenster(lauf, lage, g);
      rueck.welt(lauf, lage, !fenster);
      if (fenster) continue;
      // Erst wenn kein Fenster mehr offen ist: Die Quest gilt schon mit dem ersten Satz ihres
      // Dialogs als erledigt, der Dialog soll aber zu Ende gelesen werden.
      if (BIS_ORT && stand.besuchteOrte.includes(BIS_ORT)) {
        grund = `${BIS_ORT} erreicht`;
        break;
      }
      if (BIS_QUEST && stand.quests.some((q) => q.kennung === BIS_QUEST && q.erledigt)) {
        grund = `${BIS_QUEST} erledigt`;
        break;
      }
      if (messung.abspann && !BIS_QUEST) {
        grund = "Abspann erreicht";
        break;
      }
      if (await eileWeiter(lauf, daten, stand, umdrehenNach)) {
        umdrehenNach = "";
        continue;
      }
      await rand.besichtige(lauf, lage);
      if (!(await mitFrist(weltschritt(lauf, daten, planer), "Welt"))) {
        messung.fund("festgefahren", `Kein Ziel mehr: Stand ${JSON.stringify(stand?.handlung)}`);
        await foto(seite, ordner, `festgefahren-${Date.now()}`);
        grund = "kein Ziel mehr";
        break;
      }
      if (fotos++ % 40 === 0) await foto(seite, ordner, `stand-${String(fotos).padStart(5, "0")}`);
      messung.sichere();
    } else {
      // Übrige App, leere Seite, ladendes Abenteuer: kurz warten, dann das Abenteuer ansteuern.
      if (fremdSeit === 0) fremdSeit = jetzt;
      messung.jetzt.ladeMs += 200;
      await seite.waitForTimeout(200);
      if (jetzt - fremdSeit > FREMD_MS) {
        messung.log(`Bild „${lage.bild}“ seit ${FREMD_MS} ms, steuere das Abenteuer an`);
        await foto(seite, ordner, `fremd-${Date.now()}`);
        await seite.goto("/app/#abenteuer").catch(() => undefined);
        fremdSeit = 0;
      }
    }
  }
  messung.log(`=== Lauf endet: ${grund} ===`);
  await foto(seite, ordner, `ende-${Date.now()}`);
  messung.sichere();
  writeFileSync(join(ordner, "auswertung.md"), `${tabellen(messung.abbild.akte)}\n`);
  await kontext.close();
});
