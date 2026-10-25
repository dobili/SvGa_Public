/**
 * Messlauf: Elo-Zahl der Stufen und der 64 vorgefertigten Bots auf der Skala von „Deine
 * Spielstärke“ (Rückfrage S23, Empfehlung vom 18.10.2026).
 *
 * Rolle im Gesamtbild: Kein Test der Prüfkette, sondern ein Messlauf wie stufen.messung.ts. Er
 * liest die Berichte der Bot-Messung (nur lokal, BOTELO_ORDNER, Vorgabe ../buch/arbeit/botelo):
 * alle Paarungsdateien in den Unterordnern `leiter-*`, `bruecken`, `alt` und `neu-*` (Ergebnisse für die
 * Leiter) und `anker-*` (Stufen gegen sich selbst, mit Zügen) samt ihren Bewertungen in Tiefe 18
 * in `anker-bewertung` (skripte/eichung-rechnen.mjs --quellen stufen). Rechnung: Elo-Leiter aus
 * allen Ergebnissen (engine/eloleiter.ts); je Anker-Stufe die innere Genauigkeit jeder Seite, in
 * Blöcken zu zehn Partien durch dieselbe Rechnung wie „Deine Spielstärke“ (spiel/elomodell.ts,
 * seit 0.2.125 mit dem Elo-Modell je Zeitklasse, die Phasen der Züge aus den nachgespielten
 * Partien); dazu die Kandidaten des neuen Bot-Satzes (engine/botkandidaten.ts) in
 * botkandidaten-daten.ts;
 * eine gemeinsame Verschiebung legt die Leiter auf die Anker. Unsicherheit je Spieler durch
 * Nachziehen der Ergebnisse (Binomial, 200 Durchgänge). Ausgabe im Ordner: botstaerke-daten.ts
 * (kommt nach engine/), bericht.md.
 * Aufruf (im Ordner app/): npx vitest run --config vitest.messung.config.ts
 *   src/engine/botstaerke.messung.ts (mit BOTELO_NUR_LEITER=1 ein Probelauf ohne Anker).
 * Abhängigkeiten: engine/eloleiter.ts, engine/gegnerliste.ts, spiel/eichungsrechnung.ts,
 * spiel/genauigkeitsmodell.ts, spiel/staerkemodell.ts.
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { werteAusEngine, type Rohwert } from "../spiel/eichungsrechnung";
import {
  genauigkeitAus,
  LICHESS_REGLER,
  zugwerteBisEntscheidung,
} from "../spiel/genauigkeitsmodell";
import {
  kennzahlenAus,
  kennzahlenMittel,
  schaetzung,
  type Partiekennzahlen,
  type Wertungstempo,
} from "../spiel/elomodell";
import { leiter, verankere, type Anker, type Begegnung } from "./eloleiter";
import { BOTKANDIDATEN } from "./botkandidaten";
import { GEGNER } from "./gegnerliste";
import {
  datendatei,
  kandidatendatei,
  phasenAusZuegen,
  zeitklassendatei,
  zufallsquelle,
} from "./botmessung-hilfen";

const ORDNER = process.env.BOTELO_ORDNER ?? join(process.cwd(), "..", "buch", "arbeit", "botelo");
const LEITER_ORDNER = /^(leiter-.*|bruecken|alt|neu-.*)$/;
/** Zeitklasse der Messung (Elo-Modell der Anker; Kürzel „3m~180+2“ verlieren ihre Uhr). */
const TEMPO = (process.env.BOTELO_TEMPO ?? "rapid") as Wertungstempo;
const AUSGABE = process.env.BOTELO_AUSGABE ?? "botstaerke-daten.ts";
const ANKER_ORDNER = /^anker-s\d+$/;
const BEWERTUNG = "anker-bewertung";
const BLOCK = 10;
const MINDESTENS_ZUEGE = 10;
const DURCHGAENGE = 200;
/**
 * Obergrenze der mittleren Genauigkeit für einen Anker: Die umgekehrte Lichess-Kurve von „Deine
 * Spielstärke“ endet bei 83,4 % (2380), die Vorwärtskurven schon bei etwa 1700; darüber ergibt
 * jede Genauigkeit fast dieselbe Zahl (gemessen: Stufe 4 bis 6 mit 86 bis 91 % alle bei 2000 bis
 * 2100). Solche Stufen stehen im Bericht als „gesättigt“, verankern die Leiter aber nicht.
 */
