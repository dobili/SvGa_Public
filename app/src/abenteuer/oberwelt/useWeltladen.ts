/**
 * Welt laden und Phaser starten, je Karte des Spielstands: erster Besuch eines Ortes (W2), Quest-
 * Ereignis „Karte betreten“, Tönung, Laterne und Fahrrad; beim Verlassen Position und Spielzeit
 * sichern und Phaser beenden.
 *
 * Rolle im Gesamtbild: Ausgelagert aus oberwelt/Oberwelt.tsx (Aufteilen, Schritt 6). Arbeitet auf
 * dem gemeinsamen Kern (kern.ts); was beim Betreten noch geschehen soll (Ergebnisse melden, die auf
 * die Welt gewartet haben), gibt die Oberwelt als `beiWelt` mit.
 * Abhängigkeiten: oberwelt/weltdaten.ts, oberwelt/oberweltspiel.ts, oberwelt/toenung.ts.
 */
import { useEffect, useState, type RefObject } from "react";
import { variablenAusBesitz, variablenNachBesuch } from "../regeln/dialogvariablen";
import type { Abenteuerstand } from "../schnittstelle/spielstand";
import { fehlertext } from "../texte/texte";
import { szeneAus, type Oberweltkern } from "./kern";
import { beendeOberwelt, starteOberwelt } from "./oberweltspiel";
import type { Ausloesertreffer } from "./szene";
import { aktuelleToenung } from "./toenung";
import { KACHELSATZ, ladeWelt, type Weltdaten } from "./weltdaten";

/** Gegenstand für den Lichtkreis auf dunklen Karten (Sperren S4, S9, S11, S14). */
const LATERNE = "laterne";
/** Gegenstand Fahrrad und sein Tempofaktor draußen (docs/spiel/08, W3). */
const FAHRRAD = "fahrrad";
const FAHRRAD_TEMPO = 2;
const MS_JE_SEKUNDE = 1000;

/** Was die Oberwelt beim Laden mitgibt. */
export interface Weltanschluss {
  /** Der Rahmen, in den Phaser zeichnet. */
  readonly rahmen: RefObject<HTMLDivElement | null>;
  /** Verstecktes Feld mit der Kachel des Helden (für Oberflächentests). */
  readonly kachelanzeige: RefObject<HTMLSpanElement | null>;
  readonly beiTreffer: (t: Ausloesertreffer | null) => void;
  /** Die Welt ist da: Ergebnisse melden, die auf sie gewartet haben. */
  readonly beiWelt: (w: Weltdaten) => void;
}

/** Erster Besuch eines Ortes (W2): merken, Dialogvariable `besucht<Ort>` für den Bus. */
function merkeBesuch(k: Oberweltkern, w: Weltdaten): void {
  const aktuell = k.standRef.current;
  if (!aktuell || aktuell.besuchteOrte.includes(w.ort.kennung)) return;
  k.schreibe({
    ...aktuell,
    besuchteOrte: [...aktuell.besuchteOrte, w.ort.kennung],
    dialogvariablen: { ...aktuell.dialogvariablen, ...variablenNachBesuch(w.ort.kennung) },
  });
}

/** Startet Phaser für eine geladene Welt. */
function starteSpiel(k: Oberweltkern, a: Weltanschluss, w: Weltdaten, stand: Abenteuerstand) {
  const rahmen = a.rahmen.current;
  if (!rahmen) return;
  const toenung = aktuelleToenung(w.karte, w.kennung, stand.dialogvariablen);
  k.zeigeToenung(toenung);
  k.spiel.current = starteOberwelt(rahmen, {
    karte: w.karte,
    kachelbild: w.kachelbild,
    heldbild: w.heldbild,
    figurbild: w.figurbild,
    heldfigur: w.heldfigur,
    figurenbilder: w.figurenbilder,
    moebel: w.moebel,
    hintergrund: w.hintergrund,
    belebungsbilder: w.belebungsbilder,
    toenung,
    laterne: stand.gegenstaende.includes(LATERNE),
    winter: w.winter,
    kachelsatz: KACHELSATZ,
    start: stand.position,
    // Fahrrad (docs/spiel/08, W3): doppeltes Tempo draußen.
    tempofaktor: !w.innen && stand.gegenstaende.includes(FAHRRAD) ? FAHRRAD_TEMPO : 1,
    melder: {
      beiAusloeser: a.beiTreffer,
      beiKachel: (x, y) => {
        if (a.kachelanzeige.current) a.kachelanzeige.current.textContent = `${x},${y}`;
      },
    },
  });
}

/** Beim Verlassen einer Karte: Position und Spielzeit (gesamt und je Ort) sichern. */
function sichereSitzung(k: Oberweltkern, karte: string, begonnen: number): void {
  const szene = szeneAus(k.spiel);
  const aktuell = k.dienste.liesStand();
  if (!szene || !aktuell || aktuell.position.karte !== karte) return;
  const position = { ...szene.position(), karte };
  const sekunden = Math.round((Date.now() - begonnen) / MS_JE_SEKUNDE);
  const ort = karte.split(".")[0] ?? "";
  void k.dienste.schreibeStand({
    ...aktuell,
    position,
    spielzeitSekunden: aktuell.spielzeitSekunden + sekunden,
    spielzeitJeOrt: {
      ...aktuell.spielzeitJeOrt,
      [ort]: (aktuell.spielzeitJeOrt[ort] ?? 0) + sekunden,
    },
  });
}

/**
 * Lädt die Welt zur Karte des Spielstands; gibt einen Ladefehler zurück (oder null).
 * Beispiel: Kartenwechsel von „mapleFalls.aussen“ nach „mapleFalls.club“ beendet Phaser, sichert
 * die Spielzeit in Maple Falls und startet die neue Karte.
 */
export function useWeltladen(k: Oberweltkern, a: Weltanschluss): string | null {
  const [fehler, setzeFehler] = useState<string | null>(null);
  const karte = k.stand?.position.karte;
  useEffect(() => {
    const stand = k.stand;
    if (!stand || !karte) return;
    let aktiv = true;
    // Beginn dieser Sitzung in der Welt, für die Spielzeit im Spielstand.
    const begonnen = Date.now();
    // Zustände der Karte dürfen auch nach Besitz fragen (hatLaterne, Runde 8).
    const variablen = { ...stand.dialogvariablen, ...variablenAusBesitz(stand) };
    ladeWelt(karte, stand.held.variante, variablen)
      .then((w) => {
        if (!aktiv || !a.rahmen.current) return;
        k.setzeWelt(w);
        merkeBesuch(k, w);
        // Karte betreten (Quests), dann Ergebnisse, die auf die Welt gewartet haben.
        k.melde({ art: "ort", karte: w.kennung }, w);
        a.beiWelt(w);
        starteSpiel(k, a, w, stand);
      })
      .catch((f: unknown) => setzeFehler(fehlertext(f)));
    return () => {
      aktiv = false;
      sichereSitzung(k, karte, begonnen);
      if (k.spiel.current) beendeOberwelt(k.spiel.current);
      k.spiel.current = null;
    };
    // Nur die Karte zählt: Ein Kartenwechsel baut die Welt neu auf, alles andere nicht.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [karte]);
  return fehler;
}
