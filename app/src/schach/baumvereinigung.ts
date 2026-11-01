/**
 * Zugbäume vereinen und an die Grenzen einer Variante anpassen: zwei Bäume zusammenlegen, einen
 * Baum an einer Stelle einhängen, Stellungen im Baum suchen, auf 600 Züge und 30 Fortsetzungen
 * begrenzen.
 *
 * Rolle im Gesamtbild: Variationsbrowser, Stufe 4 (Wunsch des Autors, 1.11.2026: „eine ganze
 * Eröffnung mit all ihren Abzweigungen laden“). Die Zugfolgen mehrerer Abbildungen des Buches und
 * die Linien der Praxis (Lichess) werden hier zu einem Baum. Gleiche Züge an derselben Stelle
 * werden ein Knoten; was zuerst da war, bleibt vorn (Hauptvariante) und behält Herkunft,
 * Zugzeichen und Kommentar. Grenzen nach Format 8 (training/variationen.ts): Statt still zu kürzen
 * meldet begrenzt(), dass gekürzt wurde, und die Oberfläche sagt es dem Leser. Reine Funktionen.
 * Abhängigkeiten: chessops, schach/variationsbaum.ts, schach/eroeffnungsindex.ts (Schlüssel),
 * training/variationen.ts (Typen, Grenzen).
 * Buchbezug: Kapitel 2, „Zugumstellungen“ (dieselbe Stellung über verschiedene Zugfolgen).
 */
import type { Chess } from "chessops/chess";
import { makeFen } from "chessops/fen";
import { parseSan } from "chessops/san";
import {
  HOECHSTENS_FORTSETZUNGEN,
  HOECHSTENS_KNOTEN,
  type Variationsknoten,
} from "../training/variationen";
import { stellungsschluessel } from "./eroeffnungsindex";
import { knotenzahl, stellungAus, type Pfad } from "./variationsbaum";

type Knotenliste = readonly Variationsknoten[];

/**
 * Legt zwei Listen von Fortsetzungen zusammen: Gleiche Züge werden ein Knoten (rekursiv), neue
 * hängen hinten an. Herkunft, Zeichen und Kommentar des ersten Baums bleiben; fehlt dort ein
 * Zugzeichen, gilt das des zweiten (Buchzeichen bleiben so auch aus einer Übung erhalten).
 * Beispiel: [e4 e5 Nf3] und [e4 c5] → e4 mit den Fortsetzungen e5 (Nf3) und c5.
 */
export function vereinige(a: Knotenliste, b: Knotenliste): Variationsknoten[] {
  const ergebnis = [...a];
  for (const neu of b) {
    const stelle = ergebnis.findIndex((k) => k.zug === neu.zug);
    const alt = ergebnis[stelle];
    if (!alt) {
      ergebnis.push(neu);
      continue;
    }
    const zeichen = alt.zeichen ?? neu.zeichen;
    ergebnis[stelle] = {
      ...alt,
      ...(zeichen ? { zeichen } : {}),
      weiter: vereinige(alt.weiter, neu.weiter),
    };
  }
  return ergebnis;
}

/**
 * Hängt Fortsetzungen am Ende eines Pfades ein (vereinigt mit dem, was dort schon steht).
 * Ausgabe: neuer Baum; steht der Pfad nicht im Baum, der alte unverändert.
 * Beispiel: Italienisch, Pfad bis 3... Lc5, dazu [b4 …] (Evans-Gambit) → Abzweig nach 3... Lc5.
 */
export function eingehaengt(zuege: Knotenliste, pfad: Pfad, dazu: Knotenliste): Knotenliste {
  const [kopf, ...rest] = pfad;
  if (kopf === undefined) return vereinige(zuege, dazu);
  return zuege.map((k) =>
    k.zug === kopf ? { ...k, weiter: eingehaengt(k.weiter, rest, dazu) } : k,
  );
}

/** Der Stellungsschlüssel (Brett, Zugrecht, Rochade, en passant) einer chessops-Stellung. */
export function schluesselVon(pos: Chess): string {
  return stellungsschluessel(makeFen(pos.toSetup()));
}

/** Der Stellungsschlüssel nach einer Zugfolge; null, wenn ein Zug nicht passt. */
export function schluesselNach(startFen: string, zuege: readonly string[]): string | null {
  const pos = stellungAus(startFen);
  if (!pos) return null;
  for (const san of zuege) {
    const zug = parseSan(pos, san);
    if (!zug) return null;
    pos.play(zug);
  }
  return schluesselVon(pos);
}

