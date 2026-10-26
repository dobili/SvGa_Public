/**
 * Einstellungen eines Gegners in vier Reitern: Stärke, Stil, Fehler, Blinde Flecken (seit 0.2.129,
 * Vorschlag DS39, vom Autor am 25.10.2026 freigegeben).
 *
 * Rolle im Gesamtbild: „Eigene Stufe“ (EigeneStufe.tsx) und „Eigene Bots“ (GegnerEditor.tsx)
 * zeigten Stufen, Spinnennetz, Fehlerarten, blinde Flecken und den erweiterten Modus untereinander,
 * zusammen rund sechs Bildschirme. Jetzt teilen sich beide denselben Rahmen mit Reitern wie die
 * Einstellungen; an „Fehler“ und „Blinde Flecken“ steht, wie viele an sind. Den Inhalt der Reiter
 * Stärke und Stil liefern die Aufrufer, weil die eigene Stufe ihre Stufen anders speichert.
 * Seit 0.2.135 zählen die Reiter Regler (höchstens neun) und Fleckengruppen (höchstens fünf).
 * Abhängigkeiten: Reiter, Fehlerprofil, Fleckennetz, fehlergruppen.ts, engine/gegner.ts, i18n,
 * lucide-react.
 */
import { ChartNoAxesColumnIncreasing, EyeOff, Radar, TriangleAlert } from "lucide-react";
import { useState, type ReactNode } from "react";
import type { EigenerGegner } from "../../../engine/gegner";
import { t } from "../../../i18n/sprache";
import { anzahlAn } from "./fehlergruppen";
import { Fehlerprofil, type Neutralwerden } from "./Fehlerprofil";
import { Fleckennetz } from "./Fleckennetz";
import { Gesamtstaerke } from "./Gesamtstaerke";
import { Reiter } from "../bausteine/Reiter";

type Gegnerreiter = "staerke" | "stil" | "fehler" | "flecken";

/**
 * Reiterzeile und Inhalt. `staerke` und `stil` sind die Inhalte der ersten beiden Reiter; Fehler
 * und Flecken stellt `g` dar und ändert `setze`.
 * `wann`: ob ältere Einstellungen gestrichener Arten beim Speichern oder beim Ändern neutral werden.
 * Beispiel: neuer Gegner → Reiter „Fehler (9)“ und „Flecken (0)“.
 */
export function GegnerReiter({
  g,
  setze,
  staerke,
  stil,
  wann,
}: {
  g: EigenerGegner;
  setze: (g: EigenerGegner) => void;
  staerke: ReactNode;
  stil: ReactNode;
  wann: Neutralwerden;
}) {
  const [reiter, setzeReiter] = useState<Gegnerreiter>("staerke");
  const anzahl = anzahlAn(g);
  const eintraege = [
    { wert: "staerke", text: t("spielen.reiter.staerke"), symbol: ChartNoAxesColumnIncreasing },
    { wert: "stil", text: t("spielen.reiter.stil"), symbol: Radar },
    {
      wert: "fehler",
      text: t("spielen.reiter.fehler", { anzahl: String(anzahl.regler) }),
      symbol: TriangleAlert,
    },
    {
      wert: "flecken",
      text: t("spielen.reiter.flecken", { anzahl: String(anzahl.flecken) }),
      symbol: EyeOff,
    },
  ] as const;
  return (
    <div className="gegnerreiter" data-testid="gegnerreiter">
      {/* Seit 0.2.137 über allen Reitern: Alle Einstellungen betreffen die Stärke. */}
      <Gesamtstaerke g={g} />
      <Reiter
        name={t("spielen.reiter.name")}
        eintraege={eintraege}
        gewaehlt={reiter}
        beiWahl={setzeReiter}
      />
      <div className="reiterinhalt" role="tabpanel">
        {reiter === "staerke" && staerke}
        {reiter === "stil" && stil}
        {reiter === "fehler" && <Fehlerprofil g={g} setze={setze} wann={wann} />}
        {reiter === "flecken" && <Fleckennetz g={g} setze={setze} />}
      </div>
    </div>
  );
}
