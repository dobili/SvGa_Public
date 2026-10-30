/**
 * Messung (nur lokal, nicht in den Prüfungen): Wo beginnen Mittelspiel und Endspiel in echten
 * Lichess-Partien nach unserer Regel, nach der Regel von Lichess (scalachess Divider.scala) und
 * nach Kandidaten für eine neue Regel? Frage des Autors vom 30.10.2026.
 * Aufruf: npx vitest run --config vitest.messung.config.ts src/spiel/phasenvergleich.messung.ts
 * Eingabe: buch/arbeit/menschenprofil2/partien.jsonl (Lichess, CC0). Ausgabe: Konsole und
 * buch/arbeit/phasen/vergleich.json.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { Chess } from "chessops/chess";
import { makeFen } from "chessops/fen";
import { parseSan } from "chessops/san";
import { it } from "vitest";
import { phasenbefundVon } from "./phasen";

const QUELLE = "/home/user/SvGa_Public/buch/arbeit/menschenprofil2/partien.jsonl";
const ZIEL = "/home/user/SvGa_Public/buch/arbeit/phasen";

interface Brett {
  readonly figuren: Map<string, string>; // Feld (a1) → Zeichen (P, n …)
}

const brettAus = (fen: string): Brett => {
  const figuren = new Map<string, string>();
  const reihen = (fen.split(" ")[0] ?? "").split("/");
  reihen.forEach((reihe, i) => {
    let x = 0;
    for (const z of reihe) {
      if (/\d/.test(z)) x += Number(z);
      else {
        figuren.set(`${"abcdefgh"[x]}${8 - i}`, z);
        x++;
      }
    }
  });
  return { figuren };
};

const leichtZuHause = (b: Brett, weiss: boolean) =>
  (weiss
    ? [
        ["b1", "N"],
        ["g1", "N"],
        ["c1", "B"],
        ["f1", "B"],
      ]
    : [
        ["b8", "n"],
        ["g8", "n"],
        ["c8", "b"],
        ["f8", "b"],
      ]
  ).filter(([f, z]) => b.figuren.get(f as string) === z).length;

const figurenAnzahl = (b: Brett) =>
  [...b.figuren.values()].filter((z) => !"KkPp".includes(z)).length;

const grundreihe = (b: Brett, weiss: boolean) =>
  [...b.figuren.entries()].filter(([f, z]) =>
    weiss ? f.endsWith("1") && z === z.toUpperCase() : f.endsWith("8") && z === z.toLowerCase(),
  ).length;

const koenigDaheim = (b: Brett, weiss: boolean) =>
  b.figuren.get(weiss ? "e1" : "e8") === (weiss ? "K" : "k");

/** Lichess „mixedness“ (Divider.scala), y = 1 … 7 von Weiß aus. */
function wertung(y: number, w: number, s: number): number {
  const t: Record<number, Record<number, () => number>> = {
    0: {
      1: () => 1 + y,
      2: () => (y < 6 ? 2 + (6 - y) : 0),
      3: () => (y < 7 ? 3 + (7 - y) : 0),
      4: () => (y < 7 ? 3 + (7 - y) : 0),
    },
    1: {
      0: () => 1 + (8 - y),
      1: () => 5 + Math.abs(4 - y),
      2: () => 4 + (7 - y),
      3: () => 5 + (7 - y),
    },
    2: { 0: () => (y > 2 ? 2 + (y - 2) : 0), 1: () => 4 + (y - 1), 2: () => 7 },
    3: { 0: () => (y > 1 ? 3 + (y - 1) : 0), 1: () => 5 + (y - 1) },
    4: { 0: () => (y > 1 ? 3 + (y - 1) : 0) },
  };
  return t[w]?.[s]?.() ?? 0;
}

function durchmischung(b: Brett): number {
  let summe = 0;
  for (let y = 0; y < 7; y++)
    for (let x = 0; x < 7; x++) {
      let w = 0;
      let s = 0;
      for (const [dx, dy] of [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ] as const) {
        const z = b.figuren.get(`${"abcdefgh"[x + dx]}${y + dy + 1}`);
        if (z && z === z.toUpperCase()) w++;
        else if (z) s++;
      }
      summe += wertung(y + 1, w, s);
    }
  return summe;
}