/** Ein Fund im Baum: die Fortsetzungen nach der gesuchten Stellung. */
export interface Stellungsfund {
  readonly pfad: Pfad;
  readonly weiter: Knotenliste;
}

/**
 * Sucht in einem Baum jede Stellung mit dem Schlüssel und gibt die Fortsetzungen danach; unter
 * einem Fund wird nicht weiter gesucht (sein Ast hängt schon ganz daran).
 *
 * Warum: Eine Übung oder ein Gambit kann dieselbe Stellung über eine andere Zugfolge erreichen
 * (Zugumstellung, Kapitel 2); dann gehört ihre Fortsetzung trotzdem zur Eröffnung.
 * Beispiel: Evans-Gambit (Kapitel 3), gesucht die Stellung nach 3... Lc5 → ein Fund mit b4.
 */
export function stellungsfunde(
  startFen: string,
  zuege: Knotenliste,
  schluessel: string,
): Stellungsfund[] {
  const start = stellungAus(startFen);
  if (!start) return [];
  const funde: Stellungsfund[] = [];
  const lauf = (pos: Chess, liste: Knotenliste, pfad: Pfad): void => {
    if (schluesselVon(pos) === schluessel) {
      funde.push({ pfad, weiter: liste });
      return;
    }
    for (const k of liste) {
      const zug = parseSan(pos, k.zug);
      if (!zug) continue;
      const danach = pos.clone();
      danach.play(zug);
      lauf(danach, k.weiter, [...pfad, k.zug]);
    }
  };
  lauf(start, zuege, []);
  return funde;
}

/** Ergebnis von begrenzt(): der Baum innerhalb der Grenzen und ob dafür gekürzt wurde. */
export interface Begrenzung {
  readonly zuege: Variationsknoten[];
  /** Züge vor dem Kürzen (gleich knotenzahl(zuege), wenn nichts fehlt). */
  readonly vorher: number;
  readonly gekuerzt: boolean;
}

/** Ein Knoten, der in der Breitensuche wartet, mit dem Ort, an dem er eingetragen wird. */
interface Wartend {
  readonly knoten: Variationsknoten;
  readonly ziel: Variationsknoten[];
}

/**
 * Begrenzt einen Baum auf höchstens ``hoechstens`` Züge und HOECHSTENS_FORTSETZUNGEN je Stellung.
 *
 * Warum: Format 8 erlaubt je Variante 600 Züge und 30 Fortsetzungen (Entwurf, Abschnitt 5). Eine
 * ganze Eröffnung aus Buch und Praxis bleibt meist darunter; wird sie größer, kürzt die App von
 * hinten (Breitensuche: frühe Züge und Hauptvarianten bleiben, späte Züge fallen zuerst) und
 * meldet es (Wunsch des Autors: Meldung statt still kürzen).
 * Beispiel: Baum mit 700 Zügen → 600 Züge, gekuerzt true, vorher 700.
 */
export function begrenzt(zuege: Knotenliste, hoechstens: number = HOECHSTENS_KNOTEN): Begrenzung {
  const vorher = knotenzahl(zuege);
  const wurzel: Variationsknoten[] = [];
  let schlange: Wartend[] = zuege
    .slice(0, HOECHSTENS_FORTSETZUNGEN)
    .map((knoten) => ({ knoten, ziel: wurzel }));
  let rest = hoechstens;
  let breiteGekuerzt = zuege.length > HOECHSTENS_FORTSETZUNGEN;
  while (schlange.length > 0 && rest > 0) {
    const naechste: Wartend[] = [];
    for (const { knoten, ziel } of schlange) {
      if (rest <= 0) break;
      rest -= 1;
      const kopie: Variationsknoten = { ...knoten, weiter: [] };
      const kinder = kopie.weiter as Variationsknoten[];
      ziel.push(kopie);
      if (knoten.weiter.length > HOECHSTENS_FORTSETZUNGEN) breiteGekuerzt = true;
      for (const kind of knoten.weiter.slice(0, HOECHSTENS_FORTSETZUNGEN))
        naechste.push({ knoten: kind, ziel: kinder });
    }
    schlange = naechste;
  }
  const behalten = knotenzahl(wurzel);
  return { zuege: wurzel, vorher, gekuerzt: breiteGekuerzt || behalten < vorher };
}
