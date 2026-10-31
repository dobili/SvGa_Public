/**
 * Buch-Bildschirm: Nummernfeld „Abbildung öffnen“ und die Kapitel mit ihren Abbildungen.
 * Seit der Gestaltung A2 (31.10.2026) steht das Nummernfeld neben dem Titel und der Knopf zum
 * Lernpfad als Symbol oben rechts; „Zuletzt: Abb. …“ erscheint nach einem Tipp ins Feld (sonst
 * führt die Kachel „Weiterlesen“ der Karte „Heute“ weiter). So beginnen die Kapitel weiter oben.
 *
 * Rolle im Gesamtbild: Startseite des Bereichs Buch (Konzept 10.1, Bildschirmentwurf „Buch“).
 * Leser tippen die Nummer aus dem Buch ein, etwa „1.26“, oder öffnen ein Kapitel (Kapitelübersicht).
 * Abhängigkeiten: daten/laden.ts, daten/finde.ts, speicher (Fortschritt), Navigation, i18n.
 */
import { Startkarten } from "../komponenten/start/Startkarten";
import { useState, type FormEvent } from "react";
import { liesMerker } from "../../app/merker";
import { useNavigation } from "../../app/navigationsKontext";
import { findeAbbildung, type Fundergebnis } from "../../daten/finde";
import { ladeIndex, type Datenverzeichnis } from "../../daten/laden";
import { t } from "../../i18n/sprache";
import { kapitelfortschritt, type Anteil } from "../../speicher/fortschritt";
import { useSpeicher } from "../../speicher/speicher";
import { Kapitelnummer } from "../komponenten/kapitel/Kapitelnummer";
import { Fundmeldung } from "../komponenten/abbildung/Nummernsprung";
import { Zahlenleiste } from "../komponenten/bausteine/Zahlenleiste";
import { useDaten } from "../komponenten/bausteine/useDaten";
import { TourKnopf } from "../../tour/TourKnopf";
import { LernpfadKnopf } from "../komponenten/lernpfad/LernpfadKnopf";

/** Kapitel 0 bis 12 des Buches. */
const ANZAHL_KAPITEL = 13;

/** Alle Abbildungsnummern des Verzeichnisses. */
function alleNummern(index: Datenverzeichnis): string[] {
  return index.kapitel.flatMap((kapitel) => kapitel.abbildungen);
}

/**
 * Nummernfeld „Abbildung öffnen“ neben dem Titel (Gestaltung A2, 31.10.2026: kompakt, damit die
 * Kapitel in der oberen Bildschirmhälfte beginnen). Die Beschriftung hören Vorlesehilfen; sichtbar
 * steht „z. B. 1.26“ im Feld. Zahlenleiste und Fundmeldung erscheinen darunter über die ganze Breite
 * (das Formular ordnet sich mit display: contents in die Kopfzeile ein).
 */
function Nummernfeld({ index }: { index: Datenverzeichnis }) {
  const { navigiere } = useNavigation();
  const [eingabe, setzeEingabe] = useState("");
  const [leiste, setzeLeiste] = useState(false);
  const [fund, setzeFund] = useState<Fundergebnis | null>(null);
  const zuletzt = liesMerker("zuletzt");
  const oeffne = (nummer: string) => navigiere({ bildschirm: "abbildung", nummer });

  const absenden = (ereignis: FormEvent) => {
    ereignis.preventDefault();
    const ergebnis = findeAbbildung(eingabe, alleNummern(index));
    setzeFund(ergebnis);
    if (ergebnis.art === "gefunden") {
      oeffne(ergebnis.nummer);
    }
  };

  return (
    <form className="buchkopf-formular" onSubmit={absenden}>
      <div className="eingabezeile buchkopf-feld" data-tour="buch-nummer">
        <label htmlFor="abbildungsnummer" className="nur-vorlesen">
          {t("buch.abbildungOeffnen")}
        </label>
        <input
          id="abbildungsnummer"
          type="text"
          inputMode="none"
          autoComplete="off"
          placeholder={t("buch.platzhalter")}
          value={eingabe}
          onChange={(e) => setzeEingabe(e.target.value)}
          onFocus={() => setzeLeiste(true)}
        />
        <button type="submit" className="knopf-haupt">
          {t("buch.oeffnen")}
        </button>
      </div>
      {/* Zahlenleiste statt Handytastatur (Punkt A3 des Nebenchats), sobald das Feld aktiv ist. */}
      {leiste && <Zahlenleiste text={eingabe} setze={setzeEingabe} />}
      <Fundmeldung fund={fund} oeffne={oeffne} />
      {/* „Zuletzt“ erscheint nach einem Tipp ins Feld (Wunsch des Autors: nichts fällt weg). */}
      {leiste && zuletzt && (
        <button type="button" className="knopf-link links" onClick={() => oeffne(zuletzt)}>
          {t("buch.zuletzt")} <strong>{t("abbildung.titel", { nummer: zuletzt })}</strong>
        </button>
      )}
    </form>
  );
}

