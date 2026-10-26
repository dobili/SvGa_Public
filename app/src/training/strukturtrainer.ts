/**
 * Strukturerkenner (Kapitel 5): starke Felder und schwache Bauern finden, eine Feldart benennen,
 * den passenden Plan wählen (Schritte in der Reihenfolge der Leitfragen, W5).
 *
 * Rolle im Gesamtbild: Trainer „struktur“ (Pflichtenheft 7, AP 13). Die Aufgaben stammen aus
 * inhalte/de/trainer/struktur.json: Abbildungen des Buches und Stellungen aus seinen Partien mit
 * Struktur, Seite und Plan-Schlüssel. Der Trainer zeigt die echte Stellung (Skelett per Knopf,
 * P4, R49) und rechnet die Felder und Bauern mit denselben Bausteinen wie die Werkzeuge nach
 * den Festlegungen des Autors (P3, 23.10.2026): starkes Feld = eigene 4. bis 6. Reihe, kein
 * gegnerischer Bauer kann es mehr angreifen; Vorposten = starkes Feld mit eigener Bauernstütze;
 * Loch = eigenes Feld (3. bis 5. Reihe), das kein eigener Bauer je wieder deckt; schwaches Feld =
 * der Oberbegriff (hier: ein solches Feld außerhalb der Lochreihen); rückständiger Bauer nach den
 * vier Bedingungen (schach/bauernschwaechen.ts). Die Plan-Sätze stehen in i18n/de.json. Falsche
 * Pläne kommen nur aus anderen Strukturfamilien. Reine Funktionen.
 * Abhängigkeiten: analyse/stellungsprofil.ts und analyse/skelett.ts (nur aufgerufen),
 * schach/bauernprofil.ts, schach/bauernschwaechen.ts, training/zufall.ts.
 * Buchbezug: Kapitel 5, „Skelett-Röntgen“ (Felder, Bauern, Richtung, Figuren).
 */
import type { Color, Square } from "chessops/types";
import { felderFuer } from "../analyse/skelett";
import { profil } from "../analyse/stellungsprofil";
import type { Strukturaufgabe } from "../daten/trainerdaten";
import { bauernprofil } from "../schach/bauernprofil";
import { bauernschwaechen } from "../schach/bauernschwaechen";
import { feldname, gegner, stellungAusFen, type Stellung } from "../schach/stellung";
import { mische, type Zufall } from "./zufall";

export type Plan = Strukturaufgabe["plan"];

/** Die fünf Feldarten der Festlegungen des Autors (P3), aus Sicht der Seite am Zug. */
export type Feldart = "loch" | "schwachesFeld" | "starkesFeld" | "vorposten" | "rueckstaendigerBauer";
/** Die fünf Feldarten als Liste, mit denselben Kennungen wie im Typ Feldart. */
export const FELDARTEN: readonly Feldart[] = [
  "loch",
  "schwachesFeld",
  "starkesFeld",
  "vorposten",
  "rueckstaendigerBauer",
];

/** Pläne, die zur selben Struktur gehören und deshalb gemeinsam gelten können. */
const FAMILIEN: readonly (readonly Plan[])[] = [
  ["kettenbasisAngreifen", "fluegelDerKette"],
  ["doppelbauerAngreifen", "doppelbauerAufloesen"],
  ["isolaniBlockieren", "isolaniVorstossen"],
  ["haengendeAngreifen", "haengendeVorstossen"],
  ["mehrheitVorstossen", "minderheitsangriff"],
  ["vorpostenBesetzen", "lochVermeiden", "luftlochSchaffen"],
  ["stellungOeffnen", "stellungSchliessen", "raumNutzen"],
  ["schlechtenLaeuferTauschen", "gutenLaeuferBehalten", "springerStattLaeufer"],
];
/** So viele Plan-Sätze stehen zur Wahl. */
export const PLAENE_ZUR_WAHL = 3;
/** Mehr starke Felder fragt der Schritt nicht ab (Lehrbilder mit wenigen Bauern): Er entfällt. */
export const HOECHSTENS_STARKE_FELDER = 4;

function familieVon(plan: Plan): readonly Plan[] {
  return FAMILIEN.find((f) => f.includes(plan)) ?? [plan];
}

function seiteVon(aufgabe: Strukturaufgabe): Color {
  return aufgabe.seite === "w" ? "white" : "black";
}

function stellungVon(aufgabe: Strukturaufgabe): Stellung | null {
  const gelesen = stellungAusFen(aufgabe.fen);
  return gelesen.ok ? gelesen.wert : null;
}

/** Ein starkes Feld der Seite am Zug mit der Angabe, ob es ein Vorposten ist. */
export interface StarkesFeld {
  readonly feld: string;
  readonly vorposten: boolean;
}

/**
 * Die starken Felder der Seite am Zug: eigene 4. bis 6. Reihe, kein gegnerischer Bauer kann sie
 * mehr angreifen (Löcher des Gegners); Vorposten, wenn ein eigener Bauer sie stützt. Dieselbe
 * Rechnung wie das Werkzeug „Felder“ (k5-felder, Festlegung des Autors P3).
 *
 * Warum: Leitfrage 1 kommt zuerst, weil man Felder sonst übersieht („da dort zumeist gar nichts
 * steht“). Ausgabe: sortiert; null, wenn es mehr als vier sind (der Schritt entfällt).
 * Beispiel: Abb. 5.8 (Najdorf, Weiß am Zug) → d5 (Vorposten, von e4 gestützt) und b6.
 */
