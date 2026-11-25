/**
 * Schachvarianten als offene Liste (Auftrag des Hauptchats, 26.11.2026, Teil 1 „Grundlage“): Jede
 * Variante meldet sich hier mit ihren Regeln, ihrer Engine, ihrer Startstellung und dem, was das
 * Brett zusätzlich zeigt. Partie, Spielhülle und Engineanbindung fragen nur diese Schnittstelle.
 *
 * Warum: Bisher kannte die App drei feste Varianten („blind“, „schach960“, „gehoer“) als Union in
 * schnittstelle/partie.ts. Für Drei-Schach, Atomschach, König der Hügel, Königsrennen und
 * Räuberschach (chessops/variant), für Varianten mit eigenen Figuren (Drache, Falke und Bison;
 * mittel-2) und Sonderformen (Nebel, Ente, Tandem; mittel-4) braucht es eine Stelle, an der sich
 * eine Variante einhängt, ohne dass jemand die Partie umbaut. Anleitung:
 * docs/spiel/auftraege/varianten_schnittstelle_26-11.md.
 * Abhängigkeiten: chessops (Typen).
 */
import type { Position } from "chessops/chess";
import type { Rules } from "chessops/types";

/** Kennung einer Variante wie in begegnungen.json und den Ink-Variablen (`variante…Gelernt`). */
export type Variantenkennung = string;

/**
 * Art der Variante:
 * - „regel“: eigene Regeln mit den gewohnten Figuren (Drei-Schach, Atom, Hügel, Rennen, Räuber, 960)
 * - „figuren“: neue Figuren (Drache, Falke, Bison), Züge nur über Fairy-Stockfish oder ffish
 * - „sonderform“: Regeln plus eigener Ablauf (Nebel, Ente, Tandem)
 * - „darstellung“: gewöhnliche Regeln, anders gezeigt (blind, nach Gehör)
 */
export type Variantenart = "regel" | "figuren" | "sonderform" | "darstellung";

/** Wie eine Variantenpartie endet, aus Sicht von Weiß und Schwarz, mit Textschlüssel des Grundes. */
export interface Variantenende {
  readonly sieger: "weiss" | "schwarz" | null;
  /** Spieltext, etwa „variante.dreischach.ende“ („Dreimal Schach!“). */
  readonly grund: string;
}

/** Ein Zug, wie die Regelschicht ihn ausführt: neue Stellung und Kurznotation. */
export interface Variantenzug {
  readonly fen: string;
  readonly san: string;
}

/**
 * Regeln einer Variante. Für chessops-Varianten genügt `chessops` (spiel/varianten/regelschicht.ts
 * baut daraus alles andere); Varianten mit eigenen Figuren liefern die Funktionen selbst (etwa über
 * ffish oder die Engine).
 */
export interface Regelschicht {
  /** Regeln in chessops; null, wenn chessops die Variante nicht kennt (eigene Figuren). */
  readonly chessops: Rules | null;
  /** Legale Züge in UCI (`e2e4`, `e7e8q`, Einsetzen `P@e4`). */
  legaleZuege(fen: string): readonly string[];
  /** Führt einen Zug in UCI aus; null, wenn er nicht legal ist. */
  ziehe(fen: string, uci: string): Variantenzug | null;
  /** Ist die Partie in dieser Stellung zu Ende (Matt, Patt und alle Varianten-Enden)? */
  ende(fen: string): Variantenende | null;
  /** Die chessops-Stellung, wenn es eine gibt (Brett, Notation); null sonst. */
  stellung(fen: string): Position | null;
}

/**
 * Wie die Engine die Variante spielt. Fairy-Stockfish kennt eingebaute Varianten über
 * `setoption name UCI_Variant value <name>`; eigene (Drache …) stehen als Abschnitt im Format von
 * variants.ini und werden vor der Partie geladen (`load`). „stockfish“: die gewöhnliche Engine.
 */
export interface Engineangabe {
  readonly engine: "stockfish" | "fairy";
  /** Name für UCI_Variant, etwa „3check“, „atomic“, „kingofthehill“, „racingkings“, „antichess“. */
  readonly uciVariante?: string;
  /** Abschnitt im Format von variants.ini (`[drache:chess]` …), für Varianten mit eigenen Figuren. */
  readonly ini?: string;
  /** Weitere Optionen (`UCI_Chess960` = „true“). */
  readonly optionen?: Readonly<Record<string, string>>;
}

