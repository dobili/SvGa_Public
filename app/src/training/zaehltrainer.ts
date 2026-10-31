/**
 * Zähltrainer (Kapitel 1): Angreifer und Verteidiger zählen, Abtauschbilanz schätzen, hängende
 * Figuren finden.
 *
 * Rolle im Gesamtbild: Trainer „zaehlen“ (Pflichtenheft 7, AP 13). Die Aufgaben stammen aus den
 * Diagrammen des Buches; die Rechnung ist dieselbe wie im Werkzeug „Zählen“ (k1-zaehlen.ts), damit
 * App und Trainer nie verschieden zählen. Reine Funktionen.
 * Abhängigkeiten: analyse/stellungsprofil.ts, training/zufall.ts.
 * Buchbezug: Kapitel 1, „Werte von Angreifer und Verteidiger zählen“ und „Drei gegen drei:
 * Noch geht nichts“.
 * Seit dem Nebenchat (30.10.2026): Stellungen, in denen die Seite am Zug im Schach steht (oder
 * matt ist), fallen weg; an den König gefesselte Figuren zählen nicht mit (Kapitel 1: „Ein
 * gefesselter … Verteidiger zählt weniger“, Abb. 1.12, training/zaehlfesselung.ts); jede Aufgabe
 * hat eine Stufe (leicht, mittel, schwer) und ihre Motive (Batterie, Fesselung).
 */
import type { Square } from "chessops/types";
import type { SquareSet } from "chessops/squareSet";
import { profil } from "../analyse/stellungsprofil";
import { abtausch } from "../schach/abtausch";
import { abzugspaare } from "./zaehlabzug";
import { gefesselteAmFeld, gesperrteFuer } from "./zaehlfesselung";
import { feldname, gegner, type Stellung } from "../schach/stellung";
import type { Buchstellung } from "./buchstellungen";
import { mische, type Zufall } from "./zufall";
import { geeignet } from "./eignung";

/** Höchste Bilanz, die die Auswahl anbietet (eine Dame); größere Gewinne kommen nicht dran. */
export const HOECHSTE_BILANZ = 9;
/** Höchste Zahl an Angreifern oder Verteidigern, die die Auswahl anbietet. */
export const HOECHSTE_ANZAHL = 6;
/** So viele Felder bietet eine Stellung höchstens an, damit eine Runde viele Stellungen zeigt. */
const FELDER_JE_STELLUNG = 1;

/** Eine Zählaufgabe: ein Feld mit Figur, das der Gegner angreift. */
export interface Zaehlaufgabe {
  readonly nummer: string;
  readonly fen: string;
  readonly feld: string;
  readonly angreifer: number;
  readonly verteidiger: number;
  /** Gewinn der angreifenden Seite in Bauerneinheiten; 0 heißt: Schlagen lohnt nicht. */
  readonly bilanz: number;
  /** Motive, die das Zählen schwerer machen: Batterie, Fesselung (Kapitel 1). */
  readonly motive: readonly Zaehlmotiv[];
  /** Gefesselte Figuren, die hier nicht mitzählen (Felder), für die Erklärung. */
  readonly gefesselt: readonly string[];
  /**
   * Verdeckte Figuren: je die hintere und die vordere Figur (Felder) und ob die hintere die
   * eigene Figur auf dem Feld deckt (verdeckter Verteidiger) statt sie anzugreifen (Abzug).
   */
  readonly abzug: readonly {
    readonly hinten: string;
    readonly vorn: string;
    readonly deckt: boolean;
  }[];
  readonly stufe: Zaehlstufe;
}

export type Zaehlmotiv = "batterie" | "fesselung" | "abzug";
export type Zaehlstufe = "leicht" | "mittel" | "schwer";
export const ZAEHLSTUFEN: readonly Zaehlstufe[] = ["leicht", "mittel", "schwer"];
/** Bis zu so vielen beteiligten Figuren ist eine Aufgabe ohne Motiv leicht. */
const LEICHT_BIS = 3;
/** Ab so vielen beteiligten Figuren ist sie schwer, mit Batterie schon ab SCHWER_MIT_BATTERIE. */
const SCHWER_AB = 6;
const SCHWER_MIT_BATTERIE = 5;

