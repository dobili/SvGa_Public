/**
 * Abenteuerwertung A (Regelwerk R2, R3, R38; Entscheidungen A2, A6): eine eigene Wertung im
 * Spielstand, die mit der App-Wertung mitgeht und mit Story-Partien wächst, damit Straßengegner
 * und Clubmitglieder auch für Leser stärker werden, die nur das Abenteuer spielen.
 *
 * Rolle im Gesamtbild: Reine Funktionen; die Oberwelt ruft `mitAppWertung` beim Aufbau und
 * `nachStoryPartie` im Rückweg (regeln/rueckweg.ts). Die Elo-Formel ist die der App
 * (spiel/wertung.ts: Erwartung, K = 32 in den ersten zehn Partien, dann 20).
 * Beispiel: A = 800, Sieg gegen Z = 1020 (Erwartung 0,22) → A = 800 + 32 · 0,78 = 825.
 * Sonderfälle: A sinkt nie unter 100; abgebrochene Partien und Partien mit mittlerer oder starker
 * Karte zählen nicht (R38); bis zehn Partien gezählt sind, ist E = A (R3).
 */
import { K_ANFANG, K_DANACH, erwartung } from "../../spiel/wertung";
import type { Kartenspiel } from "../schnittstelle/karten";
import type { Ausgang, Partieauftrag } from "../schnittstelle/partie";
import type { Abenteuerstand } from "../schnittstelle/spielstand";
import { EINGANG_PARTIEN } from "./spielstand";

/** Unter diesen Wert fällt A nie (R2). */
export const A_MIN = 100;
/** So viele für A gezählte Partien rechnen mit dem großen K (R2). */
const PARTIEN_MIT_GROSSEM_K = 10;

/**
 * Überträgt die Änderung der App-Wertung auf A (R2). Beim ersten Lesen einer App-Wertung ohne
 * gezählte Story-Partien übernimmt A sie ganz. Ohne App-Wertung bleibt alles.
 */
export function mitAppWertung(stand: Abenteuerstand, appWertung: number | null): Abenteuerstand {
  if (appWertung === null || appWertung === stand.appWertungZuletzt) return stand;
  const wertung =
    stand.appWertungZuletzt === null
      ? stand.wertungPartien === 0
        ? appWertung
        : stand.wertung
      : stand.wertung + (appWertung - stand.appWertungZuletzt);
  const neu = Math.max(A_MIN, Math.round(wertung));
  // Solange E noch läuft (R3), folgt E dem neuen A (Hinweis von mittel-2, vierter Bericht).
  const eingangLaeuft = stand.eingangPartien < EINGANG_PARTIEN;
  return {
    ...stand,
    wertung: neu,
    appWertungZuletzt: appWertung,
    eingangswertung: eingangLaeuft ? neu : stand.eingangswertung,
  };
}

/** Zählt diese Partie nach R38 für A: ganze Partie aus der Grundstellung, zählt für die App. */
export function zaehltFuerA(
  auftrag: Pick<Partieauftrag, "format" | "startstellung" | "zaehltFuerApp">,
): boolean {
  return (
    auftrag.format.art === "partie" &&
    auftrag.startstellung.art === "grundstellung" &&
    auftrag.zaehltFuerApp
  );
}

/** Punkte für die Elo-Formel: Sieg 1, Remis ½, Niederlage 0; abgebrochen zählt nicht (null). */
function punkte(ausgang: Ausgang): number | null {
  if (ausgang === "sieg") return 1;
  if (ausgang === "remis") return 0.5;
  if (ausgang === "niederlage") return 0;
  return null;
}

/**
 * A nach einer Story-Partie (R2, R38): Elo-Schritt gegen die Zielstärke Z vor dem Zustandsfaktor;
 * nichts bei Abbruch oder mittlerer/starker Karte. Solange E noch läuft (R3), folgt E dem neuen A
 * und die Partie zählt für `eingangPartien`.
 */
export function nachStoryPartie(
  stand: Abenteuerstand,
  zielElo: number,
  ausgang: Ausgang,
  gespielteKarten: readonly Kartenspiel[],
): Abenteuerstand {
  const s = punkte(ausgang);
  if (s === null || gespielteKarten.some((k) => k.frei !== true && k.stufe !== "leicht"))
    return stand;
  const k = stand.wertungPartien < PARTIEN_MIT_GROSSEM_K ? K_ANFANG : K_DANACH;
  const wertung = Math.max(
    A_MIN,
    Math.round(stand.wertung + k * (s - erwartung(stand.wertung, zielElo))),
  );
  const eingangLaeuft = stand.eingangPartien < EINGANG_PARTIEN;
  return {
    ...stand,
    wertung,
    wertungPartien: stand.wertungPartien + 1,
    eingangswertung: eingangLaeuft ? wertung : stand.eingangswertung,
    eingangPartien: eingangLaeuft ? stand.eingangPartien + 1 : stand.eingangPartien,
  };
}
