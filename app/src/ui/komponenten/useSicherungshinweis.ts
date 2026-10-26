/**
 * Zählt die App-Zeit und sagt, wann der Hinweis auf die Datensicherung erscheint (seit 0.2.32).
 *
 * Rolle im Gesamtbild: Verbindet app/sicherungshinweis.ts mit der Oberfläche. Einmal je Minute
 * zählt der Hook eine Minute dazu, aber nur, wenn die App sichtbar ist (nicht im Hintergrund).
 * Abhängigkeiten: app/sicherungshinweis.ts, speicher/, React.
 */
import { useEffect, useState } from "react";
import {
  hinweisAbgeschaltet,
  hinweisFaellig,
  liesAppzeit,
  schalteHinweisAb,
  schreibeAppzeit,
  zaehle,
} from "../../app/sicherungshinweis";
import { inhaltsangabe } from "../../speicher/sicherung";
import { useSpeicher } from "../../speicher/speicher";

/** So oft wird gezählt; eine Minute Ungenauigkeit spielt bei vier Stunden keine Rolle. */
const TAKT_MS = 60_000;

export interface Sicherungshinweis {
  readonly faellig: boolean;
  /** Blendet den Hinweis aus; die Zählung beginnt von vorn. */
  readonly spaeter: () => void;
  /** „Nicht mehr nachfragen“: dauerhaft aus. */
  readonly nichtMehr: () => void;
}

/**
 * Zählt die Zeit, in der die App sichtbar ist, und meldet, wann der Hinweis auf die Datensicherung
 * fällig ist; dazu „Später“ und „Nicht mehr nachfragen“.
 */
export function useSicherungshinweis(): Sicherungshinweis {
  const letzte = useSpeicher((z) => z.daten.letzteSicherung);
  const hatDaten = useSpeicher((z) => {
    const angabe = inhaltsangabe(z.daten);
    return angabe.abbildungen + angabe.uebungen + angabe.lernziele > 0;
  });
  const [stand, setzeStand] = useState(liesAppzeit);
  const [aus, setzeAus] = useState(hinweisAbgeschaltet);
  useEffect(() => {
    const takt = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      const neu = zaehle(liesAppzeit(), letzte, TAKT_MS);
      schreibeAppzeit(neu);
      setzeStand(neu);
    }, TAKT_MS);
    return () => window.clearInterval(takt);
  }, [letzte]);
  return {
    faellig: hinweisFaellig(stand, letzte, hatDaten, aus),
    spaeter: () => {
      const neu = { seitSicherung: letzte, ms: 0 };
      schreibeAppzeit(neu);
      setzeStand(neu);
    },
    nichtMehr: () => {
      schalteHinweisAb();
      setzeAus(true);
    },
  };
}
