/**
 * Ansprechprobe des Spieler-Durchlaufs: auf einer Karte jede Figur und jeden Auslöser mit Dialog
 * (auch Gegenstände)
 * aufsuchen und nachsehen, ob der Aktionsknopf erscheint. Gespielt mit dem Finger wie im
 * Durchlauf (laufen.ts), ab einem simulierten Stand (aktstand.cjs, simstand.ts).
 *
 * Warum: Der Durchlauf meldete im Musikhaus von Port Delacroix vier Figuren ohne Aktionsknopf
 * (19.11.2026) und kam nie wieder dorthin; ein ganzer Lauf bis zu dieser Stelle dauert Stunden.
 * Die Probe prüft eine Karte in einer Minute.
 * Aufruf (nach npm run build):
 *   PROBE_STAND=/tmp/akt4.json PROBE_KARTE=portDelacroix.musikhaus \
 *   PROBE_VARIABLEN='{"musikhausOffen":true}' CHROMIUM_PFAD=… \
 *   npx playwright test --config playwright.durchlauf.config.ts ansprechprobe
 * Nur einzelne Dinge: PROBE_DING=ward,kit (etwa mit PROBE_STUNDE=18 in Summit City). Führt ein
 * Ding von der Karte fort (Gondel, Tür), bleiben die übrigen ungeprüft und werden so gemeldet.
 * Ergebnis: eine Zeile je Ding im Testbericht; der Test scheitert, wenn ein Ding ohne Knopf bleibt.
 * Abhängigkeiten: probe.ts, welt.ts, laufen.ts, eingabe.ts, lage.ts.
 */
import { join } from "node:path";
import { expect, test } from "@playwright/test";
import { tippe } from "./eingabe";
import { geheAn, geheDurch } from "./laufen";
import { liesLage, liesStand } from "./lage";
import { KARTE, PROBE_MS, schliesseDialog, STAND, starteProbe, zurueckAufKarte } from "./probe";
import { kartenwissen, type Ding } from "./welt";

/**
 * Übergänge zuletzt: Ein Übergang mit Dialog (Deich in Port Delacroix) schickt den Helden nach der
 * letzten Antwort auf eine andere Karte; davor geprüft, ließ das alle übrigen Dinge mit „keinWeg“
 * scheitern (Ansprechprobe der geänderten Karten, 24.11.2026).
 */
function reihenfolge(dinge: readonly Ding[]): Ding[] {
  const zuletzt = (d: Ding) => (d.regel?.art === "uebergang" ? 1 : 0);
  return [...dinge].sort((a, b) => zuletzt(a) - zuletzt(b));
}

/** Nur diese Dinge (Komma-Liste, PROBE_DING), leer: alle mit Dialog. */
const NUR = new Set((process.env.PROBE_DING ?? "").split(",").filter(Boolean));

test("Ansprechprobe einer Karte", async () => {
  test.skip(!STAND || !KARTE, "nur mit PROBE_STAND und PROBE_KARTE");
  test.setTimeout(PROBE_MS);
  const { lauf, daten, ordner, browser, stand } = await starteProbe("ansprechprobe");
  const seite = lauf.seite;
  const wissen = kartenwissen(daten, KARTE, await liesStand(seite));
  const ohne: string[] = [];
  const start = await liesLage(seite);
  const stunde = await seite.locator("[data-stunde]").first().getAttribute("data-stunde");
  console.log(`Start auf ${start.kachel}, Karte aufgebaut um ${stunde ?? "?"} Uhr`);
  for (const ding of reihenfolge(wissen.dinge)) {
    // Auch Gegenstände mit Dialog (Pizzakarton im Wohnzimmer, Erstspieler-Durchgang 20.11.2026).
    if (!ding.figur && !ding.regel?.dialog) continue;
    if (NUR.size > 0 && !NUR.has(ding.name)) continue;
    // Ein Übergang mit Dialog hat keinen Aktionsknopf: Er fragt, wenn man in den Durchgang geht
    // (Glasbrücke „weiterSilicon“). Eine Reise zählt wie ein geöffnetes Fenster.
    const uebergang = ding.regel?.art === "uebergang";
    const gang = uebergang ? await geheDurch(lauf, wissen, ding.name) : null;
    const ergebnis =
      gang === null
        ? await geheAn(lauf, wissen, ding.felder)
        : gang === "karte" || gang === "versetzt"
          ? "fenster"
          : gang;
    let text = "";
    if (ergebnis === "aktion") {
      await tippe(lauf, seite.getByTestId("abenteuer-aktion"), "Aktionsknopf");
      text = await schliesseDialog(lauf);
    } else if (ergebnis === "fenster") {
      // Beim Betreten ausgelöst (Haustür am Abend): schließen, sonst bleibt der Rest der Karte zu.
      text = await schliesseDialog(lauf);
    } else {
      ohne.push(`${ding.name}: ${ergebnis}`);
      await seite.screenshot({ path: join(ordner, `${ding.name}.png`) });
    }
    console.log(`${KARTE}.${ding.name} ${JSON.stringify(ding.felder)}: ${ergebnis} ${text}`);
    // Nach einer Reise (Dialog am Übergang) zurück auf die Karte der Probe.
    if ((await liesStand(seite)).position.karte !== KARTE) await zurueckAufKarte(seite, stand);
  }
  console.log(`Bilder und Protokoll: ${ordner}`);
  await browser.close();
  expect(ohne).toEqual([]);
});
