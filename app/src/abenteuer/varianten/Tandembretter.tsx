/**
 * Brettansicht Tandem: Brett A groß (der Held spielt), Brett B klein daneben (Sam gegen seinen
 * Gegner, beide Bots), darunter die Tasche des Helden: Figur antippen, dann ein leeres Feld zum
 * Einsetzen. Hochformat: B über der Tasche unter A; Querformat: B rechts neben A (CSS).
 *
 * Warum: Tandem am Lagerfeuer im Pinewood Camp (Ezra), Auftrag des Hauptchats vom 26.11.2026:
 * „das Partnerbrett klein daneben, geschlagene Figuren gehen an den Partner, Einsetzen“. Regeln
 * und Takt in tandem.ts, Bots in tandembot.ts.
 * Abhängigkeiten: tandem.ts, tandembot.ts, useBotzug.ts, ui/brett/Brett, chessops.
 */
import { useState } from "react";
import { makeBoardFen } from "chessops/fen";
import type { Color, Move, Role, Square } from "chessops/types";
import { makeSquare, opposite, parseSquare } from "chessops/util";
import { tSpiel } from "../texte/texte";
import { Brett } from "../../ui/brett/Brett";
import {
  amZug,
  heldAmZug,
  heldenfarbe,
  neueTandempartie,
  normalisiert,
  spieleTandemzug,
  type Brettname,
  type Tandempartie,
} from "./tandem";
import { tandembotZug } from "./tandembot";
import { useBotzug, type Variantenumgebung } from "./useBotzug";

const ALLE_FELDER = 64;
const TASCHENFOLGE: readonly Role[] = ["queen", "rook", "bishop", "knight", "pawn"];
const FIGURZEICHEN: Record<Role, string> = {
  queen: "q",
  rook: "r",
  bishop: "b",
  knight: "n",
  pawn: "p",
  king: "k",
};

/** Was der Held angetippt hat: eine Figur auf A oder eine Figur aus der Tasche. */
type Auswahl =
  | { readonly art: "feld"; readonly feld: Square }
  | { readonly art: "tasche"; readonly role: Role }
  | null;

/** Brett-FEN ohne Taschen, für das Brett der App. */
const brettFen = (p: Tandempartie, b: Brettname) => `${makeBoardFen(p[b].board)} w - - 0 1`;

/** Ein Zug des Helden zu `nach` nach seiner Auswahl, wenn erlaubt (Umwandlung zur Dame). */
function zugZu(p: Tandempartie, auswahl: Auswahl, nach: Square): Move | null {
  if (!auswahl) return null;
  const kandidaten: Move[] =
    auswahl.art === "tasche"
      ? [{ role: auswahl.role, to: nach }]
      : [
          { from: auswahl.feld, to: nach },
          { from: auswahl.feld, to: nach, promotion: "queen" },
        ];
  return kandidaten.find((z) => p.a.isLegal(normalisiert(p.a, z))) ?? null;
}

/** Ziele der Auswahl auf A (Punkte auf dem Brett). */
function zieleVon(p: Tandempartie, auswahl: Auswahl): string[] {
  if (!auswahl) return [];
  const felder = Array.from({ length: ALLE_FELDER }, (_, f) => f);
  return felder.filter((f) => zugZu(p, auswahl, f) !== null).map(makeSquare);
}

/** Inhalt einer Tasche als Text, etwa „Springer 1, Bauer 2“. */
function taschentext(p: Tandempartie, b: Brettname, farbe: Color): string {
  const tasche = p[b].pockets?.[farbe];
  const teile = TASCHENFOLGE.filter((r) => (tasche?.[r] ?? 0) > 0).map(
    (r) => `${tSpiel(`variante.tandem.figur.${FIGURZEICHEN[r]}`)} ${tasche?.[r] ?? 0}`,
  );
  return teile.length > 0 ? teile.join(", ") : tSpiel("variante.tandem.leer");
}

/** Ergebnis aus Sicht des Helden. */
function tandemergebnis(p: Tandempartie): "sieg" | "remis" | "niederlage" | null {
  if (!p.ende) return null;
  return p.ende.sieger === null ? "remis" : p.ende.sieger === "held" ? "sieg" : "niederlage";
}

