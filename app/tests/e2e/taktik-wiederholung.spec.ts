/**
 * Taktiktrainer mit bestimmten Aufgaben über fällige Wiederholungskarten (Vortest der offenen
 * Testpunkte, 17.11.2026): Abb. 7.14 mit mehreren Motiven, Abb. 7.60 mit einem gleich schnellen
 * Matt (Dh1+ statt Dh5+), Abb. 7.11 mit einem langsameren Matt, eine Lichess-Zusatzaufgabe mit
 * falschem Zug. Warum über Karten: Eine Runde wählt Aufgaben zufällig; fällige Karten öffnen
 * genau diese Aufgaben („Wiederholen“ auf der Startkarte).
 * Regeln: training/taktikalternativen.ts (gleich schnelle Matts), analyse/k7-motiv.ts (Motive).
 */
import { expect, test, type Page } from "@playwright/test";
import { starteImBrowser } from "./hilfen";
import { setzeDaten } from "./zustand";

const FAELLIG = { kasten: 1, faellig: "2026-11-01T09:00:00.000Z", verlauf: [] };

const feld = (seite: Page, name: string) =>
  seite.locator(".brett-tasten").getByRole("button", { name: new RegExp(`^${name}(,|$)`) });

/** Zieht von Feld zu Feld und wartet, bis der Gegenzug der App gespielt ist. */
async function ziehe(seite: Page, von: string, nach: string, stand: RegExp): Promise<void> {
  await feld(seite, von).click();
  await feld(seite, nach).click();
  await expect(seite.getByTestId("trainerrunde")).toContainText(stand);
}

/** Legt die Karten als fällig an und startet „Wiederholen“ im Taktiktrainer. */
async function wiederhole(seite: Page, aufgaben: readonly string[]): Promise<void> {
  const karten = Object.fromEntries(aufgaben.map((a) => [`taktik:${a}`, FAELLIG]));
  await setzeDaten(seite, { karten });
  await seite
    .getByRole("navigation", { name: "Hauptbereiche" })
    .getByRole("button", { name: "Training" })
    .click();
  await seite.getByTestId("faellig").getByRole("button", { name: "Durchgehen" }).click();
  await seite.getByRole("button", { name: /^Wiederholen/ }).click();
}

test("Mehrere Motive, gleich schnelles Matt, langsameres Matt (N2594, N2595)", async ({ page }) => {
  await starteImBrowser(page);
  await wiederhole(page, ["taktik-b-7.14", "taktik-b-7.60", "taktik-b-7.11"]);
  const runde = page.getByTestId("trainerrunde");
  const motiv = page.getByTestId("motiv-benennen").locator("select");
  // Abb. 7.14: Th8+ Kxh8 Sxf7+ Kg8 Sxd6; „Doppelangriff“ ist richtig, Hinlenkung auch dabei.
  await expect(runde).toContainText("Abb. 7.14");
  await ziehe(page, "h1", "h8", /Th8\+|Kxh8|Schwarz am Zug|Weiß am Zug/);
  await ziehe(page, "g5", "f7", /Weiß am Zug/);
  await ziehe(page, "f7", "d6", /Richtig! Lösung/);
  await motiv.selectOption({ label: "Doppelangriff" });
  await expect(runde).toContainText("Richtig! Ebenfalls dabei: Hinlenkung.");
  await runde.getByRole("button", { name: "Weiter" }).click();
  // Abb. 7.60: nach 1. Th8+ Kxh8 auch 2. Dh1+ Kg8 3. Dh7# (gleich schnell wie Dh5+).
  await expect(runde).toContainText("Abb. 7.60");
  await ziehe(page, "h1", "h8", /Weiß am Zug/);
  await ziehe(page, "d5", "h1", /Weiß am Zug/);
  await expect(runde).not.toContainText("Nicht ganz");
  await ziehe(page, "h1", "h7", /Richtig! Lösung/);
  await runde.getByRole("button", { name: "Weiter" }).click();
  // Abb. 7.11: Sc5+ setzt langsamer matt als das Doppelschach Sd6+ und bleibt falsch.
  await expect(runde).toContainText("Abb. 7.11");
  await feld(page, "e4").click();
  await feld(page, "c5").click();
  await expect(runde).toContainText("Nicht ganz");
  await expect(runde).toContainText("Dein Zug Sc5+ ist laut Engine schwächer als die Lösung");
  // Danach die Lösung Sd6+ Kf8 Te8# und ein falsches Motiv: Die Meldung nennt das zutreffende
  // (bei mehreren „Zutreffend waren: …“).
  await ziehe(page, "e4", "d6", /Weiß am Zug/);
  await ziehe(page, "e1", "e8", /Lösung/);
  await motiv.selectOption({ label: "Fesselung" });
  await expect(runde).toContainText("Nicht ganz. Das Motiv: Doppelschach.");
});

test("Lichess-Zusatzaufgabe: falscher Zug mit rotem Pfeil und Verlust laut Engine (N1075)", async ({
  page,
}) => {
  await starteImBrowser(page);
  await wiederhole(page, ["lichess:KPAlR"]);
  const runde = page.getByTestId("trainerrunde");
  // Der Gegnerzug 24. Txd3 wird vorgespielt; Schwarz zieht. Richtig wäre Txf1+.
  await expect(runde).toContainText("Schwarz am Zug");
  await expect(feld(page, "d3")).toHaveAttribute("aria-label", /Turm \(Weiß\)/);
  await feld(page, "h5").click();
  await feld(page, "h4").click();
  await expect(runde).toContainText("Nicht ganz");
  await expect(runde).toContainText(/laut Engine/);
  await expect(runde).toContainText("roter Pfeil");
});
