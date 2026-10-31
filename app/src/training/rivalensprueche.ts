/**
 * Sprüche der Rivalen je Charakter (Gamifizierung P8, Entscheidung E6: je Charakter, nicht je Bot).
 *
 * Rolle im Gesamtbild: Jeder vorgefertigte Bot hat einen der Charaktere aus engine/gegnerbau.ts
 * (CHARAKTERE: Angreifer, Vorsichtiger, Materialist …). Die Rivalenkarte zeigt einen Spruch
 * seines Charakters zum Anlass: Begrüßung (noch keine Partie), nach seinem Sieg, nach einem Remis,
 * nach seiner Niederlage. Die Texte stehen in i18n unter „rivale.spruch.<charakter>.<anlass>“.
 * Kommt ein neuer Charakter dazu, bekommt RIVALENSPRUECHE eine Zeile und de.json/en.json vier
 * Texte; ein Test prüft beides. Ein Charakter ohne Zeile spricht wie „solide“.
 * Abhängigkeiten: engine/gegnerbau.ts (Charaktere), spiel/partienfilter.ts (Ergebnis), i18n.
 */
import { CHARAKTERE, type Charaktername, type Gegner } from "../engine/gegnerbau";
import type { Textschluessel } from "../i18n/sprache";
import type { Ergebnis } from "../spiel/partienfilter";

/** Die vier Anlässe eines Spruchs; ein späterer Anlass bekommt hier eine Zeile und je Charakter einen Text. */
export const SPRUCHANLAESSE = ["begruessung", "botSieg", "remis", "botNiederlage"] as const;
export type Spruchanlass = (typeof SPRUCHANLAESSE)[number];

/** Ein Charakter mit Sprüchen. */
export interface Rivalensprecher {
  readonly charakter: Charaktername;
}

/** Charakter, für den ein Bot ohne eigene Zeile spricht. */
export const ERSATZCHARAKTER: Charaktername = "solide";

/** Je Charakter eine Zeile (Reihenfolge wie CHARAKTERE). */
export const RIVALENSPRUECHE: readonly Rivalensprecher[] = [
  { charakter: "solide" },
  { charakter: "angreifer" },
  { charakter: "vorsichtig" },
  { charakter: "materialist" },
  { charakter: "taktiker" },
  { charakter: "stratege" },
  { charakter: "hektiker" },
  { charakter: "damenfan" },
  { charakter: "koenigswanderer" },
  { charakter: "traeumer" },
  { charakter: "endspieler" },
  { charakter: "theoretiker" },
];

/** Anlass aus dem letzten Ergebnis des Lesers. Beispiel: der Leser hat verloren → „botSieg“. */
export function anlassAus(ergebnis: Ergebnis | null): Spruchanlass {
  if (ergebnis === "verloren") return "botSieg";
  if (ergebnis === "gewonnen") return "botNiederlage";
  return ergebnis === "remis" ? "remis" : "begruessung";
}

/**
 * Der Charakter eines Bots: der Eintrag aus CHARAKTERE, aus dem seine Persönlichkeit gebaut ist
 * (engine/gegnerbau.ts, `bot` übernimmt ihn unverändert). Beispiel: Bot mit Charakter
 * „angreifer“ → "angreifer"; ein eigener Gegner ohne solchen Eintrag → „solide“.
 */
export function charakterVon(g: Gegner): Charaktername {
  const namen = Object.keys(CHARAKTERE) as Charaktername[];
  return namen.find((name) => CHARAKTERE[name] === g.persoenlichkeit) ?? ERSATZCHARAKTER;
}

/**
 * Der Textschlüssel des Spruchs. Beispiel: ("angreifer", "begruessung") →
 * „rivale.spruch.angreifer.begruessung“. Sonderfall: Charakter ohne Zeile → Spruch von „solide“.
 */
export function spruchschluessel(charakter: Charaktername, anlass: Spruchanlass): Textschluessel {
  const bekannt = RIVALENSPRUECHE.some((s) => s.charakter === charakter);
  const sprecher = bekannt ? charakter : ERSATZCHARAKTER;
  return `rivale.spruch.${sprecher}.${anlass}` as Textschluessel;
}
