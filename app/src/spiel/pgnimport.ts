/**
 * Eine Partie aus PGN einlesen, um sie in der App auswerten zu lassen (Wunsch des Autors vom
 * 19.10.2026: „PGN-Import an der Partienliste, ausgewertet, ungewertet gespeichert“).
 *
 * Rolle im Gesamtbild: Der Leser fügt eine Partie von Lichess, chess.com oder vom Partieformular
 * ein. Sie landet als beendete, ungewertete Partie in der Partienliste (speicher/partien.ts) und
 * bekommt dort dieselbe Auswertung wie eine Partie gegen die Engine. Beide Seiten zählen als
 * Leserzüge (wie Mensch gegen Mensch); die eigene Farbe wählt der Leser, damit „gewonnen“ und
 * „verloren“ aus seiner Sicht stimmen. Gelesen wird nur die Hauptvariante der ersten Partie.
 * Reine Funktionen.
 * Abhängigkeiten: chessops (PGN, SAN), spiel/partie.ts, spiel/ergebnis.ts, spiel/zuege.ts.
 */
import { makeFen } from "chessops/fen";
import { parsePgn, startingPosition } from "chessops/pgn";
import { makeSan, parseSan } from "chessops/san";
import type { Color } from "chessops/types";
import { partieendeNach, type Partieende } from "./ergebnis";
import { leserzug, type Partie } from "./partie";

/** Gründe, aus denen eine PGN nicht eingelesen wird; die Oberfläche sagt sie dem Leser. */
export type Importfehler =
  | { readonly art: "leer" }
  | { readonly art: "unlesbar" }
  /** Eine Schachvariante (Chess960, Crazyhouse, Atomic …); die App kennt nur normales Schach. */
  | { readonly art: "variante" }
  | { readonly art: "zug"; readonly zug: string; readonly nummer: number }
  | { readonly art: "ohneZuege" }
  | { readonly art: "ohneErgebnis" };

export type Importergebnis =
  | { readonly ok: true; readonly partie: Partie }
  | { readonly ok: false; readonly fehler: Importfehler };

/** Länge des Datums „2026.10.19“ in der Kopfzeile Date. */
const DATUMSLAENGE = 10;
const DATUM = /^(\d{4})\.(\d{2})\.(\d{2})$/;
/** Ohne Namen in der PGN: diese Platzhalter, wie PGN selbst sie schreibt. */
const OHNE_NAMEN = "?";

/** Beginn aus der Kopfzeile Date („2026.10.19“), sonst jetzt. */
function beginnAus(datum: string | undefined, jetzt: Date): string {
  const treffer = DATUM.exec((datum ?? "").slice(0, DATUMSLAENGE));
  if (!treffer) return jetzt.toISOString();
  const [, jahr, monat, tag] = treffer;
  const zeit = new Date(`${jahr}-${monat}-${tag}T12:00:00.000Z`);
  return Number.isNaN(zeit.getTime()) ? jetzt.toISOString() : zeit.toISOString();
}

/**
 * Das Ende der Partie: zuerst, was die Stellung selbst sagt (Matt, Patt, zu wenig Material),
 * sonst die Kopfzeilen Result und Termination.
 * Beispiel: „1-0“ ohne Matt mit Termination „Time forfeit“ → Zeit, Weiß gewinnt; „1/2-1/2“ ohne
 * erkennbaren Grund → vereinbart.
 * Sonderfall: Wiederholung und 50 Züge zählen nur, wenn die PGN Remis meldet.
 */
function endeAus(
  stellungen: readonly string[],
  ergebnis: string | undefined,
  abbruch: string | undefined,
): Partieende | null {
  const erkannt = partieendeNach(stellungen);
  if (erkannt && "sieger" in erkannt) return erkannt;
  if (ergebnis === "1/2-1/2") return erkannt ?? { art: "vereinbart" };
  if (erkannt?.art === "patt" || erkannt?.art === "material") return erkannt;
  const sieger: Color | null = ergebnis === "1-0" ? "white" : ergebnis === "0-1" ? "black" : null;
  if (!sieger) return null;
  const zeit = (abbruch ?? "").toLowerCase().includes("time");
  return { art: zeit ? "zeit" : "aufgabe", sieger };
}

