/**
 * Pfeile einer Engine-Karte am Brett, gültig nur für die Stellung, für die die Engine gerechnet
 * hat, und nur solange das Werkzeug gewählt ist.
 *
 * Rolle im Gesamtbild: Engine-Karten (etwa GegnerKarte) rechnen später als das Werkzeug; ihre
 * Pfeile kommen über diesen Hook aufs Brett und verfallen beim Wechsel von Stellung oder
 * Werkzeug (wie useFalle für die FalleKarte).
 * Abhängigkeiten: analyse/werkzeug.ts (Markierung).
 */
import { useCallback, useState } from "react";
import type { Markierung } from "../../../analyse/werkzeug";
import type { Stellung } from "../../../schach/stellung";

export interface Enginemarkierungen {
  readonly markierungen: readonly Markierung[];
  readonly setzeMarkierungen: (markierungen: Markierung[]) => void;
}

/** Pfeile der Engine-Karte, nur wenn das Werkzeug gewählt ist. */
export function useEngineMarkierungen(
  stellung: Stellung | null,
  gewaehlt: boolean,
): Enginemarkierungen {
  const schluessel = `${stellung?.fen ?? ""}|${gewaehlt}`;
  const [stand, setzeStand] = useState<{ schluessel: string; markierungen: Markierung[] }>({
    schluessel: "",
    markierungen: [],
  });
  const setzeMarkierungen = useCallback(
    (markierungen: Markierung[]) => setzeStand({ schluessel, markierungen }),
    [schluessel],
  );
  const markierungen = gewaehlt && stand.schluessel === schluessel ? stand.markierungen : [];
  return { markierungen, setzeMarkierungen };
}
