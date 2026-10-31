/**
 * Bildschirm „Dein Oktober“ (Gamifizierung P12): der Monatsrückblick mit allen sichtbaren
 * Abschnitten aus RUECKBLICKABSCHNITTE.
 *
 * Rolle im Gesamtbild: Eingetragen in app/zusatzansichten.ts unter „rueckblick“; der Wert ist der
 * Monat („2026-10“). Ohne gültigen Wert zeigt er den Vormonat. Wer den Rückblick des Vormonats
 * öffnet, sieht die Startkarte nicht mehr (Merker „rueckblickGesehen“). Neue Abschnitte kommen
 * über die Liste dazu; dieser Bildschirm bleibt unverändert.
 * Abhängigkeiten: rueckblick/rueckblickabschnitte.ts, rueckblickMerker.ts, training/rueckblick.ts,
 * Kopfzeile, Speicher, i18n.
 */
import { useEffect, useMemo } from "react";
import { t } from "../../i18n/sprache";
import { useSpeicher } from "../../speicher/speicher";
import { monatAusSchluessel, monatVon, vormonat } from "../../training/rueckblick";
import { Kopfzeile } from "../komponenten/rahmen/Kopfzeile";
import { monatMitJahr, monatsname } from "../komponenten/rueckblick/monatstext";
import {
  RUECKBLICKABSCHNITTE,
  sichtbareRueckblickabschnitte,
} from "../komponenten/rueckblick/rueckblickabschnitte";
import { merkeRueckblickGesehen } from "../komponenten/rueckblick/rueckblickMerker";

/** Der Bildschirm. */
export function Rueckblick({ wert }: { readonly wert: string | null }) {
  const daten = useSpeicher((z) => z.daten);
  const monat = useMemo(() => monatAusSchluessel(wert) ?? vormonat(monatVon(new Date())), [wert]);
  useEffect(() => merkeRueckblickGesehen(monat, new Date()), [monat]);
  const angabe = { daten, monat };
  const abschnitte = sichtbareRueckblickabschnitte(RUECKBLICKABSCHNITTE, angabe);
  return (
    <div className="bildschirm" data-testid="rueckblick">
      <Kopfzeile
        titel={t("rueckblick.titel", { monat: monatsname(monat) })}
        zurueckText={t("rueckblick.zurueck")}
      />
      <section className="karte rueckblick">
        <p className="hinweis">{monatMitJahr(monat)}</p>
        {abschnitte.map(({ kennung, Abschnitt }) => (
          <Abschnitt key={kennung} angabe={angabe} />
        ))}
      </section>
    </div>
  );
}
