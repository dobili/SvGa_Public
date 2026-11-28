/**
 * Hauptmenü des Schach-Abenteuers (Wunsch des Autors, 27.11.2026): „Ein Hauptmenü, von dem man
 * immer entscheiden kann, ob man ein neues Spiel anfängt, einen Speicherstand lädt oder vorhandene
 * Speicherstände löscht.“
 *
 * Aufbau: Titel, groß „Fortsetzen“ mit dem zuletzt gespielten Stand (Figur, Name, Akt, Ort,
 * Spielzeit), darunter „Neues Spiel“ (führt in die Wahl von Name und Held oder Heldin; der Rivale
 * wird ausgelost, Startkarte.tsx), „Spielstand laden“ (Ladeliste mit Laden und Löschen, Löschen mit
 * Rückfrage; unter jedem Spielstand seine Sicherungen, Sicherungsliste.tsx, 28.11.2026), „Einstellungen“ (das Spielmenü mit Ton, Steuerkreuz und Paket) und „Zurück zur App“.
 * Bedienung wie die übrigen Fenster des Spiels: Pixelknöpfe, hoch und quer (hauptmenue.css), für
 * Bildschirmleser eine Region mit Überschrift, die Rückfrage als Warnung, die Bestätigung des
 * Löschens als Statusmeldung.
 * Zurück-Taste wie in den übrigen Fenstern des Spiels (app/blattstapel.ts, Spieler-Durchlauf
 * 27.11.2026: in der Ladeliste verließ sie das ganze Abenteuer): In der Löschrückfrage heißt sie
 * „Nein“, in der Ladeliste führt sie ins Hauptmenü; erst im Hauptmenü verlässt sie das Abenteuer.
 * Abhängigkeiten: app/blattstapel.ts, speicherplaetze.ts (Platzzeile), platztext.ts, Figurrahmen.tsx, i18n, regeln/heldfigur.ts,
 * Sicherungsliste.tsx, sicherungen.ts.
 */
import { useEffect, useRef, useState } from "react";
import { useZurueckSchliesst } from "../../app/blattstapel";
import { t, tZahl } from "../../i18n/sprache";
import { ERSATZFIGUR, heldbogenpfad } from "../regeln/heldfigur";
import type { Abenteuerstand, Sicherung } from "../schnittstelle/spielstand";
import { Figurrahmen } from "./Figurrahmen";
import { useFigurbogen } from "./useFigurbogen";
import { akttext, nadeltext, orttext, platzzeile, zuletzttext } from "./platztext";
import type { Platzzeile } from "./speicherplaetze";
import { sicherungenDes } from "./sicherungen";
import { Sicherungsliste, type Sicherungswege } from "./Sicherungsliste";
import "../hauptmenue.css";
import { Schriftzug } from "./Schriftzug";

/** Vergrößerung der Figur in Fortsetzen und Ladeliste. */
const FIGUR_GROSS = 3;
const FIGUR_KLEIN = 2;

/** Die Figur des Helden eines Stands als Standbild; ohne Paketbild nichts. */
function Heldbild({
  stand,
  bilder,
  massstab,
}: {
  readonly stand: Abenteuerstand;
  readonly bilder: boolean;
  readonly massstab: number;
}) {
  const gewaehlt = useFigurbogen(heldbogenpfad(stand.held.figur), bilder);
  const ersatz = useFigurbogen(heldbogenpfad(ERSATZFIGUR), bilder);
  const bogen = gewaehlt ?? ersatz;
  return (
    <span className="abenteuer-platzbild">
      {bogen && <Figurrahmen bogen={bogen} massstab={massstab} />}
    </span>
  );
}

/** Was das Hauptmenü auslösen kann (dazu Laden und Löschen der Sicherungen). */
export interface Hauptmenuewege extends Sicherungswege {
  readonly beiFortsetzen: (kennung: string) => void;
  readonly beiNeu: () => void;
  readonly beiLoeschen: (kennung: string) => void;
  readonly beiEinstellungen: () => void;
  readonly beiZurApp: () => void;
}

