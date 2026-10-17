/**
 * Eröffnungsindex: jede Stellung aus den Buchvarianten der Kapitel 2 und 3, mit Eröffnung und Weg.
 *
 * Rolle im Gesamtbild: Baustein für das Werkzeug k2-eroeffnung. Pflichtenheft 6.2: „Name der
 * Eröffnung und Variante aus den Buchvarianten, auch nach Zugumstellung über den
 * Stellungsvergleich. Sprung zum passenden Steckbrief.“ Der Schlüssel einer Stellung ist die
 * Figurenstellung mit Zugrecht und Rochaderechten (die ersten drei Felder der FEN); damit findet
 * die App eine Stellung unabhängig von der Zugfolge, auf der sie entstanden ist.
 * Abhängigkeiten: chessops, daten/generiert (Kapitel, Beispiel, Steckbrief).
 * Buchbezug: Kapitel 2 (Eröffnungen mit Steckbrief), Abschnitt 2.12 „Zugumstellungen“;
 * Kapitel 3 (Gambits).
 */
import { Chess } from "chessops/chess";
import { makeFen, parseFen } from "chessops/fen";
import { parseSan } from "chessops/san";
import type { Beispiel, Knoten } from "../daten/generiert/beispiel";
import type { Kapitel, Steckbrief } from "../daten/generiert/kapitel";
import type { Eroeffnungsnamen } from "./eroeffnungsnamen";

/** Felder der FEN, die eine Stellung für den Vergleich ausmachen (Figuren, Zugrecht, Rochade). */
const SCHLUESSELFELDER = 3;
/** Artikel am Anfang eines Abschnittstitels, die der Name nicht braucht („Das Königsgambit“). */
const ARTIKEL = /^(die|das|der)\s+/i;
/** Beispieltitel, die keine Eröffnung nennen; dann gilt der Abschnittstitel, falls er eine nennt. */
const ALLGEMEINE_TITEL = new Set(["Weitere Varianten", "Grundstellung"]);

export interface Eroeffnungseintrag {
  /** Name der Eröffnung: der Steckbrief (Kapitel 2) oder der Abschnitt (Kapitel 3). */
  readonly name: string;
  readonly steckbrief: Steckbrief | null;
  readonly abschnitt: string;
  /** Die Züge bis zu dieser Stellung (englische Kurznotation) ab der Ausgangsstellung. */
  readonly zuege: readonly string[];
  /** Liegt die Stellung auf der Hauptvariante des Beispiels? */
  readonly hauptvariante: boolean;
  /** Die erste Abbildung des Abschnitts (dort steht der Steckbrief), für den Sprung ins Buch. */
  readonly abbildung: string | null;
}

export interface Eroeffnungsindex {
  /** Stellungsschlüssel → Eröffnungen, in denen die Stellung vorkommt. */
  readonly stellungen: ReadonlyMap<string, readonly Eroeffnungseintrag[]>;
  /** „Schlüssel vor dem Zug|Zug“ → Zugzeichen des Buches („“, „!“, „?“ …), für k1-todsuenden. */
  readonly buchzuege: ReadonlyMap<string, string>;
  /** Eröffnungen außerhalb des Buches (Lichess-Liste, seit 0.2.32); fehlt sie, gibt es keine. */
  readonly bekannte?: Eroeffnungsnamen;
}

/** Schlüssel eines Buchzuges: Stellung davor und Zug in englischer Kurznotation. */
export function buchzugschluessel(schluesselVorher: string, san: string): string {
  return `${schluesselVorher}|${san}`;
}

/**
 * Die Buchzüge ab einer Stellung (englische Kurznotation), ohne die mit „?“ markierten.
 *
 * Warum: Eröffnungsmodus beim Spiel gegen die Engine (Konzept 8.3): Die Engine folgt den
 * Varianten aus Kapitel 2 und 3. Beispiel: Grundstellung → e4, d4, … (alle Buchanfänge).
 */
export function buchzuegeAb(index: Eroeffnungsindex, fen: string): string[] {
  const vorne = `${stellungsschluessel(fen)}|`;
  const zuege: string[] = [];
  for (const [schluessel, zeichen] of index.buchzuege) {
    if (schluessel.startsWith(vorne) && !zeichen.includes("?")) {
      zuege.push(schluessel.slice(vorne.length));
    }
  }
  return zuege;
}

