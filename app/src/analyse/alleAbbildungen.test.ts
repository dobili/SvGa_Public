/**
 * Robustheit und Tempo über alle Abbildungen des Buches.
 *
 * Jede Stellung aus den Buchdaten muss lesbar sein, und k1-zaehlen muss auf jedem Feld jeder
 * Abbildung ein Ergebnis liefern, auch bei Lehrbildern ohne König (Kapitel 0 und 5). Die
 * ganzstelligen Werkzeuge (k1-roentgen, k4-warnsignale …) laufen auf jeder Abbildung ohne Fehler.
 * Konzept 7.1: E-Werkzeuge brauchen weniger als 50 Millisekunden.
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { Datenverzeichnis } from "../daten/generiert/index";
import type { Kapitel } from "../daten/generiert/kapitel";
import { feldAusName, stellungAusFen, type Farbe, type Stellung } from "../schach/stellung";
import { roentgen } from "./k1-roentgen";
import { zaehle } from "./k1-zaehlen";
import { ladeKapitel, naechsterBuchzug } from "../schach/buchabbildungen.testhilfe";
import { baueEroeffnungsindex } from "../schach/eroeffnungsindex";
import { angriffsregel } from "./k1-angriffsregel";
import { todsuendenWerkzeug } from "./k1-todsuenden";
import { zielbilanzWerkzeug } from "./k2-zielbilanz";
import { eroeffnung } from "./k2-eroeffnung";
import { faktorenbilanz } from "./k3-faktorenbilanz";
import { prueffragen } from "./k4-prueffragen";
import { warnsignale } from "./k4-warnsignale";

/** Eröffnungsindex aus Kapitel 2 und 3, einmal gebaut (in der App beim Öffnen einer Abbildung). */
const EROEFFNUNGEN = baueEroeffnungsindex([ladeKapitel(2), ladeKapitel(3)]);

const ORDNER = new URL("../../public/daten/de/a1/", import.meta.url);
const verzeichnis = JSON.parse(
  readFileSync(new URL("index.json", ORDNER), "utf8"),
) as Datenverzeichnis;
const abbildungen = verzeichnis.kapitel.flatMap(
  (eintrag) =>
    (JSON.parse(readFileSync(new URL(eintrag.datei, ORDNER), "utf8")) as Kapitel).abbildungen,
);
const FELDER = "abcdefgh"
  .split("")
  .flatMap((linie) => [1, 2, 3, 4, 5, 6, 7, 8].map((r) => `${linie}${r}`));
/** Obergrenze für E-Werkzeuge (Konzept 7.1). */
const HOECHSTZEIT_MS = 50;
/** So oft wird jede Abbildung gemessen; es zählt der schnellste Lauf. */
const MESSLAEUFE = 3;

describe("alle Abbildungen des Buches", () => {
  it("sind im Verzeichnis vollständig (Kapitel 0 bis 12)", () => {
    expect(verzeichnis.kapitel.map((k) => k.kapitel)).toEqual([
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
    ]);
    expect(abbildungen.length).toBeGreaterThan(700);
  });

  it("jede Stellung ist lesbar, k1-zaehlen läuft auf jedem Feld unter 50 ms", () => {
    let langsamste = 0;
    for (const abbildung of abbildungen) {
      const stellung = stellungAusFen(abbildung.fen);
      expect(stellung.ok, `Abb. ${abbildung.id}`).toBe(true);
      if (!stellung.ok) continue;
      for (const feld of FELDER) {
        const ziel = feldAusName(feld);
        if (ziel === null) continue;
        const beginn = performance.now();
        zaehle(stellung.wert, ziel);
        langsamste = Math.max(langsamste, performance.now() - beginn);
      }
    }
    expect(langsamste).toBeLessThan(HOECHSTZEIT_MS);
  });

  it.each([
    ["k1-roentgen", roentgen],
    ["k1-angriffsregel", angriffsregel],
    [
      "k1-todsuenden (Stellung ohne Zugfolge)",
      (stellung: Stellung, farbe: Farbe) =>
        todsuendenWerkzeug(stellung, farbe, undefined, EROEFFNUNGEN),
    ],
    ["k2-zielbilanz", zielbilanzWerkzeug],
    ["k2-eroeffnung", (stellung: Stellung) => eroeffnung(stellung, EROEFFNUNGEN)],
    ["k3-faktorenbilanz", faktorenbilanz],
    ["k4-warnsignale", warnsignale],
    [
      "k4-prueffragen mit dem nächsten Buchzug",
      (stellung: Stellung, farbe: Farbe, zug?: string) => prueffragen(stellung, farbe, zug),
    ],
  ] as const)("%s läuft auf jeder Abbildung unter 50 ms", (_name, werkzeug) => {
    // Aufwärmen: Der allererste Aufruf übersetzt den Code erst (JIT) und zählt nicht.
    const erste = stellungAusFen(abbildungen[0]?.fen ?? "");
    if (erste.ok) werkzeug(erste.wert, erste.wert.amZug);
    let langsamste = { ms: 0, id: "" };
    for (const abbildung of abbildungen) {
      const stellung = stellungAusFen(abbildung.fen);
      if (!stellung.ok) continue;
      const zug = naechsterBuchzug(abbildung.id) ?? undefined;
      // Der schnellste von drei Läufen: Ein ausgelasteter Rechner (alle Tests laufen parallel)
      // soll keinen Ausreißer erzeugen (0.2.27: einmal rot unter Last, allein immer grün).
      let dauer = Number.POSITIVE_INFINITY;
      for (let lauf = 0; lauf < MESSLAEUFE; lauf += 1) {
        const beginn = performance.now();
        werkzeug(stellung.wert, stellung.wert.amZug, zug);
        dauer = Math.min(dauer, performance.now() - beginn);
      }
      if (dauer > langsamste.ms) langsamste = { ms: dauer, id: abbildung.id };
    }
    expect(langsamste.ms, `langsamste Abb. ${langsamste.id}`).toBeLessThan(HOECHSTZEIT_MS);
  });

  it("Lehrbilder ohne König haben keine Regeln (die App bietet dort keine Engine an)", () => {
    const ohneKoenig = abbildungen.filter((a) => {
      const s = stellungAusFen(a.fen);
      return s.ok && s.wert.regeln === null;
    });
    expect(ohneKoenig.map((a) => a.id)).toEqual([
      "0.3",
      "0.4",
      "0.5",
      "0.6",
      "0.7",
      "0.8",
      "0.9",
      "5.1",
      "5.2",
      "8.37",
    ]);
  });
});
