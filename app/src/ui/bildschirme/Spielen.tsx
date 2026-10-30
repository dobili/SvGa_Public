/**
 * Spielen-Bildschirm: Partie gegen die Engine vorbereiten oder die laufende fortsetzen.
 *
 * Rolle im Gesamtbild: Startseite des Bereichs „Spielen“ (Leiste) und Ziel des Knopfes „Gegen die
 * Engine spielen“ an jeder Abbildung (Pflichtenheft 5.2: aus jeder Stellung zu Ende spielen,
 * Seite und Stufe wählen, Rücknahme abschaltbar; Ziel ist immer der Sieg). Die letzte Wahl merkt
 * sich der Speicher (Vorlieben). Wählbar sind der Gegner (Engine mit vorgefertigten Gegnern,
 * eigene Stufe mit Reglern je Phase oder Mensch am selben Gerät), die Spielhilfen und die Wertung
 * (GegnerWahl.tsx, EigeneStufe.tsx, HilfenWahl.tsx). Aus der Grundstellung lässt sich eine
 * Eröffnung des Buches vorgeben, der die Engine folgt (EroeffnungsWahl.tsx, Rückmeldung des
 * Autors zu N178); feste Eröffnungen eines eigenen Bots haben Vorrang, außer mit Haken (Paket 9,
 * BotEroeffnungVorrang.tsx). Die Startstellung lässt sich auch selbst aufbauen (Startstellung.tsx mit
 * Stellungseditor); eine veränderte Abbildungsstellung zählt dann als eigene Stellung.
 * Abhängigkeiten: spiel/partie.ts, spiel/uhr.ts, engine/stufen.ts, speicher/, Navigation, i18n.
 */
import { useState, type ReactNode } from "react";
import { useNavigation } from "../../app/navigationsKontext";
import { t } from "../../i18n/sprache";
import { stellungAusFen, type Farbe } from "../../schach/stellung";
import { EROEFFNUNG_PRAXIS, neuePartie, spielbar } from "../../spiel/partie";
import { UHR_VORGABEN } from "../../spiel/uhr";
import { uhrnameKurz, uhrstelle, uhrStellen, wirksameUhr } from "../komponenten/spielstart/uhrwahl";
import { Startleiste } from "../komponenten/spielstart/Startleiste";
import { ZeitWahl } from "../komponenten/spielstart/ZeitWahl";
import { mitLaufender, mitVorlieben, type Spielvorlieben } from "../../speicher/partien";
import { aendere, useSpeicher } from "../../speicher/speicher";
import { Auswahl } from "../komponenten/bausteine/Auswahl";
import { EigeneStufe } from "../komponenten/gegnereditor/EigeneStufe";
import { BeginnenKnopf } from "../komponenten/spielstart/BeginnenKnopf";
import { GegnerWahl } from "../komponenten/gegner/GegnerWahl";
import { HilfenWahl, WertungsWahl } from "../komponenten/spielstart/HilfenWahl";
import {
  botFuerKategorie,
  kategorieVon,
  type Gegnerkategorie,
} from "../komponenten/gegner/gegnerkategorie";
import { GegnerEditor } from "../komponenten/gegnereditor/GegnerEditor";
import { Eroeffnungsteil } from "../komponenten/spielstart/BotEroeffnungVorrang";
import { eroeffnungFuerPartie } from "../../spiel/boteroeffnung";
import { Titelsymbol } from "../komponenten/bausteine/Titelsymbol";
import { gruppenstufe, gruppenstufen } from "../../engine/gruppe";
import { gegnerVon } from "../../engine/gegner";
import { gegnerprofil } from "./gegnerprofil";
import { startangabe } from "./startstaerke";
import { Kopfzeile } from "../komponenten/rahmen/Kopfzeile";
import { TourKnopf } from "../../tour/TourKnopf";
import { LaufendePartie } from "../komponenten/partienliste/Partienliste";
import { LetzteSpielstaerke } from "../komponenten/fortschritt/LetzteSpielstaerke";
import { useMaiaAktiv } from "../komponenten/einstellungen/maiastand";
import { Startstellung } from "../komponenten/spielstart/Startstellung";

