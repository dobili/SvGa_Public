/**
 * Eine Aufgabe des Endspieltrainers gegen die Engine ausspielen: Züge, Engine-Antwort in voller
 * Stärke, Bewertung nach jedem Zug des Lesers, Ende der Aufgabe.
 *
 * Rolle im Gesamtbild: Trainer „endspiel“ (AP 13). Ist die Engine am Zug, rechnet sie mit voller
 * Stärke; derselbe Auftrag liefert den Wert der Stellung aus Sicht des Lesers: Fällt er unter
 * die Grenze (training/endspieltrainer.ts, gekippt), ist das Ziel verfehlt, und die Karte zeigt
 * den Zug, der es gehalten hätte (den besten Zug der vorigen Stellung). Ist der Leser am Zug,
 * rechnet die Engine kurz den besten Zug für die Hilfen. Partieende (Matt, Patt, Remis) erkennt
 * spiel/ergebnis.ts; eine Umwandlung bei Gewinnziel und gehaltener Stellung beendet die Aufgabe,
 * ebenso zwölf gehaltene eigene Züge bei Remisziel.
 * Abhängigkeiten: engine/engineDienst.ts, engine/spielbewerter.ts, training/endspieltrainer.ts,
 * spiel/ergebnis.ts, spiel/zuege.ts, schach/weiterspielen.ts, training/uebungsaufgabe.ts.
 */
import { useEffect, useMemo, useState } from "react";
import type { Endspielaufgabe } from "../../daten/trainerdaten";
import { AuftragAbgebrochen, engine, VOLLE_STAERKE } from "../../engine/engineDienst";
import { wertFuer } from "../../engine/spielbewerter";
import type { Rolle } from "../../schach/stellung";
import { spieleZug } from "../../schach/weiterspielen";
import { partieendeNach } from "../../spiel/ergebnis";
import { uciZuSan } from "../../spiel/zuege";
import {
  ergebnisAusEnde,
  gekippt,
  HALTEN_ZUEGE,
  istUmwandlung,
  type Endspielergebnis,
  type Massstab,
} from "../../training/endspieltrainer";
import { stellungNach } from "../../training/uebungsaufgabe";

/** Rechenzeit der Engine für ihren Zug (volle Stärke) und für den Hilfezug des Lesers. */
const ENGINE_MS = 1200;
const HILFE_MS = 700;
/** Nach einer Unterbrechung des Auftrags wartet die Aufgabe kurz und fragt noch einmal. */
const PAUSE_NACH_ABBRUCH_MS = 500;

export interface Endspielstand {
  readonly fen: string;
  readonly zuege: readonly string[];
  readonly leserAmZug: boolean;
  readonly engineDenkt: boolean;
  readonly ergebnis: Endspielergebnis | null;
  /** Bester Zug für den Leser in der aktuellen Stellung (UCI), sobald gerechnet. */
  readonly bester: string | null;
  readonly fehler: string | null;
  readonly spiele: (
    von: string,
    nach: string,
    umwandlung?: Rolle,
  ) => "gespielt" | "umwandlung" | "ungueltig";
  readonly gibAuf: () => void;
}

/** Alle Stellungen von der Ausgangsstellung bis jetzt. */
function stellungen(start: string, zuege: readonly string[]): string[] {
  return zuege.map((_, i) => stellungNach(start, zuege.slice(0, i + 1)));
}

/** Zahl der Züge des Lesers: jeder zweite ab dem ersten, wenn er begann. */
function leserzuege(aufgabe: Endspielaufgabe, zuege: readonly string[]): number {
  const leserBeginnt = aufgabe.fen.split(" ")[1] === aufgabe.leser;
  return zuege.filter((_, i) => (i % 2 === 0) === leserBeginnt).length;
}

/** Ergebnis nach dem Zug des Lesers aus dem Wert der Engine (aus Sicht des Lesers). */
function urteilNachLeserzug(
  aufgabe: Endspielaufgabe,
  massstab: Massstab,
  wertLeser: number,
  zuege: readonly string[],
  gehalten: string | null,
): Endspielergebnis | null {
  if (gekippt(aufgabe.ziel, wertLeser, massstab)) {
    return { art: "verfehlt", grund: "gekippt", gehalten };
  }
  if (aufgabe.ziel === "gewinn" && istUmwandlung(zuege[zuege.length - 1])) {
    return { art: "erreicht", grund: "umwandlung" };
  }
  if (aufgabe.ziel === "remis" && leserzuege(aufgabe, zuege) >= HALTEN_ZUEGE) {
    return { art: "erreicht", grund: "gehalten" };
  }
  return null;
}

