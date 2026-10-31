/**
 * Ringe mit Zeichen in der Mitte, darunter „x von y“, und die Zeichenerklärung zu ihnen.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (25.10.2026): Profil › Fortschritt zeigt neben den
 * Ringen für Abbildungen und Lernziele drei Ringe für die besiegten Bots je Zeitart. Mit einem
 * Namen unter jedem Ring wären es zu viele Wörter für 360 px; deshalb steht im Ring ein Zeichen
 * über der Prozentzahl, und eine Legende unter den Ringen sagt einmal, wofür jedes Zeichen steht.
 * Bildschirmleser hören am Ring selbst den vollen Namen mit „x von y“.
 * Unter einem Orden steht seit P9 (Gamifizierung) der Knopf „Teilen“ (teilen/Stueckteilen.tsx).
 * Abhängigkeiten: Kreisanzeige (Ring), teilen/Stueckteilen.tsx, speicher/fortschritt.ts
 * (Anteil), i18n, lucide-react.
 */
import type { LucideIcon } from "lucide-react";
import { t } from "../../../i18n/sprache";
import type { Anteil } from "../../../speicher/fortschritt";
import { Ring } from "../bausteine/Kreisanzeige";
import { Orden } from "../bausteine/Orden";
import { istVoll } from "./ringrechnung";
import { OrdenTeilen } from "../teilen/Stueckteilen";

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

/** Größe des Zeichens in der Legende (Bildpunkte). */
const LEGENDENZEICHEN = 16;

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
              {/* P9: ein verdienter Orden lässt sich als Bild teilen. */}
              {istVoll(ring.anteil) && <OrdenTeilen ring={ring.testid} name={ring.name} />}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * Die Zeichenerklärung zu allen Ringen der Karte: je Zeichen sein Name.
 * Beispiel: Kaffeetasse → „Klassisch“ (die Reihe darüber heißt „Vorgefertigte Bots besiegt“).
 */
export function Ringlegende({ ringe }: { ringe: readonly Symbolringangabe[] }) {
  return (
    <ul className="ringlegende" aria-label={t("fortschritt.legende")}>
      {ringe.map(({ name, legende, symbol: Zeichen, testid }) => (
        <li key={testid}>
          <Zeichen size={LEGENDENZEICHEN} aria-hidden="true" />
          <span>{legende ?? name}</span>
        </li>
      ))}
    </ul>
  );
}
