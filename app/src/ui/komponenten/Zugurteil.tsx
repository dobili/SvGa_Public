/**
 * Anzeige des Urteils über den letzten Zug in der Engine-Karte (seit 0.2.31).
 *
 * Rolle im Gesamtbild: Teil der Engine-Karte. Sagt in einem Satz, wie gut der zuletzt gespielte
 * Zug war, mit Zeichen, und nennt den besten Zug der Engine. Seit 0.2.91 sagt er den Verlust als
 * Gewinnchance vorher und nachher wie der Rückblick nach der Partie (Wunsch des Autors: einheitlich,
 * leichter verständlich als Bauerneinheiten); nur wenn die Gewinnchance sich kaum ändert (klar
 * gewonnene Stellung), nennt er die Bauerneinheiten.
 * Abhängigkeiten: engine/letzterzug.ts, spiel/genauigkeit.ts, spiel/zuege.ts, schach/notation.ts,
 * i18n.
 */
import type { LetzterZug, LetzterZugUrteil } from "../../engine/letzterzug";
import { sprache, t } from "../../i18n/sprache";
import { zugfolgeAlsText } from "../../schach/notation";
import { gewinnwahrscheinlichkeit } from "../../spiel/genauigkeit";
import { regelstellung } from "../../spiel/zuege";
import type { Urteilstand } from "./useZugurteil";

/** Unter diesem Verlust (gerundet 0,0) gilt ein Zug als so gut wie der beste. */
const GLEICHWERTIG_UNTER = 0.05;

/** Verlust mit einer Nachkommastelle und deutschem Komma. */
function bauern(verlust: number): string {
  return verlust.toFixed(1).replace(".", ",");
}

/** Gewinnchance der ziehenden Seite mit dem besten und mit dem gespielten Zug, in ganzen Prozent. */
function chance(urteil: LetzterZugUrteil, letzterZug: LetzterZug) {
  const weissZog = letzterZug.vorherFen.split(" ")[1] !== "b";
  return {
    seite: t(weissZog ? "farbe.w" : "farbe.b"),
    vorher: Math.round(gewinnwahrscheinlichkeit(urteil.besterWert)),
    nachher: Math.round(gewinnwahrscheinlichkeit(urteil.gespielterWert)),
  };
}

/** Ein Zug in der Stellung vor dem letzten Zug als Text mit Nummer, etwa „5... Db6“. */
function zugtext(vorherFen: string, uci: string): string {
  const pos = regelstellung(vorherFen);
  return pos ? zugfolgeAlsText(pos, [uci], sprache(), 1) : uci;
}

/**
 * Der Satz zum Urteil. Beispiel: „6. Ld3?!: Die Gewinnchance von Weiß fällt von 54 % auf 44 %.
 * Besser: 6. a3 (goldener Pfeil).“
 * Sonderfall: Ändert sich die gerundete Gewinnchance nicht (etwa +8 statt +6), nennt der Satz
 * die Bauerneinheiten; ohne Zeichen gilt der Zug dann als so gut wie der beste.
 */
function satz(urteil: LetzterZugUrteil, letzterZug: LetzterZug): string {
  const zug = zugtext(letzterZug.vorherFen, letzterZug.uci);
  const bester = urteil.besterZug ? zugtext(letzterZug.vorherFen, urteil.besterZug) : "";
  if (urteil.zeichen === "!") return t("engine.urteil.einziger", { zug });
  if (urteil.warBester) return t("engine.urteil.bester", { zug });
  const c = chance(urteil, letzterZug);
  const gleicheChance = c.vorher === c.nachher;
  if (urteil.verlust < GLEICHWERTIG_UNTER || (urteil.zeichen === null && gleicheChance))
    return t("engine.urteil.gleich", { zug, bester });
  if (urteil.zeichen === null) return t("engine.urteil.gut", { zug, bester, ...werte(c) });
  const zeichen = urteil.zeichen;
  if (gleicheChance)
    return t("engine.urteil.verlustEntschieden", {
      zug,
      zeichen,
      verlust: bauern(urteil.verlust),
      seite: c.seite,
      vorher: String(c.vorher),
      bester,
    });
  return t("engine.urteil.verlust", { zug, zeichen, bester, ...werte(c) });
}

/** Seite und Prozentzahlen als Werte für die Texte. */
function werte(c: { seite: string; vorher: number; nachher: number }) {
  return { seite: c.seite, vorher: String(c.vorher), nachher: String(c.nachher) };
}

/** Der Stand des Urteils: rechnet, Satz, Fehler oder (ausgeschaltet) nichts. */
export function Urteil({ stand, letzterZug }: { stand: Urteilstand; letzterZug: LetzterZug }) {
  if (stand.art === "aus") return null;
  if (stand.art === "rechnet")
    return (
      <p className="lade">
        <span className="ladepunkt" aria-hidden="true" /> {t("engine.urteil.rechnet")}
      </p>
    );
  if (stand.art === "fehler")
    return <p className="fehlertext">{t("engine.fehler", { fehler: stand.meldung })}</p>;
  return (
    <p className="engine-urteil" data-testid="engine-urteil">
      {stand.urteil ? satz(stand.urteil, letzterZug) : t("engine.urteil.keins")}
    </p>
  );
}
