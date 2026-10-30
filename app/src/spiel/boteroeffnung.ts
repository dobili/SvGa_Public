/**
 * Feste Eröffnungen eigener Bots: Auswahl im Editor (umschalten, Schnellwahl aus dem
 * Variantenbaum), Wahl einer Eröffnung je Partie und die „Abweichung“ je Buchzug.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (Ideensammlung, freigegeben 30.10.2026): Ein eigener Bot
 * kann eine Liste fester Eröffnungen haben (Werte wie in der Eröffnungswahl: „praxis:Italian Game“
 * oder der Name einer Eröffnung des Buches) und eine Abweichung in Prozent (0: folgt immer, 100:
 * wie ohne Festlegung). Je Partie wählt er zufällig eine der Eröffnungen; je Buchzug verlässt er
 * sie mit der Wahrscheinlichkeit der Abweichung und eröffnet dann wie Menschen seiner Stärke
 * (EROEFFNUNG_PRAXIS, engine/praxisbuch.ts). Die globale Eröffnungswahl im Spielfenster hat
 * Vorrang, wenn der Leser den Haken „Eröffnung des Bots überschreiben“ setzt.
 * Gespeichert wird beim Gegner (speicher/gegner.ts); die Partie selbst bekommt kein neues Feld.
 * Abhängigkeiten: engine/gegner.ts (Typ), spiel/eroeffnungsbaender.ts (Typen), spiel/partie.ts.
 */
import type { EigenerGegner } from "../engine/gegner";
import type { Bandfamilie, Eroeffnungsbaender } from "./eroeffnungsbaender";
import { EROEFFNUNG_PRAXIS, PRAXIS_VORSILBE } from "./partie";

/** Höchstens so viele feste Eröffnungen je Bot (die Schnellwahl „alle“ bleibt darunter). */
export const MAX_BOTEROEFFNUNGEN = 40;
/** Längster gespeicherter Wert („praxis:“ und ein langer Lichess-Name). */
export const MAX_EROEFFNUNGSWERT = 120;
/** Grenzen und Schritt der Abweichung in Prozent. */
export const ABWEICHUNG_MIN = 0;
export const ABWEICHUNG_MAX = 100;
export const ABWEICHUNG_SCHRITT = 10;
/** Ohne gespeicherte Abweichung folgt der Bot seiner Eröffnung immer. */
export const ABWEICHUNG_VORGABE = 0;
/** Die Schnellwahl im Variantenbaum: die häufigsten 3 und 5 (null: alle). */
export const SCHNELLWAHL = [3, 5, null] as const;

/**
 * Schaltet einen Wert in der Liste um: vorhanden → weg, sonst hinten an (höchstens
 * MAX_BOTEROEFFNUNGEN). Beispiel: [] und „praxis:Italian Game“ → ["praxis:Italian Game"].
 */
export function umgeschaltet(liste: readonly string[], wert: string): readonly string[] {
  if (liste.includes(wert)) return liste.filter((w) => w !== wert);
  return liste.length >= MAX_BOTEROEFFNUNGEN ? liste : [...liste, wert];
}

/**
 * Die Werte der häufigsten Varianten einer Eröffnung, nach Anzahl absteigend; `anzahl` null: alle.
 * Beispiel: Italienisch, 3 → Giuoco Piano, Zweispringerspiel und die dritthäufigste Variante.
 */
export function haeufigsteVarianten(
  familie: Bandfamilie,
  anzahl: number | null,
): readonly string[] {
  const sortiert = [...familie.varianten].sort((a, b) => b.anzahl - a.anzahl);
  const werte = sortiert.map((v) => `${PRAXIS_VORSILBE}${v.name}`);
  return [...new Set(anzahl === null ? werte : werte.slice(0, anzahl))];
}

/**
 * Schnellwahl im Variantenbaum: Die Varianten dieser Eröffnung in der Liste werden durch die
 * häufigsten `anzahl` ersetzt (null: alle); andere Einträge bleiben, die Grenze gilt.
 * Beispiel: [London] und Italienisch, 3 → [London, Giuoco Piano, Zweispringerspiel, …].
 */
