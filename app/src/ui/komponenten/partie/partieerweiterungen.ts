/**
 * Erweiterungen der Partieansicht: Leisten unter dem Brett, die Pakete eintragen, ohne Partie.tsx
 * zu ändern (Muster wie app/zusatzansichten.ts; Entscheidung A4 des Autors, 07.11.2026).
 *
 * Rolle im Gesamtbild: Die Partieansicht ist der dichteste Bildschirm der App. Statt sie für
 * jedes Paket umzubauen, prüft sie je Partie die Liste: Jede Erweiterung sagt mit `passt`, ob
 * sie zu dieser Partie gehört (etwa nur zu Partien des Schach-Abenteuers), und bekommt dann
 * ihren Platz unter dem Spielfeld.
 * Abhängigkeiten: abenteuer/schnittstelle/modul.ts (Typ), abenteuer/anbindung/Kartenleiste.tsx.
 */
import { abenteuerErweiterung } from "../../../abenteuer/anbindung/Kartenleiste";
import type { Partieerweiterung } from "../../../abenteuer/schnittstelle/modul";
import type { Partieeinstellung } from "../../../spiel/partie";

/** Alle Erweiterungen; Pakete fügen je eine Zeile an. */
export const PARTIE_ERWEITERUNGEN: readonly Partieerweiterung[] = [abenteuerErweiterung];

/** Die Erweiterungen, die zu dieser Partie passen. */
export function passendeErweiterungen(
  einstellung: Partieeinstellung,
  liste: readonly Partieerweiterung[] = PARTIE_ERWEITERUNGEN,
): Partieerweiterung[] {
  return liste.filter((e) => e.passt(einstellung));
}
