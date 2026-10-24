/**
 * Messung der Stufen und Bots (Konzept 8.2): Partien zweier Spieler mit der echten Engine.
 *
 * Rolle im Gesamtbild: Grundlage der Elo-Leiter (engine/botstaerke.messung.ts). Kein Test der
 * Prüfkette, sondern ein Messlauf (vitest.messung.config.ts), den skripte/messe-stufen.mjs je
 * Paarung startet. Umgebung: MESSUNG_PAARUNG, MESSUNG_PARTIEN (Zahl, gerade; die Farben wechseln),
 * MESSUNG_ZIEL (Ordner für die JSON-Ergebnisse, nur lokal: buch/arbeit/), MESSUNG_SAAT_AB,
 * seit 0.2.117 MESSUNG_ENGINE_PFAD (native Engine statt Stockfish lite, viel schneller) und
 * MESSUNG_TIEFE_VOLL (Suchtiefe der vollen Engine, Stufe 10, Vorgabe 16, statt 2 s Rechenzeit).
 * Kürzel eines Spielers:
 * - „3“: Stufe 3 in allen Phasen, ohne Zusatzfehler (nur die Grundschicht, seit 0.2.117);
 * - „3m“: Stufe 3 mit allen Zusatzfehlern und blinden Flecken der Menschen (Abzug für Bots);
 * - „4x0.2“: freie Grundschicht mit Suchtiefe 4 und tau 0,2 (Eichung der Stufen, 21.10.2026);
 * - „@svenja“: ein vorgefertigter Bot mit seinen Stufen je Phase und seiner Persönlichkeit, wie
 *   in der App (seit 0.2.117; bis 0.2.115 „3@nina“ mit nur einer Stufe für alle Phasen);
 * - Anhang „~300+3“: dieser Spieler spielt mit Uhr (Grundzeit und Zuschlag in Sekunden) und
 *   simulierter Bedenkzeit (engine/bedenkzeit.ts); reicht sie nicht, zieht er im Notmodus mit
 *   Vorzügen weiter (spiel/notmodus.ts) und kann so auf Zeit verlieren. Ohne Anhang hat er
 *   unbegrenzt Zeit. So misst „3~300+3-3“ den Unterschied, den die Uhr bei Stufe 3 macht.
 * Jede Partie beginnt mit einer der Eröffnungen aus Kapitel 2 und 3 (zwei Halbzüge), damit die
 * Partien verschieden sind; danach spielt keine Seite aus dem Buch.
 * Paarung: zwei Kürzel, getrennt am letzten Bindestrich („@oma-erna-1“: Oma Erna gegen Stufe 1).
 * Abhängigkeiten: engine/nodeEngine.testhilfe.ts, engine/nativeEngine.testhilfe.ts,
 * engine/stufen.ts, engine/gegner.ts, engine/bedenkzeit.ts, engine/menschlich.ts, spiel/.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import type { Phase } from "../schach/phase";
import { bedenkzeitMs } from "./bedenkzeit";
import { wahltempo } from "./wahlmodell";
import type { EngineDienst } from "./engineDienst";
import type { Fehlerart } from "./fehlerart";
import { staerkeAusStufen, staerkeDesBots } from "./botstaerke";
import { BOTKANDIDATEN } from "./botkandidaten";
import { GEGNER } from "./gegner";
import { faktorenAus } from "./gegnerbau";
import { tagesform } from "./menschlich";
import { nativeEngine } from "./nativeEngine.testhilfe";
import { nodeEngine } from "./nodeEngine.testhilfe";
import {
  grundschicht,
  naechsteStufe,
  stufe,
  STUFEN_ZAHL,
  type Stufe,
  type Stufennummer,
} from "./stufen";
import { BUCHTREUE, REINES_PROFIL, STANDARDPROFIL, type Gegnerprofil } from "./zugwahl";
import { zuglage } from "../spiel/botzeit";
import { engineZugMitLage } from "../spiel/enginezug";
import { phaseVon } from "../spiel/phasen";
import { leserAmZug, neuePartie, stellungen, ziehe, type Partie } from "../spiel/partie";
import { brauchtNotmodus, NOTMODUS_REST_MS } from "../spiel/notmodus";
import { fenNach } from "../spiel/zuege";
import { planeWeiter, vorzugMitUhr, type Seitenstand } from "./messuhr.testhilfe";

const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
/** Zwei Halbzüge je Partie aus den Eröffnungen der Kapitel 2 und 3. */
const ANFAENGE: readonly (readonly string[])[] = [
  ["e4", "e5"],
  ["d4", "d5"],
  ["e4", "c5"],
  ["d4", "Nf6"],
  ["e4", "e6"],
  ["c4", "e5"],
  ["e4", "c6"],
  ["Nf3", "d5"],
];
/** Nach so vielen Halbzügen gilt eine Partie als remis (Messung, keine Regel des Buches). */
const HOECHSTENS_HALBZUEGE = 240;
const STANDARD_PARTIEN = 10;
/** Rechenzeit für Vergleichsgegner mit festem Skill Level oder fester Elo-Zahl. */
const SEKUNDE_MS = 1000;
const TIEFE_VOLL = Number(process.env.MESSUNG_TIEFE_VOLL ?? "16");

