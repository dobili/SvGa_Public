/**
 * Eignungsprüfung der Trainer-Stellungen: gemeinsame Prüfbausteine und je Trainer eigene Regeln.
 *
 * Rolle im Gesamtbild: Der Autor fand beim Testen Aufgaben, die nicht zur Frage passten (Matt im
 * Zähltrainer, Schach in der Zielbilanz, eine Kette, die laut Buch keine ist). Wunsch des Autors
 * (30.10.2026): ein Prüfmechanismus, aber mit Regeln je Trainer, denn was in einem Trainer
 * stört, kann in einem anderen gerade richtig sein (Schach in der Denkroutine, Abb. 12.3).
 * Hier stehen die Bausteine (je eine schachliche Eigenschaft einer Stellung) und die Tabelle,
 * welcher Trainer welche Eigenschaft ausschließt, jeweils mit Grund und Buchbezug.
 * Abhängigkeiten: analyse/stellungsprofil.ts, schach/abtausch.ts, schach/fesselungen.ts.
 * Buchbezug: je Regel im Kommentar der Tabelle.
 */
import type { Color } from "chessops/types";
import { profil } from "../analyse/stellungsprofil";
import { fesselungslinien } from "../schach/fesselungen";
import { FIGURENWERT, stellungAusFen, type Stellung } from "../schach/stellung";

/** Die schachlichen Eigenschaften, nach denen ein Trainer Stellungen ausschließen kann. */
export type Eigenschaft =
  | "ohneRegeln"
  | "imSchach"
  | "partieZuEnde"
  | "materialGewinnbar"
  | "figurGewinnbar"
  | "eigeneHaengt"
  | "eigeneGefesselt"
  | "nurBauern"
  | "kaumZuege";

/** Mit weniger legalen Zügen gibt es nichts abzuwägen (die Denkroutine fragt zwei Kandidaten). */
const MINDESTENS_ZUEGE = 2;
/** Ab diesem Wert (Bauerneinheiten) ist ein sofortiger Gewinn eine Figur, kein Bauer. */
const FIGURENWERT_LEICHT = FIGURENWERT.knight;

/** Der höchste Gewinn, den eine Seite jetzt mit einem Schlag sicher erzielt (Abtauschbilanz). */
function bestesSchlagen(s: Stellung, farbe: Color): number {
  const schlaege = profil(s).schlaegeVon(farbe) ?? [];
  return schlaege.reduce((max, z) => Math.max(max, z.bilanz), 0);
}

/** Hängt eine eigene Figur (ohne König, mit Bauern)? Der Gegner gewönne beim Schlagen. */
function eigeneHaengt(s: Stellung): boolean {
  const p = profil(s);
  const eigen = s.amZug;
  return [...s.brett[eigen]].some((feld) => {
    const figur = s.brett.get(feld);
    return figur?.role !== "king" && (p.abtausch(feld)?.bilanz ?? 0) > 0;
  });
}

/** Ist eine Figur der Seite am Zug direkt an ihren König gefesselt? */
function eigeneGefesselt(s: Stellung): boolean {
  return fesselungslinien(s.brett, profil(s).angriffskarte, s.amZug).some(
    (linie) => linie.art === "direkt" && linie.absolut,
  );
}

/** Stehen außer Königen nur Bauern auf dem Brett (ein Skelett)? */
function nurBauern(s: Stellung): boolean {
  return [...s.brett.occupied].every((feld) => {
    const rolle = s.brett.get(feld)?.role;
    return rolle === "pawn" || rolle === "king";
  });
}

