/**
 * Arbeitskopie einer Variante und ihr Speichern: sofort nach Zügen, nach einer Tipp-Pause bei
 * Texten, beim Verlassen immer.
 *
 * Rolle im Gesamtbild: Der Bildschirm „Variante“ ändert seine Kopie hierüber. Ein Entwurf
 * (Kennung "") bekommt beim ersten eigenen Inhalt eine Kennung und wird damit gespeichert
 * (Entwurf, Abschnitt 3: „Speichern ist kein Pflichtschritt“). Weil jedes Speichern den ganzen
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

/** Tipp-Pause, nach der ein Text gespeichert wird (Entwurf, Abschnitt 5). */
export const TIPPPAUSE_MS = 1000;

export interface Variantenspeicher {
  readonly variation: Variation;
  /**
   * Übernimmt eine geänderte Variante; Ausgabe ihre Kennung (ein Entwurf bekommt hier eine), an
   * einer Grenze null (dann bleibt alles, wie es war).
   */
  readonly aendereVariation: (neu: Variation, art: "sofort" | "pause") => string | null;
  /** Schreibt eine ausstehende Änderung sofort (Verlassen eines Textfeldes). */
  readonly schreibe: () => void;
  /** Löscht die Variante aus dem Speicher; die Arbeitskopie wird danach nie mehr geschrieben. */
  readonly loesche: () => void;
  readonly grenze: Grenze | null;
  readonly vergissGrenze: () => void;
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

/**
 * Hält die Arbeitskopie und speichert sie.
 * Beispiel: Entwurf aus Abb. 2.40, erster eigener Zug → Kennung „var-…“, sofort gespeichert;
 * danach ein Kommentar → gespeichert eine Sekunde nach dem letzten Tastendruck.
 */
export function useVariantenspeicher(anfang: Variation): Variantenspeicher {
  const [variation, setzeVariation] = useState(anfang);
  const [grenze, setzeGrenze] = useState<Grenze | null>(null);
  const aktuell = useRef(anfang);
  const { schreibe, plane, verwirf } = useSchreiber(aktuell);
  const aendereVariation = useCallback(
    (neu: Variation, art: "sofort" | "pause") => {
      const jetzt = new Date();
      const id = neu.id === ENTWURF ? neueVariationskennung(jetzt) : neu.id;
      const fertig = { ...neu, id, geaendert: jetzt.toISOString() };
      const erreicht = grenzeFuer(speicherzustand().daten.variationen, fertig);
      setzeGrenze(erreicht);
      if (erreicht) return null;
      aktuell.current = fertig;
      setzeVariation(fertig);
      plane(art);
      return id;
    },
    [plane],
  );
  const loesche = useCallback(() => {
    verwirf();
    const id = aktuell.current.id;
    void aendere((daten) => ({ ...daten, variationen: ohneVariation(daten.variationen, id) }));
  }, [verwirf]);
  // Beim Verlassen des Bildschirms wird Ausstehendes sofort geschrieben.
  useEffect(() => schreibe, [schreibe]);
  const vergissGrenze = useCallback(() => setzeGrenze(null), []);
  return { variation, aendereVariation, schreibe, loesche, grenze, vergissGrenze };
}
