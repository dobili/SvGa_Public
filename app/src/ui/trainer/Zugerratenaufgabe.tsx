/**
 * Aufgabe „Zug erraten“: eine Meisterpartie aus Kapitel 11 Zug für Zug raten.
 *
 * Rolle im Gesamtbild: Trainer „zugErraten“ (AP 13, Stufe 3). Der Leser zieht für seine Seite;
 * die App sagt „getroffen“ oder nennt den Partiezug, stellt ihn aufs Brett und spielt den
 * nächsten Zug der Gegenseite. Am Ende zählt die Runde die Partie als gut geraten, wenn
 * mindestens die Hälfte der Züge getroffen ist. Nach einem verfehlten Zug vergleicht die Engine
 * den eigenen Zug mit dem Partiezug und erinnert an die Frage des Buches, warum der Meister anders
 * zog (W12, Kapitel 12: „erst selbst denken und dann vergleichen“). Seit 0.2.90 speichert die
 * App die Trefferzahl je Partie (speicher/trainerverlauf.ts) und nennt beim nächsten Mal den
 * letzten Durchgang zum Vergleich (Pflichtenheft 7: „Wiederholung derselben Partie nach Wochen“).
 * Abhängigkeiten: training/studientrainer.ts, training/repertoiretrainer.ts, useRatevergleich,
 * Brettbereich.
 */
import { useMemo, useState } from "react";
import { aendere, useSpeicher } from "../../speicher/speicher";
import { mitRatedurchgang, type Rateeintrag } from "../../speicher/trainerverlauf";
import { sprache, t } from "../../i18n/sprache";
import { sanInSprache } from "../../schach/notation";
import { stellungAusFen, type Rolle } from "../../schach/stellung";
import { eigeneAlsText, spieleZug, zugFelder } from "../../schach/weiterspielen";
import {
  anfang,
  istBuchzug,
  mitAntwort,
  type Repertoireaufgabe as Aufgabe,
} from "../../training/repertoiretrainer";
import { gutGeraten, type Ratestand } from "../../training/studientrainer";
import { stellungNach } from "../../training/uebungsaufgabe";
import { Brettbereich } from "../komponenten/Brettbereich";
import { useBrettbedienung } from "../komponenten/useBrettbedienung";
import { Antwortmeldung } from "./Rundenrahmen";
import { useRatevergleich, type Fehlversuch, type Vergleichsstand } from "./useRatevergleich";
import type { Runde } from "./useRunde";
import { useSammelstellung } from "./sammelstellung";

const KEINE_WAHL = () => undefined;
/** So viele letzte Züge zeigt die Zeile unter dem Brett (lange Partien bleiben lesbar). */
const SICHTBARE_ZUEGE = 8;

/** Meldung zum letzten Rateversuch: getroffen oder der Partiezug. */
type Meldung = { readonly getroffen: true } | { readonly getroffen: false; readonly zug: string };

/**
 * Kennung einer Partie für den Verlauf: Titel und Seite des Lesers (die Aufgaben haben keine
 * eigene Kennung). Beispiel: „Opernpartie (white)“.
 */
function partieKennung(aufgabe: Aufgabe): string {
  return `${aufgabe.titel} (${aufgabe.seite})`;
}

/** Der letzte gespeicherte Durchgang dieser Partie, falls es einen gibt. */
function Frueher({ eintrag }: { eintrag: Rateeintrag | undefined }) {
  if (!eintrag) return null;
  return (
    <p className="hinweis" data-testid="zugerraten-frueher">
      {t("zugerraten.frueher", {
        treffer: eintrag.treffer,
        versuche: eintrag.versuche,
        datum: new Date(eintrag.datum).toLocaleDateString("de-DE"),
      })}
    </p>
  );
}

/** Speichert einen beendeten Durchgang (Fehler beim Speichern meldet speicher.ts selbst). */
function speichereDurchgang(partie: string, stand: Ratestand): void {
  const eintrag = { datum: new Date().toISOString(), ...stand };
  void aendere((d) => ({ ...d, zugErraten: mitRatedurchgang(d.zugErraten, partie, eintrag) }));
}

/** Die Zeile zum Vergleich: rechnet, gleichwertig, schwächer oder stärker, dazu die Warum-Frage. */
function Vergleich({ stand }: { stand: Vergleichsstand | null }) {
  if (!stand) return null;
  const urteil = stand.art === "fertig" ? stand.urteil : null;
  return (
    <p className="hinweis" data-testid="zugerraten-vergleich">
      {stand.art === "rechnet" && t("zugerraten.vergleich.rechnet")}
      {urteil &&
        t(`zugerraten.vergleich.${urteil.art}`, {
          unterschied: urteil.unterschied.toFixed(1).replace(".", ","),
        })}{" "}
      {t("zugerraten.warum")}
    </p>
  );
}

