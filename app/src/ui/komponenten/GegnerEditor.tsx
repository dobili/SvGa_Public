/**
 * Eigene Gegner anlegen, ändern und löschen (Wunsch des Autors, 17.10.2026, Version 0.2.42).
 *
 * Rolle im Gesamtbild: Karte auf dem Spielen-Bildschirm unter der Gegnerwahl. Ein eigener Gegner
 * hat Name, Stufen je Phase (StufenWahl.tsx), erlaubte Fehlerarten (Haken; wirksam in Stufe 1
 * bis 4, ohne Haken nie ein absichtlicher Fehler) und einen Stil von sehr defensiv bis sehr
 * aggressiv (engine/stil.ts). Gespeichert wird im Spielstand (speicher/gegner.ts); gelöschte
 * Gegner bleiben in alten Partien mit ihrem Namen.
 * Abhängigkeiten: engine/gegner.ts, engine/fehlerart.ts, engine/stil.ts, speicher/, StufenWahl, i18n.
 */
import { useState } from "react";
import { FEHLERARTEN, type Fehlerart } from "../../engine/fehlerart";
import { neueGegnerkennung, type EigenerGegner } from "../../engine/gegner";
import { STIL_MAX, STIL_MIN, STIL_NEUTRAL } from "../../engine/stil";
import type { Stufennummer } from "../../engine/stufen";
import { t, type Textschluessel } from "../../i18n/sprache";
import type { Phase } from "../../spiel/phasen";
import { MAX_NAMENSLAENGE, mitEigenemGegner, ohneEigenenGegner } from "../../speicher/gegner";
import { mitEigenenGegnern } from "../../speicher/partien";
import { aendere, useSpeicher } from "../../speicher/speicher";
import { StufenWahl } from "./StufenWahl";

const STILNAMEN: Readonly<Record<string, Textschluessel>> = {
  "-2": "spielen.stil.sehrDefensiv",
  "-1": "spielen.stil.defensiv",
  "0": "spielen.stil.ausgeglichen",
  "1": "spielen.stil.aggressiv",
  "2": "spielen.stil.sehrAggressiv",
};

/** Ein neuer Gegner mit Vorgaben: Stufe 3 überall, alle Fehlerarten, ausgeglichen. */
function neuerGegner(): EigenerGegner {
  const STUFE: Stufennummer = 3;
  return {
    kennung: neueGegnerkennung(),
    name: "",
    stufenJePhase: { eroeffnung: STUFE, mittelspiel: STUFE, endspiel: STUFE },
    fehlerarten: FEHLERARTEN,
    stil: STIL_NEUTRAL,
  };
}

/** „3 · 4 · 3 · aggressiv“ */
function kurzbeschreibung(g: EigenerGegner): string {
  const s = g.stufenJePhase;
  return `${s.eroeffnung} · ${s.mittelspiel} · ${s.endspiel} · ${t(STILNAMEN[String(g.stil)] ?? "spielen.stil.ausgeglichen")}`;
}

