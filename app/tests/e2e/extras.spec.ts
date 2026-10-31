/**
 * Oberflächentests der freischaltbaren Extras (Gamifizierung P7, Profilkarte neu nach Entwurf E1
 * „Ankleide“ seit 31.10.2026): Die Karte zeigt oben die Vorschau, darunter je Art einen Reiter;
 * gesperrte Extras stehen abgedunkelt mit Schloss und Bedingung da. In den Einstellungen steht
 * der Figurensatz „Gold“ gesperrt mit „Ab Stufe 5“ und lässt sich nicht wählen. Nach einer
 * Probe-Stufe auf der Aufgabenseite legt Antippen die bunten Konfettifarben an, erneutes Antippen
 * legt sie ab; der Bronzerahmen bleibt gesperrt.
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

test("Gesperrte Extras zeigen ihre Bedingung; nach der Probe-Stufe legt Antippen die Konfettifarben an", async ({
  page,
}) => {
  await starteImBrowser(page);
  let karte = await extraskarte(page);
  await expect(karte.getByTestId("extras-buehne")).toContainText("So siehst du gerade aus");
  await expect(karte.getByTestId("extra-rahmen-bronze")).toContainText("Ab Stufe 3");
  await karte.getByRole("tab", { name: "Konfetti" }).click();
  const konfetti = karte.getByTestId("extra-konfetti-bunt");
  await expect(konfetti).toContainText("Ab Stufe 2");
  await expect(konfetti).toHaveAttribute("aria-disabled", "true");
  await karte.getByRole("tab", { name: "Brett" }).click();
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
  await karte.getByRole("tab", { name: "Konfetti" }).click();
  await karte.getByRole("button", { name: "Bunte Konfettifarben: antippen zum Anlegen" }).click();
  const angelegt = karte.getByRole("button", { name: /Bunte Konfettifarben: angelegt/ });
  await expect(angelegt).toHaveAttribute("aria-pressed", "true");
  await expect(karte.getByTestId("extras-buehne")).toContainText("Bunt");
  await karte.scrollIntoViewIfNeeded();
  await page.screenshot({ path: "test-results/bilder/extras-frei.png" });
  await angelegt.click();
  await expect(karte.getByTestId("extra-konfetti-bunt")).toHaveAttribute("aria-pressed", "false");
  await karte.getByRole("tab", { name: "Rahmen" }).click();
  await expect(karte.getByTestId("extra-rahmen-bronze")).toContainText("Ab Stufe 3");
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
  await expect(karte.getByTestId("extra-rahmen-gold")).toContainText("Angelegt");
  await karte.getByRole("button", { name: "Rahmen ablegen" }).click();
  await expect(page.getByTestId("profilkarte").getByTestId("spielerbild")).toHaveAttribute(
    "data-rahmen",
    "ohne",
  );
  // Abgelegt und ohne Stufe 9: jetzt wieder gesperrt.
  await expect(karte.getByTestId("extra-rahmen-gold")).toContainText("Ab Stufe 9");
  await expect(karte.getByRole("button", { name: "Rahmen ablegen" })).toHaveCount(0);
});