/** Die Taschenknöpfe des Helden. */
function Tasche({
  p,
  auswahl,
  waehle,
}: {
  readonly p: Tandempartie;
  readonly auswahl: Auswahl;
  readonly waehle: (role: Role) => void;
}) {
  const tasche = p.a.pockets?.[p.heldFarbe];
  return (
    <div className="variante-tasche" data-testid="variante-tasche">
      {TASCHENFOLGE.filter((r) => (tasche?.[r] ?? 0) > 0).map((r) => (
        <button
          key={r}
          type="button"
          className={auswahl?.art === "tasche" && auswahl.role === r ? "knopf gewaehlt" : "knopf"}
          data-testid={`variante-tasche-${FIGURZEICHEN[r]}`}
          onClick={() => waehle(r)}
        >
          {tSpiel(`variante.tandem.figur.${FIGURZEICHEN[r]}`)} × {tasche?.[r] ?? 0}
        </button>
      ))}
      {TASCHENFOLGE.every((r) => (tasche?.[r] ?? 0) === 0) && (
        <span>{tSpiel("variante.tandem.leer")}</span>
      )}
    </div>
  );
}

/** Die Ansicht; `start` nur für Tests und den Wiedereinstieg. */
export function Tandembretter({
  u,
  start,
}: {
  readonly u: Variantenumgebung;
  readonly start?: Tandempartie;
}) {
  const [partie, setzePartie] = useState(() => start ?? neueTandempartie(u.heldFarbe));
  const [auswahl, setzeAuswahl] = useState<Auswahl>(null);
  const weiter = (neu: Tandempartie) => {
    const ergebnis = tandemergebnis(neu);
    if (ergebnis) u.beiEnde(ergebnis);
    setzePartie(neu);
  };
  const botDran = !partie.ende && !heldAmZug(partie);
  const brett = amZug(partie);
  useBotzug(
    botDran,
    `${partie.zuegeA.length}-${partie.zuegeB.length}`,
    async () =>
      spieleTandemzug(partie, brett, await tandembotZug(partie, brett, u.bewerter, u.stil)),
    weiter,
  );
  const tippe = (name: string) => {
    const feld = parseSquare(name);
    if (!heldAmZug(partie) || feld === undefined) return;
    const zug = zugZu(partie, auswahl, feld);
    if (zug) {
      weiter(spieleTandemzug(partie, "a", zug));
      setzeAuswahl(null);
      return;
    }
    const eigen = partie.a.board.get(feld)?.color === partie.heldFarbe;
    setzeAuswahl(eigen ? { art: "feld", feld } : null);
  };
  const partnerFarbe = heldenfarbe(partie, "b");
  const ergebnis = tandemergebnis(partie);
  return (
    <div className="variante-tandem" data-testid="variante-tandem">
      <div className="variante-tandem-a">
        <p className="variante-tasche-gegner">
          {taschentext(partie, "a", opposite(partie.heldFarbe))}
        </p>
        <Brett
          fen={brettFen(partie, "a")}
          markierungen={[]}
          gedreht={partie.heldFarbe === "black"}
          beschriftung={tSpiel("variante.tandem.brettA")}
          ausgewaehlt={auswahl?.art === "feld" ? makeSquare(auswahl.feld) : null}
          ziele={zieleVon(partie, auswahl)}
          beiFeld={tippe}
        />
        <Tasche
          p={partie}
          auswahl={auswahl}
          waehle={(role) => setzeAuswahl({ art: "tasche", role })}
        />
      </div>
      <div className="variante-tandem-b" data-testid="variante-tandem-b">
        <p>
          {tSpiel("variante.tandem.partner", { tasche: taschentext(partie, "b", partnerFarbe) })}
        </p>
        <Brett
          fen={brettFen(partie, "b")}
          markierungen={[]}
          gedreht={partnerFarbe === "black"}
          beschriftung={tSpiel("variante.tandem.brettB")}
        />
      </div>
      <p className="variante-zeile" aria-live="polite" data-testid="variante-zeile">
        {ergebnis
          ? tSpiel(`variante.ende.${ergebnis}`)
          : heldAmZug(partie)
            ? tSpiel(
                auswahl?.art === "tasche"
                  ? "variante.tandem.einsetzen"
                  : "variante.tandem.duBistDran",
              )
            : tSpiel("variante.tandem.andereZiehen")}
      </p>
    </div>
  );
}
