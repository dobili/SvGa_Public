/**
 * „Nach Phasen“ in der Karte „Deine Wertung“ (Profil neu, 31.10.2026): Eröffnung, Mittelspiel und
 * Endspiel als einfache Balken mit Zahl im Maßstab der Karte, statt eigener Reiter.
 *
 * Rolle im Gesamtbild: Zeigt, wo das Üben am meisten bringt (Wunsch des Autors seit 0.2.125), aber
 * ohne Erwartungen zu wecken: Bis zehn Partien steht „ab 10 Partien genau“, und die Balken sind
 * blass (phaseneindruck.ts). Die Länge eines Balkens folgt der Zahl auf einer festen Skala von
 * 400 bis 2400 (Lichess), damit Einsteiger und starke Vereinsspieler denselben Balken lesen.
 * Seit dem 31.10.2026 (zurückgeholt) öffnet ein Tipp auf einen Balken den Verlauf dieser Phase
 * als Kurve (Phasenkurve.tsx), wie früher die Reiter je Phase.
 * Abhängigkeiten: phaseneindruck.ts, wertungskacheln.ts, bausteine/Fortschrittsbalken.tsx,
 * spiel/wertung.ts, i18n.
 */
import { useMemo, useState } from "react";
import { t } from "../../../i18n/sprache";
import type { Wertungstempo } from "../../../spiel/elomodell";
import type { Phase } from "../../../spiel/phasen";
import type { Partieeintrag } from "../../../speicher/partien";
import {
  verlaufDerZeitklasse,
  type Wertungsbereich,
  type Wertungspunkt,
} from "../../../spiel/wertung";
import { Fortschrittsbalken } from "../bausteine/Fortschrittsbalken";
import type { Wertungsmassstab } from "../fortschritt/wertungsmassstab";
import { phaseneindruecke } from "./phaseneindruck";
import { Phasenkurve } from "./Phasenkurve";
import { zahlInMassstab } from "./wertungskacheln";

/** Feste Skala der Balken (Maßstab von Lichess). */
const SKALA_UNTEN = 400;
const SKALA_OBEN = 2400;

/** Länge eines Balkens: Anteil der Zahl auf der festen Skala. */
function balkenanteil(mitte: number): { erreicht: number; gesamt: number } {
  const gesamt = SKALA_OBEN - SKALA_UNTEN;
  return { erreicht: Math.max(0, Math.min(gesamt, mitte - SKALA_UNTEN)), gesamt };
}

/**
 * Die Balken der drei Phasen. Beispiel: drei Partien → „Ab 10 Partien genau; bis dahin nur ein
 * Eindruck.“ und drei blasse Balken mit „etwa 1400“ usw.
 */
export function Phasenbalken({
  punkte,
  partien,
  tempo,
  massstab,
  bereich,
  jetzt,
}: {
  punkte: readonly Wertungspunkt[];
  partien: readonly Partieeintrag[];
  tempo: Wertungstempo;
  massstab: Wertungsmassstab;
  bereich: Wertungsbereich;
  jetzt: Date;
}) {
  const [offen, setzeOffen] = useState<Phase | null>(null);
  const kette = useMemo(() => verlaufDerZeitklasse(punkte, tempo), [punkte, tempo]);
  const phasen = useMemo(() => phaseneindruecke(kette, partien, tempo), [kette, partien, tempo]);
  if (phasen.every((p) => p.mitte === null)) return null;
  const alleGenau = phasen.every((p) => p.genau);
  return (
    <div className="wertung-phasen" data-testid="wertung-phasen">
      <h3>{t("profil.wertung.phasen")}</h3>
      {!alleGenau && <p className="hinweis">{t("profil.wertung.phasenHinweis")}</p>}
      <ul>
        {phasen.map(({ phase, mitte, genau }) => {
          const name = t(`phase.name.${phase}`);
          const zahl = mitte === null ? null : zahlInMassstab(tempo, mitte, massstab);
          const text = zahl === null ? "–" : t("profil.wertung.etwa", { zahl });
          return (
            <li key={phase} className={genau ? "genau" : "eindruck"}>
              <button
                type="button"
                className="wertung-phasenknopf"
                aria-expanded={offen === phase}
                data-testid={`wertung-phase-${phase}`}
                onClick={() => setzeOffen(offen === phase ? null : phase)}
              >
                <span className="wertung-phasenname">{name}</span>
                <Fortschrittsbalken
                  anteil={balkenanteil(mitte ?? SKALA_UNTEN)}
                  beschriftung={`${name}: ${text}`}
                />
                <span className="wertung-phasenzahl">{text}</span>
              </button>
            </li>
          );
        })}
      </ul>
      {offen && (
        <Phasenkurve
          kette={kette}
          partien={partien}
          tempo={tempo}
          phase={offen}
          massstab={massstab}
          bereich={bereich}
          jetzt={jetzt}
        />
      )}
    </div>
  );
}
