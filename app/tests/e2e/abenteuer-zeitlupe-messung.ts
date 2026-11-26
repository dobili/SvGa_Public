/**
 * Bausteine für die Zeitlupe nach dem Kartenwechsel (Befund des Autors, iPhone, 26.11.2026:
 * „Immer wenn ich eine Karte neu lade, läuft das Spiel zunächst für etwa 2 bis 3 Sekunden wie in
 * Zeitlupe.“): Aufzeichnung im Browser und Auswertung der gelaufenen Felder je Sekunde.
 *
 * Warum eigene Datei: Messlauf und Dauertest (abenteuer-zeitlupe.spec.ts) messen gleich.
 * Wie: Ein Skript vor dem Laden der Seite merkt sich jedes Bild (requestAnimationFrame), jede neue
 * Leinwand und jede Änderung der Kachelanzeige (Testkennung abenteuer-kachel) mit Zeitpunkt. Wie
 * weit der Held nach der Ankunft frei laufen kann, kommt aus dem Kartenwissen des
 * Spieler-Durchlaufs (Sperren, Übergänge, Laufwege der Statisten und Tiere).
 * Abhängigkeiten: tests/durchlauf/welt.ts, tests/durchlauf/lage.ts.
 */
import type { Page } from "@playwright/test";
import { liesStand } from "../durchlauf/lage";
import { kartenwissen, ladeSpieldaten, type Spieldaten } from "../durchlauf/welt";

/** Was das Skript im Browser aufzeichnet (Zeiten in ms nach performance.now). */
export interface Aufzeichnung {
  readonly bilder: number[];
  readonly leinwaende: number[];
  readonly kacheln: { t: number; x: number; y: number }[];
}

/** Läuft vor jedem Laden der Seite: Bilder, Leinwände und Kachelwechsel mitschreiben. */
export function zeichneAuf(): void {
  const auf: Aufzeichnung = { bilder: [], leinwaende: [], kacheln: [] };
  (window as unknown as { __zeitlupe: Aufzeichnung }).__zeitlupe = auf;
  const bild = (t: number) => {
    auf.bilder.push(t);
    requestAnimationFrame(bild);
  };
  requestAnimationFrame(bild);
  let leinwand: Element | null = null;
  let kachel = "";
  new MutationObserver(() => {
    const neu = document.querySelector(".abenteuer-welt canvas");
    if (neu && neu !== leinwand) auf.leinwaende.push(performance.now());
    leinwand = neu;
    const text = document.querySelector("[data-testid='abenteuer-kachel']")?.textContent ?? "";
    if (text && text !== kachel) {
      const [x, y] = text.split(",").map(Number);
      auf.kacheln.push({ t: performance.now(), x: x ?? 0, y: y ?? 0 });
    }
    kachel = text;
  }).observe(document, { subtree: true, childList: true, characterData: true });
}

/** Richtung mit Tastenname und Versatz je Feld. */
interface Laufrichtung {
  readonly taste: string;
  readonly dx: number;
  readonly dy: number;
}
const RICHTUNGEN: readonly Laufrichtung[] = [
  { taste: "ArrowRight", dx: 1, dy: 0 },
  { taste: "ArrowLeft", dx: -1, dy: 0 },
  { taste: "ArrowDown", dx: 0, dy: 1 },
  { taste: "ArrowUp", dx: 0, dy: -1 },
];

let daten: Spieldaten | null = null;

/**
 * Wie viele Felder vom Feld (x, y) in Richtung der Taste frei sind (ohne Sperren, Übergänge und
 * Felder, auf denen Statisten oder Tiere laufen), auf der Karte des Spielstands.
 */
export async function freieStrecke(
  seite: Page,
  taste: string,
  feld: { x: number; y: number },
): Promise<number> {
  daten ??= ladeSpieldaten();
  const stand = await liesStand(seite);
  const wissen = kartenwissen(daten, stand.position.karte, stand);
  const r = RICHTUNGEN.find((e) => e.taste === taste) ?? RICHTUNGEN[0];
  if (!r) return 0;
  let n = 0;
  for (let x = feld.x + r.dx, y = feld.y + r.dy; ; x += r.dx, y += r.dy) {
    const schluessel = `${x},${y}`;
    if (!wissen.freiStreng(x, y) || wissen.uebergangsfelder.has(schluessel)) break;
    if (wissen.belebt.has(schluessel)) break;
    n += 1;
  }
  return n;
}