/**
 * Die Buchzüge ab einer Stellung, die in einer bestimmten Eröffnung bleiben (englische
 * Kurznotation); leer, wenn keiner dorthin führt.
 *
 * Warum: Seit 0.2.39 kann der Leser der Engine eine Eröffnung vorgeben (Rückmeldung des Autors
 * zu N178). Beispiel: Grundstellung, „Spanische Partie“ → [„e4“]; nach 1. e4 e5 2. Sf3 Sc6 →
 * [„Bb5“]. Sonderfall: Hat der Leser die Eröffnung verlassen, gibt es keine Züge mehr, und die
 * Engine spielt die übrigen Buchzüge oder selbst.
 */
export function buchzuegeZu(index: Eroeffnungsindex, fen: string, name: string): string[] {
  const start = startstellung(fen);
  if (!start) return [];
  return buchzuegeAb(index, fen).filter((san) => {
    const zug = parseSan(start, san);
    if (!zug) return false;
    const danach = start.clone();
    danach.play(zug);
    const eintraege = index.stellungen.get(stellungsschluessel(makeFen(danach.toSetup()))) ?? [];
    return eintraege.some((e) => e.name === name);
  });
}

/** Die Namen aller Eröffnungen des Index in der Reihenfolge des Buches (ohne Doppelte). */
export function eroeffnungsnamen(index: Eroeffnungsindex): string[] {
  const namen: string[] = [];
  for (const eintraege of index.stellungen.values()) {
    for (const e of eintraege) if (!namen.includes(e.name)) namen.push(e.name);
  }
  return namen;
}

/**
 * Die längste Hauptvariante einer Eröffnung (englische Kurznotation ab der Grundstellung), als
 * Vorschau für den Leser. Beispiel: „Spanische Partie“ → [„e4“, „e5“, „Nf3“, „Nc6“, „Bb5“, …].
 */
export function hauptlinieVon(index: Eroeffnungsindex, name: string): readonly string[] {
  let laengste: readonly string[] = [];
  for (const eintraege of index.stellungen.values()) {
    for (const e of eintraege) {
      if (e.name === name && e.hauptvariante && e.zuege.length > laengste.length)
        laengste = e.zuege;
    }
  }
  return laengste;
}

/** Schlüssel einer Stellung: „rnbqkbnr/… w KQkq“. */
export function stellungsschluessel(fen: string): string {
  return fen.trim().split(/\s+/).slice(0, SCHLUESSELFELDER).join(" ");
}

/**
 * „Ein strategisches Gegenbeispiel: das Wolga-Gambit“ → „Wolga-Gambit“. Ohne „das“ braucht ein
 * Adjektiv davor die starke Endung: „Das Dänische Gambit“ → „Dänisches Gambit“.
 */
function ohneArtikel(titel: string): string {
  const nachDoppelpunkt = titel.includes(":") ? titel.slice(titel.lastIndexOf(":") + 1) : titel;
  const text = nachDoppelpunkt.trim();
  const ohne = text.replace(ARTIKEL, "").trim();
  const [erstes, ...rest] = ohne.split(" ");
  const saechlich = /^das\s/i.test(text) && rest.length > 0 && erstes?.endsWith("e");
  return saechlich ? [`${erstes}s`, ...rest].join(" ") : ohne;
}

/** Der Steckbrief zu einem Beispiel: im selben Abschnitt, bei mehreren der mit gleichem Namen. */
function steckbriefZu(beispiel: Beispiel, steckbriefe: readonly Steckbrief[]): Steckbrief | null {
  const imAbschnitt = steckbriefe.filter((s) => s.abschnitt === beispiel.abschnitt);
  if (imAbschnitt.length <= 1) return imAbschnitt[0] ?? null;
  const erstesWort = ohneArtikel(beispiel.titel).split(/[\s-]/)[0] ?? "";
  return imAbschnitt.find((s) => s.name.split(/[\s-]/).includes(erstesWort)) ?? null;
}

/**
 * Name der Eröffnung: der Steckbrief, in Kapiteln ohne Steckbriefe (Kapitel 3) der Titel des
 * Beispiels; bei allgemeinen Titeln der Abschnitt, wenn er eine Eröffnung nennt („Das …“).
 */
