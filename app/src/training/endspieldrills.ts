/**
 * Kurzübungen im Endspieltrainer: Quadrat, Opposition, Schlüsselfelder und das Quiz „Welches
 * Erkennungsbild?“ (seit 0.2.90).
 *
 * Rolle im Gesamtbild: Pflichtenheft 7 nennt für den Endspieltrainer neben den Partien gegen die
 * Engine kurze Drills und ein Erkennungsbild-Quiz. Die Stellungen der ersten drei Drills erzeugt
 * die App zufällig (König und Bauer gegen König oder zwei Könige); die Antwort rechnen dieselben
 * Bausteine, die auch die Werkzeuge des Kapitels 8 tragen (schach/quadrat.ts, opposition.ts,
 * schluesselfelder.ts). Das Quiz nimmt die Buchstellungen des Endspieltrainers, für die das
 * Werkzeug „Erkennungsbild“ (Kapitel 9) ein Bild der Tabelle erkennt. Reine Funktionen.
 * Abhängigkeiten: schach/, training/zufall.ts.
 */
import type { Color, Square } from "chessops/types";
import { erkennungsbild, type Bildname } from "../schach/erkennungsbilder";
import { koenigsabstand } from "../schach/koenigsweg";
import { hatOpposition } from "../schach/opposition";
import { quadrat } from "../schach/quadrat";
import { schluesselfelder } from "../schach/schluesselfelder";
import { feldname, stellungAusFen, type Stellung } from "../schach/stellung";
import type { Zufall } from "./zufall";

export type Drillart = "quadrat" | "opposition" | "schluesselfelder" | "bild";
export const DRILLARTEN: readonly Drillart[] = ["quadrat", "opposition", "schluesselfelder", "bild"];

/** Eine Kurzübung: Stellung, Antwortmöglichkeiten (Schlüssel), die richtige, Felder zur Lösung. */
export interface Drill {
  readonly art: Drillart;
  readonly fen: string;
  readonly optionen: readonly string[];
  readonly richtig: string;
  /** Felder, die nach der Antwort gold leuchten (Quadrat, Schlüsselfelder). */
  readonly loesungsfelder: readonly string[];
}

const FELDER = 64;
const LINIEN = 8;
const VERSUCHE = 400;
/** Mindestabstand des eigenen Königs zum Bauern: Er soll nicht begleiten (Quadrat, Abb. 8.19). */
const FERN = 4;
const ANTWORTEN_BILD = 4;
const NEBENFELDER = 2;
/** Felder a2 bis h6: dort steht der Bauer der Drills (erstes Feld a2, 40 Felder bis h6). */
const ERSTES_BAUERNFELD = 8;
const BAUERNFELDER = 40;
const HAELFTE = 0.5;
/** Anteil der Oppositionsdrills mit Königen auf einer Linie oder Reihe (sonst zufällig). */
const ANTEIL_GEGENUEBER = 0.6;
/** Abstände der Könige bei „gegenüber“: 2, 4 oder 6 Felder (eine ungerade Zahl dazwischen). */
const ABSTAENDE = 3;
const ABSTANDSSCHRITT = 2;
/** Nebenfelder: bis drei Reihen vor dem Bauern, bis zwei Linien zur Seite. */
const REIHEN_VOR = 3;
const LINIEN_SEITLICH = 2;
/** Drei Steine: Bauer und zwei Könige. */
const STEINE_KPK = 3;

function zufallsfeld(zufall: Zufall): Square {
  return Math.floor(zufall() * FELDER) as Square;
}

/** Ein Feld für den weißen Bauern, a2 bis h6. */
function zufallsbauer(zufall: Zufall): Square {
  return (ERSTES_BAUERNFELD + Math.floor(zufall() * BAUERNFELDER)) as Square;
}

/** FEN aus einzelnen Steinen (Feld → FEN-Zeichen) und der Seite am Zug. */
export function fenAus(steine: ReadonlyMap<Square, string>, amZug: Color): string {
  const reihen: string[] = [];
  for (let reihe = LINIEN - 1; reihe >= 0; reihe--) {
    let zeile = "";
    let leer = 0;
    for (let linie = 0; linie < LINIEN; linie++) {
      const stein = steine.get((reihe * LINIEN + linie) as Square);
      if (!stein) leer++;
      else {
        zeile += (leer > 0 ? String(leer) : "") + stein;
        leer = 0;
      }
    }
    reihen.push(zeile + (leer > 0 ? String(leer) : ""));
  }
  return `${reihen.join("/")} ${amZug === "white" ? "w" : "b"} - - 0 1`;
}

