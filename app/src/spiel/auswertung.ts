/**
 * Auswertung einer beendeten Partie: Zugzeichen, erste klare Abweichung, Fehler der Engine.
 *
 * Rolle im Gesamtbild: Konzept 8.3 „Auswertung“ und Pflichtenheft 5.3. Die Engine bewertet nach
 * der Partie jede Stellung im Hintergrund (ui/komponenten/useAuswertung.ts); aus den Werten
 * rechnet diese Datei den Verlust jedes Zuges und sein Zeichen. Die absichtlichen Fehler der
 * Engine stehen im Protokoll der Partie (spiel/partie.ts, engine/zugwahl.ts).
 * Seit 0.2.40 bekommt jeder Zug eine Klasse wie bei chess.com (brillant bis patzer).
 * Seit dem Theoriezug (Wunsch des Autors, 25.10.2026) heißt die Klasse "buch" auf dem Bildschirm
 * „Theoriezug“ und umfasst die bekannte Eröffnungstheorie (Regel in schach/theorie.ts), nicht nur
 * die Eröffnungen des Buches. Der interne Schlüssel bleibt "buch" (Texte, Marken, Tests).
 * Abhängigkeiten: spiel/partie.ts, engine/fehlerart.ts.
 */
import { lageVon, type Fehlerart } from "../engine/fehlerart";
import { opferwert } from "../engine/opfer";
import { stellungen, type Partie } from "./partie";
import { regelstellung, sanZuUci } from "./zuege";

/** Zeichen eines Zuges (Konzept 8.3); „!“ seit 0.2.39, „!!“ für ein gutes Opfer seit 0.2.40. */
export type Zugzeichen = "!!" | "!" | "??" | "?" | "?!";

/**
 * Zugklasse wie bei chess.com (Wunsch des Autors, 0.2.40), mit den Grenzen der App: brillant = ein
 * gutes Opfer (bester oder fast bester Zug, gibt Material laut Abtauschrechnung); stark = der
 * einzige gute Zug oder der beste Zug nach einem Fehler des Gegners, solange die Stellung danach
 * nicht klar gewonnen ist; bester = der Zug der Engine (seit 0.2.50
 * nur noch dieser, damit die Zahl zur Zeile „Beste Züge“ passt); sehrGut (bis 0,2 hinter dem
 * besten, auch ein gleichwertiger Zug); gut (bis 0,5); buch = Theoriezug (bekannte
 * Eröffnungstheorie, seit 25.10.2026; vorher nur die Eröffnungen des Buches); ungenau (ab 0,5); fehler (ab 1,2); verpasst = nach einem Fehler des Gegners nicht den
 * Gewinn genommen (ab 0,5, seit 0.2.50 auch vor „patzer“, solange man nicht schlechter steht als
 * vor dem Fehler des Gegners, wie „Verpasst“ bei chess.com); patzer (ab 3).
 */
export type Zugklasse =
  | "brillant"
  | "stark"
  | "bester"
  | "sehrGut"
  | "gut"
  | "buch"
  | "ungenau"
  | "fehler"
  | "verpasst"
  | "patzer";

/** Zeichen je Klasse; Klassen ohne Zeichen stehen nur in der Karte und in der Auswertung. */
export const ZEICHEN_JE_KLASSE: Readonly<Record<Zugklasse, Zugzeichen | null>> = {
  brillant: "!!",
  stark: "!",
  bester: null,
  sehrGut: null,
  gut: null,
  buch: null,
  ungenau: "?!",
  fehler: "?",
  verpasst: "?",
  patzer: "??",
};

/** Grenzen aus Konzept 8.3: Verlust ab 3 „??“, ab 1,2 „?“, ab 0,5 „?!“ (Bauerneinheiten). */
const GRENZE_PATZER = 3;
export const GRENZE_FEHLER = 1.2;
const GRENZE_UNGENAU = 0.5;
/** Pflichtenheft 5.3: Grobe Patzer (mehr als zwei Bauern) werden hervorgehoben. */
export const GROBER_PATZER = 2;
/** Bis zu diesem Verlust hinter dem besten Zug ist ein Zug „sehr gut“. */
const SEHR_GUT_UNTER = 0.2;
/**
 * Brillant nur, wenn man nach dem Opfer nicht schlecht steht (ab −1) und der zweitbeste Zug nicht
 * ohnehin klar gewinnt (unter +7; sonst ist das Opfer nur Zierde). Beides wie bei chess.com
 * (Nachbau „freechess“) und geprüft an den 100 Brillant-Zügen des Chessigma-Vergleichs (0.2.54):
 * ohne die Bedingungen 73 erkannt bei 230 Fehlalarmen in 100 Partien, mit ihnen 79 bei etwa
 * einem Fehlalarm je Partie.
 */
