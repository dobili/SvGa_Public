/**
 * Die Warum-Kategorie eines Fehlzuges (W1 bis W10, Konzept „Fehler mit Buchbezug“ 3.1): warum der
 * gespielte Zug schlecht war, in der Sprache des Buches, mit Satz und Fundstelle für die Karte.
 *
 * Rolle im Gesamtbild: Die Zeitleiste der Auswertung (ui/komponenten/auswertung/Warumzeile.tsx)
 * zeigt je Fehlerkarte höchstens eine Warum-Zeile mit Kapitel und „Üben“. Die Erkennung ist die
 * vorhandene der Fehlerarten (engine/fehlerart.ts, dieselbe wie im Rückblick und bei den Fehlern
 * der Bots); diese Datei ordnet ihr Ergebnis den Kategorien zu und wählt nach der Reihenfolge aus
 * Konzept 4.1 (Genaues vor Faustregel). W8 und W9 kommen nur ohne taktischen Grund, weil
 * fehlerbefundIn die Faustregeln erst nach allen taktischen Arten prüft; W10 nur im Endspiel. W1
 * (Falle aus dem Buch) prüft den genauen Stellungsvergleich mit den Fallen des Kapitels 4
 * (analyse/warumfalle.ts) und steht vor allem anderen; ohne Fallenindex schweigt W1.
 * Rein: keine Engine, kein Speicher; die Widerlegung kommt aus der gespeicherten Auswertung.
 * Abhängigkeiten: engine/fehlerart.ts, engine/zugprobe.ts, spiel/buchbezug.ts, analyse/texte.ts,
 * analyse/warumfalle.ts, training/taktikmotivwahl.ts (Motiv → Thema des Taktiktrainers), chessops.
 */
import { normalizeMove } from "chessops/chess";
import { makeFen } from "chessops/fen";
import { makeSquare, parseUci } from "chessops/util";
import { figurenname, zugtext } from "../analyse/texte";
import { warumFalle, type Fallenindex } from "../analyse/warumfalle";
import {
  fehlerbefundIn,
  lageVon,
  type Fehlerart,
  type Fehlerbefund,
  type Lage,
} from "../engine/fehlerart";
import { probe, type Zugprobe } from "../engine/zugprobe";
import { t, type Textschluessel, type Textwerte } from "../i18n/sprache";
import { GRUNDMOTIV_JE_MOTIV } from "../training/taktikmotivwahl";
import { BUCHBEZUG, type Warumkennung } from "./buchbezug";
import { WIDERLEGUNG_HALBZUEGE } from "./erklaerung";
import { uciZuSan } from "./zuege";

/** Die Warum-Kategorie eines Zuges mit dem Satz für die Karte. */
export interface Warumbefund {
  readonly kennung: Warumkennung;
  /** Der Satz (Du-Form), etwa „Die Drohung Lxf7+ stand schon vor deinem Zug …“. */
  readonly text: Textschluessel;
  readonly werte: Textwerte;
  /** Fundstelle; meist die der Kategorie, bei W4, W6, W7, W8 und W10 je nach Fall genauer. */
  readonly quelle: Textschluessel;
  /** Thema für „Üben“, genauer als die Tabelle (etwa „taktik:fesselung“); sonst das der Tabelle. */
  readonly thema: string | null;
  /**
   * Das Feld, um das es geht (hängende Figur bei W4, Schlagfeld bei W5), sonst nicht gesetzt.
   * Damit lässt die Karte eine Findezeile weg, die dasselbe Feld meint (Konzept 4.1).
   */
  readonly feld?: string;
}

/** Was die Prüfung zu einem Zug braucht. */
export interface Warumeingabe {
  /** Stellung vor dem Zug (FEN). */
  readonly vorherFen: string;
  /** Der gespielte Zug (UCI). */
  readonly uci: string;
  /** Widerlegung: Hauptvariante der Engine nach dem Zug (UCI, bis sechs Halbzüge). */
  readonly widerlegung: readonly string[];
  /** Verlust gegenüber dem besten Zug in Bauerneinheiten. */
  readonly verlust: number;
  /** Bester Zug der Engine vor dem Zug (UCI) oder null. */
  readonly bester: string | null;
  /** Die Fallen des Kapitels 4 für W1 (analyse/warumfalle.ts); ohne Angabe schweigt W1. */
  readonly fallenindex?: Fallenindex;
}

