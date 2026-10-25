/**
 * Theoriebaum: Zugfolgen der bekannten Eröffnungstheorie, für die Zugklasse „Theoriezug“.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (25.10.2026): Die Zugklasse „Buchzug“ der Auswertung
 * (spiel/auswertung.ts, interner Schlüssel weiter "buch") heißt „Theoriezug“ wie „Book“ bei
 * chess.com: ein Zug, der zur bekannten Eröffnungstheorie gehört (chess.com-Glossar „Book Move“:
 * „a move that is well-known to opening theory“; wer davon abweicht, ist „out of book“).
 * Regel der App: Ein Zug ist ein Theoriezug, wenn
 *   1. er auf der Zugfolge einer benannten Eröffnung der freien Lichess-Liste liegt (bis zur
 *      benannten Stellung, auch über unbenannte Zwischenstellungen; nach einer Zugumstellung
 *      geht es weiter, sobald die Partie eine benannte Stellung erreicht, Vergleich über Figuren,
 *      Zugrecht und Rochaderechte), oder in den Eröffnungen und Gambits des Buches steht
 *      (Kapitel 2 und 3, ohne die mit „?“ markierten Züge);
 *   2. alle Züge davor in der Partie auch Theoriezüge waren (chess.com: einmal „out of book“,
 *      dann bleibt es so; sonst wäre eine zufällig wieder erreichte Theoriestellung ein
 *      Theoriezug);
 *   3. er nicht mindestens 0,5 Bauern verliert (ein benannter, aber schlechter Zug wie die
 *      „Bongcloud“ 1. e4 e5 2. Ke2 bleibt „ungenau“ oder schlechter und beendet die Theorie;
 *      chess.com zählt nur anerkannte Theorie).
 * Diese Datei prüft Bedingung 1; 2 und 3 prüft spiel/auswertung.ts (zugurteile).
 * Warum ein Zugbaum statt einer Menge von Stellungen: Den Schlüssel jeder der rund 8.000
 * Stellungen zu rechnen kostete am Rechner 80 bis 200 ms (auf dem Handy ein Mehrfaches); der Baum
 * aus den Zugfolgen braucht keine Schachregeln und ist in wenigen Millisekunden gebaut. Gemessen an
 * 30.000 Lichess-Partien (September 2026) erkennt er 98 % der Theoriezüge der Stellungsmenge; es
 * fehlen nur Zugumstellungen in unbenannte Zwischenstellungen.
 * Die Liste (inhalte/lichess, 3.864 benannte Stellungen, gemeinfrei) kommt mit Zugfolgen aus
 * `public/daten/<sprache>/eroeffnungen-lichess.json` (pipeline/eroeffnungsliste.py, Schema 2).
 * Abhängigkeiten: schach/eroeffnungsindex.ts (Schlüssel, Buchzüge), schach/eroeffnungsnamen.ts,
 * daten/generiert.
 */
import type { Eroeffnungsliste } from "../daten/generiert/eroeffnungsliste";
import { buchzugschluessel, stellungsschluessel, type Eroeffnungsindex } from "./eroeffnungsindex";
import type { BekannteEroeffnung } from "./eroeffnungsnamen";

/** Schlüssel der Grundstellung (Figuren, Zugrecht, Rochaderechte). */
const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq";

/** Ein Knoten im Baum der Lichess-Zugfolgen. */
export interface Theorieknoten {
  /** Die benannte Eröffnung, deren Zugfolge hier endet; null bei Zwischenstellungen. */
  readonly name: BekannteEroeffnung | null;
  /** Folgezüge (englische Kurznotation ohne „+“ und „#“) → Knoten. */
  readonly kinder: ReadonlyMap<string, Theorieknoten>;
  /** Benannte Stellungen in diesem Teilbaum, ohne den Knoten selbst (Maß für die Bedeutung). */
  readonly benannteDarunter: number;
}

export interface Theoriebaum {
  readonly wurzel: Theorieknoten;
  /** Stellungsschlüssel einer benannten Stellung → ihr Knoten (für Zugumstellungen). */
  readonly benannte: ReadonlyMap<string, Theorieknoten>;
}

/** Was die Theorie-Erkennung kennt: den Lichess-Baum und den Eröffnungsindex des Buches. */
export interface Theoriequellen {
  readonly baum: Theoriebaum | null;
  readonly buch: Eroeffnungsindex | null;
}

/** Knoten während des Bauens (danach nur noch lesend als Theorieknoten). */
interface Bauknoten {
  name: BekannteEroeffnung | null;
  readonly kinder: Map<string, Bauknoten>;
  benannteDarunter: number;
}

