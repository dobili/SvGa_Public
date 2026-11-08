/**
 * Die Hülle des Abenteuers in der App: Zusatzansicht „abenteuer“ (app/zusatzansichten.ts), im
 * Vollbild ohne Kopfzeile und Leiste der App (Entscheidung D1 des Autors, 07.11.2026).
 *
 * Rolle im Gesamtbild: Dieser kleine Teil gehört zum Kern der App. Er zeigt die Startkarte
 * (Paket laden, Spielstand anlegen), lädt das eigentliche Spiel erst dann als eigenen Baustein
 * (dynamischer Import von modul/abenteuer.tsx → assets/abenteuer-*.js, nicht vorab geladen) und
 * übergibt ihm die Dienste der App (anbindung/dienste.ts). Das Spielmenü (Knopf oben rechts) ist
 * der einzige Rückweg in die App: „Zurück zur App“, dazu Paket löschen, Name des Helden ändern
 * und neu beginnen (Schritt 8g). Beim ersten Start wählt der Leser den Namen (Entscheidung in
 * Dokument 02: Name wählbar, Dialoge geschlechtsneutral); er bleibt lokal.
 * Abhängigkeiten: anbindung/dienste.ts, regeln/spielstand.ts, schnittstelle/modul.ts, i18n,
 * paket/paketlader.ts (Löschen), app/blattstapel.ts (Zurück-Taste schließt das Menü).
 */
import { useEffect, useState, type ComponentType } from "react";
import { useZurueckSchliesst } from "../../app/blattstapel";
import { useNavigation } from "../../app/navigationsKontext";
import { t } from "../../i18n/sprache";
import { speicherzustand } from "../../speicher/speicher";
import { ANFANGSPARTIEN } from "../../spiel/wertung";
import "../abenteuer.css";
import { loeschePaket } from "../paket/paketlader";
import { leererAbenteuerstand } from "../regeln/spielstand";
import type { Abenteuermodul } from "../schnittstelle/modul";
import type { Paketzustand } from "../schnittstelle/paket";
import { aktualisierePaketzustand, useAbenteuerstand, useAppdienste } from "./dienste";

/** Der geladene Baustein, einmal je Seite. */
let modulVorrat: Promise<Abenteuermodul> | null = null;

function ladeModul(): Promise<Abenteuermodul> {
  modulVorrat ??= import("../modul/abenteuer").then((m) => m.modul);
  return modulVorrat;
}

const BYTES_JE_MB = 1024 * 1024;

/** Größe für die Anzeige: ganze Megabyte, unter einem Megabyte „unter 1“. */
function mbText(bytes: number): string {
  const mb = bytes / BYTES_JE_MB;
  return mb < 1 ? t("abenteuer.unterEinemMb") : mb.toFixed(0);
}

/** Längster Name des Helden (passt in die Dialogzeile). */
const NAME_HOECHSTENS = 16;

/** Eingabe des Heldennamens; leer heißt „Du“ (Textschlüssel abenteuer.heldname). */
function Namensfeld({
  name,
  beiAenderung,
}: {
  name: string;
  beiAenderung: (name: string) => void;
}) {
  return (
    <label className="abenteuer-namensfeld">
      {t("abenteuer.nameFrage")}
      <input
        type="text"
        value={name}
        maxLength={NAME_HOECHSTENS}
        autoComplete="off"
        placeholder={t("abenteuer.heldname")}
        data-testid="abenteuer-name"
        onChange={(e) => beiAenderung(e.target.value)}
      />
    </label>
  );
}

