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
 * Abhängigkeiten: spiel/auswertung.ts, spiel/pgn.ts, speicher/partien.ts, i18n.
 */
import { useState } from "react";
import type { Markierung } from "../../analyse/werkzeug";
import { stufe } from "../../engine/stufen";
import { sprache, t } from "../../i18n/sprache";
import { sanInSprache } from "../../schach/notation";
import {
  enginefehler,
  ersteAbweichung,
  GROBER_PATZER,
  zugnummer,
  type Zugurteil,
} from "../../spiel/auswertung";
import { stellungen, type Partie } from "../../spiel/partie";
import { phasenwechsel, type Phase } from "../../spiel/phasen";
import { alsPgn } from "../../spiel/pgn";
import { uciZuSan } from "../../spiel/zuege";
import { zugFelder } from "../../schach/weiterspielen";
import type { Partieeintrag } from "../../speicher/partien";
import { bieteDateiAn } from "./dateiAnbieten";
import { Seitenfigur } from "./Auswertungssymbole";
import { Fortschrittsbalken } from "./Fortschrittsbalken";
import { gewinnchanceVorNach } from "./gewinnchance";
import { Spielstaerke } from "./Spielstaerke";
import { Verlaufskurve } from "./Verlaufskurve";
import type { Auswertungsstand } from "./useAuswertung";
import { Knopfsymbol } from "./Knopfsymbol";
import { Titelsymbol } from "./Titelsymbol";

/** So viele absichtliche Fehler der Engine stehen zuerst da (0.2.85, Wunsch des Autors). */
const ERSTE_ENGINEFEHLER = 3;
const PROZENT = 100;

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
    <div className="abweichung">
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
 * Grobe Patzer beider Seiten (mehr als zwei Bauern laut Engine), je mit einem Bauern in der Farbe
 * der Seite und Sprung zur Stellung; ohne Züge, nach denen die Seite weiter klar gewinnt (K5: die
 * haben nur „?!“). Beispiel: „♙ 10. Tb1??“ für Weiß.
 */
function Patzer({
  eintrag,
  urteile,
  beiSprung,
}: {
  eintrag: Partieeintrag;
  urteile: readonly Zugurteil[];
  beiSprung: (sprung: Sprung) => void;
}) {
  const partie = eintrag.partie;
  const alle = stellungen(partie);
  const grobe = urteile.filter((u) => u.verlust > GROBER_PATZER && u.klasse !== "ungenau");
  if (grobe.length === 0) return null;
  return (
    <div className="grobe-patzer" data-testid="grobe-patzer">
      <span>{t("auswertung.patzer")}</span>
      <ul className="patzerliste">
        {grobe.map((u) => (
          <li key={u.index}>
            <button
              type="button"
              className="knopf-link"
              onClick={() => beiSprung(sprungZu(eintrag, u.index))}
            >
              <Seitenfigur farbe={alle[u.index]?.split(" ")[1] === "b" ? "black" : "white"} />{" "}
              {zugtext(partie, u.index, u.zeichen ?? "")}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Die absichtlichen Fehler der Engine aus dem Protokoll. */
function Enginefehler({ partie, beiSprung }: { partie: Partie; beiSprung: (s: Sprung) => void }) {
  const [alleZeigen, setzeAlleZeigen] = useState(false);
  const fehler = enginefehler(partie);
  const sichtbar = alleZeigen ? fehler : fehler.slice(0, ERSTE_ENGINEFEHLER);
  const ERSTE_STUFE_OHNE_PROFIL = 4;
  if (fehler.length === 0) {
    const niedrigste = Math.min(...Object.values(partie.einstellung.stufenJePhase));
    return niedrigste < ERSTE_STUFE_OHNE_PROFIL ? <p>{t("auswertung.engineOhneFehler")}</p> : null;
  }
  return (
    <div className="enginefehler" data-testid="enginefehler">
      <ul>
        {sichtbar.map((f) => (
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
      {fehler.length > ERSTE_ENGINEFEHLER && (
        <button type="button" className="knopf-link" onClick={() => setzeAlleZeigen(!alleZeigen)}>
          {alleZeigen
            ? t("auswertung.engineWeniger")
            : t("auswertung.engineAlle", { anzahl: fehler.length })}
        </button>
      )}
    </div>
  );
}

/** PGN kopieren oder als Datei sichern. */
function Pgn({ partie, urteile }: { partie: Partie; urteile: readonly Zugurteil[] }) {
  const [meldung, setzeMeldung] = useState<string | null>(null);
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
    leser: mensch ? t("pgn.weiss") : t("pgn.leser"),
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
    <div className="pgn">
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
  return (
    <section className="karte auswertung" data-testid="auswertung">
      <h2 className="karte-titel">
        <Titelsymbol art="auswertung" />
        {t("auswertung.titel")}
      </h2>
      {stand.art === "laeuft" && (
        <Auswertungsfortschritt erledigt={stand.erledigt} gesamt={stand.gesamt} />
      )}
      {stand.art === "fehler" && <p className="fehlertext">{stand.meldung}</p>}
      {urteile.length > 0 && (
        <>
          <Verlaufskurve
            werte={eintrag.werte}
            urteile={urteile}
            wechsel={phasenwechsel(phasen)}
            beiStelle={(stelle) => beiSprung({ stelle, marken: [] })}
          />
          <Abweichung eintrag={eintrag} urteile={urteile} beiSprung={beiSprung} />
          <Patzer eintrag={eintrag} urteile={urteile} beiSprung={beiSprung} />
        </>
      )}
      {/* Zu zweit spielt keine Engine; der Satz „keinen absichtlichen Fehler“ wäre falsch. */}
      {eintrag.partie.einstellung.gegner === "engine" && (
        <Enginefehler partie={eintrag.partie} beiSprung={beiSprung} />
      )}
      <Pgn partie={eintrag.partie} urteile={urteile} />
      <Spielstaerke
        partie={eintrag.partie}
        werte={eintrag.werte}
        urteile={urteile}
        beste={eintrag.beste}
        phasen={phasen}
      />
    </section>
  );
}