/**
 * Spielt die Aufgabe. Eingaben: Aufgabe, Maßstab aus der Datei, Rückruf am Ende (einmal).
 * Beispiel: Abb. 8.56 (Dame gegen König): Der Leser zieht, die Engine antwortet, nach 3. Dg7#
 * meldet der Stand „erreicht, matt“.
 */
export function useEndspielpartie(
  aufgabe: Endspielaufgabe,
  massstab: Massstab,
  beiEnde: (ergebnis: Endspielergebnis) => void,
): Endspielstand {
  const [zuege, setzeZuege] = useState<readonly string[]>([]);
  const [ergebnis, setzeErgebnis] = useState<Endspielergebnis | null>(null);
  const [bester, setzeBester] = useState<string | null>(null);
  const [gehalten, setzeGehalten] = useState<string | null>(null);
  const [fehler, setzeFehler] = useState<string | null>(null);
  const [versuch, setzeVersuch] = useState(0);
  const fen = useMemo(() => stellungNach(aufgabe.fen, zuege), [aufgabe.fen, zuege]);
  const weissAmZug = fen.split(" ")[1] !== "b";
  const leserAmZug = (weissAmZug ? "w" : "b") === aufgabe.leser;
  const beende = (neu: Endspielergebnis) => {
    setzeErgebnis(neu);
    beiEnde(neu);
  };
  /** Trägt einen Zug ein und prüft das Partieende (Matt, Patt, Remis). */
  const nachZug = (neu: readonly string[]) => {
    setzeZuege(neu);
    const alle = [aufgabe.fen, ...stellungen(aufgabe.fen, neu)];
    const ende = ergebnisAusEnde(aufgabe.ziel, aufgabe.leser, partieendeNach(alle));
    if (ende) beende(ende);
  };

  useEffect(() => {
    if (ergebnis) return;
    let aktiv = true;
    const zeit = leserAmZug ? HILFE_MS : ENGINE_MS;
    engine
      .bewerte(fen, zeit, 1, VOLLE_STAERKE)
      .then((bewertung) => {
        if (!aktiv) return;
        const uci = bewertung.besterZug;
        const variante = bewertung.varianten[0];
        if (leserAmZug) {
          setzeBester(uci);
          return;
        }
        if (!uci || !variante) throw new Error(`Kein Zug der Engine in ${fen}`);
        const wertLeser = -wertFuer(variante.wert, weissAmZug);
        const urteil = urteilNachLeserzug(aufgabe, massstab, wertLeser, zuege, gehalten);
        if (urteil) {
          beende(urteil);
          return;
        }
        const san = uciZuSan(fen, uci);
        if (!san) throw new Error(`Zug der Engine nicht lesbar: ${uci}`);
        nachZug([...zuege, san]);
      })
      .catch((grund: unknown) => {
        if (!aktiv) return;
        if (grund instanceof AuftragAbgebrochen) {
          window.setTimeout(() => setzeVersuch((v) => v + 1), PAUSE_NACH_ABBRUCH_MS);
          return;
        }
        console.error("Endspieltrainer: Engine fehlgeschlagen:", grund);
        setzeFehler(grund instanceof Error ? grund.message : String(grund));
      });
    return () => {
      aktiv = false;
    };
    // Maßgeblich sind Stellung und Ergebnis; die übrigen Werte ändern sich nur mit ihnen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fen, ergebnis, versuch]);

  const spiele = (von: string, nach: string, umwandlung?: Rolle) => {
    if (!leserAmZug || ergebnis) return "ungueltig" as const;
    const versuchZug = spieleZug(fen, von, nach, umwandlung);
    if (versuchZug.art !== "gespielt") return versuchZug.art;
    setzeGehalten(bester ? uciZuSan(fen, bester) : null);
    setzeBester(null);
    nachZug([...zuege, versuchZug.san]);
    return "gespielt" as const;
  };
  const gibAuf = () => {
    if (ergebnis) return;
    beende({
      art: "verfehlt",
      grund: "aufgegeben",
      gehalten: leserAmZug && bester ? uciZuSan(fen, bester) : gehalten,
    });
  };
  return {
    fen,
    zuege,
    leserAmZug,
    engineDenkt: !leserAmZug && !ergebnis,
    ergebnis,
    bester: leserAmZug ? bester : null,
    fehler,
    spiele,
    gibAuf,
  };
}
