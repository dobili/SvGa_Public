/**
 * Rückfrage „Variante speichern?“: Ein Entwurf wird nur gespeichert, wenn der Leser es will.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (1.11.2026): „Ob eine Variante gespeichert wird, sollte
 * nie automatisch passieren, sondern stets per Abfrage.“ Die App fragt in zwei Lagen: beim
 * Verlassen eines geänderten Entwurfs („Zurück“ oben, die Zurück-Taste des Geräts und die untere
 * Leiste; Speichern,
 * Nicht speichern, Abbrechen) und vor „Karte“, „Von hier spielen“ und „Abfragen“, die eine
 * gespeicherte Variante brauchen (Speichern, Abbrechen). Dazu kommt der Knopf „Speichern“ in der
 * Statuszeile (Variantenmeldung.tsx). Die Frage selbst zeigt Speicherfrage.tsx.
 * Abhängigkeiten: useVariantenspeicher.ts, app/blattstapel.ts, training/variationsquellen.ts.
 */
import { useCallback, useState } from "react";
import { useZurueckSchliesst } from "../../../app/blattstapel";
import { useVerlassenswaechter } from "../../../app/verlassenswaechter";
import { ENTWURF } from "../../../training/variationsquellen";
import type { Variantenspeicher } from "./useVariantenspeicher";

/** Wann gefragt wird: beim Verlassen oder vor einem Sprung, der eine Kennung braucht. */
export type Speicheranlass = "verlassen" | "sprung";

/** Die Antworten; „verwerfen“ gibt es nur beim Verlassen. */
export type Speicherantwort = "speichern" | "verwerfen" | "abbrechen";

/** Eine offene Frage: Anlass und was danach geschieht (mit der Kennung, ohne Speichern null). */
export interface Speicherfrage {
  readonly anlass: Speicheranlass;
  readonly weiter: (id: string | null) => void;
}

export interface Speicherfragen {
  readonly frage: Speicherfrage | null;
  /**
   * Vor einem Sprung: Ist die Variante gespeichert, geht es gleich weiter, sonst kommt die Frage.
   * Beispiel: „Karte“ in einem Entwurf aus Abb. 2.40 → „Dafür wird die Variante gespeichert“.
   */
  readonly mitKennung: (weiter: (id: string) => void) => void;
  /** Vor dem Verlassen: Ist der Entwurf geändert, kommt die Frage, sonst geht es gleich weiter. */
  readonly vorDemVerlassen: (weiter: () => void) => void;
  readonly antworte: (antwort: Speicherantwort) => void;
}

/** Die Rückfragen eines Bildschirms „Variante“. */
export function useSpeicherfrage(
  speicher: Variantenspeicher,
  verlassen: () => void,
): Speicherfragen {
  const [frage, setzeFrage] = useState<Speicherfrage | null>(null);
  const { speichereEntwurf, ungespeichert, variation } = speicher;
  const gespeichert = variation.id !== ENTWURF;
  const mitKennung = useCallback(
    (weiter: (id: string) => void) => {
      if (gespeichert) weiter(variation.id);
      else setzeFrage({ anlass: "sprung", weiter: (id) => id && weiter(id) });
    },
    [gespeichert, variation.id],
  );
  const vorDemVerlassen = useCallback(
    (weiter: () => void) => {
      if (ungespeichert) setzeFrage({ anlass: "verlassen", weiter: () => weiter() });
      else weiter();
    },
    [ungespeichert],
  );
  const antworte = useCallback(
    (antwort: Speicherantwort) => {
      const offen = frage;
      setzeFrage(null);
      if (!offen || antwort === "abbrechen") return;
      const id = antwort === "speichern" ? speichereEntwurf() : null;
      // An einer Grenze (id null) bleibt ein Sprung aus; die Grenze steht in der Statuszeile.
      if (antwort === "speichern" && !id) return;
      offen.weiter(id);
    },
    [frage, speichereEntwurf],
  );
  // Die Zurück-Taste des Geräts fragt bei einem geänderten Entwurf erst nach.
  useZurueckSchliesst(ungespeichert && frage === null, () => vorDemVerlassen(verlassen));
  // Die untere Leiste ebenso (app/verlassenswaechter.ts).
  useVerlassenswaechter(ungespeichert, vorDemVerlassen);
  return { frage, mitKennung, vorDemVerlassen, antworte };
}
