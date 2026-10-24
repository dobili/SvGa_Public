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
  wertungstempo,
  type Partiekennzahlen,
  type Wertungsschaetzung,
  type Wertungstempo,
} from "./elomodell";
import { spielstaerke, spielstaerkeJePhase, type Spielstaerke } from "./genauigkeit";
import { stellungen, type Partie } from "./partie";
import { phasenJeStellung, type Phase } from "./phasen";
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
  /** Schätzung der Engine für den Leser je Phase dieser Partie; null bei zu wenigen Zügen. */
  readonly phasen: Readonly<Record<Phase, number | null>>;
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
 * Partien gegen die Engine (seit R32 nur gewertete; seit 0.2.124 je Zeitklasse mit dem Elo-Modell:
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

/**
 * Die Schätzung je Phase für den Leser (ab sechs Zügen je Phase; seit 0.2.124 nur, wo die Spanne
 * des Teilmodells schmal genug ist, sonst null).
 */
export function phasenstaerke(eintrag: Partieeintrag): Readonly<Record<Phase, number | null>> {
  if (eintrag.werte.length === 0) return OHNE_PHASEN;
  const p = eintrag.partie;
  const urteile = zugurteile(p, eintrag.werte, eintrag.beste, eintrag.abstaende);
  const alle = stellungen(p);
  const gespielte = p.zuege.map((zug, index) => sanZuUci(alle[index] ?? "", zug.san));
  const je = spielstaerkeJePhase(
    p,
    eintrag.werte,
    urteile,
    eintrag.beste,
    gespielte,
    phasenJeStellung(p),
    wertungstempo(p.einstellung.uhr),
  );
  const farbe = p.einstellung.eigeneFarbe;
  return {
    eroeffnung: je.eroeffnung[farbe].spielstaerke,
    mittelspiel: je.mittelspiel[farbe].spielstaerke,
    endspiel: je.endspiel[farbe].spielstaerke,
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
  const bisher = aktuelleWertung(punkte);
  const eigene = bisher ?? staerke[p.einstellung.eigeneFarbe].spielstaerke;
  if (eigene === null) return null;
  const k = punkte.length < ANFANGSPARTIEN ? K_ANFANG : K_DANACH;
  const neu = bisher === null ? eigene : eigene + k * (ergebnis - erwartung(eigene, gegner));
  return {
    partieId: p.id,
    zeit: p.begonnen,
    gegner,
    ergebnis,
    wertung: Math.round(neu),
    phasen: phasenstaerke(eintrag),
  };
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
