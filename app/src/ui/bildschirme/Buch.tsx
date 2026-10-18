/**
 * Buch-Bildschirm: Nummernfeld „Abbildung öffnen“ und die Kapitel mit ihren Abbildungen.
 *
 * Rolle im Gesamtbild: Startseite des Bereichs Buch (Konzept 10.1, Bildschirmentwurf „Buch“).
 * Leser tippen die Nummer aus dem Buch ein, etwa „1.26“, oder öffnen ein Kapitel (Kapitelübersicht).
 * Abhängigkeiten: daten/laden.ts, daten/finde.ts, speicher (Fortschritt), Navigation, i18n.
 */
import { useState, type FormEvent } from "react";
import { liesMerker } from "../../app/merker";
import { useNavigation } from "../../app/navigationsKontext";
import { findeAbbildung, type Fundergebnis } from "../../daten/finde";
import { ladeIndex, type Datenverzeichnis } from "../../daten/laden";
import { t } from "../../i18n/sprache";
import { kapitelfortschritt } from "../../speicher/fortschritt";
import { useSpeicher } from "../../speicher/speicher";
import { Ring } from "../komponenten/Kreisanzeige";
import { Fundmeldung } from "../komponenten/Nummernsprung";
import { useDaten } from "../komponenten/useDaten";

/** Kapitel 0 bis 12 des Buches. */
const ANZAHL_KAPITEL = 13;

/** Alle Abbildungsnummern des Verzeichnisses. */
function alleNummern(index: Datenverzeichnis): string[] {
  return index.kapitel.flatMap((kapitel) => kapitel.abbildungen);
}

function Nummernfeld({ index }: { index: Datenverzeichnis }) {
  const { navigiere } = useNavigation();
  const [eingabe, setzeEingabe] = useState("");
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
    <form className="karte" onSubmit={absenden}>
      <label htmlFor="abbildungsnummer" className="karte-titel">
        {t("buch.abbildungOeffnen")}
      </label>
      <div className="eingabezeile">
        <input
          id="abbildungsnummer"
          type="text"
          inputMode="decimal"
          autoComplete="off"
          placeholder={t("buch.platzhalter")}
          value={eingabe}
          onChange={(e) => setzeEingabe(e.target.value)}
        />
        <button type="submit" className="knopf-haupt">
          {t("buch.oeffnen")}
        </button>
      </div>
      <Fundmeldung fund={fund} oeffne={oeffne} />
      {zuletzt && (
        <button type="button" className="knopf-link links" onClick={() => oeffne(zuletzt)}>
          {t("buch.zuletzt")} <strong>Abb. {zuletzt}</strong>
        </button>
      )}
    </form>
  );
}

/**
 * Zusatzzeile eines Kapitels: Anzahl der Abbildungen, nach dem ersten Ansehen mit kleinem Ring
 * (seit 0.2.80 statt des Balkens, Wunsch des Autors vom 18.10.2026).
 */
function Kapitelzusatz({
  nummer,
  abbildungen,
}: {
  nummer: number;
  abbildungen: readonly string[];
}) {
  const gesehen = useSpeicher((zustand) => zustand.daten.fortschritt.gesehen);
  const anteil = kapitelfortschritt(
    { gesehen, uebungen: {}, trainer: {} },
    nummer,
    abbildungen,
    [],
  ).abbildungen;
  const text =
    anteil.erreicht > 0
      ? t("buch.abbildungenGesehen", { gesehen: anteil.erreicht, anzahl: anteil.gesamt })
      : t("buch.abbildungen", { anzahl: anteil.gesamt });
  return (
    <span className="kapitel-zusatz">
      {anteil.erreicht > 0 && <Ring anteil={anteil} beschriftung={text} klein />}
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
    <section className="kapitelliste">
      {index.kapitel.map((kapitel) => (
        <div key={kapitel.kapitel} className="kapitel">
          <button
            type="button"
            className="kapitel-kopf"
            onClick={() => navigiere({ bildschirm: "kapitel", nummer: kapitel.kapitel })}
          >
            <span className="kapitel-nummer" aria-hidden="true">
              {kapitel.kapitel}
            </span>
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

export function Buch() {
  const index = useDaten(ladeIndex, "index");
  return (
    <div className="bildschirm">
      <header className="seitenkopf">
        <p className="ueberzeile">{t("app.titel")}</p>
        <h1>{t("buch.titel")}</h1>
      </header>
      {index.art === "laedt" && <p className="lade">…</p>}
      {index.art === "fehler" && (
        <p className="fehlertext">{t("buch.ladefehler", { fehler: index.meldung })}</p>
      )}
      {index.art === "fertig" && (
        <>
          <Nummernfeld index={index.wert} />
          <Kapitelliste index={index.wert} />
        </>
      )}
    </div>
  );
}
