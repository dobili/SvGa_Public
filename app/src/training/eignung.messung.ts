/**
 * Messlauf: Wie viele Aufgaben jedes Trainers haben welche Eigenschaft der Eignungsprüfung
 * (training/eignung.ts)? Grundlage der Regeltabelle (Nebenchat, 30.10.2026) und Kontrolle nach
 * neuen Daten.
 *
 * Rolle im Gesamtbild: Läuft nicht in „npm run pruefen“, sondern über
 * `npx vitest run --config vitest.messung.config.ts src/training/eignung.messung.ts`. Schreibt
 * eine Tabelle nach EIGNUNG_ZIEL (Standard: buch/arbeit/eignung.txt, nur lokal).
 * Abhängigkeiten: die Trainer unter training/, training/eignung.ts.
 */
import { dirname, resolve } from "node:path";
import { test } from "vitest";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { ladeKapitel } from "../schach/buchabbildungen.testhilfe";
import { buchstellungenAus } from "./buchstellungen";
import { zielbilanzaufgabe } from "./zielbilanztrainer";
import { faktorenaufgabe } from "./faktorentrainer";
import { planaufgaben, lapaufgabe, rennaufgabe } from "./planbilanztrainer";
import { denkaufgabe } from "./denkroutinetrainer";
import { gangartrunde, zugrunde } from "./koordinatentrainer";
import { roentgenaufgabe } from "./roentgentrainer";
import { zugfolgenstellungen } from "./roentgenstufen";
import { zaehlfelder, haengendeFiguren } from "./zaehltrainer";
import { festerZufall } from "./zufall";
import { stellungAusFen } from "../schach/stellung";
import { hatEigenschaft, type Eigenschaft } from "./eignung";
/** Alle Eigenschaften in der Reihenfolge der Tabelle. */
const E: Eigenschaft[] = ["ohneRegeln","imSchach","partieZuEnde","materialGewinnbar","figurGewinnbar","eigeneHaengt","eigeneGefesselt","nurBauern"];
/** Rechnen über alle Stellungen dauert mehrere Minuten. */
const FRIST_MS = 600_000;

test("Eigenschaften je Trainer zählen", { timeout: FRIST_MS }, () => {
  const k = Array.from({ length: 13 }, (_, i) => ladeKapitel(i));
  const st = buchstellungenAus(k);
  const z = festerZufall(1);
  const listen: Record<string, string[]> = {
    zielbilanz: st.flatMap((b) => zielbilanzaufgabe(b)?.fen ?? []),
    faktoren: st.flatMap((b) => faktorenaufgabe(b)?.fen ?? []),
    planfragen: planaufgaben(st, z).map((a) => a.fen),
    lap: st.flatMap((b) => lapaufgabe(b)?.fen ?? []),
    wettrennen: st.flatMap((b) => rennaufgabe(b)?.fen ?? []),
    denkroutine: st.flatMap((b) => denkaufgabe(b)?.fen ?? []),
    gangarten: gangartrunde(st, 99999, z).map((a) => a.fen),
    notieren: zugrunde(st, 99999, false, z).map((a) => a.fen),
    roentgenAbb: st.flatMap((b) => roentgenaufgabe(b)?.fen ?? []),
    roentgenZugfolge: zugfolgenstellungen(k).flatMap((b) => roentgenaufgabe(b)?.fen ?? []),
    zaehlenBilanz: [...new Set(st.flatMap((b) => zaehlfelder(b).map((a) => a.fen)))],
    zaehlenHaengen: st.flatMap((b) => (haengendeFiguren(b.stellung) ? [b.stellung.fen] : [])),
  };
  for (const name of ["falle", "endspiel", "taktik"]) {
    const d = JSON.parse(readFileSync(resolve(__dirname, `../../../inhalte/de/trainer/${name}.json`), "utf8")) as { aufgaben: { fen: string }[] };
    listen[name] = d.aufgaben.map((a) => a.fen);
  }
  const zeilen: string[] = ["trainer anzahl doppelt " + E.join(" ")];
  for (const [name, fens] of Object.entries(listen)) {
    const bretter = fens.map((f) => f.split(" ")[0]);
    const doppelt = bretter.length - new Set(bretter).size;
    const zahlen = E.map((e) => fens.filter((f) => { const g = stellungAusFen(f); return g.ok && hatEigenschaft(g.wert, e); }).length);
    zeilen.push([name, fens.length, doppelt, ...zahlen].join(" "));
  }
  const ziel = process.env.EIGNUNG_ZIEL ?? resolve(__dirname, "../../../buch/arbeit/eignung.txt");
  mkdirSync(dirname(ziel), { recursive: true });
  writeFileSync(ziel, zeilen.join("\n"));
});
