/**
 * Arbeitskopie einer Variante und ihr Speichern: sofort nach Zügen, nach einer Tipp-Pause bei
 * Texten, beim Verlassen immer – aber nur, wenn die Variante schon gespeichert ist.
 *
 * Rolle im Gesamtbild: Der Bildschirm „Variante“ ändert seine Kopie hierüber. Ein Entwurf
 * (Kennung "") wird nie von selbst gespeichert (Wunsch des Autors, 1.11.2026: „ob eine Variante
 * gespeichert wird, sollte nie automatisch passieren, sondern stets per Abfrage“). Erst
 * `speichere` gibt ihm eine Kennung und schreibt ihn; danach gilt das Speichern wie oben. Weil jedes Speichern den ganzen
 * Stand schreibt (speicher/datenbank.ts), speichern Texte erst nach einer Pause von einer Sekunde
 * (Abschnitt 5). Geschrieben wird über `aendere` mit einer Funktion des aktuellen Standes: Was ein
 * anderer Tab inzwischen gespeichert hat, bleibt erhalten (speicher.ts, Abgleich der Tabs).
 * An einer Grenze (training/variationen.ts) bleibt die Änderung aus und die Grenze wird gemeldet.
 * Abhängigkeiten: speicher/speicher.ts, training/variationen.ts, training/variationsquellen.ts.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { aendere, speicherzustand } from "../../../speicher/speicher";
import {
  grenzeFuer,
  mitVariation,
  neueVariationskennung,
  ohneVariation,
  type Grenze,
  type Variation,
} from "../../../training/variationen";
import { ENTWURF } from "../../../training/variationsquellen";
import { mitWerten, type Engineergebnis } from "../../../training/variationswerte";

/** Tipp-Pause, nach der ein Text gespeichert wird (Entwurf, Abschnitt 5). */
export const TIPPPAUSE_MS = 1000;

export interface Variantenspeicher {
  readonly variation: Variation;
  /**
   * Übernimmt eine geänderte Variante; Ausgabe true, an einer Grenze false (dann bleibt alles,
   * wie es war). Ein Entwurf bleibt dabei Entwurf und ungespeichert.
   */
  readonly aendereVariation: (neu: Variation, art: "sofort" | "pause") => boolean;
  /** Speichert einen Entwurf auf Wunsch des Lesers; Ausgabe seine Kennung, an einer Grenze null. */
  readonly speichereEntwurf: () => string | null;
  /** Ein Entwurf mit eigenem Inhalt, der noch nicht gespeichert ist (dann fragt die App). */
  readonly ungespeichert: boolean;
  /** Schreibt eine ausstehende Änderung sofort (Verlassen eines Textfeldes). */
  readonly schreibe: () => void;
  /** Löscht die Variante aus dem Speicher; die Arbeitskopie wird danach nie mehr geschrieben. */
  readonly loesche: () => void;
  readonly grenze: Grenze | null;
  readonly vergissGrenze: () => void;
  /**
   * Stufe 3: Trägt Ergebnisse der Engine in die Arbeitskopie ein, ohne zu speichern (das tut die
   * Warteschlange der Analyse selbst, variantenanalyse.ts) und ohne „geändert“ zu verstellen.
   */
  readonly uebernimmWerte: (ergebnisse: ReadonlyMap<string, Engineergebnis>) => void;
}

/** Schreibt eine Variante in den Speicher (an einer Grenze bleibt der Speicher, wie er war). */
function inDenSpeicher(variation: Variation): void {
  void aendere((daten) => {
    const ergebnis = mitVariation(daten.variationen, variation);
    return "liste" in ergebnis ? { ...daten, variationen: ergebnis.liste } : daten;
  });
}

