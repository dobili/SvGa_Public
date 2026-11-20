/**
 * Zielhinweis der Oberwelt (Spieltest „einstieg“, 15.11.2026, R1): rechnet nach jedem Kartenwechsel
 * und jedem Questschritt das Feld aus, auf das der Hinweis zeigt, und gibt es der Szene.
 *
 * Seit dem 19.11.2026 (Wunsch des Autors) nur auf Wunsch: Der Pfeil zeigt auf das Ziel der Quest,
 * die im Tagebuch verfolgt wird (regeln/verfolgung.ts); ohne verfolgte Quest gibt es keinen.
 * Behoben zugleich (Befund des Autors: Pfeil auf dem Spiegel des Dachbodens): Ein Feld wurde in
 * die gerade laufende Szene gesetzt, auch wenn es für eine andere Karte gerechnet war, und fuhr die
 * Szene noch hoch, versuchte es das noch Sekunden später. So landete der Treppenausgang des
 * Wohnzimmers (1, 4) auf dem Dachboden, wo an derselben Stelle der Spiegel steht, und blieb dort.
 * Jetzt gilt ein Feld nur für seine Karte und nur, solange keine neuere Rechnung begonnen hat.
 *
 * Rolle im Gesamtbild: Bindeglied zwischen Spielstand (verfolgte Quest), den Tiled-Karten des
 * Ortes (aus dem Paket, gemerkt) und der Szene (szene.ts, setzeZiel). Die Regeln stehen in
 * zielsuche.ts, das Zeichnen in zielmarker.ts, das Symbol im Tagebuch in Tagebuch.tsx.
 * Abhängigkeiten: kern.ts, zielsuche.ts, zielwege.ts, weltdaten.ts, daten/laden.ts, paket/paketlader.ts.
 */
import { useEffect, useState } from "react";
import { findeKarte, type Ortdaten } from "../daten/laden";
import { liesPaketJson } from "../paket/paketlader";
import type { Abenteuerstand } from "../schnittstelle/spielstand";
import { szeneAus, type Oberweltkern } from "./kern";
import type { Weltdaten } from "./weltdaten";
import { verfolgteLaufendeQuest } from "../regeln/verfolgung";
import { kartenbildAus, verfolgtesZiel, wegweiser, zielkarte, type Feld } from "./zielsuche";
import type { Kartenbild } from "./zielsuche";
import { ausgangsziel, ortsstufen } from "./zielwege";

/** So oft und so lange wartet der Hinweis auf die Szene, die gerade hochfährt. */
const VERSUCHE = 25;
const WARTEN_MS = 200;

/** Geladene Tiled-Dateien (Pfad im Paket), einmal je Seite. */
const dateien = new Map<string, Promise<object>>();

function liesKarte(datei: string): Promise<object> {
  let p = dateien.get(datei);
  if (!p) {
    p = liesPaketJson<object>(datei);
    p.catch(() => dateien.delete(datei));
    dateien.set(datei, p);
  }
  return p;
}

/** Die Kartenbilder eines Ortes; die Karte der Welt kommt so, wie sie gerade geladen ist. */
async function kartenbilderDesOrtes(ort: Ortdaten, w: Weltdaten): Promise<Kartenbild[]> {
  return Promise.all(
    ort.karten.map(async (k) => {
      const pfade = [k.datei, ...Object.values(k.zustaende ?? {})];
      const fassungen =
        k.kennung === w.kennung ? [w.karte] : await Promise.all(pfade.map(liesKarte));
      return kartenbildAus(k.kennung, fassungen, (name) =>
        ausgangsziel(w.daten, ort, k.kennung, name),
      );
    }),
  );
}

