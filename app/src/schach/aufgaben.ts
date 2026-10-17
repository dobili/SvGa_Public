/**
 * Aufgaben einer Figur und doppelte Aufgaben (Warnsignal W4): Was verlöre die Seite ohne diese Figur?
 *
 * Rolle im Gesamtbild: Baustein für das Warnsignal W4 „Doppelte Aufgabe“ (k4-warnsignale,
 * k7-warnsignale), das Motiv Überlastung (taktikmotive.ts) und die Goldene Angriffsregel.
 * Pflichtenheft 6.6: „Eine Figur ist der einzige Verteidiger von zwei Zielen. Ziel ist eine eigene
 * Figur, die ohne sie laut Abtauschrechnung verloren ginge, oder ein Feld, auf dem der Gegner
 * sonst mattsetzt oder Material gewinnt.“
 * Verfahren: Die Figur wird weggedacht; was der Gegner danach sofort gewinnen könnte (Schlag mit
 * Gewinn oder Matt in einem Zug, wie bei den Drohungen) und vorher nicht konnte, sind ihre
 * Aufgaben. Schirmt sie den eigenen König ab (absolute Fesselung), ist auch das eine Aufgabe.
 * Dazu die Rückschlag-Probe (C2.9, Entscheidung des Autors): Ein Schlag, der schon jetzt möglich
 * ist, aber nur verliert, weil die Figur zurückschlägt, ist eine Aufgabe, wenn der Gegner nach
 * ihrem Rückschlag an anderer Stelle neu gewinnt (Übung 7.53: Dxc7 Dxc7 Te8#).
 * Abhängigkeiten: chessops, drohungen.ts, angriffskarte.ts, stellung.ts.
 * Buchbezug: Kapitel 4, W4 („Eine Figur erfüllt zwei Aufgaben zugleich, etwa als einziger
 * Verteidiger eines wichtigen Feldes“, Abb. 4.29: der Springer f3 vor h2); Kapitel 7, Überlastung.
 */
import { attacks } from "chessops/attacks";
import type { Chess } from "chessops/chess";
import type { Color, NormalMove, Square } from "chessops/types";
import type { Angriffskarte, Figurenstand } from "./angriffskarte";
import {
  legaleZuege,
  nullzug,
  schlaege,
  sofortigeGewinne,
  type Drohung,
  type Schlagzug,
} from "./drohungen";
import { gegner } from "./stellung";

/** Eine Aufgabe: eine Figur halten, ein Mattfeld decken oder den eigenen König abschirmen. */
export interface Aufgabe {
  readonly art: "figur" | "matt" | "koenig";
  /** Das Feld des Ziels: die gefährdete Figur, das Mattfeld oder der König. */
  readonly ziel: Square;
  /** Der Zug des Gegners, den die Figur verhindert (SAN englisch), etwa „Qxh2#“ in Abb. 4.29. */
  readonly zug?: string;
}

/** Eine Figur mit ihren Aufgaben (bei doppelteAufgaben mindestens zwei). */
export interface DoppelteAufgabe {
  readonly verteidiger: Figurenstand;
  readonly aufgaben: readonly Aufgabe[];
}

/** Ab so vielen Aufgaben ist eine Figur überlastet (Pflichtenheft 6.6: „zwei Ziele“). */
const AUFGABEN_FUER_W4 = 2;

/** Die Regeln mit dem Gegner am Zug (bei Bedarf als Nullzug), wie bei den Drohungen. */
function gegnerAmZug(regeln: Chess, farbe: Color): Chess {
  const feind = gegner(farbe);
  return regeln.turn === feind ? regeln : nullzug(regeln, feind);
}

function schluessel(drohung: Drohung): string {
  return `${drohung.art}:${drohung.zug.nach}`;
}

function aufgabeAus(drohung: Drohung): Aufgabe {
  const art = drohung.art === "matt" ? "matt" : "figur";
  return { art, ziel: drohung.zug.nach, zug: drohung.zug.san };
}

