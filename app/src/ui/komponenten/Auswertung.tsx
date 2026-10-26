/**
 * Auswertung nach der Partie: erste klare Abweichung, grobe Patzer, Fehler der Engine, PGN.
 *
 * Rolle im Gesamtbild: Pflichtenheft 5.3 („Sprung zur ersten klaren Abweichung von der besten
 * Fortsetzung, grobe Patzer markiert, Export als PGN“) und 5.2 („In Zug 12 hat die Engine eine
 * Figur hängen lassen (W1). Hast du es gesehen?“). Die Werte rechnet useAuswertung im
 * Hintergrund; die Urteile spiel/auswertung.ts. Ein Sprung zeigt die Stellung vor dem Zug mit
 * dem besseren Zug (gold) und dem gespielten (rot). Darüber steht seit 0.2.38 die Verlaufskurve
 * (Vorschlag H); ein Tipp darauf zeigt die Stellung mit Zeichen und besserem Zug. Seit 0.2.39
 * folgt die Karte „Spielstärke“ (Genauigkeit, Schätzung, Zeichen je Seite, Spielstaerke.tsx).
 * Seit 0.2.85 (Wünsche des Autors): die erste Abweichung mit der Gewinnchance statt Bauern, grobe
 * Patzer beider Seiten mit einem Bauern in der Farbe der Seite und Sprung zur Stellung, von den
 * absichtlichen Fehlern der Engine zuerst nur drei („Alle zeigen“ klappt den Rest auf).
 * Seit R55/R56 (Wunsch des Autors, 23.10.2026): oben ein Umschalter Weiß/Schwarz (Voreinstellung
 * die eigene Seite), der die ganze Seite steuert: erste Abweichung, die eingeklappte Liste „Fehler
 * und Patzer“ (alle Fehler, verpassten Gewinne und Patzer der Seite), bei der Engine die
 * eingeklappte Liste ihrer absichtlichen Fehler, darunter Ring, Balken und Zugklassen.
 * Abhängigkeiten: spiel/auswertung.ts, spiel/pgn.ts, speicher/partien.ts, i18n.
 */
import type { Color } from "chessops/types";
import { useState } from "react";
import type { Markierung } from "../../analyse/werkzeug";
import { stufe } from "../../engine/stufen";
import { sprache, t } from "../../i18n/sprache";
import { sanInSprache } from "../../schach/notation";
import {
  enginefehler,
  ersteAbweichung,
  zugnummer,
  type Zugklasse,
  type Zugurteil,
} from "../../spiel/auswertung";
import { stellungen, type Partie } from "../../spiel/partie";
import { phasenwechsel, type Phase } from "../../spiel/phasen";
import { alsPgn } from "../../spiel/pgn";
import { uciZuSan } from "../../spiel/zuege";
import { zugFelder } from "../../schach/weiterspielen";
import type { Partieeintrag } from "../../speicher/partien";
import { bieteDateiAn } from "./dateiAnbieten";
import { Klassenmarke } from "./Auswertungssymbole";
import { Fortschrittsbalken } from "./Fortschrittsbalken";
import { Segmentwahl } from "./Segmentwahl";
import { gewinnchanceVorNach } from "./gewinnchance";
import { Spielstaerke } from "./Spielstaerke";
import { Verlaufskurve } from "./Verlaufskurve";
import type { Auswertungsstand } from "./useAuswertung";
import { Knopfsymbol } from "./Knopfsymbol";
import { Titelsymbol } from "./Titelsymbol";
import { useSpielerprofil } from "../profil/spieler";

const PROZENT = 100;
const SEITEN: readonly Color[] = ["white", "black"];
/** Klassen der Liste „Fehler und Patzer“ (R55). */
const FEHLERKLASSEN: ReadonlySet<Zugklasse> = new Set(["fehler", "verpasst", "patzer"]);

/** Die Seite, die den Zug an dieser Stelle gemacht hat. */
function seiteAn(partie: Partie, index: number): Color {
  return stellungen(partie)[index]?.split(" ")[1] === "b" ? "black" : "white";
}

/** Ein Sprung auf dem Brett: Stelle in der Partie und Markierungen dort. */
export interface Sprung {
  readonly stelle: number;
  readonly marken: readonly Markierung[];
}

