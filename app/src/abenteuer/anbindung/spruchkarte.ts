/**
 * Ein Spruch oder eine Zeitkarte in der laufenden Partie: Wirkung auf die Partie und die Zeilen,
 * die die Kartenleiste als Sprechblasen zeigt (Schritt 13, docs/spiel/10, S1, S4, S6).
 *
 * Rolle im Gesamtbild: Hilfe der Kartenleiste (anbindung/KartenleisteAnzeige.tsx); die Regeln
 * selbst stehen in regeln/zeitkarten.ts. Der Held sagt einen zufälligen Spruch der Karte, der
 * Gegner antwortet mit einer eigenen Zeile, wenn er eine hat. Ein immuner Gegner lässt den
 * Spruch verpuffen; die Karte ist trotzdem gespielt (S4: Vorbereitung lohnt sich).
 * Abhängigkeiten: regeln/zeitkarten.ts, texte/texte.ts, daten/laden.ts, spiel/partie.ts.
 */
import type { Partie } from "../../spiel/partie";
import type { Gegnerdaten } from "../daten/laden";
import {
  immunGegen,
  konterschluessel,
  mitZeitwirkung,
  spruchschluessel,
} from "../regeln/zeitkarten";
import type { Kartensorte } from "../schnittstelle/karten";
import { hatSpieltext, tSpiel } from "../texte/texte";

/** Ergebnis eines Spruchs: die Partie danach und die Zeilen für die Sprechblasen. */
export interface Spruchfolge {
  readonly partie: Partie;
  readonly zeilen: readonly string[];
}

/**
 * Spielt eine Zeitkarte: Wirkung (außer bei Immunität), dazu Spruch und Antwort.
 * Beispiel: „Großes Maul“ gegen Skater Jo → zeitnotBis gesetzt, Zeilen „Na, traust du dich
 * nicht? …“ und „Reden kann jeder. …“; gegen Rosa → Partie unverändert, „Rosa lässt sich nicht
 * beirren. …“.
 */
export function spieleZeitkarte(
  partie: Partie,
  sorte: Kartensorte,
  gegner: Gegnerdaten | undefined,
  jetztMs: number = Date.now(),
  zufall: () => number = Math.random,
): Spruchfolge {
  const spruch = spruchschluessel(sorte.kennung, zufall);
  const eigene = hatSpieltext(spruch) ? [tSpiel(spruch)] : [];
  // „Kühler Kopf“ sagt der Held zu sich selbst: keine Antwort, keine Immunität.
  const anGegner = gegner !== undefined && richtetSichAnGegner(sorte);
  if (anGegner && immunGegen(gegner.immunGegen, sorte.kennung)) {
    return { partie, zeilen: [...eigene, tSpiel("spruch.immun", { gegner: tSpiel(gegner.name) })] };
  }
  const konter = anGegner ? konterschluessel(gegner.kennung, zufall) : null;
  const antwort = konter && hatSpieltext(konter) ? [tSpiel(konter)] : [];
  return {
    partie: mitZeitwirkung(partie, sorte.wirkung, jetztMs),
    zeilen: [...eigene, ...antwort, tSpiel(sorte.spruch)],
  };
}

/** Zielt die Karte auf den Gegner (Grübelfalle, Großes Maul) statt auf den Helden selbst? */
function richtetSichAnGegner(sorte: Kartensorte): boolean {
  const w = sorte.wirkung;
  return w.art === "zeitnot" || (w.art === "zeit" && w.wer === "gegner");
}
