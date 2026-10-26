/**
 * Eine Zeile der Engine-Rechnung bei „Erzwingende Züge“: Nummer, Folge bis zur Ruhe, Bilanz und
 * Urteil in Worten, dazu der Wert der Engine.
 *
 * Rolle im Gesamtbild: Text für ErzwingendKarte.tsx (Vorschlag B1, seit 0.2.33).
 * Abhängigkeiten: chessops, engine/kandidatenruhe.ts, engine/wertInWorten.ts, schach/notation.ts,
 * engine/gegnerplan.ts (Nullzug), i18n.
 * Buchbezug: Kapitel 7, Schritt 3 („Die Bilanz: Zähle am Ende der Variante nach“).
 */
import { Chess } from "chessops/chess";
import { parseFen } from "chessops/fen";
import { makeSanAndPlay } from "chessops/san";
import type { Color, Role } from "chessops/types";
import { parseUci } from "chessops/util";
import type { Kandidat } from "../../../analyse/k7-erzwingend";
import { fenNullzug } from "../../../engine/gegnerplan";
import type { Kandidatenruhe } from "../../../engine/kandidatenruhe";
import { wertAlsZahl } from "../../../engine/wertInWorten";
import { sprache, t, type Textschluessel } from "../../../i18n/sprache";
import { sanInSprache } from "../../../schach/notation";
import type { Stellung } from "../../../schach/stellung";

/** Die Figur im Akkusativ, wie man sie gewinnt oder verliert: „die Dame“, „einen Turm“. */
const FIGUR_AKKUSATIV: Readonly<Record<Role, Textschluessel>> = {
  pawn: "erzwingend.figurAkk.p",
  knight: "erzwingend.figurAkk.n",
  bishop: "erzwingend.figurAkk.b",
  rook: "erzwingend.figurAkk.r",
  queen: "erzwingend.figurAkk.q",
  king: "erzwingend.figurAkk.q",
};

/** Ein Vorzeichen wie im Buch: „+5“, „−2“, „0“. */
function mitVorzeichen(zahl: number): string {
  if (zahl > 0) return `+${zahl}`;
  return zahl < 0 ? `−${Math.abs(zahl)}` : "0";
}

/** Die Folge ohne Zugnummern in der Notation des Buches: „Th8+ Kxh8 Sxf7+ Kg8 Sxd6“. */
function folgentext(fen: string, zuege: readonly string[]): string {
  const setup = parseFen(fen);
  const pos = setup.isOk ? Chess.fromSetup(setup.value) : null;
  if (!pos || pos.isErr) return "";
  const teile: string[] = [];
  for (const uci of zuege) {
    const zug = parseUci(uci);
    if (!zug || !pos.value.isLegal(zug)) break;
    teile.push(sanInSprache(makeSanAndPlay(pos.value, zug), sprache()));
  }
  return teile.join(" ");
}

/**
 * Das Urteil in Worten. Regel: Kapitel 7, Schritt 3, die Bilanz am Ende der Variante; ein Matt
 * geht jeder Bilanz vor. Beispiel: +5 mit der Dame → „gewinnt die Dame“; −2 → „verliert einen
 * Springer“.
 */
export function urteilText(ruhe: Kandidatenruhe): string {
  if (ruhe.matt)
    return t(ruhe.matt === "setzt" ? "erzwingend.urteil.setztMatt" : "erzwingend.urteil.wirdMatt");
  const urteil = materialurteil(ruhe.bilanz, ruhe.figur);
  return ruhe.ende === "offen" ? `${urteil}${t("erzwingend.urteil.offen")}` : urteil;
}

/** „gewinnt die Dame“, „verliert einen Springer“, „Material gleich“. */
function materialurteil(bilanz: number, rolle: Role | null): string {
  if (bilanz === 0) return t("erzwingend.urteil.gleich");
  const figur = rolle ? t(FIGUR_AKKUSATIV[rolle]) : null;
  if (bilanz > 0)
    return figur
      ? t("erzwingend.urteil.gewinnt", { figur })
      : t("erzwingend.urteil.gewinntMaterial");
  return figur
    ? t("erzwingend.urteil.verliert", { figur })
    : t("erzwingend.urteil.verliertMaterial");
}

/**
 * Die Zeile eines gerechneten Kandidaten.
 *
 * Eingaben: Stellung, eigene Seite, Kandidat, Ergebnis der Engine. Ausgabe: Text.
 * Beispiel: Abb. 7.14 → „2. Th8+ Kxh8 Sxf7+ Kg8 Sxd6 – bis zur Ruhe: +5 (gewinnt die Dame);
 * Engine +6,20“; ein Matt: „4. Dxh7+ Kxh7 Th3# – setzt matt“.
 */
export function kandidatenzeile(
  stellung: Stellung,
  eigen: Color,
  kandidat: Kandidat,
  ruhe: Kandidatenruhe,
): string {
  const fen = stellung.amZug === eigen ? stellung.fen : (fenNullzug(stellung.fen) ?? stellung.fen);
  const werte = {
    nummer: kandidat.nummer,
    folge: folgentext(fen, ruhe.zuege),
    urteil: urteilText(ruhe),
  };
  if (ruhe.matt) return t("erzwingend.engine.zeileMatt", werte);
  return t("erzwingend.engine.zeile", {
    ...werte,
    bilanz: mitVorzeichen(ruhe.bilanz),
    wert: wertAlsZahl(ruhe.wert),
  });
}
