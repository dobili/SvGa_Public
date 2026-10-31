/**
 * Ringe mit Zeichen in der Mitte, darunter „x von y“, und die Zeichenerklärung zu ihnen.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (25.10.2026): Profil › Fortschritt zeigt neben den
 * Ringen für Abbildungen und Lernziele drei Ringe für die besiegten Bots je Zeitart. Mit einem
 * Namen unter jedem Ring wären es zu viele Wörter für 360 px; deshalb steht im Ring ein Zeichen
 * über der Prozentzahl, und eine Legende unter den Ringen sagt einmal, wofür jedes Zeichen steht.
 * Bildschirmleser hören am Ring selbst den vollen Namen mit „x von y“.
 * Unter einem Orden steht seit P9 (Gamifizierung) der Knopf „Teilen“ (teilen/Stueckteilen.tsx).
 * Seit dem 31.10.2026 öffnet ein Tipp auf Ring oder Orden das Infofenster mit Bedingung und Stand
 * (erfolge/Infofenster.tsx; Wunsch des Autors: Die Orden zeigten vorher gar keine Bedingung).
 * Abhängigkeiten: Kreisanzeige (Ring), teilen/Stueckteilen.tsx, erfolge/Infofenster.tsx,
 * erfolge/erfolgsstuecke.ts, speicher/fortschritt.ts (Anteil), i18n, lucide-react.
 */
import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import { t } from "../../../i18n/sprache";
import type { Anteil } from "../../../speicher/fortschritt";
import { Ring } from "../bausteine/Kreisanzeige";
import { Orden } from "../bausteine/Orden";
import { istVoll } from "./ringrechnung";
import { OrdenTeilen } from "../teilen/Stueckteilen";
import { ordenAusRing } from "../erfolge/erfolgsstuecke";
import { Infofenster } from "../erfolge/Infofenster";

/**
 * Ein Ring der Reihe: Name (zum Vorlesen, und in der Legende, wenn `legende` fehlt), kurzer
 * Legendentext, Zeichen, Anteil, Prüfkennung.
 */
export interface Symbolringangabe {
  readonly name: string;
  readonly legende?: string;
  readonly symbol: LucideIcon;
  readonly anteil: Anteil;
  readonly testid: string;
}

/**
 * Eine Reihe von Ringen mit Zeichen, je Ring „x von y“ darunter; mit `titel` eine kleine
 * Überschrift darüber. Beispiel: Blitz 2 von 72 → Ring mit Blitz-Zeichen, „3%“ und „2 von 72“.
 */
export function Symbolringreihe({
  ringe,
  titel,
}: {
  ringe: readonly Symbolringangabe[];
  titel?: string;
}) {
  const [offen, setzeOffen] = useState<Symbolringangabe | null>(null);
  if (ringe.length === 0) return null;
  return (
    <div className="symbolringe">
      {titel && <h3 className="symbolringe-titel">{titel}</h3>}
      <ul className="symbolringe-reihe">
        {ringe.map((ring) => {
          const wert = t("fortschritt.anteil", {
            erreicht: ring.anteil.erreicht,
            gesamt: ring.anteil.gesamt,
          });
          return (
            <li key={ring.testid} className="symbolring">
              <button
                type="button"
                className="symbolring-knopf"
                aria-haspopup="dialog"
                aria-label={`${ring.name}: ${wert}`}
                onClick={() => setzeOffen(ring)}
              >
                {istVoll(ring.anteil) ? (
                  <Orden
                    symbol={ring.symbol}
                    beschriftung={t("orden.name", { name: ring.name })}
                    ring={ring.testid}
                  />
                ) : (
                  <Ring
                    anteil={ring.anteil}
                    beschriftung={`${ring.name}: ${wert}`}
                    symbol={ring.symbol}
                  />
                )}
                <span data-testid={ring.testid} aria-hidden="true">
                  {wert}
                </span>
              </button>
              {/* P9: ein verdienter Orden lässt sich als Bild teilen. */}
              {istVoll(ring.anteil) && <OrdenTeilen ring={ring.testid} name={ring.name} />}
            </li>
          );
        })}
      </ul>
      {offen && (
        <Infofenster stuecke={[ordenAusRing(offen)]} beiSchliessen={() => setzeOffen(null)} />
      )}
    </div>
  );
}
