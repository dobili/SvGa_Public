/**
 * Einstiege in Dialogknoten für den Planer des Spieler-Durchlaufs: Welche Figur oder welcher
 * Auslöser führt zu einem Knoten, den ein Questschritt verlangt?
 *
 * Warum: Viele Questschritte nennen einen Knoten mitten im Gespräch (etwa
 * maple-falls-clubraum.victor_ambrose). Der Zielhinweis des Spiels zeigt dann nur auf die Karte,
 * nicht auf die Figur; ein Mensch liest den Questtext und spricht den Coach an. Der Durchlauf
 * liest dafür die Ink-Quellen: Er folgt den Verweisen („-> knoten“) von den Einstiegen der
 * Figuren und Auslöser aus und findet so, wer zum gesuchten Knoten führen kann.
 * Abhängigkeiten: inhalte/abenteuer/dialoge/de/*.ink, welt.ts.
 * Beispiel: einstiegeZu(daten, "maple-falls-clubraum.victor_ambrose") → [{ ort: "mapleFalls",
 * name: "coachDelgado" }].
 */
import { readFileSync } from "node:fs";
import type { Spieldaten } from "./welt";

const DIALOGE = new URL("../../../inhalte/abenteuer/dialoge/de/", import.meta.url);

/** Ein Einstieg: Ort, Karte (falls der Auslöser an einer Karte hängt) und Name des Dings. */
export interface Einstieg {
  readonly ort: string;
  readonly karte?: string;
  readonly name: string;
}

/** Je Ink-Datei: Knoten und die Knoten, auf die er verweist. */
const verweise = new Map<string, Map<string, Set<string>>>();

/** Liest die Verweise einer Ink-Datei (gemerkt); fehlt die Datei, eine leere Karte. */
function verweiseVon(datei: string): Map<string, Set<string>> {
  const bekannt = verweise.get(datei);
  if (bekannt) return bekannt;
  const karte = new Map<string, Set<string>>();
  let quelle: string;
  try {
    quelle = readFileSync(new URL(`${datei}.ink`, DIALOGE), "utf8");
  } catch {
    // Kein Dialog mit diesem Namen: Dann führt auch niemand dorthin.
    verweise.set(datei, karte);
    return karte;
  }
  let knoten = "";
  for (const zeile of quelle.split("\n")) {
    const kopf = /^===\s*(\w+)\s*===/.exec(zeile);
    if (kopf) {
      knoten = kopf[1] ?? "";
      karte.set(knoten, new Set());
      continue;
    }
    for (const treffer of zeile.matchAll(/->\s*(\w+)/g)) {
      if (knoten && treffer[1] && treffer[1] !== "END") karte.get(knoten)?.add(treffer[1]);
    }
  }
  verweise.set(datei, karte);
  return karte;
}

/** Führt in dieser Datei ein Weg von `von` nach `nach`? */
function erreicht(datei: string, von: string, nach: string): boolean {
  const karte = verweiseVon(datei);
  const offen = [von];
  const gesehen = new Set(offen);
  for (let i = 0; i < offen.length; i++) {
    if (offen[i] === nach) return true;
    for (const n of karte.get(offen[i] as string) ?? []) {
      if (!gesehen.has(n)) {
        gesehen.add(n);
        offen.push(n);
      }
    }
  }
  return false;
}

/**
 * Alle Figuren und Auslöser, deren Gespräch zum Knoten `verweis` („datei.knoten“) führen kann.
 * Sonderfall: Verweise über Dateigrenzen kennt Ink hier nicht; dann bleibt die Liste leer.
 */
export function einstiegeZu(daten: Spieldaten, verweis: string): Einstieg[] {
  const [datei, knoten] = verweis.split(".", 2);
  if (!datei || !knoten) return [];
  const liste: Einstieg[] = [];
  for (const ort of daten.orte) {
    for (const f of ort.figuren) {
      const [d, k] = f.dialog.split(".", 2);
      if (d === datei && k && erreicht(datei, k, knoten)) {
        liste.push({ ort: ort.kennung, name: f.kennung.slice(f.kennung.indexOf(".") + 1) });
      }
    }
    for (const a of ort.ausloeser) {
      const [d, k] = (a.dialog ?? "").split(".", 2);
      if (d === datei && k && erreicht(datei, k, knoten)) {
        liste.push({ ort: ort.kennung, name: a.name, ...(a.karte ? { karte: a.karte } : {}) });
      }
    }
  }
  return liste;
}
