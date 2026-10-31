/**
 * Unterseite „Gegner aussuchen“ (Entwurf J3): die vorgefertigten Bots in „Zum Spaß“ und den
 * Stufen 1 bis 10, oben der gewählte Bot mit „So stellt er sich vor“, Stil und Stärke.
 *
 * Rolle im Gesamtbild: Vorher die Kachel „Vorgefertigte Bots“ in der Gegnerwahl. Das Gitter mit
 * Porträt, Name, Stärke je Zeitklasse, Besiegt-Marke, „x von 8 besiegt“ mit dem Zeichen der
 * Zeitklasse und dem Gruppenmodus je Stufe ist unverändert (gegner/Gegnerstufen.tsx). Ist noch
 * kein vorgefertigter Bot gewählt, ist der Vorschlag der Startseite vorgewählt.
 * Abhängigkeiten: Unterseite, Sprechblase, VorgefertigteGitter, spielwahl.ts, useVorschlaege,
 * engine/gegner.ts, engine/gruppe.ts, spiel/elomodell.ts, i18n.
 */
import { gegnerVon } from "../../../../engine/gegner";
import { istGruppe } from "../../../../engine/gruppe";
import { t } from "../../../../i18n/sprache";
import { wertungstempo } from "../../../../spiel/elomodell";
import { useSpeicher } from "../../../../speicher/speicher";
import { MitInfoblase } from "../../bausteine/Infoblase";
import { VorgefertigteGitter } from "../../gegner/Gegnerstufen";
import { Sprechblase } from "../Sprechblase";
import { mitBot } from "../spielwahl";
import { Unterseite } from "../Unterseite";
import { wirksameUhr } from "../uhrwahl";
import { abgeleitet, useSpielwahl } from "../useSpielwahl";
import { useVorschlaege } from "../useVorschlaege";

/** Die Seite. Beispiel: Felix gewählt → Sprechblase Felix, Leiste „Felix · etwa 580 · Spielen“. */
export function GegnerAussuchen({
  startFen,
  abbildung,
}: {
  startFen?: string;
  abbildung?: string;
}) {
  const sw = useSpielwahl(startFen, abbildung);
  const eigene = useSpeicher((z) => z.daten.spiel.eigeneGegner);
  const { vorschlag } = useVorschlaege(null, sw.fen);
  const v = sw.wahl.vorlieben;
  const vorgefertigt = gegnerVon(v.bot) !== null || istGruppe(v.bot);
  const bot = vorgefertigt ? v.bot : (vorschlag?.bot ?? null);
  const seite = abgeleitet(sw, mitBot(v, bot, eigene));
  const uhr = wirksameUhr(sw.fen, v.uhr);
  return (
    <Unterseite
      titel={t("spielenneu.seite.gegner.titel")}
      kennung="gegner"
      sw={seite}
      art="bot"
      moeglich={bot !== null}
      kinder={
        <section className="karte spielwahl" data-tour="spielen-gegner">
          <Sprechblase
            bot={bot}
            eigene={eigene}
            stufen={seite.wahl.vorlieben.stufenJePhase}
            uhr={uhr}
          />
          <VorgefertigteGitter
            bot={bot}
            beiBot={(neu) => seite.setze({ ...seite.wahl, vorlieben: mitBot(v, neu, eigene) })}
            tempo={wertungstempo(uhr)}
          />
          <MitInfoblase
            zeile={<p className="hinweis">{t("wenigertext.seiten.gegner.zeile")}</p>}
            thema={t("spielenneu.seite.gegner.titel")}
            erklaerung={<p>{t("spielenneu.seite.gegner.hinweis")}</p>}
          />
        </section>
      }
    />
  );
}
