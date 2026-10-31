/**
 * Karte „Einstellungen“ unter der Brettvorschau: die übrigen Einstellungen in drei Reitern
 * (Bedienung, Anzeige, Hilfe), je Einstellung eine Zeile.
 *
 * Rolle im Gesamtbild: Pflichtenheft 4 „Einstellungen: Sprache, Brettfarben, Figurensatz, Ton,
 * Auflage des Buches, …“. Seit dem Entwurf K2 „Brettvorschau oben“ (Wahl des Autors, 31.10.2026):
 * - Brett (Farben, Figuren, Koordinaten) steht nicht mehr in einem Reiter, sondern groß oben
 *   (Brettstudio.tsx),
 * - Bedienung: Wischen, Gleiten, Ton, Feiereffekte, Startbild (schalterzeilen.tsx),
 * - Anzeige: Nachtmodus, Schriftgröße, Sprache (anzeigezeilen.tsx),
 * - Hilfe: Toursymbol, Rundgang, Erklärkacheln (schalterzeilen.tsx),
 * - Bots und der Maßstab der Wertung haben eine eigene Seite (einstellungsseiten.ts).
 * Ein neuer Reiter ist ein Eintrag in `REITER` (einstellungsreiter.ts, eintragen statt umbauen). Beim Öffnen steht
 * „Bedienung“ vorn.
 * Abhängigkeiten: Reiter, einstellungsreiter, i18n.
 */
import { useState } from "react";
import { t } from "../../../i18n/sprache";
import { Reiter } from "../bausteine/Reiter";
import { REITER } from "./einstellungsreiter";

/** Die Reiter mit ihren Zeilen; der erste ist beim Öffnen gewählt. */
export function EinstellungenKarte() {
  const [bereich, setzeBereich] = useState(REITER[0]?.wert ?? "");
  const gewaehlt = REITER.find((r) => r.wert === bereich);
  return (
    <section className="einstellungsreiter" data-testid="darstellung">
      <Reiter
        name={t("einstellungenneu.reiter")}
        eintraege={REITER.map((r) => ({ wert: r.wert, text: t(r.text), tour: r.tour }))}
        gewaehlt={bereich}
        beiWahl={setzeBereich}
      />
      <div className="einstellungsliste" role="tabpanel">
        {gewaehlt && <gewaehlt.Inhalt key={gewaehlt.wert} />}
      </div>
    </section>
  );
}
