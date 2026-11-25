/**
 * Das Brett bleibt in der Partie still stehen (Befund des Autors, 25.11.2026: „das ganze
 * Schachbrett rutscht hin und her“, wenn Textzeilen, Sprechblasen, Kartenfächer oder mal mehr,
 * mal weniger Knöpfe erscheinen). Gemessen wird die Lage des Bretts in jedem Bild
 * (requestAnimationFrame) vom Aufbau bis zum Ende: Züge mit „… überlegt“, Karten aus dem Fächer,
 * Sprechzeilen am Tisch, Aufgeben mit Nachfrage und Ergebnis. Toleranz 1 px (Rundung).
 * Hochformat (Pixel 7, Projekt) und quer (iPhone 15, Pixel 7).
 */
import { expect, test, type Page } from "@playwright/test";
import { EINLEITUNG_GESEHEN, GRUNDSTAND, starteMitStand } from "./abenteuer-affe";
import { foto, geraet } from "./abenteuer-quer";

/** Höchste erlaubte Verschiebung des Bretts in CSS-Pixeln (Rundung). */
const TOLERANZ = 1;
/** Antwortzeit der Engine. */
const ENGINE_FRIST = 30000;
/** Das Brett baut sich auf (Einblenden, Figuren). */
const AUFBAU_MS = 1500;

/** Übungspartie über das Reisebrett starten (wie abenteuer-querbretter.spec.ts). */
async function startePartie(s: Page): Promise<void> {
  await starteMitStand(s, { ...GRUNDSTAND, dialogvariablen: EINLEITUNG_GESEHEN });
  const hinweis = s.getByTestId("abenteuer-meldung").getByRole("button", { name: "Weiter" });
  await expect(s.getByTestId("abenteuer-reisebrettknopf")).toBeVisible({ timeout: 20000 });
  if (await hinweis.isVisible()) await hinweis.click();
  await s.getByTestId("abenteuer-reisebrettknopf").click();
  await s.getByTestId("abenteuer-deck-los").click();
  await expect(s.getByTestId("partie")).toBeVisible({ timeout: 30000 });
  await expect(s.locator(".brett").first()).toBeVisible({ timeout: 20000 });
  await s.waitForTimeout(AUFBAU_MS);
}

/** Ab jetzt jede Lage des Bretts mitschreiben (Lage im Fenster, nicht in der Seite). */
async function messeAb(s: Page): Promise<void> {
  await s.evaluate(() => {
    const w = window as unknown as { brettlagen: string[] };
    w.brettlagen = [];
    const lauf = () => {
      const b = document.querySelector(".abenteuer-partie-brett .brett, .abenteuer-huelle .brett");
      const r = b?.getBoundingClientRect();
      if (r) {
        const lage = `${r.left.toFixed(1)},${r.top.toFixed(1)},${r.width.toFixed(1)}`;
        if (w.brettlagen.at(-1) !== lage) w.brettlagen.push(lage);
      }
      requestAnimationFrame(lauf);
    };
    requestAnimationFrame(lauf);
  });
}

/** Alle gemessenen Lagen: links, oben, Breite. */
async function lagen(s: Page): Promise<number[][]> {
  const roh = await s.evaluate(() => (window as unknown as { brettlagen: string[] }).brettlagen);
  return roh.map((l) => l.split(",").map(Number));
}

/** Wartet, bis der Leser am Zug ist, und spielt den ersten der Züge, der gerade geht. */
async function ziehe(s: Page, zuege: readonly (readonly [string, string])[]): Promise<void> {
  const status = s.getByTestId("partiestatus");
  await expect(status).toHaveText("Du bist am Zug.", { timeout: ENGINE_FRIST });
  const bild = () =>
    s.locator(".brett [aria-label]").evaluateAll((k) => k.map((e) => e.ariaLabel).join("|"));
  const vorher = await bild();
  for (const [von, nach] of zuege) {
    const figur = s.getByRole("button", { name: new RegExp(`^${von}, `) });
    if (!(await figur.isVisible().catch(() => false))) continue;
    await figur.click();
    const ziel = s.getByRole("button", { name: nach, exact: true });
    if (await ziel.isVisible().catch(() => false)) await ziel.click();
    await s.waitForTimeout(300);
    if ((await bild()) !== vorher) return;
    // Kein Zug (fremde Figur oder Feld besetzt): Auswahl wieder lösen.
    await s.keyboard.press("Escape");
  }
  throw new Error("Kein Zug ging");
}

