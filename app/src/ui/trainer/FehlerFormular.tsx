/**
 * Formular „In die Fehlerdatenbank“: Fehlerart aus der Gesamt-Checkliste wählen, einen Satz
 * schreiben, speichern.
 *
 * Rolle im Gesamtbild: Fehlerdatenbank (Kapitel 12, AP 13). Dasselbe Formular steht im Trainer
 * (mit einer Stellung als FEN) und im Rückblick einer Partie unter dem Zug, den der Leser
 * eintragen will (Stellung vor dem Zug, gespielter Zug). Die Fehlerarten kommen aus
 * nachschlagen.json (Gesamt-Checkliste, Spalte „Fehlerart“). Aus dem Rückblick kommen Fehlerart
 * und Satz schon als Vorschlag (spiel/fehlervorschlag.ts; Wunsch des Autors, 27.10.2026).
 * Abhängigkeiten: training/fehlerdatenbank.ts, speicher/speicher.ts, daten/laden.ts, i18n.
 */
import { useId, useState } from "react";
import { t } from "../../i18n/sprache";
import { zaehleAktivitaet } from "../../speicher/aktivitaet";
import { aendere } from "../../speicher/speicher";
import { mitEintrag, SATZ_HOECHSTENS } from "../../training/fehlerdatenbank";
import { useFehlerarten } from "./useFehlerarten";

/** Neue Kennung für einen Eintrag (Zeit und Zufall genügen für ein Gerät). */
function neueKennung(): string {
  return `f-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Das Formular. Beispiel: Rückblick, 12... Sxe4?? → Fehlerart „Schach oder Schlag übersehen“,
 * Satz „Dxh7 übersehen“, Speichern → Eintrag mit Stellung vor 12... Sxe4.
 */
export function FehlerFormular({
  fen,
  zug,
  beiGespeichert,
  vorschlagArt = null,
  vorschlagSatz = "",
}: {
  /** Stellung vor dem Fehler; null, solange keine gültige Stellung angegeben ist. */
  fen: string | null;
  zug?: string;
  beiGespeichert?: () => void;
  /** Vorschlag aus der Auswertung (Rückblick): Kapitel der Fehlerart, Satz; der Leser ändert. */
  vorschlagArt?: number | null;
  vorschlagSatz?: string;
}) {
  const arten = useFehlerarten();
  const id = useId();
  const [art, setzeArt] = useState<number | null>(vorschlagArt);
  const [satz, setzeSatz] = useState(vorschlagSatz.slice(0, SATZ_HOECHSTENS));
  const [gespeichert, setzeGespeichert] = useState(false);
  const speichern = () => {
    if (fen === null || art === null) return;
    const eintrag = {
      id: neueKennung(),
      datum: new Date().toISOString(),
      fen,
      satz: satz.trim(),
      fehlerart: art,
      ...(zug ? { zug } : {}),
    };
    void aendere((daten) =>
      zaehleAktivitaet(
        { ...daten, fehler: mitEintrag(daten.fehler, eintrag) },
        "fehler",
        1,
        new Date(),
      ),
    );
    setzeGespeichert(true);
    beiGespeichert?.();
  };
  if (gespeichert) {
    return (
      <p className="meldung gut" role="status">
        {t("fehlerdb.gespeichert")}
      </p>
    );
  }
  return (
    <div className="fehlerformular" data-testid="fehlerformular">
      <label className="einstellung-name" htmlFor={`${id}-art`}>
        {t("fehlerdb.fehlerart")}
      </label>
      <select
        id={`${id}-art`}
        className="auswahlfeld"
        value={art ?? ""}
        onChange={(e) => setzeArt(e.target.value === "" ? null : Number(e.target.value))}
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
        rows={2}
        value={satz}
        placeholder={t("fehlerdb.satzBeispiel")}
        onChange={(e) => setzeSatz(e.target.value)}
      />
      <button
        type="button"
        className="knopf-haupt"
        disabled={fen === null || art === null}
        onClick={speichern}
      >
        {t("fehlerdb.speichern")}
      </button>
    </div>
  );
}
