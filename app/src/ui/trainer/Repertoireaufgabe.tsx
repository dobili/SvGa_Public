/**
 * Aufgabe des Repertoire-Trainers: eine Variante Zug für Zug aus dem Gedächtnis ziehen.
 *
 * Rolle im Gesamtbild: Trainer „repertoire“ (AP 13). Der Leser zieht seine Züge, die App
 * antwortet aus dem Buch. Ein falscher Zug zählt als Fehler; die App zeigt dann den Zug des
 * Buches als Pfeil, und der Leser zieht ihn nach. „Zug zeigen“ hilft ebenso und zählt ebenso.
 * Richtig ist die Variante, wenn sie ohne Fehler und ohne Hilfe gelingt. Hat ein gespielter Zug
 * eine Warum-Frage (W10), steht sie unter dem Brett, zugeklappt; sie zählt nicht zur Wertung.
 * Auch „Studien lösen“ nutzt diese Aufgabe, mit eigenem Auftrag.
 * Abhängigkeiten: training/repertoiretrainer.ts, Brettbereich, useBrettbedienung, Rundenrahmen.
 */
import { useMemo, useState } from "react";
import type { Markierung } from "../../analyse/werkzeug";
import { sprache, t } from "../../i18n/sprache";
import { stellungAusFen, type Rolle } from "../../schach/stellung";
import { eigeneAlsText, spieleZug, zugFelder } from "../../schach/weiterspielen";
import {
  anfang,
  istBuchzug,
  mitAntwort,
  type Repertoireaufgabe as Aufgabe,
} from "../../training/repertoiretrainer";
import { stellungNach } from "../../training/uebungsaufgabe";
import { Brettbereich } from "../komponenten/Brettbereich";
import { WarumFragenListe } from "../komponenten/WarumFrage";
import { useBrettbedienung } from "../komponenten/useBrettbedienung";
import { Antwortmeldung } from "./Rundenrahmen";
import type { Runde } from "./useRunde";
import { useSammelstellung } from "./sammelstellung";

const KEINE_WAHL = () => undefined;

/** Pfeil für den Zug des Buches an dieser Stelle. */
function buchpfeil(aufgabe: Aufgabe, zuege: readonly string[]): Markierung[] {
  const fen = stellungNach(aufgabe.startFen, zuege);
  const felder = zugFelder(fen, aufgabe.linie[zuege.length] ?? "");
  return felder ? [{ typ: "pfeil", farbe: "gold", von: felder.von, nach: felder.nach }] : [];
}

export function Repertoireaufgabe({
  aufgabe,
  runde,
  auftrag,
}: {
  aufgabe: Aufgabe;
  runde: Runde;
  /** Eigener Auftrag (Studien); sonst der des Repertoire-Trainers. */
  auftrag?: string;
}) {
  const [zuege, setzeZuege] = useState<readonly string[]>(() => anfang(aufgabe));
  const [fehler, setzeFehler] = useState(0);
  const [zeige, setzeZeige] = useState(false);
  const fen = stellungNach(aufgabe.startFen, zuege);
  useSammelstellung(fen);
  const fertig = runde.ergebnis !== null;
  const zaehle = () => {
    setzeFehler(fehler + 1);
    setzeZeige(true);
  };
  const spiele = (von: string, nach: string, umwandlung?: Rolle) => {
    if (fertig) return "ungueltig" as const;
    const versuch = spieleZug(fen, von, nach, umwandlung);
    if (versuch.art !== "gespielt") return versuch.art;
    if (!istBuchzug(aufgabe, zuege.length, versuch.san)) {
      zaehle();
      return "gespielt" as const;
    }
    const neu = mitAntwort(aufgabe, zuege);
    setzeZuege(neu);
    setzeZeige(false);
    if (neu.length >= aufgabe.linie.length) runde.beantworte(fehler === 0);
    return "gespielt" as const;
  };
  const bedienung = useBrettbedienung({ fen, spiele }, fertig ? null : "ziehen", KEINE_WAHL);
  const stellung = useMemo(() => stellungAusFen(fen), [fen]);
  const letzter =
    zuege.length > 0
      ? zugFelder(stellungNach(aufgabe.startFen, zuege.slice(0, -1)), zuege.at(-1) ?? "")
      : null;
  const notation = eigeneAlsText(aufgabe.startFen, zuege, sprache()).join(" ");
  return (
    <>
      <p className="trainer-auftrag">
        {auftrag ??
          t("repertoiretrainer.auftrag", {
            titel: aufgabe.titel,
            farbe: t(aufgabe.seite === "white" ? "farbe.w" : "farbe.b"),
          })}
      </p>
      {stellung.ok && (
        <Brettbereich
          stellung={stellung.wert}
          markierungen={zeige && !fertig ? buchpfeil(aufgabe, zuege) : []}
          letzterZug={letzter}
          bedienung={bedienung}
          beschriftung={t("trainer.repertoire.name")}
          anfangsGedreht={aufgabe.seite === "black"}
        />
      )}
      <p className="hinweis" data-testid="repertoire-zuege">
        {notation || t("repertoiretrainer.nochKeinZug")}
      </p>
      {!fertig && zeige && <p className="meldung schlecht">{t("repertoiretrainer.buchzug")}</p>}
      {!fertig && !zeige && (
        <button type="button" className="knopf-zweit" onClick={zaehle}>
          {t("repertoiretrainer.zeigen")}
        </button>
      )}
      {fertig && (
        <Antwortmeldung richtig={runde.ergebnis === true}>
          {t("repertoiretrainer.fertig", { fehler })}
        </Antwortmeldung>
      )}
      {(aufgabe.fragen ?? [])
        .filter((f) => f.stelle < zuege.length)
        .map((f) => (
          <WarumFragenListe key={`${f.stelle} ${f.zug}`} vorbereitet={f.vorbereitet} nur={f.zug} />
        ))}
    </>
  );
}
