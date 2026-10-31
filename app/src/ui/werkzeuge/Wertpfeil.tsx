/**
 * Veränderung einer Bewertung als Pfeil mit Zahl: „▲ 0,67“ grün, „▼ 11,6“ rot, „= 0,10“ grau.
 *
 * Rolle im Gesamtbild: Regel aus den Notizen des Autors zur Runde „Weniger Text“ (31.10.2026):
 * Eine Veränderung zeigt man als Pfeil mit Zahl, nicht als Balken mit Zahl links und rechts.
 * Genutzt bei den Kandidaten (P10) und bei „Falle oder Köder“ (P12, Verlust beim Nehmen).
 * Der Bildschirmleser bekommt den ganzen Satz („verschlechtert die Stellung um 3,44“).
 * Abhängigkeiten: keine außer React.
 */

/** Richtung der Veränderung aus Sicht des Lesers. */
export type Wertrichtung = "auf" | "ab" | "gleich";

const ZEICHEN: Readonly<Record<Wertrichtung, string>> = { auf: "▲", ab: "▼", gleich: "=" };

/**
 * Pfeil und Zahl in der Farbe der Richtung.
 * Beispiel: <Wertpfeil richtung="ab" zahl="11,6" name="Verlust 11,6 Bauern" /> → „▼ 11,6“ rot.
 */
export function Wertpfeil({
  richtung,
  zahl,
  name,
}: {
  richtung: Wertrichtung;
  zahl: string;
  /** Der ganze Satz für Bildschirmleser. */
  name: string;
}) {
  return (
    <span className={`wertpfeil wertpfeil-${richtung}`} role="img" aria-label={name}>
      <span aria-hidden="true">
        {ZEICHEN[richtung]} {zahl}
      </span>
    </span>
  );
}
