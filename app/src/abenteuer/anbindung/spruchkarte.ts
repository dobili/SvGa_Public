/**
 * Ein Spruch oder eine Zeitkarte in der laufenden Partie: Wirkung auf die Partie und die Zeilen,
 * die die Sprechblasen am Brett zeigen (Schritt 13, docs/spiel/10, S1, S4, S6;
 * docs/spiel/29_Tischgespraech.md, Abschnitt 6).
 *
 * Rolle im Gesamtbild: Hilfe der Kartenleiste (anbindung/KartenleisteAnzeige.tsx) und des
 * Tischgesprächs (Schmeichelei vor der Partie); die Regeln selbst stehen in regeln/zeitkarten.ts.
 * Der Held sagt einen Spruch der Karte (unten), der Gegner antwortet oben passend zu seinem
 * Temperament oder mit eigenen Zeilen. Ein immuner Gegner lässt den Spruch verpuffen und sagt das
 * auf seine Art; die Karte ist trotzdem gespielt (S4: Vorbereitung lohnt sich). Die Zeilen kommen
 * mit festem Zufall je Partie und ohne Wiederholung (anbindung/tischtexte.ts).
 * Abhängigkeiten: regeln/zeitkarten.ts, regeln/tischgespraech.ts, anbindung/tischtexte.ts,
 * texte/texte.ts, daten/laden.ts, spiel/partie.ts.
 */
import type { Partie } from "../../spiel/partie";
import type { Gegnerdaten } from "../daten/laden";
import { temperamentVon } from "../regeln/tischgespraech";
import { immunGegen, mitZeitwirkung } from "../regeln/zeitkarten";
import type { Kartensorte } from "../schnittstelle/karten";
import { tSpiel } from "../texte/texte";
import { kurzname, stimmungDerGruppe, zieheAus, type Tischtext } from "./tischtexte";

/** Die Zeilen eines Spruchs: Held unten, Antwort des Gegners oben (oder keine). */
export interface Spruchzeilen {
  readonly held: string | null;
  readonly antwort: Tischtext | null;
  readonly immun: boolean;
}

/** Ergebnis einer Zeitkarte: die Partie danach und die Zeilen für die Sprechblasen. */
export interface Spruchfolge extends Spruchzeilen {
  readonly partie: Partie;
}

/** Eine Zeile aus den Gruppen, mit der Stimmung der letzten Gruppe (der des Temperaments). */
function antwortAus(gruppen: readonly string[], nutzung: number, partie: string): Tischtext | null {
  const schluessel = zieheAus(gruppen, nutzung, partie);
  const allgemein = gruppen.at(-1) ?? "";
  return schluessel ? { text: tSpiel(schluessel), stimmung: stimmungDerGruppe(allgemein) } : null;
}

/**
 * Spruch und Antwort, ohne Wirkung auf die Partie.
 * Eingaben: Kennung der Karte, Gegner (oder keiner), Kennung der Partie, wie viele Sprüche in der
 * Partie schon fielen (für Antworten ohne Wiederholung), ob der Spruch an den Gegner geht.
 * Beispiel: „schmeichelei“ gegen Skater Jo → Held „Du bist bestimmt die Nummer eins …“, Jo
 * antwortet mit einer eigenen oder einer frechen Zeile. Gegen Rosa (immun gegen Großes Maul) →
 * eine ruhige Abwehrzeile, immun true.
 */
export function spruchzeilen(
  kennung: string,
  gegner: Gegnerdaten | undefined,
  partie: string,
  nutzung: number,
  anGegner = true,
): Spruchzeilen {
  const spruch = zieheAus([`spruch.${kennung}`], 0, partie);
  const held = spruch ? tSpiel(spruch) : null;
  if (!gegner || !anGegner) return { held, antwort: null, immun: false };
  const temperament = temperamentVon(gegner);
  if (immunGegen(gegner.immunGegen, kennung)) {
    const abwehr = antwortAus([`spruch.immun.${temperament}`], nutzung, partie);
    const ersatz = {
      text: tSpiel("spruch.immun", { gegner: tSpiel(gegner.name) }),
      stimmung: null,
    };
    return { held, antwort: abwehr ?? ersatz, immun: true };
  }
  const gruppen = [`spruch.konter.${kurzname(gegner.kennung)}`, `spruch.konter.${temperament}`];
  return { held, antwort: antwortAus(gruppen, nutzung, partie), immun: false };
}

/**
 * Spielt eine Zeitkarte: Wirkung (außer bei Immunität), dazu Spruch und Antwort.
 * Beispiel: „Großes Maul“ gegen Skater Jo → zeitnotBis gesetzt, Held „Na, traust du dich
 * nicht? …“, Jo „Reden kann jeder. …“; gegen Rosa → Partie unverändert, Rosa wehrt ab.
 * Sonderfall: „Kühler Kopf“ sagt der Held zu sich selbst: keine Antwort, keine Immunität.
 */
export function spieleZeitkarte(
  partie: Partie,
  sorte: Kartensorte,
  gegner: Gegnerdaten | undefined,
  nutzung = 0,
  jetztMs: number = Date.now(),
): Spruchfolge {
  const zeilen = spruchzeilen(
    sorte.kennung,
    gegner,
    partie.id,
    nutzung,
    richtetSichAnGegner(sorte),
  );
  const danach = zeilen.immun ? partie : mitZeitwirkung(partie, sorte.wirkung, jetztMs);
  return { ...zeilen, partie: danach };
}

/** Zielt die Karte auf den Gegner (Grübelfalle, Großes Maul) statt auf den Helden selbst? */
function richtetSichAnGegner(sorte: Kartensorte): boolean {
  const w = sorte.wirkung;
  return w.art === "zeitnot" || (w.art === "zeit" && w.wer === "gegner");
}
