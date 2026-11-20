/**
 * Textspalte im Querformat und Kamera: Solange ein Dialog quer als Seitenspalte rechts steht
 * (querformat.css), zählt seine Breite als verdeckter rechter Rand der Kamera. So steht der Held
 * in der Mitte der freien Fläche links daneben, und sein Gesprächspartner neben ihm bleibt im Bild.
 *
 * Warum: Wunsch des Autors (20.11.2026), Texte quer als Spalte neben der Welt. Ohne Versatz stand
 * der Held in der Bildmitte und damit oft unter der Spalte. Die Vergrößerung bleibt (ZOOM 3): Neben
 * der Spalte sind quer noch 8 bis 10 Kacheln breit und 7 bis 9 hoch zu sehen; das reicht für Held
 * und Gesprächspartner, und ein Zoomsprung bei jedem Gespräch wäre unruhig.
 * Rolle im Gesamtbild: Zustand für oberwelt/kameraregie.ts (liest die Breite), Hook für
 * oberwelt/Oberwelt.tsx (misst die Spalte und richtet die Kamera neu ein).
 * Abhängigkeiten: React (keine Szene: Die Oberwelt reicht den Rückruf, sonst entstünde ein
 * Importkreis über kameraregie.ts).
 * Beispiel: iPhone 15 quer 734 breit, Spalte 294 + Rand → rechts 102 Kartenpixel verdeckt (ZOOM 3).
 */
import { useEffect } from "react";

/** Wie querformat.css: quer und höchstens 600 CSS-Pixel hoch. */
const QUER = "(orientation: landscape) and (max-height: 600px)";

/** Noch einmal messen nach so vielen Millisekunden (die Dialogdatei lädt nach dem Öffnen). */
const NACHMESSEN_MS = [150, 500, 1200];

/** Verdeckte Breite rechts in Bildschirmpixeln (0: keine Spalte). */
let verdecktPx = 0;

/** Die von der Textspalte verdeckte Breite rechts, in Bildschirmpixeln. */
export function textspalteVerdeckt(): number {
  return verdecktPx;
}

/**
 * Misst die Spalte: vom linken Rand des Dialogs bis zum rechten Bildrand, quer; sonst 0.
 * Sonderfall: Sprechblasen der Statisten sind keine Spalte.
 */
export function misseTextspalte(): number {
  if (typeof window === "undefined" || !window.matchMedia?.(QUER).matches) return 0;
  const dialog = document.querySelector(
    ".abenteuer-welt .abenteuer-dialog:not(.abenteuer-sprechblase)",
  );
  if (!dialog) return 0;
  return Math.max(0, Math.round(window.innerWidth - dialog.getBoundingClientRect().left));
}

/**
 * Hält die Kamera passend zur Spalte: bei jedem Öffnen und Schließen eines Dialogs und beim
 * Drehen des Geräts neu messen; hat sich die Breite geändert, die Kamera neu einrichten.
 */
export function useTextspalte(dialogOffen: boolean, passeKameraAn: () => void): void {
  useEffect(() => {
    const pruefe = () => {
      const neu = dialogOffen ? misseTextspalte() : 0;
      if (neu === verdecktPx) return;
      verdecktPx = neu;
      passeKameraAn();
    };
    pruefe();
    // Die Dialogdatei lädt erst nach dem Öffnen; die Spalte steht dann etwas später da.
    const uhren = NACHMESSEN_MS.map((ms) => window.setTimeout(pruefe, ms));
    window.addEventListener("resize", pruefe);
    return () => {
      uhren.forEach((u) => window.clearTimeout(u));
      window.removeEventListener("resize", pruefe);
    };
    // Nur beim Öffnen und Schließen; der Rückruf ist je Zeichnen neu.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogOffen]);
}