const BRILLANT_NICHT_SCHLECHTER_ALS = -1;
const BRILLANT_ZWEITBESTER_UNTER = 7;
/**
 * Ein Opfer laut Abtauschrechnung: Der Gegner gewinnt eine Figur ab Leichtfigur und bekommt dafür
 * höchstens zwei Bauern (Nettowert mindestens 1; bis 0.2.52 mindestens 2, womit ein Springer für
 * zwei Bauern wie 10. Sxb5 in der Opernpartie kein Opfer war). Geprüft an den 100 Brillant-Zügen
 * des Chessigma-Vergleichs (chess.com-Partien, 17.10.2026, 0.2.54): 100 von 100 erkannt, 7,5 % aller
 * Züge sind Opferkandidaten.
 */
export const OPFER_AB = 1;
/**
 * Steht die ziehende Seite nach dem Zug noch mindestens so gut, bekommt der Zug höchstens „?!“
 * (Empfehlung K5, umgesetzt in 0.2.47): Wer von „Matt in 2“ zu „+5“ wechselt, gewinnt weiter.
 * Lichess und chess.com rechnen dafür in eine Gewinnchance um, die ab +5 kaum noch steigt.
 */
const KLAR_GEWONNEN = 5;
/**
 * Werte jenseits dieser Grenze (Matt, klarer Gewinn) zählen wie die Grenze: Wer von „Matt in 3“
 * zu „+8“ wechselt, gewinnt weiter und soll kein „??“ bekommen.
 */
export const WERTGRENZE = 10;
/** Wert einer Mattstellung aus Sicht von Weiß (Matt durch Weiß positiv). */
const MATT = WERTGRENZE;

export interface Zugurteil {
  /** Index des Halbzuges in der Partie. */
  readonly index: number;
  /** Verlust gegenüber der Stellung davor, aus Sicht der ziehenden Seite (nie negativ). */
  readonly verlust: number;
  readonly zeichen: Zugzeichen | null;
  readonly klasse: Zugklasse;
}

/** Was die Einordnung eines Zuges braucht, außer dem Verlust. */
export interface Zugumstaende {
  readonly warBester: boolean;
  readonly einziger: boolean;
  readonly opfer: boolean;
  /** Verlust des gegnerischen Zuges davor (0 beim ersten Zug). */
  readonly vorherVerlust: number;
  /** Wert vor dem Zug aus eigener Sicht. */
  readonly wertVorher: number;
  /** Abstand des besten zum zweitbesten Zug (0, wenn unbekannt). */
  readonly abstand: number;
  /** Stand die ziehende Seite vor dem Zug im Schach? */
  readonly imSchach: boolean;
  /** Theoriezug, solange alle Züge davor Theoriezüge waren (Bedingungen 1 und 2, theorie.ts). */
  readonly buch: boolean;
  /** Theoriezug in einem Gambit (schach/theorienamen.ts, gambitJeZug): darf mehr kosten. */
  readonly gambit?: boolean;
}

export interface Enginefehler {
  readonly index: number;
  /** Zugnummer im Buchformat („12.“ oder „12...“). */
  readonly nummer: string;
  readonly fehler: Fehlerart;
}

function begrenzt(wert: number): number {
  return Math.max(-WERTGRENZE, Math.min(WERTGRENZE, wert));
}

/**
 * Zeichen zu einem Verlust; unter 0,5 keins. Mit dem Wert nach dem Zug (eigene Sicht): ab +5
 * höchstens „?!“, und das erst ab 3 (K5, wie in klasseVon).
 */