/** Die Aufzeichnung lesen und leeren (nur Kacheln und Leinwände; Bilder bleiben fortlaufend). */
export function liesAufzeichnung(seite: Page): Promise<Aufzeichnung> {
  return seite.evaluate(() => {
    const auf = (window as unknown as { __zeitlupe: Aufzeichnung }).__zeitlupe;
    const kopie = {
      bilder: auf.bilder.slice(),
      leinwaende: auf.leinwaende.slice(),
      kacheln: auf.kacheln.slice(),
    };
    auf.bilder.length = 0;
    auf.kacheln.length = 0;
    auf.leinwaende.length = 0;
    return kopie;
  });
}

/** Kennzahlen eines Laufs nach dem Kartenwechsel. */
export interface Lauf {
  /** So lange nach der neuen Leinwand meldete die Szene das erste Feld (sie steht). */
  readonly szeneMs: number;
  /** Bilder über 100 ms als „Zeitpunkt ab Leinwand:Dauer“ in ms, bis zum Ende des Laufs. */
  readonly langeBilder: readonly string[];
  /** Tempo über die ersten Felder gegen das Solltempo des Helden (1 = volle Geschwindigkeit). */
  readonly anteil: number;
  /** Felder je Sekunde in den Zeitfenstern ab der neuen Leinwand (0–1 s, 1–2 s, 2–3 s, 3–5 s). */
  readonly feldJeSekunde: readonly number[];
  /** Bilder in den ersten 3 s nach der neuen Leinwand: Zahl, über 33 ms, über 50 ms, längstes. */
  readonly bilder: { zahl: number; ueber33: number; ueber50: number; laengstes: number };
}

/** Solltempo des Helden zu Fuß: 56 Pixel je Sekunde (szene.ts, TEMPO) bei 16 Pixeln je Feld. */
export const SOLL_FELDER_JE_S = 56 / 16;
/** Über so viele Felder zählt das Anfangstempo (etwa die ersten 2 s). */
const ANFANGSFELDER = 7;
/** Grenzen der Zeitfenster in ms ab der neuen Leinwand. */
export const FENSTER_MS: readonly number[] = [0, 1000, 2000, 3000, 5000];
const ANFANG_MS = 3000;
const LANG_MS = 33;
const SEHR_LANG_MS = 50;
const AUSREISSER_MS = 100;
const MS_JE_S = 1000;

/**
 * Wertet eine Aufzeichnung aus, `los` ist die neue Leinwand: Tempo über die ersten Felder
 * (höchstens `felder`, so weit der Weg frei ist), Felder je Sekunde je Fenster, die Bildzeiten der
 * ersten 3 s und die Bilder über 100 ms. Das Anfangstempo zählt vom ersten bis zum letzten
 * Feldwechsel nach dem Ankunftsfeld, also ohne die Zeit bis zum ersten Schritt.
 */
export function werteAus(auf: Aufzeichnung, los: number, felder: number): Lauf {
  const schritte = auf.kacheln.filter((k) => k.t >= los);
  const feldJeSekunde = FENSTER_MS.slice(1).map((bis, i) => {
    const von = FENSTER_MS[i] ?? 0;
    const zahl = schritte.filter((k) => k.t - los >= von && k.t - los < bis).length;
    return Math.round((zahl * 10000) / (bis - von)) / 10;
  });
  // Die erste Meldung ist das Ankunftsfeld (die Szene steht), erst danach geht der Held.
  const anfang = schritte.slice(1, 1 + Math.min(ANFANGSFELDER, felder));
  const dauer = (anfang.at(-1)?.t ?? 0) - (anfang[0]?.t ?? 0);
  const tempo = dauer > 0 ? ((anfang.length - 1) * MS_JE_S) / dauer : 0;
  const start = auf.leinwaende.at(-1) ?? los;
  const zeiten = auf.bilder.filter((t) => t >= start && t < start + ANFANG_MS);
  const abstaende = zeiten.slice(1).map((t, i) => t - (zeiten[i] ?? t));
  const langeBilder = auf.bilder
    .map((t, i) => ({ t: t - start, dauer: t - (auf.bilder[i - 1] ?? t) }))
    .filter((b) => b.t >= 0 && b.dauer > AUSREISSER_MS)
    .map((b) => `${Math.round(b.t)}:${Math.round(b.dauer)}`);
  return {
    szeneMs: Math.round((schritte[0]?.t ?? los) - start),
    langeBilder,
    anteil: Math.round((tempo / SOLL_FELDER_JE_S) * 100) / 100,
    feldJeSekunde,
    bilder: {
      zahl: zeiten.length,
      ueber33: abstaende.filter((d) => d > LANG_MS).length,
      ueber50: abstaende.filter((d) => d > SEHR_LANG_MS).length,
      laengstes: Math.round(Math.max(0, ...abstaende)),
    },
  };
}
