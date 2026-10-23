/**
 * Vergleich des eigenen Zuges mit dem Zug der Partie oder der Studie, in Worten und mit beiden
 * Bewertungen der Engine.
 *
 * Rolle im Gesamtbild: „Zug erraten“ (W12) und „Studien lösen“ (R46, Wunsch des Autors vom
 * 23.10.2026: bei falschem Zug eigenen und richtigen Zug vergleichen). Die Pfeile dazu zeichnet
 * die Aufgabe selbst (rot der eigene, gold der richtige Zug, siehe vergleichspfeile.ts).
 * Abhängigkeiten: useRatevergleich, training/rateurteil.ts, engine/wertInWorten.ts, i18n.
 * Buchbezug: Kapitel 12, „erst selbst denken und dann vergleichen“.
 */
import { wertAlsZahl } from "../../engine/wertInWorten";
import { sprache, t, zahlText } from "../../i18n/sprache";
import { sanInSprache } from "../../schach/notation";
import { mitMatt, type Rateurteil } from "../../training/rateurteil";
import type { Fehlversuch, Vergleichsstand } from "./useRatevergleich";

/** Womit verglichen wird: Partiezug (Zug erraten) oder Zug der Studie. */
export type Vergleichsbezug = "partie" | "studie";

/** Das Urteil in einem Satz; mit Matt ohne Zahl, weil Bauerneinheiten dann nichts sagen. */
function urteilText(urteil: Rateurteil, bezug: Vergleichsbezug): string {
  const werte = {
    bezug: t(`zugvergleich.bezug.${bezug}`),
    unterschied: zahlText(urteil.unterschied, 1),
  };
  if (urteil.art === "gleichwertig") return t("zugvergleich.gleichwertig", werte);
  const matt = mitMatt(urteil);
  if (urteil.art === "schwaecher")
    return t(matt ? "zugvergleich.schwaecherMatt" : "zugvergleich.schwaecher", werte);
  return t(matt ? "zugvergleich.staerkerMatt" : "zugvergleich.staerker", werte);
}

/**
 * Die Zeilen zum Vergleich: „rechnet …“, dann Urteil und beide Werte; darunter ein Zusatz
 * (beim Zugerraten die Frage, warum der Meister anders zog).
 */
export function Zugvergleich({
  versuch,
  stand,
  bezug,
  zusatz = null,
  testid,
}: {
  versuch: Fehlversuch;
  stand: Vergleichsstand;
  bezug: Vergleichsbezug;
  zusatz?: string | null;
  testid: string;
}) {
  const urteil = stand.art === "fertig" ? stand.urteil : null;
  const zug = (san: string) => sanInSprache(san, sprache());
  return (
    <p className="hinweis" data-testid={testid}>
      {stand.art === "rechnet" && t("zugvergleich.rechnet")}
      {urteil && (
        <>
          {urteilText(urteil, bezug)}{" "}
          {t("zugvergleich.werte", {
            eigen: zug(versuch.eigen),
            eigenWert: wertAlsZahl(urteil.eigenerWert),
            name: t(`zugvergleich.name.${bezug}`),
            richtig: zug(versuch.partie),
            richtigWert: wertAlsZahl(urteil.partieWert),
          })}
        </>
      )}
      {zusatz && ` ${zusatz}`}
    </p>
  );
}
