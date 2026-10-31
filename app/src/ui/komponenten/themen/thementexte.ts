/**
 * Texte der Meisterschaft (Gamifizierung P3): Name eines Themas, Name einer Stufe, Fortschritt
 * zur nächsten Stufe („7 von 15 bis Silber“).
 *
 * Rolle im Gesamtbild: Profilkarte, Meldung am Rundenende, Teilen und Probe nennen Themen und
 * Stufen gleich. Der Name eines Themas kommt aus training/themennamen.ts (NAMENSMUSTER), ohne
 * feste Liste; alle eigenen Texte stehen unter „themen.“.
 * Abhängigkeiten: training/themennamen.ts, training/meisterschaft.ts, i18n.
 */
import { t } from "../../../i18n/sprache";
import type { Medaillenstufe } from "../../../training/meisterschaft";
import type { Themenmedaille } from "../../../training/meisterschaftsstand";
import { themennameSchluessel } from "../../../training/themennamen";

/** Hat das Thema einen Namen? Themen ohne Namen (etwa „kapitel:3“) zeigt die Karte nicht. */
export function hatThemenname(thema: string): boolean {
  return themennameSchluessel(thema) !== null;
}

/** Name eines Themas. Beispiel: „taktik:fesselung“ → „Fesselung“; ohne Namen die Kennung. */
export function themenname(thema: string): string {
  const schluessel = themennameSchluessel(thema);
  return schluessel ? t(schluessel) : thema;
}

/** Name einer Stufe. Beispiel: „silber“ → „Silber“. */
export function stufenname(stufe: Medaillenstufe): string {
  return t(`themen.stufe.${stufe}`);
}

/** Medaille als Satz für Bildschirmleser und Teilen. Beispiel: „Fesselung: Silber“. */
export function medaillenname(thema: string, stufe: Medaillenstufe): string {
  return t("themen.medaille", { name: themenname(thema), stufe: stufenname(stufe) });
}

/** Fortschritt zur nächsten Stufe; nach Gold „Gold erreicht“. */
export function fortschrittstext(medaille: Themenmedaille): string {
  const n = medaille.naechste;
  if (!n) return t("themen.fertig");
  return t(`themen.fortschritt.${n.art}`, {
    erreicht: n.erreicht,
    noetig: n.noetig,
    stufe: stufenname(n.stufe),
  });
}
