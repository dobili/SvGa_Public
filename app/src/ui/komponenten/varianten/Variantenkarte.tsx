/**
 * Ein Eintrag der Liste „Varianten“: kleines Brett, Titel, Quelle, Zahl der Züge und Abzweige.
 *
 * Rolle im Gesamtbild: Frage g (Empfehlung C), Bild „Liste“: Ein Tipp öffnet die Variante. Das
 * Brett zeigt die Stellung, an der die Variante öffnet. Die Quelle steht als Marke („Abb. 2.40“).
 * Daneben ✎ (Name und Kommentar) und 🗑 (Löschen mit Nachfrage), Wunsch des Autors 1.11.2026,
 * beide im Listenblatt.tsx.
 * Abhängigkeiten: schach/variationsbaum.ts, training/variationen.ts, spielstart/LaufendeKarte.tsx
 * (Minibrett), Navigation, i18n.
 */
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { useNavigation } from "../../../app/navigationsKontext";
import { t, tZahl } from "../../../i18n/sprache";
import { abzweigzahl, fenAm, knotenzahl } from "../../../schach/variationsbaum";
import type { Variation } from "../../../training/variationen";
import { Minibrett } from "../spielstart/LaufendeKarte";
import { Knopfsymbol } from "../bausteine/Knopfsymbol";
import { Listenblatt, type Listenaktion } from "./Listenblatt";
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

/** ✎ und 🗑 neben der Karte; jeder Knopf nennt die Variante für Bildschirmleser. */
function Aktionen({ titel, waehle }: { titel: string; waehle: (a: Listenaktion) => void }) {
  return (
    <div className="variantenkarte-aktionen">
      <button
        type="button"
        className="knopf-symbol"
        aria-label={t("varianten.liste.bearbeiten", { titel })}
        data-testid="variante-bearbeiten"
        onClick={() => waehle("bearbeiten")}
      >
        <Knopfsymbol art="bearbeiten" />
      </button>
      <button
        type="button"
        className="knopf-symbol"
        aria-label={t("varianten.liste.loeschen", { titel })}
        data-testid="variante-loeschen"
        onClick={() => waehle("loeschen")}
      >
        <Knopfsymbol art="loeschen" />
      </button>
    </div>
  );
}

/** Die Karte; ein Tipp öffnet die Variante, ✎ und 🗑 öffnen das Listenblatt. */
export function Variantenkarte({ variation }: { variation: Variation }) {
  const { navigiere } = useNavigation();
  const [aktion, setzeAktion] = useState<Listenaktion | null>(null);
  const fen = fenAm(variation, variation.startpfad) ?? variation.startFen;
  const titel = variation.titel || t("varianten.ohneTitel");
  return (
    <li className="variantenkarte" data-testid="variantenkarte">
      <button
        type="button"
        className="variantenkarte-knopf"
        onClick={() => navigiere(varianteAnsicht(variation.id))}
      >
        <Minibrett fen={fen} />
        <span className="variantenkarte-text">
          <strong>{titel}</strong>
          <span className="variantenquelle">{quellenmarke(variation.quelle)}</span>
          <span className="hinweis">{zahlen(variation)}</span>
        </span>
        <ChevronRight size={SYMBOL} aria-hidden="true" />
      </button>
      <Aktionen titel={titel} waehle={setzeAktion} />
      <Listenblatt v={variation} aktion={aktion} schliessen={() => setzeAktion(null)} />
    </li>
  );
}
