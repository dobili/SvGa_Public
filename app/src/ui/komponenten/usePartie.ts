/**
 * Zustand einer Partie gegen die Engine auf dem Bildschirm: Züge, Engine, Uhr, Speichern.
 *
 * Rolle im Gesamtbild: Verbindet die reine Partie (spiel/) mit dem Speicher und der Engine. Die
 * Partie liegt immer im Speicher (speicher/partien.ts); jeder Zug, jede Rücknahme und jeder
 * Uhrstand wird sofort geschrieben, damit die Partie ein Neuladen übersteht. Ist die Engine am
 * Zug, wählt sie ihren Zug nach der Stufe (spiel/enginezug.ts) mit den Buchzügen der Kapitel 2
 * und 3; den Zug samt Bedenkzeit und Notmodus spielt ui/komponenten/botzug.ts. Die Uhr hält an, sobald die App in den Hintergrund geht oder der Bildschirm verlassen
 * wird, und läuft bei der Rückkehr weiter; zieht die Engine im Hintergrund, bleibt die Uhr
 * nach ihrem Zug stehen. Den angehaltenen Uhrstand sichert sie zusätzlich sofort im
 * Gerätespeicher, weil ein Neuladen das Schreiben in IndexedDB abbricht (uhrNotsicherung.ts, N180).
 * Abhängigkeiten: spiel/, speicher/, engine/, daten/laden.ts, schach/eroeffnungsindex.ts.
 */
import { useEffect, useMemo, useState } from "react";
import { AuftragAbgebrochen } from "../../engine/engineDienst";
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
  mitUhrverzug,
  zieheMitUhr,
} from "../../spiel/ablauf";
import { BUCHTREUE, BUCHTREUE_VORGABE } from "../../engine/zugwahl";
import {
  aktuelleFen,
  amZug,
  EROEFFNUNG_BUCH,
  gibAuf,
  leserzug,
  type Partie,
} from "../../spiel/partie";
import { findePartie } from "../../speicher/partien";
import { useSpeicher } from "../../speicher/speicher";
import { useDaten } from "./useDaten";
import { aendereNeueste, neueste, normalerBotzug, spieleVorzug, stufeFuer } from "./botzug";
import { vorzugFuer } from "./botNotmodus";
import { mitGesicherterUhr, sichereUhr, verwerfeUhrsicherung } from "./uhrNotsicherung";
import { animationsverzugMs } from "../brett/useZuganimation";

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
 * Die Buchzüge für die Engine: ohne Vorgabe (null) keine, die Engine spielt selbst (0.2.40);
 * „buch“: alle Buchzüge mit der üblichen Buchtreue; eine bestimmte Eröffnung (0.2.39): nur die
 * Züge, die in ihr bleiben, mit Buchtreue 1, und nach dem Verlassen wieder alle Buchzüge.
 */
function buchzuegeFuer(
  index: Eroeffnungsindex | null,
  fen: string,
  eroeffnung: string | null,
): { zuege: string[]; treue: number } {
  if (!index || eroeffnung === null) return { zuege: [], treue: BUCHTREUE };
  if (eroeffnung !== EROEFFNUNG_BUCH) {
    const inDerEroeffnung = buchzuegeZu(index, fen, eroeffnung);
    if (inDerEroeffnung.length > 0) return { zuege: inDerEroeffnung, treue: BUCHTREUE_VORGABE };
  }
  return { zuege: buchzuegeAb(index, fen), treue: BUCHTREUE };
}

/** Lässt die Engine ziehen, solange sie am Zug ist; im Notmodus mit Vorzügen. */
function useEngineZug(partie: Partie | null, fen: string, amZugEngine: boolean) {
  const buch = useBuch();
  const [fehler, setzeFehler] = useState<string | null>(null);
  const [versuch, setzeVersuch] = useState(0);
  const id = partie?.id ?? "";
  const stufennummer = partie ? stufeFuer(partie, fen) : 1;
  const eroeffnung = partie?.einstellung.eroeffnung ?? null;
  useEffect(() => {
    if (!amZugEngine || !buch.bereit) return;
    let aktiv = true;
    const laeuft = () => aktiv;
    const jetzige = neueste(id);
    const buchzuege = buchzuegeFuer(buch.index, fen, eroeffnung);
    (jetzige ? vorzugFuer(id, jetzige) : Promise.resolve(null))
      .then((vorzug) =>
        vorzug === null
          ? normalerBotzug(id, fen, stufennummer, buchzuege, laeuft)
          : spieleVorzug(id, fen, vorzug, stufennummer, laeuft),
      )
      .then(() => {
        if (aktiv) setzeFehler(null);
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

/**
 * Hält die Uhr an und sichert sie zusätzlich sofort im Gerätespeicher (N180): Das Schreiben in
 * IndexedDB bricht beim Neuladen ab, der Merker nicht.
 */
function pausiereUndSichere(partie: Partie, jetztMs: number): Partie {
  const angehalten = pausiere(partie, jetztMs);
  sichereUhr(angehalten);
  return angehalten;
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
    const fortsetzen = () => {
      aendereNeueste(id, (p) => setzeUhrFort(p, Date.now()));
      verwerfeUhrsicherung();
    };
    const anhalten = () => aendereNeueste(id, (p) => pausiereUndSichere(p, Date.now()));
    const beiSichtbarkeit = () => {
      if (document.visibilityState === "hidden") return anhalten();
      // Die Anzeige rechnet mit jetztMs; ohne Auffrischen zeigte sie nach der Rückkehr einen
      // Takt lang die Zeit im Hintergrund als Guthaben (Befund beim Prüfen von N179).
      setzeJetzt(Date.now());
      fortsetzen();
    };
    // Nach einem abgebrochenen Speichern (Neuladen, N180) gilt der sofort gesicherte Uhrstand.
    aendereNeueste(id, mitGesicherterUhr);
    fortsetzen();
    document.addEventListener("visibilitychange", beiSichtbarkeit);
    window.addEventListener("pagehide", anhalten);
    return () => {
      document.removeEventListener("visibilitychange", beiSichtbarkeit);
      window.removeEventListener("pagehide", anhalten);
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
    partie !== null &&
    partie.ende === null &&
    partie.einstellung.gegner === "engine" &&
    amZug(partie) !== partie.einstellung.eigeneFarbe;
  const fehler = useEngineZug(partie, fen, amZugEngine);
  const jetztMs = useUhr(id, Boolean(partie?.uhr?.laeuft) && !partie?.ende, geladen);
  return {
    partie,
    geladen,
    fen,
    engineDenkt: amZugEngine && fehler === null,
    fehler,
    jetztMs,
    // R37: Die Uhr der Gegenseite läuft erst, wenn der Zug über das Brett geglitten ist.
    spieleLeser: (san) =>
      aendereNeueste(id, (p) =>
        mitUhrverzug(zieheMitUhr(p, leserzug(san), Date.now()), animationsverzugMs()),
      ),
    nimmZurueck: () => aendereNeueste(id, (p) => nimmZurueckMitUhr(p, Date.now())),
    gibAuf: () => aendereNeueste(id, (p) => gibAuf(pausiere(p, Date.now()))),
  };
}
