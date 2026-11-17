/**
 * Ambroses Abwesenheit (Wunsch des Haupt-Chats, 13.11.2026 und 17.11.2026; Regelwerk R29, R29a;
 * Entscheidung Q21-5): Zwischen „Tiefpunkt“ (Port Delacroix nach dem Vorwurf, Dialogvariable
 * tiefpunktGesehen) und „Versöhnung“ (Desert Springs, versoehnungGesehen) und wieder nach dem
 * Abschied im Finale (abschiedGesehen) ist Ambrose nicht da. Für beides gilt eine Regel,
 * `ambroseNichtDa`: Er steht auf keiner Karte, seine Karten sind im Kartenmenü grau („Er ist nicht
 * da.“), er spricht weder am Brett noch in den Rätseln, Partiemomente mit ihm fallen weg, und am
 * Reisebrett spielt Juno statt seiner (`uebungspartie`).
 *
 * Rolle im Gesamtbild: reine Regeln für weltdaten.ts (Karte), Deckwahl.tsx und
 * KartenleisteAnzeige.tsx (Karten), Momentzeile.tsx (Momente), die Rätselrunden
 * (useRaetselanzeige.tsx, useRaetselgespraech.ts, AufgabenAnsicht.tsx), die Ergebniskarte und das
 * Reisebrett (Oberwelt.tsx, usePartiestart.ts) und Ambroses Kommentar zu Statisten; karten.ts und
 * schutzengel.ts fragen dieselbe Regel.
 * Abhängigkeiten: schnittstelle/spielstand.ts (Typ).
 */
import type { Abenteuerstand } from "../schnittstelle/spielstand";

/** Kurzname der Figur in orte.json (`<ort>.ambrose`) und in den Dialogtags (`#sprecher:ambrose`). */
export const AMBROSE = "ambrose";

/**
 * Karten, in denen Ambrose selbst handelt: Er zieht (Mentor-Zug), hält auf (Schutzengel), zeigt
 * (Fingerzeig) oder flüstert (Flüstern, Klares Flüstern). Sprüche und Werkzeuge des Buches
 * gehören dem Helden und bleiben.
 */
const AMBROSES_WIRKUNGEN: readonly string[] = [
  "mentorzug",
  "schutzengel",
  "fingerzeig",
  "fluestern",
];

/** Übungspartien des Reisebretts (begegnungen.json): gegen Ambrose, ohne ihn gegen Juno. */
export const UEBUNGSPARTIE_AMBROSE = "reisebrett.ambrose";
export const UEBUNGSPARTIE_JUNO = "reisebrett.juno";

/** Teilregel Tiefpunkt (R29): tiefpunktGesehen ohne versoehnungGesehen. */
function imTiefpunkt(variablen: Abenteuerstand["dialogvariablen"]): boolean {
  return variablen.tiefpunktGesehen === true && variablen.versoehnungGesehen !== true;
}

/**
 * Hat Ambrose sich verabschiedet? Nach dem Abschied auf der Treppe der Capital Arena
 * (Dialogvariable abschiedGesehen, capital-arena-aussen.ink) spricht er nicht mehr (Story-Bibel
 * Abschnitt 33, Frage 5; Entscheidung Q21-5). Die Dialoge halten das selbst ein
 * (`{not abschiedGesehen: …}`, geprüft von pipeline/abenteuer/ambrose-danach.cjs); die Hülle fragt
 * hier für seine Kommentare zu Statisten und seine Partiemomente (Revanchen nach dem Finale).
 * Beispiel: abschiedGesehen → ja; im Tiefpunkt → nein (beides zusammen: ambroseNichtDa).
 */
export function ambroseVerabschiedet(variablen: Abenteuerstand["dialogvariablen"]): boolean {
  return variablen.abschiedGesehen === true;
}

/**
 * Ist Ambrose gerade nicht da? Die eine Regel der Hülle für alles, was von ihm kommt: seine vier
 * Karten, seine Zeilen am Brett und in den Rätseln, sein Name an Hinweis und Kipppunkt, seine
 * Partiemomente, die Übungspartie am Reisebrett.
 * Warum eine Regel: Im Tiefpunkt (R29) und nach dem Abschied (Q21-5) soll sich die Hülle gleich
 * verhalten; vorher kannte sie nur den Tiefpunkt.
 * Beispiel: tiefpunktGesehen ohne versoehnungGesehen → ja; nach der Versöhnung → nein;
 * abschiedGesehen → ja (auch wenn versoehnungGesehen gilt).
 * Sonderfall: Vor der ersten Lektion ist er noch nicht erwacht; das regelt ambroseSprichtJetzt.
 */
export function ambroseNichtDa(variablen: Abenteuerstand["dialogvariablen"]): boolean {
  return imTiefpunkt(variablen) || ambroseVerabschiedet(variablen);
}

