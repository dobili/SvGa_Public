/**
 * Rückbezüge der Partiebesprechung (Wunsch des Autors, 26.11.2026; Entwurf
 * docs/spiel/auftraege/partiebesprechung_25-11.md, Abschnitt 11, Punkt 5): auf den Lehrer, bei dem
 * der Held das Thema geübt hat („Genau das war Thema bei Sam.“), und auf frühere Partien mit
 * demselben Fehler („Das ist dir schon gegen Skater Jo passiert.“).
 *
 * Rolle im Gesamtbild: reine Rechnung für anbindung/useBesprechung.ts; die Sätze baut
 * anbindung/besprechungstexte.ts. Nur, was sicher ist: Der Lehrer gilt nur, wenn die Runde mit dem
 * Thema wirklich versucht wurde (Dialogvariable `…Versucht`, wie bei den Begriffen), die frühere
 * Partie nur, wenn ihr eigener Fehler (Fehler oder Patzer) dieselbe Ursache hatte. Die früheren
 * Fehler rechnet die Besprechung aus den gespeicherten Werten neu (ohne Engine, ohne neues Feld
 * im Speicher), aus höchstens fünf früheren Partien.
 * Abhängigkeiten: regeln/besprechung.ts, spiel/auswertung.ts (zugurteile), anbindung/
 * besprechungsdaten.ts (Grundlage), anbindung/besprechungsursache.ts, anbindung/huellentexte.ts,
 * texte/texte.ts.
 */
import { zugurteile } from "../../spiel/auswertung";
import type { Partieeintrag } from "../../speicher/partien";
import { zugtext } from "../../ui/komponenten/auswertung/sprung";
import {
  BEGRIFF_JE_THEMA,
  besprechbarePartie,
  versuchtVariable,
  type Begriff,
  type Rundenthemen,
} from "../regeln/besprechung";
import type { Abenteuerstand } from "../schnittstelle/spielstand";
import { hatSpieltext, tSpiel } from "../texte/texte";
import { motivgrundlage } from "./besprechungsdaten";
import { ursacheVon } from "./besprechungsursache";
import { gegnerName } from "./huellentexte";

/** So viele frühere Partien sieht die Besprechung durch. */
const FRUEHERE_HOECHSTENS = 5;
/** Zugklassen eines eigenen Fehlers, die als frühere Ursache zählen. */
const FEHLERKLASSEN: ReadonlySet<string> = new Set(["fehler", "patzer"]);

/** Eine frühere Partie mit derselben Ursache: Gegner und ob es derselbe wie heute ist. */
export interface FruehererFehler {
  readonly gegner: string;
  readonly gleicherGegner: boolean;
}

/** Der Name einer Figur der Geschichte aus ihrer Kennung („mapleFalls.sam“ → „Sam“), oder null. */
function figurname(kennung: string): string | null {
  const name = kennung.split(".").at(-1) ?? "";
  const schluessel = `figur.${name}.name`;
  return hatSpieltext(schluessel) ? tSpiel(schluessel) : null;
}

/**
 * Der Lehrer je Begriff: die erste versuchte Runde, deren Thema den Begriff lehrt, und ihr Steller.
 * Beispiel: mapleFallsReiheSamVersucht, Runde mit Thema „haengend“, Steller mapleFalls.sam →
 * { haengend: "Sam" }. Sonderfall: Runde ohne Steller oder ohne Namen → kein Eintrag.
 */
export function lehrerJeBegriff(
  variablen: Abenteuerstand["dialogvariablen"],
  runden: readonly Rundenthemen[],
): ReadonlyMap<Begriff, string> {
  const lehrer = new Map<Begriff, string>();
  for (const runde of runden) {
    if (!runde.steller || variablen[versuchtVariable(runde.kennung)] !== true) continue;
    const name = figurname(runde.steller);
    if (!name) continue;
    for (const thema of runde.themen) {
      const begriff = BEGRIFF_JE_THEMA[thema];
      if (begriff && !lehrer.has(begriff)) lehrer.set(begriff, name);
    }
  }
  return lehrer;
}

/** Die Ursachen der eigenen Fehler einer ausgewerteten Partie (Gruppen wie in besprechungsursache.ts). */
function ursachenDer(eintrag: Partieeintrag): Set<string> {
  const p = eintrag.partie;
  const urteile = zugurteile(p, eintrag.werte, eintrag.beste, eintrag.abstaende);
  const g = motivgrundlage(
    eintrag,
    urteile.map((u) => u.verlust),
  );
  const gruppen = new Set<string>();
  for (const u of urteile) {
    if (p.zuege[u.index]?.von !== "leser" || !FEHLERKLASSEN.has(u.klasse)) continue;
    const kategorie = u.klasse === "patzer" ? "patzer" : "fehler";
    const ursache = ursacheVon(g, { index: u.index, kategorie }, zugtext(p, u.index));
    if (ursache) gruppen.add(ursache.gruppe);
  }
  return gruppen;
}

/** Ist der Eintrag eine frühere, ausgewertete, besprechbare Partie des Abenteuers? */
function frueher(e: Partieeintrag, jetzt: Partieeintrag): boolean {
  const p = e.partie;
  return (
    p.id !== jetzt.partie.id &&
    p.ende !== null &&
    p.einstellung.abenteuer !== undefined &&
    besprechbarePartie(p.einstellung) &&
    e.werte.length > 0 &&
    p.begonnen < jetzt.partie.begonnen
  );
}

/**
 * Die früheren Fehler je Ursache: aus den letzten fünf früheren Partien, die neueste zuerst.
 * Beispiel: Vor zwei Partien hing gegen Skater Jo ein Läufer → { haengt: { gegner: "Skater Jo",
 * gleicherGegner: false } }, wenn heute gegen Coach Delgado gespielt wird.
 */
export function fruehereFehler(
  partien: readonly Partieeintrag[],
  jetzt: Partieeintrag,
): ReadonlyMap<string, FruehererFehler> {
  const heute = gegnerName(jetzt.partie);
  const fehler = new Map<string, FruehererFehler>();
  const liste = partien.filter((e) => frueher(e, jetzt)).slice(0, FRUEHERE_HOECHSTENS);
  for (const e of liste) {
    const gegner = gegnerName(e.partie);
    for (const gruppe of ursachenDer(e)) {
      if (!fehler.has(gruppe)) fehler.set(gruppe, { gegner, gleicherGegner: gegner === heute });
    }
  }
  return fehler;
}
