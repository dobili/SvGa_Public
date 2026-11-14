/**
 * Test zum Zwischenstand der Dialogvariablen (Befund der Chaos-Simulation, 14.11.2026): Wer mitten
 * im Dialog neu lädt, behält Quest-Schritt und Variable des gemeldeten Knotens zusammen. Spielt
 * nach, was Dialog.tsx (Knoten melden mit Variablen) und useDialogende.ts (sichereVariablen) tun,
 * mit einer echten Ink-Geschichte nach dem Muster von maple-falls-wohnzimmer.mama_foto.
 */
import { Compiler } from "inkjs/compiler/Compiler";
import { CompilerOptions } from "inkjs/compiler/CompilerOptions";
import { describe, expect, it } from "vitest";
import { Geschichte, type Dialogvariablen, type Wirkungen } from "../dialog/geschichte";
import { variablenNachDialog } from "../regeln/dialogvariablen";

const INK = `
VAR mamaFotoGesehen = false
=== mama_foto ===
~ mamaFotoGesehen = true
Du legst das Foto auf den Tisch. #sprecher:erzaehler
Mama kommt von der Schicht. #sprecher:erzaehler
-> END
`;

/** Wie der Paketbau: alle Besuche zählen (für neueKnoten). */
const ALLE_BESUCHE = new CompilerOptions(null, [], true);

const nichts = () => undefined;
const KEINE_WIRKUNGEN: Wirkungen = {
  gibKarte: nichts,
  setzeSzene: nichts,
  beginnePartie: nichts,
  beginneAufgaben: nichts,
  setzeZustand: nichts,
  schalteSteckbrief: nichts,
  oeffneLaden: nichts,
  gibFund: nichts,
  reise: nichts,
  zeigeVorfuehrung: nichts,
  beginneSimultan: nichts,
  beginneGedaechtnis: nichts,
  setzeToenung: nichts,
  zahle: nichts,
};

describe("Zwischenstand der Dialogvariablen", () => {
  it("Neuladen nach dem ersten Schritt: Quest-Schritt und Variable stehen beide im Stand", () => {
    const json = new Compiler(INK, ALLE_BESUCHE).Compile().ToJson() ?? "";
    const g = new Geschichte(json, KEINE_WIRKUNGEN, { mamaFotoGesehen: false }, "Kim");
    g.starte("mama_foto");
    // Die erste Zeile zeigt Dialog.tsx beim Öffnen.
    g.weiter();
    const vorher: Dialogvariablen = { mamaFotoGesehen: false };
    let gespeichert: Dialogvariablen = vorher;
    const schritte: string[] = [];
    // Erstes „Weiter“: Dialog.tsx meldet den Knoten mit den Variablen; die Oberwelt sichert erst
    // die Variablen, dann den Quest-Schritt.
    g.weiter();
    const variablen = g.variablen();
    for (const knoten of g.neueKnoten()) {
      gespeichert = variablenNachDialog(vorher, gespeichert, variablen);
      schritte.push(knoten);
    }
    // Hier lädt der Spieler neu: Dialog und Ink sind weg, der gespeicherte Stand bleibt.
    expect(schritte).toEqual(["mama_foto"]);
    expect(gespeichert.mamaFotoGesehen).toBe(true);
  });
});
