/**
 * Die Karten oben auf der Buch-Startseite (Gamifizierung G4): höchstens zwei aus STARTKARTEN.
 *
 * Rolle im Gesamtbild: Platz für die Pakete P1, P4, P6, P8, P12, P13 und spätere Karten; ohne
 * Eintrag zeigt die Komponente nichts. Die Auswahl rechnet startkarten.ts.
 * Abhängigkeiten: startkarten.ts, Speicher.
 */
import { useSpeicher } from "../../../speicher/speicher";
import { sichtbareKarten, STARTKARTEN } from "./startkarten";

/** Die sichtbaren Startkarten in ihrer Reihenfolge. */
export function Startkarten() {
  const daten = useSpeicher((z) => z.daten);
  const geladen = useSpeicher((z) => z.geladen);
  if (!geladen) return null;
  const karten = sichtbareKarten(STARTKARTEN, daten, new Date());
  if (karten.length === 0) return null;
  return (
    <section className="startkarten" data-testid="startkarten">
      {karten.map(({ kennung, Karte }) => (
        <Karte key={kennung} />
      ))}
    </section>
  );
}
