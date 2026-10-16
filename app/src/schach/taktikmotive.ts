/**
 * Die zwölf Grundmotive aus Kapitel 7, erkannt an einer Lösungszugfolge: Gabel und Doppelangriff,
 * Fesselung, Spieß, Abzug, Doppelschach, Hinlenkung und Räumung, Beseitigung, Überlastung und
 * Ablenkung, Zwischenzug und Desperado, gefangene Figur, Umwandlung, Dauerschach und Patt.
 *
 * Rolle im Gesamtbild: Baustein für k7-motiv („Motiv benennen“, Pflichtenheft 6.3). Die Regeln
 * sind Näherungen am Buch (Art N); an den verschlagworteten Aufgaben des Buches geeicht.
 * Abhängigkeiten: chessops, angriffskarte.ts, linienmotive.ts, aufgaben.ts, drohungen.ts,
 * sichereFelder.ts, mattbilder.ts, stellung.ts.
 * Buchbezug: Kapitel 7, „Die zwölf Grundmotive“ (Abb. 7.1 bis 7.29) und die Mattbilder.
 */
import { attacks } from "chessops/attacks";
import { Chess } from "chessops/chess";
import { makeFen } from "chessops/fen";
import { makeSanAndPlay, parseSan } from "chessops/san";
import type { Color, NormalMove, Piece, Square } from "chessops/types";
import { Angriffskarte } from "./angriffskarte";
import { doppelteAufgaben } from "./aufgaben";
import { istGabelziel } from "./gabeln";
import { nullzug, schlaege } from "./drohungen";
import { fesselungen, linienmotive, type Linienmotiv } from "./linienmotive";
import { mattbild, type Mattbild } from "./mattbilder";
import { sichereFelder } from "./sichereFelder";
import { FIGURENWERT, gegner, stellungAusFen } from "./stellung";

export type Motiv =
  | "gabel"
  | "doppelangriff"
  | "fesselung"
  | "spiess"
  | "abzug"
  | "doppelschach"
  | "hinlenkung"
  | "raeumung"
  | "beseitigung"
  | "ueberlastung"
  | "ablenkung"
  | "batterie"
  | "zwischenzug"
  | "desperado"
  | "gefangen"
  | "umwandlung"
  | "dauerschach"
  | "patt";

/** Reihenfolge, in der die App das erste Motiv nennt: Zugfolge-Motive vor Ein-Zug-Motiven. */
const RANGFOLGE: readonly Motiv[] = [
  "raeumung",
  "beseitigung",
  "ueberlastung",
  "ablenkung",
  "hinlenkung",
  "zwischenzug",
  "desperado",
  "patt",
  "dauerschach",
  "doppelschach",
  "abzug",
  "batterie",
  "gabel",
  "doppelangriff",
  "spiess",
  "fesselung",
  "umwandlung",
  "gefangen",
];
/** Motive, die auch ein späterer eigener Zug der Folge beisteuern darf (Abb. 7.56: Doppelschach im zweiten Zug). */
const SPAETER_ERLAUBT: ReadonlySet<Motiv> = new Set([
  "raeumung",
  "beseitigung",
  "ablenkung",
  "hinlenkung",
  "doppelschach",
  "abzug",
  "batterie",
  "gabel",
  "doppelangriff",
]);
/** Ab diesem Gewinn (Bauerneinheiten) ist ein gegnerischer Schlag ein Materialgewinn. */
const GEWINN_AB = 3;
/** So viele Schachs in Folge gelten als Dauerschach. */
const DAUERSCHACH_AB = 2;
/** Ab diesem Rückstand (Bauerneinheiten, eine Leichtfigur) steht eine Seite auf Verlust (wie W-Tabelle). */
const VERLUST_AB = 3;

/** Ein gespielter Halbzug mit Stellung davor und danach. */
interface Halbzug {
  readonly san: string;
  readonly zug: NormalMove;
  readonly figur: Piece;
  readonly geschlagen: Piece | null;
  readonly vorher: Chess;
  readonly nachher: Chess;
}

