/**
 * Kleine Bretter in der Variantenkarte: unter jedem Abzweig die Stellung mit den blauen,
 * nummerierten Fortsetzungspfeilen, rechts neben dem letzten Zug jeder Linie ihre Endstellung;
 * daneben ein schmaler Bewertungsbalken, wenn die Stellung analysiert ist.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (1.11.2026): „in der Karte einer Variation an den
 * Abzweigungen auch die konkrete Abzweigstellung mit den blauen Pfeilen, so kann man sich viel
 * leichter orientieren.“ Jedes Brett ist ein eingebettetes SVG in der Zeichnung der Karte
 * (Kartenflaeche.tsx) und wandert mit Verschieben und Zoomen mit. Damit hunderte Bretter einer
 * ganzen Eröffnung leicht bleiben, sind die dunklen Felder ein einziger Pfad und jede Figur ein
 * Verweis (<use>) auf eines von zwölf Symbolen. Farben und Figurensatz wie in den Einstellungen;
 * die Pfeile sind dieselben wie am großen Brett (Fortsetzungspfeile.tsx). Ein Tipp aufs Brett
 * wählt den Abzweig wie ein Tipp auf seinen Knoten. Endstellungen und Balken: weitere Wünsche des
 * Autors vom 1.11.2026 („für jede Variante die Endstellung als Diagramm“, „Stellungsbewertungsbalken
 * neben dem Diagramm“, damit man beim Scrollen sieht, welche Linie Weiß und welche Schwarz liegt).
 * Abhängigkeiten: ui/brett (Maße, Figur), Fortsetzungspfeile.tsx, kartenmasse.ts, app/einstellungen.
 */
import { memo } from "react";
import { useEinstellungen } from "../../../app/einstellungen";
import { Figur } from "../../brett/Figur";
import { BRETT, BRETTFARBEN, FELD } from "../../brett/masse";
import type { Kartenknoten } from "../../../schach/baumlayout";
import type { Fortsetzungschip } from "./fortsetzungen";
import { Fortsetzungspfeile } from "./Fortsetzungspfeile";
import { balkenanteil, balkentext } from "../../../spiel/rueckblick";
import { BRETTTEILE, brettecke, endbrettecke } from "./kartenmasse";

/** Ein Brett der Karte: Stelle des Knotens, Stellung, Fortsetzungen als Pfeile, Art und Wert. */
export interface Abzweigbrett {
  readonly stelle: number;
  readonly fen: string;
  readonly chips: readonly Fortsetzungschip[];
  /** „abzweig“: unter dem Knoten, mit Pfeilen; „ende“: rechts neben dem letzten Zug. */
  readonly art: "abzweig" | "ende";
  /** Bewertung aus Sicht von Weiß in Bauern; null ohne Analyse (dann kein Balken). */
  readonly wert: number | null;
}

const REIHEN = 8;
/** Auf dem kleinen Brett wären die Pfeile zu dünn: Linie, Punkte und Kreis doppelt so dick. */
const PFEILFAKTOR = 2;
const FIGURENZEICHEN = "KQRBNPkqrbnp";
/** Vorsilbe der Symbol-Kennungen; eine Karte je Seite, deshalb fest. */
const SYMBOLVORSILBE = "kk-figur-";

/** Alle dunklen Felder als ein Pfad (a8 oben links hell). */
const DUNKLE_FELDER = Array.from({ length: REIHEN * REIHEN }, (_, i) => i)
  .filter((i) => (Math.floor(i / REIHEN) + (i % REIHEN)) % 2 === 1)
  .map((i) => `M${(i % REIHEN) * FELD} ${Math.floor(i / REIHEN) * FELD}h${FELD}v${FELD}h-${FELD}z`)
  .join("");

/** Die Figuren einer FEN mit Feld (Spalte, Reihe von oben), Weiß unten. */
function figurenAus(fen: string): { zeichen: string; x: number; y: number }[] {
  const reihen = (fen.split(" ")[0] ?? "").split("/");
  return reihen.flatMap((reihe, r) => {
    let spalte = 0;
    return [...reihe].flatMap((z) => {
      const leer = Number(z);
      if (leer > 0) {
        spalte += leer;
        return [];
      }
      const lage = { zeichen: z, x: spalte * FELD, y: r * FELD };
      spalte += 1;
      return [lage];
    });
  });
}

/** Die zwölf Figuren als Symbole, einmal je Karte. */
export function Figurensymbole() {
  const { figurensatz, brettfarben } = useEinstellungen();
  const farbe = BRETTFARBEN[brettfarben].figur;
  return (
    <defs>
      {[...FIGURENZEICHEN].map((z) => (
        <symbol key={z} id={`${SYMBOLVORSILBE}${z}`} viewBox={`0 0 ${FELD} ${FELD}`}>
          <Figur zeichen={z} x={0} y={0} satz={figurensatz} farbe={farbe} />
        </symbol>
      ))}
    </defs>
  );
}

/** Schmaler Bewertungsbalken rechts neben dem Brett: unten Weiß, oben Schwarz, Wert als Titel. */
function Kartenbalken({ ecke, wert }: { ecke: { x: number; y: number }; wert: number }) {
  const x = ecke.x + BRETTTEILE.brett + BRETTTEILE.luecke;
  const weiss = balkenanteil(wert) * BRETTTEILE.brett;
  return (
    <g className="kk-balken" data-testid="kartenbalken">
      <title>{balkentext(wert)}</title>
      <rect
        x={x}
        y={ecke.y}
        width={BRETTTEILE.balken}
        height={BRETTTEILE.brett}
        className="kk-balken-schwarz"
      />
      <rect
        x={x}
        y={ecke.y + BRETTTEILE.brett - weiss}
        width={BRETTTEILE.balken}
        height={weiss}
        className="kk-balken-weiss"
      />
    </g>
  );
}

/** Ein Brett unter dem Knoten ``k`` (Abzweig) oder rechts daneben (Endstellung). */
export const Kartenbrett = memo(function Kartenbrett({
  brett,
  k,
}: {
  brett: Abzweigbrett;
  k: Kartenknoten;
}) {
  const { brettfarben } = useEinstellungen();
  const farben = BRETTFARBEN[brettfarben];
  const ecke = brett.art === "ende" ? endbrettecke(k) : brettecke(k);
  return (
    <g
      data-knoten={brett.stelle}
      data-testid={brett.art === "ende" ? "kartenendbrett" : "kartenbrett"}
      className="kk-brett"
    >
      {brett.wert !== null && <Kartenbalken ecke={ecke} wert={brett.wert} />}
      <svg
        x={ecke.x}
        y={ecke.y}
        width={BRETTTEILE.brett}
        height={BRETTTEILE.brett}
        viewBox={`0 0 ${BRETT} ${BRETT}`}
      >
        <rect width={BRETT} height={BRETT} fill={farben.hell} />
        <path d={DUNKLE_FELDER} fill={farben.dunkel} />
        {figurenAus(brett.fen).map((f) => (
          <use
            key={`${f.x}-${f.y}`}
            href={`#${SYMBOLVORSILBE}${f.zeichen}`}
            x={f.x}
            y={f.y}
            width={FELD}
            height={FELD}
          />
        ))}
        <Fortsetzungspfeile chips={brett.chips} gedreht={false} faktor={PFEILFAKTOR} />
        <rect className="kk-brettrand" width={BRETT} height={BRETT} />
      </svg>
    </g>
  );
});
