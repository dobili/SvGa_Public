/**
 * Oberflächentests der freischaltbaren Extras (Gamifizierung P7): Die Profilkarte „Deine Extras“
 * zeigt gesperrte Extras mit Bedingung; in den Einstellungen steht der Figurensatz „Gold“
 * gesperrt mit „Ab Stufe 5“ und lässt sich nicht wählen; nach einer Probe-Stufe auf der
 * Aufgabenseite sind die Konfettifarben wählbar, der Bronzerahmen noch nicht.
 */
import { expect, test, type Page } from "@playwright/test";
import { oeffneEinstellungen, oeffneProfil, starteImBrowser } from "./hilfen";

/** Öffnet das Profil frisch (Neuladen beginnt beim Buch) und liefert die Karte der Extras. */
async function extraskarte(page: Page) {
  await page.goto("/app/");
  await page.reload();
  await oeffneProfil(page);
  const karte = page.getByTestId("extras");
  await expect(karte.getByRole("heading", { name: "Deine Extras" })).toBeVisible();
  return karte;
}

test("Gesperrte Extras zeigen ihre Bedingung; nach der Probe-Stufe sind die Konfettifarben wählbar", async ({
  page,
}) => {
  await starteImBrowser(page);
  let karte = await extraskarte(page);
  const konfetti = karte.getByTestId("extra-konfetti-bunt");
  await expect(konfetti).toContainText("Ab Stufe 2");
  await expect(konfetti.getByRole("button")).toHaveCount(0);
  await expect(karte.getByTestId("extra-brett-nacht-gold")).toContainText(
    "Mit allen Orden der Buchteile",
  );
  await karte.scrollIntoViewIfNeeded();
  await page.screenshot({ path: "test-results/bilder/extras-gesperrt.png" });

  // Einstellungen: „Gold“ ist gesperrt und bleibt bei einem Tipp ungewählt.
  await oeffneEinstellungen(page);
  const gold = page.getByRole("radio", { name: /Gold.*Ab Stufe 5/ });
  await expect(gold).toHaveAttribute("aria-disabled", "true");
  await gold.click({ force: true });
  await expect(gold).toHaveAttribute("aria-checked", "false");

  // Probe auf der Aufgabenseite: nächste Stufe (Stufe 2).
  await page.goto("/app/#aufgaben");
  await page.reload();
  const probe = page.getByTestId("abzeichen-probe");
  await probe.locator("summary").click();
  await probe.getByRole("button", { name: "Nächste Stufe erreichen" }).click();

  karte = await extraskarte(page);
  await karte.getByRole("button", { name: "Bunte Konfettifarben: Wählen" }).click();
  await expect(karte.getByRole("button", { name: "Bunte Konfettifarben: Ablegen" })).toBeVisible();
  await expect(karte.getByTestId("extra-rahmen-bronze")).toContainText("Ab Stufe 3");
  await karte.scrollIntoViewIfNeeded();
  await page.screenshot({ path: "test-results/bilder/extras-frei.png" });
});

test("Ein gewählter Rahmen erscheint am Porträt und bleibt auch ohne Bedingung (nie wegnehmen)", async ({
  page,
}) => {
  await page.addInitScript(() => {
    try {
      window.localStorage.setItem("svga.portraetrahmen", "gold");
    } catch (fehler) {
      console.warn("Merker nicht schreibbar:", fehler);
    }
  });
  await starteImBrowser(page);
  const karte = await extraskarte(page);
  await expect(page.getByTestId("profilkarte").getByTestId("spielerbild")).toHaveAttribute(
    "data-rahmen",
    "gold",
  );
  await karte.getByRole("button", { name: "Rahmen Gold: Ablegen" }).click();
  await expect(page.getByTestId("profilkarte").getByTestId("spielerbild")).toHaveAttribute(
    "data-rahmen",
    "ohne",
  );
  // Abgelegt und ohne Stufe 9: jetzt wieder gesperrt.
  await expect(karte.getByTestId("extra-rahmen-gold")).toContainText("Ab Stufe 9");
});