export interface Motivbefund {
  readonly motive: readonly Motiv[];
  readonly mattbild: Mattbild | null;
  /** Das Mattbild, das nach der Folge droht (Abb. 7.61: Dh6 droht das Lolli-Matt Dg7#), sonst null. */
  readonly gedroht: Mattbild | null;
  readonly schluessel: Halbzug;
  /** Figuren, die der Schlüsselzug angreift oder trifft (für rote Markierungen). */
  readonly ziele: readonly Square[];
  readonly halbzuege: readonly Halbzug[];
  /** Der Schlüsselzug zieht eine relativ gefesselte Figur (Abb. 7.21: 6... Sxe4 trotz Lg5). */
  readonly fesselungDurchbrochen: boolean;
}

/** Spielt die Zugfolge (SAN) nach, bis ein Zug nicht geht. */
function nachspielen(regeln: Chess, zuege: readonly string[]): Halbzug[] {
  const folge: Halbzug[] = [];
  const pos = regeln.clone();
  for (const san of zuege) {
    const zug = parseSan(pos, san);
    if (!zug || !("from" in zug)) break;
    const figur = pos.board.get(zug.from);
    if (!figur) break;
    const geschlagen = pos.board.get(zug.to) ?? null;
    const vorher = pos.clone();
    makeSanAndPlay(pos, zug);
    folge.push({ san, zug, figur, geschlagen, vorher, nachher: pos.clone() });
  }
  return folge;
}

/**
 * Ziele einer Figur von einem Feld aus: König, wertvollere oder ungedeckte Figuren, ungedeckte
 * Bauern. Regel: dieselbe wie bei W6 (gabeln.ts, istGabelziel; Entscheidung des Autors zu C2.12).
 */
function zieleVon(pos: Chess, feld: Square, figur: Piece): Square[] {
  const feind = gegner(figur.color);
  const karte = new Angriffskarte(pos.board);
  return [...attacks(figur, feld, pos.board.occupied).intersect(pos.board[feind])].filter((z) =>
    istGabelziel(karte, z, figur),
  );
}

/** Ein-Zug-Motive des Schlüsselzuges: Doppelschach, Abzug, Gabel, Spieß, Fesselung, Umwandlung, gefangene Figur. */
function einzugmotive(h: Halbzug, ziele: readonly Square[]): Motiv[] {
  const motive: Motiv[] = [];
  const schachgeber = h.nachher.ctx().checkers;
  if (schachgeber.size() >= 2) motive.push("doppelschach");
  else if (schachgeber.nonEmpty() && !schachgeber.has(h.zug.to)) motive.push("abzug");
  else if (abzugOhneSchach(h)) motive.push("abzug");
  if (ziele.length >= 2)
    motive.push(h.figur.role === "knight" || h.figur.role === "pawn" ? "gabel" : "doppelangriff");
  const karte = new Angriffskarte(h.nachher.board);
  const neue = linienmotive(h.nachher.board, karte, h.figur.color).filter(
    (m) => m.strahl.von === h.zug.to,
  );
  if (neue.some((m) => echterSpiess(m, h.nachher, karte))) motive.push("spiess");
  if (neue.some((m) => m.art === "fesselung")) motive.push("fesselung");
  if (h.zug.promotion) motive.push("umwandlung");
  if (gefangeneFigur(h.nachher, h.figur.color) !== null) motive.push("gefangen");
  return motive;
}

/**
 * Ist ein Spieß wirklich einer? Die hintere Figur muss ungedeckt sein, und die vordere darf den
 * Angreifer nicht einfach schlagen (es sei denn, er ist gedeckt).
 *
 * Regel: Kapitel 7, Motiv 3 (Spieß): Die vordere, wertvollere Figur muss ausweichen, dann fällt
 * die hintere. Beispiel: Abb. 7.14, 1. Th8+ trifft König g8 und Turm a8 auf einer Reihe, aber der
 * König schlägt den ungedeckten Turm h8: kein Spieß (Nachtest des Autors zu 0.2.26).
 */
function echterSpiess(m: Linienmotiv, pos: Chess, karte: Angriffskarte): boolean {
  if (m.art !== "spiess" || !m.hintenUngedeckt) return false;
  const vornSchlaegt = attacks(m.vorn.figur, m.vorn.feld, pos.board.occupied).has(m.strahl.von);
  const gedeckt = karte.angreiferVon(m.strahl.von, m.strahl.figur.color).length > 0;
  return !vornSchlaegt || gedeckt;
}

