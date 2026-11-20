/**
 * Wettlaufwache des Spieler-Durchlaufs: ein Beobachter im Browser, der Fenster meldet, die nicht
 * zusammen auf dem Bildschirm liegen dürfen, und Gespräche, die von selbst noch einmal aufgehen.
 *
 * Warum: Der eilige Spieler (eilig.ts, Auftrag des Hauptchats, 20.11.2026) tippt schneller, als
 * der Durchlauf liest. Was dabei kurz falsch steht (zwei Dialoge, eine Meldung über dem Tagebuch,
 * ein Dialog, der sich nach dem Ende gleich wieder öffnet), sähe der Durchlauf zwischen zwei
 * Lesungen nie. Die Wache sieht jede Änderung der Seite (MutationObserver) und merkt sich Funde,
 * die der Durchlauf bei jedem Takt abholt. Sie liest nur, sie tippt nie.
 * Funde:
 * - doppelterDialog: zwei Gesprächsfenster zugleich.
 * - dialogZweimal: ein Gespräch beginnt mit derselben Zeile wie das eben beendete, ohne dass der
 *   Spieler dazwischen den Aktionsknopf, das Steuerkreuz oder eine Taste gedrückt hat.
 * - meldungUeberFenster: die Meldungsleiste über einem offenen Fenster (Tagebuch, Laden, …).
 * - haengendePause: „Weiter“ bleibt länger gesperrt als die längste Pause des Spiels.
 * - brettAngeschnitten: ein Schachbrett ragt über den Bildrand, und kein Rollen holt es herein
 *   (Wunsch des Autors, 20.11.2026:
 *   Bei Partien und Rätseln muss das Brett quer immer ganz zu sehen sein).
 * Abhängigkeiten: Testkennungen der Oberwelt (Dialog, Meldung, Fenster), messung.ts.
 * Beispiel: installiereWache(seite) beim Start, holeWachfunde(lauf) in jedem Takt.
 */
import type { Page } from "@playwright/test";
import type { Lauf } from "./eingabe";

/** Länger als die längste Dialogpause (#pause:3 = 3 s) und ein langsamer Takt (ms). */
export const PAUSE_MAX_MS = 8000;
/** So kurz nach dem Ende gilt ein gleiches Gespräch als von selbst wieder geöffnet (ms). */
export const WIEDER_MS = 2000;

/** Ein Fund der Wache im Browser. */
export interface Wachfund {
  readonly art: string;
  readonly text: string;
}

/** Fenster, über denen keine Meldung liegen soll. */
const FENSTER = [
  "abenteuer-dialog",
  "abenteuer-tagebuch",
  "abenteuer-laden",
  "abenteuer-reisen",
  "abenteuer-deckwahl",
  "abenteuer-vorfuehrung",
  "abenteuer-gedaechtnis",
  "abenteuer-ergebnis",
  "abenteuer-rundenergebnis",
  "abenteuer-abspann",
];

