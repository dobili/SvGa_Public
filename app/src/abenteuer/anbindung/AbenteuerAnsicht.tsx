/**
 * Die Hülle des Abenteuers in der App: Zusatzansicht „abenteuer“ (app/zusatzansichten.ts), im
 * Vollbild ohne Kopfzeile und Leiste der App (Entscheidung D1 des Autors, 07.11.2026).
 *
 * Rolle im Gesamtbild: Dieser kleine Teil gehört zum Kern der App. Er zeigt beim Start das
 * Startbild (Startbild.tsx) und das Hauptmenü mit den Speicherplätzen (Hauptmenue.tsx, Wunsch des
 * Autors, 27.11.2026), sonst die Startkarte (Paket laden, neues Spiel anlegen), lädt das
 * eigentliche Spiel erst dann als eigenen Baustein
 * (dynamischer Import von modul/abenteuer.tsx → assets/abenteuer-*.js, nicht vorab geladen) und
 * übergibt ihm die Dienste der App (anbindung/dienste.ts). Das Spielmenü (Knopf oben rechts) ist
 * der Rückweg in die App: „Zurück zur App“, dazu Paket löschen, den Namen des Helden ändern und
 * „Hauptmenü“ (Schritt 8g; Spielmenue.tsx). Bei einem neuen Spiel wählt der Leser Namen,
 * Figur und Rivalen (Startkarte.tsx; Dokument 02: Name wählbar, Dialoge geschlechtsneutral); alles
 * bleibt lokal. Figur und Rivale gelten danach für das ganze Spiel (Wunsch des Autors, 24.11.2026).
 * Einstieg (27.11.2026): Ein neuer Start der App zeigt Startbild und Hauptmenü; der Rückweg aus
 * Partie, Runde und Besprechung und ein Neuladen im selben Tab führen gleich in die Welt
 * (spielsitzung.ts). Den Reiter „Abenteuer“ der App öffnet diese Ansicht.
 * Abhängigkeiten: anbindung/dienste.ts, usePaketzustand.ts, regeln/spielstand.ts, schnittstelle/modul.ts, i18n,
 * paket/paketlader.ts (Löschen), app/blattstapel.ts (Zurück-Taste schließt das Menü),
 * useSpeicherplaetze.ts, spielsitzung.ts, Hauptmenue.tsx, Startbild.tsx.
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
import type { Abenteuermodul, Appdienste } from "../schnittstelle/modul";
import { useAbenteuerton } from "../ton/useAbenteuerton";
import { useAktton } from "../paket/aktton";
import { useAbenteuerstand, useAppdienste } from "./dienste";
import { Spielmenue } from "./Spielmenue";
import { NAME_HOECHSTENS, Startkarte } from "./Startkarte";
import type { Abenteuerstand, Heldfigur } from "../schnittstelle/spielstand";
import { ERSATZFIGUR } from "../regeln/heldfigur";
import { mitRivalwahl, rivalinGewaehlt } from "../regeln/rivalform";
import { Ladestand } from "./Ladestand";
import { Hauptmenue } from "./Hauptmenue";
import { Startbild } from "./Startbild";
import { platzkennung } from "./speicherplaetze";
import {
  beendeSitzung,
  merkeSitzung,
  ohneHauptmenue,
  sitzungsplatz,
  startbildErlaubt,
} from "./spielsitzung";
import { useSpeicherplaetze, type Speicherplaetze } from "./useSpeicherplaetze";
import { usePaketzustand, type Paketlage } from "./usePaketzustand";

/** Die Oberwelt aus dem geladenen Baustein. */
type Oberweltbaustein = ComponentType<{ readonly wert: string | null }>;

/** Der geladene Baustein, einmal je Seite. */
let modulVorrat: Promise<Abenteuermodul> | null = null;

function ladeModul(): Promise<Abenteuermodul> {
  modulVorrat ??= import("../modul/abenteuer").then((m) => m.modul);
  return modulVorrat;
}

