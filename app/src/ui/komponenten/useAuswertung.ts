/**
 * Wertet eine beendete Partie im Hintergrund aus: jede Stellung kurz mit der Engine bewerten.
 *
 * Rolle im Gesamtbild: Konzept 8.3 „Auswertung: Bewertung jeder Stellung im Hintergrund“. Das
 * Ergebnis (Wert, bester Zug und seit 0.2.39 der Abstand zum zweitbesten Zug je Stellung) kommt
 * in den Speicher (speicher/partien.ts, mitWerten), damit die Auswertung nur einmal läuft. Verlässt der Leser den Bildschirm vorher,
 * beginnt sie beim nächsten Öffnen neu. Endstellungen (Matt, Patt) brauchen keine Engine.
 * Abhängigkeiten: engine/engineDienst.ts, engine/zugwahl.ts (wertFuer), spiel/, speicher/.
 */
import { useEffect, useState } from "react";
import { AuftragAbgebrochen, engine } from "../../engine/engineDienst";
import { wertFuer } from "../../engine/spielbewerter";
import { endwert } from "../../spiel/auswertung";
import { stellungen } from "../../spiel/partie";
import { mitWerten, type Partieeintrag } from "../../speicher/partien";
import { aendere } from "../../speicher/speicher";

/** Rechenzeit je Stellung: 40 Züge brauchen so etwa 40 Sekunden. */
const RECHENZEIT_MS = 500;
/** Zwei Varianten: die beste und die zweitbeste, für das „!“ des einzigen guten Zuges. */
const VARIANTEN = 2;

export type Auswertungsstand =
  | { readonly art: "fertig" }
  | { readonly art: "laeuft"; readonly erledigt: number; readonly gesamt: number }
  | { readonly art: "fehler"; readonly meldung: string };

/** Das Ergebnis für eine Stellung: Wert aus Sicht von Weiß, bester Zug, Abstand zum zweitbesten. */
interface Stellungswert {
  readonly wert: number;
  readonly bester: string;
  readonly abstand: number;
}

/**
 * Wert (aus Sicht von Weiß), bester Zug und Abstand zum zweitbesten Zug einer Stellung.
 *
 * Sonderfall: Unterbricht ein anderer Auftrag die Engine (ein Werkzeug am Brett, ein Hinweis),
 * wird dieselbe Stellung noch einmal bewertet, solange die Auswertung läuft; sonst bliebe sie
 * bei „läuft“ stehen.
 */
async function bewerteStellung(fen: string, laeuft: () => boolean): Promise<Stellungswert | null> {
  const ende = endwert(fen);
  if (ende !== null) return { wert: ende, bester: "", abstand: 0 };
  while (laeuft()) {
    try {
      const bewertung = await engine.bewerte(fen, RECHENZEIT_MS, VARIANTEN);
      const [erste, zweite] = bewertung.varianten;
      const weissAmZug = fen.split(" ")[1] !== "b";
      const abstand =
        erste && zweite ? wertFuer(erste.wert, weissAmZug) - wertFuer(zweite.wert, weissAmZug) : 0;
      return {
        wert: erste ? wertFuer(erste.wert, true) : 0,
        bester: bewertung.besterZug ?? "",
        abstand: Math.max(0, abstand),
      };
    } catch (grund: unknown) {
      if (!(grund instanceof AuftragAbgebrochen)) throw grund;
    }
  }
  return null;
}

/**
 * Startet die Auswertung, wenn sie fehlt. Ausgabe: Stand mit Fortschritt für die Anzeige.
 * Beispiel: eine beendete Partie mit 20 Halbzügen → „läuft 0 von 21“ … „fertig“.
 */
export function useAuswertung(eintrag: Partieeintrag | null): Auswertungsstand {
  const fehlt = eintrag !== null && eintrag.werte.length === 0;
  const id = eintrag?.partie.id ?? "";
  const [stand, setzeStand] = useState<Auswertungsstand>({ art: "fertig" });
  useEffect(() => {
    if (!fehlt || !eintrag) return;
    let aktiv = true;
    const alle = stellungen(eintrag.partie);
    const werte: number[] = [];
    const beste: string[] = [];
    const abstaende: number[] = [];
    const weiter = async () => {
      for (const fen of alle) {
        if (!aktiv) return;
        setzeStand({ art: "laeuft", erledigt: werte.length, gesamt: alle.length });
        const ergebnis = await bewerteStellung(fen, () => aktiv);
        if (!ergebnis) return;
        werte.push(ergebnis.wert);
        beste.push(ergebnis.bester);
        abstaende.push(ergebnis.abstand);
      }
      if (aktiv) {
        void aendere((d) => ({ ...d, spiel: mitWerten(d.spiel, id, werte, beste, abstaende) }));
      }
    };
    weiter().catch((grund: unknown) => {
      if (!aktiv) return;
      console.error("Auswertung fehlgeschlagen:", grund);
      setzeStand({
        art: "fehler",
        meldung: grund instanceof Error ? grund.message : String(grund),
      });
    });
    return () => {
      aktiv = false;
    };
    // Die Partie ändert sich nach dem Ende nicht mehr; die Kennung genügt als Auslöser.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, fehlt]);
  if (!fehlt) return { art: "fertig" };
  // Vor dem ersten Schritt der Auswertung: schon als „läuft“ zeigen.
  return stand.art === "fertig" ? { art: "laeuft", erledigt: 0, gesamt: 1 } : stand;
}
