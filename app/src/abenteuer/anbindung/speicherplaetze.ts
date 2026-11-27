/**
 * Speicherplätze des Abenteuers: beliebig viele Spielstände, einer davon wird gespielt (Wunsch
 * des Autors, 27.11.2026: „mehrere Speicherstände, beliebig viele wäre wohl besser“).
 *
 * Rolle im Gesamtbild: Der gespielte Stand liegt wie bisher im Feld `abenteuer` der Nutzerdaten;
 * Oberwelt, Partie, Aufgabenrunde, zwei Tabs und Sicherung arbeiten unverändert mit ihm. Die
 * übrigen ruhen in `abenteuerplaetze` (schnittstelle/spielstand.ts, Ruheplatz). Das Hauptmenü
 * (Hauptmenue.tsx) wechselt über diese reinen Funktionen: Neues Spiel und Laden legen den
 * gespielten Stand zur Ruhe, Löschen nimmt einen Platz weg. Der bisherige eine Stand ist ohne
 * Umwandlung der erste Platz.
 * Kennung eines Platzes ist der Beginn seines Stands (`begonnen`); ihn tragen auch die Partien
 * des Platzes (Partieeinstellung `abenteuer.spielstand`, dienste.ts), damit Tagebuch und Rückweg
 * die Partien der Plätze trennen.
 * Die App hält nur eine laufende Partie. Geht ein Stand mitten in einer Partie zur Ruhe, nimmt
 * sein Platz die Partie mit und gibt sie beim Laden zurück.
 * Abhängigkeiten: speicher/format.ts (Typ Nutzerdaten), spiel/partie.ts (Typ), schnittstelle/spielstand.ts.
 */
import type { Nutzerdaten } from "../../speicher/format";
import type { Partie } from "../../spiel/partie";
import type { Abenteuerstand } from "../schnittstelle/spielstand";

/** Der Teil der Nutzerdaten, den ein Wechsel des Platzes ändert. */
export type Platzdaten = Pick<Nutzerdaten, "abenteuer" | "abenteuerplaetze" | "spiel">;

/** Eine Zeile der Ladeliste im Hauptmenü. */
export interface Platzzeile {
  /** Kennung des Platzes (Beginn des Stands). */
  readonly kennung: string;
  readonly stand: Abenteuerstand;
  /** Der Stand, der gerade gespielt wird (Feld `abenteuer`). */
  readonly aktiv: boolean;
  /** Zuletzt gespielt (ISO), sonst der Beginn. */
  readonly zuletzt: string;
}

/** Kennung des Platzes eines Stands. Beispiel: Beginn „2026-11-27T09:00:00.000Z“ → dieselbe Zeichenkette. */
export function platzkennung(stand: Abenteuerstand): string {
  return stand.begonnen;
}

/**
 * Gehört die Partie zum Stand? Mit Platzangabe genau dann, wenn sie gleich ist; ältere Partien
 * ohne Angabe gehören zu dem Stand, der gerade ihre Begegnung spielt.
 */
export function gehoertZumStand(partie: Partie, stand: Abenteuerstand): boolean {
  const teil = partie.einstellung.abenteuer;
  if (!teil) return false;
  if (teil.spielstand !== undefined) return teil.spielstand === platzkennung(stand);
  return stand.laufendePartie === teil.kennung;
}

/**
 * Alle Plätze für die Ladeliste: der gespielte zuerst, dann die übrigen, zuletzt gespielte zuerst.
 * Beispiel: gespielt Kim (Akt 2), ruhend Alex (gestern) und Sam (letzte Woche) → Kim, Alex, Sam.
 */
export function platzliste(d: Pick<Platzdaten, "abenteuer" | "abenteuerplaetze">): Platzzeile[] {
  const zeile = (stand: Abenteuerstand, aktiv: boolean): Platzzeile => ({
    kennung: platzkennung(stand),
    stand,
    aktiv,
    zuletzt: stand.zuletztGespielt ?? stand.begonnen,
  });
  const ruhend = d.abenteuerplaetze
    .map((p) => zeile(p.stand, false))
    .sort((a, b) => b.zuletzt.localeCompare(a.zuletzt));
  return d.abenteuer ? [zeile(d.abenteuer, true), ...ruhend] : ruhend;
}

