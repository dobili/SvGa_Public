/**
 * Das Schachbrett als SVG, mit Markierungen wie im Buch.
 *
 * Rolle im Gesamtbild: Zeigt jede Abbildung und jedes Werkzeugergebnis (Konzept 10.2). Ebenen in
 * dieser Reihenfolge: Felder, Feldmarkierungen, Figuren, Pfeile, Beschriftungen.
 * Bedienung: Über dem Bild liegen 64 unsichtbare Knöpfe, einer je Feld. Das ist zuverlässig auf
 * Touchscreens und macht jedes Feld für Bildschirmleser und Tastatur erreichbar.
 * Abhängigkeiten: masse.ts, geometrie.ts, Figur.tsx (Figurensatz), useZugton.ts (Ton), i18n.
 */
import { Fragment, useId } from "react";
import type { Markierung, Markierungsfarbe } from "../../analyse/werkzeug";
import { t } from "../../i18n/sprache";
import { Beschriftungen } from "./Beschriftung";
import { Figur } from "./Figur";
import { useZugton } from "./useZugton";
import { Holzfelder } from "./Holzfelder";
import { alleFelder, feldEcke, figurenAusFen, pfeilform } from "./geometrie";
import { querversaetze } from "./versatz";
import { useEinstellungen } from "../../app/einstellungen";
import {
  BRETT,
  BRETTFARBEN,
  FARBEN,
  FELD,
  holzmuster,
  KOORDINATEN_GROESSE,
  PFEIL,
  RAHMEN,
} from "./masse";

/** Helle und dunkle Feldfarbe aus den Einstellungen, dazu Schimmer und Figurenfarbe. */
interface Feldfarben {
  readonly hell: string;
  readonly dunkel: string;
  readonly schimmer: string;
  readonly figur: string;
}

interface BrettEigenschaften {
  readonly fen: string;
  readonly markierungen: readonly Markierung[];
  readonly gedreht?: boolean;
  /** Angetipptes Feld, dezent hervorgehoben. */
  readonly ausgewaehlt?: string | null;
  /** Wird beim Antippen eines Feldes aufgerufen; ohne diese Angabe ist das Brett nur ein Bild. */
  readonly beiFeld?: (feld: string) => void;
  readonly beschriftung: string;
  /** Koordinaten am Rand zeigen (Einstellung, Standard an). */
  readonly koordinaten?: boolean;
  /** Start- und Zielfeld des letzten Zuges, mit hellem Schimmer (Konzept 10.2). */
  readonly letzterZug?: { von: string; nach: string } | null;
  /** Mögliche Zielfelder der gewählten Figur beim Weiterspielen, als kleine Punkte. */
  readonly ziele?: readonly string[];
  /** Feld einer angetippten Figur, die nicht ziehen darf: leuchtet rot (0.2.58). */
  readonly gesperrt?: string | null;
}

/** Heller Schimmer über einem Feld: angetippt oder letzter Zug, nie Gold, Rot oder Grau. */
function Schimmer({ feld, gedreht, farbe }: { feld: string; gedreht: boolean; farbe: string }) {
  const ecke = feldEcke(feld, gedreht);
  return ecke ? <rect {...ecke} width={FELD} height={FELD} fill={farbe} /> : null;
}

/** Anteil der Feldbreite für den Punkt auf einem möglichen Zielfeld. */
const ZIELPUNKT_RADIUS = 0.14 * FELD;
/** Ring um eine schlagbare Figur (0.2.58: der Punkt war auf dunklen Figuren kaum zu sehen). */
const ZIELRING_RADIUS = 0.42 * FELD;
const ZIELRING_BREITE = 0.07 * FELD;
/** Rot mit Durchsicht für eine angetippte Figur, die nicht ziehen darf (0.2.58). */
const SPERRFARBE = "rgba(220, 68, 68, 0.45)";

