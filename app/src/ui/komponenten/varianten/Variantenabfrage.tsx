/**
 * Eine Variante abfragen: Der Leser zieht die Züge seiner Seite, die App die der Gegenseite;
 * die Abzweige kommen nacheinander dran.
 *
 * Rolle im Gesamtbild: Variationsbrowser, Stufe 4 (Konzept „später denkbar“, Wunsch des Autors
 * vom 1.11.2026), wie der Repertoire-Trainer: Ein falscher Zug zählt als Fehler und zeigt den Zug
 * der Variante als goldenen Pfeil; ein Zug, der hier in einer anderen Linie der Variante steht,
 * zählt nicht als Fehler („kommt später“). Am Zug steht der eigene Kommentar, wenn es einen gibt.
 * Gespeichert wird nichts. Genutzt im Bildschirm „Variante abfragen“ und in der Abfrage der
 * Lernsammlung. Rechnung: training/variantenabfrage.ts.
 * Abhängigkeiten: training/variantenabfrage.ts, schach/variationsbaum.ts, Brettbereich,
 * useBrettbedienung, i18n.
 */
import type { Color } from "chessops/types";
import { useMemo, useState } from "react";
import type { Markierung } from "../../../analyse/werkzeug";
import { sprache, t } from "../../../i18n/sprache";
import { stellungAusFen, type Rolle } from "../../../schach/stellung";
import { fenAm, knotenAm, type Pfad } from "../../../schach/variationsbaum";
import { eigeneAlsText, spieleZug, zugFelder } from "../../../schach/weiterspielen";
import {
  abfrageAnfang,
  abfragelinien,
  gesuchterZug,
  gezogeneZuege,
  mitGezeigtemZug,
  nachAntwort,
  naechsteLinie,
  pruefeAbfragezug,
  type Abfrage,
  type Abfrageantwort,
  type Abfragestand,
} from "../../../training/variantenabfrage";
import type { Variation } from "../../../training/variationen";
import { Brettbereich } from "../brettbedienung/Brettbereich";
import { useBrettbedienung } from "../brettbedienung/useBrettbedienung";

const KEINE_WAHL = () => undefined;

/** Das Ergebnis einer Abfrage: auf Anhieb gefundene und alle gefragten Züge. */
export interface Abfrageergebnis {
  readonly richtig: number;
  readonly gefragt: number;
}

/** Der Zug der Variante als goldener Pfeil, wenn er gezeigt werden soll. */
function pfeilFuer(abfrage: Abfrage, stand: Abfragestand, fen: string): Markierung[] {
  const gesucht = stand.gezeigt ? gesuchterZug(abfrage, stand) : null;
  const felder = gesucht ? zugFelder(fen, gesucht) : null;
  return felder ? [{ typ: "pfeil", farbe: "gold", von: felder.von, nach: felder.nach }] : [];
}

/** Rückmeldung unter dem Brett zur letzten Antwort oder zum Stand der Linie. */
function Meldung({ stand, antwort }: { stand: Abfragestand; antwort: Abfrageantwort | null }) {
  if (stand.linieFertig)
    return (
      <p className="meldung gut" role="status">
        {t("variantenabfrage.linieGeschafft")}
      </p>
    );
  if (antwort === "andere")
    return (
      <p className="meldung" role="status">
        {t("variantenabfrage.andere")}
      </p>
    );
  if (antwort === "falsch")
    return (
      <p className="meldung schlecht" role="status">
        {t("variantenabfrage.falsch")}
      </p>
    );
  return <p className="hinweis">{t("variantenabfrage.frage")}</p>;
}

/** Zustand und Zugfunktion der Abfrage einer Variante. */
function useAbfrage(abfrage: Abfrage) {
  const [stand, setzeStand] = useState(() => abfrageAnfang(abfrage));
  const [antwort, setzeAntwort] = useState<Abfrageantwort | null>(null);
  const zuege = gezogeneZuege(abfrage, stand);
  const fen = fenAm(abfrage.baum, zuege) ?? abfrage.baum.startFen;
  const spiele = (von: string, nach: string, umwandlung?: Rolle) => {
    if (stand.fertig || stand.linieFertig) return "ungueltig" as const;
    const versuch = spieleZug(fen, von, nach, umwandlung);
    if (versuch.art !== "gespielt") return versuch.art;
    const neu = pruefeAbfragezug(abfrage, stand, versuch.san);
    setzeAntwort(neu === "richtig" ? null : neu);
    setzeStand(nachAntwort(abfrage, stand, neu));
    return "gespielt" as const;
  };
  const zeige = () => setzeStand(mitGezeigtemZug(stand));
  const weiter = (): Abfragestand => {
    const naechster = naechsteLinie(abfrage, stand);
    setzeAntwort(null);
    setzeStand(naechster);
    return naechster;
  };
  return { stand, antwort, zuege, fen, spiele, zeige, weiter };
}

type Abfragezustand = ReturnType<typeof useAbfrage>;

