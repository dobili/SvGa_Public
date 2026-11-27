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
import { tSpiel } from "../texte/texte";
import { Figurrahmen } from "./Figurrahmen";
import { useFigurbogen } from "./useFigurbogen";
import { paketdateiAlsAdresseOderNull } from "../paket/paketlader";
import "../startbild.css";

/** Dauer mit Bewegung und still (ms), passend zu den Keyframes in startbild.css. */
const STARTBILD_MS = 3900;
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

/** Bewegung reduzieren eingestellt? */
function stillGewuenscht(): boolean {
  return (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
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

/** Held und Ambrose, sobald ihre Bögen geladen sind; sonst nichts (schlichte Fassung). */
function Reisende({ figur, bilder }: { readonly figur: Heldfigur; readonly bilder: boolean }) {
  const gewaehlt = useFigurbogen(heldbogenpfad(figur), bilder);
  const ersatz = useFigurbogen(heldbogenpfad(ERSATZFIGUR), bilder);
  const ambrose = useFigurbogen(AMBROSE, bilder);
  const held = gewaehlt ?? ersatz;
  const geist: CSSProperties = { opacity: GEIST_DECKKRAFT };
  return (
    <div className="startbild-reisende" data-testid="abenteuer-startbild-figuren">
      {ambrose && (
        <span className="startbild-geist" style={geist}>
          <Figurrahmen bogen={ambrose} massstab={FIGURMASSSTAB} gehend />
        </span>
      )}
      {held && (
        <span className="startbild-held">
          <Figurrahmen bogen={held} massstab={FIGURMASSSTAB} gehend />
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
  const ende = useRef(beiEnde);
  useEffect(() => {
    ende.current = beiEnde;
  }, [beiEnde]);
  useEffect(() => {
    const zeit = setTimeout(() => ende.current(), still ? STARTBILD_STILL_MS : STARTBILD_MS);
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
      className={`startbild ${still ? "startbild-still" : ""} ${panorama ? "startbild-mit-panorama" : ""}`}
      data-testid="abenteuer-startbild"
      aria-label={t("abenteuer.startbild.ueberspringen")}
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
        <span className="startbild-weg" />
        <Brett />
        <span className="startbild-schilder">
          {SCHILDER.map((ort, i) => (
            <span key={ort} className={`startbild-schild startbild-schild-${i + 1}`}>
              {tSpiel(`ort.${ort}.name`)}
            </span>
          ))}
        </span>
        <Reisende figur={figur} bilder={bilder} />
      </span>
      <span className="startbild-titel">
        <span className="startbild-titelzeile">{t("abenteuer.titel")}</span>
        <span className="startbild-untertitel">{t("abenteuer.startbild.untertitel")}</span>
      </span>
      <span className="startbild-hinweis" aria-hidden="true">
        {t("abenteuer.startbild.ueberspringen")}
      </span>
    </button>
  );
}
