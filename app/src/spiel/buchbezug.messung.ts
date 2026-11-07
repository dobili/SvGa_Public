/**
 * Messlauf „Fehler mit Buchbezug“ (Konzept docs/KONZEPT_FEHLER_BUCHBEZUG.md, Abschnitt 7,
 * Schritt 4): Wie oft trifft jede Warum- und Finde-Kategorie an echten Partien zu, welcher Anteil
 * der Fehlzüge bekommt eine Kategorie, wie lange dauert die Rechnung, und stimmen die
 * Begründungen schachlich (Stichproben)?
 *
 * Rolle im Gesamtbild: Grundlage für die Schwellen in analyse/findekategorien-lage.ts
 * (FINDE_SCHWELLEN) und den Bericht docs/MESSUNG_BUCHBEZUG.md. Rohdaten nur lokal: Lichess-Partien
 * mit Engine-Werten aus der Eichung der Menschenprofile (buch/arbeit/menschenprofil2/
 * stellungen-*.jsonl: je Stellung die sechs besten Züge und weitere mit Wert aus Sicht der Seite
 * am Zug und acht Halbzügen Fortsetzung). Daraus baut der Lauf Partien der App mit Werten, besten
 * Zügen, Abständen und Varianten (sechs Halbzüge wie in der App) und wendet dieselben Regeln an
 * wie die Karte (spiel/buchzuege.ts) und die gespeicherten Kürzel (spiel/buchkuerzel.ts).
 * Nicht in „npm run pruefen“. Aufruf (im Ordner app/):
 *   PARTIEN=400 npx vitest run --config vitest.messung.config.ts src/spiel/buchbezug.messung.ts
 * Umgebung: ARBEIT (Ordner buch/arbeit, etwa im Hauptordner eines Arbeitsbaums), PARTIEN (Vorgabe 400), DATEI (Vorgabe stellungen-0.jsonl), AUSGABE (Ordner, Vorgabe
 * buch/arbeit/buchbezug).
 * Abhängigkeiten: spiel/buchzuege.ts, analyse/findekategorien.ts, spiel/auswertung.ts, Testhilfen.
 */
import { createReadStream, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createInterface } from "node:readline";
import { describe, expect, it } from "vitest";
import { alleFindeKategorien } from "../analyse/findekategorien";
import { baueFallenindex } from "../analyse/warumfalle";
import { ladeKapitel } from "../schach/buchabbildungen.testhilfe";
import { baueEroeffnungsindex } from "../schach/eroeffnungsindex";
import { zugurteile, type Zugurteil } from "./auswertung";
import { buchbefundeFuer, findeeingabeAus, FINDE_KLASSEN, WARUM_STATISTIK } from "./buchzuege";
import type { Auswertungsdaten, Buchkontextdaten } from "./buchzuege";
import { leserzug, neuePartie, stellungen, ziehe, type Partie } from "./partie";
import { findesatz } from "./findetext";
import { t } from "../i18n/sprache";
import { uciZuSan } from "./zuege";

const ORDNER = process.env.ARBEIT ?? join(process.cwd(), "..", "buch", "arbeit");
const DATEI = join(ORDNER, "menschenprofil2", process.env.DATEI ?? "stellungen-0.jsonl");
const AUSGABE = process.env.AUSGABE ?? join(ORDNER, "buchbezug");
const PARTIEN = Number(process.env.PARTIEN ?? "400");
/** Die App speichert Varianten mit sechs Halbzügen (bester Zug und fünf danach). */
const HALBZUEGE = 6;
const STICHPROBE = 5;
const MS_GENAU = 100;

/** Ein Kandidat der Rohdaten: Zug, Wert aus Sicht der Seite am Zug, Fehlerart, Flecken, Fortsetzung. */
type Kandidat = [string, number, string, string[], string[]];
interface Rohstellung {
  g: string;
  p: number;
  f: string;
  m: string;
  k: Kandidat[];
  x: Kandidat[];
}