/**
 * Eine legale Stellung aus den Steinen, sonst null (Könige zu nah, Seite nicht am Zug im Schach,
 * Matt oder Patt). Zwei nackte Könige sind erlaubt, obwohl die Partie dort remis wäre.
 */
function legal(steine: ReadonlyMap<Square, string>, amZug: Color): Stellung | null {
  const s = stellungAusFen(fenAus(steine, amZug));
  if (!s.ok || s.wert.regeln === null) return null;
  const r = s.wert.regeln;
  return r.isCheckmate() || r.isStalemate() ? null : s.wert;
}

/**
 * Quadrat: Weißer Bauer (2. bis 6. Reihe), schwarzer König, weißer König weit weg. Frage: Holt
 * der König den Bauern ein? Nur Stellungen ohne Vorbehalt und ohne Ausnahme des Buches.
 * Regel: Kapitel 8, die Quadratregel (am Zug ins Quadrat treten heißt einholen).
 */
export function quadratdrill(zufall: Zufall): Drill | null {
  for (let i = 0; i < VERSUCHE; i++) {
    const bauer = zufallsbauer(zufall);
    const schwarz = zufallsfeld(zufall);
    const weiss = zufallsfeld(zufall);
    if (new Set([bauer, schwarz, weiss]).size < STEINE_KPK || koenigsabstand(weiss, bauer) < FERN) continue;
    const amZug: Color = zufall() < HAELFTE ? "white" : "black";
    const s = legal(new Map([[bauer, "P"], [schwarz, "k"], [weiss, "K"]]), amZug);
    if (!s) continue;
    const q = quadrat(s, bauer);
    if (q.vorbehalte.length > 0 || q.ausnahme !== null || q.haeltAuf === null) continue;
    const rahmen = q.nachZug ?? q;
    return {
      art: "quadrat",
      fen: s.fen,
      optionen: ["ja", "nein"],
      richtig: q.haeltAuf ? "ja" : "nein",
      loesungsfelder: rahmen.felder.map(feldname),
    };
  }
  return null;
}

/**
 * Opposition: zwei Könige, in gut der Hälfte der Fälle auf einer Linie oder Reihe mit Abstand.
 * Frage: Wer hat die Opposition? Regel: Kapitel 8, die Opposition (wer nicht am Zug ist, hat sie).
 */
export function oppositionsdrill(zufall: Zufall): Drill | null {
  for (let i = 0; i < VERSUCHE; i++) {
    const weiss = zufallsfeld(zufall);
    const schwarz = zufall() < ANTEIL_GEGENUEBER ? gegenueber(weiss, zufall) : zufallsfeld(zufall);
    if (schwarz === null || weiss === schwarz) continue;
    const amZug: Color = zufall() < HAELFTE ? "white" : "black";
    const s = legal(new Map([[weiss, "K"], [schwarz, "k"]]), amZug);
    if (!s) continue;
    const wer = hatOpposition(s);
    return {
      art: "opposition",
      fen: s.fen,
      optionen: ["white", "black", "keiner"],
      richtig: wer ?? "keiner",
      loesungsfelder: [],
    };
  }
  return null;
}

/** Ein Feld auf derselben Linie oder Reihe im Abstand 2, 4 oder 6, sonst null. */
function gegenueber(feld: Square, zufall: Zufall): Square | null {
  const abstand = ABSTANDSSCHRITT * (1 + Math.floor(zufall() * ABSTAENDE));
  const richtung = zufall() < HAELFTE ? 1 : -1;
  const linie = feld % LINIEN;
  const reihe = Math.floor(feld / LINIEN);
  const senkrecht = zufall() < HAELFTE;
  const l = senkrecht ? linie : linie + richtung * abstand;
  const r = senkrecht ? reihe + richtung * abstand : reihe;
  if (l < 0 || l >= LINIEN || r < 0 || r >= LINIEN) return null;
  return (r * LINIEN + l) as Square;
}

/**
 * Schlüsselfelder: weißer Bauer, beide Könige abseits. Frage: Welches der drei Felder ist ein
 * Schlüsselfeld? Regel: Kapitel 8, Tabelle der Schlüsselfelder.
 */
