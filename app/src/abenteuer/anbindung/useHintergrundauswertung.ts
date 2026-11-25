/**
 * Auswertung einer Abenteuerpartie schon während des Spiels (Wunsch des Autors, 26.11.2026):
 * „Besprechen“ im Tagebuch soll nach der Partie sofort bereit sein, ohne Rechenphase.
 *
 * Rolle im Gesamtbild: dieselbe Auswertung wie in der Partie der App (ui/bildschirme/Partie.tsx):
 * useAuswertung rechnet im Hintergrund mit der eigenen Auswertungs-Engine; auf knappen Geräten nur,
 * solange der Spieler am Zug ist (auswertungImHintergrund), damit der Bot seinen Kern für sich hat
 * und seine Zugzeit nicht länger wird. Nach dem Ende übernimmt der Nachlauf (nachlauf.ts): Er rechnet
 * die letzten Stellungen auch dann zu Ende, wenn der Spieler schon in die Oberwelt gegangen ist, und
 * schreibt das Ergebnis mit mitWerten in den Partieeintrag. Beginnt eine neue Partie, halten
 * Nachläufe anderer Partien an. Gilt für jede Partie der Spielhülle (Wegsperren, Club, Turnier).
 * Kurzform und Kipppunkt rechnen auf derselben Auswertungs-Engine; die Hintergrundrechnung wartet,
 * solange diese beschäftigt ist (useAuswertung.ts, bewerteStellung).
 * Abhängigkeiten: ui/komponenten/auswertung/useAuswertung.ts, hintergrund.ts, nachlauf.ts.
 */
import { useEffect } from "react";
import { leserAmZug, type Partie } from "../../spiel/partie";
import { findePartie } from "../../speicher/partien";
import { speicherzustand, useSpeicher } from "../../speicher/speicher";
import { besprechbarePartie } from "../regeln/besprechung";
import {
  auswertungImHintergrund,
  kerneDesGeraets,
} from "../../ui/komponenten/auswertung/hintergrund";
import { starteNachlauf, stoppeNachlaeufe } from "../../ui/komponenten/auswertung/nachlauf";
import { useAuswertung } from "../../ui/komponenten/auswertung/useAuswertung";

/**
 * Rechnet die Auswertung der Partie im Hintergrund und nach dem Ende im Nachlauf.
 * Beispiel: Clubkampf gegen den Coach, der Spieler denkt nach → die Stellungen bis dahin sind
 * bewertet; nach dem Matt fehlen ein, zwei Stellungen, der Nachlauf rechnet sie in der Oberwelt.
 * Sonderfälle: Eine alte, schon ausgewertete Partie (Nachspielen aus „Meine Partien“) rechnet
 * nichts; eine Partie mit eigenen Regeln (Schach960, besprechbarePartie) auch nicht.
 */
export function useHintergrundauswertung(partie: Partie): void {
  const eintrag = useSpeicher(
    (z) => z.daten.spiel.partien.find((e) => e.partie.id === partie.id) ?? null,
  );
  const laeuft = partie.ende === null;
  // Schach960 und andere Regeln: keine Besprechung, also auch keine Rechnung dafür.
  const besprechbar = besprechbarePartie(partie.einstellung);
  // Während des Spiels der Hook; nach dem Ende der Nachlauf (eintrag null: kein zweites Rechnen hier).
  useAuswertung(
    partie,
    laeuft && besprechbar ? eintrag : null,
    besprechbar && auswertungImHintergrund(laeuft, leserAmZug(partie), kerneDesGeraets()),
  );
  const ausgewertet = (eintrag?.werte.length ?? 0) > 0;
  useEffect(() => {
    if (!besprechbar) return;
    if (laeuft) {
      stoppeNachlaeufe(partie.id);
      return;
    }
    void starteNachlauf(partie, ausgewertet);
    // Maßgeblich sind Kennung, Ende und ob schon ausgewertet; die Partie ändert sich nur mit ihnen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partie.id, laeuft, ausgewertet, besprechbar]);
  // Absicherung: Schließt das Brett, bevor der Hook das Ende gesehen hat (etwa „Zurück zur Stadt“
  // gleich nach der Wertung), fragt er beim Schließen den neuesten Stand ab.
  useEffect(() => {
    const id = partie.id;
    return () => nachlaufNachDemSchliessen(id);
  }, [partie.id]);
}

/**
 * Startet den Nachlauf, wenn die Partie inzwischen beendet und noch nicht ausgewertet ist (neuester
 * Stand im Speicher). Beispiel: Wegsperre S16, die Wertung nach zwölf Zügen beendet die Partie,
 * der Spieler geht sofort zurück → der Nachlauf rechnet die letzten Stellungen (läuft er schon,
 * startet kein zweiter).
 */
function nachlaufNachDemSchliessen(id: string): void {
  const spiel = speicherzustand().daten.spiel;
  const neueste = findePartie(spiel, id);
  if (!neueste?.ende || !besprechbarePartie(neueste.einstellung)) return;
  const eintrag = spiel.partien.find((e) => e.partie.id === id);
  void starteNachlauf(neueste, (eintrag?.werte.length ?? 0) > 0);
}