export function zeichenFuer(verlust: number, wertNachher = 0): Zugzeichen | null {
  if (wertNachher >= KLAR_GEWONNEN) return verlust >= GRENZE_PATZER ? "?!" : null;
  if (verlust >= GRENZE_PATZER) return "??";
  if (verlust >= GRENZE_FEHLER) return "?";
  return verlust >= GRENZE_UNGENAU ? "?!" : null;
}

/**
 * Wert einer Endstellung ohne Engine: Matt ±Grenze, Patt und Remis 0; sonst null.
 *
 * Warum: In einer Mattstellung gibt die Engine keinen Zug und keinen Wert her.
 */
export function endwert(fen: string): number | null {
  const pos = regelstellung(fen);
  if (!pos || !pos.isEnd()) return null;
  if (pos.isCheckmate()) return pos.turn === "white" ? -MATT : MATT;
  return 0;
}

/**
 * Verpasst: Der Gegner hat gerade einen Fehler gemacht, und dieser Zug nutzt ihn nicht (Verlust ab
 * 0,5), gibt aber höchstens zurück, was der Gegner geschenkt hat. Man steht also nicht schlechter
 * als vor dem Fehler des Gegners; deshalb zählt das auch bei großem Verlust als „verpasst“ und
 * nicht als „patzer“ (so auch chess.com: 4. e3 nach 3... Sf4?? mit hängendem Springer ist
 * „verpasst“, kein Patzer; 0.2.50).
 */
function verpasst(verlust: number, u: Zugumstaende): boolean {
  return (
    u.vorherVerlust >= GRENZE_FEHLER && verlust >= GRENZE_UNGENAU && verlust <= u.vorherVerlust
  );
}

/**
 * Ist ein Opfer brillant? Bester oder fast bester Zug (bis 0,5 dahinter; chess.com: „fast der
 * beste“), danach nicht schlecht, nicht aus dem Schach heraus (eine Figur, die man im Schach
 * stehen lässt, ist kein Opfer), und der zweitbeste Zug gewinnt nicht ohnehin klar.
 * Beispiel: 16. Db8+ in der Opernpartie: Opfer, bester Zug, danach Matt → brillant.
 */
function brillant(verlust: number, u: Zugumstaende): boolean {
  const fastBester = u.warBester || verlust < GRENZE_UNGENAU;
  const nachher = u.wertVorher - verlust;
  return (
    u.opfer &&
    fastBester &&
    nachher >= BRILLANT_NICHT_SCHLECHTER_ALS &&
    !u.imSchach &&
    u.wertVorher - u.abstand < BRILLANT_ZWEITBESTER_UNTER
  );
}

/**
 * Die Klasse eines Zuges aus Verlust und Umständen (Reihenfolge: grobe Fehler zuerst).
 *
 * Beispiel: 2... Sf6?? nach 2. Dh5 verliert 3 → patzer; 3. Lc4 als bester Zug nach dem Patzer →
 * stark; 2. Th8+ in Abb. 7.14 (bester Zug, gibt den Turm, Stellung vorher nicht gewonnen) → brillant.
 * Sonderfall: Nach dem Zug noch mindestens +5 → höchstens „ungenau“ (Matt in 2 zu +5), und das
 * erst ab 3 Verlust; darunter „gut“ (seit 0.2.51: In der Stufe-3-Partie des Autors bekam Weiß 15
 * „?!“ in gewonnener Stellung, chess.com zwei, weil die Gewinnchance dort kaum sinkt).
 * Sonderfall: Ein Zug, der ohne Verlust nicht der Zug der Engine ist, ist „sehr gut“ (gleichwertig),
 * nicht „bester“. Brillant darf seit 0.2.51 auch ein Opfer sein, das hinter dem besten Zug liegt
 * (seit 0.2.54 bis 0,5), und auch in gewonnener Stellung (chess.com gibt 16. Db8+!! in der
 * Opernpartie, Abb. 11.4, ebenso), siehe `brillant`; „stark“ gibt es nur, solange die Stellung nach dem Zug nicht entschieden ist (ab ±5; sonst
 * bekäme in einem Mattangriff jeder Zug ein „!“, Opernpartie neun statt eins bei chess.com, und
 * die verlierende Seite für jeden einzigen Zug, der nicht sofort verliert: acht „!“ statt null).
 */
