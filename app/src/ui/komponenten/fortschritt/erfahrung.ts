/**
 * Erfahrungspunkte (EP) und Stufen des Lesers, gerechnet aus dem, was schon im Speicher steht.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (Ideensammlung, freigegeben 30.10.2026): Belohnungen wie
 * bei Chessly, nur auf dem Gerät, ohne Bestenliste. Wie die Orden (fortschrittsringe.ts) braucht
 * das kein neues Feld im Speicher: Die Punkte folgen aus angesehenen Abbildungen, gelösten Übungen,
 * Trainern, Partien, Lernsammlung und Fehlerdatenbank. Lernen am Buch zählt mehr als bloßes
 * Klicken (eine gelöste Übung zehnmal so viel wie eine angesehene Abbildung); Einträge ohne Inhalt
 * (Lernsammlung ohne Plan und Notiz, Fehler ohne Satz, Partien mit wenigen Zügen) zählen nicht.
 * Die Stufen tragen Begriffe des Buches in der Reihenfolge, in der das Buch sie lehrt.
 * Reine Funktionen ohne Oberfläche; die Anbindung steht in abzeichenstand.ts.
 * Abhängigkeiten: speicher/format.ts, speicher/partien.ts, speicher/besiegt.ts.
 */
import type { Nutzerdaten } from "../../../speicher/format";
import { ERFAHRUNGSQUELLEN } from "./erfahrungsquellen";
import type { Spielstand } from "../../../speicher/partien";
import type { Partie } from "../../../spiel/partie";

/** Was in die Erfahrungspunkte eingeht (Anzahlen, alle aus vorhandenen Daten). */
export interface Erfahrungsgrundlage {
  /** Angesehene Abbildungen. */
  readonly abbildungen: number;
  /** Abbildungen, die der Leser vor den Werkzeugen richtig eingeschätzt hat. */
  readonly eingeschaetzt: number;
  /** Beantwortete Warum-Fragen. */
  readonly warum: number;
  /** Gelöste Übungen des Buches. */
  readonly uebungen: number;
  /** Abgehakte Lernziele. */
  readonly lernziele: number;
  /** Richtig gelöste Aufgaben in den Trainern. */
  readonly trainerRichtig: number;
  /** Beendete Trainerrunden. */
  readonly trainerDurchgaenge: number;
  /** Beendete Partien gegen die Engine mit genug Zügen. */
  readonly partien: number;
  /** Davon gewonnen. */
  readonly siege: number;
  /** Verschiedene Bots, die der Leser in gewerteten Partien besiegt hat. */
  readonly besiegteBots: number;
  /** Einträge der Lernsammlung mit Plan oder Notiz. */
  readonly sammlung: number;
  /** Einträge der Fehlerdatenbank mit eigenem Satz. */
  readonly fehler: number;
  /** Längste Serie der Tagesaufgabe in Tagen (Merker auf dem Gerät, verfällt nie). */
  readonly tagesserie: number;
  /** Einheiten der zusätzlichen Quellen je Kennung (erfahrungsquellen.ts, Pakete der Gamifizierung). */
  readonly zusatz: Readonly<Record<string, number>>;
}

/** Die festen Grundquellen (alle Felder außer den zusätzlichen Quellen). */
type Grundquelle = Exclude<keyof Erfahrungsgrundlage, "zusatz">;

/**
 * Punkte je Einheit. Lernen am Buch (Übung, Warum-Frage, Einschätzung) wiegt schwerer als Ansehen;
 * die Trainer zählen je richtiger Antwort wenig, weil dort schnell viele Antworten entstehen.
 */
export const GEWICHTE: Readonly<Record<Grundquelle, number>> = {
  abbildungen: 2,
  eingeschaetzt: 4,
  warum: 5,
  uebungen: 20,
  lernziele: 5,
  trainerRichtig: 1,
  trainerDurchgaenge: 5,
  partien: 10,
  siege: 10,
  besiegteBots: 25,
  sammlung: 8,
  fehler: 8,
  tagesserie: 5,
};

/** Eine Partie zählt erst ab so vielen Halbzügen (zehn Züge je Seite), sonst ist sie nur ein Klick. */
export const MIN_HALBZUEGE = 20;

/** Die Stufen mit ihrer Schwelle in EP; Begriffe aus dem Buch, von der Eröffnung zum Plan. */
export const STUFEN = [
  { kennung: "ersterZug", ab: 0 },
  { kennung: "entwicklung", ab: 100 },
  { kennung: "zentrum", ab: 250 },
  { kennung: "rochade", ab: 500 },
  { kennung: "offeneLinie", ab: 900 },
  { kennung: "vorposten", ab: 1400 },
  { kennung: "freibauer", ab: 2000 },
  { kennung: "kombination", ab: 2800 },
  { kennung: "zugzwang", ab: 3800 },
  { kennung: "meisterplan", ab: 5000 },
] as const;
export type Stufenkennung = (typeof STUFEN)[number]["kennung"];