function zugtext(partie: Partie, index: number, zeichen = ""): string {
  const san = partie.zuege[index]?.san ?? "";
  return `${zugnummer(partie, index)} ${sanInSprache(san, sprache())}${zeichen}`;
}

/** Gold der bessere Zug, rot der gespielte, in der Stellung vor dem Zug. */
function sprungZu(eintrag: Partieeintrag, index: number): Sprung {
  const fen = stellungen(eintrag.partie)[index] ?? "";
  const gespielt = zugFelder(fen, eintrag.partie.zuege[index]?.san ?? "");
  const bester = eintrag.beste[index] ?? "";
  const marken: Markierung[] = [];
  if (bester)
    marken.push({ typ: "pfeil", farbe: "gold", von: bester.slice(0, 2), nach: bester.slice(2, 4) });
  if (gespielt) marken.push({ typ: "pfeil", farbe: "rot", ...gespielt });
  return { stelle: index, marken };
}

/** Die erste klare Abweichung mit dem besseren Zug und dem Sprung dorthin. */
function Abweichung({
  eintrag,
  urteile,
  beiSprung,
}: {
  eintrag: Partieeintrag;
  urteile: readonly Zugurteil[];
  beiSprung: (sprung: Sprung) => void;
}) {
  const p = eintrag.partie;
  const erste = ersteAbweichung(p, urteile);
  if (!erste) return <p>{t("auswertung.keineAbweichung")}</p>;
  const fen = stellungen(p)[erste.index] ?? "";
  const bester = uciZuSan(fen, eintrag.beste[erste.index] ?? "");
  return (
    <div className="abweichung" data-tour="auswertung-abweichung">
      <p>
        {t("auswertung.abweichung", {
          zug: zugtext(p, erste.index, erste.zeichen ?? ""),
          ...gewinnchanceVorNach(eintrag.werte, erste.index, fen.split(" ")[1] !== "b"),
        })}
        {bester && ` ${t("auswertung.besser", { zug: sanInSprache(bester, sprache()) })}`}
      </p>
      <button
        type="button"
        className="knopf-zweit"
        onClick={() => beiSprung(sprungZu(eintrag, erste.index))}
      >
        {t("auswertung.zurStellung")}
      </button>
    </div>
  );
}

/**
 * Fehler, verpasste Gewinne und Patzer der gewählten Seite, eingeklappt mit der Anzahl (R55,
 * Wunsch des Autors: die Liste wurde oft sehr lang). Je Zug die farbige Marke und der Sprung zur
 * Stellung. Beispiel: „▸ Fehler und Patzer (3)“, aufgeklappt „?? 2. g4??“.
 */
function Fehlerliste({
  eintrag,
  urteile,
  beiSprung,
}: {
  eintrag: Partieeintrag;
  urteile: readonly Zugurteil[];
  beiSprung: (sprung: Sprung) => void;
}) {
  const partie = eintrag.partie;
  const fehler = urteile.filter((u) => FEHLERKLASSEN.has(u.klasse));
  if (fehler.length === 0) return null;
  return (
    <details
      className="klappliste fehlerliste"
      data-testid="grobe-patzer"
      data-tour="auswertung-patzer"
    >
      <summary>
        {t("auswertung.fehlerUndPatzer")} <span className="badge">{fehler.length}</span>
      </summary>
      <ul className="patzerliste">
        {fehler.map((u) => (
          <li key={u.index}>
            <button
              type="button"
              className="knopf-link"
              onClick={() => beiSprung(sprungZu(eintrag, u.index))}
            >
              <Klassenmarke klasse={u.klasse} /> {zugtext(partie, u.index, u.zeichen ?? "")}
            </button>
          </li>
        ))}
      </ul>
    </details>
  );
}

