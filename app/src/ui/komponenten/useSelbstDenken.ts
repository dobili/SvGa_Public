/**
 * Stand von „Erst selbst denken“ je Abbildung: gesperrt oder freigegeben mit Einschätzung.
 *
 * Rolle im Gesamtbild: Logik zur Karte SelbstDenken.tsx (Pflichtenheft 4 und 5.1, seit 0.2.90);
 * eigene Datei, damit die Komponentendatei nur Komponenten exportiert.
 * Abhängigkeiten: app/einstellungen.ts.
 */
import { useState } from "react";
import { useEinstellungen } from "../../app/einstellungen";

/** Die drei Einschätzungen der Stellung, wie der Leser sie vor dem Werkzeug trifft. */
export type Einschaetzung = "weiss" | "gleich" | "schwarz";
export const EINSCHAETZUNGEN: readonly Einschaetzung[] = ["weiss", "gleich", "schwarz"];

/** Stand je Abbildung: noch gesperrt oder freigegeben mit (oder ohne) Einschätzung. */
export interface Denkstand {
  /** Müssen Werkzeuge und Engine noch warten? */
  readonly gesperrt: boolean;
  /** Die Einschätzung des Leser für die gezeigte Abbildung, falls er eine gewählt hat. */
  readonly einschaetzung: Einschaetzung | null;
  readonly freigeben: (einschaetzung: Einschaetzung | null) => void;
}

/**
 * Merkt sich je Abbildung (Kennung), ob der Leser schon selbst eingeschätzt hat. Nur im
 * Bildschirm, nicht gespeichert: Beim nächsten Öffnen denkt der Leser wieder zuerst selbst.
 * Beispiel: Abb. 1.26 mit „an“ → gesperrt, nach „Weiß steht besser“ frei mit dieser Einschätzung.
 */
export function useSelbstDenken(kennung: string): Denkstand {
  const { vorWerkzeugen } = useEinstellungen();
  const [frei, setzeFrei] = useState<ReadonlyMap<string, Einschaetzung | null>>(new Map());
  return {
    gesperrt: vorWerkzeugen === "an" && !frei.has(kennung),
    einschaetzung: frei.get(kennung) ?? null,
    freigeben: (einschaetzung) => setzeFrei(new Map(frei).set(kennung, einschaetzung)),
  };
}
