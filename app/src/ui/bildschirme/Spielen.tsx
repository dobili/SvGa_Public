/**
 * Spielen-Bildschirm: Partie gegen die Engine vorbereiten oder die laufende fortsetzen.
 *
 * Rolle im Gesamtbild: Startseite des Bereichs „Spielen“ (Leiste) und Ziel des Knopfes „Gegen die
 * Engine spielen“ an jeder Abbildung (Pflichtenheft 5.2: aus jeder Stellung zu Ende spielen,
 * Seite und Stufe wählen, Rücknahme abschaltbar; ein Spielziel gibt es seit 0.2.33 nicht mehr, Ziel ist
 * immer der Sieg). Die letzte Wahl merkt sich der
 * Speicher (Vorlieben). Seit 0.2.40 gibt es je Phase einen Regler für die Stufe (StufenWahl.tsx);
 * seit 0.2.41 die Wahl des Gegners (Engine mit vorgefertigten Gegnern oder Mensch am selben
 * Gerät), die Spielhilfen und die Wertung (GegnerWahl.tsx).
 * Seit 0.2.39 lässt sich aus der Grundstellung eine Eröffnung des Buches
 * vorgeben, der die Engine folgt (EroeffnungsWahl.tsx, Rückmeldung des Autors zu N178). Seit
 * 0.2.41 lässt sich die Startstellung selbst aufbauen (Stellungseditor.tsx); eine veränderte
 * Abbildungsstellung zählt dann als eigene Stellung. Darunter die letzten Partien zum Nachlesen.
 * Abhängigkeiten: spiel/partie.ts, spiel/uhr.ts, engine/stufen.ts, speicher/, Navigation, i18n.
 */
import { useState } from "react";
import { useNavigation } from "../../app/navigationsKontext";
import { t } from "../../i18n/sprache";
import { stellungAusFen, type Farbe } from "../../schach/stellung";
import { neuePartie, spielbar } from "../../spiel/partie";
import { UHR_VORGABEN } from "../../spiel/uhr";
import { mitLaufender, mitVorlieben, type Spielvorlieben } from "../../speicher/partien";
import { aendere, useSpeicher } from "../../speicher/speicher";
import { Brett } from "../brett/Brett";
import { Auswahl } from "../komponenten/Auswahl";
import { StufenWahl } from "../komponenten/StufenWahl";
import { GegnerWahl, HilfenWahl } from "../komponenten/GegnerWahl";
import { gegnerVon, type EigenerGegner } from "../../engine/gegner";
import { GegnerEditor } from "../komponenten/GegnerEditor";
import { EroeffnungsWahl } from "../komponenten/EroeffnungsWahl";
import { Kopfzeile } from "../komponenten/Kopfzeile";
import { LaufendePartie, Partienliste } from "../komponenten/Partienliste";
import { Stellungseditor } from "../komponenten/Stellungseditor";

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

/** Zählt eine Partie mit dieser Wahl für die Wertung? Nur gegen die Engine aus der Grundstellung. */
function wertbar(fen: string, vorlieben: Spielvorlieben): boolean {
  return fen === GRUNDSTELLUNG && vorlieben.gegner === "engine";
}

