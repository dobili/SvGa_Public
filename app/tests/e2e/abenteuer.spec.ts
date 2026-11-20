/**
 * Schach-Abenteuer, Prototyp (Schritt 5): Startkarte → Paket laden → Oberwelt → zum Brett laufen →
 * Dialog mit Ambrose → Partie der App mit Kartenleiste → zurück in die Welt (Partie läuft noch).
 * Die Welt ist ein Phaser-Canvas; geprüft wird über die React-Teile (Testkennungen) und die
 * Tastatur (Pfeile), die die Szene wie das Steuerkreuz behandelt.
 */
import { expect, test, type Page } from "@playwright/test";
import { EINLEITUNG_GESEHEN, GRUNDSTAND, starteMitStand } from "./abenteuer-affe";
import { ladeAbenteuerpaket, PAKET_FRIST_MS } from "./abenteuer-paket";

/**
 * Ein Spielstand oben auf dem Dachboden, wie ein neues Spiel bis zum 19.11.2026 begann: Seitdem
 * kommen davor die Einleitung vor dem Haus und die Ankunft im Wohnzimmer (Test „Einstieg“ unten).
 */
const DACHBODENSTAND = {
  ...GRUNDSTAND,
  position: { karte: "mapleFalls.dachboden", x: 2, y: 9, richtung: "unten" },
  besuchteOrte: ["mapleFalls"],
  gegenstaende: [],
  muenzen: 0,
  dialogvariablen: EINLEITUNG_GESEHEN,
};

/** Im offenen Dialog immer die erste Wahl, sonst „Weiter“, bis `fertig` gilt. */
async function klickeDurch(seite: Page, fertig: () => Promise<boolean>): Promise<void> {
  for (let i = 0; i < 60; i++) {
    if (await fertig()) return;
    const wahl = seite.locator(".abenteuer-dialog-wahlen button").first();
    if (await wahl.isVisible()) await wahl.click();
    else {
      const weiter = seite.locator(".abenteuer-dialog-weiter");
      if (await weiter.isVisible()) await weiter.click();
      else await seite.waitForTimeout(100);
    }
  }
}

/** Die Kachel des Helden („x,y“), die die Oberwelt in ein verstecktes Feld schreibt. */
async function kachel(seite: Page): Promise<string> {
  return (await seite.getByTestId("abenteuer-kachel").textContent()) ?? "";
}

/** Höchstens so viele Schritte je Weg (die Räume sind kleiner). */
const MAX_SCHRITTE = 20;

/**
 * Läuft Kachel für Kachel zum Ziel: Taste drücken, bis der Held die Kachel wechselt, loslassen,
 * prüfen. Gehaltene Tasten taugen nicht: WebKit auf dem iPhone fragt die Kachel zu selten ab, und
 * der Held lief am Ziel vorbei bis zur Wand (CI 8.11.2026).
 */
async function laufeBis(seite: Page, taste: string, ziel: string): Promise<void> {
  for (let i = 0; i < MAX_SCHRITTE && (await kachel(seite)) !== ziel; i++) {
    const vorher = await kachel(seite);
    await seite.keyboard.down(taste);
    try {
      await expect.poll(() => kachel(seite), { timeout: 3000, intervals: [20] }).not.toBe(vorher);
    } finally {
      await seite.keyboard.up(taste);
    }
    // Der Held beendet den angefangenen Schritt; erst danach zählt die Kachel.
    await seite.waitForTimeout(150);
  }
  await expect.poll(() => kachel(seite), { timeout: 2000 }).toBe(ziel);
}

