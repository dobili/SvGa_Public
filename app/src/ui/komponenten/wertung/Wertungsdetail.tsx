/**
 * Der Teil der Karte „Deine Wertung“ unter den Kacheln (Profil neu, 31.10.2026): Kurve der
 * gewählten Zeitklasse im Maßstab der Zahl, „vorläufig · 3 von 10“, bei einer Schätzung ein
 * erklärender Satz, und der aufklappbare Bereich „Mehr“ mit Ausschnitt, Erklärung und „Wertung
 * zurücksetzen“.
 *
 * Rolle im Gesamtbild: Eigene Datei, damit Wertungskarte.tsx klein bleibt. Die Kurve zeichnet
 * fortschritt/Wertungskurvenbild.tsx; die Punkte kommen schon umgerechnet (kurveImMassstab), damit
 * Kurve und Zahl denselben Maßstab haben (Wunsch des Autors).
 * Abhängigkeiten: wertungskacheln.ts, fortschritt/Wertungskurvenbild.tsx,
 * fortschritt/wertungsmassstab.ts, fortschritt/wertungstext.ts, spiel/wertung.ts,
 * speicher/partien.ts (Zurücksetzen), Speicher, i18n.
 */
import { useState } from "react";
import { t } from "../../../i18n/sprache";
import { setzeWertungZurueck } from "../../../speicher/partien";
import { aendere } from "../../../speicher/speicher";
import {
  ANFANGSPARTIEN,
  imBereich,
  verlaufDerZeitklasse,
  type Wertungspunkt,
} from "../../../spiel/wertung";
import { Kurve } from "../fortschritt/Wertungskurvenbild";
import {
  ausserhalbText,
  zahlImMassstab,
  type Wertungsmassstab,
} from "../fortschritt/wertungsmassstab";
import { zeitklassenname } from "../fortschritt/wertungstext";
import { AUSSCHNITTE } from "./ausschnitte";
import { kurveImMassstab, type Wertungskachel } from "./wertungskacheln";

/** „+24“, „−12“ oder „±0“. */
function vorzeichen(wert: number): string {
  if (wert > 0) return `+${wert}`;
  if (wert < 0) return `−${-wert}`;
  return "±0";
}

/** Knopf „Wertung zurücksetzen“ mit Nachfrage. */
function Zuruecksetzen() {
  const [nachfrage, setzeNachfrage] = useState(false);
  const zuruecksetzen = () => {
    void aendere((d) => ({ ...d, spiel: setzeWertungZurueck(d.spiel) }));
    setzeNachfrage(false);
  };
  if (!nachfrage) {
    return (
      <button type="button" className="knopf-zweit" onClick={() => setzeNachfrage(true)}>
        {t("ich.wertung.zuruecksetzen")}
      </button>
    );
  }
  return (
    <div className="nachfrage">
      <p>{t("ich.wertung.zuruecksetzenFrage")}</p>
      <div className="knopfreihe">
        <button type="button" className="knopf-gefahr" onClick={zuruecksetzen}>
          {t("ich.wertung.zuruecksetzenJa")}
        </button>
        <button type="button" className="knopf-zweit" onClick={() => setzeNachfrage(false)}>
          {t("loeschen.nein")}
        </button>
      </div>
    </div>
  );
}

/** „Mehr“: Ausschnitt der Kurve (gilt auch für die Phasen), Erklärungen, Zurücksetzen. */
function Mehr({
  kennung,
  beiWahl,
  vorlaeufig,
}: {
  kennung: string;
  beiWahl: (kennung: string) => void;
  /** In den ersten zehn Partien ihre Zahl, sonst null. */
  vorlaeufig: number | null;
}) {
  return (
    <details className="anleitung wertung-mehr" data-testid="wertung-mehr">
      <summary>{t("profil.wertung.mehr")}</summary>
      <label className="einstellung-name" htmlFor="wertung-bereich">
        {t("ich.wertung.bereich")}
      </label>
      <select
        id="wertung-bereich"
        className="auswahlfeld"
        value={kennung}
        onChange={(e) => beiWahl(e.target.value)}
      >
        {AUSSCHNITTE.map((a) => (
          <option key={a.kennung} value={a.kennung}>
            {t(a.text)}
          </option>
        ))}
      </select>
      <p className="hinweis">{t("ich.wertung.kurz")}</p>
      {/* Zurückgeholt (31.10.2026): was „vorläufig“ heißt und wie der Maßstab rechnet. */}
      {vorlaeufig !== null && (
        <p className="hinweis">{t("profil.wertung.vorlaeufigSatz", { anzahl: vorlaeufig })}</p>
      )}
      <p className="hinweis">{t("ich.wertung.erklaerung")}</p>
      <p className="hinweis">{t("wertung.massstab.erklaerung")}</p>
      <Zuruecksetzen />
    </details>
  );
}

