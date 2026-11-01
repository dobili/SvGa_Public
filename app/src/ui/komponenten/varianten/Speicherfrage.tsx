/**
 * Das Blatt „Variante speichern?“ mit den Antworten zum Anlass (useSpeicherfrage.ts).
 *
 * Rolle im Gesamtbild: Wunsch des Autors (1.11.2026): Gespeichert wird nur per Abfrage. Beim
 * Verlassen: Speichern, Nicht speichern, Abbrechen; vor „Karte“, „Von hier spielen“ und
 * „Abfragen“: Speichern, Abbrechen.
 * Abhängigkeiten: spielstart/Blatt.tsx, useSpeicherfrage.ts, i18n.
 */
import { t } from "../../../i18n/sprache";
import { Blatt } from "../spielstart/Blatt";
import type { Speicherfragen } from "./useSpeicherfrage";

/** Das Blatt; ohne offene Frage geschlossen. */
export function Speicherfrage({ fragen }: { fragen: Speicherfragen }) {
  const { frage, antworte } = fragen;
  const verlassen = frage?.anlass === "verlassen";
  return (
    <Blatt
      titel={t("varianten.frage.titel")}
      offen={frage !== null}
      schliessen={() => antworte("abbrechen")}
      testid="variante-speicherfrage"
      kinder={
        <>
          <p>{t(verlassen ? "varianten.frage.verlassen" : "varianten.frage.sprung")}</p>
          <div className="knopfreihe">
            <button type="button" className="knopf-haupt" onClick={() => antworte("speichern")}>
              {t("varianten.speichern")}
            </button>
            {verlassen && (
              <button type="button" className="knopf-zweit" onClick={() => antworte("verwerfen")}>
                {t("varianten.frage.verwerfen")}
              </button>
            )}
            <button type="button" className="knopf-zweit" onClick={() => antworte("abbrechen")}>
              {t("loeschen.nein")}
            </button>
          </div>
        </>
      }
    />
  );
}
