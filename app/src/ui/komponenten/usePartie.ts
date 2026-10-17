/**
 * Zustand einer Partie gegen die Engine auf dem Bildschirm: Züge, Engine, Uhr, Speichern.
 *
 * Rolle im Gesamtbild: Verbindet die reine Partie (spiel/) mit dem Speicher und der Engine. Die
 * Partie liegt immer im Speicher (speicher/partien.ts); jeder Zug, jede Rücknahme und jeder
 * Uhrstand wird sofort geschrieben, damit die Partie ein Neuladen übersteht. Ist die Engine am
 * Zug, wählt sie ihren Zug nach der Stufe (spiel/enginezug.ts) mit den Buchzügen der Kapitel 2
 * und 3. Die Uhr hält an, sobald die App in den Hintergrund geht oder der Bildschirm verlassen
 * wird, und läuft bei der Rückkehr weiter; zieht die Engine im Hintergrund, bleibt die Uhr
 * nach ihrem Zug stehen.
 * Abhängigkeiten: spiel/, speicher/, engine/, daten/laden.ts, schach/eroeffnungsindex.ts.
 */
import { useEffect, useMemo, useState } from "react";
import { AuftragAbgebrochen, engine } from "../../engine/engineDienst";
import { stufe } from "../../engine/stufen";
import { ladeKapitel } from "../../daten/laden";
import {
  baueEroeffnungsindex,
  buchzuegeAb,
  buchzuegeZu,
  type Eroeffnungsindex,
} from "../../schach/eroeffnungsindex";
import {
  nimmZurueckMitUhr,
  pausiere,
  pruefeZeit,
  setzeUhrFort,
  zieheMitUhr,
} from "../../spiel/ablauf";
import { BUCHTREUE, BUCHTREUE_VORGABE } from "../../engine/zugwahl";
import { engineZug } from "../../spiel/enginezug";
import { aktuelleFen, amZug, gibAuf, leserzug, type Partie } from "../../spiel/partie";
import { findePartie, mitPartie } from "../../speicher/partien";
import { aendere, speicherzustand, useSpeicher } from "../../speicher/speicher";
import { useDaten } from "./useDaten";

/** So oft fragt die Anzeige die Uhr ab (Millisekunden). */
const TAKT_MS = 200;
const BUCHKAPITEL = [2, 3];

export interface Partiesteuerung {
  /** Die Partie; null, solange der Speicher lädt oder wenn es sie nicht mehr gibt. */
  readonly partie: Partie | null;
  readonly geladen: boolean;
  readonly fen: string;
  readonly engineDenkt: boolean;
  /** Fehler der Engine, für den Leser sichtbar. */
  readonly fehler: string | null;
  /** Zeitpunkt für die Anzeige der Uhr. */
  readonly jetztMs: number;
  readonly spieleLeser: (san: string) => void;
  readonly nimmZurueck: () => void;
  readonly gibAuf: () => void;
}

/** Die Partie in ihrem neuesten Stand (nicht aus einem älteren Render). */
function neueste(id: string): Partie | null {
  return findePartie(speicherzustand().daten.spiel, id);
}

/** Schreibt eine Partie in den Speicher (laufend oder, wenn beendet, abgelegt). */
function schreibe(partie: Partie): void {
  void aendere((daten) => ({ ...daten, spiel: mitPartie(daten.spiel, partie) }));
}

/** Ändert die neueste Partie mit einer reinen Funktion; Gleiches schreibt nichts. */
function aendereNeueste(id: string, aenderung: (partie: Partie) => Partie | null): void {
  const partie = neueste(id);
  const neu = partie ? aenderung(partie) : null;
  if (neu && neu !== partie) schreibe(neu);
}

/** Der Eröffnungsindex für den Eröffnungsmodus; bereit auch dann, wenn das Laden scheitert. */
function useBuch() {
  const daten = useDaten(() => Promise.all(BUCHKAPITEL.map(ladeKapitel)), "eroeffnungen");
  const index = useMemo(
    () => (daten.art === "fertig" ? baueEroeffnungsindex(daten.wert) : null),
    [daten],
  );
  return { bereit: daten.art !== "laedt", index };
}

/**
 * Die Buchzüge für die Engine: bei vorgegebener Eröffnung (0.2.39) nur die, die in ihr bleiben,
 * und dann mit Buchtreue 1; sonst alle Buchzüge mit der üblichen Buchtreue.
 */
function buchzuegeFuer(
  index: Eroeffnungsindex | null,
  fen: string,
  eroeffnung: string | null,
): { zuege: string[]; treue: number } {
  if (!index) return { zuege: [], treue: BUCHTREUE };
  if (eroeffnung) {
    const inDerEroeffnung = buchzuegeZu(index, fen, eroeffnung);
    if (inDerEroeffnung.length > 0) return { zuege: inDerEroeffnung, treue: BUCHTREUE_VORGABE };
  }
  return { zuege: buchzuegeAb(index, fen), treue: BUCHTREUE };
}

