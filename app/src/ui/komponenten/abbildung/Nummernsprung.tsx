/**
 * Sprung zu einer anderen Abbildung von der Kopfzeile aus: Der Titel „Abb. 7.12“ ist ein Knopf,
 * ein Tipp darauf öffnet ein Nummernfeld, wie es auch der Buch-Bildschirm hat.
 *
 * Rolle im Gesamtbild: Idee des Autors („Wenn man auf die Nummer klickt, kann man eine andere
 * Nummer eingeben“). Das Verstehen der Eingabe und die Vorschläge bei einem Tippfehler kommen aus
 * daten/finde.ts, die Nummern aus dem Datenverzeichnis (index.json).
 * Abhängigkeiten: daten/finde.ts, daten/laden.ts, Navigation, i18n.
 */
import { useState, type FormEvent } from "react";
import { useNavigation } from "../../../app/navigationsKontext";
import { findeAbbildung, type Fundergebnis } from "../../../daten/finde";
import { ladeIndex } from "../../../daten/laden";
import { t } from "../../../i18n/sprache";

/** Alle Abbildungsnummern des Buches in Buchreihenfolge. */
async function alleNummern(): Promise<string[]> {
  const index = await ladeIndex();
  return index.kapitel.flatMap((kapitel) => kapitel.abbildungen);
}

/** Meldung zu einer Eingabe: ungültig, nicht gefunden (mit Vorschlägen) oder nichts. */
export function Fundmeldung({
  fund,
  oeffne,
}: {
  fund: Fundergebnis | null;
  oeffne: (nummer: string) => void;
}) {
  if (!fund || fund.art === "gefunden") return null;
  if (fund.art === "ungueltig") {
    return (
      <p className="fehlertext" role="alert">
        {t("buch.ungueltig")}
      </p>
    );
  }
  return (
    <div role="alert">
      <p className="fehlertext">{t("buch.nichtGefunden", { eingabe: fund.nummer })}</p>
      {fund.vorschlaege.length > 0 && (
        <p className="vorschlaege">
          {t("buch.vorschlaege")}{" "}
          {fund.vorschlaege.map((nummer) => (
            <button key={nummer} type="button" className="chip" onClick={() => oeffne(nummer)}>
              {nummer}
            </button>
          ))}
        </p>
      )}
    </div>
  );
}

/** Der Titel der Abbildung als Knopf, der das Nummernfeld öffnet oder schließt. */
export function Nummerntitel({
  nummer,
  offen,
  beiTipp,
}: {
  nummer: string;
  offen: boolean;
  beiTipp: () => void;
}) {
  return (
    <button
      type="button"
      className="knopf-titel"
      data-tour="abbildung-nummer"
      aria-expanded={offen}
      aria-label={t("abbildung.andereNummer", { nummer })}
      onClick={beiTipp}
    >
      {t("abbildung.titel", { nummer })}
    </button>
  );
}

/**
 * Das Nummernfeld unter der Kopfzeile. Eine gefundene Nummer ersetzt die Abbildung im Stapel
 * (wie das Blättern), damit „Zurück“ weiter zum Kapitel führt.
 * Beispiel: In Abb. 7.12 „8.3“ eintippen → Abb. 8.3 öffnet sich. „8.99“ → „nicht gefunden“
 * mit Vorschlägen wie 8.59.
 */
export function Nummernfeld({ beiSchliessen }: { beiSchliessen: () => void }) {
  const { ersetze } = useNavigation();
  const [eingabe, setzeEingabe] = useState("");
  const [fund, setzeFund] = useState<Fundergebnis | null>(null);
  const oeffne = (nummer: string) => {
    beiSchliessen();
    ersetze({ bildschirm: "abbildung", nummer });
  };
  const absenden = (ereignis: FormEvent) => {
    ereignis.preventDefault();
    alleNummern()
      .then((nummern) => {
        const ergebnis = findeAbbildung(eingabe, nummern);
        setzeFund(ergebnis);
        if (ergebnis.art === "gefunden") oeffne(ergebnis.nummer);
      })
      .catch((fehler: unknown) => {
        console.error("Datenverzeichnis nicht ladbar:", fehler);
        setzeFund({ art: "ungueltig" });
      });
  };
  return (
    <form className="karte nummernsprung" onSubmit={absenden} data-testid="nummernsprung">
      <label htmlFor="sprungnummer" className="karte-titel">
        {t("buch.abbildungOeffnen")}
      </label>
      <div className="eingabezeile">
        <input
          id="sprungnummer"
          type="text"
          inputMode="decimal"
          autoComplete="off"
          // Das Feld erscheint auf Wunsch des Lesers; der Fokus spart ihm den zweiten Tipp.
          autoFocus
          placeholder={t("buch.platzhalter")}
          value={eingabe}
          onChange={(e) => setzeEingabe(e.target.value)}
        />
        <button type="submit" className="knopf-haupt">
          {t("buch.oeffnen")}
        </button>
        <button type="button" className="knopf-zweit" onClick={beiSchliessen}>
          {t("abbildung.sprungSchliessen")}
        </button>
      </div>
      <Fundmeldung fund={fund} oeffne={oeffne} />
    </form>
  );
}