/** Die absichtlichen Fehler der Engine aus dem Protokoll, eingeklappt mit der Anzahl (R55). */
function Enginefehler({ partie, beiSprung }: { partie: Partie; beiSprung: (s: Sprung) => void }) {
  const fehler = enginefehler(partie);
  const ERSTE_STUFE_OHNE_PROFIL = 4;
  if (fehler.length === 0) {
    const niedrigste = Math.min(...Object.values(partie.einstellung.stufenJePhase));
    return niedrigste < ERSTE_STUFE_OHNE_PROFIL ? <p>{t("auswertung.engineOhneFehler")}</p> : null;
  }
  return (
    <details className="klappliste enginefehler" data-testid="enginefehler">
      <summary>
        {t("auswertung.engineFehlerTitel")} <span className="badge">{fehler.length}</span>
      </summary>
      <ul>
        {fehler.map((f) => (
          <li key={f.index}>
            {t("auswertung.engineFehler", {
              zug: zugtext(partie, f.index),
              fehler: t(`fehlerart.${f.fehler}`),
            })}{" "}
            <button
              type="button"
              className="knopf-link"
              onClick={() => beiSprung({ stelle: f.index + 1, marken: [] })}
            >
              {t("auswertung.zeigen")}
            </button>
          </li>
        ))}
      </ul>
    </details>
  );
}

/** PGN kopieren oder als Datei sichern. */
function Pgn({ partie, urteile }: { partie: Partie; urteile: readonly Zugurteil[] }) {
  const [meldung, setzeMeldung] = useState<string | null>(null);
  const profil = useSpielerprofil();
  const s = stufe(partie.einstellung.stufe);
  const kommentare = new Map(
    enginefehler(partie).map((f) => [
      f.index,
      t("pgn.fehler", { fehler: t(`fehlerart.${f.fehler}`) }),
    ]),
  );
  const zeichen = new Map(
    urteile.flatMap((u) => (u.zeichen ? [[u.index, u.zeichen] as const] : [])),
  );
  const mensch = partie.einstellung.gegner === "mensch";
  const kopf = {
    ereignis: mensch
      ? t("pgn.ereignisMensch")
      : t("pgn.ereignis", { nummer: s.nummer, name: t(s.name) }),
    // Seit 0.2.140 der Name aus dem Profil, sonst „Leser“.
    leser: mensch ? t("pgn.weiss") : profil.name || t("pgn.leser"),
    engine: mensch ? t("pgn.schwarz") : t("pgn.engine", { nummer: s.nummer }),
  };
  const text = alsPgn(partie, kopf, kommentare, zeichen);
  const kopiere = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setzeMeldung(t("pgn.kopiert"));
    } catch (fehler) {
      console.warn("Zwischenablage nicht verfügbar:", fehler);
      setzeMeldung(t("pgn.nichtKopiert"));
    }
  };
  const datei = `partie-${partie.begonnen.slice(0, "JJJJ-MM-TT".length)}.pgn`;
  return (
    <div className="pgn" data-tour="auswertung-pgn">
      <div className="knopfreihe">
        <button type="button" className="knopf-zweit" onClick={() => void kopiere()}>
          <Knopfsymbol art="kopieren" />
          {t("pgn.kopieren")}
        </button>
        <button
          type="button"
          className="knopf-zweit"
          onClick={() => bieteDateiAn(text, datei, "application/vnd.chess-pgn")}
        >
          <Knopfsymbol art="herunterladen" />
          {t("pgn.sichern")}
        </button>
      </div>
      {meldung && <p className="hinweis">{meldung}</p>}
      {meldung === t("pgn.nichtKopiert") && <pre className="vorformatiert">{text}</pre>}
    </div>
  );
}

/**
 * Fortschritt der laufenden Auswertung als Balken mit Prozentzahl (R29, Wunsch des Autors:
 * „Zug x von y“ sagte wenig, ein Balken zeigt auf einen Blick, wie weit die Engine ist).
 * Beispiel: 12 von 48 Stellungen → Balken zu einem Viertel, daneben „25 %“.
 */
function Auswertungsfortschritt({ erledigt, gesamt }: { erledigt: number; gesamt: number }) {
  const prozent = gesamt > 0 ? Math.round((erledigt / gesamt) * PROZENT) : 0;
  return (
    <div className="auswertung-fortschritt">
      <p>{t("auswertung.laeuft")}</p>
      <div className="auswertung-fortschritt-zeile">
        <Fortschrittsbalken
          anteil={{ erreicht: erledigt, gesamt }}
          beschriftung={t("auswertung.titel")}
        />
        <span className="auswertung-prozent" data-testid="auswertung-prozent">
          {t("auswertung.prozent", { prozent })}
        </span>
      </div>
    </div>
  );
}

