/**
 * Texte der Extras (Gamifizierung P7): Name eines Extras und Text seiner Bedingung.
 *
 * Rolle im Gesamtbild: Profilkarte „Deine Extras“ und Kacheln der Einstellungen zeigen dieselben
 * Namen und Bedingungen; die Texte stehen unter den Vorsilben „extras.“ (Namen, Bedingungen) und
 * „extrasneu.“ (Kurznamen der Kacheln, Reiter; Gestaltung vom 31.10.2026) in den Sprachdateien.
 * Fehlt einem neuen Extra der Kurzname oder einer neuen Art der Reitertext, gilt der lange Name
 * bzw. die Kennung der Art: Neues erscheint also auch ohne Text, nur weniger schön.
 * Abhängigkeiten: training/extras.ts, training/themennamen.ts (Trainer der Meisterschaft),
 * extrawahl.ts, i18n.
 */
import { istTextschluessel, t } from "../../../i18n/sprache";
import {
  extraZu,
  type Bedingung,
  type Extra,
  type Extraart,
  type Extrakennung,
} from "../../../training/extras";
import { trainerZumThema } from "../../../training/themennamen";
import { extrawahl } from "./extrawahl";

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

/** Kurzname auf der Kachel. Beispiel: „rahmen-bronze“ → „Bronze“; ohne Kurznamen der lange Name. */
export function kurzname(extra: Extra): string {
  const schluessel = `extrasneu.kurz.${extra.kennung}`;
  return istTextschluessel(schluessel) ? t(schluessel) : extraname(extra);
}

/** Text des Reiters einer Art. Beispiel: „rahmen“ → „Rahmen“; unbekannte Art → ihre Kennung. */
export function reitertext(art: Extraart): string {
  const schluessel = `extrasneu.reiter.${art}`;
  return istTextschluessel(schluessel) ? t(schluessel) : art;
}

/**
 * Name des gewählten Werts einer Art für die Vorschau oben.
 * Beispiel: („brett“, „nacht-gold“) → „Nacht und Gold“; („konfetti“, „app“) → „Farben der App“.
 */
export function wertname(art: Extraart, wert: string): string {
  const extra = extraZu(art, wert);
  if (extra) return kurzname(extra);
  return extrawahl(art)?.name(wert) ?? wert;
}