/** Ein markiertes Feld auf dem Brett (Hügel, Ziellinie, Nebel). */
export interface Variantenfeld {
  readonly feld: string;
  readonly farbe: "gold" | "rot" | "grau" | "gruen" | "blau";
}

/** Was das Brett zusätzlich zeigt. Alles freiwillig. */
export interface Brettzusatz {
  /** Dauerhaft markierte Felder (Hügel d4 e4 d5 e5, Ziellinie Reihe 8). */
  readonly felder?: (fen: string) => readonly Variantenfeld[];
  /** Kurzer Zähler über dem Brett, etwa „Schach: Weiß 2, Schwarz 1“ (Textschlüssel und Werte). */
  readonly zaehler?: (
    fen: string,
  ) => { readonly text: string; readonly werte: Record<string, number> } | null;
  /** Wirkung beim Schlagen: Explosion (Atomschach) über den Feldern, die leer wurden. */
  readonly schlagwirkung?: "explosion";
  /** Figuren ausblenden (Blindschach); Nebel deckt Felder ab, die der Leser nicht sieht. */
  readonly sicht?: "alles" | "keine_figuren" | ((fen: string) => readonly string[]);
  /**
   * Bilder eigener Figuren: Buchstabe der FEN (groß = Weiß, klein = Schwarz) → Pfad im
   * Abenteuer-Paket, etwa { D: "figuren/varianten/drache-weiss.svg", d: "…-schwarz.svg" }.
   * Fehlt ein Buchstabe, zeigt das Brett die gewöhnliche Figur gleichen Buchstabens.
   */
  readonly figurenbilder?: Readonly<Record<string, string>>;
}

/** Eine Variante mit allem, was die App über sie wissen muss. */
export interface Variantendefinition {
  readonly kennung: Variantenkennung;
  readonly art: Variantenart;
  /** Spieltext des Namens, etwa „variante.dreischach.name“. */
  readonly name: string;
  readonly regeln: Regelschicht;
  readonly engine: Engineangabe;
  /** Startstellung: fest oder ausgelost (Schach960, Königsrennen); fehlt: Grundstellung. */
  readonly startstellung?: (zufall: () => number) => string;
  readonly brett?: Brettzusatz;
  /**
   * „eigene_partie“: Die Spielhülle zeigt statt ihres Bretts die Komponente, die sich unter dieser
   * Kennung angemeldet hat (abenteuer/anbindung/variantenpartien.ts), etwa Tandem mit zwei Brettern.
   * Fehlt: Die Hülle spielt die Variante selbst über `regeln` und `engine`.
   */
  readonly ablauf?: "eigene_partie";
  /**
   * Lädt, was die Regeln brauchen, bevor die Partie angelegt oder gezeigt wird (etwa ffish für
   * die Märchenfiguren, mittel-2). Die Partie legt erst an, wenn es fertig ist (anbindung/
   * dienste.ts), und die Hülle zeigt das Brett erst danach (useVariantenbereit.ts). Mehrfaches
   * Rufen muss billig sein (einmal laden, dann dasselbe Versprechen).
   */
  readonly vorbereiten?: () => Promise<void>;
}

const VARIANTEN = new Map<Variantenkennung, Variantendefinition>();

/**
 * Meldet eine Variante an. Eine Kennung darf es nur einmal geben (zweites Anmelden ist ein Fehler
 * im Code, kein Zustand des Lesers).
 */
export function registriereVariante(definition: Variantendefinition): void {
  if (VARIANTEN.has(definition.kennung)) {
    throw new Error(`Variante ${definition.kennung} ist schon angemeldet`);
  }
  VARIANTEN.set(definition.kennung, definition);
}

/** Die Variante zur Kennung, wenn sie angemeldet ist. */
export function varianteVon(
  kennung: Variantenkennung | undefined,
): Variantendefinition | undefined {
  return kennung === undefined ? undefined : VARIANTEN.get(kennung);
}

/** Alle angemeldeten Varianten in der Reihenfolge des Anmeldens. */
export function alleVarianten(): readonly Variantendefinition[] {
  return [...VARIANTEN.values()];
}
