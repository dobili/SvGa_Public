/**
 * Die Zeichen der drei Zeitarten Blitz, Schnellschach und Klassisch an einer Stelle.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (25.10.2026): Dieselben Zeichen wie in der Bedenkzeit-
 * Auswahl (ZeitWahl.tsx, Blitz, Stoppuhr, Kaffeetasse) sollen auch die Siegmarken am Porträt
 * (GegnerBild.tsx), die Ringe der besiegten Bots im Profil (Fortschrittsuebersicht.tsx) und die
 * Zeitangabe der Partienliste tragen. Eine gemeinsame Tabelle verhindert, dass die Stellen
 * auseinanderlaufen. Dazu der vorlesbare Name einer Liste von Zeitarten („Blitz und Klassisch“).
 * Abhängigkeiten: spiel/elomodell.ts (Wertungstempo), i18n, lucide-react.
 */
import { Coffee, Timer, Zap, type LucideIcon } from "lucide-react";
import { sprache, t } from "../../../i18n/sprache";
import { WERTUNGSTEMPI, type Wertungstempo } from "../../../spiel/elomodell";

/** Zeichen je Zeitart: Blitz für Blitz, Stoppuhr für Schnellschach, Kaffeetasse für Klassisch. */
export const ZEITARTZEICHEN: Readonly<Record<Wertungstempo, LucideIcon>> = {
  blitz: Zap,
  rapid: Timer,
  classical: Coffee,
};

/** Der Name einer Zeitart: „Blitz“, „Schnellschach“, „Klassisch“. */
export function zeitartname(tempo: Wertungstempo): string {
  return t(`spielstaerke.zeitklasse.${tempo}`);
}

/**
 * Die Zeitarten als vorlesbare Aufzählung in fester Reihenfolge (Blitz, Schnellschach,
 * Klassisch), unabhängig von der Reihenfolge der Eingabe.
 * Beispiel: ["classical", "blitz"] → „Blitz und Klassisch“ (Englisch „Blitz and Classical“).
 */
export function zeitartenText(tempi: readonly Wertungstempo[]): string {
  const namen = WERTUNGSTEMPI.filter((tempo) => tempi.includes(tempo)).map(zeitartname);
  return new Intl.ListFormat(sprache(), { style: "long", type: "conjunction" }).format(namen);
}
