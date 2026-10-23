/**
 * Zug erraten: eine Engine für zwei Aufgaben, den Vergleich nach einem verfehlten Zug (W12) und
 * den Bewertungsbalken am Brett (R45, live nach jedem Zug).
 *
 * Rolle im Gesamtbild: Der Engine-Dienst rechnet immer nur einen Auftrag; ein neuer bricht den
 * alten ab. Deshalb rechnet dieser Hook nacheinander: zuerst den Vergleich (falls ein Fehlversuch
 * offen ist), dann den Wert der gezeigten Stellung. Beides merkt er sich, damit Blättern durch
 * die Partie und der Analysemodus schon gerechnete Stellungen nicht noch einmal rechnen.
 * Abhängigkeiten: engine/engineDienst.ts, engine/spielbewerter.ts, spiel/auswertung.ts,
 * useRatevergleich (vergleicheZuege).
 */
import { useEffect, useState } from "react";
import { AuftragAbgebrochen, engine, VOLLE_STAERKE } from "../../engine/engineDienst";
import { wertFuer } from "../../engine/spielbewerter";
import { endwert } from "../../spiel/auswertung";
import type { Rateurteil } from "../../training/rateurteil";
import { vergleicheZuege, type Fehlversuch, type Vergleichsstand } from "./useRatevergleich";

/** Rechenzeit für den Balken: kurz, damit er beim Blättern und Analysieren rasch folgt. */
const BALKEN_RECHENZEIT_MS = 800;
/** Für den Balken reicht der beste Zug. */
const EINE_VARIANTE = 1;

export interface Zugerratenrechnung {
  readonly vergleich: Vergleichsstand | null;
  /** Wert der gezeigten Stellung aus Sicht von Weiß; bis er da ist, der zuletzt gerechnete. */
  readonly wert: number | null;
}

/** Der Wert einer Stellung für den Balken: Endstellung ohne Engine, sonst bester Zug. */
async function balkenwert(fen: string): Promise<number> {
  const ende = endwert(fen);
  if (ende !== null) return ende;
  const bewertung = await engine.bewerte(fen, BALKEN_RECHENZEIT_MS, EINE_VARIANTE, VOLLE_STAERKE);
  const beste = bewertung.varianten[0];
  return beste ? wertFuer(beste.wert, true) : 0;
}

/** Meldet einen Fehler der Engine, außer dem gewollten Abbruch durch einen neueren Auftrag. */
function melde(fehler: unknown): void {
  if (!(fehler instanceof AuftragAbgebrochen))
    console.error("Engine beim Zugerraten fehlgeschlagen:", fehler);
}

/**
 * Eingaben: der offene Fehlversuch (oder null) und die gezeigte Stellung.
 * Ausgabe: Stand des Vergleichs und Wert für den Balken.
 * Beispiel: Opernpartie nach 2. d4 statt 2. Sf3 → erst „rechnet“, dann „etwa gleich gut“, danach
 * der Balken für die Stellung nach 2. Sf3 d6.
 * Sonderfall: Schlägt der Vergleich fehl, steht er als „fertig“ ohne Urteil da; der Balken
 * rechnet trotzdem.
 */
export function useZugerratenEngine(versuch: Fehlversuch | null, fen: string): Zugerratenrechnung {
  const [urteile, setzeUrteile] = useState<ReadonlyMap<Fehlversuch, Rateurteil | null>>(
    () => new Map(),
  );
  const [werte, setzeWerte] = useState<ReadonlyMap<string, number>>(() => new Map());
  const [letzter, setzeLetzter] = useState<number | null>(null);
  useEffect(() => {
    let aktiv = true;
    if (versuch && !urteile.has(versuch)) {
      // Ohne Urteil (Fehler, Abbruch durch die Engine selbst) steht der Vergleich leer da.
      void vergleicheZuege(versuch)
        .catch((fehler: unknown) => {
          melde(fehler);
          return null;
        })
        .then((urteil) => {
          if (aktiv) setzeUrteile((alt) => new Map(alt).set(versuch, urteil));
        });
    } else if (!werte.has(fen)) {
      balkenwert(fen).then((wert) => {
        if (!aktiv) return;
        setzeWerte((alt) => new Map(alt).set(fen, wert));
        setzeLetzter(wert);
      }, melde);
    }
    return () => {
      aktiv = false;
    };
  }, [versuch, fen, urteile, werte]);
  const vergleich: Vergleichsstand | null = !versuch
    ? null
    : urteile.has(versuch)
      ? { art: "fertig", urteil: urteile.get(versuch) ?? null }
      : { art: "rechnet" };
  return { vergleich, wert: werte.get(fen) ?? letzter };
}
