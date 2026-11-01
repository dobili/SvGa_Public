/**
 * Gemeinsame Schritte der Oberflächentests: App im Browser starten, Abbildung öffnen, ein
 * Werkzeug wählen (seit dem Werkzeug-Umbau 0.2.30 über Symbol am Brett, Bündel und Reiter).
 */
import { expect, type Locator, type Page } from "@playwright/test";

/** Ein Versuch, eine Zeile der Startkarte zu bedienen (ms); danach neu versuchen. */
const VERSUCH_MS = 1500;
/** So lange darf eine Zeile der Startkarte brauchen, bis ihr Wert wählbar ist (ms). */
const ZEILE_WARTEN_MS = 20_000;

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
 * mit `weitermachen: true`. Der einmalige Maia-Hinweis beim ersten Bot (26.10.2026) gilt als
 * gezeigt; spielen.spec.ts prüft ihn mit `maiaHinweis: true`. Die Meldung neuer Abzeichen und
 * Stufen (Paket Abzeichen) schweigt, weil sie sonst nach der ersten Partie oder Übung vor dem
 * Brett läge; abzeichen.spec.ts prüft sie mit `abzeichenMeldung: true`.
 */
export async function starteImBrowser(
  seite: Page,
  {
    safariHinweis = false,
    startanimation = false,
    tourAngebot = false,
    weitermachen = false,
    maiaHinweis = false,
    abzeichenMeldung = false,
    sprachangebot = false,
  }: {
    safariHinweis?: boolean;
    startanimation?: boolean;
    tourAngebot?: boolean;
    weitermachen?: boolean;
    maiaHinweis?: boolean;
    abzeichenMeldung?: boolean;
    /** Das Angebot „auf Englisch umstellen?“ beim ersten Start (Nebenchat, 31.10.2026). */
    sprachangebot?: boolean;
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
  if (!maiaHinweis) {
    await seite.addInitScript(() => {
      try {
        window.localStorage.setItem("svga.maiaHinweis", "gezeigt");
      } catch (fehler) {
        console.warn("Merker nicht schreibbar:", fehler);
      }
    });
  }
  if (!abzeichenMeldung) {
    await seite.addInitScript(() => {
      try {
        window.localStorage.setItem("svga.abzeichenStill", "ja");
      } catch (fehler) {
        console.warn("Merker nicht schreibbar:", fehler);
      }
    });
  }
  if (!sprachangebot) {
    await seite.addInitScript(() => {
      try {
        window.localStorage.setItem("svga.sprachangebot", "gefragt");
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

/** Öffnet das Profil über die Leiste (seit 0.2.134 statt des Zahnrads). */
export async function oeffneProfil(seite: Page): Promise<void> {
  await seite
    .getByRole("navigation", { name: "Hauptbereiche" })
    .getByRole("button", { name: "Profil", exact: true })
    .click();
}

/** Öffnet die Einstellungen: Profil, dann der Knopf „Einstellungen“ oben (seit 0.2.134). */
export async function oeffneEinstellungen(seite: Page): Promise<void> {
  await oeffneProfil(seite);
  await seite.getByRole("button", { name: "Einstellungen", exact: true }).click();
}

/**
 * Öffnet eine Unterseite der Einstellungen über ihre Zeile unten (seit dem Entwurf K2, 31.10.2026):
 * „Bots und Wertung“, „Deine Daten“ oder „Über die App“.
 */
export async function oeffneEinstellungsseite(seite: Page, name: string): Promise<void> {
  await oeffneEinstellungen(seite);
  await seite.getByRole("button", { name: new RegExp(`^${name}`) }).click();
  await expect(seite.getByRole("heading", { level: 1, name })).toBeVisible();
}

/** Wartet, bis der Service Worker alle Dateien geladen hat („Über die App“: „Offline bereit“). */
export async function warteAufOffline(seite: Page): Promise<void> {
  await oeffneEinstellungsseite(seite, "Über die App");
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

/** Öffnet einen Trainer über Training › Karte des Trainers. Beispiel: oeffneTrainer(seite, "taktik"). */
export async function oeffneTrainer(seite: Page, kennung: string): Promise<void> {
  await seite
    .getByRole("navigation", { name: "Hauptbereiche" })
    .getByRole("button", { name: "Training" })
    .click();
  // Seit „Training neu“ (31.10.2026) ist die ganze Karte in der Wischreihe der Knopf.
  await seite.getByTestId(`trainer-${kennung}`).first().getByRole("button").click();
  await expect(seite.getByTestId("trainer")).toBeVisible();
}

/**
 * Wählt auf der Startkarte eines Trainers in einer Zeile einen Wert (Entwurf G1, 31.10.2026):
 * kurze Wahlen klappen als Chips auf, lange öffnen die Auswahlliste des Systems.
 * Beispiel: waehleInZeile(seite, "zeile-stufe", "Stufe 2"); waehleInZeile(seite, "zeile-motiv",
 * /^Fesselung/).
 */
export async function waehleInZeile(
  seite: Page,
  testkennung: string,
  wert: string | RegExp,
): Promise<void> {
  const zeile = seite.getByTestId(testkennung);
  const passt = (o: string) => (typeof wert === "string" ? o === wert : wert.test(o));
  await expect(zeile).toBeVisible();
  // Eine Zeile kann beim Laden der Daten ihre Form wechseln (erst wenige Chips, dann die lange
  // Auswahlliste, etwa die Motive des Taktiktrainers): so lange neu versuchen, bis der Wert da ist.
  await expect(async () => {
    const liste = zeile.locator("select");
    if ((await liste.count()) > 0) {
      const text = (await liste.locator("option").allTextContents()).find(passt);
      if (text === undefined) throw new Error(`„${String(wert)}“ fehlt in ${testkennung}`);
      await liste.selectOption({ label: text }, { timeout: VERSUCH_MS });
      return;
    }
    const chip = zeile.locator("button.chip", { hasText: wert });
    if ((await chip.count()) === 0) {
      await zeile.locator("button.startzeile").click({ timeout: VERSUCH_MS });
    }
    await chip.click({ timeout: VERSUCH_MS });
  }).toPass({ timeout: ZEILE_WARTEN_MS });
}

/** Tippt auf der Startkarte auf den großen Knopf „Runde starten …“. */
export async function starteRunde(seite: Page): Promise<void> {
  await seite.getByRole("button", { name: /^Runde starten/ }).click();
}

/**
 * Wählt auf der Startkarte die Übung (falls es mehrere gibt) und startet die Runde.
 * Beispiel: starteUebung(seite, "Feld finden").
 */
export async function starteUebung(seite: Page, uebung: string): Promise<void> {
  if ((await seite.getByTestId("zeile-uebung").count()) > 0)
    await waehleInZeile(seite, "zeile-uebung", uebung);
  await starteRunde(seite);
}

/**
 * Klappt einen Abschnitt der Woche in der Karte „Heute“ auf (Reiter „Aufträge“, „Plan“, „Ziele“;
 * seit der Gestaltung A2 vom 31.10.2026 zugeklappt). Bleibt offen, wenn er schon offen ist.
 * Beispiel: oeffneReiter(seite, "auftraege").
 */
export async function oeffneReiter(seite: Page, kennung: string): Promise<void> {
  const reiter = seite.getByTestId(`reiter-${kennung}`);
  if ((await reiter.getAttribute("aria-expanded")) !== "true") await reiter.click();
  await expect(reiter).toHaveAttribute("aria-expanded", "true");
}

/**
 * Lädt die App neu mit einem Sprungziel in der Adresse („/app/#aufgaben“), wie beim Öffnen eines
 * Links. Seit dem Fehlertest f3 (01.11.2026) folgt die offene App auch einem Sprung, bei dem sich
 * nur der Teil hinter „#“ ändert, und entfernt ihn dabei aus der Adresse; ein `page.reload()`
 * danach fände ihn nicht mehr. Der Umweg über eine leere Seite lädt die App deshalb ganz neu (mit
 * allen Startskripten aus `addInitScript`).
 */
export async function ladeMitSprung(seite: Page, adresse: string): Promise<void> {
  await seite.goto("about:blank");
  await seite.goto(adresse);
}
