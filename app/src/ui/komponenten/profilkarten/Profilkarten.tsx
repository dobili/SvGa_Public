/**
 * Die Karten der Pakete im Profil (Gamifizierung G4), alle sichtbaren nach Rang.
 * Abhängigkeiten: profilkarten.ts, Speicher.
 */
import { useSpeicher } from "../../../speicher/speicher";
import { PROFILKARTEN } from "./profilkarten";

/** Die sichtbaren Profilkarten; ohne Eintrag nichts. */
export function Profilkarten() {
  const daten = useSpeicher((z) => z.daten);
  const karten = PROFILKARTEN.filter((k) => k.sichtbar(daten)).sort((a, b) => a.rang - b.rang);
  if (karten.length === 0) return null;
  return (
    <>
      {karten.map(({ kennung, Karte }) => (
        <Karte key={kennung} />
      ))}
    </>
  );
}
