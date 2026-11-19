/**
 * Eingaben des Spieler-Durchlaufs: nur das, was ein Mensch am Handy drücken kann. Der Finger
 * (Berührung über das Chrome-Protokoll) hält das Steuerkreuz und tippt Knöpfe an ihrer Mitte;
 * wahlweise laufen die Pfeiltasten (DURCHLAUF_EINGABE=tasten).
 *
 * Warum: Ein verdeckter Knopf oder ein Steuerkreuz unter einem Fenster fällt nur auf, wenn der
 * Tipp dort landet, wo der Finger landet. Deshalb tippt der Durchlauf auf Bildschirmpunkte und
 * prüft vorher, was dort oben liegt; liegt etwas Fremdes darüber, ist das ein Fund.
 * Abhängigkeiten: Playwright (Chromium, CDP), lage.ts.
 * Beispiel: halteRichtung(lauf, "oben") drückt den Knopf „Nach oben“ des Steuerkreuzes, bis
 * lasseRichtung(lauf) den Finger hebt.
 */
import type { CDPSession, Locator, Page } from "@playwright/test";
import type { Knopf } from "./lage";
import type { Messung } from "./messung";

/** Eine Laufrichtung. */
export type Richtung = "oben" | "unten" | "links" | "rechts";

/** Beschriftung der Knöpfe des Steuerkreuzes und Pfeiltasten je Richtung. */
const KREUZKNOPF: Readonly<Record<Richtung, string>> = {
  oben: "Nach oben",
  unten: "Nach unten",
  links: "Nach links",
  rechts: "Nach rechts",
};
const TASTE: Readonly<Record<Richtung, string>> = {
  oben: "ArrowUp",
  unten: "ArrowDown",
  links: "ArrowLeft",
  rechts: "ArrowRight",
};

/** Alles, was die Schritte des Durchlaufs gemeinsam brauchen. */
export interface Lauf {
  readonly seite: Page;
  readonly cdp: CDPSession;
  readonly messung: Messung;
  /** Mit Tasten statt Steuerkreuz laufen. */
  readonly tasten: boolean;
  /** Zeitpunkt (ms seit 1970), zu dem dieser Lauf aufhört; lange Schleifen sehen danach. */
  readonly frist: number;
  /** Gerade gehaltene Richtung (für das Loslassen). */
  gehalten: Richtung | null;
}

/** So lange darf ein Knopf verdeckt sein, bevor das ein Fund ist (ms). */
const VERDECKT_MS = 6000;
/** Seit wann ein Knopf (nach Name) verdeckt ist. */
const verdecktSeit = new Map<string, number>();

/** Was an einem Bildschirmpunkt oben liegt, kurz beschrieben (für Funde). */
async function obenAuf(seite: Page, x: number, y: number): Promise<string> {
  return seite
    .evaluate(
      ([px, py]) => {
        const e = document.elementFromPoint(px as number, py as number);
        if (!e) return "nichts";
        const kennung = e.closest("[data-testid]")?.getAttribute("data-testid") ?? "";
        return `${e.tagName.toLowerCase()}.${String(e.className).slice(0, 40)} (${kennung})`;
      },
      [x, y],
    )
    .catch(() => "unbekannt");
}

/** Liegt das Element an seiner Mitte oben? Gibt die Mitte zurück oder beschreibt, was darüberliegt. */
async function freieMitte(
  ziel: Locator,
): Promise<{ x: number; y: number } | { verdeckt: string } | null> {
  return ziel
    .evaluate((el) => {
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return null;
      const x = r.left + r.width / 2;
      const y = r.top + r.height / 2;
      if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) {
        return { verdeckt: `außerhalb des Bildes (${Math.round(x)}, ${Math.round(y)})` };
      }
      const oben = document.elementFromPoint(x, y);
      if (oben && (oben === el || el.contains(oben))) return { x, y };
      const kennung = oben?.closest("[data-testid]")?.getAttribute("data-testid") ?? "";
      return {
        verdeckt: `${oben?.tagName.toLowerCase() ?? "nichts"}.${String(oben?.className ?? "").slice(0, 40)} (${kennung})`,
      };
    })
    .catch(() => null);
}

/** Tippt mit dem Finger auf einen Bildschirmpunkt. */
export async function tippePunkt(lauf: Lauf, x: number, y: number): Promise<void> {
  await lauf.seite.touchscreen.tap(x, y);
}

/** Tippt einen Knopf aus der Lage an (er lag beim Lesen oben). */
export async function tippeKnopf(lauf: Lauf, knopf: Knopf): Promise<void> {
  await tippePunkt(lauf, knopf.x, knopf.y);
}

/**
 * Tippt ein Element an seiner Mitte an, nach dem Hinrollen wie ein Mensch es täte. Liegt etwas
 * darüber, wird das als Fund gemeldet und nicht getippt. Ausgabe: ob getippt wurde.
 * Beispiel: tippe(lauf, seite.getByTestId("abenteuer-deck-los"), "Deckwahl: Los").
 */
export async function tippe(lauf: Lauf, ziel: Locator, name: string): Promise<boolean> {
  const erstes = ziel.first();
  if (!(await erstes.isVisible().catch(() => false))) return false;
  await erstes.scrollIntoViewIfNeeded({ timeout: 2000 }).catch(() => undefined);
  const mitte = await freieMitte(erstes);
  if (!mitte) return false;
  if ("verdeckt" in mitte) {
    // Kurz verdeckt ist kein Fund (Einblendungen, Startanimation); erst wenn es so bleibt.
    const seit = verdecktSeit.get(name) ?? Date.now();
    verdecktSeit.set(name, seit);
    if (Date.now() - seit > VERDECKT_MS) {
      lauf.messung.fund("verdeckt", `${name}: verdeckt von ${mitte.verdeckt}`);
    }
    return false;
  }
  verdecktSeit.delete(name);
  await tippePunkt(lauf, mitte.x, mitte.y);
  return true;
}

/** Hebt den Finger vom Steuerkreuz (oder lässt die Taste los). */
export async function lasseRichtung(lauf: Lauf): Promise<void> {
  const richtung = lauf.gehalten;
  if (!richtung) return;
  lauf.gehalten = null;
  if (lauf.tasten) {
    await lauf.seite.keyboard.up(TASTE[richtung]);
    return;
  }
  await lauf.cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
}

/**
 * Drückt eine Richtung und hält sie. Ausgabe: ob gedrückt wurde (false: Steuerkreuz fehlt oder
 * ist verdeckt; das ist dann als Fund gemeldet).
 */
export async function halteRichtung(lauf: Lauf, richtung: Richtung): Promise<boolean> {
  await lasseRichtung(lauf);
  if (lauf.tasten) {
    await lauf.seite.keyboard.down(TASTE[richtung]);
    lauf.gehalten = richtung;
    return true;
  }
  const knopf = lauf.seite.locator(
    `.abenteuer-steuerkreuz button[aria-label='${KREUZKNOPF[richtung]}']`,
  );
  const mitte = await freieMitte(knopf.first());
  if (!mitte) return false;
  if ("verdeckt" in mitte) {
    lauf.messung.fund(
      "steuerkreuz",
      `Steuerkreuz „${KREUZKNOPF[richtung]}“ verdeckt von ${mitte.verdeckt}`,
    );
    return false;
  }
  await lauf.cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: Math.round(mitte.x), y: Math.round(mitte.y) }],
  });
  lauf.gehalten = richtung;
  return true;
}

/** Was an einem Punkt oben liegt (für Meldungen anderer Dateien). */
export { obenAuf };