/** Abzug ohne Schach: Die abziehende Figur gibt eine Linie frei, die jetzt eine wertvolle Figur trifft. */
function abzugOhneSchach(h: Halbzug): boolean {
  const vorher = linienmotive(h.vorher.board, new Angriffskarte(h.vorher.board), h.figur.color);
  return vorher.some(
    (m) =>
      m.art === "abzug" &&
      m.vorn.feld === h.zug.from &&
      attacks(
        h.nachher.board.get(m.strahl.von) ?? m.strahl.figur,
        m.strahl.von,
        h.nachher.board.occupied,
      ).has(m.hinten.feld),
  );
}

/** Eine gegnerische Figur (keine Bauern, kein König), die angegriffen ist und kein sicheres Feld hat. */
function gefangeneFigur(pos: Chess, farbe: Color): Square | null {
  const feind = gegner(farbe);
  if (pos.isCheck()) return null;
  const stellung = stellungAusFen(makeFen(pos.toSetup()));
  if (!stellung.ok) return null;
  const karte = new Angriffskarte(pos.board);
  for (const f of sichereFelder(stellung.wert, feind)) {
    if (f.figur.role === "pawn" || f.figur.role === "king") continue;
    if (f.sichere.length === 0 && karte.angreiferVon(f.feld, farbe).length > 0) return f.feld;
  }
  return null;
}

/**
 * Zieht der Schlüsselzug eine relativ gefesselte Figur?
 *
 * Regel: Kapitel 7, Motiv 2, „Nicht überschätzen“: „eine lediglich relativ gefesselte Figur kann
 * jederzeit ziehen, wenn der Gegner dafür etwas Größeres bekommt“. Relativ heißt: Hinter der
 * Figur steht nicht der König, sondern eine wertvollere Figur (Abb. 7.5). Beispiel: Abb. 7.21,
 * der Springer f6 ist an die Dame d8 gefesselt und schlägt mit 6... Sxe4 trotzdem.
 */
function relativeFesselungDurchbrochen(h: Halbzug): boolean {
  const karte = new Angriffskarte(h.vorher.board);
  const motive = linienmotive(h.vorher.board, karte, gegner(h.figur.color));
  return fesselungen(motive, false).some((f) => f.vorn.feld === h.zug.from);
}

/** Ist der Zug ein Opfer: Die gezogene Figur kann geschlagen werden und ist mehr wert als das, was sie nahm? */
function istOpfer(h: Halbzug): boolean {
  const karte = new Angriffskarte(h.nachher.board);
  const angegriffen = karte.angreiferVon(h.zug.to, gegner(h.figur.color)).length > 0;
  const genommen = h.geschlagen ? FIGURENWERT[h.geschlagen.role] : 0;
  return angegriffen && FIGURENWERT[h.figur.role] > genommen;
}

/** Motive aus der Zugfolge ab einem eigenen Zug: Räumung, Hinlenkung, Ablenkung, Beseitigung, Überlastung, Batterie. */
function folgemotive(folge: readonly Halbzug[]): Motiv[] {
  const [m1, antwort, m2] = folge;
  const motive: Motiv[] = [];
  if (!m1) return motive;
  const karteVorher = new Angriffskarte(m1.vorher.board);
  const feind = gegner(m1.figur.color);
  const ueberlastet = doppelteAufgaben(m1.vorher, karteVorher, feind) ?? [];
  if (ueberlastet.some((d) => d.aufgaben.some((a) => a.ziel === m1.zug.to)))
    motive.push("ueberlastung");
  if (batterieGegenVerteidiger(m1)) motive.push("batterie");
  if (!antwort || !m2) return motive;
  if (m1.geschlagen && karteVorher.angreiferVon(m2.zug.to, feind).some((a) => a.feld === m1.zug.to))
    motive.push("beseitigung");
  const koederGenommen = antwort.zug.to === m1.zug.to && istOpfer(m1) && m2.zug.to !== m1.zug.to;
  if (!koederGenommen) return motive;
  if (m2.zug.to === m1.zug.from) motive.push("raeumung");
  else if (abgelenkt(antwort, m2)) motive.push("ablenkung");
  else if (zieleVon(m2.nachher, m2.zug.to, m2.figur).includes(m1.zug.to)) motive.push("hinlenkung");
  else if (m2.nachher.isCheckmate()) motive.push("hinlenkung");
  return motive;
}

