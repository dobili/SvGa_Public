/**
 * Messlauf: Genauigkeit der konstruierten Partien (Entscheidung des Autors vom 18.10.2026).
 *
 * Rolle im Gesamtbild: Kein Test der Prüfkette, sondern ein Messlauf wie engine/botstaerke.messung.ts.
 * Die Partien in inhalte/de/zugfolgen mit [Status "konstruiert"] baut
 * pipeline/zugfolgen/konstruieren.py mit einer schnellen Engine. Hier rechnet die App mit ihrer
 * eigenen Formel nach: Bewertungen in Tiefe 18 (skripte/eichung-rechnen.mjs --quellen konstruiert,
 * Ordner KONSTRUIERT_ORDNER), daraus je Seite die Genauigkeit nach Lichess (dieselbe Rechnung wie
 * spiel/genauigkeit.ts) und die Zeichen „?“ und „??“ der Auswertung (spiel/auswertung.ts). Das
 * Ergebnis kommt als Kopfzeile [Genauigkeit "…"] in die PGN-Datei und in einen Bericht (nur lokal).
 * Aufruf (im Ordner app/), vorher die Bewertung:
 *   node skripte/eichung-rechnen.mjs --ordner ../buch/arbeit/zugfolgen-konstruiert/bewertung --quellen konstruiert
 *   npx vitest run --config vitest.messung.config.ts src/spiel/konstruiert.messung.ts
 * Abhängigkeiten: spiel/messung/eichungsrechnung.ts, spiel/messung/genauigkeitsmodell.ts, spiel/auswertung.ts.
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { zeichenFuer } from "./auswertung";
import { werteAusEngine, type Rohwert } from "./messung/eichungsrechnung";
import { LICHESS_REGLER, seitengenauigkeit } from "./messung/genauigkeitsmodell";

const HAUPT = join(process.cwd(), "..");
const ZUGFOLGEN = join(HAUPT, "inhalte", "de", "zugfolgen");
const ORDNER =
  process.env.KONSTRUIERT_ORDNER ??
  join(HAUPT, "buch", "arbeit", "zugfolgen-konstruiert", "bewertung");
const KOPF = /^\[Genauigkeit "[^"]*"\]\n/m;
const NACH_STATUS = /^(\[Status "konstruiert"\]\n)/m;

interface Seite {
  readonly genauigkeit: number | null;
  readonly fehler: number;
  readonly patzer: number;
}

/** Die Bewertungen je Partie (Kennung „k08-a25-k“). */
function bewertungen(): Map<string, Rohwert[]> {
  const ergebnis = new Map<string, Rohwert[]>();
  if (!existsSync(ORDNER)) return ergebnis;
  for (const name of readdirSync(ORDNER).filter((n) => /^bewertet-\d+\.jsonl$/.test(n))) {
    for (const zeile of readFileSync(join(ORDNER, name), "utf8").split("\n")) {
      if (!zeile.trim()) continue;
      const d = JSON.parse(zeile) as { kennung: string; stellungen: Rohwert[] };
      ergebnis.set(d.kennung, d.stellungen);
    }
  }
  return ergebnis;
}

/** Genauigkeit und Zahl der „?“ und „??“ einer Seite (Werte aus Sicht von Weiß). */
function seite(werte: readonly number[], farbe: "white" | "black"): Seite {
  let fehler = 0;
  let patzer = 0;
  const vorzeichen = farbe === "white" ? 1 : -1;
  for (let i = farbe === "white" ? 0 : 1; i + 1 < werte.length; i += 2) {
    const vorher = vorzeichen * (werte[i] ?? 0);
    const nachher = vorzeichen * (werte[i + 1] ?? 0);
    const zeichen = zeichenFuer(Math.max(0, vorher - nachher), nachher);
    if (zeichen === "?") fehler += 1;
    if (zeichen === "??") patzer += 1;
  }
  return { genauigkeit: seitengenauigkeit(werte, farbe, LICHESS_REGLER), fehler, patzer };
}

function text(s: Seite): string {
  const g = s.genauigkeit === null ? "–" : `${s.genauigkeit.toFixed(1).replace(".", ",")} %`;
  return `${g}, ${s.fehler}× ?, ${s.patzer}× ??`;
}

/** Alle konstruierten PGN-Dateien mit ihrer Kennung. */
function dateien(): { pfad: string; kennung: string }[] {
  const liste: { pfad: string; kennung: string }[] = [];
  for (const kapitel of readdirSync(ZUGFOLGEN).filter((n) => /^kap\d+$/.test(n))) {
    for (const name of readdirSync(join(ZUGFOLGEN, kapitel)).filter((n) => n.endsWith("-k.pgn"))) {
      liste.push({ pfad: join(ZUGFOLGEN, kapitel, name), kennung: name.replace(/\.pgn$/, "") });
    }
  }
  return liste;
}

describe("Genauigkeit der konstruierten Partien", () => {
  it("rechnet je Seite nach und schreibt die Kopfzeile", () => {
    const bewertet = bewertungen();
    const zeilen: string[] = [];
    for (const { pfad, kennung } of dateien()) {
      const roh = bewertet.get(kennung);
      if (!roh) continue;
      const werte = werteAusEngine(roh);
      const weiss = seite(werte, "white");
      const schwarz = seite(werte, "black");
      const kopf = `[Genauigkeit "Weiß ${text(weiss)} · Schwarz ${text(schwarz)} (Tiefe 18)"]\n`;
      const alt = readFileSync(pfad, "utf8");
      writeFileSync(
        pfad,
        KOPF.test(alt) ? alt.replace(KOPF, kopf) : alt.replace(NACH_STATUS, `$1${kopf}`),
      );
      zeilen.push(`| ${kennung} | ${roh.length - 1} | ${text(weiss)} | ${text(schwarz)} |`);
    }
    const bericht = ["| Partie | Halbzüge | Weiß | Schwarz |", "|---|---|---|---|", ...zeilen].join(
      "\n",
    );
    writeFileSync(join(ORDNER, "..", "genauigkeit.md"), bericht + "\n");
    console.log(bericht);
    expect(zeilen.length).toBeGreaterThan(0);
  });
});
