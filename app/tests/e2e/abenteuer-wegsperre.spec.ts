/**
 * Schach-Abenteuer, Wegsperren S15 bis S17 (docs/spiel/32_Wegsperren.md): Vor dem Übergang steht
 * das Testteam. Solange die Sperre zu ist, kommt am Übergang das Gespräch mit der Truppe, und der
 * Held bleibt auf der Karte; mit der Variable „…Durch“ wechselt die Karte. Geprüft an allen drei
 * Sperren und an beiden Fassungen des Diners (mit und ohne Neonschild).
 *
 * Nebenbei geprüft: Der Held geht in der Wegreihe direkt über der Figur vorbei, die unter dem Weg
 * steht (Figuren sperren nur ihre Fußkachel, oberwelt/figurbilder.ts), und das Dialogfenster hat
 * direkt nach dem Laden des Pakets noch seinen Rahmen (anbindung/pixelrahmen.ts). Meldungen
 * („Neu im Tagebuch: Das Testteam“) erscheinen erst nach dem Gespräch, nicht darüber
 * (oberwelt/meldungsstau.ts). Wo der offene Übergang nichts erzählt (S15, S17), blitzt vor dem
 * Kartenwechsel kein leeres Dialogfenster auf (dialog/stillesende.ts).
 * Die Partien selbst spielt abenteuer-wegsperre-partie.spec.ts.
 * Abhängigkeiten: abenteuer-wegsperren.ts (Tabelle der Sperren, gemeinsame Schritte).
 */
import { expect, test } from "@playwright/test";
import { liesSpeicherImBrowser, schreibeStandImBrowser, starteMitStand } from "./abenteuer-affe";
import { feldVon } from "./abenteuer-karte";
import {
  dateiname,
  foto,
  FOTO_MASSSTAB,
  geheZumRand,
  kachel,
  klickeDurch,
  SPERREN,
  standVor,
  startkachel,
  uebergangskachel,
  type Sperre,
} from "./abenteuer-wegsperren";

/** Höchstens so viele Dialogschritte bis zum Angebot. */
const MAX_SCHRITTE = 12;

/**
 * Lädt das Rahmenbild des Dialogfensters noch (`border-image`)? Läuft im Browser am Fenster.
 * Warum: Nach dem Laden des Pakets waren die Adressen der Pixelrahmen freigegeben, das Fenster
 * hatte keinen Grund mehr und die weiße Schrift stand auf der Karte (anbindung/pixelrahmen.ts).
 * Ohne Rahmenbild (kein Paketrahmen) gilt die Prüfung als bestanden.
 */
function rahmenbildLaedt(fenster: Element): Promise<boolean> {
  const adresse = /url\("(.*)"\)/.exec(getComputedStyle(fenster).borderImageSource)?.[1];
  if (!adresse) return Promise.resolve(true);
  return new Promise<boolean>((fertig) => {
    const bild = new Image();
    bild.onload = () => fertig(true);
    bild.onerror = () => fertig(false);
    bild.src = adresse;
  });
}

/**
 * Merkt im Browser, ob vor dem Kartenwechsel etwas aufblitzt: ein Dialogfenster, oder das
 * Steuerkreuz verschwindet, während die alte Karte noch steht (so sah der leere Dialog aus).
 * Sobald die alte Karte weg ist, hört die Beobachtung auf: Die neue Karte erscheint einige
 * Millisekunden vor ihrem Steuerkreuz (am Diner gemessen, 18.11.2026), das ist kein Aufblitzen.
 */
function beobachteAufblitzen(): void {
  const funde: string[] = [];
  (window as unknown as { aufblitzen: string[] }).aufblitzen = funde;
  const da = (auswahl: string) => document.querySelector(auswahl) !== null;
  const beobachter = new MutationObserver(() => {
    if (!da(".abenteuer-welt canvas")) {
      beobachter.disconnect();
      return;
    }
    if (da("[data-testid='abenteuer-dialog']")) funde.push("Dialogfenster");
    if (!da(".abenteuer-steuerkreuz")) funde.push("Steuerkreuz weg");
  });
  beobachter.observe(document.body, { subtree: true, childList: true });
}

test.use(FOTO_MASSSTAB);

