/**
 * Verlaufskurve der Auswertung mit dem Finger (Vortest der offenen Testpunkte, 17.11.2026,
 * N2325): Finger halten und fahren zeigt den Zug über der Kurve, Loslassen springt dorthin,
 * zwei Finger auseinander zoomen den Ausschnitt. Die Berührungen erzeugt eine CDP-Sitzung (nur
 * Chromium), wie beim Zwei-Finger-Test der Variantenkarte (varianten-stufe2.spec.ts).
 * Regel: auswertung/useKurvenzoom.ts.
 */
import { expect, test } from "@playwright/test";
import { oeffnePartie } from "./auswertungpartie";
import { starteImBrowser } from "./hilfen";

/** Anteile der Kurvenbreite für die Finger. */
const ERSTER_ANTEIL = 0.3;
const ZWEITER_ANTEIL = 0.6;
const ZOOM_SCHRITTE = [20, 40, 60, 80];
/** Pause zwischen zwei Bewegungen der Finger (ms). */
const BEWEGUNG_MS = 50;

test("Kurve: Finger zeigt den Zug, Loslassen springt, zwei Finger zoomen (N2325)", async ({
  page,
  browserName,
}) => {
  test.skip(browserName !== "chromium", "Berührungen über CDP gibt es nur in Chromium");
  await page.setViewportSize({ width: 393, height: 851 });
  await starteImBrowser(page);
  await oeffnePartie(page, "hell");
  const kurve = page.getByTestId("verlaufskurve");
  await kurve.scrollIntoViewIfNeeded();
  const rahmen = await kurve.boundingBox();
  if (!rahmen) throw new Error("Kurve ohne Rechteck");
  const y = rahmen.y + rahmen.height / 2;
  const x = (anteil: number) => rahmen.x + rahmen.width * anteil;
  const cdp = await page.context().newCDPSession(page);
  const anzeige = page.locator(".verlaufskurve-finger");
  // Ein Finger: halten und fahren zeigt den Zug, Loslassen springt dorthin.
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: x(ERSTER_ANTEIL), y, id: 1 }],
  });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [{ x: x(ZWEITER_ANTEIL), y, id: 1 }],
  });
  await expect(anzeige).toHaveText(/\d+\./);
  const gezeigt = ((await anzeige.textContent()) ?? "").trim();
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  const markiert = page.getByTestId("partiezuege").locator('[aria-current="step"]');
  await expect(markiert).toHaveText(
    new RegExp(
      gezeigt
        .split(" ")
        .at(-1)
        ?.replace(/[+#?!]/g, "") ?? "",
    ),
  );
  // Zwei Finger auseinander: Der Ausschnitt ist nicht mehr die ganze Partie.
  const ganz = page.getByRole("button", { name: "Ganze Partie" });
  await expect(ganz).toHaveAttribute("aria-pressed", "true");
  // Der Sprung scrollt zum Brett; die Kurve deshalb neu ausmessen.
  await kurve.scrollIntoViewIfNeeded();
  const neu = await kurve.boundingBox();
  if (!neu) throw new Error("Kurve ohne Rechteck");
  const mitte = neu.x + neu.width / 2;
  const hoehe = neu.y + neu.height / 2;
  const finger = (abstand: number) => [
    { x: mitte - abstand, y: hoehe, id: 1 },
    { x: mitte + abstand, y: hoehe, id: 2 },
  ];
  // Unter Last kommen schnelle Bewegungen gebündelt an; deshalb mit Pausen und notfalls neu.
  await expect(async () => {
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: finger(10) });
    for (const abstand of ZOOM_SCHRITTE) {
      await page.waitForTimeout(BEWEGUNG_MS);
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: finger(abstand),
      });
    }
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await expect(ganz).toHaveAttribute("aria-pressed", "false", { timeout: 1000 });
  }).toPass({ timeout: 15_000 });
});
