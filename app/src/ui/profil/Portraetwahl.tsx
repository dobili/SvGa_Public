/**
 * Porträtwahl mit drei Wegen: aus den 30 Porträts auswählen (nach Altersgruppen), selbst gestalten
 * (Baukasten.tsx) oder kein Bild (seit 0.2.140, Wunsch des Autors vom 25.10.2026).
 *
 * Rolle im Gesamtbild: Gemeinsam für das Profil des Lesers (ProfilEditor.tsx) und eigene Bots
 * (GegnerEditor.tsx); ersetzt dort das Aufklappmenü PortraetAuswahl.tsx (0.2.100 bis 0.2.139).
 * Den Zustand hält usePortraetwahl (portraetwahlZustand.ts), damit der Aufrufer das Ergebnis
 * für Vorschau und Speichern kennt.
 * Abhängigkeiten: portraetwahlZustand.ts, Baukasten, Auswahl, engine/portraetwahl.ts, i18n.
 */
import { ALTERSGRUPPEN, PORTRAETWAHL, type Portraetkennung } from "../../engine/portraetwahl";
import { t } from "../../i18n/sprache";
import { Auswahl } from "../komponenten/Auswahl";
import { portraet } from "../komponenten/gegnerportraet";
import { Baukasten } from "./Baukasten";
import type { Portraetwahlzustand } from "./portraetwahlZustand";

/** Gitter der 30 Porträts nach Altersgruppen; ein Tipp wählt. */
function Portraetgitter({
  titel,
  gewaehlt,
  beiWahl,
}: {
  titel: string;
  gewaehlt: Portraetkennung | null;
  beiWahl: (kennung: Portraetkennung) => void;
}) {
  return (
    <div className="portraetliste" role="radiogroup" aria-label={titel}>
      {ALTERSGRUPPEN.map((gruppe) => (
        <div key={gruppe} className="portraetgruppe">
          <span className="portraetgruppe-titel">{t(`portraet.gruppe.${gruppe}`)}</span>
          <div className="portraetgitter">
            {PORTRAETWAHL.filter((p) => p.gruppe === gruppe).map((p) => (
              <button
                key={p.kennung}
                type="button"
                role="radio"
                aria-checked={gewaehlt === p.kennung}
                aria-label={t(`portraet.${p.kennung}`)}
                title={t(`portraet.${p.kennung}`)}
                className="portraetkachel"
                onClick={() => beiWahl(p.kennung)}
              >
                <img className="gegner-portraet" src={portraet(p.kennung)} alt="" />
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Art, Gitter oder Baukasten. `titel`: Name der Gruppe („Dein Porträt“, „Porträt“).
 * Beispiel: „Selbst gestalten“ → Baukasten; jede Änderung baut die Vorschau neu.
 */
export function Portraetwahl({ zustand, titel }: { zustand: Portraetwahlzustand; titel: string }) {
  return (
    <div className="portraetwahl-teil" data-testid="portraetwahl">
      <Auswahl
        name={titel}
        werte={["wahl", "bau", "keins"] as const}
        gewaehlt={zustand.art}
        text={(a) => t(`profil.bildart.${a}`)}
        beiWahl={zustand.setzeArt}
      />
      {zustand.art === "wahl" && (
        <Portraetgitter titel={titel} gewaehlt={zustand.wahl} beiWahl={zustand.setzeWahl} />
      )}
      {zustand.art === "bau" && <Baukasten werte={zustand.werte} beiWahl={zustand.setzeWerte} />}
    </div>
  );
}
