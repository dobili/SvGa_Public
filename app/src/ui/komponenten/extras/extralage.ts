/**
 * Lage des Lesers für die Freischaltregeln der Extras (Gamifizierung P7): Stufe und volle
 * Ordengruppen.
 *
 * Rolle im Gesamtbild: training/extras.ts rechnet rein; diese Datei holt die Eingaben aus den
 * vorhandenen Ständen: die Stufe aus dem Abzeichenstand (abzeichenstand.ts), die Orden aus den
 * Fortschrittsringen (fortschrittsringe.ts). Beide zählen die Probe der Aufgabenseite mit, damit
 * der Autor Extras ohne echte Fortschritte prüfen kann. Eine neue Ordengruppe bekommt eine Zeile
 * in `RINGE_DER_GRUPPE`.
 * Abhängigkeiten: training/extras.ts, fortschritt/abzeichenstand.ts, fortschritt/fortschrittsringe.ts,
 * fortschritt/ringrechnung.ts.
 */
import { useMemo } from "react";
import {
  ORDENGRUPPEN,
  sperre,
  type Extra,
  type Extraart,
  type Extralage,
  type Ordengruppe,
} from "../../../training/extras";
import { useAbzeichenstand } from "../fortschritt/abzeichenstand";
import { useFortschrittsringe } from "../fortschritt/fortschrittsringe";
import { istVoll } from "../fortschritt/ringrechnung";
import type { Symbolringangabe } from "../fortschritt/Symbolringe";

type Ringe = NonNullable<ReturnType<typeof useFortschrittsringe>>;

/** Je Ordengruppe die Ringe, deren Orden alle verdient sein müssen. */
const RINGE_DER_GRUPPE: Readonly<Record<Ordengruppe, (ringe: Ringe) => Symbolringangabe[]>> = {
  buchteile: (ringe) => ringe.teilringe,
};

/** Volle Ordengruppen; eine Gruppe ohne Ringe zählt nie als voll. */
function volleGruppen(ringe: Ringe | null): ReadonlySet<Ordengruppe> {
  if (!ringe) return new Set();
  return new Set(
    ORDENGRUPPEN.filter((gruppe) => {
      const liste = RINGE_DER_GRUPPE[gruppe](ringe);
      return liste.length > 0 && liste.every((r) => istVoll(r.anteil));
    }),
  );
}

/**
 * Die Lage des Lesers. Solange Speicher oder Index laden, gilt Stufe 1 ohne Orden (alles Neue
 * gesperrt, Gewähltes bleibt nach der Regel „nie wegnehmen“ trotzdem gewählt).
 */
export function useExtralage(): Extralage {
  const stand = useAbzeichenstand();
  const ringe = useFortschrittsringe();
  const stufe = stand?.stufe.nummer ?? 1;
  const schluessel = [...volleGruppen(ringe)].join(",");
  // Neue Lage nur, wenn sich Stufe oder Gruppen ändern (die Mengen wären sonst jedes Mal neu).
  return useMemo(() => {
    const voll = new Set(schluessel.split(","));
    return { stufe, volleOrdengruppen: new Set(ORDENGRUPPEN.filter((g) => voll.has(g))) };
  }, [stufe, schluessel]);
}

/** Sperre je Wert einer Art: das sperrende Extra oder undefined (für die Kacheln der Einstellungen). */
export function useSperre(art: Extraart, gewaehlt: string): (wert: string) => Extra | undefined {
  const lage = useExtralage();
  return (wert) => sperre(art, wert, gewaehlt, lage);
}
