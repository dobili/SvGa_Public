/**
 * Hilfsfunktionen der Oberflächentests für den Bildschirm „Spielen“ nach Entwurf J3 (31.10.2026):
 * Startseite mit „Schnell eine Partie“, Blatt „Partie einstellen“, Unterseiten über Kacheln mit
 * fester Startleiste.
 *
 * Warum eigene Datei: Viele Tests beginnen Partien über „Spielen“; der Weg dorthin steht so an
 * einer Stelle, und hilfen.ts bleibt unter 400 Zeilen.
 */
import { expect, type Locator, type Page } from "@playwright/test";

/** Der Bereich „Spielen“ über die Navigation unten. */
export async function oeffneSpielen(seite: Page): Promise<void> {
  await seite.getByRole("navigation").getByRole("button", { name: "Spielen" }).click();
  await expect(seite.getByTestId("spielen")).toBeVisible();
}

/** Die Karte „Schnell eine Partie“. */
export function vorschlagskarte(seite: Page): Locator {
  return seite.getByTestId("vorschlagskarte");
}

/** Das offene Blatt „Partie einstellen“. */
export function blatt(seite: Page): Locator {
  return seite.getByTestId("partie-einstellen");
}

/**
 * Öffnet das Blatt „Partie einstellen“: auf der Startseite über „Einstellen“, auf einer Unterseite
 * über die Zeile der Startleiste.
 */
export async function oeffnePartieEinstellen(seite: Page): Promise<Locator> {
  const leiste = seite.getByTestId("startleiste");
  if ((await leiste.count()) > 0) {
    await leiste.getByRole("button", { name: /Partie einstellen/ }).click();
  } else {
    await vorschlagskarte(seite).getByRole("button", { name: "Einstellen" }).click();
  }
  await expect(blatt(seite).getByRole("heading", { name: "Partie einstellen" })).toBeVisible();
  return blatt(seite);
}

/** Schließt das Blatt „Partie einstellen“. */
export async function schliessePartieEinstellen(seite: Page): Promise<void> {
  await blatt(seite).getByRole("button", { name: "Schließen" }).click();
  await expect(blatt(seite).getByRole("heading")).toHaveCount(0);
}

/** Ändert im Blatt etwas und schließt es wieder. */
export async function stelleEin(
  seite: Page,
  aenderung: (blatt: Locator) => Promise<void>,
): Promise<void> {
  const b = await oeffnePartieEinstellen(seite);
  await aenderung(b);
  await schliessePartieEinstellen(seite);
}

/** Nimmt den Haken „Gewertete Partie“ heraus. */
export async function ungewertet(seite: Page): Promise<void> {
  await stelleEin(seite, (b) => b.getByRole("checkbox", { name: /Gewertete Partie/ }).uncheck());
}

/** Beginnt die Partie über „Spielen“ auf der Karte „Schnell eine Partie“. */
export async function spieleVorschlag(seite: Page): Promise<void> {
  await vorschlagskarte(seite)
    .getByRole("button", { name: /^Spielen/ })
    .click();
}

/** Öffnet eine Unterseite über ihre Kachel („gegner“, „stufe“, „eigene“, „frei“). */
export async function oeffneSpielseite(seite: Page, kennung: string): Promise<void> {
  await seite.getByTestId(`spielkachel-${kennung}`).click();
}

/** Der Knopf „Spielen“ in der Startleiste einer Unterseite. */
export function startknopf(seite: Page): Locator {
  return seite.getByTestId("startleiste").getByRole("button", { name: /^Spielen/ });
}

/**
 * Beginnt eine Partie gegen die eigene Stufe (Vorgabe Stufe 1 · 1 · 1), wie früher „Partie
 * beginnen“ ohne Gegnerwahl; auf Wunsch ungewertet.
 */
export async function spieleEigeneStufe(seite: Page, ohneWertung = false): Promise<void> {
  await oeffneSpielseite(seite, "stufe");
  if (ohneWertung) await ungewertet(seite);
  await startknopf(seite).click();
}

/** Zurück zur Startseite von „Spielen“ über die Kopfzeile einer Unterseite. */
export async function zurueckZuSpielen(seite: Page): Promise<void> {
  await seite.locator(".kopfzeile").getByRole("button", { name: "Spielen", exact: true }).click();
}

/**
 * Beginnt aus einer eigenen Stellung (FEN) eine Partie gegen die eigene Stufe mit dieser Stufe in
 * allen Phasen (früher: FEN eingeben, Regler stellen, „Partie beginnen“ auf einer Seite).
 * `zwischendurch` läuft auf der Seite „Freie Partie“ vor dem Start (etwa eine axe-Prüfung).
 */
export async function spieleFenGegenStufe(
  seite: Page,
  fen: string,
  stufe: number,
  zwischendurch?: () => Promise<void>,
): Promise<void> {
  await oeffneSpielseite(seite, "stufe");
  for (const phase of ["Eröffnung", "Mittelspiel", "Endspiel"]) {
    await seite.getByLabel(new RegExp(`^${phase}:`)).fill(String(stufe));
  }
  await expect(seite.getByLabel(/^Mittelspiel:/)).toHaveValue(String(stufe));
  await zurueckZuSpielen(seite);
  await oeffneSpielseite(seite, "frei");
  await seite.getByText("Eigene Stellung eingeben (FEN)").click();
  await seite.getByLabel("Stellung als FEN").fill(fen);
  await seite.getByRole("button", { name: "Stellung übernehmen" }).click();
  if (zwischendurch) await zwischendurch();
  await startknopf(seite).click();
}

/** Öffnet im Blatt „Partie einstellen“ die Eröffnungswahl (Zeile „Eröffnung festlegen“). */
export async function oeffneEroeffnungswahl(seite: Page): Promise<Locator> {
  const b = await oeffnePartieEinstellen(seite);
  await b.getByRole("button", { name: /^Eröffnung festlegen/ }).click();
  return b;
}
