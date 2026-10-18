/**
 * Texte zur Lernsammlung, die von der Sprache der App abhängen: Fundstelle eines Eintrags und
 * die Beschriftungen der PGN-Ausgabe.
 *
 * Rolle im Gesamtbild: Brücke zwischen der reinen Lernsammlung (training/lernsammlung.ts,
 * training/sammlungpgn.ts) und i18n; Bildschirm Lernsammlung und PGN-Ausgabe nutzen dieselben
 * Sätze.
 * Abhängigkeiten: i18n, training/lernsammlung.ts, training/sammlungpgn.ts, training/trainer.ts.
 */
import { t } from "../../i18n/sprache";
import type { Sammeleintrag } from "../../training/lernsammlung";
import type { Pgntexte } from "../../training/sammlungpgn";
import { TRAINER } from "../../training/trainer";

/** Datum „2026-10-18T…“ als „18.10.2026“. */
function tag(iso: string): string {
  const [jahr, monat, rest] = iso.split("-");
  return `${rest?.slice(0, 2) ?? ""}.${monat ?? ""}.${jahr ?? ""}`;
}

/**
 * Woher ein Eintrag stammt, als kurzer Text.
 * Beispiel: Abbildung „2.2“ → „Abb. 2.2“; Trainer „taktik“ → „Trainer: Taktiktrainer“.
 */
export function fundstelle(eintrag: Sammeleintrag): string {
  switch (eintrag.herkunft) {
    case "abbildung":
      return t("sammlung.quelle.abbildung", { nummer: eintrag.quelle });
    case "partie":
      return t("sammlung.quelle.partie", { datum: tag(eintrag.datum) });
    case "trainer": {
      const trainer = TRAINER.find((tr) => tr.kennung === eintrag.quelle);
      return trainer
        ? t("sammlung.quelle.trainer", { name: t(`trainer.${trainer.kennung}.name`) })
        : t("sammlung.quelle.fen");
    }
    case "fen":
      return t("sammlung.quelle.fen");
  }
}

/** Beschriftungen der PGN-Ausgabe für eine Lichess-Studie. */
export function pgntexte(): Pgntexte {
  return {
    fundstelle,
    ohneEroeffnung: t("sammlung.ohneEroeffnung"),
    plan: t("sammlung.plan"),
    notiz: t("sammlung.notiz"),
  };
}
