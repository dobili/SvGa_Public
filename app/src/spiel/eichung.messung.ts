/**
 * Messlauf der Eichung (Schritt c des Plans vom 18.10.2026): Regler für „nahe chess.com“ und
 * „Mittelweg“, Prüfung des Lichess-Modus, Kurven Genauigkeit → Wertungszahl für chess.com und
 * Lichess, ihre Mitte und die Kontrolle an zurückgelegten Partien.
 *
 * Rolle im Gesamtbild: Kein Test der Prüfkette, sondern ein Messlauf wie vergleich.messung.ts.
 * Die Rohdaten liegen nur lokal (EICHUNG_ORDNER, Vorgabe ../buch/arbeit/eichung): die Partien
 * aus pipeline/eichung/sammeln.py und die Bewertungen aus skripte/eichung-rechnen.mjs. Ausgabe:
 * bericht.md und ergebnis.json im selben Ordner (lokal); die Zahlen aus ergebnis.json kommen in
 * Schritt d als Konstanten in die App. Seit 0.2.99 stehen die Kurven auf der inneren Genauigkeit
 * nur bis zur Entscheidung der Partie (spiel/entscheidung.ts), wie die Schätzung in der App.
 * Abhängigkeiten: spiel/eichungsrechnung.ts, spiel/genauigkeitsmodell.ts.
 * Aufruf (im Ordner app/): npm run messen:eichung
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  abweichungen,
  besteRegler,
  istKontrolle,
  kurvenwert,
  mittel,
  monotoneKurve,
  streuung,
  werteAusEngine,
  umkehrKurve,
  zehnerFehler,
  zehnerFehlerAusMittel,
  type Eichseite,
  type Kurve,
  type Rohwert,
} from "./eichungsrechnung";
import {
  genauigkeitAus,
  LICHESS_REGLER,
  mittelweg,
  zugwerte,
  zugwerteBisEntscheidung,
  type Regler,
} from "./genauigkeitsmodell";

const ORDNER = process.env.EICHUNG_ORDNER ?? join(process.cwd(), "..", "buch", "arbeit", "eichung");
// Unter und über dem Lichess-Wert: Die erste Runde lag am unteren Rand (18.10.2026).
const ABFAELLE = [
  ...Array.from({ length: 8 }, (_, i) => 0.025 + i * 0.0025),
  LICHESS_REGLER.abfall,
  ...Array.from({ length: 31 }, (_, i) => 0.05 + i * 0.005),
];
const POLSTER = Array.from({ length: 11 }, (_, i) => 1 - i * 0.1);
const SEITEN_JE_GRUPPE = 15;
const HOECHSTENS_GRUPPEN = 12;
const RASTER = Array.from({ length: 21 }, (_, i) => 50 + i * 2.5);
const DURCHGAENGE = 400;
const JE_ZEHN = 10;
const BANDBREITE = 200;
const MINDESTENS_ZUEGE = 10;
// Zum Vergleich mit der Rechnung vor 0.2.99: EICHUNG_ALLE_ZUEGE=1 zählt alle Züge.
const ALLE_ZUEGE = process.env.EICHUNG_ALLE_ZUEGE === "1";

interface Seitendaten extends Eichseite {
  readonly plattform: "chesscom" | "lichess";
  readonly kontrolle: boolean;
}

function zeilen(datei: string): Record<string, unknown>[] {
  if (!existsSync(datei)) return [];
  return readFileSync(datei, "utf8")
    .split("\n")
    .filter((z) => z.trim())
    .map((z) => JSON.parse(z) as Record<string, unknown>);
}

interface Rohpartie {
  plattform: "chesscom" | "lichess";
  kennung: string;
  weiss: { wertung: number; genauigkeit: number | null };
  schwarz: { wertung: number; genauigkeit: number | null };
}

/** Alle Seiten mit Bewertung, je Partie beide Farben (ab zehn eigenen Zügen). */
function lies(): Seitendaten[] {
  const bewertet = new Map<string, Rohwert[]>();
  for (const name of existsSync(ORDNER) ? readdirSync(ORDNER) : []) {
    if (!/^bewertet-\d+\.jsonl$/.test(name)) continue;
    for (const z of zeilen(join(ORDNER, name))) {
      bewertet.set(`${String(z.plattform)}:${String(z.kennung)}`, z.stellungen as Rohwert[]);
    }
  }
  const partien = ["chesscom", "lichess"].flatMap((p) =>
    zeilen(join(ORDNER, `${p}.jsonl`)).map((z) => z as unknown as Rohpartie),
  );
  return partien.flatMap((p) => {
    const roh = bewertet.get(`${p.plattform}:${p.kennung}`);
    if (!roh) return [];
    const werte = werteAusEngine(roh);
    const kontrolle = istKontrolle(p.kennung);
    return (["white", "black"] as const).flatMap((seite) => {
      const s = seite === "white" ? p.weiss : p.schwarz;
      const eigene = Math.floor((werte.length - (seite === "white" ? 0 : 1)) / 2);
      if (s.genauigkeit === null || eigene < MINDESTENS_ZUEGE) return [];
      return [
        {
          werte,
          seite,
          genauigkeit: s.genauigkeit,
          wertung: s.wertung,
          plattform: p.plattform,
          kontrolle,
        },
      ];
    });
  });
}