const lichessMitte = (b: Brett) =>
  figurenAnzahl(b) <= 10 ||
  grundreihe(b, true) < 4 ||
  grundreihe(b, false) < 4 ||
  durchmischung(b) > 150;

/** Gefühlt noch Eröffnung: beide Seiten mit Leichtfigur zu Hause und König auf e1/e8. */
const gefuehltEroeffnung = (b: Brett) =>
  leichtZuHause(b, true) >= 1 &&
  leichtZuHause(b, false) >= 1 &&
  koenigDaheim(b, true) &&
  koenigDaheim(b, false);

/** Kandidat K: beide entwickelt, oder Abtausch (≤ 10 Figuren), oder Kontakt (Durchmischung > 150), oder eine Seite entwickelt UND rochiert, oder Material ungleich (aus unserer Regel). */
function kandidat(b: Brett, unsere: string): boolean {
  const beide = leichtZuHause(b, true) <= 1 && leichtZuHause(b, false) <= 1;
  const eineFertig = (w: boolean) => leichtZuHause(b, w) <= 1 && !koenigDaheim(b, w);
  return (
    beide ||
    figurenAnzahl(b) <= 10 ||
    durchmischung(b) > 150 ||
    eineFertig(true) ||
    eineFertig(false) ||
    unsere === "materialUngleich"
  );
}

const WERT: Record<string, number> = { q: 9, r: 5, b: 3, n: 3 };
/** Figurenpunkte einer Seite ohne Bauern und König. */
const punkte = (b: Brett, weiss: boolean) =>
  [...b.figuren.values()]
    .filter((z) => (z === z.toUpperCase()) === weiss)
    .reduce((s, z) => s + (WERT[z.toLowerCase()] ?? 0), 0);
const beideEntwickelt = (b: Brett) => leichtZuHause(b, true) <= 1 && leichtZuHause(b, false) <= 1;
const beideSicher = (b: Brett) => !koenigDaheim(b, true) && !koenigDaheim(b, false);
/** K2: beide entwickelt, sonst die Lichess-Gründe. K3: beide entwickelt und Könige weg von e1/e8 (Glossar des Buches), sonst Lichess. */
const k2 = (b: Brett) => beideEntwickelt(b) || lichessMitte(b);
const k3 = (b: Brett) => (beideEntwickelt(b) && beideSicher(b)) || lichessMitte(b);

function median(werte: number[]): number {
  const s = [...werte].sort((a, b) => a - b);
  return s.length ? (s[Math.floor(s.length / 2)] ?? 0) : 0;
}

