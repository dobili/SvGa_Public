/**
 * Partie der App → Partieergebnis des Abenteuers (Baustein F2, docs/spiel/04_Architektur.md,
 * Abschnitt 3, Schritt 5 bis 7).
 *
 * Rolle im Gesamtbild: Beim Rückweg liest das Spiel die beendete Partie aus dem Speicher der
 * App und übernimmt alles, was es braucht, in seinen eigenen Spielstand; die Partienliste der App
 * hält nur 50 Partien. Schlüsselmomente kommen im Prototyp nur aus den Zügen des Bots (die App
 * speichert dort Fehlerart und Verlust); der kurze Engine-Durchgang über die Züge des Lesers
 * (Baustein F6) und der Kipppunkt (B1) folgen mit den Spielsystemen (Schritt 8).
 * Abhängigkeiten: spiel/partie.ts, spiel/pgn.ts, spiel/ergebnis.ts, schach/phase.ts,
 * schnittstelle/partie.ts.
 * Beispiel: Leser Weiß, Matt durch Weiß im 23. Zug → ausgang „sieg“, halbzuege 45, zwei Momente
 * mit den größten Verlusten des Bots.
 */
import { phasenJeStellung } from "../../spiel/phasen";
import { alsPgn } from "../../spiel/pgn";
import { stellungen, type Partie } from "../../spiel/partie";
import type { Kartenspiel } from "../schnittstelle/karten";
import type { Ausgang, Partieergebnis, Schluesselmoment } from "../schnittstelle/partie";

/** Höchstens so viele Momente zeigt Ambrose nach der Partie (Dokument 02, 2.2). */
export const MOMENTE_JE_PARTIE = 2;

/** Ausgang aus Sicht des Lesers. */
export function ausgangAus(partie: Partie): Ausgang {
  const ende = partie.ende;
  if (!ende) return "abgebrochen";
  if ("sieger" in ende)
    return ende.sieger === partie.einstellung.eigeneFarbe ? "sieg" : "niederlage";
  return "remis";
}

/**
 * Die Momente aus den Zügen des Bots: absichtliche Fehler mit dem größten Verlust, höchstens
 * MOMENTE_JE_PARTIE, in Partiereihenfolge.
 */
export function momenteAus(partie: Partie): Schluesselmoment[] {
  const fens = stellungen(partie);
  const phasen = phasenJeStellung(partie);
  const kandidaten = partie.zuege
    .map((zug, halbzug) => ({ zug, halbzug }))
    .filter(({ zug }) => zug.von === "engine" && zug.fehler !== null && zug.verlust > 0)
    .sort((a, b) => b.zug.verlust - a.zug.verlust)
    .slice(0, MOMENTE_JE_PARTIE)
    .sort((a, b) => a.halbzug - b.halbzug);
  return kandidaten.map(({ zug, halbzug }) => ({
    halbzug,
    fen: fens[halbzug] ?? partie.einstellung.startFen,
    gespielt: zug.san,
    besser: null,
    klasse: zug.verlust >= PATZER_AB ? "patzer" : "fehler",
    verlust: zug.verlust,
    buchbezug: null,
    wessen: "gegner",
    phase: phasen[halbzug] ?? "mittelspiel",
  }));
}

/** Ab diesem Verlust in Bauern heißt ein Zug Patzer (wie die Zugklassen der Auswertung, grob). */
const PATZER_AB = 3;

/** Dauer der Partie in Sekunden aus der Uhr (null ohne Uhr: dann aus Beginn und Ende). */
function sekundenAus(partie: Partie, beendet: Date): number {
  const begonnen = Date.parse(partie.begonnen);
  return Number.isFinite(begonnen)
    ? Math.max(0, Math.round((beendet.getTime() - begonnen) / 1000))
    : 0;
}

/**
 * Das Partieergebnis einer beendeten Partie des Abenteuers.
 *
 * Eingaben: die Partie (mit Feld `abenteuer`), die in der Partie gespielten Karten (aus dem
 * Spielstand), der Zeitpunkt des Lesens. Ausgabe: null, wenn die Partie noch läuft oder nicht
 * zum Abenteuer gehört.
 */
export function partieergebnisAus(
  partie: Partie,
  gespielteKarten: readonly Kartenspiel[],
  heldname: string,
  jetzt: Date,
): Partieergebnis | null {
  const kennung = partie.einstellung.abenteuer?.kennung;
  if (!kennung || !partie.ende) return null;
  return {
    kennung,
    appPartieId: partie.id,
    ausgang: ausgangAus(partie),
    ende: partie.ende,
    pgn: alsPgn(partie, {
      ereignis: "Schach-Abenteuer",
      leser: heldname,
      engine: partie.einstellung.botName ?? "Gegner",
    }),
    halbzuege: partie.zuege.length,
    sekunden: sekundenAus(partie, jetzt),
    gespielteKarten,
    ruecknahmen: partie.ruecknahmen,
    momente: momenteAus(partie),
    kipppunkt: null,
    genauigkeit: null,
    geschaetzteStaerke: null,
    beendet: jetzt.toISOString(),
  };
}
