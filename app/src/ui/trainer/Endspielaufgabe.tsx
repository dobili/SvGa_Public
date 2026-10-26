/**
 * Eine Aufgabe des Endspieltrainers: die Buchstellung gegen die Engine ausspielen, mit gestuften
 * Hilfen (Merksatz, Figur, Zug) und Aufgeben.
 *
 * Rolle im Gesamtbild: Trainer „endspiel“ (Pflichtenheft 7: „Buchstellungen gegen die Engine
 * gewinnen oder Remis halten“). Richtig zählt eine Aufgabe, deren Ziel ohne Hilfe erreicht ist.
 * Kippt die Stellung, nennt die Karte den Zug, der das Ziel gehalten hätte.
 * Abhängigkeiten: useEndspielpartie.ts, training/endspieltrainer.ts, Brettbereich, i18n.
 */
import { useMemo, useState } from "react";
import type { Markierung } from "../../analyse/werkzeug";
import type { Endspielaufgabe as Aufgabe } from "../../daten/trainerdaten";
import { sprache, t } from "../../i18n/sprache";
import { sanInSprache } from "../../schach/notation";
import { uciZuSan } from "../../spiel/zuege";
import { stellungAusFen } from "../../schach/stellung";
import { zugFelder } from "../../schach/weiterspielen";
import type { Endspielergebnis, Massstab } from "../../training/endspieltrainer";
import { stellungNach } from "../../training/uebungsaufgabe";
import { Brettbereich } from "../komponenten/brettbedienung/Brettbereich";
import { useBrettbedienung } from "../komponenten/brettbedienung/useBrettbedienung";
import { antworteMitKarte } from "./kartenantwort";
import { Antwortmeldung } from "./Rundenrahmen";
import { useEndspielpartie } from "./useEndspielpartie";
import type { Runde } from "./useRunde";
import { useSammelstellung } from "./sammelstellung";
import { Knopfsymbol } from "../komponenten/bausteine/Knopfsymbol";

const HILFEN = 3;
const KEINE_WAHL = () => undefined;

/** Der Satz zum Ergebnis. */
function ergebnistext(e: Endspielergebnis, ziel: Aufgabe["ziel"]): string {
  if (e.art === "erreicht") return t(`endspiel.erreicht.${e.grund}`);
  const grund = t(`endspiel.verfehlt.${e.grund}`, { ziel: t(`endspiel.zielkurz.${ziel}`) });
  return e.gehalten
    ? `${grund} ${t("endspiel.gehalten", { zug: sanInSprache(e.gehalten, sprache()) })}`
    : grund;
}

/** Die Hilfen: Merksatz, Figur, Zug; dazu Aufgeben. */
function Hilfen({
  aufgabe,
  stufe,
  bester,
  weiter,
  gibAuf,
}: {
  aufgabe: Aufgabe;
  stufe: number;
  bester: string | null;
  weiter: () => void;
  gibAuf: () => void;
}) {
  const stichwort = aufgabe.stichwort ? ` ${t(`endspiel.stichwort.${aufgabe.stichwort}`)}` : "";
  return (
    <div className="uebung-hilfe">
      {stufe >= 1 && (
        <p data-testid="endspiel-merksatz">
          {t("endspiel.hilfeMerksatz", { text: t(`endspiel.merksatz.${aufgabe.thema}`) })}
          {stichwort}
        </p>
      )}
      {stufe >= 2 && <p>{t(bester ? "endspiel.hilfeFigur" : "endspiel.hilfeRechnet")}</p>}
      {stufe >= HILFEN && <p>{t(bester ? "endspiel.hilfeZug" : "endspiel.hilfeRechnet")}</p>}
      <div className="knopfzeile">
        {stufe < HILFEN && (
          <button type="button" className="knopf-zweit" onClick={weiter}>
            <Knopfsymbol art="hinweis" />
            {t("uebung.hinweis", { stufe: stufe + 1 })}
          </button>
        )}
        <button type="button" className="knopf-link" onClick={gibAuf}>
          {t("endspiel.aufgeben")}
        </button>
      </div>
    </div>
  );
}

