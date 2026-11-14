/**
 * Bedenkzeit und Sprüche des Abenteuers (Schritt 13): die Zeitklassen der Wahl vor der Partie,
 * die Wirkung der Zeitkarten auf die Uhr und die Regeln, wann ein Spruch wirkt.
 *
 * Rolle im Gesamtbild: reine Regeln ohne React; die Kartenleiste (anbindung/KartenleisteAnzeige.tsx)
 * spielt die Karten, die Deckwahl (oberwelt/Deckwahl.tsx) bietet die Zeitklassen an.
 * Grundsatz (docs/spiel/10, S1 bis S4): Die Zeitkarten heißen Sprüche, der Held sagt sie selbst.
 * „Kühler Kopf“ gibt eigene Zeit, „Grübelfalle“ nimmt dem Gegner Zeit, „Großes Maul“ lässt ihn
 * einige Züge spielen wie in Zeitnot (seine Uhr bleibt unberührt). Sprüche gibt es nur gegen
 * Straßengegner, nie im Clubkampf oder Turnier; manche Gegner sind immun.
 * Buchbezug: Kapitel 12, Zeiteinteilung (Zeitnot erzeugt Fehler, ruhig bleiben hilft).
 * Abhängigkeiten: spiel/partie.ts, spiel/uhr.ts, schnittstelle/karten.ts, schnittstelle/gegnerprofil.ts.
 */
import type { Color } from "chessops/types";
import type { Partie } from "../../spiel/partie";
import { restzeit } from "../../spiel/uhr";
import type { Kartensorte, Kartenwirkung } from "../schnittstelle/karten";
import type { Gegnerrolle } from "../schnittstelle/gegnerprofil";

/** Die Zeitklassen der Wahl vor der Partie (docs/spiel/08, Z1); „ohne“ ist die Voreinstellung. */
export const ZEITKLASSEN = {
  ohne: null,
  schnell: { sekunden: 600, zuschlag: 5 },
  blitz: { sekunden: 180, zuschlag: 2 },
} as const;

export type Zeitklasse = keyof typeof ZEITKLASSEN;

/** So wenig Zeit bleibt mindestens nach „Grübelfalle“: Ein Spruch soll keine Partie auf Zeit entscheiden. */
export const MINDESTREST_MS = 5_000;
const MS_JE_SEKUNDE = 1000;

/**
 * Darf in dieser Partie ein Spruch fallen? Nur gegen Straßengegner (S2: „Am Brett eines Clubs
 * schweigt man. Im Park redet man.“).
 * Beispiel: Skater Jo (strasse) → ja; Coach Delgado im Clubkampf (clubchef) → nein.
 */
export function spruecheErlaubt(rolle: Gegnerrolle | null): boolean {
  return rolle === "strasse";
}

/** Ist der Gegner gegen diesen Spruch immun (S4, Steckbrief)? Beispiel: Rosa gegen „Großes Maul“. */
export function immunGegen(immun: readonly string[] | undefined, kennung: string): boolean {
  return immun?.includes(kennung) ?? false;
}

/**
 * Kann die Karte in dieser Partie überhaupt wirken? Zeitkarten brauchen eine Uhr, Sprüche einen
 * Straßengegner. Ergänzt kartenSpielbar (regeln/karten.ts) um die Lage der Partie.
 */
export function passtZurPartie(
  sorte: Kartensorte,
  lage: { readonly uhr: boolean; readonly sprueche: boolean; readonly remis?: boolean },
): boolean {
  if (sorte.spruch_art === true && !lage.sprueche) return false;
  // Kein Remisangebot im Clubkampf und gegen Story-Gegner: es sicherte sonst eine Bronzenadel
  // ohne Sieg (Befund mittel-2, docs/spiel/11, 7.4).
  if (sorte.wirkung.art === "remis" && lage.remis === false) return false;
  return sorte.wirkung.art !== "zeit" || lage.uhr;
}

/**
 * Wendet eine Zeitkarte auf die Partie an: Sekunden auf die Uhr des Lesers oder des Gegners,
 * oder gefühlte Zeitnot für die nächsten eigenen Züge des Gegners (einstellung.abenteuer.zeitnotBis).
 * Andere Wirkungen lassen die Partie unverändert.
 * Beispiel: Grübelfalle (−60 s) bei 2:30 des Gegners → 1:30; bei 0:40 → 0:05 (MINDESTREST_MS).
 * Beispiel: Großes Maul (5 Züge) nach 12 Halbzügen, Leser am Zug → zeitnotBis 22.
 */
export function mitZeitwirkung(partie: Partie, wirkung: Kartenwirkung, jetztMs: number): Partie {
  if (wirkung.art === "zeitnot") {
    const abenteuer = partie.einstellung.abenteuer;
    if (!abenteuer) return partie;
    const bis = partie.zuege.length + 2 * wirkung.zuege;
    return {
      ...partie,
      einstellung: { ...partie.einstellung, abenteuer: { ...abenteuer, zeitnotBis: bis } },
    };
  }
  if (wirkung.art !== "zeit" || !partie.uhr) return partie;
  const eigene = partie.einstellung.eigeneFarbe;
  const farbe: Color = wirkung.wer === "leser" ? eigene : eigene === "white" ? "black" : "white";
  const jetzt = restzeit(partie.uhr, farbe, jetztMs);
  const aenderung = Math.max(wirkung.sekunden * MS_JE_SEKUNDE, MINDESTREST_MS - jetzt);
  const restMs = { ...partie.uhr.restMs, [farbe]: partie.uhr.restMs[farbe] + aenderung };
  return { ...partie, uhr: { ...partie.uhr, restMs } };
}

/** Nimmt dieser Gegner ein Remisangebot überhaupt in Betracht? Straße und Clubmitglieder ja. */
export function remisMoeglich(rolle: Gegnerrolle | null): boolean {
  return rolle === "strasse" || rolle === "clubmitglied";
}