/** Das Formular für einen Gegner. */
function Formular({
  start,
  beiSpeichern,
  beiAbbrechen,
}: {
  start: EigenerGegner;
  beiSpeichern: (g: EigenerGegner) => void;
  beiAbbrechen: () => void;
}) {
  const [g, setze] = useState(start);
  const name = g.name.trim();
  const schalteArt = (art: Fehlerart, an: boolean) =>
    setze({
      ...g,
      fehlerarten: an
        ? FEHLERARTEN.filter((a) => a === art || g.fehlerarten.includes(a))
        : g.fehlerarten.filter((a) => a !== art),
    });
  return (
    <div className="gegnerformular" data-testid="gegnerformular">
      <label className="einstellung-name" htmlFor="gegner-name">
        {t("spielen.eigene.name")}
      </label>
      <input
        id="gegner-name"
        className="suchfeld"
        value={g.name}
        maxLength={MAX_NAMENSLAENGE}
        onChange={(e) => setze({ ...g, name: e.target.value })}
      />
      <StufenWahl
        stufen={g.stufenJePhase}
        praefix="eigen"
        beiWahl={(stufenJePhase: Readonly<Record<Phase, Stufennummer>>) =>
          setze({ ...g, stufenJePhase })
        }
      />
      <div className="stufenregler">
        <label htmlFor="gegner-stil">
          {t("spielen.stil")}:{" "}
          <strong>{t(STILNAMEN[String(g.stil)] ?? "spielen.stil.ausgeglichen")}</strong>
        </label>
        <input
          id="gegner-stil"
          type="range"
          min={STIL_MIN}
          max={STIL_MAX}
          step={1}
          value={g.stil}
          onChange={(e) => setze({ ...g, stil: Number(e.target.value) })}
        />
        <p className="hinweis">{t("spielen.stilHinweis")}</p>
      </div>
      <fieldset className="fehlerartenwahl">
        <legend className="einstellung-name">{t("spielen.eigene.fehlerarten")}</legend>
        <p className="hinweis">{t("spielen.eigene.fehlerartenHinweis")}</p>
        {FEHLERARTEN.map((art) => (
          <label key={art} className="schalterzeile">
            <input
              type="checkbox"
              checked={g.fehlerarten.includes(art)}
              onChange={(e) => schalteArt(art, e.target.checked)}
            />
            {t(`fehlerart.${art}`)}
          </label>
        ))}
      </fieldset>
      <div className="knopfreihe">
        <button
          type="button"
          className="knopf-haupt"
          disabled={name.length === 0}
          onClick={() => beiSpeichern({ ...g, name })}
        >
          {t("spielen.eigene.speichern")}
        </button>
        <button type="button" className="knopf-zweit" onClick={beiAbbrechen}>
          {t("spielen.editor.abbrechen")}
        </button>
      </div>
    </div>
  );
}

/** Eine Zeile der Liste mit Bearbeiten und Löschen (mit Nachfrage). */
function Zeile({
  g,
  beiBearbeiten,
  beiLoeschen,
}: {
  g: EigenerGegner;
  beiBearbeiten: () => void;
  beiLoeschen: () => void;
}) {
  const [nachfrage, setzeNachfrage] = useState(false);
  return (
    <li className="gegnerzeile">
      <span>
        <strong>{g.name}</strong> · {kurzbeschreibung(g)}
      </span>
      {nachfrage ? (
        <span className="knopfreihe">
          <button type="button" className="knopf-gefahr" onClick={beiLoeschen}>
            {t("spielen.eigene.loeschenJa")}
          </button>
          <button type="button" className="knopf-zweit" onClick={() => setzeNachfrage(false)}>
            {t("loeschen.nein")}
          </button>
        </span>
      ) : (
        <span className="knopfreihe">
          <button type="button" className="knopf-zweit" onClick={beiBearbeiten}>
            {t("spielen.eigene.bearbeiten")}
          </button>
          <button
            type="button"
            className="knopf-zweit"
            aria-label={t("spielen.eigene.loeschenVon", { name: g.name })}
            onClick={() => setzeNachfrage(true)}
          >
            {t("spielen.eigene.loeschen")}
          </button>
        </span>
      )}
    </li>
  );
}

/** Die Karte „Eigene Gegner“: Liste, neuer Gegner, Formular. */
export function GegnerEditor() {
  const eigene = useSpeicher((z) => z.daten.spiel.eigeneGegner);
  const [offen, setzeOffen] = useState<EigenerGegner | null>(null);
  const schreibe = (liste: readonly EigenerGegner[]) =>
    void aendere((d) => ({ ...d, spiel: mitEigenenGegnern(d.spiel, liste) }));
  return (
    <section className="karte eigene-gegner" data-testid="eigene-gegner">
      <h2 className="karte-titel">{t("spielen.eigene.titel")}</h2>
      {eigene.length === 0 && !offen && <p className="hinweis">{t("spielen.eigene.leer")}</p>}
      {eigene.length > 0 && (
        <ul className="gegnerliste">
          {eigene.map((g) => (
            <Zeile
              key={g.kennung}
              g={g}
              beiBearbeiten={() => setzeOffen(g)}
              beiLoeschen={() => schreibe(ohneEigenenGegner(eigene, g.kennung))}
            />
          ))}
        </ul>
      )}
      {offen ? (
        <Formular
          key={offen.kennung}
          start={offen}
          beiSpeichern={(g) => {
            schreibe(mitEigenemGegner(eigene, g));
            setzeOffen(null);
          }}
          beiAbbrechen={() => setzeOffen(null)}
        />
      ) : (
        <button type="button" className="knopf-zweit" onClick={() => setzeOffen(neuerGegner())}>
          {t("spielen.eigene.neu")}
        </button>
      )}
    </section>
  );
}