export function Zugerratenaufgabe({ aufgabe, runde }: { aufgabe: Aufgabe; runde: Runde }) {
  const [zuege, setzeZuege] = useState<readonly string[]>(() => anfang(aufgabe));
  const [stand, setzeStand] = useState<Ratestand>({ versuche: 0, treffer: 0 });
  const [meldung, setzeMeldung] = useState<Meldung | null>(null);
  const [fehlversuch, setzeFehlversuch] = useState<Fehlversuch | null>(null);
  const vergleich = useRatevergleich(fehlversuch);
  // Der letzte Durchgang vor dieser Runde; bleibt während der Runde stehen.
  const verlauf = useSpeicher((z) => z.daten.zugErraten[partieKennung(aufgabe)]);
  const [frueher] = useState(() => verlauf?.at(-1));
  const fen = stellungNach(aufgabe.startFen, zuege);
  useSammelstellung(fen);
  const fertig = runde.ergebnis !== null;
  const spiele = (von: string, nach: string, umwandlung?: Rolle) => {
    if (fertig) return "ungueltig" as const;
    const versuch = spieleZug(fen, von, nach, umwandlung);
    if (versuch.art !== "gespielt") return versuch.art;
    const getroffen = istBuchzug(aufgabe, zuege.length, versuch.san);
    const partiezug = aufgabe.linie[zuege.length] ?? "";
    const neuerStand = {
      versuche: stand.versuche + 1,
      treffer: stand.treffer + (getroffen ? 1 : 0),
    };
    const neu = mitAntwort(aufgabe, zuege);
    setzeStand(neuerStand);
    setzeZuege(neu);
    setzeMeldung(getroffen ? { getroffen } : { getroffen, zug: partiezug });
    setzeFehlversuch(getroffen ? null : { vorherFen: fen, eigen: versuch.san, partie: partiezug });
    if (neu.length >= aufgabe.linie.length) {
      runde.beantworte(gutGeraten(neuerStand));
      speichereDurchgang(partieKennung(aufgabe), neuerStand);
    }
    return "gespielt" as const;
  };
  const bedienung = useBrettbedienung({ fen, spiele }, fertig ? null : "ziehen", KEINE_WAHL);
  const stellung = useMemo(() => stellungAusFen(fen), [fen]);
  const letzter =
    zuege.length > 0
      ? zugFelder(stellungNach(aufgabe.startFen, zuege.slice(0, -1)), zuege.at(-1) ?? "")
      : null;
  const notation = eigeneAlsText(aufgabe.startFen, zuege, sprache());
  return (
    <>
      <p className="trainer-auftrag">
        {t("zugerraten.auftrag", {
          titel: aufgabe.titel,
          farbe: t(aufgabe.seite === "white" ? "farbe.w" : "farbe.b"),
        })}
      </p>
      {stellung.ok && (
        <Brettbereich
          stellung={stellung.wert}
          markierungen={[]}
          letzterZug={letzter}
          bedienung={bedienung}
          beschriftung={t("trainer.zugErraten.name")}
          anfangsGedreht={aufgabe.seite === "black"}
        />
      )}
      <p className="hinweis" data-testid="zugerraten-zuege">
        {notation.length > SICHTBARE_ZUEGE ? "… " : ""}
        {notation.slice(-SICHTBARE_ZUEGE).join(" ") || t("repertoiretrainer.nochKeinZug")}
      </p>
      {meldung && !fertig && (
        <p className={`meldung ${meldung.getroffen ? "gut" : "schlecht"}`} role="status">
          {meldung.getroffen
            ? t("zugerraten.getroffen")
            : t("zugerraten.partiezug", { zug: sanInSprache(meldung.zug, sprache()) })}
        </p>
      )}
      {meldung && !meldung.getroffen && <Vergleich stand={vergleich} />}
      <p data-testid="zugerraten-stand">{t("zugerraten.stand", { ...stand })}</p>
      <Frueher eintrag={frueher} />
      {fertig && (
        <Antwortmeldung richtig={runde.ergebnis === true}>{t("zugerraten.ende")}</Antwortmeldung>
      )}
    </>
  );
}
