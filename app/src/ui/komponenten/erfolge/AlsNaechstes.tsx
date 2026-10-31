/**
 * „Als Nächstes“ in „Deine Erfolge“ (Entwurf C, 31.10.2026): die zwei bis vier offenen Stücke, denen
 * am wenigsten fehlt, als Silhouette in einem Fortschrittsring mit „19 von 24“ darunter.
 *
 * Rolle im Gesamtbild: Macht aus Leerstellen einen nächsten Schritt (Ziel des Autors). Die Auswahl
 * rechnet erfolgsstuecke.ts (naechsteStuecke); Abzeichen erscheinen nur, wenn sich ihr
 * Fortschritt zählen lässt (Feld `fortschritt` in ABZEICHEN). Der Ring ist eine schlichte
 * SVG-Linie um das Bild; Bildschirmleser hören Name und „x von y“.
 * Abhängigkeiten: erfolgsstuecke.ts (Typ), Stueckbild.tsx, i18n.
 */
import { t } from "../../../i18n/sprache";
import type { Anteil } from "../../../speicher/fortschritt";
import type { Erfolgsstueck } from "./erfolgsstuecke";
import { Stueckbild } from "./Stueckbild";

/** Maße des Rings (SVG-Einheiten). */
const RADIUS = 46;
const STRICH = 5;
const MASS = 2 * (RADIUS + STRICH);
const UMFANG = 2 * Math.PI * RADIUS;
const VIERTEL_DREHUNG = -90;

/** Der Fortschrittsring um das Bild. */
function Fortschrittsring({ anteil }: { anteil: Anteil }) {
  const teil = anteil.gesamt > 0 ? anteil.erreicht / anteil.gesamt : 0;
  const mitte = MASS / 2;
  return (
    <svg className="naechstes-ring" viewBox={`0 0 ${MASS} ${MASS}`} aria-hidden="true">
      <circle className="naechstes-ring-grund" cx={mitte} cy={mitte} r={RADIUS} />
      <circle
        className="naechstes-ring-wert"
        cx={mitte}
        cy={mitte}
        r={RADIUS}
        strokeDasharray={`${teil * UMFANG} ${UMFANG}`}
        transform={`rotate(${VIERTEL_DREHUNG} ${mitte} ${mitte})`}
      />
    </svg>
  );
}

/** Die Reihe; ohne Stück nichts. Beispiel: „Fünfzig Partien · 41 von 50“. */
export function AlsNaechstes({ stuecke }: { stuecke: readonly Erfolgsstueck[] }) {
  if (stuecke.length === 0) return null;
  return (
    <div className="erfolge-naechste" data-testid="erfolge-naechste">
      <h3>{t("profil.erfolge.naechstes")}</h3>
      <ul className="erfolge-reihe naechste-reihe">
        {stuecke.map((s) =>
          s.anteil ? (
            <li key={`${s.art}:${s.kennung}`} data-testid={`naechstes-${s.art}-${s.kennung}`}>
              <span className="naechstes-bild">
                <Fortschrittsring anteil={s.anteil} />
                <Stueckbild stueck={s} klasse="erfolg-klein" />
              </span>
              <span className="erfolg-name">{s.name}</span>
              <span className="erfolg-zahl">
                {t("fortschritt.anteil", { erreicht: s.anteil.erreicht, gesamt: s.anteil.gesamt })}
              </span>
            </li>
          ) : null,
        )}
      </ul>
    </div>
  );
}
