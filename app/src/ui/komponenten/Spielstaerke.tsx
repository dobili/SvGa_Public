/**
 * Karte „Spielstärke“ in der Auswertung: Genauigkeit, geschätzte Spielstärke, Verlust je Zug,
 * beste Züge und Zeichen je Seite.
 *
 * Rolle im Gesamtbild: Rückmeldung des Autors zum Nachtest von 0.2.38 („Elo-Schätzung für beide
 * Seiten, Anzahl der !, ?, ?! Züge, Genauigkeit wie bei chess.com“), seit 0.2.40 dazu je Phase
 * (Eröffnung, Mittelspiel, Endspiel) und die Züge nach Klasse wie bei chess.com; seit 0.2.72 je
 * Phase ein Urteilswort als farbige Marke (wie die Symbole je Phase bei chess.com) und das
 * Mittelspiel getrennt nach Taktik und Strategie (spiel/taktik.ts). Die Rechnung steht in
 * spiel/genauigkeit.ts; hier nur die Tabellen mit zwei Spalten, der Leser zuerst.
 * Seit 0.2.83 (Eichung): Spielstärke als Mitte mit Spanne; das Urteilswort je Phase an der
 * inneren Genauigkeit. Seit 0.2.85 (S23) über der Tabelle die feste Zahl des Gegners neben seiner
 * Leistung in dieser Partie („Leon (etwa 1300) hat in dieser Partie wie etwa 1450 gespielt“). Vor
 * jeder Zeile ein Symbol und vor jeder Zugklasse ihre farbige Marke (Auswertungssymbole.tsx).
 * Seit 0.2.121 (Entscheidung des Autors, 23.10.2026): ohne den Schalter „Genauigkeit wie“
 * (0.2.86 bis 0.2.120); die Spielstärke kommt aus dem Elo-Modell der Zeitklasse der Partie
 * (spiel/elomodell.ts), hinter dem Fragezeichen die Entsprechung auf chess.com oder beim
 * Weltschachbund (wertungstext.ts).
 * Abhängigkeiten: engine/botstaerke.ts, staerkeangabe.ts, wertungstext.ts, spiel/genauigkeit.ts,
 * spiel/auswertung.ts, spiel/elomodell.ts, spiel/taktik.ts, InfoKnopf, i18n.
 */
import type { Color } from "chessops/types";
import { Fragment, useMemo } from "react";
import { gegnerstaerke } from "../../engine/botstaerke";
import { t, tZahl, zahlText } from "../../i18n/sprache";
import type { Zugklasse, Zugurteil } from "../../spiel/auswertung";
import {
  phasenurteil,
  spielstaerke,
  spielstaerkeImMittelspiel,
  spielstaerkeJePhase,
  type Seitenbilanz,
} from "../../spiel/genauigkeit";
import { stellungen, type Partie } from "../../spiel/partie";
import { wertungstempo } from "../../spiel/elomodell";
import { PHASEN, type Phase } from "../../spiel/phasen";
import { ZUGARTEN, zugartJeStellung } from "../../spiel/taktik";
import { sanZuUci } from "../../spiel/zuege";
import { Klassenmarke, Zeilenname } from "./Auswertungssymbole";
import { MitInfo } from "./InfoKnopf";
import { staerketext as angabetext } from "./staerkeangabe";
import { KENNZAHLSYMBOLE, PHASENSYMBOLE } from "./zeilensymbole";
import { Titelsymbol } from "./Titelsymbol";
import { entsprichtText } from "./wertungstext";

/** Reihenfolge der Klassen in der Tabelle, wie bei chess.com von oben nach unten. */
const KLASSEN: readonly Zugklasse[] = [
  "brillant",
  "stark",
  "bester",
  "sehrGut",
  "gut",
  "buch",
  "ungenau",
  "fehler",
  "verpasst",
  "patzer",
];

/**
 * „etwa 1400 (1000–1800)“, „zu wenige Züge“ oder (seit 0.2.103) „zu wenige Züge vor der
 * Entscheidung“, wenn erst die Regel aus spiel/entscheidung.ts die Züge zu knapp macht.
 */
function staerketext(b: Seitenbilanz): string {
  if (b.schaetzung === null) {
    return b.gewertet < b.zuege
      ? t("spielstaerke.zuWenigVorEntscheidung")
      : t("spielstaerke.zuWenig");
  }
  return t("spielstaerke.spanne", {
    mitte: b.schaetzung.mitte,
    von: b.schaetzung.von,
    bis: b.schaetzung.bis,
  });
}

/** Wie `staerketext`, dazu „aus 18 Zügen bis zur Entscheidung“, wenn nicht alle Züge zählen. */
function staerkezeile(b: Seitenbilanz): string {
  const text = staerketext(b);
  if (b.schaetzung === null || b.gewertet >= b.zuege) return text;
  return `${text} ${t("spielstaerke.bisEntscheidung", { anzahl: b.gewertet })}`;
}

