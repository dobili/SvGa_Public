/**
 * Welt laden und Phaser starten, je Karte des Spielstands: erster Besuch eines Ortes (W2), Quest-
 * Ereignis „Karte betreten“, Tönung, Laterne und Fahrrad; beim Verlassen Position und Spielzeit
 * sichern und Phaser beenden.
 *
 * Rolle im Gesamtbild: Ausgelagert aus oberwelt/Oberwelt.tsx (Aufteilen, Schritt 6). Arbeitet auf
 * dem gemeinsamen Kern (kern.ts); was beim Betreten noch geschehen soll (Ergebnisse melden, die auf
 * die Welt gewartet haben), gibt die Oberwelt als `beiWelt` mit.
 * Abhängigkeiten: oberwelt/weltdaten.ts, oberwelt/oberweltspiel.ts, oberwelt/toenung.ts,
 * oberwelt/einschluss.ts (Schutz vor dem Einschluss beim Laden).
 */
import { liesPaketJson } from "../paket/paketlader";
import { klangorte } from "../ton/klangquelle";
import type { Sperrangabe, Tiledkarte } from "./begehbar";
import { ausEinschluss } from "./einschluss";
import { istTeilchenart } from "./teilchen";
import { tonregie } from "../ton/tonregie";
import { ladeNachbarmusikVorab } from "../ton/vorabladen";
import { useEffect, useState, type RefObject } from "react";
import { variablenAusBesitz, variablenNachBesuch } from "../regeln/dialogvariablen";
import type { Abenteuerstand } from "../schnittstelle/spielstand";
import { fehlertext } from "../texte/texte";
import { szeneAus, type Oberweltkern } from "./kern";
import { beendeOberwelt, starteOberwelt } from "./oberweltspiel";
import { KACHEL, type Ausloesertreffer } from "./szene";
import { aktuelleToenung } from "./toenung";
import { KACHELSATZ, ladeWelt, type Weltdaten } from "./weltdaten";
import { INNEN_FIGURFAKTOR } from "./weltmassstab";

/** Gegenstand für den Lichtkreis auf dunklen Karten (Sperren S4, S9, S11, S14). */
const LATERNE = "laterne";
/** Gegenstand Fahrrad und sein Tempofaktor draußen (docs/spiel/08, W3). */
const FAHRRAD = "fahrrad";
const FAHRRAD_TEMPO = 2;
const MS_JE_SEKUNDE = 1000;

/** Was die Oberwelt beim Laden mitgibt. */
export interface Weltanschluss {
  /** Der Rahmen, in den Phaser zeichnet. */
  readonly rahmen: RefObject<HTMLDivElement | null>;
  /** Verstecktes Feld mit der Kachel des Helden (für Oberflächentests). */
  readonly kachelanzeige: RefObject<HTMLSpanElement | null>;
  readonly beiTreffer: (t: Ausloesertreffer | null) => void;
  /** Die Welt ist da: Ergebnisse melden, die auf sie gewartet haben. */
  readonly beiWelt: (w: Weltdaten) => void;
}

/** Erster Besuch eines Ortes (W2): merken, Dialogvariable `besucht<Ort>` für den Bus. */
function merkeBesuch(k: Oberweltkern, w: Weltdaten): void {
  const aktuell = k.standRef.current;
  if (!aktuell || aktuell.besuchteOrte.includes(w.ort.kennung)) return;
  k.schreibe({
    ...aktuell,
    besuchteOrte: [...aktuell.besuchteOrte, w.ort.kennung],
    dialogvariablen: { ...aktuell.dialogvariablen, ...variablenNachBesuch(w.ort.kennung) },
  });
}

/** Startet Phaser für eine geladene Welt. */
function starteSpiel(
  k: Oberweltkern,
  a: Weltanschluss,
  w: Weltdaten,
  stand: Abenteuerstand,
  moebel: Readonly<Record<string, Sperrangabe>>,
) {
  const rahmen = a.rahmen.current;
  if (!rahmen) return;
  const uebergaenge = w.ort.ausloeser
    .filter((x) => x.art === "uebergang" && (!x.karte || x.karte === w.kennung))
    .map((x) => x.name);
  // Schutz vor dem Einschluss (einschluss.ts): Eine neue Fassung der Karte kann den Helden in
  // einer Nische einsperren (Clubraum nach Victor); dann rückt er auf das nächste freie Feld.
  const frei = ausEinschluss(w.karte as Tiledkarte, moebel, uebergaenge, stand.position, KACHEL);
  const start = frei ? { ...stand.position, ...frei } : stand.position;
  const eintrag = w.ort.karten.find((x) => x.kennung === w.kennung);
  // Licht aus orte.json (T6) vor der Tönung der Szene.
  const toenung = aktuelleToenung(w.karte, w.kennung, stand.dialogvariablen, eintrag);
  k.zeigeToenung(toenung);
  // Musik und Dauergeräusch der Karte aus orte.json (T1, T2); fehlt die Datei, bleibt es still.
  // Klangquellen mit Reichweite (T28): Ort aus dem benannten Objekt der Tiled-Karte.
  tonregie.karteBetreten(
    eintrag?.musik,
    eintrag?.geraeusch,
    klangorte(w.karte, eintrag?.klangquellen ?? [], KACHEL),
  );
  // Musik lädt erst beim Abspielen; die der Nachbarkarten schon jetzt (ton/vorabladen.ts).
  void ladeNachbarmusikVorab(w.kennung, w.karte, tonregie.hoerbar);
  k.spiel.current = starteOberwelt(rahmen, {
    karte: w.karte,
    kachelbild: w.kachelbild,
    heldbild: w.heldbild,
    figurbild: w.figurbild,
    heldfigur: w.heldfigur,
    figurenbilder: w.figurenbilder,
    geister: w.geister,
    moebel: w.moebel,
    hintergrund: w.hintergrund,
    belebungsbilder: w.belebungsbilder,
    toenung,
    // Teilchen der Karte aus orte.json (T8); Winterkarten haben Schnee.
    teilchen: istTeilchenart(eintrag?.teilchen) ? eintrag.teilchen : null,
    laterne: stand.gegenstaende.includes(LATERNE),
    winter: w.winter,
    kachelsatz: KACHELSATZ,
    start,
    // Übergänge dieser Karte: Sie wechseln erst beim Gehen in den Durchgang (R060).
    uebergaenge,
    // Fahrrad (docs/spiel/08, W3): doppeltes Tempo draußen.
    tempofaktor: !w.innen && stand.gegenstaende.includes(FAHRRAD) ? FAHRRAD_TEMPO : 1,
    // Rennen draußen zu Fuß (Wunsch des Autors, 21.11.2026; gangart.ts).
    rennenErlaubt: !w.innen && !stand.gegenstaende.includes(FAHRRAD),
    // Figuren innen größer (Wunsch des Autors, 20.11.2026; weltmassstab.ts).
    figurfaktor: w.innen ? INNEN_FIGURFAKTOR : 1,
    melder: {
      beiAusloeser: a.beiTreffer,
      beiKachel: (x, y) => {
        if (a.kachelanzeige.current) a.kachelanzeige.current.textContent = `${x},${y}`;
        tonregie.heldBei(x, y);
      },
      // An der Welt: Hinweise und Meldungen legen sich an den Rand fern vom Helden (CSS).
      beiHeldhaelfte: (h) => a.kachelanzeige.current?.parentElement?.setAttribute("data-held", h),
    },
  });
}