export function klasseVon(verlust: number, u: Zugumstaende): Zugklasse {
  const wertNachher = u.wertVorher - verlust;
  const nochKlarGewonnen = wertNachher >= KLAR_GEWONNEN;
  if (nochKlarGewonnen && verlust >= GRENZE_PATZER) return "ungenau";
  if (nochKlarGewonnen && verlust >= GRENZE_UNGENAU) return "gut";
  if (verpasst(verlust, u)) return "verpasst";
  // Ein Gambit gibt Material für Entwicklung oder Angriff (Kapitel 3, Königsgambit): Als
  // Theoriezug darf es bis unter einen Fehler kosten (Befund N947, 26.10.2026; 2. f4 verliert in
  // Tiefe 18 etwa 0,7). Bongcloud 2. Ke2 ist kein Gambit und bleibt ein Fehler.
  if (u.buch && u.gambit === true && verlust < GRENZE_FEHLER) return "buch";
  if (verlust >= GRENZE_PATZER) return "patzer";
  if (verlust >= GRENZE_FEHLER) return "fehler";
  if (verlust >= GRENZE_UNGENAU) return "ungenau";
  if (u.buch) return "buch";
  if (brillant(verlust, u)) return "brillant";
  const bestraft = u.vorherVerlust >= GRENZE_FEHLER;
  const entschieden = Math.abs(wertNachher) >= KLAR_GEWONNEN;
  if (u.warBester && (u.einziger || bestraft) && !entschieden) return "stark";
  if (u.warBester) return "bester";
  return verlust < SEHR_GUT_UNTER ? "sehrGut" : "gut";
}

/**
 * Die Umstände eines Zuges: bester, einziger (bester mit mindestens 1,2 Abstand zum zweitbesten,
 * wie in der Engine-Karte), Opfer (Abtauschrechnung), Theorie (schon mit der Kette geprüft).
 */
function umstaende(
  fen: string,
  san: string,
  bester: string | undefined,
  abstand: number | undefined,
  vorherVerlust: number,
  wertVorher: number,
  theorie: boolean,
  gambit: boolean,
): Zugumstaende {
  const uci = sanZuUci(fen, san);
  const warBester = bester !== undefined && bester !== "" && uci === bester;
  const lage = uci ? lageVon(fen) : null;
  return {
    warBester,
    einziger: warBester && abstand !== undefined && abstand >= GRENZE_FEHLER,
    opfer: lage !== null && uci !== null && opferwert(lage, uci) >= OPFER_AB,
    vorherVerlust,
    wertVorher,
    abstand: abstand ?? 0,
    imSchach: lage?.regeln.isCheck() ?? false,
    buch: theorie,
    gambit,
  };
}

/**
 * Urteil über jeden Halbzug.
 *
 * Eingaben: Partie, Werte je Stellung aus Sicht von Weiß (Startstellung bis Ende, also ein Wert
 * mehr als Züge); dazu seit 0.2.39 die besten Züge und die Abstände zum zweitbesten je Stellung
 * (dürfen fehlen; dann gibt es kein „!“). Ausgabe: je Halbzug Verlust und Zeichen; leer, wenn
 * Werte fehlen.
 * Beispiel: 1. e4 (+0,3) e5 (+0,3) 2. Dh5 (−0,2): 2. Dh5 verliert 0,5 → „?!“. Nach 2. Dh5 ist
 * 2... Sc6 bester Zug mit Abstand 2,5 zum zweitbesten → „!“.
 * Theorie (seit 25.10.2026): je Halbzug, ob die Stellung danach Theorie ist (schach/theorie.ts,
 * theorieJeZug). Theoriezug ist ein Zug nur, solange alle Züge davor Theoriezüge waren: Der erste
 * Zug, der keiner ist (nicht in der Theorie oder ab 0,5 Verlust, etwa 2. Ke2 der „Bongcloud“),
 * beendet die Theorie für den Rest der Partie (chess.com: „out of book“). Ohne Angabe gibt es
 * keine Theoriezüge (so rechnen Spielstärke und Wertung, spiel/wertung.ts). `gambits`: je Halbzug,
 * ob die Partie danach in einem Gambit ist (schach/theorienamen.ts, gambitJeZug).
 */
