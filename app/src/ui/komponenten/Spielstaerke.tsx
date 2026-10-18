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
 * Seit 0.2.83 (Eichung): Genauigkeit im gewählten Modus (Einstellungen), Spielstärke als Mitte mit
 * Spanne, die Werte für chess.com und Lichess hinter dem Fragezeichen; das Urteilswort je Phase an
 * der inneren Genauigkeit. Seit 0.2.84 (S23) über der Tabelle die feste Zahl des Gegners neben
 * seiner Leistung in dieser Partie („Leon (etwa 650) hat in dieser Partie wie etwa 800 gespielt“).
 * Abhängigkeiten: engine/botstaerke.ts, staerkeangabe.ts, spiel/genauigkeit.ts, spiel/auswertung.ts, spiel/taktik.ts, app/einstellungen.ts,
 * InfoKnopf, i18n.
 */
import type { Color } from "chessops/types";
import { Fragment, useMemo } from "react";
import { useEinstellungen } from "../../app/einstellungen";
import { gegnerstaerke } from "../../engine/botstaerke";
import { t } from "../../i18n/sprache";
import type { Zugklasse, Zugurteil } from "../../spiel/auswertung";
import {
  phasenurteil,
  spielstaerke,
  spielstaerkeImMittelspiel,
  spielstaerkeJePhase,
  type Seitenbilanz,
} from "../../spiel/genauigkeit";
import { stellungen, type Partie } from "../../spiel/partie";
import { PHASEN, type Phase } from "../../spiel/phasen";
import { ZUGARTEN, zugartJeStellung } from "../../spiel/taktik";
import { sanZuUci } from "../../spiel/zuege";
import { MitInfo } from "./InfoKnopf";
import { staerketext as angabetext } from "./staerkeangabe";

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

/** „etwa 1400 (1000–1800)“ oder „zu wenige Züge“. */
function staerketext(b: Seitenbilanz): string {
  return b.schaetzung === null
    ? t("spielstaerke.zuWenig")
    : t("spielstaerke.spanne", {
        mitte: b.schaetzung.mitte,
        von: b.schaetzung.von,
        bis: b.schaetzung.bis,
      });
}

/** „82 %“ oder „–“. */
function genauigkeitstext(b: Seitenbilanz): string {
  return b.genauigkeit === null
    ? "–"
    : t("spielstaerke.prozent", { wert: Math.round(b.genauigkeit) });
}

/** Zahl mit deutschem Komma und einer Nachkommastelle. */
function komma(zahl: number): string {
  return zahl.toFixed(1).replace(".", ",");
}

/**
 * Feste Zahl des Gegners und seine Leistung in dieser Partie; null gegen einen Menschen oder ohne
 * Schätzung (zu wenige Züge).
 * Beispiel: Leon (etwa 650), Engine spielte mit 82 % → „Leon (etwa 650) hat in dieser Partie wie
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
  const modus = useEinstellungen().genauigkeitsmodus;
  if (urteile.length === 0) return null;
  const alle = stellungen(partie);
  const gespielte = partie.zuege.map((zug, index) => sanZuUci(alle[index] ?? "", zug.san));
  const bilanz = spielstaerke(partie, werte, urteile, beste, gespielte, modus);
  const jePhase = spielstaerkeJePhase(partie, werte, urteile, beste, gespielte, phasen, modus);
  const imMittelspiel = spielstaerkeImMittelspiel(
    partie,
    werte,
    urteile,
    beste,
    gespielte,
    phasen,
    zugarten,
    modus,
  );
  const eigene: Color = partie.einstellung.eigeneFarbe;
  const andere: Color = eigene === "white" ? "black" : "white";
  const farbe = (seite: Color) => t(seite === "white" ? "farbe.w" : "farbe.b");
  const zeilen = [
    t("spielstaerke.genauigkeit", { modus: t(`einstellungen.genauigkeit.${modus}`) }),
    t("spielstaerke.staerke"),
    t("spielstaerke.verlust"),
    t("spielstaerke.beste"),
    t("spielstaerke.zeichen"),
  ];
  return (
    <section className="karte spielstaerke" data-testid="spielstaerke">
      <h2 className="karte-titel">{t("spielstaerke.titel")}</h2>
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
                name={t(`phase.name.${ph}`)}
                eigene={jePhase[ph][eigene]}
                andere={jePhase[ph][andere]}
              />
              {ph === "mittelspiel" &&
                ZUGARTEN.map((art) => (
                  <Phasenzeile
                    key={art}
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
      <table className="spielstaerke-tabelle">
        <tbody>
          {KLASSEN.map((k) => (
            <tr key={k}>
              <th scope="row">{t(`zugklasse.${k}`)}</th>
              <td>{bilanz[eigene].klassen[k]}</td>
              <td>{bilanz[andere].klassen[k]}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Skalen b={bilanz[eigene]} />
      <p className="hinweis">{t("spielstaerke.erklaerung")}</p>
    </section>
  );
}

/** Die Werte des Lesers auf beiden Skalen hinter dem Fragezeichen (seit 0.2.83). */
function Skalen({ b }: { b: Seitenbilanz }) {
  if (!b.schaetzung) return null;
  return (
    <MitInfo
      zeile={<p className="hinweis">{t("spielstaerke.skalenKurz")}</p>}
      erklaerung={
        <p>
          {t("spielstaerke.skalen", {
            chesscom: b.schaetzung.chesscom,
            lichess: b.schaetzung.lichess,
          })}
        </p>
      }
      thema={t("spielstaerke.staerke")}
    />
  );
}

/** Eine Zeile je Phase oder Zugart (Taktik, Strategie eingerückt), beide Seiten. */
function Phasenzeile({
  name,
  unterzeile = false,
  eigene,
  andere,
}: {
  name: string;
  unterzeile?: boolean;
  eigene: Seitenbilanz;
  andere: Seitenbilanz;
}) {
  return (
    <tr className={unterzeile ? "spielstaerke-unterzeile" : undefined}>
      <th scope="row">{name}</th>
      <td>
        <Phasenzelle b={eigene} />
      </td>
      <td>
        <Phasenzelle b={andere} />
      </td>
    </tr>
  );
}

/** Eine Phase in einer Zelle: Marke „Sehr gut“, dann „82 % · etwa 1500 (12 Züge)“; „–“ ohne Züge. */
function Phasenzelle({ b }: { b: Seitenbilanz }) {
  if (b.zuege === 0 || b.genauigkeit === null || b.innen === null) return <>–</>;
  const urteil = phasenurteil(b.innen);
  return (
    <>
      <span className={`phasenurteil phasenurteil-${urteil}`}>
        {t(`spielstaerke.urteil.${urteil}`)}
      </span>
      {t("spielstaerke.phase", {
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
    staerketext(b),
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
          <th scope="row">{name}</th>
          <td>{links[i]}</td>
          <td>{rechts[i]}</td>
        </tr>
      ))}
    </>
  );
}
