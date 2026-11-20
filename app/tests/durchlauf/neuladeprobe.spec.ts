/**
 * Neuladeprobe des Spieler-Durchlaufs: ein Ding ansprechen, bei einer bestimmten Zeile mitten im
 * Gespräch die Seite neu laden, das Ding wieder ansprechen und bis zu einem Ziel durchtippen
 * (etwa dem Abspann). Ab einem simulierten Stand (aktstand.cjs, probe.ts).
 *
 * Warum: Die App sichert Dialogvariablen bei jedem neuen Knoten, Folgen wie Reise und Abspann aber
 * erst am Ende des Gesprächs. Ein Schalter am Anfang einer Szene sperrte nach dem Neuladen den Rest
 * (Ambroses Abschied, schwacher Spieler im Durchlauf, 19.11.2026). Die Probe zeigt im Browser,
 * dass die Szene nach dem Neuladen wieder beginnt und ihr Ziel erreicht.
 * Aufruf (nach npm run build):
 *   node pipeline/abenteuer/aktstand.cjs --bis finaleBesprochen --ziel /tmp/vorabschied.json
 *   PROBE_STAND=/tmp/vorabschied.json PROBE_KARTE=capitalArena.aussen PROBE_DING=treppe \
 *   PROBE_NEULADEN_BEI="Ich muss dir etwas sagen" PROBE_ZIEL=abenteuer-abspann CHROMIUM_PFAD=… \
 *   npx playwright test --config playwright.durchlauf.config.ts neuladeprobe
 * Ergebnis: Die erste Zeile nach dem Neuladen steht im Bericht; der Test scheitert, wenn das Ziel
 * nicht erscheint.
 * Abhängigkeiten: probe.ts, laufen.ts, lage.ts, welt.ts.
 */
import { expect, test, type Page } from "@playwright/test";
import { tippe, type Lauf } from "./eingabe";
import { geheAn } from "./laufen";
import { liesLage, liesStand } from "./lage";
import { KARTE, PROBE_MS, STAND, starteProbe } from "./probe";
import { kartenwissen, type Spieldaten } from "./welt";

const DING = process.env.PROBE_DING ?? "";
const NEULADEN_BEI = process.env.PROBE_NEULADEN_BEI ?? "";
const ZIEL = process.env.PROBE_ZIEL ?? "";
/** So lange darf es nach dem letzten Ansprechen bis zum Ziel dauern (ms). */
const ZIEL_FRIST_MS = 120_000;
/** So lange wartet die Probe nach dem Neuladen auf die Welt (ms). */
const WELT_FRIST_MS = 60_000;

/** Geht an das Ding und drückt den Aktionsknopf; wirft, wenn das nicht geht. */
async function sprichAn(lauf: Lauf, daten: Spieldaten): Promise<void> {
  const wissen = kartenwissen(daten, KARTE, await liesStand(lauf.seite));
  const ding = wissen.dinge.find((d) => d.name === DING);
  if (!ding) throw new Error(`${DING} steht nicht auf ${KARTE}`);
  expect(await geheAn(lauf, wissen, ding.felder)).toBe("aktion");
  await tippe(lauf, lauf.seite.getByTestId("abenteuer-aktion"), "Aktionsknopf");
}

/** Ein Schritt im offenen Dialog: erste Antwort oder „Weiter“. */
async function tippeWeiter(seite: Page): Promise<void> {
  const wahl = seite.locator(".abenteuer-dialog-wahlen button").first();
  const weiter = seite.locator(".abenteuer-dialog-weiter").last();
  const knopf = (await wahl.isVisible().catch(() => false)) ? wahl : weiter;
  await knopf.click({ timeout: 2000 }).catch(() => undefined);
  await seite.waitForTimeout(150);
}

test("Neuladen mitten im Gespräch", async () => {
  test.skip(!STAND || !KARTE || !DING || !ZIEL, "nur mit PROBE_STAND, _KARTE, _DING, _ZIEL");
  test.setTimeout(PROBE_MS);
  const { lauf, daten, browser } = await starteProbe("neuladeprobe");
  const seite = lauf.seite;
  await sprichAn(lauf, daten);
  let geladen = false;
  const ende = Date.now() + ZIEL_FRIST_MS;
  while (Date.now() < ende) {
    if (
      await seite
        .getByTestId(ZIEL)
        .isVisible()
        .catch(() => false)
    )
      break;
    const lage = await liesLage(seite);
    const text = lage.dialog?.text ?? "";
    if (!geladen && NEULADEN_BEI && text.includes(NEULADEN_BEI)) {
      geladen = true;
      await seite.reload();
      await seite.locator(".abenteuer-welt canvas").waitFor({ timeout: WELT_FRIST_MS });
      await seite.waitForTimeout(1000);
      await sprichAn(lauf, daten);
      await seite.getByTestId("abenteuer-dialog").first().waitFor({ timeout: 5000 });
      console.log(`Nach dem Neuladen: ${(await liesLage(seite)).dialog?.text ?? ""}`);
      continue;
    }
    if (lage.dialog) await tippeWeiter(seite);
    else await seite.waitForTimeout(300);
  }
  const erreicht = await seite
    .getByTestId(ZIEL)
    .isVisible()
    .catch(() => false);
  await browser.close();
  expect(geladen, `Zeile „${NEULADEN_BEI}“ kam nicht`).toBe(true);
  expect(erreicht, `${ZIEL} nach dem Neuladen nicht erreicht`).toBe(true);
});