/**
 * Hat eine Stellung diese Eigenschaft?
 *
 * - ohneRegeln: Lehrbild ohne vollständige, regelgerechte Stellung (etwa ohne König).
 * - imSchach: Die Seite am Zug steht im Schach.
 * - partieZuEnde: Matt oder Patt.
 * - materialGewinnbar: Die Seite am Zug gewinnt mit einem Schlag sicher Material (ab einem
 *   Bauern), etwa mitten in einem Abtausch.
 * - figurGewinnbar: wie oben, aber mindestens eine Leichtfigur.
 * - eigeneHaengt: Eine eigene Figur oder ein eigener Bauer hängt (Glossar „Hängen“).
 * - eigeneGefesselt: Eine eigene Figur ist an den eigenen König gefesselt.
 * - nurBauern: Außer den Königen stehen nur Bauern da.
 * - kaumZuege: Die Seite am Zug hat weniger als zwei legale Züge.
 */
export function hatEigenschaft(s: Stellung, e: Eigenschaft): boolean {
  const regeln = s.regeln;
  if (e === "ohneRegeln") return !regeln;
  if (e === "nurBauern") return nurBauern(s);
  if (!regeln) return false;
  switch (e) {
    case "imSchach":
      return regeln.isCheck();
    case "partieZuEnde":
      return regeln.isEnd();
    case "materialGewinnbar":
      return bestesSchlagen(s, s.amZug) > 0;
    case "figurGewinnbar":
      return bestesSchlagen(s, s.amZug) >= FIGURENWERT_LEICHT;
    case "eigeneHaengt":
      return eigeneHaengt(s);
    case "eigeneGefesselt":
      return eigeneGefesselt(s);
    case "kaumZuege":
      return [...regeln.allDests().values()].reduce((n, ziele) => n + ziele.size(), 0) <
        MINDESTENS_ZUEGE;
  }
}

/** Die Trainer (und Übungsarten), die ihre Stellungen hier prüfen lassen. */
export type Pruefart =
  | "zielbilanz"
  | "faktorenbilanz"
  | "planfragen"
  | "lap"
  | "wettrennen"
  | "denkroutine"
  | "gangarten"
  | "notieren"
  | "roentgen"
  | "zaehlen"
  | "falle"
  | "endspiel";

/**
 * Welche Eigenschaften ein Trainer ausschließt. Entscheidungen des Nebenchats (30.10.2026, zur
 * Durchsicht durch den Autor); je Trainer der Grund:
 *
 * - zielbilanz (Kapitel 2): Die Bilanz ist eine Momentaufnahme ruhiger Stellungen (das Buch
 *   zieht sie an den Schlussstellungen). Kein Schach, kein Ende, und kein laufender Abtausch:
 *   Kann die Seite am Zug sofort Material gewinnen, ändert der Rückschlag Zentrum oder
 *   Entwicklung gleich wieder. Hängende eigene Figuren und Fesselungen bleiben erlaubt (die Seite
 *   am Zug kann reagieren; Fesselungen wie Lb4 sind in Eröffnungen alltäglich).
 * - faktorenbilanz (Kapitel 3): Gambits leben vom angebotenen Bauern; ein Bauer, der hängt oder
 *   gewonnen werden kann, ist also gewollt. Ausgeschlossen: Schach, Ende und ein sofort
 *   gewinnbarer Figurenwert (dann sagt die Waage „Material“ nur etwas über den nächsten Zug).
 * - planfragen (Kapitel 6): Pläne gelten in ruhigen Stellungen; vorher kommen Schachs, Schläge
 *   und Drohungen (Kapitel 1, Schach-Röntgen-Regel; Kapitel 12, Denkroutine). Ausgeschlossen:
 *   Schach, Ende, sofortiger Materialgewinn, eine hängende oder gefesselte eigene Figur. Gilt nur
 *   für die gerechneten Fragen, nicht für die Warum-Fragen des Buches.
 * - lap (Kapitel 6): wie Planfragen (LAP fragt nach der Figurenverbesserung in Ruhe).
 * - wettrennen (Kapitel 6): Gezählt werden Bauernzüge bis zum Hebel; das hängt nicht an der
 *   Taktik. Nur Schach und Ende stören (die Frage, wer schneller ist, hängt am Zugrecht).
 * - denkroutine (Kapitel 12): Gerade hier gehören Schachs und Schläge dazu; Abb. 12.3 zeigt die
 *   Routine im Schach („Im Schach sind alle Abwehrzüge die Kandidaten“). Nur Ende und Stellungen
 *   mit weniger als zwei legalen Zügen fallen weg (es werden zwei Kandidaten verlangt).
 * - gangarten (Kapitel 0): Schach und Fesselung sind erlaubt und lehrreich: Sie schränken die
 *   Gangart ein, und die Begründung nennt es. Nur Ende und Lehrbilder ohne Regeln fallen weg.
 * - notieren (Kapitel 0): Ein Zug lässt sich in jeder Stellung aufschreiben, auch mit Schach
 *   („+“ gehört dazu). Nur Ende und Lehrbilder ohne Regeln fallen weg.
 * - roentgen (Kapitel 1): Steht die Seite am Zug im Schach, entfällt Frage 3 (der Gegner „noch
 *   einmal am Zug“); bei Matt oder Patt gibt es nichts zu prüfen. Schläge mit Gewinn sind der
 *   Inhalt der Übung und bleiben.
 * - zaehlen (Kapitel 1): kein Schach (erst darauf antworten), kein Matt oder Patt. Lehrbilder
 *   ohne Regeln bleiben, denn das Buch zählt an Ausschnitten (Abb. 1.26).
 * - falle (Kapitel 4): Die Entscheidung „nehmen oder nicht“ muss frei sein: kein Schach, kein Ende.
 * - endspiel (Kapitel 8 und 9): Schachs gehören zum Endspiel; nur Ende fällt weg. Reine
 *   Bauernendspiele sind gerade gewollt.
 */