/** Liest die Stellungen der ersten Partien, gruppiert nach Partie. */
async function liesPartien(anzahl: number): Promise<Rohstellung[][]> {
  const partien = new Map<string, Rohstellung[]>();
  const zeilen = createInterface({ input: createReadStream(DATEI) });
  for await (const zeile of zeilen) {
    const s = JSON.parse(zeile) as Rohstellung;
    if (!partien.has(s.g) && partien.size >= anzahl) break;
    partien.set(s.g, [...(partien.get(s.g) ?? []), s]);
  }
  zeilen.close();
  return [...partien.values()].map((l) => l.sort((a, b) => a.p - b.p));
}

const EINSTELLUNG = {
  startFen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  eigeneFarbe: "white",
  stufe: 1,
  stufenJePhase: { eroeffnung: 1, mittelspiel: 1, endspiel: 1 },
  uhr: null,
  ruecknahmeErlaubt: false,
  abbildung: null,
  gegner: "mensch",
  bot: null,
  hilfen: { symbole: false, werkzeuge: false },
  gewertet: false,
  eroeffnung: null,
} as const;

/** Werte aus Sicht von Weiß. */
function weissSicht(fen: string, wert: number): number {
  return fen.split(" ")[1] === "b" ? -wert : wert;
}

/** Baut Partie und Auswertung der App aus den Rohstellungen; null, wenn etwas nicht passt. */
function auswertungAus(roh: readonly Rohstellung[]): Auswertungsdaten | null {
  let partie: Partie | null = neuePartie(EINSTELLUNG, roh[0]?.g ?? "x", "2026-11-07T00:00:00Z");
  const werte: number[] = [];
  const beste: string[] = [];
  const abstaende: number[] = [];
  const varianten: string[][] = [];
  let letzter = 0;
  for (const [i, s] of roh.entries()) {
    const erste = s.k[0];
    const gespielt = [...s.k, ...s.x].find((k) => k[0] === s.m);
    const san = uciZuSan(s.f, s.m);
    if (s.p !== i || !erste || !gespielt || !san || !partie) return null;
    werte.push(weissSicht(s.f, erste[1]));
    beste.push(erste[0]);
    abstaende.push(Math.max(0, erste[1] - (s.k[1]?.[1] ?? erste[1])));
    varianten.push([erste[0], ...erste[4]].slice(0, HALBZUEGE));
    letzter = weissSicht(s.f, gespielt[1]);
    partie = ziehe(partie, leserzug(san));
  }
  if (!partie) return null;
  return {
    partie,
    werte: [...werte, letzter],
    beste: [...beste, ""],
    abstaende: [...abstaende, 0],
    varianten: [...varianten, []],
  };
}

/** Ein Treffer für die Stichprobe. */
interface Treffer {
  readonly fen: string;
  readonly zug: string;
  readonly besser: string;
  readonly klasse: string;
  readonly text: string;
}

/** Zähler des Laufs. */
interface Zahlen {
  fehlzuege: number;
  grob: number;
  mitKategorie: number;
  grobMitKategorie: number;
  karte: Map<string, number>;
  alleF: Map<string, number>;
  proben: Map<string, Treffer[]>;
  ms: number;
}

function plus(karte: Map<string, number>, k: string): void {
  karte.set(k, (karte.get(k) ?? 0) + 1);
}

/** Ein Treffer mit Text für die Stichprobe. */
function treffer(d: Auswertungsdaten, u: Zugurteil, text: string): Treffer {
  const fen = stellungen(d.partie)[u.index] ?? "";
  const besser = uciZuSan(fen, d.beste[u.index] ?? "") ?? "";
  return { fen, zug: d.partie.zuege[u.index]?.san ?? "", besser, klasse: u.klasse, text };
}

const GROB = new Set(["fehler", "patzer", "verpasst"]);

/** Zählt einen Fehlzug: Kategorien der Karte, alle Finde-Kategorien, Laufzeit. */
function zaehle(z: Zahlen, d: Auswertungsdaten, u: Zugurteil, k: Buchkontextdaten): void {
  const start = performance.now();
  const { warum, finde } = buchbefundeFuer(d, u, WARUM_STATISTIK, k);
  const eingabe = findeeingabeAus(d, u.index, k);
  const alle = eingabe ? alleFindeKategorien(eingabe) : [];
  z.ms += performance.now() - start;
  const grob = GROB.has(u.klasse);
  z.fehlzuege += 1;
  if (grob) z.grob += 1;
  if (warum || finde) z.mitKategorie += 1;
  if (grob && (warum || finde)) z.grobMitKategorie += 1;
  for (const f of alle) plus(z.alleF, f.kennung);
  if (warum) merke(z, warum.kennung, treffer(d, u, t(warum.text, warum.werte)));
  if (finde) {
    const satz = findesatz(finde);
    merke(
      z,
      finde.kennung,
      treffer(d, u, `${t(satz.text, satz.werte)} ${JSON.stringify(finde.details)}`),
    );
  }
}

