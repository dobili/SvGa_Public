/**
 * Unterseite „Eigene Stufe“ (Entwurf J3): oben die Sprechblase mit der geschätzten Gesamtstärke,
 * darunter die Reiter Stärke, Stil, Fehler und Blinde Flecken genau wie bisher.
 *
 * Rolle im Gesamtbild: Ergänzung des Autors (31.10.2026, 14:11): Beim Einstellen von Stärke, Stil,
 * Fehlern und Flecken bleibt das alte Design; neu ist nur der Weg über die Kachel. Deshalb steht
 * hier die vorhandene Komponente gegnereditor/EigeneStufe.tsx unverändert (Gesamtstärke mit Marke
 * „Menschlich“, Regler je Phase, Spinnennetz, Fehlernetz mit Vorlagen, Höchstverlust, Feinreglern,
 * unmenschlichen Werten, nie Patt, Fleckennetz mit Vorlagen). Gespielt wird ohne Bot.
 * Abhängigkeiten: Unterseite, Sprechblase, EigeneStufe, useSpielwahl, spielwahl.ts, i18n.
 */
import { t } from "../../../../i18n/sprache";
import { useSpeicher } from "../../../../speicher/speicher";
import { EigeneStufe } from "../../gegnereditor/EigeneStufe";
import { Sprechblase } from "../Sprechblase";
import { Unterseite } from "../Unterseite";
import { wirksameUhr } from "../uhrwahl";
import { abgeleitet, useSpielwahl } from "../useSpielwahl";

/** Die Seite. Beispiel: Regler 3 · 4 · 3 → Sprechblase „etwa 1250 (geschätzt)“, Leiste „Eigene Stufe“. */
export function EigeneStufeSeite({
  startFen,
  abbildung,
}: {
  startFen?: string;
  abbildung?: string;
}) {
  const sw = useSpielwahl(startFen, abbildung);
  const eigene = useSpeicher((z) => z.daten.spiel.eigeneGegner);
  const v = { ...sw.wahl.vorlieben, gegner: "engine" as const, bot: null };
  const seite = abgeleitet(sw, v);
  return (
    <Unterseite
      titel={t("spielen.kategorie.stufe")}
      kennung="stufe"
      sw={seite}
      art="stufe"
      moeglich
      kinder={
        <section className="karte spielwahl" data-tour="spielen-gegner">
          <Sprechblase
            bot={null}
            eigene={eigene}
            stufen={v.stufenJePhase}
            uhr={wirksameUhr(sw.fen, v.uhr)}
            erlaubte={v.erlaubteFehlerarten}
          />
          <EigeneStufe v={v} mit={seite.mit} />
        </section>
      }
    />
  );
}
