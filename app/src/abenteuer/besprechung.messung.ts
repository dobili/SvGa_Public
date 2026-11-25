/**
 * Messlauf der Partiebesprechung (Wunsch des Autors, 26.11.2026; Entwurf
 * docs/spiel/auftraege/partiebesprechung_25-11.md, Abschnitt 11, C4): 40 Besprechungen echter
 * Partien mit allen Satzbausteinen, damit ein Mensch eine Stichprobe von 100 Sätzen gegen das Brett
 * prüfen kann.
 *
 * Rolle im Gesamtbild: Die zehn Partien aus tests/e2e/phasenpartien.json werden mit Stockfish unter
 * Node ausgewertet wie in der App (Wert je Stellung aus Sicht von Weiß, beste Züge, zwei Varianten,
 * Abstand) und dann aus beiden Sichten besprochen, mit denselben Funktionen wie der Bildschirm
 * (useBesprechung.ts: urteileDer, besprocheneMomente), auf Stufe 1 bis 3, mit Ambrose, allein und
 * nach dem Abschied, mit und ohne bekannte Begriffe, mit Lehrern und früheren Partien.
 * Ergebnis: buch/arbeit/besprechung/besprechungen.json und .md (nur lokal, nie ins Repository),
 * mit BESPRECHUNG_HTML=DATEI dazu eine Seite mit Brett, Satz und Engine-Folge je Moment.
 * Start: npx vitest run --config vitest.messung.config.ts src/abenteuer/besprechung.messung.ts
 * (TESTTIEFE=12 Voreinstellung hier; etwa drei Minuten).
 * Abhängigkeiten: engine/nodeEngine.testhilfe.ts, engine/spielbewerter.ts, anbindung/useBesprechung.ts,
 * anbindung/besprechungsbezug.ts, anbindung/besprechungstexte.ts.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { nodeEngine } from "../engine/nodeEngine.testhilfe";
import { wertFuer } from "../engine/spielbewerter";
import { stellungen } from "../spiel/partie";
import type { Partieeintrag } from "../speicher/partien";
import { fruehereFehler, lehrerJeBegriff } from "./anbindung/besprechungsbezug";
import { auftaktsatz, schlusssatz, type Besprechungskontext } from "./anbindung/besprechungstexte";
import { besprocheneMomente, urteileDer } from "./anbindung/useBesprechung";
import { versuchtVariable, type Begriff, type Besprechungsstufe } from "./regeln/besprechung";
import { seiteVon, textfassung, type Besprechungsprotokoll } from "./besprechung.messung.seite";

const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const TIEFE = Number(process.env.TESTTIEFE ?? "12");
/** Frist je Stellung (die Tiefe entscheidet; die Frist fängt nur Hänger ab). */
const FRIST_MS = 20_000;
/** So viele Halbzüge der Hauptvariante behält die App (useAuswertung.ts, VARIANTE_HALBZUEGE). */
const VARIANTE_HALBZUEGE = 6;
const ALLE_BEGRIFFE: readonly Begriff[] = [
  "haengend",
  "matt",
  "gabel",
  "fesselung",
  "spiess",
  "eroeffnung",
  "struktur",
  "abzug",
  "hinlenkung",
  "umwandlung",
  "endspiel",
  "theorie",
];

interface Phasenpartie {
  readonly san: readonly string[];
}

const engine = nodeEngine();
afterAll(() => engine.beendeEngine());

/** Bewertet eine Stellung wie bewerteStellung in useAuswertung.ts (Sicht von Weiß, Abstand der zwei besten). */
async function bewerte(fen: string) {
  const b = await engine.bewerte(fen, FRIST_MS, 2, { art: "tiefe", tiefe: TIEFE });
  const [erste, zweite] = b.varianten;
  const weissAmZug = fen.split(" ")[1] !== "b";
  const abstand =
    erste && zweite ? wertFuer(erste.wert, weissAmZug) - wertFuer(zweite.wert, weissAmZug) : 0;
  return {
    wert: erste ? wertFuer(erste.wert, true) : 0,
    bester: b.besterZug ?? "",
    abstand: Math.max(0, abstand),
    variante: erste ? erste.zuege.slice(0, VARIANTE_HALBZUEGE) : [],
  };
}

