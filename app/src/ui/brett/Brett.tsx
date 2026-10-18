/**
 * Das Schachbrett als SVG, mit Markierungen wie im Buch.
 *
 * Rolle im Gesamtbild: Zeigt jede Abbildung und jedes Werkzeugergebnis (Konzept 10.2). Ebenen in
 * dieser Reihenfolge: Felder, Feldmarkierungen, Figuren, Pfeile, Beschriftungen.
 * Bedienung: Über dem Bild liegen 64 unsichtbare Knöpfe, einer je Feld. Das ist zuverlässig auf
 * Touchscreens und macht jedes Feld für Bildschirmleser und Tastatur erreichbar. Seit 0.2.92
 * lassen sich Figuren auf derselben Schicht auch per Wischen ziehen (useZiehen.ts).
 * Abhängigkeiten: masse.ts, geometrie.ts, Brettmarken.tsx, Figur.tsx (Figurensatz),
 * useZugton.ts (Ton), useZiehen.ts, i18n.
 */
import { Fragment, useId, useState } from "react";
import type { Markierung } from "../../analyse/werkzeug";
import { t } from "../../i18n/sprache";
import { Beschriftungen } from "./Beschriftung";
import { Figur } from "./Figur";
import { useZugton } from "./useZugton";
import { Brettbild, Holzfelder } from "./Holzfelder";
import { alleFelder, feldEcke, figurenAusFen } from "./geometrie";
import { Feldmarke, Pfeil, Schimmer, SPERRFARBE, Zielpunkt, Zielring } from "./Brettmarken";
import { useZiehen, wischenAn, type Ziehbedienung, type Ziehstand } from "./useZiehen";
import { querversaetze } from "./versatz";
import { useEinstellungen, type Figurensatz } from "../../app/einstellungen";
import { BRETT, BRETTFARBEN, FELD, holzmuster, KOORDINATEN_GROESSE, PFEIL } from "./masse";

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
  /** Ziehen per Wischen (seit 0.2.92); ohne diese Angabe nur Antippen. */
  readonly ziehen?: Ziehbedienung | null;
}