/** Legt den gespielten Stand mit seiner laufenden Partie zur Ruhe; ohne gespielten Stand unverändert. */
export function mitRuhendemStand<T extends Platzdaten>(d: T): T {
  const aktiv = d.abenteuer;
  if (!aktiv) return d;
  const laufend = d.spiel.laufend;
  const seine = laufend && gehoertZumStand(laufend, aktiv) ? laufend : null;
  const andere = d.abenteuerplaetze.filter((p) => platzkennung(p.stand) !== platzkennung(aktiv));
  return {
    ...d,
    abenteuer: null,
    abenteuerplaetze: [{ stand: aktiv, laufend: seine }, ...andere],
    spiel: seine ? { ...d.spiel, laufend: null } : d.spiel,
  };
}

/**
 * Lädt einen ruhenden Platz: Der gespielte Stand ruht, der gewählte wird gespielt, seine Partie
 * wird wieder die laufende der App.
 * Sonderfälle: Unbekannte Kennung oder schon gespielt: unverändert. Läuft in der App gerade eine
 * freie Partie (ohne Abenteuer), bleibt sie, und die Partie des Platzes entfällt; die Oberwelt
 * bietet dann wie nach einer verlorenen Partie die Aufgabe an (Fortsetzungen.tsx).
 */
export function mitGeladenemPlatz<T extends Platzdaten>(d: T, kennung: string): T {
  if (d.abenteuer && platzkennung(d.abenteuer) === kennung) return d;
  const ruhend = mitRuhendemStand(d);
  const platz = ruhend.abenteuerplaetze.find((p) => platzkennung(p.stand) === kennung);
  if (!platz) return d;
  const laufend = ruhend.spiel.laufend ?? platz.laufend;
  return {
    ...ruhend,
    abenteuer: platz.stand,
    abenteuerplaetze: ruhend.abenteuerplaetze.filter((p) => p !== platz),
    spiel: laufend === ruhend.spiel.laufend ? ruhend.spiel : { ...ruhend.spiel, laufend },
  };
}

/**
 * Beginnt ein neues Spiel auf einem neuen Platz; der gespielte Stand ruht.
 * Sonderfall: Hat schon ein Platz denselben Beginn (zwei Spiele in derselben Millisekunde, nur in
 * Tests), rückt der Beginn des neuen um Millisekunden vor, damit die Kennungen verschieden bleiben.
 */
export function mitNeuemSpiel<T extends Platzdaten>(d: T, neu: Abenteuerstand): T {
  const ruhend = mitRuhendemStand(d);
  const belegt = new Set(ruhend.abenteuerplaetze.map((p) => platzkennung(p.stand)));
  let beginn = new Date(neu.begonnen).getTime();
  while (belegt.has(new Date(beginn).toISOString())) beginn += 1;
  return { ...ruhend, abenteuer: { ...neu, begonnen: new Date(beginn).toISOString() } };
}

/**
 * Löscht einen Platz endgültig. Ist es der gespielte, gibt es danach keinen gespielten Stand, und
 * seine laufende Partie wird aufgegeben (aus der App genommen, nicht gewertet).
 * Beispiel: Plätze Kim (gespielt) und Alex; Löschen von Kim → kein gespielter, Alex ruht weiter.
 */
export function ohnePlatz<T extends Platzdaten>(d: T, kennung: string): T {
  const aktiv = d.abenteuer;
  if (aktiv && platzkennung(aktiv) === kennung) {
    const laufend = d.spiel.laufend;
    const weg = laufend !== null && gehoertZumStand(laufend, aktiv);
    return { ...d, abenteuer: null, spiel: weg ? { ...d.spiel, laufend: null } : d.spiel };
  }
  const plaetze = d.abenteuerplaetze.filter((p) => platzkennung(p.stand) !== kennung);
  return plaetze.length === d.abenteuerplaetze.length ? d : { ...d, abenteuerplaetze: plaetze };
}

/** Der Platz, den „Fortsetzen“ öffnet: der gespielte, sonst der zuletzt gespielte ruhende; null ohne Plätze. */
export function fortsetzbarerPlatz(
  d: Pick<Platzdaten, "abenteuer" | "abenteuerplaetze">,
): Platzzeile | null {
  return platzliste(d)[0] ?? null;
}
