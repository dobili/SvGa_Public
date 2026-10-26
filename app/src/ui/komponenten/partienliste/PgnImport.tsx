/**
 * Partie aus PGN einlesen, an der Partienliste (seit 0.2.117, Wunsch des Autors vom 19.10.2026).
 *
 * Rolle im Gesamtbild: Ein Aufklapper „Partie einlesen (PGN)“ über der Liste. Der Leser fügt den
 * Text ein oder wählt eine .pgn-Datei, sagt, welche Farbe er gespielt hat, und tippt
 * „Einlesen und auswerten“. Die Partie wird ungewertet abgelegt (speicher/partien.ts, legeAb), und
 * der Partie-Bildschirm öffnet sich; dort startet die Auswertung wie nach jeder Partie.
 * Abhängigkeiten: spiel/pgnimport.ts, speicher, Navigation, Aufklapper, Segmentwahl, i18n.
 */
import type { Color } from "chessops/types";
import { useState } from "react";
import { useNavigation } from "../../../app/navigationsKontext";
import { t } from "../../../i18n/sprache";
import { partieAusPgn, type Importfehler } from "../../../spiel/pgnimport";
import { legeAb } from "../../../speicher/partien";
import { aendere } from "../../../speicher/speicher";
import { Aufklapper } from "../bausteine/Aufklapper";
import { Segmentwahl } from "../bausteine/Segmentwahl";

const FARBEN: readonly Color[] = ["white", "black"];
const ZEITBASIS = 36;
const ZUFALLSSTELLEN = 6;

/** Eindeutige Kennung einer eingelesenen Partie aus Zeit und Zufall. */
function neueKennung(): string {
  const zufall = Math.random()
    .toString(ZEITBASIS)
    .slice(2, 2 + ZUFALLSSTELLEN);
  return `i-${Date.now().toString(ZEITBASIS)}-${zufall}`;
}

/** Die Meldung zu einem Fehler beim Einlesen. */
function fehlertext(fehler: Importfehler): string {
  if (fehler.art === "zug")
    return t("spielen.import.fehler.zug", { nummer: fehler.nummer, zug: fehler.zug });
  return t(`spielen.import.fehler.${fehler.art}`);
}

/** Das Formular im Aufklapper. */
function Formular() {
  const { navigiere } = useNavigation();
  const [text, setzeText] = useState("");
  const [farbe, setzeFarbe] = useState<Color>("white");
  const [fehler, setzeFehler] = useState<Importfehler | null>(null);
  const einlesen = () => {
    const ergebnis = partieAusPgn(text, farbe, neueKennung(), new Date());
    if (!ergebnis.ok) {
      setzeFehler(ergebnis.fehler);
      return;
    }
    const { partie } = ergebnis;
    void aendere((d) => ({ ...d, spiel: legeAb(d.spiel, partie) })).then(() =>
      navigiere({ bildschirm: "partie", id: partie.id }),
    );
  };
  const ladeDatei = (datei: File | undefined) => {
    if (!datei) return;
    datei
      .text()
      .then(setzeText)
      .catch((grund: unknown) => {
        console.error("PGN-Datei nicht lesbar:", grund);
        setzeFehler({ art: "unlesbar" });
      });
  };
  return (
    <div className="fehlerformular" data-testid="pgnimport">
      <label className="einstellung-name">
        {t("spielen.import.feld")}
        <textarea
          className="textfeld"
          rows={6}
          value={text}
          onChange={(e) => {
            setzeText(e.target.value);
            setzeFehler(null);
          }}
        />
      </label>
      <label className="einstellung-name">
        {t("spielen.import.datei")}
        <input
          type="file"
          accept=".pgn,text/plain"
          onChange={(e) => ladeDatei(e.target.files?.[0])}
        />
      </label>
      <Segmentwahl
        name={t("spielen.import.farbe")}
        werte={FARBEN}
        gewaehlt={farbe}
        text={(f) => t(f === "white" ? "farbe.w" : "farbe.b")}
        beiWahl={setzeFarbe}
      />
      {fehler && <p className="fehlertext">{fehlertext(fehler)}</p>}
      <button type="button" className="knopf-haupt" onClick={einlesen}>
        {t("spielen.import.knopf")}
      </button>
    </div>
  );
}

/** Der Aufklapper „Partie einlesen (PGN)“ mit Erklärung hinter dem Fragezeichen. */
export function PgnImport() {
  return (
    <Aufklapper
      text={t("spielen.import.titel")}
      erklaerung={t("spielen.import.erklaerung")}
      thema={t("spielen.import.titel")}
    >
      <Formular />
    </Aufklapper>
  );
}
