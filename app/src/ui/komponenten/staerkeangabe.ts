/**
 * Text zur Elo-Zahl eines Bots oder einer Stufe: „etwa 1100“, „über 2200“, „unter 400“.
 *
 * Rolle im Gesamtbild: Gemeinsame Schreibweise für Gegnerwahl, Sprechblase und die Karte
 * „Spielstärke“ (Rückfrage S23), dazu der Bereich einer Stufe; die Rechnung steht in
 * engine/botstaerke.ts.
 * Abhängigkeiten: engine/botstaerke.ts, i18n.
 */
import { bereichDerStufe, staerkeangabe } from "../../engine/botstaerke";
import type { Stufennummer } from "../../engine/stufen";
import { t } from "../../i18n/sprache";

/**
 * Der Text zu einer Zahl. Beispiel: 1083 → „etwa 1100“; 2650 → „über 2200“.
 */
export function staerketext(wert: number): string {
  const angabe = staerkeangabe(wert);
  return t(`botstaerke.${angabe.art}`, { wert: angabe.wert });
}

/**
 * Der Bereich einer Stufe als Text. Beispiel: 1042 bis 1301 → „etwa 1050 bis 1300“; 2200 bis
 * 2409 → „etwa 2200 bis über 2200“; gleiche Enden → „etwa 1100“.
 */
export function bereichstext(nummer: Stufennummer): string {
  const { von, bis } = bereichDerStufe(nummer);
  const a = staerkeangabe(von);
  const b = staerkeangabe(bis);
  if (a.art === b.art && a.wert === b.wert) return staerketext(von);
  if (a.art === "etwa" && b.art === "etwa")
    return t("botstaerke.bereichEtwa", { von: a.wert, bis: b.wert });
  return t("botstaerke.bereich", { von: staerketext(von), bis: staerketext(bis) });
}
