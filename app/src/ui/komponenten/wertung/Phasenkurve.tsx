/**
 * Verlauf einer Phase (Eröffnung, Mittelspiel, Endspiel) als Kurve in der Karte „Deine Wertung“
 * (zurückgeholt am 31.10.2026, Wunsch des Autors: bei der Neugestaltung soll nichts Sinnvolles
 * wegfallen).
 *
 * Rolle im Gesamtbild: Bis 0.3.30 zeigten Reiter je Phase eine Kurve über die Zeit. Seit „Profil
 * neu“ stehen die Phasen als Balken (Phasenbalken.tsx); ein Tipp auf einen Balken öffnet hier die
 * Kurve dieser Phase, im selben Maßstab wie die Zahlen der Karte und im Ausschnitt aus „Mehr“.
 * Gezeichnet werden nur Punkte mit schmaler Spanne (spiel/wertung.ts, phasenverlauf); ohne solche
 * Punkte steht wie früher ein Hinweis. Darunter die Spanne der letzten Schätzung.
 * Abhängigkeiten: spiel/wertung.ts, fortschritt/Wertungskurvenbild.tsx,
 * fortschritt/wertungsmassstab.ts, wertungskacheln.ts, i18n.
 */
import { useMemo } from "react";
import { t } from "../../../i18n/sprache";
import type { Wertungstempo } from "../../../spiel/elomodell";
import type { Phase } from "../../../spiel/phasen";
import type { Partieeintrag } from "../../../speicher/partien";
import {
  imBereich,
  kennzahlenJePartie,
  phasenverlauf,
  type Wertungsbereich,
  type Wertungspunkt,
} from "../../../spiel/wertung";
import { Kurve } from "../fortschritt/Wertungskurvenbild";
import { spanneImMassstab, type Wertungsmassstab } from "../fortschritt/wertungsmassstab";
import { zahlInMassstab } from "./wertungskacheln";

/**
 * Die Kurve einer Phase. Beispiel: zwölf Schnellschach-Partien, Phase Mittelspiel → Kurve ab etwa
 * der sechsten Partie und „Spanne 1350–1650“.
 */
export function Phasenkurve({
  kette,
  partien,
  tempo,
  phase,
  massstab,
  bereich,
  jetzt,
}: {
  kette: readonly Wertungspunkt[];
  partien: readonly Partieeintrag[];
  tempo: Wertungstempo;
  phase: Phase;
  massstab: Wertungsmassstab;
  bereich: Wertungsbereich;
  jetzt: Date;
}) {
  const verlauf = useMemo(() => {
    const kennzahlen = kennzahlenJePartie(partien, new Set(kette.map((p) => p.partieId)));
    return phasenverlauf(kette, kennzahlen, tempo, phase);
  }, [kette, partien, tempo, phase]);
  const sichtbar = new Set(imBereich(kette, bereich, jetzt).map((p) => p.partieId));
  const imAusschnitt = verlauf.filter((p) => sichtbar.has(p.punkt.partieId));
  const punkte = imAusschnitt.flatMap((p) => {
    const zahl = zahlInMassstab(tempo, p.schaetzung.mitte, massstab);
    return zahl === null ? [] : [{ ...p.punkt, wertung: zahl }];
  });
  const letzte = imAusschnitt.at(-1)?.schaetzung;
  const spanne = letzte ? spanneImMassstab(tempo, letzte.von, letzte.bis, massstab) : null;
  if (punkte.length === 0) {
    return (
      <p className="hinweis" data-testid="wertung-phasenkurve-leer">
        {t("profil.wertung.phasenZuWenig", { phase: t(`phase.name.${phase}`) })}
      </p>
    );
  }
  return (
    <div data-testid="wertung-phasenkurve">
      <Kurve punkte={punkte} bereich={bereich} jetzt={jetzt} />
      {spanne && <p className="hinweis">{t("profil.wertung.spanne", spanne)}</p>}
    </div>
  );
}
