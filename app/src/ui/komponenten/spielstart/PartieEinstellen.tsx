/**
 * Inhalt des Blattes „Partie einstellen“ (Entwurf J3): Farbe, alle sieben Bedenkzeiten (dazu „Ohne
 * Uhr“ aus einer eigenen Stellung), Gewertete Partie mit Hinweis, Spielhilfen mit Zugrücknahme und
 * die Zeile „Eröffnung ›“, die im selben Blatt die Eröffnungswahl öffnet.
 *
 * Rolle im Gesamtbild: Vorher stand all das als Karte „Partie“ mitten auf dem Bildschirm Spielen
 * (Wunsch des Autors, 31.10.2026: weniger Formular). Die Karte „Schnell eine Partie“ und die
 * Startleiste der Unterseiten öffnen dieses Blatt; jede Änderung gilt sofort (useSpielwahl.ts).
 * Abhängigkeiten: Blatt, ZeitWahl, HilfenWahl, BotEroeffnungVorrang, uhrwahl.ts, spielwahl.ts,
 * Auswahl, useEroeffnungsname, spiel/uhr.ts, spiel/partie.ts, i18n, lucide-react.
 */
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { t } from "../../../i18n/sprache";
import { EROEFFNUNG_BUCH, EROEFFNUNG_PRAXIS } from "../../../spiel/partie";
import { UHR_VORGABEN } from "../../../spiel/uhr";
import { useSpeicher } from "../../../speicher/speicher";
import { Auswahl } from "../bausteine/Auswahl";
import { Titelsymbol } from "../bausteine/Titelsymbol";
import { Blatt } from "./Blatt";
import { Eroeffnungsteil } from "./BotEroeffnungVorrang";
import { HilfenWahl, WertungsWahl } from "./HilfenWahl";
import { GRUNDSTELLUNG, wertbar, wirdGewertet } from "./spielwahl";
import { uhrStellen, uhrstelle } from "./uhrwahl";
import { useEroeffnungsname } from "./useEroeffnungsname";
import type { Spielwahl } from "./useSpielwahl";
import { ZeitWahl } from "./ZeitWahl";

/** Größe der Pfeile in den Zeilen (Bildpunkte). */
const PFEIL = 18;

/** Kurzname der gewählten Eröffnung für die Zeile „Eröffnung ›“. */
function useEroeffnungKurz(gewaehlt: string | null): string {
  const namen = useEroeffnungsname();
  if (gewaehlt === null) return t("spielen.eroeffnung.frei");
  if (gewaehlt === EROEFFNUNG_BUCH) return t("spielen.eroeffnung.buch");
  if (gewaehlt === EROEFFNUNG_PRAXIS) return t("spielen.eroeffnung.praxis");
  return namen(gewaehlt);
}

