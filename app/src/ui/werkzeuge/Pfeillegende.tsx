/**
 * Legende einer Werkzeugkarte als Reihe kleiner Bildzeichen mit Stichwort, der volle Satz hinter
 * dem Infoknopf.
 *
 * Rolle im Gesamtbild: Runde „Weniger Text“, P7 (Wahl des Autors, 31.10.2026). Eine gemeinsame
 * Komponente für alle Werkzeuge; was je Werkzeug erscheint, steht in legenden.ts. Die Zeichen
 * tragen für Bildschirmleser einen Namen („Goldener Pfeil“), das Stichwort steht daneben; der
 * Infoknopf nennt den bisherigen Satz („Am Brett: Goldene Pfeile: …“) vollständig, damit nichts
 * verloren geht. Auch der Fallentrainer nutzt die Zeichen (Legendensymbol), damit überall
 * dieselben Pfeile stehen.
 * Abhängigkeiten: legenden.ts, bausteine/InfoKnopf.tsx (MitInfo), i18n.
 */
import { MitInfo } from "../komponenten/bausteine/InfoKnopf";
import { t, type Textwerte } from "../../i18n/sprache";
import type { Legendeneintrag, Legendenfarbe, Legendenzeichen } from "./legenden";

/** Maße des Zeichens im SVG-Raster (Breite × Höhe), Pfeilspitze und Feld. */
const BREITE = 28;
const HOEHE = 12;
const MITTE = HOEHE / 2;
const SPITZE = 7;
const LINIENENDE = BREITE - SPITZE;
const FELD = 12;
const FELDRAND = 2;

/** Das Bild des Zeichens; die Farbe kommt über CSS (currentColor), Linienart je Farbe. */
function Zeichenbild({ zeichen }: { zeichen: Legendenzeichen }) {
  if (zeichen === "pfeil")
    return (
      <svg viewBox={`0 0 ${BREITE} ${HOEHE}`} width={BREITE} height={HOEHE} aria-hidden="true">
        <line className="legende-linie" x1={0} y1={MITTE} x2={LINIENENDE} y2={MITTE} />
        <polygon
          points={`${LINIENENDE},0 ${BREITE},${MITTE} ${LINIENENDE},${HOEHE}`}
          fill="currentColor"
        />
      </svg>
    );
  return (
    <svg viewBox={`0 0 ${FELD} ${FELD}`} width={FELD} height={FELD} aria-hidden="true">
      <rect
        x={FELDRAND / 2}
        y={FELDRAND / 2}
        width={FELD - FELDRAND}
        height={FELD - FELDRAND}
        rx={FELDRAND}
        className={zeichen === "kennung" ? "legende-kennung" : "legende-feld"}
      />
    </svg>
  );
}

/**
 * Ein farbiges Zeichen mit Namen für Bildschirmleser, ohne Stichwort.
 * Beispiel: <Legendensymbol zeichen="pfeil" farbe="rot" /> → roter gestrichelter Pfeil.
 */
export function Legendensymbol({
  zeichen,
  farbe,
}: {
  zeichen: Legendenzeichen;
  farbe: Legendenfarbe;
}) {
  return (
    <span
      className={`legende-zeichen legende-${farbe}`}
      role="img"
      aria-label={t(`wenigertext.werkzeug.zeichen.${zeichen}.${farbe}`)}
    >
      <Zeichenbild zeichen={zeichen} />
    </span>
  );
}

/**
 * Die Reihe aus Zeichen und Stichwörtern, ohne Infoknopf (auch für die Trainer).
 * Beispiel: Röntgen aus Sicht von Weiß → „[gold] Weiß  [rot] Schwarz  [grau] Abtausch“.
 */
export function Legendenreihe({
  eintraege,
  werte = {},
}: {
  eintraege: readonly Legendeneintrag[];
  werte?: Textwerte;
}) {
  return (
    <ul className="pfeillegende" data-testid="pfeillegende">
      {eintraege.map((eintrag) => (
        <li key={`${eintrag.zeichen}-${eintrag.farbe}-${eintrag.wort}`}>
          <Legendensymbol zeichen={eintrag.zeichen} farbe={eintrag.farbe} />
          <span>{t(eintrag.wort, werte)}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Die Legende einer Werkzeugkarte: Reihe plus Infoknopf mit dem ganzen Satz.
 * Beispiel: Sicherheitsblick → „[gold] Zug  [rot] Schlag, Schach  [rotes Feld] bedroht“, ⓘ:
 * „Am Brett: Goldener Pfeil: der geprüfte Zug von Weiß. …“.
 */
export function Pfeillegende({
  eintraege,
  satz,
  werte,
}: {
  eintraege: readonly Legendeneintrag[];
  /** Der bisherige Satz der Legende mit eingesetzten Farben. */
  satz: string;
  werte: Textwerte;
}) {
  return (
    <div className="legende">
      <MitInfo
        thema={t("wenigertext.werkzeug.legendeThema")}
        zeile={<Legendenreihe eintraege={eintraege} werte={werte} />}
        erklaerung={
          <p>
            <strong>{t("werkzeug.legendeTitel")}</strong> {satz}
          </p>
        }
      />
    </div>
  );
}