/** Ablenkung: Die Figur, die den Köder nahm, sperrte vorher die Linie des Folgezuges. */
function abgelenkt(antwort: Halbzug, m2: Halbzug): boolean {
  const mitUrsprung = m2.vorher.board.occupied.with(antwort.zug.from);
  const gesperrt = !attacks(m2.figur, m2.zug.from, mitUrsprung).has(m2.zug.to);
  const frei = attacks(m2.figur, m2.zug.from, m2.vorher.board.occupied).has(m2.zug.to);
  return gesperrt && frei;
}

/** Batterie (Motiv 4): Der Zug greift einen Verteidiger des Zielfeldes einer eigenen Batterie an (Abb. 7.8: g5 gegen Sf6). */
function batterieGegenVerteidiger(m1: Halbzug): boolean {
  const karte = new Angriffskarte(m1.nachher.board);
  const feind = gegner(m1.figur.color);
  const angegriffene = attacks(m1.figur, m1.zug.to, m1.nachher.board.occupied).intersect(
    m1.nachher.board[feind],
  );
  return linienmotive(m1.nachher.board, karte, m1.figur.color).some((motiv) => {
    if (motiv.art !== "batterie" || motiv.ziel === null) return false;
    const zielfeld = motiv.ziel.feld;
    return karte.angreiferVon(zielfeld, feind).some((a) => angegriffene.has(a.feld));
  });
}

/** Zwischenzug: Der Schlüsselzug lässt eine eigene Figur hängen, und nach dem Schlag folgt ein Schach oder Schlag. */
function zwischenzug(folge: readonly Halbzug[]): boolean {
  const [m1, antwort, m2] = folge;
  if (!m1 || !antwort || !m2) return false;
  const gewinn = schlaege(m1.nachher).find(
    (s) => s.von === antwort.zug.from && s.nach === antwort.zug.to,
  );
  if (!gewinn || gewinn.bilanz < GEWINN_AB || antwort.zug.to === m1.zug.to) return false;
  return m2.nachher.isCheck() || m2.geschlagen !== null;
}

/** Desperado: Die ziehende Figur war ohnehin verloren (ungedeckt oder von einer billigeren Figur angegriffen) und schlägt mit Schach oder nimmt mindestens ihren eigenen Wert mit. */
function desperado(m1: Halbzug): boolean {
  const karte = new Angriffskarte(m1.vorher.board);
  const angreifer = karte.angreiferVon(m1.zug.from, gegner(m1.figur.color));
  const gedeckt = karte.angreiferVon(m1.zug.from, m1.figur.color).length > 0;
  const verloren =
    angreifer.length > 0 &&
    (!gedeckt || angreifer.some((a) => FIGURENWERT[a.rolle] < FIGURENWERT[m1.figur.role]));
  return (
    verloren &&
    m1.geschlagen !== null &&
    (m1.nachher.isCheck() || FIGURENWERT[m1.geschlagen.role] >= FIGURENWERT[m1.figur.role])
  );
}

/** Materialstand einer Farbe in Bauerneinheiten (ohne Könige). */
function materialstand(pos: Chess, farbe: Color): number {
  let summe = 0;
  for (const feld of pos.board.occupied) {
    const figur = pos.board.get(feld);
    if (figur && figur.role !== "king")
      summe += (figur.color === farbe ? 1 : -1) * FIGURENWERT[figur.role];
  }
  return summe;
}

/**
 * Dauerschach: alle eigenen Züge der Folge sind Schachs ohne Schlag, ohne Matt, und die Seite, die
 * Schach gibt, steht auf Verlust. Patt: Schlagen des Köders setzt patt.
 *
 * Regel: Kapitel 7, Motiv 12 („Wer klar verliert, sucht nach einem Remis“; Tabelle „Du stehst auf
 * Verlust: Rettung durch Dauerschach und Patt“). Präzisierung der App (16.10.2026): Schachs einer
 * Seite, die nicht mindestens eine Leichtfigur zurückliegt, sind kein Dauerschach (Abb. 10.3:
 * Schwarz hat den Turm gegen den Bauern, seine Schachs enden nach 5. Kc2). Beispiel: Abb. 7.28,
 * Schwarz mit Turm und Bauer weniger: 1... De1+ 2. Kg2 De2+.
 */
