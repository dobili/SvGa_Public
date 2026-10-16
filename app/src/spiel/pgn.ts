/**
 * Eine Partie gegen die Engine als PGN (Pflichtenheft 5.3 „Export als PGN“).
 *
 * Rolle im Gesamtbild: Der Leser kann seine Partie kopieren oder als Datei sichern und in
 * anderen Programmen öffnen. Die Züge stehen in der international üblichen Schreibweise (englische
 * Buchstaben), damit jedes Programm sie lesen kann. Absichtliche Fehler der Engine stehen als
 * Kommentar hinter dem Zug.
 * Abhängigkeiten: spiel/partie.ts, spiel/ergebnis.ts.
 */
import { pgnErgebnis } from "./ergebnis";
import { stellungen, type Partie } from "./partie";

/** Kopfangaben, die die Oberfläche in der Sprache des Lesers liefert. */
export interface Pgnkopf {
  readonly ereignis: string;
  readonly leser: string;
  readonly engine: string;
}

const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
/** Zeilenlänge der Zugfolge, wie im PGN-Standard empfohlen. */
const ZEILENLAENGE = 80;

function kopfzeile(name: string, wert: string): string {
  return `[${name} "${wert.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"]`;
}

/** Die Zugfolge mit Zugnummern und Kommentaren, ohne Zeilenumbruch. */
function zugtext(
  partie: Partie,
  kommentare: ReadonlyMap<number, string>,
  zeichen: ReadonlyMap<number, string>,
): string[] {
  const alle = stellungen(partie);
  const teile: string[] = [];
  partie.zuege.forEach((zug, index) => {
    const [, seite = "w", , , , nummer = "1"] = (alle[index] ?? "").split(" ");
    if (seite === "w") teile.push(`${nummer}.`);
    else if (index === 0 || kommentare.has(index - 1)) teile.push(`${nummer}...`);
    teile.push(zug.san + (zeichen.get(index) ?? ""));
    const kommentar = kommentare.get(index);
    if (kommentar) teile.push(`{${kommentar.replace(/[{}]/g, "")}}`);
  });
  return teile;
}

/** Bricht die Wörter in Zeilen bis zur empfohlenen Länge um. */
function umbrechen(woerter: readonly string[]): string {
  const zeilen: string[] = [];
  let zeile = "";
  for (const wort of woerter) {
    if (zeile && zeile.length + 1 + wort.length > ZEILENLAENGE) {
      zeilen.push(zeile);
      zeile = wort;
    } else {
      zeile = zeile ? `${zeile} ${wort}` : wort;
    }
  }
  if (zeile) zeilen.push(zeile);
  return zeilen.join("\n");
}

/**
 * Schreibt die Partie als PGN.
 *
 * Eingaben: Partie, Kopfangaben, Kommentare je Halbzug (Index → Text, etwa „Absichtlicher
 * Fehler: eine Figur hängen lassen (W1)“), Zugzeichen der Auswertung je Halbzug („?“). Ausgabe: PGN-Text mit den sieben Pflichtangaben,
 * bei eigener Startstellung mit „SetUp“ und „FEN“.
 * Beispiel: Grundstellung, 1. e4 e5, Leser Weiß → „[White "Du"] … 1. e4 e5 *“.
 */
export function alsPgn(
  partie: Partie,
  kopf: Pgnkopf,
  kommentare: ReadonlyMap<number, string> = new Map(),
  zeichen: ReadonlyMap<number, string> = new Map(),
): string {
  const leserWeiss = partie.einstellung.eigeneFarbe === "white";
  const datum = partie.begonnen.slice(0, "JJJJ-MM-TT".length).replace(/-/g, ".");
  const ergebnis = pgnErgebnis(partie.ende);
  const start = partie.einstellung.startFen;
  const kopfzeilen = [
    kopfzeile("Event", kopf.ereignis),
    kopfzeile("Site", "Schach von Grund auf"),
    kopfzeile("Date", datum),
    kopfzeile("Round", "-"),
    kopfzeile("White", leserWeiss ? kopf.leser : kopf.engine),
    kopfzeile("Black", leserWeiss ? kopf.engine : kopf.leser),
    kopfzeile("Result", ergebnis),
    ...(start === GRUNDSTELLUNG ? [] : [kopfzeile("SetUp", "1"), kopfzeile("FEN", start)]),
  ];
  const zuege = umbrechen([...zugtext(partie, kommentare, zeichen), ergebnis]);
  return `${kopfzeilen.join("\n")}\n\n${zuege}\n`;
}