/** Die Stufe zu einer Punktzahl mit dem Weg zur nächsten. */
export interface Erfahrungsstufe {
  /** 1 für die erste Stufe. */
  readonly nummer: number;
  readonly kennung: Stufenkennung;
  readonly ep: number;
  /** Schwelle der nächsten Stufe; null auf der höchsten. */
  readonly naechsteAb: number | null;
  /** Punkte seit Beginn dieser Stufe und Breite der Stufe (für den Balken). */
  readonly anteil: { readonly erreicht: number; readonly gesamt: number };
}

/**
 * Summe der Erfahrungspunkte. Beispiel: 10 Abbildungen und 2 gelöste Übungen → 10·2 + 2·20 = 60.
 */
export function erfahrungspunkte(g: Erfahrungsgrundlage): number {
  const grund = (Object.keys(GEWICHTE) as Grundquelle[]).reduce(
    (summe, schluessel) => summe + Math.max(0, g[schluessel]) * GEWICHTE[schluessel],
    0,
  );
  return ERFAHRUNGSQUELLEN.reduce(
    (summe, q) => summe + Math.max(0, g.zusatz[q.kennung] ?? 0) * q.gewicht,
    grund,
  );
}

/**
 * Die Stufe zu einer Punktzahl. Beispiel: 600 EP → Stufe 4 „Rochade“, 100 von 400 EP zur Stufe 5.
 * Sonderfall: Auf der höchsten Stufe ist der Balken voll.
 */
export function stufeZu(ep: number): Erfahrungsstufe {
  const index = STUFEN.reduce((gefunden, s, i) => (ep >= s.ab ? i : gefunden), 0);
  const stufe = STUFEN[index] ?? STUFEN[0];
  const naechste = STUFEN[index + 1];
  const anteil = naechste
    ? { erreicht: ep - stufe.ab, gesamt: naechste.ab - stufe.ab }
    : { erreicht: 1, gesamt: 1 };
  return {
    nummer: index + 1,
    kennung: stufe.kennung,
    ep,
    naechsteAb: naechste?.ab ?? null,
    anteil,
  };
}

/** Eine in der App gegen die Engine gespielte, beendete Partie (keine eingelesene, kein Brett zu zweit). */
export function istEigenePartie(p: Partie): boolean {
  return p.ende !== null && p.einstellung.gegner === "engine" && !p.einstellung.importiert;
}

/** Hat der Leser diese Partie gewonnen? */
export function gewonnen(p: Partie): boolean {
  const ende = p.ende;
  return ende !== null && "sieger" in ende && ende.sieger === p.einstellung.eigeneFarbe;
}

/**
 * Partien und Siege. Gespeichert bleiben nur die letzten 50 Partien; der Wertungsverlauf wächst
 * weiter. Deshalb zählt jeweils der größere Wert aus beiden Quellen.
 * Beispiel: 60 gewertete Partien, davon 50 gespeichert → 60.
 */
export function partienUndSiege(spiel: Spielstand): { partien: number; siege: number } {
  const eigene = spiel.partien
    .map((e) => e.partie)
    .filter((p) => istEigenePartie(p) && p.zuege.length >= MIN_HALBZUEGE);
  return {
    partien: Math.max(eigene.length, spiel.wertung.length),
    siege: Math.max(
      eigene.filter(gewonnen).length,
      spiel.wertung.filter((w) => w.ergebnis === 1).length,
    ),
  };
}

const anzahl = (eintraege: Readonly<Record<string, unknown>>) => Object.keys(eintraege).length;
const mitText = (text: string | undefined) => (text ?? "").trim().length > 0;

/** Summe der Lernzielhaken über alle Kapitel. */
function lernzielhaken(daten: Nutzerdaten): number {
  return Object.values(daten.lernstand).reduce((summe, punkte) => summe + punkte.length, 0);
}

/**
 * Die Grundlage aus den Nutzerdaten und der besten Serie der Tagesaufgabe (Merker).
 * Beispiel: leere Daten → alles 0.
 */
export function grundlageAus(daten: Nutzerdaten, tagesserie: number): Erfahrungsgrundlage {
  const f = daten.fortschritt;
  const trainer = Object.values(f.trainer);
  const besiegt = new Set(Object.values(daten.spiel.besiegt).flat());
  return {
    abbildungen: anzahl(f.gesehen),
    eingeschaetzt: anzahl(f.eingeschaetzt),
    warum: Object.values(f.warum).reduce((summe, stellen) => summe + stellen.length, 0),
    uebungen: Object.values(f.uebungen).filter((u) => u.geloest).length,
    lernziele: lernzielhaken(daten),
    trainerRichtig: trainer.reduce((summe, s) => summe + (s?.richtig ?? 0), 0),
    trainerDurchgaenge: trainer.reduce((summe, s) => summe + (s?.durchgaenge ?? 0), 0),
    ...partienUndSiege(daten.spiel),
    besiegteBots: besiegt.size,
    sammlung: daten.sammlung.filter((e) => mitText(e.plan) || mitText(e.notiz)).length,
    fehler: daten.fehler.filter((e) => mitText(e.satz)).length,
    tagesserie,
    zusatz: Object.fromEntries(ERFAHRUNGSQUELLEN.map((q) => [q.kennung, q.zaehle(daten)])),
  };
}
