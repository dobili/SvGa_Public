/**
 * Spielen-Bildschirm (Entwurf J3 „Schnell eine Partie“, Wahl des Autors 31.10.2026): Startseite
 * mit laufender Partie, Vorschlagskarte, Rivale, Spielstärke, Kacheln zu den Unterseiten und
 * „Zuletzt gespielt“; die Unterseiten selbst kommen aus der Liste SPIELSEITEN.
 *
 * Rolle im Gesamtbild: Startseite des Bereichs „Spielen“ (Leiste) und Ziel des Knopfes „Gegen die
 * Engine spielen“ an jeder Abbildung (Pflichtenheft 5.2: aus jeder Stellung zu Ende spielen,
 * Seite und Stufe wählen, Rücknahme abschaltbar). Der Autor fand den alten Bildschirm zu
 * technisch, zu textlastig, wie ein Formular; Einsteiger spielen jetzt mit einem Tipp gegen einen
 * passenden Bot (vorschlag.ts). Farbe, alle Bedenkzeiten, Wertung, Spielhilfen und Eröffnung
 * stehen im Blatt „Partie einstellen“ (PartieEinstellen.tsx); Gegnerarten, eigene Stufe, eigene
 * Bots und freie Partie (Mensch, Stellung, FEN) sind eigene Seiten (spielseiten.tsx). Aus einer
 * Abbildung steht ihre Stellung oben (DS51), die Kacheln reichen sie an die Unterseiten weiter.
 * Die Wahl merkt sich der Speicher (Vorlieben, useSpielwahl.ts).
 * Abhängigkeiten: spielstart/ (useSpielwahl, useVorschlaege, Vorschlagskarte, PartieEinstellen,
 * LaufendeKarte, ZuletztGespielt, spielseiten, Startstellung, vorbelegung), Rivalenkarte,
 * varianten/Probekarte (nicht beendete Probepartie),
 * LetzteSpielstaerke, Kopfzeile, TourKnopf, Navigation, Speicher, i18n.
 */
import { useState } from "react";
import { useNavigation } from "../../app/navigationsKontext";
import { t } from "../../i18n/sprache";
import { spielbar } from "../../spiel/partie";
import { useSpeicher } from "../../speicher/speicher";
import { TourKnopf } from "../../tour/TourKnopf";
import { LetzteSpielstaerke } from "../komponenten/fortschritt/LetzteSpielstaerke";
import { Kopfzeile } from "../komponenten/rahmen/Kopfzeile";
import { Rivalenkarte } from "../komponenten/rivale/Rivalenkarte";
import { LaufendeKarte } from "../komponenten/spielstart/LaufendeKarte";
import { PartieEinstellen } from "../komponenten/spielstart/PartieEinstellen";
import { spielseite, SPIELSEITEN } from "../komponenten/spielstart/spielseiten";
import { GRUNDSTELLUNG, mitBot } from "../komponenten/spielstart/spielwahl";
import { Startstellung } from "../komponenten/spielstart/Startstellung";
import { useSpielwahl, type Spielwahl } from "../komponenten/spielstart/useSpielwahl";
import { useVorschlaege } from "../komponenten/spielstart/useVorschlaege";
import { VORBELEGT } from "../komponenten/spielstart/vorbelegung";
import { Vorschlagskarte } from "../komponenten/spielstart/Vorschlagskarte";
import { ZuletztGespielt } from "../komponenten/spielstart/ZuletztGespielt";
import { probewertAus, type Probeherkunft } from "../../spiel/probepartie";
import { Probekarte } from "../komponenten/varianten/Probekarte";
import { Abenteuerkarte } from "../../abenteuer/anbindung/Abenteuerkarte";
import "../stil/spielenneu.css";

/** Die Kacheln zu den Unterseiten; sie reichen eine Stellung aus einer Abbildung weiter. */
function Spielkacheln({ sw }: { sw: Spielwahl }) {
  const { navigiere } = useNavigation();
  const eigene = useSpeicher((z) => z.daten.spiel.eigeneGegner);
  const stellung = sw.fen === GRUNDSTELLUNG ? {} : { startFen: sw.fen };
  return (
    <nav className="spielkacheln" aria-label={t("spielenneu.kacheln")} data-tour="spielen-kacheln">
      {SPIELSEITEN.map((s) => (
        <button
          key={s.kennung}
          type="button"
          className="spielkachel"
          data-testid={`spielkachel-${s.kennung}`}
          onClick={() =>
            navigiere({
              bildschirm: "spielen",
              seite: s.kennung,
              ...stellung,
              ...(sw.abbildung ? { abbildung: sw.abbildung } : {}),
            })
          }
        >
          <span className="spielkachel-bild">{s.bild()}</span>
          <span className="spielkachel-titel">{s.titel()}</span>
          <span className="spielkachel-text">{s.text(eigene)}</span>
        </button>
      ))}
    </nav>
  );
}

