/**
 * Startbild des Schach-Abenteuers: eine kurze Animation, wenn das Spiel startet, bevor das
 * Hauptmenü erscheint (Wunsch des Autors, 27.11.2026: „etwas, das symbolisch für das Abenteuer
 * steht, für die Reise“; die Schach-App hat ihren goldenen Springer, ui/komponenten/rahmen/).
 *
 * Die Geschichte in knapp vier Sekunden: In der Morgendämmerung liegt ein altes Schachbrett (das
 * Brett vom Dachboden). Es kippt, streckt sich und wird zum Weg aus Feldern. Der Held geht los,
 * Ambrose schwebt halb durchsichtig hinter ihm her, Ortsschilder ziehen vorbei (Maple Falls, Cedar
 * Creek, Riverton bis zur Capital Arena), dann steht der Titel über dem Weg.
 * Bilder: Held (die Figur des Spielstands, der fortgesetzt würde) und Ambrose aus ihren Bögen im
 * Paket (Figurrahmen.tsx), zur Laufzeit geladen. Ohne Paket (erster Start) oder solange die Bögen
 * laden, läuft die schlichte Fassung ohne Figuren: Brett, Weg, Schilder, Titel. Mit Paket liegt
 * dahinter das Panorama der Reise (bilder/startbild-reise.webp, mit Gemini gemalt, Nachtrag des
 * Autors 27.11.2026), das langsam von Maple Falls bis zur Arena schwenkt.
 * Ein Tipp oder eine Taste überspringt sie sofort. „Bewegung reduzieren“: ein stilles Titelbild,
 * kürzer. Ohne Ton: Das Startbild läuft vor jeder Berührung, und Browser spielen dann keinen Ton.
 * Schaltet der Leser die Startanimation der App aus (Einstellungen, Merker „startanimation“), läuft
 * auch diese nicht.
 * Abhängigkeiten: i18n, texte/texte.ts (Ortsnamen), Figurrahmen.tsx, regeln/heldfigur.ts,
 * regeln/geist.ts (Deckkraft des Geists), useFigurbogen.ts, startbild.css.
 */
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { t } from "../../i18n/sprache";
import { GEIST_DECKKRAFT } from "../regeln/geist";
import { ERSATZFIGUR, heldbogenpfad } from "../regeln/heldfigur";
import type { Heldfigur } from "../schnittstelle/spielstand";
import { figurfarben, type Brettstilkennung } from "../brett/brettstile";
import { figurenraster, pixellaeufe, RASTERGROESSE } from "../brett/pixelfiguren";
import { tSpiel } from "../texte/texte";
import { Figurrahmen } from "./Figurrahmen";
import { Schriftzug } from "./Schriftzug";
import { useFigurbogen } from "./useFigurbogen";
import { paketdateiAlsAdresseOderNull } from "../paket/paketlader";
import { BRETTFARBEN, HOLZ } from "../../ui/brett/masse";
import "../startbild.css";
import "../startbild-weg.css";

/** Dauer mit Bewegung und still (ms), passend zu den Keyframes in startbild.css. */
// Doppelt so lang wie der erste Entwurf (3,9 s), Wunsch des Autors 27.11.2026: „zack, ist es weg“.
// Danach bleibt das Bild stehen, bis der Spieler auf „Weiter“ tippt (ebenfalls Wunsch des Autors:
// den Titel in Ruhe lesen), und alles um ein Fünftel langsamer (ebenfalls 27.11.2026); vorher
// überspringt ein Tipp oder eine Taste.
const STARTBILD_MS = 9360;
const STARTBILD_STILL_MS = 1800;
/** Felder des Bretts in einer Reihe. */
const BRETTREIHE = 8;
/** Vergrößerung der Figuren (Bogen 32 Bildpunkte → 96). */
const FIGURMASSSTAB = 3;
/** Ortsschilder in der Reihenfolge der Reise (Spieltexte ort.<kennung>.name). */
const SCHILDER = ["mapleFalls", "cedarCreek", "riverton", "capitalArena"] as const;
/** Pfad des Bogens von Ambrose (figuren32/ambrose.png über figurbogen.ts). */
const AMBROSE = "figuren/ambrose.png";
/**
 * Panorama der Reise (Gemini, 27.11.2026, privates Paket spiel/bilder/): Maple Falls, Flussstadt,
 * Canyon, Berge mit Sternwarte, Arena; unten ein Wiesenstreifen für den Weg. Fehlt es, malt das
 * Startbild Himmel und Land selbst.
 */
const PANORAMA = "bilder/startbild-reise.webp";

