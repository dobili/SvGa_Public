/**
 * Abschnitt „Aufträge dieser Woche“ der Wochenkarte (Gamifizierung P6): drei Aufträge mit Stand
 * „1 von 3“, Knopf, der direkt hinführt, Haken mit „+15 Erfahrung“ und einmal „Tauschen“.
 *
 * Rolle im Gesamtbild: Eintrag in WOCHENABSCHNITTE (Rang 20). Die Rechnung steht rein in
 * training/wochenauftraege.ts, die Arten in training/auftragsarten.ts. Dieser Abschnitt hält die
 * Wahl der Woche und erledigte Aufträge über `aendere` im Speicher fest (wie die Wochenkarte P4),
 * damit die Liste die ganze Woche gleich bleibt und Erfahrung und Abzeichen bleiben.
 * Der Auftrag „Bot besiegen“ belegt mit useSpielvorbelegung() einen passenden Bot vor.
 * Abhängigkeiten: training/wochenauftraege.ts, daten/laden.ts, spielstart/vorbelegung.ts,
 * Navigation, Speicher, i18n.
 */
import { Check } from "lucide-react";
import { useEffect } from "react";
import { useNavigation } from "../../../app/navigationsKontext";
import { ladeIndex } from "../../../daten/laden";
import { t } from "../../../i18n/sprache";
import type { Nutzerdaten } from "../../../speicher/format";
import { aendere, useSpeicher } from "../../../speicher/speicher";
import type { Kapitelangabe } from "../../../training/naechsterSchritt";
import {
  auftraegeDerWoche,
  auftragszeilen,
  mitAuftraegen,
  mitTausch,
  neuErledigte,
  PUNKTE_JE_AUFTRAG,
  tauschauftrag,
  type Auftragslage,
  type Auftragszeile,
  type Knopfziel,
} from "../../../training/wochenauftraege";
import { useDaten } from "../bausteine/useDaten";
import { useSpielvorbelegung } from "../spielstart/vorbelegung";
import "../../stil/auftraege.css";

const KEINE_KAPITEL: readonly Kapitelangabe[] = [];

/** Der Satz eines Auftrags; der Name (etwa des Trainers) wird erst hier übersetzt. */
function auftragstext(zeile: Pick<Auftragszeile, "art" | "auftrag">): string {
  const { art, auftrag } = zeile;
  const name = art.name && auftrag.wert ? t(art.name(auftrag.wert)) : "";
  const vorlage = auftrag.anzahl === 1 && art.textEins ? art.textEins : art.text;
  return t(vorlage, { anzahl: auftrag.anzahl, wert: auftrag.wert ?? "", name });
}

/** Die Lage aus Speicher und Datenverzeichnis; null, solange das Verzeichnis lädt. */
function useAuftragslage(): Auftragslage | null {
  const daten = useSpeicher((z) => z.daten);
  const index = useDaten(ladeIndex, "index");
  if (index.art === "laedt") return null;
  const kapitel = index.art === "fertig" ? index.wert.kapitel : KEINE_KAPITEL;
  return { daten, kapitel, jetzt: new Date() };
}

/** Speichert die Wahl der Woche und erledigte Aufträge, sobald sich daran etwas ändert. */
function useFesthalten(lage: Auftragslage | null): void {
  const stand = lage ? auftraegeDerWoche(lage.daten.wochen.auftraege, lage) : null;
  const gespeichert = lage !== null && stand === lage.daten.wochen.auftraege;
  const neu = lage && stand ? neuErledigte(stand, lage.daten).join(",") : "";
  const kapitel = lage?.kapitel ?? KEINE_KAPITEL;
  const woche = stand?.woche ?? "";
  useEffect(() => {
    if (woche === "" || (gespeichert && neu === "")) return;
    void aendere((d) => {
      const jetzt = new Date();
      const aktuell = { daten: d, kapitel, jetzt };
      return mitAuftraegen(d, auftraegeDerWoche(d.wochen.auftraege, aktuell), jetzt);
    });
  }, [woche, gespeichert, neu, kapitel]);
}

