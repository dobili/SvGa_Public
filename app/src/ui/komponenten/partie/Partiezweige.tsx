/**
 * Die Engine-Folgen „Besserer Zug“ und „Bestrafung“ als Nebenzweige in der Zugliste der Partie
 * und die Wahl der Linie darunter (Partie, Besserer Zug, Bestrafung).
 *
 * Rolle im Gesamtbild: Fehlermeldung des Autors (6.11.2026): Beim Abspielen einer Engine-Folge
 * entstand oben keine Verzweigung, und es gab keinen klaren Weg zurück zum Zug der Partie. Jetzt
 * stehen die Zweige wie im Variantenmodus als eingeschobene Variante hinter dem Zug, zu dem die
 * Karte sie nennt, in Klammern mit dem Zeichen ihres Knopfes (Glühbirne, Schwerter);
 * aufgeklappt steht jeder Zweig eingerückt in eigener Zeile. Der gezeigte Zug ist markiert wie
 * in der Partie. Die Wahl der Linie nutzt die Chips „Weiter: …“ des Variantenmodus
 * (Variantenleiste.tsx), im Zweig dazu die Pfadzeile mit „Zurück zur Partie“.
 * Abhängigkeiten: spiel/nebenzweig.ts (Typ), linienstand.ts (Typ), useLinie.ts (Typ), lucide, i18n.
 */
import { GitFork, Lightbulb, Swords, Undo2, type LucideIcon } from "lucide-react";
import { t, type Textschluessel } from "../../../i18n/sprache";
import type { Zweigart } from "../../../spiel/nebenzweig";
import type { Partiezweige } from "./linienstand";
import type { Liniennavigation } from "./useLinie";

const SYMBOL = 14;

/** Die Zweige in der Reihenfolge der Karte und der Knöpfe unter dem Brett. */
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

/** Im Zweig: „⑂ Bestrafung › 2... Dh4#“ und „Zurück zur Partie“, wie die Pfadzeile der Varianten. */
function Zweigpfad({ zweige, navigation }: { zweige: Partiezweige; navigation: Liniennavigation }) {
  const zweig = zweige.zweig;
  const art = ARTEN.find((a) => a.art === zweig?.art);
  if (!zweig || !art) return null;
  const erster = zweige.linien[art.art][0];
  return (
    <p className="variantenpfad zweigpfad" data-testid="zweigpfad">
      <GitFork size={SYMBOL} aria-hidden="true" />
      <span>{t(art.text)}</span>
      <span aria-hidden="true">›</span>
      <strong>{erster?.text ?? ""}</strong>
      <button
        type="button"
        className="knopf-link klein"
        data-testid="zweig-zur-partie"
        onClick={() => navigation.waehle(null)}
      >
        <Undo2 size={SYMBOL} aria-hidden="true" /> {t("rueckblick.zweigZurPartie")}
      </button>
    </p>
  );
}

/**
 * Wahl der Linie an der gezeigten Stelle: „Linie: Partie · Besserer Zug · Bestrafung“; die
 * gezeigte ist gedrückt. Darüber im Zweig die Pfadzeile mit „Zurück zur Partie“.
 * Beispiel: nach 2. g4?? führt „Bestrafung“ zu 2... Dh4#, „Partie“ zurück zu 2. g4??.
 */
export function Linienwahl({
  zweige,
  navigation,
}: {
  zweige: Partiezweige;
  navigation: Liniennavigation;
}) {
  const art = zweige.zweig?.art ?? null;
  const chip = (wahl: Zweigart | null, text: Textschluessel, Symbol: LucideIcon | null) => (
    <button
      key={wahl ?? "partie"}
      type="button"
      className="chip weiterchip"
      aria-pressed={art === wahl}
      data-testid={`linie-${wahl ?? "partie"}`}
      onClick={() => navigation.waehle(wahl)}
    >
      {Symbol && <Symbol size={SYMBOL} aria-hidden="true" />}
      {t(text)}
    </button>
  );
  return (
    <div className="linienwahl">
      <Zweigpfad zweige={zweige} navigation={navigation} />
      <p className="abzweigungen weiterchips" role="group" aria-label={t("partie.linie.wahl")}>
        <span>{t("partie.linie.wahl")}</span>
        {chip(null, "partie.linie.partie", null)}
        {ARTEN.filter((a) => zweige.linien[a.art].length > 0).map((a) =>
          chip(a.art, a.text, a.Symbol),
        )}
      </p>
    </div>
  );
}