/** Angesehene Abbildungen eines Kapitels. */
function useGesehen(nummer: number, abbildungen: readonly string[]): Anteil {
  const gesehen = useSpeicher((zustand) => zustand.daten.fortschritt.gesehen);
  return kapitelfortschritt(
    { gesehen, uebungen: {}, trainer: {}, warum: {}, eingeschaetzt: {} },
    nummer,
    abbildungen,
    [],
  ).abbildungen;
}

/**
 * Kapitelnummer mit goldenem Rand für die angesehenen Abbildungen (DS27). Der kleine Ring neben
 * dem Text (seit 0.2.80 statt des Balkens, Wunsch des Autors vom 18.10.2026) ist an die Nummer
 * gewandert; so steht der Fortschritt aller Kapitel in einer Spalte untereinander.
 */
function Nummer({ nummer, abbildungen }: { nummer: number; abbildungen: readonly string[] }) {
  return <Kapitelnummer nummer={nummer} anteil={useGesehen(nummer, abbildungen)} />;
}

/** Zusatzzeile eines Kapitels: Anzahl der Abbildungen, nach dem ersten Ansehen wie viele gesehen. */
function Kapitelzusatz({
  nummer,
  abbildungen,
}: {
  nummer: number;
  abbildungen: readonly string[];
}) {
  const anteil = useGesehen(nummer, abbildungen);
  const text =
    anteil.erreicht > 0
      ? t("buch.abbildungenGesehen", { gesehen: anteil.erreicht, anzahl: anteil.gesamt })
      : t("buch.abbildungen", { anzahl: anteil.gesamt });
  return (
    <span className="kapitel-zusatz">
      <span>
        {t("buch.kapitel", { nummer })} · {text}
      </span>
    </span>
  );
}

/**
 * Die Kapitel des Buches; ein Tipp öffnet die Kapitelübersicht mit kleinen Brettern. Unter jedem
 * Kapitel steht, wie viele Abbildungen der Leser schon angesehen hat (AP 12).
 */
function Kapitelliste({ index }: { index: Datenverzeichnis }) {
  const { navigiere } = useNavigation();
  return (
    <section className="kapitelliste" data-tour="buch-kapitel">
      {index.kapitel.map((kapitel) => (
        <div key={kapitel.kapitel} className="kapitel">
          <button
            type="button"
            className="kapitel-kopf"
            onClick={() => navigiere({ bildschirm: "kapitel", nummer: kapitel.kapitel })}
          >
            <Nummer nummer={kapitel.kapitel} abbildungen={kapitel.abbildungen} />
            <span className="kapitel-text">
              <span className="kapitel-titel">{kapitel.titel}</span>
              <Kapitelzusatz nummer={kapitel.kapitel} abbildungen={kapitel.abbildungen} />
            </span>
          </button>
        </div>
      ))}
      {index.kapitel.length < ANZAHL_KAPITEL && (
        <p className="hinweis">{t("buch.weitereKapitel")}</p>
      )}
    </section>
  );
}

/**
 * Der Bildschirm „Buch“: Nummer einer Abbildung eintippen (etwa „1.26“) oder ein Kapitel mit seinen
 * Abbildungen öffnen.
 */
export function Buch() {
  const index = useDaten(ladeIndex, "index");
  return (
    <div className="bildschirm">
      <header className="seitenkopf buchkopf">
        <div className="buchkopf-oben">
          <p className="ueberzeile">{t("app.titel")}</p>
          {/* Gamifizierung P2: die Kapitel als Weg mit Etappen und Orden (Entscheidung E3). */}
          {index.art === "fertig" && <LernpfadKnopf ort="buch" />}
          <TourKnopf />
        </div>
        <div className="buchkopf-zeile">
          <h1>{t("buch.titel")}</h1>
          {index.art === "fertig" && <Nummernfeld index={index.wert} />}
        </div>
      </header>
      {index.art === "laedt" && <p className="lade">…</p>}
      {index.art === "fehler" && (
        <p className="fehlertext">{t("buch.ladefehler", { fehler: index.meldung })}</p>
      )}
      {index.art === "fertig" && (
        <>
          {/* Gamifizierung G4: Karten der Pakete („Heute“, Rückblick, Rivale), höchstens zwei. */}
          <Startkarten />
          <Kapitelliste index={index.wert} />
        </>
      )}
    </div>
  );
}