/** Aufgaben einer Figur: was der Gegner ohne sie zusätzlich sofort gewinnen könnte. */
function aufgabenOhne(basis: Chess, figur: Figurenstand, vorher: ReadonlySet<string>): Aufgabe[] {
  const ohne = basis.clone();
  ohne.board.take(figur.feld);
  const koenig = ohne.board.kingOf(figur.figur.color);
  if (
    koenig !== undefined &&
    ohne.kingAttackers(koenig, ohne.turn, ohne.board.occupied).nonEmpty()
  ) {
    return [{ art: "koenig", ziel: koenig }];
  }
  return sofortigeGewinne(ohne)
    .filter((drohung) => !vorher.has(schluessel(drohung)) && wehrtMattAb(basis, figur, drohung))
    .map(aufgabeAus);
}

/**
 * Wehrt die Figur ein Matt wirklich ab? Nach dem Mattzug auf dem echten Brett muss sie einen
 * legalen Zug haben (im Schach sind das nur Abwehrzüge).
 *
 * Regel: Kapitel 4, Kieninger-Falle (Abb. 4.21, 4.22): Verlässt der Springer e5 die e-Linie, ist
 * der Bauer e2 an den König gefesselt und darf nicht schlagen. Nach Sxf3+ verteidigt also nur g2
 * das Feld f3, nicht e2 (Rückfrage C2, nach Nachlesen im Buch).
 */
function wehrtMattAb(basis: Chess, figur: Figurenstand, drohung: Drohung): boolean {
  if (drohung.art !== "matt") return true;
  const danach = gespielt(basis, { from: drohung.zug.von, to: drohung.zug.nach });
  return legaleZuege(danach).some((zug) => zug.from === figur.feld);
}

function gespielt(regeln: Chess, zug: NormalMove): Chess {
  const kopie = regeln.clone();
  kopie.play(zug);
  return kopie;
}

/**
 * Rückschlag-Probe für einen Schlag des Gegners: Neue Gewinne nach dem Rückschlag der Figur.
 *
 * Regel: C2.9 (Entscheidung des Autors): Ein Schlag zählt auch dann als Aufgabe, wenn er schon
 * jetzt möglich ist, aber nur verliert, weil die Figur zurückschlägt. Neu heißt: nach dem
 * Rückschlag möglich, aber nicht, wenn die Figur stehen bliebe. Nur wenn die Figur als einzige
 * zurückschlagen kann; Schläge auf dasselbe Feld zählen nicht (das ist der normale Abtausch).
 */
function neuNachRueckschlag(basis: Chess, schlag: Schlagzug, figur: Figurenstand): Drohung[] {
  const nachSchlag = gespielt(basis, { from: schlag.von, to: schlag.nach });
  if (nachSchlag.isCheck()) return [];
  const zurueck = legaleZuege(nachSchlag).filter((zug) => zug.to === schlag.nach);
  const [rueckschlag] = zurueck;
  if (!rueckschlag || zurueck.some((zug) => zug.from !== figur.feld)) return [];
  const bliebe = new Set(sofortigeGewinne(nullzug(nachSchlag, basis.turn)).map(schluessel));
  return sofortigeGewinne(gespielt(nachSchlag, rueckschlag)).filter(
    (drohung) => drohung.zug.nach !== schlag.nach && !bliebe.has(schluessel(drohung)),
  );
}

/** Aufgaben aus der Rückschlag-Probe: das geschlagene Ziel und was danach neu fällt. */
function aufgabenBeimRueckschlag(
  basis: Chess,
  figur: Figurenstand,
  schlaegeDesGegners: readonly Schlagzug[],
): Aufgabe[] {
  const gedeckt = attacks(figur.figur, figur.feld, basis.board.occupied);
  return schlaegeDesGegners
    .filter((schlag) => schlag.bilanz <= 0 && gedeckt.has(schlag.nach))
    .flatMap((schlag) => {
      const neue = neuNachRueckschlag(basis, schlag, figur);
      if (neue.length === 0) return [];
      return [
        { art: "figur", ziel: schlag.nach, zug: schlag.san } as const,
        ...neue.map(aufgabeAus),
      ];
    });
}

/** Je Zielfeld eine Aufgabe; Matt geht vor Material (Dxh2# ist zugleich ein Schlag auf h2). */
function jeZielfeld(aufgaben: readonly Aufgabe[]): Aufgabe[] {
  const jeFeld = new Map<Square, Aufgabe>();
  for (const aufgabe of aufgaben) {
    const bekannt = jeFeld.get(aufgabe.ziel);
    if (!bekannt || (aufgabe.art === "matt" && bekannt.art === "figur")) {
      jeFeld.set(aufgabe.ziel, aufgabe);
    }
  }
  return [...jeFeld.values()];
}

