/**
 * Wertung des Lesers aus den gewerteten Partien: ein Elo-System gegen die Engine-Schätzung des
 * Gegners (Wunsch des Autors, 17.10.2026, Version 0.2.41).
 *
 * Rolle im Gesamtbild: Die Spielstärke je Partie (spiel/genauigkeit.ts) misst nur die Genauigkeit
 * der Züge einer Partie. Die Wertung verbindet alle gewerteten Partien zu einer Zahl, die mit
 * Siegen steigt und mit Niederlagen fällt, wie eine Elo-Zahl im Verein: Die erste gewertete
 * Partie setzt die Wertung auf die Schätzung der Engine für den Leser; jede weitere zählt wie
 * eine Partie gegen einen Spieler mit der festen Zahl des Gegners aus der Gegnerwahl
 * (engine/botstaerke.ts, seit 0.2.85, Rückfrage S23; vorher die Stärke, mit der die Engine in
 * dieser Partie gespielt hat, die um etwa ±400 streute und nach oben bei etwa 1750 endete). K-Faktor 32 in den ersten zehn Partien, danach 20 (wie
 * beim Weltschachbund für Spieler unter 2400). Jeder Punkt des Verlaufs merkt sich Zeit, Gegner
 * und Ergebnis, damit die Kurve in den Einstellungen nach Partien oder nach Zeitraum zeigen kann;
 * dazu die Schätzung der Engine für den Leser je Phase dieser Partie (Wunsch des Autors: die Kurve
 * nach Eröffnung, Mittelspiel und Endspiel umschalten, um zu sehen, wo das Üben am meisten
 * bringt).
 * Gewertet werden nur beendete Partien gegen die Engine aus der Grundstellung (Wunsch des
 * Autors: nichts aus Abbildungen oder aufgebauten Stellungen) ohne Rücknahme mit Haken
 * „gewertete Partie“ und fertiger Auswertung; Partien mit zu wenigen Zügen für eine Schätzung zählen nicht.
 * Seit 0.2.125 (Empfehlung, vom Autor am 24.10.2026 angenommen) läuft die Wertung je Zeitklasse
 * (Blitz, Schnellschach, Klassisch) als eigene Elo-Kette wie bei Lichess; ältere Punkte ohne
 * Zeitklasse zählen als Schnellschach. Die Kurve je Phase kommt nicht mehr aus Werten je Partie,
 * sondern aus der Schätzung über die letzten zehn Partien (phasenverlauf).
 * Abhängigkeiten: spiel/genauigkeit.ts, spiel/auswertung.ts, spiel/partie.ts, spiel/zuege.ts,
 * speicher/partien.ts (Partieeintrag).
 */
import { gegnerstaerke } from "../engine/botstaerke";
import type { Partieeintrag } from "../speicher/partien";
import { zugurteile } from "./auswertung";
import {
  HOECHSTENS_PARTIEN,
  istSchmal,
  kennzahlenMittel,
  schaetzung,
  WERTUNGSTEMPI,
  wertungstempo,
  type Partiekennzahlen,
  type Wertungsschaetzung,
  type Wertungstempo,
} from "./elomodell";
import { spielstaerke, type Spielstaerke } from "./genauigkeit";
import { stellungen, type Partie } from "./partie";
import type { Phase } from "./phasen";
import { sanZuUci } from "./zuege";

/** Die Grundstellung ohne Zähler (Felder, Seite am Zug, Rochade, En passant). */
const GRUNDSTELLUNG_KERN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -";
const FEN_KERNFELDER = 4;

/** Begann die Partie in der Grundstellung? */
export function ausGrundstellung(partie: Partie): boolean {
  const kern = partie.einstellung.startFen.trim().split(/\s+/).slice(0, FEN_KERNFELDER).join(" ");
  return kern === GRUNDSTELLUNG_KERN;
}

/** Ergebnis aus Sicht des Lesers: Sieg 1, Remis ½, Niederlage 0. */
export type Punktwert = 0 | 0.5 | 1;

/** Ein Punkt des Wertungsverlaufs: die Wertung nach dieser Partie. */
export interface Wertungspunkt {
  readonly partieId: string;
  /** Beginn der Partie als ISO-Zeit. */
  readonly zeit: string;
  /** Engine-Schätzung des Gegners in dieser Partie. */
  readonly gegner: number;
  readonly ergebnis: Punktwert;
  /** Die Wertung des Lesers nach der Partie, gerundet. */
  readonly wertung: number;
  /**
   * Schätzung je Phase dieser Partie aus älteren Punkten (vor 0.2.125). Neue Punkte tragen hier
   * null: Eine Zahl je Phase gibt es nur noch über mehrere Partien (phasenverlauf).
   */
  readonly phasen: Readonly<Record<Phase, number | null>>;
  /**
   * Zeitklasse der Partie (seit 0.2.125, Wertung je Zeitklasse wie bei Lichess). Punkte ohne
   * Angabe stammen aus der Zeit mit einer Wertung für alles und zählen als Schnellschach.
   */
  readonly tempo?: Wertungstempo;
}

