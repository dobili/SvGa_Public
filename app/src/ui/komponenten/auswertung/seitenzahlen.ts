/**
 * Die Kennzahlen einer ausgewerteten Partie je Seite, einmal gerechnet für die ganze Auswertung.
 *
 * Rolle im Gesamtbild: Seit der Zeitleiste (Entwurf F2, 31.10.2026) brauchen mehrere Teile
 * dieselben Zahlen: die Kopfzeile (Genauigkeit des Lesers), die Zeitleiste (Prozent je Phase)
 * und „In Zahlen“ (Ring, Balken, Zugklassen). Vorher rechnete Spielstaerke.tsx sie allein. Die
 * Rechnungen selbst stehen unverändert in spiel/genauigkeit.ts; die Genauigkeit ist die von
 * Lichess, die Spielstärke kommt aus dem Elo-Modell der Zeitklasse (Entscheidung des Autors,
 * 23.10.2026).
 * Abhängigkeiten: spiel/genauigkeit.ts, spiel/elomodell.ts, spiel/taktik.ts, spiel/wertung.ts,
 * engine/botstaerke.ts, speicher/.
 */
import type { Color } from "chessops/types";
import { useMemo } from "react";
import { gegnerstaerke } from "../../../engine/botstaerke";
import type { Zugurteil } from "../../../spiel/auswertung";
import { wertungstempo } from "../../../spiel/elomodell";
import type { Wertungstempo } from "../../../spiel/elomodell-daten";
import {
  spielstaerke,
  spielstaerkeImMittelspiel,
  spielstaerkeJePhase,
  type Seitenbilanz,
} from "../../../spiel/genauigkeit";
import { stellungen, type Partie } from "../../../spiel/partie";
import type { Phase } from "../../../spiel/phasen";
import { zugartJeStellung } from "../../../spiel/taktik";
import { staerkeLetzterPartien } from "../../../spiel/wertung";
import { sanZuUci } from "../../../spiel/zuege";
import type { Partieeintrag } from "../../../speicher/partien";
import { useSpeicher } from "../../../speicher/speicher";
import type { Balkenzeile } from "./Genauigkeitsbalken";

/** Ohne jede Schätzung vergleicht „Deine Züge“ mit dieser Stärke (Einsteiger mit Erfahrung). */
const VERGLEICH_OHNE_SCHAETZUNG = 1200;

/** Die Zahlen einer Seite. */
export interface Seitenzahlen {
  /** Gesamtbilanz: Genauigkeit, Schätzung, Zugklassen. */
  readonly b: Seitenbilanz;
  /** Bilanz je Phase (für die Zeitleiste und die Balken). */
  readonly jePhase: Readonly<Record<Phase, Seitenbilanz>>;
  /** Die fünf Balken: drei Phasen, Strategie, Taktik. */
  readonly zeilen: readonly Balkenzeile[];
  /** Mit dieser Stärke vergleicht „Deine Züge“. */
  readonly elo: number;
  readonly tempo: Wertungstempo;
}

/** Was die Rechnung braucht. */
export interface Zahlengrund {
  /** Der Eintrag der Partie; null, solange er nicht geladen ist. */
  readonly eintrag: Partieeintrag | null;
  readonly urteile: readonly Zugurteil[];
  readonly phasen: readonly Phase[];
}

/**
 * Mit welcher Stärke werden die Zugklassen verglichen? Für den Leser mit „Deine Spielstärke“
 * (letzte zehn gewertete Partien), sonst mit der Schätzung dieser Partie; für die Engine mit der
 * festen Zahl des Bots. Nicht die Schätzung der Partie zuerst: Eine schwache Partie würde sich
 * sonst mit schwachen Spielern vergleichen und „normal“ aussehen.
 */
function vergleichsElo(
  partie: Partie,
  seite: Color,
  b: Seitenbilanz,
  eigeneStaerke: number | null,
): number {
  const ausPartie = b.schaetzung?.mitte ?? VERGLEICH_OHNE_SCHAETZUNG;
  if (seite === partie.einstellung.eigeneFarbe) return eigeneStaerke ?? ausPartie;
  return partie.einstellung.gegner === "engine" ? gegnerstaerke(partie.einstellung) : ausPartie;
}

/** Rechnet die Bilanzen beider Seiten (ohne Vergleichsstärke). */
function rechne(
  eintrag: Partieeintrag,
  urteile: readonly Zugurteil[],
  phasen: readonly Phase[],
  tempo: Wertungstempo,
) {
  const partie = eintrag.partie;
  const alle = stellungen(partie);
  const gespielte = partie.zuege.map((zug, index) => sanZuUci(alle[index] ?? "", zug.san));
  const args = [partie, eintrag.werte, urteile, eintrag.beste, gespielte] as const;
  return {
    gesamt: spielstaerke(...args, tempo, phasen),
    jePhase: spielstaerkeJePhase(...args, phasen, tempo),
    mitte: spielstaerkeImMittelspiel(...args, phasen, zugartJeStellung(partie), tempo),
  };
}

/**
 * Die Zahlen beider Seiten; null vor der Auswertung (ohne Urteile).
 * Beispiel: Partie gegen Derya, Leser Weiß → white.b.genauigkeit 78, white.jePhase.eroeffnung …
 */
export function useSeitenzahlen(grund: Zahlengrund): Readonly<Record<Color, Seitenzahlen>> | null {
  const { eintrag, urteile, phasen } = grund;
  const uhr = eintrag?.partie.einstellung.uhr ?? null;
  const tempo = wertungstempo(uhr);
  const partien = useSpeicher((z) => z.daten.spiel.partien);
  // Vergleichsstärke der Zugklassen: „Deine Spielstärke“ in der Zeitklasse dieser Partie.
  const eigeneStaerke = useMemo(
    () => staerkeLetzterPartien(partien, tempo)?.mitte ?? null,
    [partien, tempo],
  );
  const roh = useMemo(
    () => (eintrag && urteile.length > 0 ? rechne(eintrag, urteile, phasen, tempo) : null),
    [eintrag, urteile, phasen, tempo],
  );
  if (!roh || !eintrag) return null;
  const partie = eintrag.partie;
  const fuer = (seite: Color): Seitenzahlen => {
    const b = roh.gesamt[seite];
    const jePhase = {
      eroeffnung: roh.jePhase.eroeffnung[seite],
      mittelspiel: roh.jePhase.mittelspiel[seite],
      endspiel: roh.jePhase.endspiel[seite],
    };
    const zeilen: readonly Balkenzeile[] = [
      { art: "eroeffnung", b: jePhase.eroeffnung },
      { art: "mittelspiel", b: jePhase.mittelspiel },
      { art: "endspiel", b: jePhase.endspiel },
      { art: "strategie", b: roh.mitte.strategie[seite] },
      { art: "taktik", b: roh.mitte.taktik[seite] },
    ];
    return { b, jePhase, zeilen, elo: vergleichsElo(partie, seite, b, eigeneStaerke), tempo };
  };
  return { white: fuer("white"), black: fuer("black") };
}
