/**
 * Verzeichnis aller Werkzeuge: Hier wird jedes Werkzeug angemeldet.
 *
 * Rolle im Gesamtbild: Die Werkzeugleiste fragt hier, welche Werkzeuge für ein Kapitel
 * freigeschaltet sind, und lässt sie rechnen (Konzept 7.1, „werkzeugeFuer“ und „wende“).
 * Abhängigkeiten: alle Werkzeugdateien.
 */
import { istTextschluessel, type Textschluessel } from "../i18n/sprache";
import { k1Angriffsregel } from "./k1-angriffsregel";
import { k1Roentgen } from "./k1-roentgen";
import { k1Todsuenden } from "./k1-todsuenden";
import { k1Zaehlen } from "./k1-zaehlen";
import { k2Eroeffnung } from "./k2-eroeffnung";
import { k2Zielbilanz } from "./k2-zielbilanz";
import { k3Faktorenbilanz } from "./k3-faktorenbilanz";
import { k4Falle } from "./k4-falle";
import { k4Prueffragen } from "./k4-prueffragen";
import { k4Warnsignale } from "./k4-warnsignale";
import { k5Bauern } from "./k5-bauern";
import { k5Felder } from "./k5-felder";
import { k5Figuren } from "./k5-figuren";
import { k5Richtung } from "./k5-richtung";
import { k5Vorher } from "./k5-vorher";
import { k6Gegner } from "./k6-gegner";
import { k6Lap } from "./k6-lap";
import { k6Planbilanz } from "./k6-planbilanz";
import { k6Wo } from "./k6-wo";
import { k7Erzwingend } from "./k7-erzwingend";
import { k7Motiv } from "./k7-motiv";
import { k7Ruhe } from "./k7-ruhe";
import { k7Warnsignale } from "./k7-warnsignale";
import { k11Phase } from "./k11-phase";
import { k12Erfassen } from "./k12-erfassen";
import { k12Kandidaten } from "./k12-kandidaten";
import { k12Sicherheitsblick } from "./k12-sicherheitsblick";
import { k8Elementarmatt } from "./k8-elementarmatt";
import { k8Opposition } from "./k8-opposition";
import { k8Quadrat } from "./k8-quadrat";
import { k8Regeln } from "./k8-regeln";
import { k8Schluesselfelder } from "./k8-schluesselfelder";
import { k9Erkennungsbilder } from "./k9-erkennungsbilder";
import { k9Turmbegriffe } from "./k9-turmbegriffe";
import type { Bedarf, Werkzeug, Werkzeugeingabe, Werkzeugergebnis } from "./werkzeug";

/** Alle Werkzeuge in der Reihenfolge der Werkzeugleiste. */
/** Was die Abbildung einem Werkzeug mitgeben kann (ohne angetipptes Feld und Engine). */
const MIT_ABBILDUNG: ReadonlySet<Bedarf> = new Set([
  "stellung",
  "zug",
  "verlauf",
  "eroeffnungen",
  "fallencheck",
  "bilanz",
  "fortsetzung",
  "uebung",
]);

const WERKZEUGE: readonly Werkzeug[] = [
  k1Zaehlen,
  k1Roentgen,
  k1Angriffsregel,
  k1Todsuenden,
  k2Zielbilanz,
  k2Eroeffnung,
  k3Faktorenbilanz,
  k4Warnsignale,
  k4Prueffragen,
  k4Falle,
  k5Vorher,
  k5Felder,
  k5Bauern,
  k5Richtung,
  k5Figuren,
  k6Wo,
  k6Gegner,
  k6Lap,
  k6Planbilanz,
  k7Warnsignale,
  k7Erzwingend,
  k7Ruhe,
  k7Motiv,
  k8Regeln,
  k8Opposition,
  k8Schluesselfelder,
  k8Quadrat,
  k8Elementarmatt,
  k9Turmbegriffe,
  k9Erkennungsbilder,
  k11Phase,
  k12Erfassen,
  k12Kandidaten,
  k12Sicherheitsblick,
];

/**
 * Liefert die Werkzeuge, die bis zu einem Kapitel freigeschaltet sind.
 *
 * Warum: Ein Leser in Kapitel 1 soll nur die Werkzeuge sehen, die er schon kennt.
 * Eingabe: Kapitelnummer. Ausgabe: Werkzeuge in Leistenreihenfolge.
 * Beispiel: werkzeugeFuer(1) → [k1-zaehlen, k1-roentgen] (Abb. 1.26).
 */
export function werkzeugeFuer(kapitel: number): readonly Werkzeug[] {
  return WERKZEUGE.filter((werkzeug) => werkzeug.kapitel <= kapitel);
}

/**
 * Werkzeuge für die Werkzeugleiste einer Abbildung, die nur die Stellung brauchen (kein Feld wie
 * „Zählen“, kein Verlauf und keine Engine): erst die des Kapitels, dann die früherer Kapitel.
 *
 * Warum: Pflichtenheft 6.1 „Standardmäßig zeigt die Werkzeugleiste die Werkzeuge des aktuellen
 * Kapitels“; frühere bleiben freigeschaltet und stehen hinter „Mehr“.
 * Beispiel: stellungswerkzeuge(1) → { kapitel: [k1-roentgen], frueher: [] }.
 */
export function stellungswerkzeuge(kapitel: number): {
  readonly kapitel: readonly Werkzeug[];
  readonly frueher: readonly Werkzeug[];
} {
  // Geplanter Zug und Eröffnungsindex liefert die Abbildung mit (der Zug ist freiwillig).
  const passend = werkzeugeFuer(kapitel).filter((werkzeug) =>
    werkzeug.braucht.every((bedarf) => MIT_ABBILDUNG.has(bedarf)),
  );
  return {
    kapitel: passend.filter((werkzeug) => werkzeug.kapitel === kapitel),
    frueher: passend.filter((werkzeug) => werkzeug.kapitel < kapitel),
  };
}

/**
 * Wendet ein Werkzeug auf eine Eingabe an.
 *
 * Eingaben: Werkzeug-ID und Eingabe. Ausgabe: Ergebnis oder null, wenn das Werkzeug unbekannt
 * ist oder eine nötige Eingabe (etwa das Feld) fehlt.
 */
export function wende(id: string, eingabe: Werkzeugeingabe): Werkzeugergebnis | null {
  const werkzeug = WERKZEUGE.find((kandidat) => kandidat.id === id);
  return werkzeug ? werkzeug.berechne(eingabe) : null;
}

/**
 * Der Textschlüssel der Erklärung eines Werkzeugs, oder null für unbekannte.
 * Beispiel: erklaerungVon("k1-roentgen") → „werkzeug.k1-roentgen.erklaerung“.
 */
export function erklaerungVon(id: string): Werkzeug["erklaerung"] | null {
  return WERKZEUGE.find((kandidat) => kandidat.id === id)?.erklaerung ?? null;
}

/**
 * Der Textschlüssel der Legende eines Werkzeugs (wofür die Markierungen am Brett stehen), oder
 * null, wenn es keine Markierungen setzt. Wunsch des Autors nach dem Test von 0.2.29: Die Legende
 * steht klein direkt in der Karte, nicht erst unter „So prüft die App“.
 * Beispiel: legendeVon("k1-roentgen") → „werkzeug.k1-roentgen.legende“; legendeVon("k2-eroeffnung")
 * → null.
 */
export function legendeVon(id: string): Textschluessel | null {
  const schluessel = `werkzeug.${id}.legende`;
  return istTextschluessel(schluessel) ? schluessel : null;
}
