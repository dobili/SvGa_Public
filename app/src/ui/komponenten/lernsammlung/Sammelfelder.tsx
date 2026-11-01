/**
 * Die Felder eines Eintrags der Lernsammlung: Plan, Notiz und Eröffnung, jedes mit Beschriftung
 * und Beispiel.
 *
 * Rolle im Gesamtbild: Dasselbe Feld-Trio steht beim Anlegen (SammelFormular.tsx) und beim
 * Bearbeiten eines Eintrags (Sammeleintrag.tsx), damit beides gleich aussieht und gleich viel
 * erlaubt (Wunsch des Autors, 1.11.2026: nachträglich alle Felder des Anlegens ändern).
 * Unter der Notiz steht auf Wunsch das Feld „Variante“ (Variationsbrowser, Stufe 4:
 * varianten/Variantenwahl.tsx), als ``zusatz`` hereingereicht.
 * Abhängigkeiten: training/lernsammlung.ts (Längen), i18n.
 */
import { useId, type ReactNode } from "react";
import { t } from "../../../i18n/sprache";
import {
  EROEFFNUNG_HOECHSTENS,
  NOTIZ_HOECHSTENS,
  PLAN_HOECHSTENS,
} from "../../../training/lernsammlung";

/** Zeilen des Notizfelds. */
const NOTIZZEILEN = 2;

/** Ein beschriftetes Textfeld (eine Zeile oder mehrere). */
function Feld({
  name,
  wert,
  laenge,
  beispiel,
  zeilen,
  beiAenderung,
}: {
  name: string;
  wert: string;
  laenge: number;
  beispiel: string;
  zeilen?: number;
  beiAenderung: (wert: string) => void;
}) {
  const id = useId();
  const gemeinsam = {
    id,
    className: "textfeld",
    maxLength: laenge,
    value: wert,
    placeholder: beispiel,
  };
  return (
    <>
      <label className="einstellung-name" htmlFor={id}>
        {name}
      </label>
      {zeilen ? (
        <textarea {...gemeinsam} rows={zeilen} onChange={(e) => beiAenderung(e.target.value)} />
      ) : (
        <input {...gemeinsam} type="text" onChange={(e) => beiAenderung(e.target.value)} />
      )}
    </>
  );
}

/** Die drei Werte der Felder. */
export interface Sammelwerte {
  readonly plan: string;
  readonly notiz: string;
  readonly eroeffnung: string;
}

/**
 * Plan, Notiz und Eröffnung. Eingaben: die Werte, was bei einer Änderung geschieht und ein Feld
 * unter der Notiz (``zusatz``, die Variante).
 * Beispiel: Abb. 2.2 → Eröffnung „Spanische Partie“ vorgefüllt, Plan und Notiz leer.
 */
export function Sammelfelder({
  werte,
  beiAenderung,
  zusatz,
}: {
  werte: Sammelwerte;
  beiAenderung: (teil: Partial<Sammelwerte>) => void;
  zusatz?: ReactNode;
}) {
  return (
    <>
      <Feld
        name={t("sammlung.plan")}
        wert={werte.plan}
        laenge={PLAN_HOECHSTENS}
        beispiel={t("sammlung.planBeispiel")}
        beiAenderung={(plan) => beiAenderung({ plan })}
      />
      <Feld
        name={t("sammlung.notiz")}
        wert={werte.notiz}
        laenge={NOTIZ_HOECHSTENS}
        beispiel={t("sammlung.notizBeispiel")}
        zeilen={NOTIZZEILEN}
        beiAenderung={(notiz) => beiAenderung({ notiz })}
      />
      {zusatz}
      <Feld
        name={t("sammlung.eroeffnung")}
        wert={werte.eroeffnung}
        laenge={EROEFFNUNG_HOECHSTENS}
        beispiel={t("sammlung.eroeffnungBeispiel")}
        beiAenderung={(eroeffnung) => beiAenderung({ eroeffnung })}
      />
    </>
  );
}