export function mitSchnellwahl(
  liste: readonly string[],
  familie: Bandfamilie,
  anzahl: number | null,
): readonly string[] {
  const alle = haeufigsteVarianten(familie, null);
  const uebrige = liste.filter((w) => !alle.includes(w));
  const neu = haeufigsteVarianten(familie, anzahl).filter((w) => !uebrige.includes(w));
  return [...uebrige, ...neu].slice(0, MAX_BOTEROEFFNUNGEN);
}

/** Eine Eröffnung zufällig aus der Liste, null bei leerer Liste. */
export function zufaelligeEroeffnung(
  liste: readonly string[],
  zufall: () => number,
): string | null {
  if (liste.length === 0) return null;
  return liste[Math.min(liste.length - 1, Math.floor(zufall() * liste.length))] ?? null;
}

/**
 * Die Eröffnung einer neuen Partie: Hat der Bot feste Eröffnungen und überschreibt der Leser sie
 * nicht, eine davon zufällig; sonst die globale Wahl des Spielfensters.
 * Beispiel: Bot mit [Italienisch, London], ohne Haken → eine der beiden; mit Haken → die Wahl.
 */
export function eroeffnungFuerPartie(
  lage: {
    readonly botEroeffnungen: readonly string[];
    readonly ueberschreiben: boolean;
    readonly global: string | null;
  },
  zufall: () => number,
): string | null {
  if (lage.ueberschreiben || lage.botEroeffnungen.length === 0) return lage.global;
  return zufaelligeEroeffnung(lage.botEroeffnungen, zufall) ?? lage.global;
}

/**
 * Die Abweichung, die in einer Partie gilt (Prozent): die des eigenen Bots, wenn die Eröffnung
 * der Partie eine seiner festen ist; sonst 0 (etwa bei überschriebener Wahl).
 * Sonderfall: Hat der Leser eine Eröffnung gewählt, die auch in der Liste des Bots steht, gilt die
 * Abweichung ebenfalls (die Partie kennt nur die Eröffnung, nicht, woher sie kam).
 */
export function abweichungDerPartie(
  gegner: EigenerGegner | undefined,
  eroeffnung: string | null,
): number {
  if (!gegner || eroeffnung === null || !gegner.eroeffnungen?.includes(eroeffnung)) return 0;
  return gegner.abweichung ?? ABWEICHUNG_VORGABE;
}

/**
 * Die Eröffnung für einen Buchzug: mit Wahrscheinlichkeit `abweichung` (Prozent) verlässt der Bot
 * seine feste Eröffnung und zieht wie Menschen seiner Stärke, sonst folgt er ihr.
 * Beispiel: Abweichung 0 → immer die Eröffnung; 100 → immer EROEFFNUNG_PRAXIS.
 */
export function mitAbweichung(
  eroeffnung: string | null,
  abweichung: number,
  zufall: () => number,
): string | null {
  if (eroeffnung === null || abweichung <= ABWEICHUNG_MIN) return eroeffnung;
  return zufall() * ABWEICHUNG_MAX < abweichung ? EROEFFNUNG_PRAXIS : eroeffnung;
}

/**
 * Der Name eines Wertes zur Anzeige: Buch-Eröffnungen wie gespeichert, Praxis-Eröffnungen ohne
 * Vorsilbe, auf Deutsch mit dem deutschen Namen der Eröffnung davor (wenn die Daten da sind).
 * Beispiel: „praxis:Italian Game: Evans Gambit“, deutsch → „Italienische Partie: Evans Gambit“.
 */
export function eroeffnungsname(
  wert: string,
  daten: Eroeffnungsbaender | null,
  deutsch: boolean,
): string {
  if (!wert.startsWith(PRAXIS_VORSILBE)) return wert;
  const name = wert.slice(PRAXIS_VORSILBE.length);
  if (!deutsch || !daten) return name;
  const familie = daten.familien.find((f) => name === f.name || name.startsWith(`${f.name}:`));
  return familie ? `${familie.nameDe}${name.slice(familie.name.length)}` : name;
}
