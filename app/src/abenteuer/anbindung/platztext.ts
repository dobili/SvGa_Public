/**
 * Texte zu einem Speicherplatz im Hauptmenü und in der Ladeliste: Akt, Ort, Spielzeit, Nadeln,
 * zuletzt gespielt (Wunsch des Autors, 27.11.2026: Liste mit Name, Akt und Ort, Spielzeit), dazu der
 * Zeitpunkt einer Sicherung (28.11.2026).
 *
 * Rolle im Gesamtbild: reine Funktionen für Hauptmenue.tsx, damit die Liste ohne Oberfläche
 * getestet werden kann. Der Ort ist der Ort der Karte, auf der der Held steht (Kennung vor dem
 * Punkt, „riverton.aussen“ → Riverton), in der Sprache des Spiels.
 * Abhängigkeiten: i18n (Oberflächentexte), texte/texte.ts (Ortsnamen), schnittstelle/spielstand.ts.
 */
import { datumText, t, tZahl, uhrzeitText } from "../../i18n/sprache";
import type { Abenteuerstand } from "../schnittstelle/spielstand";
import { tSpiel } from "../texte/texte";

/** Akt nach dem Finale (Handlungsstand.akt, Post-Game). */
const NACHSPIEL = 5;
const SEKUNDEN_JE_MINUTE = 60;
const MINUTEN_JE_STUNDE = 60;

/** Der Akt als Text. Beispiel: 2 → „Akt 2“; 5 → „Nach dem Finale“. */
export function akttext(akt: number): string {
  return akt >= NACHSPIEL ? t("abenteuer.platz.nachspiel") : t("abenteuer.platz.akt", { akt });
}

/**
 * Der Ort des Helden als Name. Beispiel: Karte „wegMapleCedar.mitte“ → „Landstraße nach Cedar
 * Creek“. Sonderfall: Ein Ort ohne Namen im Spieltext zeigt seine Kennung.
 */
export function orttext(stand: Abenteuerstand): string {
  const ort = stand.position.karte.split(".")[0] ?? "";
  const schluessel = `ort.${ort}.name`;
  const name = tSpiel(schluessel);
  return name === schluessel ? ort : name;
}

/** Spielzeit als Text. Beispiel: 11 100 s → „3 Std. 5 Min.“; 300 s → „5 Min.“; unter einer Minute „0 Min.“. */
export function spielzeittext(sekunden: number): string {
  const minuten = Math.floor(Math.max(0, sekunden) / SEKUNDEN_JE_MINUTE);
  const stunden = Math.floor(minuten / MINUTEN_JE_STUNDE);
  const rest = minuten % MINUTEN_JE_STUNDE;
  return stunden > 0
    ? t("abenteuer.platz.spielzeitStunden", { stunden, minuten: rest })
    : t("abenteuer.platz.spielzeitMinuten", { minuten: rest });
}

/** Zahl der Clubnadeln als Text. Beispiel: 0 → „Noch keine Clubnadel“, 1 → „1 Clubnadel“. */
export function nadeltext(stand: Abenteuerstand): string {
  const anzahl = stand.clubs.filter((c) => c.nadel !== null).length;
  return tZahl("abenteuer.platz.nadeln", anzahl, { anzahl });
}

/** Zuletzt gespielt als Text. Beispiel: „2026-11-27T09:00:00Z“ → „Zuletzt gespielt am 27.11.2026“. */
export function zuletzttext(iso: string): string {
  return t("abenteuer.platz.zuletzt", { datum: datumText(new Date(iso)) });
}

/** Zeitpunkt einer Sicherung als Text. Beispiel: „2026-11-28T13:05:00Z“ → „28.11.2026, 14:05“ (Berlin). */
export function gesichertzeit(iso: string): string {
  const zeit = new Date(iso);
  return t("abenteuer.sicherung.zeit", { datum: datumText(zeit), uhrzeit: uhrzeitText(zeit) });
}

/** Die Kurzzeile unter dem Namen. Beispiel: „Akt 2 · Riverton · 3 Std. 5 Min.“. */
export function platzzeile(stand: Abenteuerstand): string {
  return [akttext(stand.handlung.akt), orttext(stand), spielzeittext(stand.spielzeitSekunden)].join(
    " · ",
  );
}
