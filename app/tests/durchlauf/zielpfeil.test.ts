/**
 * Dauerprüfung des Zielpfeils über alle Quests und alle Schritte (Auftrag 20.11.2026: „Jede
 * Aufgabe im Tagebuch soll ein Ziel haben, das der Pfeil auch findet“).
 *
 * Je Questschritt wird geprüft:
 * 1. Ziel: zielangabe (oberwelt/zielsuche.ts) liefert eine Angabe. Genau dann zeigt das Tagebuch
 *    beim Schritt das Pfeilsymbol (Tagebuch.tsx). Ohne Ziel nur mit Eintrag in AUSNAHMEN und Grund.
 * 2. Karte und Objekt: Die Angabe führt auf eine Karte, das Objekt gibt es dort (in einer Fassung).
 *    Nur eine Karte ohne Objekt genügt bei „ort“-Schritten und Ankunftsdialogen: Dort ist das
 *    Ziel die Karte selbst, der Pfeil zeigt von außen auf ihren Eingang.
 * 3. Erreichbar: Ein freies Feld am Objekt ist von einem Übergang der Karte aus zu Fuß erreichbar
 *    (Begehbarkeit wie im Spieler-Durchlauf, welt.ts kartenwissen, mit Figuren als Sperre).
 * 4. Kartenübergreifend: Von jeder anderen Karte findet der Pfeil einen Ausgang, und zwar mit genau
 *    den Karten, die das Spiel lädt (useZielhinweis.ts: die Orte auf dem Weg, notfalls mit ihren
 *    Nachbarorten, zielwege.ts ortsstufen).
 * Schreibt bei Fehlern die ganze Liste, damit man alle Funde auf einmal sieht.
 */
import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
import type { Spieldaten as AppDaten } from "../../src/abenteuer/daten/laden";
import { leererAbenteuerstand } from "../../src/abenteuer/regeln/spielstand";
import {
  kartenbildAus,
  wegweiser,
  zielangabe,
  zielkarte,
  type Kartenbild,
  type Zielangabe,
} from "../../src/abenteuer/oberwelt/zielsuche";
import { ausgangsziel, ortsstufen } from "../../src/abenteuer/oberwelt/zielwege";
import { findeKarte, kartenwissen, ladeSpieldaten, lies, type Kartenwissen } from "./welt";

/** Schritte ohne Ziel oder ohne Weg, mit Grund. Schlüssel „quest#schritt“. */
const AUSNAHMEN: Readonly<Record<string, string>> = {
  "capitalArena.verloreneSeiten#0":
    "Die Seiten liegen verstreut auf acht Karten; der Schritt zählt die Funde, kein einzelnes Ziel.",
};

/** Orte, die nur über einen Dialog erreicht werden (Erinnerung): kein Ausgang führt hinein. */
const NUR_UEBER_DIALOG = new Set(["erinnerungLondon"]);

const INHALTE = new URL("../../../inhalte/abenteuer/", import.meta.url);
const liesInhalt = <T>(p: string): T => JSON.parse(readFileSync(new URL(p, INHALTE), "utf8")) as T;
const app = {
  quests: liesInhalt<AppDaten>("quests.json").quests,
  orte: liesInhalt<AppDaten>("orte.json").orte,
  runden: liesInhalt<AppDaten>("runden.json").runden,
  begegnungen: liesInhalt<AppDaten>("begegnungen.json").begegnungen,
} as unknown as AppDaten;
const daten = ladeSpieldaten();
const stand = leererAbenteuerstand(new Date(), "Kim", null, false);

/** Kartenbilder aller Karten mit allen Fassungen, Ausgänge wie im Spiel (mit Haltestellen). */
function alleKartenbilder(): Kartenbild[] {
  return app.orte.flatMap((ort) =>
    ort.karten.map((k) => {
      const fassungen = [k.datei, ...Object.values(k.zustaende ?? {})].map((d) => lies<object>(d));
      return kartenbildAus(k.kennung, fassungen, (n) => ausgangsziel(app, ort, k.kennung, n));
    }),
  );
}

const ortVon = (karte: string) => findeKarte(daten, karte)?.ort.kennung ?? "";

