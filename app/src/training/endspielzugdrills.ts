/**
 * Schwerere Kurzübungen des Endspieltrainers (P4, R47): den Zug finden, der ins Quadrat tritt oder
 * die Opposition nimmt, und den Plan zum Erkennungsbild wählen.
 *
 * Rolle im Gesamtbild: Ergänzt training/endspieldrills.ts (Wunsch des Autors: mehr und schwerere
 * Kurzübungen, „Plan zum Erkennungsbild statt nur Bild“). Die Antworten rechnen dieselben
 * Bausteine wie die Werkzeuge aus Kapitel 8 und 9 (schach/quadrat.ts, opposition.ts,
 * erkennungsbilder.ts); die Quadrat-Lösung zeichnet das Werkzeug k8-quadrat wie das Buch
 * (goldener Pfeil der Bauernweg, graue Pfeile die übrigen Seiten, Abb. 8.35). Reine Funktionen.
 * Abhängigkeiten: analyse/k8-quadrat.ts (nur aufgerufen), schach/, training/endspieldrills.ts.
 * Buchbezug: Kapitel 8 (Quadrat, Abb. 8.36: „Der König tritt mit Kf6, Kf5 oder Kf4 ins
 * Quadrat“; Opposition, Abb. 8.23: „nur der Zug, der die Opposition nimmt“), Kapitel 9
 * (Rückblick: die Erkennungsbilder).
 */
import type { Color, Square } from "chessops/types";
import { quadratregel } from "../analyse/k8-quadrat";
import type { Markierung } from "../analyse/werkzeug";
import { erkennungsbild, type Bildname } from "../schach/erkennungsbilder";
import { koenigsabstand } from "../schach/koenigsweg";
import { oppositionszuege } from "../schach/opposition";
import { quadrat } from "../schach/quadrat";
import { feldname, stellungAusFen, type Stellung } from "../schach/stellung";
import { spieleZug } from "../schach/weiterspielen";
import { legal, mische, zufallsbauer, zufallsfeld, type Drill } from "./endspieldrills";
import type { Zufall } from "./zufall";

const VERSUCHE = 400;
const ANTWORTEN = 3;
const ANTWORTEN_BILD = 4;
/** Mindestabstand des weißen Königs zum Bauern: Er soll nicht begleiten (Abb. 8.19). */
const FERN = 4;
const STEINE_KPK = 3;
const HAELFTE = 0.5;

/** Ein Königszug der Seite am Zug mit Zielfeld, Kurznotation und Stellung danach. */
interface Koenigszug {
  readonly ziel: Square;
  readonly san: string;
  readonly danach: Stellung;
}

/** Alle Königszüge der Seite am Zug. */
function koenigszuege(s: Stellung): Koenigszug[] {
  const koenig = s.brett.kingOf(s.amZug);
  if (koenig === undefined || !s.regeln) return [];
  const zuege: Koenigszug[] = [];
  for (const ziel of s.regeln.dests(koenig)) {
    const versuch = spieleZug(s.fen, feldname(koenig), feldname(ziel));
    if (versuch.art !== "gespielt") continue;
    const danach = stellungAusFen(versuch.fen);
    if (danach.ok) zuege.push({ ziel, san: versuch.san, danach: danach.wert });
  }
  return zuege;
}

/** Der goldene Pfeil des richtigen Zuges. */
function zugpfeil(s: Stellung, zug: Koenigszug): Markierung {
  const koenig = s.brett.kingOf(s.amZug) ?? zug.ziel;
  return { typ: "pfeil", farbe: "gold", von: feldname(koenig), nach: feldname(zug.ziel) };
}

/** Eine Frage aus einem richtigen und zwei falschen Zügen, gemischt. */
function zugfrage(
  art: Drill["art"],
  s: Stellung,
  richtig: Koenigszug,
  falsche: readonly Koenigszug[],
  weitere: readonly Markierung[],
  zufall: Zufall,
): Drill {
  const optionen = mische([richtig, ...mische(falsche, zufall).slice(0, ANTWORTEN - 1)], zufall);
  return {
    art,
    fen: s.fen,
    optionen: optionen.map((z) => z.san),
    richtig: richtig.san,
    loesung: [zugpfeil(s, richtig), ...weitere],
  };
}

/**
 * Quadrat als Zug: weißer Bauer, schwarzer König am Zug nahe am Quadrat, weißer König fern.
 * Frage: Mit welchem Zug holt der König den Bauern ein? Richtig ist ein Zug ins Quadrat
 * (nach ihm ist Weiß am Zug, gemessen wird das Quadrat nach dem Bauernzug); falsch sind Züge,
 * nach denen der Bauer durchläuft. Regel: Kapitel 8, Abb. 8.36.
 */
