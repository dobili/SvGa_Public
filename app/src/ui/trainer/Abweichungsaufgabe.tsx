/**
 * Aufgabe des Abweichungsmodus: Buchzüge bis zur Abweichung, der Abweichzug der Engine, die
 * Antwort des Lesers am Brett, danach Bewertung und Einschätzung nach den Prinzipien.
 *
 * Rolle im Gesamtbild: Trainer „abweichung“ (Kapitel 2 und 3, AP 13 Stufe 3). Gut ist eine
 * Antwort, die höchstens 0,5 Bauern hinter dem besten Zug der Engine liegt. Die Einschätzung
 * zeigt die Fazits der Werkzeuge Zielbilanz und Todsünden für die eigene Seite nach der Antwort
 * (Konzept: erst selbst nach den Prinzipien ziehen, dann vergleichen).
 * Abhängigkeiten: training/abweichungstrainer.ts, useAbweichung.ts, analyse/register.ts (nur
 * aufgerufen), Brettbereich, useBrettbedienung, i18n.
 */
import { useEffect, useMemo, useState } from "react";
import { wende } from "../../analyse/register";
import type { Eroeffnungsindex } from "../../schach/eroeffnungsindex";
import { sprache, t } from "../../i18n/sprache";
import { sanInSprache } from "../../schach/notation";
import { stellungAusFen, type Rolle } from "../../schach/stellung";
import { eigeneAlsText, spieleZug, zugFelder } from "../../schach/weiterspielen";
import { fenNach } from "../../spiel/zuege";
import {
  antwortklasse,
  type Abweichungsaufgabe as Aufgabe,
} from "../../training/abweichungstrainer";
import { stellungNach } from "../../training/uebungsaufgabe";
import { Brettbereich } from "../komponenten/Brettbereich";
import { useBrettbedienung } from "../komponenten/useBrettbedienung";
import { Antwortmeldung } from "./Rundenrahmen";
import { useAbweichzug, useAntwortbewertung } from "./useAbweichung";
import type { Runde } from "./useRunde";
import { useSammelstellung } from "./sammelstellung";

const KEINE_WAHL = () => undefined;
const de = (san: string) => sanInSprache(san, sprache());

/** Die Fazits von Zielbilanz und Todsünden für die eigene Seite nach der Antwort. */
function Einschaetzung({ aufgabe, zuege }: { aufgabe: Aufgabe; zuege: readonly string[] }) {
  const zeilen = useMemo(() => {
    const gelesen = stellungAusFen(stellungNach(aufgabe.startFen, zuege));
    if (!gelesen.ok) return [];
    const eingabe = {
      stellung: gelesen.wert,
      perspektive: aufgabe.seite,
      verlauf: { startFen: aufgabe.startFen, zuege },
    };
    return ["k2-zielbilanz", "k1-todsuenden"].flatMap((id) => {
      const e = wende(id, eingabe);
      return e ? [`${e.ueberschrift}: ${e.fazit}`] : [];
    });
  }, [aufgabe, zuege]);
  return (
    <section className="karte" data-testid="abweichung-einschaetzung">
      <h3 className="karte-titel">{t("abweichung.einschaetzung")}</h3>
      {zeilen.map((z) => (
        <p key={z}>{z}</p>
      ))}
    </section>
  );
}

/**
 * Eine Aufgabe des Abweichungsmodus: Buchzüge bis zur Abweichung der Engine, die eigene Antwort am
 * Brett, dann Bewertung und Einschätzung nach den Prinzipien.
 */
export function Abweichungsaufgabe({
  aufgabe,
  runde,
  index,
}: {
  aufgabe: Aufgabe;
  runde: Runde;
  index: Eroeffnungsindex | undefined;
}) {
  const fenBuch = stellungNach(aufgabe.startFen, aufgabe.buchzuege);
  const abweichung = useAbweichzug(fenBuch, index);
  const abw = abweichung?.art === "fertig" ? abweichung.wert : null;
  const fenVorher = abw ? (fenNach(fenBuch, abw) ?? fenBuch) : fenBuch;
  const [eigen, setzeEigen] = useState<string | null>(null);
  const bewertung = useAntwortbewertung(fenVorher, eigen);
  const fertig = runde.ergebnis !== null;
  const zuege = [...aufgabe.buchzuege, ...(abw ? [abw] : []), ...(eigen ? [eigen] : [])];
  const fen = stellungNach(aufgabe.startFen, zuege);
  useSammelstellung(fen);
  useEffect(() => {
    if (fertig) return;
    if (abweichung?.art === "fertig" && abweichung.wert === null) runde.beantworte(true);
    if (bewertung?.art === "fertig")
      runde.beantworte(antwortklasse(bewertung.wert.verlust) === "gut");
    if (bewertung?.art === "fehler" || abweichung?.art === "fehler") runde.beantworte(false);
  }, [fertig, abweichung, bewertung, runde]);
  const spiele = (von: string, nach: string, umwandlung?: Rolle) => {
    if (!abw || eigen !== null) return "ungueltig" as const;
    const versuch = spieleZug(fenVorher, von, nach, umwandlung);
    if (versuch.art !== "gespielt") return versuch.art;
    setzeEigen(versuch.san);
    return "gespielt" as const;
  };
  const amZug = abw !== null && eigen === null;
  const bedienung = useBrettbedienung({ fen, spiele }, amZug ? "ziehen" : null, KEINE_WAHL);
  const stellung = stellungAusFen(fen);
  const letzter =
    zuege.length > 0
      ? zugFelder(stellungNach(aufgabe.startFen, zuege.slice(0, -1)), zuege.at(-1) ?? "")
      : null;
  const farbe = t(aufgabe.seite === "white" ? "farbe.w" : "farbe.b");
  return (
    <>
      <p className="trainer-auftrag">{t("abweichung.auftrag", { titel: aufgabe.titel, farbe })}</p>
      {stellung.ok && (
        <Brettbereich
          stellung={stellung.wert}
          markierungen={[]}
          letzterZug={letzter}
          bedienung={bedienung}
          beschriftung={t("trainer.abweichung.name")}
          anfangsGedreht={aufgabe.seite === "black"}
        />
      )}
      <p className="hinweis" data-testid="abweichung-zuege">
        {eigeneAlsText(aufgabe.startFen, zuege, sprache()).join(" ")}
      </p>
      {abweichung?.art === "rechnet" && <p className="hinweis">{t("abweichung.rechnet")}</p>}
      {abw && (
        <p className="meldung" data-testid="abweichung-zug">
          {t("abweichung.verlaesst", { zug: de(abw) })}
        </p>
      )}
      {abweichung?.art === "fertig" && abw === null && (
        <p className="hinweis">{t("abweichung.keinZug")}</p>
      )}
      {eigen && bewertung?.art === "rechnet" && (
        <p className="hinweis">{t("abweichung.bewertet")}</p>
      )}
      {fertig && bewertung?.art === "fertig" && (
        <Antwortmeldung richtig={runde.ergebnis === true}>
          {t(`abweichung.klasse.${antwortklasse(bewertung.wert.verlust)}`, {
            zug: de(eigen ?? ""),
            bester: de(bewertung.wert.besterZug ?? ""),
          })}
        </Antwortmeldung>
      )}
      {fertig && eigen && <Einschaetzung aufgabe={aufgabe} zuege={zuege} />}
    </>
  );
}
