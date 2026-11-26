/**
 * Joystick und diagonales Laufen (Wunsch des Autors, 26.11.2026): Den inneren Knopf schräg ziehen
 * (Zeigerereignisse), der Held läuft schräg; schräg gegen eine Wand rutscht er an ihr entlang,
 * statt hängen zu bleiben. Dazu Tagebuch und Menü unten links, hoch und quer. Mit FOTO_ORDNER legt
 * der Test Fotos von Joystick und Knöpfen ab (nur lokal).
 */
import { expect, test, type Page } from "@playwright/test";
import { EINLEITUNG_GESEHEN, GRUNDSTAND, starteMitStand } from "./abenteuer-affe";

const VARIABLEN = { ...EINLEITUNG_GESEHEN, hinweisSteuerkreuz: true, hinweisAktion: true };
/** Freie Wiese im Park von Maple Falls, links und oben frei. */
const WIESE = {
  ...GRUNDSTAND,
  position: { karte: "mapleFalls.park", x: 20, y: 18, richtung: "rechts" },
  dialogvariablen: VARIABLEN,
};
/** Dachboden, unterste Reihe: darunter die Wand (Kartenreihe 10), rechts frei. */
const DACHBODEN = {
  ...GRUNDSTAND,
  position: { karte: "mapleFalls.dachboden", x: 2, y: 9, richtung: "rechts" },
  besuchteOrte: ["mapleFalls"],
  gegenstaende: [],
  muenzen: 0,
  dialogvariablen: VARIABLEN,
};
/** Halber Daumenradius (56 px, joystick.ts) je Achse: schräg, gehen. */
const SCHRAEG_PX = 26;
const HALTEN_MS = 900;

async function kachel(seite: Page): Promise<{ x: number; y: number }> {
  const text = (await seite.getByTestId("abenteuer-kachel").textContent()) ?? "0,0";
  const [x, y] = text.split(",").map(Number);
  return { x: x ?? 0, y: y ?? 0 };
}

/** Zieht den Knopf aus der Mitte um (dx, dy), hält und lässt los; prüft die gemeldete Richtung. */
async function ziehe(seite: Page, dx: number, dy: number, richtung: string): Promise<void> {
  const joystick = seite.getByTestId("abenteuer-joystick");
  const box = await joystick.boundingBox();
  if (!box) throw new Error("Joystick ohne Lage");
  const mitte = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
  await seite.mouse.move(mitte.x, mitte.y);
  await seite.mouse.down();
  await seite.mouse.move(mitte.x + dx, mitte.y + dy, { steps: 4 });
  await expect(joystick).toHaveAttribute("data-richtung", richtung);
  await seite.waitForTimeout(HALTEN_MS);
  await seite.mouse.up();
  await expect(joystick).not.toHaveAttribute("data-richtung", /./);
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => window.localStorage.setItem("svga.safariHinweis", "aus"));
});

test("Joystick schräg: der Held läuft schräg, der Blick bleibt eine Hauptrichtung", async ({
  page,
}) => {
  await starteMitStand(page, WIESE);
  const vorher = await kachel(page);
  await ziehe(page, -SCHRAEG_PX, -SCHRAEG_PX, "linksOben");
  await expect.poll(() => kachel(page)).not.toEqual(vorher);
  const nachher = await kachel(page);
  expect(nachher.x).toBeLessThan(vorher.x);
  expect(nachher.y).toBeLessThan(vorher.y);
});

test("Joystick schräg gegen die Wand: der Held rutscht an ihr entlang", async ({ page }) => {
  await starteMitStand(page, DACHBODEN);
  const vorher = await kachel(page);
  await ziehe(page, SCHRAEG_PX, SCHRAEG_PX, "rechtsUnten");
  await expect.poll(async () => (await kachel(page)).x).toBeGreaterThan(vorher.x);
  expect((await kachel(page)).y).toBe(vorher.y);
});

test("Tastatur: zwei Pfeile zugleich ergeben eine Schräge", async ({ page }) => {
  await starteMitStand(page, WIESE);
  const vorher = await kachel(page);
  await page.keyboard.down("ArrowLeft");
  await page.keyboard.down("w");
  await page.waitForTimeout(HALTEN_MS);
  await page.keyboard.up("w");
  await page.keyboard.up("ArrowLeft");
  const nachher = await kachel(page);
  expect(nachher.x).toBeLessThan(vorher.x);
  expect(nachher.y).toBeLessThan(vorher.y);
});

for (const format of [
  { name: "hoch", viewport: { width: 390, height: 844 } },
  { name: "quer", viewport: { width: 844, height: 390 } },
]) {
  test.describe(`Joystick und Knöpfe ${format.name}`, () => {
    test.use({ viewport: format.viewport, hasTouch: true, isMobile: true });

    test("Tagebuch und Menü unten links, Joystick ganz im Bild", async ({ page }) => {
      await starteMitStand(page, WIESE);
      const joystick = await page.getByTestId("abenteuer-joystick").boundingBox();
      const tagebuch = await page.getByTestId("abenteuer-tagebuchknopf").boundingBox();
      const menue = await page.getByTestId("abenteuer-menueknopf").boundingBox();
      if (!joystick || !tagebuch || !menue) throw new Error("ohne Lage");
      const v = format.viewport;
      for (const b of [tagebuch, menue]) {
        expect(b.x + b.width).toBeLessThan(v.width / 2);
        expect(b.y).toBeGreaterThan(v.height / 2);
        expect(b.x).toBeGreaterThanOrEqual(16);
      }
      expect(menue.x).toBeLessThan(tagebuch.x);
      expect(joystick.x).toBeGreaterThanOrEqual(0);
      expect(joystick.x + joystick.width).toBeLessThanOrEqual(v.width);
      expect(joystick.y + joystick.height).toBeLessThanOrEqual(v.height);
      const ordner = process.env.FOTO_ORDNER;
      if (ordner) {
        const box = page.getByTestId("abenteuer-joystick");
        const mitte = { x: joystick.x + joystick.width / 2, y: joystick.y + joystick.height / 2 };
        await page.screenshot({ path: `${ordner}/joystick-${format.name}-ruhe.png` });
        await page.mouse.move(mitte.x, mitte.y);
        await page.mouse.down();
        await page.mouse.move(mitte.x - 40, mitte.y - 40, { steps: 3 });
        await expect(box).toHaveAttribute("data-gangart", "rennen");
        await page.screenshot({ path: `${ordner}/joystick-${format.name}-rennen.png` });
        await page.mouse.move(mitte.x - 20, mitte.y - 20, { steps: 3 });
        await page.waitForTimeout(400);
        await page.screenshot({ path: `${ordner}/joystick-${format.name}-gehen.png` });
        await page.mouse.up();
      }
    });
  });
}
