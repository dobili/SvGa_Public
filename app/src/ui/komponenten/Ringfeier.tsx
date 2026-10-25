/**
 * Gratulation, wenn ein Ring des Fortschritts voll wird (seit 0.2.144, Wunsch des Autors
 * 25.10.2026: „wenn man eine von diesen Ringdiagrammen voll bekommt, dass dann so ein Pop-up
 * kommt“), im Stil der Freischaltung des Gruppenmodus: Feuerwerk, Feierton, goldene Karte.
 *
 * Rolle im Gesamtbild: Liegt in der Hülle der App (app/App.tsx) und erscheint auf jedem
 * Bildschirm, sobald ein Ring voll ist (Abbildungen angesehen, Lernziele, Trainer erstmals,
 * besiegte Bots je Zeitart). Je Ring nur einmal (Merker auf dem Gerät); wer einen Ring schon voll
 * hatte, bekommt die Gratulation beim ersten Start dieser Fassung einmal nachgereicht.
 * Abhängigkeiten: fortschrittsringe.ts (Ringe), Gruppenmodus.tsx (Feierton), Feuerwerk.tsx,
 * app/merker.ts, i18n, lucide-react.
 */
import { useState } from "react";
import { t } from "../../i18n/sprache";
import { Feuerwerk } from "./Feuerwerk";
import { merkeGefeiert, offeneRinge, useFortschrittsringe } from "./fortschrittsringe";
import { Feierton } from "./Gruppenmodus";

const SYMBOL_GROSS = 48;

/**
 * Zeigt die Gratulation für den ersten vollen Ring, der noch keine hatte; „Weiter“ schließt sie,
 * danach kommt der nächste. Beispiel: letzte Abbildung angesehen → „Ring voll! Abbildungen
 * angesehen: alle 850 geschafft.“
 */
export function Ringfeier() {
  const ringe = useFortschrittsringe();
  const [geschlossen, setzeGeschlossen] = useState<readonly string[]>([]);
  if (!ringe) return null;
  const offen = offeneRinge([...ringe.buchringe, ...ringe.botringe]).filter(
    (r) => !geschlossen.includes(r.testid),
  );
  const ring = offen[0];
  if (!ring) return null;
  const Symbol = ring.symbol;
  const weiter = () => {
    merkeGefeiert(ring.testid);
    setzeGeschlossen([...geschlossen, ring.testid]);
  };
  return (
    <div className="gruppen-gratulation" role="dialog" aria-modal="true" data-testid="ringfeier">
      <Feuerwerk />
      <Feierton />
      <div className="gruppen-gratulation-karte">
        <Symbol size={SYMBOL_GROSS} aria-hidden="true" className="gruppen-gratulation-symbol" />
        <h2>{t("ringfeier.titel")}</h2>
        <p>{t("ringfeier.text", { name: ring.name, gesamt: String(ring.anteil.gesamt) })}</p>
        <button type="button" className="knopf-haupt" onClick={weiter}>
          {t("ringfeier.weiter")}
        </button>
      </div>
    </div>
  );
}
