/**
 * Partien gegen die Engine im Speicher: laufende Partie, beendete Partien, Vorlieben.
 *
 * Rolle im Gesamtbild: Teil der Nutzerdaten ab Format 2 (Konzept 4.7 „Partien“). Die laufende
 * Partie übersteht ein Neuladen und das Schließen der App; beendete Partien bleiben mit ihrer
 * Auswertung (Wert je Stellung) für den Rückblick und den PGN-Export, höchstens MAX_PARTIEN.
 * Die Vorlieben merken sich die letzte Wahl im Spielen-Bildschirm. Das Lesen gespeicherter
 * Partien steht seit 0.2.90 in speicher/partienLesen.ts.
 * Seit 0.2.41 liegt hier auch der Wertungsverlauf des Lesers (spiel/wertung.ts): Er wächst mit
 * jeder fertig ausgewerteten gewerteten Partie und überlebt das Wegfallen alter Partien.
 * Abhängigkeiten: spiel/partie.ts, spiel/uhr.ts, spiel/wertung.ts, engine/fehlerart.ts,
 * engine/stufen.ts.
 */
import type { Reglerstufen } from "../engine/eigenstufen";
import type { Stilmix, Stilname } from "../engine/stile";
import { type BlinderFleck } from "../engine/blindeFlecken";
import { FEHLERARTEN, type Fehlerart } from "../engine/fehlerart";
import type { EigenerGegner } from "../engine/gegner";
import type { Stufennummer } from "../engine/stufen";
import type { Phase } from "../schach/phase";
import type { Gegnerart, Partie, Spielhilfen } from "../spiel/partie";
import type { Uhreinstellung } from "../spiel/uhr";
import { mitGewerteterPartie, type Wertungspunkt } from "../spiel/wertung";
import { KEINE_BESIEGTEN, mitBesiegtem, type Besiegte } from "./besiegt";

/** So viele beendete Partien bleiben gespeichert; ältere fallen weg. */
export const MAX_PARTIEN = 50;

/** Eine beendete Partie mit ihrer Auswertung. */
export interface Partieeintrag {
  readonly partie: Partie;
  /** Wert je Stellung aus Sicht von Weiß in Bauerneinheiten; leer, solange nicht ausgewertet. */
  readonly werte: readonly number[];
  /** Bester Zug der Engine je Stellung (UCI, „“ in Endstellungen); leer wie „werte“. */
  readonly beste: readonly string[];
  /**
   * Abstand des besten zum zweitbesten Zug je Stellung in Bauerneinheiten (für das „!“ des
   * einzigen guten Zuges, seit 0.2.39); leer bei Auswertungen aus älteren Versionen.
   */
  readonly abstaende: readonly number[];
  /**
   * Hauptvariante der Engine je Stellung (UCI, bis sechs Halbzüge, beginnt mit dem besten Zug;
   * für „Danach etwa …“ in der Rückblickkarte, Empfehlung R5, 0.2.56); leer bei älteren
   * Auswertungen.
   */
  readonly varianten: readonly (readonly string[])[];
}

/** Letzte Wahl im Spielen-Bildschirm. */
export interface Spielvorlieben {
  /** Gegner, vorgefertigter Gegner, Spielhilfen und Wertung (0.2.41). */
  readonly gegner: Gegnerart;
  readonly bot: string | null;
  readonly hilfen: Spielhilfen;
  readonly gewertet: boolean;
  /** Stufe im Mittelspiel. */
  readonly stufe: Stufennummer;
  /** Stufe je Phase (0.2.40); `mittelspiel` ist gleich `stufe`. */
  readonly stufenJePhase: Readonly<Record<Phase, Stufennummer>>;
  readonly uhr: Uhreinstellung | null;
  readonly ruecknahmeErlaubt: boolean;
  /** Ruhige Ansicht: nur Brett, Zugnavigation und gespielte Züge (Wunsch des Autors). */
  readonly ruhigeAnsicht: boolean;
  /**
   * Abhakliste der Fehlerarten (0.2.60, Rest aus S7): welche absichtlichen Fehler die
   * Engine-Stufen 1 bis 4 und die vorgefertigten Gegner machen dürfen; Vorgabe alle.
   */
  readonly erlaubteFehlerarten: readonly Fehlerart[];
  /**
   * Blinde Flecken der eigenen Stufe (0.2.82, Wunsch des Autors): Zugarten, die die Engine ohne
   * vorgefertigten Gegner oft nicht sieht; Vorgabe keine. Fehlt die Angabe in älteren Daten,
   * gilt die Vorgabe.
   */
  readonly blindeFlecken: readonly BlinderFleck[];
  /**
   * Seit 0.2.126 (Wunsch des Autors: dieselben Einstellungen wie bei eigenen Bots): Stil, Stufen je
   * Fehlerart und Fleck auf den Quantilen der Menschen, Fehlerhäufigkeit und Höchstverlust der
   * eigenen Stufe. Fehlend: Universell, wie der Median, wie Menschen, unbegrenzt.
   */
  readonly stilname?: Stilname;
  /**
   * Stil-Mischung (0.2.126, Wunsch des Autors, engine/stile.ts): je Stil 50 bis 125 %, je Achse
   * höchstens einer. Vorhanden: gilt statt `stilname` (der dann der erste Stil ist).
   */
  readonly stilmix?: Stilmix;
  readonly reglerstufen?: Reglerstufen;
  readonly haeufigkeit?: number;
  readonly hoechstverlust?: Readonly<Partial<Record<Fehlerart, number>>>;
}

