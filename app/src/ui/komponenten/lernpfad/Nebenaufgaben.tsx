/**
 * Das Bündel der Nebenaufgaben neben einer Station des Lernpfads (Wunsch des Autors, 31.10.2026).
 *
 * Rolle im Gesamtbild: Weg.tsx legt je Kapitel ein Bündel auf die Seite der Station, die vom Titel
 * wegzeigt, etwas tiefer als ihre Mitte (dort ist neben der Station Platz, auch auf 360 px). Klein
 * und ruhig: ein Bild (das erste verdiente Stück farbig, sonst ein Stern als bekanntes Zeichen für
 * „Extra“) auf leicht deckendem Grund und darunter „2/7“. Ein Tipp öffnet das Infofenster mit der Liste;
 * von dort öffnet ein Tipp das Stück mit Bedingung, Stand und dem Knopf zum Ort. Ganz geschafft:
 * goldener Rand.
 * Abhängigkeiten: nebenaufgaben.ts, erfolge/Infofenster.tsx, erfolge/Stueckbild.tsx, i18n.
 * Stil in ui/stil/nebenaufgaben.css.
 */
import { Star } from "lucide-react";
import { useState } from "react";
import { t } from "../../../i18n/sprache";
import "../../stil/nebenaufgaben.css";
import type { Erfolgsstueck } from "../erfolge/erfolgsstuecke";
import { Infofenster } from "../erfolge/Infofenster";
import { Stueckbild } from "../erfolge/Stueckbild";
import { titelstueck } from "./nebenaufgaben";

/** Größe des Sterns, solange noch nichts verdient ist (so groß wie ein Bild). */
const STERN = 26;

/**
 * Ein Bündel. `lage`: Mitte in Prozent der Fläche; `tour`: Ziel der Tour „lernpfad“ (nur an
 * einem Bündel). Beispiel: Kapitel 4, eins von fünf geschafft → Bild, „1/5“.
 */
export function Nebenaufgabenbuendel({
  kapitel,
  stuecke,
  lage,
  tour = false,
}: {
  kapitel: number;
  stuecke: readonly Erfolgsstueck[];
  lage: { left: string; top: string };
  tour?: boolean;
}) {
  const [offen, setzeOffen] = useState(false);
  const titel = titelstueck(stuecke);
  if (stuecke.length === 0) return null;
  const anteil = { erreicht: stuecke.filter((s) => s.verdient).length, gesamt: stuecke.length };
  const fertig = anteil.erreicht === anteil.gesamt;
  return (
    <>
      <button
        type="button"
        className={`nebenaufgaben-buendel${fertig ? " fertig" : ""}`}
        style={lage}
        aria-haspopup="dialog"
        aria-label={t("nebenaufgaben.buendel", { nummer: kapitel, ...anteil })}
        data-testid={`nebenaufgaben-${kapitel}`}
        data-tour={tour === false ? undefined : "lernpfad-nebenaufgaben"}
        onClick={() => setzeOffen(true)}
      >
        <span className="nebenaufgaben-bild" aria-hidden="true">
          {titel ? (
            <Stueckbild stueck={titel} klasse="nebenaufgaben-titelbild" />
          ) : (
            <Star className="nebenaufgaben-stern" size={STERN} strokeWidth={2.2} />
          )}
        </span>
        <span className="nebenaufgaben-zahl" aria-hidden="true">
          {t("nebenaufgaben.kurzstand", { ...anteil })}
        </span>
      </button>
      {offen && (
        <Infofenster
          stuecke={stuecke}
          titel={t("nebenaufgaben.titel", { nummer: kapitel })}
          kapitel={kapitel}
          beiSchliessen={() => setzeOffen(false)}
        />
      )}
    </>
  );
}