/** Eine Karte aus dem Fächer spielen, falls eine da ist. */
async function spieleKarte(s: Page): Promise<void> {
  const karte = s.locator(".abenteuer-faecher button:not([disabled])").first();
  if (await karte.isVisible().catch(() => false)) {
    await karte.click();
    await s.waitForTimeout(600);
  }
}

/** Ablauf einer Partie mit allem, was ein- und ausblendet. */
async function spieleDurch(s: Page): Promise<void> {
  const weiss = [
    ["e2", "e4"],
    ["d2", "d4"],
    ["g1", "f3"],
    ["f1", "c4"],
    ["b1", "c3"],
  ] as const;
  const schwarz = [
    ["e7", "e5"],
    ["d7", "d5"],
    ["g8", "f6"],
    ["b8", "c6"],
    ["f8", "e7"],
  ] as const;
  for (let i = 0; i < 4; i++) {
    await ziehe(s, [...weiss, ...schwarz]);
    if (i === 1) await spieleKarte(s);
    // Mit QUER_FOTOS=ORDNER ein Foto mitten in der Partie (abenteuer-quer.ts).
    if (i === 2) await foto(s, "brettruhe", `${s.viewportSize()?.width ?? 0}`);
  }
  await s.getByTestId("abenteuer-partie-aufgeben").click();
  await s.waitForTimeout(400);
  await s.getByRole("button", { name: "Ja, aufgeben" }).click();
  await expect(s.getByTestId("partie-zurueck-zur-stadt")).toBeVisible({ timeout: 20000 });
  await s.waitForTimeout(1500);
}

/**
 * Unter dem Brett kommt viel Inhalt dazu (wie Erzählvorhang, Kartenfächer und Kurzformzeile in
 * einer Begegnung), alles wird ganz nach unten gerollt, dann verschwindet er wieder (wie der
 * Vorhang beim ersten Zug). Vorher rollte so die ganze Seite, und das Brett sprang.
 */
async function wachseUndSchrumpfe(s: Page): Promise<void> {
  await s.evaluate(() => {
    const seite = document.querySelector(".abenteuer-partie-seite");
    const block = document.createElement("div");
    block.id = "brettruhe-block";
    block.style.height = "900px";
    seite?.prepend(block);
  });
  await s.waitForTimeout(300);
  await s.evaluate(() => {
    for (const e of [
      document.scrollingElement,
      ...document.querySelectorAll(".abenteuer-huelle, .abenteuer-huelle *"),
    ]) {
      if (e && e.scrollHeight > e.clientHeight) e.scrollTop = e.scrollHeight;
    }
  });
  await s.waitForTimeout(300);
  await s.evaluate(() => document.getElementById("brettruhe-block")?.remove());
  await s.waitForTimeout(300);
}

/** Größte Abweichung von der ersten Lage. */
function groessteAbweichung(alle: number[][]): number {
  const [erste] = alle;
  if (!erste) return Number.POSITIVE_INFINITY;
  return Math.max(...alle.map((l) => Math.max(...l.map((v, i) => Math.abs(v - (erste[i] ?? 0))))));
}

async function pruefe(s: Page): Promise<void> {
  test.slow();
  await startePartie(s);
  await messeAb(s);
  await wachseUndSchrumpfe(s);
  await spieleDurch(s);
  const alle = await lagen(s);

  expect(alle.length, `Lagen des Bretts: ${JSON.stringify(alle)}`).toBeGreaterThan(0);
  expect(groessteAbweichung(alle), `Lagen des Bretts: ${JSON.stringify(alle)}`).toBeLessThanOrEqual(
    TOLERANZ,
  );
}

test("hoch: Das Brett steht still, was auch ein- und ausblendet", async ({ page }) => {
  await pruefe(page);
});

for (const [name, g] of [
  ["iPhone 15 quer", geraet("iPhone 15 landscape")],
  ["Pixel 7 quer", geraet("Pixel 7 landscape")],
] as const) {
  test.describe(name, () => {
    test.use(g);
    test("quer: Das Brett steht still, was auch ein- und ausblendet", async ({ page }) => {
      await pruefe(page);
    });
  });
}
