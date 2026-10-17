/**
 * Karte „Spielstärke“ in der Auswertung: Genauigkeit, geschätzte Spielstärke, Verlust je Zug,
 * beste Züge und Zeichen je Seite.
 *
 * Rolle im Gesamtbild: Rückmeldung des Autors zum Nachtest von 0.2.38 („Elo-Schätzung für beide
 * Seiten, Anzahl der !, ?, ?! Züge, Genauigkeit wie bei chess.com“), seit 0.2.40 dazu je Phase
 * (Eröffnung, Mittelspiel, Endspiel) und die Züge nach Klasse wie bei chess.com. Die Rechnung
 * steht in spiel/genauigkeit.ts; hier nur die Tabellen mit zwei Spalten, der Leser zuerst.
 * Abhängigkeiten: spiel/genauigkeit.ts, spiel/auswertung.ts, i18n.
 */
import type { Color } from "chessops/types";
import { t } from "../../i18n/sprache";
import type { Zugklasse, Zugurteil } from "../../spiel/auswertung";
import { spielstaerke, spielstaerkeJePhase, type Seitenbilanz } from "../../spiel/genauigkeit";
import { stellungen, type Partie } from "../../spiel/partie";
import { PHASEN, type Phase } from "../../spiel/phasen";
import { sanZuUci } from "../../spiel/zuege";

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

/** „etwa 1400“ oder „zu wenige Züge“. */
function staerketext(b: Seitenbilanz): string {
  return b.spielstaerke === null
    ? t("spielstaerke.zuWenig")
    : t("spielstaerke.etwa", { wert: b.spielstaerke });
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
  if (urteile.length === 0) return null;
  const alle = stellungen(partie);
  const gespielte = partie.zuege.map((zug, index) => sanZuUci(alle[index] ?? "", zug.san));
  const bilanz = spielstaerke(partie, werte, urteile, beste, gespielte);
  const jePhase = spielstaerkeJePhase(partie, werte, urteile, beste, gespielte, phasen);
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
      <h2 className="karte-titel">{t("spielstaerke.titel")}</h2>
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
            <tr key={ph}>
              <th scope="row">{t(`phase.name.${ph}`)}</th>
              <td>{phasentext(jePhase[ph][eigene])}</td>
              <td>{phasentext(jePhase[ph][andere])}</td>
            </tr>
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
      <p className="hinweis">{t("spielstaerke.erklaerung")}</p>
    </section>
  );
}

/** Eine Phase in einer Zelle: „82 % · etwa 1500 (12 Züge)“ oder „–“ ohne Züge. */
function phasentext(b: Seitenbilanz): string {
  if (b.zuege === 0) return "–";
  return t("spielstaerke.phase", {
    genauigkeit: genauigkeitstext(b),
    staerke: staerketext(b),
    zuege: b.zuege,
  });
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
