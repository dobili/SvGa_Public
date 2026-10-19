/**
 * Aufklappliste für die Wahl aus vielen Einträgen in den Trainern (Eröffnung, Motiv, Thema,
 * Partie). Wunsch des Autors (19.10.2026): Statt langer Reihen von Chips eine Liste, die auf dem
 * Handy die gewohnte Auswahl des Systems öffnet.
 *
 * Rolle im Gesamtbild: ersetzt die Chip-Gruppen mit vielen Einträgen; kurze Wahlen (Seite,
 * Stufe) bleiben Chips. Abhängigkeiten: keine außer React.
 */
import { useId } from "react";

/**
 * Beschriftete Aufklappliste.
 *
 * Eingaben: Beschriftung, Einträge als Wert und Text, gewählter Wert, Rückruf.
 * Beispiel: Repertoire-Trainer, „Eröffnung“ → „Spanische Partie“, „Italienische Partie“, …
 * Sonderfall: Ein leerer Eintrag ist nicht vorgesehen; der Aufrufer wählt vorab den ersten.
 */
export function Auswahlliste<T extends string>({
  titel,
  eintraege,
  wert,
  setze,
  testkennung,
}: {
  titel: string;
  eintraege: readonly { readonly wert: T; readonly text: string }[];
  wert: T;
  setze: (wert: T) => void;
  testkennung?: string;
}) {
  const kennung = useId();
  return (
    <div className="auswahlliste">
      <label className="einstellung-name" htmlFor={kennung}>
        {titel}
      </label>
      <select
        id={kennung}
        className="auswahlfeld"
        value={wert}
        data-testid={testkennung}
        onChange={(e) => {
          const neu = eintraege.find((x) => x.wert === e.target.value);
          if (neu) setze(neu.wert);
        }}
      >
        {eintraege.map((x) => (
          <option key={x.wert} value={x.wert}>
            {x.text}
          </option>
        ))}
      </select>
    </div>
  );
}
