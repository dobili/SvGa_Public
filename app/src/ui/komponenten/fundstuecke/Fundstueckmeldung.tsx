/**
 * „Fundstück!“ am Ende einer Trainerrunde (Gamifizierung P10 b), eingetragen in NACH_DER_RUNDE
 * (ui/trainer/nachDerRunde.ts).
 *
 * Rolle im Gesamtbild: Jede fertige Runde eines Trainers mit Rundenrahmen fragt einmal, ob ein
 * Fundstück erscheint (training/fundstuecke.ts: selten, höchstens eins am Tag, nur nach mindestens
 * einer richtigen Antwort). Wenn ja, liegt es sofort im Speicher (Feld `fundstuecke`, Datum unter
 * `verdient`) und die Meldung zeigt die Karte mit dem Weg ins Album; sonst zeigt sie nichts.
 * Abhängigkeiten: training/fundstuecke.ts, speicher, app/navigationsKontext.ts, i18n.
 */
import { useContext, useEffect, useRef, useState } from "react";
import { NavigationsKontext } from "../../../app/navigationsKontext";
import { t } from "../../../i18n/sprache";
import { aendere, useSpeicher } from "../../../speicher/speicher";
import { findeFundstueck, fundstueck, FUNDSTUECKE } from "../../../training/fundstuecke";
import type { Rundenergebnis } from "../../trainer/nachDerRunde";
import { ALBUM } from "./album";
import { Fundstueckkarte } from "./Fundstueckkarte";

/** Sucht einmal je Runde ein Fundstück; die Kennung, sobald eins gefunden ist. */
function useFund(ergebnis: Rundenergebnis): string | null {
  const [kennung, setzeKennung] = useState<string | null>(null);
  const gefragt = useRef(false);
  useEffect(() => {
    // Nur einmal je Runde, auch wenn React die Wirkung doppelt ausführt (Entwicklungsmodus).
    if (gefragt.current) return;
    gefragt.current = true;
    const fund: { kennung: string | null } = { kennung: null };
    void aendere((daten) => {
      const ergebnisFund = findeFundstueck(daten, ergebnis, new Date(), Math.random);
      fund.kennung = ergebnisFund.kennung;
      return ergebnisFund.daten;
    }).then(() => setzeKennung(fund.kennung));
  }, [ergebnis]);
  return kennung;
}

/** Die Meldung am Rundenende; ohne Fund nichts. */
export function Fundstueckmeldung({ ergebnis }: { readonly ergebnis: Rundenergebnis }) {
  const kennung = useFund(ergebnis);
  const anzahl = useSpeicher((z) => z.daten.fundstuecke.length);
  // Außerhalb der Navigation (Komponententests) gibt es keinen Knopf zum Album.
  const navigation = useContext(NavigationsKontext);
  const fund = kennung === null ? undefined : fundstueck(kennung);
  if (!fund) return null;
  return (
    <div className="fundstueck-meldung" role="status" data-testid="fundstueck-meldung">
      <p className="fundstueck-titel">{t("fundstueck.titel")}</p>
      <Fundstueckkarte fund={fund} />
      <p className="hinweis">{t("fundstueck.insAlbum", { anzahl, gesamt: FUNDSTUECKE.length })}</p>
      {navigation && (
        <button
          type="button"
          className="knopf-zweit"
          onClick={() => navigation.navigiere({ bildschirm: "zusatz", kennung: ALBUM })}
        >
          {t("fundstueck.zumAlbum")}
        </button>
      )}
    </div>
  );
}
