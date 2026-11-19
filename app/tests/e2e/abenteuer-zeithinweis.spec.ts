/**
 * Schach-Abenteuer, Ambroses Zeit-Hinweis am Brett (anbindung/Zeithinweis.tsx, Wunsch des Autors
 * 19.11.2026): Wer in einer Partie mit Uhr deutlich schneller zieht als nötig, hört von Ambrose
 * „Lass dir Zeit“ (einen von vier Sätzen), unten in der Sprechblase.
 *
 * Aufbau: Clubkampf gegen Coach Delgado in Maple Falls (ganze Partie mit Zeitwahl; in kurzen
 * Formen gibt es keinen Hinweis), Schnellschach 10 + 5, nach einer ersten Nadel (vorher schweigt
 * Ambrose dazu; hier die von Cedar Creek, weil der Clubkampf in Maple Falls noch offen sein muss).
 * Ein Spieler mit Stockfish (abenteuer-zugwahl.ts) zieht auf eine ausgeglichene Stellung, in ein
 * bis zwei Sekunden; möglich wären bei 10 + 5 rund 25 Sekunden je Zug (regeln/zeithinweis.ts:
 * Restzeit / erwartete Züge + Zuschlag), also weit unter einem Drittel. Eine künstliche Uhr
 * braucht es nicht. Der Hinweis kommt frühestens nach dem zehnten eigenen Zug; der Test zieht
 * höchstens zwanzigmal.
 * Abhängigkeiten: abenteuer-affe.ts (Spielstand), abenteuer-karte.ts (Feld), abenteuer-zugwahl.ts.
 */
import { expect, test } from "@playwright/test";
import { EINLEITUNG_GESEHEN, GRUNDSTAND, starteMitStand } from "./abenteuer-affe";
import { feldDarunter } from "./abenteuer-karte";
import {
  beendeSpielerDesProzesses,
  liesPartieImBrowser,
  spielerDesProzesses,
  stellungNach,
  tippeZug,
} from "./abenteuer-zugwahl";

/** Im Clubraum vor Coach Delgado, bereit für den Clubkampf, mit der Nadel von Cedar Creek. */
const STAND = {
  ...GRUNDSTAND,
  position: {
    karte: "mapleFalls.clubraum",
    ...feldDarunter("maple-falls-clubraum", "coachDelgado"),
    richtung: "oben",
  },
  dialogvariablen: {
    ...EINLEITUNG_GESEHEN,
    clubBeigetreten: true,
    reiheSamBestanden: true,
    reiheJunoBestanden: true,
    nadelCedarCreek: 1,
  },
};
/** Die vier Sätze „zu schnell“ (inhalte/abenteuer/texte/de.json, tisch.ambrose.zuSchnell.*). */
const ZU_SCHNELL =
  /Du hast Zeit, mein Lehrling|Langsamer\. Die Uhr gibt dir mehr|Wer so schnell zieht|Erst denken, dann ziehen/;
/** So viele eigene Züge zieht der Test höchstens. */
const ZUEGE = 20;
/** Der Spieler zielt auf eine ausgeglichene Stellung, damit die Partie lange genug dauert. */
const AUSGEGLICHEN = 0;
const ENGINE_FRIST = 45_000;

test.afterAll(() => beendeSpielerDesProzesses());

test("Ambrose: „Lass dir Zeit“, wenn der Held mit 10 + 5 im Sekundentakt zieht", async ({
  page,
  browserName,
}) => {
  test.skip(browserName !== "chromium", "Spieler mit Stockfish nur einmal je Prozess");
  test.slow();
  const spieler = spielerDesProzesses();
  await starteMitStand(page, STAND);
  await page.getByTestId("abenteuer-aktion").click();
  const deckwahl = page.getByTestId("abenteuer-deckwahl");
  for (let i = 0; i < 40 && !(await deckwahl.isVisible()); i++) {
    const weiter = page.locator(".abenteuer-dialog-weiter");
    const wahl = page.locator(".abenteuer-dialog-wahlen button").first();
    if (await wahl.isVisible()) await wahl.click();
    else if (await weiter.isVisible()) await weiter.click();
    else await page.waitForTimeout(100);
  }
  await page.getByTestId("abenteuer-zeit-schnell").click();
  await page.getByTestId("abenteuer-deck-los").click();
  const hinweis = page.getByTestId("abenteuer-zeithinweis");
  for (let zug = 0; zug < ZUEGE; zug++) {
    await expect(page.getByTestId("partiestatus")).toHaveText("Du bist am Zug.", {
      timeout: ENGINE_FRIST,
    });
    const stand = await page.evaluate(liesPartieImBrowser);
    if (!stand || stand.ende !== null) break;
    await tippeZug(page, await spieler.waehle(stellungNach(stand), AUSGEGLICHEN));
    // Die Zeile steht einige Sekunden in der Blase; kurz nach dem Zug nachsehen.
    const da = await hinweis
      .waitFor({ timeout: 1500 })
      .then(() => true)
      .catch(() => false);
    if (da) break;
  }
  await expect(hinweis).toContainText(ZU_SCHNELL);
});