export function starkeFelderMitArt(aufgabe: Strukturaufgabe): StarkesFeld[] | null {
  const s = stellungVon(aufgabe);
  if (!s) return null;
  const felder = felderFuer(profil(s), seiteVon(aufgabe))
    .sichere.map((f) => ({ feld: feldname(f.feld), vorposten: f.gestuetzt }))
    .sort((a, b) => a.feld.localeCompare(b.feld));
  return felder.length > HOECHSTENS_STARKE_FELDER ? null : felder;
}

/** Nur die Feldnamen der starken Felder (für das Antippen). */
export function starkeFelder(aufgabe: Strukturaufgabe): string[] | null {
  return starkeFelderMitArt(aufgabe)?.map((f) => f.feld) ?? null;
}

/**
 * Die schwachen Bauern beider Seiten: isoliert, doppelt oder rückständig (Kapitel 5, Bauern),
 * gerechnet wie das Werkzeug „Bauern“ (rückständig nach den vier Bedingungen des Autors).
 *
 * Beispiel: Abb. 5.16 → a3 (isoliert), c3 und c4 (Doppelbauer).
 */
export function schwacheBauern(aufgabe: Strukturaufgabe): string[] {
  const s = stellungVon(aufgabe);
  if (!s) return [];
  const felder = new Set<Square>();
  for (const farbe of ["white", "black"] as const) {
    const b = bauernschwaechen(s.brett, farbe);
    for (const f of [...b.isolani, ...b.doppelbauern.flat(), ...b.rueckstaendige]) felder.add(f);
  }
  return [...felder].map(feldname).sort();
}

/** Ein Feld mit seiner Art aus Sicht der Seite am Zug. */
export interface Feldartfund {
  readonly feld: string;
  readonly art: Feldart;
}

/**
 * Alle Felder der fünf Arten aus Sicht der Seite am Zug: eigene Löcher (3. bis 5. Reihe), eigene
 * schwache Felder außerhalb dieser Reihen, starke Felder und Vorposten, rückständige Bauern
 * beider Seiten. Regel: Festlegungen des Autors (P3, 23.10.2026), Kapitel 5, Leitfragen 1 und 2.
 * Beispiel: Abb. 5.8 (Weiß am Zug) → d5 Vorposten, d6 rückständiger Bauer (schwarz).
 */
export function feldarten(aufgabe: Strukturaufgabe): Feldartfund[] {
  const s = stellungVon(aufgabe);
  if (!s) return [];
  const seite = seiteVon(aufgabe);
  const p = profil(s);
  const mein = felderFuer(p, seite);
  const loecher = new Set(mein.eigeneLoecher.map((l) => l.feld));
  const funde: Feldartfund[] = [];
  for (const l of loecher) funde.push({ feld: feldname(l), art: "loch" });
  for (const f of bauernprofil(s.brett, seite).loecher) {
    if (!loecher.has(f) && s.brett.get(f)?.role !== "pawn")
      funde.push({ feld: feldname(f), art: "schwachesFeld" });
  }
  for (const f of mein.sichere)
    funde.push({ feld: feldname(f.feld), art: f.gestuetzt ? "vorposten" : "starkesFeld" });
  for (const farbe of [seite, gegner(seite)]) {
    for (const f of bauernschwaechen(s.brett, farbe).rueckstaendige)
      funde.push({ feld: feldname(f), art: "rueckstaendigerBauer" });
  }
  return funde;
}

/** Die Frage nach einer Feldart: ein Feld, seine Art, alle fünf Arten zur Wahl. */
export interface Feldartfrage {
  readonly feld: string;
  readonly richtig: Feldart;
  readonly optionen: readonly Feldart[];
}

/**
 * Eine Feldart-Frage zur Aufgabe: ein zufälliges Feld aus den Funden, bevorzugt eine Art, die
 * nicht schon durch die Tipp-Schritte beantwortet ist (Loch, schwaches Feld, Vorposten,
 * rückständiger Bauer vor starkes Feld). null, wenn es kein solches Feld gibt.
 */
export function feldartfrage(aufgabe: Strukturaufgabe, zufall: Zufall): Feldartfrage | null {
  const funde = feldarten(aufgabe);
  const bevorzugt = funde.filter((f) => f.art !== "starkesFeld");
  const vorrat = bevorzugt.length > 0 ? bevorzugt : funde;
  const fund = vorrat[Math.floor(zufall() * vorrat.length)];
  if (!fund) return null;
  return { feld: fund.feld, richtig: fund.art, optionen: FELDARTEN };
}

/**
 * Die Plan-Sätze zur Wahl: der richtige und zwei aus anderen Strukturfamilien, gemischt.
 *
 * Beispiel: Isolani blockieren, dazu etwa „Mit der Mehrheit vorstoßen“ und „Die Stellung öffnen“.
 */
export function planwahl(aufgabe: Strukturaufgabe, zufall: Zufall): Plan[] {
  const eigene = familieVon(aufgabe.plan);
  const fremde = FAMILIEN.flat().filter((p) => !eigene.includes(p));
  const falsche = mische(fremde, zufall).slice(0, PLAENE_ZUR_WAHL - 1);
  return mische([aufgabe.plan, ...falsche], zufall);
}

/** Eine Runde, leichteste zuerst; mit gewählter Stufe die Aufgaben nahe daran. */
export function strukturrunde(
  aufgaben: readonly Strukturaufgabe[],
  stufe: number | null,
  anzahl: number,
  zufall: Zufall,
): Strukturaufgabe[] {
  const abstand = (a: Strukturaufgabe) => (stufe === null ? 0 : Math.abs(a.schwierigkeit - stufe));
  return mische(aufgaben, zufall)
    .sort((a, b) => abstand(a) - abstand(b))
    .slice(0, anzahl)
    .sort((a, b) => a.schwierigkeit - b.schwierigkeit);
}
