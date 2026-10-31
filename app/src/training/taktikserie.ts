/**
 * Serienmodus „ohne Fehler“ im Taktiktrainer (Gamifizierung P5, Aufgabenserie ohne Fehler).
 *
 * Rolle im Gesamtbild: Wettbewerb mit sich selbst statt Bestenliste. Der Leser löst Aufgaben
 * steigender Schwierigkeit ohne Uhr; der erste Fehler (falscher Zug, Hilfe oder „Lösung zeigen“)
 * beendet die Serie. Das Ergebnis „12 in Folge“ geht als Rekord „taktikSerie“ in die Rekordtafel
 * (Zeile in training/rekordarten.ts, Quelle „serie“). Die Oberfläche steht in
 * ui/trainer/TaktikSerie.tsx. Reine Funktionen.
 * Abhängigkeiten: training/taktiktrainer.ts (Thema), training/zufall.ts.
 * Buchbezug: Kapitel 7, „Die zwölf Grundmotive“; Kapitel 12, regelmäßiges Taktiktraining.
 */
import type { Taktikaufgabe } from "../daten/trainerdaten";
import { passtZumThema, type Taktikthema } from "./taktiktrainer";
import { mische, type Zufall } from "./zufall";

/** Kennung des Rekords im Feld „rekorde“ und in REKORDARTEN. */
export const REKORD_TAKTIKSERIE = "taktikSerie";
/** Quelle, mit der die Serie ihren Wert an pruefeRekorde meldet. */
export const QUELLE_SERIE = "serie";
/** So viele Aufgaben je Schwierigkeitsstufe, bevor die nächste Stufe kommt. */
export const SERIE_JE_STUFE = 3;

/**
 * Die Aufgaben einer Serie: je Stufe drei zufällige, leichteste Stufe zuerst; danach alle übrigen,
 * schwerste zuerst (die Serie wird nicht wieder leichter, solange es schwere Aufgaben gibt).
 *
 * Warum: Eine Serie soll leicht beginnen und dann fordern; feste Blöcke je Stufe machen den Anstieg
 * sichtbar („Stufe 3“), ohne dass es einer Uhr bedarf.
 * Eingaben: alle Aufgaben, Thema (wie in der Runde), Zufall. Ausgabe: alle passenden Aufgaben in
 * Reihenfolge der Serie.
 * Beispiel: Stufen 1 bis 5 mit je 10 Aufgaben → 1,1,1, 2,2,2, …, 5,5,5, dann 5,5,…,4,4,…,1.
 * Sonderfall: Kein passendes Thema → leere Liste.
 */
export function serienaufgaben(
  aufgaben: readonly Taktikaufgabe[],
  thema: Taktikthema,
  zufall: Zufall,
): Taktikaufgabe[] {
  const gemischt = mische(
    aufgaben.filter((a) => passtZumThema(a, thema)),
    zufall,
  );
  const stufen = [...new Set(gemischt.map((a) => a.schwierigkeit))].sort((a, b) => a - b);
  const leiter = stufen.flatMap((stufe) =>
    gemischt.filter((a) => a.schwierigkeit === stufe).slice(0, SERIE_JE_STUFE),
  );
  const genommen = new Set(leiter);
  const rest = gemischt
    .filter((a) => !genommen.has(a))
    .sort((a, b) => b.schwierigkeit - a.schwierigkeit);
  return [...leiter, ...rest];
}

/** Stand einer laufenden Serie, wie ihn die Oberfläche zählt. */
export interface Serienstand {
  readonly richtig: number;
  readonly falsch: number;
  /** Index der aktuellen Aufgabe. */
  readonly index: number;
  /** Zahl der Aufgaben der Serie. */
  readonly anzahl: number;
  /** Der Leser hat „Serie beenden“ gewählt. */
  readonly aufgehoert: boolean;
}

/** Warum eine Serie endet; null, solange sie läuft. */
export type Serienende = "fehler" | "alle" | "aufgehoert" | null;

/**
 * Ob und warum die Serie vorbei ist.
 * Beispiele: ein Fehler → „fehler“; alle 40 Aufgaben gelöst → „alle“; „Serie beenden“ →
 * „aufgehoert“; 5 richtig, kein Fehler → null.
 * Sonderfall: Ein Fehler geht vor, auch wenn es die letzte Aufgabe war.
 */
export function serienende(stand: Serienstand): Serienende {
  if (stand.falsch > 0) return "fehler";
  if (stand.index >= stand.anzahl) return "alle";
  return stand.aufgehoert ? "aufgehoert" : null;
}
