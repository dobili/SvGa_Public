/**
 * „Erst selbst denken“ an den Abbildungen: zuerst die eigene Einschätzung, dann Werkzeuge und
 * Engine.
 *
 * Rolle im Gesamtbild: Pflichtenheft 4 und 5.1 („erst selbst denken, dann die Hilfe“), Wunsch des
 * Autors vom 18.10.2026: den Modus der Übungen auf die Werkzeuge ausweiten. Die Karte steht im
 * Abbildung-Bildschirm an der Stelle der Werkzeugleiste, solange die Einstellung „Auch vor
 * Werkzeugen und Engine“ an ist und der Leser diese Abbildung noch nicht eingeschätzt hat.
 * Übungen und Trainer haben eigene Bildschirme und bleiben davon unberührt.
 * Bei „streng“ (Einstellung „Erst selbst denken“) muss der Leser eine Einschätzung wählen, bei
 * „locker“ genügt „Ich habe nachgedacht“.
 * Abhängigkeiten: useSelbstDenken.ts, app/einstellungen.ts, i18n.
 */
import { useState } from "react";
import { useEinstellungen } from "../../app/einstellungen";
import { t } from "../../i18n/sprache";
import { Segmentwahl } from "./Segmentwahl";
import { EINSCHAETZUNGEN, type Denkstand, type Einschaetzung } from "./useSelbstDenken";

/** Die Karte vor den Werkzeugen: drei Einschätzungen und „Ich habe nachgedacht“. */
export function SelbstDenkenKarte({ stand }: { stand: Denkstand }) {
  const { strenge } = useEinstellungen();
  const [wahl, setzeWahl] = useState<Einschaetzung | null>(null);
  const streng = strenge === "streng";
  return (
    <section className="karte selbstdenken" data-testid="selbstdenken">
      <h3>{t("selbstdenken.titel")}</h3>
      <p>{t("selbstdenken.frage")}</p>
      <Segmentwahl
        name={t("selbstdenken.frageKurz")}
        werte={EINSCHAETZUNGEN}
        gewaehlt={wahl}
        text={(e) => t(`selbstdenken.kurz.${e}`)}
        beiWahl={setzeWahl}
      />
      <button
        type="button"
        className="knopf-zweit"
        disabled={streng && wahl === null}
        onClick={() => stand.freigeben(wahl)}
      >
        {t("selbstdenken.weiter")}
      </button>
      {streng && wahl === null && <p className="hinweis">{t("selbstdenken.strengHinweis")}</p>}
    </section>
  );
}

/** Nach der Freigabe: die eigene Einschätzung zum Vergleich mit Werkzeugen und Engine. */
export function EigeneEinschaetzung({ einschaetzung }: { einschaetzung: Einschaetzung | null }) {
  if (!einschaetzung) return null;
  return (
    <p className="hinweis" data-testid="eigene-einschaetzung">
      {t("selbstdenken.deine", { urteil: t(`selbstdenken.${einschaetzung}`) })}
    </p>
  );
}
