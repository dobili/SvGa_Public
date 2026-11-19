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
 * Bedienung mit dem Daumen (docs/spiel/30): Die Ansicht trägt data-steuerkreuz (rechts oder links,
 * Wahl im Spielmenü); bedienung.css legt danach Steuerkreuz, Aktionsknopf, Leiste und Menüknopf.
 */
import { useEffect, useRef, useState, type ComponentType } from "react";
import { useZurueckSchliesst } from "../../app/blattstapel";
import { useNavigation } from "../../app/navigationsKontext";
import { t } from "../../i18n/sprache";
import { speicherzustand } from "../../speicher/speicher";
import { ANFANGSPARTIEN } from "../../spiel/wertung";
import "../abenteuer.css";
import "../abenteuer-atmosphaere.css";
import "../spielfarben.css";
import "../bedienung.css";
import { useEinstellungen } from "../../app/einstellungen";
import { usePixelrahmen } from "./pixelrahmen";
import { loeschePaket } from "../paket/paketlader";
import { leererAbenteuerstand } from "../regeln/spielstand";
import type { Abenteuermodul } from "../schnittstelle/modul";
import type { Paketzustand } from "../schnittstelle/paket";
import { useAbenteuerton } from "../ton/useAbenteuerton";
import { useAktton } from "../paket/aktton";
import { aktualisierePaketzustand, useAbenteuerstand, useAppdienste } from "./dienste";
import { Steuerkreuzwahl } from "./Steuerkreuzwahl";
import { Tonregler } from "./Tonregler";
import { Ladestand } from "./Ladestand";
import { groessentext, mbText } from "./groesse";

/** Der geladene Baustein, einmal je Seite. */
let modulVorrat: Promise<Abenteuermodul> | null = null;

function ladeModul(): Promise<Abenteuermodul> {
  modulVorrat ??= import("../modul/abenteuer").then((m) => m.modul);
  return modulVorrat;
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
  geprueft,
  name,
  beiName,
  beiLaden,
  beiStart,
}: {
  zustand: Paketzustand;
  /**
   * Ob der Paketzustand schon abgefragt ist. Vorher kein Knopf: Bis die Antwort kam, stand dort
   * „Spiel herunterladen“, auch wenn das Paket längst da war, und ein schneller Tipp lud es neu
   * (Affentest 14.11.2026).
   */
  geprueft: boolean;
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
      {/* Kurze Sätze und die Größe vor dem Laden (Spieltest „einstieg“, R9). */}
      {zustand.art === "fehlt" && (
        <p>
          {groessentext(zustand)} {t("abenteuer.speichertSelbst")}
        </p>
      )}
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
      {!geprueft ? (
        <p className="lade">{t("abenteuer.pruefe")}</p>
      ) : zustand.art === "vorhanden" || zustand.art === "veraltet" ? (
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
      <Steuerkreuzwahl />
      <Tonregler />
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
  const [geprueft, setzeGeprueft] = useState(false);
  const [Oberwelt, setzeOberwelt] = useState<ComponentType<{
    readonly wert: string | null;
  }> | null>(null);
  const [offen, setzeOffen] = useState(false);
  const [menue, setzeMenue] = useState(false);
  const pixelrahmen = usePixelrahmen();
  // Steuerkreuz rechts oder links (docs/spiel/30): bedienung.css legt danach die Knöpfe.
  const { abenteuersteuerkreuz } = useEinstellungen();
  // Name des Helden vor dem ersten Start; leer heißt „Du“.
  const [neuerName, setzeNeuenNamen] = useState("");
  // Musik und Geräusche des Abenteuers (ton/): Einstellungen anwenden, beim Verlassen ausblenden.
  useAbenteuerton();
  useAktton(stand?.handlung.akt ?? 1); // Ton des Akts im Hintergrund (paket/aktton.ts)

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
    // Ohne Cache-Speicher (gesperrte Website-Daten) gilt das Paket als fehlend; das Laden meldet
    // dann seinen Fehler auf der Startkarte, statt dass die Prüfung ewig läuft.
    void aktualisierePaketzustand()
      .catch((): Paketzustand => ({ art: "fehlt" }))
      .then((z) => {
        if (!aktiv) return;
        setzeZustand(z);
        setzeGeprueft(true);
      });
    return () => {
      aktiv = false;
    };
  }, []);

  // Wer schon einen Spielstand und das Paket hat, landet gleich in der Welt (Rückweg aus Partie
  // und Aufgabenrunde); die Startkarte sieht nur, wer neu beginnt oder das Paket laden muss.
  const automatisch = useRef(false);
  useEffect(() => {
    const paketDa = zustand.art === "vorhanden" || zustand.art === "veraltet";
    if (!paketDa || !stand || offen || automatisch.current) return;
    automatisch.current = true;
    void ladeModul()
      .then((modul) => {
        modul.verbinde(dienste);
        setzeOberwelt(() => modul.Oberwelt);
        setzeOffen(true);
      })
      .catch((fehler: unknown) => {
        // Fehlt ein Baustein (etwa nach einem Update), zeigt die Startkarte den Fehler.
        console.warn("Schach-Abenteuer: Laden fehlgeschlagen", fehler);
        automatisch.current = false;
        setzeZustand({ art: "fehler", grund: "unbekannt" });
      });
  }, [zustand, stand, offen, dienste]);

  // Ein Fehler beim Laden des Spielbausteins oder beim Löschen des Pakets (etwa ein fehlender
  // Baustein nach einem Update) zeigt die Fehlerkarte statt still nichts zu tun (Affentest).
  const meldeLadefehler = (fehler: unknown) => {
    console.warn("Schach-Abenteuer: Laden fehlgeschlagen", fehler);
    automatisch.current = false;
    setzeZustand({ art: "fehler", grund: "unbekannt" });
  };

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

  // Neue Version des Spiels auf dem Server (Wunsch des Autors, 19.11.2026): mit Spielstand gleich
  // laden; danach führt der Weg wie gewohnt in die Welt. Ohne Netz bleibt das alte Paket.
  const aktualisiert = useRef(false);
  useEffect(() => {
    if (zustand.art !== "fehlt" || !zustand.neuerStand || !stand || aktualisiert.current) return;
    aktualisiert.current = true;
    lade();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zustand, stand]);

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
    void ladeModul()
      .then((modul) => {
        modul.verbinde(dienste);
        setzeOberwelt(() => modul.Oberwelt);
        setzeOffen(true);
      })
      .catch(meldeLadefehler);
  };

  const loesche = () => {
    void loeschePaket()
      .then(() => {
        setzeMenue(false);
        setzeOffen(false);
        setzeZustand({ art: "fehlt" });
      })
      .catch(meldeLadefehler);
  };

  return (
    <div
      className={`bildschirm bildschirm-abenteuer ${pixelrahmen?.klasse ?? ""}`}
      style={pixelrahmen?.stil}
      data-steuerkreuz={abenteuersteuerkreuz}
      data-testid="abenteuer"
    >
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
          geprueft={geprueft}
          name={stand ? null : neuerName}
          beiName={setzeNeuenNamen}
          beiLaden={lade}
          beiStart={starte}
        />
      )}
      <Ladestand />
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