/** Die Antwort des Lesers. */
export interface Zaehlantwort {
  readonly angreifer: number;
  readonly verteidiger: number;
  readonly bilanz: number;
}

/**
 * Taugt die Stellung zum Zählen? Nicht, wenn die Seite am Zug im Schach steht oder matt ist.
 *
 * Warum: Wer im Schach steht, muss zuerst darauf antworten (Kapitel 1, Schach-Röntgen-Regel);
 * hängende Figuren und Abtauschbilanzen sind dann nebensächlich, beim Matt sinnlos.
 * Beispiel: die Fallenstellung mit Sf3 matt (Dame e4 fesselt den Läufer e2) → ungeeignet.
 * Sonderfall: Ausschnitte ohne König (keine Regeln) bleiben geeignet, wie Abb. 1.26.
 */
export function zumZaehlenGeeignet(stellung: Stellung): boolean {
  return geeignet("zaehlen", stellung);
}

/**
 * Die Stufe einer Zählaufgabe (Wunsch des Autors, 30.10.2026: weitere Schwierigkeitsgrade).
 * Leicht: höchstens drei Figuren beteiligt, kein Motiv. Schwer: eine Fesselung, sechs und mehr
 * Figuren, oder eine Batterie bei fünf und mehr. Sonst mittel.
 * Beispiel: Abb. 1.26, d4 (drei gegen drei, Dame b6 in Batterie) → schwer.
 */
export function zaehlstufe(a: Pick<Zaehlaufgabe, "angreifer" | "verteidiger" | "motive">): Zaehlstufe {
  const beteiligt = a.angreifer + a.verteidiger;
  const batterie = a.motive.includes("batterie");
  if (
    a.motive.includes("fesselung") ||
    a.motive.includes("abzug") ||
    beteiligt >= SCHWER_AB ||
    (batterie && beteiligt >= SCHWER_MIT_BATTERIE)
  )
    return "schwer";
  return beteiligt <= LEICHT_BIS && a.motive.length === 0 ? "leicht" : "mittel";
}

/**
 * Nur die Figuren, die wirklich schlagen dürfen: nicht gefesselt und, bei einer Batterie, nicht
 * hinter einer gefesselten Figur (die vordere zieht nie weg, also kommt die hintere nie zum Zug).
 * Beispiel: Td2 an Ke1 gefesselt, Td1 dahinter, Ziel d6 → keiner der beiden Türme zählt.
 */
function nurFreie<T extends { feld: Square; hinter: Square | null }>(
  liste: readonly T[],
  gesperrt: SquareSet,
): T[] {
  const jeFeld = new Map(liste.map((a) => [a.feld, a]));
  const frei = (a: T): boolean => {
    if (gesperrt.has(a.feld)) return false;
    const vorne = a.hinter === null ? undefined : jeFeld.get(a.hinter);
    return vorne === undefined ? !(a.hinter !== null && gesperrt.has(a.hinter)) : frei(vorne);
  };
  return liste.filter(frei);
}

/**
 * Zählt ein besetztes Feld aus Sicht der Seite, die die Figur angreift (wie k1-zaehlen), aber
 * ohne an den König gefesselte Figuren, die hier nicht schlagen dürfen (Kapitel 1, Abb. 1.12).
 */
