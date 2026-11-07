/**
 * Finde-Kategorien der Taktik: F1 Matt, F2 Rettung durch Dauerschach oder Patt, F3 Motiv im
 * besseren Zug, F4 guter Schlag ausgelassen, F5 Schach, Schlag oder Drohung zuerst.
 *
 * Rolle im Gesamtbild: Teil der Erkennungsschicht (findekategorien.ts). Jede Prüfung hält die
 * zwei Grundbedingungen des Konzepts (Abschnitt 3.2): Die Idee erklärt den Vorteil selbst
 * (bewiesenes Matt, Materialgewinn in wenigen Halbzügen, genaue Abtauschbilanz, Wiederholung),
 * und der gespielte Zug erfüllt sie nicht ebenso.
 * Abhängigkeiten: schach/mattsuche.ts, schach/mattbilder.ts, schach/taktikmotive.ts,
 * schach/drohungen.ts, schach/dauerschach.ts, analyse/stellungsprofil.ts.
 * Buchbezug: Kapitel 1 (Schach-Röntgen-Regel, Zählen), Kapitel 7 (zwölf Grundmotive,
 * Mattbilder, Motiv 12 „Dauerschach und Patt“).
 */
import { makeSquare } from "chessops/util";
import { materialstand, wiederholtMitSchach } from "../schach/dauerschach";
import { schlaege } from "../schach/drohungen";
import { mattbild } from "../schach/mattbilder";
import { erzwingtMatt } from "../schach/mattsuche";
import { erkenneMotive, type Motiv } from "../schach/taktikmotive";
import {
  materialgewinn,
  type Findelage,
  type Findemotiv,
  type Findetreffer,
  type Halbzug,
} from "./findekategorien-lage";
import { profil } from "./stellungsprofil";

/** Die Ein-Zug-Motive, die F3 mit Namen nennt (Konzept 3.2); alle anderen heißen „Kombination“. */
const EINZUGMOTIVE: readonly Motiv[] = [
  "doppelschach",
  "abzug",
  "gabel",
  "doppelangriff",
  "spiess",
  "fesselung",
  "umwandlung",
];
/** Rettungsmotive gehören zu F2, nicht zu F3. */
const RETTUNGSMOTIVE: ReadonlySet<Motiv> = new Set(["dauerschach", "patt"]);
/** Eigene Züge einer Folge stehen an geraden Stellen (0, 2, 4). */
const ZUGPAAR = 2;

/** Die eigenen Züge einer Folge (der erste und jeder zweite danach). */
function eigeneZuege(folge: readonly Halbzug[]): Halbzug[] {
  return folge.filter((_, i) => i % ZUGPAAR === 0);
}

/** Endet die Folge in einem Matt der Seite am Zug? Dann: Zahl eigener Züge und Mattbild. */
function mattDerFolge(lage: Findelage, folge: readonly Halbzug[]) {
  const ende = folge.at(-1);
  if (!ende?.nachher.isCheckmate() || ende.figur.color !== lage.seite) return null;
  return { mattIn: eigeneZuege(folge).length, mattbild: mattbild(ende.nachher) };
}

/**
 * F1 Matt war möglich: Die Fortsetzung des besten Zuges endet in Matt, oder die Mattsuche beweist
 * Matt in höchstens drei Zügen (nur, wenn die Engine ein Matt meldet; so bleibt die Suche selten).
 *
 * Regel: Kapitel 7, Mattbilder; Kapitel 1, „Schach vor Schlag“.
 * Beispiel: Abb. 7.46 (Opernpartie), 16. Db8+ Sxb8 17. Td8# → Matt in 2.
 * Sonderfall: Meldet die Engine auch nach dem gespielten Zug Matt, gibt es nichts zu finden.
 */
