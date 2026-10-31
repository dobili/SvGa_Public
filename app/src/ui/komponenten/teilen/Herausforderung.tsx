/**
 * Bildschirm einer Herausforderung (Gamifizierung P9): öffnet die Aufgabe aus einem geteilten Link
 * „#aufgabe-<trainer>-<aufgabe>“.
 *
 * Rolle im Gesamtbild: Eingetragen in app/zusatzansichten.ts unter „herausforderung“; der Sprung
 * (herausforderungen.ts) gibt Trainer und Aufgabe als Wert „taktik:l-1Vybh“ mit. Der Bildschirm
 * zeigt Kopfzeile und Einladung; die Aufgabe selbst zeigt der Eintrag des Trainers in
 * HERAUSFORDERUNGEN.
 * Abhängigkeiten: herausforderungen.ts, herausforderungslink.ts, Kopfzeile, i18n.
 */
import { t } from "../../../i18n/sprache";
import { Kopfzeile } from "../rahmen/Kopfzeile";
import { herausforderungsart } from "./herausforderungen";
import { ausAnsichtswert } from "./herausforderungslink";

/** Der Bildschirm. Beispiel: wert „taktik:l-1Vybh“ → die Lichess-Aufgabe 1Vybh im Taktiktrainer. */
export function Herausforderung({ wert }: { readonly wert: string | null }) {
  const ziel = ausAnsichtswert(wert);
  const art = ziel ? herausforderungsart(ziel.trainer) : undefined;
  return (
    <div className="bildschirm bildschirm-trainer" data-testid="herausforderung">
      <Kopfzeile titel={t("teilen.titel")} zurueckText={t("trainer.zurueck")} />
      {ziel && art ? (
        <art.Aufgabe aufgabe={ziel.aufgabe} />
      ) : (
        <p className="hinweis">{t("teilen.unbekannt")}</p>
      )}
    </div>
  );
}
