/**
 * Werkzeuge für den Affentest des Schach-Abenteuers: Spielstand einspielen, zufällig (mit festem
 * Startwert) tippen, Tasten drücken, zurückgehen, neu laden, das Fenster verkleinern, und dabei
 * beobachten, ob etwas kaputtgeht.
 *
 * Warum: Wunsch des Autors (14.11.2026): Nichts darf so kaputtgehen, dass man das Spiel nicht mehr
 * beenden kann, auch wenn Spieler hektisch, falsch oder zufällig bedienen. Der Affe findet
 * Ausnahmen (`pageerror`), Fehler in der Konsole, leere Seiten und Zustände ohne Ausweg; am Ende
 * muss `findeAusweg` jedes Mal in die begehbare Welt zurückfinden.
 * Abhängigkeiten: tests/e2e/hilfen.ts (Start der App), Testkennungen der Oberwelt und der Hülle.
 */
import { expect, type Page } from "@playwright/test";
import { starteImBrowser } from "./hilfen";
import { ladeAbenteuerpaket } from "./abenteuer-paket";
import { lagebild, offeneFenster, tippbarerText } from "./abenteuer-lage";

/** So viele Zeilen des Stapels nennt ein Fund im Protokoll. */
const STAPELZEILEN = 6;

/** Zufallszahlen mit festem Startwert (mulberry32), damit ein Fund sich wiederholen lässt. */
export function zufallMit(startwert: number): () => number {
  let a = startwert >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let z = a;
    z = Math.imul(z ^ (z >>> 15), z | 1);
    z ^= z + Math.imul(z ^ (z >>> 7), z | 61);
    return ((z ^ (z >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Einleitung und Ankunft (seit 19.11.2026) gelten als gesehen: Sonst beginnt die Einleitung vor
 * dem Haus, sobald der Held nach Maple Falls kommt, und im Wohnzimmer die Ankunft (orte.json,
 * Feld „eingang“). In jeden eingespielten Spielstand, auch wenn er eigene Variablen setzt.
 */
export const EINLEITUNG_GESEHEN = { einleitungGesehen: true, ankunftGesehen: true };

/** Ein Spielstand im Park von Maple Falls; die Szenarien ändern Position und Besitz. */
export const GRUNDSTAND = {
  version: 1,
  begonnen: "2026-11-08T05:00:00.000Z",
  eingangswertung: 600,
  eingangPartien: 0,
  wertung: 600,
  appWertungZuletzt: null,
  wertungPartien: 0,
  held: { name: "Kim", variante: 0 },
  handlung: { akt: 1, szene: "akt1.start", liga: null, durchlauf: 1 },
  position: { karte: "mapleFalls.park", x: 25, y: 14, richtung: "oben" },
  besuchteOrte: ["mapleFalls", "cedarCreek"],
  gegenstaende: ["reisebrett", "monatskarte", "lupe"],
  muenzen: 80,
  dialogvariablen: EINLEITUNG_GESEHEN,
};

/** Schreibt einen Spielstand in die Nutzerdaten (IndexedDB der App); läuft im Browser. */
export function schreibeStandImBrowser(stand: object): Promise<boolean> {
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

/** Liest den gespeicherten Spielstand und die Partien der App; läuft im Browser. */
export function liesSpeicherImBrowser(): Promise<{
  abenteuer: Record<string, unknown> | null;
  partien: { id: string; kennung: string | null; ende: boolean }[];
}> {
  return new Promise((fertig, fehler) => {
    const anfrage = indexedDB.open("schach-von-grund-auf");
    anfrage.onerror = () => fehler(anfrage.error);
    anfrage.onsuccess = () => {
      const db = anfrage.result;
      const lesen = db.transaction("nutzerdaten", "readonly").objectStore("nutzerdaten");
      const r = lesen.get("aktuell");
      r.onsuccess = () => {
        type P = { id: string; ende: unknown; einstellung: { abenteuer?: { kennung: string } } };
        const d = r.result as
          | {
              abenteuer?: Record<string, unknown>;
              spiel?: { laufend?: P; partien?: { partie: P }[] };
            }
          | undefined;
        const liste = [
          ...(d?.spiel?.laufend ? [d.spiel.laufend] : []),
          ...(d?.spiel?.partien ?? []).map((e) => e.partie),
        ];
        db.close();
        fertig({
          abenteuer: d?.abenteuer ?? null,
          partien: liste.map((p) => ({
            id: p.id,
            kennung: p.einstellung.abenteuer?.kennung ?? null,
            ende: Boolean(p.ende),
          })),
        });
      };
    };
  });
}

/** Sammelt Ausnahmen und Konsolenfehler der Seite (auch über Neuladen hinweg). */
export function beobachte(seite: Page): string[] {
  const funde: string[] = [];
  // Mit den ersten Stapelzeilen, damit ein Fund im CI-Protokoll seine Stelle nennt (WebKit
  // „Context is stopped“, Lauf 44750802847, stand ohne Stelle da).
  seite.on("pageerror", (e) => {
    const stelle = (e.stack ?? "").split("\n").slice(0, STAPELZEILEN).join(" | ");
    funde.push(`Ausnahme: ${e.message}`);
    // WebKit liefert für Ablehnungen des Browsers oft keinen Stapel; dann wenigstens der Name.
    console.log(`Ausnahme im Browser: ${e.name}: ${e.message} @ ${stelle || "ohne Stapel"}`);
  });
  seite.on("console", (m) => {
    if (m.type() !== "error") return;
    const text = m.text();
    // Fehlende Tondateien und abgebrochene Abrufe beim Neuladen sind kein Fehler des Spiels.
    if (/Failed to load resource|net::ERR_ABORTED/.test(text)) return;
    funde.push(`Konsole: ${text}`);
  });
  return funde;
}

/**
 * App starten, Spielstand einspielen, Abenteuerpaket laden und in die Welt gehen.
 * Mit `weitermachen` stellt die App nach dem Neuladen den letzten Bildschirm wieder her, wie
 * bei echten Lesern (svga.stapel).
 */
export async function starteMitStand(seite: Page, stand: object): Promise<void> {
  await starteImBrowser(seite, { weitermachen: true });
  await expect.poll(() => seite.evaluate(schreibeStandImBrowser, stand)).toBe(true);
  await seite.reload();
  await seite.goto("/app/#abenteuer");
  const laden = seite.getByTestId("abenteuer-start").getByTestId("abenteuer-laden");
  const welt = seite.locator(".abenteuer-welt canvas");
  await expect(laden.or(welt)).toBeVisible({ timeout: 20000 });
  if (await laden.isVisible()) await ladeAbenteuerpaket(seite, laden);
  await expect(welt).toBeVisible({ timeout: 40000 });
  await seite.waitForTimeout(500);
}

/** Ein tippbarer Knopf auf dem Bildschirm (Mitte in Seitenpixeln, Text für den Bericht). */
interface Knopf {
  readonly x: number;
  readonly y: number;
  readonly text: string;
}

/** Knöpfe, die ein Affe nicht drücken soll: Paket löschen, Spielstand löschen, Testhilfe. */
const VERBOTEN = /Spielpaket vom Gerät löschen|Ja, von vorn/;

/** Alle sichtbaren, freien Knöpfe, die oben liegen (der Finger träfe sie wirklich). */
export async function sichtbareKnoepfe(seite: Page): Promise<Knopf[]> {
  const liste = await seite
    .evaluate(() => {
      const ergebnis: { x: number; y: number; text: string }[] = [];
      for (const el of document.querySelectorAll<HTMLElement>(
        "button, [role=button], input[type=checkbox], input[type=radio]",
      )) {
        if ((el as HTMLButtonElement).disabled) continue;
        if (el.closest("[aria-label='Testhilfe des Autors']")) continue;
        const r = el.getBoundingClientRect();
        if (r.width < 2 || r.height < 2) continue;
        const x = r.left + r.width / 2;
        const y = r.top + r.height / 2;
        if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) continue;
        const oben = document.elementFromPoint(x, y);
        if (!oben || (oben !== el && !el.contains(oben))) continue;
        const text = (el.getAttribute("aria-label") ?? el.textContent ?? "").trim().slice(0, 40);
        ergebnis.push({ x, y, text });
      }
      return ergebnis;
    })
    .catch(() => []);
  return liste.filter((k) => !VERBOTEN.test(k.text));
}

/** Wo der Bildschirm gerade steht (für Bericht und Ausweg). */
export async function ort(seite: Page): Promise<string> {
  return seite
    .evaluate(() => {
      const da = (s: string) => document.querySelector(`[data-testid='${s}']`) !== null;
      if (da("partie")) return "partie";
      if (da("abenteuer-aufgaben")) return "aufgaben";
      if (da("abenteuer-welt")) return "welt";
      if (da("abenteuer-start")) return "start";
      if (da("abenteuer")) return "abenteuer";
      return document.body.innerText.trim().length > 0 ? "app" : "leer";
    })
    .catch(() => "laedt");
}

/** Tasten, die ein Affe drückt. */
const TASTEN = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter", "Escape", " "];

/** Fenstergrößen zwischen kleinem Handy und Tablet. */
const GROESSEN = [
  { width: 320, height: 568 },
  { width: 412, height: 839 },
  { width: 360, height: 640 },
  { width: 800, height: 600 },
  { width: 568, height: 320 },
];

/** Was ein Schritt des Affen auslösen darf. */
export interface Affenart {
  /** Wahrscheinlichkeit für Neuladen und Zurück-Taste je Schritt. */
  readonly neuladen: number;
  readonly zurueck: number;
}

/**
 * Ein zufälliger Schritt: Knopf (auch doppelt), Fläche, Taste, Zurück, Neuladen oder Größe.
 * Ausgabe: Beschreibung für das Protokoll.
 */
export async function affenschritt(seite: Page, z: () => number, art: Affenart): Promise<string> {
  const w = z();
  if (w < art.neuladen) {
    await seite.reload().catch(() => undefined);
    return "neu laden";
  }
  if (w < art.neuladen + art.zurueck) {
    await seite.goBack({ timeout: 5000 }).catch(() => undefined);
    return "zurück";
  }
  const r = z();
  if (r < 0.55) {
    const knoepfe = await sichtbareKnoepfe(seite);
    const k = knoepfe[Math.floor(z() * knoepfe.length)];
    if (!k) return "kein Knopf";
    const doppelt = z() < 0.2;
    await seite.mouse.click(k.x, k.y, { clickCount: doppelt ? 2 : 1 }).catch(() => undefined);
    return `${doppelt ? "doppelt " : ""}tippe „${k.text}“`;
  }
  if (r < 0.7) {
    const g = seite.viewportSize() ?? GROESSEN[1];
    await seite.mouse
      .click(Math.floor(z() * (g?.width ?? 1)), Math.floor(z() * (g?.height ?? 1)))
      .catch(() => undefined);
    return "tippe Fläche";
  }
  if (r < 0.95) {
    const taste = TASTEN[Math.floor(z() * TASTEN.length)] ?? "Enter";
    await seite.keyboard.down(taste);
    await seite.waitForTimeout(Math.floor(z() * 300));
    await seite.keyboard.up(taste);
    return `Taste ${taste}`;
  }
  const g = GROESSEN[Math.floor(z() * GROESSEN.length)] ?? { width: 412, height: 839 };
  await seite.setViewportSize(g);
  return `Fenster ${g.width}×${g.height}`;
}

/** Länger als so viele Millisekunden ohne jeden Knopf gilt als „kein Ausweg“. */
const OHNE_AUSWEG_MS = 20_000;

/**
 * Lässt den Affen `schritte` Schritte machen. Wirft, wenn die Seite leer bleibt, länger als
 * OHNE_AUSWEG_MS kein Knopf da ist, oder nach dem Neuladen der Spielstand nicht lesbar ist.
 * Gibt das Protokoll und Auffälligkeiten (doppelte Fenster) zurück.
 */
export async function lasseAffenLos(
  seite: Page,
  startwert: number,
  schritte: number,
  art: Affenart = { neuladen: 0.02, zurueck: 0.03 },
): Promise<{ protokoll: string[]; auffaellig: string[] }> {
  const z = zufallMit(startwert);
  const protokoll: string[] = [];
  const auffaellig = new Set<string>();
  let zuletztKnopf = Date.now();
  for (let i = 0; i < schritte; i++) {
    const was = await affenschritt(seite, z, art);
    protokoll.push(`${i}: ${was}`);
    await seite.waitForTimeout(40 + Math.floor(z() * 120));
    if (was === "neu laden") {
      await expect
        .poll(() => seite.evaluate(liesSpeicherImBrowser).then((s) => s.abenteuer !== null), {
          timeout: 10000,
        })
        .toBe(true);
    }
    const wo = await ort(seite);
    if (wo === "leer") throw new Error(`Leere Seite nach ${protokoll.slice(-5).join(" | ")}`);
    if (wo === "app") {
      // Der Affe hat das Spiel über Zurück oder „Zurück zur App“ verlassen: wieder hinein.
      await seite.goto("/app/#abenteuer").catch(() => undefined);
      protokoll.push(`${i}: wieder ins Abenteuer`);
    }
    const fenster = await offeneFenster(seite);
    if (fenster.length > 1) auffaellig.add(`zugleich offen: ${fenster.join(" + ")}`);
    if ((await sichtbareKnoepfe(seite)).length > 0 || (await tippbarerText(seite))) {
      zuletztKnopf = Date.now();
    } else if (Date.now() - zuletztKnopf > OHNE_AUSWEG_MS) {
      // Mit Lagebild (abenteuer-lage.ts), damit ein Fund aus CI erklärbar ist.
      throw new Error(
        `Kein Ausweg (${wo}) nach ${protokoll.slice(-12).join(" | ")}; Lage: ${await lagebild(seite)}`,
      );
    }
  }
  return { protokoll, auffaellig: [...auffaellig] };
}

/** Knöpfe, die aus jedem Fenster herausführen, in dieser Reihenfolge versucht. */
const AUSWEGE: readonly (RegExp | string)[] = [
  "partie-zurueck-zur-stadt",
  "abenteuer-aufgaben-zurueck",
  "abenteuer-deck-zurueck",
  /^Ja, aufgeben$/,
  "abenteuer-partie-aufgeben",
  /^Aufgeben und hierbleiben$/,
  /^Abbrechen|^Runde abbrechen|aufhören/i,
  /^Weiter$/,
  /^Fertig$/,
  /^Schließen$/,
  // Reisefenster (Monatskarte): Seit die Leiste unten im Daumenbereich liegt (docs/spiel/30),
  // öffnet der Affe es öfter; „Doch nicht“ ist sein Ausgang.
  /^Doch nicht$/,
  // Startkarte mit Spielstand (etwa nach „Spiel herunterladen“ mitten im Lauf): „Spielen“ führt
  // in dieselbe Welt zurück, wie ein Spieler es täte.
  "abenteuer-spielen",
  /^Zurück$/,
  /^Weiterspielen$/,
  /^Ich komme nicht drauf$/,
];

/** Ist die Welt frei begehbar: Steuerkreuz da, kein Fenster offen? */
async function weltFrei(seite: Page): Promise<boolean> {
  if ((await ort(seite)) !== "welt") return false;
  if ((await offeneFenster(seite)).length > 0) return false;
  return seite.locator(".abenteuer-steuerkreuz").isVisible();
}

/** Antworten, mit denen ein Spieler einen Dialog aufschiebt (zurück in die Welt). */
const AUFSCHUB = /Später|Nicht jetzt|Gleich\.|Bis bald|Ein andermal|Noch nicht/;

/**
 * Sucht wie ein vernünftiger Spieler den Weg zurück in die begehbare Welt: Partie aufgeben,
 * Runde zu Ende klicken, Fenster schließen. Wirft, wenn das nicht gelingt; dann ist das Spiel
 * für einen Spieler festgefahren.
 */
export async function findeAusweg(seite: Page, frist = 90_000): Promise<void> {
  const ende = Date.now() + frist;
  const versucht: string[] = [];
  while (Date.now() < ende) {
    if (await weltFrei(seite)) return;
    const wo = await ort(seite);
    if (wo === "app" || wo === "leer") await seite.goto("/app/#abenteuer");
    // Das Spielmenü liegt über allem: zuerst schließen.
    const menue = seite.getByTestId("abenteuer-menue");
    if (await menue.isVisible().catch(() => false)) {
      await menue.getByRole("button", { name: "Weiterspielen" }).click({ timeout: 2000 });
      versucht.push(`${wo}: Menü schließen`);
      continue;
    }
    let gedrueckt = false;
    for (const ausweg of AUSWEGE) {
      const knopf =
        typeof ausweg === "string"
          ? seite.getByTestId(ausweg)
          : seite.getByRole("button", { name: ausweg });
      // Liegen zwei Karten übereinander (Meldung unter dem Ergebnis), trifft nur die obere.
      for (const einer of (await knopf.all()).reverse()) {
        if (!(await einer.isVisible().catch(() => false))) continue;
        if (await einer.isDisabled().catch(() => true)) continue;
        if (
          await einer.click({ timeout: 1000 }).then(
            () => true,
            () => false,
          )
        ) {
          versucht.push(`${wo}: ${String(ausweg)}`);
          gedrueckt = true;
          break;
        }
      }
      if (gedrueckt) break;
    }
    // Dialog ohne „Weiter“: wer zurück in die Welt will, schiebt auf („Später“, „Nicht jetzt“);
    // sonst die erste Wahl. Seit der Rückmeldung nach dem Ergebnis (19.11.2026) bietet ein
    // Dialog nach einem Fehlversuch „Noch einmal“ zuerst an; die erste Wahl drehte dann im Kreis.
    if (!gedrueckt) {
      const wahlen = seite.locator(".abenteuer-dialog-wahlen button");
      const aufschub = wahlen.filter({ hasText: AUFSCHUB }).first();
      const wahl = (await aufschub.isVisible().catch(() => false)) ? aufschub : wahlen.first();
      if (await wahl.isVisible().catch(() => false)) {
        // Den Text vor dem Klick lesen: Danach ist der Knopf weg, und ohne Frist wartete es ewig.
        const text = await wahl.innerText({ timeout: 1000 }).catch(() => "");
        await wahl.click({ timeout: 2000 }).catch(() => undefined);
        versucht.push(`${wo}: Wahl ${text}`);
      }
    }
    await seite.waitForTimeout(300);
  }
  const knoepfe = (await sichtbareKnoepfe(seite)).map((k) => k.text).join(", ");
  throw new Error(
    `Kein Weg zurück in die Welt (${await ort(seite)}); Knöpfe: ${knoepfe}; ` +
      `versucht: ${versucht.slice(-10).join(" | ")}`,
  );
}
