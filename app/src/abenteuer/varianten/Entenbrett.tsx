/**
 * Brettansicht Entenschach: erst eine Figur ziehen, dann die Ente auf ein leeres Feld setzen; eine
 * Zeile unter dem Brett sagt deutlich, welcher Teil dran ist, und alle erlaubten Entenfelder tragen
 * einen Punkt.
 *
 * Warum: Landschaft L6 (Prärie, Ray Castillo, „der Twister“), Auftrag des Hauptchats vom
 * 26.11.2026: „Bedienung: Zug, dann Ente setzen, deutlich angezeigt.“ Umwandlung zur Dame wie im
 * Nebelschach.
 * Abhängigkeiten: ente.ts, entenbot.ts, freistellung.ts, Variantenschichten.tsx, ui/brett/Brett.
 */
import { useState } from "react";
import type { Square } from "chessops/types";
import { makeSquare, opposite, parseSquare } from "chessops/util";
import { tSpiel } from "../texte/texte";
import { Brett } from "../../ui/brett/Brett";
import {
  entenfelder,
  entenzuege,
  neueEntenpartie,
  setzeEnte,
  zieheFigur,
  type Entenpartie,
} from "./ente";
import { entenbotZug, spieleBotzug } from "./entenbot";
import { alsFen, type Freizug } from "./freistellung";
import { entenpartieAus } from "./regelschichten";
import { Entenschicht } from "./Variantenschichten";
import { ergebnisFuer, useBotzug, type Variantenumgebung } from "./useBotzug";

/** Der Zug von `von` nach `nach` unter den erlaubten (Umwandlung zur Dame). */
function findeZug(p: Entenpartie, von: Square, nach: Square): Freizug | null {
  const passend = entenzuege(p).filter((z) => z.von === von && z.nach === nach);
  return passend.find((z) => !z.umwandlung || z.umwandlung === "queen") ?? null;
}

/** Meldet das Ende an die Hülle, wenn es eins gibt; gibt die Partie zurück. */
function gemeldet(p: Entenpartie, u: Variantenumgebung): Entenpartie {
  if (p.ende) u.beiEnde(ergebnisFuer(p.ende.sieger, u.heldFarbe), p.zuege);
  return p;
}

/** Text der Zeile unter dem Brett. */
function zeile(p: Entenpartie, heldDran: boolean, u: Variantenumgebung): string {
  if (p.ende) return tSpiel(`variante.ende.${ergebnisFuer(p.ende.sieger, u.heldFarbe)}`);
  if (!heldDran) return tSpiel("huelle.gegnerUeberlegt", { gegner: u.gegner });
  return tSpiel(p.phase === "ente" ? "variante.ente.setzen" : "variante.ente.ziehen");
}

/** Die Ansicht; `start` nur für Tests und den Wiedereinstieg. */
export function Entenbrett({
  u,
  start,
}: {
  readonly u: Variantenumgebung;
  readonly start?: Entenpartie;
}) {
  const [partie, setzePartie] = useState(
    () => start ?? (u.startFen ? entenpartieAus(u.startFen) : neueEntenpartie()),
  );
  const [auswahl, setzeAuswahl] = useState<Square | null>(null);
  // In Phase „ente“ ist in der Stellung schon der Gegner am Zug, die Ente setzt aber noch der Held.
  const ziehender =
    partie.phase === "ente" ? opposite(partie.stellung.amZug) : partie.stellung.amZug;
  const heldDran = !partie.ende && ziehender === u.heldFarbe;
  useBotzug(
    !partie.ende && !heldDran,
    String(partie.zuege.length),
    async () => gemeldet(spieleBotzug(partie, await entenbotZug(partie, u.bewerter, u.stil)), u),
    setzePartie,
  );
  const tippe = (name: string) => {
    const feld = parseSquare(name);
    if (!heldDran || feld === undefined) return;
    if (partie.phase === "ente") {
      if (entenfelder(partie).includes(feld)) setzePartie(gemeldet(setzeEnte(partie, feld), u));
      return;
    }
    const zug = auswahl === null ? null : findeZug(partie, auswahl, feld);
    if (zug) {
      setzePartie(gemeldet(zieheFigur(partie, zug), u));
      setzeAuswahl(null);
      return;
    }
    setzeAuswahl(partie.stellung.brett.get(feld)?.color === u.heldFarbe ? feld : null);
  };
  const ziele =
    partie.phase === "ente" && heldDran
      ? entenfelder(partie)
      : entenzuege(partie)
          .filter((z) => z.von === auswahl)
          .map((z) => z.nach);
  const gedreht = u.heldFarbe === "black";
  return (
    <div
      className={`variante-ente variante-phase-${partie.phase}`}
      data-testid="variante-ente-partie"
    >
      <Brett
        fen={alsFen(partie.stellung)}
        markierungen={[]}
        gedreht={gedreht}
        beschriftung={tSpiel("variante.ente.brett")}
        ausgewaehlt={auswahl === null ? null : makeSquare(auswahl)}
        ziele={ziele.map(makeSquare)}
        beiFeld={tippe}
        ueberlagerung={<Entenschicht feld={partie.ente} gedreht={gedreht} />}
      />
      <p className="variante-zeile" aria-live="polite" data-testid="variante-zeile">
        {zeile(partie, heldDran, u)}
      </p>
    </div>
  );
}
