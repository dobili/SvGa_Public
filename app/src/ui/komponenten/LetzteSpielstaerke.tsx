/**
 * Karte „Deine Spielstärke“: geschätzt aus den letzten (höchstens zehn) ausgewerteten Partien
 * gegen die Engine, als Mitte mit Spanne; die Werte für chess.com und Lichess hinter dem
 * Fragezeichen.
 *
 * Rolle im Gesamtbild: Plan „Genauigkeit und Spielstärke neu eichen“, Entscheidung 4 des Autors
 * (18.10.2026): Eine einzelne Partie streut um etwa ±450 Punkte, über zehn Partien gleicht sich
 * das aus. Steht im Bereich Spielen über der Liste der Partien (Partienliste.tsx).
 * Abhängigkeiten: spiel/wertung.ts (staerkeLetzterPartien), speicher/partien.ts, InfoKnopf, i18n.
 */
import { useMemo } from "react";
import { t } from "../../i18n/sprache";
import { staerkeLetzterPartien } from "../../spiel/wertung";
import type { Partieeintrag } from "../../speicher/partien";
import { MitInfo } from "./InfoKnopf";

/**
 * Die Karte; ohne passende Partie nichts.
 * Beispiel: drei Partien mit 70, 80 und 75 % → „etwa 1400“, darunter „1050 bis 1750, aus 3 Partien“.
 */
export function LetzteSpielstaerke({ partien }: { partien: readonly Partieeintrag[] }) {
  const schaetzung = useMemo(() => staerkeLetzterPartien(partien), [partien]);
  if (!schaetzung) return null;
  return (
    <section className="karte letzte-spielstaerke" data-testid="letzte-spielstaerke">
      <MitInfo
        zeile={<h2 className="karte-titel">{t("spielstaerke.letzte.titel")}</h2>}
        erklaerung={
          <p>
            {t("spielstaerke.letzte.erklaerung", {
              chesscom: schaetzung.chesscom,
              lichess: schaetzung.lichess,
            })}
          </p>
        }
        thema={t("spielstaerke.letzte.titel")}
      />
      <p className="letzte-spielstaerke-wert">
        {t("spielstaerke.letzte.wert", { mitte: schaetzung.mitte })}
      </p>
      <p className="hinweis">
        {t("spielstaerke.letzte.spanne", {
          von: schaetzung.von,
          bis: schaetzung.bis,
          partien: schaetzung.partien,
        })}
      </p>
    </section>
  );
}