/**
 * Alle Figuren einer Farbe mit mindestens einer Aufgabe.
 *
 * Warum: Grundlage für W4 (Kapitel 4) und die Überlastung (Kapitel 7); die Auswahl, ab wann eine
 * Figur ein Warnsignal ist, treffen doppelteAufgaben() und istW4().
 * Eingaben: Regeln, Angriffskarte, Farbe. Ausgabe: Figuren mit ihren Aufgaben, oder null, wenn
 * die Farbe am Zug im Schach steht (dann fragt niemand, was der Gegner gewänne).
 * Beispiel: Abb. 4.29: Der Springer f3 hat eine Aufgabe, h2 gegen Dxh2#. Übung 7.53: Die Dame d8
 * hält c7 (ohne sie gewinnt Dxc7) und e8 (nach Dxc7 Dxc7 folgt Te8#).
 * Sonderfälle: Der König hat keine Aufgaben in diesem Sinn (er kann nicht weggedacht werden).
 * Art N: Die Abtauschrechnung kennt keine Fesselungen; das genaue Urteil braucht die Engine.
 */
export function aufgabenJeFigur(
  regeln: Chess,
  karte: Angriffskarte,
  farbe: Color,
): DoppelteAufgabe[] | null {
  if (regeln.turn === farbe && regeln.isCheck()) return null;
  const basis = gegnerAmZug(regeln, farbe);
  const vorher = new Set(sofortigeGewinne(basis).map(schluessel));
  const schlaegeDesGegners = schlaege(basis);
  const ergebnis: DoppelteAufgabe[] = [];
  for (const figur of karte.figuren(farbe)) {
    if (figur.figur.role === "king") continue;
    const aufgaben = jeZielfeld([
      ...aufgabenOhne(basis, figur, vorher),
      ...aufgabenBeimRueckschlag(basis, figur, schlaegeDesGegners),
    ]);
    if (aufgaben.length > 0) ergebnis.push({ verteidiger: figur, aufgaben });
  }
  return ergebnis;
}

/** Hat die Figur zwei oder mehr Aufgaben (überlastet im Sinn des Motivs Überlastung)? */
export function istUeberlastet(figur: DoppelteAufgabe): boolean {
  return figur.aufgaben.length >= AUFGABEN_FUER_W4;
}

/**
 * Ist die Figur ein Warnsignal W4?
 *
 * Regel: Kapitel 4, W4 („Eine Figur erfüllt zwei Aufgaben zugleich, etwa als einziger
 * Verteidiger eines wichtigen Feldes“) mit C1.7 (Entscheidung des Autors): zwei Aufgaben, oder
 * schon eine, wenn die Figur der einzige Verteidiger gegen ein Matt ist.
 * Beispiel: Abb. 4.29: Springer f3, einziger Verteidiger von h2 gegen Dxh2#.
 */
export function istW4(figur: DoppelteAufgabe): boolean {
  return istUeberlastet(figur) || figur.aufgaben.some((aufgabe) => aufgabe.art === "matt");
}

/**
 * Alle Figuren einer Farbe mit mindestens zwei Aufgaben (Motiv Überlastung, Kapitel 7).
 *
 * Warum: Eine überlastete Figur kann nicht beides halten; ein Schlag oder ein Ablenkungsopfer
 * gegen eine Aufgabe lässt die andere fallen (Kapitel 4, W4; Kapitel 7, Überlastung).
 * Eingaben: Regeln, Angriffskarte, Farbe. Ausgabe: überlastete Figuren mit ihren Aufgaben, oder
 * null, wenn die Farbe am Zug im Schach steht.
 * Beispiel: Abb. 4.13 (Weiß am Zug): Der Springer f6 hält den Bauern d5 und schirmt die Dame d8
 * gegen den Läufer g5 ab, zwei Aufgaben. Übung 7.53: Die Dame d8 hält c7 und e8.
 */
export function doppelteAufgaben(
  regeln: Chess,
  karte: Angriffskarte,
  farbe: Color,
): DoppelteAufgabe[] | null {
  return aufgabenJeFigur(regeln, karte, farbe)?.filter(istUeberlastet) ?? null;
}
