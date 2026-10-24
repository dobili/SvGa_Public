/**
 * Einstellungen eines Gegners in vier Reitern: Stärke, Stil, Fehler, Blinde Flecken (seit 0.2.129,
 * Vorschlag DS39, vom Autor am 25.10.2026 freigegeben).
 *
 * Rolle im Gesamtbild: „Eigene Stufe“ (EigeneStufe.tsx) und „Eigene Bots“ (GegnerEditor.tsx)
 * zeigten Stufen, Spinnennetz, Fehlerarten, blinde Flecken und den erweiterten Modus untereinander,
 * zusammen rund sechs Bildschirme. Jetzt teilen sich beide denselben Rahmen mit Reitern wie die
 * Einstellungen; an „Fehler“ und „Blinde Flecken“ steht, wie viele an sind. Den Inhalt der Reiter
 * Stärke und Stil liefern die Aufrufer, weil die eigene Stufe ihre Stufen anders speichert.
 * Abhängigkeiten: Reiter, Fehlerprofil, Fleckenkacheln, engine/gegner.ts, i18n, lucide-react.
 */
import { ChartNoAxesColumnIncreasing, EyeOff, Radar, TriangleAlert } from "lucide-react";
import { useState, type ReactNode } from "react";
import type { EigenerGegner } from "../../engine/gegner";
import { t } from "../../i18n/sprache";
import { Fehlerprofil } from "./Fehlerprofil";
import { Fleckenkacheln } from "./Fleckenkacheln";
import { Reiter } from "./Reiter";

type Gegnerreiter = "staerke" | "stil" | "fehler" | "flecken";

/**
 * Reiterzeile und Inhalt. `staerke` und `stil` sind die Inhalte der ersten beiden Reiter; Fehler
 * und Flecken stellt `g` dar und ändert `setze`.
 * Beispiel: eigene Stufe mit 18 Fehlerarten an → Reiter „Fehler 18“.
 */
export function GegnerReiter({
  g,
  setze,
  staerke,
  stil,
}: {
  g: EigenerGegner;
  setze: (g: EigenerGegner) => void;
  staerke: ReactNode;
  stil: ReactNode;
}) {
  const [reiter, setzeReiter] = useState<Gegnerreiter>("staerke");
  const eintraege = [
    { wert: "staerke", text: t("spielen.reiter.staerke"), symbol: ChartNoAxesColumnIncreasing },
    { wert: "stil", text: t("spielen.reiter.stil"), symbol: Radar },
    {
      wert: "fehler",
      text: t("spielen.reiter.fehler", { anzahl: String(g.fehlerarten.length) }),
      symbol: TriangleAlert,
    },
    {
      wert: "flecken",
      text: t("spielen.reiter.flecken", { anzahl: String(g.blindeFlecken.length) }),
      symbol: EyeOff,
    },
  ] as const;
  return (
    <div className="gegnerreiter" data-testid="gegnerreiter">
      <Reiter
        name={t("spielen.reiter.name")}
        eintraege={eintraege}
        gewaehlt={reiter}
        beiWahl={setzeReiter}
      />
      <div className="reiterinhalt" role="tabpanel">
        {reiter === "staerke" && staerke}
        {reiter === "stil" && stil}
        {reiter === "fehler" && <Fehlerprofil g={g} setze={setze} />}
        {reiter === "flecken" && <Fleckenkacheln g={g} setze={setze} />}
      </div>
    </div>
  );
}
