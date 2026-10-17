/**
 * Wertet die Partie mit der Engine aus: während der Partie im Hintergrund, wenn der Leser am Zug
 * ist, sonst nach dem Ende; jede Stellung kurz bewerten.
 *
 * Rolle im Gesamtbild: Konzept 8.3 „Auswertung: Bewertung jeder Stellung im Hintergrund“. Seit
 * 0.2.40 (Wunsch des Autors) läuft die Bewertung schon während der Partie, solange der Leser
 * nachdenkt: Jede fertige Stellung kommt in einen Zwischenspeicher (je Partie, je Stellung mit
 * ihrer FEN; nach einer Rücknahme passen die alten Einträge nicht mehr zur FEN und werden neu
 * gerechnet). Die Engine bekommt diese Aufträge nur, wenn sie frei ist, damit Hinweise, Werkzeuge
 * und der Zug der Engine Vorrang haben; wird ein Auftrag trotzdem unterbrochen, kommt die Stellung
 * später noch einmal dran. Am Ende der Partie fehlen meist nur die letzten Stellungen, das
 * Ergebnis (Wert, bester Zug, Abstand zum zweitbesten je Stellung) kommt in den Speicher
 * (speicher/partien.ts, mitWerten), damit die Auswertung nur einmal läuft. Während der Partie
 * zeigt die App nichts davon (es verriete zu viel). Endstellungen (Matt, Patt) brauchen keine
 * Engine.
 * Abhängigkeiten: engine/engineDienst.ts, engine/spielbewerter.ts (wertFuer), spiel/, speicher/.
 */
import { useEffect, useState } from "react";
import { AuftragAbgebrochen, engine } from "../../engine/engineDienst";
import { wertFuer } from "../../engine/spielbewerter";
import { ausreisser, endwert } from "../../spiel/auswertung";
import { stellungen, type Partie } from "../../spiel/partie";
import { mitWerten, type Partieeintrag } from "../../speicher/partien";
import { aendere } from "../../speicher/speicher";

/**
 * Rechenzeit je Stellung nach dem Ende der Partie: 40 Züge brauchen so etwa 40 Sekunden.
 * Während der Partie, solange der Leser nachdenkt, rechnet die Engine länger (Wunsch des Autors,
 * 17.10.2026: Die Zeit ist ohnehin da; chess.com „Maximal“ ändert die Zahlen nur um einen Punkt,
 * aber einzelne Fehlurteile bei kurzer Rechenzeit werden seltener). Braucht der Leser die Engine
 * (Hinweis, Werkzeug, Zug der Engine), bricht der Auftrag ab und die Stellung kommt später dran.
 */
const RECHENZEIT_MS = 500;
const RECHENZEIT_IM_SPIEL_MS = 2000;
/**
 * Nachprüfung verdächtiger Stellungen (spiel/auswertung.ts, ausreisser) mit mehr Rechenzeit: Ein
 * Wert, der um 3 springt und sofort zurückspringt, ist bei 500 ms meist ein Fehler der Engine.
 */
const NACHPRUEFUNG_MS = 2000;
/** Zwei Varianten: die beste und die zweitbeste, für das „!“ des einzigen guten Zuges. */
const VARIANTEN = 2;
/** So viele Halbzüge der Hauptvariante bleiben gespeichert (Rückblickkarte „Danach etwa …“, R5). */
const VARIANTE_HALBZUEGE = 6;
/** So lange wartet die Hintergrund-Auswertung, wenn die Engine beschäftigt ist. */
const WARTEZEIT_MS = 300;
/** So lange nach einer Unterbrechung, bevor dieselbe Stellung noch einmal drankommt. */
const PAUSE_NACH_ABBRUCH_MS = 600;

export type Auswertungsstand =
  | { readonly art: "fertig" }
  | { readonly art: "laeuft"; readonly erledigt: number; readonly gesamt: number }
  | { readonly art: "fehler"; readonly meldung: string };

/** Das Ergebnis für eine Stellung: Wert aus Sicht von Weiß, bester Zug, Abstand zum zweitbesten. */
interface Stellungswert {
  readonly fen: string;
  readonly wert: number;
  readonly bester: string;
  readonly abstand: number;
  /** Hauptvariante der Engine (UCI, beginnt mit dem besten Zug), bis sechs Halbzüge. */
  readonly variante: readonly string[];
}

/** Zwischenspeicher je Partie: je Stellung das Ergebnis, gültig, solange die FEN passt. */
const zwischenspeicher = new Map<string, (Stellungswert | undefined)[]>();

function pause(ms: number): Promise<void> {
  return new Promise((erfuellen) => {
    setTimeout(erfuellen, ms);
  });
}

/**
 * Wert (aus Sicht von Weiß), bester Zug und Abstand zum zweitbesten Zug einer Stellung; null,
 * wenn die Auswertung inzwischen nicht mehr laufen soll.
 */
