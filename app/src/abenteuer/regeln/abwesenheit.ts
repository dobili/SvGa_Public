/**
 * Ambroses Abwesenheit im Tiefpunkt (Wunsch des Haupt-Chats, 13.11.2026; Regelwerk R29, R29a):
 * Zwischen „Tiefpunkt“ (Port Delacroix nach dem Vorwurf, Dialogvariable tiefpunktGesehen) und
 * „Versöhnung“ (Desert Springs, versoehnungGesehen) ist Ambrose nicht da. Er steht auf keiner
 * Karte, seine Karten sind im Kartenmenü grau („Er ist nicht da.“), und Partiemomente, in denen er
 * spricht, fallen weg.
 *
 * Rolle im Gesamtbild: reine Regeln für weltdaten.ts (Karte), Deckwahl.tsx (Karten) und
 * anbindung/Momentzeile.tsx (Momente); karten.ts und schutzengel.ts fragen dieselbe Bedingung.
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

/** Ist Ambrose gerade nicht da? Beispiel: tiefpunktGesehen ohne versoehnungGesehen → ja. */
export function ambroseFehlt(variablen: Abenteuerstand["dialogvariablen"]): boolean {
  return variablen.tiefpunktGesehen === true && variablen.versoehnungGesehen !== true;
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
 * Die Tiled-Karte ohne Ambrose, wenn er fehlt; sonst unverändert. Die Karte selbst bleibt im
 * Paket gleich, nur die geladene Fassung verliert das Objekt (keine Figur, kein Auslöser).
 */
export function ohneAbwesende<T extends object>(
  karte: T,
  variablen: Abenteuerstand["dialogvariablen"],
): T {
  if (!ambroseFehlt(variablen)) return karte;
  const ebenen = (karte as { layers?: readonly { objects?: readonly unknown[] }[] }).layers;
  if (!ebenen) return karte;
  const ohne = ebenen.map((e) =>
    e.objects ? { ...e, objects: e.objects.filter((o) => !istAmbrose(o)) } : e,
  );
  return { ...karte, layers: ohne };
}

/** Partiemomente ohne die, in denen Ambrose spricht, wenn er fehlt (`fehlt`: ambroseFehlt). */
export function anwesendeMomente<T extends { readonly sprecher: string }>(
  momente: readonly T[],
  fehlt: boolean,
): readonly T[] {
  return fehlt ? momente.filter((m) => m.sprecher !== AMBROSE) : momente;
}