/** Die Zeitklasse eines Punktes; ältere Punkte ohne Angabe zählen als Schnellschach. */
export function tempoDesPunkts(punkt: Wertungspunkt): Wertungstempo {
  return punkt.tempo ?? "rapid";
}

/** Der Verlauf einer Zeitklasse (Elo-Kette je Zeitklasse, seit 0.2.125). */
export function verlaufDerZeitklasse(
  punkte: readonly Wertungspunkt[],
  tempo: Wertungstempo,
): Wertungspunkt[] {
  return punkte.filter((p) => tempoDesPunkts(p) === tempo);
}

/** Die Zeitklassen mit mindestens einem Punkt, in fester Reihenfolge (Blitz, Schnell, Klassisch). */
export function zeitklassenMitWertung(punkte: readonly Wertungspunkt[]): Wertungstempo[] {
  return WERTUNGSTEMPI.filter((tempo) => punkte.some((p) => tempoDesPunkts(p) === tempo));
}

/** Vorläufig heißt eine Wertung in den ersten Partien (K-Faktor 32), wie das „?“ bei Lichess. */
export function istVorlaeufig(verlauf: readonly Wertungspunkt[]): boolean {
  return verlauf.length < ANFANGSPARTIEN;
}

/** Ohne Schätzung je Phase (ältere Punkte). */
export const OHNE_PHASEN: Readonly<Record<Phase, number | null>> = {
  eroeffnung: null,
  mittelspiel: null,
  endspiel: null,
};

/** K-Faktor in den ersten Partien (die Wertung findet schnell ihren Platz). */
export const K_ANFANG = 32;
/** So viele Partien gelten als Anfang. */
export const ANFANGSPARTIEN = 10;
/** K-Faktor danach. */
export const K_DANACH = 20;
/** Elo: 400 Punkte Unterschied bedeuten eine Erwartung von etwa 91 zu 9. */
const ERWARTUNGSTEILER = 400;
const ERWARTUNGSBASIS = 10;
/** Höchstens so viele Punkte bleiben im Verlauf (die ältesten fallen weg). */
export const MAX_WERTUNGSPUNKTE = 1000;

/** Die Spielstärke beider Seiten einer ausgewerteten Partie; null ohne Auswertung. */
export function staerkeDerPartie(eintrag: Partieeintrag): Spielstaerke | null {
  if (eintrag.werte.length === 0) return null;
  const p = eintrag.partie;
  const urteile = zugurteile(p, eintrag.werte, eintrag.beste, eintrag.abstaende);
  const alle = stellungen(p);
  const gespielte = p.zuege.map((zug, index) => sanZuUci(alle[index] ?? "", zug.san));
  const tempo = wertungstempo(p.einstellung.uhr);
  return spielstaerke(p, eintrag.werte, urteile, eintrag.beste, gespielte, tempo);
}

/** Die Schätzung über mehrere Partien: gesamt und je Phase (null, wo die Spanne zu breit ist). */
export interface Spielerschaetzung extends Wertungsschaetzung {
  readonly phasen: Readonly<Record<Phase, Wertungsschaetzung | null>>;
}

/**
 * Die Spielstärke des Lesers in einer Zeitklasse über seine letzten zehn ausgewerteten gewerteten
 * Partien gegen die Engine (seit R32 nur gewertete; seit 0.2.125 je Zeitklasse mit dem Elo-Modell:
 * Kennzahlen über die Partien gemittelt, Spanne wird mit jeder Partie enger).
 * Es zählen nur Partien dieser Zeitklasse mit genug eigenen Zügen für eine Schätzung; die Liste
 * ist neueste zuerst. Ausgabe: Schätzung mit Spanne, Zahl der Partien und je Phase; null ohne
 * passende Partie.
 * Beispiel: drei Schnellschach-Partien mit 70, 80 und 75 % → etwa 1550 (1150 bis 1950), aus 3 Partien.
 */
