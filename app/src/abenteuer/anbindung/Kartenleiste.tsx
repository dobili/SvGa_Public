/**
 * Die Kartenleiste des Abenteuers unter dem Brett: Erweiterungspunkt der Partieansicht
 * (Entscheidung A4, ui/komponenten/partie/partieerweiterungen.ts).
 *
 * Rolle im Gesamtbild: Im Prototyp (Schritt 5) zeigt sie nur, dass die Partie zum Abenteuer
 * gehört, und erinnert an den Rückweg; die Karten selbst (Fingerzeig, Gefahrenradar, Zweite
 * Chance, Flüstern, Mentor-Zug) kommen mit den Spielsystemen (Schritt 8, Baustein F3) und
 * nutzen dann die Partiesteuerung. Gehört zum Kern der App (klein), nicht zum Baustein.
 * Abhängigkeiten: schnittstelle/modul.ts (Typ), i18n.
 */
import type { Partieerweiterung } from "../schnittstelle/modul";
import { KartenleisteAnzeige } from "./KartenleisteAnzeige";

/** Der Eintrag für die Liste der Partie-Erweiterungen. */
export const abenteuerErweiterung: Partieerweiterung = {
  kennung: "abenteuer",
  passt: (einstellung) => einstellung.abenteuer !== undefined,
  Leiste: KartenleisteAnzeige,
};
