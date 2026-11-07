/**
 * Lädt einmal je Sitzung die Buchdaten, die einzelne Kategorien „Fehler mit Buchbezug“ brauchen:
 * die Fallen des Kapitels 4 (W1, analyse/warumfalle.ts) und die Buchvarianten der Kapitel 2 und 3
 * (F8, Eröffnungsindex).
 *
 * Rolle im Gesamtbild: Zeitleiste, Rückblick und das Nachrechnen der gespeicherten Kürzel
 * (useBuchkuerzelNachtrag.ts) warten auf diese Daten, damit alle dieselben Kategorien nennen.
 * Fehlt ein Teil (etwa ohne Netz vor dem ersten Laden), schweigt nur die Kategorie, die ihn
 * braucht; der Fehler wird gemeldet, nicht verschluckt, und beim nächsten Mal neu versucht.
 * Abhängigkeiten: daten/laden.ts, analyse/warumfalle.ts, bausteine/useEroeffnungsindex.ts.
 */
import { baueFallenindex } from "../../../analyse/warumfalle";
import { ladeKapitel } from "../../../daten/laden";
import type { Buchkontextdaten } from "../../../spiel/buchzuege";
import { ladeEroeffnungsindex } from "../bausteine/useEroeffnungsindex";

/** Das Kapitel mit dem Fallenkabinett. */
const FALLENKAPITEL = 4;

let ladung: Promise<Buchkontextdaten> | null = null;

/** Wert eines erfüllten Teils, sonst undefined mit Meldung. */
function teil<T>(ergebnis: PromiseSettledResult<T>, name: string): T | undefined {
  if (ergebnis.status === "fulfilled") return ergebnis.value;
  console.error(`Buchdaten für „Fehler mit Buchbezug“ fehlen (${name}):`, ergebnis.reason);
  return undefined;
}

/** Lädt beide Teile; ein fehlender Teil fehlt nur im Ergebnis. */
async function lade(): Promise<Buchkontextdaten> {
  const [fallen, eroeffnungen] = await Promise.allSettled([
    ladeKapitel(FALLENKAPITEL).then(baueFallenindex),
    ladeEroeffnungsindex(),
  ]);
  const fallenindex = teil(fallen, "Fallen");
  const eroeffnungsindex = teil(eroeffnungen, "Eröffnungen");
  // Ein fehlender Teil wird beim nächsten Aufruf neu geladen.
  if (!fallenindex || !eroeffnungsindex) ladung = null;
  return {
    ...(fallenindex ? { fallenindex } : {}),
    ...(eroeffnungsindex ? { eroeffnungsindex } : {}),
  };
}

/**
 * Die Buchdaten, einmal je Sitzung geladen.
 * Beispiel: erste Fehlerkarte der Zeitleiste → lädt Kapitel 2, 3 und 4; jede weitere Karte
 * bekommt dasselbe Ergebnis sofort.
 */
export function ladeBuchkontext(): Promise<Buchkontextdaten> {
  ladung ??= lade();
  return ladung;
}
