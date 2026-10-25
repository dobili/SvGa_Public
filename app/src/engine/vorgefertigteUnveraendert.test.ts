/**
 * Absicherung des Umbaus „Fehlerprofil vereinfacht“ (Variante A, 0.2.135): Die vorgefertigten Bots
 * müssen Zug für Zug gleich spielen, ihre gemessenen Zahlen bleiben nur dann gültig.
 *
 * Rolle im Gesamtbild: Der Umbau ändert nur Oberfläche und Speicherweg der eigenen Gegner. Dieser
 * Test vergleicht je Bot die Faktoren seiner Persönlichkeit (faktorenAus) bei fünf Wertungen, die
 * Stellschrauben der Zugwahl (menschenwerteAus) und ob er Zusatzfehler hat (hatZusatzfehler) mit
 * dem Stand von main vor dem Umbau (0.2.134), festgehalten in
 * `testdaten/vorgefertigte-0.2.134.json`. Neu schreiben nur mit Absicht:
 * `SCHREIBE_VERGLEICH=1 npx vitest run src/engine/vorgefertigteUnveraendert.test.ts`.
 * Abhängigkeiten: engine/gegnerliste.ts, engine/gegnerbau.ts, engine/zugwahl.ts,
 * engine/menschenwahl.ts, engine/botstaerke.ts.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { staerkeDesBots } from "./botstaerke";
import { faktorenAus } from "./gegnerbau";
import { GEGNER } from "./gegnerliste";
import { hatZusatzfehler } from "./menschenwahl";
import { menschenwerteAus } from "./zugwahl";

const DATEI = new URL("./testdaten/vorgefertigte-0.2.134.json", import.meta.url);
/** Wertungen, bei denen die Faktoren verglichen werden (Rand, Mitte, Spitze der Daten). */
const WERTUNGEN = [400, 800, 1300, 1800, 2400];
const ERSATZWERTUNG = 1300;

/** Alles, was die Engine von einem Bot bekommt, in fester Reihenfolge. */
function eingabenAllerBots() {
  return GEGNER.map((g) => {
    const wertung = staerkeDesBots(g.kennung) ?? ERSATZWERTUNG;
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

describe("vorgefertigte Bots nach dem Umbau des Fehlerprofils", () => {
  it("bekommen dieselben Faktoren und Stellschrauben wie in 0.2.134", () => {
    const jetzt = JSON.parse(JSON.stringify(eingabenAllerBots())) as unknown;
    if (process.env.SCHREIBE_VERGLEICH) {
      writeFileSync(DATEI, `${JSON.stringify(jetzt, null, 1)}\n`);
    }
    const vorher = JSON.parse(readFileSync(DATEI, "utf8")) as unknown;
    expect(jetzt).toEqual(vorher);
  });
});
