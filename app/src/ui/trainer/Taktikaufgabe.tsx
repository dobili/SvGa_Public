/**
 * Eine Aufgabe des Taktiktrainers: Züge ziehen, gestufte Hilfen, danach das Motiv benennen.
 *
 * Rolle im Gesamtbild: Trainer „taktik“ (Pflichtenheft 7: „Gestufte Hilfen: Warnsignal, Motiv,
 * Schlüsselfigur, Lösung. Nach der Lösung benennst du das Motiv.“). Das Warnsignal rechnet das
 * Werkzeug Warnsignale aus Kapitel 7 aus der Stellung. Richtig zählt eine Aufgabe, die ohne
 * falschen Zug und ohne Hilfe gelöst ist; das Benennen des Motivs zeigt nur, ob es stimmte. Nach
 * einem falschen Zug zeigen useFalschzug und Falschzugmeldung den roten Pfeil und den Verlust laut Engine.
 * Zusatzaufgaben (Lichess, nicht aus dem Buch, seit Paket 8) bringen ihren Gegnerzug mit: Das
 * Brett zeigt erst die Stellung davor und spielt ihn nach kurzer Pause vor (useVorzug.ts).
 * Abhängigkeiten: training/taktiktrainer.ts, analyse/k7-warnsignale.ts, Brettbereich.
 */
import { useId, useMemo, useState } from "react";
import { warnsignaleSieben } from "../../analyse/k7-warnsignale";
import type { Markierung } from "../../analyse/werkzeug";
import type { Taktikaufgabe as Aufgabe } from "../../daten/trainerdaten";
import { sprache, t } from "../../i18n/sprache";
import { sanInSprache } from "../../schach/notation";
import { stellungAusFen, type Rolle } from "../../schach/stellung";
import { spieleZug, zugFelder } from "../../schach/weiterspielen";
import { alsZugaufgabe, MOTIVE, pruefeTaktikzug } from "../../training/taktiktrainer";
import { loesungszug, stellungNach } from "../../training/uebungsaufgabe";
import { Brettbereich } from "../komponenten/brettbedienung/Brettbereich";
import { useBrettbedienung } from "../komponenten/brettbedienung/useBrettbedienung";
import { Antwortmeldung } from "./Rundenrahmen";
import type { Runde } from "./useRunde";
import { themaTaktik } from "../../speicher/themenprotokoll";
import { antworteMitKarte } from "./kartenantwort";
import { useSammelstellung } from "./sammelstellung";
import { Knopfsymbol } from "../komponenten/bausteine/Knopfsymbol";
import { Falschzugmeldung } from "./Falschzugmeldung";
import { falschzugpfeile, useFalschzug } from "./useFalschzug";
import { useVorzug } from "./useVorzug";

const HILFEN = 3;
const KEINE_WAHL = () => undefined;

/** Was eine Zusatzaufgabe mitbringt: Name ihres Themas und den Gegnerzug, der vorgespielt wird. */
export interface Zusatzanzeige {
  readonly themenname: string;
  readonly vorher: { readonly fen: string; readonly zug: string };
}

/** Woher die Aufgabe stammt: Abbildung des Buches oder Lichess-Datenbank. */
function Herkunft({ aufgabe, zusatz }: { aufgabe: Aufgabe; zusatz: boolean }) {
  const h = aufgabe.herkunft;
  return (
    <p className="hinweis" data-testid={zusatz ? "zusatz-herkunft" : undefined}>
      {h.quelle === "buch"
        ? t("taktiktrainer.ausBuch", { nummer: h.abbildung })
        : t(zusatz ? "zusatzaufgaben.herkunft" : "taktiktrainer.ausLichess", {
            wertung: h.wertung,
          })}
      {" · "}
      {t("taktiktrainer.stufe", { stufe: aufgabe.schwierigkeit })}
    </p>
  );
}

