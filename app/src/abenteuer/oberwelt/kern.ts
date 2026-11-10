/**
 * Der gemeinsame Kern der Oberwelt: Spielstand, geladene Welt, Phaser-Spiel, Meldung, Quest-
 * Ereignisse und Kartenwechsel. Die Hooks der Oberwelt (usePartiestart, useAufgabenrunde,
 * useDialogende, useWeltladen) bekommen ihn als Kontext.
 *
 * Rolle im Gesamtbild: Ausgelagert aus oberwelt/Oberwelt.tsx (Aufteilen, Schritt 3), damit der
 * Bildschirm unter die Größengrenze kommt. Rückrufe aus Phaser und Dialogen kommen außerhalb des
 * Zeichnens; sie lesen Stand und Welt deshalb über Refs (`standRef`, `weltRef`), die `schreibe` und
 * das Laden der Welt sofort fortschreiben.
 * Abhängigkeiten: regeln/quests.ts, regeln/wertung.ts, regeln/karten.ts, oberwelt/weltdaten.ts.
 */
import { useEffect, useRef, useState, type RefObject } from "react";
import type Phaser from "phaser";
import { findeKarte } from "../daten/laden";
import { appdienste } from "../modul/abenteuer";
import { liesPaketJson } from "../paket/paketlader";
import { mitLernkarten } from "../regeln/karten";
import { wendeWirkungenAn, werteEreignisAus, type Questereignis } from "../regeln/quests";
import { mitAppWertung } from "../regeln/wertung";
import type { Kartensorte } from "../schnittstelle/karten";
import type { Appdienste } from "../schnittstelle/modul";
import type { Abenteuerstand, Weltposition } from "../schnittstelle/spielstand";
import { tSpiel } from "../texte/texte";
import { szeneVon } from "./oberweltspiel";
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
  readonly setzeMeldung: (text: string | null) => void;
  /** Schreibt den Spielstand in die App und merkt ihn hier. */
  readonly schreibe: (neu: Abenteuerstand) => void;
  /** Merkt einen Stand hier, ohne ihn zu schreiben (der Aufrufer schreibt und wartet darauf). */
  readonly merke: (neu: Abenteuerstand) => void;
  /** Ein Ereignis der Welt: Quests fortschreiben, Wirkungen anwenden, Meldung zeigen. */
  readonly melde: (ereignis: Questereignis, w?: Weltdaten | null) => void;
  /** Wechselt auf eine andere Karte: Der Held erscheint auf dem Zielauslöser. */
  readonly wechsleKarte: (karte: string, ausloeser: string) => void;
  /** Die Position des Helden gerade jetzt (aus der Szene, sonst aus dem Spielstand). */
  readonly position: (aktuell: Abenteuerstand) => Weltposition;
}

/** Die Szene des laufenden Spiels oder null. */
export function szeneAus(spiel: RefObject<Phaser.Game | null>) {
  return spiel.current ? szeneVon(spiel.current) : null;
}

/** Wertung A folgt der App (R2); Lernkarten für fertige Buchkapitel (docs/spiel/11, 5). */
function useAufbaupruefungen(k: Oberweltkern): void {
  useEffect(() => {
    const aktuell = k.standRef.current;
    if (!aktuell) return;
    const neu = mitAppWertung(aktuell, k.dienste.wertung());
    if (neu !== aktuell) k.schreibe(neu);
    // Nur beim Aufbau; danach ändert nur die Oberwelt den Stand.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const lernkartenGeprueft = useRef(false);
  const welt = k.welt;
  useEffect(() => {
    const aktuell = k.standRef.current;
    if (!welt || !aktuell || lernkartenGeprueft.current) return;
    lernkartenGeprueft.current = true;
    const sorten = welt.daten.karten as unknown as readonly Kartensorte[];
    const ergebnis = mitLernkarten(aktuell, k.dienste.fertigeKapitel(), sorten, new Date());
    const erste = ergebnis.neu[0];
    if (!erste) return;
    k.schreibe(ergebnis.stand);
    k.setzeMeldung(
      tSpiel("karte.lernkarte", {
        kapitel: erste.kapitel ?? 0,
        karte: tSpiel(erste.name),
        satz: tSpiel(`karte.${erste.kennung}.geschenkt`),
      }),
    );
    // Einmal je Aufbau, sobald die Welt da ist.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [welt]);
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
  liesPaketJson<object>(ziel.karte.datei)
    .then((json) => {
      const pos = objektposition(json, ausloeser) ?? objektposition(json, "start");
      if (!pos) throw new Error(`Auslöser ${ausloeser} fehlt auf ${karte}`);
      const position: Weltposition = { karte, x: pos.x, y: pos.y, richtung };
      // Dieselbe Karte (Steg über die Schleuse): nur versetzen, die Szene bleibt geladen.
      if (karte === aktuell.position.karte) szene?.versetze(pos.x, pos.y);
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
  const [meldung, setzeMeldung] = useState<string | null>(null);
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
    setzeMeldung,
    schreibe,
    merke,
    melde: (ereignis, w = weltRef.current) => {
      if (w) meldeEreignis({ standRef, schreibe, setzeMeldung }, ereignis, w);
    },
    wechsleKarte: (karte, ausloeser) => wechsle(k, karte, ausloeser),
    position: (aktuell) => {
      const szene = szeneAus(spiel);
      return szene ? { ...szene.position(), karte: aktuell.position.karte } : aktuell.position;
    },
  };
  useAufbaupruefungen(k);
  return k;
}
