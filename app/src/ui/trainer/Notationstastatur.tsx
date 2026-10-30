/**
 * Notationstastatur: einen Zug aus Bausteinen zusammentippen statt mit der Handytastatur.
 *
 * Rolle im Gesamtbild: Eingabe für „Zug aufschreiben“ im Trainer „Koordinaten, Notation,
 * Gangarten“ (Wunsch des Autors, 30.10.2026: Die aufklappende Tastatur sei fummelig und breche
 * die Immersion). Vier Reihen: Figuren (in der Sprache der App, deutsch K D T L S), Linien a bis
 * h, Reihen 1 bis 8, Zusätze (x, +, #, =, 0-0, 0-0-0) und Löschen. Jeder Tipp hängt seinen
 * Baustein an; der Zug baut sich oben sichtbar auf, etwa „S“ → „Sf“ → „Sf3“. Doppeldeutige Züge
 * wie „Tad1“ entstehen von selbst, weil man eine Linie zusätzlich antippt; die Umwandlung als
 * „=“ und danach der Figurenbuchstabe („e8=D“).
 * Abhängigkeiten: i18n (Figurenbuchstaben), Stil in ui/stil/trainerfeinschliff.css.
 * Buchbezug: Kapitel 0, Notation (Figurenbuchstaben, x, +, #, Rochade 0-0 und 0-0-0).
 */
import { figurenbuchstaben, sprache, t } from "../../i18n/sprache";

/** Reihenfolge der Figuren auf der Tastatur: König, Dame, Turm, Läufer, Springer. */
const FIGUREN_ENGLISCH = ["K", "Q", "R", "B", "N"] as const;
const LINIEN = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;
const REIHEN = ["1", "2", "3", "4", "5", "6", "7", "8"] as const;
const ZUSAETZE = ["x", "+", "#", "=", "0-0", "0-0-0"] as const;

/** Eine Reihe Bausteine. */
function Bausteinreihe({
  titel,
  bausteine,
  tippe,
  gesperrt,
}: {
  titel: string;
  bausteine: readonly string[];
  tippe: (baustein: string) => void;
  gesperrt: boolean;
}) {
  return (
    <div className="tastenreihe" role="group" aria-label={titel}>
      {bausteine.map((b) => (
        <button
          key={b}
          type="button"
          className="chip taste"
          disabled={gesperrt}
          onClick={() => tippe(b)}
        >
          {b}
        </button>
      ))}
    </div>
  );
}

/**
 * Die Tastatur mit Anzeige des bisher getippten Zuges.
 *
 * Eingaben: Text, Setzer, gesperrt (nach dem Prüfen). Beispiel: Tipps „S“, „f“, „3“ → „Sf3“.
 * Sonderfall: Eine Rochade ersetzt die ganze Eingabe, denn sie steht allein.
 */
export function Notationstastatur({
  text,
  setze,
  gesperrt,
}: {
  text: string;
  setze: (text: string) => void;
  gesperrt: boolean;
}) {
  const buchstaben = figurenbuchstaben(sprache());
  const figuren = FIGUREN_ENGLISCH.map((f) => buchstaben[f] ?? f);
  const tippe = (baustein: string) => {
    if (baustein.startsWith("0-0")) setze(baustein);
    else setze(text + baustein);
  };
  return (
    <div className="notationstastatur" data-testid="notationstastatur">
      <output
        className="notationsanzeige"
        aria-live="polite"
        aria-label={t("koordinatentrainer.eingabe")}
      >
        {text === "" ? t("koordinatentrainer.tastaturLeer") : text}
      </output>
      <Bausteinreihe
        titel={t("koordinatentrainer.tastaturFiguren")}
        bausteine={figuren}
        tippe={tippe}
        gesperrt={gesperrt}
      />
      <Bausteinreihe
        titel={t("koordinatentrainer.tastaturLinien")}
        bausteine={LINIEN}
        tippe={tippe}
        gesperrt={gesperrt}
      />
      <Bausteinreihe
        titel={t("koordinatentrainer.tastaturReihen")}
        bausteine={REIHEN}
        tippe={tippe}
        gesperrt={gesperrt}
      />
      <div
        className="tastenreihe"
        role="group"
        aria-label={t("koordinatentrainer.tastaturZusaetze")}
      >
        {ZUSAETZE.map((b) => (
          <button
            key={b}
            type="button"
            className="chip taste"
            disabled={gesperrt}
            onClick={() => tippe(b)}
          >
            {b}
          </button>
        ))}
        <button
          type="button"
          className="chip taste"
          disabled={gesperrt || text === ""}
          aria-label={t("koordinatentrainer.tastaturLoeschen")}
          onClick={() => setze(text.startsWith("0-0") ? "" : text.slice(0, -1))}
        >
          ⌫
        </button>
      </div>
    </div>
  );
}