const GESAETTIGT_AB = 83;
const STUFEN = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

interface Bericht {
  readonly weiss: string;
  readonly schwarz: string;
  readonly ergebnis: string;
  readonly zuege?: readonly string[];
}
interface Datei {
  readonly paarung: string;
  readonly berichte: readonly Bericht[];
}

function dateienIn(ordner: string): Datei[] {
  if (!existsSync(ordner)) return [];
  return readdirSync(ordner)
    .filter((n) => n.endsWith(".json"))
    .map((n) => JSON.parse(readFileSync(join(ordner, n), "utf8")) as Datei);
}

function unterordner(muster: RegExp): string[] {
  return readdirSync(ORDNER).filter((n) => muster.test(n));
}

/** Punkte des ersten Kürzels der Paarung aus allen Partien der Datei. */
function begegnung(d: Datei): Begegnung {
  const trenner = trennstelle(d.paarung);
  const a = d.paarung.slice(0, trenner);
  const b = d.paarung.slice(trenner + 1);
  let punkte = 0;
  for (const p of d.berichte) {
    const aWeiss = p.weiss === a;
    if (p.ergebnis === "1-0") punkte += aWeiss ? 1 : 0;
    else if (p.ergebnis === "0-1") punkte += aWeiss ? 0 : 1;
    else punkte += 0.5;
  }
  return {
    a: spielerkennung(a),
    b: spielerkennung(b),
    punkteA: punkte,
    partien: d.berichte.length,
  };
}

/** Trennstelle einer Paarung: letzter Bindestrich vor „@“ oder einer Ziffer (Kennungen haben welche). */
function trennstelle(paarung: string): number {
  return paarung.search(/-(?=[@\d][^-]*(?:-[a-z]+)*$)/);
}

/**
 * Kürzel ohne Maia-Zeichen („@tom*“ → „@tom“, „5m*“ → „5m“): Ein Durchgang misst entweder alle mit
 * oder alle ohne Maia (Neumessung Plan C, 0.2.143), die Zahlen gehören also zu denselben Bots.
 */
function ohneMaia(kuerzel: string): string {
  return kuerzel.replaceAll("*", "");
}

/** „@svenja“ und „3@nina“ (bis 0.2.115) → Kennung des Bots, „3“ → „stufe3“. */
function spielerkennung(kuerzel: string): string {
  const kern = ohneMaia(kuerzel.split("~")[0] ?? kuerzel); // „@tom~180+2“ → „@tom“ (Messung je Zeitklasse)
  const at = kern.indexOf("@");
  return at >= 0 ? kern.slice(at + 1) : `stufe${kern}`;
}

const UHR_ORDNER = "uhr";
/** Ab diesem Verlust (Elo) gilt ein Uhrabzug als gemessen, nicht als Rauschen (etwa zwei Streuungen). */
const UHR_DEUTLICH = 80;
const HOECHSTER_ANTEIL = 0.95;
const ELO_TEILER = 400;

/** Rohwerte der Uhrmessung: Bedenkzeit → Stufe → Elo von „n~T“ gegen „n“. */
function uhrRohwerte(): Map<string, Map<number, number>> {
  const aus = new Map<string, Map<number, number>>();
  for (const d of dateienIn(join(ORDNER, UHR_ORDNER))) {
    const t = trennstelle(d.paarung);
    const [stufe, tempo] = d.paarung.slice(0, t).split("~");
    if (!stufe || !tempo || d.berichte.length === 0) continue;
    const g = begegnung(d);
    const anteil = Math.min(
      HOECHSTER_ANTEIL,
      Math.max(1 - HOECHSTER_ANTEIL, g.punkteA / g.partien),
    );
    const je = aus.get(tempo) ?? new Map<number, number>();
    je.set(Number(stufe), -ELO_TEILER * Math.log10(1 / anteil - 1));
    aus.set(tempo, je);
  }
  return aus;
}