async function bewerteStellung(
  fen: string,
  laeuft: () => boolean,
  rechenzeitMs = RECHENZEIT_MS,
): Promise<Stellungswert | null> {
  const ende = endwert(fen);
  if (ende !== null) return { fen, wert: ende, bester: "", abstand: 0, variante: [] };
  while (laeuft()) {
    if (engine.beschaeftigt()) {
      await pause(WARTEZEIT_MS);
      continue;
    }
    try {
      const bewertung = await engine.bewerte(fen, rechenzeitMs, VARIANTEN);
      const [erste, zweite] = bewertung.varianten;
      const weissAmZug = fen.split(" ")[1] !== "b";
      const abstand =
        erste && zweite ? wertFuer(erste.wert, weissAmZug) - wertFuer(zweite.wert, weissAmZug) : 0;
      return {
        fen,
        wert: erste ? wertFuer(erste.wert, true) : 0,
        bester: bewertung.besterZug ?? "",
        abstand: Math.max(0, abstand),
        variante: erste ? erste.zuege.slice(0, VARIANTE_HALBZUEGE) : [],
      };
    } catch (grund: unknown) {
      if (!(grund instanceof AuftragAbgebrochen)) throw grund;
      await pause(PAUSE_NACH_ABBRUCH_MS);
    }
  }
  return null;
}

/**
 * Prüft verdächtige Werte (Sprung und sofortiger Rücksprung) mit mehr Rechenzeit nach und ersetzt
 * sie; bricht ab, wenn die Auswertung nicht mehr laufen soll.
 */
async function nachpruefen(
  werte: (Stellungswert | undefined)[],
  laeuft: () => boolean,
): Promise<boolean> {
  const verdaechtig = ausreisser(werte.map((w) => w?.wert ?? 0));
  for (const i of verdaechtig) {
    const fen = werte[i]?.fen;
    if (!fen) continue;
    const ergebnis = await bewerteStellung(fen, laeuft, NACHPRUEFUNG_MS);
    if (!ergebnis) return false;
    werte[i] = ergebnis;
  }
  return true;
}

/** Die gültigen Einträge des Zwischenspeichers zu den Stellungen der Partie. */
function gueltige(id: string, alle: readonly string[]): (Stellungswert | undefined)[] {
  const bisher = zwischenspeicher.get(id) ?? [];
  return alle.map((fen, i) => (bisher[i]?.fen === fen ? bisher[i] : undefined));
}

/** Schreibt die fertige Auswertung in den Speicher und räumt den Zwischenspeicher. */
function speichere(id: string, werte: readonly Stellungswert[]): void {
  void aendere((d) => ({
    ...d,
    spiel: mitWerten(
      d.spiel,
      id,
      werte.map((w) => w.wert),
      werte.map((w) => w.bester),
      werte.map((w) => w.abstand),
      werte.map((w) => w.variante),
    ),
  }));
  zwischenspeicher.delete(id);
}

/**
 * Startet die Auswertung: im Hintergrund, solange `imHintergrund` gilt (Leser am Zug, Partie
 * läuft), und nach dem Ende, solange der Eintrag noch keine Werte hat. Ausgabe: Stand mit
 * Fortschritt für die Anzeige nach dem Ende.
 * Beispiel: eine Partie mit 20 Halbzügen, während der Partie 18 Stellungen vorgerechnet → nach
 * dem Ende „läuft 18 von 21“, kurz darauf „fertig“.
 */
export function useAuswertung(
  partie: Partie,
  eintrag: Partieeintrag | null,
  imHintergrund: boolean,
): Auswertungsstand {
  const nachher = partie.ende !== null && eintrag !== null && eintrag.werte.length === 0;
  const aktivieren = imHintergrund || nachher;
  const id = partie.id;
  const halbzuege = partie.zuege.length;
  const [stand, setzeStand] = useState<Auswertungsstand>({ art: "fertig" });
  useEffect(() => {
    if (!aktivieren) return;
    let aktiv = true;
    const alle = stellungen(partie);
    const werte = gueltige(id, alle);
    zwischenspeicher.set(id, werte);
    const weiter = async () => {
      for (let i = 0; i < alle.length; i += 1) {
        if (!aktiv) return;
        if (werte[i]) continue;
        if (nachher) setzeStand({ art: "laeuft", erledigt: i, gesamt: alle.length });
        const rechenzeit = nachher ? RECHENZEIT_MS : RECHENZEIT_IM_SPIEL_MS;
        const ergebnis = await bewerteStellung(alle[i] ?? "", () => aktiv, rechenzeit);
        if (!ergebnis) return;
        werte[i] = ergebnis;
      }
      if (nachher && !(await nachpruefen(werte, () => aktiv))) return;
      const fertig = werte.flatMap((w) => (w ? [w] : []));
      if (aktiv && nachher && fertig.length === alle.length) speichere(id, fertig);
    };
    weiter().catch((grund: unknown) => {
      if (!aktiv) return;
      console.error("Auswertung fehlgeschlagen:", grund);
      setzeStand({
        art: "fehler",
        meldung: grund instanceof Error ? grund.message : String(grund),
      });
    });
    return () => {
      aktiv = false;
    };
    // Maßgeblich sind Kennung und Zahl der Halbzüge; die Partie selbst ändert sich nur mit ihnen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, halbzuege, aktivieren, nachher]);
  if (!nachher) return { art: "fertig" };
  // Vor dem ersten Schritt der Auswertung: schon als „läuft“ zeigen.
  return stand.art === "fertig" ? { art: "laeuft", erledigt: 0, gesamt: 1 } : stand;
}