/** Alles, was die einzelnen Regeln lesen. */
interface Fall {
  readonly lage: Lage;
  readonly p: Zugprobe;
  readonly befund: Fehlerbefund;
  readonly e: Warumeingabe;
}

type Regel = (f: Fall) => Warumbefund | null;

/** Eine Drohung ab Leichtfigur steht vor allem anderen (Konzept 4.1, „W3 Drohung ab Leichtfigur“). */
const LEICHTFIGUR = 3;
/** Ein Schlag gilt als verrechnet, wenn die Abtauschbilanz mindestens einen Bauern kostet. */
const VERRECHNET_BIS = -1;
/** Linienarten der Warnsignale W2, die ein Thema im Taktiktrainer haben. */
const LINIENTHEMA: Readonly<Record<string, string>> = {
  fesselung: "taktik:fesselung",
  spiess: "taktik:spiess",
  abzug: "taktik:abzug",
};
/** Die Zentrumsfelder (Kapitel 1, erstes Eröffnungsziel); ein Bauernzug dorthin ist kein W9. */
const ZENTRUM: ReadonlySet<string> = new Set(["d4", "e4", "d5", "e5"]);

/** Ein Befund mit der Fundstelle der Kategorie. */
function befundMit(
  kennung: Warumkennung,
  text: Textschluessel,
  werte: Textwerte = {},
  quelle: Textschluessel = BUCHBEZUG[kennung].quelle,
  thema: string | null = BUCHBEZUG[kennung].thema,
): Warumbefund {
  return { kennung, text, werte, quelle, thema };
}

/** Der erste Zug der Widerlegung in der Sprache des Buches, leer ohne. */
function ersterZug(f: Fall): string {
  const uci = f.e.widerlegung[0];
  const san = uci ? uciZuSan(makeFen(f.p.danach.toSetup()), uci) : null;
  return san ? zugtext(san) : "";
}

/**
 * Endet die Widerlegung im Matt gegen die ziehende Seite? Regel: Kapitel 0 (Matt), Kapitel 12
 * (Sicherheitsblick: „Erlaube ich ein Matt?“). Gespielt werden höchstens sechs Halbzüge.
 */
function endetImMatt(p: Zugprobe, widerlegung: readonly string[]): boolean {
  const regeln = p.danach.clone();
  const ziehende = regeln.turn === "white" ? "black" : "white";
  for (const uci of widerlegung.slice(0, WIDERLEGUNG_HALBZUEGE)) {
    const roh = parseUci(uci);
    if (!roh) return false;
    const zug = normalizeMove(regeln, roh);
    if (!regeln.isLegal(zug)) return false;
    regeln.play(zug);
  }
  return regeln.isCheckmate() && regeln.turn === ziehende;
}

/**
 * W1 Falle aus dem Buch: Der Zug ist der Fehlzug einer Falle des Fallenkabinetts, in genau der
 * Stellung des Buches. Regel: Kapitel 4, Fallenkabinett, Stopp-Moment.
 */
const falle: Regel = (f) => {
  const index = f.e.fallenindex;
  const treffer = index ? warumFalle(f.e.vorherFen, f.e.uci, index) : null;
  if (!treffer) return null;
  const { falle: name, stopp } = treffer.details;
  return stopp
    ? befundMit("W1", "buchbezug.W1.textStopp", { falle: name, abbildung: stopp })
    : befundMit("W1", "buchbezug.W1.text", { falle: name });
};

/** W2 Matt zugelassen: eine Mattdrohung bleibt stehen, oder die Widerlegung setzt matt. */
const mattZugelassen: Regel = (f) => {
  const { drohung } = f.befund;
  if (f.befund.art === "drohungIgnoriert" && drohung?.art === "matt") {
    return befundMit("W2", "buchbezug.W2.text", { zug: zugtext(drohung.zug.san) });
  }
  if (!endetImMatt(f.p, f.e.widerlegung)) return null;
  return befundMit("W2", "buchbezug.W2.textFolge", { zug: ersterZug(f) });
};

