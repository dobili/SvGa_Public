/**
 * Angesprochene Statisten bleiben stehen (Befund vom 20.11.2026, CI-Wackler „Statist im
 * Bergladen“): Die Ladenhilfe lief alle vier, fünf Sekunden weg und kam wieder. Ein Tipp auf
 * „Sprechen“ in diesem Augenblick ging ins Leere, eine offene Sprechblase schloss sich mitten im
 * Satz. Die Meldung „Deine ersten Münzen!“, die zur selben Zeit kam, war Zufall: Auch ohne sie lief
 * der Statist weg (Messung mit Protokoll der Treffer).
 *
 * Jetzt bleibt ein stehender Statist stehen, solange der Held still vor ihm steht und ihn ansieht
 * (oberwelt/belebungsbewegung.ts, hoertZu). Geprüft mit der Tastatur, dem Finger und der Maus,
 * auch während die Meldung steht.
 */
import { expect, test, type Page } from "@playwright/test";
import { EINLEITUNG_GESEHEN, GRUNDSTAND, starteMitStand } from "./abenteuer-affe";
import { feldDarunter } from "./abenteuer-karte";

/** Länger als zwei Laufwege der Ladenhilfe (Pause 2 bis 6 s, dann vier Kacheln). */
const LANGE_MS = 12000;

/** Vor der Ladenhilfe im Bergladen, die Hinweise zur Steuerung schon gesehen. */
function standVorLadenhilfe(muenzenErklaert: boolean) {
  return {
    ...GRUNDSTAND,
    muenzen: 50,
    position: {
      karte: "summitCity.bergladen",
      ...feldDarunter("summit-city-bergladen", "ladenhilfe"),
      richtung: "oben",
    },
    dialogvariablen: {
      ...EINLEITUNG_GESEHEN,
      hinweisSteuerkreuz: true,
      hinweisAktion: true,
      hinweisTagebuch: true,
      hinweisMenue: true,
      ...(muenzenErklaert ? { muenzenErklaert: true } : {}),
    },
  };
}

/** Wartet auf „Sprechen“ und schließt die Sprechblase, die der Tipp bringt. */
async function sprichUndSchliesse(seite: Page): Promise<void> {
  const blase = seite.getByTestId("abenteuer-sprechblase");
  await expect(blase).toBeVisible();
  await blase.getByRole("button", { name: "Weiter" }).click();
  await expect(blase).toHaveCount(0);
}

test("Die Ladenhilfe bleibt stehen, solange der Held sie ansieht", async ({ page }) => {
  await starteMitStand(page, standVorLadenhilfe(true));
  const aktion = page.getByTestId("abenteuer-aktion");
  await expect(aktion).toHaveText("Sprechen", { timeout: 30000 });
  // Vorher verschwand „Sprechen“ nach wenigen Sekunden, weil die Ladenhilfe weglief.
  const weg = await page.evaluate(
    (dauer) =>
      new Promise<boolean>((fertig) => {
        const knopf = document.querySelector<HTMLElement>("[data-testid='abenteuer-aktion']");
        const beob = new MutationObserver(() => knopf?.hidden && fertig(true));
        if (knopf) beob.observe(knopf, { attributes: true });
        setTimeout(() => fertig(false), dauer);
      }),
    LANGE_MS,
  );
  expect(weg).toBe(false);
  // Mit der Tastatur: Fokus auf den Knopf, Eingabe.
  await aktion.focus();
  await page.keyboard.press("Enter");
  await sprichUndSchliesse(page);
});

test("Während die Münz-Erklärung steht, bringt „Sprechen“ den nächsten Satz", async ({ page }) => {
  // Wie der Wackler in CI: Mit dem ersten Satz ändert sich der Spielstand, und die Erklärung
  // „Deine ersten Münzen!“ erscheint; solange sie steht, wird „Sprechen“ getippt (Finger, Maus).
  await starteMitStand(page, standVorLadenhilfe(false));
  const aktion = page.getByTestId("abenteuer-aktion");
  await expect(aktion).toHaveText("Sprechen", { timeout: 30000 });
  await aktion.click();
  await expect(page.getByTestId("abenteuer-meldung")).toBeVisible();
  await sprichUndSchliesse(page);
  await expect(page.getByTestId("abenteuer-meldung")).toBeVisible();
  await aktion.tap();
  await sprichUndSchliesse(page);
  await aktion.click();
  await sprichUndSchliesse(page);
});