function nameZu(
  kapitel: Kapitel,
  beispiel: Beispiel,
  steckbrief: Steckbrief | null,
): string | null {
  if (steckbrief) return steckbrief.name;
  if (kapitel.steckbriefe.length > 0) return null;
  const abschnitt = kapitel.abschnitte.find((a) => a.nummer === beispiel.abschnitt);
  if (!abschnitt) return null;
  if (!ALLGEMEINE_TITEL.has(beispiel.titel)) return ohneArtikel(beispiel.titel);
  return ARTIKEL.test(abschnitt.titel) ? ohneArtikel(abschnitt.titel) : null;
}

function startstellung(fen: string): Chess | null {
  const setup = parseFen(fen);
  if (setup.isErr) return null;
  const stellung = Chess.fromSetup(setup.value);
  return stellung.isOk ? stellung.value : null;
}

type Eintragen = (
  vorher: Chess,
  knoten: Knoten,
  danach: Chess,
  zuege: readonly string[],
  haupt: boolean,
) => void;

/** Läuft den Variantenbaum ab und trägt jede Stellung ein. */
function laufe(
  knoten: readonly Knoten[],
  stellung: Chess,
  weg: string[],
  haupt: boolean,
  eintragen: Eintragen,
) {
  knoten.forEach((k, stelle) => {
    const zug = parseSan(stellung, k.zug);
    if (!zug) return;
    const danach = stellung.clone();
    danach.play(zug);
    const zuege = [...weg, k.zug];
    const aufHaupt = haupt && stelle === 0;
    eintragen(stellung, k, danach, zuege, aufHaupt);
    laufe(k.weiter, danach, zuege, aufHaupt, eintragen);
  });
}

/** Die erste Abbildung eines Abschnitts. */
function ersteAbbildung(kapitel: Kapitel, abschnitt: string): string | null {
  return kapitel.abbildungen.find((a) => a.abschnitt?.nummer === abschnitt)?.id ?? null;
}

/**
 * Baut den Index aus den Beispielen der Kapitel.
 *
 * Warum: Eine Eröffnung erkennt man an der Stellung, nicht an der Zugfolge (Abschnitt 2.12:
 * „Zugumstellungen“). Eingaben: geladene Kapitel (2 und 3). Ausgabe: Schlüssel → Einträge.
 * Beispiel: Nach 1. e4 e5 2. Sf3 Sc6 3. Lb5 steht „Spanische Partie“ im Index.
 * Sonderfälle: Beispiele ohne Eröffnungsnamen (Übungen, Abschnitt 2.12) tragen nichts ein; eine
 * Stellung kann zu mehreren Eröffnungen gehören (der gemeinsame Stamm).
 */
export function baueEroeffnungsindex(
  kapitelListe: readonly Kapitel[],
  bekannte: Eroeffnungsnamen = new Map(),
): Eroeffnungsindex {
  const stellungen = new Map<string, Eroeffnungseintrag[]>();
  const buchzuege = new Map<string, string>();
  for (const kapitel of kapitelListe) {
    for (const beispiel of kapitel.beispiele) {
      const steckbrief = steckbriefZu(beispiel, kapitel.steckbriefe);
      const name = nameZu(kapitel, beispiel, steckbrief);
      const start = startstellung(beispiel.startFen);
      if (!name || !start || !beispiel.abschnitt) continue;
      const abschnitt = beispiel.abschnitt;
      const abbildung = ersteAbbildung(kapitel, abschnitt);
      laufe(beispiel.zuege, start, [], true, (vorher, knoten, danach, zuege, hauptvariante) => {
        const schluessel = stellungsschluessel(makeFen(danach.toSetup()));
        const liste = stellungen.get(schluessel) ?? [];
        liste.push({ name, steckbrief, abschnitt, zuege, hauptvariante, abbildung });
        stellungen.set(schluessel, liste);
        const vorherSchluessel = stellungsschluessel(makeFen(vorher.toSetup()));
        const zugschluessel = buchzugschluessel(vorherSchluessel, knoten.zug);
        // Ein Zug, den das Buch irgendwo mit ? markiert, bleibt markiert.
        if (!buchzuege.get(zugschluessel)?.includes("?")) {
          buchzuege.set(zugschluessel, knoten.zeichen);
        }
      });
    }
  }
  return { stellungen, buchzuege, bekannte };
}