/** Grundzeit einer Bedenkzeit in Sekunden („300+3“ → 300). */
function grundzeit(tempo: string): number {
  return Number(tempo.split("+")[0]);
}

/**
 * Was die Uhr je Bedenkzeit kostet (seit 0.2.117): Stufe n mit Uhr gegen Stufe n ohne
 * („3~300+3-3“). Seit 0.2.117 bereinigt: Ohne Zeitnot verläuft eine Partie mit Uhr genau wie ohne
 * (gleiche Zufallsfolge), die Rohwerte langer Bedenkzeiten sind also nur das Rauschen der Partien
 * gegen sich selbst. Abgezogen wird deshalb der Wert der längsten Bedenkzeit derselben Stufe, dann
 * über alle Stufen gemittelt (je Stufe zu wenige Partien) und nie über 0.
 * Ausgabe: Bedenkzeit → Stufe → Abzug (gleich für alle Stufen).
 */
function uhrAbzuege(): Map<string, Map<number, number>> {
  const roh = uhrRohwerte();
  const laengste = [...roh.keys()].sort((x, y) => grundzeit(y) - grundzeit(x))[0];
  const basis = laengste ? (roh.get(laengste) ?? new Map<number, number>()) : new Map();
  const aus = new Map<string, Map<number, number>>();
  for (const [tempo, je] of roh) {
    const unterschiede = [...je].map(([n, w]) => w - (basis.get(n) ?? 0));
    const mittel = unterschiede.reduce((s, x) => s + x, 0) / Math.max(1, unterschiede.length);
    // Nur ein deutlicher Verlust zählt (Mittel über acht Stufen streut um ±40; seit 0.2.125 alles Rauschen).
    const abzug = mittel < -UHR_DEUTLICH ? mittel : 0;
    aus.set(tempo, new Map([...je.keys()].map((n) => [n, abzug])));
  }
  return aus;
}

/** Alle Ergebnisse für die Leiter (ohne Partien einer Stufe gegen sich selbst). */
function begegnungen(): Begegnung[] {
  return unterordner(LEITER_ORDNER)
    .flatMap((o) => dateienIn(join(ORDNER, o)))
    .map(begegnung)
    .filter((g) => g.a !== g.b && g.partien > 0);
}

/** Die Bewertungen je Anker-Partie (Kennung „anker-s0/3-3:4“). */
function bewertungen(): Map<string, Rohwert[]> {
  const ordner = join(ORDNER, BEWERTUNG);
  const ergebnis = new Map<string, Rohwert[]>();
  if (!existsSync(ordner)) return ergebnis;
  for (const n of readdirSync(ordner).filter((x) => /^bewertet-.*\.jsonl$/.test(x))) {
    for (const z of readFileSync(join(ordner, n), "utf8")
      .split("\n")
      .filter((x) => x.trim())) {
      const d = JSON.parse(z) as { kennung: string; stellungen: Rohwert[] };
      ergebnis.set(d.kennung, d.stellungen);
    }
  }
  return ergebnis;
}

/**
 * Innere Genauigkeiten beider Seiten je Anker-Stufe, wie „Deine Spielstärke“ seit 0.2.103 nur bis
 * zur Entscheidung der Partie (Seiten mit mindestens zehn gezählten Zügen).
 */