/** Ring um eine Figur, die geschlagen werden kann: Gold mit dunklem Rand, auf jeder Figur sichtbar. */
function Zielring({ feld, gedreht }: { feld: string; gedreht: boolean }) {
  const ecke = feldEcke(feld, gedreht);
  if (!ecke) return null;
  const mitte = { cx: ecke.x + FELD / 2, cy: ecke.y + FELD / 2 };
  return (
    <g pointerEvents="none">
      <circle
        {...mitte}
        r={ZIELRING_RADIUS}
        fill="none"
        stroke={FARBEN.navy}
        strokeWidth={ZIELRING_BREITE * 1.6}
        strokeOpacity={0.5}
      />
      <circle
        {...mitte}
        r={ZIELRING_RADIUS}
        fill="none"
        stroke={FARBEN.gold}
        strokeWidth={ZIELRING_BREITE}
      />
    </g>
  );
}

/** Kleiner Punkt in der Feldmitte für ein mögliches Zielfeld. */
function Zielpunkt({ feld, gedreht }: { feld: string; gedreht: boolean }) {
  const ecke = feldEcke(feld, gedreht);
  if (!ecke) return null;
  return (
    <circle
      cx={ecke.x + FELD / 2}
      cy={ecke.y + FELD / 2}
      r={ZIELPUNKT_RADIUS}
      fill={FARBEN.navy}
      fillOpacity={0.35}
    />
  );
}

/** Name einer Figur für Bildschirmleser, etwa „weißer Springer“. */
function figurenname(zeichen: string): string {
  const farbe = zeichen === zeichen.toUpperCase() ? t("farbe.w") : t("farbe.b");
  const rolle = zeichen.toLowerCase() as "p" | "n" | "b" | "r" | "q" | "k";
  return `${t(`figur.${rolle}`)} (${farbe})`;
}

/** Strichmuster je Farbe: Gold durchgezogen, Rot gestrichelt, Grau gepunktet (Buch, Teil 1). */
function strichmuster(farbe: Markierungsfarbe, art: "pfeil" | "rahmen"): string | undefined {
  const masse = art === "pfeil" ? PFEIL : RAHMEN;
  if (farbe === "rot") return masse.strichRot.join(" ");
  if (farbe === "grau") return masse.punktGrau.join(" ");
  return undefined;
}

/** Ein Feldrahmen (Rot, Grau) oder vier Ecken (Gold), jeweils mit dünner Navy-Kontur. */
function Feldmarke({
  feld,
  farbe,
  gedreht,
}: {
  feld: string;
  farbe: Markierungsfarbe;
  gedreht: boolean;
}) {
  const ecke = feldEcke(feld, gedreht);
  if (!ecke) return null;
  const halb = RAHMEN.breite / 2;
  const x0 = ecke.x + halb;
  const y0 = ecke.y + halb;
  const x1 = ecke.x + FELD - halb;
  const y1 = ecke.y + FELD - halb;
  const s = RAHMEN.eckschenkel;
  const pfad =
    farbe === "gold"
      ? `M${x0} ${y0 + s}V${y0}H${x0 + s} M${x1 - s} ${y0}H${x1}V${y0 + s} M${x1} ${y1 - s}V${y1}H${x1 - s} M${x0 + s} ${y1}H${x0}V${y1 - s}`
      : `M${x0} ${y0}H${x1}V${y1}H${x0}Z`;
  const kappe = farbe === "grau" ? "round" : "butt";
  return (
    <g fill="none" strokeLinecap={kappe} strokeLinejoin="miter">
      <path
        d={pfad}
        stroke={FARBEN.navy}
        strokeWidth={RAHMEN.breite + 2 * PFEIL.kontur}
        strokeDasharray={strichmuster(farbe, "rahmen")}
      />
      <path
        d={pfad}
        stroke={FARBEN[farbe]}
        strokeWidth={RAHMEN.breite}
        strokeDasharray={strichmuster(farbe, "rahmen")}
      />
    </g>
  );
}

