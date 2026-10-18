/**
 * Gemeinsame Schritte der Oberflächentests: App im Browser starten, Abbildung öffnen, ein
 * Werkzeug wählen (seit dem Werkzeug-Umbau 0.2.30 über Symbol am Brett, Bündel und Reiter).
 */
import { expect, type Locator, type Page } from "@playwright/test";

/**
 * Alles, was gerade als Werkzeug gewählt ist: Bündel in der Leiste und Symbole am Brett (seit
 * 0.2.30 sitzen Ziehen, Engine, Röntgen und Warnsignale am Brett). Leer, wenn nichts gewählt ist.
 */
export function gewaehlteWerkzeuge(seite: Page): Locator {
  return seite.locator(
    ".werkzeugleiste [aria-pressed='true'], .brettwerkzeug[aria-pressed='true']",
  );
}

/** Öffnet die Startseite des Buches und wählt im Installationsteil „Im Browser verwenden“. */
export async function starteImBrowser(seite: Page): Promise<void> {
  await seite.goto("/");
  await expect(seite.getByRole("heading", { name: "Schach von Grund auf" })).toBeVisible();
  await seite.getByRole("link", { name: "Im Browser verwenden" }).click();
  await expect(seite).toHaveURL(/\/app\/$/);
  await expect(seite.getByRole("heading", { name: "Buch" })).toBeVisible();
}

/** Tippt eine Abbildungsnummer ins Nummernfeld und öffnet sie. */
export async function oeffneAbbildung(seite: Page, eingabe: string, nummer: string): Promise<void> {
  await seite.getByLabel("Abbildung öffnen").fill(eingabe);
  await seite.getByRole("button", { name: "Öffnen", exact: true }).click();
  await expect(seite.getByRole("heading", { name: `Abb. ${nummer}` })).toBeVisible();
  // Die Überschrift steht schon da, während das Kapitel noch lädt; erst mit dem Brett läuft auch
  // die Uhr für „angesehen“ (sonst spult page.clock.runFor ins Leere).
  await expect(seite.locator(".bildschirm-abbildung .brettbereich")).toBeVisible();
}

/** Wartet, bis der Service Worker alle Dateien geladen hat (Einstellungen: „Offline bereit“). */
export async function warteAufOffline(seite: Page): Promise<void> {
  await seite.getByRole("button", { name: "Einstellungen", exact: true }).click();
  await expect(seite.getByTestId("offline-stand")).toHaveText("Offline bereit", {
    timeout: 30_000,
  });
  await seite.getByRole("button", { name: "Buch" }).click();
}

/** Bündel je Werkzeug, das nur als Reiter in einem Bündel steht (werkzeugordnung.ts). */
const BUENDEL_DES_WERKZEUGS: Readonly<Record<string, string>> = {
  Todsünden: "Eröffnung prüfen",
  Zielbilanz: "Eröffnung prüfen",
  Faktorenbilanz: "Eröffnung prüfen",
  Eröffnung: "Eröffnung prüfen",
  Prüffragen: "Fallencheck",
  "Falle?": "Fallencheck",
  Vorher: "Skelett-Röntgen",
  Felder: "Skelett-Röntgen",
  Bauern: "Skelett-Röntgen",
  Richtung: "Skelett-Röntgen",
  Figuren: "Skelett-Röntgen",
  "Wo?": "Planfindung",
  "Gegner?": "Planfindung",
  LAP: "Planfindung",
  Planbilanz: "Planfindung",
  "Erzwingende Züge": "Taktik",
  Ruhe: "Taktik",
  Motiv: "Taktik",
  "Sechs Regeln": "Endspiel",
  Opposition: "Endspiel",
  Schlüsselfelder: "Endspiel",
  Quadrat: "Endspiel",
  Elementarmatt: "Endspiel",
  Turmendspiel: "Endspiel",
  Erkennungsbild: "Endspiel",
  Erfassen: "Denkroutine",
  Phase: "Denkroutine",
  Kandidaten: "Denkroutine",
  Sicherheitsblick: "Denkroutine",
};

/**
 * Wählt ein Werkzeug wie ein Leser: Symbol am Brett oder Bündel in der Leiste (falls nötig über
 * „◀ frühere“ oder „spätere ▶“), dann den Reiter. Klappt die Karte danach ganz auf („Mehr …“),
 * damit die Tests alle Befunde sehen.
 * Beispiel: waehleWerkzeug(seite, "Planbilanz") → „Planfindung“, Reiter „Planbilanz“.
 */
export async function waehleWerkzeug(seite: Page, name: string): Promise<void> {
  const buendel = BUENDEL_DES_WERKZEUGS[name];
  if (!buendel) {
    await seite.getByRole("button", { name, exact: true }).click();
  } else {
    const knopf = seite.getByRole("button", { name: buendel, exact: false }).first();
    for (const zuschalter of [
      "frühere Werkzeuge zeigen (aus früheren Kapiteln)",
      "spätere Werkzeuge als Vorschau zeigen (aus späteren Kapiteln)",
    ]) {
      if ((await knopf.count()) > 0) break;
      const z = seite.getByRole("button", { name: zuschalter });
      if ((await z.count()) > 0 && (await z.getAttribute("aria-pressed")) !== "true")
        await z.click();
    }
    if ((await knopf.getAttribute("aria-pressed")) !== "true") await knopf.click();
    const reiter = seite.getByRole("tab", { name, exact: false });
    if ((await reiter.count()) > 0) await reiter.first().click();
  }
  await zeigeAlles(seite);
}

/** Eine Karte hat drei Stufen, „Mehr …“ steht also höchstens zweimal da (ui/komponenten/stufen.ts). */
const HOECHSTENS_MEHR = 2;

/** Klappt die Werkzeugkarte ganz auf: „Mehr …“, bis alle Stufen zu sehen sind. */
export async function zeigeAlles(seite: Page): Promise<void> {
  const mehr = seite.getByTestId("werkzeugkarte").getByRole("button", { name: "Mehr …" });
  for (let stufe = 0; stufe < HOECHSTENS_MEHR; stufe += 1) {
    if ((await mehr.count()) === 0) return;
    await mehr.click();
  }
}

/** Klappt einen Abschnitt der Kapitelübersicht auf (seit 0.2.82 anfangs eingeklappt). */
export async function klappeAbschnittAuf(seite: Page, nummer: string): Promise<void> {
  const titel = seite.getByRole("heading", { name: new RegExp(`^${nummer.replace(".", "\\.")} `) });
  await titel.click();
  await expect(seite.locator("details.abschnittsklappe[open]").filter({ has: titel })).toHaveCount(
    1,
  );
}