/**
 * Die Übungspartie des Reisebretts (docs/spiel/11, I3): gegen Ambrose, und wenn er nicht da ist,
 * gegen Juno. Warum Juno: Es ist ihr Brett („Spiel mit Ambrose. Oder mit mir, wenn ich anrufe.“,
 * ironwood-aussen.ink, Szene 51a); so bleibt die freie Übungspartie im Tiefpunkt und nach dem
 * Finale erhalten.
 * Beispiel: abschiedGesehen → „reisebrett.juno“; sonst „reisebrett.ambrose“.
 */
export function uebungspartie(variablen: Abenteuerstand["dialogvariablen"]): string {
  return ambroseNichtDa(variablen) ? UEBUNGSPARTIE_JUNO : UEBUNGSPARTIE_AMBROSE;
}

/**
 * Kann Ambrose gerade etwas sagen, etwa einen Kommentar zu einem Statisten (`<sagt>.ambrose`,
 * Wunsch des Haupt-Chats, 17.11.2026)? Erst nach der ersten Lektion auf dem Dachboden
 * (ersteLektionBesprochen); vorher ist er noch nicht erwacht. Nach dem Vorwurf (tiefpunktGesehen)
 * schweigt er, bis er bei der Familie in Port Delacroix wieder spricht (ambroseSprichtWieder,
 * Story-Bibel Szene 68) oder spätestens bei der Versöhnung (versoehnungGesehen); so halten es auch
 * die Dialoge (weg-delacroix-desert.ink, port-delacroix-turnhalle.ink). Nach dem Abschied
 * (ambroseVerabschiedet) sagt er nichts mehr.
 * Beispiel: tiefpunktGesehen ohne ambroseSprichtWieder → nein; danach mit ihm → ja.
 */
export function ambroseSprichtJetzt(variablen: Abenteuerstand["dialogvariablen"]): boolean {
  if (variablen.ersteLektionBesprochen !== true || ambroseVerabschiedet(variablen)) return false;
  if (variablen.tiefpunktGesehen !== true) return true;
  return variablen.ambroseSprichtWieder === true || variablen.versoehnungGesehen === true;
}

/**
 * Wer in einer Rätselrunde spricht: `steller` (wer die Aufgaben stellt, oben und in der
 * Rückmeldung) und `ambrose` (unten: Hinweis und Zuspruch; sonst auch die Rückmeldung).
 * Eingaben: Kurzname dessen, der die Aufgaben stellt („sam“, in Erinnerungen „ambrose“, oder
 * null), Dialogvariablen.
 * Beispiel: Sam stellt, Ambrose da → beide; Sam stellt nach dem Abschied → nur Sam; Ambrose
 * stellt (Erinnerung) und ist da → nur als Steller; Ambrose stellt nach dem Abschied → niemand,
 * die Runde läuft ohne Namen und Porträt.
 */
export function raetselstimmen(
  steller: string | null,
  variablen: Abenteuerstand["dialogvariablen"],
): { readonly steller: boolean; readonly ambrose: boolean } {
  const nichtDa = ambroseNichtDa(variablen);
  const selbst = steller === AMBROSE;
  return { steller: !(selbst && nichtDa), ambrose: !selbst && !nichtDa };
}

/** Handelt Ambrose in dieser Karte? Beispiel: Mentor-Zug → ja, Abzählen → nein. */
export function istAmbrosesKarte(sorte: { readonly wirkung: { readonly art: string } }): boolean {
  return AMBROSES_WIRKUNGEN.includes(sorte.wirkung.art);
}

/** Ist das Objekt einer Tiled-Karte die Figur Ambrose? */
function istAmbrose(objekt: unknown): boolean {
  const o = objekt as { name?: unknown; type?: unknown };
  return o.type === "figur" && o.name === AMBROSE;
}

/**
 * Die Tiled-Karte ohne Ambrose, wenn er nicht da ist; sonst unverändert. Die Karte selbst bleibt
 * im Paket gleich, nur die geladene Fassung verliert das Objekt (keine Figur, kein Auslöser).
 * Nach dem Abschied nimmt schon orte.json die Figur weg (`wenn: nicht abschiedGesehen`); hier
 * gilt dieselbe Bedingung für ein Kartenobjekt, das trotzdem „ambrose“ heißt, nichts Zweites.
 */
export function ohneAbwesende<T extends object>(
  karte: T,
  variablen: Abenteuerstand["dialogvariablen"],
): T {
  if (!ambroseNichtDa(variablen)) return karte;
  const ebenen = (karte as { layers?: readonly { objects?: readonly unknown[] }[] }).layers;
  if (!ebenen) return karte;
  const ohne = ebenen.map((e) =>
    e.objects ? { ...e, objects: e.objects.filter((o) => !istAmbrose(o)) } : e,
  );
  return { ...karte, layers: ohne };
}

/**
 * Partiemomente ohne die, in denen Ambrose spricht, wenn er fehlt (`fehlt`: ambroseNichtDa).
 */
export function anwesendeMomente<T extends { readonly sprecher: string }>(
  momente: readonly T[],
  fehlt: boolean,
): readonly T[] {
  return fehlt ? momente.filter((m) => m.sprecher !== AMBROSE) : momente;
}