/** Start- und Zielfeld des letzten Zuges auf dem Brett; null am Anfang. */
function letzterZugVon(abfrage: Abfrage, zuege: Pfad) {
  const vorher = fenAm(abfrage.baum, zuege.slice(0, -1)) ?? "";
  return zuege.length > 0 ? zugFelder(vorher, zuege.at(-1) ?? "") : null;
}

/** Brett, gespielte Züge ab dem Start und der eigene Kommentar am Zug. */
function Abfragebrett({
  abfrage,
  a,
  start,
  titel,
}: {
  abfrage: Abfrage;
  a: Abfragezustand;
  start: Pfad;
  titel: string;
}) {
  const variation = abfrage.baum;
  const bedienung = useBrettbedienung(
    { fen: a.fen, spiele: a.spiele },
    a.stand.fertig ? null : "ziehen",
    KEINE_WAHL,
  );
  const stellung = useMemo(() => stellungAusFen(a.fen), [a.fen]);
  const kommentar = knotenAm(variation, a.zuege)?.kommentar ?? "";
  const startFen = fenAm(variation, start) ?? variation.startFen;
  return (
    <>
      {stellung.ok && (
        <Brettbereich
          stellung={stellung.wert}
          markierungen={pfeilFuer(abfrage, a.stand, a.fen)}
          letzterZug={letzterZugVon(abfrage, a.zuege)}
          bedienung={bedienung}
          beschriftung={titel || t("varianten.einzeln")}
          anfangsGedreht={abfrage.seite === "black"}
        />
      )}
      <p className="hinweis" data-testid="variantenabfrage-zuege">
        {eigeneAlsText(startFen, a.zuege.slice(start.length), sprache()).join(" ") || "…"}
      </p>
      {kommentar && <p className="variantenabfrage-kommentar">{kommentar}</p>}
    </>
  );
}

/** Ab hier hat die Seite keinen Zug in der Variante: nur ein Hinweis und „Weiter“. */
function NichtsZuFragen({ beiWeiter }: { beiWeiter: () => void }) {
  return (
    <div className="variantenabfrage" data-testid="variantenabfrage">
      <p className="hinweis">{t("variantenabfrage.nichtsZuFragen")}</p>
      <button type="button" className="knopf-haupt" onClick={beiWeiter}>
        {t("variantenabfrage.weiter")}
      </button>
    </div>
  );
}

/**
 * Die Abfrage einer Variante ab ``start`` für ``seite``; ``beiEnde`` nach der letzten Linie.
 * Beispiel: Petroff-Variante aus Abb. 2.40 als Schwarz → erst die Hauptvariante 3... d6, dann
 * der Abzweig 3... Sxe4 ab dem Abzweig.
 */
export function Variantenabfrage({
  variation,
  start,
  seite,
  beiEnde,
}: {
  variation: Variation;
  start: Pfad;
  seite: Color;
  beiEnde: (ergebnis: Abfrageergebnis) => void;
}) {
  const abfrage = useMemo(
    () => ({ baum: variation, linien: abfragelinien(variation, start, seite), seite }),
    [variation, start, seite],
  );
  const a = useAbfrage(abfrage);
  const anzahl = abfrage.linien.length;
  if (anzahl === 0) return <NichtsZuFragen beiWeiter={() => beiEnde({ richtig: 0, gefragt: 0 })} />;
  const weiter = () => {
    const naechster = a.weiter();
    if (naechster.fertig) beiEnde(naechster);
  };
  return (
    <div className="variantenabfrage" data-testid="variantenabfrage">
      <p className="hinweis" aria-live="polite" data-testid="variantenabfrage-stand">
        {t("variantenabfrage.stand", { nummer: Math.min(a.stand.linie + 1, anzahl), anzahl })}
      </p>
      <Abfragebrett abfrage={abfrage} a={a} start={start} titel={variation.titel} />
      <Meldung stand={a.stand} antwort={a.antwort} />
      <Knoepfe
        stand={a.stand}
        letzte={a.stand.linie + 1 >= anzahl}
        zeige={a.zeige}
        weiter={weiter}
        beiEnde={() => beiEnde(a.stand)}
      />
    </div>
  );
}

/** „Zug zeigen“, nach einer Linie „Nächste Linie“, am Ende „Fertig“. */
function Knoepfe({
  stand,
  letzte,
  zeige,
  weiter,
  beiEnde,
}: {
  stand: Abfragestand;
  letzte: boolean;
  zeige: () => void;
  weiter: () => void;
  beiEnde: () => void;
}) {
  if (stand.fertig) return null;
  return (
    <div className="knopfreihe">
      {stand.linieFertig ? (
        <button
          type="button"
          className="knopf-haupt"
          onClick={weiter}
          data-testid="variantenabfrage-weiter"
        >
          {letzte ? t("variantenabfrage.fertig") : t("variantenabfrage.naechsteLinie")}
        </button>
      ) : (
        !stand.gezeigt && (
          <button type="button" className="knopf-zweit" onClick={zeige}>
            {t("variantenabfrage.zeigen")}
          </button>
        )
      )}
      <button type="button" className="knopf-link" onClick={beiEnde}>
        {t("variantenabfrage.beenden")}
      </button>
    </div>
  );
}