test("vom Dachboden in die erste Partie und zurück", async ({ page }) => {
  // Der längste Weg der Abenteuertests (allein gut 40 s, mit dem Neuladen der Ergebniskarte, R6);
  // unter Last lief er in die 60 s.
  test.slow();
  // Seit der Einleitung (19.11.2026) beginnt ein neues Spiel vor dem Haus; dieser Test setzt
  // wie bisher oben auf dem Dachboden ein (Spielstand eingespielt), den Weg dorthin prüft „Einstieg“.
  await starteMitStand(page, DACHBODENSTAND);
  await expect(page.getByTestId("abenteuer-welt")).toBeVisible();
  await page.getByTestId("abenteuer-menueknopf").click();
  await expect(page.getByTestId("abenteuer-menue").getByTestId("abenteuer-name")).toHaveValue(
    "Kim",
  );
  // Musik und Geräusche (T1, T2): Regler und Stummschalter; stumm sperrt die Regler. Es gibt noch
  // keine Tondatei, das Spiel läuft trotzdem (fehlende Dateien bleiben still).
  const ton = page.getByTestId("abenteuer-ton");
  await expect(ton.getByTestId("abenteuer-ton-musik")).toHaveValue("60");
  await ton.getByTestId("abenteuer-ton-stumm").check();
  await expect(ton.getByTestId("abenteuer-ton-musik")).toBeDisabled();
  await ton.getByTestId("abenteuer-ton-stumm").uncheck();
  // Geräusche als Text (ton/untertitel.ts): eingeschaltet zeigt die Zeile gleich das Dauergeräusch
  // des Dachbodens; ausgeschaltet verschwindet sie.
  await ton.getByTestId("abenteuer-ton-untertitel").check();
  await expect(page.getByTestId("abenteuer-untertitel")).toContainText("[Wind pfeift am Fenster]");
  await ton.getByTestId("abenteuer-ton-untertitel").uncheck();
  await expect(page.getByTestId("abenteuer-untertitel")).toHaveCount(0);
  // Der Ton lädt im Hintergrund nach (paket/aktton.ts); am Ende liegt alles auf dem Gerät, die
  // Musik kommt beim ersten Hören dazu.
  await expect(ton.getByTestId("abenteuer-ladestand-menue")).toHaveText(
    "Spiel geladen. Musik kommt beim ersten Hören dazu.",
    { timeout: PAKET_FRIST_MS },
  );
  await page.getByRole("button", { name: "Weiterspielen" }).click();
  await expect(page.locator(".abenteuer-welt canvas")).toBeVisible({ timeout: 30000 });
  await page.waitForTimeout(800);

  // Dachboden (Umbau des Autors im Karteneditor, 16.11.2026): Der Held steht auf (2,9) vor dem
  // Treppenloch (1..2, 7..8); das Brett liegt auf dem runden Tisch unter dem Giebelfenster bei
  // (7,6), die Hutschachtel sperrt (5,9). Rechts bis (4,9), hinauf bis (4,5), rechts bis (6,5),
  // hinauf bis (6,4), rechts bis (7,4) und hinunter auf die Tischplatte (7,5); das Brett liegt dann
  // vor ihm.
  await expect.poll(() => kachel(page), { timeout: 10000 }).toBe("2,9");
  await laufeBis(page, "ArrowRight", "4,9");
  await laufeBis(page, "ArrowUp", "4,5");
  await laufeBis(page, "ArrowRight", "6,5");
  await laufeBis(page, "ArrowUp", "6,4");
  await laufeBis(page, "ArrowRight", "7,4");
  await laufeBis(page, "ArrowDown", "7,5");
  const aktion = page.getByTestId("abenteuer-aktion");
  await expect(aktion).toBeVisible({ timeout: 5000 });
  // WebKit auf dem iPhone lädt die Dialogdatei aus dem Zwischenspeicher manchmal langsam, und ein
  // Klick kann in einen Wechsel des Auslösers fallen; deshalb geduldig und notfalls noch einmal.
  await expect(async () => {
    const dialog = page.getByTestId("abenteuer-dialog");
    if (!(await dialog.isVisible())) await aktion.click();
    await expect(dialog).toBeVisible({ timeout: 3000 });
  }).toPass({ timeout: 20000 });
  await expect(page.getByTestId("abenteuer-dialog")).toContainText("Staub, Kisten");
  // Die Hauptquest hat beim Betreten begonnen und steht im Tagebuch; der Dialog bleibt offen.
  await page.getByTestId("abenteuer-tagebuchknopf").click();
  await expect(page.getByTestId("abenteuer-tagebuch")).toContainText("Das Brett auf dem Dachboden");
  await page.getByRole("button", { name: "Schließen" }).click();

  // Immer die erste Wahl, sonst „Weiter“, bis die Partie beginnt.
  for (let i = 0; i < 40; i++) {
    if (await page.getByTestId("partie").isVisible()) break;
    const wahl = page.locator(".abenteuer-dialog-wahlen button").first();
    if (await wahl.isVisible()) await wahl.click();
    else {
      const weiter = page.locator(".abenteuer-dialog-weiter");
      if (await weiter.isVisible()) await weiter.click();
      else await page.waitForTimeout(100);
    }
  }
  // Ambrose hat den Fingerzeig gegeben: Deckwahl vor der Partie, die Karte ins Deck.
  await expect(page.getByTestId("abenteuer-deckwahl")).toBeVisible({ timeout: 10000 });
  await page.getByRole("button", { name: "Fingerzeig" }).click();
  await page.getByRole("button", { name: "Mit 1 Karte spielen" }).click();
  await expect(page.getByTestId("partie")).toBeVisible({ timeout: 20000 });
  await expect(page.getByTestId("abenteuer-kartenleiste")).toBeVisible();
  // Spielhülle (docs/spiel/18): Kopf mit dem Gegner, Status in der Sprache der Geschichte, keine
  // Kopfzeile und keine Zugliste der App, kein „Brett drehen“.
  await expect(page.getByTestId("abenteuer-huelle-kopf")).toContainText("Ambrose");
  await expect(page.getByTestId("partiestatus")).toBeVisible();
  await expect(page.getByTestId("abenteuer-partie-aufgeben")).toBeVisible();
  // Testhilfe des Autors (nur außerhalb der Veröffentlichung): Gewinnen, Remis, Verlieren.
  await expect(page.getByTestId("abenteuer-test-sieg")).toBeVisible();
  await expect(page.getByTestId("abenteuer-test-niederlage")).toBeVisible();
  await expect(page.locator(".kopfzeile")).toHaveCount(0);
  await expect(page.locator(".zugliste-aufklappen")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Brett drehen" })).toBeHidden();
  // Die Karte spielen (Kartenfächer, docs/spiel/29): Antippen hebt sie heraus, „Ausspielen“
  // spielt sie. Die Engine markiert das Startfeld; die dauerhafte Karte glänzt, solange das gilt.
  const karte = page.getByTestId("abenteuer-karte-fingerzeig");
  await expect(karte).toHaveAttribute("data-ansicht", "hell", { timeout: 10000 });
  await expect(karte).toHaveAccessibleName("Fingerzeig, spielbar");
  await karte.click();
  await expect(page.getByTestId("abenteuer-karte-gross")).toContainText("Fingerzeig");
  await page.getByTestId("abenteuer-karte-ausspielen").click();
  await expect(page.getByTestId("abenteuer-karte-gross")).toHaveCount(0);
  await expect(karte).toHaveAttribute("data-ansicht", "glanz", { timeout: 20000 });
  // Antippen zeigt den Grund, warum sie jetzt nicht mehr geht; „Zurück“ schließt.
  await karte.click();
  await expect(page.getByTestId("abenteuer-karte-ausspielen")).toBeDisabled();
  await expect(page.getByTestId("abenteuer-karte-grund")).toBeVisible();
  await page.getByTestId("abenteuer-karte-zurueck").click();
  await expect(page.getByTestId("abenteuer-karte-gross")).toHaveCount(0);

  // Zurück in die Welt: Die Partie läuft noch, „Weiterspielen“ führt zur selben Partie.
  await page.goto("/app/#abenteuer");
  // Mit Spielstand öffnet sich die Welt von selbst, ohne Startkarte.
  await expect(page.getByText("Deine Partie läuft noch.")).toBeVisible({ timeout: 20000 });
  await page.getByRole("button", { name: "Weiterspielen" }).click();
  await expect(page.getByTestId("partie")).toBeVisible({ timeout: 20000 });

  // Testhilfe: „Gewinnen“ beendet die Partie, „Weiter“ führt in die Welt zur Ergebniskarte.
  await page.getByTestId("abenteuer-test-sieg").click();
  await expect(page.getByTestId("abenteuer-test-sieg")).toHaveCount(0);
  await page.getByTestId("partie-zurueck-zur-stadt").click();
  const ergebnis = page.getByTestId("abenteuer-ergebnis");
  await expect(ergebnis).toBeVisible({ timeout: 30000 });
  await expect(ergebnis).toContainText("Gewonnen gegen Ambrose");
  // Die Ergebniskarte übersteht das Neuladen (Spieltest „einstieg“, R6), ohne Startbild der App.
  await page.reload();
  await page.goto("/app/#abenteuer");
  await expect(ergebnis).toContainText("Gewonnen gegen Ambrose", { timeout: 30000 });
  await expect(page.getByTestId("startanimation")).toHaveCount(0);
  await ergebnis.getByRole("button", { name: "Weiter", exact: true }).click();
  await expect(ergebnis).toHaveCount(0);
  // Rückmeldung nach dem Ergebnis (Wunsch des Autors, 19.11.2026): Ambrose spricht von selbst,
  // je nach Ausgang (maple-falls-dachboden.nach_erster_partie). Vorher stand man ohne Reaktion da.
  const dialog = page.getByTestId("abenteuer-dialog");
  await expect(dialog).toContainText("Du hast gewonnen", { timeout: 20000 });
  // Neuladen mitten in der Rückmeldung (schwacher Spieler im Spieler-Durchlauf, 19.11.2026): Sie
  // geht danach wieder auf, statt verloren zu sein (oberwelt/nachergebnis.ts, rueckmeldungOffen).
  await page.reload();
  await page.goto("/app/#abenteuer");
  await expect(dialog).toContainText("Du hast gewonnen", { timeout: 30000 });
  for (let i = 0; i < 40 && (await dialog.isVisible()); i++) {
    const wahl = page.locator(".abenteuer-dialog-wahlen button").first();
    if (await wahl.isVisible()) await wahl.click();
    else {
      const weiter = page.locator(".abenteuer-dialog-weiter");
      if (await weiter.isVisible()) await weiter.click();
      else await page.waitForTimeout(100);
    }
  }
  await expect(dialog).toHaveCount(0);

  // „Meine Partien“ im Tagebuch: die Partie steht in der Liste, „Ansehen“ zeigt sie in der Hülle,
  // „Weiter“ führt zurück in die Welt (ohne neue Ergebniskarte).
  await page.getByTestId("abenteuer-tagebuchknopf").click();
  const liste = page.getByTestId("abenteuer-meine-partien");
  await expect(liste).toContainText("Gegen Ambrose: gewonnen");
  await liste.getByRole("button", { name: "Ansehen" }).click();
  await expect(page.getByTestId("partie")).toBeVisible({ timeout: 20000 });
  await expect(page.getByTestId("abenteuer-huelle-kopf")).toContainText("Ambrose");
  await expect(page.getByTestId("abenteuer-test-sieg")).toHaveCount(0);
  await page.getByTestId("partie-zurueck-zur-stadt").click();
  await expect(page.locator(".abenteuer-welt canvas")).toBeVisible({ timeout: 30000 });
  await expect(page.getByTestId("abenteuer-ergebnis")).toHaveCount(0);
});

test("Übergang von vorn: vom Dachboden über die Luke ins Zimmer des Helden", async ({ page }) => {
  // Befund des Autors (10.11.2026): Wer auf die Luke zuging und sie dann betrat, kam nicht hinunter,
  // weil der Blick auf den Auslöser schon als derselbe Treffer galt. Ein echter Spieler geht immer
  // von vorn auf einen Durchgang zu.
  await starteMitStand(page, DACHBODENSTAND);
  await page.waitForTimeout(800);
  await expect.poll(() => kachel(page), { timeout: 10000 }).toBe("2,9");
  // Seit dem Umbau des Autors (Karteneditor, 16.11.2026) liegt das Treppenloch auf (1..2, 7..8),
  // mit Geländer oben und rechts; man betritt es von Süden, über (1,8) und (2,8). Erst nach links,
  // zurück vor die Öffnung, dann von unten hinein: Der Held schaut die Öffnung vorher an.
  await laufeBis(page, "ArrowLeft", "1,9");
  await laufeBis(page, "ArrowRight", "2,9");
  await page.keyboard.down("ArrowUp");
  // Das Loch führt ins Zimmer des Helden im Obergeschoss. Dort kommt der Held neben der Treppe zum
  // Dachboden an, auf (3,6) mit Blick nach rechts (festes Ankunftsfeld); auf dem Dachboden erreicht
  // die gehaltene Taste (3,6) nicht, die Kachel zeigt also den Kartenwechsel. Die gehaltene Taste
  // zählt dort erst nach einer kurzen Pause.
  await expect.poll(() => kachel(page), { timeout: 8000, intervals: [50] }).toBe("3,6");
  await page.keyboard.up("ArrowUp");
  // Das Ortsschild nennt die neue Karte (Spieltest „einstieg“, R1).
  await expect(page.getByTestId("abenteuer-ortsschild")).toHaveText("Dein Zimmer");
});

test("Steuerkreuz: mit gedrücktem Daumen von ▼ auf ▶ gleiten wechselt die Richtung (19.11.2026)", async ({
  page,
}) => {
  // Ohne den Safari-Hinweis: Auf dem iPhone schiebt er das Spiel so weit hinunter, dass das
  // Steuerkreuz unter dem Bildschirmrand läge (eigene Prüfung in geraete.spec.ts).
  await page.addInitScript(() => window.localStorage.setItem("svga.safariHinweis", "aus"));
  // Auf dem Dachboden (Spielstand eingespielt): Ein neues Spiel beginnt seit dem 19.11.2026 mit
  // der Einleitung, deren Dialog das Steuerkreuz verdeckt.
  await starteMitStand(page, DACHBODENSTAND);
  const kreuz = page.locator(".abenteuer-steuerkreuz");
  // ▼ statt ▲: Oben liegt die Luke; der Wechsel in das Zimmer überdeckte im CI-Lauf 44487375007
  // das Kreuz, bevor der Finger ▶ erreichte. Unten ist Wand, der Held bleibt auf dem Dachboden.
  const unten = kreuz.locator('[data-richtung="unten"]');
  const rechts = kreuz.locator('[data-richtung="rechts"]');
  const mitte = async (ort: typeof unten) => {
    const box = await ort.boundingBox();
    if (!box) throw new Error("Taste ohne Lage");
    return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
  };
  const a = await mitte(unten);
  const b = await mitte(rechts);
  await page.mouse.move(a.x, a.y);
  await page.mouse.down();
  await expect(unten).toHaveAttribute("data-gedrueckt", "ja");
  await page.mouse.move(b.x, b.y, { steps: 5 });
  await expect(rechts).toHaveAttribute("data-gedrueckt", "ja");
  await expect(unten).not.toHaveAttribute("data-gedrueckt", "ja");
  await page.mouse.up();
  await expect(kreuz.locator('[data-gedrueckt="ja"]')).toHaveCount(0);
  // Langer Druck (19.11.2026): keine Textauswahl, kein Kontextmenü des Browsers im Spiel.
  // WebKit kennt nur die Form mit Präfix und meldet „user-select“ als „auto“.
  const auswahl = await rechts.evaluate((knopf) => {
    const stil = getComputedStyle(knopf);
    return stil.getPropertyValue("-webkit-user-select") || stil.getPropertyValue("user-select");
  });
  expect(auswahl).toBe("none");
  const menueVerhindert = await rechts.evaluate((knopf) => {
    const ereignis = new MouseEvent("contextmenu", { bubbles: true, cancelable: true });
    knopf.dispatchEvent(ereignis);
    return ereignis.defaultPrevented;
  });
  expect(menueVerhindert).toBe(true);
});

test("Einstieg: Einleitung vor dem Haus, mit Mama hinein, Auftrag für den Dachboden (19.11.2026)", async ({
  page,
}) => {
  // Wunsch des Autors: nicht in die Geschichte geworfen werden. Ein neues Spiel beginnt vor dem
  // Haus; die Einleitung läuft von selbst, danach geht es mit Mama ins Wohnzimmer, wo sie die
  // Kiste auf den Dachboden schickt. Der Auftrag steht im Tagebuch.
  test.slow();
  await page.goto("/app/#abenteuer");
  await expect(page.getByTestId("abenteuer-start")).toBeVisible();
  await ladeAbenteuerpaket(page);
  await expect(page.getByTestId("abenteuer-spielen")).toBeVisible({ timeout: 30000 });
  // Namenswahl vor dem ersten Start (Schritt 8g); der Name steht später im Spielmenü.
  await page.getByTestId("abenteuer-name").fill("Kim");
  await page.getByTestId("abenteuer-spielen").click();
  await expect(page.getByTestId("abenteuer-welt")).toBeVisible();
  const dialog = page.getByTestId("abenteuer-dialog");
  await expect(dialog).toContainText("Ende August", { timeout: 30000 });
  // Durch die Einleitung bis ins Wohnzimmer, dort läuft die Ankunft von selbst.
  const imWohnzimmer = async () =>
    ((await dialog.textContent().catch(() => "")) ?? "").includes("Am Abend ist der Umzugswagen");
  await klickeDurch(page, imWohnzimmer);
  await expect(dialog).toContainText("Am Abend ist der Umzugswagen weg", { timeout: 20000 });
  await klickeDurch(page, async () => !(await dialog.isVisible()));
  await expect(dialog).toHaveCount(0);
  await page.getByTestId("abenteuer-tagebuchknopf").click();
  await expect(page.getByTestId("abenteuer-tagebuch")).toContainText("Einzug an der Birch Lane");
  await expect(page.getByTestId("abenteuer-tagebuch")).toContainText("Dachboden");
  await page.getByRole("button", { name: "Schließen" }).click();
  // Im Spielmenü steht der gewählte Name.
  await page.getByTestId("abenteuer-menueknopf").click();
  await expect(page.getByTestId("abenteuer-menue").getByTestId("abenteuer-name")).toHaveValue(
    "Kim",
  );
});