/** Deutsche Figurenbuchstaben → englische (Kapitel 0, „Wie liest man Schachzüge?“). */
const DEUTSCHE_FIGUREN: Readonly<Record<string, string>> = { D: "Q", T: "R", L: "B", S: "N" };
/** Ein Großbuchstabe am Anfang eines Zuges (vor Feld, Linie, Reihe oder Schlag). */
const FIGUR_VOR_ZUG = /(^|[\s.(])([A-Z])(?=[a-h1-8]?x?[a-h][1-8])/g;
/** Figurinen („♘f3“, beim Kopieren von Zügen aus manchen Seiten) → englische Buchstaben. */
const FIGURINEN: Readonly<Record<string, string>> = {
  "♔": "K",
  "♕": "Q",
  "♖": "R",
  "♗": "B",
  "♘": "N",
  "♚": "K",
  "♛": "Q",
  "♜": "R",
  "♝": "B",
  "♞": "N",
  "♙": "",
  "♟": "",
};
const FIGURINE = /[♔♕♖♗♘♚♛♜♝♞♙♟]/gu;
/** Umwandlung mit deutschem Buchstaben („e8=D“). */
const DEUTSCHE_UMWANDLUNG = /=([DTLS])/g;
/** Figurenbuchstaben, die eine PGN kennt (englisch; P für Bauer kommt selten vor). */
const ENGLISCHE_FIGUREN = "KQRBNP";
/** Kopfzeilen und Kommentare: Dort wird nichts übersetzt oder geprüft. */
const KOPFZEILE = /^\s*\[.*$/gm;
const KOMMENTAR = /\{[^}]*\}|;[^\n]*/g;

/** Die letzte Zugnummer („12.“ oder „12...“) vor dieser Stelle; 1, wenn keine dasteht. */
function zugnummerVor(zugtext: string, stelle: number): number {
  const nummern = [...zugtext.slice(0, stelle).matchAll(/(\d+)\.+/g)];
  return Number(nummern[nummern.length - 1]?.[1] ?? 1);
}

/**
 * Die Zugfolge einer PGN mit englischen Figurenbuchstaben; deutsche werden übersetzt.
 *
 * Warum: Leser dieses Buches schreiben ihre Partien oft deutsch ab („2. Sf3 Sc6 3. Lc4“).
 * chessops überliest unbekannte Buchstaben und las „Sf3“ stillschweigend als Bauernzug f3, die
 * eingelesene Partie war dann eine andere (Fehlertest 1.11.2026). Englische Notation nutzt D, T,
 * L und S nie als Figur, deshalb ist die Übersetzung eindeutig.
 * Ausgabe: der Text mit übersetzten Zügen (Kopfzeilen bleiben), oder der erste Zug mit einem
 * unbekannten Buchstaben („Xf3“), damit er als Fehler gemeldet wird statt als Bauernzug.
 * Beispiel: „1. e4 e5 2. Sf3“ → „1. e4 e5 2. Nf3“, „a8=D“ → „a8=Q“, „2. ♘f3“ → „2. Nf3“.
 */
export function inEnglischerNotation(text: string): {
  text: string;
  unbekannt: { zug: string; nummer: number } | null;
} {
  const uebersetzt = text.replace(/^(?!\s*\[).*$/gm, (zeile) =>
    zeile
      .replace(FIGURINE, (f) => FIGURINEN[f] ?? f)
      .replace(FIGUR_VOR_ZUG, (ganz, vor: string, b: string) =>
        b in DEUTSCHE_FIGUREN ? `${vor}${DEUTSCHE_FIGUREN[b]}` : ganz,
      )
      .replace(DEUTSCHE_UMWANDLUNG, (_, b: string) => `=${DEUTSCHE_FIGUREN[b] ?? b}`),
  );
  const zugtext = uebersetzt.replace(KOPFZEILE, "").replace(KOMMENTAR, " ");
  for (const treffer of zugtext.matchAll(FIGUR_VOR_ZUG)) {
    const b = treffer[2] ?? "";
    if (!ENGLISCHE_FIGUREN.includes(b)) {
      const stelle = (treffer.index ?? 0) + (treffer[1] ?? "").length;
      const zug = zugtext.slice(stelle).split(/\s/)[0] ?? b;
      return { text: uebersetzt, unbekannt: { zug, nummer: zugnummerVor(zugtext, stelle) } };
    }
  }
  return { text: uebersetzt, unbekannt: null };
}

/** Normales Schach? Varianten (Chess960, Crazyhouse, Atomic …) liest die App nicht ein. */
function normalesSchach(rules: string, variante: string | undefined): boolean {
  return rules === "chess" && !/960|fischer/i.test(variante ?? "");
}

/**
 * Liest die erste Partie einer PGN.
 *
 * Eingaben: PGN-Text, die Farbe des Lesers, eine eindeutige Kennung, jetzt (für Tests fest).
 * Ausgabe: beendete, ungewertete Partie mit den Namen aus White und Black, oder der Grund.
 * Beispiel: „[Result "0-1"] 1. f3 e5 2. g4 Qh4#“ als Weiß → Matt, Schwarz gewinnt, verloren.
 * Sonderfälle: Eigene Startstellung über die Kopfzeile FEN; Nebenvarianten und Kommentare
 * fallen weg; deutsche Notation wird übersetzt (inEnglischerNotation); Varianten werden abgelehnt; eine Partie ohne Ergebnis („*“) wird abgelehnt, weil die Liste nur beendete hält.
 */
export function partieAusPgn(
  text: string,
  eigeneFarbe: Color,
  id: string,
  jetzt: Date,
): Importergebnis {
  if (text.trim() === "") return { ok: false, fehler: { art: "leer" } };
  const englisch = inEnglischerNotation(text);
  if (englisch.unbekannt !== null)
    return { ok: false, fehler: { art: "zug", ...englisch.unbekannt } };
  const spiel = parsePgn(englisch.text)[0];
  const start = spiel ? startingPosition(spiel.headers) : null;
  if (!spiel || !start || start.isErr) return { ok: false, fehler: { art: "unlesbar" } };
  const pos = start.value;
  if (!normalesSchach(pos.rules, spiel.headers.get("Variant"))) {
    return { ok: false, fehler: { art: "variante" } };
  }
  const startFen = makeFen(pos.toSetup());
  const stellungen = [startFen];
  const zuege = [];
  for (const knoten of spiel.moves.mainline()) {
    const zug = parseSan(pos, knoten.san);
    if (!zug) {
      const nummer = Math.floor(zuege.length / 2) + 1;
      return { ok: false, fehler: { art: "zug", zug: knoten.san, nummer } };
    }
    zuege.push(leserzug(makeSan(pos, zug)));
    pos.play(zug);
    stellungen.push(makeFen(pos.toSetup()));
  }
  if (zuege.length === 0) return { ok: false, fehler: { art: "ohneZuege" } };
  const kopf = spiel.headers;
  const ende = endeAus(stellungen, kopf.get("Result"), kopf.get("Termination"));
  if (!ende) return { ok: false, fehler: { art: "ohneErgebnis" } };
  return {
    ok: true,
    partie: {
      id,
      begonnen: beginnAus(kopf.get("Date"), jetzt),
      einstellung: {
        startFen,
        eigeneFarbe,
        stufe: 1,
        stufenJePhase: { eroeffnung: 1, mittelspiel: 1, endspiel: 1 },
        uhr: null,
        ruecknahmeErlaubt: false,
        abbildung: null,
        eroeffnung: null,
        gegner: "mensch",
        bot: null,
        hilfen: { symbole: false, werkzeuge: false },
        gewertet: false,
        importiert: {
          weiss: kopf.get("White") ?? OHNE_NAMEN,
          schwarz: kopf.get("Black") ?? OHNE_NAMEN,
        },
      },
      zuege,
      ruecknahmen: 0,
      uhr: null,
      ende,
    },
  };
}