export function schluesseldrill(zufall: Zufall): Drill | null {
  for (let i = 0; i < VERSUCHE; i++) {
    const bauer = zufallsbauer(zufall);
    const sf = schluesselfelder(bauer, "white");
    const richtig = sf.felder[Math.floor(zufall() * sf.felder.length)];
    if (richtig === undefined) continue;
    const andere = nebenfelder(bauer, new Set(sf.felder), zufall);
    if (andere.length < NEBENFELDER) continue;
    const weiss = zufallsfeld(zufall);
    const schwarz = zufallsfeld(zufall);
    const besetzt = new Set([bauer, weiss, schwarz, ...sf.felder, ...andere]);
    if (besetzt.size < STEINE_KPK + sf.felder.length + andere.length) continue;
    const s = legal(new Map([[bauer, "P"], [weiss, "K"], [schwarz, "k"]]), "white");
    if (!s) continue;
    const optionen = mische([richtig, ...andere], zufall).map(feldname);
    return {
      art: "schluesselfelder",
      fen: s.fen,
      optionen,
      richtig: feldname(richtig),
      loesungsfelder: sf.felder.map(feldname),
    };
  }
  return null;
}

/** Zwei Felder vor dem Bauern (höchstens drei Reihen), die keine Schlüsselfelder sind. */
function nebenfelder(bauer: Square, schluessel: ReadonlySet<Square>, zufall: Zufall): Square[] {
  const kandidaten: Square[] = [];
  for (let dr = 1; dr <= REIHEN_VOR; dr++) {
    for (let dl = -LINIEN_SEITLICH; dl <= LINIEN_SEITLICH; dl++) {
      const linie = (bauer % LINIEN) + dl;
      const reihe = Math.floor(bauer / LINIEN) + dr;
      if (linie < 0 || linie >= LINIEN || reihe >= LINIEN) continue;
      const feld = (reihe * LINIEN + linie) as Square;
      if (!schluessel.has(feld)) kandidaten.push(feld);
    }
  }
  return mische(kandidaten, zufall).slice(0, NEBENFELDER);
}

/**
 * Erkennungsbild-Quiz: Aus den Buchstellungen (FEN) die nehmen, für die das Werkzeug ein Bild
 * erkennt, dazu drei andere Bilder als Auswahl. Regel: Kapitel 9, „Rückblick: die Erkennungsbilder“.
 */
export function bilddrills(fens: readonly string[], zufall: Zufall): Drill[] {
  const erkannt = fens.flatMap((fen) => {
    const s = stellungAusFen(fen);
    const bild = s.ok ? erkennungsbild(s.wert, s.wert.amZug) : null;
    return bild ? [{ fen, bild: bild.bild }] : [];
  });
  const namen = [...new Set(erkannt.map((e) => e.bild))];
  return erkannt.map(({ fen, bild }) => {
    const falsche = mische(
      namen.filter((n): n is Bildname => n !== bild),
      zufall,
    ).slice(0, ANTWORTEN_BILD - 1);
    return {
      art: "bild",
      fen,
      optionen: mische([bild, ...falsche], zufall),
      richtig: bild,
      loesungsfelder: [],
    };
  });
}

/** Mischt eine Liste (Fisher-Yates) mit dem übergebenen Zufall. */
export function mische<T>(liste: readonly T[], zufall: Zufall): T[] {
  const neu = [...liste];
  for (let i = neu.length - 1; i > 0; i--) {
    const j = Math.floor(zufall() * (i + 1));
    [neu[i], neu[j]] = [neu[j] as T, neu[i] as T];
  }
  return neu;
}

/**
 * Eine gemischte Runde Kurzübungen: je Art reihum, das Quiz aus den Buchstellungen.
 * Beispiel: 8 Aufgaben → Quadrat, Opposition, Schlüsselfelder, Bild, Quadrat, …
 */
export function drillrunde(fens: readonly string[], anzahl: number, zufall: Zufall): Drill[] {
  const bilder = mische(bilddrills(fens, zufall), zufall);
  const runde: Drill[] = [];
  for (let i = 0; runde.length < anzahl && i < anzahl * 2; i++) {
    const art = DRILLARTEN[i % DRILLARTEN.length];
    const drill =
      art === "quadrat"
        ? quadratdrill(zufall)
        : art === "opposition"
          ? oppositionsdrill(zufall)
          : art === "schluesselfelder"
            ? schluesseldrill(zufall)
            : (bilder.shift() ?? null);
    if (drill) runde.push(drill);
  }
  return runde;
}