interface Seitenstatistik {
  readonly zuege: number;
  readonly fehler: number;
  readonly arten: Partial<Record<Fehlerart, number>>;
  readonly hoechsterVerlust: number;
  readonly verlustSumme: number;
  /** Simulierte Bedenkzeit insgesamt in Sekunden (nur mit Uhr). */
  readonly bedenkzeitS?: number;
  /** Züge im Notmodus (Eintritt und Vorzüge, spiel/notmodus.ts), wenn es welche gab. */
  readonly notmodusZuege?: number;
}

interface Partiebericht {
  readonly weiss: string;
  readonly schwarz: string;
  readonly ergebnis: "1-0" | "0-1" | "1/2-1/2";
  readonly ende: string;
  readonly halbzuege: number;
  readonly dauerMs: number;
  readonly statistik: Record<"weiss" | "schwarz", Seitenstatistik>;
  /** Alle Züge ab der Grundstellung in SAN, einschließlich der zwei Eröffnungszüge (seit 0.2.85). */
  readonly zuege: readonly string[];
}

/** Fester Zufall (LCG), damit jede Partie nachvollziehbar ist. */
function zufallsquelle(saat: number): () => number {
  let stand = saat;
  return () => {
    stand = (stand * 48_271) % 2_147_483_647;
    return stand / 2_147_483_647;
  };
}

/** Ein Spieler der Messung: Stufen je Phase, Profil, Uhr (null: unbegrenzt Zeit). */
interface Spieler {
  readonly stufen: Readonly<Record<Phase, Stufennummer>>;
  readonly ersatz: Stufe | null;
  readonly profil: Gegnerprofil;
  readonly uhr: { readonly grundzeitMs: number; readonly zuschlagMs: number } | null;
}

function alleGleich(n: Stufennummer): Readonly<Record<Phase, Stufennummer>> {
  return { eroeffnung: n, mittelspiel: n, endspiel: n };
}

