/**
 * Die Spielanzeige einer Rätselrunde (docs/spiel/30_Bedienung_und_Brettstile.md, Abschnitt 4):
 * Figurenreihe statt Balken, Rückmeldung als Sprechblase (Bausteine in Raetselanzeige.tsx).
 *
 * Rolle im Gesamtbild: Haken für AufgabenAnsicht.tsx. Fehlt Ambrose in diesem Teil der Geschichte
 * (regeln/abwesenheit.ts), spricht die Figur, die die Aufgaben stellt.
 * Abhängigkeiten: anbindung/Raetselanzeige.tsx, regeln/abwesenheit.ts, anbindung/huellentexte.ts,
 * anbindung/dienste.ts, texte/texte.ts, ui/trainer/imSpiel.ts.
 */
import type { Antwortergebnis } from "../../training/wiederholung";
import type { Spielanzeige } from "../../ui/trainer/imSpiel";
import { AMBROSE, ambroseFehlt } from "../regeln/abwesenheit";
import { tSpiel } from "../texte/texte";
import { useAbenteuerstand } from "./dienste";
import { sprecherAusSchluessel } from "./huellentexte";
import { Figurenreihe, Raetselmeldung, type Ratgeber } from "./Raetselanzeige";

/**
 * Die Spielanzeige einer Rätselrunde. Eingaben: Textschlüssel dessen, der die Aufgaben stellt
 * („figur.sam.name“), und die Antworten der Runde bisher (Index → richtig/falsch).
 * Beispiel: Sam stellt die Aufgaben, Ambrose ist da → Ambrose sagt „Richtig! Lösung: Dxf7#“.
 */
export function useRaetselanzeige(
  steller: string,
  ergebnisse: readonly (Antwortergebnis | undefined)[],
): Spielanzeige {
  const stand = useAbenteuerstand();
  const fehlt = ambroseFehlt(stand?.dialogvariablen ?? {});
  const ratgeber: Ratgeber = fehlt
    ? { sprecher: sprecherAusSchluessel(steller), name: tSpiel(steller), geist: false }
    : { sprecher: AMBROSE, name: tSpiel(`figur.${AMBROSE}.name`), geist: true };
  return {
    fortschritt: (index, anzahl) => (
      <Figurenreihe index={index} anzahl={anzahl} ergebnisse={ergebnisse} />
    ),
    meldung: (richtig, text) => (
      <Raetselmeldung richtig={richtig} text={text} ratgeber={ratgeber} />
    ),
  };
}