/**
 * Was die Ansicht zeigt: „einstieg“ (Paket und Speicher werden geprüft, Startkarte), „menue“
 * (Hauptmenü), „neu“ (Startkarte mit Wahl für ein neues Spiel), „welt“ (die Oberwelt).
 */
type Ansicht = "einstieg" | "menue" | "neu" | "welt";

/** Lief das Startbild in dieser Seite schon? Dann nicht noch einmal (Hauptmenü → App → zurück). */
let startbildGelaufen = false;

/** Soll beim Öffnen der Ansicht das Startbild laufen? Nur beim Start, nicht beim Rückweg ins Spiel. */
function startbildFaellig(): boolean {
  return !startbildGelaufen && sitzungsplatz() === null && !ohneHauptmenue() && startbildErlaubt();
}

/** Ein neuer Spielstand aus der Wahl auf der Startkarte; Eingangswertung wie beim ersten Start. */
function neuerStand(
  dienste: Appdienste,
  name: string,
  figur: Heldfigur,
  rivalin: boolean,
): Abenteuerstand {
  // Die Eingangswertung ist fest, wenn die App genug gewertete Partien hat (Architektur,
  // Abschnitt 4), sonst läuft sie noch mit.
  const spiel = speicherzustand().daten.spiel;
  const fest = spiel.wertung.length >= ANFANGSPARTIEN;
  const neu = leererAbenteuerstand(new Date(), name, dienste.wertung(), fest, figur);
  return mitRivalwahl(neu, rivalin);
}

/** Was die Ansicht nach einem Wechsel zeigt: Hauptmenü, ohne Spielstände die Wahl für ein neues. */
function ohneWelt(plaetze: number): Ansicht {
  return plaetze > 0 ? "menue" : "neu";
}

/**
 * Ansicht und Weg in die Welt: Einstieg nach der Prüfung von Paket und Speicher, Öffnen der Welt
 * mit einem Platz, Rückkehr ins Hauptmenü, wenn ein anderer Tab den Stand wechselt.
 */
function useEinstieg(
  dienste: Appdienste,
  stand: Abenteuerstand | null,
  paket: Paketlage,
  plaetze: Speicherplaetze,
) {
  const [wahl, setzeAnsicht] = useState<Ansicht>("einstieg");
  const [Oberwelt, setzeOberwelt] = useState<Oberweltbaustein | null>(null);
  // Der Platz, mit dem diese Ansicht in die Welt ging.
  const [eingetreten, setzeEingetreten] = useState<string | null>(null);
  // Läuft das Öffnen der Welt schon (der Einstieg ruft es nur einmal)?
  const oeffnet = useRef(false);
  const anzahl = plaetze.plaetze.length;

  // Ein Fehler beim Laden des Spielbausteins oder beim Löschen des Pakets (etwa ein fehlender
  // Baustein nach einem Update) zeigt die Fehlerkarte statt still nichts zu tun (Affentest).
  const meldeLadefehler = (fehler: unknown) => {
    console.warn("Schach-Abenteuer: Laden fehlgeschlagen", fehler);
    oeffnet.current = false;
    setzeAnsicht("einstieg");
    paket.setzeZustand({ art: "fehler", grund: "unbekannt" });
  };

  /** Geht mit dem gespielten Platz in die Welt: Baustein laden, Sitzung merken. */
  const oeffneWelt = (kennung: string) => {
    oeffnet.current = true;
    merkeSitzung(kennung);
    void ladeModul()
      .then((modul) => {
        modul.verbinde(dienste);
        oeffnet.current = false;
        setzeOberwelt(() => modul.Oberwelt);
        setzeEingetreten(kennung);
        setzeAnsicht("welt");
      })
      .catch(meldeLadefehler);
  };

  // Einstieg, sobald Paket und Speicher bereit sind: zurück in die Welt (Rückweg aus Partie und
  // Runde, Neuladen im selben Tab, Testschalter), sonst Hauptmenü oder, ohne Spielstand, die Wahl
  // für das erste Spiel (abgeleitet, unten).
  const bereit = wahl === "einstieg" && paket.geprueft && paket.da && plaetze.bereit;
  const zurueckInDieWelt =
    stand !== null && (ohneHauptmenue() || sitzungsplatz() === platzkennung(stand));
  useEffect(() => {
    if (bereit && zurueckInDieWelt && stand && !oeffnet.current) oeffneWelt(platzkennung(stand));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bereit, zurueckInDieWelt, stand]);

  // Hat ein anderer Tab einen anderen Stand geladen oder diesen gelöscht, zurück ins Hauptmenü:
  // sonst spielte dieser Tab plötzlich mit fremdem Stand weiter.
  const fremd = wahl === "welt" && (stand === null || platzkennung(stand) !== eingetreten);
  useEffect(() => {
    if (fremd) beendeSitzung();
  }, [fremd]);
  const ansicht: Ansicht = (bereit && !zurueckInDieWelt) || fremd ? ohneWelt(anzahl) : wahl;

  /** Zurück ins Hauptmenü (Spielmenü); der Stand ist schon gespeichert. */
  const zumHauptmenue = () => {
    beendeSitzung();
    setzeEingetreten(null);
    setzeAnsicht(ohneWelt(anzahl));
  };
  return { ansicht, setzeAnsicht, Oberwelt, oeffneWelt, meldeLadefehler, zumHauptmenue };
}