export function quadratzugdrill(zufall: Zufall): Drill | null {
  for (let i = 0; i < VERSUCHE; i++) {
    const bauer = zufallsbauer(zufall);
    const schwarz = zufallsfeld(zufall);
    const weiss = zufallsfeld(zufall);
    if (new Set([bauer, schwarz, weiss]).size < STEINE_KPK || koenigsabstand(weiss, bauer) < FERN)
      continue;
    const s = legal(
      new Map([
        [bauer, "P"],
        [schwarz, "k"],
        [weiss, "K"],
      ]),
      "black",
    );
    if (!s) continue;
    const vorher = quadrat(s, bauer);
    if (vorher.vorbehalte.length > 0 || vorher.ausnahme !== null || vorher.haeltAuf !== true)
      continue;
    const zuege = koenigszuege(s);
    const urteil = (z: Koenigszug) => quadrat(z.danach, bauer);
    const gute = zuege.filter((z) => urteil(z).haeltAuf === true && urteil(z).ausnahme === null);
    const schlechte = zuege.filter((z) => urteil(z).haeltAuf === false);
    if (gute.length === 0 || schlechte.length < ANTWORTEN - 1) continue;
    const richtig = gute[Math.floor(zufall() * gute.length)];
    if (!richtig) continue;
    const quadratMarken = quadratregel(richtig.danach, "black", feldname(bauer)).markierungen;
    return zugfrage("quadratzug", s, richtig, schlechte, quadratMarken, zufall);
  }
  return null;
}

/**
 * Opposition als Zug: zwei Könige und ein weißer Bauer, eine Seite am Zug. Frage: Mit welchem
 * Zug nimmt die Seite die Opposition? Richtig ist ein Zug aus schach/opposition.oppositionszuege,
 * falsch sind Königszüge ohne Opposition. Regel: Kapitel 8, Abb. 8.23 und 8.24.
 */
export function oppositionszugdrill(zufall: Zufall): Drill | null {
  for (let i = 0; i < VERSUCHE; i++) {
    const bauer = zufallsbauer(zufall);
    const weiss = zufallsfeld(zufall);
    const schwarz = zufallsfeld(zufall);
    if (new Set([bauer, schwarz, weiss]).size < STEINE_KPK) continue;
    const amZug: Color = zufall() < HAELFTE ? "white" : "black";
    const s = legal(
      new Map([
        [bauer, "P"],
        [weiss, "K"],
        [schwarz, "k"],
      ]),
      amZug,
    );
    if (!s) continue;
    const mitOpposition = new Set(oppositionszuege(s).map((z) => z.san));
    const zuege = koenigszuege(s);
    const gute = zuege.filter((z) => mitOpposition.has(z.san));
    const schlechte = zuege.filter((z) => !mitOpposition.has(z.san));
    if (gute.length !== 1 || schlechte.length < ANTWORTEN - 1) continue;
    const richtig = gute[0];
    if (!richtig) continue;
    const koenigGegner = s.brett.kingOf(amZug === "white" ? "black" : "white");
    const marken: Markierung[] =
      koenigGegner === undefined
        ? []
        : [{ typ: "feld", farbe: "rot", feld: feldname(koenigGegner) }];
    return zugfrage("oppositionszug", s, richtig, schlechte, marken, zufall);
  }
  return null;
}

/**
 * Plan zum Erkennungsbild: Aus den Buchstellungen die mit erkanntem Bild; gefragt ist der Plan
 * des Bildes (Text „bilder.<bild>.plan“), zur Wahl stehen drei Pläne anderer Bilder.
 * Regel: Kapitel 9, „Rückblick: die Erkennungsbilder“.
 */
export function bildplandrills(fens: readonly string[], zufall: Zufall): Drill[] {
  const erkannt = fens.flatMap((fen) => {
    const s = stellungAusFen(fen);
    const bild = s.ok ? erkennungsbild(s.wert, s.wert.amZug) : null;
    return bild ? [{ fen, bild: bild.bild }] : [];
  });
  const namen = [...new Set(erkannt.map((e) => e.bild))];
  return erkannt.map(({ fen, bild }) => {
    const falsche = mische(
      namen.filter((n): n is Bildname => n !== bild),
      zufall,
    ).slice(0, ANTWORTEN_BILD - 1);
    return {
      art: "bildplan",
      fen,
      optionen: mische([bild, ...falsche], zufall),
      richtig: bild,
      loesung: [],
    };
  });
}

/** Die Quadrat-Lösung wie im Werkzeug und im Buch: Pfeile statt goldener Felder (R47). */
export function quadratmarken(s: Stellung, bauer: Square): readonly Markierung[] {
  return quadratregel(s, s.amZug, feldname(bauer)).markierungen;
}
