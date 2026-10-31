/**
 * Kompakte Kacheln unten im Bereich Training (Entwurf C2, 31.10.2026): Lernsammlung und „Alle
 * Kapitel“ (die Trainingsseiten der Website), als Liste zum Eintragen.
 *
 * Rolle im Gesamtbild: Ersetzt die Karten „Lernsammlung“ und „Training zu den Kapiteln“. Die
 * Kacheln stehen als Liste in trainingskacheln.ts (TRAININGSKACHELN).
 * Abhängigkeiten: trainingskacheln.ts, Navigation, Speicher, i18n.
 */
import { useNavigation } from "../../../app/navigationsKontext";
import { t } from "../../../i18n/sprache";
import { useSpeicher } from "../../../speicher/speicher";
import { TRAININGSKACHELN, type Trainingskachel } from "./trainingskacheln";

const SYMBOL = 26;

/** Inhalt einer Kachel: Symbol, Titel, Unterzeile. */
function Kachelinhalt({ kachel }: { kachel: Trainingskachel }) {
  const daten = useSpeicher((z) => z.daten);
  const Symbol = kachel.symbol;
  return (
    <>
      <Symbol size={SYMBOL} aria-hidden="true" />
      <span className="trainingskachel-text">
        <strong>{t(kachel.titel)}</strong>
        <span>{kachel.unterzeile(daten)}</span>
      </span>
    </>
  );
}

/** Die Kacheln nebeneinander. Beispiel: „Lernsammlung · noch leer“, „Alle Kapitel · Website“. */
export function Trainingskacheln() {
  const { navigiere } = useNavigation();
  return (
    <ul className="trainingskacheln">
      {TRAININGSKACHELN.map((kachel) => {
        const ziel = kachel.ziel;
        return (
          <li key={kachel.kennung} data-testid={`kachel-${kachel.kennung}`} data-tour={kachel.tour}>
            {"adresse" in ziel ? (
              <a className="trainingskachel" href={ziel.adresse}>
                <Kachelinhalt kachel={kachel} />
              </a>
            ) : (
              <button
                type="button"
                className="trainingskachel"
                onClick={() => navigiere(ziel.ansicht)}
              >
                <Kachelinhalt kachel={kachel} />
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}
