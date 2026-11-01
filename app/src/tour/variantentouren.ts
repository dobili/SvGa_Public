/**
 * Touren der Bildschirme „Varianten“ (Liste) und „Variante“ (Brett), kurz und mit bekannten
 * Zeichen (Wunsch des Autors: wenig Text).
 *
 * Rolle im Gesamtbild: Variationsbrowser, Stufe 1 (1.11.2026), seit Stufe 2 mit Stift, Baum und
 * der Karte des ganzen Baums. Eigene Datei, damit touren.ts
 * unter 400 Zeilen bleibt; touren.ts nimmt die Touren mit einer Zeile auf und fragt hier, welche
 * Tour zu einem Bildschirm der Ansicht „zusatz“ gehört.
 * Abhängigkeiten: touren.ts (nur Typen), i18n (Schlüssel).
 */
import type { Textschluessel } from "../i18n/sprache";
import type { Tour, Tourschritt } from "./touren";

/** Kennungen der beiden Touren; zugleich die Kennungen der Bildschirme in ZUSATZANSICHTEN. */
export type Variantentour = "varianten" | "variante" | "variantenkarte";

/** Schritt mit Ziel; fehlt das Ziel, steht der Text in der Mitte. */
function am(ziel: string, text: Textschluessel): Tourschritt {
  return { ziel, ersatzMitte: true, text };
}

/** Die beiden Touren, nach Kennung. */
export const VARIANTENTOUREN: Readonly<Record<Variantentour, Tour>> = {
  varianten: {
    titel: "tour.titel.varianten",
    schritte: [
      am("varianten-neu", "tour.varianten.neu"),
      am("varianten-liste", "tour.varianten.liste"),
      am("varianten-pgn", "tour.varianten.pgn"),
    ],
  },
  variante: {
    titel: "tour.titel.variante",
    schritte: [
      am("variante-leiste", "tour.variante.leiste"),
      am("brett", "tour.variante.brett"),
      am("variante-kommentar", "tour.variante.kommentar"),
      am("variante-stift", "tour.variante.stift"),
      am("variante-baum", "tour.variante.baum"),
      am("variante-spielen", "tour.variante.spielen"),
    ],
  },
  // Stufe 2: die Karte des ganzen Baums.
  variantenkarte: {
    titel: "tour.titel.variantenkarte",
    schritte: [
      am("karte-flaeche", "tour.variantenkarte.flaeche"),
      am("karte-knoepfe", "tour.variantenkarte.knoepfe"),
    ],
  },
};

/** Die Tour zu einem Bildschirm der Ansicht „zusatz“; der Lernpfad hat seine eigene. */
export function zusatztour(kennung: string): Variantentour | "lernpfad" | null {
  if (
    kennung === "lernpfad" ||
    kennung === "varianten" ||
    kennung === "variante" ||
    kennung === "variantenkarte"
  )
    return kennung;
  return null;
}