/** Beim Verlassen einer Karte: Position, Spielzeit (gesamt und je Ort) und Zeitpunkt sichern. */
function sichereSitzung(k: Oberweltkern, karte: string, begonnen: number): void {
  const szene = szeneAus(k.spiel);
  const aktuell = k.dienste.liesStand();
  if (!szene || !aktuell || aktuell.position.karte !== karte) return;
  const position = { ...szene.position(), karte };
  const sekunden = Math.round((Date.now() - begonnen) / MS_JE_SEKUNDE);
  const ort = karte.split(".")[0] ?? "";
  void k.dienste.schreibeStand({
    ...aktuell,
    position,
    spielzeitSekunden: aktuell.spielzeitSekunden + sekunden,
    // Für die Erinnerung nach einer Pause (regeln/wiedereinstieg.ts).
    zuletztGespielt: new Date().toISOString(),
    spielzeitJeOrt: {
      ...aktuell.spielzeitJeOrt,
      [ort]: (aktuell.spielzeitJeOrt[ort] ?? 0) + sekunden,
    },
  });
}

/**
 * Lädt die Welt zur Karte des Spielstands; gibt einen Ladefehler zurück (oder null).
 * Beispiel: Kartenwechsel von „mapleFalls.aussen“ nach „mapleFalls.club“ beendet Phaser, sichert
 * die Spielzeit in Maple Falls und startet die neue Karte.
 */
export function useWeltladen(k: Oberweltkern, a: Weltanschluss): string | null {
  const [fehler, setzeFehler] = useState<string | null>(null);
  const karte = k.stand?.position.karte;
  useEffect(() => {
    const stand = k.stand;
    if (!stand || !karte) return;
    let aktiv = true;
    // Beginn dieser Sitzung in der Welt, für die Spielzeit im Spielstand.
    let begonnen = Date.now();
    // Geht die App in den Hintergrund (Handy weggelegt, App gewechselt), sichern wir die Position
    // schon jetzt: Ein Handy beendet eine Seite im Hintergrund oft ohne Abbau, und der Held stand
    // danach wieder am Eingang der Karte (Spieltest „einstieg“, 15.11.2026).
    const beiSichtwechsel = () => {
      if (document.visibilityState !== "hidden") return;
      sichereSitzung(k, karte, begonnen);
      begonnen = Date.now();
    };
    document.addEventListener("visibilitychange", beiSichtwechsel);
    // Zustände der Karte dürfen auch nach Besitz fragen (hatLaterne, Runde 8).
    const variablen = { ...stand.dialogvariablen, ...variablenAusBesitz(stand) };
    // Möbelliste für den Schutz vor dem Einschluss; fehlt sie, zählen nur die Wände.
    const moebelliste = liesPaketJson<{ moebel: Record<string, Sperrangabe> }>("daten/moebel.json")
      .then((d) => d.moebel)
      .catch(() => ({}));
    Promise.all([ladeWelt(karte, stand.held.variante, variablen), moebelliste])
      .then(([w, moebel]) => {
        if (!aktiv || !a.rahmen.current) return;
        k.setzeWelt(w);
        merkeBesuch(k, w);
        // Karte betreten (Quests), dann Ergebnisse, die auf die Welt gewartet haben.
        k.melde({ art: "ort", karte: w.kennung }, w);
        a.beiWelt(w);
        starteSpiel(k, a, w, stand, moebel);
      })
      .catch((f: unknown) => setzeFehler(fehlertext(f)));
    return () => {
      aktiv = false;
      document.removeEventListener("visibilitychange", beiSichtwechsel);
      sichereSitzung(k, karte, begonnen);
      if (k.spiel.current) beendeOberwelt(k.spiel.current);
      k.spiel.current = null;
    };
    // Nur die Karte zählt: Ein Kartenwechsel baut die Welt neu auf, alles andere nicht.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [karte]);
  return fehler;
}
