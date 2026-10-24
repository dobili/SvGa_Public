/**
 * Balken der Genauigkeit je Phase und je Zugart (Strategie, Taktik) in der Auswertung (R56).
 *
 * Rolle im Gesamtbild: Wunsch des Autors (23.10.2026): unter dem großen Ring der Gesamtgenauigkeit
 * je Zeile das Symbol der App (Buch, Schwerter, Fahne, Kompass, Blitz), ein Balken auf einer
 * gemeinsamen Skala von 50 bis 100 % in der Farbe des Urteils, rechts Prozent, Urteilswort und
 * geschätzte Spielstärke. Ohne Züge oder ganz nach der Entscheidung bleibt der Balken grau.
 * Abhängigkeiten: spiel/genauigkeit.ts, zeilensymbole.ts, Auswertungssymbole.tsx, i18n.
 */
import { t, tZahl } from "../../i18n/sprache";
import { phasenurteil, type Seitenbilanz } from "../../spiel/genauigkeit";
import { Zeilenname } from "./Auswertungssymbole";
import { PHASENSYMBOLE } from "./zeilensymbole";

export interface Balkenzeile {
  readonly art: keyof typeof PHASENSYMBOLE;
  readonly b: Seitenbilanz;
}

/** Untere Grenze der Skala; darunter ist der Balken leer (alles unter 50 % ist „schwach“). */
const SKALA_UNTEN = 50;
const SKALA_BREITE = 50;
const PROZENT = 100;

/** Anteil der Balkenlänge 0 bis 100 für eine Genauigkeit. */
function laenge(genauigkeit: number): number {
  return Math.max(0, Math.min(PROZENT, ((genauigkeit - SKALA_UNTEN) / SKALA_BREITE) * PROZENT));
}

/** Rechte Spalte: „82 % · 1450“ und darunter „Sehr gut · 12 Züge“, oder ein Grund ohne Wertung. */
function Werte({ b }: { b: Seitenbilanz }) {
  if (b.zuege === 0 || b.genauigkeit === null) return <span className="balken-wert">–</span>;
  const prozent = t("spielstaerke.prozent", { wert: Math.round(b.genauigkeit) });
  if (b.innen === null) {
    return (
      <span className="balken-wert">
        <b>{prozent}</b>
        <small>{t("spielstaerke.nachEntscheidung")}</small>
      </span>
    );
  }
  const urteil = t(`spielstaerke.urteil.${phasenurteil(b.innen)}`);
  const zuege = tZahl("spielstaerke.zuegeKurz", b.zuege, { zuege: b.zuege });
  return (
    <span className="balken-wert">
      <b>
        {prozent}
        {b.schaetzung && ` · ${b.schaetzung.mitte}`}
      </b>
      <small>
        {urteil} · {zuege}
      </small>
    </span>
  );
}

/**
 * Die Balkenliste.
 * Beispiel: Mittelspiel 74 % → Balken zu 48 % gefüllt, gelb, „74 % · 1250“, darunter „Ungenau · 18 Züge“.
 */
export function Genauigkeitsbalken({ zeilen }: { zeilen: readonly Balkenzeile[] }) {
  return (
    <div className="genauigkeitsbalken">
      <ul>
        {zeilen.map(({ art, b }) => {
          const aktiv = b.zuege > 0 && b.genauigkeit !== null && b.innen !== null;
          const urteil = aktiv && b.innen !== null ? phasenurteil(b.innen) : "leer";
          return (
            <li key={art} className="balkenzeile" data-testid={`balken-${art}`}>
              <Zeilenname Symbol={PHASENSYMBOLE[art]} kinder={t(`spielstaerke.zeile.${art}`)} />
              <span className="balken-spur" aria-hidden="true">
                <span
                  className={`balken-fuellung ringfarbe-${urteil}`}
                  style={{
                    width: `${aktiv && b.genauigkeit !== null ? laenge(b.genauigkeit) : 0}%`,
                  }}
                />
              </span>
              <Werte b={b} />
            </li>
          );
        })}
      </ul>
      <div className="balken-skala" aria-hidden="true">
        <span>50 %</span>
        <span>75 %</span>
        <span>100 %</span>
      </div>
    </div>
  );
}
