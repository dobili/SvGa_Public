/**
 * Ein Eintrag der Liste „Varianten“: kleines Brett, Titel, Quelle, Zahl der Züge und Abzweige.
 *
 * Rolle im Gesamtbild: Frage g (Empfehlung C), Bild „Liste“: Ein Tipp öffnet die Variante. Das
 * Brett zeigt die Stellung, an der die Variante öffnet. Die Quelle steht als Marke („Abb. 2.40“).
 * Abhängigkeiten: schach/variationsbaum.ts, training/variationen.ts, spielstart/LaufendeKarte.tsx
 * (Minibrett), Navigation, i18n.
 */
import { ChevronRight } from "lucide-react";
import { useNavigation } from "../../../app/navigationsKontext";
import { t, tZahl } from "../../../i18n/sprache";
import { abzweigzahl, fenAm, knotenzahl } from "../../../schach/variationsbaum";
import type { Variation } from "../../../training/variationen";
import { Minibrett } from "../spielstart/LaufendeKarte";
import { varianteAnsicht } from "./variantenwert";
import { quellenmarke } from "./variantentexte";

const SYMBOL = 20;

/** „14 Züge · 3 Abzweige“ */
function zahlen(v: Variation): string {
  const zuege = knotenzahl(v.zuege);
  const abzweige = abzweigzahl(v);
  const teile = [tZahl("varianten.zuege", zuege, { anzahl: zuege })];
  if (abzweige > 0) teile.push(tZahl("varianten.abzweigeZahl", abzweige, { anzahl: abzweige }));
  return teile.join(" · ");
}

/** Die Karte; ein Tipp öffnet die Variante. */
export function Variantenkarte({ variation }: { variation: Variation }) {
  const { navigiere } = useNavigation();
  const fen = fenAm(variation, variation.startpfad) ?? variation.startFen;
  return (
    <li className="variantenkarte" data-testid="variantenkarte">
      <button
        type="button"
        className="variantenkarte-knopf"
        onClick={() => navigiere(varianteAnsicht(variation.id))}
      >
        <Minibrett fen={fen} />
        <span className="variantenkarte-text">
          <strong>{variation.titel || t("varianten.ohneTitel")}</strong>
          <span className="variantenquelle">{quellenmarke(variation.quelle)}</span>
          <span className="hinweis">{zahlen(variation)}</span>
        </span>
        <ChevronRight size={SYMBOL} aria-hidden="true" />
      </button>
    </li>
  );
}
