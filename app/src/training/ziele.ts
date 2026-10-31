/**
 * Eigene Ziele (Gamifizierung P13): anheften, lösen und prüfen. Reine Funktionen auf den
 * Nutzerdaten (Feld `ziele`, speicher/gamifizierung.ts).
 *
 * Rolle im Gesamtbild: Der Leser heftet sich bis zu drei Ziele an (Entscheidung E11, ohne
 * Ablaufdatum). Erreicht ist ein Ziel, sobald sein Stand voll ist (zielarten.ts); dann wandert es
 * mit Datum nach `erreicht` (Profil › Erreichte Ziele, 20 Erfahrungspunkte, Abzeichen). Geprüft
 * wird nach jeder Partie (NACH_PARTIEENDE in speicher/partieprotokoll.ts, ohne Verzeichnis der
 * Kapitel) und beim Anzeigen der Wochenkarte (mit Verzeichnis, für die Ringe der Buchteile).
 * Nicht erreichte Ziele werden nirgends gezählt; Lösen geht mit einem Tipp.
 * Abhängigkeiten: zielarten.ts, zieltypen.ts, ringrechnung.ts (istVoll), speicher (Typen).
 */
import type { Partiefolge } from "../speicher/partieprotokoll";
import type { Nutzerdaten } from "../speicher/format";
import type { Anteil } from "../speicher/fortschritt";
import type { Ziel, Zielstand } from "../speicher/gamifizierung";
import { istVoll } from "../ui/komponenten/fortschritt/ringrechnung";
import { zielartVon, ZIELARTEN, type Zielart } from "./zielarten";
import type { Zielkontext } from "./zieltypen";

/** Höchstens so viele Ziele sind zugleich angeheftet (Entscheidung E11). */
export const HOECHSTENS_ZIELE = 3;

/** Erfahrungspunkte je erreichtem Ziel (Vorrecherche P13). */
export const PUNKTE_JE_ZIEL = 20;

/**
 * Ein fester Schlüssel je Ziel, unabhängig von der Reihenfolge der Felder.
 * Beispiel: { art: "bot", bot: "lotte", zeitart: "rapid" } → "art=bot|bot=lotte|zeitart=rapid".
 */
export function zielschluessel(ziel: Ziel): string {
  return Object.entries(ziel)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, w]) => `${k}=${String(w)}`)
    .join("|");
}

/** Gleiche Ziele? */
export function gleichesZiel(a: Ziel, b: Ziel): boolean {
  return zielschluessel(a) === zielschluessel(b);
}

/** Stand eines Ziels; null bei unbekannter Art oder wenn er sich nicht bestimmen lässt. */
export function zielfortschritt(
  ziel: Ziel,
  kontext: Zielkontext,
  arten: readonly Zielart[] = ZIELARTEN,
): Anteil | null {
  return zielartVon(ziel, arten)?.stand(ziel, kontext) ?? null;
}

/** Ist das Ziel erreicht? Unbekannter Stand zählt nicht als erreicht. */
export function zielErreicht(
  ziel: Ziel,
  kontext: Zielkontext,
  arten: readonly Zielart[] = ZIELARTEN,
): boolean {
  const stand = zielfortschritt(ziel, kontext, arten);
  return stand !== null && istVoll(stand);
}

/** Warum ein Ziel sich nicht anheften lässt; null, wenn es geht. */
export type Anheftsperre = "voll" | "schonAngeheftet" | "schonErreicht" | "unbekannt";

/**
 * Prüft, ob sich das Ziel anheften lässt.
 * Regeln (E11): höchstens drei, keine Doppel, kein schon erreichtes Ziel (sonst gäbe Anheften und
 * sofortiges Erreichen Punkte ohne Lernen), nur bekannte Arten.
 * Beispiel: Lotte in Blitz schon besiegt → „schonErreicht“.
 */
export function anheftsperre(
  ziel: Ziel,
  kontext: Zielkontext,
  arten: readonly Zielart[] = ZIELARTEN,
): Anheftsperre | null {
  const { angeheftet } = kontext.daten.ziele;
  if (!zielartVon(ziel, arten)) return "unbekannt";
  if (angeheftet.some((z) => gleichesZiel(z, ziel))) return "schonAngeheftet";
  if (zielErreicht(ziel, kontext, arten)) return "schonErreicht";
  if (angeheftet.length >= HOECHSTENS_ZIELE) return "voll";
  return null;
}

/** Daten mit neuen Zielen. */
function mitZielen(daten: Nutzerdaten, ziele: Zielstand): Nutzerdaten {
  return { ...daten, ziele };
}

/** Heftet das Ziel an, wenn es geht; sonst bleiben die Daten gleich. */
export function mitAngeheftetem(
  daten: Nutzerdaten,
  ziel: Ziel,
  kapitel: Zielkontext["kapitel"],
): Nutzerdaten {
  if (anheftsperre(ziel, { daten, kapitel }) !== null) return daten;
  return mitZielen(daten, { ...daten.ziele, angeheftet: [...daten.ziele.angeheftet, ziel] });
}

/** Löst ein angeheftetes Ziel (ohne Zählung, ohne Spur). */
export function ohneZiel(daten: Nutzerdaten, ziel: Ziel): Nutzerdaten {
  const angeheftet = daten.ziele.angeheftet.filter((z) => !gleichesZiel(z, ziel));
  if (angeheftet.length === daten.ziele.angeheftet.length) return daten;
  return mitZielen(daten, { ...daten.ziele, angeheftet });
}

/**
 * Verschiebt erreichte angeheftete Ziele mit Datum nach `erreicht`.
 *
 * Eingaben: Daten, Verzeichnis der Kapitel (oder null), Zeitpunkt, optional Arten (Tests).
 * Ausgabe: neue Daten und die eben erreichten Ziele (leer: Daten unverändert).
 * Beispiel: angeheftet „Lotte in Schnellschach“, Sieg gegen Lotte mit 10 + 0 → erreicht.
 * Sonderfall: Ring der Buchteile ohne Verzeichnis → unbekannt, bleibt angeheftet.
 */
export function pruefeZiele(
  daten: Nutzerdaten,
  kapitel: Zielkontext["kapitel"],
  jetzt: Date,
  arten: readonly Zielart[] = ZIELARTEN,
): { daten: Nutzerdaten; neu: Ziel[] } {
  const kontext = { daten, kapitel };
  const neu = daten.ziele.angeheftet.filter((z) => zielErreicht(z, kontext, arten));
  if (neu.length === 0) return { daten, neu };
  const datum = jetzt.toISOString();
  return {
    neu,
    daten: mitZielen(daten, {
      angeheftet: daten.ziele.angeheftet.filter((z) => !neu.includes(z)),
      erreicht: [...daten.ziele.erreicht, ...neu.map((ziel) => ({ ziel, datum }))],
    }),
  };
}

/** Gibt es schon ein erreichtes Ziel? (Profilkarte „Erreichte Ziele“ erst dann.) */
export function hatErreichteZiele(daten: Nutzerdaten): boolean {
  return daten.ziele.erreicht.length > 0;
}

/** Wirkung nach dem Partieende (Eintrag in NACH_PARTIEENDE): Bot- und Bot-Ringziele prüfen. */
export const zieleNachPartie: Partiefolge = (daten, _partie, jetzt) =>
  pruefeZiele(daten, null, jetzt).daten;
