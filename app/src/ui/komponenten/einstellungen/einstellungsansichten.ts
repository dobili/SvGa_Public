/**
 * Die Unterseiten der Einstellungen als Bildschirme der Ansicht „zusatz“.
 *
 * Rolle im Gesamtbild: app/zusatzansichten.ts nimmt sie mit einer Zeile auf; je Eintrag in
 * `EINSTELLUNGSSEITEN` (einstellungsseiten.ts) entsteht ein Bildschirm mit Kopfzeile
 * (Seitenliste.tsx, `Unterseite`). Eine neue Unterseite braucht hier nichts (eintragen statt
 * umbauen).
 * Abhängigkeiten: einstellungsseiten, Seitenliste, React.
 */
import { createElement, type ComponentType } from "react";
import { EINSTELLUNGSSEITEN } from "./einstellungsseiten";
import { Unterseite } from "./Seitenliste";

/** Kennung und Bildschirm je Unterseite. Beispiel: „einstellungen-ueber“ → „Über die App“. */
export const EINSTELLUNGSANSICHTEN: readonly {
  readonly kennung: string;
  readonly Bildschirm: ComponentType<{ readonly wert: string | null }>;
}[] = EINSTELLUNGSSEITEN.map(({ kennung }) => ({
  kennung,
  Bildschirm: () => createElement(Unterseite, { kennung }),
}));