/** Lässt die Engine ziehen, solange sie am Zug ist. */
function useEngineZug(partie: Partie | null, fen: string, amZugEngine: boolean) {
  const buch = useBuch();
  const [fehler, setzeFehler] = useState<string | null>(null);
  const [versuch, setzeVersuch] = useState(0);
  const id = partie?.id ?? "";
  const stufennummer = partie?.einstellung.stufe ?? 1;
  const eroeffnung = partie?.einstellung.eroeffnung ?? null;
  useEffect(() => {
    if (!amZugEngine || !buch.bereit) return;
    let aktiv = true;
    const buchzuege = buchzuegeFuer(buch.index, fen, eroeffnung);
    engineZug(engine, fen, stufe(stufennummer), buchzuege.zuege, Math.random, buchzuege.treue)
      .then((zug) => {
        const jetzt = neueste(id);
        if (!aktiv || !jetzt || aktuelleFen(jetzt) !== fen) return;
        if (!zug) throw new Error(`Kein Zug der Engine in ${fen}`);
        setzeFehler(null);
        // Im Hintergrund bleibt die Uhr nach dem Zug stehen (sonst liefe die Zeit des Lesers).
        const sichtbar = document.visibilityState !== "hidden";
        aendereNeueste(id, (p) => zieheMitUhr(p, zug, Date.now(), sichtbar));
      })
      .catch((grund: unknown) => {
        if (grund instanceof AuftragAbgebrochen) {
          // Ein anderer Auftrag (etwa ein Hinweis) hat die Engine unterbrochen: neu versuchen.
          if (aktiv) setzeVersuch((v) => v + 1);
          return;
        }
        console.error("Engine-Zug fehlgeschlagen:", grund);
        if (aktiv) setzeFehler(grund instanceof Error ? grund.message : String(grund));
      });
    return () => {
      aktiv = false;
    };
  }, [id, fen, amZugEngine, buch.bereit, buch.index, stufennummer, eroeffnung, versuch]);
  return fehler;
}

/** Uhr: Takt für die Anzeige, Zeitüberschreitung, Pause im Hintergrund. */
function useUhr(id: string, laeuft: boolean, geladen: boolean): number {
  const [jetztMs, setzeJetzt] = useState(() => Date.now());
  useEffect(() => {
    if (!laeuft) return;
    const takt = window.setInterval(() => {
      const zeit = Date.now();
      setzeJetzt(zeit);
      aendereNeueste(id, (p) => pruefeZeit(p, zeit));
    }, TAKT_MS);
    return () => window.clearInterval(takt);
  }, [id, laeuft]);
  useEffect(() => {
    if (!geladen) return;
    const fortsetzen = () => aendereNeueste(id, (p) => setzeUhrFort(p, Date.now()));
    const anhalten = () => aendereNeueste(id, (p) => pausiere(p, Date.now()));
    const beiSichtbarkeit = () =>
      document.visibilityState === "hidden" ? anhalten() : fortsetzen();
    fortsetzen();
    document.addEventListener("visibilitychange", beiSichtbarkeit);
    return () => {
      document.removeEventListener("visibilitychange", beiSichtbarkeit);
      anhalten();
    };
  }, [id, geladen]);
  return jetztMs;
}

/**
 * Steuert die Partie mit dieser Kennung.
 *
 * Beispiel: usePartie("p-…") auf dem Partie-Bildschirm; spieleLeser("e4") zieht, danach
 * antwortet die Engine von selbst.
 */
export function usePartie(id: string): Partiesteuerung {
  const geladen = useSpeicher((z) => z.geladen);
  const partie = useSpeicher((z) => findePartie(z.daten.spiel, id));
  const fen = partie ? aktuelleFen(partie) : "";
  const amZugEngine =
    partie !== null && partie.ende === null && amZug(partie) !== partie.einstellung.eigeneFarbe;
  const fehler = useEngineZug(partie, fen, amZugEngine);
  const jetztMs = useUhr(id, Boolean(partie?.uhr?.laeuft) && !partie?.ende, geladen);
  return {
    partie,
    geladen,
    fen,
    engineDenkt: amZugEngine && fehler === null,
    fehler,
    jetztMs,
    spieleLeser: (san) => aendereNeueste(id, (p) => zieheMitUhr(p, leserzug(san), Date.now())),
    nimmZurueck: () => aendereNeueste(id, (p) => nimmZurueckMitUhr(p, Date.now())),
    gibAuf: () => aendereNeueste(id, (p) => gibAuf(pausiere(p, Date.now()))),
  };
}
