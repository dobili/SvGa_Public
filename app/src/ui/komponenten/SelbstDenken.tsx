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
 * Seit 0.2.117 (NA1, Wunsch des Autors): Nach der Einschätzung steht das Urteil der Engine; eine
 * richtige Einschätzung merkt sich die App, dort sind die Werkzeuge beim nächsten Mal gleich da.
 * Abhängigkeiten: useSelbstDenken.ts, useEngineEinschaetzung.ts, app/einstellungen.ts,
 * speicher/fortschritt.ts, engine/wertInWorten.ts, i18n.
 */
import { useEffect, useState } from "react";
import { useEinstellungen } from "../../app/einstellungen";
import type { Wert } from "../../engine/uci";
import { GRENZE_AUSGEGLICHEN, wertAlsZahl, wertInWorten } from "../../engine/wertInWorten";
import { t } from "../../i18n/sprache";
import { notiereEinschaetzung } from "../../speicher/fortschritt";
import { aendere } from "../../speicher/speicher";
import { Segmentwahl } from "./Segmentwahl";
import { useEngineEinschaetzung } from "./useEngineEinschaetzung";
import { EINSCHAETZUNGEN, type Denkstand, type Einschaetzung } from "./useSelbstDenken";

/** Die Karte vor den Werkzeugen: drei Einschätzungen und „Ich habe nachgedacht“. */
export function SelbstDenkenKarte({ stand }: { stand: Denkstand }) {
  const { strenge } = useEinstellungen();
  const [wahl, setzeWahl] = useState<Einschaetzung | null>(null);
  const streng = strenge === "streng";
  return (
    <section className="karte selbstdenken" data-testid="selbstdenken" data-tour="selbstdenken">
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

/**
 * Die Worte der Engine sagen schon „leicht besser“, der Vergleich zählt aber noch „ausgeglichen“
 * (zwischen 0,3 und 0,5 Bauern): Dann erklärt ein Satz die Grenze.
 */
function imGrenzbereich(urteil: { wert: Wert; urteil: Einschaetzung }): boolean {
  return (
    urteil.urteil === "gleich" &&
    urteil.wert.art === "bauern" &&
    Math.abs(urteil.wert.bauern) > GRENZE_AUSGEGLICHEN
  );
}

/**
 * Nach der Freigabe: die eigene Einschätzung und das Urteil der Engine (NA1). Stimmen beide
 * überein (ausgeglichen bis ±0,5 Bauern), merkt sich die App die Abbildung.
 * Beispiel: Abb. 1.26, „ausgeglichen“, Engine +0,3 → „stimmt“, beim nächsten Mal gleich frei.
 * Sonderfall: Ohne gewählte Einschätzung (Einstellung „locker“) steht nichts da.
 */
export function EigeneEinschaetzung({ stand }: { stand: Denkstand }) {
  const urteil = useEngineEinschaetzung(stand.einschaetzung ? stand.fen : null);
  const richtig = urteil?.art === "fertig" && urteil.urteil === stand.einschaetzung;
  const { kennung } = stand;
  useEffect(() => {
    if (richtig) void aendere((d) => notiereEinschaetzung(d, kennung, new Date()));
  }, [richtig, kennung]);
  if (!stand.einschaetzung || !urteil) return null;
  const deine = t(`selbstdenken.${stand.einschaetzung}`);
  return (
    <p className="hinweis" data-testid="eigene-einschaetzung" aria-live="polite">
      {t("selbstdenken.deineKurz", { urteil: deine })}{" "}
      {urteil.art === "rechnet" && t("selbstdenken.engineRechnet")}
      {urteil.art === "fehler" && t("selbstdenken.engineFehler")}
      {urteil.art === "fertig" &&
        t(richtig ? "selbstdenken.stimmt" : "selbstdenken.stimmtNicht", {
          worte: wertInWorten(urteil.wert),
          zahl: wertAlsZahl(urteil.wert),
          engine: t(`selbstdenken.${urteil.urteil}`),
        })}
      {urteil.art === "fertig" && imGrenzbereich(urteil) && ` ${t("selbstdenken.grenze")}`}
    </p>
  );
}
