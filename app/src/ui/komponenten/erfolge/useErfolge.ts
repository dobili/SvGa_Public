/**
 * Anbindung der Karte „Deine Erfolge“ an Speicher, Ringe und Abzeichen (Profil neu, 31.10.2026).
 *
 * Rolle im Gesamtbild: Holt die Ringe (fortschritt/fortschrittsringe.ts, mit Probe des Autors) und
 * den Stand der Abzeichen (fortschritt/abzeichenstand.ts) und rechnet daraus mit
 * erfolgsstuecke.ts die Regale, das zuletzt verdiente Stück und die nächsten Stücke.
 * Abhängigkeiten: erfolgsstuecke.ts, fortschritt/fortschrittsringe.ts,
 * fortschritt/abzeichenstand.ts, Speicher.
 */
import { useSpeicher } from "../../../speicher/speicher";
import { useAbzeichenstand } from "../fortschritt/abzeichenstand";
import { useFortschrittsringe } from "../fortschritt/fortschrittsringe";
import {
  ERFOLGSREGALE,
  naechsteStuecke,
  zuletztVerdient,
  type Erfolgsregal,
  type Erfolgsstueck,
} from "./erfolgsstuecke";

/** Was die Karte zeigt. */
export interface Erfolgsstand {
  readonly regale: readonly { regal: Erfolgsregal; stuecke: readonly Erfolgsstueck[] }[];
  readonly verdient: number;
  readonly gesamt: number;
  readonly zuletzt: { stueck: Erfolgsstueck; datum: string } | null;
  readonly naechste: readonly Erfolgsstueck[];
}

/** Der Stand der Karte; null, solange Index oder Speicher laden. */
export function useErfolge(): Erfolgsstand | null {
  const ringe = useFortschrittsringe();
  const stand = useAbzeichenstand();
  const verdient = useSpeicher((z) => z.daten.verdient);
  if (!ringe || !stand) return null;
  const quelle = { ...ringe, stand };
  const regale = ERFOLGSREGALE.map((regal) => ({ regal, stuecke: regal.stuecke(quelle) }));
  const alle = regale.flatMap((r) => r.stuecke);
  return {
    regale,
    verdient: alle.filter((s) => s.verdient).length,
    gesamt: alle.length,
    zuletzt: zuletztVerdient(alle, verdient),
    naechste: naechsteStuecke(alle),
  };
}
