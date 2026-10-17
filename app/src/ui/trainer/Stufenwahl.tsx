/**
 * Wahl der Schwierigkeit 1 bis 5 (oder alle) für die Trainer mit geeichten Aufgaben.
 *
 * Rolle im Gesamtbild: Taktiktrainer und „Falle oder Köder“ (AP 13). Die Stufen sind an echten
 * Lösungsversuchen auf Lichess geeicht (docs/TRAINERDATEN.md, „Schwierigkeit: so gemessen“).
 * Abhängigkeiten: i18n.
 */
import { t } from "../../i18n/sprache";

const STUFEN = [1, 2, 3, 4, 5] as const;

export function Stufenwahl({
  stufe,
  setze,
  erklaerung = t("taktiktrainer.stufenText"),
}: {
  stufe: number | null;
  setze: (stufe: number | null) => void;
  /** Wie die Stufen gemessen sind (Standard: an Lichess geeicht). */
  erklaerung?: string;
}) {
  return (
    <>
      <fieldset className="zahlwahl">
        <legend>{t("taktiktrainer.stufeWahl")}</legend>
        <button
          type="button"
          className="chip"
          aria-pressed={stufe === null}
          onClick={() => setze(null)}
        >
          {t("taktiktrainer.alleStufen")}
        </button>
        {STUFEN.map((s) => (
          <button
            key={s}
            type="button"
            className="chip"
            aria-pressed={stufe === s}
            onClick={() => setze(s)}
          >
            {s}
          </button>
        ))}
      </fieldset>
      <p className="hinweis">{erklaerung}</p>
    </>
  );
}
