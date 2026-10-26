/**
 * Löschmodus der Partienliste (seit 0.2.142, Wunsch des Autors vom 25.10.2026): Ein Papierkorb neben
 * „Filter“ und „Sortieren“ schaltet ihn ein; dann wählt ein Tipp auf eine ungewertete Partie sie
 * aus (goldener Rahmen, Haken), und „Ausgewählte löschen“ entfernt sie nach einer Nachfrage.
 *
 * Rolle im Gesamtbild: Vorher trug jede ungewertete Zeile einen eigenen Papierkorb; der kostete in
 * der Zeile Platz und stand nicht überall. Gewertete Partien bleiben unwählbar, weil sie die Wertung
 * und die besiegten Bots tragen (speicher/partien.ts, ohnePartien). Den Zustand (Modus an, welche
 * gewählt) hält Partienliste.tsx.
 * Abhängigkeiten: speicher/partien.ts, speicher/speicher.ts, Knopfsymbol, i18n, lucide-react.
 */
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { t } from "../../../i18n/sprache";
import { ohnePartien } from "../../../speicher/partien";
import { aendere } from "../../../speicher/speicher";
import { Knopfsymbol } from "../bausteine/Knopfsymbol";

const SYMBOL = 18;

/** Der Papierkorb neben Filter und Sortieren; gedrückt, solange der Löschmodus läuft. */
export function LoeschmodusKnopf({ an, beiTipp }: { an: boolean; beiTipp: () => void }) {
  return (
    <button
      type="button"
      className="filteroeffner loeschmodus-knopf"
      aria-pressed={an}
      aria-label={t("spielen.loeschen.modus")}
      title={t("spielen.loeschen.modus")}
      onClick={beiTipp}
    >
      <Trash2 size={SYMBOL} aria-hidden="true" />
    </button>
  );
}

/**
 * Die Leiste im Löschmodus über der Liste: Hinweis oder „3 ausgewählt“, „Alle auswählen“,
 * „Ausgewählte löschen“ mit Nachfrage, „Fertig“.
 * Beispiel: zwei gewählt → „2 ausgewählt“, Tipp auf „Ausgewählte löschen“ → „2 Partien endgültig
 * löschen?“ → „Ja, löschen“ → beide weg, Modus aus.
 */
export function Loeschleiste({
  gewaehlt,
  waehlbar,
  setzeGewaehlt,
  beiFertig,
}: {
  gewaehlt: ReadonlySet<string>;
  waehlbar: readonly string[];
  setzeGewaehlt: (ids: ReadonlySet<string>) => void;
  beiFertig: () => void;
}) {
  const [frage, setzeFrage] = useState(false);
  const anzahl = gewaehlt.size;
  const loesche = () => {
    void aendere((d) => ({ ...d, spiel: ohnePartien(d.spiel, gewaehlt) }));
    beiFertig();
  };
  return (
    <div className="loeschleiste" role="group" aria-label={t("spielen.loeschen.modus")}>
      <p className="loeschleiste-text" aria-live="polite">
        {anzahl === 0 ? t("spielen.loeschen.hinweis") : t("spielen.loeschen.anzahl", { anzahl })}
      </p>
      {frage ? (
        <div className="knopfreihe">
          <span className="loeschleiste-frage">
            {t(anzahl === 1 ? "spielen.loeschen.frageEins" : "spielen.loeschen.frage", { anzahl })}
          </span>
          <button type="button" className="knopf-gefahr" onClick={loesche}>
            <Knopfsymbol art="loeschen" />
            {t("spielen.loeschen.ja")}
          </button>
          <button type="button" className="knopf-zweit" onClick={() => setzeFrage(false)}>
            {t("loeschen.nein")}
          </button>
        </div>
      ) : (
        <div className="knopfreihe">
          <button
            type="button"
            className="knopf-gefahr"
            disabled={anzahl === 0}
            onClick={() => setzeFrage(true)}
          >
            <Knopfsymbol art="loeschen" />
            {t("spielen.loeschen.los")}
          </button>
          {waehlbar.length > anzahl && (
            <button
              type="button"
              className="knopf-zweit"
              onClick={() => setzeGewaehlt(new Set(waehlbar))}
            >
              {t("spielen.loeschen.alle")}
            </button>
          )}
          <button type="button" className="knopf-zweit" onClick={beiFertig}>
            {t("spielen.loeschen.fertig")}
          </button>
        </div>
      )}
    </div>
  );
}
