/**
 * Kreisanzeige: ein goldener Ring mit der Prozentzahl in der Mitte, darunter Name und „x von y“.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (18.10.2026): Fortschritt als Kreisdiagramm statt
 * Balken, in den Einstellungen und auf den Kapitelseiten. Für Bildschirmleser eine
 * Fortschrittsanzeige (role „progressbar“) mit Beschriftung. Seit 25.10.2026 kann ein Zeichen in
 * der Mitte stehen, die Prozentzahl dann kleiner darunter (Profil › Fortschritt, Wunsch des Autors).
 * Abhängigkeiten: speicher/fortschritt.ts (Typ Anteil), i18n, lucide-react (Typ des Zeichens).
 */
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { t } from "../../i18n/sprache";
import type { Anteil } from "../../speicher/fortschritt";

const PROZENT = 100;
const RADIUS = 16;
const STRICH = 4;
const MASS = 2 * (RADIUS + STRICH);
const UMFANG = 2 * Math.PI * RADIUS;
const VIERTEL_DREHUNG = -90;
/** Zeichen in der Mitte (Einheiten des Rings): Größe und Oberkante; die Zahl steht darunter. */
const ZEICHEN_MASS = 12;
const ZEICHEN_OBEN = 9;
const ZAHL_UNTER_ZEICHEN_Y = 27;

/** Anteil in ganzen Prozent; ohne Gesamtzahl 0. */
function prozentVon(anteil: Anteil): number {
  return anteil.gesamt > 0 ? Math.round((anteil.erreicht / anteil.gesamt) * PROZENT) : 0;
}

/**
 * Nur der Ring (ohne Beschriftung), etwa für Listen. `symbol`: Zeichen in der Mitte, die
 * Prozentzahl steht dann kleiner darunter. Beispiel: Blitz, 2 von 72 → Blitz-Zeichen über „3%“.
 */
export function Ring({
  anteil,
  beschriftung,
  klein = false,
  symbol: Zeichen,
}: {
  anteil: Anteil;
  beschriftung: string;
  klein?: boolean;
  symbol?: LucideIcon;
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
      {!klein && Zeichen && (
        <>
          <Zeichen
            className="ring-zeichen"
            x={(MASS - ZEICHEN_MASS) / 2}
            y={ZEICHEN_OBEN}
            width={ZEICHEN_MASS}
            height={ZEICHEN_MASS}
            aria-hidden="true"
          />
          <text
            className="ring-zahl ring-zahl-unten"
            x="50%"
            y={ZAHL_UNTER_ZEICHEN_Y}
            dominantBaseline="central"
            textAnchor="middle"
          >
            {prozent}%
          </text>
        </>
      )}
      {!klein && !Zeichen && (
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