/** Ein Eintrag der Ladeliste mit Laden, Löschen und der Rückfrage. */
function Platzeintrag({
  zeile,
  sicherungen,
  bilder,
  frage,
  beiFrage,
  wege,
}: {
  readonly zeile: Platzzeile;
  /** Die Sicherungen dieses Platzes, neueste zuerst. */
  readonly sicherungen: readonly Sicherung[];
  readonly bilder: boolean;
  readonly frage: boolean;
  readonly beiFrage: (offen: boolean) => void;
  readonly wege: Hauptmenuewege;
}) {
  const { stand } = zeile;
  const name = stand.held.name;
  // Zurück-Taste bei offener Rückfrage wie „Nein“ (meldet sich nach der Liste an, schließt zuerst).
  useZurueckSchliesst(frage, () => beiFrage(false));
  return (
    <li className="abenteuer-platz" data-testid="abenteuer-platz" data-aktiv={zeile.aktiv}>
      <Heldbild stand={stand} bilder={bilder} massstab={FIGUR_KLEIN} />
      <span className="abenteuer-platz-text">
        <strong>{name}</strong>
        <span>{platzzeile(stand)}</span>
        <span className="abenteuer-platz-leise">
          {nadeltext(stand)} · {zuletzttext(zeile.zuletzt)}
        </span>
      </span>
      <span className="abenteuer-platz-knoepfe">
        <button
          type="button"
          className="knopf-haupt"
          data-testid="abenteuer-platz-laden"
          onClick={() => wege.beiFortsetzen(zeile.kennung)}
        >
          {zeile.aktiv ? t("abenteuer.ladeliste.aktiv") : t("abenteuer.ladeliste.laden")}
        </button>
        <button
          type="button"
          className="knopf-zweit"
          data-testid="abenteuer-platz-loeschen"
          aria-label={t("abenteuer.ladeliste.loeschenName", { name })}
          aria-expanded={frage}
          onClick={() => beiFrage(!frage)}
        >
          {t("abenteuer.ladeliste.loeschen")}
        </button>
      </span>
      {frage && (
        <p className="abenteuer-platz-frage" role="alert" data-testid="abenteuer-platz-frage">
          {t("abenteuer.ladeliste.frage", {
            name,
            akt: akttext(stand.handlung.akt),
            ort: orttext(stand),
          })}
          {sicherungen.length > 0 &&
            ` ${tZahl("abenteuer.ladeliste.frageSicherungen", sicherungen.length, { anzahl: sicherungen.length })}`}
          <button
            type="button"
            className="knopf-gefahr"
            data-testid="abenteuer-platz-loeschen-ja"
            onClick={() => wege.beiLoeschen(zeile.kennung)}
          >
            {t("abenteuer.ladeliste.ja")}
          </button>
          <button type="button" className="knopf-zweit" onClick={() => beiFrage(false)}>
            {t("abenteuer.ladeliste.nein")}
          </button>
        </p>
      )}
      <Sicherungsliste stand={stand} sicherungen={sicherungen} wege={wege} />
    </li>
  );
}

/** Die Ladeliste: alle Spielstände, der gespielte zuerst. */
function Ladeliste({
  plaetze,
  sicherungen,
  bilder,
  wege,
  beiZurueck,
}: {
  readonly plaetze: readonly Platzzeile[];
  readonly sicherungen: readonly Sicherung[];
  readonly bilder: boolean;
  readonly wege: Hauptmenuewege;
  readonly beiZurueck: () => void;
}) {
  const [frage, setzeFrage] = useState<string | null>(null);
  const [geloescht, setzeGeloescht] = useState<"platz" | "sicherung" | null>(null);
  const loesche = (kennung: string) => {
    setzeFrage(null);
    setzeGeloescht("platz");
    wege.beiLoeschen(kennung);
  };
  const loescheSicherung = (platz: string, gesichert: string) => {
    setzeGeloescht("sicherung");
    wege.beiSicherungLoeschen(platz, gesichert);
  };
  // Zurück-Taste wie der Knopf „Zurück“: ins Hauptmenü, nicht aus dem Abenteuer.
  useZurueckSchliesst(true, beiZurueck);
  const titel = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    titel.current?.focus();
  }, []);
  return (
    <section
      className="abenteuer-hauptmenue abenteuer-ladeliste"
      data-testid="abenteuer-ladeliste"
      aria-labelledby="abenteuer-ladeliste-titel"
    >
      <h2 id="abenteuer-ladeliste-titel" ref={titel} tabIndex={-1}>
        {t("abenteuer.ladeliste.titel")}
      </h2>
      <p className="abenteuer-platz-status" role="status">
        {geloescht === "platz" && t("abenteuer.ladeliste.geloescht")}
        {geloescht === "sicherung" && t("abenteuer.sicherung.geloescht")}
      </p>
      <ul className="abenteuer-platzliste">
        {plaetze.map((zeile) => (
          <Platzeintrag
            key={zeile.kennung}
            zeile={zeile}
            sicherungen={sicherungenDes({ abenteuersicherungen: sicherungen }, zeile.kennung)}
            bilder={bilder}
            frage={frage === zeile.kennung}
            beiFrage={(offen) => setzeFrage(offen ? zeile.kennung : null)}
            wege={{ ...wege, beiLoeschen: loesche, beiSicherungLoeschen: loescheSicherung }}
          />
        ))}
      </ul>
      <button
        type="button"
        className="knopf-zweit"
        data-testid="abenteuer-ladeliste-zurueck"
        onClick={beiZurueck}
      >
        {t("abenteuer.ladeliste.zurueck")}
      </button>
    </section>
  );
}