/** Felder, die von einem Übergang der Karte aus zu Fuß erreichbar sind (Breitensuche). */
function erreichbar(w: Kartenwissen): Set<string> {
  const start = [...w.uebergangsfelder];
  const gesehen = new Set(start);
  for (let i = 0; i < start.length; i++) {
    const [x, y] = (start[i] ?? "").split(",").map(Number) as [number, number];
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ] as const) {
      const s = `${x + dx},${y + dy}`;
      if (gesehen.has(s) || !w.frei(x + dx, y + dy)) continue;
      gesehen.add(s);
      start.push(s);
    }
  }
  return gesehen;
}

/** Ist ein Feld am Objekt (darauf oder daneben) erreichbar? null, wenn es im Stand fehlt. */
function objektErreichbar(karte: string, objekt: string): boolean | null {
  const w = kartenwissen(daten, karte, stand);
  const ding = w.dinge.find((d) => d.name === objekt);
  if (!ding || w.uebergangsfelder.size === 0) return null;
  const felder = erreichbar(w);
  return ding.felder.some(({ x, y }) =>
    [
      [0, 0],
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ].some(([dx = 0, dy = 0]) => felder.has(`${x + dx},${y + dy}`)),
  );
}

/** Startkarten ohne Weg zum Ziel, mit den Karten, die das Spiel für diesen Start lädt. */
function ohneWeg(karte: string, angabe: Zielangabe, bilder: Kartenbild[]): string[] {
  const zielort = ortVon(karte);
  return bilder
    .filter((s) => s.kennung !== karte && !NUR_UEBER_DIALOG.has(ortVon(s.kennung)))
    .filter((s) => {
      const stufen = ortsstufen(app, ortVon(s.kennung), zielort);
      return !stufen.some((orte) => {
        const geladen = bilder.filter((b) => orte.includes(ortVon(b.kennung)));
        return wegweiser(s.kennung, angabe, geladen) !== null;
      });
    })
    .map((s) => s.kennung);
}

/** Alle Funde zu einem Schritt (leer, wenn alles stimmt). */
function pruefeSchritt(
  schritt: AppDaten["quests"][number]["schritte"][number],
  bilder: Kartenbild[],
): string[] {
  const angabe = zielangabe(schritt, app);
  if (!angabe) return ["ohne Ziel (kein Symbol im Tagebuch)"];
  const karte = zielkarte(angabe, bilder);
  const bild = bilder.find((b) => b.kennung === karte);
  if (!karte || !bild) return [`keine Karte zu ${JSON.stringify(angabe)}`];
  const funde: string[] = [];
  const dialog = schritt.ereignis.art === "dialog" ? schritt.ereignis.knoten : "";
  if (!angabe.objekt) {
    if (schritt.ereignis.art !== "ort" && !/ankunft/i.test(dialog))
      funde.push(`nur Karte ${karte}`);
  } else if (!bild.objekte.has(angabe.objekt)) {
    return [`Objekt ${angabe.objekt} fehlt auf ${karte}`];
  } else if (objektErreichbar(karte, angabe.objekt) === false) {
    funde.push(`${karte}.${angabe.objekt} zu Fuß nicht erreichbar`);
  }
  if (!NUR_UEBER_DIALOG.has(ortVon(karte))) {
    const fehlt = ohneWeg(karte, angabe, bilder);
    if (fehlt.length)
      funde.push(
        `kein Weg nach ${karte} von ${fehlt.length} Karten (${fehlt.slice(0, 3).join(", ")})`,
      );
  }
  return funde;
}

it("jeder Questschritt hat ein Ziel, das der Pfeil von überall findet", () => {
  const bilder = alleKartenbilder();
  const funde: string[] = [];
  let schritte = 0;
  for (const q of app.quests) {
    q.schritte.forEach((s, i) => {
      schritte++;
      const wo = `${q.kennung}#${i}`;
      if (AUSNAHMEN[wo]) return;
      funde.push(...pruefeSchritt(s, bilder).map((f) => `${wo}: ${f}`));
    });
  }
  expect(schritte).toBeGreaterThan(150);
  expect(funde).toEqual([]);
}, 120_000);
