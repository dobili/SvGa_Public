/**
 * Spielen-Bildschirm: Partie gegen die Engine vorbereiten oder die laufende fortsetzen.
 *
 * Rolle im Gesamtbild: Startseite des Bereichs „Spielen“ (Leiste) und Ziel des Knopfes „Gegen die
 * Engine spielen“ an jeder Abbildung (Pflichtenheft 5.2: aus jeder Stellung zu Ende spielen,
 * Seite und Stufe wählen, Rücknahme abschaltbar; ein Spielziel gibt es seit 0.2.33 nicht mehr, Ziel ist
 * immer der Sieg). Die letzte Wahl merkt sich der
 * Speicher (Vorlieben). Seit 0.2.39 lässt sich aus der Grundstellung eine Eröffnung des Buches
 * vorgeben, der die Engine folgt (EroeffnungsWahl.tsx, Rückmeldung des Autors zu N178). Darunter
 * die letzten Partien zum Nachlesen.
 * Abhängigkeiten: spiel/partie.ts, spiel/uhr.ts, engine/stufen.ts, speicher/, Navigation, i18n.
 */
import { useState } from "react";
import { useNavigation } from "../../app/navigationsKontext";
import { STUFEN, type Stufennummer } from "../../engine/stufen";
import { t } from "../../i18n/sprache";
import { stellungAusFen, type Farbe } from "../../schach/stellung";
import { neuePartie, spielbar } from "../../spiel/partie";
import { UHR_VORGABEN } from "../../spiel/uhr";
import { mitLaufender, mitVorlieben, type Spielvorlieben } from "../../speicher/partien";
import { aendere, useSpeicher } from "../../speicher/speicher";
import { Brett } from "../brett/Brett";
import { Auswahl } from "../komponenten/Auswahl";
import { EroeffnungsWahl } from "../komponenten/EroeffnungsWahl";
import { Kopfzeile } from "../komponenten/Kopfzeile";
import { LaufendePartie, Partienliste } from "../komponenten/Partienliste";

const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const MINUTE_MS = 60_000;
const SEKUNDE_MS = 1000;

/** Name einer Uhrvorgabe: „Ohne Uhr“ oder „15 + 10“. */
function uhrname(stelle: number): string {
  const vorgabe = UHR_VORGABEN[stelle];
  if (!vorgabe) return t("spielen.uhr.ohne");
  return t("spielen.uhr.zeit", {
    minuten: vorgabe.grundzeitMs / MINUTE_MS,
    sekunden: vorgabe.zuschlagMs / SEKUNDE_MS,
  });
}

function uhrstelle(vorlieben: Spielvorlieben): number {
  const stelle = UHR_VORGABEN.findIndex(
    (v) =>
      v?.grundzeitMs === vorlieben.uhr?.grundzeitMs && v?.zuschlagMs === vorlieben.uhr?.zuschlagMs,
  );
  return Math.max(0, stelle);
}

/** Eindeutige Kennung einer Partie aus Zeit und Zufall. */
function neueKennung(): string {
  const BASIS = 36;
  const STELLEN = 6;
  return `p-${Date.now().toString(BASIS)}-${Math.random()
    .toString(BASIS)
    .slice(2, 2 + STELLEN)}`;
}

/** Die Wahl auf diesem Bildschirm. */
interface Wahl {
  readonly farbe: Farbe;
  readonly vorlieben: Spielvorlieben;
  /** Eröffnung für die Engine (nur aus der Grundstellung), sonst null. */
  readonly eroeffnung: string | null;
}

/** Seite, Stufe, Uhr, Rücknahme. */
function Einstellungen({ wahl, setze }: { wahl: Wahl; setze: (wahl: Wahl) => void }) {
  const v = wahl.vorlieben;
  const mit = (teil: Partial<Spielvorlieben>) => setze({ ...wahl, vorlieben: { ...v, ...teil } });
  const uhrStellen = UHR_VORGABEN.map((_, stelle) => String(stelle));
  return (
    <section className="karte spielwahl">
      <Auswahl
        name={t("spielen.seite")}
        werte={["white", "black"] as const}
        gewaehlt={wahl.farbe}
        text={(farbe) => t(farbe === "white" ? "farbe.w" : "farbe.b")}
        beiWahl={(farbe) => setze({ ...wahl, farbe })}
      />
      <Auswahl
        name={t("spielen.stufe")}
        werte={STUFEN.map((s) => String(s.nummer))}
        gewaehlt={String(v.stufe)}
        text={(nummer) => `${nummer} · ${t(`stufe.${nummer as `${Stufennummer}`}`)}`}
        beiWahl={(nummer) => mit({ stufe: Number(nummer) as Stufennummer })}
      />
      <Auswahl
        name={t("spielen.uhr")}
        werte={uhrStellen}
        gewaehlt={String(uhrstelle(v))}
        text={(stelle) => uhrname(Number(stelle))}
        beiWahl={(stelle) => mit({ uhr: UHR_VORGABEN[Number(stelle)] ?? null })}
      />
      <label className="schalterzeile">
        <input
          type="checkbox"
          checked={v.ruecknahmeErlaubt}
          onChange={(e) => mit({ ruecknahmeErlaubt: e.target.checked })}
        />
        {t("spielen.ruecknahme")}
      </label>
    </section>
  );
}