/** Ein vorgefertigter Bot mit seinen Stufen je Phase und seinem Profil. */
function botspieler(kern: string, uhr: Spieler["uhr"]): Spieler | null {
  const bot = /^@([a-z-]+)$/.exec(kern);
  if (!bot?.[1]) return null;
  // Vorgefertigte Bots und die Kandidaten des neuen Bot-Satzes (0.2.124)
  const g = [...GEGNER, ...BOTKANDIDATEN].find((x) => x.kennung === bot[1]);
  if (!g) throw new Error(`Unbekannter Bot: ${kern}`);
  const profil: Gegnerprofil = {
    ...STANDARDPROFIL,
    fehlerarten: g.fehlerarten,
    stil: g.stil,
    blindeFlecken: g.blindeFlecken,
    // Wie in der App (ui/komponenten/botzug.ts): Faktoren aus den Stufen der Persönlichkeit
    gewichte: faktorenAus(
      g.persoenlichkeit,
      staerkeDesBots(g.kennung) ?? staerkeAusStufen(g.stufenJePhase),
    ),
    stilname: g.stilname,
    haeufigkeit: g.haeufigkeit,
    zufallszuege: g.zufallszuege,
  };
  return { stufen: g.stufenJePhase, ersatz: null, profil, uhr };
}

/** Spieler aus dem Kürzel der Paarung (Kopf der Datei). */
function spieler(kuerzel: string): Spieler {
  const [kern = "", uhrtext] = kuerzel.split("~");
  const teile = uhrtext?.split("+").map(Number);
  const uhr = teile
    ? { grundzeitMs: (teile[0] ?? 0) * SEKUNDE_MS, zuschlagMs: (teile[1] ?? 0) * SEKUNDE_MS }
    : null;
  const bot = botspieler(kern, uhr);
  if (bot) return bot;
  const frei = /^(\d+)x(\d+(?:\.\d+)?)$/.exec(kern);
  if (frei?.[1] && frei[2]) {
    const ersatz = { ...stufe(1), grund: grundschicht(Number(frei[1]), Number(frei[2])) };
    return { stufen: alleGleich(1), ersatz, profil: REINES_PROFIL, uhr };
  }
  const stufig = /^(\d+)(m?)$/.exec(kern);
  const nummer = Number(stufig?.[1]);
  if (!stufig || nummer < 1 || nummer > STUFEN_ZAHL) throw new Error(`Unbekanntes Kürzel: ${kern}`);
  const profil = stufig[2] ? STANDARDPROFIL : REINES_PROFIL;
  return { stufen: alleGleich(nummer as Stufennummer), ersatz: null, profil, uhr };
}

/** Die Stufe für diesen Zug: Stufe der Phase, Zug für Zug höchstens eine Stufe weiter (App). */
function stufeFuer(s: Spieler, fen: string, letzte: Stufennummer | null): Stufe {
  if (s.ersatz) return s.ersatz;
  const ziel = s.stufen[phaseVon(fen) ?? "mittelspiel"];
  const st = stufe(letzte ? naechsteStufe(letzte, ziel) : ziel);
  return st.grund === null ? { ...st, staerke: { art: "tiefe", tiefe: TIEFE_VOLL } } : st;
}

function statistik(
  partie: Partie,
  farbe: "white" | "black",
  bedenkMs: number | null,
  notmodusZuege = 0,
): Seitenstatistik {
  const eigene = partie.zuege.filter((_, i) => (i % 2 === 0) === (farbe === "white"));
  const fehler = eigene.filter((z) => z.quelle === "fehler");
  const arten: Partial<Record<Fehlerart, number>> = {};
  for (const z of fehler) if (z.fehler) arten[z.fehler] = (arten[z.fehler] ?? 0) + 1;
  return {
    zuege: eigene.length,
    fehler: fehler.length,
    arten,
    hoechsterVerlust: Math.max(0, ...fehler.map((z) => z.verlust)),
    verlustSumme: fehler.reduce((s, z) => s + z.verlust, 0),
    ...(bedenkMs === null ? {} : { bedenkzeitS: Math.round(bedenkMs / SEKUNDE_MS) }),
    ...(notmodusZuege > 0 ? { notmodusZuege } : {}),
  };
}

