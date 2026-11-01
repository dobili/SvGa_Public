/**
 * Die Analyse am Bildschirm „Variante“: starten, abbrechen, Fortschritt, Zugarten je Zug und die
 * drei Schalter „Symbole“, „Balken“, „Engine-Pfeil“.
 *
 * Rolle im Gesamtbild: Variationsbrowser, Stufe 3 (Entscheidung f = A des Autors, 1.11.2026). Der
 * Knopf „Analyse“ setzt in der Variante das Feld „analysiert“ (Format 8: „Analyse gewünscht“);
 * solange es gesetzt ist, fordert dieser Hook für jede Stellung ohne Wert die Engine an
 * (variantenanalyse.ts). So rechnet sie nach Änderungen nur die neuen Züge. Ergebnisse kommen
 * sofort in die Arbeitskopie (ohne zu speichern; das tut die Warteschlange). Abbrechen nimmt den
 * Wunsch zurück, Fertiges bleibt. Die Zugarten rechnet spiel/variationsurteile.ts mit denselben
 * Regeln wie die Partieauswertung, die Theoriezüge mit den Quellen der Auswertung
 * (rueckblick/useTheorie.ts), geladen erst, wenn es Werte gibt. Die Schalter merkt sich das Gerät
 * (app/merker.ts), wie die Koordinaten.
 * Abhängigkeiten: variantenanalyse.ts, training/variationswerte.ts, spiel/variationsurteile.ts,
 * rueckblick/useTheorie.ts, bausteine/useDaten.ts, app/merker.ts.
 */
import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { liesMerker, schreibeMerker } from "../../../app/merker";
import type { Theoriequellen } from "../../../schach/theorie";
import type { Zugurteil } from "../../../spiel/auswertung";
import { urteileImBaum } from "../../../spiel/variationsurteile";
import {
  bewertungsstand,
  hatWerte,
  offeneStellungen,
  wertesignatur,
} from "../../../training/variationswerte";
import { useDaten } from "../bausteine/useDaten";
import { ladeTheorie } from "../rueckblick/useTheorie";
import type { Variantenstand } from "./useVariante";
import { variantenanalyse, type Analysestand } from "./variantenanalyse";

/** Die drei Schalter der Anzeige (Wunsch des Autors: ein- und ausblendbar). */
export const ANALYSESCHALTER = ["symbole", "balken", "pfeil"] as const;
export type Analyseschalter = (typeof ANALYSESCHALTER)[number];

/** Name des Merkers je Schalter; gemerkt wird nur „aus“ (Vorgabe: alle an). */
const MERKER: Readonly<Record<Analyseschalter, string>> = {
  symbole: "variantenSymbole",
  balken: "variantenBalken",
  pfeil: "variantenPfeil",
};
const AUS = "aus";

export interface Variantenanalyse {
  /** Stand der Warteschlange für diese Variante („ruht“, wenn sie für eine andere rechnet). */
  readonly stand: Analysestand;
  /** Stellungen mit Wert und alle Stellungen. */
  readonly bewertet: number;
  readonly gesamt: number;
  /** Gibt es Werte (dann erscheinen Schalter, Symbole, Balken)? */
  readonly sichtbar: boolean;
  readonly zeige: Readonly<Record<Analyseschalter, boolean>>;
  readonly schalte: (schalter: Analyseschalter) => void;
  readonly starte: () => void;
  readonly brichAb: () => void;
  /** Urteil je Pfad (spiel/variationsurteile.ts, pfadSchluessel). */
  readonly urteile: ReadonlyMap<string, Zugurteil>;
}

/** Die Schalter mit Merker. */
function useSchalter() {
  const [zeige, setzeZeige] = useState<Record<Analyseschalter, boolean>>(() => ({
    symbole: liesMerker(MERKER.symbole) !== AUS,
    balken: liesMerker(MERKER.balken) !== AUS,
    pfeil: liesMerker(MERKER.pfeil) !== AUS,
  }));
  const schalte = useCallback((s: Analyseschalter) => {
    setzeZeige((alt) => {
      const an = !alt[s];
      schreibeMerker(MERKER[s], an ? "an" : AUS);
      return { ...alt, [s]: an };
    });
  }, []);
  return { zeige, schalte };
}

/** Der Stand der Warteschlange, nur wenn er diese Variante betrifft. */
function useStandFuer(id: string): Analysestand {
  const stand = useSyncExternalStore(
    (rueckruf) => variantenanalyse.beobachte(rueckruf),
    () => variantenanalyse.aktuell(),
  );
  return stand.art !== "ruht" && stand.id === id ? stand : { art: "ruht" };
}

/** Holt Ergebnisse in die Arbeitskopie und fordert Fehlendes an, solange die Analyse gewünscht ist. */
function useAbgleich(stand: Variantenstand): void {
  const v = stand.variation;
  const { uebernimmWerte } = stand;
  useEffect(() => {
    uebernimmWerte(variantenanalyse.ergebnisse());
    return variantenanalyse.beobachte(() => uebernimmWerte(variantenanalyse.ergebnisse()));
  }, [uebernimmWerte]);
  const signatur = useMemo(() => wertesignatur(v), [v]);
  useEffect(() => {
    // Auch ein ungespeicherter Entwurf wird analysiert; seine Werte bleiben in der Arbeitskopie.
    if (!v.analysiert) return;
    const offen = offeneStellungen(v).filter((f) => !variantenanalyse.kennt(f));
    if (offen.length > 0) variantenanalyse.fordere(v.id, offen);
    // Maßgeblich sind Züge und Werte (Signatur), nicht jeder Tastendruck im Kommentar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signatur, v.analysiert, v.id]);
}

/** Lädt die Theoriequellen erst, wenn es Werte gibt (die Lichess-Liste ist groß). */
async function keineQuellen(): Promise<Theoriequellen | null> {
  return null;
}

/**
 * Der ganze Zustand der Analyse für den Bildschirm.
 * Beispiel: Petroff-Falle, „Analyse“ → Fortschritt „3 von 18“, danach Symbole an den Zügen,
 * Balken links am Brett, grüner Pfeil für den besten Zug; „Balken“ aus → kein Balken mehr.
 */
export function useVariantenanalyse(stand: Variantenstand): Variantenanalyse {
  const v = stand.variation;
  useAbgleich(stand);
  const standFuer = useStandFuer(v.id);
  const { zeige, schalte } = useSchalter();
  const signatur = useMemo(() => wertesignatur(v), [v]);
  const sichtbar = useMemo(() => hatWerte(v), [signatur]); // eslint-disable-line react-hooks/exhaustive-deps
  const daten = useDaten(sichtbar ? ladeTheorie : keineQuellen, sichtbar ? "theorie" : "ohne");
  const quellen = daten.art === "fertig" ? daten.wert : null;
  const urteile = useMemo(
    () => (sichtbar ? urteileImBaum(v, quellen) : new Map<string, Zugurteil>()),
    [signatur, quellen, sichtbar], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const zahlen = useMemo(() => bewertungsstand(v), [signatur]); // eslint-disable-line react-hooks/exhaustive-deps
  const starte = () => {
    stand.aendereVariation({ ...v, analysiert: true }, "sofort");
  };
  const brichAb = () => {
    variantenanalyse.brichAb();
    stand.aendereVariation({ ...v, analysiert: false }, "sofort");
  };
  return { stand: standFuer, ...zahlen, sichtbar, zeige, schalte, starte, brichAb, urteile };
}
