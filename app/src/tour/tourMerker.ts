/**
 * Merker der Touren auf dem Gerät: Rundgang angeboten, Symbol aus, gesehene Touren.
 *
 * Rolle im Gesamtbild: Leitlinie des Autors zu R52: nur Merker auf dem Gerät (app/merker.ts),
 * kein neues Speicherformat der Nutzerdaten und nichts in der Datensicherung. Geht ein Merker
 * verloren, fragt die App schlimmstenfalls noch einmal oder zeigt den goldenen Punkt wieder.
 * Wer einen Merker ändert, benachrichtigt alle Abonnenten (useTourMerker), damit Symbol und
 * Schalter sofort folgen.
 * Abhängigkeiten: app/merker.ts, React (useSyncExternalStore), touren.ts (Kennungen).
 */
import { useSyncExternalStore } from "react";
import { liesMerker, schreibeMerker } from "../app/merker";
import type { TourKennung } from "./touren";

/** Der Rundgang wurde beim ersten Start einmal angeboten (gleich, wie die Antwort war). */
export const MERKER_ANGEBOTEN = "tour.angeboten";
/** „aus“: Das Toursymbol ist in den Einstellungen dauerhaft ausgeschaltet. */
export const MERKER_SYMBOL = "tour.symbol";
/** Kennungen der gesehenen Touren, durch Komma getrennt, etwa „haupt,abbildung“. */
export const MERKER_GESEHEN = "tour.gesehen";

/** Was Symbol, Hinweis und Schalter über die Touren wissen. */
export interface Tourmerker {
  readonly angeboten: boolean;
  readonly symbolAn: boolean;
  readonly gesehen: ReadonlySet<string>;
}

const abonnenten = new Set<() => void>();
let stand: Tourmerker | null = null;

/** Liest alle drei Merker neu vom Gerät. */
function lies(): Tourmerker {
  const gesehen = (liesMerker(MERKER_GESEHEN) ?? "").split(",").filter((k) => k !== "");
  return {
    angeboten: liesMerker(MERKER_ANGEBOTEN) === "ja",
    symbolAn: liesMerker(MERKER_SYMBOL) !== "aus",
    gesehen: new Set(gesehen),
  };
}

/** Der aktuelle Stand; dasselbe Objekt, bis sich ein Merker ändert (für useSyncExternalStore). */
export function tourmerker(): Tourmerker {
  stand ??= lies();
  return stand;
}

function geaendert(): void {
  stand = lies();
  abonnenten.forEach((abonnent) => abonnent());
}

function abonniere(abonnent: () => void): () => void {
  abonnenten.add(abonnent);
  return () => abonnenten.delete(abonnent);
}

/** Der Stand der Merker für eine Komponente; sie zeichnet neu, wenn sich einer ändert. */
export function useTourMerker(): Tourmerker {
  return useSyncExternalStore(abonniere, tourmerker, tourmerker);
}

/** Merkt sich, dass der Rundgang angeboten wurde: Die Frage kommt nicht wieder. */
export function merkeAngeboten(): void {
  schreibeMerker(MERKER_ANGEBOTEN, "ja");
  geaendert();
}

/** Schaltet das Toursymbol an oder aus (Einstellungen › Reiter „Hilfe“). */
export function setzeSymbol(an: boolean): void {
  schreibeMerker(MERKER_SYMBOL, an ? "an" : "aus");
  geaendert();
}

/** Merkt sich eine Tour als gesehen; der goldene Punkt am Symbol verschwindet. */
export function merkeGesehen(kennung: TourKennung): void {
  const gesehen = tourmerker().gesehen;
  if (gesehen.has(kennung)) return;
  schreibeMerker(MERKER_GESEHEN, [...gesehen, kennung].join(","));
  geaendert();
}
