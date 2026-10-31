/**
 * Hook: die Vorschläge der Karte „Schnell eine Partie“ aus den Daten des Lesers und die Stelle,
 * an der „Anderer Vorschlag“ gerade steht.
 *
 * Rolle im Gesamtbild: Verbindet die reine Regel (vorschlag.ts) mit dem Speicher: Wertung je
 * Zeitklasse wie im Profil (wertung/wertungskacheln.ts, mit Schätzung für Zeitklassen ohne eigene
 * Partie), besiegte Bots, eigene Gegner und die Vorbelegung (Revanche, Rivale, Ziel).
 * Abhängigkeiten: vorschlag.ts, wertung/wertungskacheln.ts, spiel/elomodell.ts, speicher.
 */
import { useMemo, useState } from "react";
import { wertungstempo, type Wertungstempo } from "../../../spiel/elomodell";
import { useSpeicher } from "../../../speicher/speicher";
import { wertungskacheln } from "../wertung/wertungskacheln";
import { vorschlaege, vorschlagAn, type Vorschlag } from "./vorschlag";
import { wirksameUhr } from "./uhrwahl";

/** Ergebnis des Hooks. */
export interface Vorschlagsstand {
  /** Der aktuelle Vorschlag; null nur, wenn es keinen Bot gibt. */
  readonly vorschlag: Vorschlag | null;
  /** Wertung des Lesers in der Zeitklasse (null ohne gewertete Partie). */
  readonly staerke: number | null;
  readonly tempo: Wertungstempo;
  /** Mehr als ein Vorschlag da? Dann gibt es „Anderer Vorschlag“. */
  readonly mehrere: boolean;
  readonly naechster: () => void;
}

/**
 * Der Hook. `vorbelegt`: Bot einer Vorbelegung oder null; `fen` für die wirksame Uhr.
 * Beispiel: Wertung 640 in Schnellschach, 10 + 0 gewählt → ein Bot um 640, „etwa so stark wie du“.
 */
export function useVorschlaege(vorbelegt: string | null, fen: string): Vorschlagsstand {
  const spiel = useSpeicher((z) => z.daten.spiel);
  const tempo = wertungstempo(wirksameUhr(fen, spiel.vorlieben.uhr));
  const staerke = useMemo(
    () => wertungskacheln(spiel.wertung).find((k) => k.tempo === tempo)?.wert ?? null,
    [spiel.wertung, tempo],
  );
  const liste = useMemo(
    () =>
      vorschlaege({
        vorbelegt,
        staerke,
        tempo,
        besiegt: spiel.besiegt[tempo],
        eigene: spiel.eigeneGegner,
      }),
    [vorbelegt, staerke, tempo, spiel.besiegt, spiel.eigeneGegner],
  );
  // Die Stelle gilt für eine Vorbelegung; kommt eine neue, beginnt sie wieder vorn.
  const [stelle, setzeStelle] = useState({ fuer: vorbelegt, wert: 0 });
  const wert = stelle.fuer === vorbelegt ? stelle.wert : 0;
  return {
    vorschlag: vorschlagAn(liste, wert),
    staerke,
    tempo,
    mehrere: liste.length > 1,
    naechster: () => setzeStelle({ fuer: vorbelegt, wert: wert + 1 }),
  };
}
