/**
 * Kapitelübersicht: Abschnitte des Kapitels mit allen Abbildungen als kleine Bretter.
 *
 * Rolle im Gesamtbild: Bildschirm „Kapitelübersicht“ aus Konzept 10.1 (Pflichtenheft 4
 * „Abbildung aufrufen … Kapitelübersicht mit kleinen Brettern“). Erreichbar über das Buch.
 * Die kleinen Bretter zeigen Pfeile und Felder wie im Buch; ein Tipp öffnet die Abbildung.
 * Das Kapitelbild folgt, sobald die Bilder des Buches final sind. Oben stehen der Fortschritt
 * des Lesers (AP 12) und die Trainer des Kapitels (Pflichtenheft 7); angesehene Abbildungen
 * tragen einen Haken, den der Leser auch von Hand setzen kann (einzeln oder alle, 0.2.27).
 * Abhängigkeiten: daten/laden.ts, ui/brett, Navigation, i18n.
 */
import { Check } from "lucide-react";
import { useState } from "react";
import { useNavigation } from "../../app/navigationsKontext";
import {
  ladeKapitel,
  type Abbildung,
  type Kapitel as KapitelDaten,
  type Textteil,
} from "../../daten/laden";
import { t } from "../../i18n/sprache";
import { Brett } from "../brett/Brett";
import { buchmarkierungen } from "../komponenten/buchmarkierungen";
import { Kopfzeile } from "../komponenten/Kopfzeile";
import { useDaten } from "../komponenten/useDaten";
import { Kapitelfortschritt } from "../komponenten/Kapitelfortschritt";
import { setzeGesehen } from "../../speicher/fortschritt";
import { aendere, useSpeicher } from "../../speicher/speicher";
import { trainerZuKapitel } from "../../training/trainer";
import { Trainerkarte } from "./Training";

/** Größe des Hakens im Kästchen an angesehenen Abbildungen. */
const HAKEN_GROESSE = 15;
/** So viele Zeichen der Bildunterschrift stehen unter dem kleinen Brett. */
const KURZTEXT_ZEICHEN = 60;

/** Der Anfang der Bildunterschrift als schlichter Text, etwa „Nach 2... Sc6“. */
function kurztext(teile: readonly Textteil[]): string {
  const text = teile
    .filter((teil) => teil.art !== "absatz")
    .map((teil) => teil.text)
    .join("")
    .trim();
  return text.length > KURZTEXT_ZEICHEN ? `${text.slice(0, KURZTEXT_ZEICHEN).trimEnd()} …` : text;
}

/** Hakt eine Abbildung ab oder nimmt den Haken zurück (sofort gespeichert). */
function hake(nummern: readonly string[], gesehen: boolean): void {
  void aendere((daten) => setzeGesehen(daten, nummern, gesehen, new Date()));
}

/**
 * Ein kleines Brett mit Nummer und Anfang der Unterschrift; ein Tipp öffnet die Abbildung. Oben
 * rechts ein Kästchen zum Abhaken von Hand (Wunsch des Autors, Nachtest 0.2.26).
 */
function Kachel({ abbildung }: { abbildung: Abbildung }) {
  const { navigiere } = useNavigation();
  const gesehen = useSpeicher(
    (zustand) => zustand.daten.fortschritt.gesehen[abbildung.id] !== undefined,
  );
  const titel = t("abbildung.titel", { nummer: abbildung.id });
  return (
    <div className="abbildungskachel-rahmen">
      <button
        type="button"
        className="abbildungskachel"
        onClick={() => navigiere({ bildschirm: "abbildung", nummer: abbildung.id })}
      >
        <Brett
          fen={abbildung.fen}
          markierungen={buchmarkierungen(abbildung)}
          koordinaten={false}
          beschriftung={titel}
        />
        <span className="kachel-nummer">{titel}</span>
        <span className="kachel-text">{kurztext(abbildung.unterschrift)}</span>
      </button>
      <button
        type="button"
        className="kachel-haken"
        aria-pressed={gesehen}
        aria-label={t("fortschritt.abhaken", { titel })}
        onClick={() => hake([abbildung.id], !gesehen)}
      >
        {gesehen && <Check size={HAKEN_GROESSE} aria-hidden="true" />}
        {t(gesehen ? "fortschritt.gesehen" : "fortschritt.nichtGesehen")}
      </button>
    </div>
  );
}

/** Welche Rückfrage gerade offen ist: alle abhaken oder alle zurücksetzen. */
type Rueckfrage = "abhaken" | "zuruecksetzen" | null;

/**
 * „Alle abhaken“ und „Alle zurücksetzen“ für die Abbildungen des Kapitels, beide mit Rückfrage
 * (Wunsch des Autors nach dem Test von 0.2.27: Ein versehentliches „Alle abhaken“ verwischt, was
 * man wirklich schon angesehen hat).
 */
