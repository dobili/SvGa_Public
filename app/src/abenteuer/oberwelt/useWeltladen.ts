/**
 * Welt laden und Phaser starten, je Karte des Spielstands: erster Besuch eines Ortes (W2), Quest-
 * Ereignis „Karte betreten“, Tönung, Laterne und Fahrrad; beim Verlassen Position und Spielzeit
 * sichern und die Karte abbauen. Das Phaser-Spiel bleibt über alle Karten dasselbe
 * (oberweltspiel.ts); beim Verlassen der Oberwelt schläft es.
 *
 * Rolle im Gesamtbild: Ausgelagert aus oberwelt/Oberwelt.tsx (Aufteilen, Schritt 6). Arbeitet auf
 * dem gemeinsamen Kern (kern.ts); was beim Betreten noch geschehen soll (Ergebnisse melden, die auf
 * die Welt gewartet haben), gibt die Oberwelt als `beiWelt` mit.
 * Abhängigkeiten: oberwelt/weltdaten.ts, oberwelt/oberweltspiel.ts, oberwelt/toenung.ts,
 * oberwelt/einschluss.ts (Schutz vor dem Einschluss beim Laden), oberwelt/sicherungswunsch.ts
 * (Stand von jetzt für „Speichern“ im Spielmenü).
 */
import { liesPaketJson } from "../paket/paketlader";
import { geraeuschquellenAus } from "../ton/geraeuschraum";
import { klangorte } from "../ton/klangquelle";
import type { Sperrangabe, Tiledkarte } from "./begehbar";
import { ausEinschluss } from "./einschluss";
import { istTeilchenart } from "./teilchen";
import { tonregie } from "../ton/tonregie";
import { ladeNachbarmusikVorab } from "../ton/vorabladen";
import { useEffect, useState, type RefObject } from "react";
import type Phaser from "phaser";
import { variablenAusBesitz, variablenNachBesuch } from "../regeln/dialogvariablen";
import type { Abenteuerstand } from "../schnittstelle/spielstand";
import { fehlertext } from "../texte/texte";
import { szeneAus, type Oberweltkern } from "./kern";
import { legeSchlafen, raeumeKarteAb, zeigeKarte } from "./oberweltspiel";
import { KACHEL, type Ausloesertreffer } from "./szene";
import { phase, stundeJetzt } from "../regeln/spieluhr";
import { toenungJetzt } from "./uhrtoenung";
import { BELEBUNG_EREIGNIS } from "./belebungsschicht";
import { figurennamen, KACHELSATZ, ladeWelt, type Weltdaten } from "./weltdaten";
import { auftrittsplan, type Aufstellung } from "../regeln/auftritt";
import { gemerkteAufstellung, merkeAufstellung } from "./auftrittsgedaechtnis";
import { INNEN_FIGURFAKTOR } from "./weltmassstab";
import { meldeStandquelle } from "./sicherungswunsch";

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

/**
 * Auftritte beim Aufbau (regeln/auftritt.ts): Vergleich mit der Aufstellung beim letzten Abbau
 * derselben Karte. Beispiel: nach dem gewonnenen Clubkampf kommt Pratt durch die Tür.
 */
function auftrittFuer(w: Weltdaten, vorher: Aufstellung | null) {
  const jetzt = figurennamen(w.karte).filter((n) => !w.auftritt.gehend.includes(n));
  const lage = {
    jetzt,
    gehend: w.auftritt.gehend,
    wartend: w.auftritt.wartend,
    geister: w.geister,
  };
  return { plan: auftrittsplan(vorher, w.kennung, lage), von: w.auftritt.von };
}

/** Beim Abbau: Wer sichtbar stand und wo, für die Auftritte beim nächsten Aufbau dieser Karte. */
function merkeAbbau(k: Oberweltkern, karte: string, platz: string): void {
  const figuren = szeneAus(k.spiel)?.aufstellung();
  if (figuren) merkeAufstellung({ karte, figuren }, platz);
}

/**
 * Zeigt eine geladene Welt im Phaser-Spiel der Oberwelt. Ausgabe: Abmelden der Hörer, die diese
 * Karte am Spiel angemeldet hat (das Spiel lebt länger als die Karte).
 */
