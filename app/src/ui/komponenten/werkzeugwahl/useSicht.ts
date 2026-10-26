/**
 * Die Sicht der Werkzeuge: für welche Seite gerechnet wird.
 *
 * Rolle im Gesamtbild: Entscheidung des Autors (15.10.2026, Variante B): Die Werkzeuge rechnen
 * für die Seite am Zug. Ein Schalter in der Werkzeugkarte tauscht die Seite, gleich wer am Zug
 * ist; nach jedem Zug und beim Wechsel der Abbildung gilt wieder die Seite am Zug. Darum vergisst
 * der Schalter seine Wahl bei jeder Änderung der Stellung, auch beim Zurückgehen.
 * Abhängigkeiten: React, schach/stellung.ts.
 */
import { useState } from "react";
import { gegner, type Farbe } from "../../../schach/stellung";

export interface Sicht {
  readonly farbe: Farbe;
  /** Ist die Seite der Sicht am Zug? */
  readonly amZug: boolean;
  readonly wechsle: () => void;
}

/** Die Seite am Zug laut FEN („w“ oder „b“ im zweiten Feld). */
export function seiteAmZug(fen: string): Farbe {
  return fen.split(" ")[1] === "b" ? "black" : "white";
}

/**
 * Sicht für die gezeigte Stellung.
 *
 * Beispiel: Abb. 1.27 (Schwarz am Zug): Standard Schwarz; ein Tipp auf den Schalter rechnet für
 * Weiß; nach dem nächsten Halbzug gilt wieder die Seite am Zug.
 */
export function useSicht(fen: string): Sicht {
  const [wahl, setzeWahl] = useState<Farbe | null>(null);
  const [fenDerWahl, setzeFenDerWahl] = useState(fen);
  // Jeder Zug (auch vor und wieder zurück) vergisst die Wahl: Zustand während des Zeichnens
  // anpassen statt in einem Effekt, damit nie eine veraltete Sicht aufblitzt.
  if (fen !== fenDerWahl) {
    setzeFenDerWahl(fen);
    setzeWahl(null);
  }
  const amZug = seiteAmZug(fen);
  const farbe = fen === fenDerWahl && wahl ? wahl : amZug;
  return { farbe, amZug: farbe === amZug, wechsle: () => setzeWahl(gegner(farbe)) };
}