/** Name einer Figur für Bildschirmleser, etwa „weißer Springer“. */
function figurenname(zeichen: string): string {
  const farbe = zeichen === zeichen.toUpperCase() ? t("farbe.w") : t("farbe.b");
  const rolle = zeichen.toLowerCase() as "p" | "n" | "b" | "r" | "q" | "k";
  return `${t(`figur.${rolle}`)} (${farbe})`;
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

/** Anteil der Feldbreite, um den eine gezogene Figur unter dem Finger größer erscheint. */
const GEZOGEN_GROESSER = 1.15;
/** Durchsicht der Figur auf ihrem Startfeld, solange sie gezogen wird. */
const GEZOGEN_SCHATTEN = 0.35;

/**
 * Die Figuren der Stellung; eine gerade gezogene Figur blass auf ihrem Feld und groß unter dem
 * Zeiger (seit 0.2.92). Die große Figur kommt in Brett zuletzt, über Pfeile und Beschriftung.
 */
function Figuren({
  figuren,
  gedreht,
  satz,
  farbe,
  gezogen,
}: {
  figuren: ReadonlyMap<string, string>;
  gedreht: boolean;
  satz: Figurensatz;
  farbe: string;
  gezogen: Ziehstand | null;
}) {
  return [...figuren].map(([feld, zeichen]) => {
    const ecke = feldEcke(feld, gedreht);
    if (!ecke) return null;
    const figur = <Figur zeichen={zeichen} x={ecke.x} y={ecke.y} satz={satz} farbe={farbe} />;
    return gezogen?.von === feld ? (
      <g key={feld} opacity={GEZOGEN_SCHATTEN}>
        {figur}
      </g>
    ) : (
      <Fragment key={feld}>{figur}</Fragment>
    );
  });
}

/** Die gezogene Figur unter dem Zeiger, etwas größer, damit der Finger sie nicht ganz verdeckt. */
function GezogeneFigur({
  zeichen,
  gezogen,
  satz,
  farbe,
}: {
  zeichen: string;
  gezogen: Ziehstand;
  satz: Figurensatz;
  farbe: string;
}) {
  const { x, y } = gezogen.punkt;
  const halb = FELD / 2;
  return (
    <g
      pointerEvents="none"
      transform={`translate(${x} ${y}) scale(${GEZOGEN_GROESSER}) translate(${-halb} ${-halb})`}
    >
      <Figur zeichen={zeichen} x={0} y={0} satz={satz} farbe={farbe} />
    </g>
  );
}

/**
 * Die 64 unsichtbaren Knöpfe über dem Bild. Felder mit ziehbaren Figuren bekommen beim Wischen
 * touch-action „none“, damit der Finger dort die Figur nimmt statt die Seite zu scrollen; alle
 * anderen Felder lassen das Scrollen frei.
 */
function Knopfschicht({
  felder,
  figuren,
  ausgewaehlt,
  beiFeld,
  greifbar,
  wischen,
}: {
  felder: readonly string[];
  figuren: ReadonlyMap<string, string>;
  ausgewaehlt: string | null;
  beiFeld: (feld: string) => void;
  greifbar: readonly string[];
  wischen: Omit<ReturnType<typeof useZiehen>, "gezogen">;
}) {
  const { ereignisse, klickGilt } = wischen;
  return (
    <div className="brett-tasten" {...ereignisse}>
      {felder.map((feld) => {
        const figur = figuren.get(feld);
        const name = figur ? `${feld}, ${figurenname(figur)}` : feld;
        return (
          <button
            key={feld}
            type="button"
            aria-label={name}
            aria-pressed={feld === ausgewaehlt}
            className={greifbar.includes(feld) ? "greifbar" : undefined}
            onClick={() => {
              if (klickGilt()) beiFeld(feld);
            }}
          />
        );
      })}
    </div>
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
  ziehen = null,
}: BrettEigenschaften) {
  const { brettfarben, figurensatz, ton } = useEinstellungen();
  const farben = BRETTFARBEN[brettfarben];
  // Holzbilder nur auf bedienbaren Brettern; kleine Bretter in Übersichten bleiben schlicht.
  const holz = brettfarben === "holz" && beiFeld !== undefined;
  // Ebenso die Materialbretter (seit 0.2.84): ein ganzes Brettbild über den schlichten Feldern.
  const bild = beiFeld !== undefined ? farben.bild : undefined;
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
  // Abgeschaltet in den Einstellungen (Merker auf dem Gerät); gelesen beim Öffnen des Bildschirms.
  const [wischenErlaubt] = useState(wischenAn);
  const zieh = beiFeld && wischenErlaubt ? ziehen : null;
  const { gezogen, ...wischen } = useZiehen(zieh, gedreht);
  const gezogenesZeichen = gezogen ? figuren.get(gezogen.von) : undefined;
  return (
    <div className="brett">
      <svg viewBox={`0 0 ${BRETT} ${BRETT}`} role="img" aria-label={beschriftung}>
        {holz && <Holzfelder kennung={kennung} />}
        <Felder gedreht={gedreht} farben={farben} holzkennung={holz ? kennung : null} />
        {bild && <Brettbild pfad={bild} />}
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
        {gezogen?.ueber && (
          <Schimmer feld={gezogen.ueber} gedreht={gedreht} farbe={farben.schimmer} />
        )}
        <Figuren
          figuren={figuren}
          gedreht={gedreht}
          satz={figurensatz}
          farbe={farben.figur}
          gezogen={gezogen}
        />
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
        {gezogen && gezogenesZeichen && (
          <GezogeneFigur
            zeichen={gezogenesZeichen}
            gezogen={gezogen}
            satz={figurensatz}
            farbe={farben.figur}
          />
        )}
      </svg>
      {beiFeld && (
        <Knopfschicht
          felder={felder}
          figuren={figuren}
          ausgewaehlt={ausgewaehlt}
          beiFeld={beiFeld}
          greifbar={zieh?.felder ?? []}
          wischen={wischen}
        />
      )}
    </div>
  );
}