/** Felder einer Hälfte des Figurenstreifens auf dem Weg (startbild-weg.css, --startbild-streifen). */
const STREIFENFELDER = 48;
/**
 * Verstreute Figuren auf einer Hälfte des Streifens: Feld (Spalte), Reihe (0 hinten, 1 vorn) und
 * FEN-Zeichen (groß Weiß, klein Schwarz). Etwa jedes fünfte Feld, gemischt, damit der Weg nach
 * einer Partie aussieht, nicht nach einer Grundstellung (Wunsch des Autors, 27.11.2026).
 */
const WEGFIGUREN: readonly (readonly [number, 0 | 1, string])[] = [
  [3, 0, "P"],
  [7, 1, "n"],
  [12, 0, "B"],
  [16, 1, "p"],
  [21, 0, "R"],
  [26, 1, "q"],
  [30, 0, "N"],
  [35, 1, "b"],
  [39, 0, "P"],
  [44, 1, "r"],
];
/** Brettstil der Wegfiguren: das Brett vom Dachboden, mit dem die Reise beginnt. */
const WEGSTIL: Brettstilkennung = "dachboden";

/** Bewegung reduzieren eingestellt? */
function stillGewuenscht(): boolean {
  return (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Eine Pixelfigur der Abenteuer-Bretter (brett/pixelfiguren.ts) auf einem Feld des Wegs. */
function Wegfigur({ spalte, reihe, zeichen }: { spalte: number; reihe: number; zeichen: string }) {
  const raster = figurenraster(zeichen);
  if (!raster) return null;
  const farben = figurfarben(WEGSTIL, zeichen === zeichen.toUpperCase());
  const lage: CSSProperties = {
    left: `calc(var(--startbild-feld) * ${spalte})`,
    top: `calc(var(--startbild-feld) * ${reihe})`,
  };
  return (
    <svg
      className="startbild-wegfigur"
      style={lage}
      viewBox={`0 0 ${RASTERGROESSE} ${RASTERGROESSE}`}
      shapeRendering="crispEdges"
    >
      {pixellaeufe(raster).map((lauf) => (
        <rect
          key={`${lauf.x}-${lauf.y}`}
          x={lauf.x}
          y={lauf.y}
          width={lauf.laenge}
          height={1}
          fill={farben[lauf.klasse]}
        />
      ))}
    </svg>
  );
}

/** Der Figurenstreifen: zwei gleiche Hälften, damit das Laufen nahtlos von vorn beginnt. */
function Wegfiguren() {
  const streifen = { "--startbild-streifen": String(STREIFENFELDER) } as CSSProperties;
  return (
    <span className="startbild-wegfiguren" style={streifen}>
      {[0, STREIFENFELDER].flatMap((versatz) =>
        WEGFIGUREN.map(([spalte, reihe, zeichen]) => (
          <Wegfigur
            key={`${versatz + spalte}`}
            spalte={versatz + spalte}
            reihe={reihe}
            zeichen={zeichen}
          />
        )),
      )}
    </span>
  );
}

/** Das Brett vom Dachboden: 8 × 8 Felder, die zum Weg werden. */
function Brett() {
  const felder = Array.from({ length: BRETTREIHE * BRETTREIHE }, (_, i) => {
    const dunkel = (Math.floor(i / BRETTREIHE) + i) % 2 === 1;
    return <span key={i} className={dunkel ? "startbild-feld-dunkel" : undefined} />;
  });
  return <div className="startbild-brett">{felder}</div>;
}

/**
 * Adresse des Panoramas der Reise im Paket, sobald `bereit` gilt; null ohne Paket oder Bild (das
 * Bild lädt nach dem ersten Start im Hintergrund mit den übrigen Großbildern).
 */
function usePanorama(bereit: boolean): string | null {
  const [adresse, setzeAdresse] = useState<string | null>(null);
  useEffect(() => {
    if (!bereit) return;
    let aktiv = true;
    void paketdateiAlsAdresseOderNull(PANORAMA).then((a) => {
      if (aktiv) setzeAdresse(a);
    });
    return () => {
      aktiv = false;
    };
  }, [bereit]);
  return bereit ? adresse : null;
}

/**
 * Holz des Bretts und des Wegs: „Ahorn & Nussbaum“ wie die Brettfarbe der App (Wunsch des Autors,
 * 28.11.2026), als CSS-Variablen am Startbild; die Grundfarben gelten, bis die Bilder geladen sind.
 */
const HOLZSTIL = {
  "--startbild-holz-hell": `url("${import.meta.env.BASE_URL}${HOLZ.hell}")`,
  "--startbild-holz-dunkel": `url("${import.meta.env.BASE_URL}${HOLZ.dunkel}")`,
  "--startbild-holzfarbe-hell": BRETTFARBEN.holz.hell,
  "--startbild-holzfarbe-dunkel": BRETTFARBEN.holz.dunkel,
} as CSSProperties;

/** Held und Ambrose, sobald ihre Bögen geladen sind; sonst nichts (schlichte Fassung). */
function Reisende({
  figur,
  bilder,
  gehend,
}: {
  readonly figur: Heldfigur;
  readonly bilder: boolean;
  readonly gehend: boolean;
}) {
  const gewaehlt = useFigurbogen(heldbogenpfad(figur), bilder);
  const ersatz = useFigurbogen(heldbogenpfad(ERSATZFIGUR), bilder);
  const ambrose = useFigurbogen(AMBROSE, bilder);
  const held = gewaehlt ?? ersatz;
  const geist: CSSProperties = { opacity: GEIST_DECKKRAFT };
  return (
    <div className="startbild-reisende" data-testid="abenteuer-startbild-figuren">
      {ambrose && (
        <span className="startbild-geist" style={geist}>
          <Figurrahmen bogen={ambrose} massstab={FIGURMASSSTAB} gehend={gehend} />
        </span>
      )}
      {held && (
        <span className="startbild-held">
          <Figurrahmen bogen={held} massstab={FIGURMASSSTAB} gehend={gehend} />
        </span>
      )}
    </div>
  );
}

/**
 * Das Startbild über allem. Eingaben: Figur des Helden, ob Paketbilder geladen werden dürfen
 * (Paket da) und was danach geschieht. Ende nach STARTBILD_MS, nach einem Tipp oder einer Taste.
 */
export function Startbild({
  figur,
  bilder,
  beiEnde,
}: {
  readonly figur: Heldfigur;
  readonly bilder: boolean;
  readonly beiEnde: () => void;
}) {
  const [still] = useState(stillGewuenscht);
  const [fertig, setzeFertig] = useState(false);
  const ende = useRef(beiEnde);
  useEffect(() => {
    ende.current = beiEnde;
  }, [beiEnde]);
  useEffect(() => {
    // Kein Ende von selbst: Nach dem Ablauf steht das Bild, „Weiter“ blinkt (fertig).
    const zeit = setTimeout(() => setzeFertig(true), still ? STARTBILD_STILL_MS : STARTBILD_MS);
    const taste = () => ende.current();
    window.addEventListener("keydown", taste);
    return () => {
      clearTimeout(zeit);
      window.removeEventListener("keydown", taste);
    };
  }, [still]);
  const panorama = usePanorama(bilder);
  return (
    <button
      type="button"
      className={`startbild ${still ? "startbild-still" : ""} ${panorama ? "startbild-mit-panorama" : ""} ${fertig ? "startbild-fertig" : ""}`}
      data-testid="abenteuer-startbild"
      style={HOLZSTIL}
      aria-label={t(fertig ? "abenteuer.startbild.weiter" : "abenteuer.startbild.ueberspringen")}
      onClick={() => ende.current()}
    >
      {panorama && (
        <span
          className="startbild-panorama"
          style={{ backgroundImage: `url("${panorama}")` }}
          aria-hidden="true"
        />
      )}
      <span className="startbild-himmel" aria-hidden="true">
        <span className="startbild-sonne" />
        <span className="startbild-sterne" />
      </span>
      <span className="startbild-land" aria-hidden="true">
        <span className="startbild-weg">
          <Wegfiguren />
        </span>
        <Brett />
        <span className="startbild-schilder">
          {SCHILDER.map((ort, i) => (
            <span key={ort} className={`startbild-schild startbild-schild-${i + 1}`}>
              {tSpiel(`ort.${ort}.name`)}
            </span>
          ))}
        </span>
        <Reisende figur={figur} bilder={bilder} gehend={!fertig} />
      </span>
      <span className="startbild-titel">
        <Schriftzug groesse="gross" />
        <span className="startbild-untertitel">{t("abenteuer.startbild.untertitel")}</span>
      </span>
      {fertig ? (
        <span className="startbild-weiter" data-testid="abenteuer-startbild-weiter">
          {t("abenteuer.startbild.weiter")}
        </span>
      ) : (
        <span className="startbild-hinweis" aria-hidden="true">
          {t("abenteuer.startbild.ueberspringen")}
        </span>
      )}
    </button>
  );
}