/** Die Zusatzansicht: Startbild, Hauptmenü, Startkarte oder, mit Paket und Spielstand, die Oberwelt. */
export function AbenteuerAnsicht({ wert }: { readonly wert: string | null }) {
  const dienste = useAppdienste();
  const { zurueck } = useNavigation();
  const stand = useAbenteuerstand();
  const plaetze = useSpeicherplaetze();
  const paket = usePaketzustand(dienste, stand);
  const einstieg = useEinstieg(dienste, stand, paket, plaetze);
  const { ansicht, setzeAnsicht, Oberwelt } = einstieg;
  const [menue, setzeMenue] = useState(false);
  const [startbild, setzeStartbild] = useState(startbildFaellig);
  const pixelrahmen = usePixelrahmen();
  // Steuerkreuz rechts oder links (docs/spiel/30): bedienung.css legt danach die Knöpfe.
  const { abenteuersteuerkreuz } = useEinstellungen();
  // Wahl für ein neues Spiel; ein leerer Name heißt „Du“.
  const [neuerName, setzeNeuenNamen] = useState("");
  const [neueFigur, setzeNeueFigur] = useState<Heldfigur>(ERSATZFIGUR);
  const [neueRivalin, setzeNeueRivalin] = useState(false);
  // Musik und Geräusche des Abenteuers (ton/): Einstellungen anwenden, beim Verlassen ausblenden.
  useAbenteuerton();
  useAktton(stand?.handlung.akt ?? 1); // Ton des Akts im Hintergrund (paket/aktton.ts)
  useEffect(() => {
    if (startbild) startbildGelaufen = true;
  }, [startbild]);

  /** Ein eingegebener Name, bereinigt; leer → „Du“. */
  const bereinigt = (name: string) =>
    name.trim().slice(0, NAME_HOECHSTENS) || t("abenteuer.heldname");

  /** Benennt den Helden um (Spielmenü). */
  const benenneUm = (name: string) => {
    if (!stand) return;
    void dienste.schreibeStand({ ...stand, held: { ...stand.held, name: bereinigt(name) } });
    setzeMenue(false);
  };

  /** Neues Spiel aus der Startkarte: neuer Platz, der bisherige ruht. */
  const starteNeu = () => {
    const neu = neuerStand(dienste, bereinigt(neuerName), neueFigur, neueRivalin);
    void plaetze.beginne(neu).then(einstieg.oeffneWelt, einstieg.meldeLadefehler);
  };

  /** Fortsetzen oder Laden eines Platzes aus dem Hauptmenü. */
  const setzeFort = (kennung: string) => {
    void plaetze.lade(kennung).then(() => einstieg.oeffneWelt(kennung), einstieg.meldeLadefehler);
  };

  const zurApp = () => {
    beendeSitzung();
    zurueck();
  };

  const loesche = () => {
    void loeschePaket()
      .then(() => {
        setzeMenue(false);
        setzeAnsicht("einstieg");
        paket.setzeZustand({ art: "fehlt" });
      })
      .catch(einstieg.meldeLadefehler);
  };

  const inWelt = ansicht === "welt" && Oberwelt !== null && stand !== null;
  const imMenue = ansicht === "menue" && paket.da;
  // Startkarte mit Wahl: neues Spiel oder erster Start ohne Spielstand. Vor dem Einstieg mit
  // Spielstand (Paket fehlt noch) führt „Spielen“ in ihn.
  const neu = ansicht === "neu" || (ansicht === "einstieg" && !stand);
  return (
    <div
      className={`bildschirm bildschirm-abenteuer ${pixelrahmen?.klasse ?? ""}`}
      style={pixelrahmen?.stil}
      data-steuerkreuz={abenteuersteuerkreuz}
      data-testid="abenteuer"
    >
      {/* Im Hauptmenü stehen Einstellungen und der Weg zur App als eigene Knöpfe. */}
      {!imMenue && (
        <button
          type="button"
          className="abenteuer-menueknopf"
          aria-label={t("abenteuer.menue")}
          data-testid="abenteuer-menueknopf"
          onClick={() => setzeMenue(true)}
        >
          ☰
        </button>
      )}
      {inWelt ? (
        <Oberwelt key={platzkennung(stand)} wert={wert} />
      ) : imMenue ? (
        <Hauptmenue
          plaetze={plaetze.plaetze}
          bilder={paket.da}
          wege={{
            beiFortsetzen: setzeFort,
            beiNeu: () => setzeAnsicht("neu"),
            beiLoeschen: (kennung) => void plaetze.loesche(kennung),
            beiEinstellungen: () => setzeMenue(true),
            beiZurApp: zurApp,
          }}
        />
      ) : (
        <Startkarte
          zustand={paket.zustand}
          geprueft={paket.geprueft}
          name={neu ? neuerName : null}
          beiName={setzeNeuenNamen}
          figur={neueFigur}
          beiFigur={setzeNeueFigur}
          rivalin={neueRivalin}
          beiRivalin={setzeNeueRivalin}
          beiLaden={paket.lade}
          beiStart={neu || !stand ? starteNeu : () => einstieg.oeffneWelt(platzkennung(stand))}
          beiZurueck={
            ansicht === "neu" && plaetze.plaetze.length > 0
              ? () => setzeAnsicht("menue")
              : undefined
          }
        />
      )}
      <Ladestand />
      {menue && (
        <Spielmenue
          heldname={inWelt ? stand.held.name : null}
          figur={stand?.held.figur ?? ERSATZFIGUR}
          rivalin={rivalinGewaehlt(stand?.dialogvariablen ?? {})}
          beiSchliessen={() => setzeMenue(false)}
          beiZurueck={zurApp}
          beiName={benenneUm}
          beiHauptmenue={
            inWelt
              ? () => {
                  setzeMenue(false);
                  einstieg.zumHauptmenue();
                }
              : undefined
          }
          beiLoeschen={loesche}
        />
      )}
      {startbild && (
        <Startbild
          figur={plaetze.plaetze[0]?.stand.held.figur ?? ERSATZFIGUR}
          bilder={paket.da}
          beiEnde={() => setzeStartbild(false)}
        />
      )}
    </div>
  );
}
