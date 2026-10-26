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

/**
 * Liest die erste Partie einer PGN.
 *
 * Eingaben: PGN-Text, die Farbe des Lesers, eine eindeutige Kennung, jetzt (für Tests fest).
 * Ausgabe: beendete, ungewertete Partie mit den Namen aus White und Black, oder der Grund.
 * Beispiel: „[Result "0-1"] 1. f3 e5 2. g4 Qh4#“ als Weiß → Matt, Schwarz gewinnt, verloren.
 * Sonderfälle: Eigene Startstellung über die Kopfzeile FEN; Nebenvarianten und Kommentare
 * fallen weg; eine Partie ohne Ergebnis („*“) wird abgelehnt, weil die Liste nur beendete hält.
 */
export function partieAusPgn(
  text: string,
  eigeneFarbe: Color,
  id: string,
  jetzt: Date,
): Importergebnis {
  if (text.trim() === "") return { ok: false, fehler: { art: "leer" } };
  const spiel = parsePgn(text)[0];
  const start = spiel ? startingPosition(spiel.headers) : null;
  if (!spiel || !start || start.isErr) return { ok: false, fehler: { art: "unlesbar" } };
  const pos = start.value;
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
