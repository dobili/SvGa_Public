/**
 * Die Engine-Folgen „Besserer Zug“ und „Bestrafung“ als Nebenzweige in der Zugliste der Partie
 * und die Wahl der Linie darunter (Partie, Besserer Zug, Bestrafung).
 *
 * Rolle im Gesamtbild: Fehlermeldung des Autors (6.11.2026): Beim Abspielen einer Engine-Folge
 * entstand oben keine Verzweigung, und es gab keinen klaren Weg zurück zum Zug der Partie. Jetzt
 * stehen die Zweige wie im Variantenmodus als eingeschobene Variante hinter dem Zug, zu dem die
 * Karte sie nennt, in Klammern mit dem Zeichen ihres Knopfes (Glühbirne, Schwerter);
 * aufgeklappt steht jeder Zweig eingerückt in eigener Zeile. Der gezeigte Zug ist markiert wie
 * in der Partie. Die Wahl der Linie ist seit dem Wunsch des Autors vom 6.11.2026 eine Zeile mit
 * drei Symbolknöpfen, die immer dasteht (feste Höhe, damit beim Durchgehen nichts springt);
 * „Partie“ führt zurück zum Zug der Partie.
 * Abhängigkeiten: spiel/nebenzweig.ts (Typ), linienstand.ts (Typ), useLinie.ts (Typ), lucide, i18n.
 */
import { GitCommitHorizontal, Lightbulb, Pause, Swords, type LucideIcon } from "lucide-react";
import { t, type Textschluessel } from "../../../i18n/sprache";
import type { Zweigart } from "../../../spiel/nebenzweig";
import type { Partiezweige } from "./linienstand";
import type { Liniennavigation } from "./useLinie";

const SYMBOL = 14;
/** Symbole der Linienknöpfe: groß genug zum Erkennen, die Tippfläche bleibt 44 Pixel. */
const SYMBOL_KNOPF = 20;

/** Die Zweige in der Reihenfolge der Karte und der Linienknöpfe. */
const ARTEN: readonly { art: Zweigart; Symbol: LucideIcon; text: Textschluessel }[] = [
  { art: "besser", Symbol: Lightbulb, text: "rueckblick.abspielenBesser" },
  { art: "strafe", Symbol: Swords, text: "rueckblick.abspielenStrafe" },
];

/**
 * Ein Zweig, eingeschoben hinter dem Zug der Partie: „(💡 2. e4 Dh4 3. …)“.
 * Ohne Züge nichts.
 */
function Zweigeinschub({ art, zweige }: { art: (typeof ARTEN)[number]; zweige: Partiezweige }) {
  const zuege = zweige.linien[art.art];
  if (zuege.length === 0) return null;
  const schritt = zweige.zweig?.art === art.art ? zweige.zweig.schritt : null;
  return (
    <span
      className={schritt !== null ? "zugvariante gewaehlt" : "zugvariante"}
      role="group"
      aria-label={t(art.text)}
      data-testid={`zugvariante-${art.art}`}
    >
      <span aria-hidden="true">(</span>
      <art.Symbol className="zugvariante-zeichen" size={SYMBOL} aria-hidden="true" />
      {zuege.map((zug, i) => (
        <button
          key={zug.vorher}
          type="button"
          className="zug"
          aria-current={schritt === i + 1 ? "step" : undefined}
          onClick={() => zweige.beiZug(art.art, i + 1)}
        >
          {zug.text}
        </button>
      ))}
      <span aria-hidden="true">)</span>
    </span>
  );
}

/** Beide Zweige hinter dem Zug, in der Reihenfolge der Karte. */
export function Zweigeinschuebe({ zweige }: { zweige: Partiezweige }) {
  return (
    <>
      {ARTEN.map((art) => (
        <Zweigeinschub key={art.art} art={art} zweige={zweige} />
      ))}
    </>
  );
}

/** Ein Knopf der Linienwahl: nur Symbol, Name als aria-label und title. */
interface Linienknopf {
  readonly wahl: Zweigart | null;
  readonly Symbol: LucideIcon;
  readonly text: Textschluessel;
}

const KNOEPFE: readonly Linienknopf[] = [
  { wahl: null, Symbol: GitCommitHorizontal, text: "partie.linie.partie" },
  ...ARTEN.map((a) => ({ wahl: a.art, Symbol: a.Symbol, text: a.text })),
];

/**
 * Die Linienwahl über den Zugknöpfen: „Linie: [Partie] [💡] [⚔] Bestrafung“ in einer Zeile fester
 * Höhe, auch an Zügen ohne Engine-Folge (dann sind deren Knöpfe gesperrt).
 *
 * Warum: Wunsch des Autors (6.11.2026). Vorher erschienen die Chips nur nach Fehlern und brachen
 * auf dem Handy in zwei Zeilen um; beim Durchgehen sprang deshalb das Brett, und der Daumen traf
 * neben „Vor“. Die Knöpfe unter dem Brett sind entfallen: Ein Tipp auf einen Zweig spielt ihn hier
 * vor (useLinie.ts), während des Vorspielens zeigt sein Knopf „Anhalten“.
 * Beispiel: nach 8. Sc3? sind beide Zweige frei; nach 1. e4 (bester Zug) nur „Partie“.
 */
export function Linienwahl({
  zweige,
  navigation,
}: {
  zweige: Partiezweige;
  navigation: Liniennavigation;
}) {
  const art = zweige.zweig?.art ?? null;
  const gezeigt = KNOEPFE.find((k) => k.wahl === art) ?? KNOEPFE[0];
  const knopf = ({ wahl, Symbol, text }: Linienknopf) => {
    const laeuft = wahl !== null && navigation.laeuft === wahl;
    const name = laeuft ? t("rueckblick.abspielenHalt") : t(text);
    return (
      <button
        key={wahl ?? "partie"}
        type="button"
        className="knopf-symbol linienknopf"
        aria-pressed={art === wahl}
        aria-label={name}
        title={name}
        disabled={wahl !== null && zweige.linien[wahl].length === 0}
        data-testid={`linie-${wahl ?? "partie"}`}
        onClick={() => navigation.waehle(wahl)}
      >
        {laeuft ? (
          <Pause size={SYMBOL_KNOPF} aria-hidden="true" />
        ) : (
          <Symbol size={SYMBOL_KNOPF} aria-hidden="true" />
        )}
      </button>
    );
  };
  return (
    <div className="linienwahl" role="group" aria-label={t("partie.linie.wahl")}>
      <span className="linienwahl-titel" aria-hidden="true">
        {t("partie.linie.wahl")}
      </span>
      {KNOEPFE.map(knopf)}
      <span className="linienwahl-name" data-testid="linienname">
        {gezeigt ? t(gezeigt.text) : ""}
      </span>
    </div>
  );
}