/** Ein Pfeil im Stil des Buches, mit Kontur. */
function Pfeil({
  von,
  nach,
  farbe,
  gedreht,
  versatz,
}: {
  von: string;
  nach: string;
  farbe: Markierungsfarbe;
  gedreht: boolean;
  versatz: number;
}) {
  const form = pfeilform(von, nach, gedreht, versatz);
  if (!form) return null;
  const spitze = form.spitze.map((p) => `${p.x},${p.y}`).join(" ");
  const kappe = farbe === "rot" ? "butt" : "round";
  const muster = strichmuster(farbe, "pfeil");
  const linie = {
    x1: form.schaftVon.x,
    y1: form.schaftVon.y,
    x2: form.schaftBis.x,
    y2: form.schaftBis.y,
  };
  return (
    <g>
      <line
        {...linie}
        stroke={FARBEN.navy}
        strokeWidth={PFEIL.breite + 2 * PFEIL.kontur}
        strokeLinecap={kappe}
        strokeDasharray={muster}
      />
      <polygon
        points={spitze}
        fill={FARBEN[farbe]}
        stroke={FARBEN.navy}
        strokeWidth={PFEIL.kontur}
      />
      <line
        {...linie}
        stroke={FARBEN[farbe]}
        strokeWidth={PFEIL.breite}
        strokeLinecap={kappe}
        strokeDasharray={muster}
      />
    </g>
  );
}

/** Die 64 Felder, schlicht in den Feldfarben oder mit den Holzbildern (Holzfelder.tsx). */
function Felder({
  gedreht,
  farben,
  holzkennung,
}: {
  gedreht: boolean;
  farben: Feldfarben;
  holzkennung: string | null;
}) {
  return alleFelder(gedreht).map((feld, index) => {
    const ecke = feldEcke(feld, gedreht);
    const hell = (index + Math.floor(index / 8)) % 2 === 0;
    const farbe = hell ? farben.hell : farben.dunkel;
    const fuellung = holzkennung ? `url(#${holzmuster(holzkennung, hell)})` : farbe;
    return (
      ecke && <rect key={feld} x={ecke.x} y={ecke.y} width={FELD} height={FELD} fill={fuellung} />
    );
  });
}

/** Koordinaten am Rand: Zahlen links, Buchstaben unten, in der Farbe des jeweils anderen Feldes. */
function Koordinaten({ gedreht, farben }: { gedreht: boolean; farben: Feldfarben }) {
  const felder = alleFelder(gedreht);
  return (
    <g
      fontFamily="'Source Sans 3', sans-serif"
      fontWeight={600}
      fontSize={KOORDINATEN_GROESSE}
      aria-hidden="true"
    >
      {felder.map((feld, index) => {
        const ecke = feldEcke(feld, gedreht);
        if (!ecke) return null;
        const hell = (index + Math.floor(index / 8)) % 2 === 0;
        const farbe = hell ? farben.dunkel : farben.hell;
        const linksRand = index % 8 === 0;
        const untenRand = index >= 56;
        return (
          <Fragment key={feld}>
            {linksRand && (
              <text x={ecke.x + 60} y={ecke.y + 60 + KOORDINATEN_GROESSE * 0.8} fill={farbe}>
                {feld.charAt(1)}
              </text>
            )}
            {untenRand && (
              <text x={ecke.x + FELD - 60} y={ecke.y + FELD - 60} fill={farbe} textAnchor="end">
                {feld.charAt(0)}
              </text>
            )}
          </Fragment>
        );
      })}
    </g>
  );
}

/**
 * Zeichnet ein Brett mit Stellung und Markierungen.
 *
 * Eingaben: siehe BrettEigenschaften. Beispiel: Abb. 1.26 mit den sechs Pfeilen auf d4.
 * Sonderfälle: Ohne beiFeld gibt es keine Knöpfe; das Brett ist dann nur ein Bild mit Beschriftung.
 */
