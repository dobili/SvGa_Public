/**
 * Nach der Antwort in den Bilanz-Trainern: die Einschätzung der Engine mit Bewertungsbalken und
 * der besten Fortsetzung zum Durchspielen, dazu der Vergleich mit dem Urteil der Bilanz.
 *
 * Rolle im Gesamtbild: Punkt B3 des Nebenchats (Regel E: Balken erst nach der Entscheidung).
 * Genutzt von Zielbilanz-Übung, Faktorenbilanz-Trainer und Planbilanz-Übung (Planfragen, LAP).
 * Abhängigkeiten: engine/engineDienst.ts (nur aufgerufen), useAbweichung.ts (useRechnung,
 * alsFolge), Folgespieler, training/prinzipVsEngine.ts, i18n.
 */
import { engine, STANDARD_RECHENZEIT_MS, VOLLE_STAERKE } from "../../engine/engineDienst";
import { wertFuer } from "../../engine/spielbewerter";
import { t } from "../../i18n/sprache";
import type { Vorn } from "../../training/faktorentrainer";
import { vergleichssatz } from "../../training/prinzipVsEngine";
import { Folgespieler } from "./Folgespieler";
import { alsFolge, useRechnung } from "./useAbweichung";

const EINE = 1;

/** Wert (Sicht Weiß) und beste Fortsetzung der Engine. */
interface Engineblick {
  readonly wert: number;
  readonly folge: readonly string[];
}

/**
 * Die Karte „Was sagt die Engine?“. Ohne Bilanzurteil (Planbilanz) nur Wert und Fortsetzung.
 * Beispiel: Zielbilanz Weiß 3, Schwarz 1, Engine +0,2 → „… die Engine sieht es ausgeglichen“.
 */
export function EngineEinschaetzung({
  fen,
  gedreht,
  bilanz = null,
}: {
  fen: string;
  gedreht: boolean;
  bilanz?: Vorn | null;
}) {
  const stand = useRechnung<Engineblick>(`einschaetzung ${fen}`, async () => {
    const b = await engine.bewerte(fen, STANDARD_RECHENZEIT_MS, EINE, VOLLE_STAERKE);
    const v = b.varianten[0];
    return { wert: v ? wertFuer(v.wert, true) : 0, folge: v ? alsFolge(fen, v.zuege) : [] };
  });
  if (!stand || stand.art === "rechnet") return <p className="hinweis">{t("prinzip.rechnet")}</p>;
  if (stand.art === "fehler") return <p className="fehlertext">{stand.meldung}</p>;
  const { wert, folge } = stand.wert;
  return (
    <section className="karte" data-testid="engine-einschaetzung">
      <h3 className="karte-titel">{t("prinzip.titel")}</h3>
      {bilanz !== null && <p>{vergleichssatz(bilanz, wert)}</p>}
      {folge.length > 0 && (
        <Folgespieler
          startFen={fen}
          zuege={folge}
          titel={t("prinzip.folge")}
          gedreht={gedreht}
          testid="engine-folge"
        />
      )}
    </section>
  );
}