/** Schreiben sofort oder nach der Tipp-Pause; nur, was seit dem letzten Schreiben offen ist. */
function useSchreiber(aktuell: { readonly current: Variation }) {
  const offen = useRef(false);
  const zeit = useRef<ReturnType<typeof setTimeout> | null>(null);
  const halteAn = useCallback(() => {
    if (zeit.current) clearTimeout(zeit.current);
    zeit.current = null;
  }, []);
  const schreibe = useCallback(() => {
    halteAn();
    if (!offen.current || aktuell.current.id === ENTWURF) return;
    offen.current = false;
    inDenSpeicher(aktuell.current);
  }, [aktuell, halteAn]);
  const plane = useCallback(
    (art: "sofort" | "pause") => {
      offen.current = true;
      if (art === "sofort") schreibe();
      else {
        halteAn();
        zeit.current = setTimeout(schreibe, TIPPPAUSE_MS);
      }
    },
    [schreibe, halteAn],
  );
  const verwirf = useCallback(() => {
    offen.current = false;
    halteAn();
  }, [halteAn]);
  return { schreibe, plane, verwirf };
}

/** Prüft eine geänderte Fassung gegen die Grenzen; Ausgabe die Fassung oder null. */
function fassungInGrenzen(
  neu: Variation,
  setzeGrenze: (g: Grenze | null) => void,
): Variation | null {
  const fertig = { ...neu, geaendert: new Date().toISOString() };
  const erreicht = grenzeFuer(speicherzustand().daten.variationen, fertig);
  setzeGrenze(erreicht);
  return erreicht ? null : fertig;
}

/**
 * Hält die Arbeitskopie und speichert sie.
 * Beispiel: Entwurf aus Abb. 2.40, erster eigener Zug → noch nichts gespeichert, „ungespeichert“;
 * „Speichern“ → Kennung „var-…“; danach ein Kommentar → gespeichert eine Sekunde nach dem letzten
 * Tastendruck.
 */
export function useVariantenspeicher(anfang: Variation): Variantenspeicher {
  const [variation, setzeVariation] = useState(anfang);
  const [grenze, setzeGrenze] = useState<Grenze | null>(null);
  const [geaendert, setzeGeaendert] = useState(false);
  const aktuell = useRef(anfang);
  const { schreibe, plane, verwirf } = useSchreiber(aktuell);
  const aendereVariation = useCallback(
    (neu: Variation, art: "sofort" | "pause") => {
      const fertig = fassungInGrenzen(neu, setzeGrenze);
      if (!fertig) return false;
      aktuell.current = fertig;
      setzeVariation(fertig);
      setzeGeaendert(true);
      plane(art);
      return true;
    },
    [plane],
  );
  const speichereEntwurf = useCallback(() => {
    if (aktuell.current.id !== ENTWURF) return aktuell.current.id;
    const id = neueVariationskennung(new Date());
    const fertig = fassungInGrenzen({ ...aktuell.current, id }, setzeGrenze);
    if (!fertig) return null;
    aktuell.current = fertig;
    setzeVariation(fertig);
    plane("sofort");
    return id;
  }, [plane]);
  const loesche = useCallback(() => {
    verwirf();
    const id = aktuell.current.id;
    void aendere((daten) => ({ ...daten, variationen: ohneVariation(daten.variationen, id) }));
  }, [verwirf]);
  // Beim Verlassen des Bildschirms wird Ausstehendes sofort geschrieben (nie ein Entwurf).
  useEffect(() => schreibe, [schreibe]);
  const vergissGrenze = useCallback(() => setzeGrenze(null), []);
  const uebernimmWerte = useCallback((ergebnisse: ReadonlyMap<string, Engineergebnis>) => {
    const neu = mitWerten(aktuell.current, ergebnisse);
    if (neu === aktuell.current) return;
    aktuell.current = neu;
    setzeVariation(neu);
  }, []);
  const ungespeichert = geaendert && variation.id === ENTWURF;
  return {
    variation,
    aendereVariation,
    speichereEntwurf,
    ungespeichert,
    schreibe,
    loesche,
    grenze,
    vergissGrenze,
    uebernimmWerte,
  };
}
