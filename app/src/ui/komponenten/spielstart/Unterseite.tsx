/**
 * Rahmen einer Unterseite von „Spielen“ (Entwurf J3): Kopfzeile mit „Zurück“, Inhalt, feste
 * Startleiste mit „Spielen“ und das Blatt „Partie einstellen“.
 *
 * Rolle im Gesamtbild: Gegner aussuchen, Eigene Stufe, Eigene Bots und Freie Partie sind eigene
 * Seiten (Kacheln auf der Startseite). Auf jeder soll man nach der Wahl mit einem Tipp beginnen
 * können (Auftrag des Autors); die Leiste nennt Gegner, Farbe, Bedenkzeit und Wertung, ein Tipp
 * darauf öffnet das Blatt. Die Seite reicht eine abgeleitete Wahl herein (etwa: eigene Stufe ohne
 * Bot), die auch das Blatt bearbeitet.
 * Abhängigkeiten: Kopfzeile, Startleiste, BeginnenKnopf, PartieEinstellen, spielwahl.ts,
 * uhrwahl.ts, bildschirme/startstaerke.ts, speicher, i18n.
 */
import { useState, type ReactNode } from "react";
import { t } from "../../../i18n/sprache";
import { useSpeicher } from "../../../speicher/speicher";
import { startangabe } from "../../bildschirme/startstaerke";
import { Kopfzeile } from "../rahmen/Kopfzeile";
import { BeginnenKnopf } from "./BeginnenKnopf";
import { PartieEinstellen } from "./PartieEinstellen";
import { gegnerangabe, type Startgegner } from "./startangaben";
import { Startleiste } from "./Startleiste";
import { wirdGewertet } from "./spielwahl";
import { uhrnameKurz, uhrstelle } from "./uhrwahl";
import type { Spielwahl } from "./useSpielwahl";

/** Die Leiste mit Knopf für eine Wahl. */
function Leiste({
  sw,
  art,
  moeglich,
  beiZeile,
}: {
  sw: Spielwahl;
  art: Startgegner;
  moeglich: boolean;
  beiZeile: () => void;
}) {
  const spiel = useSpeicher((z) => z.daten.spiel);
  const v = sw.wahl.vorlieben;
  const angaben = {
    art,
    bot: v.bot,
    stufe: v.stufenJePhase.mittelspiel,
    eigene: spiel.eigeneGegner,
    farbe: sw.wahl.farbe,
    uhr: uhrnameKurz(uhrstelle(sw.fen, v.uhr)),
    gewertet: wirdGewertet(sw.fen, v),
    staerke: art === "mensch" ? null : startangabe(v, sw.fen, spiel.eigeneGegner, spiel.besiegt),
  };
  const { name } = gegnerangabe(angaben);
  return (
    <Startleiste
      angaben={angaben}
      beiZeile={beiZeile}
      knopf={
        <BeginnenKnopf
          text={t("spielenneu.spielen")}
          vorlesen={t("spielenneu.spielenGegen", { name })}
          laufend={spiel.laufend !== null}
          moeglich={moeglich}
          hinweis={null}
          beiBeginn={() => sw.beginne(sw.wahl)}
        />
      }
    />
  );
}

/**
 * Die Unterseite. `sw` ist die (abgeleitete) Wahl der Seite, `art` der Gegner der Leiste,
 * `moeglich`: lässt sich beginnen (Eigene Bots ohne Wahl, unspielbare Stellung: nein).
 */
export function Unterseite({
  titel,
  kennung,
  sw,
  art,
  moeglich,
  kinder,
}: {
  titel: string;
  kennung: string;
  sw: Spielwahl;
  art: Startgegner;
  moeglich: boolean;
  kinder: ReactNode;
}) {
  const [blatt, setzeBlatt] = useState(false);
  return (
    <div
      className={`bildschirm bildschirm-spielen spielen-unterseite spielseite-${kennung}`}
      data-testid="spielen"
    >
      <Kopfzeile titel={titel} zurueckText={t("spielenneu.zurueck")} />
      {kinder}
      <Leiste sw={sw} art={art} moeglich={moeglich} beiZeile={() => setzeBlatt(true)} />
      <PartieEinstellen sw={sw} offen={blatt} schliessen={() => setzeBlatt(false)} />
    </div>
  );
}
