/**
 * Der gemeinsame Kern der Oberwelt: Spielstand, geladene Welt, Phaser-Spiel, Meldung, Quest-
 * Ereignisse, Kartenwechsel und Tönung. Die Hooks der Oberwelt (usePartiestart, useAufgabenrunde,
 * useDialogende, useWeltladen) bekommen ihn als Kontext.
 *
 * Rolle im Gesamtbild: Ausgelagert aus oberwelt/Oberwelt.tsx (Aufteilen, Schritt 3), damit der
 * Bildschirm unter die Größengrenze kommt. Rückrufe aus Phaser und Dialogen kommen außerhalb des
 * Zeichnens; sie lesen Stand und Welt deshalb über Refs (`standRef`, `weltRef`), die `schreibe` und
 * das Laden der Welt sofort fortschreiben.
 * Meldungen warten, solange ein Dialog offen ist (meldungsstau.ts, `dialogOffen`).
 * Abhängigkeiten: regeln/quests.ts, regeln/wertung.ts, regeln/karten.ts, oberwelt/weltdaten.ts,
 * oberwelt/meldungsstau.ts.
 */
import { useEffect, useRef, useState, type RefObject } from "react";
import type Phaser from "phaser";
import { findeKarte } from "../daten/laden";
import { appdienste } from "../modul/abenteuer";
import { liesPaketJson } from "../paket/paketlader";
import { wendeWirkungenAn, werteEreignisAus, type Questereignis } from "../regeln/quests";
import { mitAppWertung } from "../regeln/wertung";
import type { Appdienste } from "../schnittstelle/modul";
import type { Abenteuerstand, Weltposition } from "../schnittstelle/spielstand";
import { tSpiel } from "../texte/texte";
import { LEERER_STAU, mitMeldung, nachDialog, ohneGezeigte } from "./meldungsstau";
import { szeneVon } from "./oberweltspiel";
import type { Toenung } from "./toenung";
import { ankunftsort } from "./ankunft";
import { standFuerNeuaufbau } from "./neuaufbau";
import type { Sperrangabe, Tiledkarte } from "./begehbar";
import { objektposition, type Weltdaten } from "./weltdaten";

/** Was alle Teile der Oberwelt teilen. */
export interface Oberweltkern {
  readonly dienste: Appdienste;
  /** Der Spielstand zum Zeichnen; null ohne Spielstand (dann zeigt die Oberwelt nur einen Satz). */
  readonly stand: Abenteuerstand | null;
  /** Der Spielstand für Rückrufe, immer der zuletzt geschriebene. */
  readonly standRef: RefObject<Abenteuerstand | null>;
  /** Die Welt, solange sie zur Karte des Spielstands gehört (ein Kartenwechsel lädt neu). */
  readonly welt: Weltdaten | null;
  readonly weltRef: RefObject<Weltdaten | null>;
  readonly setzeWelt: (w: Weltdaten) => void;
  readonly spiel: RefObject<Phaser.Game | null>;
  readonly meldung: string | null;
  /** Bild zur Meldung im Zusatzpaket (Fundbild), sonst null. */
  readonly meldungsbild: string | null;
  /**
   * Zeigt eine Meldung, optional mit Bild; null schließt sie samt Bild. Solange ein Dialog offen
   * ist, wartet sie und erscheint danach (meldungsstau.ts).
   */
  readonly setzeMeldung: (text: string | null, bild?: string) => void;
  /** Sagt dem Kern, ob ein Dialog offen ist; nach dem Dialog erscheinen die wartenden Meldungen. */
  readonly dialogOffen: (offen: boolean) => void;
  /** Schreibt den Spielstand in die App und merkt ihn hier. */
  readonly schreibe: (neu: Abenteuerstand) => void;
  /** Merkt einen Stand hier, ohne ihn zu schreiben (der Aufrufer schreibt und wartet darauf). */
  readonly merke: (neu: Abenteuerstand) => void;
  /** Ein Ereignis der Welt: Quests fortschreiben, Wirkungen anwenden, Meldung zeigen. */
  readonly melde: (ereignis: Questereignis, w?: Weltdaten | null) => void;
  /** Wechselt auf eine andere Karte: Der Held erscheint auf dem Zielauslöser. */
  readonly wechsleKarte: (karte: string, ausloeser: string) => void;
  /** Tönung der Karte, die gerade gilt (toenung.ts); Sepia wirkt als CSS-Filter wie Erinnerungen. */
  readonly toenung: Toenung | null;
  /** Neue Tönung zeigen: Zustand der Hülle und, wenn sie läuft, die Szene. */
  readonly zeigeToenung: (t: Toenung | null) => void;
  /** Die Position des Helden gerade jetzt (aus der Szene, sonst aus dem Spielstand). */
  readonly position: (aktuell: Abenteuerstand) => Weltposition;
  /** Zähler der Neuaufbauten derselben Karte (nach dem Warten, useWarten.ts). */
  readonly aufbau: number;
  /**
   * Baut die Karte neu auf (Statisten nach der Spieluhr, Figuren nach einem Gespräch); der Held
   * bleibt, wo er steht: Das Feld aus der Szene kommt vorher in den Stand (neuaufbau.ts).
   */
  readonly stelleNeuAuf: () => void;
}

