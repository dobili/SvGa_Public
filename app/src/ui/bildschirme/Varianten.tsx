/**
 * Bildschirm „Varianten“: alle eigenen Varianten, neue anlegen, PGN einlesen und alle sichern.
 *
 * Rolle im Gesamtbild: Variationsbrowser, Stufe 1 (Frage g, Empfehlung C, Bild g): eine Liste,
 * zuletzt geänderte zuerst, mit kleinem Brett, Titel, Quelle und Umfang. Erreichbar über die
 * Kachel „Varianten“ im Training und über den Hinweis „2 eigene Varianten“ an einer Quelle; dann
 * zeigt die Liste nur die Varianten dieser Quelle (Wert „abbildung:2.40“, variantenwert.ts).
 * Eingetragen in app/zusatzansichten.ts unter „varianten“.
 * Abhängigkeiten: komponenten/varianten, speicher, spiel/variationspgn.ts, Navigation, i18n.
 */
import { useState } from "react";
import { useNavigation } from "../../app/navigationsKontext";
import { t } from "../../i18n/sprache";
import { useSpeicher } from "../../speicher/speicher";
import { variationenAlsPgn } from "../../spiel/variationspgn";
import { nachAenderung, variationenZu } from "../../training/variationen";
import { Knopfsymbol } from "../komponenten/bausteine/Knopfsymbol";
import { Leerzustand } from "../komponenten/bausteine/Leerzustand";
import { MitInfo } from "../komponenten/bausteine/InfoKnopf";
import { Kopfzeile } from "../komponenten/rahmen/Kopfzeile";
import { NeuBlatt } from "../komponenten/varianten/NeuBlatt";
import type { Neuquelle } from "../komponenten/varianten/variantentexte";
import { PgnTeilen } from "../komponenten/varianten/PgnTeilen";
import { Variantenkarte } from "../komponenten/varianten/Variantenkarte";
import { quellenmarke } from "../komponenten/varianten/variantentexte";
import { filterAus, variantenAnsicht } from "../komponenten/varianten/variantenwert";
import "../stil/spielenneu.css";

/** Oben: Neue Variante und PGN einlesen. */
function Knoepfe({ oeffne }: { oeffne: (q: Neuquelle | null) => void }) {
  return (
    <div className="knopfreihe variantenkopf" data-tour="varianten-neu">
      <button type="button" className="knopf-haupt" onClick={() => oeffne(null)}>
        <Knopfsymbol art="neu" />
        {t("varianten.neu.knopf")}
      </button>
      <button type="button" className="knopf-zweit" onClick={() => oeffne("einfuegen")}>
        <Knopfsymbol art="einspielen" />
        {t("varianten.pgn.einlesen")}
      </button>
    </div>
  );
}

/** „Nur aus Abb. 2.40“ mit „Alle zeigen“, wenn die Liste gefiltert ist. */
function Filterzeile({ text }: { text: string }) {
  const { ersetze } = useNavigation();
  return (
    <p className="hinweis variantenfilter">
      {t("varianten.nurAus", { quelle: text })}{" "}
      <button
        type="button"
        className="knopf-link klein"
        onClick={() => ersetze(variantenAnsicht())}
      >
        {t("varianten.alleZeigen")}
      </button>
    </p>
  );
}

/** Der Bildschirm „Varianten“; ``wert`` filtert nach einer Quelle. */
export function Varianten({ wert }: { wert: string | null }) {
  const alle = useSpeicher((z) => z.daten.variationen);
  const filter = filterAus(wert);
  const liste = nachAenderung(filter ? variationenZu(alle, filter) : alle);
  const [blatt, setzeBlatt] = useState<{ quelle: Neuquelle | null } | null>(null);
  return (
    <div className="bildschirm bildschirm-varianten" data-testid="varianten">
      <Kopfzeile titel={t("varianten.titel")} zurueckText={t("varianten.zurueck")} />
      <MitInfo
        zeile={<span className="hinweis">{t("varianten.einleitung")}</span>}
        erklaerung={t("varianten.info")}
        thema={t("varianten.titel")}
      />
      <Knoepfe oeffne={(quelle) => setzeBlatt({ quelle })} />
      {filter && <Filterzeile text={quellenmarke(filter)} />}
      {liste.length === 0 ? (
        <Leerzustand bild="liste" zeile={t("varianten.leer")} testid="varianten-leer" />
      ) : (
        <ul className="variantenliste" data-tour="varianten-liste">
          {liste.map((v) => (
            <Variantenkarte key={v.id} variation={v} />
          ))}
        </ul>
      )}
      {liste.length > 0 && <PgnTeilen text={variationenAlsPgn(liste)} name={t("varianten.alle")} />}
      <NeuBlatt
        offen={blatt !== null}
        quelle={blatt?.quelle ?? null}
        setzeQuelle={(quelle) => setzeBlatt({ quelle })}
        schliessen={() => setzeBlatt(null)}
      />
    </div>
  );
}
