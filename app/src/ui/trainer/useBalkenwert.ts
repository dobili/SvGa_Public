/**
 * Wert einer Stellung für den Bewertungsbalken in den Trainern, mit Zwischenspeicher.
 *
 * Rolle im Gesamtbild: Baustein „Fortsetzung durchspielen mit Balken“ (Nebenchat, 30.10.2026,
 * Regel E: der Balken nach der Entscheidung, live beim Durchspielen). Rechnet wie der Balken im
 * Zug-erraten-Trainer (800 ms, beste Variante, Endstellungen ohne Engine); der dortige Hook
 * gehört zu einem gesperrten Bereich, deshalb hier eine eigene, gleich gebaute Rechnung.
 * Abhängigkeiten: engine/engineDienst.ts und engine/spielbewerter.ts (nur aufgerufen),
 * spiel/auswertung.ts (endwert), React.
 */
import { useEffect, useState } from "react";
import { AuftragAbgebrochen, engine, VOLLE_STAERKE } from "../../engine/engineDienst";
import { wertFuer } from "../../engine/spielbewerter";
import { endwert } from "../../spiel/auswertung";

/** Rechenzeit je Stellung: kurz, damit der Balken beim Durchspielen rasch folgt. */
const BALKEN_RECHENZEIT_MS = 800;
const EINE_VARIANTE = 1;

/** Gerechnete Werte (aus Sicht von Weiß) je FEN, für die ganze Sitzung (nicht gespeichert). */
const zwischenspeicher = new Map<string, number>();

/** Der Wert einer Stellung aus Sicht von Weiß: Endstellung ohne Engine, sonst bester Zug. */
export async function balkenwert(fen: string): Promise<number> {
  const bekannt = zwischenspeicher.get(fen);
  if (bekannt !== undefined) return bekannt;
  const ende = endwert(fen);
  if (ende !== null) return ende;
  const bewertung = await engine.bewerte(fen, BALKEN_RECHENZEIT_MS, EINE_VARIANTE, VOLLE_STAERKE);
  const beste = bewertung.varianten[0];
  const wert = beste ? wertFuer(beste.wert, true) : 0;
  zwischenspeicher.set(fen, wert);
  return wert;
}

/**
 * Der Balkenwert der gezeigten Stellung; bis er da ist, der zuletzt gerechnete (der Balken
 * springt dann nicht auf null). Beispiel: Fortsetzung durchblättern → der Balken folgt Zug um Zug.
 */
export function useBalkenwert(fen: string): number | null {
  const [werte, setzeWerte] = useState<ReadonlyMap<string, number>>(() => new Map());
  const [letzter, setzeLetzter] = useState<number | null>(null);
  useEffect(() => {
    if (werte.has(fen)) return undefined;
    let aktiv = true;
    balkenwert(fen)
      .then((wert) => {
        if (!aktiv) return;
        setzeWerte((alt) => new Map(alt).set(fen, wert));
        setzeLetzter(wert);
      })
      .catch((fehler: unknown) => {
        if (!(fehler instanceof AuftragAbgebrochen))
          console.error("Balkenwert im Trainer fehlgeschlagen:", fehler);
      });
    return () => {
      aktiv = false;
    };
  }, [fen, werte]);
  return werte.get(fen) ?? letzter;
}