/** Farbe, Bedenkzeit, Wertung und Spielhilfen; unten die Zeile zur Eröffnung (oder nichts). */
function Grundteil({ sw, zurEroeffnung }: { sw: Spielwahl; zurEroeffnung: (() => void) | null }) {
  const { wahl, fen, mit } = sw;
  const v = wahl.vorlieben;
  const gewertet = wirdGewertet(fen, v);
  const eroeffnung = useEroeffnungKurz(wahl.eroeffnung);
  return (
    <div className="partieeinstellungen" data-tour="spielen-einstellungen">
      {v.gegner === "engine" && (
        <Auswahl
          name={t("spielen.seite")}
          symbol="farbe"
          werte={["white", "black"] as const}
          gewaehlt={wahl.farbe}
          text={(farbe) => t(farbe === "white" ? "farbe.w" : "farbe.b")}
          zeichen={(farbe) => <span className={`farbscheibe farbscheibe-${farbe}`} />}
          beiWahl={(farbe) => sw.setze({ ...wahl, farbe })}
        />
      )}
      <ZeitWahl
        stellen={uhrStellen(fen)}
        gewaehlt={uhrstelle(fen, v.uhr)}
        beiWahl={(stelle) => mit({ uhr: UHR_VORGABEN[Number(stelle)] ?? null })}
      />
      <WertungsWahl
        gewertet={v.gewertet}
        wertbar={wertbar(fen, v)}
        beiGewertet={(an) => mit({ gewertet: an })}
      />
      <div className="unterabschnitt" data-testid="spielhilfen" data-tour="spielen-hilfen">
        <span className="einstellung-name">
          <Titelsymbol art="hilfen" />
          {t("spielen.hilfen")}
        </span>
        <label className="schalterzeile">
          <input
            type="checkbox"
            checked={v.ruecknahmeErlaubt && !gewertet}
            disabled={gewertet}
            onChange={(e) => mit({ ruecknahmeErlaubt: e.target.checked })}
          />
          {t("spielen.ruecknahme")}
        </label>
        <HilfenWahl
          ohneTitel
          ohneWertung
          hilfen={v.hilfen}
          gewertet={v.gewertet}
          wertbar={wertbar(fen, v)}
          beiHilfen={(hilfen) => mit({ hilfen })}
          beiGewertet={(an) => mit({ gewertet: an })}
        />
        {gewertet && <p className="hinweis">{t("spielenneu.einstellen.hilfenNurUngewertet")}</p>}
      </div>
      {zurEroeffnung && (
        <button type="button" className="blatt-zeile" onClick={zurEroeffnung}>
          <Titelsymbol art="eroeffnung" />
          <span className="blatt-zeile-text">
            <span>{t("spielen.eroeffnungFestlegen")}</span>
            <span className="blatt-zeile-klein">{eroeffnung}</span>
          </span>
          <ChevronRight size={PFEIL} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

/** Die Eröffnungswahl im Blatt, mit „Zurück“ zu den übrigen Einstellungen. */
function Eroeffnungsblatt({ sw, zurueck }: { sw: Spielwahl; zurueck: () => void }) {
  const eigene = useSpeicher((z) => z.daten.spiel.eigeneGegner);
  const { wahl } = sw;
  return (
    <div className="blatt-eroeffnung" data-tour="spielen-eroeffnung">
      <button type="button" className="knopf-flach" onClick={zurueck}>
        <ChevronLeft size={PFEIL} aria-hidden="true" />
        {t("spielenneu.einstellen.zurueck")}
      </button>
      <h3 className="unterteil-titel">{t("spielen.eroeffnungFestlegen")}</h3>
      <Eroeffnungsteil
        gewaehlt={wahl.eroeffnung}
        beiWahl={(eroeffnung) => sw.setze({ ...wahl, eroeffnung })}
        bot={eigene.find((g) => g.kennung === wahl.vorlieben.bot)}
        ueberschreiben={wahl.ueberschreiben}
        beiUeberschreiben={(ueberschreiben) => sw.setze({ ...wahl, ueberschreiben })}
      />
    </div>
  );
}

/**
 * Das Blatt „Partie einstellen“. Die Eröffnung gibt es nur gegen die Engine aus der Grundstellung.
 * Beispiel: Tipp auf „Einstellen ›“ → Farbe, 3 + 0 … 60 + 0, Gewertete Partie, Spielhilfen,
 * „Eröffnung · wie Menschen dieser Stärke ›“.
 */
export function PartieEinstellen({
  sw,
  offen,
  schliessen,
}: {
  sw: Spielwahl;
  offen: boolean;
  schliessen: () => void;
}) {
  const [eroeffnung, setzeEroeffnung] = useState(false);
  const mitEroeffnung = sw.fen === GRUNDSTELLUNG && sw.wahl.vorlieben.gegner === "engine";
  const zu = () => {
    setzeEroeffnung(false);
    schliessen();
  };
  return (
    <Blatt
      titel={t("spielenneu.einstellen.titel")}
      offen={offen}
      schliessen={zu}
      testid="partie-einstellen"
      kinder={
        eroeffnung && mitEroeffnung ? (
          <Eroeffnungsblatt sw={sw} zurueck={() => setzeEroeffnung(false)} />
        ) : (
          <Grundteil sw={sw} zurEroeffnung={mitEroeffnung ? () => setzeEroeffnung(true) : null} />
        )
      }
    />
  );
}
