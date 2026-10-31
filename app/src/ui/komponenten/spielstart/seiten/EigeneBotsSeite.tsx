/**
 * Unterseite „Eigene Bots“ (Entwurf J3): die eigenen Bots als Porträts zum Wählen, der gewählte in
 * der Sprechblase, darunter Liste mit Bearbeiten und Löschen und „Neuen Gegner anlegen“.
 *
 * Rolle im Gesamtbild: Vorher die Kachel „Eigene Bots“ in der Gegnerwahl. Der Gegner-Editor
 * (Name, Porträt, Reiter Stärke, Stil, Fehler, Flecken, Eröffnungen des Bots, Speichern) bleibt
 * unverändert (gegnereditor/GegnerEditor.tsx, Ergänzung des Autors vom 31.10.2026). Ohne gewählten
 * eigenen Bot lässt sich nicht beginnen; die Leiste sagt das.
 * Abhängigkeiten: Unterseite, Sprechblase, GegnerEditor, Gegnerstufen (Kachel), GegnerBild,
 * speicher/besiegt.ts, spielwahl.ts, i18n.
 */
import type { EigenerGegner } from "../../../../engine/gegner";
import { t } from "../../../../i18n/sprache";
import { besiegtIn } from "../../../../speicher/besiegt";
import { useSpeicher } from "../../../../speicher/speicher";
import { GegnerBild } from "../../gegner/GegnerBild";
import { Kachel } from "../../gegner/Gegnerstufen";
import { GegnerEditor } from "../../gegnereditor/GegnerEditor";
import { Sprechblase } from "../Sprechblase";
import { mitBot } from "../spielwahl";
import { Unterseite } from "../Unterseite";
import { wirksameUhr } from "../uhrwahl";
import { abgeleitet, useSpielwahl } from "../useSpielwahl";

/** Die eigenen Gegner des Lesers als Kacheln mit Porträt oder Anfangsbuchstaben. */
function EigeneGitter({
  bot,
  eigene,
  beiBot,
}: {
  bot: string | null;
  eigene: readonly EigenerGegner[];
  beiBot: (bot: string) => void;
}) {
  const besiegt = useSpeicher((z) => z.daten.spiel.besiegt);
  if (eigene.length === 0) return null;
  return (
    <div role="radiogroup" aria-label={t("spielen.eigene.titel")} className="gegnergitter">
      {eigene.map((g) => (
        <Kachel
          key={g.kennung}
          name={g.name}
          gewaehlt={bot === g.kennung}
          beiWahl={() => beiBot(g.kennung)}
          kinder={
            <GegnerBild
              bot={g.kennung}
              eigene={eigene}
              name={g.name}
              besiegtIn={besiegtIn(besiegt, g.kennung)}
            />
          }
        />
      ))}
    </div>
  );
}

/** Die Seite. Beispiel: „Rambo“ gewählt → Sprechblase Rambo, Leiste „Rambo · Spielen“. */
export function EigeneBotsSeite({
  startFen,
  abbildung,
}: {
  startFen?: string;
  abbildung?: string;
}) {
  const sw = useSpielwahl(startFen, abbildung);
  const eigene = useSpeicher((z) => z.daten.spiel.eigeneGegner);
  const v = sw.wahl.vorlieben;
  const bot = eigene.some((g) => g.kennung === v.bot) ? v.bot : null;
  const seite = abgeleitet(sw, mitBot(v, bot, eigene));
  return (
    <Unterseite
      titel={t("spielen.kategorie.eigene")}
      kennung="eigene"
      sw={seite}
      art={bot ? "bot" : "keiner"}
      moeglich={bot !== null}
      kinder={
        <section className="karte spielwahl" data-tour="spielen-gegner">
          {bot && (
            <Sprechblase
              bot={bot}
              eigene={eigene}
              stufen={seite.wahl.vorlieben.stufenJePhase}
              uhr={wirksameUhr(sw.fen, v.uhr)}
            />
          )}
          <EigeneGitter
            bot={bot}
            eigene={eigene}
            beiBot={(neu) => seite.setze({ ...seite.wahl, vorlieben: mitBot(v, neu, eigene) })}
          />
          <GegnerEditor />
        </section>
      }
    />
  );
}
