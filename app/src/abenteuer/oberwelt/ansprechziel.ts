/**
 * Wer den Helden ansprechen darf (regeln/ansprechen.ts): nur die Figur, die das Ziel des laufenden
 * Hauptquestschritts ist, wie der Zielpfeil sie findet (zielsuche.ts, zielangabe, mit `umwege`).
 * Ausdrücklich die Hauptquests, nicht die verfolgte Quest: Der Pfeil zeigt nur auf Wunsch, das
 * Ansprechen gilt immer. Zwischen zwei Hauptquests gilt das Ziel aus „Was jetzt?“ (wasjetzt.ts,
 * etwa Juno an der Bushaltestelle). Nebenquests und Statisten sprechen nie von selbst an.
 *
 * Ein Schritt mit `ansprechen: false` (quests.json, mit `ansprechenGrund`) schaltet es ab. Ist das
 * Ziel ein Ding (Brett, Tür), gibt es keinen Eintrag mit Figur auf der Karte, und es geschieht
 * nichts (die Szene findet keine Figur dieses Namens).
 * Rolle im Gesamtbild: gelesen von useAnsprechen.ts. Abhängigkeiten: zielsuche.ts,
 * regeln/ansprechen.ts, daten/laden.ts.
 */
import type { Spieldaten } from "../daten/laden";
import { ansprechschluessel } from "../regeln/ansprechen";
import type { Abenteuerstand } from "../schnittstelle/spielstand";
import { lueckenziel, zielangabe, type Zielangabe } from "./zielsuche";

/** Eine Figur, die ansprechen darf, und ihr Schlüssel im Merker. */
export interface Ansprechziel {
  readonly figur: string;
  readonly schluessel: string;
}

/** Liegt die Zielangabe auf dieser Karte (oder ohne Karte in diesem Ort)? Nur mit Objekt. */
function hier(angabe: Zielangabe | null, karte: string, ort: string): angabe is Zielangabe {
  if (!angabe?.objekt) return false;
  if (angabe.karte) return angabe.karte === karte;
  return !angabe.ort || angabe.ort === ort;
}

/**
 * Die Figuren auf dieser Karte, die den Helden jetzt ansprechen dürfen.
 * Eingaben: Spielstand, Spieldaten, Kennung der Karte und des Orts.
 * Beispiel: erster Abend, Schritt 0 (Ziel Mama im Wohnzimmer) → [{ figur: "mutter",
 * schluessel: "mapleFalls.ersterAbend#0:mutter" }] im Wohnzimmer, [] auf jeder anderen Karte.
 * Sonderfälle: Keine Hauptquest läuft → das Ziel der Lücke (Schlüssel ohne Schritt); ein Schritt
 * mit `ansprechen: false` zählt nicht.
 */
export function ansprechziele(
  stand: Abenteuerstand,
  daten: Spieldaten,
  karte: string,
  ort: string,
): Ansprechziel[] {
  const haupt = stand.quests.flatMap((q) => {
    const d = daten.quests.find((x) => x.kennung === q.kennung);
    return !q.erledigt && d?.haupt ? [{ q, schritt: d.schritte[q.schritt] }] : [];
  });
  if (haupt.length === 0) {
    const luecke = lueckenziel(stand.dialogvariablen);
    if (!luecke || !hier(luecke.angabe, karte, ort)) return [];
    const figur = luecke.angabe.objekt ?? "";
    return [{ figur, schluessel: ansprechschluessel(luecke.luecke, null, figur) }];
  }
  return haupt.flatMap(({ q, schritt }) => {
    if (!schritt || schritt.ansprechen === false) return [];
    const angabe = zielangabe(schritt, daten, stand.dialogvariablen);
    if (!hier(angabe, karte, ort)) return [];
    const figur = angabe.objekt ?? "";
    return [{ figur, schluessel: ansprechschluessel(q.kennung, q.schritt, figur) }];
  });
}
