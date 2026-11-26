/**
 * Daten der Begleiter beim Laden einer Karte (regeln/gefolge.ts, Wunsch des Autors, 25.11.2026):
 * Wer begleitet, steht nicht zugleich an seinem Platz auf der Karte; sein Bogen wird geladen, auch
 * wenn er auf dieser Karte sonst nicht steht.
 *
 * Rolle im Gesamtbild: Teil von oberwelt/weltdaten.ts (ladeWelt); gezeichnet wird in
 * oberwelt/gefolgeschicht.ts.
 * Abhängigkeiten: daten/laden.ts (Typ), figurbogen.ts.
 */
import type { Ortdaten } from "../daten/laden";
import { figurenbildAdresse } from "./figurbogen";

interface Kartenobjekt {
  readonly name?: string;
  readonly type?: string;
}

/** Kurzname einer Figur wie im Tag `#sprecher`: „figur.juno.name“ → „juno“. */
function sprecherDer(figur: { readonly name: string }): string {
  return figur.name.split(".")[1] ?? "";
}

/**
 * Die Karte ohne die Figuren und Statisten, die gerade begleiten. Eingaben: Tiled-Karte, Ort,
 * Kurznamen der Begleiter. Eine Figur zählt über ihren Namen in orte.json (Objekt „junoClub“ mit
 * Name „figur.juno.name“ ist Juno), ein Statist über seinen Objektnamen (Juno am Bahndamm).
 * Beispiel: begleiter „juno“ im Clubraum → das Objekt „junoClub“ fehlt.
 */
export function ohneBegleiter<T extends object>(
  karte: T,
  ort: Ortdaten,
  begleiter: readonly string[],
): T {
  if (!begleiter.length) return karte;
  const ebenen = (karte as { layers?: readonly { objects?: readonly Kartenobjekt[] }[] }).layers;
  if (!ebenen) return karte;
  const begleitet = (o: Kartenobjekt): boolean => {
    if (!o.name || (o.type !== "figur" && o.type !== "statist")) return false;
    const figur = ort.figuren.find((f) => f.kennung === `${ort.kennung}.${o.name}`);
    return begleiter.includes(figur ? sprecherDer(figur) : o.name);
  };
  const gefiltert = ebenen.map((e) =>
    e.objects ? { ...e, objects: e.objects.filter((o) => !begleitet(o)) } : e,
  );
  return { ...karte, layers: gefiltert };
}

/**
 * Der Bogen je Begleiter (Schlüssel: Kurzname), aus der ersten Figur mit diesem Namen und einem
 * `sprite` in orte.json; Begleiter ohne Bogen im Paket fehlen.
 * Beispiel: ["juno"] → { juno: "blob:…" } aus „figuren/juno.png“.
 */
export async function begleiterbilderFuer(
  orte: readonly Ortdaten[],
  begleiter: readonly string[],
): Promise<Record<string, string>> {
  const paare = await Promise.all(
    begleiter.map(async (name) => {
      const figur = orte.flatMap((o) => o.figuren).find((f) => sprecherDer(f) === name && f.sprite);
      const adresse = figur?.sprite ? await figurenbildAdresse(figur.sprite) : null;
      return adresse ? ([name, adresse] as const) : null;
    }),
  );
  return Object.fromEntries(paare.filter((p) => p !== null));
}