/** „82 %“ oder „–“. */
function genauigkeitstext(b: Seitenbilanz): string {
  return b.genauigkeit === null
    ? "–"
    : t("spielstaerke.prozent", { wert: Math.round(b.genauigkeit) });
}

/** Zahl mit deutschem Komma und einer Nachkommastelle. */
function komma(zahl: number): string {
  return zahlText(zahl, 1);
}

/**
 * Feste Zahl des Gegners und seine Leistung in dieser Partie; null gegen einen Menschen oder ohne
 * Schätzung (zu wenige Züge).
 * Beispiel: Leon (etwa 1300), Engine spielte mit 82 % → „Leon (etwa 1300) hat in dieser Partie wie
 * etwa 1500 gespielt.“
 */
function gegnerzeile(partie: Partie, engine: Seitenbilanz): string | null {
  if (partie.einstellung.gegner !== "engine" || engine.schaetzung === null) return null;
  return t("spielstaerke.gegnerHeute", {
    name: partie.einstellung.botName ?? t("spielstaerke.gegnerName"),
    staerke: angabetext(gegnerstaerke(partie.einstellung)),
    heute: angabetext(engine.schaetzung.mitte),
  });
}

/** Die Tabelle: Zeilen sind die Kennzahlen, Spalten die Seiten (Leser zuerst). */
export function Spielstaerke({
  partie,
  werte,
  urteile,
  beste,
  phasen,
}: {
  partie: Partie;
  werte: readonly number[];
  urteile: readonly Zugurteil[];
  beste: readonly string[];
  phasen: readonly Phase[];
}) {
  const zugarten = useMemo(() => zugartJeStellung(partie), [partie]);
  const tempo = wertungstempo(partie.einstellung.uhr);
  if (urteile.length === 0) return null;
  const alle = stellungen(partie);
  const gespielte = partie.zuege.map((zug, index) => sanZuUci(alle[index] ?? "", zug.san));
  const bilanz = spielstaerke(partie, werte, urteile, beste, gespielte, tempo);
  const jePhase = spielstaerkeJePhase(partie, werte, urteile, beste, gespielte, phasen, tempo);
  const imMittelspiel = spielstaerkeImMittelspiel(
    partie,
    werte,
    urteile,
    beste,
    gespielte,
    phasen,
    zugarten,
    tempo,
  );
  const eigene: Color = partie.einstellung.eigeneFarbe;
  const andere: Color = eigene === "white" ? "black" : "white";
  const farbe = (seite: Color) => t(seite === "white" ? "farbe.w" : "farbe.b");
  const zeilen = [
    t("spielstaerke.genauigkeit"),
    t("spielstaerke.staerke"),
    t("spielstaerke.verlust"),
    t("spielstaerke.beste"),
    t("spielstaerke.zeichen"),
  ];
  return (
    <section className="karte spielstaerke" data-testid="spielstaerke">
      <h2 className="karte-titel">
        <Titelsymbol art="spielstaerke" />
        {t("spielstaerke.titel")}
      </h2>
      {gegnerzeile(partie, bilanz[andere]) && (
        <p className="hinweis" data-testid="gegner-heute">
          {gegnerzeile(partie, bilanz[andere])}
        </p>
      )}
      <table className="spielstaerke-tabelle">
        <thead>
          <tr>
            <th scope="col">{t("spielstaerke.seite")}</th>
            <th scope="col">
              {partie.einstellung.gegner === "mensch"
                ? farbe(eigene)
                : t("spielstaerke.du", { farbe: farbe(eigene) })}
            </th>
            <th scope="col">
              {partie.einstellung.gegner === "mensch"
                ? farbe(andere)
                : t("spielstaerke.engine", { farbe: farbe(andere) })}
            </th>
          </tr>
        </thead>
        <tbody>
          <Zeilen zeilen={zeilen} eigene={bilanz[eigene]} andere={bilanz[andere]} />
          {PHASEN.map((ph) => (
            <Fragment key={ph}>
              <Phasenzeile
                art={ph}
                name={t(`phase.name.${ph}`)}
                eigene={jePhase[ph][eigene]}
                andere={jePhase[ph][andere]}
              />
              {ph === "mittelspiel" &&
                ZUGARTEN.map((art) => (
                  <Phasenzeile
                    key={art}
                    art={art}
                    name={t(`spielstaerke.zugart.${art}`)}
                    unterzeile
                    eigene={imMittelspiel[art][eigene]}
                    andere={imMittelspiel[art][andere]}
                  />
                ))}
            </Fragment>
          ))}
        </tbody>
      </table>
      <h3 className="spielstaerke-untertitel">{t("spielstaerke.klassen")}</h3>
      <table className="spielstaerke-tabelle spielstaerke-klassen">
        <tbody>
          {KLASSEN.map((k) => (
            <tr key={k}>
              <th scope="row">
                <span className="zeilenname">
                  <Klassenmarke klasse={k} />
                  <span>{t(`zugklasse.${k}`)}</span>
                </span>
              </th>
              <td>{bilanz[eigene].klassen[k]}</td>
              <td>{bilanz[andere].klassen[k]}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Erklaerung b={bilanz[eigene]} />
    </section>
  );
}

/**
 * Erklärung der Karte hinter einem Fragezeichen: die Entsprechung der Zahl des Lesers auf chess.com
 * oder beim Weltschachbund (seit 0.2.121) und wie die Zahlen entstehen (seit 0.2.85 zusammen,
 * Wunsch des Autors).
 */
function Erklaerung({ b }: { b: Seitenbilanz }) {
  return (
    <MitInfo
      zeile={<p className="hinweis">{t("spielstaerke.erklaerungKurz")}</p>}
      erklaerung={
        <>
          {b.schaetzung && <p>{entsprichtText(b.schaetzung)}</p>}
          <p>{t("spielstaerke.erklaerung")}</p>
        </>
      }
      thema={t("spielstaerke.titel")}
    />
  );
}

/** Eine Zeile je Phase oder Zugart (Taktik, Strategie eingerückt), beide Seiten. */
function Phasenzeile({
  art,
  name,
  unterzeile = false,
  eigene,
  andere,
}: {
  art: keyof typeof PHASENSYMBOLE;
  name: string;
  unterzeile?: boolean;
  eigene: Seitenbilanz;
  andere: Seitenbilanz;
}) {
  return (
    <tr className={unterzeile ? "spielstaerke-unterzeile" : undefined}>
      <th scope="row">
        <Zeilenname Symbol={PHASENSYMBOLE[art]} kinder={name} />
      </th>
      <td>
        <Phasenzelle b={eigene} />
      </td>
      <td>
        <Phasenzelle b={andere} />
      </td>
    </tr>
  );
}

/**
 * Eine Phase in einer Zelle: Marke „Sehr gut“, dann „82 % · etwa 1500 (12 Züge)“; „–“ ohne Züge.
 * Liegt die ganze Phase nach der Entscheidung (seit 0.2.103), steht statt Marke und Schätzung
 * „nach der Entscheidung“.
 */
function Phasenzelle({ b }: { b: Seitenbilanz }) {
  if (b.zuege === 0 || b.genauigkeit === null) return <>–</>;
  if (b.innen === null) {
    return (
      <>
        {tZahl("spielstaerke.phaseEntschieden", b.zuege, {
          genauigkeit: genauigkeitstext(b),
          zuege: b.zuege,
        })}
      </>
    );
  }
  const urteil = phasenurteil(b.innen);
  // Seit R33 (Wunsch des Autors, 23.10.2026): Die Eröffnung endet nach unseren Regeln oft nach
  // wenigen Zügen. Dann stehen Urteil und Genauigkeit ohne den Satz „zu wenige Züge“; die Zahl der
  // Spielstärke kommt erst ab sechs Zügen (Erklärung hinter dem Fragezeichen). Seit 0.2.121 auch
  // ohne Zahl, wenn die Spanne des Teilmodells der Phase zu breit ist (spielstaerke null).
  const zuWenigVorEntscheidung = b.schaetzung === null && b.gewertet < b.zuege;
  const ohneSchaetzung = b.spielstaerke === null && !zuWenigVorEntscheidung;
  return (
    <>
      <span className={`phasenurteil phasenurteil-${urteil}`}>
        {t(`spielstaerke.urteil.${urteil}`)}
      </span>
      {ohneSchaetzung
        ? tZahl("spielstaerke.phaseKurz", b.zuege, {
            genauigkeit: genauigkeitstext(b),
            zuege: b.zuege,
          })
        : tZahl("spielstaerke.phase", b.zuege, {
            genauigkeit: genauigkeitstext(b),
            staerke: staerketext(b),
            zuege: b.zuege,
          })}
    </>
  );
}

/** Die Zeilen der Tabelle: je Kennzahl eine Zeile mit beiden Seiten. */
function Zeilen({
  zeilen,
  eigene,
  andere,
}: {
  zeilen: readonly string[];
  eigene: Seitenbilanz;
  andere: Seitenbilanz;
}) {
  const werte = (b: Seitenbilanz): string[] => [
    genauigkeitstext(b),
    staerkezeile(b),
    t("spielstaerke.bauern", { wert: komma(b.verlustJeZug) }),
    t("spielstaerke.vonZuegen", { anzahl: b.beste, zuege: b.zuege }),
    t("spielstaerke.zeichenZeile", {
      brillant: b.zeichen["!!"],
      einzige: b.zeichen["!"],
      ungenau: b.zeichen["?!"],
      fehler: b.zeichen["?"],
      patzer: b.zeichen["??"],
    }),
  ];
  const links = werte(eigene);
  const rechts = werte(andere);
  return (
    <>
      {zeilen.map((name, i) => (
        <tr key={name}>
          <th scope="row">
            {(() => {
              const Symbol = KENNZAHLSYMBOLE[i];
              return Symbol ? <Zeilenname Symbol={Symbol} kinder={name} /> : name;
            })()}
          </th>
          <td>{links[i]}</td>
          <td>{rechts[i]}</td>
        </tr>
      ))}
    </>
  );
}