function ankerGenauigkeiten(): Map<string, Partiekennzahlen[]> {
  const bewertet = bewertungen();
  const je = new Map<string, Partiekennzahlen[]>();
  for (const o of unterordner(ANKER_ORDNER)) {
    for (const d of dateienIn(join(ORDNER, o))) {
      // Kürzel der Seite: „3“ oder eine freie Grundschicht wie „4x0.2“ (Eichung 0.2.117)
      const stufe = ohneMaia(d.paarung.slice(0, trennstelle(d.paarung)).split("~")[0] ?? "");
      d.berichte.forEach((b, i) => {
        const roh = bewertet.get(`${o}/${d.paarung}:${i}`);
        if (!roh || roh.length < 2 * MINDESTENS_ZUEGE) return;
        const werte = werteAusEngine(roh);
        const phasen = phasenAusZuegen(b.zuege ?? []);
        for (const seite of ["white", "black"] as const) {
          const zuege = zugwerteBisEntscheidung(werte, seite);
          if (zuege.length < MINDESTENS_ZUEGE) continue;
          const erster = seite === "white" ? 0 : 1;
          const k = kennzahlenAus(
            zuege.map((z, j) => ({ ...z, phase: phasen[erster + 2 * j] ?? null })),
            genauigkeitAus(zuege, LICHESS_REGLER.polster),
          );
          if (k) je.set(stufe, [...(je.get(stufe) ?? []), k]);
        }
      });
    }
  }
  return je;
}

/**
 * Ein Anker je Stufe: Mittel der Schätzungen aus Blöcken zu zehn Seiten; nur Stufen unterhalb der
 * Sättigung (GESAETTIGT_AB) verankern, alle stehen im Bericht.
 */
function anker(): { anker: Anker[]; zeilen: string[] } {
  const liste: Anker[] = [];
  const zeilen: string[] = [];
  const reihenfolge = (k: string) => Number.parseFloat(k);
  const sortiert = [...ankerGenauigkeiten()].sort((x, y) => reihenfolge(x[0]) - reihenfolge(y[0]));
  for (const [stufe, werte] of sortiert) {
    const bloecke: number[] = [];
    for (let i = 0; i + BLOCK <= werte.length; i += BLOCK) {
      bloecke.push(schaetzung(TEMPO, kennzahlenMittel(werte.slice(i, i + BLOCK)), BLOCK).mitte);
    }
    if (bloecke.length === 0) continue;
    const wert = bloecke.reduce((s, x) => s + x, 0) / bloecke.length;
    const genau = kennzahlenMittel(werte).acc_lichess ?? 0;
    const gueltig = genau <= GESAETTIGT_AB;
    if (gueltig) liste.push({ spieler: `stufe${stufe}`, wert });
    zeilen.push(
      `| ${stufe} | ${werte.length} | ${genau.toFixed(1)} | ${Math.round(wert)} | ${bloecke.map(Math.round).join(", ")} | ${gueltig ? "ja" : "gesättigt"} |`,
    );
  }
  return { anker: liste, zeilen };
}

/** Streuung je Spieler: Ergebnisse binomial nachziehen, Leiter neu rechnen und verankern. */
function streuungen(alle: readonly Begegnung[], a: readonly Anker[]): Map<string, number> {
  const zufall = zufallsquelle(7);
  const summen = new Map<string, { s: number; q: number }>();
  for (let d = 0; d < DURCHGAENGE; d += 1) {
    const gezogen = alle.map((g) => {
      const p = g.punkteA / g.partien;
      let punkte = 0;
      for (let i = 0; i < g.partien; i += 1) punkte += zufall() < p ? 1 : 0;
      return { ...g, punkteA: punkte };
    });
    for (const [k, v] of verankere(leiter(gezogen), a).werte) {
      const alt = summen.get(k) ?? { s: 0, q: 0 };
      summen.set(k, { s: alt.s + v, q: alt.q + v * v });
    }
  }
  return new Map(
    [...summen].map(([k, { s, q }]) => [
      k,
      Math.sqrt(Math.max(0, q / DURCHGAENGE - (s / DURCHGAENGE) ** 2)),
    ]),
  );
}

