/**
 * Lagebild für den Affentest des Schach-Abenteuers (abenteuer-affe.ts): ob der Dialogtext
 * antippbar ist und was auf dem Bildschirm liegt, wenn der Affe keinen Ausweg mehr findet.
 *
 * Warum: In CI brach „Affe: Deckwahl“ zweimal mit „Kein Ausweg (welt)“ ab (17.11.2026), lokal ließ
 * es sich auch unter Last nicht nachstellen. Die Meldung nennt jetzt Testkennungen, gesperrte
 * Knöpfe und das oberste Element an Bildmitte und Steuerkreuz, damit der nächste Fund erklärbar ist.
 * Abhängigkeiten: Testkennungen der Oberwelt, Dialog.tsx (data-weiter).
 */
import type { Page } from "@playwright/test";

/**
 * Kann der Spieler den Dialogtext antippen, um weiterzukommen (Dialog.tsx, data-weiter)? Dann gibt
 * es einen Ausweg, auch ohne sichtbaren Knopf (etwa wenn eine Großansicht „Weiter“ überdeckt).
 */
export async function tippbarerText(seite: Page): Promise<boolean> {
  return seite
    .locator(".abenteuer-dialog-text[data-weiter='ja']")
    .isVisible()
    .catch(() => false);
}

/**
 * Kurzes Lagebild für die Fehlermeldung: sichtbare Testkennungen, gesperrte Knöpfe, was über der
 * Mitte des Steuerkreuzes und der Bildmitte liegt.
 */
export async function lagebild(seite: Page): Promise<string> {
  return seite
    .evaluate(() => {
      const sichtbar = (e: Element) => (e as HTMLElement).getBoundingClientRect().height > 0;
      const kennungen = [...document.querySelectorAll("[data-testid]")]
        .filter(sichtbar)
        .map((e) => e.getAttribute("data-testid"))
        .slice(0, 25);
      const gesperrt = [...document.querySelectorAll("button:disabled")]
        .filter(sichtbar)
        .map((e) => (e.textContent ?? "").trim().slice(0, 20));
      const oben = (x: number, y: number) => {
        const e = document.elementFromPoint(x, y);
        return e ? `${e.tagName.toLowerCase()}.${String(e.className).slice(0, 40)}` : "nichts";
      };
      return (
        `Kennungen [${kennungen.join(", ")}], gesperrt [${gesperrt.join(", ")}], ` +
        `Mitte ${oben(innerWidth / 2, innerHeight / 2)}, unten rechts ` +
        `${oben(innerWidth - 40, innerHeight - 60)}, Fenster ${innerWidth}×${innerHeight}`
      );
    })
    .catch((e: Error) => `nicht lesbar (${e.message})`);
}

/** Overlays der Oberwelt, die gerade offen sind (mehr als eins ist verdächtig). */
export async function offeneFenster(seite: Page): Promise<string[]> {
  return seite
    .evaluate(() =>
      [
        ...document.querySelectorAll<HTMLElement>(
          ".abenteuer-welt [role=dialog], .abenteuer-welt .abenteuer-ergebnis, .abenteuer-menue",
        ),
      ]
        .filter((e) => e.getBoundingClientRect().height > 0)
        .map((e) => e.dataset.testid ?? e.getAttribute("aria-label") ?? e.className),
    )
    .catch(() => []);
}
