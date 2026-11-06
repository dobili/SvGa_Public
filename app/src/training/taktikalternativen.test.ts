/**
 * Tests der gleichwertigen Lösungszüge im Taktiktrainer: Bei jeder Mattaufgabe (Buch, Lichess und
 * Zusatzaufgaben) wird an jedem Zug des Lesers jeder andere legale Zug geprüft.
 *
 * Warum: Frage des Autors (6.11.2026): „Alle zulässigen Lösungen akzeptieren.“ Die Mattsuche
 * (schach/mattsuche.ts) nimmt einen Zug außerhalb der Lösung an, wenn er beweisbar ebenso schnell
 * mattsetzt. Der Test hält fest, welche Züge das in den Daten sind (gemessen 6.11.2026: nur einer,
 * Abb. 7.60 Dh1+), damit eine Änderung an Suche oder Daten auffällt. Die Engine-Messung dazu
 * (taktikalternativen.messung.ts) fand bei Gewinnaufgaben keinen gleichwertigen Zug.
 */
import { readFileSync } from "node:fs";
import { makeSan } from "chessops/san";
import type { NormalMove } from "chessops/types";
import { parseSquare } from "chessops/util";
import { describe, expect, it } from "vitest";
import type { Taktikaufgabe, Taktikdaten } from "../daten/trainerdaten";
import { erzwingtMatt } from "../schach/mattsuche";
import { regelstellung } from "../spiel/zuege";
import { alsZugaufgabe, pruefeTaktikzug, type Taktikzugaufgabe } from "./taktiktrainer";
import { stellungNach } from "./uebungsaufgabe";
import { alsZusatzaufgabe, zusatzeintraegeAus } from "./zusatzaufgaben";

const TAKTIK = new URL("../../../inhalte/de/trainer/taktik.json", import.meta.url);
const ZUSATZ = new URL("../../public/daten/zusatzaufgaben.json", import.meta.url);
const daten = JSON.parse(readFileSync(TAKTIK, "utf8")) as Taktikdaten;
const zusatz = (zusatzeintraegeAus(JSON.parse(readFileSync(ZUSATZ, "utf8"))) ?? []).flatMap(
  (eintrag) => {
    const z = alsZusatzaufgabe(eintrag);
    return z ? [z.aufgabe] : [];
  },
);
const MATTAUFGABEN = [...daten.aufgaben, ...zusatz].filter((a) => a.ziel === "matt");
/** Alle Mattaufgaben durchzurechnen dauert auf dem ausgelasteten Prüfrechner mehrere Sekunden. */
const FRIST_MS = 60_000;
const ohneSchach = (san: string) => san.replace(/[+#]$/, "");

/** Ein Zug aus zwei Feldnamen („d5“, „h1“). */
function zugVon(von: string, nach: string): NormalMove {
  const a = parseSquare(von);
  const b = parseSquare(nach);
  if (a === undefined || b === undefined) throw new Error(`${von}-${nach}`);
  return { from: a, to: b };
}

function zugaufgabe(id: string): Taktikzugaufgabe {
  const a = daten.aufgaben.find((x) => x.id === id);
  const z = a ? alsZugaufgabe(a) : null;
  if (!z) throw new Error(`${id} fehlt`);
  return z;
}

/** Ob der Zug an dieser Stelle schon in einer Linie der Aufgabe steht (Lösung oder akzeptiert). */
function inLinie(z: Taktikzugaufgabe, bisher: readonly string[], san: string): boolean {
  return z.linien.some(
    (l) =>
      l.length > bisher.length &&
      bisher.every((zug, i) => zug === l[i]) &&
      ohneSchach(l[bisher.length] ?? "") === ohneSchach(san),
  );
}

/** Alle Züge außerhalb der Lösung, die an einem Zug des Lesers angenommen werden. */
function angenommeneAlternativen(a: Taktikaufgabe): string[] {
  const z = alsZugaufgabe(a);
  const linie = z?.linien[0] ?? [];
  const gefunden: string[] = [];
  for (let i = 0; z && i < linie.length; i += 2) {
    const bisher = linie.slice(0, i);
    const pos = regelstellung(stellungNach(a.fen, bisher));
    for (const [von, ziele] of pos?.allDests() ?? []) {
      for (const nach of ziele) {
        const san = pos ? makeSan(pos, { from: von, to: nach }) : "";
        if (san.endsWith("#") || inLinie(z, bisher, san)) continue;
        if (pruefeTaktikzug(z, bisher, san).art !== "falsch") gefunden.push(`${a.id} ${i}:${san}`);
      }
    }
  }
  return gefunden;
}

describe("gleichwertige Lösungszüge bei Mattaufgaben", { timeout: FRIST_MS }, () => {
  it("in allen Mattaufgaben setzt nur Dh1+ in Abb. 7.60 ebenso schnell matt", () => {
    expect(MATTAUFGABEN.length).toBeGreaterThan(0);
    expect(MATTAUFGABEN.flatMap(angenommeneAlternativen)).toEqual(["taktik-b-7.60 2:Qh1+"]);
  });

  it("Abb. 7.60: nach Th8+ Kxh8 führt auch Dh1+ Kg8 Dh7# zum Ziel", () => {
    const z = zugaufgabe("taktik-b-7.60");
    expect(pruefeTaktikzug(z, ["Rh8+", "Kxh8"], "Qh1+")).toEqual({ art: "weiter", antwort: "Kg8" });
    expect(pruefeTaktikzug(z, ["Rh8+", "Kxh8", "Qh1+", "Kg8"], "Qh7#").art).toBe("geloest");
  });

  it("Abb. 7.11: ein langsameres Matt (Sc5+ statt Doppelschach Sd6+) bleibt falsch", () => {
    expect(pruefeTaktikzug(zugaufgabe("taktik-b-7.11"), [], "Nc5+").art).toBe("falsch");
  });

  it("Gewinnaufgaben suchen kein Matt: ein anderer Zug bleibt falsch", () => {
    expect(pruefeTaktikzug(zugaufgabe("taktik-b-7.6"), [], "Rh2").art).toBe("falsch");
  });
});

describe("erzwingtMatt", () => {
  it("findet das Matt in zwei nach Dh1+ (Abb. 7.60) und nennt die einzige Antwort", () => {
    const pos = regelstellung(stellungNach("r4rk1/pp3pp1/2p3P1/3Q4/8/8/PP6/1K5R w - - 0 1", ["Rh8+", "Kxh8"]));
    if (!pos) throw new Error("Stellung");
    const dh1 = zugVon("d5", "h1");
    expect(erzwingtMatt(pos, dh1, 2)).toEqual({ art: "erzwungen", antwort: "Kg8", zuege: 2 });
    expect(erzwingtMatt(pos, dh1, 1)).toEqual({ art: "keins" });
  });

  it("ein Zug, der selbst mattsetzt, heißt „matt“", () => {
    const pos = regelstellung("6k1/5ppp/8/8/8/8/8/R5K1 w - - 0 1");
    if (!pos) throw new Error("Stellung");
    expect(erzwingtMatt(pos, zugVon("a1", "a8"), 1)).toEqual({ art: "matt" });
  });
});
