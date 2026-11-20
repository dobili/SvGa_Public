/**
 * Wege für den Zielpfeil über Karten und Orte (oberwelt/zielsuche.ts, useZielhinweis.ts): wohin ein
 * Ausgang einer Karte führt, und über welche Orte der Weg zum Ziel geht.
 *
 * Warum (Prüfung aller Questziele, 20.11.2026, tests/durchlauf/zielpfeil.test.ts): Der Pfeil kannte
 * nur Übergänge und lud nur die Karten des Ortes, in dem der Held steht, und die des Zielortes.
 * Lag dazwischen ein Weg (Maple Falls → Landstraße → Cedar Creek), fand er keinen Ausgang und zeigte
 * nichts; bei 154 von 198 Questschritten von irgendeiner Karte aus. Und zwischen Ironwood und dem
 * Weg nach Silicon Bay fährt ein Bus (ein Gespräch an der Haltestelle, kein Übergang): Von dort
 * fand er gar keinen Weg in die späteren Akte. Jetzt zählen Haltestellen als Ausgang (wie im
 * Spieler-Durchlauf, tests/durchlauf/welt.ts), und geladen werden alle Orte auf dem Weg.
 * Abhängigkeiten: daten/laden.ts (Typen und findeKarte).
 */
import { findeKarte, type Ortdaten, type Spieldaten } from "../daten/laden";

/** So beginnen die Kennungen der Wege zwischen den Städten („wegIronwoodSilicon“). */
const WEG_VORSILBE = "weg";

/** Auslöser eines Ortes auf einer Karte: der mit passendem Feld `karte` vor dem ohne Karte. */
function ausloeserAuf(ort: Ortdaten, karte: string, name: string) {
  const passende = ort.ausloeser.filter((x) => x.name === name);
  return passende.find((x) => x.karte === karte) ?? passende.find((x) => !x.karte);
}

/**
 * Haltestellen: Dialogauslöser, an denen ein Übergang von einem Weg ankommt (der Bus von Ironwood
 * zur Raststätte). Schlüssel „karte|name“, Wert die Karte des Weges, zu der die Fahrt geht.
 */
function haltestellen(daten: Spieldaten): Map<string, string> {
  const halte = new Map<string, string>();
  for (const fremd of daten.orte) {
    if (!fremd.kennung.startsWith(WEG_VORSILBE)) continue;
    for (const r of fremd.ausloeser) {
      const an = r.art === "uebergang" ? r.ziel : undefined;
      const von = r.karte ?? fremd.karten[0]?.kennung;
      const ort = an ? findeKarte(daten, an.karte)?.ort : undefined;
      if (!an || !ort || !von || von === an.karte) continue;
      const hier = ausloeserAuf(ort, an.karte, an.ausloeser);
      if (hier?.art === "dialog") halte.set(`${an.karte}|${an.ausloeser}`, von);
    }
  }
  return halte;
}

/** Gemerkte Haltestellen je Datensatz (sie hängen nur von orte.json ab). */
const halteMerker = new WeakMap<Spieldaten, Map<string, string>>();

/**
 * Wohin der Auslöser `name` auf der Karte `karte` des Ortes `ort` führt: das Ziel eines Übergangs
 * oder, bei einer Haltestelle, die Karte des Weges; sonst null.
 * Beispiel: „ironwood.aussen“, „busSiliconBay“ → „wegIronwoodSilicon.raststaette“.
 */
export function ausgangsziel(
  daten: Spieldaten,
  ort: Ortdaten,
  karte: string,
  name: string,
): string | null {
  const a = ausloeserAuf(ort, karte, name);
  if (a?.art === "uebergang" && a.ziel) return a.ziel.karte;
  let halte = halteMerker.get(daten);
  if (!halte) {
    halte = haltestellen(daten);
    halteMerker.set(daten, halte);
  }
  return halte.get(`${karte}|${name}`) ?? null;
}

/** Nachbarorte: Orte, in die ein Übergang oder eine Haltestelle eines Ortes führt. */
function nachbarorte(daten: Spieldaten): Map<string, Set<string>> {
  const nachbarn = new Map<string, Set<string>>();
  const verbinde = (von: string, nach: string | undefined) => {
    if (!nach || nach === von) return;
    nachbarn.set(von, (nachbarn.get(von) ?? new Set()).add(nach));
  };
  for (const ort of daten.orte) {
    for (const a of ort.ausloeser) {
      if (a.art === "uebergang" && a.ziel) {
        verbinde(ort.kennung, findeKarte(daten, a.ziel.karte)?.ort.kennung);
      }
    }
  }
  for (const [stelle, weg] of haltestellen(daten)) {
    const karte = stelle.split("|")[0] ?? "";
    verbinde(findeKarte(daten, karte)?.ort.kennung ?? "", findeKarte(daten, weg)?.ort.kennung);
  }
  return nachbarn;
}

/** Gemerkte Nachbarorte je Datensatz. */
const nachbarMerker = new WeakMap<Spieldaten, Map<string, Set<string>>>();

function nachbarnMerken(daten: Spieldaten): Map<string, Set<string>> {
  let n = nachbarMerker.get(daten);
  if (!n) {
    n = nachbarorte(daten);
    nachbarMerker.set(daten, n);
  }
  return n;
}

/**
 * Die Orte auf dem kürzesten Weg von `von` nach `nach`, beide eingeschlossen (Breitensuche über
 * Übergänge und Haltestellen). Ohne Weg nur die beiden. Beispiel: mapleFalls → cedarCreek ergibt
 * [mapleFalls, wegMapleCedar, cedarCreek].
 */
export function ortsweg(daten: Spieldaten, von: string, nach: string): string[] {
  if (von === nach) return [von];
  const nachbarn = nachbarnMerken(daten);
  const woher = new Map<string, string | null>([[von, null]]);
  const offen = [von];
  for (let i = 0; i < offen.length; i++) {
    const ort = offen[i] ?? "";
    if (ort === nach) break;
    for (const n of nachbarn.get(ort) ?? []) {
      if (woher.has(n)) continue;
      woher.set(n, ort);
      offen.push(n);
    }
  }
  if (!woher.has(nach)) return [von, nach];
  const weg: string[] = [];
  for (let o: string | null | undefined = nach; o; o = woher.get(o)) weg.unshift(o);
  return weg;
}

/**
 * Welche Orte der Zielpfeil nacheinander lädt, bis er einen Ausgang findet: zuerst die Orte auf dem
 * Weg (ortsweg), dann dieselben mit allen Nachbarorten.
 * Warum die zweite Stufe: Innerhalb eines Ortes hängen nicht alle Karten zusammen. Der Zedernpfad
 * gehört zum Weg Maple–Cedar, führt aber nur in den Park von Maple Falls und nach Cedar Creek, nicht
 * zur Landstraße; von dort zum Flohmarkt geht es durch einen Nachbarort.
 * Beispiel: wegMapleCedar → wegMapleCedar ergibt [[wegMapleCedar], [wegMapleCedar, mapleFalls,
 * cedarCreek, …]].
 */
export function ortsstufen(daten: Spieldaten, von: string, nach: string): string[][] {
  const weg = ortsweg(daten, von, nach);
  const nachbarn = nachbarnMerken(daten);
  const weiter = new Set(weg);
  for (const o of weg) for (const n of nachbarn.get(o) ?? []) weiter.add(n);
  return weiter.size > weg.length ? [weg, [...weiter]] : [weg];
}
