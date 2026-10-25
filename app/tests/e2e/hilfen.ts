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

/**
 * Öffnet die Startseite des Buches und wählt im Installationsteil „Im Browser verwenden“.
 * Der Sieben-Tage-Hinweis für Safari (19.10.2026) ist dabei geschlossen, weil er sonst in jedem
 * Test auf dem iPhone oben stünde; geraete.spec.ts prüft ihn mit `safariHinweis: true`. Ebenso
 * die Startanimation (R39): Sie läge sonst 2,5 Sekunden über dem ersten Bildschirm;
 * brett.spec.ts prüft sie mit `startanimation: true`. Auch die Frage nach dem Rundgang beim ersten
 * Start (R52) gilt als schon gestellt; tour.spec.ts prüft sie mit `tourAngebot: true`.
 * Das Weitermachen nach dem Neuladen (V2, Merker svga.stapel) ist aus: Viele Tests laden neu und
 * erwarten danach das Buch wie ein neuer Start; durchstich.spec.ts und spielen.spec.ts prüfen es
 * mit `weitermachen: true`.
 */
export async function starteImBrowser(
  seite: Page,
  {
    safariHinweis = false,
    startanimation = false,
    tourAngebot = false,
    weitermachen = false,
  }: {
    safariHinweis?: boolean;
    startanimation?: boolean;
    tourAngebot?: boolean;
    weitermachen?: boolean;
  } = {},
): Promise<void> {
  if (!weitermachen) {
    // Vor jedem Laden der Seite, also auch nach page.reload(): kein gesicherter Stapel.
    await seite.addInitScript(() => {
      try {
        window.localStorage.removeItem("svga.stapel");
      } catch (fehler) {
        console.warn("Merker nicht löschbar:", fehler);
      }
    });
  }
  if (!tourAngebot) {
    await seite.addInitScript(() => {
      try {
        window.localStorage.setItem("svga.tour.angeboten", "ja");
      } catch (fehler) {
        console.warn("Merker nicht schreibbar:", fehler);
      }
    });
  }
  if (!startanimation) {
    await seite.addInitScript(() => {
      try {
        window.sessionStorage.setItem("svga.startanimation.sitzung", "ja");
      } catch (fehler) {
        console.warn("Sitzungsspeicher nicht schreibbar:", fehler);
      }
    });
  }
  if (!safariHinweis) {
    await seite.addInitScript(() => {
      try {
        window.localStorage.setItem("svga.safariHinweis", "aus");
      } catch (fehler) {
        console.warn("Merker nicht schreibbar:", fehler);
      }
    });
  }
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
 * „◀ frühere“ oder „spätere ▶“), dann den Reiter. Seit 0.2.85 zeigt die Karte gleich alle Befunde.
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
}

/** Klappt einen Abschnitt der Kapitelübersicht auf (seit 0.2.82 anfangs eingeklappt). */
export async function klappeAbschnittAuf(seite: Page, nummer: string): Promise<void> {
  const titel = seite.getByRole("heading", { name: new RegExp(`^${nummer.replace(".", "\\.")} `) });
  await titel.click();
  await expect(seite.locator("details.abschnittsklappe[open]").filter({ has: titel })).toHaveCount(
    1,
  );
}

/** Öffnet einen Trainer über Training › Karte › „Trainieren“. Beispiel: oeffneTrainer(seite, "taktik"). */
export async function oeffneTrainer(seite: Page, kennung: string): Promise<void> {
  await seite
    .getByRole("navigation", { name: "Hauptbereiche" })
    .getByRole("button", { name: "Training" })
    .click();
  // Ein Trainer für zwei Kapitel (Endspieltrainer) steht zweimal in der Liste: die erste Karte.
  await seite
    .getByTestId(`trainer-${kennung}`)
    .first()
    .getByRole("button", { name: "Trainieren" })
    .click();
  await expect(seite.getByTestId("trainer")).toBeVisible();
}
