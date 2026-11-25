/**
 * „Verscheuchen“ auf dem Aktionsknopf (Befund des Autors, 25.11.2026): Steht der Held direkt vor
 * einem Tier am Boden, kann er es aus dem Weg schicken (tierweg.ts, Tierweg.verscheuche).
 *
 * Warum mit Nachfragen: Tiere bewegen sich, auch wenn der Held still steht; eine Katze, die vor ihn
 * läuft, soll den Knopf ohne einen Schritt des Helden zeigen. Viermal je Sekunde reicht dafür und
 * kostet nichts (eine Suche über die Tiere der Karte).
 * Ausgabe: was der Aktionsknopf ohne Auslöser tut und die zweite Wahl daneben (Oberwelt.tsx).
 * Abhängigkeiten: kern.ts (szeneAus), szene.ts (belebungsschicht), texte/texte.ts.
 */
import { useEffect, useState, type RefObject } from "react";
import { tSpiel } from "../texte/texte";
import { szeneAus } from "./kern";

/** So oft fragt der Knopf, ob ein Tier vor dem Helden steht (ms). */
const NACHFRAGE_MS = 250;

/** Eine Handlung für den Aktionsknopf. */
export interface Nebenaktion {
  readonly text: string;
  readonly tu: () => void;
}

/** Was der Aktionsknopf ohne Auslöser tut (`haupt`) und die zweite Wahl neben einem Auslöser. */
export interface Nebenaktionen {
  readonly haupt: Nebenaktion | null;
  readonly zweite: Nebenaktion | null;
}

/**
 * Eingaben: Spiel, ob die Welt frei ist, die Ruhe (Bank, Bett; useWarten.tsx) und ob der Held vor
 * einem Auslöser steht. Ohne Auslöser: Ruhe vor Verscheuchen; mit Auslöser: Verscheuchen als zweite
 * Wahl (Tiere mit eigenem Gespräch behalten es).
 */
export function useVerscheuchen(
  spiel: RefObject<Phaser.Game | null>,
  frei: boolean,
  ruhe: Nebenaktion | null,
  mitAusloeser: boolean,
): Nebenaktionen {
  const [davor, setzeDavor] = useState(false);
  useEffect(() => {
    if (!frei) return;
    const uhr = setInterval(() => {
      setzeDavor(szeneAus(spiel)?.belebungsschicht?.tierweg.tierVorHeld() != null);
    }, NACHFRAGE_MS);
    return () => clearInterval(uhr);
  }, [spiel, frei]);
  const scheuch: Nebenaktion | null =
    frei && davor
      ? {
          text: tSpiel("oberwelt.verscheuchen"),
          tu: () => {
            szeneAus(spiel)?.belebungsschicht?.tierweg.verscheuche();
            setzeDavor(false);
          },
        }
      : null;
  return mitAusloeser ? { haupt: null, zweite: scheuch } : { haupt: ruhe ?? scheuch, zweite: null };
}