export interface Spielstand {
  readonly laufend: Partie | null;
  /** Neueste zuerst. */
  readonly partien: readonly Partieeintrag[];
  readonly vorlieben: Spielvorlieben;
  /** Wertungsverlauf des Lesers, älteste zuerst (0.2.41). */
  readonly wertung: readonly Wertungspunkt[];
  /** Eigene Gegner des Lesers (0.2.42, speicher/gegner.ts). */
  readonly eigeneGegner: readonly EigenerGegner[];
  /** Je Zeitklasse die Bots, die der Leser in gewerteten Partien besiegt hat (0.2.99, R51, besiegt.ts). */
  readonly besiegt: Besiegte;
}

export const STANDARD_VORLIEBEN: Spielvorlieben = {
  gegner: "engine",
  bot: null,
  hilfen: { symbole: true, werkzeuge: true },
  gewertet: true,
  stufe: 1,
  stufenJePhase: { eroeffnung: 1, mittelspiel: 1, endspiel: 1 },
  uhr: null,
  ruecknahmeErlaubt: true,
  ruhigeAnsicht: false,
  erlaubteFehlerarten: FEHLERARTEN,
  blindeFlecken: [],
};

export const LEERER_SPIELSTAND: Spielstand = {
  laufend: null,
  partien: [],
  vorlieben: STANDARD_VORLIEBEN,
  wertung: [],
  eigeneGegner: [],
  besiegt: KEINE_BESIEGTEN,
};

/** Die Partie mit dieser Kennung, laufend oder beendet; null, wenn es sie nicht (mehr) gibt. */
export function findePartie(stand: Spielstand, id: string): Partie | null {
  if (stand.laufend?.id === id) return stand.laufend;
  return stand.partien.find((e) => e.partie.id === id)?.partie ?? null;
}

/** Merkt die laufende Partie (null: keine mehr). */
export function mitLaufender(stand: Spielstand, partie: Partie | null): Spielstand {
  return { ...stand, laufend: partie };
}

/**
 * Legt eine beendete Partie ab: vorne in die Liste, die laufende Partie wird frei.
 *
 * Sonderfall: Liegt die Partie schon in der Liste (gleiche Kennung), wird sie ersetzt.
 */
export function legeAb(stand: Spielstand, partie: Partie): Spielstand {
  const andere = stand.partien.filter((e) => e.partie.id !== partie.id);
  const laufend = stand.laufend?.id === partie.id ? null : stand.laufend;
  const partien = [{ partie, werte: [], beste: [], abstaende: [], varianten: [] }, ...andere].slice(
    0,
    MAX_PARTIEN,
  );
  return { ...stand, laufend, partien, besiegt: mitBesiegtem(stand.besiegt, partie) };
}

/**
 * Schreibt den neuen Stand einer Partie: beendet → abgelegt, sonst die laufende Partie.
 *
 * Warum: Nach einer Rücknahme am Ende (etwa nach Matt) läuft die Partie wieder; sie verlässt
 * dann die Liste der beendeten Partien und ist wieder die laufende.
 */
export function mitPartie(stand: Spielstand, partie: Partie): Spielstand {
  if (partie.ende) return legeAb(stand, partie);
  const partien = stand.partien.filter((e) => e.partie.id !== partie.id);
  return { ...stand, laufend: partie, partien };
}

/**
 * Schreibt die Auswertung einer abgelegten Partie: Werte, beste Züge, Abstände und Hauptvarianten
 * je Stellung. Zählt die Partie für die Wertung, kommt zugleich ihr Wertungspunkt dazu
 * (spiel/wertung.ts).
 */
export function mitWerten(
  stand: Spielstand,
  id: string,
  werte: readonly number[],
  beste: readonly string[],
  abstaende: readonly number[] = [],
  varianten: readonly (readonly string[])[] = [],
): Spielstand {
  const partien = stand.partien.map((e) =>
    e.partie.id === id ? { ...e, werte, beste, abstaende, varianten } : e,
  );
  const eintrag = partien.find((e) => e.partie.id === id);
  const wertung = eintrag ? mitGewerteterPartie(stand.wertung, eintrag) : stand.wertung;
  return { ...stand, partien, wertung };
}

/**
 * Löscht eine beendete, ungewertete Partie (0.2.99, Wunsch des Autors). Gewertete Partien bleiben:
 * Sie tragen die Wertung und die besiegten Bots. Beispiel: Übungspartie mit Rücknahmen → weg.
 */
export function ohnePartie(stand: Spielstand, id: string): Spielstand {
  const partien = stand.partien.filter((e) => e.partie.id !== id || e.partie.einstellung.gewertet);
  return { ...stand, partien };
}

export function mitVorlieben(stand: Spielstand, vorlieben: Spielvorlieben): Spielstand {
  return { ...stand, vorlieben };
}

/** Schreibt die Liste der eigenen Gegner (speicher/gegner.ts rechnet sie aus). */
export function mitEigenenGegnern(
  stand: Spielstand,
  eigeneGegner: readonly EigenerGegner[],
): Spielstand {
  return { ...stand, eigeneGegner };
}

/**
 * Setzt die Wertung zurück (Wunsch des Autors, 17.10.2026): Der Verlauf wird leer, und alle bis
 * dahin gespielten Partien (auch die laufende) gelten dauerhaft als ungewertet, damit sie nicht
 * beim nächsten Speichern einer Auswertung wieder zählen.
 */
export function setzeWertungZurueck(stand: Spielstand): Spielstand {
  const ungewertet = (p: Partie): Partie => ({
    ...p,
    einstellung: { ...p.einstellung, gewertet: false },
  });
  return {
    ...stand,
    laufend: stand.laufend ? ungewertet(stand.laufend) : null,
    partien: stand.partien.map((e) => ({ ...e, partie: ungewertet(e.partie) })),
    wertung: [],
    besiegt: KEINE_BESIEGTEN,
  };
}
