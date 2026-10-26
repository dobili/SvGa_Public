/**
 * Zustand des Werkzeugs k4-falle auf einer Abbildung: Angebot und Pfeile der Engine.
 *
 * Rolle im Gesamtbild: Das Werkzeug k4-falle rechnet synchron das Angebot; das Urteil der Engine
 * kommt später aus der FalleKarte. Dieser Hook hält das Angebot (stabil, damit die Engine nicht bei
 * jedem Zeichnen neu rechnet) und die Pfeile der Engine, die beim Wechsel von Stellung oder
 * Werkzeug verfallen.
 * Abhängigkeiten: analyse/k4-falle.ts.
 */
import { useCallback, useMemo, useState } from "react";
import { angebot, type Angebot } from "../../../analyse/k4-falle";
import type { Markierung } from "../../../analyse/werkzeug";
import type { Stellung } from "../../../schach/stellung";

export interface Fallenstand {
  readonly angebot: Angebot | null;
  readonly markierungen: readonly Markierung[];
  readonly setzeMarkierungen: (markierungen: Markierung[]) => void;
}

/** Angebot und Engine-Pfeile, nur wenn das Werkzeug „Falle?“ gewählt ist. */
export function useFalle(
  stellung: Stellung | null,
  gewaehlt: boolean,
  naechsterZug: string | null,
): Fallenstand {
  // Die Pfeile gelten nur für die Stellung, für die die Engine gerechnet hat.
  const schluessel = `${stellung?.fen ?? ""}|${gewaehlt}`;
  const [stand, setzeStand] = useState<{ schluessel: string; markierungen: Markierung[] }>({
    schluessel: "",
    markierungen: [],
  });
  const setzeMarkierungen = useCallback(
    (markierungen: Markierung[]) => setzeStand({ schluessel, markierungen }),
    [schluessel],
  );
  const aktuell = useMemo(
    () => (gewaehlt && stellung ? angebot(stellung, naechsterZug ?? undefined) : null),
    [gewaehlt, stellung, naechsterZug],
  );
  const markierungen = gewaehlt && stand.schluessel === schluessel ? stand.markierungen : [];
  return { angebot: aktuell, markierungen, setzeMarkierungen };
}
