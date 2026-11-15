/**
 * Text der Karte „Schach-Abenteuer“ auf der Seite „Spielen“ (Abenteuerkarte.tsx), ausgelagert,
 * damit er sich ohne Oberfläche prüfen lässt.
 * Abhängigkeiten: i18n/sprache.ts.
 */
import { t } from "../../i18n/sprache";

/**
 * Satz der Karte mit Spielstand. Ohne eigenen Namen heißt der Held „Du“; „Dein Abenteuer wartet,
 * Du.“ las sich falsch (Funktionstest N2617, 15.11.2026), dann also ohne Anrede.
 * Beispiel: „Kim“ → „Dein Abenteuer wartet, Kim.“; „Du“ → „Dein Abenteuer wartet.“
 */
export function weiterText(name: string): string {
  const ohneName = name.trim() === "" || name === t("abenteuer.heldname");
  return ohneName ? t("abenteuer.karteWeiterOhneName") : t("abenteuer.karteWeiter", { name });
}
