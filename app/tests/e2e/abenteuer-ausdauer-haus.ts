/**
 * Innenräume für die Ausdauerprüfung (abenteuer-ausdauer.spec.ts): Der Held geht in Maple Falls
 * immer wieder durch das Haus, Haustür, Treppe ins Zimmer, Treppe auf den Dachboden und zurück.
 *
 * Warum: Reisen wechselt nur zwischen Außenkarten. Türen und Treppen laden kleine Innenkarten mit
 * Übergangsbild und eigener Musik; dort war noch nicht gemessen (Auftrag vom 19.11.2026).
 * Wie: mit den Bausteinen des Spieler-Durchlaufs (tests/durchlauf): Kartenwissen aus den Daten,
 * Weg zum Ausgang suchen, mit Tasten hingehen und in den Durchgang drücken. Messung und Gedächtnis
 * des Durchlaufs braucht es hier nicht; an ihrer Stelle stehen stille Platzhalter.
 */
import type { CDPSession, Page } from "@playwright/test";
import type { Lauf } from "../durchlauf/eingabe";
import { liesStand } from "../durchlauf/lage";
import { geheAn, geheDurch } from "../durchlauf/laufen";
import { kartenwissen, ladeSpieldaten, type Spieldaten } from "../durchlauf/welt";

/** Funde mit Bild im Paket (inhalte/abenteuer/funde.json), für die Fensterbank. */
const FUNDE = [
  "formular1857",
  "muenzenFlussweg",
  "pfeilspitze",
  "fahrkarte1958",
  "holzspringer",
  "pavillonspringer",
  "zeitungsausschnitt",
  "taubenfeder",
  "holzlaeufer",
  "zahnrad",
  "nietenkopf",
  "umschlag",
  "holzturm",
  "glasfunke",
  "schluessel",
  "anstecker",
  "ohrstoepsel",
  "zeroTablet",
  "flaschenpost",
  "muschelMitLoch",
  "erstesBrettMusikhaus",
  "eidechsenhaut",
  "nietenCanyonbruecke",
  "halesBrief",
  "postreiterabzeichen",
  "schlussstellungFernpartie",
  "leuchtturmlinse",
  "teilnehmerausweis",
  "neonK",
  "murmeltierpfeife",
];

/** Die Kette durch das Haus: je Karte der Ausgang, der weiterführt (hin und zurück). */
const HAUSKETTE: readonly { readonly karte: string; readonly ausgang: string }[] = [
  { karte: "mapleFalls.aussen", ausgang: "haustuer" },
  { karte: "mapleFalls.wohnzimmer", ausgang: "treppeOben" },
  { karte: "mapleFalls.zimmer", ausgang: "treppeDachboden" },
  { karte: "mapleFalls.dachboden", ausgang: "treppe" },
  { karte: "mapleFalls.zimmer", ausgang: "treppeUnten" },
  { karte: "mapleFalls.wohnzimmer", ausgang: "haustuer" },
];

/** Ein Objekt, das jede Frage still beantwortet (Zahlen 0, Aufrufe ohne Wirkung). */
function stillerPlatzhalter(): unknown {
  const zahlen = new Proxy({}, { get: () => 0, set: () => true });
  return new Proxy({}, { get: (_ziel, name) => (name === "jetzt" ? zahlen : () => undefined) });
}

/** Ein Lauf für die Bausteine des Durchlaufs, mit Tasten und ohne Messung. */
export function hauslauf(seite: Page, cdp: CDPSession): Lauf {
  return {
    seite,
    cdp,
    messung: stillerPlatzhalter() as Lauf["messung"],
    tasten: true,
    frist: Number.MAX_SAFE_INTEGER,
    gehalten: null,
    schwach: stillerPlatzhalter() as Lauf["schwach"],
  };
}

let daten: Spieldaten | null = null;

/** Wo in der Hauskette der Held gerade ist (wird weitergezählt). */
export interface Hausweg {
  glied: number;
}

/**
 * Ein Schritt durch das Haus: der nächste Ausgang der Kette auf der Karte, auf der der Held steht
 * (ab der gemerkten Stelle vorwärts gesucht). Ausgabe: ob die Karte wechselte; steht er nicht im
 * Haus, geschieht nichts. Beispiel: im Wohnzimmer nach der Haustür → Treppe hinauf ins Zimmer.
 */
export async function hausschritt(lauf: Lauf, weg: Hausweg): Promise<boolean> {
  daten ??= ladeSpieldaten();
  const stand = await liesStand(lauf.seite);
  const karte = stand.position.karte;
  for (let n = 0; n < HAUSKETTE.length; n++) {
    const i = (weg.glied + n) % HAUSKETTE.length;
    const glied = HAUSKETTE[i];
    if (glied?.karte !== karte) continue;
    weg.glied = i + 1;
    const ergebnis = await geheDurch(lauf, kartenwissen(daten, karte, stand), glied.ausgang);
    return ergebnis === "karte" || ergebnis === "fenster";
  }
  return false;
}

/** Die Karte, auf der der Held laut Spielstand steht. */
export async function karteDesHelden(seite: Page): Promise<string> {
  return (await liesStand(seite)).position.karte;
}

/**
 * Im Zimmer: an die Fensterbank gehen und sie ansehen (Dialog, danach die Ansicht mit den Bildern
 * aller Funde, Atmosphäre T15). Ausgabe: ob der Aktionsknopf gedrückt wurde.
 */
export async function siehFensterbankAn(lauf: Lauf): Promise<boolean> {
  daten ??= ladeSpieldaten();
  const stand = await liesStand(lauf.seite);
  if (stand.position.karte !== "mapleFalls.zimmer") return false;
  const wissen = kartenwissen(daten, stand.position.karte, stand);
  const felder = wissen.ausloeser.filter((a) => a.name === "fensterbank");
  if ((await geheAn(lauf, wissen, felder)) !== "aktion") return false;
  await lauf.seite.getByTestId("abenteuer-aktion").click();
  return true;
}

/** Funde mit Bild für den Spielstand: die ersten `anzahl` aus funde.json. */
export function fundeMitBild(anzahl: number): { kennung: string; gefunden: string }[] {
  daten ??= ladeSpieldaten();
  return FUNDE.slice(0, anzahl).map((kennung) => ({
    kennung,
    gefunden: "2026-11-19T10:00:00.000Z",
  }));
}
