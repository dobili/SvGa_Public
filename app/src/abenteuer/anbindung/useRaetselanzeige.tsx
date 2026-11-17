/**
 * Die Spielanzeige einer Rätselrunde (docs/spiel/30_Bedienung_und_Brettstile.md, Abschnitt 4):
 * Figurenreihe statt Balken, Rückmeldung als Sprechblase (Bausteine in Raetselanzeige.tsx).
 *
 * Rolle im Gesamtbild: Haken für AufgabenAnsicht.tsx. Ist Ambrose nicht da (regeln/abwesenheit.ts:
 * Tiefpunkt, nach dem Abschied), spricht die Figur, die die Aufgaben stellt; wäre das Ambrose
 * selbst (seine Erinnerungen), steht die Rückmeldung ohne Namen und Porträt da.
 * Abhängigkeiten: anbindung/Raetselanzeige.tsx, regeln/abwesenheit.ts, anbindung/huellentexte.ts,
 * anbindung/dienste.ts, texte/texte.ts, ui/trainer/imSpiel.ts.
 */
import type { Antwortergebnis } from "../../training/wiederholung";
import type { Spielanzeige } from "../../ui/trainer/imSpiel";
import { AMBROSE, raetselstimmen } from "../regeln/abwesenheit";
import type { Abenteuerstand } from "../schnittstelle/spielstand";
import { tSpiel } from "../texte/texte";
import { useAbenteuerstand } from "./dienste";
import { sprecherAusSchluessel } from "./huellentexte";
import { Figurenreihe, Raetselmeldung, type Ratgeber } from "./Raetselanzeige";

/**
 * Wer die Rückmeldung der Runde spricht. Eingaben: Textschlüssel dessen, der die Aufgaben stellt,
 * Dialogvariablen.
 * Beispiel: Sam stellt, Ambrose da → Ambrose (als Geist); Sam stellt nach dem Abschied → Sam;
 * Ambroses Erinnerung nach dem Abschied → kein Sprecher, kein Name.
 */
export function ratgeberDerRunde(
  steller: string,
  variablen: Abenteuerstand["dialogvariablen"],
): Ratgeber {
  const sprecher = sprecherAusSchluessel(steller);
  const stimmen = raetselstimmen(sprecher, variablen);
  if (stimmen.ambrose)
    return { sprecher: AMBROSE, name: tSpiel(`figur.${AMBROSE}.name`), geist: true };
  if (!stimmen.steller) return { sprecher: null, name: "", geist: false };
  // Ambrose als Steller, solange er da ist (Erinnerung): er selbst, als Geist.
  return { sprecher, name: tSpiel(steller), geist: sprecher === AMBROSE };
}

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
  const ratgeber = ratgeberDerRunde(steller, stand?.dialogvariablen ?? {});
  return {
    fortschritt: (index, anzahl) => (
      <Figurenreihe index={index} anzahl={anzahl} ergebnisse={ergebnisse} />
    ),
    meldung: (richtig, text) => (
      <Raetselmeldung richtig={richtig} text={text} ratgeber={ratgeber} />
    ),
  };
}
