/**
 * Karte „Heute“ oben im Buch (Gestaltung A2 nach Wahl des Autors, 31.10.2026): Tageskette der
 * Woche mit „3 von 4 Tagen“, darunter der nächste Schritt als große Kachel mit zwei kleinen
 * Alternativen und die Abschnitte der Woche als Reiter.
 *
 * Rolle im Gesamtbild: Ein Eintrag in STARTKARTEN (Rang 10) statt der früheren Karten „Dein
 * nächster Schritt“ (P1) und „Deine Woche“ (P4); so bleibt neben ihr Platz für den Monatsrückblick
 * (P12) oder den Rivalen (P8). Die Rechnung bleibt, wo sie war: Vorschläge in
 * training/naechsterSchritt.ts, Wochenziel in training/wochenziel.ts, Abschnitte in
 * wochenabschnitte.ts. Erreicht der Leser sein Ziel, hält die Karte die Woche im Feld `verdient`
 * fest und feiert einmal je Woche (Schalter „Feiereffekte“). Eine verpasste Woche wird nicht erwähnt.
 * Abhängigkeiten: Tageskette.tsx, Vorschlagskacheln.tsx, Wochenreiter.tsx, wochensichtbar.ts,
 * naechsterSchrittMerker.ts, Feuerwerk.tsx, Speicher, i18n.
 */
import { useState } from "react";
import { feiereffekteAn } from "../../../app/feiereffekte";
import { useSpeicher } from "../../../speicher/speicher";
import { vorschlaege } from "../../../training/naechsterSchritt";
import { wochenlage } from "../../../training/wochenziel";
import { Feuerwerk } from "../bausteine/Feuerwerk";
import { Heutekopf, Wochenmeldung } from "./Heutekopf";
import { useLage } from "./naechsterLage";
import { blendeNaechsterSchrittAus, naechsterSchrittSichtbar } from "./naechsterSchrittMerker";
import { Tageskette, Tageswahl } from "./Tageskette";
import { useWochenfeier } from "./wochenfeier";
import { sichtbareAbschnitte, WOCHENABSCHNITTE } from "./wochenabschnitte";
import { merkeSpaeter, spaeterDieseWoche, wochenkarteSichtbar } from "./wochensichtbar";
import { Vorschlagskacheln } from "./Vorschlagskacheln";
import { Wochenreiter } from "./Wochenreiter";

/** Was die Karte gerade zeigt; reine Ableitung aus Daten, Tag und lokalem Zustand. */
function useHeuteZustand() {
  const daten = useSpeicher((z) => z.daten);
  const lage = useLage();
  const [aus, setzeAus] = useState(false);
  const [spaeter, setzeSpaeter] = useState(false);
  const [aendern, setzeAendern] = useState(false);
  const jetzt = new Date();
  const woche = wochenlage(daten, jetzt);
  const mitZiel = woche.ziel !== null;
  const wocheSichtbar = wochenkarteSichtbar(daten, jetzt) && !(spaeter && !mitZiel);
  const frageOffen = !mitZiel && !spaeter && !spaeterDieseWoche(jetzt) && wocheSichtbar;
  const liste = !aus && naechsterSchrittSichtbar(jetzt) && lage ? vorschlaege(lage) : [];
  const nichtJetzt = () => {
    blendeNaechsterSchrittAus(new Date());
    setzeAus(true);
  };
  const spaeterTippen = () => {
    merkeSpaeter(new Date());
    setzeSpaeter(true);
  };
  const abschnitte = wocheSichtbar ? sichtbareAbschnitte(WOCHENABSCHNITTE, daten, jetzt) : [];
  return {
    daten,
    woche,
    mitZiel,
    frageOffen,
    liste,
    abschnitte,
    aendern,
    setzeAendern,
    nichtJetzt,
    spaeterTippen,
  };
}

/** Die Karte; nichts, wenn weder Woche noch Vorschlag etwas zu zeigen haben. */
export function Heutekarte() {
  const z = useHeuteZustand();
  const feiern = useWochenfeier(z.daten, z.woche.montag);
  const wahl = z.frageOffen || z.aendern;
  if (!z.mitZiel && !wahl && z.liste.length === 0 && z.abschnitte.length === 0) return null;
  return (
    <article className="karte heutekarte" data-testid="heute" data-tour="buch-heute">
      {feiern && feiereffekteAn() && <Feuerwerk umfang="klein" />}
      <Heutekopf
        lage={z.woche}
        wahl={wahl}
        aendern={() => z.setzeAendern(true)}
        spaeter={z.mitZiel ? null : z.spaeterTippen}
      />
      {wahl && <Tageswahl aendern={z.aendern} fertig={() => z.setzeAendern(false)} />}
      {z.mitZiel && !z.aendern && (
        <>
          <Tageskette tage={z.woche.tage} />
          <Wochenmeldung daten={z.daten} lage={z.woche} />
        </>
      )}
      <Vorschlagskacheln liste={z.liste} nichtJetzt={z.nichtJetzt} />
      <Wochenreiter abschnitte={z.abschnitte} />
    </article>
  );
}