/** Startkarte: Paket laden oder Spiel beginnen; vor dem ersten Start den Namen wählen. */
function Startkarte({
  zustand,
  name,
  beiName,
  beiLaden,
  beiStart,
}: {
  zustand: Paketzustand;
  /** Null, wenn es schon einen Spielstand gibt (dann keine Namenswahl). */
  name: string | null;
  beiName: (name: string) => void;
  beiLaden: () => void;
  beiStart: () => void;
}) {
  const laedt = zustand.art === "laedt";
  return (
    <section className="karte abenteuer-start" data-testid="abenteuer-start">
      <h1 className="abenteuer-start-titel">{t("abenteuer.titel")}</h1>
      <p>{t("abenteuer.einleitung")}</p>
      {zustand.art === "fehler" && (
        <p className="fehlertext">
          {zustand.grund === "ohneNetz" ? t("abenteuer.ohneNetz") : t("abenteuer.fehler")}
        </p>
      )}
      {laedt && (
        <div className="abenteuer-fortschritt" aria-hidden="true">
          <div style={{ width: `${(100 * zustand.geladen) / Math.max(1, zustand.gesamt)}%` }} />
        </div>
      )}
      {(zustand.art === "vorhanden" || zustand.art === "veraltet") && name !== null && (
        <Namensfeld name={name} beiAenderung={beiName} />
      )}
      {zustand.art === "vorhanden" || zustand.art === "veraltet" ? (
        <button
          type="button"
          className="knopf-haupt"
          data-testid="abenteuer-spielen"
          onClick={beiStart}
        >
          {t("abenteuer.spielen")}
        </button>
      ) : (
        <button
          type="button"
          className="knopf-haupt"
          data-testid="abenteuer-laden"
          onClick={beiLaden}
          disabled={laedt}
        >
          {laedt ? t("abenteuer.laedt", { mb: mbText(zustand.gesamt) }) : t("abenteuer.laden")}
        </button>
      )}
    </section>
  );
}

/** Das Spielmenü: Rückweg in die App, Name ändern, neu beginnen, Paket löschen. */
function Spielmenue({
  heldname,
  beiSchliessen,
  beiZurueck,
  beiName,
  beiNeuBeginnen,
  beiLoeschen,
}: {
  /** Aktueller Name des Helden; null ohne Spielstand. */
  heldname: string | null;
  beiSchliessen: () => void;
  beiZurueck: () => void;
  beiName: (name: string) => void;
  beiNeuBeginnen: () => void;
  beiLoeschen: () => void;
}) {
  useZurueckSchliesst(true, beiSchliessen);
  const [name, setzeName] = useState(heldname ?? "");
  const [neuFrage, setzeNeuFrage] = useState(false);
  return (
    <section
      className="abenteuer-menue"
      role="dialog"
      aria-label={t("abenteuer.menue")}
      data-testid="abenteuer-menue"
    >
      <h2>{t("abenteuer.menue")}</h2>
      <p>{t("abenteuer.menueSpeichern")}</p>
      <button type="button" className="knopf-haupt" onClick={beiZurueck}>
        {t("abenteuer.zurueckZurApp")}
      </button>
      {heldname !== null && (
        <>
          <Namensfeld name={name} beiAenderung={setzeName} />
          {name.trim() !== heldname && (
            <button
              type="button"
              className="knopf-zweit"
              data-testid="abenteuer-name-speichern"
              onClick={() => beiName(name)}
            >
              {t("abenteuer.nameSpeichern")}
            </button>
          )}
          {neuFrage ? (
            <p className="abenteuer-neu-frage">
              {t("abenteuer.neuBeginnenFrage")}
              <button type="button" className="knopf-zweit" onClick={beiNeuBeginnen}>
                {t("abenteuer.neuBeginnenJa")}
              </button>
              <button type="button" className="knopf-zweit" onClick={() => setzeNeuFrage(false)}>
                {t("abenteuer.neuBeginnenNein")}
              </button>
            </p>
          ) : (
            <button type="button" className="knopf-zweit" onClick={() => setzeNeuFrage(true)}>
              {t("abenteuer.neuBeginnen")}
            </button>
          )}
        </>
      )}
      <button type="button" className="knopf-zweit" onClick={beiLoeschen}>
        {t("abenteuer.paketLoeschen")}
      </button>
      <button type="button" className="knopf-zweit" onClick={beiSchliessen}>
        {t("abenteuer.menueSchliessen")}
      </button>
    </section>
  );
}