/** Umschalter Weiß/Schwarz; bei der Engine mit ihrem Namen, die eigene Seite mit „(du)“. */
function Seitenwahl({
  partie,
  seite,
  beiWahl,
}: {
  partie: Partie;
  seite: Color;
  beiWahl: (seite: Color) => void;
}) {
  const e = partie.einstellung;
  const name = (s: Color) => {
    const farbe = t(s === "white" ? "farbe.w" : "farbe.b");
    if (e.gegner !== "engine") return farbe;
    if (s === e.eigeneFarbe) return t("auswertung.seiteDu", { farbe });
    return t("auswertung.seiteGegner", { farbe, name: e.botName ?? t("spielstaerke.gegnerName") });
  };
  return (
    <Segmentwahl
      name={t("auswertung.seite")}
      werte={SEITEN}
      gewaehlt={seite}
      text={name}
      beiWahl={beiWahl}
    />
  );
}

/**
 * Die Auswertung unter einer beendeten Partie: Verlaufskurve, erste klare Abweichung, grobe Patzer,
 * absichtliche Fehler der Engine und die PGN.
 */
export function Auswertung({
  eintrag,
  stand,
  urteile,
  phasen,
  beiSprung,
}: {
  eintrag: Partieeintrag;
  stand: Auswertungsstand;
  urteile: readonly Zugurteil[];
  /** Phase je Stellung (spiel/phasen.ts), für Kurve und Spielstärke je Phase. */
  phasen: readonly Phase[];
  beiSprung: (sprung: Sprung) => void;
}) {
  const partie = eintrag.partie;
  const [seite, setzeSeite] = useState<Color>(partie.einstellung.eigeneFarbe);
  const eigeneUrteile = urteile.filter((u) => seiteAn(partie, u.index) === seite);
  const engineSeite =
    partie.einstellung.gegner === "engine" && seite !== partie.einstellung.eigeneFarbe;
  return (
    <section className="karte auswertung" data-testid="auswertung" data-tour="auswertung">
      <h2 className="karte-titel">
        <Titelsymbol art="auswertung" />
        {t("auswertung.titel")}
      </h2>
      {/* PGN ganz oben (Wunsch des Autors, 25.10.2026): Export sucht man nicht mitten im Text. */}
      <Pgn partie={partie} urteile={urteile} />
      {stand.art === "laeuft" && (
        <Auswertungsfortschritt erledigt={stand.erledigt} gesamt={stand.gesamt} />
      )}
      {stand.art === "fehler" && <p className="fehlertext">{stand.meldung}</p>}
      {urteile.length > 0 && <Seitenwahl partie={partie} seite={seite} beiWahl={setzeSeite} />}
      {urteile.length > 0 && (
        <>
          <Verlaufskurve
            werte={eintrag.werte}
            urteile={urteile}
            wechsel={phasenwechsel(phasen)}
            beiStelle={(stelle) => beiSprung({ stelle, marken: [] })}
            zugname={(stelle) =>
              stelle === 0
                ? t("rueckblick.startstellung")
                : zugtext(
                    partie,
                    stelle - 1,
                    urteile.find((u) => u.index === stelle - 1)?.zeichen ?? "",
                  )
            }
          />
          {/* Die erste Abweichung betrifft nur Züge des Lesers (spiel/auswertung.ts). */}
          {!engineSeite && (
            <Abweichung eintrag={eintrag} urteile={eigeneUrteile} beiSprung={beiSprung} />
          )}
          <Fehlerliste eintrag={eintrag} urteile={eigeneUrteile} beiSprung={beiSprung} />
        </>
      )}
      {/* Zu zweit spielt keine Engine; der Satz „keinen absichtlichen Fehler“ wäre falsch. */}
      {(urteile.length === 0 ? partie.einstellung.gegner === "engine" : engineSeite) && (
        <Enginefehler partie={partie} beiSprung={beiSprung} />
      )}
      <Spielstaerke
        partie={partie}
        werte={eintrag.werte}
        urteile={urteile}
        beste={eintrag.beste}
        phasen={phasen}
        seite={seite}
      />
    </section>
  );
}
