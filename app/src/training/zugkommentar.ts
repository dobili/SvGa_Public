/**
 * Zug erraten: Kommentar zu den gespielten Zügen nach den Motiven und Fehlerarten des Buches.
 *
 * Rolle im Gesamtbild: Wunsch des Autors R45 (23.10.2026): „gespielte Züge nach unseren Motiven
 * und Fehlerarten scannen und kommentieren“. Der Partiezug bekommt die Motive aus Kapitel 7
 * (schach/taktikmotive.ts, gerechnet mit der Fortsetzung der Partie). Der eigene Zug, falls er
 * abweicht: Ist er laut Engine ein Fehler mit Zeichen, nennt der Kommentar die Fehlerart wie der
 * Rückblick nach einer Partie (spiel/erklaerung.ts); ist er gleich gut oder besser, seine Motive
 * mit der Variante der Engine. Rein und ohne Engine testbar; die Werte der Engine kommen als
 * Rateurteil herein.
 * Warum die Schwelle: Die Motiverkennung ist für Lösungen von Taktikaufgaben gebaut und findet in
 * jedem ruhigen Zug etwas („2. Sf3: Abzug“). Deshalb nennt der Kommentar Motive nur, wenn die
 * Folge Material gewinnt oder mattsetzt; ruhige Züge bleiben ohne Kommentar.
 * Abhängigkeiten: schach/taktikmotive.ts, schach/dauerschach.ts, spiel/erklaerung.ts,
 * spiel/auswertung.ts, spiel/zuege.ts, i18n.
 * Buchbezug: Kapitel 7, „Die zwölf Grundmotive“; Kapitel 1, 4 und 7, Fehlerarten
 * (Gesamt-Checkliste).
 */
import type { Chess } from "chessops/chess";
import { makeSanAndPlay, parseSan } from "chessops/san";
import { parseUci } from "chessops/util";
import { wertFuer } from "../engine/spielbewerter";
import { sprache, t } from "../i18n/sprache";
import { materialstand } from "../schach/dauerschach";
import { sanInSprache } from "../schach/notation";
import { erkenneMotive, type Motivbefund } from "../schach/taktikmotive";
import { zeichenFuer } from "../spiel/auswertung";
import { erklaereZug } from "../spiel/erklaerung";
import { fenNach, regelstellung, sanZuUci } from "../spiel/zuege";
import type { Rateurteil } from "./rateurteil";

/** So viele Halbzüge der Fortsetzung zählen für die Motive (Schlüsselzug und Folge). */
const FOLGE_HALBZUEGE = 5;
/** Material zählt nach so vielen Halbzügen, also nach der zweiten Antwort des Gegners. */
const MATERIAL_NACH = 4;
/** Ab diesem Materialgewinn (Bauerneinheiten, etwa die Qualität) ist eine Folge taktisch. */
const GEWINN_AB = 2;
/** Höchstens so viele Motive nennt der Kommentar; mehr wird unübersichtlich. */
const HOECHSTENS_MOTIVE = 2;

/**
 * Gewinnt die Folge Material oder setzt sie matt? Material zählt nach der zweiten Antwort des
 * Gegners (Rückschläge eingerechnet); ist die Folge kürzer, an ihrem Ende. Ausgangspunkt ist der
 * bessere Stand vor und nach dem letzten Zug des Gegners, damit ein bloßes Zurückschlagen
 * („5. Dxf3“ nach 4... Lxf3) nicht als Gewinn zählt.
 */
function istTaktisch(regeln: Chess, folge: readonly string[], davor: Chess | null): boolean {
  const pos = regeln.clone();
  const seite = pos.turn;
  const vorher = Math.max(
    materialstand(pos, seite),
    davor ? materialstand(davor, seite) : Number.NEGATIVE_INFINITY,
  );
  let gewinn = 0;
  for (const [index, san] of folge.slice(0, FOLGE_HALBZUEGE).entries()) {
    const zug = parseSan(pos, san);
    if (!zug) break;
    pos.play(zug);
    if (pos.isCheckmate()) return pos.turn !== seite;
    if (index < MATERIAL_NACH) gewinn = materialstand(pos, seite) - vorher;
  }
  return gewinn >= GEWINN_AB;
}

/** Die Motive in Worten, etwa „Gabel, Doppelangriff, Mattbild Grundreihenmatt“, sonst null. */
function motivtext(befund: Motivbefund | null): string | null {
  if (!befund) return null;
  const namen = befund.motive.slice(0, HOECHSTENS_MOTIVE).map((m) => t(`motiv.name.${m}`));
  if (befund.mattbild)
    namen.push(t("zugkommentar.mattbild", { bild: t(`mattbild.${befund.mattbild}`) }));
  return namen.length > 0 ? namen.join(", ") : null;
}

/** Stellung vor dem Zug und vor dem letzten Zug des Gegners (für den Rückschlag), als FEN. */
export interface Zugumfeld {
  readonly vorherFen: string;
  readonly davorFen: string | null;
}

