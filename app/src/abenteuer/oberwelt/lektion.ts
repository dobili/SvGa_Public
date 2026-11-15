/**
 * Lektion einer Begegnung: das Gegnerprofil nur für diese Partie anpassen (begegnungen.json,
 * Feld `lektion`; Spieltest „einstieg“, R2, 15.11.2026).
 *
 * Rolle im Gesamtbild: Ambrose spielt in seiner ersten Lektion nicht mit der Wertung des Lesers
 * (600, Stufe 2), weil er dort das Schäfermatt in vier Zügen zuließ und die hängende Dame nicht
 * nahm: Das Kind lernte, dass man die Dame ungestraft früh herausbringt. Mit fester, leichter
 * Stärke, ohne die Fehler „Drohung übersehen“ und „Schlag verpasst“ und mit Höchstverlusten der
 * Zusatzfehler bestraft er hängende Figuren und lässt kein Matt in einem Zug zu, stellt aber selbst
 * Figuren ein (Gewicht „figurHaengen“). Gemessen mit der echten Engine (15.11.2026, je 40 Würfe):
 * nach 1. e4 e5 2. Dh5 Sc6 3. Lc4 ließ das alte Profil in 9 Fällen Dxf7# zu, das neue in keinem;
 * die freie Dame nach 1. e4 d5 2. Dg4 nahm das alte in 16, das neue in 40 Fällen.
 * Das Profil des Gegners in gegner.json bleibt, wie es ist (Reisebrett, spätere Partien).
 * Abhängigkeiten: engine/fehlerart-typen.ts (Liste der Fehlerarten), schnittstelle/gegnerprofil.ts.
 */
import { FEHLERARTEN, type Fehlerart } from "../../engine/fehlerart-typen";
import type { Begegnungsdaten } from "../daten/laden";
import type { Gegnerprofil } from "../schnittstelle/gegnerprofil";

/** Die Lektion einer Begegnung, wie das Schema sie beschreibt. */
export type Lektion = NonNullable<Begegnungsdaten["lektion"]>;

/** Höchstverluste je Art: genannte Arten, sonst `hoechstverlustSonst` für alle übrigen. */
function hoechstverlustAus(lektion: Lektion): Partial<Record<Fehlerart, number>> | undefined {
  const genannt = lektion.hoechstverlust ?? {};
  const sonst = lektion.hoechstverlustSonst;
  if (sonst === undefined && Object.keys(genannt).length === 0) return undefined;
  const ergebnis: Partial<Record<Fehlerart, number>> = {};
  for (const art of FEHLERARTEN) {
    const wert = genannt[art] ?? sonst;
    if (wert !== undefined) ergebnis[art] = wert;
  }
  return ergebnis;
}

/**
 * Das Profil des Gegners für eine Begegnung mit Lektion.
 *
 * Eingaben: Profil aus gegner.json, Lektion der Begegnung (fehlend: das Profil unverändert).
 * Ausgabe: Profil mit fester Zielstärke, zusammengeführten Gewichten (die der Lektion gewinnen),
 * Höchstverlusten und, falls angegeben, ohne Maia.
 * Beispiel: Ambrose (aktuell + 0, ungenau 1,2) mit Lektion { staerke 750, figurHaengen 3,
 * drohungIgnoriert 0, hoechstverlustSonst 2 } → Ziel 750, Gewichte { ungenau 1,2, figurHaengen 3,
 * drohungIgnoriert 0 }, Höchstverlust 2 Bauern je Art außer den genannten.
 */
export function profilDerLektion(profil: Gegnerprofil, lektion: Lektion | undefined): Gegnerprofil {
  if (!lektion) return profil;
  const hoechstverlust = hoechstverlustAus(lektion);
  const gewichte = lektion.gewichte
    ? ({ ...profil.gewichte, ...lektion.gewichte } as Gegnerprofil["gewichte"])
    : profil.gewichte;
  return {
    ...profil,
    ...(lektion.staerke ? { staerke: lektion.staerke } : {}),
    ...(gewichte ? { gewichte } : {}),
    ...(hoechstverlust ? { hoechstverlust } : {}),
    ...(lektion.menschlich !== undefined ? { menschlich: lektion.menschlich } : {}),
  };
}
