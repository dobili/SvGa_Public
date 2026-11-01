/**
 * Die Felder eines Eintrags der Fehlerdatenbank: Fehlerart aus der Gesamt-Checkliste und ein Satz.
 *
 * Rolle im Gesamtbild: Dieselben Felder stehen beim Anlegen (FehlerFormular.tsx, auch im
 * Rückblick über „Merken“) und beim Bearbeiten eines Eintrags (FehlerEintrag.tsx), damit beides
 * gleich aussieht (Wunsch des Autors, 1.11.2026: nachträglich alle Felder des Anlegens ändern).
 * Abhängigkeiten: training/fehlerdatenbank.ts (Länge), useFehlerarten, i18n.
 */
import { useId } from "react";
import { t } from "../../i18n/sprache";
import { SATZ_HOECHSTENS } from "../../training/fehlerdatenbank";
import { useFehlerarten } from "./useFehlerarten";

/** Zeilen des Satzfelds. */
const SATZZEILEN = 2;

/** Die Werte der Felder; Fehlerart null heißt „noch nicht gewählt“. */
export interface Fehlerwerte {
  readonly art: number | null;
  readonly satz: string;
}

/**
 * Fehlerart (Auswahl) und Satz. Beispiel: Rückblick, 12... Sxe4?? → „Schach oder Schlag
 * übersehen (Kapitel 1)“ vorgewählt, Satz vorgeschlagen.
 */
export function Fehlerfelder({
  werte,
  beiAenderung,
}: {
  werte: Fehlerwerte;
  beiAenderung: (teil: Partial<Fehlerwerte>) => void;
}) {
  const arten = useFehlerarten();
  const id = useId();
  return (
    <>
      <label className="einstellung-name" htmlFor={`${id}-art`}>
        {t("fehlerdb.fehlerart")}
      </label>
      <select
        id={`${id}-art`}
        className="auswahlfeld"
        value={werte.art ?? ""}
        onChange={(e) =>
          beiAenderung({ art: e.target.value === "" ? null : Number(e.target.value) })
        }
      >
        <option value="">{t("fehlerdb.waehlen")}</option>
        {arten.map((a) => (
          <option key={a.kapitel} value={a.kapitel}>
            {t("fehlerdb.artName", { kapitel: a.kapitel, name: a.name })}
          </option>
        ))}
      </select>
      <label className="einstellung-name" htmlFor={`${id}-satz`}>
        {t("fehlerdb.satz")}
      </label>
      <textarea
        id={`${id}-satz`}
        className="textfeld"
        maxLength={SATZ_HOECHSTENS}
        rows={SATZZEILEN}
        value={werte.satz}
        placeholder={t("fehlerdb.satzBeispiel")}
        onChange={(e) => beiAenderung({ satz: e.target.value })}
      />
    </>
  );
}