/** Die Hilfen in drei Stufen, darunter „Lösung zeigen“. */
function Hilfen({
  aufgabe,
  themenname,
  stufe,
  weiter,
  zeigeLoesung,
}: {
  aufgabe: Aufgabe;
  themenname: string | null;
  stufe: number;
  weiter: () => void;
  zeigeLoesung: () => void;
}) {
  const warnsignal = useMemo(() => {
    const gelesen = stellungAusFen(aufgabe.fen);
    const eigen = aufgabe.amZug === "w" ? "white" : "black";
    return gelesen.ok ? warnsignaleSieben(gelesen.wert, eigen).fazit : "";
  }, [aufgabe]);
  const motiv = themenname
    ? themenname
    : aufgabe.motiv
      ? t(`taktiktrainer.motiv.${aufgabe.motiv}`)
      : aufgabe.mattbild
        ? t(`mattbild.${aufgabe.mattbild}`)
        : t("taktiktrainer.ohneMotiv");
  return (
    <div className="uebung-hilfe">
      {stufe >= 1 && <p>{t("taktiktrainer.hilfeWarnsignal", { text: warnsignal })}</p>}
      {stufe >= 2 && <p data-testid="taktik-motiv">{t("taktiktrainer.hilfeMotiv", { motiv })}</p>}
      {stufe >= HILFEN && <p>{t("taktiktrainer.hilfeFigur")}</p>}
      <div className="knopfzeile">
        {stufe < HILFEN && (
          <button type="button" className="knopf-zweit" onClick={weiter}>
            <Knopfsymbol art="hinweis" />
            {t("uebung.hinweis", { stufe: stufe + 1 })}
          </button>
        )}
        <button type="button" className="knopf-link" onClick={zeigeLoesung}>
          <Knopfsymbol art="loesung" />
          {t("uebung.loesungZeigen")}
        </button>
      </div>
    </div>
  );
}

/**
 * Nach dem Lösen: das Motiv benennen (nur bei Aufgaben mit Grundmotiv).
 * Seit 0.3.2 als Auswahlliste statt zwölf Chips untereinander (Wunsch des Autors, 26.10.2026):
 * ruhiger, auf dem Handy öffnet sie die gewohnte Auswahl des Systems. Die erste Wahl zählt.
 */
function MotivBenennen({ richtig }: { richtig: Aufgabe["motiv"] }) {
  const [gewaehlt, setzeGewaehlt] = useState<string | null>(null);
  const kennung = useId();
  if (!richtig) return null;
  return (
    <div className="auswahlliste" data-testid="motiv-benennen">
      <label className="einstellung-name" htmlFor={kennung}>
        {t("taktiktrainer.benennen")}
      </label>
      <select
        id={kennung}
        className="auswahlfeld"
        value={gewaehlt ?? ""}
        disabled={gewaehlt !== null}
        onChange={(e) => setzeGewaehlt(e.target.value || null)}
      >
        <option value="">{t("taktiktrainer.benennenWaehlen")}</option>
        {MOTIVE.map((m) => (
          <option key={m} value={m}>
            {t(`taktiktrainer.motiv.${m}`)}
          </option>
        ))}
      </select>
      {gewaehlt && (
        <Antwortmeldung richtig={gewaehlt === richtig}>
          {t("taktiktrainer.motivWar", { motiv: t(`taktiktrainer.motiv.${richtig}`) })}
        </Antwortmeldung>
      )}
    </div>
  );
}

/**
 * Eine Taktikaufgabe in der Runde.
 *
 * `motivAbfragen`: false, wenn der Leser nur ein Motiv übt; die Frage „Welches Motiv war es?“
 * hätte dann immer dieselbe Antwort (Wunsch des Autors R30, 23.10.2026).
 * `zusatz`: nur bei Zusatzaufgaben; der Gegnerzug wird vorgespielt, bevor der Leser zieht.
 */
