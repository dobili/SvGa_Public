/**
 * Kreisanzeige: ein goldener Ring mit der Prozentzahl in der Mitte, darunter Name und „x von y“.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (18.10.2026): Fortschritt als Kreisdiagramm statt
 * Balken, in den Einstellungen und auf den Kapitelseiten. Für Bildschirmleser eine
 * Fortschrittsanzeige (role „progressbar“) mit Beschriftung.
 * Abhängigkeiten: speicher/fortschritt.ts (Typ Anteil), i18n.
 */
import type { ReactNode } from "react";
import { t } from "../../i18n/sprache";
import type { Anteil } from "../../speicher/fortschritt";

const PROZENT = 100;
const RADIUS = 16;
const STRICH = 4;
const MASS = 2 * (RADIUS + STRICH);
const UMFANG = 2 * Math.PI * RADIUS;
const VIERTEL_DREHUNG = -90;

/** Anteil in ganzen Prozent; ohne Gesamtzahl 0. */
function prozentVon(anteil: Anteil): number {
  return anteil.gesamt > 0 ? Math.round((anteil.erreicht / anteil.gesamt) * PROZENT) : 0;
}

/** Nur der Ring (ohne Beschriftung), etwa für Listen. */
export function Ring({
  anteil,
  beschriftung,
  klein = false,
}: {
  anteil: Anteil;
  beschriftung: string;
  klein?: boolean;
}) {
  const prozent = prozentVon(anteil);
  return (
    <svg
      className={klein ? "ring ring-klein" : "ring"}
      viewBox={`0 0 ${MASS} ${MASS}`}
      role="progressbar"
      aria-label={beschriftung}
      aria-valuemin={0}
      aria-valuemax={anteil.gesamt}
      aria-valuenow={anteil.erreicht}
    >
      <g transform={`rotate(${VIERTEL_DREHUNG} ${MASS / 2} ${MASS / 2})`}>
        <circle
          className="ring-grund"
          cx={MASS / 2}
          cy={MASS / 2}
          r={RADIUS}
          strokeWidth={STRICH}
        />
        <circle
          className="ring-fuellung"
          cx={MASS / 2}
          cy={MASS / 2}
          r={RADIUS}
          strokeWidth={STRICH}
          strokeDasharray={`${(prozent / PROZENT) * UMFANG} ${UMFANG}`}
        />
      </g>
      {!klein && (
        <text className="ring-zahl" x="50%" y="50%" dominantBaseline="central" textAnchor="middle">
          {prozent}%
        </text>
      )}
    </svg>
  );
}

/**
 * Eine Kachel mit Ring, Name und „x von y“.
 * Beispiel: Abbildungen angesehen, 12 von 40 → Ring mit 30 %.
 */
export function Kreisanzeige({
  name,
  anteil,
  testid,
  children,
}: {
  name: string;
  anteil: Anteil;
  testid?: string;
  children?: ReactNode;
}) {
  const wert = t("fortschritt.anteil", { erreicht: anteil.erreicht, gesamt: anteil.gesamt });
  return (
    <div className="kreisanzeige">
      <Ring anteil={anteil} beschriftung={`${name}: ${wert}`} />
      <div className="kreisanzeige-text">
        <span className="kreisanzeige-name">{name}</span>
        <span data-testid={testid}>{wert}</span>
        {children}
      </div>
    </div>
  );
}