function rettungsmotive(folge: readonly Halbzug[]): Motiv[] {
  const motive: Motiv[] = [];
  const [m1] = folge;
  if (!m1) return motive;
  const eigene = folge.filter((_, i) => i % 2 === 0);
  const letzte = folge.at(-1);
  if (
    eigene.length >= DAUERSCHACH_AB &&
    materialstand(m1.vorher, m1.figur.color) <= -VERLUST_AB &&
    eigene.every((h) => h.nachher.isCheck() && h.geschlagen === null) &&
    !letzte?.nachher.isCheckmate()
  )
    motive.push("dauerschach");
  const patt = [...m1.nachher.allDests()].some(([von, ziele]) =>
    [...ziele].some((nach) => {
      if (nach !== m1.zug.to) return false;
      const kopie = m1.nachher.clone();
      kopie.play({ from: von, to: nach });
      return kopie.isStalemate();
    }),
  );
  if (patt) motive.push("patt");
  return motive;
}

/** Das Mattbild, das die Farbe im nächsten Zug droht, als wäre sie am Zug (kein Nullzug im Schach). */
function gedrohtesMatt(pos: Chess, farbe: Color): Mattbild | null {
  if (pos.isCheck()) return null;
  const fuer = pos.turn === farbe ? pos : nullzug(pos, farbe);
  for (const [von, ziele] of fuer.allDests()) {
    for (const nach of ziele) {
      const kopie = fuer.clone();
      kopie.play({ from: von, to: nach });
      const bild = mattbild(kopie);
      if (bild !== null) return bild;
    }
  }
  return null;
}

/**
 * Erkennt die Motive einer Lösungszugfolge.
 *
 * Eingaben: Regeln der Ausgangsstellung, Züge (SAN englisch, eigene und gegnerische im Wechsel).
 * Ausgabe: die Motive in der Reihenfolge der App (erstes Motiv zuerst), das Mattbild am Ende der
 * Folge, der Schlüsselzug mit seinen Zielen; null, wenn der erste Zug nicht geht.
 * Beispiele: Abb. 7.6 „Th1+“ Spieß; 7.11 „Sd6+“ Doppelschach; 7.14 „Th8+ Kxh8 Sxf7+“
 * Hinlenkung mit Gabel; 7.17 „Txh7+ Kxh7 Dg7#“ Räumung; 7.18 „Lxc6 Lxc6 Se7+“ Beseitigung;
 * 7.20 „Lxd5“ Überlastung; 7.26 „e8=N+“ Umwandlung; 7.29 „Dg8+“ Patt.
 */
export function erkenneMotive(regeln: Chess, zuege: readonly string[]): Motivbefund | null {
  const folge = nachspielen(regeln, zuege);
  const schluessel = folge[0];
  if (!schluessel) return null;
  const ziele = zieleVon(schluessel.nachher, schluessel.zug.to, schluessel.figur);
  const gefunden = new Set<Motiv>([
    ...folgemotive(folge),
    ...(zwischenzug(folge) ? ["zwischenzug" as const] : []),
    ...(desperado(schluessel) ? ["desperado" as const] : []),
    ...rettungsmotive(folge),
    ...einzugmotive(schluessel, ziele),
  ]);
  // Spätere eigene Züge: Opfer und Motive der zweiten Welle (Abb. 7.58: Dxh7+ erst im zweiten Zug).
  for (let i = 2; i < folge.length; i += 2) {
    const h = folge[i];
    if (!h) break;
    const spaeter = [
      ...folgemotive(folge.slice(i)),
      ...einzugmotive(h, zieleVon(h.nachher, h.zug.to, h.figur)),
    ];
    for (const m of spaeter) if (SPAETER_ERLAUBT.has(m)) gefunden.add(m);
  }
  const motive = RANGFOLGE.filter((m) => gefunden.has(m));
  const ende = folge.at(-1)?.nachher ?? schluessel.nachher;
  const matt = mattbild(ende);
  return {
    motive,
    mattbild: matt,
    gedroht: matt === null ? gedrohtesMatt(ende, schluessel.figur.color) : null,
    schluessel,
    ziele,
    halbzuege: folge,
    fesselungDurchbrochen: relativeFesselungDurchbrochen(schluessel),
  };
}
