/**
 * Karte der Startstellung auf „Spielen“: Grundstellung, Abbildung oder eigene Stellung, mit
 * Stellungseditor und FEN-Eingabe.
 *
 * Rolle im Gesamtbild: Bis 0.2.129 stand die Karte oben in Spielen.tsx. Seit DS51 (0.2.131,
 * Nutzungsprüfung vom 25.10.2026) steht sie aus der Grundstellung am Ende und zeigt dort kein
 * Brett, weil man sie selten ändert; ab einer Abbildung oder eigenen Stellung bleibt sie oben mit
 * Brett. Ausgelagert, damit Spielen.tsx unter 400 Zeilen bleibt.
 * Abhängigkeiten: Brett, Stellungseditor, spiel/partie.ts (spielbar), spiel/stellungsbau.ts, i18n.
 */
import { useState } from "react";
import { t } from "../../../i18n/sprache";
import { spielbar } from "../../../spiel/partie";
import { GRUNDSTELLUNG } from "../../../spiel/stellungsbau";
import { Brett } from "../../brett/Brett";
import { Stellungseditor } from "./Stellungseditor";

/** Die Startstellung: Grundstellung, Abbildung oder eigene FEN. */
export function Startstellung({
  fen,
  abbildung,
  setzeFen,
}: {
  fen: string;
  abbildung: string | undefined;
  setzeFen: (fen: string) => void;
}) {
  const [eingabe, setzeEingabe] = useState("");
  const [editor, setzeEditor] = useState(false);
  const gueltig = spielbar(eingabe.trim());
  const titel = abbildung
    ? t("spielen.abAbbildung", { nummer: abbildung })
    : fen === GRUNDSTELLUNG
      ? t("spielen.grundstellung")
      : t("spielen.eigeneStellung");
  return (
    <section className="karte startstellung" data-tour="spielen-start">
      <h2 className="karte-titel">{titel}</h2>
      {editor ? (
        <Stellungseditor
          start={fen}
          beiUebernehmen={(neu) => {
            setzeFen(neu);
            setzeEditor(false);
          }}
          beiAbbrechen={() => setzeEditor(false)}
        />
      ) : (
        <>
          {/* Die Grundstellung kennt jeder; das Brett zeigt nur eine veränderte Stellung (DS51). */}
          {(fen !== GRUNDSTELLUNG || abbildung) && (
            <div className="startbrett">
              <Brett fen={fen} markierungen={[]} beschriftung={titel} koordinaten={false} />
            </div>
          )}
          <button type="button" className="knopf-zweit" onClick={() => setzeEditor(true)}>
            {t("spielen.aufbauen")}
          </button>
        </>
      )}
      {!editor && (
        <details className="fen-eingabe">
          <summary>{t("spielen.fenEingeben")}</summary>
          <input
            className="suchfeld"
            value={eingabe}
            onChange={(e) => setzeEingabe(e.target.value)}
            aria-label={t("spielen.fen")}
            placeholder="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
          />
          {eingabe && !gueltig && <p className="fehlertext">{t("spielen.fenUngueltig")}</p>}
          <button
            type="button"
            className="knopf-zweit"
            disabled={!gueltig}
            onClick={() => setzeFen(eingabe.trim())}
          >
            {t("spielen.fenUebernehmen")}
          </button>
        </details>
      )}
    </section>
  );
}