export function f1Matt(lage: Findelage): Findetreffer | null {
  const { eingabe, schwellen, best } = lage;
  if (eingabe.wertNachGespielt >= schwellen.mattAb) return null;
  const details = { zug: best.san, feld: makeSquare(best.zug.to) };
  const ausFolge = mattDerFolge(lage, lage.folgeBest);
  if (ausFolge) {
    const bild = ausFolge.mattbild ? { mattbild: ausFolge.mattbild } : {};
    return { kennung: "F1", details: { ...details, mattIn: ausFolge.mattIn, ...bild } };
  }
  if (eingabe.wertNachBest < schwellen.mattAb) return null;
  const beweis = erzwingtMatt(lage.regeln, best.zug, schwellen.mattsucheZuege);
  if (beweis.art === "keins") return null;
  if (beweis.art === "erzwungen")
    return { kennung: "F1", details: { ...details, mattIn: beweis.zuege } };
  const bild = mattbild(best.nachher);
  return { kennung: "F1", details: { ...details, mattIn: 1, ...(bild ? { mattbild: bild } : {}) } };
}

/** Rettet die Folge durch Dauerschach (eigene Züge nur Schachs, Wiederholung) oder Patt? */
function rettungDerFolge(
  lage: Findelage,
  folge: readonly Halbzug[],
): "dauerschach" | "patt" | null {
  if (folge.some((h) => h.nachher.turn === lage.seite && h.nachher.isStalemate())) return "patt";
  const eigene = eigeneZuege(folge);
  const nurSchachs = eigene.every((h) => h.nachher.isCheck() && !h.nachher.isCheckmate());
  const stellungen = [lage.regeln, ...folge.map((h) => h.nachher)];
  const genug = eigene.length >= lage.schwellen.dauerschachSchachsAb;
  return genug && nurSchachs && wiederholtMitSchach(stellungen, lage.seite) ? "dauerschach" : null;
}

/**
 * F2 Rettung durch Dauerschach oder Patt: Die Seite steht auf Verlust (Material oder Wert nach
 * dem gespielten Zug mindestens drei Bauern zurück), der beste Zug hält etwa den Ausgleich, und
 * seine Fortsetzung wiederholt mit Schach oder endet patt. Die Widerlegung tut das nicht.
 *
 * Regel: Kapitel 7, Motiv 12 („Wer klar verliert, sucht nach einem Remis“).
 * Beispiel: Abb. 7.27, Schwarz mit Turm und Bauer weniger: 1... De1+ 2. Kg2 De2+ 3. Kg1 De1+.
 */
export function f2Rettung(lage: Findelage): Findetreffer | null {
  const { eingabe, schwellen } = lage;
  const aufVerlust =
    materialstand(lage.regeln, lage.seite) <= -schwellen.rettungVerlustAb ||
    eingabe.wertNachGespielt <= -schwellen.rettungVerlustAb;
  if (!aufVerlust || eingabe.wertNachBest < -schwellen.rettungAusgleichBis) return null;
  const motiv = rettungDerFolge(lage, lage.folgeBest);
  if (!motiv || rettungDerFolge(lage, lage.folgeGespielt) !== null) return null;
  return { kennung: "F2", details: { zug: lage.best.san, motiv } };
}

/** Das Motiv für F3: das erste Ein-Zug-Motiv, sonst „Kombination“ bei Folge-Motiven, sonst null. */
function findemotiv(motive: readonly Motiv[]): Findemotiv | null {
  const einzug = motive.find((m) => EINZUGMOTIVE.includes(m));
  if (einzug) return einzug;
  return motive.some((m) => !RETTUNGSMOTIVE.has(m)) ? "kombination" : null;
}

/**
 * F3 Motiv im besseren Zug: Die Fortsetzung gewinnt mindestens zwei Bauern (Material nach der
 * zweiten Antwort des Gegners), und die Motiverkennung findet ein Motiv. Ein-Zug-Motive mit
 * Namen, Folge-Motive nur als „Kombination“ (Konzept 5.4). Die Widerlegung des gespielten Zuges
 * gewinnt nicht ebenso viel.
 *
 * Regel: Kapitel 7, „Die zwölf Grundmotive“; Warnsignale W1, W2, W6.
 * Beispiel: Abb. 7.47, 1. Sc7+ Kd8 2. Sxa8 → Gabel, Gewinn 5.
 */