it("vergleicht Phasenregeln an Lichess-Partien", () => {
  const zeilen = readFileSync(QUELLE, "utf8").trim().split("\n");
  const erg = {
    partien: 0,
    unsere: {
      mitte: [] as number[],
      ende: [] as number[],
      zweifel: 0,
      gruende: {} as Record<string, number>,
      endeFiguren: [] as number[],
      endeMitDamen: 0,
    },
    lichess: {
      mitte: [] as number[],
      ende: [] as number[],
      zweifel: 0,
      endeFiguren: [] as number[],
    },
    kandidat: { mitte: [] as number[], zweifel: 0 },
    k2: { mitte: [] as number[], zweifel: 0 },
    k3: { mitte: [] as number[], zweifel: 0 },
    endeUnsereSpeelman: 0,
    keinMittelspiel: { unsere: 0, lichess: 0, kandidat: 0 },
  };
  for (const zeile of zeilen) {
    const p = JSON.parse(zeile) as { zuege: string[] };
    if (p.zuege.length < 30) continue;
    erg.partien++;
    const pos = Chess.default();
    const fens = [makeFen(pos.toSetup())];
    for (const san of p.zuege) {
      const zug = parseSan(pos, san);
      if (!zug) break;
      pos.play(zug);
      fens.push(makeFen(pos.toSetup()));
    }
    let uM = -1,
      uE = -1,
      lM = -1,
      lE = -1,
      kM = -1,
      m2 = -1,
      m3 = -1;
    fens.forEach((fen, i) => {
      const b = brettAus(fen);
      const bef = uM < 0 || uE < 0 ? phasenbefundVon(fen) : null;
      if (uM < 0 && bef && bef.phase !== "eroeffnung") {
        uM = i;
        erg.unsere.gruende[bef.grund] = (erg.unsere.gruende[bef.grund] ?? 0) + 1;
        if (gefuehltEroeffnung(b)) erg.unsere.zweifel++;
      }
      if (uE < 0 && bef && bef.phase === "endspiel") {
        uE = i;
        erg.unsere.endeFiguren.push(figurenAnzahl(b));
        if (punkte(b, true) <= 13 && punkte(b, false) <= 13) erg.endeUnsereSpeelman++;
        if ([...b.figuren.values()].includes("Q") && [...b.figuren.values()].includes("q"))
          erg.unsere.endeMitDamen++;
      }
      if (lM < 0 && lichessMitte(b)) {
        lM = i;
        if (gefuehltEroeffnung(b)) erg.lichess.zweifel++;
      }
      if (lM >= 0 && lE < 0 && figurenAnzahl(b) <= 6) {
        lE = i;
        erg.lichess.endeFiguren.push(figurenAnzahl(b));
      }
      if (m2 < 0 && k2(b)) {
        m2 = i;
        erg.k2.mitte.push(i);
        if (gefuehltEroeffnung(b)) erg.k2.zweifel++;
      }
      if (m3 < 0 && k3(b)) {
        m3 = i;
        erg.k3.mitte.push(i);
        if (gefuehltEroeffnung(b)) erg.k3.zweifel++;
      }
      if (kM < 0 && kandidat(b, bef?.grund ?? "")) {
        kM = i;
        if (gefuehltEroeffnung(b)) erg.kandidat.zweifel++;
      }
    });
    if (uM >= 0) erg.unsere.mitte.push(uM);
    else erg.keinMittelspiel.unsere++;
    if (uE >= 0) erg.unsere.ende.push(uE);
    if (lM >= 0) erg.lichess.mitte.push(lM);
    else erg.keinMittelspiel.lichess++;
    if (lE >= 0) erg.lichess.ende.push(lE);
    if (kM >= 0) erg.kandidat.mitte.push(kM);
    else erg.keinMittelspiel.kandidat++;
  }
  const kurz = {
    partien: erg.partien,
    mitteMedianHalbzug: {
      unsere: median(erg.unsere.mitte),
      lichess: median(erg.lichess.mitte),
      kandidat: median(erg.kandidat.mitte),
      k2: median(erg.k2.mitte),
      k3: median(erg.k3.mitte),
    },
    zweifelK: { k2: erg.k2.zweifel / erg.partien, k3: erg.k3.zweifel / erg.partien },
    unsereEndeAuchSpeelmanFiguren: erg.endeUnsereSpeelman,
    zweifelAnteil: {
      unsere: erg.unsere.zweifel / erg.partien,
      lichess: erg.lichess.zweifel / erg.partien,
      kandidat: erg.kandidat.zweifel / erg.partien,
    },
    gruendeUnsere: erg.unsere.gruende,
    keinMittelspiel: erg.keinMittelspiel,
    endeMedianHalbzug: { unsere: median(erg.unsere.ende), lichess: median(erg.lichess.ende) },
    endspielErreicht: { unsere: erg.unsere.ende.length, lichess: erg.lichess.ende.length },
    figurenBeiEndspielbeginnUnsere: {
      median: median(erg.unsere.endeFiguren),
      ueber8: erg.unsere.endeFiguren.filter((n) => n > 8).length,
      mitBeidenDamen: erg.unsere.endeMitDamen,
    },
  };
  mkdirSync(ZIEL, { recursive: true });
  writeFileSync(`${ZIEL}/vergleich.json`, JSON.stringify({ kurz, roh: erg }, null, 1));
  console.log(JSON.stringify(kurz, null, 1));
});