/**
 * Das Feld des Hinweises auf der Karte der Welt, oder null. Geladen werden alle Orte auf dem Weg
 * vom Ort der Welt zum Ort des Ziels, ohne Ausgang dann auch ihre Nachbarorte (zielwege.ts,
 * ortsstufen; seit 20.11.2026, vorher nur die beiden Enden, sodass ein Weg dazwischen fehlte). Ziel ist der laufende Schritt der verfolgten Quest.
 * Beispiel: im Zimmer, verfolgt „Mama ist in der Küche“ → Feld des Auslösers „treppeUnten“.
 */
export async function zielfeld(w: Weltdaten, stand: Abenteuerstand): Promise<Feld | null> {
  const angabe = verfolgtesZiel(stand, w.daten);
  if (!angabe) return null;
  const ort =
    angabe.ort ?? (angabe.karte ? findeKarte(w.daten, angabe.karte)?.ort.kennung : undefined);
  const stufen = ort ? ortsstufen(w.daten, w.ort.kennung, ort) : [[w.ort.kennung]];
  for (const orte of stufen) {
    const listen = await Promise.all(
      w.daten.orte.filter((o) => orte.includes(o.kennung)).map((o) => kartenbilderDesOrtes(o, w)),
    );
    const bilder = listen.flat();
    if (zielkarte(angabe, bilder) === null) continue;
    const feld = wegweiser(w.kennung, angabe, bilder);
    if (feld) return feld;
  }
  return null;
}

/** Zähler der Rechnungen: Nur die jüngste darf ihr Feld der Szene geben. */
let rechnung = 0;

/**
 * Gibt das Feld der Szene, wenn es noch gilt: dieselbe Rechnung (keine neuere begonnen) und dieselbe
 * Karte wie die Welt. Fährt die Szene noch hoch, wird es kurz später noch einmal versucht.
 */
function gibSzene(
  k: Oberweltkern,
  karte: string,
  feld: Feld | null,
  nummer: number,
  gesetzt: (feld: Feld | null) => void,
  versuch = 0,
) {
  if (nummer !== rechnung || k.weltRef.current?.kennung !== karte) return;
  const szene = szeneAus(k.spiel);
  if (szene) {
    szene.setzeZiel(feld, feld !== null);
    gesetzt(feld);
    return;
  }
  if (versuch < VERSUCHE) {
    setTimeout(() => gibSzene(k, karte, feld, nummer, gesetzt, versuch + 1), WARTEN_MS);
  }
}

/**
 * Hält den Zielhinweis der Szene aktuell. Neu gerechnet wird bei neuer Karte, neuem Questschritt
 * und wenn im Tagebuch eine andere Quest verfolgt wird. Ausgabe: das Feld, auf das der Hinweis in
 * der Szene gerade zeigt, oder null (für ein verstecktes Testfeld, Orientierung.tsx).
 */
export function useZielhinweis(k: Oberweltkern): Feld | null {
  const [gezeigt, setzeGezeigt] = useState<Feld | null>(null);
  const { welt, stand } = k;
  const quests = stand?.quests.map((q) => `${q.kennung}:${q.schritt}:${q.erledigt}`).join(",");
  const verfolgt = stand ? verfolgteLaufendeQuest(stand) : null;
  const schluessel = `${welt?.kennung ?? ""}|${quests ?? ""}|${verfolgt ?? ""}`;
  useEffect(() => {
    const w = k.weltRef.current;
    const s = k.standRef.current;
    if (!w || !s) return;
    const nummer = ++rechnung;
    // Sofort das alte Feld weg, damit nichts Falsches stehen bleibt, bis die Rechnung fertig ist;
    // nur einmal (ohne Wiederholung), sonst könnte das Leeren das fertige Feld überschreiben.
    gibSzene(k, w.kennung, null, nummer, setzeGezeigt, VERSUCHE);
    zielfeld(w, s)
      .then((feld) => gibSzene(k, w.kennung, feld, nummer, setzeGezeigt))
      .catch((fehler: unknown) => console.warn("Zielhinweis nicht berechnet:", fehler));
    // Nur der Schlüssel zählt; Kern und Refs sind über die Sitzung gleich.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schluessel]);
  return gezeigt;
}