export function staerkeLetzterPartien(
  partien: readonly Partieeintrag[],
  tempo: Wertungstempo = "rapid",
): Spielerschaetzung | null {
  const kennzahlen: Partiekennzahlen[] = [];
  for (const eintrag of partien) {
    if (kennzahlen.length >= HOECHSTENS_PARTIEN) break;
    // Nur gewertete Partien (R32, Wunsch des Autors 23.10.2026): Partien mit Rücknahme oder
    // Spielhilfen, aus Abbildungen oder eingelesene PGN spiegeln die eigene Stärke nicht.
    const { gegner, gewertet, uhr } = eintrag.partie.einstellung;
    if (gegner !== "engine" || !gewertet || wertungstempo(uhr) !== tempo) continue;
    const seite = staerkeDerPartie(eintrag)?.[eintrag.partie.einstellung.eigeneFarbe];
    if (seite?.schaetzung && seite.kennzahlen) kennzahlen.push(seite.kennzahlen);
  }
  if (kennzahlen.length === 0) return null;
  const mittel = kennzahlenMittel(kennzahlen);
  const jePhase = (ph: Phase) => {
    const s = schaetzung(tempo, mittel, kennzahlen.length, ph);
    return istSchmal(s) ? s : null;
  };
  return {
    ...schaetzung(tempo, mittel, kennzahlen.length),
    phasen: {
      eroeffnung: jePhase("eroeffnung"),
      mittelspiel: jePhase("mittelspiel"),
      endspiel: jePhase("endspiel"),
    },
  };
}

/** Das Ergebnis aus Sicht des Lesers; null, solange die Partie läuft. */
export function ergebnisFuer(partie: Partie): Punktwert | null {
  const ende = partie.ende;
  if (!ende) return null;
  if (!("sieger" in ende)) return 0.5;
  return ende.sieger === partie.einstellung.eigeneFarbe ? 1 : 0;
}

/**
 * Erwartete Punkte eines Spielers gegen einen Gegner nach der Elo-Formel.
 * Beispiel: 1500 gegen 1500 → 0,5; 1500 gegen 1900 → etwa 0,09.
 */
export function erwartung(eigene: number, gegner: number): number {
  return 1 / (1 + ERWARTUNGSBASIS ** ((gegner - eigene) / ERWARTUNGSTEILER));
}

/** Die aktuelle Wertung: die des letzten Punktes; null ohne gewertete Partie. */
export function aktuelleWertung(punkte: readonly Wertungspunkt[]): number | null {
  return punkte.at(-1)?.wertung ?? null;
}

/**
 * Der Wertungspunkt zu einer Partie, oder null, wenn sie nicht zählt: nicht gewertet, gegen
 * einen Menschen, nicht aus der Grundstellung, mit Rücknahme, nicht beendet, ohne Auswertung oder
 * schon gezählt. Rücknahmen: Empfehlung S9, umgesetzt in 0.2.47 (wer einen Patzer zurücknimmt,
 * spielt stärker, als er ist). Nur die erste Partie braucht die Schätzung für den Leser (zehn Züge
 * vor der Entscheidung). Seit 0.2.105 zählt eine Partie auch ohne Schätzung des Gegners: Seine
 * Zahl ist seit 0.2.85 fest (Bot oder Stufen), und seit 0.2.103 hat ein früh verschenkter Gegner
 * oft zu wenige Züge vor der Entscheidung (Rückmeldung des Autors zu den Spaß-Bots, 19.10.2026).
 *
 * Beispiel: erste Partie, Engine schätzt den Leser auf 1400 → Wertung 1400 (unabhängig vom
 * Ergebnis); zweite Partie gegen einen Bot mit der Zahl 1600 gewonnen → 1400 + 32 · (1 − 0,24)
 * ≈ 1424. Die Gegnerwertung ist die feste Zahl des Bots oder, bei eigenen Stufen und eigenen
 * Bots, die Schätzung aus den Stufen je Phase (engine/botstaerke.ts).
 */
export function wertungspunktFuer(
  punkte: readonly Wertungspunkt[],
  eintrag: Partieeintrag,
): Wertungspunkt | null {
  const p = eintrag.partie;
  const ergebnis = ergebnisFuer(p);
  if (!p.einstellung.gewertet || p.einstellung.gegner !== "engine" || ergebnis === null) {
    return null;
  }
  if (!ausGrundstellung(p) || p.ruecknahmen > 0) return null;
  if (punkte.some((punkt) => punkt.partieId === p.id)) return null;
  const staerke = staerkeDerPartie(eintrag);
  if (!staerke) return null;
  const gegner = Math.round(gegnerstaerke(p.einstellung));
  // Seit 0.2.125 je Zeitklasse eine eigene Kette (wie bei Lichess): Die Wertung dieser Partie
  // hängt an der letzten Wertung derselben Zeitklasse, die erste Partie der Zeitklasse an der
  // Schätzung des Elo-Modells dieser Zeitklasse.
  const tempo = wertungstempo(p.einstellung.uhr);
  const kette = verlaufDerZeitklasse(punkte, tempo);
  const bisher = aktuelleWertung(kette);
  const eigene = bisher ?? staerke[p.einstellung.eigeneFarbe].spielstaerke;
  if (eigene === null) return null;
  const k = istVorlaeufig(kette) ? K_ANFANG : K_DANACH;
  const neu = bisher === null ? eigene : eigene + k * (ergebnis - erwartung(eigene, gegner));
  return {
    partieId: p.id,
    zeit: p.begonnen,
    gegner,
    ergebnis,
    wertung: Math.round(neu),
    phasen: OHNE_PHASEN,
    tempo,
  };
}