/** Seite, Stufe, Uhr, Rücknahme. */
function Einstellungen({
  wahl,
  fen,
  setze,
}: {
  wahl: Wahl;
  fen: string;
  setze: (wahl: Wahl) => void;
}) {
  const v = wahl.vorlieben;
  const eigene = useSpeicher((z) => z.daten.spiel.eigeneGegner);
  const mit = (teil: Partial<Spielvorlieben>) => setze({ ...wahl, vorlieben: { ...v, ...teil } });
  const uhrStellen = UHR_VORGABEN.map((_, stelle) => String(stelle));
  const engine = v.gegner === "engine";
  return (
    <section className="karte spielwahl">
      <GegnerWahl
        gegner={v.gegner}
        bot={v.bot}
        eigene={eigene}
        beiGegner={(gegner) => mit({ gegner, gewertet: gegner === "engine" })}
        beiBot={(bot) => {
          const g = gegnerVon(bot) ?? eigene.find((e) => e.kennung === bot) ?? null;
          mit(
            g
              ? { bot, stufenJePhase: g.stufenJePhase, stufe: g.stufenJePhase.mittelspiel }
              : { bot },
          );
        }}
      />
      {engine && (
        <Auswahl
          name={t("spielen.seite")}
          werte={["white", "black"] as const}
          gewaehlt={wahl.farbe}
          text={(farbe) => t(farbe === "white" ? "farbe.w" : "farbe.b")}
          beiWahl={(farbe) => setze({ ...wahl, farbe })}
        />
      )}
      {/* Bei vorgefertigten Gegnern bleiben die Stufen je Phase verborgen (Wunsch des Autors). */}
      {engine && gegnerVon(v.bot) === null && (
        <StufenWahl
          stufen={v.stufenJePhase}
          beiWahl={(stufenJePhase) =>
            mit({ stufenJePhase, stufe: stufenJePhase.mittelspiel, bot: null })
          }
        />
      )}
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
      <HilfenWahl
        hilfen={v.hilfen}
        gewertet={v.gewertet}
        wertbar={wertbar(fen, v)}
        beiHilfen={(hilfen) => mit({ hilfen })}
        beiGewertet={(gewertet) => mit({ gewertet })}
      />
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
  const [editor, setzeEditor] = useState(false);
  const gueltig = spielbar(eingabe.trim());
  const titel = abbildung
    ? t("spielen.abAbbildung", { nummer: abbildung })
    : fen === GRUNDSTELLUNG
      ? t("spielen.grundstellung")
      : t("spielen.eigeneStellung");
  return (
    <section className="karte startstellung">
      <h2 className="karte-titel">{titel}</h2>
      {editor ? (
        <Stellungseditor
          start={fen}
          beiUebernehmen={(neu) => {
            setzeFen(neu);
            setzeEditor(false);
          }}
          beiAbbrechen={() => setzeEditor(false)}
        />
      ) : (
        <>
          <div className="startbrett">
            <Brett fen={fen} markierungen={[]} beschriftung={titel} koordinaten={false} />
          </div>
          <button type="button" className="knopf-zweit" onClick={() => setzeEditor(true)}>
            {t("spielen.aufbauen")}
          </button>
        </>
      )}
      {!editor && (
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

/** Name, Fehlerarten, Stil und blinde Flecken des gewählten Gegners für die Partie (0.2.42, 0.2.46). */
function gegnerprofil(bot: string | null, eigene: readonly EigenerGegner[]) {
  const eigener = eigene.find((g) => g.kennung === bot);
  if (eigener) {
    return {
      botName: eigener.name,
      fehlerarten: eigener.fehlerarten,
      stil: eigener.stil,
      blindeFlecken: eigener.blindeFlecken,
    };
  }
  const vorgefertigt = gegnerVon(bot);
  if (!vorgefertigt) return {};
  return {
    botName: vorgefertigt.name,
    fehlerarten: vorgefertigt.fehlerarten,
    blindeFlecken: vorgefertigt.blindeFlecken,
  };
}

/** Legt die Partie an, merkt die Vorlieben und öffnet die Partie. */
function useBeginne(fen: string, abbildung: string | undefined) {
  const { navigiere } = useNavigation();
  const eigene = useSpeicher((z) => z.daten.spiel.eigeneGegner);
  return (wahl: Wahl) => {
    const v = wahl.vorlieben;
    const bot = v.gegner === "engine" ? v.bot : null;
    const einstellung = {
      ...gegnerprofil(bot, eigene),
      startFen: fen,
      eigeneFarbe: wahl.farbe,
      stufe: v.stufenJePhase.mittelspiel,
      stufenJePhase: v.stufenJePhase,
      uhr: v.uhr,
      ruecknahmeErlaubt: v.ruecknahmeErlaubt,
      abbildung: abbildung ?? null,
      eroeffnung: fen === GRUNDSTELLUNG && v.gegner === "engine" ? wahl.eroeffnung : null,
      gegner: v.gegner,
      bot,
      hilfen: v.hilfen,
      // Nur Partien gegen die Engine aus der Grundstellung zählen (Wunsch des Autors).
      gewertet: v.gewertet && wertbar(fen, v),
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
  // Eine veränderte Abbildungsstellung ist eine eigene Stellung.
  const abbildungGilt = fen === startFen ? abbildung : undefined;
  const beginne = useBeginne(fen, abbildungGilt);
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
      <Startstellung fen={fen} abbildung={abbildungGilt} setzeFen={uebernimm} />
      {!ok && <p className="fehlertext">{t("spielen.nichtSpielbar")}</p>}
      <Einstellungen wahl={wahl} fen={fen} setze={setzeWahl} />
      {wahl.vorlieben.gegner === "engine" && <GegnerEditor />}
      {fen === GRUNDSTELLUNG && wahl.vorlieben.gegner === "engine" && (
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
