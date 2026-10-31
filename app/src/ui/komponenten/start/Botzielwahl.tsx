/**
 * Eigenes Ziel „Bot besiegen“ (Gamifizierung P13): Bot aus der Liste der Gegnerwahl (Porträts
 * nach Stufe, gegnerSortiert) und Zeitart Blitz, Schnellschach, Klassisch oder „egal“.
 *
 * Rolle im Gesamtbild: Teil der Zielwahl in der Wochenkarte. Das Gitter ist dasselbe wie im
 * Spielstart (gegner/Gegnerstufen.tsx, mit den Siegmarken je Zeitart), damit der Leser sieht, wen
 * er schon besiegt hat. Ein schon erreichtes Ziel lässt sich nicht anheften (sonst gäbe es Punkte
 * ohne Partie); ein Satz sagt das.
 * Abhängigkeiten: training/ziele.ts, gegner/Gegnerstufen.tsx, spiel/elomodell.ts, Speicher, i18n.
 */
import { useState } from "react";
import { t } from "../../../i18n/sprache";
import { WERTUNGSTEMPI, type Wertungstempo } from "../../../spiel/elomodell";
import type { Ziel } from "../../../speicher/gamifizierung";
import { aendere } from "../../../speicher/speicher";
import { anheftsperre, mitAngeheftetem } from "../../../training/ziele";
import { VorgefertigteGitter } from "../gegner/Gegnerstufen";
import { useZielkontext } from "./zielhilfen";

type Zeitwahl = Wertungstempo | "egal";
const ZEITWAHLEN: readonly Zeitwahl[] = [...WERTUNGSTEMPI, "egal"];

/** Die vier Knöpfe der Zeitart als Auswahl. */
function Zeitartwahl({ wahl, beiWahl }: { wahl: Zeitwahl; beiWahl: (z: Zeitwahl) => void }) {
  return (
    <div className="knopfzeile" role="radiogroup" aria-label={t("ziel.botwahl.zeitart")}>
      {ZEITWAHLEN.map((z) => (
        <button
          key={z}
          type="button"
          role="radio"
          aria-checked={wahl === z}
          className={wahl === z ? "knopf-haupt" : "knopf-zweit"}
          onClick={() => beiWahl(z)}
        >
          {t(`ziel.zeitart.${z}`)}
        </button>
      ))}
    </div>
  );
}

/** Auswahl von Bot und Zeitart mit „Anheften“ und „Abbrechen“. */
export function Botzielwahl({ fertig }: { fertig: () => void }) {
  const kontext = useZielkontext();
  const [bot, setzeBot] = useState<string | null>(null);
  const [zeitart, setzeZeitart] = useState<Zeitwahl>("egal");
  const ziel: Ziel | null = bot ? { art: "bot", bot, zeitart } : null;
  const sperre = ziel ? anheftsperre(ziel, kontext) : null;
  const anheften = () => {
    if (!ziel || sperre) return;
    void aendere((d) => mitAngeheftetem(d, ziel, kontext.kapitel)).then(fertig);
  };
  return (
    <div className="zielwahl-bot" data-testid="ziel-botwahl">
      <p>{t("ziel.botwahl.frage")}</p>
      <VorgefertigteGitter
        bot={bot}
        beiBot={setzeBot}
        tempo={zeitart === "egal" ? "rapid" : zeitart}
      />
      <p>{t("ziel.botwahl.zeitart")}</p>
      <Zeitartwahl wahl={zeitart} beiWahl={setzeZeitart} />
      {sperre && (
        <p className="hinweis" role="status">
          {t(`ziel.sperre.${sperre}`)}
        </p>
      )}
      <div className="knopfzeile">
        <button
          type="button"
          className="knopf-haupt"
          disabled={!ziel || sperre !== null}
          onClick={anheften}
        >
          {t("ziel.anheften")}
        </button>
        <button type="button" className="knopf-zweit" onClick={fertig}>
          {t("ziel.abbrechen")}
        </button>
      </div>
    </div>
  );
}
