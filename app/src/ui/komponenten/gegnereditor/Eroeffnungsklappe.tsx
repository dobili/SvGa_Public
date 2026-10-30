/**
 * Klappe „Eröffnungen“ im Gegnereditor: feste Eröffnungen eines eigenen Bots mit Mehrfachauswahl
 * und der Regler „Abweichung“.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (Ideensammlung, freigegeben 30.10.2026, Paket 9). Wählbar
 * sind die Eröffnungen des Buches (Haken) und die „Eröffnungen nach Spielstärke“ derselben Klappe
 * wie im Spielfenster (Staerkewahl.tsx), hier mit Haken statt Einzelwahl und mit Schnellwahl im
 * Variantenbaum (die häufigsten 3, 5 oder alle). Oben stehen die gewählten zum Entfernen. Je Partie
 * wählt der Bot zufällig eine davon (spiel/boteroeffnung.ts). Eine Klappe statt eines fünften
 * Reiters, weil die Eröffnungen die Stärke nicht verändern (die Reiter teilt sich der Editor mit
 * der eigenen Stufe, die keine festen Eröffnungen hat).
 * Abhängigkeiten: spiel/boteroeffnung.ts, Staerkewahl, useEroeffnungsindex, i18n.
 */
import type { EigenerGegner } from "../../../engine/gegner";
import { t } from "../../../i18n/sprache";
import { eroeffnungsnamen } from "../../../schach/eroeffnungsindex";
import {
  ABWEICHUNG_MAX,
  ABWEICHUNG_MIN,
  ABWEICHUNG_SCHRITT,
  ABWEICHUNG_VORGABE,
  mitSchnellwahl,
  umgeschaltet,
} from "../../../spiel/boteroeffnung";
import { useEroeffnungsindex } from "../bausteine/useEroeffnungsindex";
import { Staerkewahl } from "../spielstart/Staerkewahl";

/** Kapitel 2: ab dort gibt es den Eröffnungsindex des Buches. */
const KAPITEL_MIT_EROEFFNUNGEN = 2;

/** Die gewählten Eröffnungen mit Knopf zum Entfernen. */
function Gewaehlte({
  liste,
  namen,
  setze,
}: {
  liste: readonly string[];
  namen: (wert: string) => string;
  setze: (liste: readonly string[]) => void;
}) {
  if (liste.length === 0) return <p className="hinweis">{t("spielen.boteroeffnung.keine")}</p>;
  return (
    <div className="boteroeffnungen-gewaehlt">
      <h5>{t("spielen.boteroeffnung.gewaehlt")}</h5>
      <ul className="boteroeffnungen-marken" data-testid="boteroeffnungen-gewaehlt">
        {liste.map((wert) => (
          <li key={wert}>
            <button
              type="button"
              className="boteroeffnung-marke"
              aria-label={t("spielen.boteroeffnung.entfernen", { name: namen(wert) })}
              onClick={() => setze(umgeschaltet(liste, wert))}
            >
              {namen(wert)} ✕
            </button>
          </li>
        ))}
      </ul>
      <button type="button" className="knopf-zweit" onClick={() => setze([])}>
        {t("spielen.boteroeffnung.alleEntfernen")}
      </button>
    </div>
  );
}

/** Die Eröffnungen des Buches als Haken. */
function Buchliste({
  liste,
  setze,
}: {
  liste: readonly string[];
  setze: (liste: readonly string[]) => void;
}) {
  const index = useEroeffnungsindex(KAPITEL_MIT_EROEFFNUNGEN);
  if (!index) return null;
  return (
    <details className="unterabschnitt" data-testid="boteroeffnungen-buch">
      <summary>{t("spielen.boteroeffnung.ausDemBuch")}</summary>
      {eroeffnungsnamen(index).map((name) => (
        <label key={name} className="schalterzeile">
          <input
            type="checkbox"
            checked={liste.includes(name)}
            onChange={() => setze(umgeschaltet(liste, name))}
          />
          {name}
        </label>
      ))}
    </details>
  );
}

/** Regler „Abweichung“ von 0 bis 100 %. */
function Abweichung({ wert, beiWahl }: { wert: number; beiWahl: (wert: number) => void }) {
  return (
    <div className="boteroeffnungen-abweichung">
      <label className="einstellung-name" htmlFor="bot-abweichung">
        {t("spielen.boteroeffnung.abweichung", { prozent: String(wert) })}
      </label>
      <input
        id="bot-abweichung"
        type="range"
        min={ABWEICHUNG_MIN}
        max={ABWEICHUNG_MAX}
        step={ABWEICHUNG_SCHRITT}
        value={wert}
        onChange={(e) => beiWahl(Number(e.target.value))}
      />
      <p className="hinweis">{t("spielen.boteroeffnung.abweichungHinweis")}</p>
    </div>
  );
}

/**
 * Die Klappe „Eröffnungen (n)“ für den Gegner `g`; `setze` übernimmt die Änderung ins Formular
 * (gespeichert wird erst mit „Gegner speichern“). `namen` macht aus einem Wert den Namen.
 */
export function Eroeffnungsklappe({
  g,
  setze,
  namen,
}: {
  g: EigenerGegner;
  setze: (g: EigenerGegner) => void;
  namen: (wert: string) => string;
}) {
  const liste = g.eroeffnungen ?? [];
  const setzeListe = (eroeffnungen: readonly string[]) => setze({ ...g, eroeffnungen });
  return (
    <details className="unterabschnitt boteroeffnungen" data-testid="bot-eroeffnungen">
      <summary>{t("spielen.boteroeffnung.titel", { anzahl: String(liste.length) })}</summary>
      <p className="hinweis">{t("spielen.boteroeffnung.erklaerung")}</p>
      <Gewaehlte liste={liste} namen={namen} setze={setzeListe} />
      {liste.length > 0 && (
        <Abweichung
          wert={g.abweichung ?? ABWEICHUNG_VORGABE}
          beiWahl={(abweichung) => setze({ ...g, abweichung })}
        />
      )}
      <Buchliste liste={liste} setze={setzeListe} />
      <Staerkewahl
        praefix="bot-staerke"
        wahl={{
          ist: (wert) => liste.includes(wert),
          beiWahl: (wert) => setzeListe(umgeschaltet(liste, wert)),
          beiSchnellwahl: (familie, anzahl) => setzeListe(mitSchnellwahl(liste, familie, anzahl)),
        }}
      />
    </details>
  );
}
