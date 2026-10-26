/**
 * Stand von „Erst selbst denken“ je Abbildung: gesperrt oder freigegeben mit Einschätzung.
 *
 * Rolle im Gesamtbild: Logik zur Karte SelbstDenken.tsx (Pflichtenheft 4 und 5.1, seit 0.2.90);
 * eigene Datei, damit die Komponentendatei nur Komponenten exportiert. Seit 0.2.117 (NA1) bleiben
 * richtig eingeschätzte Abbildungen frei (Nutzerdaten, fortschritt.eingeschaetzt).
 * Abhängigkeiten: app/einstellungen.ts, analyse/einschaetzung.ts, speicher.
 */
import { useState } from "react";
import type { Einschaetzung } from "../../../analyse/einschaetzung";
import { useEinstellungen } from "../../../app/einstellungen";
import { useSpeicher } from "../../../speicher/speicher";

export { EINSCHAETZUNGEN, type Einschaetzung } from "../../../analyse/einschaetzung";

/** Was der Leser beim Freigeben gewählt hat, und für welche Stellung. */
interface Freigabe {
  readonly einschaetzung: Einschaetzung | null;
  readonly fen: string;
}

/** Stand je Abbildung: noch gesperrt oder freigegeben mit (oder ohne) Einschätzung. */
export interface Denkstand {
  /** Kennung der Abbildung („1.26“), zum Merken einer richtigen Einschätzung. */
  readonly kennung: string;
  /** Müssen Werkzeuge und Engine noch warten? */
  readonly gesperrt: boolean;
  /** Die Einschätzung des Lesers für die gezeigte Abbildung, falls er eine gewählt hat. */
  readonly einschaetzung: Einschaetzung | null;
  /** Die Stellung, die der Leser eingeschätzt hat (für das Urteil der Engine). */
  readonly fen: string | null;
  readonly freigeben: (einschaetzung: Einschaetzung | null) => void;
}

/**
 * Merkt sich je Abbildung (Kennung), ob der Leser schon selbst eingeschätzt hat. Die Freigabe gilt
 * im Bildschirm; gespeichert werden nur richtige Einschätzungen (NA1): Diese Abbildungen sind
 * beim nächsten Öffnen gleich frei.
 * Eingaben: Kennung der Abbildung und die gezeigte Stellung.
 * Beispiel: Abb. 1.26 mit „an“ → gesperrt, nach „Weiß steht besser“ frei mit dieser Einschätzung.
 */
export function useSelbstDenken(kennung: string, fen: string): Denkstand {
  const { vorWerkzeugen } = useEinstellungen();
  const gemerkt = useSpeicher(
    (zustand) => zustand.daten.fortschritt.eingeschaetzt[kennung] !== undefined,
  );
  const [frei, setzeFrei] = useState<ReadonlyMap<string, Freigabe>>(new Map());
  const freigabe = frei.get(kennung);
  return {
    kennung,
    gesperrt: vorWerkzeugen === "an" && !gemerkt && freigabe === undefined,
    einschaetzung: freigabe?.einschaetzung ?? null,
    fen: freigabe?.fen ?? null,
    freigeben: (einschaetzung) => setzeFrei(new Map(frei).set(kennung, { einschaetzung, fen })),
  };
}
