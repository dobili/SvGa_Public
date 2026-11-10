/**
 * Aufgabenrunden und die besonderen Partieformen der Oberwelt: Start und Rückweg einer Runde
 * (Regelwerk R30 bis R32), Gedächtnisstellung und Simultan (Runde 6, partieformen.json). Alle drei
 * melden „bestanden“ als Quest-Ereignis `aufgaben` und setzen `<name>Bestanden`.
 *
 * Rolle im Gesamtbild: Ausgelagert aus oberwelt/Oberwelt.tsx (Aufteilen, Schritt 4). Arbeitet auf
 * dem gemeinsamen Kern (kern.ts) und startet Simultanbretter über usePartiestart.ts.
 * Abhängigkeiten: regeln/rueckweg.ts, regeln/simultan.ts, regeln/dialogvariablen.ts,
 * oberwelt/auftraege.ts.
 */
import { useEffect, useRef, useState } from "react";
import type { BesonderePartieformenDesSchachAbenteuers } from "../../daten/generiert/abenteuer-partieformen";
import { ladeSpieldaten } from "../daten/laden";
import { liesPaketJson } from "../paket/paketlader";
import { variablenNachRunde } from "../regeln/dialogvariablen";
import { standNachRunde, type Rundenrueckweg } from "../regeln/rueckweg";
import { laufendesSimultan, nachSimultanpartie, starteSimultan } from "../regeln/simultan";
import type { Aufgabenauftrag } from "../schnittstelle/aufgaben";
import type { Partieergebnis } from "../schnittstelle/partie";
import { tSpiel } from "../texte/texte";
import { auftragFuer, auftragFuerRunde } from "./auftraege";
import type { Oberweltkern } from "./kern";
import { begegnungVon, type Partien } from "./usePartiestart";
import type { Weltdaten } from "./weltdaten";

/** Ergebnis der zuletzt gespielten Runde für die Ergebniskarte (R31). */
export type Rundenergebnis = Rundenrueckweg & { readonly auftrag: Aufgabenauftrag };

/** Was die Oberwelt von Runden, Gedächtnisstellung und Simultan sieht und auslöst. */
export interface Runden {
  readonly rundenergebnis: Rundenergebnis | null;
  readonly schliesseRundenergebnis: () => void;
  /** Eine Runde, die in der App noch offen ist (ohne Ergebnis zurückgekommen). */
  readonly offeneRunde: Aufgabenauftrag | null;
  readonly brichRundeAb: () => void;
  readonly starteRunde: (runde: string) => void;
  /** Eine bestandene Runde als Quest-Ereignis, sobald die Welt da ist. */
  readonly meldeRunde: (w: Weltdaten) => void;
  /** Die Gedächtnisstellung, die gerade offen ist. */
  readonly gedaechtnis: string | null;
  readonly starteGedaechtnis: (kennung: string) => void;
  readonly beendeGedaechtnis: (kennung: string, bestanden: boolean) => void;
  readonly starteSimultan: (kennung: string) => void;
  /** Nach der Ergebniskarte im Simultan: das nächste Brett oder die Gesamtwertung. */
  readonly weiterImSimultan: (e: Partieergebnis) => void;
}

/** Das Simultan aus partieformen.json, oder null. */
function simultanEintrag(kennung: string) {
  return liesPaketJson<BesonderePartieformenDesSchachAbenteuers>("daten/partieformen.json").then(
    (alle) => alle.simultan.find((s) => s.kennung === kennung) ?? null,
  );
}