export function Brett({
  fen,
  markierungen,
  gedreht = false,
  ausgewaehlt = null,
  beiFeld,
  beschriftung,
  koordinaten = true,
  letzterZug = null,
  ziele = [],
  gesperrt = null,
}: BrettEigenschaften) {
  const { brettfarben, figurensatz, ton } = useEinstellungen();
  const farben = BRETTFARBEN[brettfarben];
  // Holzbilder nur auf bedienbaren Brettern; kleine Bretter in Übersichten bleiben schlicht.
  const holz = brettfarben === "holz" && beiFeld !== undefined;
  const kennung = useId().replace(/:/g, "");
  const figuren = figurenAusFen(fen);
  // Töne nur auf bedienbaren Brettern; die kleinen Bretter der Übersichten bleiben still.
  useZugton(
    letzterZug ? `${letzterZug.von}${letzterZug.nach}` : null,
    figuren.size,
    ton === "an" && beiFeld !== undefined,
    fen,
  );
  const felder = alleFelder(gedreht);
  const pfeile = markierungen.filter(
    (m): m is Extract<Markierung, { typ: "pfeil" }> => m.typ === "pfeil",
  );
  const versaetze = querversaetze(pfeile, PFEIL.versatz);
  return (
    <div className="brett">
      <svg viewBox={`0 0 ${BRETT} ${BRETT}`} role="img" aria-label={beschriftung}>
        {holz && <Holzfelder kennung={kennung} />}
        <Felder gedreht={gedreht} farben={farben} holzkennung={holz ? kennung : null} />
        {letzterZug && <Schimmer feld={letzterZug.von} gedreht={gedreht} farbe={farben.schimmer} />}
        {letzterZug && (
          <Schimmer feld={letzterZug.nach} gedreht={gedreht} farbe={farben.schimmer} />
        )}
        {ausgewaehlt && <Schimmer feld={ausgewaehlt} gedreht={gedreht} farbe={farben.schimmer} />}
        {gesperrt && <Schimmer feld={gesperrt} gedreht={gedreht} farbe={SPERRFARBE} />}
        {koordinaten && <Koordinaten gedreht={gedreht} farben={farben} />}
        {markierungen.map((m, i) =>
          m.typ === "feld" ? (
            <Feldmarke key={`f${i}`} feld={m.feld} farbe={m.farbe} gedreht={gedreht} />
          ) : null,
        )}
        {[...figuren].map(([feld, zeichen]) => {
          const ecke = feldEcke(feld, gedreht);
          return (
            ecke && (
              <Figur
                key={feld}
                zeichen={zeichen}
                x={ecke.x}
                y={ecke.y}
                satz={figurensatz}
                farbe={farben.figur}
              />
            )
          );
        })}
        {ziele.map((feld) =>
          figuren.has(feld) ? (
            <Zielring key={`z${feld}`} feld={feld} gedreht={gedreht} />
          ) : (
            <Zielpunkt key={`z${feld}`} feld={feld} gedreht={gedreht} />
          ),
        )}
        {pfeile.map((m, i) => (
          <Pfeil
            key={`p${i}`}
            von={m.von}
            nach={m.nach}
            farbe={m.farbe}
            gedreht={gedreht}
            versatz={versaetze[i] ?? 0}
          />
        ))}
        <Beschriftungen markierungen={markierungen} gedreht={gedreht} />
      </svg>
      {beiFeld && (
        <div className="brett-tasten">
          {felder.map((feld) => {
            const figur = figuren.get(feld);
            const name = figur ? `${feld}, ${figurenname(figur)}` : feld;
            return (
              <button
                key={feld}
                type="button"
                aria-label={name}
                aria-pressed={feld === ausgewaehlt}
                onClick={() => beiFeld(feld)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