/** Die Startstellung: Grundstellung, Abbildung oder eigene FEN. */
function Startstellung({
  fen,
  abbildung,
  setzeFen,
}: {
  fen: string;
  abbildung: string | undefined;
  setzeFen: (fen: string) => void;
}) {
  const [eingabe, setzeEingabe] = useState("");
  const gueltig = spielbar(eingabe.trim());
  const titel = abbildung
    ? t("spielen.abAbbildung", { nummer: abbildung })
    : fen === GRUNDSTELLUNG
      ? t("spielen.grundstellung")
      : t("spielen.eigeneStellung");
  return (
    <section className="karte startstellung">
      <h2 className="karte-titel">{titel}</h2>
      <div className="startbrett">
        <Brett fen={fen} markierungen={[]} beschriftung={titel} koordinaten={false} />
      </div>
      {!abbildung && (
        <details className="fen-eingabe">
          <summary>{t("spielen.fenEingeben")}</summary>
          <input
            className="suchfeld"
            value={eingabe}
            onChange={(e) => setzeEingabe(e.target.value)}
            aria-label={t("spielen.fen")}
            placeholder="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
          />
          {eingabe && !gueltig && <p className="fehlertext">{t("spielen.fenUngueltig")}</p>}
          <button
            type="button"
            className="knopf-zweit"
            disabled={!gueltig}
            onClick={() => setzeFen(eingabe.trim())}
          >
            {t("spielen.fenUebernehmen")}
          </button>
        </details>
      )}
    </section>
  );
}

/** Legt die Partie an, merkt die Vorlieben und öffnet die Partie. */
function useBeginne(fen: string, abbildung: string | undefined) {
  const { navigiere } = useNavigation();
  return (wahl: Wahl) => {
    const v = wahl.vorlieben;
    const einstellung = {
      startFen: fen,
      eigeneFarbe: wahl.farbe,
      stufe: v.stufe,
      uhr: v.uhr,
      ruecknahmeErlaubt: v.ruecknahmeErlaubt,
      abbildung: abbildung ?? null,
      eroeffnung: fen === GRUNDSTELLUNG ? wahl.eroeffnung : null,
    };
    const partie = neuePartie(einstellung, neueKennung(), new Date().toISOString());
    if (!partie) return;
    void aendere((d) => ({ ...d, spiel: mitLaufender(mitVorlieben(d.spiel, v), partie) }));
    navigiere({ bildschirm: "partie", id: partie.id });
  };
}

/** Die Seite am Zug einer Stellung; Weiß, wenn sie nicht lesbar ist. */
function seiteAmZug(fen: string): Farbe {
  const stellung = stellungAusFen(fen);
  return stellung.ok ? stellung.wert.amZug : "white";
}

export function Spielen({ startFen, abbildung }: { startFen?: string; abbildung?: string }) {
  const spiel = useSpeicher((z) => z.daten.spiel);
  const [fen, setzeFen] = useState(startFen ?? GRUNDSTELLUNG);
  const [wahl, setzeWahl] = useState<Wahl>({
    farbe: seiteAmZug(fen),
    vorlieben: spiel.vorlieben,
    eroeffnung: null,
  });
  // Eine eigene Stellung: Der Leser spielt zunächst die Seite am Zug.
  const uebernimm = (neu: string) => {
    setzeFen(neu);
    setzeWahl({ ...wahl, farbe: seiteAmZug(neu) });
  };
  const [ersetzen, setzeErsetzen] = useState(false);
  const beginne = useBeginne(fen, abbildung);
  const laufend = spiel.laufend;
  const ok = spielbar(fen);
  return (
    <div className="bildschirm bildschirm-spielen" data-testid="spielen">
      {startFen ? (
        <Kopfzeile titel={t("spielen.titel")} zurueckText={t("spielen.zurueck")} />
      ) : (
        <header className="seitenkopf">
          <h1>{t("spielen.titel")}</h1>
        </header>
      )}
      {laufend && <LaufendePartie partie={laufend} />}
      <Startstellung fen={fen} abbildung={abbildung} setzeFen={uebernimm} />
      {!ok && <p className="fehlertext">{t("spielen.nichtSpielbar")}</p>}
      <Einstellungen wahl={wahl} setze={setzeWahl} />
      {fen === GRUNDSTELLUNG && (
        <EroeffnungsWahl
          gewaehlt={wahl.eroeffnung}
          beiWahl={(eroeffnung) => setzeWahl({ ...wahl, eroeffnung })}
        />
      )}
      {laufend && ersetzen ? (
        <div className="nachfrage">
          <p>{t("spielen.ersetzenFrage")}</p>
          <div className="knopfreihe">
            <button type="button" className="knopf-gefahr" onClick={() => beginne(wahl)}>
              {t("spielen.ersetzenJa")}
            </button>
            <button type="button" className="knopf-zweit" onClick={() => setzeErsetzen(false)}>
              {t("loeschen.nein")}
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="knopf-haupt"
          disabled={!ok}
          onClick={() => (laufend ? setzeErsetzen(true) : beginne(wahl))}
        >
          {t("spielen.beginnen")}
        </button>
      )}
      <Partienliste partien={spiel.partien} />
    </div>
  );
}
