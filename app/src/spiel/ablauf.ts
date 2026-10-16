/**
 * Ablauf einer Partie mit Uhr: Zug spielen und Uhr drücken, Zeit prüfen, Pause und Fortsetzen.
 *
 * Rolle im Gesamtbild: Der Partie-Bildschirm ruft nur diese Funktionen auf; sie verbinden die
 * Partie (spiel/partie.ts) mit der Uhr (spiel/uhr.ts), damit beides immer zusammenpasst. Ohne Uhr
 * sind die Uhrfunktionen wirkungslos. Alle Funktionen sind rein und bekommen die Zeit übergeben.
 * Abhängigkeiten: spiel/partie.ts, spiel/uhr.ts.
 */
import { amZug, mitUhr, nimmZurueck, ziehe, zeitUeberschritten } from "./partie";
import type { Partie, Partiezug } from "./partie";
import { abgelaufen, druecke, halte, neueUhr, starte } from "./uhr";

/**
 * Spielt einen Zug und drückt die Uhr; endet die Partie, hält die Uhr an.
 *
 * Ausgabe: neue Partie oder null, wenn der Zug nicht geht. Beispiel: 15+10, Weiß zieht 1. e4 →
 * die Uhr von Schwarz läuft.
 */
export function zieheMitUhr(partie: Partie, zug: Partiezug, jetztMs: number): Partie | null {
  const gezogen = amZug(partie);
  const danach = ziehe(partie, zug);
  if (!danach || !danach.uhr || !partie.einstellung.uhr) return danach;
  const gedrueckt = druecke(danach.uhr, partie.einstellung.uhr, gezogen, jetztMs);
  return mitUhr(danach, danach.ende ? halte(gedrueckt, jetztMs) : gedrueckt);
}

/** Beendet die Partie, wenn die Zeit der laufenden Seite abgelaufen ist; sonst unverändert. */
export function pruefeZeit(partie: Partie, jetztMs: number): Partie {
  if (!partie.uhr || partie.ende) return partie;
  const verloren = abgelaufen(partie.uhr, jetztMs);
  if (!verloren) return partie;
  return mitUhr(zeitUeberschritten(partie, verloren), halte(partie.uhr, jetztMs));
}

/** Hält die Uhr an (App im Hintergrund, Bildschirm verlassen). */
export function pausiere(partie: Partie, jetztMs: number): Partie {
  return partie.uhr?.laeuft ? mitUhr(partie, halte(partie.uhr, jetztMs)) : partie;
}

/**
 * Lässt die Uhr der Seite am Zug weiterlaufen (Rückkehr zur Partie).
 *
 * Sonderfall: Vor dem ersten Zug und nach dem Ende bleibt die Uhr stehen.
 */
export function setzeUhrFort(partie: Partie, jetztMs: number): Partie {
  const uhr = partie.uhr;
  if (!uhr || uhr.laeuft || partie.ende || partie.zuege.length === 0) return partie;
  return mitUhr(partie, starte(uhr, amZug(partie), jetztMs));
}

/**
 * Rücknahme mit Uhr: Die Uhr des Lesers läuft danach weiter (die verbrauchte Zeit bleibt weg).
 *
 * Sonderfall: Geht die Rücknahme bis zur Startstellung, beginnt die Uhr von vorn (sonst behielte
 * die Engine den Zuschlag ihres zurückgenommenen Zuges).
 */
export function nimmZurueckMitUhr(partie: Partie, jetztMs: number): Partie | null {
  const zurueck = nimmZurueck(partie);
  const einstellung = partie.einstellung.uhr;
  if (!zurueck?.uhr || !einstellung) return zurueck;
  if (zurueck.zuege.length === 0) return mitUhr(zurueck, neueUhr(einstellung));
  return setzeUhrFort(pausiere(zurueck, jetztMs), jetztMs);
}
