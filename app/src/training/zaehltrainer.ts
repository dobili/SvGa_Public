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
 */
import type { Square } from "chessops/types";
import { profil } from "../analyse/stellungsprofil";
import { feldname, gegner, type Stellung } from "../schach/stellung";
import type { Buchstellung } from "./buchstellungen";
import { mische, type Zufall } from "./zufall";

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
}

/** Die Antwort des Lesers. */
export interface Zaehlantwort {
  readonly angreifer: number;
  readonly verteidiger: number;
  readonly bilanz: number;
}

/** Zählt ein besetztes Feld aus Sicht der Seite, die die Figur angreift (wie k1-zaehlen). */
function zaehleFeld(stellung: Stellung, feld: Square): Omit<Zaehlaufgabe, "nummer" | "fen"> | null {
  const figur = stellung.brett.get(feld);
  if (!figur || figur.role === "king") return null;
  const p = profil(stellung);
  const seite = gegner(figur.color);
  const angreifer = p.angriffskarte.angreiferVon(feld, seite).length;
  if (angreifer === 0) return null;
  const verteidiger = p.angriffskarte.angreiferVon(feld, figur.color).length;
  const bilanz = Math.max(p.abtausch(feld)?.bilanz ?? 0, 0);
  return { feld: feldname(feld), angreifer, verteidiger, bilanz };
}

/**
 * Alle sinnvollen Zählfelder einer Stellung: Figuren (ohne König), die angegriffen werden.
 *
 * Beispiel: Abb. 1.26 enthält d4 (Weiß deckt dreimal, Schwarz greift dreimal an, Bilanz 0).
 */
export function zaehlfelder(buch: Buchstellung): Zaehlaufgabe[] {
  const ergebnis: Zaehlaufgabe[] = [];
  for (const feld of buch.stellung.brett.occupied) {
    const gezaehlt = zaehleFeld(buch.stellung, feld);
    if (gezaehlt && gezaehlt.bilanz <= HOECHSTE_BILANZ) {
      ergebnis.push({ nummer: buch.nummer, fen: buch.stellung.fen, ...gezaehlt });
    }
  }
  return ergebnis;
}

/**
 * Eine Runde Zählaufgaben, je zur Hälfte mit und ohne Gewinn.
 *
 * Warum: Das Buch lehrt beides: erkennen, wann Schlagen gewinnt, und wann „noch nichts geht“.
 * Nur Felder, die auch verteidigt werden, sonst wäre die Aufgabe zu leicht.
 * Eingaben: Buchstellungen, Anzahl, Zufall. Ausgabe: höchstens `anzahl` Aufgaben, je Stellung eine.
 */
export function zaehlrunde(
  stellungen: readonly Buchstellung[],
  anzahl: number,
  zufall: Zufall,
): Zaehlaufgabe[] {
  const mitGewinn: Zaehlaufgabe[] = [];
  const ohneGewinn: Zaehlaufgabe[] = [];
  for (const buch of mische(stellungen, zufall)) {
    const felder = mische(
      zaehlfelder(buch).filter(
        (a) => a.verteidiger > 0 && Math.max(a.angreifer, a.verteidiger) <= HOECHSTE_ANZAHL,
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
 * Regel: Kapitel 1, „Werte von Angreifer und Verteidiger zählen“: Eine Figur hängt, wenn der
 * Gegner sie mit Gewinn schlagen kann, auch wenn sie gedeckt ist (Turm von Bauer angegriffen).
 * Sonderfall: Gabeln und Drohungen zählen nicht, nur Schläge, die sofort Gewinn bringen.
 */
export function haengendeFiguren(stellung: Stellung): string[] {
  const p = profil(stellung);
  const ergebnis: string[] = [];
  for (const feld of stellung.brett.occupied) {
    const figur = stellung.brett.get(feld);
    if (!figur || figur.role === "king") continue;
    if ((p.abtausch(feld)?.bilanz ?? 0) > 0) ergebnis.push(feldname(feld));
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
  const alle = mische(stellungen, zufall).map((buch) => ({
    nummer: buch.nummer,
    fen: buch.stellung.fen,
    haengend: haengendeFiguren(buch.stellung),
  }));
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
