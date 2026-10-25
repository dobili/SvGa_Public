/**
 * Absicherung: Die vorgefertigten Bots bekommen genau die Eingaben, mit denen sie gemessen wurden;
 * ihre gemessenen Zahlen gelten nur dann.
 *
 * Rolle im Gesamtbild: Eingeführt mit dem Umbau „Fehlerprofil vereinfacht“ (Variante A, 0.2.135),
 * der die Bots nicht verändern durfte. Seit 0.2.141 hält der Vergleich den Stand von Plan C fest
 * (Charaktere auf das vereinfachte Profil, Freigabe des Autors 25.10.2026), mit dem die Bots neu
 * gemessen werden. Je Bot: die Faktoren seiner Persönlichkeit (faktorenAus) bei fünf Wertungen,
 * die Stellschrauben der Zugwahl (menschenwerteAus) und ob er Zusatzfehler hat (hatZusatzfehler),
 * festgehalten in `testdaten/vorgefertigte-0.2.141.json`. Neu schreiben nur mit Absicht (und dann
 * neu messen): `SCHREIBE_VERGLEICH=1 npx vitest run src/engine/vorgefertigteUnveraendert.test.ts`.
 * Abhängigkeiten: engine/gegnerliste.ts, engine/gegnerbau.ts, engine/zugwahl.ts,
 * engine/menschenwahl.ts, engine/botstaerke.ts.
 */
import { wertungDerPersoenlichkeit } from "./persoenlichkeitswertung";
import { readFileSync, writeFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { faktorenAus } from "./gegnerbau";
import { GEGNER } from "./gegnerliste";
import { hatZusatzfehler } from "./menschenwahl";
import { menschenwerteAus } from "./zugwahl";

const DATEI = new URL("./testdaten/vorgefertigte-0.2.141.json", import.meta.url);
/** Wertungen, bei denen die Faktoren verglichen werden (Rand, Mitte, Spitze der Daten). */
const WERTUNGEN = [400, 800, 1300, 1800, 2400];

/** Alles, was die Engine von einem Bot bekommt, in fester Reihenfolge. */
function eingabenAllerBots() {
  return GEGNER.map((g) => {
    const wertung = wertungDerPersoenlichkeit(g);
    const werte = menschenwerteAus({
      fehlerarten: g.fehlerarten,
      stil: g.stil,
      blindeFlecken: g.blindeFlecken,
      gewichte: faktorenAus(g.persoenlichkeit, wertung),
      haeufigkeit: g.haeufigkeit,
    });
    return {
      kennung: g.kennung,
      faktoren: WERTUNGEN.map((w) => faktorenAus(g.persoenlichkeit, w)),
      werte,
      zusatzfehler: hatZusatzfehler(werte),
    };
  });
}

describe("vorgefertigte Bots wie gemessen", () => {
  it("bekommen dieselben Faktoren und Stellschrauben wie bei der Messung (Stand 0.2.141)", () => {
    const jetzt = JSON.parse(JSON.stringify(eingabenAllerBots())) as unknown;
    if (process.env.SCHREIBE_VERGLEICH) {
      writeFileSync(DATEI, `${JSON.stringify(jetzt, null, 1)}\n`);
    }
    const vorher = JSON.parse(readFileSync(DATEI, "utf8")) as unknown;
    expect(jetzt).toEqual(vorher);
  });
});