function zaehleFeld(stellung: Stellung, feld: Square): Omit<Zaehlaufgabe, "nummer" | "fen"> | null {
  const figur = stellung.brett.get(feld);
  if (!figur || figur.role === "king") return null;
  const p = profil(stellung);
  const gesperrt = gesperrteFuer(p, feld);
  const seite = gegner(figur.color);
  const angreiferListe = nurFreie(p.angriffskarte.angreiferVon(feld, seite), gesperrt);
  if (angreiferListe.length === 0) return null;
  const verteidigerListe = nurFreie(p.angriffskarte.angreiferVon(feld, figur.color), gesperrt);
  const bilanz = Math.max(abtausch(stellung.brett, feld, gesperrt)?.bilanz ?? 0, 0);
  const gefesselt = gefesselteAmFeld(p, feld).map(feldname);
  const batterie = [...angreiferListe, ...verteidigerListe].some((a) => a.hinter !== null);
  const abzug = abzugspaare(stellung, feld).map((p) => ({
    hinten: feldname(p.hinten),
    vorn: feldname(p.vorn),
    deckt: p.farbe === figur.color,
  }));
  // Nur ein verdeckter Angreifer ist das Motiv „Abzug“ (schwer). Ein verdeckter Verteidiger wie
  // die Dame d1 hinter dem Läufer d3 (Abb. 1.6) ist das einfache Lehrbeispiel des Buches.
  const motive: Zaehlmotiv[] = [
    ...(batterie ? (["batterie"] as const) : []),
    ...(gefesselt.length > 0 ? (["fesselung"] as const) : []),
    ...(abzug.some((p) => !p.deckt) ? (["abzug"] as const) : []),
  ];
  const angreifer = angreiferListe.length;
  const verteidiger = verteidigerListe.length;
  return {
    feld: feldname(feld),
    angreifer,
    verteidiger,
    bilanz,
    motive,
    gefesselt,
    abzug,
    stufe: zaehlstufe({ angreifer, verteidiger, motive }),
  };
}

/**
 * Alle sinnvollen Zählfelder einer Stellung: Figuren (ohne König), die angegriffen werden.
 *
 * Beispiel: Abb. 1.26 enthält d4 (Weiß deckt dreimal, Schwarz greift dreimal an, Bilanz 0).
 */
export function zaehlfelder(buch: Buchstellung): Zaehlaufgabe[] {
  const ergebnis: Zaehlaufgabe[] = [];
  if (!zumZaehlenGeeignet(buch.stellung)) return ergebnis;
  for (const feld of buch.stellung.brett.occupied) {
    const gezaehlt = zaehleFeld(buch.stellung, feld);
    if (gezaehlt && gezaehlt.bilanz <= HOECHSTE_BILANZ) {
      ergebnis.push({ nummer: buch.nummer, fen: buch.stellung.fen, ...gezaehlt });
    }
  }
  return ergebnis;
}

/**
 * Eine Runde Zählaufgaben, je zur Hälfte mit und ohne Gewinn, auf Wunsch nur einer Stufe.
 *
 * Warum: Das Buch lehrt beides: erkennen, wann Schlagen gewinnt, und wann „noch nichts geht“.
 * Nur Felder, die auch verteidigt werden, sonst wäre die Aufgabe zu leicht.
 * Eingaben: Buchstellungen, Anzahl, Zufall. Ausgabe: höchstens `anzahl` Aufgaben, je Stellung eine.
 */
export function zaehlrunde(
  stellungen: readonly Buchstellung[],
  anzahl: number,
  zufall: Zufall,
  stufe: Zaehlstufe | null = null,
): Zaehlaufgabe[] {
  const mitGewinn: Zaehlaufgabe[] = [];
  const ohneGewinn: Zaehlaufgabe[] = [];
  for (const buch of mische(stellungen, zufall)) {
    const felder = mische(
      zaehlfelder(buch).filter(
        (a) =>
          a.verteidiger > 0 &&
          Math.max(a.angreifer, a.verteidiger) <= HOECHSTE_ANZAHL &&
          (stufe === null || a.stufe === stufe),
      ),
      zufall,
    ).slice(0, FELDER_JE_STELLUNG);
    for (const aufgabe of felder) (aufgabe.bilanz > 0 ? mitGewinn : ohneGewinn).push(aufgabe);
    if (mitGewinn.length >= anzahl && ohneGewinn.length >= anzahl) break;
  }
  const haelfte = Math.ceil(anzahl / 2);
  const erste = mitGewinn.slice(0, haelfte);
  const zweite = ohneGewinn.slice(0, anzahl - erste.length);
  // Fehlt es an Aufgaben ohne Gewinn, füllen weitere mit Gewinn die Runde auf.
  const rest = mitGewinn.slice(erste.length, erste.length + anzahl - erste.length - zweite.length);
  return mische([...erste, ...zweite, ...rest], zufall);
}