const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
/** Kennung der Karte mit der Gegnerwahl, Ziel der Startleiste (DS40). */
const SPIELWAHL = "spielwahl";

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
  /** Paket 9: Die Wahl gilt statt der festen Eröffnungen eines eigenen Bots (Haken). */
  readonly ueberschreiben: boolean;
}

/** Zählt eine Partie mit dieser Wahl für die Wertung? Nur gegen die Engine aus der Grundstellung. */
function wertbar(fen: string, vorlieben: Spielvorlieben): boolean {
  return fen === GRUNDSTELLUNG && vorlieben.gegner === "engine";
}

/** Gegner mit Kategorie, Seite, Stufe, Uhr, Rücknahme. */
function Einstellungen({
  wahl,
  fen,
  setze,
  kategorie,
  setzeKategorie,
  eroeffnung,
}: {
  wahl: Wahl;
  fen: string;
  setze: (wahl: Wahl) => void;
  kategorie: Gegnerkategorie;
  setzeKategorie: (kategorie: Gegnerkategorie) => void;
  /** Die Wahl der Eröffnung (nur aus der Grundstellung gegen die Engine), sonst null. */
  eroeffnung: ReactNode;
}) {
  const v = wahl.vorlieben;
  const eigene = useSpeicher((z) => z.daten.spiel.eigeneGegner);
  const mit = (teil: Partial<Spielvorlieben>) => setze({ ...wahl, vorlieben: { ...v, ...teil } });
  // „Ohne Uhr“ nur noch außerhalb der Grundstellung (ungewertet), R51 (uhrwahl.ts).
  const stellen = uhrStellen(fen);
  const uhr = wirksameUhr(fen, v.uhr);
  const engine = v.gegner === "engine";
  // Ein Gegner bringt seine Stufen je Phase mit; ohne Gegner bleiben die Regler, wie sie sind.
  const waehleBot = (bot: string | null) => {
    const gruppe = gruppenstufe(bot);
    const g =
      gruppe !== null
        ? { stufenJePhase: gruppenstufen(gruppe) }
        : (gegnerVon(bot) ?? eigene.find((e) => e.kennung === bot) ?? null);
    mit(g ? { bot, stufenJePhase: g.stufenJePhase, stufe: g.stufenJePhase.mittelspiel } : { bot });
  };
  return (
    <>
      <section className="karte spielwahl" id={SPIELWAHL}>
        <GegnerWahl
          gegner={v.gegner}
          bot={v.bot}
          stufen={v.stufenJePhase}
          erlaubte={v.erlaubteFehlerarten}
          uhr={uhr}
          eigene={eigene}
          kategorie={kategorie}
          // R32: Der Haken „Gewertete Partie“ bleibt beim Wechsel der Art des Gegners, wie er war; ob
          // gewertet wird, entscheidet beim Start wertbar() (nur gegen die Engine).
          beiGegner={(gegner) => mit({ gegner })}
          beiBot={waehleBot}
          beiKategorie={(neu) => {
            setzeKategorie(neu);
            waehleBot(botFuerKategorie(neu, v.bot, eigene, v.stufenJePhase.mittelspiel));
          }}
          // Seit 0.2.126 dieselben Einstellungen wie bei eigenen Bots (Wunsch des Autors).
          stufeninhalt={<EigeneStufe v={v} mit={mit} />}
          editor={<GegnerEditor />}
        />
      </section>
      {/* Seit 0.2.137 eine eigene Karte (Wunsch des Autors, 25.10.2026): Unter den Einstellungen
          des Gegners begann „Du spielst“ ohne Trennung, man scrollte leicht darüber hinweg.
          Farbe, Bedenkzeit, Wertung, Spielhilfen und Eröffnung stehen seit DS51 (0.2.131) nach
          dem Gegner; die feste Startleiste zeigt Farbe, Zeit und Wertung ohnehin an. */}
      <section className="karte partiekarte" aria-labelledby="partiekarte-titel">
        <h2 className="karte-titel" id="partiekarte-titel">
          {t("spielen.partieTitel")}
        </h2>
        <div className="partieeinstellungen" data-tour="spielen-einstellungen">
          {engine && (
            <Auswahl
              name={t("spielen.seite")}
              symbol="farbe"
              werte={["white", "black"] as const}
              gewaehlt={wahl.farbe}
              text={(farbe) => t(farbe === "white" ? "farbe.w" : "farbe.b")}
              zeichen={(farbe) => <span className={`farbscheibe farbscheibe-${farbe}`} />}
              beiWahl={(farbe) => setze({ ...wahl, farbe })}
            />
          )}
          <ZeitWahl
            stellen={stellen}
            gewaehlt={uhrstelle(fen, v.uhr)}
            beiWahl={(stelle) => mit({ uhr: UHR_VORGABEN[Number(stelle)] ?? null })}
          />
          {/* Zugrücknahme gehört zu den Spielhilfen; beide in einer Klappe, ebenso die
                Eröffnung (Wunsch des Autors, 19.10.2026). */}
          <WertungsWahl
            gewertet={v.gewertet}
            wertbar={wertbar(fen, v)}
            beiGewertet={(gewertet) => mit({ gewertet })}
          />
          <details
            className="unterabschnitt"
            data-testid="spielhilfen-klappe"
            data-tour="spielen-hilfen"
          >
            <summary>
              <Titelsymbol art="hilfen" />
              {t("spielen.hilfen")}
            </summary>
            <label className="schalterzeile">
              <input
                type="checkbox"
                checked={v.ruecknahmeErlaubt && !wirdGewertet(fen, v)}
                disabled={wirdGewertet(fen, v)}
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
              beiGewertet={(gewertet) => mit({ gewertet })}
            />
          </details>
          {eroeffnung && (
            <details
              className="unterabschnitt"
              data-testid="eroeffnung-klappe"
              data-tour="spielen-eroeffnung"
            >
              <summary>
                <Titelsymbol art="eroeffnung" />
                {t("spielen.eroeffnungFestlegen")}
              </summary>
              {eroeffnung}
            </details>
          )}
        </div>
      </section>
    </>
  );
}

