/**
 * Die Phasen der Denkroutine als drei Phasenzeichen; das gewählte trägt „Du bist hier“, darunter
 * die Werkzeuge dieser Phase aus dem Buch.
 *
 * Rolle im Gesamtbild: Runde „Weniger Text“, Punkt P6 (Wahl des Autors, 31.10.2026). Vorher stand
 * je Phase eine aufklappbare Zeile mit dem Satz „Du bist hier, solange …“. Jetzt wählt man die
 * Phase an ihrem Zeichen (Buch, Schwerter, Flagge wie in der Auswertung); die drei „Du bist hier“-
 * Sätze stehen vollständig im ⓘ der Überschrift, der Satz „In jeder Phase zuerst …“ als Zeile mit
 * Warnzeichen. Alle Texte kommen aus dem Buch (nachschlagen.json).
 * Regel: Kapitel 12, Denkroutine, Karte 2 (Werkzeuge je Partiephase).
 * Abhängigkeiten: Phasenzeichen.tsx, zeilensymbole.ts, Infoblase.tsx, lucide-react, i18n,
 * Stil in ui/stil/denkroutine.css.
 */
import { TriangleAlert } from "lucide-react";
import { useState } from "react";
import { t } from "../../../i18n/sprache";
import { Phasenzeichen } from "../auswertung/Phasenzeichen";
import { phaseZumNamen } from "../auswertung/zeilensymbole";
import { MitInfoblase } from "../bausteine/Infoblase";
import type { Routine } from "./Schrittkarten";

/** Größe des Warnzeichens (Bildpunkte). */
const WARNGROESSE = 20;

type Phaseneintrag = Routine["phasen"][number];

/** Die Werkzeuge der gewählten Phase: je Abschnitt Überschrift und Punkte. */
function Werkzeuge({ phase }: { phase: Phaseneintrag }) {
  return (
    <div className="denkphase-werkzeuge" data-testid="denkphase-werkzeuge">
      {phase.abschnitte.map((abschnitt) => (
        <div key={abschnitt.titel} className="phase-abschnitt">
          <h3>{abschnitt.titel}</h3>
          <ul>
            {abschnitt.punkte.map((punkt) => (
              <li key={punkt}>{punkt}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/** Die drei Phasenkacheln; die gewählte trägt die Marke „Du bist hier“. */
function Kacheln({
  phasen,
  gewaehlt,
  beiWahl,
}: {
  phasen: readonly Phaseneintrag[];
  gewaehlt: number;
  beiWahl: (index: number) => void;
}) {
  return (
    <div className="denkphasen" role="group" aria-label={t("wenigertext.seiten.denk.phasen")}>
      {phasen.map((phase, index) => {
        const art = phaseZumNamen(phase.name);
        const hier = index === gewaehlt;
        return (
          <button
            key={phase.name}
            type="button"
            className={`denkphase${hier ? " gewaehlt" : ""}`}
            aria-pressed={hier}
            onClick={() => beiWahl(index)}
          >
            {art && <Phasenzeichen phase={art} />}
            <span>{phase.name}</span>
            {hier && <span className="denkphase-hier">{t("buchlook.hier")}</span>}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Karte 2 der Nachschlageseite. Beispiel: Tipp auf „Mittelspiel“ → Marke „Du bist hier“ dort,
 * darunter „Ruhiger Zug mit …“ und „Achte besonders auf …“ des Mittelspiels.
 */
export function Phasenwahl({ routine }: { routine: Routine }) {
  const [gewaehlt, setzeGewaehlt] = useState(0);
  const phase = routine.phasen[gewaehlt];
  return (
    <section className="karte" data-tour="denkroutine-phasen">
      <MitInfoblase
        zeile={<h2 className="karte-titel">{routine.phasenTitel}</h2>}
        thema={routine.phasenTitel}
        erklaerung={routine.phasen.map((p) => (
          <p key={p.name}>
            <strong>{p.name}:</strong> {p.wann}
          </p>
        ))}
      />
      <Kacheln phasen={routine.phasen} gewaehlt={gewaehlt} beiWahl={setzeGewaehlt} />
      {phase && <Werkzeuge phase={phase} />}
      <p className="denk-zuerst">
        <TriangleAlert size={WARNGROESSE} aria-hidden="true" />
        <span>{routine.zuerst}</span>
      </p>
    </section>
  );
}
