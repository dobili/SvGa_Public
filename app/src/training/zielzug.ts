/**
 * Der Zug, der die Eröffnungsziele am meisten voranbringt (Abweichungsmodus, Nebenchat).
 *
 * Rolle im Gesamtbild: Wunsch des Autors (30.10.2026): Im Abweichungsmodus zählt nicht nur der
 * beste Zug der Engine, sondern auch der beste Zug für die drei Eröffnungsziele (Zentrum,
 * Entwicklung, Königssicherheit), so schlecht er sonst sein mag. Der Vergleich beider ist der
 * Lernanlass. Die Ziele rechnet dieselbe Zielbilanz wie das Werkzeug (schach/zielbilanz.ts),
 * dazu feinere Punkte, damit auch Schritte innerhalb von „teils“ zählen.
 * Abhängigkeiten: schach/zielbilanz.ts, analyse/stellungsprofil.ts, schach/drohungen.ts, chessops.
 * Buchbezug: Kapitel 2, „Wenn der Gegner das Buch verlässt“ und „Die Zielbilanz“; Kapitel 1, die
 * drei Ziele der Eröffnung.
 */
import { makeFen } from "chessops/fen";
import { makeSan } from "chessops/san";
import type { Color } from "chessops/types";
import { profil } from "../analyse/stellungsprofil";
import { legaleZuege } from "../schach/drohungen";
import { gegner, stellungAusFen } from "../schach/stellung";
import { zielbilanz, type Wertung, type Zielbilanz } from "../schach/zielbilanz";

/** Punkte je Wertung eines Ziels (ja, teils, nein). */
const WERTUNGSPUNKTE: Readonly<Record<Wertung, number>> = { ja: 2, teils: 1, nein: 0 };
/** Die drei Wertungen wiegen mehr als die feinen Schritte darunter. */
const WERTUNG_GEWICHT = 3;
/** Ein rochierter König zählt so viel wie zwei entwickelte Leichtfiguren. */
const ROCHADE_PUNKTE = 2;
const LEICHTFIGUREN = 4;

/**
 * Zielpunkte einer Seite: die drei Wertungen (gewichtet) plus entwickelte Leichtfiguren, sichere
 * Zentrumsbauern, kontrollierte Zentrumsfelder und Rochade.
 * Beispiel: Grundstellung → 0 + 0 = 0; nach 1. e4 (Weiß) → Zentrum ja (6) + 1 Bauer = 7.
 */
export function zielpunkte(b: Zielbilanz): number {
  const wertungen =
    WERTUNGSPUNKTE[b.zentrum.wertung] +
    WERTUNGSPUNKTE[b.entwicklung.wertung] +
    WERTUNGSPUNKTE[b.koenig.wertung];
  const sichereBauern = b.zentrum.bauern.filter((f) => !b.zentrum.angegriffen.includes(f)).length;
  const fein =
    LEICHTFIGUREN -
    b.entwicklung.offen.length +
    sichereBauern +
    b.zentrum.kontrolliert.length +
    (b.koenig.rochiert ? ROCHADE_PUNKTE : 0);
  return WERTUNG_GEWICHT * wertungen + fein;
}

/** Die Zielbilanz einer Seite in einer Stellung (FEN), oder null. */
export function zielbilanzVon(fen: string, farbe: Color): Zielbilanz | null {
  const gelesen = stellungAusFen(fen);
  if (!gelesen.ok) return null;
  const s = gelesen.wert;
  return zielbilanz(s.brett, profil(s).angriffskarte, farbe, s.amZug);
}

/**
 * Die Züge der Seite am Zug, die die eigenen Zielpunkte am stärksten erhöhen (alle mit gleich
 * vielen Punkten), in Kurznotation; unter ihnen wählt danach die Engine den besten.
 * Beispiel: nach 1. e4 e5 2. Sf3 d6 (Weiß am Zug) etwa d4, Lc4, Lb5, Sc3 (Zentrum, Entwicklung).
 * Sonderfall: Ohne Regeln (Lehrbild) eine leere Liste.
 */
export function zielkandidaten(fen: string): string[] {
  const gelesen = stellungAusFen(fen);
  const regeln = gelesen.ok ? gelesen.wert.regeln : undefined;
  if (!regeln) return [];
  const farbe = regeln.turn;
  let beste = Number.NEGATIVE_INFINITY;
  let zuege: string[] = [];
  for (const zug of legaleZuege(regeln)) {
    const danach = regeln.clone();
    const san = makeSan(regeln, zug);
    danach.play(zug);
    const s = stellungAusFen(makeFen(danach.toSetup()));
    if (!s.ok) continue;
    const punkte = zielpunkte(zielbilanz(s.wert.brett, profil(s.wert).angriffskarte, farbe, gegner(farbe)));
    if (punkte > beste) [beste, zuege] = [punkte, [san]];
    else if (punkte === beste) zuege.push(san);
  }
  return zuege;
}
