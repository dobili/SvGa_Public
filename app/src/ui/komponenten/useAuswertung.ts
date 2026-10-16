/**
 * Wertet eine beendete Partie im Hintergrund aus: jede Stellung kurz mit der Engine bewerten.
 *
 * Rolle im Gesamtbild: Konzept 8.3 „Auswertung: Bewertung jeder Stellung im Hintergrund“. Das
 * Ergebnis (Wert und bester Zug je Stellung) kommt in den Speicher (speicher/partien.ts,
 * mitWerten), damit die Auswertung nur einmal läuft. Verlässt der Leser den Bildschirm vorher,
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

export type Auswertungsstand =
  | { readonly art: "fertig" }
  | { readonly art: "laeuft"; readonly erledigt: number; readonly gesamt: number }
  | { readonly art: "fehler"; readonly meldung: string };

/** Wert (aus Sicht von Weiß) und bester Zug einer Stellung. */
async function bewerteStellung(fen: string): Promise<{ wert: number; bester: string }> {
  const ende = endwert(fen);
  if (ende !== null) return { wert: ende, bester: "" };
  const bewertung = await engine.bewerte(fen, RECHENZEIT_MS, 1);
  const wert = bewertung.varianten[0]?.wert;
  return { wert: wert ? wertFuer(wert, true) : 0, bester: bewertung.besterZug ?? "" };
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
    const weiter = async () => {
      for (const fen of alle) {
        if (!aktiv) return;
        setzeStand({ art: "laeuft", erledigt: werte.length, gesamt: alle.length });
        const { wert, bester } = await bewerteStellung(fen);
        werte.push(wert);
        beste.push(bester);
      }
      if (aktiv) void aendere((d) => ({ ...d, spiel: mitWerten(d.spiel, id, werte, beste) }));
    };
    weiter().catch((grund: unknown) => {
      if (!aktiv || grund instanceof AuftragAbgebrochen) return;
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
