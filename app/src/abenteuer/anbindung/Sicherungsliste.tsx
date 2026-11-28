/**
 * Die Sicherungen eines Spielstands in der Ladeliste (Wunsch des Autors, 28.11.2026: „in der
 * Ladeliste die Sicherungen je Spiel sichtbar“): unter dem Platz, die neueste zuerst, je Zeile
 * „Gesichert am …“ mit Akt, Ort und Spielzeit, dazu Laden und Löschen.
 *
 * Laden fragt nur nach, wenn dabei Fortschritt verloren ginge (sicherungen.ts, ungesichertSeit):
 * „Was du seit der Sicherung vom … gespielt hast, geht verloren.“ Löschen fragt immer nach. Die
 * Rückfragen sind Warnungen für Bildschirmleser; die Zurück-Taste heißt in ihnen „Nein“, wie in
 * der übrigen Ladeliste (useZurueckSchliesst).
 * Abhängigkeiten: app/blattstapel.ts, i18n, platztext.ts, sicherungen.ts.
 */
import { useState } from "react";
import { useZurueckSchliesst } from "../../app/blattstapel";
import { t } from "../../i18n/sprache";
import type { Abenteuerstand, Sicherung } from "../schnittstelle/spielstand";
import { gesichertzeit, platzzeile } from "./platztext";
import { ungesichertSeit } from "./sicherungen";

/** Was die Liste auslösen kann (Platz und Zeitpunkt der Sicherung). */
export interface Sicherungswege {
  readonly beiSicherung: (platz: string, gesichert: string) => void;
  readonly beiSicherungLoeschen: (platz: string, gesichert: string) => void;
}

/** Eine offene Rückfrage: Laden (mit dem Zeitpunkt, seit dem nicht gesichert ist) oder Löschen. */
type Frage =
  | { readonly art: "laden"; readonly gesichert: string; readonly seit: string }
  | { readonly art: "loeschen"; readonly gesichert: string };

/** Die Rückfrage unter einer Sicherung, mit Ja und Nein. */
function Rueckfrage({
  frage,
  beiJa,
  beiNein,
}: {
  readonly frage: Frage;
  readonly beiJa: () => void;
  readonly beiNein: () => void;
}) {
  const laden = frage.art === "laden";
  return (
    <p className="abenteuer-platz-frage" role="alert" data-testid="abenteuer-sicherung-frage">
      {laden
        ? t("abenteuer.sicherung.frageLaden", { zeit: gesichertzeit(frage.seit) })
        : t("abenteuer.sicherung.frageLoeschen", { zeit: gesichertzeit(frage.gesichert) })}
      <button
        type="button"
        className={laden ? "knopf-haupt" : "knopf-gefahr"}
        data-testid={laden ? "abenteuer-sicherung-laden-ja" : "abenteuer-sicherung-loeschen-ja"}
        onClick={beiJa}
      >
        {laden ? t("abenteuer.sicherung.jaLaden") : t("abenteuer.ladeliste.ja")}
      </button>
      <button type="button" className="knopf-zweit" onClick={beiNein}>
        {t("abenteuer.ladeliste.nein")}
      </button>
    </p>
  );
}

/** Eine Sicherung: Zeitpunkt, Kurzzeile, Laden und Löschen. */
function Sicherungszeile({
  sicherung,
  frage,
  beiLaden,
  beiLoeschen,
}: {
  readonly sicherung: Sicherung;
  readonly frage: boolean;
  readonly beiLaden: () => void;
  readonly beiLoeschen: () => void;
}) {
  const zeit = gesichertzeit(sicherung.gesichert);
  return (
    <span className="abenteuer-sicherung-zeile">
      <span className="abenteuer-platz-text">
        <strong>{t("abenteuer.sicherung.titel", { zeit })}</strong>
        <span className="abenteuer-platz-leise">{platzzeile(sicherung.stand)}</span>
      </span>
      <span className="abenteuer-platz-knoepfe">
        <button
          type="button"
          className="knopf-zweit"
          data-testid="abenteuer-sicherung-laden"
          onClick={beiLaden}
        >
          {t("abenteuer.ladeliste.laden")}
        </button>
        <button
          type="button"
          className="knopf-zweit"
          data-testid="abenteuer-sicherung-loeschen"
          aria-label={t("abenteuer.sicherung.loeschenName", { zeit })}
          aria-expanded={frage}
          onClick={beiLoeschen}
        >
          {t("abenteuer.ladeliste.loeschen")}
        </button>
      </span>
    </span>
  );
}

/**
 * Die Sicherungen eines Platzes. Eingaben: der jetzige Stand des Platzes, seine Sicherungen
 * (neueste zuerst), die Wege. Ohne Sicherungen nichts.
 */
export function Sicherungsliste({
  stand,
  sicherungen,
  wege,
}: {
  readonly stand: Abenteuerstand;
  readonly sicherungen: readonly Sicherung[];
  readonly wege: Sicherungswege;
}) {
  const [frage, setzeFrage] = useState<Frage | null>(null);
  useZurueckSchliesst(frage !== null, () => setzeFrage(null));
  if (sicherungen.length === 0) return null;
  const platz = stand.begonnen;
  const lade = (gesichert: string) => {
    const seit = ungesichertSeit(stand, sicherungen);
    if (seit === null) wege.beiSicherung(platz, gesichert);
    else setzeFrage({ art: "laden", gesichert, seit });
  };
  const ja = (f: Frage) => {
    setzeFrage(null);
    if (f.art === "laden") wege.beiSicherung(platz, f.gesichert);
    else wege.beiSicherungLoeschen(platz, f.gesichert);
  };
  return (
    <ul className="abenteuer-sicherungen" aria-label={t("abenteuer.sicherung.liste")}>
      {sicherungen.map((s) => (
        <li key={s.gesichert} className="abenteuer-sicherung" data-testid="abenteuer-sicherung">
          <Sicherungszeile
            sicherung={s}
            frage={frage?.art === "loeschen" && frage.gesichert === s.gesichert}
            beiLaden={() => lade(s.gesichert)}
            beiLoeschen={() => setzeFrage({ art: "loeschen", gesichert: s.gesichert })}
          />
          {frage?.gesichert === s.gesichert && (
            <Rueckfrage frage={frage} beiJa={() => ja(frage)} beiNein={() => setzeFrage(null)} />
          )}
        </li>
      ))}
    </ul>
  );
}