export function f3Motiv(lage: Findelage): Findetreffer | null {
  const { schwellen } = lage;
  const gewinn = materialgewinn(lage, lage.folgeBest, schwellen.motivMaterialNach);
  if (gewinn < schwellen.motivGewinnAb) return null;
  const gespielt = materialgewinn(lage, lage.folgeGespielt, schwellen.motivMaterialNach);
  if (gespielt >= schwellen.motivGewinnAb) return null;
  const san = lage.folgeBest.slice(0, schwellen.motivHalbzuege).map((h) => h.san);
  const befund = erkenneMotive(lage.regeln, san);
  const motiv = befund ? findemotiv(befund.motive) : null;
  if (!befund || !motiv) return null;
  const bild = befund.mattbild ? { mattbild: befund.mattbild } : {};
  const zahl = Number.isFinite(gewinn) ? { gewinn } : {};
  const feld = makeSquare(lage.best.zug.to);
  return { kennung: "F3", details: { zug: lage.best.san, feld, motiv, ...zahl, ...bild } };
}

/**
 * F4 Guter Schlag ausgelassen: Der beste Zug ist ein Schlag mit Abtauschbilanz ab einem Bauern,
 * der gespielte Zug schlägt nicht auf diesem Feld. Hat der Gegner gerade dort geschlagen, steht
 * „zurückschlagen“ in den Details.
 *
 * Regel: Kapitel 1, „Angreifer und Verteidiger zählen“.
 * Beispiel: nach 1. e4 e5 2. Sf3 Dg5? schlägt 3. Sxg5 die Dame (Bilanz 9).
 */
export function f4Schlag(lage: Findelage): Findetreffer | null {
  const { best, gespielt, voriger } = lage;
  if (!best.geschlagen) return null;
  const schlag = schlaege(lage.regeln).find(
    (s) => s.von === best.zug.from && s.nach === best.zug.to,
  );
  if (!schlag || schlag.bilanz < lage.schwellen.schlagBilanzAb) return null;
  if (gespielt.geschlagen && gespielt.zug.to === best.zug.to) return null;
  const zurueck = voriger !== null && voriger.geschlagen !== null && voriger.zug.to === best.zug.to;
  const details = { zug: best.san, feld: makeSquare(best.zug.to), gewinn: schlag.bilanz };
  return { kennung: "F4", details: zurueck ? { ...details, zurueckschlagen: true } : details };
}

/** Welche Art erzwingender Zug ist ein Zug (Schach, Schlag, Drohung), oder keiner? */
function erzwingendeArt(lage: Findelage, h: Halbzug): "schach" | "schlag" | "drohung" | null {
  if (h.nachher.isCheck()) return "schach";
  if (h.geschlagen) return "schlag";
  const drohende = profil(lage.stellung).erzwingend()?.drohende ?? [];
  return drohende.some((d) => d.von === h.zug.from && d.nach === h.zug.to) ? "drohung" : null;
}

/**
 * F5 Schach, Schlag oder Drohung zuerst: Der beste Zug ist ein erzwingender Zug, seine
 * Fortsetzung gewinnt in vier Halbzügen mindestens einen Bauern, und der gespielte Zug ist kein
 * erzwingender Zug. Nur, wenn F1 bis F4 nicht passen (Priorität in findekategorien.ts).
 *
 * Regel: Kapitel 1, Schach-Röntgen-Regel; Kapitel 7, Schritt 2 „erzwingende Züge“.
 * Beispiel: Weiß Kg1, Dd1 gegen Kg8, Bb7: 1. Dd5+ Kh8 2. Dxb7 gewinnt den Bauern; gespielt h3.
 */
export function f5Roentgen(lage: Findelage): Findetreffer | null {
  const { schwellen } = lage;
  const art = erzwingendeArt(lage, lage.best);
  if (!art || erzwingendeArt(lage, lage.gespielt) !== null) return null;
  const gewinn = materialgewinn(lage, lage.folgeBest, schwellen.roentgenMaterialNach);
  if (gewinn < schwellen.roentgenGewinnAb) return null;
  const zahl = Number.isFinite(gewinn) ? { gewinn } : {};
  const feld = makeSquare(lage.best.zug.to);
  return { kennung: "F5", details: { zug: lage.best.san, feld, art, ...zahl } };
}
