/**
 * Texte der Extras (Gamifizierung P7): Name eines Extras und Text seiner Bedingung.
 *
 * Rolle im Gesamtbild: Profilkarte „Deine Extras“ und Kacheln der Einstellungen zeigen dieselben
 * Namen und Bedingungen; alle Texte stehen unter der Vorsilbe „extras.“ in den Sprachdateien.
 * Abhängigkeiten: training/extras.ts, training/themennamen.ts (Trainer der Meisterschaft), i18n.
 */
import { t } from "../../../i18n/sprache";
import type { Bedingung, Extra, Extrakennung } from "../../../training/extras";
import { trainerZumThema } from "../../../training/themennamen";

/** Je Bedingungsart ein Text; eine neue Art bekommt hier eine Zeile. */
const BEDINGUNGSTEXTE: {
  readonly [A in Bedingung["art"]]: (bedingung: Extract<Bedingung, { art: A }>) => string;
} = {
  stufe: (b) => t("extras.bedingung.stufe", { stufe: b.ab }),
  orden: (b) => t(`extras.bedingung.orden.${b.gruppe}`),
  meisterschaft: (b) => meisterschaftstext(b),
};

/**
 * Text einer Bedingung der Meisterschaft (P3). Beispiel: 5 Taktikmotive in Gold →
 * „5 Themen im Taktiktrainer in Gold“; ohne Präfix „3 Themen in Gold“.
 */
function meisterschaftstext(b: Extract<Bedingung, { art: "meisterschaft" }>): string {
  const stufe = t(`themen.stufe.${b.stufe}`);
  const trainer = b.praefix ? trainerZumThema(b.praefix) : null;
  return trainer
    ? t("themen.bedingung.extraTrainer", {
        anzahl: b.anzahl,
        stufe,
        trainer: t(`trainer.${trainer}.name`),
      })
    : t("themen.bedingung.extra", { anzahl: b.anzahl, stufe });
}

/** Text einer Bedingung. Beispiel: { art: "stufe", ab: 5 } → „Ab Stufe 5“. */
export function bedingungstext(bedingung: Bedingung): string {
  // Der Text gehört zur Art der Bedingung (BEDINGUNGSTEXTE ist danach getippt).
  const text = BEDINGUNGSTEXTE[bedingung.art] as (b: Bedingung) => string;
  return text(bedingung);
}

/** Name eines Extras. Beispiel: „figuren-gold“ → „Figurensatz Gold“. */
export function extraname(extra: Extra): string {
  return t(`extras.name.${extra.kennung as Extrakennung}`);
}
