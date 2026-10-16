/**
 * Zustand der Werkzeugwahl auf dem Abbildung-Bildschirm: gewähltes Bündel und Werkzeug, und ob
 * frühere oder spätere Bündel zugeschaltet sind.
 *
 * Rolle im Gesamtbild: Werkzeug-Umbau 0.2.30. Bündel stehen in der Leiste unter dem Brett,
 * einzelne Werkzeuge als Symbole am Brett (werkzeugordnung.ts). Für die Rechnung zählt nur das
 * gewählte Werkzeug (`wahl`); das Bündel bestimmt die Reiter in der Karte.
 * Verhalten (Entscheidungen des Autors nach den Tests von 0.2.27 bis 0.2.30):
 * - Anfangs ist nichts gewählt; das Brett zeigt die Markierungen des Buches.
 * - Ein zweites Tippen auf das gewählte Bündel oder Symbol wählt es ab, bei allen Werkzeugen.
 *   Seit 0.2.31 erklären sich Zählen und Ziehen nicht mehr beim zweiten Tippen, sondern mit einer
 *   eigenen Kachel, solange sie gewählt sind (Erklaerkarte.tsx).
 * Abhängigkeiten: werkzeugordnung.ts, React.
 */
import { useCallback, useState } from "react";
import type { Werkzeugwahl } from "./Werkzeugleiste";
import { ersterTeil, type Buendelkennung } from "./werkzeugordnung";

interface Auswahl {
  /** Das Bündel in der Leiste, oder null bei einem Symbol am Brett und ohne Wahl. */
  readonly buendel: Buendelkennung | null;
  readonly wahl: Werkzeugwahl | null;
}

const NICHTS: Auswahl = { buendel: null, wahl: null };

export interface Werkzeugwahlstand {
  readonly wahl: Werkzeugwahl | null;
  readonly buendel: Buendelkennung | null;
  readonly frueher: boolean;
  readonly spaeter: boolean;
  readonly tippeBuendel: (kennung: Buendelkennung) => void;
  readonly tippeTeil: (wahl: Werkzeugwahl) => void;
  readonly tippeSymbol: (wahl: Werkzeugwahl) => void;
  /** Für die Brettbedienung: Ein Tipp aufs Feld mit einem anderen Werkzeug wählt „Zählen“. */
  readonly setzeWahl: (wahl: Werkzeugwahl) => void;
  readonly abwaehlen: () => void;
  readonly schalteFrueher: () => void;
  readonly schalteSpaeter: () => void;
}

/**
 * Verwaltet die Wahl für eine Abbildung eines Kapitels.
 *
 * Beispiel: Kapitel 3, Tipp auf „Eröffnung prüfen“ → Faktorenbilanz gewählt; nochmals Tippen →
 * nichts gewählt. Ebenso das Symbol „Ziehen“ am Brett.
 * Eingabe ``beiAbwahl``: was zusätzlich geschieht, wenn abgewählt wird (Zählfeld vergessen).
 */
export function useWerkzeugwahl(kapitel: number, beiAbwahl: () => void): Werkzeugwahlstand {
  const [auswahl, setzeAuswahl] = useState<Auswahl>(NICHTS);
  const [frueher, setzeFrueher] = useState(false);
  const [spaeter, setzeSpaeter] = useState(false);

  const abwaehlen = useCallback(() => {
    beiAbwahl();
    setzeAuswahl(NICHTS);
  }, [beiAbwahl]);

  const tippeBuendel = (kennung: Buendelkennung) => {
    if (auswahl.buendel === kennung) abwaehlen();
    else setzeAuswahl({ buendel: kennung, wahl: ersterTeil(kennung, kapitel) });
  };
  const tippeSymbol = (wahl: Werkzeugwahl) => {
    if (auswahl.buendel === null && auswahl.wahl === wahl) abwaehlen();
    else setzeAuswahl({ buendel: null, wahl });
  };

  return {
    wahl: auswahl.wahl,
    buendel: auswahl.buendel,
    frueher,
    spaeter,
    tippeBuendel,
    tippeTeil: (wahl) => setzeAuswahl({ buendel: auswahl.buendel, wahl }),
    tippeSymbol,
    setzeWahl: (wahl) => setzeAuswahl({ buendel: null, wahl }),
    abwaehlen,
    schalteFrueher: () => setzeFrueher(!frueher),
    schalteSpaeter: () => setzeSpaeter(!spaeter),
  };
}