const r1 = (x: number) => Math.round(x * 10) / 10;
const r0 = (x: number) => Math.round(x);

function genauigkeitsZeile(name: string, seiten: readonly Eichseite[], regler: Regler): string {
  const a = abweichungen(seiten, regler);
  return `| ${name} | ${seiten.length} | ${r1(mittel(a))} | ${r1(mittel(a.map(Math.abs)))} | ${r1(streuung(a))} |`;
}

/**
 * Innere Genauigkeit einer Seite wie in der App seit 0.2.99: nur Züge bis zur Entscheidung
 * (spiel/entscheidung.ts), null bei weniger als zehn gezählten Zügen (dann schätzt die App nicht).
 */
function innen(s: Eichseite): number | null {
  const zuege = ALLE_ZUEGE
    ? zugwerte(s.werte, s.seite, LICHESS_REGLER.abfall)
    : zugwerteBisEntscheidung(s.werte, s.seite);
  return zuege.length < MINDESTENS_ZUEGE ? null : genauigkeitAus(zuege, LICHESS_REGLER.polster);
}

function punkteAus(seiten: readonly Eichseite[]): { x: number; y: number }[] {
  return seiten.flatMap((s) => {
    const x = innen(s);
    return x === null ? [] : [{ x, y: s.wertung }];
  });
}

function kurveAus(seiten: readonly Eichseite[]): Kurve {
  const punkte = punkteAus(seiten);
  return monotoneKurve(
    punkte,
    Math.min(HOECHSTENS_GRUPPEN, Math.max(2, Math.floor(punkte.length / SEITEN_JE_GRUPPE))),
  );
}

/** Umgekehrte Kurve (Wertung → mittlere Genauigkeit) aus den Eichseiten. */
function umkehrAus(seiten: readonly Eichseite[]): Kurve {
  return umkehrKurve(punkteAus(seiten), BANDBREITE);
}

/**
 * Fehler der Schätzung je Partie und über zehn Partien (Kontrollseiten). `ausMittel` schätzt aus
 * dem Schnitt der zehn Genauigkeiten (umgekehrte Kurve); ohne ihn gilt der Schnitt der zehn
 * Einzelschätzungen.
 */
function schaetzfehler(
  seiten: readonly Eichseite[],
  schaetze: (x: number) => number,
  ausMittel?: (x: number) => number,
) {
  const paare = seiten.flatMap((s) => {
    const x = innen(s);
    if (x === null) return [];
    return [
      {
        x,
        schaetzung: schaetze(x),
        wertung: s.wertung,
        band: Math.floor(s.wertung / BANDBREITE) * BANDBREITE,
      },
    ];
  });
  const einzel = paare.map((p) => p.schaetzung - p.wertung);
  const zehn = ausMittel
    ? zehnerFehlerAusMittel(paare, ausMittel, DURCHGAENGE, JE_ZEHN)
    : zehnerFehler(paare, DURCHGAENGE, JE_ZEHN);
  return {
    anzahl: paare.length,
    mittel: mittel(einzel),
    betrag: mittel(einzel.map(Math.abs)),
    streuung: streuung(einzel),
    zehn: streuung(zehn),
    zehnBetrag: mittel(zehn.map(Math.abs)),
  };
}

