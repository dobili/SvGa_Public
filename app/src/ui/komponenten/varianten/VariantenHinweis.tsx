/**
 * An den Quellen: Gabel-Knopf „Als Variante öffnen“ und der Hinweis „2 eigene Varianten“.
 *
 * Rolle im Gesamtbild: Frage a (Empfehlung A) und g (Empfehlung C): An Abbildung, Partie, Fehler
 * und Lernsammlung führt ein Knopf mit dem Gabel-Zeichen zu einer neuen Variante; gibt es schon
 * eigene Varianten aus dieser Quelle, nennt ein Chip ihre Zahl (eine: öffnet sie, mehrere: die
 * gefilterte Liste). Wunsch des Autors (1.11.2026): auch an gespielten Partien in der Liste und in
 * der Auswertung. Am Brett steht der Knopf als Brettschalter wie „Merken“.
 * Abhängigkeiten: training/variationen.ts, variantenwert.ts, Navigation, Speicher, i18n, lucide.
 */
import { GitFork } from "lucide-react";
import { useNavigation } from "../../../app/navigationsKontext";
import { t, tZahl } from "../../../i18n/sprache";
import { useSpeicher } from "../../../speicher/speicher";
import { variationenZu, type Variationsquelle } from "../../../training/variationen";
import { filterWert, varianteAnsicht, variantenAnsicht } from "./variantenwert";

const SYMBOL = 18;
const BRETTSYMBOL = 20;
const MARKENSYMBOL = 14;

/** Der Chip „2 eigene Varianten“; ohne Varianten nichts. */
export function Variantenzahl({ quelle }: { quelle: Variationsquelle }) {
  const { navigiere } = useNavigation();
  const passende = variationenZu(
    useSpeicher((z) => z.daten.variationen),
    quelle,
  );
  const erste = passende[0];
  if (!erste) return null;
  return (
    <button
      type="button"
      className="chip variantenzahl"
      data-testid="variantenzahl"
      onClick={() =>
        navigiere(
          passende.length === 1 ? varianteAnsicht(erste.id) : variantenAnsicht(filterWert(quelle)),
        )
      }
    >
      <GitFork size={SYMBOL} aria-hidden="true" />
      {tZahl("varianten.eigene", passende.length, { anzahl: passende.length })} ›
    </button>
  );
}

/** Gabel-Knopf als Zeile unter einem Eintrag (Fehler, Lernsammlung) mit der Zahl daneben. */
export function VariantenHinweis({ quelle, wert }: { quelle: Variationsquelle; wert: string }) {
  const { navigiere } = useNavigation();
  return (
    <div className="variantenhinweis">
      <button
        type="button"
        className="knopf-zweit"
        data-testid="gabelknopf"
        onClick={() => navigiere(varianteAnsicht(wert))}
      >
        <GitFork size={SYMBOL} aria-hidden="true" /> {t("varianten.alsVariante")}
      </button>
      <Variantenzahl quelle={quelle} />
    </div>
  );
}

/** Gabel-Knopf am Brett (Brettschalter wie „Merken“); ``beiTipp`` öffnet oder speichert. */
export function GabelSchalter({
  beiTipp,
  gesperrt = false,
}: {
  beiTipp: () => void;
  gesperrt?: boolean;
}) {
  return (
    <button
      type="button"
      className="knopf-symbol brettschalter"
      data-testid="gabelschalter"
      data-tour="brett-variante"
      aria-label={t("varianten.alsVariante")}
      title={t("varianten.alsVariante")}
      disabled={gesperrt}
      onClick={beiTipp}
    >
      <GitFork size={BRETTSYMBOL} aria-hidden="true" />
      <span className="brettschalter-text" aria-hidden="true">
        {t("varianten.gabelKurz")}
      </span>
    </button>
  );
}

/**
 * Stille Marke „⑂ 2“ in der Zeile der Partienliste (die ganze Zeile ist dort ein Knopf zur Partie;
 * in der Partie führt der Chip in der Auswertung weiter). Ohne Varianten nichts.
 */
export function Variantenmarke({ quelle }: { quelle: Variationsquelle }) {
  const anzahl = variationenZu(
    useSpeicher((z) => z.daten.variationen),
    quelle,
  ).length;
  if (anzahl === 0) return null;
  return (
    <span
      className="variantenmarke"
      role="img"
      aria-label={tZahl("varianten.eigene", anzahl, { anzahl })}
      data-testid="variantenmarke"
    >
      <GitFork size={MARKENSYMBOL} aria-hidden="true" />
      {anzahl}
    </span>
  );
}
