/**
 * Brettansicht Nebelschach: der Held sieht nur seine Felder und deren Ziele, der Rest liegt im
 * Nebel; am Ende hebt sich der Nebel und zeigt die ganze Stellung.
 *
 * Warum: Landschaft L5 (Bayou, Theron), Auftrag des Hauptchats vom 26.11.2026. Bedienung wie im
 * übrigen Spiel: Figur antippen, Zielfeld antippen (Punkte zeigen die Ziele). Ein Bauer auf der
 * letzten Reihe wird zur Dame (ohne Wahl, wie Blitzpartien auf dem Handy; reicht im Nebel fast
 * immer).
 * Abhängigkeiten: nebel.ts, nebelbot.ts, freistellung.ts, Variantenschichten.tsx, ui/brett/Brett.
 */
import { useState } from "react";
import { Board } from "chessops/board";
import { makeBoardFen } from "chessops/fen";
import type { Square } from "chessops/types";
import { makeSquare, parseSquare } from "chessops/util";
import { tSpiel } from "../texte/texte";
import { Brett } from "../../ui/brett/Brett";
import { alsUci, type Freizug } from "./freistellung";
import { neueNebelpartie, nebelzuege, sicht, spieleNebelzug, type Nebelpartie } from "./nebel";
import { merke, nebelbotZug, neuesGedaechtnis, type Nebelgedaechtnis } from "./nebelbot";
import { Nebelschicht } from "./Variantenschichten";
import { ergebnisFuer, useBotzug, type Variantenumgebung } from "./useBotzug";

const ALLE_FELDER = 64;

/** Brett-FEN aus Sicht des Helden: fremde Figuren nur auf sichtbaren Feldern (oder alles am Ende). */
function sichtFen(p: Nebelpartie, held: Variantenumgebung["heldFarbe"]): string {
  if (p.ende) return `${makeBoardFen(p.stellung.brett)} w - - 0 1`;
  const sichtbar = sicht(p.stellung, held);
  const brett = Board.empty();
  for (const [feld, figur] of p.stellung.brett) {
    if (figur.color === held || sichtbar.has(feld)) brett.set(feld, figur);
  }
  return `${makeBoardFen(brett)} w - - 0 1`;
}

/** Felder im Nebel (leer am Ende). */
function nebelfelder(p: Nebelpartie, held: Variantenumgebung["heldFarbe"]): Square[] {
  if (p.ende) return [];
  const sichtbar = sicht(p.stellung, held);
  return Array.from({ length: ALLE_FELDER }, (_, f) => f).filter((f) => !sichtbar.has(f));
}

/** Der Zug von `von` nach `nach` unter den erlaubten (Umwandlung zur Dame). */
function findeZug(p: Nebelpartie, von: Square, nach: Square): Freizug | null {
  const passend = nebelzuege(p).filter((z) => z.von === von && z.nach === nach);
  return passend.find((z) => !z.umwandlung || z.umwandlung === "queen") ?? null;
}

/** Spielt den Zug und meldet das Ende an die Hülle. */
function weiter(p: Nebelpartie, zug: Freizug, u: Variantenumgebung): Nebelpartie {
  const neu = spieleNebelzug(p, zug, alsUci(zug));
  if (neu.ende) u.beiEnde(ergebnisFuer(neu.ende.sieger, u.heldFarbe), neu.zuege);
  return neu;
}

/** Die Ansicht; `start` nur für Tests und den Wiedereinstieg. */
export function Nebelbrett({
  u,
  start,
}: {
  readonly u: Variantenumgebung;
  readonly start?: Nebelpartie;
}) {
  const [partie, setzePartie] = useState(() => start ?? neueNebelpartie());
  const [gedaechtnis, setzeGedaechtnis] = useState<Nebelgedaechtnis>(() =>
    neuesGedaechtnis(u.heldFarbe === "white" ? "black" : "white"),
  );
  const [auswahl, setzeAuswahl] = useState<Square | null>(null);
  const botFarbe = u.heldFarbe === "white" ? "black" : "white";
  const heldDran = !partie.ende && partie.stellung.amZug === u.heldFarbe;
  useBotzug(
    !partie.ende && !heldDran,
    String(partie.zuege.length),
    async () => weiter(partie, await nebelbotZug(partie, gedaechtnis, u.bewerter, u.stil), u),
    (neu) => {
      setzePartie(neu);
      setzeGedaechtnis(merke(neu, botFarbe, gedaechtnis));
    },
  );
  const ziele = auswahl === null ? [] : nebelzuege(partie).filter((z) => z.von === auswahl);
  const tippe = (name: string) => {
    const feld = parseSquare(name);
    if (!heldDran || feld === undefined) return;
    const zug = auswahl === null ? null : findeZug(partie, auswahl, feld);
    if (zug) {
      const neu = weiter(partie, zug, u);
      setzePartie(neu);
      setzeGedaechtnis(merke(neu, botFarbe, gedaechtnis));
      setzeAuswahl(null);
      return;
    }
    setzeAuswahl(partie.stellung.brett.get(feld)?.color === u.heldFarbe ? feld : null);
  };
  const gedreht = u.heldFarbe === "black";
  return (
    <div className="variante-nebel" data-testid="variante-nebel">
      <Brett
        fen={sichtFen(partie, u.heldFarbe)}
        markierungen={[]}
        gedreht={gedreht}
        beschriftung={tSpiel("variante.nebel.brett")}
        ausgewaehlt={auswahl === null ? null : makeSquare(auswahl)}
        ziele={ziele.map((z) => makeSquare(z.nach))}
        beiFeld={tippe}
        ueberlagerung={
          <Nebelschicht unsichtbar={nebelfelder(partie, u.heldFarbe)} gedreht={gedreht} />
        }
      />
      <p className="variante-zeile" aria-live="polite" data-testid="variante-zeile">
        {partie.ende
          ? tSpiel(`variante.ende.${ergebnisFuer(partie.ende.sieger, u.heldFarbe)}`)
          : heldDran
            ? tSpiel("variante.nebel.duBistDran")
            : tSpiel("huelle.gegnerUeberlegt", { gegner: u.gegner })}
      </p>
    </div>
  );
}