/** Zug ohne Schach- und Mattzeichen, damit „Qxf7+“ und „Qxf7“ gleich gelten. */
function zugkern(san: string): string {
  return san.replace(/[+#]+$/, "");
}

/** Zählt die benannten Stellungen unter jedem Knoten. */
function zaehle(knoten: Bauknoten): number {
  let summe = 0;
  for (const kind of knoten.kinder.values()) summe += zaehle(kind);
  knoten.benannteDarunter = summe;
  return summe + (knoten.name ? 1 : 0);
}

/**
 * Baut den Baum aus der Lichess-Liste: jede Zugfolge Zug für Zug, gemeinsame Anfänge einmal.
 *
 * Warum: Theorie ist nicht nur die benannte Endstellung, sondern der ganze Weg dorthin (nach
 * 1. e4 e5 2. Sf3 Sc6 3. Lb5 a6 4. La4 Sf6 5. 0-0 Le7 6. Te1 b5 hat nicht jede Stellung einen
 * Namen), und der Rückblick braucht die Eröffnungen, deren Zugfolge durch eine Stellung führt.
 * Eingabe: die geladene Liste (Schema 2, mit Zugfolgen). Ausgabe: Baum und benannte Stellungen.
 * Beispiel: „Ruy Lopez“ (e4 e5 Nf3 Nc6 Bb5) → fünf Knoten, der letzte mit Namen.
 * Sonderfall: Ein Eintrag ohne Zugfolge wird übersprungen; je Stellung zählt der erste Name.
 */
export function baueTheoriebaum(liste: Eroeffnungsliste): Theoriebaum {
  const wurzel: Bauknoten = { name: null, kinder: new Map(), benannteDarunter: 0 };
  const benannte = new Map<string, Bauknoten>();
  for (const [schluessel, eco, name, zuege] of liste.stellungen) {
    if (typeof schluessel !== "string" || typeof eco !== "string") continue;
    if (typeof name !== "string" || typeof zuege !== "string" || zuege === "") continue;
    let knoten = wurzel;
    for (const san of zuege.split(" ")) {
      const kern = zugkern(san);
      let kind = knoten.kinder.get(kern);
      if (!kind) {
        kind = { name: null, kinder: new Map(), benannteDarunter: 0 };
        knoten.kinder.set(kern, kind);
      }
      knoten = kind;
    }
    knoten.name ??= { eco, name };
    if (!benannte.has(schluessel)) benannte.set(schluessel, knoten);
  }
  zaehle(wurzel);
  return { wurzel, benannte };
}

const baumVorrat = new WeakMap<Eroeffnungsliste, Theoriebaum>();

/**
 * Der Baum zur Liste, aus dem Vorrat oder neu gebaut (wie schach/eroeffnungsindexVorrat.ts).
 * Beispiel: Partie und Rückblick fragen nach derselben geladenen Liste; gebaut wird einmal.
 */
export function theoriebaumFuer(liste: Eroeffnungsliste): Theoriebaum {
  let baum = baumVorrat.get(liste);
  if (!baum) {
    baum = baueTheoriebaum(liste);
    baumVorrat.set(liste, baum);
  }
  return baum;
}

/**
 * Der Knoten des Baumes je Stellung einer Partie (Start und nach jedem Zug); null außerhalb.
 *
 * Eingaben: Baum, Stellungen (ein Eintrag mehr als Züge), Züge (englische Kurznotation).
 * Ausgabe: je Stellung der Knoten. Von einem Knoten geht es über den gespielten Zug weiter;
 * passt keiner, über die benannte Stellung mit gleichem Schlüssel (Zugumstellung).
 * Beispiel: 1. c4 e6 2. Sc3 Sf6 3. d4 Lb4 → am Ende der Knoten „Nimzo-Indische Verteidigung“.
 * Sonderfall: Eine Partie aus einer eigenen Stellung beginnt nur dann im Baum, wenn diese
 * Stellung die Grundstellung oder eine benannte Stellung ist.
 */
export function theorieknoten(
  baum: Theoriebaum,
  fens: readonly string[],
  sans: readonly string[],
): (Theorieknoten | null)[] {
  const start = stellungsschluessel(fens[0] ?? "");
  let knoten: Theorieknoten | null =
    start === GRUNDSTELLUNG ? baum.wurzel : (baum.benannte.get(start) ?? null);
  const ergebnis = [knoten];
  sans.forEach((san, i) => {
    const danach = stellungsschluessel(fens[i + 1] ?? "");
    knoten = knoten?.kinder.get(zugkern(san)) ?? baum.benannte.get(danach) ?? null;
    ergebnis.push(knoten);
  });
  return ergebnis;
}

/** Steht der Zug in den Eröffnungen des Buches (ohne die mit „?“ markierten)? */
function istBuchzug(buch: Eroeffnungsindex, fenVorher: string, san: string): boolean {
  const zeichen = buch.buchzuege.get(buchzugschluessel(stellungsschluessel(fenVorher), san));
  return zeichen !== undefined && !zeichen.includes("?");
}

/**
 * Bedingung 1 der Regel (Dateikopf) je Halbzug: Liegt der Zug in der Theorie?
 *
 * Eingaben: Quellen, Stellungen der Partie (Start und nach jedem Zug), Züge (englische
 * Kurznotation). Ausgabe: je Halbzug true oder false; die Kette (Bedingung 2) und den Verlust
 * (Bedingung 3) prüft spiel/auswertung.ts.
 * Beispiel: 1. e4 e5 2. Sf3 Sc6 3. Lb5 → fünfmal true („Ruy Lopez“); 1. e4 e5 2. Ke2 → dreimal
 * true (die „Bongcloud Attack“ steht in der Liste; dass 2. Ke2 trotzdem kein Theoriezug ist,
 * entscheidet der Verlust in der Auswertung); 1. e4 e5 2. Dh5 Sc6 3. Dxf7+ → das letzte false.
 * Sonderfall: Fehlt eine Quelle (nicht geladen), zählt nur die andere.
 */
export function theorieJeZug(
  quellen: Theoriequellen,
  fens: readonly string[],
  sans: readonly string[],
): boolean[] {
  const knoten = quellen.baum ? theorieknoten(quellen.baum, fens, sans) : [];
  return sans.map(
    (san, i) =>
      (knoten[i + 1] ?? null) !== null ||
      (quellen.buch !== null && istBuchzug(quellen.buch, fens[i] ?? "", san)),
  );
}