describe("Eichung von Genauigkeit und Spielstärke", () => {
  it("rechnet Regler, Kurven und Kontrolle und schreibt den Bericht", () => {
    const alle = lies();
    const cc = alle.filter((s) => s.plattform === "chesscom");
    const li = alle.filter((s) => s.plattform === "lichess");
    expect(cc.length + li.length).toBeGreaterThan(0);
    const [ccEich, ccKontrolle] = [cc.filter((s) => !s.kontrolle), cc.filter((s) => s.kontrolle)];
    const [liEich, liKontrolle] = [li.filter((s) => !s.kontrolle), li.filter((s) => s.kontrolle)];
    const nahe = besteRegler(ccEich, ABFAELLE, POLSTER).regler;
    const mitte = mittelweg(LICHESS_REGLER, nahe);
    const kurveCc = kurveAus(ccEich);
    const kurveLi = kurveAus(liEich);
    const kurveMitte: Kurve = RASTER.map(
      (x) => [x, (kurvenwert(kurveCc, x) + kurvenwert(kurveLi, x)) / 2] as const,
    );
    const umkehrCc = umkehrAus(ccEich);
    const umkehrLi = umkehrAus(liEich);
    const umkehrMitte = (x: number) => (kurvenwert(umkehrCc, x) + kurvenwert(umkehrLi, x)) / 2;
    const fehler = {
      chesscomEigene: schaetzfehler(ccKontrolle, (x) => kurvenwert(kurveCc, x)),
      lichessEigene: schaetzfehler(liKontrolle, (x) => kurvenwert(kurveLi, x)),
      mitteGegenChesscom: schaetzfehler(ccKontrolle, (x) => kurvenwert(kurveMitte, x)),
      mitteGegenLichess: schaetzfehler(liKontrolle, (x) => kurvenwert(kurveMitte, x)),
      umkehrChesscom: schaetzfehler(
        ccKontrolle,
        (x) => kurvenwert(umkehrCc, x),
        (x) => kurvenwert(umkehrCc, x),
      ),
      umkehrLichess: schaetzfehler(
        liKontrolle,
        (x) => kurvenwert(umkehrLi, x),
        (x) => kurvenwert(umkehrLi, x),
      ),
      umkehrMitteGegenChesscom: schaetzfehler(ccKontrolle, umkehrMitte, umkehrMitte),
      umkehrMitteGegenLichess: schaetzfehler(liKontrolle, umkehrMitte, umkehrMitte),
    };
    const zeilenGenau = [
      "| Modus gegen Plattform | Seiten | Mittel | Betrag | Streuung |",
      "|---|---|---|---|---|",
      genauigkeitsZeile("Lichess-Modus gegen Lichess (alle)", li, LICHESS_REGLER),
      genauigkeitsZeile("Lichess-Modus gegen chess.com (Kontrolle)", ccKontrolle, LICHESS_REGLER),
      genauigkeitsZeile("Mittelweg gegen chess.com (Kontrolle)", ccKontrolle, mitte),
      genauigkeitsZeile("Mittelweg gegen Lichess (Kontrolle)", liKontrolle, mitte),
      genauigkeitsZeile("nahe chess.com gegen chess.com (Kontrolle)", ccKontrolle, nahe),
    ];
    const zeilenElo = Object.entries(fehler).map(
      ([name, f]) =>
        `| ${name} | ${f.anzahl} | ${r0(f.mittel)} | ${r0(f.betrag)} | ${r0(f.streuung)} | ${r0(f.zehnBetrag)} | ${r0(f.zehn)} |`,
    );
    const kurven = RASTER.map(
      (x) =>
        `| ${x} | ${r0(kurvenwert(kurveCc, x))} | ${r0(kurvenwert(kurveLi, x))} | ${r0(kurvenwert(kurveMitte, x))} |`,
    );
    const bericht = [
      "# Eichung von Genauigkeit und Spielstärke (lokal, nicht ins Repository)",
      "",
      `Seiten: chess.com ${cc.length} (Kontrolle ${ccKontrolle.length}), Lichess ${li.length} (Kontrolle ${liKontrolle.length}).`,
      `Regler nahe chess.com: Abfall ${nahe.abfall.toFixed(4)}, Polster ${nahe.polster.toFixed(1)}; Mittelweg: Abfall ${mitte.abfall.toFixed(4)}, Polster ${mitte.polster.toFixed(2)}.`,
      "",
      "## Genauigkeit (unsere − Plattform, Prozentpunkte)",
      ...zeilenGenau,
      "",
      "## Spielstärke (Schätzung − echte Wertungszahl, Kontrollseiten)",
      "| Kurve gegen Wertung | Seiten | Mittel | Betrag | Streuung je Partie | Betrag über zehn | Streuung über zehn |",
      "|---|---|---|---|---|---|---|",
      ...zeilenElo,
      "",
      `## Kurven (innere Genauigkeit = Lichess-Formel, ${ALLE_ZUEGE ? "alle Züge" : "nur Züge bis zur Entscheidung"})`,
      "| Genauigkeit | chess.com | Lichess | Mitte |",
      "|---|---|---|---|",
      ...kurven,
    ].join("\n");
    writeFileSync(join(ORDNER, "bericht.md"), bericht + "\n");
    writeFileSync(
      join(ORDNER, "ergebnis.json"),
      JSON.stringify(
        { nahe, mitte, kurveCc, kurveLi, kurveMitte, umkehrCc, umkehrLi, fehler },
        null,
        2,
      ),
    );
    console.log(bericht);
  });
});
