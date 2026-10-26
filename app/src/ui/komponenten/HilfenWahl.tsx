/**
 * Spielhilfen und der Haken „Gewertete Partie“ vor der Partie.
 *
 * Rolle im Gesamtbild: Teil der Gegnerwahl (GegnerWahl.tsx) auf dem Bildschirm „Spielen“.
 * Wunsch des Autors vom 17.10.2026: Spielhilfen vor der Partie zuschaltbar, ungewertete Partien;
 * gewertete Partien ohne Spielhilfen (Rückfrage S9).
 * Warum eigene Datei: GegnerWahl.tsx lag über 400 Zeilen (Regel 4 in CLAUDE.md).
 * Abhängigkeiten: spiel/partie.ts (Typen), InfoKnopf, Titelsymbol, i18n.
 */
import { t } from "../../i18n/sprache";
import type { Spielhilfen } from "../../spiel/partie";
import { MitInfo } from "./InfoKnopf";
import { Titelsymbol } from "./Titelsymbol";

/**
 * Die Spielhilfen und der Haken „Gewertete Partie“. `wertbar`: nur Partien gegen die Engine aus
 * der Grundstellung zählen für die Wertung (Wunsch des Autors, 17.10.2026); sonst steht statt des
 * Hakens ein Satz.
 */
export function HilfenWahl({
  hilfen,
  gewertet,
  wertbar,
  beiHilfen,
  beiGewertet,
  ohneTitel = false,
  ohneWertung = false,
}: {
  hilfen: Spielhilfen;
  gewertet: boolean;
  wertbar: boolean;
  beiHilfen: (hilfen: Spielhilfen) => void;
  beiGewertet: (gewertet: boolean) => void;
  /** In der Klappe „Spielhilfen“ steht der Titel schon in der Zusammenfassung (0.2.116). */
  ohneTitel?: boolean;
  /** Der Haken „Gewertete Partie“ steht dann außerhalb (WertungsWahl). */
  ohneWertung?: boolean;
}) {
  // Gewertete Partien ohne Spielhilfen (S9): die Haken sind dann gesperrt und leer.
  const gesperrt = wertbar && gewertet;
  return (
    <>
      {!ohneTitel && (
        <span className="einstellung-name">
          <Titelsymbol art="hilfen" />
          {t("spielen.hilfen")}
        </span>
      )}
      <label className="schalterzeile">
        <input
          type="checkbox"
          disabled={gesperrt}
          checked={hilfen.symbole && !gesperrt}
          onChange={(e) => beiHilfen({ ...hilfen, symbole: e.target.checked })}
        />
        {t("spielen.hilfen.symbole")}
      </label>
      <label className="schalterzeile">
        <input
          type="checkbox"
          disabled={gesperrt}
          checked={hilfen.werkzeuge && !gesperrt}
          onChange={(e) => beiHilfen({ ...hilfen, werkzeuge: e.target.checked })}
        />
        {t("spielen.hilfen.werkzeuge")}
      </label>
      {!ohneWertung && (
        <WertungsWahl gewertet={gewertet} wertbar={wertbar} beiGewertet={beiGewertet} />
      )}
    </>
  );
}

/**
 * Der Haken „Gewertete Partie“ mit Erklärung; in gewerteten Partien der Satz, dass Rücknahme und
 * Spielhilfen fehlen (S9). Seit 0.2.116 eigenständig: Er steht über der Klappe „Spielhilfen“,
 * damit man ihn auch zugeklappt sieht.
 */
export function WertungsWahl({
  gewertet,
  wertbar,
  beiGewertet,
}: {
  gewertet: boolean;
  wertbar: boolean;
  beiGewertet: (gewertet: boolean) => void;
}) {
  if (!wertbar) return <p className="hinweis">{t("spielen.nichtWertbar")}</p>;
  return (
    <>
      {/* Die Erklärung zur Wertung hinter dem Fragezeichen: Sie stand sonst bei jedem Öffnen
          als zweiter Absatz direkt über „Partie beginnen“ (19.10.2026). */}
      <MitInfo
        zeile={
          <label className="schalterzeile">
            <input
              type="checkbox"
              checked={gewertet}
              onChange={(e) => beiGewertet(e.target.checked)}
            />
            {t("spielen.gewertet")}
          </label>
        }
        erklaerung={
          <>
            <p>{t("spielen.gewertetHinweis")}</p>
            {/* Seit 0.2.137 ebenfalls hinter dem Fragezeichen statt dauerhaft darunter. */}
            <p>{t("spielen.gewertetOhneHilfen")}</p>
          </>
        }
        thema={t("spielen.gewertet")}
      />
    </>
  );
}