/** Zählt die Kategorie der Karte und hebt bis zu 50 Treffer für die Stichprobe auf. */
function merke(z: Zahlen, kennung: string, tr: Treffer): void {
  plus(z.karte, kennung);
  const liste = z.proben.get(kennung) ?? [];
  if (liste.length < STICHPROBE * 10) liste.push(tr);
  z.proben.set(kennung, liste);
}

/** Bis zu fünf Treffer gleichmäßig verteilt. */
function stichprobe(liste: readonly Treffer[]): Treffer[] {
  if (liste.length <= STICHPROBE) return [...liste];
  const schritt = liste.length / STICHPROBE;
  return Array.from({ length: STICHPROBE }, (_, i) => liste[Math.floor(i * schritt)]).filter(
    (x): x is Treffer => x !== undefined,
  );
}

/** Der Bericht als Text (nur lokal; der Auszug geht von Hand nach docs/MESSUNG_BUCHBEZUG.md). */
function bericht(z: Zahlen, partien: number): string {
  const anteil = (a: number, b: number) => `${Math.round((a / Math.max(1, b)) * 1000) / 10} %`;
  const zeilen = [
    `Partien ${partien}, Fehlzüge (ab ungenau) ${z.fehlzuege}, davon Fehler/Patzer/Verpasst ${z.grob}`,
    `mit Kategorie: ${z.mitKategorie} (${anteil(z.mitKategorie, z.fehlzuege)}); grob: ${z.grobMitKategorie} (${anteil(z.grobMitKategorie, z.grob)})`,
    `Laufzeit: ${Math.round((z.ms / Math.max(1, z.fehlzuege)) * MS_GENAU) / MS_GENAU} ms je Fehlzug`,
    "",
    "Karte (nach Priorität): " +
      [...z.karte]
        .sort()
        .map(([k, n]) => `${k} ${n}`)
        .join(", "),
    "Alle Finde-Treffer: " +
      [...z.alleF]
        .sort()
        .map(([k, n]) => `${k} ${n}`)
        .join(", "),
    "",
  ];
  for (const [k, liste] of [...z.proben].sort()) {
    zeilen.push(`## ${k}`);
    for (const p of stichprobe(liste))
      zeilen.push(`- ${p.fen} | ${p.zug} (${p.klasse}) besser ${p.besser} | ${p.text}`);
    zeilen.push("");
  }
  return zeilen.join("\n");
}

describe("Messlauf Fehler mit Buchbezug", () => {
  it("zählt Kategorien an Lichess-Partien und schreibt Stichproben", async () => {
    const kontext: Buchkontextdaten = {
      fallenindex: baueFallenindex(ladeKapitel(4)),
      eroeffnungsindex: baueEroeffnungsindex([ladeKapitel(2), ladeKapitel(3)]),
    };
    const roh = await liesPartien(PARTIEN);
    const z: Zahlen = {
      fehlzuege: 0,
      grob: 0,
      mitKategorie: 0,
      grobMitKategorie: 0,
      karte: new Map(),
      alleF: new Map(),
      proben: new Map(),
      ms: 0,
    };
    let gezaehlt = 0;
    for (const r of roh) {
      const d = auswertungAus(r);
      if (!d) continue;
      gezaehlt += 1;
      for (const u of zugurteile(d.partie, d.werte, d.beste, d.abstaende ?? []))
        if (FINDE_KLASSEN.has(u.klasse)) zaehle(z, d, u, kontext);
    }
    const text = bericht(z, gezaehlt);
    mkdirSync(AUSGABE, { recursive: true });
    writeFileSync(join(AUSGABE, "messung.txt"), text);
    console.log(text.split("\n").slice(0, 6).join("\n"));
    expect(gezaehlt).toBeGreaterThan(0);
  });
});