/** Legt die Partie an, merkt die Vorlieben und öffnet die Partie. */
function useBeginne(fen: string, abbildung: string | undefined) {
  const { navigiere } = useNavigation();
  const eigene = useSpeicher((z) => z.daten.spiel.eigeneGegner);
  // Seit 0.2.143: mit Maia, wenn das Paket geladen und eingeschaltet ist (gilt für die Partie).
  const mitMaia = useMaiaAktiv();
  return (wahl: Wahl) => {
    const v = wahl.vorlieben;
    const bot = v.gegner === "engine" ? v.bot : null;
    const einstellung = {
      ...gegnerprofil(bot, eigene, v),
      startFen: fen,
      eigeneFarbe: wahl.farbe,
      stufe: v.stufenJePhase.mittelspiel,
      stufenJePhase: v.stufenJePhase,
      uhr: wirksameUhr(fen, v.uhr),
      // Gewertete Partien: keine Rücknahme und keine Spielhilfen (Wunsch des Autors zu S9).
      ruecknahmeErlaubt: v.ruecknahmeErlaubt && !wirdGewertet(fen, v),
      abbildung: abbildung ?? null,
      // Paket 9: Ein eigener Bot mit festen Eröffnungen wählt je Partie eine, außer mit Haken.
      eroeffnung:
        fen === GRUNDSTELLUNG && v.gegner === "engine"
          ? eroeffnungFuerPartie(
              {
                botEroeffnungen: eigene.find((g) => g.kennung === bot)?.eroeffnungen ?? [],
                ueberschreiben: wahl.ueberschreiben,
                global: wahl.eroeffnung,
              },
              Math.random,
            )
          : null,
      gegner: v.gegner,
      bot,
      ...(mitMaia && v.gegner === "engine" ? { maia: true } : {}),
      hilfen: wirdGewertet(fen, v) ? OHNE_HILFEN : v.hilfen,
      // Nur Partien gegen die Engine aus der Grundstellung zählen (Wunsch des Autors).
      gewertet: wirdGewertet(fen, v),
    };
    const partie = neuePartie(einstellung, neueKennung(), new Date().toISOString());
    if (!partie) return;
    void aendere((d) => ({ ...d, spiel: mitLaufender(mitVorlieben(d.spiel, v), partie) }));
    navigiere({ bildschirm: "partie", id: partie.id });
  };
}

