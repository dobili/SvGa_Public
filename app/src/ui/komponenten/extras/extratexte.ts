/**
 * Texte der Extras (Gamifizierung P7): Name eines Extras und Text seiner Bedingung.
 *
 * Rolle im Gesamtbild: Profilkarte „Deine Extras“ und Kacheln der Einstellungen zeigen dieselben
 * Namen und Bedingungen; alle Texte stehen unter der Vorsilbe „extras.“ in den Sprachdateien.
 * Abhängigkeiten: training/extras.ts, i18n.
 */
import { t } from "../../../i18n/sprache";
import type { Bedingung, Extra, Extrakennung } from "../../../training/extras";

/** Text einer Bedingung. Beispiel: { art: "stufe", ab: 5 } → „Ab Stufe 5“. */
export function bedingungstext(bedingung: Bedingung): string {
  return bedingung.art === "stufe"
    ? t("extras.bedingung.stufe", { stufe: bedingung.ab })
    : t(`extras.bedingung.orden.${bedingung.gruppe}`);
}

/** Name eines Extras. Beispiel: „figuren-gold“ → „Figurensatz Gold“. */
export function extraname(extra: Extra): string {
  return t(`extras.name.${extra.kennung as Extrakennung}`);
}