/** W3 Drohung stehen gelassen; `gross`: nur Drohungen ab Leichtfigur (die vordere Stufe). */
function drohungStehen(gross: boolean): Regel {
  return (f) => {
    const { drohung } = f.befund;
    if (f.befund.art !== "drohungIgnoriert" || drohung?.art !== "material") return null;
    if (gross && drohung.zug.bilanz < LEICHTFIGUR) return null;
    return befundMit("W3", "buchbezug.W3.text", { zug: zugtext(drohung.zug.san) });
  };
}

/** W10 Patt (genau, deshalb weit vorn): Patt trotz Vorsprung. Regel: Kapitel 8, Pattfalle. */
const patt: Regel = (f) =>
  f.befund.art === "pattGesetzt"
    ? befundMit("W10", "buchbezug.W10.textPatt", {}, "buchbezug.W10.quellePatt")
    : null;

/** W6 Köder geschluckt: Schlagreflex (Kapitel 4, W5) oder Bauernraub mit der Dame (Kapitel 1). */
const koeder: Regel = (f) => {
  if (f.befund.art === "schlagreflex") {
    const zug = ersterZug(f);
    return zug
      ? befundMit("W6", "buchbezug.W6.text", { zug })
      : befundMit("W6", "buchbezug.W6.textOhne");
  }
  if (f.befund.art !== "bauernraub") return null;
  return befundMit("W6", "buchbezug.W6.textRaub", {}, "buchbezug.W6.quelleRaub");
};

/**
 * W5 Abtausch verrechnet: Der Zug schlägt, und die Abtauschbilanz auf dem Feld kostet mindestens
 * einen Bauern. Regel: Kapitel 1, Angreifer und Verteidiger zählen.
 */
const verrechnet: Regel = (f) => {
  if (f.p.geschlagen === null) return null;
  const schlag = f.lage.schlaege.find((s) => s.von === f.p.zug.from && s.nach === f.p.zug.to);
  if (!schlag || schlag.bilanz > VERRECHNET_BIS) return null;
  const feld = makeSquare(schlag.nach);
  return { ...befundMit("W5", "buchbezug.W5.text", { feld }), feld };
};

/**
 * W4 Material eingestellt: Figur hängt oder Bauer eingestellt. Ist es die eben gezogene Figur,
 * fragt der Sicherheitsblick (Kapitel 12), sonst das Warnsignal W1 (Kapitel 4).
 */
const eingestellt: Regel = (f) => {
  const { art, haengt } = f.befund;
  if ((art !== "figurHaengen" && art !== "bauerEingestellt") || haengt === null) return null;
  const figur = f.p.danach.board.get(haengt);
  const name = figur ? figurenname({ feld: haengt, figur }) : makeSquare(haengt);
  const feld = makeSquare(haengt);
  if (art === "bauerEingestellt") {
    const quelle = "buchbezug.W4.quelleBauer";
    return { ...befundMit("W4", "buchbezug.W4.textBauer", { figur: name }, quelle), feld };
  }
  if (haengt === f.p.zug.to)
    return { ...befundMit("W4", "buchbezug.W4.textGezogen", { figur: name }), feld };
  const quelle = "buchbezug.W4.quelleW1";
  return { ...befundMit("W4", "buchbezug.W4.textW1", { figur: name }, quelle), feld };
};

/** W7 Taktik des Gegners übersehen, mit dem Motiv als Thema des Taktiktrainers. */
const taktik: Regel = (f) => {
  const taktikbefund = f.befund.taktik;
  if (f.befund.art !== "taktikUebersehen" || !taktikbefund) return null;
  const zug = ersterZug(f);
  if (taktikbefund.art === "gabel") {
    const quelle = "buchbezug.W7.quelleGabel";
    return befundMit("W7", "buchbezug.W7.textGabel", { zug }, quelle, "taktik:doppelangriff");
  }
  if (taktikbefund.art === "linie") {
    const thema = LINIENTHEMA[taktikbefund.linie.art] ?? null;
    return befundMit("W7", "buchbezug.W7.textLinie", { zug }, "buchbezug.W7.quelleLinie", thema);
  }
  const motiv = t(`motiv.name.${taktikbefund.motiv}`);
  const thema = `taktik:${GRUNDMOTIV_JE_MOTIV[taktikbefund.motiv]}`;
  return befundMit("W7", "buchbezug.W7.text", { zug, motiv }, undefined, thema);
};

