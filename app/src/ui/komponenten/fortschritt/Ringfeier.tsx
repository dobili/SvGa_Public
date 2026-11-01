/**
 * Gratulation, wenn ein Ring des Fortschritts voll wird (Wunsch des Autors, 25.10.2026: „wenn man
 * eine von diesen Ringdiagrammen voll bekommt, dass dann so ein Pop-up kommt“), im Stil der
 * Freischaltung des Gruppenmodus: Feuerwerk, Feierton, goldene Karte; dazu der neue Orden, in den
 * sich der volle Ring verwandelt (Wunsch des Autors, 26.10.2026).
 *
 * Rolle im Gesamtbild: Liegt in der Hülle der App (app/App.tsx) und erscheint auf jedem
 * Bildschirm, sobald ein Ring voll ist (Buch, Teile des Buches, Bündel der Bots;
 * fortschrittsringe.ts). Je Ring nur einmal (Merker auf dem Gerät, dazu das Datum in „verdient“,
 * das mit der Datensicherung umzieht); wer einen Ring schon voll
 * hatte, bevor es die Gratulation gab, bekommt sie beim ersten Start einmal nachgereicht.
 * Danach zeigt sie die schlichtere Meldung neuer Abzeichen und Stufen (Abzeichenmeldung.tsx), damit
 * die Hülle der App dafür keinen eigenen Platz braucht.
 * Abhängigkeiten: fortschrittsringe.ts (Ringe), Abzeichenmeldung.tsx, Gruppenmodus.tsx (Feierton), Feuerwerk.tsx,
 * app/merker.ts, teilen/Stueckteilen.tsx (Teilen des neuen Ordens, P9), i18n, lucide-react.
 */
import { useId, useState } from "react";
import { t } from "../../../i18n/sprache";
import { Feuerwerk } from "../bausteine/Feuerwerk";
import { Orden } from "../bausteine/Orden";
import { Abzeichenmeldung } from "./Abzeichenmeldung";
import { useFeierdialog } from "../bausteine/useFeierdialog";
import { merkeGefeiert, offeneRinge, useFortschrittsringe } from "./fortschrittsringe";
import type { Symbolringangabe } from "./Symbolringe";
import { useOrdenprobe } from "./ordenprobe";
import { useSpeicher } from "../../../speicher/speicher";
import { Feierton } from "../gegner/Gruppenmodus";
import { OrdenTeilen } from "../teilen/Stueckteilen";

/**
 * Zeigt die Gratulation für den ersten vollen Ring, der noch keine hatte; „Weiter“ schließt sie,
 * danach kommt der nächste. Beispiel: letzte Abbildung angesehen → „Ring voll! Abbildungen
 * angesehen: alle 850 geschafft.“
 */
export function Ringfeier() {
  const ringe = useFortschrittsringe();
  const verdient = useSpeicher((z) => z.daten.verdient);
  const probe = useOrdenprobe();
  const [geschlossen, setzeGeschlossen] = useState<readonly string[]>([]);
  if (!ringe) return null;
  const alle = [...ringe.buchringe, ...ringe.teilringe, ...ringe.botringe];
  const offen = offeneRinge(alle, undefined, verdient, probe).filter(
    (r) => !geschlossen.includes(r.testid),
  );
  const ring = offen[0];
  // Ohne offene Gratulation zu einem Ring kommt die Meldung neuer Abzeichen (nie beide zugleich).
  if (!ring) return <Abzeichenmeldung />;
  const weiter = () => {
    merkeGefeiert(ring.testid);
    setzeGeschlossen([...geschlossen, ring.testid]);
  };
  return <Ringkarte key={ring.testid} ring={ring} weiter={weiter} />;
}

/** Die Karte zu einem Ring als modaler Dialog: Fokus auf „Weiter“, Esc wie „Weiter“. */
function Ringkarte({ ring, weiter }: { ring: Symbolringangabe; weiter: () => void }) {
  const titel = useId();
  const { knopf, tasten } = useFeierdialog(ring.testid, weiter);
  return (
    <div
      className="gruppen-gratulation"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titel}
      data-testid="ringfeier"
      onKeyDown={tasten}
    >
      <Feuerwerk />
      <Feierton />
      <div className="gruppen-gratulation-karte">
        <Orden
          symbol={ring.symbol}
          beschriftung={t("orden.name", { name: ring.name })}
          klasse="orden-gross"
          ring={ring.testid}
        />
        <h2 id={titel}>{t("ringfeier.titel")}</h2>
        <p>{t("ringfeier.text", { name: ring.name, gesamt: String(ring.anteil.gesamt) })}</p>
        <OrdenTeilen ring={ring.testid} name={ring.name} heute klein={false} />
        <button ref={knopf} type="button" className="knopf-haupt" onClick={weiter}>
          {t("ringfeier.weiter")}
        </button>
      </div>
    </div>
  );
}
