/**
 * Rätsel ohne weiße Trainerkarte (docs/spiel/30_Bedienung_und_Brettstile.md, Abschnitt 4): die
 * Rückmeldung als Sprechblase mit Ambroses Porträt statt grün-roter Kästen, der Fortschritt als
 * kleine Reihe von Figuren statt Balken. Die Aufgabe selbst steht auf Pergament (raetsel.css).
 *
 * Rolle im Gesamtbild: Die Bausteine; useRaetselanzeige.tsx setzt sie zur Spielanzeige zusammen,
 * die AufgabenAnsicht.tsx über den SpielanzeigeKontext (ui/trainer/imSpiel.ts) an Rundenrahmen
 * und Aufgaben der App reicht; deren Logik und Texte bleiben.
 * Abhängigkeiten: dialog/Portraet.tsx.
 */
import type { Antwortergebnis } from "../../training/wiederholung";
import { Portraet } from "../dialog/Portraet";

/** Figur je Aufgabe: Bauern auf dem Weg, die letzte Aufgabe ist der König. */
const BAUER = "♟";
const KOENIG = "♚";

/** Zustand eines Feldes der Reihe: beantwortet (richtig/falsch), jetzt dran oder noch offen. */
function feldzustand(
  i: number,
  index: number,
  ergebnisse: readonly (Antwortergebnis | undefined)[],
): string {
  if (i === index) return "jetzt";
  if (i > index) return "offen";
  return ergebnisse[i] === "richtig" ? "richtig" : "falsch";
}

/**
 * Die Figurenreihe der Runde. Beispiel: vier Aufgaben, die erste richtig, die zweite dran →
 * ♟ (grün) ♟ (gold, hervorgehoben) ♟ (blass) ♚ (blass).
 * Für Vorleser zählt der Satz „Aufgabe 2 von 4“ über der Reihe (Rundenrahmen); die Reihe ist Bild.
 */
export function Figurenreihe({
  index,
  anzahl,
  ergebnisse,
}: {
  readonly index: number;
  readonly anzahl: number;
  readonly ergebnisse: readonly (Antwortergebnis | undefined)[];
}) {
  return (
    <ol className="abenteuer-figurenreihe" aria-hidden="true" data-testid="abenteuer-figurenreihe">
      {Array.from({ length: anzahl }, (_, i) => (
        <li key={i} data-zustand={feldzustand(i, index, ergebnisse)}>
          {i === anzahl - 1 ? KOENIG : BAUER}
        </li>
      ))}
    </ol>
  );
}

/** Wer die Rückmeldung spricht: Sprecherkennung und Name. */
export interface Ratgeber {
  readonly sprecher: string | null;
  readonly name: string;
  readonly geist: boolean;
}

/** Die Rückmeldung als Sprechblase mit Porträt; richtig froh, falsch ruhig. */
export function Raetselmeldung({
  richtig,
  text,
  ratgeber,
}: {
  readonly richtig: boolean;
  readonly text: string;
  readonly ratgeber: Ratgeber;
}) {
  return (
    <div
      className="abenteuer-raetselmeldung"
      data-richtig={richtig ? "ja" : "nein"}
      data-erscheinung={ratgeber.geist ? "geist" : undefined}
      data-testid="abenteuer-raetselmeldung"
    >
      {ratgeber.sprecher && (
        <Portraet sprecher={ratgeber.sprecher} stimmung={richtig ? "froh" : null} />
      )}
      <p className={`meldung ${richtig ? "gut" : "schlecht"}`} role="status">
        <strong>{ratgeber.name}</strong> {text}
      </p>
    </div>
  );
}