/** Rückweg der Runde (R31): Ergebnis auswerten, Rundenstand und Aufgabenreihe fortschreiben. */
function useRueckwegDerRunde(
  k: Oberweltkern,
  setzen: {
    readonly offen: (auftrag: Aufgabenauftrag) => void;
    readonly ergebnis: (e: Rundenergebnis) => void;
    readonly bestanden: (runde: string) => void;
  },
): void {
  useEffect(() => {
    const auftrag = k.stand?.laufendeAufgaben;
    if (!auftrag) return;
    void Promise.all([k.dienste.liesAufgabenergebnis(auftrag.kennung), ladeSpieldaten()]).then(
      ([ergebnis, daten]) => {
        const aktuell = k.standRef.current;
        if (!aktuell) return;
        if (!ergebnis) {
          setzen.offen(auftrag);
          return;
        }
        const r = standNachRunde(aktuell, auftrag, ergebnis, daten);
        setzen.ergebnis({ auftrag, ...r });
        k.schreibe(r.stand);
        if (r.bestanden) setzen.bestanden(auftrag.runde);
      },
    );
    // Nur beim Aufbau, wie der Rückweg der Partie.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/** Simultan: Start mit dem ersten Brett und Fortsetzung nach jeder Partie. */
function simultan(k: Oberweltkern, partie: Partien) {
  return {
    starte: (kennung: string) => {
      void simultanEintrag(kennung).then((eintrag) => {
        const aktuell = k.standRef.current;
        const erste = eintrag?.begegnungen[0];
        const welt = k.weltRef.current;
        if (!eintrag || !erste || !aktuell || !welt) return;
        const dialogvariablen = starteSimultan(aktuell.dialogvariablen, eintrag);
        const neu = { ...aktuell, dialogvariablen };
        k.schreibe(neu);
        const auftrag = auftragFuer(erste, welt.daten, neu);
        if (auftrag) partie.startePartie(auftrag, []);
      });
    },
    weiter: (e: Partieergebnis) => {
      const laeuft = laufendesSimultan(k.standRef.current?.dialogvariablen ?? {});
      if (!laeuft) return;
      void simultanEintrag(laeuft).then((eintrag) => {
        const aktuell = k.standRef.current;
        const welt = k.weltRef.current;
        if (!eintrag || !aktuell || !welt) return;
        const r = nachSimultanpartie(aktuell.dialogvariablen, eintrag, begegnungVon(e), e.ausgang);
        const neu = { ...aktuell, dialogvariablen: { ...r.variablen } };
        k.schreibe(neu);
        const auftrag = r.naechste ? auftragFuer(r.naechste, welt.daten, neu) : null;
        if (auftrag) partie.startePartie(auftrag, []);
        if (r.ende?.bestanden) k.melde({ art: "aufgaben", runde: eintrag.kennung });
        if (r.ende) {
          const werte = { punkte: r.ende.punkte, bretter: eintrag.begegnungen.length };
          k.setzeMeldung(tSpiel("oberwelt.simultan.ende", werte));
        }
      });
    },
  };
}

/**
 * Runden der Oberwelt. Beispiel: Nach dem Dialog mit Sam ruft die Oberwelt
 * `starteRunde("mapleFalls.reiheSam")`; die App spielt die Aufgaben, beim Rückweg zeigt die
 * Ergebniskarte das Ergebnis und eine bestandene Runde meldet `aufgaben` an die Quests.
 */
export function useAufgabenrunde(k: Oberweltkern, partie: Partien): Runden {
  const [rundenergebnis, setzeRundenergebnis] = useState<Rundenergebnis | null>(null);
  const [offeneRunde, setzeOffeneRunde] = useState<Aufgabenauftrag | null>(null);
  const [gedaechtnis, setzeGedaechtnis] = useState<string | null>(null);
  // Eine bestandene Runde, die als Quest-Ereignis noch auf die Welt wartet.
  const offeneRundenmeldung = useRef<string | null>(null);
  const meldeRunde = (w: Weltdaten) => {
    const runde = offeneRundenmeldung.current;
    if (!runde) return;
    offeneRundenmeldung.current = null;
    k.melde({ art: "aufgaben", runde }, w);
  };
  useRueckwegDerRunde(k, {
    offen: setzeOffeneRunde,
    ergebnis: setzeRundenergebnis,
    bestanden: (runde) => {
      offeneRundenmeldung.current = runde;
      if (k.weltRef.current) meldeRunde(k.weltRef.current);
    },
  });
  const s = simultan(k, partie);
  return {
    rundenergebnis,
    schliesseRundenergebnis: () => setzeRundenergebnis(null),
    offeneRunde,
    brichRundeAb: () => {
      setzeOffeneRunde(null);
      const aktuell = k.standRef.current;
      if (aktuell) k.schreibe({ ...aktuell, laufendeAufgaben: null });
    },
    // Position sichern, Auftrag an die App (sie merkt ihn im Stand).
    starteRunde: (runde) => {
      const aktuell = k.standRef.current;
      const welt = k.weltRef.current;
      if (!welt || !aktuell) return;
      const auftrag = auftragFuerRunde(runde, welt.daten, aktuell);
      if (!auftrag) {
        k.setzeMeldung(tSpiel("aufgaben.fehlt", { runde }));
        return;
      }
      const mitPosition = { ...aktuell, position: k.position(aktuell) };
      k.merke(mitPosition);
      setzeRundenergebnis(null);
      void k.dienste.schreibeStand(mitPosition).then(() => k.dienste.starteAufgaben(auftrag));
    },
    meldeRunde,
    gedaechtnis,
    starteGedaechtnis: setzeGedaechtnis,
    // `<name>Bestanden` wie bei Aufgabenrunden; Quests warten darauf (Vorschlag mittel-1).
    beendeGedaechtnis: (kennung, bestanden) => {
      setzeGedaechtnis(null);
      const aktuell = k.standRef.current;
      if (!aktuell) return;
      const dialogvariablen = {
        ...aktuell.dialogvariablen,
        ...variablenNachRunde(kennung, bestanden),
      };
      k.schreibe({ ...aktuell, dialogvariablen });
      if (bestanden) k.melde({ art: "aufgaben", runde: kennung });
    },
    starteSimultan: s.starte,
    weiterImSimultan: s.weiter,
  };
}
