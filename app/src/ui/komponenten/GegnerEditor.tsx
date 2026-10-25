/**
 * Eigene Gegner anlegen, ändern und löschen (Wunsch des Autors, 17.10.2026, Version 0.2.42).
 *
 * Rolle im Gesamtbild: Teil der Kategorie „Eigene Bots“ in der Gegnerwahl (seit 0.2.80; vorher
 * eine Karte unter der Gegnerwahl). Ein eigener Gegner
 * hat Name, Stufen je Phase (StufenWahl.tsx), erlaubte Fehlerarten (Haken; wirksam in Stufe 1
 * bis 4, ohne Haken nie ein absichtlicher Fehler) und einen Stil, seit 0.2.126 einen der sieben
 * Stile der vorgefertigten Bots im Spinnennetz (Stilnetz.tsx, Teil E; vorher ein Regler von sehr
 * defensiv bis sehr aggressiv, engine/stil.ts, der für ältere Gegner bis zum nächsten Speichern
 * gilt); seit 0.2.117 dazu der erweiterte Modus (ErweiterteFehler.tsx: Fehlerhäufigkeit, Stufe je
 * Art auf den Quantilen der Menschen, Höchstverlust); seit 0.2.129 (DS38, DS39) in vier Reitern
 * (GegnerReiter.tsx) mit einem Stufenschalter je Fehlerart. Gespeichert wird im Spielstand
 * (speicher/gegner.ts); gelöschte
 * Gegner bleiben in alten Partien mit ihrem Namen.
 * Abhängigkeiten: engine/gegner.ts, engine/fehlerart.ts, engine/stil.ts, speicher/, StufenWahl, i18n.
 */
import { useState } from "react";
import { FEHLERARTEN } from "../../engine/fehlerart";
import { neueGegnerkennung, type EigenerGegner } from "../../engine/gegner";
import { STIL_NEUTRAL } from "../../engine/stil";
import { hauptstil, mixAusStil, type Stilmix } from "../../engine/stile";
import { stilkurz } from "./stiltext";
import type { Stufennummer } from "../../engine/stufen";
import { t, type Textschluessel } from "../../i18n/sprache";
import type { Phase } from "../../spiel/phasen";
import { MAX_NAMENSLAENGE, mitEigenemGegner, ohneEigenenGegner } from "../../speicher/gegner";
import { mitEigenenGegnern } from "../../speicher/partien";
import { aendere, useSpeicher } from "../../speicher/speicher";
import { neutralisiert } from "./fehlergruppen";
import { GegnerReiter } from "./GegnerReiter";
import { GegnerBild } from "./GegnerBild";
import { bildVon, mitBild } from "../profil/gegnerbildwahl";
import { Portraetwahl } from "../profil/Portraetwahl";
import { usePortraetwahl, type Portraetwahlzustand } from "../profil/portraetwahlZustand";
import { Stilnetz } from "./Stilnetz";
import { StufenWahl } from "./StufenWahl";
import { Knopfsymbol } from "./Knopfsymbol";

const STILNAMEN: Readonly<Record<string, Textschluessel>> = {
  "-2": "spielen.stil.sehrDefensiv",
  "-1": "spielen.stil.defensiv",
  "0": "spielen.stil.ausgeglichen",
  "1": "spielen.stil.aggressiv",
  "2": "spielen.stil.sehrAggressiv",
};

/**
 * Die Stil-Mischung im Spinnennetz: die gespeicherte, sonst aus dem gewählten Stil oder dem alten
 * Regler (aggressiv → Angreifer, defensiv → Verteidiger, ausgeglichen → Universell). Gespeichert
 * wird sie erst beim Speichern.
 */
function stilDes(g: EigenerGegner): Stilmix {
  if (g.stilmix) return g.stilmix;
  if (g.stilname) return mixAusStil(g.stilname);
  if (g.stil > STIL_NEUTRAL) return mixAusStil("angreifer");
  return mixAusStil(g.stil < STIL_NEUTRAL ? "verteidiger" : "universell");
}

/** Ein neuer Gegner mit Vorgaben: Stufe 3 überall, alle Fehlerarten, ausgeglichen. */
function neuerGegner(): EigenerGegner {
  const STUFE: Stufennummer = 3;
  return {
    kennung: neueGegnerkennung(),
    name: "",
    stufenJePhase: { eroeffnung: STUFE, mittelspiel: STUFE, endspiel: STUFE },
    fehlerarten: FEHLERARTEN,
    stil: STIL_NEUTRAL,
    stilname: "universell",
    blindeFlecken: [],
  };
}

/** „3 · 4 · 3 · Angreifer“ (ältere Gegner ohne gewählten Stil: „3 · 4 · 3 · aggressiv“) */
function kurzbeschreibung(g: EigenerGegner): string {
  const s = g.stufenJePhase;
  // Seit 0.2.128 die Stil-Mischung („Angreifer + Taktiker 50 %“), ältere Gegner den Regler
  const stil =
    g.stilmix || g.stilname
      ? stilkurz(g.stilmix ?? mixAusStil(g.stilname))
      : t(STILNAMEN[String(g.stil)] ?? "spielen.stil.ausgeglichen");
  return `${s.eroeffnung} · ${s.mittelspiel} · ${s.endspiel} · ${stil}`;
}

