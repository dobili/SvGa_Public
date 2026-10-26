/**
 * Ob die Erklärkachel von „Zählen“ oder „Ziehen“ erscheint, und das dauerhafte Ausblenden.
 *
 * Rolle im Gesamtbild: Wunsch des Autors nach dem Test von 0.2.30: Da anfangs kein Werkzeug
 * gewählt ist, erklären sich Zählen und Ziehen gleich beim Wählen mit einer Kachel, die stehen
 * bleibt, solange das Werkzeug gewählt ist (wie die Karten der übrigen Werkzeuge). Ein Haken
 * „Nicht mehr anzeigen“ blendet sie dauerhaft aus; die Einstellungen holen sie zurück. Die Wahl
 * ist ein Merker auf dem Gerät (wie die Koordinaten).
 * Abhängigkeiten: app/merker.ts, React.
 */
import { useState } from "react";
import { entferneMerker, liesMerker, schreibeMerker } from "../../../app/merker";

/** Die Werkzeuge mit Erklärkachel. */
export const MIT_ERKLAERKACHEL = ["zaehlen", "ziehen"] as const;
export type Erklaerwerkzeug = (typeof MIT_ERKLAERKACHEL)[number];

const AUSGEBLENDET = "aus";

function merkername(werkzeug: Erklaerwerkzeug): string {
  return `erklaerung.${werkzeug}`;
}

/** Ist die Wahl ein Werkzeug mit Erklärkachel? */
export function hatErklaerkachel(wahl: string | null): wahl is Erklaerwerkzeug {
  return wahl === "zaehlen" || wahl === "ziehen";
}

/**
 * Sichtbarkeit der Kachel für das gewählte Werkzeug und eine Funktion, die sie dauerhaft
 * ausblendet. Für andere Werkzeuge (oder keins) ist sie nie sichtbar.
 * Beispiel: „Zählen“ gewählt, Haken gesetzt → Kachel weg, auch nach dem Neuladen.
 */
export function useErklaerung(wahl: string | null): {
  readonly sichtbar: boolean;
  readonly ausblenden: () => void;
} {
  const [ausgeblendet, setzeAusgeblendet] = useState<readonly Erklaerwerkzeug[]>(() =>
    MIT_ERKLAERKACHEL.filter((w) => liesMerker(merkername(w)) === AUSGEBLENDET),
  );
  const werkzeug = hatErklaerkachel(wahl) ? wahl : null;
  return {
    sichtbar: werkzeug !== null && !ausgeblendet.includes(werkzeug),
    ausblenden: () => {
      if (!werkzeug) return;
      schreibeMerker(merkername(werkzeug), AUSGEBLENDET);
      setzeAusgeblendet([...ausgeblendet, werkzeug]);
    },
  };
}

/** Holt alle ausgeblendeten Erklärkacheln zurück (Einstellungen). */
export function zeigeErklaerungenWieder(): void {
  for (const werkzeug of MIT_ERKLAERKACHEL) entferneMerker(merkername(werkzeug));
}