/** Die Karte „Schnell eine Partie“ mit Blatt; spielt immer gegen den Vorschlag. */
function Schnellstart({
  sw,
  vorbelegt,
  probe = false,
}: {
  sw: Spielwahl;
  vorbelegt: boolean;
  probe?: boolean;
}) {
  const spiel = useSpeicher((z) => z.daten.spiel);
  const [blatt, setzeBlatt] = useState(false);
  const stand = useVorschlaege(vorbelegt ? sw.wahl.vorlieben.bot : null, sw.fen);
  const vorschlag = stand.vorschlag;
  if (!vorschlag) return null;
  // Die Wahl mit dem vorgeschlagenen Bot: Das Blatt stellt genau diese Partie ein.
  const mitVorschlag = mitBot(sw.wahl.vorlieben, vorschlag.bot, spiel.eigeneGegner);
  const wahl = { ...sw.wahl, vorlieben: mitVorschlag };
  const blattwahl: Spielwahl = {
    ...sw,
    wahl,
    mit: (teil) => sw.setze({ ...wahl, vorlieben: { ...mitVorschlag, ...teil } }),
  };
  return (
    <>
      <Vorschlagskarte
        vorschlag={vorschlag}
        mehrere={stand.mehrere}
        wahl={wahl}
        fen={sw.fen}
        eigene={spiel.eigeneGegner}
        // Eine Probepartie ersetzt die laufende Partie nicht (eigener Platz, Format 8).
        laufend={!probe && spiel.laufend !== null}
        beiUhr={(uhr) => sw.mit({ uhr })}
        beiEinstellen={() => setzeBlatt(true)}
        beiAnderer={stand.naechster}
        beiBeginn={() => sw.beginne(wahl)}
      />
      <PartieEinstellen sw={blattwahl} offen={blatt} schliessen={() => setzeBlatt(false)} />
    </>
  );
}

/** Probepartie „von hier“ (Format 8): nur Stellung und Gegnerwahl, mit Hinweis „zählt nicht“. */
function Probestart({ startFen, probe }: { startFen?: string; probe: Probeherkunft }) {
  const sw = useSpielwahl(startFen, undefined, probe);
  return (
    <div className="bildschirm bildschirm-spielen spielen-start" data-testid="spielen">
      <Kopfzeile titel={t("varianten.probe.titel")} zurueckText={t("spielen.zurueck")} />
      <p className="hinweis probehinweis" data-testid="probehinweis">
        {t("varianten.probe.hinweis")}
      </p>
      <Startstellung fen={sw.fen} abbildung={undefined} setzeFen={sw.uebernimm} />
      {spielbar(sw.fen) && <Schnellstart sw={sw} vorbelegt={false} probe />}
    </div>
  );
}

/** Die Startseite. `vorbelegt`: Vorbelegung (Revanche, Rivale, Ziel) zuerst vorschlagen. */
function Startseite(p: { startFen?: string; abbildung?: string; vorbelegt: boolean }) {
  const spiel = useSpeicher((z) => z.daten.spiel);
  const sw = useSpielwahl(p.startFen, p.abbildung);
  const ausGrund = sw.fen === GRUNDSTELLUNG && !sw.abbildung;
  return (
    <div className="bildschirm bildschirm-spielen spielen-start" data-testid="spielen">
      {p.startFen ? (
        <Kopfzeile titel={t("spielen.titel")} zurueckText={t("spielen.zurueck")} />
      ) : (
        <header className="seitenkopf">
          <h1>{t("spielen.titel")}</h1>
          <TourKnopf />
        </header>
      )}
      {spiel.laufend && <LaufendeKarte partie={spiel.laufend} />}
      {/* Eine nicht beendete Probepartie (Varianten, Format 8) findet man hier wieder. */}
      <Probekarte />
      {/* DS51: Aus einer Abbildung oder eigenen Stellung ist die Stellung die Hauptsache. */}
      {!ausGrund && <Startstellung fen={sw.fen} abbildung={sw.abbildung} setzeFen={sw.uebernimm} />}
      {spielbar(sw.fen) ? (
        <Schnellstart sw={sw} vorbelegt={p.vorbelegt} />
      ) : (
        <p className="fehlertext">{t("spielen.nichtSpielbar")}</p>
      )}
      {/* Gamifizierung P8: der Rivale, wenn keine Partie läuft und aus der Grundstellung. */}
      {!spiel.laufend && ausGrund && <Rivalenkarte />}
      <LetzteSpielstaerke partien={spiel.partien} />
      <Spielkacheln sw={sw} />
      {/* Schach-Abenteuer (docs/spiel): Einstieg ins Spiel, nur aus der Grundstellung sinnvoll. */}
      {ausGrund && <Abenteuerkarte />}
      <ZuletztGespielt />
    </div>
  );
}

/**
 * Der Bildschirm „Spielen“: eine Unterseite aus SPIELSEITEN oder die Startseite.
 * Beispiel: `navigiere({ bildschirm: "spielen", seite: "gegner" })` → „Gegner aussuchen“.
 */
export function Spielen({
  startFen,
  abbildung,
  seite,
  probe,
}: {
  startFen?: string;
  abbildung?: string;
  seite?: string;
  probe?: string;
}) {
  const herkunft = probewertAus(probe);
  if (herkunft) return <Probestart startFen={startFen} probe={herkunft} />;
  const unterseite = spielseite(seite);
  if (unterseite) return <unterseite.Seite startFen={startFen} abbildung={abbildung} />;
  return <Startseite startFen={startFen} abbildung={abbildung} vorbelegt={seite === VORBELEGT} />;
}