/**
 * Porträt des Bots in einer Klappe (seit 0.2.140 dieselbe Porträtwahl wie im Profil, mit
 * Baukasten; vorher ein Aufklappmenü mit den 30 Porträts). In der Zusammenfassung das Bild.
 */
function PortraetKlappe({ g, zustand }: { g: EigenerGegner; zustand: Portraetwahlzustand }) {
  const vorschau = mitBild(g, zustand.bild);
  return (
    <details className="unterabschnitt portraetklappe" data-testid="portraetklappe">
      <summary>
        <GegnerBild bot={vorschau.kennung} eigene={[vorschau]} name={g.name || "?"} />
        {t("spielen.eigene.portraet")}
      </summary>
      <Portraetwahl zustand={zustand} titel={t("spielen.eigene.portraetArt")} />
    </details>
  );
}

/** Das Formular für einen Gegner; `neu`: noch nicht gespeichert (Überschrift, DS45). */
function Formular({
  start,
  neu,
  beiSpeichern,
  beiAbbrechen,
}: {
  start: EigenerGegner;
  neu: boolean;
  beiSpeichern: (g: EigenerGegner) => void;
  beiAbbrechen: () => void;
}) {
  const [g, setze] = useState(start);
  const bildwahl = usePortraetwahl(bildVon(start));
  const name = g.name.trim();
  return (
    <div className="gegnerformular" data-testid="gegnerformular">
      <h4 className="gegnerformular-titel">
        {t(neu ? "spielen.eigene.formularNeu" : "spielen.eigene.formularBearbeiten")}
      </h4>
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
      <PortraetKlappe g={g} zustand={bildwahl} />
      <GegnerReiter
        g={g}
        setze={setze}
        wann="speichern"
        staerke={
          <StufenWahl
            stufen={g.stufenJePhase}
            praefix="eigen"
            beiWahl={(stufenJePhase: Readonly<Record<Phase, Stufennummer>>) =>
              setze({ ...g, stufenJePhase })
            }
          />
        }
        stil={
          <Stilnetz
            mix={stilDes(g)}
            beiWahl={(stilmix) => setze({ ...g, stilmix, stilname: hauptstil(stilmix) })}
          />
        }
      />
      <div className="knopfreihe">
        <button
          type="button"
          className="knopf-haupt"
          disabled={name.length === 0}
          onClick={() =>
            // Seit 0.2.135: gestrichene Arten werden beim Speichern neutral (Variante A).
            beiSpeichern(
              neutralisiert(
                mitBild(
                  { ...g, name, stilmix: stilDes(g), stilname: hauptstil(stilDes(g)) },
                  bildwahl.bild,
                ),
              ),
            )
          }
        >
          <Knopfsymbol art="speichern" />
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
      <span className="gegnerzeile-kopf">
        <GegnerBild bot={g.kennung} eigene={[g]} name={g.name} />
        <span>
          <strong>{g.name}</strong> · {kurzbeschreibung(g)}
        </span>
      </span>
      {nachfrage ? (
        <span className="knopfreihe">
          <button type="button" className="knopf-gefahr" onClick={beiLoeschen}>
            <Knopfsymbol art="loeschen" />
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
            <Knopfsymbol art="loeschen" />
            {t("spielen.eigene.loeschen")}
          </button>
        </span>
      )}
    </li>
  );
}

/**
 * Eigene Gegner verwalten: Liste, neuer Gegner, Formular. Seit 0.2.80 keine eigene Karte mehr,
 * sondern Teil der Kategorie „Eigene Bots“ in der Gegnerwahl.
 */
export function GegnerEditor() {
  const eigene = useSpeicher((z) => z.daten.spiel.eigeneGegner);
  const [offen, setzeOffen] = useState<EigenerGegner | null>(null);
  const schreibe = (liste: readonly EigenerGegner[]) =>
    void aendere((d) => ({ ...d, spiel: mitEigenenGegnern(d.spiel, liste) }));
  return (
    <div className="eigene-gegner" data-testid="eigene-gegner" data-tour="spielen-eigene">
      <h3 className="unterteil-titel">{t("spielen.eigene.verwalten")}</h3>
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
          neu={!eigene.some((g) => g.kennung === offen.kennung)}
          beiSpeichern={(g) => {
            schreibe(mitEigenemGegner(eigene, g));
            setzeOffen(null);
          }}
          beiAbbrechen={() => setzeOffen(null)}
        />
      ) : (
        <button type="button" className="knopf-zweit" onClick={() => setzeOffen(neuerGegner())}>
          <Knopfsymbol art="neuerGegner" />
          {t("spielen.eigene.neu")}
        </button>
      )}
    </div>
  );
}
