/**
 * Musik der Nachbarkarten vorab laden (Auftrag „Leistung“, 16.11.2026): Musik lädt erst, wenn sie
 * spielt (paket/paketlader.ts `liesPaketdatei`); damit beim nächsten Kartenwechsel nicht erst
 * Stille ist, legt das Spiel beim Betreten einer Karte die Musik der Karten hinter ihren
 * Übergängen in den Cache, höchstens `VORAB_HOECHSTENS` Stücke, eins nach dem anderen.
 *
 * Rolle im Gesamtbild: oberwelt/useWeltladen.ts ruft `ladeNachbarmusikVorab` nach dem Betreten;
 * welche Stücke es sind, rechnet `nachbarmusik` aus orte.json. Ohne geladenes Paket (Entwicklung)
 * oder ohne Ton geschieht nichts.
 * Abhängigkeiten: daten/laden.ts, paket/paketlader.ts, ton/tonplan.ts.
 */
import { ladeSpieldaten, type Ortdaten } from "../daten/laden";
import { haltePaketdateiVor } from "../paket/paketlader";
import { dateienFuer } from "./tonplan";

/** So viele Stücke lädt das Spiel je Karte vorab (je etwa 1 MB). */
export const VORAB_HOECHSTENS = 2;
/** So lange wartet das Vorabladen, damit die Musik der betretenen Karte zuerst lädt. */
export const VORAB_WARTEN_MS = 3000;

/** Die Musikdatei einer Angabe zum Vergleichen (m4a), etwa „musik/maple-falls.m4a“. */
function musikschluessel(angabe: string): string {
  return dateienFuer("musik", angabe)[0] ?? angabe;
}

/** Eine Karte mit ihrem Ort (wie daten/laden.ts `findeKarte`, nur mit den Orten). */
function karteIn(orte: readonly Ortdaten[], kennung: string) {
  for (const ort of orte) {
    const karte = ort.karten.find((k) => k.kennung === kennung);
    if (karte) return { ort, karte };
  }
  return null;
}

/**
 * Die Musik der Karten hinter den Übergängen der Karte `kennung`, ohne die eigene und ohne
 * Doppelte, in der Reihenfolge von orte.json. `namen` sind die Objekte der Tiled-Karte: Nur
 * Übergänge, die auf dieser Karte liegen, zählen.
 * Beispiel: Park in Maple Falls, Übergang zur Landstraße → ["musik/weg.m4a"] (Maple Falls selbst
 * spielt schon).
 */
export function nachbarmusik(
  orte: readonly Ortdaten[],
  kennung: string,
  namen: ReadonlySet<string>,
  hoechstens = VORAB_HOECHSTENS,
): string[] {
  const hier = karteIn(orte, kennung);
  if (!hier) return [];
  const gesehen = new Set<string>();
  if (hier.karte.musik) gesehen.add(musikschluessel(hier.karte.musik));
  const musik: string[] = [];
  for (const a of hier.ort.ausloeser) {
    if (a.art !== "uebergang" || !a.ziel || !namen.has(a.name)) continue;
    if (a.karte && a.karte !== kennung) continue;
    const ziel = karteIn(orte, a.ziel.karte)?.karte.musik;
    if (!ziel || gesehen.has(musikschluessel(ziel))) continue;
    gesehen.add(musikschluessel(ziel));
    musik.push(ziel);
    if (musik.length >= hoechstens) break;
  }
  return musik;
}

/** Die Namen aller Objekte einer Tiled-Karte (Auslöser, Figuren, Möbel). */
export function objektnamen(karte: object): Set<string> {
  const ebenen = (karte as { layers?: readonly { objects?: readonly { name?: string }[] }[] })
    .layers;
  return new Set((ebenen ?? []).flatMap((e) => (e.objects ?? []).map((o) => o.name ?? "")));
}

/**
 * Legt die Musik der Nachbarkarten in den Cache (nur mit hörbarem Ton). Fehler bleiben still:
 * Vorab laden ist ein Gefallen, kein Muss; das Stück lädt sonst beim Abspielen.
 */
export async function ladeNachbarmusikVorab(
  kennung: string,
  karte: object,
  hoerbar: boolean,
  warten = VORAB_WARTEN_MS,
): Promise<void> {
  if (!hoerbar) return;
  await new Promise((weiter) => setTimeout(weiter, warten));
  try {
    const { orte } = await ladeSpieldaten();
    for (const angabe of nachbarmusik(orte, kennung, objektnamen(karte))) {
      for (const pfad of dateienFuer("musik", angabe)) {
        if (await haltePaketdateiVor(pfad)) break;
      }
    }
  } catch (fehler: unknown) {
    console.warn("Musik der Nachbarkarten nicht vorab geladen", fehler);
  }
}