/** Kopfzeile über der Kurve: Zeitklasse und, in den ersten zehn Partien, „vorläufig · 3 von 10“. */
function Kurvenkopf({ kachel }: { kachel: Wertungskachel }) {
  return (
    <div className="wertung-kurvenkopf">
      <h3>{zeitklassenname(kachel.tempo)}</h3>
      {kachel.vorlaeufig && (
        <span className="wertung-plakette" data-testid="wertung-vorlaeufig">
          {t("profil.wertung.vorlaeufig", { anzahl: kachel.partien, gesamt: ANFANGSPARTIEN })}
        </span>
      )}
    </div>
  );
}

/** Unter der Kurve: Bereich der Umrechnung (nur umgerechnet) und die Veränderung im Ausschnitt. */
function Unterzeile({
  kachel,
  sichtbar,
  massstab,
}: {
  kachel: Wertungskachel;
  sichtbar: readonly Wertungspunkt[];
  massstab: Wertungsmassstab;
}) {
  const zahl = kachel.wert === null ? null : zahlImMassstab(kachel.tempo, kachel.wert, massstab);
  const erste = sichtbar[0];
  const letzte = sichtbar.at(-1);
  return (
    <>
      {zahl?.liste && !zahl.ausserhalb && (
        <p className="hinweis" data-testid="wertung-bereich">
          {t("profil.wertung.bereichZeile", { bereich: zahl.zahl, liste: zahl.liste })}
        </p>
      )}
      {erste && letzte && sichtbar.length > 1 && (
        <p className="hinweis">
          {t("profil.wertung.aenderung", { aenderung: vorzeichen(letzte.wertung - erste.wertung) })}
        </p>
      )}
    </>
  );
}

/**
 * Der Teil unter den Kacheln. Bei einer Schätzung nur der Satz dazu; sonst Kurve, Unterzeile und
 * „Mehr“. Beispiel: Klassisch ohne Partie → „Noch keine gewertete Partie in Klassisch …“.
 */
export function Wertungsdetail({
  kachel,
  punkte,
  massstab,
  jetzt,
  ausschnitt: kennung,
  beiAusschnitt,
}: {
  kachel: Wertungskachel;
  punkte: readonly Wertungspunkt[];
  massstab: Wertungsmassstab;
  jetzt: Date;
  /** Kennung des Ausschnitts (ausschnitte.ts); die Karte hält sie, weil auch die Phasen ihn nutzen. */
  ausschnitt: string;
  beiAusschnitt: (kennung: string) => void;
}) {
  if (kachel.geschaetzt) {
    return (
      <p className="wertung-schaetzung" data-testid="wertung-schaetzung">
        {t("profil.wertung.schaetzung", { zeitklasse: zeitklassenname(kachel.tempo) })}
      </p>
    );
  }
  const ausschnitt = AUSSCHNITTE.find((a) => a.kennung === kennung) ?? AUSSCHNITTE[0];
  const kette = verlaufDerZeitklasse(punkte, kachel.tempo);
  const sichtbar = ausschnitt ? imBereich(kette, ausschnitt.bereich, jetzt) : kette;
  const kurve = kurveImMassstab(sichtbar, kachel.tempo, massstab);
  return (
    <div className="wertung-detail">
      <Kurvenkopf kachel={kachel} />
      {kurve.length > 0 && ausschnitt ? (
        <Kurve punkte={kurve} bereich={ausschnitt.bereich} jetzt={jetzt} />
      ) : (
        <p className="hinweis" data-testid="massstab-ausserhalb">
          {kachel.wert !== null &&
          massstab !== "lichess" &&
          kurve.length === 0 &&
          sichtbar.length > 0
            ? ausserhalbText(kachel.tempo, kachel.wert, massstab)
            : t("ich.wertung.keineImBereich")}
        </p>
      )}
      <Unterzeile kachel={kachel} sichtbar={kurve} massstab={massstab} />
      <Mehr
        kennung={kennung}
        beiWahl={beiAusschnitt}
        vorlaeufig={kachel.vorlaeufig ? kachel.partien : null}
      />
    </div>
  );
}