/** Ein Zug eines Spielers samt virtueller Uhr; gibt die neue Partie zurück oder null am Ende. */
async function zugMitUhr(
  engine: EngineDienst,
  lauf: Partie,
  s: Spieler,
  stand: Seitenstand,
  zufall: () => number,
  saat: string,
): Promise<Partie | null> {
  const fen = stellungen(lauf).at(-1) ?? GRUNDSTELLUNG;
  const st = stufeFuer(s, fen, stand.letzte);
  stand.letzte = st.nummer;
  const verlauf = { tagesform: tagesform(saat) };
  const profil = { ...s.profil, verlauf, restMs: stand.rest };
  const waehle = async (f: string, restMs: number) =>
    (await engineZugMitLage(engine, f, st, [], zufall, BUCHTREUE, { ...profil, restMs }))?.uci ??
    null;
  if (s.uhr && stand.vorzuege) return vorzugMitUhr(engine, lauf, s.uhr.zuschlagMs, stand, waehle);
  const ergebnis = await engineZugMitLage(engine, fen, st, [], zufall, BUCHTREUE, profil);
  if (!ergebnis) return null;
  if (s.uhr && stand.rest !== null) {
    const bedenk = bedenkzeitMs(
      {
        wertung: st.wertung,
        tempo: wahltempo(s.uhr),
        restMs: stand.rest,
        zugnummer: Math.floor(lauf.zuege.length / 2) + 1,
        lage: zuglage(lauf, ergebnis.uci, ergebnis.breite),
        buchzug: false,
      },
      zufall,
    );
    // Würde die Zeit nicht reichen: Notmodus statt Zeitverlust (Uhr danach auf einer Sekunde)
    const not = brauchtNotmodus(bedenk, stand.rest);
    const verbrauch = not ? Math.max(0, stand.rest - NOTMODUS_REST_MS) : bedenk;
    stand.verbraucht += verbrauch;
    stand.rest = (not ? NOTMODUS_REST_MS : stand.rest - bedenk) + s.uhr.zuschlagMs;
    if (not) {
      const weiter = ziehe(lauf, { ...ergebnis.zug, von: "engine" });
      if (!weiter) throw new Error(`Zug geht nicht: ${ergebnis.zug.san} in ${fen}`);
      stand.notmodusZuege += 1;
      await planeWeiter(engine, weiter, stand, waehle);
      return weiter;
    }
  }
  const weiter = ziehe(lauf, { ...ergebnis.zug, von: "engine" });
  if (!weiter) throw new Error(`Zug geht nicht: ${ergebnis.zug.san} in ${fen}`);
  return weiter;
}

function neueMesspartie(start: string): Partie {
  const partie = neuePartie(
    {
      startFen: start,
      eigeneFarbe: "black",
      stufe: 1,
      uhr: null,
      ruecknahmeErlaubt: false,
      abbildung: null,
      eroeffnung: null,
      stufenJePhase: alleGleich(1),
      gegner: "engine",
      bot: null,
      hilfen: { symbole: true, werkzeuge: true },
      gewertet: true,
    },
    "messung",
    new Date().toISOString(),
  );
  if (!partie) throw new Error("Startstellung nicht spielbar");
  return partie;
}

/** Spielt eine Partie; beide Seiten ziehen über die Zugwahl der App. */
async function spiele(
  engine: EngineDienst,
  weiss: Spieler,
  schwarz: Spieler,
  anfang: readonly string[],
  saat: number,
): Promise<{ partie: Partie; staende: readonly Seitenstand[] }> {
  const zufall = zufallsquelle(saat);
  const start = anfang.reduce<string | null>(
    (f, san) => (f ? fenNach(f, san) : null),
    GRUNDSTELLUNG,
  );
  let lauf = neueMesspartie(start ?? GRUNDSTELLUNG);
  const staende: Seitenstand[] = [weiss, schwarz].map((s) => ({
    rest: s.uhr ? s.uhr.grundzeitMs : null,
    verbraucht: 0,
    letzte: null,
    vorzuege: null,
    notmodusZuege: 0,
  }));
  while (lauf.ende === null && lauf.zuege.length < HOECHSTENS_HALBZUEGE) {
    const schwarzAmZug = leserAmZug(lauf);
    const s = schwarzAmZug ? schwarz : weiss;
    const stand = staende[schwarzAmZug ? 1 : 0] as Seitenstand;
    const kennung = `${saat}-${schwarzAmZug ? "s" : "w"}`;
    const weiter = await zugMitUhr(engine, lauf, s, stand, zufall, kennung);
    if (!weiter) break;
    lauf = weiter;
  }
  return { partie: lauf, staende };
}