function starteSpiel(
  k: Oberweltkern,
  a: Weltanschluss,
  w: Weltdaten,
  stand: Abenteuerstand,
  moebel: Readonly<Record<string, Sperrangabe>>,
  vorher: Aufstellung | null,
): () => void {
  const rahmen = a.rahmen.current;
  if (!rahmen) return () => undefined;
  const uebergaenge = w.ort.ausloeser
    .filter((x) => x.art === "uebergang" && (!x.karte || x.karte === w.kennung))
    .map((x) => x.name);
  // Schutz vor dem Einschluss (einschluss.ts): Eine neue Fassung der Karte kann den Helden in
  // einer Nische einsperren (Clubraum nach Victor); dann rückt er auf das nächste freie Feld.
  const frei = ausEinschluss(w.karte as Tiledkarte, moebel, uebergaenge, stand.position, KACHEL);
  const start = frei ? { ...stand.position, ...frei } : stand.position;
  const eintrag = w.ort.karten.find((x) => x.kennung === w.kennung);
  // Licht aus orte.json (T6) vor der Tönung der Szene, beide vor der Spieluhr (uhrtoenung.ts).
  const toenung = toenungJetzt(w, stand);
  k.zeigeToenung(toenung);
  // Musik und Dauergeräusch der Karte aus orte.json (T1, T2); fehlt die Datei, bleibt es still.
  // Klangquellen mit Reichweite (T28): Ort aus dem benannten Objekt der Tiled-Karte. Woher das
  // Dauergeräusch kommt, steht in der Karte (Eigenschaft geraeuschquellen, ton/geraeuschraum.ts).
  // Nachts (Spieluhr) die Nachtfassung des Ortsthemas, wenn orte.json eine nennt (Klangplan A0).
  const nachts = phase(stundeJetzt(stand)) === "nacht";
  tonregie.karteBetreten(
    (nachts ? eintrag?.musik_nacht : undefined) ?? eintrag?.musik,
    eintrag?.geraeusch,
    klangorte(w.karte, eintrag?.klangquellen ?? [], KACHEL),
    geraeuschquellenAus(w.karte),
    // Spurenmischung (Klangplan A0.1): Innenräume dünner, Musiker aus geraeuschquellen.
    { kennung: w.kennung, innen: w.innen },
  );
  // Musik lädt erst beim Abspielen; die der Nachbarkarten schon jetzt (ton/vorabladen.ts).
  void ladeNachbarmusikVorab(w.kennung, w.karte, tonregie.hoerbar);
  // Für Prüfungen: Stunde und aufgestellte Statisten an der Welt (Spieluhr, belebungsschicht.ts).
  // Der Hörer kommt vor den Start der Szene: Liegt alles im Texturspeicher, meldet sie sofort.
  const welt = rahmen.parentElement;
  welt?.setAttribute("data-stunde", String(stundeJetzt(stand)));
  const statisten = (namen: string[]) => welt?.setAttribute("data-statisten", namen.join(","));
  const anmelden = (s: Phaser.Game) => s.events.on(BELEBUNG_EREIGNIS, statisten);
  const spiel = zeigeKarte(
    rahmen,
    {
      karte: w.karte,
      kachelbild: w.kachelbild,
      heldbild: w.heldbild,
      figurbild: w.figurbild,
      heldfigur: w.heldfigur,
      figurenbilder: w.figurenbilder,
      begleiter: w.begleiter,
      figurstandbilder: w.figurstandbilder,
      geister: w.geister,
      moebel: w.moebel,
      hintergrund: w.hintergrund,
      belebungsbilder: w.belebungsbilder,
      toenung,
      // Statisten nach der Spieluhr (regeln/spieluhr.ts), nur beim Aufbau der Karte.
      stunde: stundeJetzt(stand),
      // Teilchen der Karte aus orte.json (T8); Winterkarten haben Schnee.
      teilchen: istTeilchenart(eintrag?.teilchen) ? eintrag.teilchen : null,
      // Wer hereinkommt, hinausgeht oder wartet (auftrittsschicht.ts).
      auftritt: auftrittFuer(w, vorher),
      laterne: stand.gegenstaende.includes(LATERNE),
      jahreszeit: w.jahreszeit,
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
    },
    anmelden,
  );
  k.spiel.current = spiel;
  return () => spiel.events.off(BELEBUNG_EREIGNIS, statisten);
}

/**
 * Beim Verlassen einer Karte: Position, Spielzeit (gesamt und je Ort) und Zeitpunkt sichern.
 * Sonderfall: Gilt inzwischen ein anderer Spielstand (anderer Platz, etwa im Hauptmenü eines
 * anderen Tabs geladen, 27.11.2026), sichert der Abbau nichts: Sonst bekäme dieser Stand Feld und
 * Spielzeit des Helden aus dem alten, wenn beide auf derselben Karte stehen.
 */
function sichereSitzung(k: Oberweltkern, karte: string, begonnen: number, platz: string): void {
  const stand = standMitSitzung(k, karte, begonnen, platz);
  if (stand) void k.dienste.schreibeStand(stand);
}

/**
 * Der Stand mit Position, Spielzeit und Zeitpunkt von jetzt, ohne ihn zu schreiben (auch für eine
 * Sicherung des Lesers, sicherungswunsch.ts); null ohne Szene oder bei anderem Platz.
 */
