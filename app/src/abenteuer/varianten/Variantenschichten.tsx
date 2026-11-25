/**
 * Schichten über dem Brett der Sonderformen: Nebel über den Feldern, die der Held nicht sieht
 * (Nebelschach), und die Ente auf ihrem Feld (Entenschach), beide im Pixelstil der Welt.
 *
 * Warum: Das Brett der App (ui/brett/Brett.tsx) nimmt eine Überlagerung an; sie liegt mit gleicher
 * Ansicht (viewBox) über dem Brett und lässt Tipps durch. So bleiben Bedienung, Figuren und
 * Brettstil des Ortes, und nur Nebel und Ente kommen dazu (Auftrag des Hauptchats, 26.11.2026).
 * Abhängigkeiten: ui/brett (Maße, Geometrie), chessops (Feldnamen).
 */
import type { Square } from "chessops/types";
import { makeSquare } from "chessops/util";
import { feldEcke } from "../../ui/brett/geometrie";
import { BRETT, FELD } from "../../ui/brett/masse";

/** Pixel je Feldseite in Nebel und Ente (wie die Pixelfiguren, 18 × 18). */
const PIXEL = 18;
const P = FELD / PIXEL;
/** Muster des Nebels: Schwaden in drei Grautönen (Zeilen à 6 Zeichen, 0 bis 2). */
const SCHWADEN = ["011210", "112221", "122211", "012110", "111001", "210012"];
const NEBELFARBEN = ["#8f9aa3", "#a8b2ba", "#c3cbd1"];
const SCHWADENGROESSE = 6;

/** Gemeinsame Hülle: SVG mit der Ansicht des Bretts, durchlässig für Tipps. */
function Schicht({ kinder, name }: { readonly kinder: React.ReactNode; readonly name: string }) {
  return (
    <svg
      className={`variante-schicht variante-${name}`}
      viewBox={`0 0 ${BRETT} ${BRETT}`}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    >
      {kinder}
    </svg>
  );
}

/** Das Muster der Schwaden, einmal je Schicht. */
function Nebelmuster() {
  const groesse = FELD / SCHWADENGROESSE;
  return (
    <defs>
      <pattern
        id="nebel-schwaden"
        width={groesse * SCHWADENGROESSE}
        height={groesse * SCHWADENGROESSE}
        patternUnits="userSpaceOnUse"
      >
        {SCHWADEN.flatMap((zeile, y) =>
          [...zeile].map((wert, x) => (
            <rect
              key={`${x}-${y}`}
              x={x * groesse}
              y={y * groesse}
              width={groesse}
              height={groesse}
              fill={NEBELFARBEN[Number(wert)]}
            />
          )),
        )}
      </pattern>
    </defs>
  );
}

/**
 * Nebel über allen Feldern, die der Held nicht sieht. Eingaben: die unsichtbaren Felder (chessops),
 * Brett gedreht. Beispiel: Grundstellung als Weiß → Reihen 5 bis 8 im Nebel.
 */
export function Nebelschicht({
  unsichtbar,
  gedreht,
}: {
  readonly unsichtbar: readonly Square[];
  readonly gedreht: boolean;
}) {
  return (
    <Schicht
      name="nebel"
      kinder={
        <>
          <Nebelmuster />
          {unsichtbar.map((feld) => {
            const ecke = feldEcke(makeSquare(feld), gedreht);
            return ecke ? (
              <rect
                key={feld}
                data-testid="variante-nebelfeld"
                x={ecke.x}
                y={ecke.y}
                width={FELD}
                height={FELD}
                fill="url(#nebel-schwaden)"
                opacity={0.96}
              />
            ) : null;
          })}
        </>
      }
    />
  );
}

/** Die Ente als Pixelbild, 18 × 18: „1“ Umriss, „2“ Gelb, „3“ Schnabel, „4“ Auge. */
const ENTE = [
  "..................",
  "........1111......",
  ".......122221.....",
  "......12224221....",
  "......12222213311.",
  "......122222133331",
  ".......1222211111.",
  "..11....12221.....",
  ".1221..1222221....",
  ".12221122222221...",
  "..122222222222221.",
  "..122222222222221.",
  "...12222222222221.",
  "....122222222221..",
  ".....1122222211...",
  ".......11111111...",
  "..................",
  "..................",
];
const ENTENFARBEN: Readonly<Record<string, string>> = {
  "1": "#3a2a12",
  "2": "#f2c94c",
  "3": "#e07b25",
  "4": "#1b1b1b",
};

/** Die Ente auf ihrem Feld; ohne Feld (vor dem ersten Setzen) nichts. */
export function Entenschicht({
  feld,
  gedreht,
}: {
  readonly feld: Square | null;
  readonly gedreht: boolean;
}) {
  const ecke = feld === null ? null : feldEcke(makeSquare(feld), gedreht);
  if (!ecke) return null;
  return (
    <Schicht
      name="ente"
      kinder={
        <g data-testid="variante-ente" data-feld={makeSquare(feld as Square)}>
          {ENTE.flatMap((zeile, y) =>
            [...zeile].map((zeichen, x) =>
              ENTENFARBEN[zeichen] ? (
                <rect
                  key={`${x}-${y}`}
                  x={ecke.x + x * P}
                  y={ecke.y + y * P}
                  width={P}
                  height={P}
                  fill={ENTENFARBEN[zeichen]}
                />
              ) : null,
            ),
          )}
        </g>
      }
    />
  );
}