export const AUSSCHLUSS: Readonly<Record<Pruefart, readonly Eigenschaft[]>> = {
  zielbilanz: ["ohneRegeln", "imSchach", "partieZuEnde", "materialGewinnbar"],
  faktorenbilanz: ["ohneRegeln", "imSchach", "partieZuEnde", "figurGewinnbar"],
  planfragen: [
    "ohneRegeln",
    "imSchach",
    "partieZuEnde",
    "materialGewinnbar",
    "eigeneHaengt",
    "eigeneGefesselt",
  ],
  lap: [
    "ohneRegeln",
    "imSchach",
    "partieZuEnde",
    "materialGewinnbar",
    "eigeneHaengt",
    "eigeneGefesselt",
  ],
  wettrennen: ["ohneRegeln", "imSchach", "partieZuEnde"],
  denkroutine: ["ohneRegeln", "partieZuEnde", "kaumZuege"],
  gangarten: ["ohneRegeln", "partieZuEnde"],
  notieren: ["ohneRegeln", "partieZuEnde"],
  roentgen: ["ohneRegeln", "imSchach", "partieZuEnde"],
  zaehlen: ["imSchach", "partieZuEnde"],
  falle: ["ohneRegeln", "imSchach", "partieZuEnde"],
  endspiel: ["ohneRegeln", "partieZuEnde"],
};

/** Die Eigenschaften, derentwegen ein Trainer diese Stellung ausschließt (leer: geeignet). */
export function ausschlussgruende(art: Pruefart, s: Stellung): Eigenschaft[] {
  return AUSSCHLUSS[art].filter((e) => hatEigenschaft(s, e));
}

/** Taugt die Stellung für diesen Trainer? Beispiel: Zielbilanz, Weiß im Schach → nein. */
export function geeignet(art: Pruefart, s: Stellung): boolean {
  return ausschlussgruende(art, s).length === 0;
}

/** Wie geeignet(), aber aus einer FEN; nicht lesbare Stellungen taugen nie. */
export function fenGeeignet(art: Pruefart, fen: string): boolean {
  const gelesen = stellungAusFen(fen);
  return gelesen.ok && geeignet(art, gelesen.wert);
}