function AlleAbhaken({ kapitel }: { kapitel: KapitelDaten }) {
  const [frage, setzeFrage] = useState<Rueckfrage>(null);
  const nummern = kapitel.abbildungen.map((a) => a.id);
  if (frage) {
    const abhaken = frage === "abhaken";
    return (
      <div
        className="nachfrage"
        role="alertdialog"
        aria-label={t(abhaken ? "fortschritt.alleAbhaken" : "fortschritt.alleZuruecksetzen")}
      >
        <p>
          {t(abhaken ? "fortschritt.abhakenFrage" : "fortschritt.zuruecksetzenFrage", {
            kapitel: kapitel.kapitel,
          })}
        </p>
        <div className="knopfreihe">
          <button
            type="button"
            className={abhaken ? "knopf-haupt" : "knopf-gefahr"}
            onClick={() => {
              hake(nummern, abhaken);
              setzeFrage(null);
            }}
          >
            {t(abhaken ? "fortschritt.abhakenJa" : "fortschritt.zuruecksetzenJa")}
          </button>
          <button type="button" className="knopf-zweit" onClick={() => setzeFrage(null)}>
            {t("loeschen.nein")}
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="alle-abhaken">
      <p className="hinweis">{t("fortschritt.verweilen")}</p>
      <div className="knopfreihe">
        <button type="button" className="knopf-zweit" onClick={() => setzeFrage("abhaken")}>
          {t("fortschritt.alleAbhaken")}
        </button>
        <button type="button" className="knopf-zweit" onClick={() => setzeFrage("zuruecksetzen")}>
          {t("fortschritt.alleZuruecksetzen")}
        </button>
      </div>
    </div>
  );
}

/** Abbildungen nach Abschnitten; Abbildungen vor dem ersten Abschnitt stehen vorn ohne Titel. */
function nachAbschnitten(kapitel: KapitelDaten) {
  const gruppen = [
    { nummer: "", titel: "", abbildungen: kapitel.abbildungen.filter((a) => !a.abschnitt) },
    ...kapitel.abschnitte.map((abschnitt) => ({
      nummer: abschnitt.nummer,
      titel: abschnitt.titel,
      abbildungen: kapitel.abbildungen.filter((a) => a.abschnitt?.nummer === abschnitt.nummer),
    })),
  ];
  return gruppen.filter((gruppe) => gruppe.abbildungen.length > 0);
}

/** Die Trainer dieses Kapitels (Konzept 10.1: „Trainer des Kapitels“). */
function KapitelTrainer({ nummer }: { nummer: number }) {
  const trainer = trainerZuKapitel(nummer);
  if (trainer.length === 0) return null;
  return (
    <section className="abschnitt">
      <h2 className="abschnitt-titel">{t("training.kapitelTrainer")}</h2>
      {trainer.map((eintrag) => (
        <Trainerkarte key={eintrag.kennung} trainer={eintrag} />
      ))}
    </section>
  );
}

function Inhalt({ kapitel }: { kapitel: KapitelDaten }) {
  return (
    <>
      <p className="kapitel-untertitel">{kapitel.titel}</p>
      <Kapitelfortschritt kapitel={kapitel} />
      <AlleAbhaken kapitel={kapitel} />
      <KapitelTrainer nummer={kapitel.kapitel} />
      {nachAbschnitten(kapitel).map((gruppe) => (
        <section key={gruppe.nummer || "vorn"} className="abschnitt">
          {gruppe.nummer && (
            <h2 className="abschnitt-titel">
              {gruppe.nummer} {gruppe.titel}
            </h2>
          )}
          <div className="kachelraster">
            {gruppe.abbildungen.map((abbildung) => (
              <Kachel key={abbildung.id} abbildung={abbildung} />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}

/**
 * Bildschirm eines Kapitels.
 *
 * Eingabe: Kapitelnummer. Beispiel: Kapitel 1 mit Abschnitt 1.4 und den Abb. 1.26 bis 1.29.
 */
export function Kapitel({ nummer }: { nummer: number }) {
  const kapitel = useDaten(() => ladeKapitel(nummer), `kapitel-${nummer}`);
  return (
    <div className="bildschirm">
      <Kopfzeile titel={t("buch.kapitel", { nummer })} zurueckText={t("buch.titel")} />
      {kapitel.art === "laedt" && <p className="lade">…</p>}
      {kapitel.art === "fehler" && (
        <p className="fehlertext">{t("buch.ladefehler", { fehler: kapitel.meldung })}</p>
      )}
      {kapitel.art === "fertig" && <Inhalt kapitel={kapitel.wert} />}
    </div>
  );
}
