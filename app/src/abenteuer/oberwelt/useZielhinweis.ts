/**
 * Zielhinweis der Oberwelt (Spieltest „einstieg“, 15.11.2026, R1): rechnet nach jedem Kartenwechsel
 * und jedem Questschritt das Feld aus, auf das der Hinweis zeigt, und gibt es der Szene.
 *
 * Rolle im Gesamtbild: Bindeglied zwischen Spielstand (laufende Quests, „Was jetzt?“), den Tiled-
 * Karten des Ortes (aus dem Paket, gemerkt) und der Szene (szene.ts, setzeZiel). Die Regeln stehen
 * in zielsuche.ts, das Zeichnen in zielmarker.ts, der Schalter im Spielmenü in
 * anbindung/Zielhinweiswahl.tsx.
 * Abhängigkeiten: kern.ts, zielsuche.ts, weltdaten.ts, daten/laden.ts, paket/paketlader.ts.
 */
import { useEffect } from "react";
import { useZielhinweisAn } from "../anbindung/zielhinweis";
import { findeKarte, type Ortdaten } from "../daten/laden";
import { liesPaketJson } from "../paket/paketlader";
import type { Abenteuerstand } from "../schnittstelle/spielstand";
import { szeneAus, type Oberweltkern } from "./kern";
import { wasJetzt } from "./wasjetzt";
import { ausloeserFuer, type Weltdaten } from "./weltdaten";
import { kartenbildAus, wegweiser, zielangaben, zielkarte, type Feld } from "./zielsuche";
import type { Kartenbild } from "./zielsuche";

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
      return kartenbildAus(k.kennung, fassungen, (name) => {
        const a = ausloeserFuer(ort, k.kennung, name);
        return a?.art === "uebergang" && a.ziel ? a.ziel.karte : null;
      });
    }),
  );
}

/**
 * Das Feld des Hinweises auf der Karte der Welt, oder null. Geladen werden der Ort der Welt und
 * die Orte der Ziele. Die erste Zielangabe, deren Karte sich finden lässt, entscheidet.
 * Beispiel: im Zimmer, Quest „Mama ist in der Küche“ → Feld des Auslösers „treppeUnten“.
 */
export async function zielfeld(w: Weltdaten, stand: Abenteuerstand): Promise<Feld | null> {
  const angaben = zielangaben(stand, w.daten);
  if (angaben.length === 0) return null;
  const orte = new Set<string>([w.ort.kennung]);
  for (const a of angaben) {
    const ort = a.ort ?? (a.karte ? findeKarte(w.daten, a.karte)?.ort.kennung : undefined);
    if (ort) orte.add(ort);
  }
  const listen = await Promise.all(
    w.daten.orte.filter((o) => orte.has(o.kennung)).map((o) => kartenbilderDesOrtes(o, w)),
  );
  const bilder = listen.flat();
  const angabe = angaben.find((a) => zielkarte(a, bilder) !== null);
  return angabe ? wegweiser(w.kennung, angabe, bilder) : null;
}

/** Gibt das Feld der Szene; fährt sie noch hoch, wird es kurz später noch einmal versucht. */
function gibSzene(k: Oberweltkern, feld: Feld | null, an: boolean, versuch = 0): void {
  const szene = szeneAus(k.spiel);
  if (szene) {
    szene.setzeZiel(feld, an);
    return;
  }
  if (versuch < VERSUCHE) setTimeout(() => gibSzene(k, feld, an, versuch + 1), WARTEN_MS);
}

/**
 * Hält den Zielhinweis der Szene aktuell. Neu gerechnet wird bei neuer Karte, neuem Questschritt,
 * neuer Lücke („Was jetzt?“) und beim Umschalten im Spielmenü.
 */
export function useZielhinweis(k: Oberweltkern): void {
  const an = useZielhinweisAn();
  const { welt, stand } = k;
  const quests = stand?.quests.map((q) => `${q.kennung}:${q.schritt}:${q.erledigt}`).join(",");
  const luecke = stand ? wasJetzt(stand.dialogvariablen) : null;
  const schluessel = `${welt?.kennung ?? ""}|${quests ?? ""}|${luecke ?? ""}`;
  useEffect(() => {
    const w = k.weltRef.current;
    const s = k.standRef.current;
    if (!w || !s) return;
    let aktiv = true;
    zielfeld(w, s)
      .then((feld) => {
        if (aktiv) gibSzene(k, feld, an);
      })
      .catch((fehler: unknown) => console.warn("Zielhinweis nicht berechnet:", fehler));
    return () => {
      aktiv = false;
    };
    // Nur der Schlüssel zählt; Kern und Refs sind über die Sitzung gleich.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schluessel, an]);
}
