/**
 * Die Abzeichen: besondere Leistungen, die nicht schon ein Orden (voller Ring) sind.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (Ideensammlung, freigegeben 30.10.2026): Abzeichen wie
 * bei Chessly, nur auf dem Gerät, ohne Bestenliste und ohne Druck. Jede Bedingung folgt aus
 * vorhandenen Daten (Partien, Wertungsverlauf, Übungen, Lernsammlung, Fehlerdatenbank, Karten) wie
 * die Erfahrungspunkte (erfahrung.ts); nichts verfällt: Wer an sieben Tagen hintereinander gelernt
 * hat, behält das Abzeichen, auch wenn danach eine Pause kommt. Ein einmal gefeiertes Abzeichen
 * bleibt verdient, auch wenn die Partie dazu später aus der Liste der letzten 50 fällt
 * (abzeichenstand.ts). Reine Funktionen; die Oberfläche steht in Erfahrung.tsx (Gitter im Profil).
 * Abhängigkeiten: erfahrung.ts, spiel/auswertung.ts (Zugklassen), daten/uebungsliste-daten.ts,
 * speicher/format.ts, lucide-react (Zeichen).
 */
import { Library, type LucideIcon } from "lucide-react";
import { UEBUNGEN_JE_KAPITEL } from "../../../daten/uebungsliste-daten";
import { t, type Textschluessel } from "../../../i18n/sprache";
import { REKORD_ABZEICHEN } from "./abzeichen-rekorde";
import { MEISTERSCHAFT_ABZEICHEN } from "./abzeichen-meisterschaft";
import { GRUNDABZEICHEN } from "./abzeichen-grund";
import { WOCHEN_ABZEICHEN } from "./abzeichen-wochen";

export { WOCHE } from "./abzeichen-grund";
import { zugurteile } from "../../../spiel/auswertung";
import type { Partieeintrag } from "../../../speicher/partien";
import type { Fortschritt, Nutzerdaten } from "../../../speicher/format";
import {
  gewonnen,
  grundlageAus,
  istEigenePartie,
  MIN_HALBZUEGE,
  type Erfahrungsgrundlage,
} from "./erfahrung";

/** Was die Bedingungen der Abzeichen brauchen: die Grundlage der EP und einige Besonderheiten. */
export interface Abzeichengrundlage extends Erfahrungsgrundlage {
  /** Ein Zug des Lesers mit der Klasse „brillant“ (!!) in einer ausgewerteten Partie. */
  readonly brillant: boolean;
  readonly mattGesetzt: boolean;
  /** Sieg ohne Rücknahme und ohne Werkzeuge. */
  readonly siegOhneHilfe: boolean;
  readonly siegGegenStaerkeren: boolean;
  readonly remisGegenStaerkeren: boolean;
  /** Alle Übungen mindestens eines Kapitels gelöst. */
  readonly kapitelKomplett: boolean;
  /** Längste Folge von Tagen hintereinander mit neuem Lernstand. */
  readonly tagesfolge: number;
  /**
   * Die Nutzerdaten selbst, für Abzeichen der Pakete (Themen, Wochen, Rekorde, Duelle): So muss
   * kein Paket diese Grundlage erweitern (Welle 0 der Gamifizierung).
   */
  readonly daten: Nutzerdaten;
}

/**
 * Kennung eines Abzeichens (auch Schlüssel der Texte „abzeichen.name.…“ und „abzeichen.bedingung.…“).
 * Seit Welle 0 der Gamifizierung ein Text: Die Pakete tragen eigene Abzeichen in eigenen
 * Teillisten bei (abzeichen-grund.ts und je Paket eine Datei), ohne diese Datei zu ändern.
 */
export type Abzeichenkennung = string;

/** Ein Abzeichen: Kennung (auch für Texte und Tests), Zeichen und Bedingung. */
export interface Abzeichenangabe {
  readonly kennung: Abzeichenkennung;
  readonly symbol: LucideIcon;
  readonly erfuellt: (g: Abzeichengrundlage) => boolean;
}

/** Ab so vielen Wertungspunkten Vorsprung gilt ein Gegner als stärker (etwa eine Klasse). */
export const STAERKER_AB = 100;

/**
 * Alle Abzeichen in der Reihenfolge des Gitters: erst die 18 Grundabzeichen (Spielen, Lernen am
 * Buch, Übung), dann je Paket der Gamifizierung seine Teilliste. Pakete fügen hier nur eine Zeile
 * an (Konfliktkarte, docs/nebenchat/gamifizierung.md, Abschnitt 5).
 */
export const ABZEICHEN: readonly Abzeichenangabe[] = [
  ...GRUNDABZEICHEN,
  ...WOCHEN_ABZEICHEN,
  ...REKORD_ABZEICHEN,
  ...MEISTERSCHAFT_ABZEICHEN,
];

/**
 * Name eines Abzeichens („abzeichen.name.<kennung>“). Ein Test prüft, dass es den Text für jedes
 * Abzeichen in ABZEICHEN gibt (abzeichen.test.ts). Beispiel: abzeichenname("erstesMatt").
 */
export function abzeichenname(kennung: Abzeichenkennung): string {
  return t(`abzeichen.name.${kennung}` as Textschluessel);
}