/** Spieler der Leiter, die weder Stufe noch Bot sind (freie Grundschichten der Eichung). */
function weitere(werte: Map<string, number>): string[] {
  const bekannt = new Set([
    ...STUFEN.map((n) => `stufe${n}`),
    ...STUFEN.map((n) => `stufe${n}m`),
    ...GEGNER.map((g) => g.kennung),
    ...BOTKANDIDATEN.map((g) => g.kennung),
  ]);
  return [...werte.keys()]
    .filter((k) => !bekannt.has(k))
    .sort((x, y) => (werte.get(x) ?? 0) - (werte.get(y) ?? 0));
}

function bericht(
  werte: Map<string, number>,
  streu: Map<string, number>,
  alle: readonly Begegnung[],
  ankerzeilen: readonly string[],
  abw: readonly { spieler: string; abweichung: number }[],
): string {
  const partien = (k: string) =>
    alle.filter((g) => g.a === k || g.b === k).reduce((s, g) => s + g.partien, 0);
  const zeile = (k: string, name: string) =>
    `| ${name} | ${Math.round(werte.get(k) ?? 0)} | ±${Math.round(streu.get(k) ?? 0)} | ${partien(k)} |`;
  return [
    `# Elo-Zahl der Bots (${new Date().toISOString().slice(0, 10)})`,
    "",
    "## Anker (Stufe gegen sich selbst, Tiefe 18)",
    "",
    "| Stufe | Seiten | Genauigkeit | Anker | Blöcke zu zehn | gilt |",
    "|---|---|---|---|---|---|",
    ...ankerzeilen,
    "",
    "Abweichung Leiter minus Anker: " +
      abw.map((a) => `${a.spieler} ${Math.round(a.abweichung)}`).join(", "),
    "",
    "## Stufen und Bots",
    "",
    "| Spieler | Zahl | Streuung | Partien |",
    "|---|---|---|---|",
    ...STUFEN.filter((n) => werte.has(`stufe${n}m`)).map((n) =>
      zeile(`stufe${n}m`, `Stufe ${n} (menschlich, Nm)`),
    ),
    ...STUFEN.filter((n) => werte.has(`stufe${n}`)).map((n) =>
      zeile(`stufe${n}`, `Stufe ${n} (rein)`),
    ),
    ...GEGNER.map((g) => zeile(g.kennung, g.name)),
    ...BOTKANDIDATEN.filter((g) => werte.has(g.kennung)).map((g) => zeile(g.kennung, g.kennung)),
    ...weitere(werte).map((k) => zeile(k, k.replace("stufe", "Grundschicht "))),
    "",
  ].join("\n");
}

describe("Elo-Zahl der Bots", () => {
  it("rechnet Leiter und Anker und schreibt Daten und Bericht", () => {
    const alle = begegnungen();
    const { anker: gemessen, zeilen } = anker();
    // Probelauf vor der Bewertung der Anker (BOTELO_NUR_LEITER=1): Stufe 3 bei 0, nur Abstände.
    const nurLeiter = process.env.BOTELO_NUR_LEITER === "1";
    const a = nurLeiter ? [{ spieler: "stufe3", wert: 0 }] : gemessen;
    const verankert = verankere(leiter(alle), a);
    const streu = streuungen(alle, a);
    // Blitz und Klassisch (Gruppen-Chats): nur die gemessenen Zahlen, Bots unter ihrer Kennung.
    const daten =
      TEMPO === "rapid"
        ? datendatei(verankert.werte, uhrAbzuege())
        : zeitklassendatei(verankert.werte, TEMPO);
    writeFileSync(join(ORDNER, AUSGABE), daten);
    writeFileSync(join(ORDNER, "botkandidaten-daten.ts"), kandidatendatei(verankert.werte, streu));
    const text = bericht(verankert.werte, streu, alle, zeilen, verankert.abweichungen);
    writeFileSync(join(ORDNER, "bericht.md"), text);
    console.log(text);
    expect(nurLeiter || gemessen.length > 0).toBe(true);
  });
});