/** W8 Todsünde der Eröffnung: nur in der Eröffnung (Kapitel 1, vier Todsünden; Entwicklung). */
const todsuende: Regel = (f) => {
  if (f.lage.phase !== "eroeffnung") return null;
  if (f.befund.art === "verfruehteDame") return befundMit("W8", "buchbezug.W8.textDame");
  if (f.befund.art === "koenigMitte") return befundMit("W8", "buchbezug.W8.textKoenig");
  if (f.befund.art !== "tempoverlust") return null;
  return befundMit("W8", "buchbezug.W8.textTempo", {}, "buchbezug.W8.quelleTempo");
};

/** W9 Bauernzug mit Folgen: vor dem Endspiel (Kapitel 5, Grundgesetz der Bauern). */
const bauernzug: Regel = (f) => {
  if (f.lage.phase === "endspiel") return null;
  // Ein Bauer ins Zentrum erfüllt in der Eröffnung ein Ziel des Buches; dort keine Faustregel
  const insZentrum = f.lage.phase === "eroeffnung" && ZENTRUM.has(makeSquare(f.p.zug.to));
  if (insZentrum) return null;
  if (f.befund.art === "koenigsschild") return befundMit("W9", "buchbezug.W9.textSchild");
  return f.befund.art === "bauernzugOhneNot" ? befundMit("W9", "buchbezug.W9.text") : null;
};

/** Texte der übrigen Endspielregeln (Kapitel 8). */
const ENDSPIELTEXT: Readonly<Partial<Record<Fehlerart, Textschluessel>>> = {
  koenigPassiv: "buchbezug.W10.textKoenig",
  bauernvorstoss: "buchbezug.W10.textBauer",
  falscherAbtausch: "buchbezug.W10.textTausch",
};

/** W10 Endspielregel: nur im Endspiel; König passiv, Bauer vorschnell, im Rückstand getauscht. */
const endspielregel: Regel = (f) => {
  const text = ENDSPIELTEXT[f.befund.art];
  return f.lage.phase === "endspiel" && text ? befundMit("W10", text) : null;
};

/** Die Regeln in der Reihenfolge von WARUM_REIHENFOLGE (spiel/buchbezug.ts). */
const REGELN: readonly Regel[] = [
  falle,
  mattZugelassen,
  drohungStehen(true),
  patt,
  koeder,
  verrechnet,
  eingestellt,
  drohungStehen(false),
  taktik,
  todsuende,
  bauernzug,
  endspielregel,
];

/**
 * Die Warum-Kategorie eines Zuges der Partie, oder null, wenn keine Regel sicher passt.
 *
 * Warum: Der Leser soll an der Karte sehen, welche Idee des Buches den Fehler verhindert hätte,
 * und sie gleich üben können (Konzept 4.1). Besser keine Zeile als eine geratene (Konzept 6).
 * Eingaben: siehe Warumeingabe; die Widerlegung sollte die ganze gespeicherte Variante sein
 * (spiel/erklaerung.ts, widerlegungAus), sonst zählt kein Rückschlag.
 * Ausgabe: Kennung, Satz mit Werten, Fundstelle und Thema für „Üben“.
 * Beispiel: Abb. 1.13 nach 2. Dh5: 2... Sf6?? lässt Dxe5+ stehen → W3 „Die Drohung Dxe5+ stand
 * schon vor deinem Zug …“, Schach-Röntgen-Trainer. Abb. 4.13, 6. Sxd5?? → W1 Elefantenfalle.
 * Sonderfälle: unlesbare Stellung oder unmöglicher Zug → null; „ungenau“ ohne Regel → null.
 */
export function warumKategorie(e: Warumeingabe): Warumbefund | null {
  const lage = lageVon(e.vorherFen);
  const p = lage ? probe(lage.regeln, e.uci) : null;
  if (!lage || !p) return null;
  const widerlegung = e.widerlegung.slice(0, WIDERLEGUNG_HALBZUEGE);
  const befund = fehlerbefundIn(lage, e.uci, widerlegung, e.verlust, e.bester);
  const fall: Fall = { lage, p, befund, e: { ...e, widerlegung } };
  for (const regel of REGELN) {
    const treffer = regel(fall);
    if (treffer) return treffer;
  }
  return null;
}