/** Die Szene des laufenden Spiels oder null. */
export function szeneAus(spiel: RefObject<Phaser.Game | null>) {
  return spiel.current ? szeneVon(spiel.current) : null;
}

/**
 * Wertung A folgt der App (R2). Lernkarten gibt es seit RO11 (15.11.2026) nur noch im Spiel selbst,
 * als Lohn der passenden Lektion (Dialoge, docs/spiel/11, Abschnitt 5), nicht mehr für Buchkapitel.
 */
function useAufbaupruefungen(k: Oberweltkern): void {
  useEffect(() => {
    const aktuell = k.standRef.current;
    if (!aktuell) return;
    const neu = mitAppWertung(aktuell, k.dienste.wertung());
    if (neu !== aktuell) k.schreibe(neu);
    // Nur beim Aufbau; danach ändert nur die Oberwelt den Stand.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/** Quest-Ereignis auswerten (regeln/quests.ts) und die erste Meldung zeigen. */
function meldeEreignis(
  k: Pick<Oberweltkern, "standRef" | "schreibe" | "setzeMeldung">,
  ereignis: Questereignis,
  welt: Weltdaten,
): void {
  const aktuell = k.standRef.current;
  if (!aktuell) return;
  const jetzt = new Date();
  const q = werteEreignisAus(aktuell, welt.daten.quests, ereignis, jetzt);
  if (q.begonnen.length === 0 && q.erledigt.length === 0 && q.fortgeschritten.length === 0) {
    return;
  }
  k.schreibe(wendeWirkungenAn(q.stand, q.wirkungen, jetzt));
  const titel = (kennung: string) =>
    tSpiel(welt.daten.quests.find((x) => x.kennung === kennung)?.titel ?? kennung);
  if (q.erledigt.length > 0) {
    k.setzeMeldung(tSpiel("quest.erledigt", { titel: titel(q.erledigt[0] ?? "") }));
  } else if (q.begonnen.length > 0) {
    k.setzeMeldung(tSpiel("quest.begonnen", { titel: titel(q.begonnen[0] ?? "") }));
  }
}

/** Kantenlänge einer Kachel der Tiled-Karten in Pixeln (wie in szene.ts). */
const KACHEL = 16;

/** Kartenwechsel: Zielkarte lesen, Auslöser suchen, Position schreiben. */
function wechsle(k: Oberweltkern, karte: string, ausloeser: string): void {
  const aktuell = k.standRef.current;
  const welt = k.weltRef.current;
  if (!aktuell || !welt) return;
  const ziel = findeKarte(welt.daten, karte);
  if (!ziel) {
    k.setzeMeldung(tSpiel("oberwelt.karteFehlt", { karte }));
    return;
  }
  const szene = szeneAus(k.spiel);
  const richtung = szene?.position().richtung ?? aktuell.position.richtung;
  // Möbel bestimmen mit, wo neben dem Durchgang Platz ist; ohne Liste zählen nur die Wände.
  const moebel = liesPaketJson<{ moebel: Record<string, Sperrangabe> }>("daten/moebel.json")
    .then((d) => d.moebel)
    .catch(() => ({}));
  Promise.all([liesPaketJson<Tiledkarte>(ziel.karte.datei), moebel])
    .then(([json, liste]) => {
      // Ankunft vor dem Durchgang mit Blick von ihm weg (ankunft.ts), sonst der Start der Karte.
      const an = ankunftsort(json, liste, ausloeser, KACHEL);
      const start = an ? null : objektposition(json, "start");
      if (!an && !start) throw new Error(`Auslöser ${ausloeser} fehlt auf ${karte}`);
      const position: Weltposition = an
        ? { karte, x: an.x, y: an.y, richtung: an.richtung }
        : { karte, x: start?.x ?? 0, y: start?.y ?? 0, richtung };
      // Dieselbe Karte (Steg über die Schleuse): nur versetzen, die Szene bleibt geladen.
      if (karte === aktuell.position.karte) szene?.versetze(position.x, position.y);
      k.schreibe({ ...aktuell, position });
    })
    .catch(() => k.setzeMeldung(tSpiel("oberwelt.karteFehlt", { karte })));
}

/**
 * Baut den Kern beim Aufbau der Oberwelt. Beispiel: `k.melde({ art: "ort", karte })` schreibt
 * eine begonnene Quest in den Stand und zeigt „Neue Aufgabe: …“.
 */
export function useOberweltkern(): Oberweltkern {
  const dienste = appdienste();
  const [stand, setzeStand] = useState<Abenteuerstand | null>(() => dienste.liesStand());
  const [geladeneWelt, setzeWelt] = useState<Weltdaten | null>(null);
  const [stau, setzeStau] = useState(LEERER_STAU);
  // Ob ein Dialog offen ist: als Ref, weil Meldungen aus Rückrufen von Ink kommen, bevor React
  // den offenen Dialog gezeichnet hat.
  const imDialog = useRef(false);
  const setzeMeldung = (text: string | null, bild?: string) => {
    const offen = imDialog.current;
    if (text === null) setzeStau((s) => ohneGezeigte(s, offen));
    else setzeStau((s) => mitMeldung(s, { text, ...(bild ? { bild } : {}) }, offen));
  };
  const dialogOffen = (offen: boolean) => {
    imDialog.current = offen;
    if (!offen) setzeStau(nachDialog);
  };
  const meldung = stau.gezeigt?.text ?? null;
  const meldungsbild = stau.gezeigt?.bild ?? null;
  const [toenung, setzeToenung] = useState<Toenung | null>(null);
  const [aufbau, setzeAufbau] = useState(0);
  const spiel = useRef<Phaser.Game | null>(null);
  const standRef = useRef(stand);
  useEffect(() => {
    standRef.current = stand;
  }, [stand]);
  const welt = geladeneWelt && geladeneWelt.kennung === stand?.position.karte ? geladeneWelt : null;
  const weltRef = useRef<Weltdaten | null>(null);
  useEffect(() => {
    weltRef.current = welt;
  }, [welt]);
  const merke = (neu: Abenteuerstand) => {
    standRef.current = neu;
    setzeStand(neu);
  };
  // Ein Stand, den ein anderer Tab (oder die App selbst) geschrieben hat, gilt auch hier. Ohne
  // das überschrieb ein zweiter, älterer Tab beim nächsten Schreiben die Partie, die im ersten
  // begonnen hatte (Affentest 14.11.2026: Reise im alten Tab, `laufendePartie` weg). Eigene
  // Stände kommen als dasselbe Objekt zurück und ändern nichts. Die Hülle zeichnet die Oberwelt
  // bei jeder Änderung des Spielstands neu; deshalb genügt das Lesen beim Zeichnen.
  const aussen = dienste.liesStand();
  useEffect(() => {
    if (aussen && aussen !== standRef.current) merke(aussen);
  }, [aussen]);
  const schreibe = (neu: Abenteuerstand) => {
    merke(neu);
    void dienste.schreibeStand(neu);
  };
  const k: Oberweltkern = {
    dienste,
    stand,
    standRef,
    welt,
    weltRef,
    setzeWelt: (w) => {
      weltRef.current = w;
      setzeWelt(w);
    },
    spiel,
    meldung,
    meldungsbild,
    setzeMeldung,
    dialogOffen,
    schreibe,
    merke,
    melde: (ereignis, w = weltRef.current) => {
      if (w) meldeEreignis({ standRef, schreibe, setzeMeldung }, ereignis, w);
    },
    wechsleKarte: (karte, ausloeser) => wechsle(k, karte, ausloeser),
    toenung,
    zeigeToenung: (t) => {
      setzeToenung(t);
      szeneAus(spiel)?.setzeToenung(t);
    },
    position: (aktuell) => {
      const szene = szeneAus(spiel);
      return szene ? { ...szene.position(), karte: aktuell.position.karte } : aktuell.position;
    },
    aufbau,
    // Erst das Feld aus der Szene in den Stand (neuaufbau.ts): Sonst stellt der Neuaufbau den
    // Helden dorthin, wo er die Karte betreten hat (Juno an der Haltestelle, 28.11.2026).
    stelleNeuAuf: () => {
      const aktuell = standRef.current;
      const szene = szeneAus(spiel);
      const karte = weltRef.current?.kennung;
      if (aktuell && szene && karte) {
        const neu = standFuerNeuaufbau(aktuell, { ...szene.position(), karte });
        if (neu !== aktuell) schreibe(neu);
      }
      setzeAufbau((n) => n + 1);
    },
  };
  useAufbaupruefungen(k);
  return k;
}