function standMitSitzung(
  k: Oberweltkern,
  karte: string,
  begonnen: number,
  platz: string,
): Abenteuerstand | null {
  const szene = szeneAus(k.spiel);
  const aktuell = k.dienste.liesStand();
  if (!szene || !aktuell || aktuell.position.karte !== karte) return null;
  if (aktuell.begonnen !== platz) return null;
  const position = { ...szene.position(), karte };
  const sekunden = Math.round((Date.now() - begonnen) / MS_JE_SEKUNDE);
  const ort = karte.split(".")[0] ?? "";
  return {
    ...aktuell,
    position,
    spielzeitSekunden: aktuell.spielzeitSekunden + sekunden,
    // Für die Erinnerung nach einer Pause (regeln/wiedereinstieg.ts).
    zuletztGespielt: new Date().toISOString(),
    spielzeitJeOrt: {
      ...aktuell.spielzeitJeOrt,
      [ort]: (aktuell.spielzeitJeOrt[ort] ?? 0) + sekunden,
    },
  };
}

/**
 * Lädt die Welt zur Karte des Spielstands; gibt einen Ladefehler zurück (oder null).
 * Beispiel: Kartenwechsel von „mapleFalls.aussen“ nach „mapleFalls.club“ baut die Szene ab, sichert
 * die Spielzeit in Maple Falls und startet die Szene der neuen Karte im selben Spiel.
 */
export function useWeltladen(k: Oberweltkern, a: Weltanschluss): string | null {
  const [fehler, setzeFehler] = useState<string | null>(null);
  const karte = k.stand?.position.karte;
  const figur = k.stand?.held.figur;
  useEffect(() => {
    const stand = k.stand;
    if (!stand || !karte) return;
    let aktiv = true;
    let abmelden: (() => void) | null = null;
    // Beginn dieser Sitzung in der Welt, für die Spielzeit im Spielstand.
    let begonnen = Date.now();
    // Geht die App in den Hintergrund (Handy weggelegt, App gewechselt), sichern wir die Position
    // schon jetzt: Ein Handy beendet eine Seite im Hintergrund oft ohne Abbau, und der Held stand
    // danach wieder am Eingang der Karte (Spieltest „einstieg“, 15.11.2026).
    const beiSichtwechsel = () => {
      if (document.visibilityState !== "hidden") return;
      sichereSitzung(k, karte, begonnen, stand.begonnen);
      begonnen = Date.now();
    };
    document.addEventListener("visibilitychange", beiSichtwechsel);
    // Speichern im Spielmenü: der Stand von jetzt; er wird gleich geschrieben, die Spielzeit zählt
    // danach von vorn (sicherungswunsch.ts).
    meldeStandquelle(() => {
      const jetzt = standMitSitzung(k, karte, begonnen, stand.begonnen);
      if (jetzt) begonnen = Date.now();
      return jetzt;
    });
    // Zustände der Karte dürfen auch nach Besitz fragen (hatLaterne, Runde 8).
    const variablen = { ...stand.dialogvariablen, ...variablenAusBesitz(stand) };
    // Möbelliste für den Schutz vor dem Einschluss; fehlt sie, zählen nur die Wände.
    const moebelliste = liesPaketJson<{ moebel: Record<string, Sperrangabe> }>("daten/moebel.json")
      .then((d) => d.moebel)
      .catch(() => ({}));
    // Wer beim letzten Abbau dieser Karte stand (auftrittsgedaechtnis.ts), für die Auftritte.
    // Nur vom selben Spielstand (Platz = Beginn, anbindung/speicherplaetze.ts).
    const vorher = gemerkteAufstellung(stand.begonnen);
    Promise.all([ladeWelt(karte, stand.held.figur, variablen, stand, vorher), moebelliste])
      .then(([w, moebel]) => {
        if (!aktiv || !a.rahmen.current) return;
        k.setzeWelt(w);
        merkeBesuch(k, w);
        // Karte betreten (Quests), dann Ergebnisse, die auf die Welt gewartet haben.
        k.melde({ art: "ort", karte: w.kennung }, w);
        a.beiWelt(w);
        abmelden = starteSpiel(k, a, w, stand, moebel, vorher);
      })
      .catch((f: unknown) => setzeFehler(fehlertext(f)));
    return () => {
      aktiv = false;
      document.removeEventListener("visibilitychange", beiSichtwechsel);
      meldeStandquelle(null);
      sichereSitzung(k, karte, begonnen, stand.begonnen);
      merkeAbbau(k, karte, stand.begonnen);
      abmelden?.();
      if (k.spiel.current) raeumeKarteAb(k.spiel.current);
      k.spiel.current = null;
    };
    // Nur die Karte zählt: Ein Kartenwechsel baut die Welt neu auf, alles andere nicht; dazu das
    // Warten (useWarten.ts), das dieselbe Karte nach der neuen Uhrzeit aufstellt, und die Wahl
    // von Held oder Heldin im Spielmenü (neuer Bogen auf derselben Karte).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [karte, k.aufbau, figur]);
  // Die Oberwelt verlässt den Bildschirm (Partie, Startkarte): das Spiel schläft, statt zu enden.
  // Nach dem Effekt oben angemeldet, damit dessen Abbau (Position sichern) vorher läuft.
  useEffect(() => {
    return legeSchlafen;
  }, []);
  return fehler;
}