/** Keine Spielhilfen: in gewerteten Partien (S9). */
const OHNE_HILFEN = { symbole: false, werkzeuge: false } as const;

/**
 * Wird die Partie gewertet? Dann gibt es keine Zugrücknahme und keine Spielhilfen
 * (Wunsch des Autors zu S9, 17.10.2026: wer zurücknehmen oder Werkzeuge nutzen kann, spielt
 * stärker, als er ist).
 */
function wirdGewertet(fen: string, v: Parameters<typeof wertbar>[1]): boolean {
  return v.gewertet && wertbar(fen, v);
}

/** Die Seite am Zug einer Stellung; Weiß, wenn sie nicht lesbar ist. */
function seiteAmZug(fen: string): Farbe {
  const stellung = stellungAusFen(fen);
  return stellung.ok ? stellung.wert.amZug : "white";
}

/**
 * Der Bildschirm „Spielen“: Gegner, Stufen, Bedenkzeit und Farbe wählen und eine Partie beginnen
 * oder die laufende fortsetzen; auch aus einer Abbildung heraus.
 */
export function Spielen({ startFen, abbildung }: { startFen?: string; abbildung?: string }) {
  const spiel = useSpeicher((z) => z.daten.spiel);
  const [fen, setzeFen] = useState(startFen ?? GRUNDSTELLUNG);
  const [wahl, setzeWahl] = useState<Wahl>({
    farbe: seiteAmZug(fen),
    vorlieben: spiel.vorlieben,
    // Seit 0.2.128: Bots eröffnen wie Menschen ihrer Stärke (engine/praxisbuch.ts)
    eroeffnung: EROEFFNUNG_PRAXIS,
    ueberschreiben: false,
  });
  // Die Wahl von Gegner, Stufen, Uhr und Hilfen gilt sofort als Vorliebe, nicht erst beim
  // Beginnen; sonst stand die eigene Stufe nach einem Wechsel zum Buch wieder auf 1 · 1 · 1,
  // während Fehler und Stil schon gespeichert waren (Befund zu N801, 26.10.2026).
  const setzeUndMerke = (neu: Wahl) => {
    setzeWahl(neu);
    if (neu.vorlieben !== wahl.vorlieben)
      void aendere((d) => ({ ...d, spiel: mitVorlieben(d.spiel, neu.vorlieben) }));
  };
  // Eine eigene Stellung: Der Leser spielt zunächst die Seite am Zug.
  const uebernimm = (neu: string) => {
    setzeFen(neu);
    setzeWahl({ ...wahl, farbe: seiteAmZug(neu) });
  };
  const [kategorie, setzeKategorie] = useState<Gegnerkategorie>(() =>
    kategorieVon(spiel.vorlieben.bot, spiel.eigeneGegner),
  );
  // „Eigene Bots“ ohne gewählten eigenen Bot: erst anlegen oder wählen, dann beginnen.
  const ohneEigenenBot =
    wahl.vorlieben.gegner === "engine" &&
    kategorie === "eigene" &&
    !spiel.eigeneGegner.some((g) => g.kennung === wahl.vorlieben.bot);
  // Eine veränderte Abbildungsstellung ist eine eigene Stellung.
  const abbildungGilt = fen === startFen ? abbildung : undefined;
  const beginne = useBeginne(fen, abbildungGilt);
  const laufend = spiel.laufend;
  const ok = spielbar(fen) && !ohneEigenenBot;
  const ausGrund = fen === GRUNDSTELLUNG && !abbildungGilt;
  return (
    <div className="bildschirm bildschirm-spielen" data-testid="spielen">
      {startFen ? (
        <Kopfzeile titel={t("spielen.titel")} zurueckText={t("spielen.zurueck")} />
      ) : (
        <header className="seitenkopf">
          <h1>{t("spielen.titel")}</h1>
          <TourKnopf />
        </header>
      )}
      {laufend && <LaufendePartie partie={laufend} />}
      {/* DS51: Ab einer Abbildung oder eigenen Stellung ist die Stellung die Hauptsache und
          steht oben; aus der Grundstellung kommt erst der Gegner, die Stellung am Ende. */}
      {!ausGrund && <Startstellung fen={fen} abbildung={abbildungGilt} setzeFen={uebernimm} />}
      {!spielbar(fen) && <p className="fehlertext">{t("spielen.nichtSpielbar")}</p>}
      {/* Seit 0.2.139 wieder hier, ganz oben über dem Gegner (Wunsch des Autors, 25.10.2026): Wer
          spielen will, sieht zuerst, wo er steht; die Liste der Partien bleibt im Profil. */}
      <LetzteSpielstaerke partien={spiel.partien} />
      <Einstellungen
        wahl={wahl}
        fen={fen}
        setze={setzeUndMerke}
        kategorie={kategorie}
        setzeKategorie={setzeKategorie}
        eroeffnung={
          fen === GRUNDSTELLUNG && wahl.vorlieben.gegner === "engine" ? (
            <Eroeffnungsteil
              gewaehlt={wahl.eroeffnung}
              beiWahl={(eroeffnung) => setzeWahl({ ...wahl, eroeffnung })}
              bot={spiel.eigeneGegner.find((g) => g.kennung === wahl.vorlieben.bot)}
              ueberschreiben={wahl.ueberschreiben}
              beiUeberschreiben={(ueberschreiben) => setzeWahl({ ...wahl, ueberschreiben })}
            />
          ) : null
        }
      />
      {/* Seit 0.2.129 (DS40) steht „Partie beginnen“ in der festen Startleiste unten. */}
      <Startleiste
        ziel={SPIELWAHL}
        angaben={{
          gegner: wahl.vorlieben.gegner,
          bot: wahl.vorlieben.bot,
          kategorie,
          stufe: wahl.vorlieben.stufenJePhase.mittelspiel,
          eigene: spiel.eigeneGegner,
          farbe: wahl.farbe,
          uhr: uhrnameKurz(uhrstelle(fen, wahl.vorlieben.uhr)),
          gewertet: wirdGewertet(fen, wahl.vorlieben),
          staerke: startangabe(wahl.vorlieben, fen, spiel.eigeneGegner, spiel.besiegt),
        }}
        knopf={
          <BeginnenKnopf
            kurz
            laufend={laufend !== null}
            moeglich={ok}
            // Der Hinweis steht seit 0.2.129 in der Startleiste selbst (kürzer, ohne Umbruch).
            hinweis={null}
            beiBeginn={() => beginne(wahl)}
          />
        }
      />
      {ausGrund && <Startstellung fen={fen} abbildung={abbildungGilt} setzeFen={uebernimm} />}
    </div>
  );
}