/** Läuft im Browser (addInitScript): legt window.__wache an und beobachtet die Seite. */
function wacheImBrowser(a: { fenster: string[]; pauseMax: number; wieder: number }): void {
  const w = window as unknown as { __wache?: { funde: { art: string; text: string }[] } };
  if (w.__wache) return;
  const wache = { funde: [] as { art: string; text: string }[] };
  w.__wache = wache;
  const gemeldet = new Set<string>();
  const melde = (art: string, text: string) => {
    if (gemeldet.has(`${art}|${text}`)) return;
    gemeldet.add(`${art}|${text}`);
    wache.funde.push({ art, text });
  };
  const sichtbar = (e: Element | null): e is HTMLElement => {
    if (!e) return false;
    const r = (e as HTMLElement).getBoundingClientRect();
    return r.width > 1 && r.height > 1;
  };
  /** Kleiner gilt nicht als Brett (Vorschaubilder im Tagebuch). */
  const BRETT_MIN = 120;
  const alle2 = (auswahl: string) => [...document.querySelectorAll(auswahl)].filter(sichtbar);
  /**
   * Lässt sich das Element durch Rollen ganz ins Bild holen (die Seite oder ein Vorfahr rollt)?
   * Am Ende einer Runde rollt die Seite zu „Weiter“; Brett und Lösungsbretter liegen dann oben
   * oder unten außerhalb und sind trotzdem erreichbar (Durchlauf eilig, Akt 3, 20.11.2026).
   */
  const erreichbarDurchRollen = (e: Element): boolean => {
    const seite = document.scrollingElement;
    if (seite && seite.scrollHeight > innerHeight + 1) return true;
    for (let v = e.parentElement; v; v = v.parentElement) {
      const y = getComputedStyle(v).overflowY;
      if ((y === "auto" || y === "scroll") && v.scrollHeight > v.clientHeight + 1) return true;
    }
    return false;
  };
  const alle = (k: string) =>
    [...document.querySelectorAll(`[data-testid='${k}']`)].filter(sichtbar);
  let letzteAktion = 0;
  // Eingaben, mit denen der Spieler selbst ein Gespräch beginnt: Aktionsknopf, Steuerkreuz (in
  // einen Durchgang mit Dialog laufen), Pfeiltasten.
  const merkeAktion = (e: Event) => {
    const ziel = e.target as Element | null;
    if (ziel?.closest?.("[data-testid='abenteuer-aktion'], .abenteuer-steuerkreuz")) {
      letzteAktion = performance.now();
    }
  };
  document.addEventListener("pointerdown", merkeAktion, true);
  document.addEventListener("click", merkeAktion, true);
  document.addEventListener(
    "keydown",
    (e) => {
      if (e.key.startsWith("Arrow") || e.key === "Enter" || e.key === " ") {
        letzteAktion = performance.now();
      }
    },
    true,
  );
  let offen = false;
  let ersteZeile = "";
  let zuletzt = { zeile: "", zu: 0 };
  let pause = { text: "", seit: 0 };
  const zeileVon = (d: Element) =>
    `${d.querySelector(".abenteuer-dialog-sprecher")?.textContent ?? ""}: ${
      d.querySelector(".abenteuer-dialog-text")?.textContent ?? ""
    }`.slice(0, 120);
  const pruefe = () => {
    const jetzt = performance.now();
    const dialoge = alle("abenteuer-dialog");
    if (dialoge.length > 1) {
      melde(
        "doppelterDialog",
        `${dialoge.length} Dialoge zugleich: ${dialoge.map(zeileVon).join(" | ")}`,
      );
    }
    const meldung = alle("abenteuer-meldung")[0];
    if (meldung) {
      const darunter = a.fenster.filter((k) => alle(k).length > 0);
      if (darunter.length > 0) {
        melde(
          "meldungUeberFenster",
          `„${(meldung.textContent ?? "").slice(0, 80)}“ über ${darunter.join(", ")}`,
        );
      }
    }
    const dialog = dialoge[0];
    if (dialog && !offen) {
      offen = true;
      ersteZeile = zeileVon(dialog);
      if (
        ersteZeile === zuletzt.zeile &&
        jetzt - zuletzt.zu < a.wieder &&
        letzteAktion < zuletzt.zu
      ) {
        melde("dialogZweimal", `Gespräch öffnet von selbst noch einmal: ${ersteZeile}`);
      }
    } else if (!dialog && offen) {
      offen = false;
      zuletzt = { zeile: ersteZeile, zu: jetzt };
    }
    for (const brett of alle2(".brett")) {
      const r = brett.getBoundingClientRect();
      if (r.width < BRETT_MIN || r.height < BRETT_MIN || erreichbarDurchRollen(brett)) continue;
      const rand = 1;
      const aussen =
        r.top < -rand ||
        r.left < -rand ||
        r.bottom > innerHeight + rand ||
        r.right > innerWidth + rand;
      if (aussen) {
        melde(
          "brettAngeschnitten",
          `Brett ${Math.round(r.width)}×${Math.round(r.height)} bei ${Math.round(r.left)},${Math.round(r.top)} im Bild ${innerWidth}×${innerHeight}`,
        );
      }
    }
    const gesperrt = dialog?.querySelector(".abenteuer-dialog-weiter[data-pause='ja']");
    if (!gesperrt || !dialog) pause = { text: "", seit: 0 };
    else if (pause.text !== zeileVon(dialog)) pause = { text: zeileVon(dialog), seit: jetzt };
    else if (jetzt - pause.seit > a.pauseMax) {
      melde("haengendePause", `„Weiter“ seit ${a.pauseMax / 1000} s gesperrt: ${pause.text}`);
    }
  };
  const beginne = () => {
    new MutationObserver(pruefe).observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      characterData: true,
    });
    // Auch ohne Änderung der Seite (die Pause läuft still ab).
    setInterval(pruefe, 250);
  };
  if (document.body) beginne();
  else document.addEventListener("DOMContentLoaded", beginne);
}

/** Legt die Wache in jede Seite, die geladen wird (auch nach jedem Neuladen). */
export async function installiereWache(seite: Page): Promise<void> {
  await seite.addInitScript(wacheImBrowser, {
    fenster: FENSTER,
    pauseMax: PAUSE_MAX_MS,
    wieder: WIEDER_MS,
  });
}

/** Holt die neuen Funde der Wache und trägt sie als Funde des Laufs ein. */
export async function holeWachfunde(lauf: Lauf): Promise<void> {
  const funde = await lauf.seite
    .evaluate(() => {
      const w = window as unknown as { __wache?: { funde: { art: string; text: string }[] } };
      return w.__wache ? w.__wache.funde.splice(0) : [];
    })
    .catch((): Wachfund[] => []);
  for (const f of funde) lauf.messung.fund(f.art, f.text);
}
