/**
 * Startkarte der Eröffnungstrainer: Eröffnung und Seite als Zeilen, dann „Runde starten“.
 *
 * Rolle im Gesamtbild: Gemeinsam für den Repertoire-Trainer und den Abweichungsmodus (Kapitel 2
 * und 3), Entwurf G1 vom 31.10.2026. Beide wählten früher mit Aufklappliste und Chips untereinander
 * (RepertoireBereich.tsx, AbweichungBereich.tsx); jetzt sind es Zeilen unter „Deine Runde“, die
 * Eröffnung und Seite der letzten Runde sind gemerkt.
 * Abhängigkeiten: training/repertoiretrainer.ts, startkarte/*, i18n.
 */
import type { Color } from "chessops/types";
import { t } from "../../i18n/sprache";
import type { TrainerKennung } from "../../training/trainer";
import type { Repertoireeroeffnung } from "../../training/repertoiretrainer";
import { einstellung, seitenzeile, SEITEN, type Einstellung } from "./startkarte/einstellung";
import { Startkarte } from "./startkarte/Startkarte";
import { useGemerkt } from "./startkarte/useGemerkt";

/** Gewählt: Eröffnung und Seite. */
export interface Eroeffnungswahl {
  readonly eroeffnung: Repertoireeroeffnung;
  readonly seite: Color;
}

/**
 * Startkarte mit Eröffnung und Seite; `vorne` sind Zeilen davor (Abweichungsmodus: Kapitel).
 *
 * Beispiel: Repertoire-Trainer → „Eröffnung: Spanische Partie · Du spielst: Weiß“.
 * Sonderfall: Ohne Eröffnungen bleibt der Startknopf gesperrt.
 */
export function Eroeffnungsstart({
  kennung,
  eroeffnungen,
  vorne = [],
  zusatz,
  starte,
}: {
  kennung: TrainerKennung;
  eroeffnungen: readonly Repertoireeroeffnung[];
  vorne?: readonly Einstellung[];
  zusatz: string;
  starte: (wahl: Eroeffnungswahl) => void;
}) {
  const kennungen = eroeffnungen.map((e) => e.id);
  const [id, setzeId] = useGemerkt(kennung, "eroeffnung", kennungen, kennungen[0] ?? "");
  const [seite, setzeSeite] = useGemerkt<Color>(kennung, "seite", SEITEN, "white");
  const gewaehlt = eroeffnungen.find((e) => e.id === id) ?? null;
  const eroeffnungszeile = einstellung({
    kennung: "eroeffnung",
    titel: t("trainerstart.zeile.eroeffnung"),
    symbol: "eroeffnung",
    optionen: eroeffnungen.map((e) => ({ wert: e.id, text: e.titel })),
    wert: id,
    setze: setzeId,
    testkennung: "zeile-eroeffnung",
  });
  return (
    <Startkarte
      kennung={kennung}
      testkennung={`${kennung}-wahl`}
      zeilen={[...vorne, ...(gewaehlt ? [eroeffnungszeile] : []), seitenzeile(seite, setzeSeite)]}
      start={{
        zusatz,
        gesperrt: gewaehlt === null,
        starte: () => gewaehlt && starte({ eroeffnung: gewaehlt, seite }),
      }}
    />
  );
}