/** Tauscht den Auftrag an einer Stelle und speichert. */
function tausche(stelle: number, kapitel: readonly Kapitelangabe[]): void {
  void aendere((d: Nutzerdaten) => {
    const jetzt = new Date();
    const lage = { daten: d, kapitel, jetzt };
    return mitAuftraegen(
      d,
      mitTausch(auftraegeDerWoche(d.wochen.auftraege, lage), stelle, lage),
      jetzt,
    );
  });
}

/** Führt den Knopf aus: Ansicht öffnen oder Bot vorbelegen. */
function useKnopf(): (ziel: Knopfziel) => void {
  const { navigiere } = useNavigation();
  const spiele = useSpielvorbelegung();
  return (ziel) =>
    ziel.art === "bot" ? spiele({ bot: ziel.bot, tempo: null }) : navigiere(ziel.ansicht);
}

/** Knopf zum Ziel und, wenn möglich, „Tauschen“. */
function Knoepfe({
  zeile,
  text,
  tauschbar,
  lage,
}: {
  zeile: Auftragszeile;
  text: string;
  tauschbar: boolean;
  lage: Auftragslage;
}) {
  const fuehreAus = useKnopf();
  const { art, auftrag, stelle } = zeile;
  return (
    <div className="knopfzeile">
      <button
        type="button"
        className="knopf-zweit"
        onClick={() => fuehreAus(art.ziel(auftrag, lage.daten))}
      >
        {t(art.knopf)}
      </button>
      {tauschbar && (
        <button
          type="button"
          className="knopf-link"
          aria-label={t("auftrag.tauschenName", { text })}
          onClick={() => tausche(stelle, lage.kapitel)}
        >
          {t("auftrag.tauschen")}
        </button>
      )}
    </div>
  );
}

/** Eine Zeile: Haken oder Stand, Satz, Knopf und Tauschen. */
function Auftrag(props: { zeile: Auftragszeile; tauschbar: boolean; lage: Auftragslage }) {
  const { erledigt, erreicht, auftrag, art } = props.zeile;
  const text = auftragstext(props.zeile);
  const erledigtText = t("auftrag.erledigt", { punkte: PUNKTE_JE_AUFTRAG });
  return (
    <li
      className={erledigt ? "auftrag auftrag-erledigt" : "auftrag"}
      data-testid={`auftrag-${art.kennung}`}
    >
      <span className="auftrag-zeichen" data-testid="auftrag-stand">
        {erledigt ? (
          <Check aria-label={erledigtText} size={20} />
        ) : (
          t("auftrag.stand", { erreicht, anzahl: auftrag.anzahl })
        )}
      </span>
      <p className="auftrag-text">
        {text}
        {erledigt && <> · {erledigtText}</>}
      </p>
      {!erledigt && <Knoepfe {...props} text={text} />}
    </li>
  );
}

/** Der Abschnitt mit den Aufträgen der Woche. */
export function Auftragsabschnitt() {
  const lage = useAuftragslage();
  useFesthalten(lage);
  if (!lage) return null;
  const stand = auftraegeDerWoche(lage.daten.wochen.auftraege, lage);
  const zeilen = auftragszeilen(stand, lage.daten);
  return (
    <div className="wochenkarte-abschnitt" data-testid="wochenauftraege">
      <h3>{t("auftrag.titel")}</h3>
      {zeilen.length === 0 ? (
        <p className="hinweis">{t("auftrag.keine")}</p>
      ) : (
        <>
          <p className="hinweis">{t("auftrag.hinweis")}</p>
          <ul className="auftraege">
            {zeilen.map((zeile) => (
              <Auftrag
                key={`${zeile.stelle}-${zeile.auftrag.art}`}
                zeile={zeile}
                tauschbar={tauschauftrag(stand, zeile.stelle, lage) !== null}
                lage={lage}
              />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
