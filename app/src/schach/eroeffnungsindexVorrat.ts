/**
 * Vorrat für den Eröffnungsindex und die Eröffnungsnamen: einmal bauen, überall wiederverwenden.
 *
 * Rolle im Gesamtbild: Den Index aus Kapitel 2 und 3 (schach/eroeffnungsindex.ts) brauchen die
 * Eröffnungswahl unter „Spielen“, die Partie (Buchzüge der Engine), Abbildungen, Trainer und die
 * Lernsammlung. Bis V6 (Nutzungsprüfung 25.10.2026) baute jeder Bildschirm ihn bei jedem Öffnen
 * neu: gedrosselt (CPU 4×) gut 100 ms beim Öffnen von „Spielen“ und noch einmal zweimal beim
 * Tippen auf „Partie beginnen“. Der Vorrat merkt sich das Ergebnis zu den geladenen Kapiteln; nach
 * einem Sprachwechsel sind die Kapitel neue Objekte (daten/laden.ts vergisst sie), dann baut er neu.
 * Abhängigkeiten: schach/eroeffnungsindex.ts, schach/eroeffnungsnamen.ts.
 */
import type { Eroeffnungsliste, Kapitel } from "../daten/laden";
import { baueEroeffnungsindex, type Eroeffnungsindex } from "./eroeffnungsindex";
import { eroeffnungsnamenAus, type Eroeffnungsnamen } from "./eroeffnungsnamen";

/** So viele Kapitelstände behält der Vorrat (Deutsch und Englisch nach einem Wechsel). */
const HOECHSTENS = 2;

/** Ein gebauter Index zu genau diesen Kapitelobjekten, dazu seine Fassungen mit Namen. */
interface Vorratseintrag {
  readonly kapitel: readonly Kapitel[];
  readonly index: Eroeffnungsindex;
  readonly mitNamen: WeakMap<Eroeffnungsnamen, Eroeffnungsindex>;
}

const vorrat: Vorratseintrag[] = [];
const namenVorrat = new WeakMap<Eroeffnungsliste, Eroeffnungsnamen>();

/** Dieselben Kapitelobjekte in derselben Reihenfolge? */
function gleicheKapitel(a: readonly Kapitel[], b: readonly Kapitel[]): boolean {
  return a.length === b.length && a.every((kapitel, i) => kapitel === b[i]);
}

function eintragZu(kapitel: readonly Kapitel[]): Vorratseintrag | undefined {
  return vorrat.find((eintrag) => gleicheKapitel(eintrag.kapitel, kapitel));
}

/**
 * Liegt der Index zu diesen Kapiteln schon im Vorrat?
 *
 * Warum: Nur das erste Bauen kostet Zeit; die Hooks verschieben es dann hinter das nächste Bild
 * (ui/komponenten/useEroeffnungsindex.ts), damit der Bildschirm sofort erscheint.
 * Beispiel: vor dem ersten Öffnen von „Spielen“ → false, danach → true.
 */
export function eroeffnungsindexBereit(kapitel: readonly Kapitel[]): boolean {
  return eintragZu(kapitel) !== undefined;
}

/**
 * Der Eröffnungsindex zu den Kapiteln, aus dem Vorrat oder neu gebaut.
 *
 * Eingaben: geladene Kapitel (2 und 3), optional die Namen der Lichess-Liste.
 * Ausgabe: derselbe Index wie baueEroeffnungsindex(kapitel, bekannte); für dieselben Objekte
 * immer dasselbe Objekt (stabil für Reacts Abhängigkeiten).
 * Beispiel: Eröffnungswahl und Partie fragen beide nach Kapitel 2 und 3; gebaut wird einmal,
 * „Spanische Partie“ nach 1. e4 e5 2. Sf3 Sc6 3. Lb5 steht in beiden.
 * Sonderfall: Ohne Namen liefert er den Index ohne „bekannte“ (wie bisher in der Partie).
 */
export function eroeffnungsindexFuer(
  kapitel: readonly Kapitel[],
  bekannte?: Eroeffnungsnamen,
): Eroeffnungsindex {
  let eintrag = eintragZu(kapitel);
  if (!eintrag) {
    eintrag = {
      kapitel: [...kapitel],
      index: baueEroeffnungsindex(kapitel),
      mitNamen: new WeakMap(),
    };
    vorrat.unshift(eintrag);
    vorrat.length = Math.min(vorrat.length, HOECHSTENS);
  }
  if (!bekannte) return eintrag.index;
  let mitNamen = eintrag.mitNamen.get(bekannte);
  if (!mitNamen) {
    mitNamen = { ...eintrag.index, bekannte };
    eintrag.mitNamen.set(bekannte, mitNamen);
  }
  return mitNamen;
}

/**
 * Die Eröffnungsnamen der Lichess-Liste, aus dem Vorrat oder neu gelesen.
 * Beispiel: zweimal dieselbe geladene Liste → zweimal dieselbe Zuordnung (einmal gelesen).
 */
export function eroeffnungsnamenFuer(liste: Eroeffnungsliste): Eroeffnungsnamen {
  let namen = namenVorrat.get(liste);
  if (!namen) {
    namen = eroeffnungsnamenAus(liste);
    namenVorrat.set(liste, namen);
  }
  return namen;
}