for (const sperre of Object.values<Sperre>(SPERREN)) {
  test(`Wegsperre ${sperre.nr}: zu mit Gespräch, danach offen`, async ({ page, browserName }) => {
    test.skip(
      browserName !== "chromium",
      "Laufen mit gehaltener Taste nur in Chromium (wie Affentest)",
    );
    test.slow();
    // Die Figur unter dem Weg steht zwischen Start und Übergang: Der Held geht über sie hinweg.
    const unten = feldVon(sperre.karte, sperre.unten);
    const start = startkachel(sperre);
    const rand = feldVon(sperre.karte, sperre.uebergang).x;
    expect(Math.abs(unten.x - rand)).toBeLessThanOrEqual(Math.abs(start.x - rand));
    const dialog = page.getByTestId("abenteuer-dialog");
    const schild = page.getByTestId("abenteuer-ortsschild");
    const meldung = page.getByTestId("abenteuer-meldung");

    // Sperre zu: Am Übergang kommt die Truppe, „Später.“ lässt den Helden auf der Karte.
    await starteMitStand(page, standVor(sperre));
    await geheZumRand(page, sperre);
    await foto(page, `${dateiname(sperre)}_1_truppe`);
    await page.keyboard.down(sperre.taste);
    await expect(dialog).toContainText(sperre.erste, { timeout: 15000 });
    await page.keyboard.up(sperre.taste);
    await foto(page, `${dateiname(sperre)}_2_gespraech`);
    expect(await dialog.evaluate(rahmenbildLaedt)).toBe(true);
    const spaeter = dialog.getByRole("button", { name: "„Später.“" });
    for (let i = 0; i < MAX_SCHRITTE && !(await spaeter.isVisible()); i++) {
      await dialog.getByRole("button", { name: "Weiter" }).click();
    }
    await expect(dialog).toContainText(sperre.angebot);
    await foto(page, `${dateiname(sperre)}_3_angebot`);
    // Meldungen warten bis zum Ende des Gesprächs (meldungsstau.ts).
    await expect(meldung).toHaveCount(0);
    await spaeter.click();
    await expect(dialog).toContainText(sperre.spaeter);
    await dialog.getByRole("button", { name: "Weiter" }).click();
    await expect(dialog).toHaveCount(0);
    // Die Meldung von der Ankunft blieb stehen (unter dem Dialog verborgen); die aus dem Gespräch
    // folgt nach „Weiter“. Vorher überschrieb die zweite die erste.
    for (const text of sperre.meldungen) {
      await expect(meldung).toContainText(text);
      await meldung.getByRole("button").click();
    }
    await expect(meldung).toHaveCount(0);
    await expect(schild).toHaveText(sperre.schild);
    // Der Held steht auf dem Übergangsfeld am Kartenrand und kommt nicht weiter.
    expect(await kachel(page)).toBe(uebergangskachel(sperre));
    await foto(page, `${dateiname(sperre)}_4_gesperrt`);
    await expect
      .poll(async () => (await page.evaluate(liesSpeicherImBrowser)).abenteuer?.dialogvariablen)
      .toMatchObject({ [`${sperre.stamm}Gesehen`]: true, [`${sperre.stamm}Durch`]: false });

    // Sperre offen: derselbe Übergang wechselt die Karte.
    const offen = standVor(sperre, {
      [`${sperre.stamm}Gesehen`]: true,
      [`${sperre.stamm}Durch`]: true,
    });
    await expect.poll(() => page.evaluate(schreibeStandImBrowser, offen)).toBe(true);
    await page.reload();
    await expect(page.locator(".abenteuer-welt canvas")).toBeVisible({ timeout: 40000 });
    await expect.poll(() => kachel(page), { timeout: 10000 }).toBe(`${start.x},${start.y}`);
    await geheZumRand(page, sperre);
    await page.evaluate(beobachteAufblitzen);
    await page.keyboard.down(sperre.taste);
    if (sperre.zielerzaehlung) {
      // S16: Die Glasbrücke erzählt beim ersten Betreten; die Truppe kommt nicht mehr.
      await expect(dialog).toContainText(sperre.zielerzaehlung, { timeout: 15000 });
      await page.keyboard.up(sperre.taste);
      expect(await klickeDurch(page)).not.toContain(sperre.angebot);
      await expect(schild).toHaveText(sperre.zielschild, { timeout: 15000 });
      await foto(page, `${dateiname(sperre)}_5_offen`);
      return;
    }
    await expect(schild).toHaveText(sperre.zielschild, { timeout: 15000 });
    await page.keyboard.up(sperre.taste);
    await foto(page, `${dateiname(sperre)}_5_offen`);
    // Nichts blitzte auf, solange die alte Karte stand: kein leeres Dialogfenster.
    expect(
      await page.evaluate(() => (window as unknown as { aufblitzen: string[] }).aufblitzen),
    ).toEqual([]);
    await expect(dialog).toHaveCount(0);
  });
}