/**
 * Das Hauptmenü. Eingaben: alle Plätze (der erste ist der fortsetzbare), alle Sicherungen, ob es
 * gleich mit der Ladeliste aufgeht („Laden“ im Spielmenü), ob Paketbilder geladen werden dürfen,
 * die Wege. Ohne Plätze fehlen „Fortsetzen“ und „Spielstand laden“.
 */
export function Hauptmenue({
  plaetze,
  sicherungen,
  mitListe = false,
  bilder,
  wege,
}: {
  readonly plaetze: readonly Platzzeile[];
  readonly sicherungen: readonly Sicherung[];
  readonly mitListe?: boolean;
  readonly bilder: boolean;
  readonly wege: Hauptmenuewege;
}) {
  const [liste, setzeListe] = useState(mitListe);
  const erster = plaetze[0] ?? null;
  // Ohne Plätze (alle gelöscht) zurück aus der leeren Liste.
  const listeOffen = liste && plaetze.length > 0;
  if (listeOffen) {
    return (
      <Ladeliste
        plaetze={plaetze}
        sicherungen={sicherungen}
        bilder={bilder}
        wege={wege}
        beiZurueck={() => setzeListe(false)}
      />
    );
  }
  return (
    <section
      className="abenteuer-hauptmenue"
      data-testid="abenteuer-hauptmenue"
      aria-labelledby="abenteuer-hauptmenue-titel"
    >
      <h1 id="abenteuer-hauptmenue-titel" className="abenteuer-hauptmenue-titel">
        <Schriftzug groesse="mittel" />
      </h1>
      <p className="abenteuer-hauptmenue-hinweis">{t("abenteuer.menueSpeichern")}</p>
      {erster && (
        <button
          type="button"
          className="knopf-haupt abenteuer-fortsetzen"
          data-testid="abenteuer-fortsetzen"
          onClick={() => wege.beiFortsetzen(erster.kennung)}
        >
          <Heldbild stand={erster.stand} bilder={bilder} massstab={FIGUR_GROSS} />
          <span className="abenteuer-platz-text">
            <strong>{t("abenteuer.hauptmenue.fortsetzen")}</strong>
            <span>{erster.stand.held.name}</span>
            <span>{platzzeile(erster.stand)}</span>
          </span>
        </button>
      )}
      <button
        type="button"
        className={erster ? "knopf-zweit" : "knopf-haupt"}
        data-testid="abenteuer-neues-spiel"
        onClick={wege.beiNeu}
      >
        {t("abenteuer.hauptmenue.neu")}
      </button>
      {erster && (
        <button
          type="button"
          className="knopf-zweit"
          data-testid="abenteuer-ladeliste-knopf"
          onClick={() => setzeListe(true)}
        >
          {t("abenteuer.hauptmenue.laden", { anzahl: plaetze.length })}
        </button>
      )}
      <button
        type="button"
        className="knopf-zweit"
        data-testid="abenteuer-hauptmenue-einstellungen"
        onClick={wege.beiEinstellungen}
      >
        {t("abenteuer.hauptmenue.einstellungen")}
      </button>
      <button
        type="button"
        className="knopf-zweit"
        data-testid="abenteuer-hauptmenue-zurapp"
        onClick={wege.beiZurApp}
      >
        {t("abenteuer.zurueckZurApp")}
      </button>
    </section>
  );
}