export function Taktikaufgabe({
  aufgabe,
  runde,
  motivAbfragen = true,
  zusatz = null,
}: {
  aufgabe: Aufgabe;
  runde: Runde;
  motivAbfragen?: boolean;
  zusatz?: Zusatzanzeige | null;
}) {
  useSammelstellung(aufgabe.fen);
  const zugaufgabe = useMemo(() => alsZugaufgabe(aufgabe), [aufgabe]);
  const [zuege, setzeZuege] = useState<readonly string[]>([]);
  const [stufe, setzeStufe] = useState(0);
  const [fehler, setzeFehler] = useState(false);
  const [gezeigt, setzeGezeigt] = useState(false);
  const falschzug = useFalschzug();
  const vorgespielt = useVorzug(zusatz !== null);
  const fen = stellungNach(aufgabe.fen, zuege);
  const fertig = runde.ergebnis !== null;
  // Gamifizierung G1: Grundmotiv als Thema (Zusatzaufgaben ohne Grundmotiv zählen nicht).
  const thema = aufgabe.motiv ? themaTaktik(aufgabe.motiv) : null;
  const spiele = (von: string, nach: string, umwandlung?: Rolle) => {
    if (!zugaufgabe || fertig || !vorgespielt) return "ungueltig" as const;
    const versuch = spieleZug(fen, von, nach, umwandlung);
    if (versuch.art !== "gespielt") return versuch.art;
    const pruefung = pruefeTaktikzug(zugaufgabe, zuege, versuch.san);
    if (pruefung.art === "falsch") {
      setzeFehler(true);
      falschzug.merke(fen, versuch.san, loesungszug(zugaufgabe, zuege));
      return "gespielt" as const;
    }
    const neu = [...zuege, versuch.san, ...(pruefung.antwort ? [pruefung.antwort] : [])];
    setzeZuege(neu);
    if (pruefung.art === "geloest")
      antworteMitKarte(runde, "taktik", aufgabe.id, !fehler && stufe === 0, thema);
    return "gespielt" as const;
  };
  const zeigeLoesung = () => {
    setzeGezeigt(true);
    setzeZuege(zugaufgabe?.linien[0] ?? []);
    antworteMitKarte(runde, "taktik", aufgabe.id, false, thema);
  };
  const bedienung = useBrettbedienung(
    { fen, spiele },
    fertig || !vorgespielt ? null : "ziehen",
    KEINE_WAHL,
  );
  const brettFen = vorgespielt || !zusatz ? fen : zusatz.vorher.fen;
  const stellung = useMemo(() => stellungAusFen(brettFen), [brettFen]);
  const markierungen: Markierung[] = [
    ...(stufe >= HILFEN && !fertig
      ? [{ typ: "feld" as const, farbe: "gold" as const, feld: aufgabe.schluesselfeld }]
      : []),
    ...falschzugpfeile(falschzug, fen, fertig),
  ];
  const letzter =
    zuege.length > 0
      ? zugFelder(stellungNach(aufgabe.fen, zuege.slice(0, -1)), zuege[zuege.length - 1] ?? "")
      : zusatz && vorgespielt
        ? zugFelder(zusatz.vorher.fen, zusatz.vorher.zug)
        : null;
  return (
    <>
      <p className="trainer-auftrag">
        {t(`taktiktrainer.ziel.${aufgabe.ziel}`, {
          farbe: t(aufgabe.amZug === "w" ? "farbe.w" : "farbe.b"),
        })}
      </p>
      {stellung.ok && (
        <Brettbereich
          stellung={stellung.wert}
          markierungen={markierungen}
          letzterZug={letzter}
          bedienung={bedienung}
          beschriftung={t("trainer.taktik.name")}
          anfangsGedreht={aufgabe.amZug === "b"}
        />
      )}
      <Herkunft aufgabe={aufgabe} zusatz={zusatz !== null} />
      {!fertig && fehler && (
        <Antwortmeldung richtig={false}>{t("taktiktrainer.falsch")}</Antwortmeldung>
      )}
      <Falschzugmeldung falschzug={falschzug} aufgedeckt={fertig} testid="taktik-falschzug" />
      {!fertig && (
        <Hilfen
          aufgabe={aufgabe}
          themenname={zusatz?.themenname ?? null}
          stufe={stufe}
          weiter={() => setzeStufe(stufe + 1)}
          zeigeLoesung={zeigeLoesung}
        />
      )}
      {fertig && (
        <Antwortmeldung richtig={!gezeigt}>
          {t("taktiktrainer.loesung", {
            zuege: (zugaufgabe?.linien[0] ?? []).map((z) => sanInSprache(z, sprache())).join(" "),
          })}
        </Antwortmeldung>
      )}
      {fertig && motivAbfragen && <MotivBenennen richtig={aufgabe.motiv} />}
    </>
  );
}
