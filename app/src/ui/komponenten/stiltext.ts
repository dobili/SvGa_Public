/**
 * Kurztext einer Stil-Mischung für Listen (0.2.128): „Angreifer + Taktiker 50 %“.
 *
 * Rolle im Gesamtbild: Die Liste eigener Gegner (GegnerEditor.tsx) nennt den Stil in einer Zeile.
 * 100 % (die geeichte Stärke) steht ohne Zahl. Abhängigkeiten: engine/stile.ts, i18n.
 */
import { STILPROZENT_GEEICHT, type Richtungsstil, type Stilmix } from "../../engine/stile";
import { t } from "../../i18n/sprache";

/** „Angreifer 75 %“ */
export function stilProzent(stil: Richtungsstil, prozent: number): string {
  return t("spielen.stilProzent", { stil: t(`stil.${stil}`), prozent: String(prozent) });
}

/** Beispiel: { angreifer: 100, taktiker: 50 } → „Angreifer + Taktiker 50 %“; {} → „Universell“. */
export function stilkurz(mix: Stilmix): string {
  const teile = (Object.entries(mix) as [Richtungsstil, number][]).map(([stil, p]) =>
    p === STILPROZENT_GEEICHT ? t(`stil.${stil}`) : stilProzent(stil, p),
  );
  return teile.length > 0 ? teile.join(" + ") : t("stil.universell");
}
