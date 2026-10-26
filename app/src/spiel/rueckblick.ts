/**
 * Rückblick nach der Partie: Zeichen am Brett, besserer Zug, Bewertungsbalken, Verlaufskurve.
 *
 * Rolle im Gesamtbild: Vorschlag H, vom Autor angenommen („Spielen: Rückblick nach der
 * Partie“). Beim Nachspielen einer ausgewerteten Partie steht am Zielfeld des gezeigten Zuges
 * sein Zeichen (?!, ?, ??), ein goldener Pfeil zeigt den besseren Zug; links am Brett ein
 * schmaler Balken mit der Bewertung, über der Auswertung eine Kurve. Während der Partie bleibt
 * das alles aus (es verriete zu viel). Reine Funktionen; die Werte kommen aus
 * ui/komponenten/useAuswertung.ts, die Zeichen aus spiel/auswertung.ts.
 * Nach „Besser war …“ nennt die Karte auch die nächsten Züge der Hauptvariante der Engine
 * (Empfehlung R5), als antippbaren Nebenzweig (spiel/nebenzweig.ts).
 * Abhängigkeiten: analyse/werkzeug.ts (Markierung), schach/weiterspielen.ts,
 * spiel/auswertung.ts, spiel/zuege.ts.
 */
import type { Markierung, Markierungsfarbe } from "../analyse/werkzeug";
import { zugFelder } from "../schach/weiterspielen";
import type { Zugklasse, Zugurteil } from "./auswertung";
import { zahlText } from "../i18n/sprache";

/** Der Balken und die Kurve reichen bis ±5 Bauern; mehr (auch Matt) steht am Rand. */
export const ANZEIGEGRENZE = 5;
/** Ab diesem Wert (Matt in der Auswertung) zeigt der Balken „M“ statt einer Zahl. */
const MATTWERT = 10;
/** UCI: zwei Zeichen Startfeld, zwei Zeichen Zielfeld. */
const FELDLAENGE = 2;

/** Marke am Zielfeld je Klasse (Text und Farbe); Klassen ohne Marke bleiben leer. */
const MARKE_JE_KLASSE: Readonly<
  Record<Zugklasse, { text: string; farbe: Markierungsfarbe } | null>
> = {
  brillant: { text: "!!", farbe: "blau" },
  stark: { text: "!", farbe: "gold" },
  bester: { text: "✓", farbe: "gruen" },
  sehrGut: null,
  gut: null,
  buch: null,
  ungenau: { text: "?!", farbe: "grau" },
  fehler: { text: "?", farbe: "rot" },
  verpasst: { text: "?", farbe: "rot" },
  patzer: { text: "??", farbe: "rot" },
};

/** Bei diesen Klassen zeigt ein goldener Pfeil den besseren Zug. */
const MIT_BESSEREM_ZUG: ReadonlySet<Zugklasse> = new Set<Zugklasse>([
  "sehrGut",
  "gut",
  "ungenau",
  "fehler",
  "verpasst",
  "patzer",
]);

/**
 * Markierungen für die Stellung nach einem Zug: Marke der Klasse am Zielfeld (seit 0.2.40 wie bei
 * chess.com: „!!“ blau, „!“ gold, „✓“ grün für den besten Zug, „?!“ grau, „?“ und „??“ rot),
 * goldener Pfeil für den besseren Zug der Engine bei allen Zügen, die nicht der beste waren.
 *
 * Eingaben: Stellung vor dem Zug (FEN), der Zug (SAN), sein Urteil, bester Zug der Engine (UCI).
 * Beispiel: 2. Dh5?! nach 1. e4 e5: Feld h5 mit „?!“ (grau), goldener Pfeil g1–f3, falls die
 * Engine 2. Sf3 vorzieht.
 * Sonderfälle: Ohne Urteil keine Markierung; ohne gültigen Zug ebenfalls keine.
 */
export function rueckblickMarken(
  vorher: string,
  san: string,
  urteil: Zugurteil | undefined,
  bester: string,
): Markierung[] {
  const gespielt = zugFelder(vorher, san);
  if (!gespielt || !urteil) return [];
  const marke = MARKE_JE_KLASSE[urteil.klasse];
  const marken: Markierung[] = marke
    ? [{ typ: "feld", farbe: marke.farbe, feld: gespielt.nach, text: marke.text }]
    : [];
  const von = bester.slice(0, FELDLAENGE);
  const nach = bester.slice(FELDLAENGE, 2 * FELDLAENGE);
  const gleich = von === gespielt.von && nach === gespielt.nach;
  if (von && nach && !gleich && MIT_BESSEREM_ZUG.has(urteil.klasse)) {
    marken.push({ typ: "pfeil", farbe: "gold", von, nach });
  }
  return marken;
}

/**
 * Anteil von Weiß am Bewertungsbalken, 0 bis 1 (0,5 ausgeglichen).
 *
 * Beispiel: +1 → 0,6; −5 und weniger → 0; Matt für Weiß → 1.
 */
export function balkenanteil(wert: number): number {
  const begrenzt = Math.max(-ANZEIGEGRENZE, Math.min(ANZEIGEGRENZE, wert));
  return (begrenzt + ANZEIGEGRENZE) / (2 * ANZEIGEGRENZE);
}

/**
 * Die Zahl am Balken, wie im Buch mit Komma: „+1,3“, „−0,4“, „0,0“; Matt „M“ mit Vorzeichen.
 */
export function balkentext(wert: number): string {
  if (Math.abs(wert) >= MATTWERT) return wert > 0 ? "+M" : "−M";
  const text = zahlText(Math.abs(wert), 1);
  if (text === "0,0") return text;
  return `${wert > 0 ? "+" : "−"}${text}`;
}

/** Ein Punkt der Verlaufskurve in Koordinaten der Zeichenfläche. */
export interface Kurvenpunkt {
  readonly x: number;
  readonly y: number;
}

/**
 * Die Punkte der Verlaufskurve: x je Stellung gleichmäßig, y von oben (+5) nach unten (−5).
 *
 * Eingaben: Werte je Stellung (aus Sicht von Weiß), Breite und Höhe der Zeichenfläche.
 * Beispiel: Werte [0, 5, −5] bei 100 × 50 → (0|25), (50|0), (100|50).
 */
export function kurvenpunkte(
  werte: readonly number[],
  breite: number,
  hoehe: number,
): Kurvenpunkt[] {
  const schritt = werte.length > 1 ? breite / (werte.length - 1) : 0;
  return werte.map((wert, i) => ({ x: i * schritt, y: hoehe * (1 - balkenanteil(wert)) }));
}
