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
import { ladeEroeffnungsliste, ladePraxisbuch } from "../../daten/laden";
import { praxislinie, type Praxisbuch } from "../../engine/praxisbuch";
import { familieDerBucheroeffnung, zuegeDerFamilie } from "../../schach/eroeffnungsfamilie";
import type { Eroeffnungsnamen } from "../../schach/eroeffnungsnamen";
import { eroeffnungsnamenFuer } from "../../schach/eroeffnungsindexVorrat";
import { buchzuegeAb, buchzuegeZu, type Eroeffnungsindex } from "../../schach/eroeffnungsindex";
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
  EROEFFNUNG_PRAXIS,
  PRAXIS_VORSILBE,
  gibAuf,
  leserzug,
  type Partie,
} from "../../spiel/partie";
import { findePartie } from "../../speicher/partien";
import { useSpeicher } from "../../speicher/speicher";
import { useDaten } from "./useDaten";
import { ladeEroeffnungsindex } from "./useEroeffnungsindex";
import {
  aendereNeueste,
  neueste,
  normalerBotzug,
  spieleVorzug,
  stufeFuer,
  type Buchvorgabe,
} from "./botzug";
import { vorzugFuer } from "./botNotmodus";
import { mitGesicherterUhr, sichereUhr, verwerfeUhrsicherung } from "./uhrNotsicherung";
import { animationsverzugMs } from "../brett/useZuganimation";

/** So oft fragt die Anzeige die Uhr ab (Millisekunden). */
const TAKT_MS = 200;

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

/**
 * Der Eröffnungsindex für den Eröffnungsmodus und die Lichess-Liste (R24); bereit auch dann, wenn
 * das Laden scheitert (dann ohne Liste). Seit V6 beide aus dem Vorrat (einmal gebaut, das erste Mal
 * erst nach dem nächsten Bild), damit „Partie beginnen“ sofort die Partie zeigt.
 */
function useBuch() {
  const daten = useDaten(() => ladeEroeffnungsindex(), "eroeffnungen");
  const liste = useDaten(ladeEroeffnungsliste, "eroeffnungsliste");
  const praxisdaten = useDaten(ladePraxisbuch, "praxisbuch");
  const praxis = praxisdaten.art === "fertig" ? praxisdaten.wert : null;
  const index = daten.art === "fertig" ? daten.wert : null;
  const bekannte = useMemo<Eroeffnungsnamen>(
    () => (liste.art === "fertig" ? eroeffnungsnamenFuer(liste.wert) : new Map()),
    [liste],
  );
  const bereit = daten.art !== "laedt" && liste.art !== "laedt" && praxisdaten.art !== "laedt";
  // Stabil halten: Das Objekt steht in den Abhängigkeiten des Zug-Effekts (useEngineZug).
  return useMemo(() => ({ bereit, index, bekannte, praxis }), [bereit, index, bekannte, praxis]);
}

/**
 * Die Buchzüge für die Engine: ohne Vorgabe (null) keine, die Engine spielt selbst (0.2.40);
 * „buch“: alle Buchzüge mit der üblichen Buchtreue; eine bestimmte Eröffnung (0.2.39): nur die
 * Züge, die in ihr bleiben, mit Buchtreue 1. Ohne solchen Buchzug seit R24 (Wunsch des Autors)
 * Züge derselben Familie aus der Lichess-Liste, ebenfalls mit Buchtreue 1; erst danach wieder
 * alle Buchzüge.
 */
function buchzuegeFuer(
  buch: { index: Eroeffnungsindex | null; bekannte: Eroeffnungsnamen; praxis: Praxisbuch | null },
  fen: string,
  eroeffnung: string | null,
): Buchvorgabe {
  const { index, bekannte, praxis } = buch;
  const ohne = { zuege: [], treue: BUCHTREUE };
  if (eroeffnung === null) return ohne;
  // Seit 0.2.128: wie Menschen der Stärke des Bots, oder eine benannte Eröffnung aus der Praxis
  if (eroeffnung === EROEFFNUNG_PRAXIS)
    return { ...ohne, praxis: praxis && { buch: praxis, linie: [] } };
  if (eroeffnung.startsWith(PRAXIS_VORSILBE)) {
    const linie = praxis ? praxislinie(praxis, eroeffnung.slice(PRAXIS_VORSILBE.length)) : [];
    return { ...ohne, praxis: praxis && { buch: praxis, linie } };
  }
  if (!index) return ohne;
  if (eroeffnung !== EROEFFNUNG_BUCH) {
    const inDerEroeffnung = buchzuegeZu(index, fen, eroeffnung);
    if (inDerEroeffnung.length > 0) return { zuege: inDerEroeffnung, treue: BUCHTREUE_VORGABE };
    const familie = familieDerBucheroeffnung(index, bekannte, eroeffnung);
    const ausDerListe = familie ? zuegeDerFamilie(bekannte, fen, familie) : [];
    if (ausDerListe.length > 0) return { zuege: ausDerListe, treue: BUCHTREUE_VORGABE };
  }
  // Nach dem Ende der Buch-Eröffnung (seit 0.2.128): weiter wie Menschen, nicht wie die Engine
  return {
    zuege: buchzuegeAb(index, fen),
    treue: BUCHTREUE,
    praxis: praxis && { buch: praxis, linie: [] },
  };
}

/** Lässt die Engine ziehen, solange sie am Zug ist; im Notmodus mit Vorzügen. */
function useEngineZug(partie: Partie | null, fen: string, amZugEngine: boolean) {
  const buch = useBuch();
  const [fehler, setzeFehler] = useState<string | null>(null);
  const [versuch, setzeVersuch] = useState(0);
  const id = partie?.id ?? "";
  // Die Stufe hängt an der Phase der Stellung (spiel/phasen.ts, eine ganze Stellungsanalyse).
  // Seit V6 nur, wenn die Engine am Zug ist, und nur neu bei neuer Stellung oder neuem Zug: Vorher
  // lief sie bei jedem Takt der Uhr (alle 200 ms) und schon beim Öffnen der Partie mit.
  const zuege = partie?.zuege;
  const einstellung = partie?.einstellung;
  const stufennummer = useMemo(
    () => (amZugEngine && zuege && einstellung ? stufeFuer({ zuege, einstellung }, fen) : 1),
    [amZugEngine, zuege, einstellung, fen],
  );
  const eroeffnung = partie?.einstellung.eroeffnung ?? null;
  useEffect(() => {
    if (!amZugEngine || !buch.bereit) return;
    let aktiv = true;
    const laeuft = () => aktiv;
    const jetzige = neueste(id);
    const buchzuege = buchzuegeFuer(buch, fen, eroeffnung);
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
  }, [id, fen, amZugEngine, buch, stufennummer, eroeffnung, versuch]);
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
