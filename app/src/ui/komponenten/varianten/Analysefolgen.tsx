/**
 * Knopf „Engine-Folgen übernehmen“ nach der Analyse einer Variante: legt an Fehlern, Patzern und
 * verpassten Gewinnen „Besser war“ und „So wird bestraft“ als Abzweige an.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (1.11.2026): wie beim Öffnen einer ausgewerteten Partie
 * (training/enginefolgen.ts, mitEngineFolgen) auch nach der Analyse einer Variante, auf Wunsch.
 * Eine Variante hat keine eigene Farbe; es zählen die Fehler beider Seiten. Die Folgen kommen aus
 * der Hauptvariante der Engine dieser Sitzung (variantenanalyse.ts, engineFolgeAm), sonst aus dem
 * gespeicherten besten Zug. Der Knopf erscheint nur, wenn die Analyse ruht und es noch Folgen
 * anzulegen gibt; danach rechnet die Analyse die neuen Züge wie andere neue Züge.
 * Abhängigkeiten: training/enginefolgen.ts, variantenanalyse.ts, useVariantenanalyse.ts, i18n.
 */
import { GitFork } from "lucide-react";
import { useMemo } from "react";
import { t, tZahl } from "../../../i18n/sprache";
import { fenAm, knotenzahl, type Pfad } from "../../../schach/variationsbaum";
import { mitBaumfolgen, type Baumfehler } from "../../../training/enginefolgen";
import { engineFolgeAm } from "./variantenanalyse";
import type { Variantenanalyse } from "./useVariantenanalyse";
import type { Variantenstand } from "./useVariante";
import { knotendatenAm } from "./useMarkierstift";

const SYMBOL = 18;

/** Die Fehler aus den Urteilen der Analyse, in Lesereihenfolge. */
function fehlerAus(analyse: Variantenanalyse): Baumfehler[] {
  return [...analyse.urteile].map(([schluessel, urteil]) => ({
    pfad: schluessel ? schluessel.split(" ") : [],
    klasse: urteil.klasse,
  }));
}

/** Was der Knopf anlegen würde: der neue Baum und die Zahl der Fehler mit neuen Folgen. */
function useVorschau(stand: Variantenstand, analyse: Variantenanalyse) {
  const v = stand.variation;
  return useMemo(() => {
    const folgeAb = (pfad: Pfad): readonly string[] => {
      const fen = fenAm(v, pfad);
      const folge = fen ? engineFolgeAm(fen) : [];
      if (folge.length > 0) return folge;
      const bester = knotendatenAm(v, pfad).b;
      return bester ? [bester] : [];
    };
    const texte = { besser: t("varianten.engine.besser"), strafe: t("varianten.engine.strafe") };
    const ergebnis = mitBaumfolgen(v, fehlerAus(analyse), folgeAb, texte);
    const neu = knotenzahl(ergebnis.zuege) - knotenzahl(v.zuege);
    return { zuege: ergebnis.zuege, neu };
  }, [v, analyse]);
}

/** Der Knopf; nichts, solange die Analyse läuft oder es nichts anzulegen gibt. */
export function Analysefolgen({
  stand,
  analyse,
}: {
  stand: Variantenstand;
  analyse: Variantenanalyse;
}) {
  const vorschau = useVorschau(stand, analyse);
  if (!analyse.sichtbar || analyse.stand.art === "laeuft" || vorschau.neu <= 0) return null;
  return (
    <button
      type="button"
      className="knopf-zweit analysefolgen"
      data-testid="analysefolgen"
      onClick={() =>
        stand.aendereVariation({ ...stand.variation, zuege: vorschau.zuege }, "sofort")
      }
    >
      <GitFork size={SYMBOL} aria-hidden="true" />{" "}
      {tZahl("varianten.analyse.folgen", vorschau.neu, { anzahl: vorschau.neu })}
    </button>
  );
}
