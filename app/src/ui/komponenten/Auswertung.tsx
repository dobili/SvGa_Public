/**
 * Auswertung nach der Partie: erste klare Abweichung, grobe Patzer, Fehler der Engine, PGN.
 *
 * Rolle im Gesamtbild: Pflichtenheft 5.3 („Sprung zur ersten klaren Abweichung von der besten
 * Fortsetzung, grobe Patzer markiert, Export als PGN“) und 5.2 („In Zug 12 hat die Engine eine
 * Figur hängen lassen (W1). Hast du es gesehen?“). Die Werte rechnet useAuswertung im
 * Hintergrund; die Urteile spiel/auswertung.ts. Ein Sprung zeigt die Stellung vor dem Zug mit
 * dem besseren Zug (gold) und dem gespielten (rot).
 * Abhängigkeiten: spiel/auswertung.ts, spiel/pgn.ts, speicher/partien.ts, i18n.
 */
import { useState } from "react";
import type { Markierung } from "../../analyse/werkzeug";
import { stufe } from "../../engine/stufen";
import { t } from "../../i18n/sprache";
import { sanInSprache } from "../../schach/notation";
import {
  enginefehler,
  ersteAbweichung,
  GROBER_PATZER,
  zugnummer,
  type Zugurteil,
} from "../../spiel/auswertung";
import { stellungen, type Partie } from "../../spiel/partie";
import { alsPgn } from "../../spiel/pgn";
import { uciZuSan } from "../../spiel/zuege";
import { zugFelder } from "../../schach/weiterspielen";
import type { Partieeintrag } from "../../speicher/partien";
import { bieteDateiAn } from "./dateiAnbieten";
import { Fortschrittsbalken } from "./Fortschrittsbalken";
import type { Auswertungsstand } from "./useAuswertung";

/** Ein Sprung auf dem Brett: Stelle in der Partie und Markierungen dort. */
export interface Sprung {
  readonly stelle: number;
  readonly marken: readonly Markierung[];
}

function zugtext(partie: Partie, index: number, zeichen = ""): string {
  const san = partie.zuege[index]?.san ?? "";
  return `${zugnummer(partie, index)} ${sanInSprache(san, "de")}${zeichen}`;
}

function bauern(verlust: number): string {
  return verlust.toFixed(1).replace(".", ",");
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
          verlust: bauern(erste.verlust),
        })}
        {bester && ` ${t("auswertung.besser", { zug: sanInSprache(bester, "de") })}`}
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

/** Grobe Patzer des Lesers (mehr als zwei Bauern). */
function Patzer({ partie, urteile }: { partie: Partie; urteile: readonly Zugurteil[] }) {
  const grobe = urteile.filter(
    (u) => partie.zuege[u.index]?.von === "leser" && u.verlust > GROBER_PATZER,
  );
  if (grobe.length === 0) return null;
  const liste = grobe.map((u) => zugtext(partie, u.index, u.zeichen ?? "")).join(", ");
  return <p className="grobe-patzer">{t("auswertung.patzer", { zuege: liste })}</p>;
}

/** Die absichtlichen Fehler der Engine aus dem Protokoll. */
function Enginefehler({ partie, beiSprung }: { partie: Partie; beiSprung: (s: Sprung) => void }) {
  const fehler = enginefehler(partie);
  const ERSTE_STUFE_OHNE_PROFIL = 4;
  if (fehler.length === 0) {
    return partie.einstellung.stufe < ERSTE_STUFE_OHNE_PROFIL ? (
      <p>{t("auswertung.engineOhneFehler")}</p>
    ) : null;
  }
  return (
    <ul className="enginefehler" data-testid="enginefehler">
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
  const kopf = {
    ereignis: t("pgn.ereignis", { nummer: s.nummer, name: t(s.name) }),
    leser: t("pgn.leser"),
    engine: t("pgn.engine", { nummer: s.nummer }),
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
          {t("pgn.kopieren")}
        </button>
        <button
          type="button"
          className="knopf-zweit"
          onClick={() => bieteDateiAn(text, datei, "application/vnd.chess-pgn")}
        >
          {t("pgn.sichern")}
        </button>
      </div>
      {meldung && <p className="hinweis">{meldung}</p>}
      {meldung === t("pgn.nichtKopiert") && <pre className="vorformatiert">{text}</pre>}
    </div>
  );
}

export function Auswertung({
  eintrag,
  stand,
  urteile,
  beiSprung,
}: {
  eintrag: Partieeintrag;
  stand: Auswertungsstand;
  urteile: readonly Zugurteil[];
  beiSprung: (sprung: Sprung) => void;
}) {
  return (
    <section className="karte auswertung" data-testid="auswertung">
      <h2 className="karte-titel">{t("auswertung.titel")}</h2>
      {stand.art === "laeuft" && (
        <>
          <p>{t("auswertung.laeuft", { erledigt: stand.erledigt, gesamt: stand.gesamt })}</p>
          <Fortschrittsbalken
            anteil={{ erreicht: stand.erledigt, gesamt: stand.gesamt }}
            beschriftung={t("auswertung.titel")}
          />
        </>
      )}
      {stand.art === "fehler" && <p className="fehlertext">{stand.meldung}</p>}
      {urteile.length > 0 && (
        <>
          <Abweichung eintrag={eintrag} urteile={urteile} beiSprung={beiSprung} />
          <Patzer partie={eintrag.partie} urteile={urteile} />
        </>
      )}
      <Enginefehler partie={eintrag.partie} beiSprung={beiSprung} />
      <Pgn partie={eintrag.partie} urteile={urteile} />
    </section>
  );
}
