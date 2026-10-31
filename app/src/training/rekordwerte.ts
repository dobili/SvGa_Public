/**
 * Werte der Rekorde, die aus den Nutzerdaten folgen (Gamifizierung P5): Tagesprotokoll, Wertung,
 * besiegte Bots, ausgewertete Partien und „Zug erraten“.
 *
 * Rolle im Gesamtbild: Die Rekordarten in training/rekordarten.ts verweisen hierher, wenn ihr Wert
 * nicht vom Anlass mitgebracht wird. Jede Funktion rechnet den besten Wert, der heute in den Daten
 * steht; training/rekorde.ts vergleicht ihn mit dem gespeicherten Rekord. So zählt auch, was vor
 * der Rekordtafel gespielt wurde, soweit es noch gespeichert ist (etwa die letzten 50 Partien).
 * Abhängigkeiten: speicher/aktivitaet.ts, training/kurzplaene.ts, spiel/wertung.ts,
 * spiel/auswertung.ts, engine/botstaerke.ts, speicher/format.ts (Typen).
 */
import { staerkeDesBots } from "../engine/botstaerke";
import { zugurteile } from "../spiel/auswertung";
import { ANFANGSPARTIEN, verlaufDerZeitklasse, zeitklassenMitWertung } from "../spiel/wertung";
import { LERNARTEN, wochenbeginn } from "../speicher/aktivitaet";
import type { Nutzerdaten } from "../speicher/format";
import type { Partieeintrag } from "../speicher/partien";
import { tagesschluessel } from "./kurzplaene";

/** So viele Züge braucht ein Durchgang „Zug erraten“, damit seine Quote als Rekord zählt. */
export const MIN_RATEVERSUCHE = 10;
const PROZENT = 100;

/** Größter Wert einer Liste, null bei leerer Liste. */
function hoechster(werte: readonly number[]): number | null {
  return werte.length === 0 ? null : Math.max(...werte);
}

/**
 * Meiste richtige Trainerantworten an einem Tag (Tagesprotokoll G2, Art „trainerRichtig“).
 * Beispiel: Montag 12, Dienstag 30 → 30.
 */
export function meisteRichtigeAnEinemTag(daten: Nutzerdaten): number | null {
  return hoechster(Object.values(daten.aktivitaet).map((z) => z.trainerRichtig ?? 0));
}

/**
 * Meiste Lerntage in einer Woche (Montag bis Sonntag, Lernarten wie beim Wochenziel P4).
 * Beispiel: Lerntage Mo, Mi, Fr derselben Woche → 3.
 */
export function meisteLerntageInEinerWoche(daten: Nutzerdaten): number | null {
  const wochen = new Map<string, number>();
  for (const [tag, zaehler] of Object.entries(daten.aktivitaet)) {
    if (!LERNARTEN.some((art) => (zaehler[art] ?? 0) > 0)) continue;
    const montag = tagesschluessel(wochenbeginn(new Date(`${tag}T12:00:00`)));
    wochen.set(montag, (wochen.get(montag) ?? 0) + 1);
  }
  return hoechster([...wochen.values()]);
}

/**
 * Höchste Wertung über alle Zeitklassen, ohne die vorläufigen ersten Partien (sonst wäre ein
 * Glückssieg in Partie 1 ein Rekord, den die Wertung nie wieder erreicht).
 * Beispiel: Schnellschach nach 10 Partien 1180, danach 1215 und 1190 → 1215.
 */
export function hoechsteWertung(daten: Nutzerdaten): number | null {
  const punkte = daten.spiel.wertung;
  const feste = zeitklassenMitWertung(punkte).flatMap((tempo) =>
    verlaufDerZeitklasse(punkte, tempo).slice(ANFANGSPARTIEN - 1),
  );
  return hoechster(feste.map((p) => p.wertung));
}

/**
 * Stärkster besiegter Bot: die Zahl des Bots in der Zeitklasse des Sieges (engine/botstaerke.ts).
 * Beispiel: „ayse“ in Schnellschach besiegt → 1553. Sonderfall: eigene Bots ohne Messung zählen nicht.
 */
export function staerksterBesiegterBot(daten: Nutzerdaten): number | null {
  const besiegt = daten.spiel.besiegt;
  const zahlen = (Object.keys(besiegt) as (keyof typeof besiegt)[]).flatMap((tempo) =>
    besiegt[tempo].map((bot) => staerkeDesBots(bot, tempo) ?? 0),
  );
  return hoechster(zahlen.filter((z) => z > 0));
}

/** Halbzüge einer ausgewerteten eigenen Partie ohne Patzer (??) des Lesers, sonst null. */
function halbzuegeOhnePatzer(e: Partieeintrag): number | null {
  const p = e.partie;
  if (e.werte.length === 0 || p.einstellung.gegner !== "engine" || p.einstellung.importiert)
    return null;
  const urteile = zugurteile(p, e.werte, e.beste, e.abstaende);
  if (urteile.length === 0) return null;
  const patzer = urteile.some((u) => u.klasse === "patzer" && p.zuege[u.index]?.von === "leser");
  return patzer ? null : p.zuege.length;
}

/**
 * Längste ausgewertete Partie ohne Patzer des Lesers, in Halbzügen (Zugklassen wie im Rückblick,
 * spiel/auswertung.ts). Nur Partien mit Auswertung zählen; sie steht im Partieeintrag.
 * Beispiel: 64 Halbzüge, kein „??“ des Lesers → 64.
 */
export function laengstePartieOhnePatzer(daten: Nutzerdaten): number | null {
  const laengen = daten.spiel.partien.map(halbzuegeOhnePatzer);
  return hoechster(laengen.filter((l): l is number => l !== null));
}

/**
 * Beste Trefferquote „Zug erraten“ in einem Durchgang, in Prozent, ab 10 Versuchen.
 * Beispiel: 9 von 12 → 75.
 */
export function besteRatequote(daten: Nutzerdaten): number | null {
  const quoten = Object.values(daten.zugErraten)
    .flat()
    .filter((d) => d.versuche >= MIN_RATEVERSUCHE)
    .map((d) => Math.round((PROZENT * d.treffer) / d.versuche));
  return hoechster(quoten);
}
