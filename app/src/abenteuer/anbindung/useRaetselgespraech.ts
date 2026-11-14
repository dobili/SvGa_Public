/**
 * Das Tischgespräch der Rätsel (docs/spiel/29_Tischgespraech.md, Abschnitt 3): Wer die Aufgaben
 * stellt, sagt oben ab und zu etwas zur Antwort; Ambrose spricht unten, wenn der Leser ihn fragt
 * oder zweimal in Folge danebenliegt. Höchstens eine Zeile je Aufgabe.
 *
 * Rolle im Gesamtbild: Haken für anbindung/AufgabenAnsicht.tsx und ErinnerungsRunde.tsx; die
 * Regeln (wer, wie oft) stehen in regeln/tischgespraech.ts, die Texte in anbindung/tischtexte.ts,
 * die Zeilen gehen in die Sprechblasen (anbindung/Tischblase.tsx). Ambrose fehlt, wo
 * regeln/abwesenheit.ts es sagt, und spricht nicht unten, wenn er selbst die Aufgaben stellt.
 * Leitsatz 5: Die Zeilen zu „falsch“ machen Mut, spotten nie.
 * Abhängigkeiten: regeln/tischgespraech.ts, regeln/abwesenheit.ts, anbindung/tischtexte.ts,
 * anbindung/tischsprecher.ts, anbindung/huellentexte.ts.
 */
import { useRef } from "react";
import { AMBROSE, ambroseFehlt } from "../regeln/abwesenheit";
import { raetselsprecher, temperamentVon, TEMPERAMENT_DER_RAETSEL } from "../regeln/tischgespraech";
import type { Raetselereignis } from "../regeln/tischereignisse";
import { tSpiel } from "../texte/texte";
import { useAbenteuerstand } from "./dienste";
import { sprecherAusSchluessel } from "./huellentexte";
import { useTischblasen, type Blasensteuerung } from "./tischkontext";
import { ambrosezeile, gegnerzeile } from "./tischsprecher";
import { ambrosetext, kurzname, tischtext, type Stimme } from "./tischtexte";
import { useGegnerliste } from "./useGegnerliste";

/** Richtige Antworten in Folge für `serie`. */
const SERIE = 3;

/** Was die Runde über ihre Antworten weiß. */
interface Rundengedaechtnis {
  falschInFolge: number;
  richtigInFolge: number;
  gesprochenBei: number | null;
  nutzung: Map<string, number>;
}

/** Das Ereignis einer Antwort: drei richtig in Folge ist eine Serie. */
function ereignisDerAntwort(richtig: boolean, g: Rundengedaechtnis): Raetselereignis {
  g.richtigInFolge = richtig ? g.richtigInFolge + 1 : 0;
  g.falschInFolge = richtig ? 0 : g.falschInFolge + 1;
  return richtig && g.richtigInFolge === SERIE ? "serie" : richtig ? "richtig" : "falsch";
}

/** Wer am Rätseltisch sitzt. */
interface Raetseltisch {
  readonly blasen: Blasensteuerung;
  readonly stimme: Stimme;
  readonly sprecher: string | null;
  readonly name: string;
  readonly ambroseDa: boolean;
  readonly kennung: string;
}

/** Spricht zu einem Ereignis, wenn die Regeln es sagen, und merkt es sich. */
function sprich(
  tisch: Raetseltisch,
  g: Rundengedaechtnis,
  ereignis: Raetselereignis,
  aufgabe: number,
): void {
  const { kennung, ambroseDa } = tisch;
  const lage = {
    kennung,
    aufgabe,
    falschInFolge: g.falschInFolge,
    gesprochenBei: g.gesprochenBei,
    ambroseDa,
  };
  const wer = raetselsprecher(ereignis, lage);
  if (!wer) return;
  const gruppe = `${wer}:${ereignis}`;
  const nutzung = g.nutzung.get(gruppe) ?? 0;
  const text =
    wer === "ambrose"
      ? ambrosetext(ereignis, nutzung, kennung)
      : tischtext(tisch.stimme, ereignis, nutzung, kennung);
  if (!text) return;
  g.nutzung.set(gruppe, nutzung + 1);
  g.gesprochenBei = aufgabe;
  const angaben = {
    schluessel: `${kennung}:${aufgabe}:${ereignis}`,
    vorrang: "tisch" as const,
    testid: "abenteuer-tischgespraech",
  };
  tisch.blasen.zeige(
    wer === "ambrose"
      ? ambrosezeile(text, angaben)
      : gegnerzeile(text, tisch.sprecher, tisch.name, angaben),
  );
}

/** Die Rückrufe der Runde: Antwort, Hinweis, letzte Aufgabe. */
export interface Raetselgespraech {
  readonly beiAntwort: (aufgabe: number, richtig: boolean) => void;
  readonly beiHinweis: (aufgabe: number) => void;
  readonly vorLetzter: (aufgabe: number) => void;
}

/**
 * Das Gespräch einer Rätselrunde. Eingaben: Textschlüssel des Namens dessen, der die Aufgaben
 * stellt („figur.coachDelgado.name“), Kennung der Runde (Startwert des Zufalls).
 * Beispiel: Sam stellt Aufgaben, der Leser löst drei in Folge → Sam sagt etwas zur Serie.
 * Sonderfall: außerhalb der Hülle (ohne Sprechblasen) still.
 */
export function useRaetselgespraech(steller: string | null, kennung: string): Raetselgespraech {
  const blasen = useTischblasen();
  const stand = useAbenteuerstand();
  const { liste } = useGegnerliste();
  const gedaechtnis = useRef<Rundengedaechtnis>({
    falschInFolge: 0,
    richtigInFolge: 0,
    gesprochenBei: null,
    nutzung: new Map(),
  });
  const sprecher = steller ? sprecherAusSchluessel(steller) : null;
  const profil = sprecher ? liste.find((g) => kurzname(g.kennung) === sprecher) : undefined;
  const tisch: Raetseltisch | null = blasen && {
    blasen,
    stimme: profil
      ? { kennung: profil.kennung, temperament: temperamentVon(profil) }
      : { kennung: "", temperament: TEMPERAMENT_DER_RAETSEL },
    sprecher,
    name: steller ? tSpiel(steller) : "",
    ambroseDa: !ambroseFehlt(stand?.dialogvariablen ?? {}) && sprecher !== AMBROSE,
    kennung,
  };
  const melde = (ereignis: Raetselereignis, aufgabe: number) => {
    if (tisch) sprich(tisch, gedaechtnis.current, ereignis, aufgabe);
  };
  return {
    beiAntwort: (aufgabe, richtig) =>
      melde(ereignisDerAntwort(richtig, gedaechtnis.current), aufgabe),
    beiHinweis: (aufgabe) => melde("hinweis", aufgabe),
    vorLetzter: (aufgabe) => melde("letzte", aufgabe),
  };
}