/** Eine Endspielaufgabe in der Runde. */
export function Endspielaufgabe({
  aufgabe,
  massstab,
  runde,
}: {
  aufgabe: Aufgabe;
  massstab: Massstab;
  runde: Runde;
}) {
  const [stufe, setzeStufe] = useState(0);
  useSammelstellung(aufgabe.fen);
  const stand = useEndspielpartie(aufgabe, massstab, (ergebnis) =>
    antworteMitKarte(runde, "endspiel", aufgabe.id, ergebnis.art === "erreicht" && stufe === 0),
  );
  const fertig = stand.ergebnis !== null;
  const bedienung = useBrettbedienung(
    { fen: stand.fen, spiele: stand.spiele },
    stand.leserAmZug && !fertig ? "ziehen" : null,
    KEINE_WAHL,
  );
  const stellung = useMemo(() => stellungAusFen(stand.fen), [stand.fen]);
  // „bester“ kommt von der Engine in UCI („b3b7“), zugFelder erwartet SAN: erst umwandeln, sonst
  // fehlten goldene Figur und Pfeil bei Figurenzügen (Befund beim Prüfen von N255).
  const besterSan = stand.bester ? uciZuSan(stand.fen, stand.bester) : null;
  const hilfe = besterSan ? zugFelder(stand.fen, besterSan) : null;
  const markierungen: Markierung[] = [];
  if (!fertig && hilfe && stufe >= 2) {
    markierungen.push({ typ: "feld", farbe: "gold", feld: hilfe.von });
  }
  if (!fertig && hilfe && stufe >= HILFEN) {
    markierungen.push({ typ: "pfeil", farbe: "gold", von: hilfe.von, nach: hilfe.nach });
  }
  const letzter =
    stand.zuege.length > 0
      ? zugFelder(
          stellungNach(aufgabe.fen, stand.zuege.slice(0, -1)),
          stand.zuege[stand.zuege.length - 1] ?? "",
        )
      : null;
  return (
    <>
      <p className="trainer-auftrag" data-testid="endspiel-auftrag">
        {t(`endspiel.ziel.${aufgabe.ziel}`, {
          farbe: t(aufgabe.leser === "w" ? "farbe.w" : "farbe.b"),
        })}
      </p>
      {stellung.ok && (
        <Brettbereich
          stellung={stellung.wert}
          markierungen={markierungen}
          letzterZug={letzter}
          bedienung={bedienung}
          beschriftung={t("trainer.endspiel.name")}
          anfangsGedreht={aufgabe.leser === "b"}
        />
      )}
      <p className="hinweis">
        {aufgabe.herkunft.quelle === "buch"
          ? t("endspiel.ausBuch", { nummer: aufgabe.herkunft.abbildung })
          : t("taktiktrainer.ausLichess", { wertung: aufgabe.herkunft.wertung })}
        {" · "}
        {t(`endspiel.thema.${aufgabe.thema}`)}
        {" · "}
        {t("taktiktrainer.stufe", { stufe: aufgabe.schwierigkeit })}
        {aufgabe.pruefung.mattIn !== null &&
          aufgabe.ziel === "gewinn" &&
          ` · ${t("endspiel.mattIn", { zuege: aufgabe.pruefung.mattIn })}`}
      </p>
      {!fertig && (
        <p className="hinweis" role="status" data-testid="endspiel-status">
          {stand.fehler
            ? t("partie.engineFehler", { fehler: stand.fehler })
            : t(stand.engineDenkt ? "partie.engineDenkt" : "partie.duBistAmZug")}
        </p>
      )}
      {!fertig && (
        <Hilfen
          aufgabe={aufgabe}
          stufe={stufe}
          bester={stand.bester}
          weiter={() => setzeStufe(stufe + 1)}
          gibAuf={stand.gibAuf}
        />
      )}
      {stand.ergebnis && (
        <Antwortmeldung richtig={stand.ergebnis.art === "erreicht"}>
          {ergebnistext(stand.ergebnis, aufgabe.ziel)}
        </Antwortmeldung>
      )}
    </>
  );
}