/** Die Kennzahlen des Lesers je Partie (nur ausgewertete), für den Phasenverlauf der Kurve. */
export function kennzahlenJePartie(
  partien: readonly Partieeintrag[],
  ids: ReadonlySet<string>,
): Map<string, Partiekennzahlen> {
  const ergebnis = new Map<string, Partiekennzahlen>();
  for (const eintrag of partien) {
    if (!ids.has(eintrag.partie.id)) continue;
    const seite = staerkeDerPartie(eintrag)?.[eintrag.partie.einstellung.eigeneFarbe];
    if (seite?.kennzahlen) ergebnis.set(eintrag.partie.id, seite.kennzahlen);
  }
  return ergebnis;
}

/** Ein Punkt des Phasenverlaufs: die Schätzung der Phase nach dieser Partie, falls schmal. */
export interface Phasenpunkt {
  readonly punkt: Wertungspunkt;
  readonly schaetzung: Wertungsschaetzung;
}

/**
 * Der Verlauf einer Phase über die Punkte einer Zeitklasse (Kurve „Eröffnung“, „Mittelspiel“,
 * „Endspiel“ in den Einstellungen, seit 0.2.125): Nach jeder Partie die Schätzung des Teilmodells
 * aus den Kennzahlen der bis dahin letzten zehn Partien, nur wo die Spanne schmal ist (SCHMAL).
 * Warum: Aus einer Partie ist die Spanne einer Phase nie schmal; über mehrere Partien wird sie es.
 * Eingaben: Punkte einer Zeitklasse (ältester zuerst), Kennzahlen je Partie, Zeitklasse, Phase.
 * Beispiel: zwölf Schnellschach-Partien → ab etwa der sechsten eine Zahl für das Mittelspiel.
 */
export function phasenverlauf(
  punkte: readonly Wertungspunkt[],
  kennzahlen: ReadonlyMap<string, Partiekennzahlen>,
  tempo: Wertungstempo,
  phase: Phase,
): Phasenpunkt[] {
  const ergebnis: Phasenpunkt[] = [];
  const fenster: Partiekennzahlen[] = [];
  for (const punkt of punkte) {
    const k = kennzahlen.get(punkt.partieId);
    if (!k) continue;
    fenster.push(k);
    if (fenster.length > HOECHSTENS_PARTIEN) fenster.shift();
    const s = schaetzung(tempo, kennzahlenMittel(fenster), fenster.length, phase);
    if (istSchmal(s)) ergebnis.push({ punkt, schaetzung: s });
  }
  return ergebnis;
}

/** Der Verlauf mit dieser Partie, falls sie zählt; sonst unverändert. */
export function mitGewerteterPartie(
  punkte: readonly Wertungspunkt[],
  eintrag: Partieeintrag,
): readonly Wertungspunkt[] {
  const punkt = wertungspunktFuer(punkte, eintrag);
  return punkt ? [...punkte, punkt].slice(-MAX_WERTUNGSPUNKTE) : punkte;
}

/** Ausschnitt der Kurve: die letzten N Partien oder ein Zeitraum bis jetzt. */
export type Wertungsbereich =
  | { readonly art: "partien"; readonly anzahl: number }
  | { readonly art: "zeit"; readonly tage: number };

const TAG_MS = 24 * 60 * 60 * 1000;

/**
 * Die Punkte im Bereich: die letzten N oder alle seit `jetzt` minus Tage. Beispiel: 30 Punkte,
 * Bereich „letzte 10“ → die letzten zehn; Bereich „1 Woche“ → alle mit Zeit in den letzten 7 Tagen.
 */
export function imBereich(
  punkte: readonly Wertungspunkt[],
  bereich: Wertungsbereich,
  jetzt: Date,
): readonly Wertungspunkt[] {
  if (bereich.art === "partien") return punkte.slice(-bereich.anzahl);
  const ab = jetzt.getTime() - bereich.tage * TAG_MS;
  return punkte.filter((p) => new Date(p.zeit).getTime() >= ab);
}
