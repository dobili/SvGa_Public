/**
 * Karte „Dein Rivale“ (Gamifizierung P8): Porträt, Spruch des Bots, Duellbilanz, Knopf
 * „Revanche“ und einmal am Tag „Anderer Rivale“; nach einem gewonnenen Duell eine kurze Feier.
 *
 * Rolle im Gesamtbild: Eintrag in STARTKARTEN (Rang 30) und, sobald der Haupt-Chat die Zeile
 * einträgt, oben im Bereich Spielen. „Revanche“ nutzt den Einstieg „Partie gegen diesen Bot“
 * (spielstart/vorbelegung.ts): Bot vorbelegt, gewertet, letzte Zeitart; der Leser tippt
 * „Beginnen“. Die Bilanz schreibt nicht die Karte, sondern NACH_PARTIEENDE (training/rivalenfolge.ts).
 * Abhängigkeiten: training/rivalen.ts, training/duelle.ts, training/rivalensprueche.ts,
 * rivalenmerker.ts, spielstart/vorbelegung.ts, GegnerBild.tsx, Feuerwerk.tsx, Speicher, i18n.
 */
import { useState } from "react";
import { gegnerVon, type Gegner } from "../../../engine/gegner";
import { t } from "../../../i18n/sprache";
import type { Nutzerdaten } from "../../../speicher/format";
import { aendere, useSpeicher } from "../../../speicher/speicher";
import { LEERES_DUELL, letztesErgebnis, partienImDuell } from "../../../training/duelle";
import { aktuellerRivale, mitRivale, waehleRivale } from "../../../training/rivalen";
import { anlassAus, charakterVon, spruchschluessel } from "../../../training/rivalensprueche";
import { Feuerwerk } from "../bausteine/Feuerwerk";
import { GegnerBild } from "../gegner/GegnerBild";
import { useSpielvorbelegung } from "../spielstart/vorbelegung";
import { merkeGefeiert, merkeWechsel, offeneFeier, wechselHeuteMoeglich } from "./rivalenmerker";
import "../../stil/rivale.css";

/** Der Spruch des Bots zum letzten Ergebnis gegen ihn. */
function spruch(daten: Nutzerdaten, bot: Gegner): string {
  return t(spruchschluessel(charakterVon(bot), anlassAus(letztesErgebnis(daten, bot.kennung))));
}

/** Die Feier nach dem gewonnenen Duell: Gratulation des besiegten Bots, neuer Rivale. */
function Rivalenfeier({
  besiegt,
  neuer,
  weiter,
}: {
  besiegt: Gegner;
  neuer: Gegner | null;
  weiter: () => void;
}) {
  const gratulation = t(spruchschluessel(charakterVon(besiegt), "botNiederlage"));
  return (
    <div className="rivale-feier" data-testid="rivale-feier" role="status">
      <Feuerwerk umfang="klein" />
      <h3 className="rivale-feier-titel">{t("rivale.feier.titel")}</h3>
      <p>{t("rivale.feier.gratuliert", { name: besiegt.name, spruch: gratulation })}</p>
      <p className="rivale-feier-neu">
        {neuer ? t("rivale.feier.neu", { name: neuer.name }) : t("rivale.feier.keiner")}
      </p>
      <button type="button" className="knopf-zweit" onClick={weiter}>
        {t("rivale.feier.weiter")}
      </button>
    </div>
  );
}

/** Die Bilanz in Worten. Beispiel: 1 Sieg, 2 Niederlagen → „Euer Duell: 1 : 2“. */
function Bilanz({ daten, bot }: { daten: Nutzerdaten; bot: Gegner }) {
  const duell = daten.duelle[bot.kennung] ?? LEERES_DUELL;
  return (
    <p className="rivale-bilanz" data-testid="rivale-bilanz">
      {t("rivale.bilanz", { du: duell.siege, bot: duell.niederlagen })}
      {duell.remis > 0 ? ` ${t("rivale.bilanzRemis", { n: duell.remis })}` : ""}
    </p>
  );
}

/** Knöpfe: Revanche (oder Herausfordern ohne Partie) und einmal am Tag „Anderer Rivale“. */
function Knoepfe({ daten, bot }: { daten: Nutzerdaten; bot: Gegner }) {
  const spiele = useSpielvorbelegung();
  const jetzt = new Date();
  const anderer = wechselHeuteMoeglich(jetzt) ? waehleRivale(daten, [bot.kennung]) : null;
  const revanche = () => {
    // Ein noch nicht gespeicherter Rivale wird festgehalten, damit der Sieg auch zählt.
    void aendere((d) => (d.rivale ? d : mitRivale(d, bot.kennung, new Date()))).then(() =>
      spiele({ bot: bot.kennung, tempo: null }),
    );
  };
  const wechsle = () => {
    if (!anderer) return;
    merkeWechsel(new Date());
    void aendere((d) => mitRivale(d, anderer.kennung, new Date()));
  };
  const gespielt = partienImDuell(daten.duelle[bot.kennung]) > 0;
  return (
    <div className="rivale-knoepfe">
      <button type="button" className="knopf-haupt" onClick={revanche}>
        {t(gespielt ? "rivale.revanche" : "rivale.herausfordern")}
      </button>
      {anderer ? (
        <button type="button" className="knopf-link" onClick={wechsle}>
          {t("rivale.anderer")}
        </button>
      ) : null}
    </div>
  );
}

/** Die Karte; ohne Rivale und ohne offene Feier nichts. */
export function Rivalenkarte() {
  const daten = useSpeicher((z) => z.daten);
  const [gefeiert, setzeGefeiert] = useState<string | null>(null);
  const feier = offeneFeier(daten, new Date());
  const besiegt = feier && feier !== gefeiert ? gegnerVon(feier) : null;
  const rivale = aktuellerRivale(daten);
  if (!besiegt && !rivale) return null;
  const weiter = () => {
    if (feier) merkeGefeiert(feier);
    setzeGefeiert(feier);
  };
  return (
    <section className="karte rivalenkarte" data-testid="rivalenkarte">
      {besiegt ? <Rivalenfeier besiegt={besiegt} neuer={rivale} weiter={weiter} /> : null}
      {rivale ? (
        <>
          <h2 className="karte-titel">{t("rivale.titel", { name: rivale.name })}</h2>
          <div className="rivale-kopf">
            <GegnerBild bot={rivale.kennung} eigene={[]} name={rivale.name} />
            <blockquote className="rivale-spruch" data-testid="rivale-spruch">
              {t("rivale.zitat", { spruch: spruch(daten, rivale) })}
            </blockquote>
          </div>
          <Bilanz daten={daten} bot={rivale} />
          <Knoepfe daten={daten} bot={rivale} />
        </>
      ) : null}
    </section>
  );
}