export function zugurteile(
  partie: Partie,
  werte: readonly number[],
  beste: readonly string[] = [],
  abstaende: readonly number[] = [],
  theorie: readonly boolean[] = [],
  gambits: readonly boolean[] = [],
): Zugurteil[] {
  if (werte.length !== partie.zuege.length + 1) return [];
  const alle = stellungen(partie);
  let vorherVerlust = 0;
  let nochTheorie = true;
  return partie.zuege.map((zug, index) => {
    const fen = alle[index] ?? "";
    const weiss = fen.split(" ")[1] !== "b";
    const vorher = begrenzt(werte[index] ?? 0);
    const nachher = begrenzt(werte[index + 1] ?? 0);
    const verlust = Math.max(0, weiss ? vorher - nachher : nachher - vorher);
    const wertVorher = weiss ? vorher : -vorher;
    const u = umstaende(
      fen,
      zug.san,
      beste[index],
      abstaende[index],
      vorherVerlust,
      wertVorher,
      nochTheorie && theorie[index] === true,
      gambits[index] === true,
    );
    vorherVerlust = verlust;
    const klasse = klasseVon(verlust, u);
    nochTheorie = klasse === "buch";
    return { index, verlust, zeichen: ZEICHEN_JE_KLASSE[klasse], klasse };
  });
}

/** Ein Sprung des Wertes ab dieser Größe, der sofort zurückspringt, ist verdächtig (0.2.51). */
const AUSREISSER_AB = 3;

/**
 * Stellungen, deren Wert verdächtig ist: Er springt gegenüber der Stellung davor um mindestens 3
 * und springt bei der nächsten Stellung in die Gegenrichtung ebenso weit zurück. Das sieht aus wie
 * ein Patzer, den der Gegner sofort zurückgibt, ist bei kurzer Rechenzeit aber meist ein Fehler
 * der Engine (Opernpartie, 15. Lxd7+ „??“ mit 7,4 bei 500 ms unter Last).
 *
 * Eingabe: Werte je Stellung aus Sicht von Weiß. Ausgabe: Indizes, die die Auswertung mit mehr
 * Rechenzeit nachprüft (ui/komponenten/useAuswertung.ts). Beispiel: [10, 10, 2.6, 10] → [2].
 */
export function ausreisser(werte: readonly number[]): number[] {
  const verdaechtig: number[] = [];
  for (let i = 1; i + 1 < werte.length; i += 1) {
    const hin = begrenzt(werte[i] ?? 0) - begrenzt(werte[i - 1] ?? 0);
    const zurueck = begrenzt(werte[i + 1] ?? 0) - begrenzt(werte[i] ?? 0);
    if (Math.abs(hin) >= AUSREISSER_AB && Math.abs(zurueck) >= AUSREISSER_AB && hin * zurueck < 0) {
      verdaechtig.push(i);
    }
  }
  return verdaechtig;
}

/**
 * Der erste Zug des Lesers mit „?“ oder „??“ (Konzept 8.3: „Sprung zur ersten klaren
 * Abweichung“); null, wenn es keinen gibt.
 */
export function ersteAbweichung(partie: Partie, urteile: readonly Zugurteil[]): Zugurteil | null {
  return (
    urteile.find(
      (u) => partie.zuege[u.index]?.von === "leser" && (u.zeichen === "?" || u.zeichen === "??"),
    ) ?? null
  );
}

/** Zugnummer eines Halbzuges im Buchformat. */
export function zugnummer(partie: Partie, index: number): string {
  const fen = stellungen(partie)[index] ?? "";
  const [, seite = "w", , , , nummer = "1"] = fen.split(" ");
  return seite === "w" ? `${nummer}.` : `${nummer}...`;
}

/**
 * Die absichtlichen Fehler der Engine aus dem Protokoll (Pflichtenheft 5.2: „In Zug 12 hat die
 * Engine eine Figur hängen lassen (W1). Hast du es gesehen?“).
 */
export function enginefehler(partie: Partie): Enginefehler[] {
  return partie.zuege.flatMap((zug, index) =>
    zug.von === "engine" && zug.fehler
      ? [{ index, nummer: zugnummer(partie, index), fehler: zug.fehler }]
      : [],
  );
}
