/**
 * Wartet in der Spielhülle, bis die Regeln einer Variante geladen sind (`vorbereiten` in der
 * Variantendefinition, etwa ffish für Falke und Bison oder den Drachen; Wunsch von mittel-2,
 * 26.11.2026).
 *
 * Warum auch hier: Die Partie wird zwar erst nach dem Laden angelegt (anbindung/dienste.ts), aber
 * nach einem Neuladen der App öffnet die Hülle eine laufende Partie direkt; dann muss sie selbst
 * warten, sonst prüft das Brett Züge ohne Regeln.
 * Ausgabe: "bereit", "laedt" oder "fehler" (Laden gescheitert, etwa ohne Netz und ohne Paket).
 */
import { useEffect, useState } from "react";
import { varianteVon } from "../../spiel/varianten/alle";

export type Variantenbereitschaft = "bereit" | "laedt" | "fehler";

export function useVariantenbereit(kennung: string | undefined): Variantenbereitschaft {
  const vorbereiten = varianteVon(kennung)?.vorbereiten;
  const [stand, setzeStand] = useState<{ kennung?: string; wert: Variantenbereitschaft }>({
    wert: "laedt",
  });
  useEffect(() => {
    if (!vorbereiten) return;
    let aktiv = true;
    vorbereiten().then(
      () => aktiv && setzeStand({ kennung, wert: "bereit" }),
      (fehler: unknown) => {
        console.warn(`Regeln der Variante ${kennung ?? ""} nicht geladen`, fehler);
        if (aktiv) setzeStand({ kennung, wert: "fehler" });
      },
    );
    return () => {
      aktiv = false;
    };
  }, [kennung, vorbereiten]);
  if (!vorbereiten) return "bereit";
  return stand.kennung === kennung ? stand.wert : "laedt";
}