/** Die Zusatzansicht: Startkarte oder, wenn Paket und Spielstand da sind, die Oberwelt. */
export function AbenteuerAnsicht({ wert }: { readonly wert: string | null }) {
  const dienste = useAppdienste();
  const { zurueck } = useNavigation();
  const stand = useAbenteuerstand();
  const [zustand, setzeZustand] = useState<Paketzustand>({ art: "fehlt" });
  const [Oberwelt, setzeOberwelt] = useState<ComponentType<{
    readonly wert: string | null;
  }> | null>(null);
  const [offen, setzeOffen] = useState(false);
  const [menue, setzeMenue] = useState(false);
  // Name des Helden vor dem ersten Start; leer heißt „Du“.
  const [neuerName, setzeNeuenNamen] = useState("");

  /** Ein eingegebener Name, bereinigt; leer → „Du“. */
  const bereinigt = (name: string) =>
    name.trim().slice(0, NAME_HOECHSTENS) || t("abenteuer.heldname");

  /** Benennt den Helden um (Spielmenü). */
  const benenneUm = (name: string) => {
    if (!stand) return;
    void dienste.schreibeStand({ ...stand, held: { ...stand.held, name: bereinigt(name) } });
    setzeMenue(false);
  };

  /** Beginnt von vorn: Spielstand weg, zurück zur Startkarte mit Namenswahl (Paket bleibt). */
  const beginneNeu = () => {
    void dienste.loescheStand().then(() => {
      setzeMenue(false);
      setzeOffen(false);
    });
  };

  useEffect(() => {
    let aktiv = true;
    void aktualisierePaketzustand().then((z) => {
      if (aktiv) setzeZustand(z);
    });
    return () => {
      aktiv = false;
    };
  }, []);

  const lade = () => {
    setzeZustand({ art: "laedt", geladen: 0, gesamt: 1 });
    dienste
      .ladePaket((geladen, gesamt) => setzeZustand({ art: "laedt", geladen, gesamt }))
      .then(() => aktualisierePaketzustand().then(setzeZustand))
      .catch(() => {
        const online = typeof navigator === "undefined" || navigator.onLine;
        setzeZustand({ art: "fehler", grund: online ? "unbekannt" : "ohneNetz" });
      });
  };

  const starte = () => {
    if (!stand) {
      // Erster Start: Spielstand anlegen; die Eingangswertung ist fest, wenn die App genug
      // gewertete Partien hat (Architektur, Abschnitt 4), sonst läuft sie noch mit.
      const spiel = speicherzustand().daten.spiel;
      const fest = spiel.wertung.length >= ANFANGSPARTIEN;
      void dienste.schreibeStand(
        leererAbenteuerstand(new Date(), bereinigt(neuerName), dienste.wertung(), fest),
      );
    }
    void ladeModul().then((modul) => {
      modul.verbinde(dienste);
      setzeOberwelt(() => modul.Oberwelt);
      setzeOffen(true);
    });
  };

  const loesche = () => {
    void loeschePaket().then(() => {
      setzeMenue(false);
      setzeOffen(false);
      setzeZustand({ art: "fehlt" });
    });
  };

  return (
    <div className="bildschirm bildschirm-abenteuer" data-testid="abenteuer">
      <button
        type="button"
        className="abenteuer-menueknopf"
        aria-label={t("abenteuer.menue")}
        data-testid="abenteuer-menueknopf"
        onClick={() => setzeMenue(true)}
      >
        ☰
      </button>
      {offen && Oberwelt && stand ? (
        <Oberwelt wert={wert} />
      ) : (
        <Startkarte
          zustand={zustand}
          name={stand ? null : neuerName}
          beiName={setzeNeuenNamen}
          beiLaden={lade}
          beiStart={starte}
        />
      )}
      {menue && (
        <Spielmenue
          heldname={stand?.held.name ?? null}
          beiSchliessen={() => setzeMenue(false)}
          beiZurueck={zurueck}
          beiName={benenneUm}
          beiNeuBeginnen={beginneNeu}
          beiLoeschen={loesche}
        />
      )}
    </div>
  );
}