/** Bedingung eines Abzeichens („abzeichen.bedingung.<kennung>“), wie abzeichenname. */
export function abzeichenbedingung(kennung: Abzeichenkennung): string {
  return t(`abzeichen.bedingung.${kennung}` as Textschluessel);
}

/** Zeichen der Abzeichenkarte (Gitter und Meldung), wenn kein einzelnes Abzeichen gemeint ist. */
export const ABZEICHENZEICHEN: LucideIcon = Library;

const MS_JE_TAG = 86_400_000;

/** Fortlaufende Tagesnummer eines Zeitpunkts nach dem Kalender des Geräts; null bei Unsinn. */
function tagnummer(iso: string): number | null {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return Math.round(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / MS_JE_TAG);
}

/**
 * Längste Folge von Kalendertagen hintereinander unter diesen Zeitpunkten.
 * Beispiel: 1., 2., 3. und 5. Oktober → 3. Sonderfall: keine Zeitpunkte → 0.
 */
export function laengsteTagesfolge(zeiten: readonly string[]): number {
  const tage = [...new Set(zeiten.map(tagnummer).filter((t): t is number => t !== null))].sort(
    (a, b) => a - b,
  );
  let laengste = 0;
  let folge = 0;
  tage.forEach((tag, i) => {
    folge = i > 0 && tag === (tage[i - 1] ?? 0) + 1 ? folge + 1 : 1;
    laengste = Math.max(laengste, folge);
  });
  return laengste;
}

/** Alle Zeitpunkte, an denen der Leser etwas gelernt oder gespielt hat. */
export function lernzeiten(daten: Nutzerdaten): string[] {
  const f = daten.fortschritt;
  return [
    ...Object.values(f.gesehen),
    ...Object.values(f.eingeschaetzt),
    ...Object.values(f.uebungen).map((u) => u.zuletzt),
    ...Object.values(f.trainer).map((s) => s?.zuletzt ?? ""),
    ...Object.values(daten.karten).flatMap((k) => k.verlauf.map((v) => v.datum)),
    ...daten.spiel.partien.map((e) => e.partie.begonnen),
    ...daten.spiel.wertung.map((w) => w.zeit),
    ...daten.sammlung.map((e) => e.datum),
    ...daten.fehler.map((e) => e.datum),
  ];
}

/** Alle Übungen mindestens eines Kapitels gelöst? Kapitel ohne Übungen zählen nicht. */
export function kapitelKomplett(fortschritt: Fortschritt): boolean {
  return Object.values(UEBUNGEN_JE_KAPITEL).some(
    (ids) => ids.length > 0 && ids.every((id) => fortschritt.uebungen[id]?.geloest === true),
  );
}

/**
 * Hat der Leser in einer ausgewerteten Partie einen brillanten Zug (!!) gespielt? Gerechnet wie im
 * Rückblick, aber ohne Theoriezüge (die Eröffnungslisten lädt nur der Rückblick).
 * Beispiel: 16. Db8+ der Opernpartie als Zug des Lesers → true.
 */
export function brillanterZug(eintraege: readonly Partieeintrag[]): boolean {
  return eintraege.some((e) => {
    if (!istEigenePartie(e.partie) || e.werte.length === 0) return false;
    return zugurteile(e.partie, e.werte, e.beste, e.abstaende).some(
      (u) => u.klasse === "brillant" && e.partie.zuege[u.index]?.von === "leser",
    );
  });
}

/** Sieg und Remis gegen einen Gegner, dessen Schätzung deutlich über der eigenen Wertung lag. */
function gegenStaerkere(daten: Nutzerdaten): { sieg: boolean; remis: boolean } {
  const staerker = daten.spiel.wertung.filter((w) => w.gegner >= w.wertung + STAERKER_AB);
  return {
    sieg: staerker.some((w) => w.ergebnis === 1),
    remis: staerker.some((w) => w.ergebnis === 0.5),
  };
}

/**
 * Die Grundlage der Abzeichen. `brillant` kommt von außen, weil die Rechnung über alle Partien
 * teuer ist und nur nach neuen Auswertungen wiederholt werden muss.
 */
export function abzeichengrundlageAus(
  daten: Nutzerdaten,
  tagesserie: number,
  brillant: boolean,
): Abzeichengrundlage {
  const siege = daten.spiel.partien
    .map((e) => e.partie)
    .filter((p) => istEigenePartie(p) && gewonnen(p));
  const staerkere = gegenStaerkere(daten);
  return {
    ...grundlageAus(daten, tagesserie),
    brillant,
    mattGesetzt: siege.some((p) => p.ende?.art === "matt"),
    siegOhneHilfe: siege.some(
      (p) =>
        p.ruecknahmen === 0 && !p.einstellung.hilfen.werkzeuge && p.zuege.length >= MIN_HALBZUEGE,
    ),
    siegGegenStaerkeren: staerkere.sieg,
    remisGegenStaerkeren: staerkere.remis,
    kapitelKomplett: kapitelKomplett(daten.fortschritt),
    tagesfolge: laengsteTagesfolge(lernzeiten(daten)),
    daten,
  };
}

/** Die Kennungen der Abzeichen, deren Bedingung erfüllt ist, in der Reihenfolge des Gitters. */
export function erfuellteAbzeichen(g: Abzeichengrundlage): Abzeichenkennung[] {
  return ABZEICHEN.filter((a) => a.erfuellt(g)).map((a) => a.kennung);
}