/** Die Motive eines Zuges mit seiner Fortsetzung (SAN, englisch), nur bei taktischer Folge. */
function motiveDerFolge(umfeld: Zugumfeld, folge: readonly string[]): string | null {
  const regeln = regelstellung(umfeld.vorherFen);
  const davor = umfeld.davorFen ? regelstellung(umfeld.davorFen) : null;
  if (!regeln || folge.length === 0 || !istTaktisch(regeln, folge, davor)) return null;
  return motivtext(erkenneMotive(regeln, folge.slice(0, FOLGE_HALBZUEGE)));
}

/** Eine Variante der Engine (UCI) als SAN, bis zum ersten unmöglichen Zug. */
function folgeAlsSan(vorherFen: string, uciZuege: readonly string[]): string[] {
  const regeln = regelstellung(vorherFen);
  const san: string[] = [];
  for (const uci of uciZuege.slice(0, FOLGE_HALBZUEGE)) {
    const zug = parseUci(uci);
    if (!regeln || !zug || !regeln.isLegal(zug)) break;
    san.push(makeSanAndPlay(regeln, zug));
  }
  return san;
}

/**
 * Kommentar zum Partiezug: die Motive aus Kapitel 7 mit der Fortsetzung der Partie.
 *
 * Eingaben: Stellung vor dem Partiezug und vor dem Zug des Gegners davor, Partiezug und folgende
 * Partiezüge (SAN, englisch).
 * Ausgabe: Satz wie „Im Partiezug Db8+ steckt: Ablenkung, Doppelangriff, Mattbild
 * Grundreihenmatt.“ oder null, wenn die Folge weder Material gewinnt noch mattsetzt.
 * Beispiel: Morphys Opernpartie, 16. Db8+ Sxb8 17. Td8# → Ablenkung, Grundreihenmatt;
 * 2. Sf3 → null.
 */
export function kommentarZumPartiezug(umfeld: Zugumfeld, folge: readonly string[]): string | null {
  const motive = motiveDerFolge(umfeld, folge);
  const zug = folge[0];
  if (!motive || !zug) return null;
  return t("zugkommentar.partie", { zug: sanInSprache(zug, sprache()), motive });
}

/** Die Fehlerart eines schwächeren eigenen Zuges, wie der Rückblick sie nennt, oder null. */
function fehlerkommentar(
  vorherFen: string,
  eigen: string,
  partie: string,
  urteil: Rateurteil,
  vorigerZug: string | null,
): string | null {
  const weissZieht = vorherFen.split(" ")[1] !== "b";
  const zeichen = zeichenFuer(urteil.unterschied, wertFuer(urteil.eigenerWert, weissZieht));
  const eigenUci = sanZuUci(vorherFen, eigen);
  const danach = fenNach(vorherFen, eigen);
  if (!zeichen || !eigenUci || !danach) return null;
  const erklaerung = erklaereZug(
    vorherFen,
    danach,
    eigenUci,
    urteil.eigeneFolge[1] ?? "",
    urteil.unterschied,
    sanZuUci(vorherFen, partie),
    vorigerZug,
  );
  if (!erklaerung) return null;
  const zug = sanInSprache(eigen, sprache());
  return t("zugkommentar.eigenFehler", { zug, text: erklaerung.text });
}

/**
 * Kommentar zum eigenen, abweichenden Zug.
 *
 * Eingaben: Stellungen davor (wie beim Partiezug), eigener Zug und Partiezug (SAN, englisch),
 * Urteil der Engine (mit der Variante nach dem eigenen Zug), der Zug des Gegners davor (SAN, für
 * „schlägt nicht zurück“).
 * Ausgabe: ein Satz. Fehler mit Zeichen (ab „?!“ wie im Rückblick): die Fehlerart, etwa „Dein
 * Zug Sf6 lässt die Drohung Dxe5+ stehen (gewinnt den Bauern).“ Gleich gut oder besser: die
 * Motive seiner Variante. Sonst null. Markierungen gibt es nicht, weil das Brett dann schon die
 * Stellung nach dem Partiezug zeigt.
 * Regel: Kapitel 1, 4 und 7, Fehlerarten der Gesamt-Checkliste (dieselben wie im Rückblick).
 */
export function kommentarZumEigenenZug(
  umfeld: Zugumfeld,
  eigen: string,
  partie: string,
  urteil: Rateurteil,
  vorigerZug: string | null = null,
): string | null {
  if (urteil.art === "schwaecher")
    return fehlerkommentar(umfeld.vorherFen, eigen, partie, urteil, vorigerZug);
  const motive = motiveDerFolge(umfeld, folgeAlsSan(umfeld.vorherFen, urteil.eigeneFolge));
  if (!motive) return null;
  return t("zugkommentar.eigenMotiv", { zug: sanInSprache(eigen, sprache()), motive });
}