/** Die Partie als Eintrag der App, ausgewertet; der Held spielt `farbe`. */
async function eintragAus(
  nr: number,
  sans: readonly string[],
  farbe: "white" | "black",
  werte?: Pick<Partieeintrag, "werte" | "beste" | "abstaende" | "varianten">,
): Promise<Partieeintrag> {
  const partie = {
    id: `messung-${nr}-${farbe}`,
    begonnen: `2026-11-${String(nr + 1).padStart(2, "0")}T10:00:00.000Z`,
    einstellung: {
      startFen: GRUNDSTELLUNG,
      eigeneFarbe: farbe,
      botName: `Gegner ${nr % 3}`,
      abenteuer: { kennung: "messung.besprechung" },
    },
    zuege: sans.map((san, i) => ({
      san,
      von: (i % 2 === 0) === (farbe === "white") ? "leser" : "engine",
      quelle: "leser",
      fehler: null,
      verlust: 0,
    })),
    ruecknahmen: 0,
    uhr: null,
    ende: { art: "aufgabe", sieger: farbe === "white" ? "black" : "white" },
  } as unknown as Partieeintrag["partie"];
  if (werte) {
    const { werte: w, beste, abstaende, varianten } = werte;
    return { partie, werte: w, beste, abstaende, varianten };
  }
  const ergebnisse = [];
  for (const fen of stellungen(partie)) ergebnisse.push(await bewerte(fen));
  return {
    partie,
    werte: ergebnisse.map((e) => e.wert),
    beste: ergebnisse.map((e) => e.bester),
    abstaende: ergebnisse.map((e) => e.abstand),
    varianten: ergebnisse.map((e) => e.variante),
  };
}

/** Die Runden mit Thema und Steller (Lehrer für die Rückbezüge), alle als versucht. */
function rundenUndVariablen() {
  const datei = resolve("public/abenteuer/daten/runden.json");
  const roh = (
    JSON.parse(readFileSync(datei, "utf8")) as {
      runden: { kennung: string; themen: string[]; steller?: string }[];
    }
  ).runden;
  const variablen = Object.fromEntries(roh.map((r) => [versuchtVariable(r.kennung), true]));
  return { runden: roh, variablen };
}

/** Die Fälle: Stufe, Stimme, Begriffe bekannt (wechselnd je Partie und Seite). */
function faelle(nr: number, seite: number) {
  const stufe = (((nr + seite) % 3) + 1) as Besprechungsstufe;
  const stimme = nr === 7 ? "allein" : nr === 8 && seite === 1 ? "abschied" : "ambrose";
  const begriffe = (nr + seite) % 2 === 0 ? ALLE_BEGRIFFE : [];
  return [{ stufe, stimme, begriffe }] as const;
}

describe("Messlauf Partiebesprechung", () => {
  it("bespricht 20 Partieseiten auf zwei Stufen (40 Besprechungen)", async () => {
    const partien = JSON.parse(
      readFileSync(resolve("tests/e2e/phasenpartien.json"), "utf8"),
    ) as Phasenpartie[];
    const { runden, variablen } = rundenUndVariablen();
    const lehrer = lehrerJeBegriff(variablen, runden);
    const protokoll: Besprechungsprotokoll[] = [];
    const bisher: Partieeintrag[] = [];
    for (const [nr, p] of partien.entries()) {
      const weiss = await eintragAus(nr, p.san, "white");
      const schwarz = await eintragAus(nr, p.san, "black", weiss);
      for (const [seite, eintrag] of [weiss, schwarz].entries()) {
        for (const fall of faelle(nr, seite)) {
          for (const stufe of [fall.stufe, ((fall.stufe % 3) + 1) as Besprechungsstufe]) {
            const k: Besprechungskontext = {
              stimme: fall.stimme,
              stufe,
              begriffe: new Set(fall.begriffe),
              partiekennung: eintrag.partie.id,
              lehrer,
              frueher: fruehereFehler([...bisher].reverse(), eintrag),
            };
            const urteile = urteileDer(eintrag, null);
            const momente = besprocheneMomente(eintrag, urteile, k, null);
            protokoll.push({
              partie: nr,
              seite: eintrag.partie.einstellung.eigeneFarbe,
              stufe,
              stimme: k.stimme,
              begriffe: fall.begriffe.length > 0,
              auftakt: auftaktsatz(k),
              momente: momente.map((m) => ({
                halbzug: m.moment.index,
                kategorie: m.moment.kategorie,
                fen: stellungen(eintrag.partie)[m.moment.index] ?? "",
                fenNach: stellungen(eintrag.partie)[m.moment.index + 1] ?? "",
                zug: eintrag.partie.zuege[m.moment.index]?.san ?? "",
                beste: eintrag.beste[m.moment.index] ?? "",
                folge: eintrag.varianten[m.moment.index + 1] ?? [],
                folgeVor: eintrag.varianten[m.moment.index] ?? [],
                wert: eintrag.werte[m.moment.index] ?? 0,
                satz: m.satz,
              })),
              schluss: schlusssatz(k, "niederlage", momente.length === 0),
            });
          }
        }
        bisher.push(eintrag);
      }
    }
    const ordner = resolve("../buch/arbeit/besprechung");
    mkdirSync(ordner, { recursive: true });
    writeFileSync(resolve(ordner, "besprechungen.json"), JSON.stringify(protokoll, null, 1));
    writeFileSync(resolve(ordner, "besprechungen.md"), textfassung(protokoll));
    const html = process.env.BESPRECHUNG_HTML;
    if (html) writeFileSync(html, seiteVon(protokoll));
    expect(protokoll.length).toBe(40);
  });
});
