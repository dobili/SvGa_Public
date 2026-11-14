/**
 * Kontext der Sprechblasen am Brett (docs/spiel/29_Tischgespraech.md, Abschnitt 2): Wer sprechen
 * will, holt sich hier die Steuerung; der Rahmen mit dem Stand steht in anbindung/Tischblase.tsx.
 *
 * Rolle im Gesamtbild: getrennt von der Komponente, damit Tischblase.tsx nur Komponenten
 * exportiert. Partiemomente, Schutzengel, Karten und das Tischgespräch nutzen useTischblasen(),
 * der Kopf der Hülle useKopfstimmung().
 * Abhängigkeiten: anbindung/tischblasen.ts (Typen).
 */
import { createContext, useContext } from "react";
import type { Blasenstand, Blasenzeile, Lage } from "./tischblasen";

/** Was die Sprecher brauchen: den Stand, Zeile zeigen, Zeile schließen. */
export interface Blasensteuerung {
  readonly stand: Blasenstand;
  readonly zeige: (zeile: Blasenzeile) => void;
  readonly schliesse: (lage: Lage, schluessel: string) => void;
}

/** Der Kontext; ohne Rahmen null. */
export const TischKontext = createContext<Blasensteuerung | null>(null);

/**
 * Die Steuerung der Blasen oder null außerhalb der Spielhülle (etwa die Kartenleiste im
 * Partie-Bildschirm der App: Sie zeigt ihre Zeilen dann wie bisher in der Leiste).
 */
export function useTischblasen(): Blasensteuerung | null {
  return useContext(TischKontext);
}

/**
 * Stimmung für das Porträt im Kopf der Hülle: die der oberen Zeile, wenn dort dieselbe Figur
 * spricht; sonst null (Grundfassung). Beispiel: Jo lacht in der Blase → Jo lacht auch im Kopf.
 */
export function useKopfstimmung(sprecher: string | null): string | null {
  const oben = useContext(TischKontext)?.stand.oben[0];
  return oben && sprecher && oben.sprecher === sprecher ? oben.stimmung : null;
}
