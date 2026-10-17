/**
 * Karte „Spielstärke“ in der Auswertung: Genauigkeit, geschätzte Spielstärke, Verlust je Zug,
 * beste Züge und Zeichen je Seite.
 *
 * Rolle im Gesamtbild: Rückmeldung des Autors zum Nachtest von 0.2.38 („Elo-Schätzung für beide
 * Seiten, Anzahl der !, ?, ?! Züge, Genauigkeit wie bei chess.com“). Die Rechnung steht in
 * spiel/genauigkeit.ts; hier nur die Tabelle mit zwei Spalten, der Leser zuerst.
 * Abhängigkeiten: spiel/genauigkeit.ts, spiel/auswertung.ts, i18n.
 */
import type { Color } from "chessops/types";
import { t } from "../../i18n/sprache";
import type { Zugurteil } from "../../spiel/auswertung";
import { spielstaerke, type Seitenbilanz } from "../../spiel/genauigkeit";
import { stellungen, type Partie } from "../../spiel/partie";
import { sanZuUci } from "../../spiel/zuege";

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
}: {
  partie: Partie;
  werte: readonly number[];
  urteile: readonly Zugurteil[];
  beste: readonly string[];
}) {
  if (urteile.length === 0) return null;
  const alle = stellungen(partie);
  const gespielte = partie.zuege.map((zug, index) => sanZuUci(alle[index] ?? "", zug.san));
  const bilanz = spielstaerke(partie, werte, urteile, beste, gespielte);
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
            <th scope="col">{t("spielstaerke.du", { farbe: farbe(eigene) })}</th>
            <th scope="col">{t("spielstaerke.engine", { farbe: farbe(andere) })}</th>
          </tr>
        </thead>
        <tbody>
          <Zeilen zeilen={zeilen} eigene={bilanz[eigene]} andere={bilanz[andere]} />
        </tbody>
      </table>
      <p className="hinweis">{t("spielstaerke.erklaerung")}</p>
    </section>
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
    b.genauigkeit === null ? "–" : t("spielstaerke.prozent", { wert: Math.round(b.genauigkeit) }),
    b.spielstaerke === null
      ? t("spielstaerke.zuWenig")
      : t("spielstaerke.etwa", { wert: b.spielstaerke }),
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
