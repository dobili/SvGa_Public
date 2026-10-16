/**
 * Rechnet auf Wunsch das Urteil der Engine über den letzten Zug (Engine-Karte, seit 0.2.31).
 *
 * Rolle im Gesamtbild: Die Engine-Karte bewertet zuerst die gezeigte Stellung. Erst wenn der
 * Leser „Letzten Zug bewerten“ wählt und diese Bewertung fertig ist, rechnet die Engine die
 * Stellung vor dem Zug (nacheinander, denn es gibt nur eine Engine). Das Urteil selbst kommt aus
 * engine/letzterzug.ts.
 * Abhängigkeiten: engine/engineDienst.ts, engine/letzterzug.ts, React.
 */
import { useEffect, useState } from "react";
import type { Markierung, Markierungsfarbe } from "../../analyse/werkzeug";
import { AuftragAbgebrochen, engine, type Bewertung } from "../../engine/engineDienst";
import {
  urteilUeberLetztenZug,
  wertNachDemZug,
  type LetzterZug,
  type LetzterZugUrteil,
  type Letztzeichen,
} from "../../engine/letzterzug";

/** Länge eines Feldes in UCI („e4“); das Zielfeld steht an zweiter Stelle. */
const FELD_LAENGE = 2;

/** Farbe des Zeichens am Brett: rot bei Fehlern, grau bei Ungenauigkeit, gold beim „!“. */
const ZEICHENFARBE: Readonly<Record<Letztzeichen, Markierungsfarbe>> = {
  "??": "rot",
  "?": "rot",
  "?!": "grau",
  "!": "gold",
};

/**
 * Das Zeichen des letzten Zuges als Beschriftung an seinem Zielfeld, dazu ein goldener Pfeil für
 * den besten Zug der Engine, wenn der gespielte es nicht war (Wunsch des Autors, Test von 0.2.31).
 * Beispiel: 6. Ld3?! → graues Feld d3 mit „?!“ und goldener Pfeil a2–a3 (6. a3 war besser).
 * Sonderfall: Der Pfeil startet in der Stellung vor dem Zug; steht dort jetzt eine andere Figur,
 * zeigt er trotzdem den Weg, den der bessere Zug genommen hätte.
 */
export function urteilsmarkierung(
  urteil: LetzterZugUrteil | null,
  letzterZug: LetzterZug,
): Markierung[] {
  if (!urteil) return [];
  const markierungen: Markierung[] = [];
  if (urteil.zeichen) {
    const feld = letzterZug.uci.slice(FELD_LAENGE, FELD_LAENGE * 2);
    markierungen.push({
      typ: "feld",
      farbe: ZEICHENFARBE[urteil.zeichen],
      feld,
      text: urteil.zeichen,
    });
  }
  if (urteil.besterZug && !urteil.warBester) {
    const von = urteil.besterZug.slice(0, FELD_LAENGE);
    const nach = urteil.besterZug.slice(FELD_LAENGE, FELD_LAENGE * 2);
    markierungen.push({ typ: "pfeil", farbe: "gold", von, nach });
  }
  return markierungen;
}

export type Urteilstand =
  | { readonly art: "aus" }
  | { readonly art: "rechnet" }
  | { readonly art: "fertig"; readonly urteil: LetzterZugUrteil | null }
  | { readonly art: "fehler"; readonly meldung: string };

/**
 * Eingaben: der letzte Zug (oder null; das Objekt muss je Stellung gleich bleiben, sonst rechnet
 * die Engine bei jedem Zeichnen neu), ob das Urteil gewünscht ist, die fertige Bewertung der
 * gezeigten Stellung (oder null, solange sie rechnet) und deren FEN.
 * Ausgabe: Stand des Urteils. Beispiel: Abb. 1.26, gewünscht → „rechnet“, dann 5... Db6 ohne
 * Zeichen, wenn die Engine Db6 selbst spielt.
 */
export function useZugurteil(
  letzterZug: LetzterZug | null,
  gewuenscht: boolean,
  jetzt: Bewertung | null,
  fen: string,
): Urteilstand {
  // Das Ergebnis gilt nur für den Auftrag, für den es gerechnet wurde (Schlüssel).
  const [ergebnis, setzeErgebnis] = useState<{ schluessel: string; stand: Urteilstand } | null>(
    null,
  );
  const bereit = gewuenscht && letzterZug !== null && jetzt !== null;
  const schluessel = letzterZug ? `${letzterZug.vorherFen}|${letzterZug.uci}|${fen}` : "";
  useEffect(() => {
    if (!bereit || !letzterZug || !jetzt) return undefined;
    let aktiv = true;
    const weissZog = letzterZug.vorherFen.split(" ")[1] !== "b";
    engine
      .bewerte(letzterZug.vorherFen)
      .then((vorher) => {
        if (!aktiv) return;
        const danach = wertNachDemZug(jetzt.varianten, fen);
        const urteil = urteilUeberLetztenZug(vorher.varianten, danach, letzterZug.uci, weissZog);
        setzeErgebnis({ schluessel, stand: { art: "fertig", urteil } });
      })
      .catch((fehler: unknown) => {
        if (!aktiv || fehler instanceof AuftragAbgebrochen) return;
        console.error("Bewertung des letzten Zuges fehlgeschlagen:", fehler);
        const meldung = fehler instanceof Error ? fehler.message : String(fehler);
        setzeErgebnis({ schluessel, stand: { art: "fehler", meldung } });
      });
    return () => {
      aktiv = false;
    };
  }, [bereit, letzterZug, jetzt, fen, schluessel]);
  if (!gewuenscht) return { art: "aus" };
  return bereit && ergebnis?.schluessel === schluessel ? ergebnis.stand : { art: "rechnet" };
}