/** Prüft eine Antwort: Jede der drei Zahlen muss stimmen. */
export function pruefeZaehlantwort(aufgabe: Zaehlaufgabe, antwort: Zaehlantwort) {
  const angreifer = antwort.angreifer === aufgabe.angreifer;
  const verteidiger = antwort.verteidiger === aufgabe.verteidiger;
  const bilanz = antwort.bilanz === aufgabe.bilanz;
  return { angreifer, verteidiger, bilanz, richtig: angreifer && verteidiger && bilanz };
}

/**
 * Prüft nur das Ergebnis (kurzer Modus): Wer die Bilanz trifft, hat richtig gezählt.
 * Beispiel: Abb. 1.28, d4: Bilanz 1 → „+1“ ist richtig, „lohnt nicht“ (0) falsch.
 */
export function pruefeBilanz(aufgabe: Zaehlaufgabe, bilanz: number): boolean {
  return bilanz === aufgabe.bilanz;
}

/** Eine Aufgabe „hängende Figuren finden“. */
export interface Haengeaufgabe {
  readonly nummer: string;
  readonly fen: string;
  /** Felder der Figuren beider Seiten, die der Gegner mit Gewinn schlagen kann. */
  readonly haengend: readonly string[];
}

/**
 * Die hängenden Figuren einer Stellung: Figuren beider Seiten (ohne König), deren Schlagen dem
 * Gegner Material bringt.
 *
 * Regel: Glossar „Hängen“: angegriffen und nicht ausreichend gedeckt; Kapitel 1, „Werte von
 * Angreifer und Verteidiger zählen“: Eine Figur hängt, wenn der Gegner sie mit Gewinn schlagen
 * kann, auch wenn sie gedeckt ist (Turm von Bauer angegriffen, oder zwei Angreifer gegen einen
 * Verteidiger).
 * Sonderfall: Gabeln und Drohungen zählen nicht, nur Schläge, die sofort Gewinn bringen.
 * Gefesselte Figuren schlagen nicht mit (Kapitel 1, Abb. 1.12). Ausgabe null: Die Stellung
 * taugt nicht (die Seite am Zug steht im Schach).
 */
export function haengendeFiguren(stellung: Stellung): string[] | null {
  if (!zumZaehlenGeeignet(stellung)) return null;
  const p = profil(stellung);
  const ergebnis: string[] = [];
  for (const feld of stellung.brett.occupied) {
    const figur = stellung.brett.get(feld);
    if (!figur || figur.role === "king") continue;
    if ((abtausch(stellung.brett, feld, gesperrteFuer(p, feld))?.bilanz ?? 0) > 0)
      ergebnis.push(feldname(feld));
  }
  return ergebnis.sort();
}

/**
 * Eine Runde „hängende Figuren finden“: meist Stellungen mit hängenden Figuren, ab und zu eine
 * ohne (dann ist „keine“ richtig).
 */
export function haengerunde(
  stellungen: readonly Buchstellung[],
  anzahl: number,
  zufall: Zufall,
): Haengeaufgabe[] {
  const alle = mische(stellungen, zufall).flatMap((buch) => {
    const haengend = haengendeFiguren(buch.stellung);
    return haengend ? [{ nummer: buch.nummer, fen: buch.stellung.fen, haengend }] : [];
  });
  const ohne = Math.floor(anzahl / 5);
  const mit = alle.filter((a) => a.haengend.length > 0).slice(0, anzahl - ohne);
  const leer = alle.filter((a) => a.haengend.length === 0).slice(0, anzahl - mit.length);
  return mische([...mit, ...leer], zufall);
}

/** Vergleicht die angetippten Felder mit den hängenden Figuren. */
export function pruefeFelder(erwartet: readonly string[], getippt: readonly string[]) {
  const gefunden = erwartet.filter((f) => getippt.includes(f));
  const fehlend = erwartet.filter((f) => !getippt.includes(f));
  const falsch = getippt.filter((f) => !erwartet.includes(f));
  return { gefunden, fehlend, falsch, richtig: fehlend.length === 0 && falsch.length === 0 };
}
