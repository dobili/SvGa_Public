/**
 * Die Hülle des Abenteuers in der App: Zusatzansicht „abenteuer“ (app/zusatzansichten.ts), im
 * Vollbild ohne Kopfzeile und Leiste der App (Entscheidung D1 des Autors, 07.11.2026).
 *
 * Rolle im Gesamtbild: Dieser kleine Teil gehört zum Kern der App. Er zeigt die Startkarte
 * (Paket laden, Spielstand anlegen), lädt das eigentliche Spiel erst dann als eigenen Baustein
 * (dynamischer Import von modul/abenteuer.tsx → assets/abenteuer-*.js, nicht vorab geladen) und
 * übergibt ihm die Dienste der App (anbindung/dienste.ts). Das Spielmenü (Knopf oben rechts) ist
 * der einzige Rückweg in die App: „Zurück zur App“, dazu Paket löschen, Name und Figur des Helden
 * ändern und neu beginnen (Schritt 8g; Spielmenue.tsx). Beim ersten Start wählt der Leser Namen und Figur
 * (Startkarte.tsx; Dokument 02: Name wählbar, Dialoge geschlechtsneutral); beides bleibt lokal.
 * Abhängigkeiten: anbindung/dienste.ts, regeln/spielstand.ts, schnittstelle/modul.ts, i18n,
 * paket/paketlader.ts (Löschen), app/blattstapel.ts (Zurück-Taste schließt das Menü).
 * Bedienung mit dem Daumen (docs/spiel/30): Die Ansicht trägt data-steuerkreuz (rechts oder links,
 * Wahl im Spielmenü); bedienung.css legt danach Steuerkreuz, Aktionsknopf, Leiste und Menüknopf.
 */
import { useEffect, useRef, useState, type ComponentType } from "react";
import { useNavigation } from "../../app/navigationsKontext";
import { t } from "../../i18n/sprache";
import { speicherzustand } from "../../speicher/speicher";
import { ANFANGSPARTIEN } from "../../spiel/wertung";
import "../abenteuer.css";
import "../abenteuer-atmosphaere.css";
import "../spielfarben.css";
import "../bedienung.css";
import "../querformat.css";
import { useEinstellungen } from "../../app/einstellungen";
import { usePixelrahmen } from "./pixelrahmen";
import { loeschePaket } from "../paket/paketlader";
import { leererAbenteuerstand } from "../regeln/spielstand";
import type { Abenteuermodul } from "../schnittstelle/modul";
import type { Paketzustand } from "../schnittstelle/paket";
import { useAbenteuerton } from "../ton/useAbenteuerton";
import { useAktton } from "../paket/aktton";
import { aktualisierePaketzustand, useAbenteuerstand, useAppdienste } from "./dienste";
import { Spielmenue } from "./Spielmenue";
import { NAME_HOECHSTENS, Startkarte } from "./Startkarte";
import type { Heldfigur } from "../schnittstelle/spielstand";
import { ERSATZFIGUR } from "../regeln/heldfigur";
import { mitRivalwahl, rivalinGewaehlt } from "../regeln/rivalform";
import { Ladestand } from "./Ladestand";

/** Der geladene Baustein, einmal je Seite. */
let modulVorrat: Promise<Abenteuermodul> | null = null;

function ladeModul(): Promise<Abenteuermodul> {
  modulVorrat ??= import("../modul/abenteuer").then((m) => m.modul);
  return modulVorrat;
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
  const [neueFigur, setzeNeueFigur] = useState<Heldfigur>(ERSATZFIGUR);
  const [neueRivalin, setzeNeueRivalin] = useState(false);
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

  /** Wechselt die Figur (Spielmenü); die Welt lädt den neuen Bogen auf derselben Karte. */
  const waehleFigur = (figur: Heldfigur) => {
    if (!stand || stand.held.figur === figur) return;
    void dienste.schreibeStand({ ...stand, held: { ...stand.held, figur } });
  };

  /** Wechselt zwischen Rivale und Rivalin (Spielmenü); gilt ab dem nächsten Gespräch. */
  const waehleRivalin = (rivalin: boolean) => {
    if (stand) void dienste.schreibeStand(mitRivalwahl(stand, rivalin));
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
      const neu = leererAbenteuerstand(
        new Date(),
        bereinigt(neuerName),
        dienste.wertung(),
        fest,
        neueFigur,
      );
      void dienste.schreibeStand(mitRivalwahl(neu, neueRivalin));
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
          figur={neueFigur}
          beiFigur={setzeNeueFigur}
          rivalin={neueRivalin}
          beiRivalin={setzeNeueRivalin}
          beiLaden={lade}
          beiStart={starte}
        />
      )}
      <Ladestand />
      {menue && (
        <Spielmenue
          heldname={stand?.held.name ?? null}
          figur={stand?.held.figur ?? ERSATZFIGUR}
          beiFigur={waehleFigur}
          rivalin={rivalinGewaehlt(stand?.dialogvariablen ?? {})}
          beiRivalin={waehleRivalin}
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