function ergebnisVon(partie: Partie): Partiebericht["ergebnis"] {
  if (!partie.ende || !("sieger" in partie.ende)) return "1/2-1/2";
  return partie.ende.sieger === "white" ? "1-0" : "0-1";
}

const paarung = process.env.MESSUNG_PAARUNG ?? "1-2";
const partienZahl = Number(process.env.MESSUNG_PARTIEN ?? STANDARD_PARTIEN);
/** Verschiebung der Zufallssaaten (zweite Stichprobe derselben Paarung, 0.2.78). */
const saatAb = Number(process.env.MESSUNG_SAAT_AB ?? 0);
const ziel =
  process.env.MESSUNG_ZIEL ?? join(process.cwd(), "..", "buch", "arbeit", "stufenmessung");

/**
 * Die beiden Kürzel einer Paarung, getrennt am letzten Bindestrich vor „@“ oder einer Ziffer:
 * Kennungen enthalten selbst Bindestriche („@kiki-@onkel-otto“: Kiki gegen Onkel Otto).
 */
function kuerzelDerPaarung(text: string): readonly [string, string] {
  const trenner = text.search(/-(?=[@\d][^-]*(?:-[a-z]+)*$)/);
  if (trenner <= 0) throw new Error(`Paarung ohne Bindestrich: ${text}`);
  return [text.slice(0, trenner), text.slice(trenner + 1)];
}
const [a, b] = kuerzelDerPaarung(paarung);

describe(`Messung ${paarung}`, () => {
  const pfad = process.env.MESSUNG_ENGINE_PFAD;
  const engine = pfad ? nativeEngine(pfad) : nodeEngine();
  afterAll(() => engine.beendeEngine());

  it(`${partienZahl} Partien ${a} gegen ${b}`, async () => {
    const berichte: Partiebericht[] = [];
    for (let nummer = 0; nummer < partienZahl; nummer += 1) {
      const aWeiss = nummer % 2 === 0;
      const [weiss, schwarz] = aWeiss ? [spieler(a), spieler(b)] : [spieler(b), spieler(a)];
      const anfang = ANFAENGE[Math.floor(nummer / 2) % ANFAENGE.length] ?? [];
      const beginn = performance.now();
      const { partie, staende } = await spiele(engine, weiss, schwarz, anfang, saatAb + nummer + 1);
      const zeit = (s: Spieler, i: number) => (s.uhr ? (staende[i]?.verbraucht ?? 0) : null);
      berichte.push({
        weiss: aWeiss ? a : b,
        schwarz: aWeiss ? b : a,
        ergebnis: ergebnisVon(partie),
        ende: partie.ende?.art ?? "abbruch",
        halbzuege: partie.zuege.length,
        dauerMs: Math.round(performance.now() - beginn),
        statistik: {
          weiss: statistik(partie, "white", zeit(weiss, 0), staende[0]?.notmodusZuege),
          schwarz: statistik(partie, "black", zeit(schwarz, 1), staende[1]?.notmodusZuege),
        },
        zuege: [...anfang, ...partie.zuege.map((z) => z.san)],
      });
      mkdirSync(ziel, { recursive: true });
      writeFileSync(join(ziel, `${paarung}.json`), JSON.stringify({ paarung, berichte }, null, 1));
    }
    expect(berichte).toHaveLength(partienZahl);
  });
});
