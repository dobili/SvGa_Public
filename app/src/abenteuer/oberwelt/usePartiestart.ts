/**
 * Partien aus der Oberwelt, hin und zurück: Deckwahl, Start mit Karten (partiestart.ts),
 * Übungspartie mit dem Reisebrett, Rückweg mit Ergebniskarte, Nadel und Kipppunkt, Wiedereinstieg
 * (Regelwerk R14, R15, R20, R24).
 *
 * Rolle im Gesamtbild: Ausgelagert aus oberwelt/Oberwelt.tsx (Aufteilen, Schritt 3). Arbeitet auf
 * dem gemeinsamen Kern (kern.ts); die Oberwelt zeichnet Deckwahl und Ergebniskarte aus dem, was
 * dieser Hook zurückgibt.
 * Abhängigkeiten: regeln/rueckweg.ts, oberwelt/auftraege.ts, oberwelt/partiestart.ts.
 */
import { useEffect, useRef, useState } from "react";
import { ladeSpieldaten } from "../daten/laden";
import { standNachPartie } from "../regeln/rueckweg";
import type { Kartenspiel, Kartensorte } from "../schnittstelle/karten";
import type { Kipppunkt, Nadelstufe, Partieauftrag, Partieergebnis } from "../schnittstelle/partie";
import type { Partiekarten } from "../schnittstelle/spielstand";
import { tSpiel } from "../texte/texte";
import {
  amZugIn,
  auftragFuer,
  kartenFuerWiedereinstieg,
  wiedereinstiegMoeglich,
} from "./auftraege";
import type { Oberweltkern } from "./kern";
import { partiestart } from "./partiestart";
import type { Weltdaten } from "./weltdaten";

/** Begegnung des Reisebretts (docs/spiel/11, I3): Übungspartie gegen Ambrose. */
const UEBUNGSPARTIE = "reisebrett.ambrose";
/** Gegenstand „Lupe des Uhrmachers“ (docs/spiel/11, I1): Steckbrief vor jeder Partie. */
export const LUPE = "lupe";

/** Begegnung zu einer Partiekennung („mapleFalls.jo#3“ → „mapleFalls.jo“). */
export function begegnungVon(e: Partieergebnis): string {
  return e.kennung.split("#")[0] ?? "";
}

/** Was die Oberwelt von den Partien sieht und auslöst. */
export interface Partien {
  /** Eine Begegnung, für die der Leser gerade sein Deck wählt (R24). */
  readonly deckwahl: Partieauftrag | null;
  readonly brichDeckwahlAb: () => void;
  readonly ergebnis: Partieergebnis | null;
  readonly neueNadel: Nadelstufe | null;
  /** Kipppunkt der verlorenen Partie: „suche“, solange Ambrose nachsieht (R14). */
  readonly kipppunkt: Kipppunkt | "suche" | null;
  /** Eine Partie, die in der App noch läuft (ohne Ergebnis zurückgekommen). */
  readonly offenePartie: string | null;
  readonly startePartie: (
    auftrag: Partieauftrag,
    deck: readonly string[],
    schonGespielt?: readonly Kartenspiel[],
  ) => void;
  /** Nach einem Dialog: erst die Deckwahl, wenn es etwas zu wählen gibt, sonst sofort. */
  readonly waehleOderStarte: (auftrag: Partieauftrag) => void;
  readonly starteUebungspartie: () => void;
  readonly starteWiedereinstieg: (e: Partieergebnis, k: Kipppunkt) => void;
  readonly schliesseErgebnis: () => void;
  readonly gibOffenePartieAuf: () => void;
  /** Ein gelesenes Partieergebnis als Quest-Ereignis, sobald die Welt da ist. */
  readonly meldeErgebnis: (w: Weltdaten) => void;
  readonly gegnername: (e: Partieergebnis) => string;
}

/** Rückweg: Eine offene Partie ist beendet → Ergebnis in den Stand, Kipppunkt suchen. */
function useRueckwegDerPartie(
  k: Oberweltkern,
  setzen: {
    readonly ergebnis: (e: Partieergebnis) => void;
    readonly offen: (kennung: string) => void;
    readonly nadel: (n: Nadelstufe | null) => void;
    readonly kipppunkt: (k: Kipppunkt | "suche" | null) => void;
    readonly vorherigeKarten: (karten: Partiekarten | null) => void;
  },
): void {
  useEffect(() => {
    const kennung = k.stand?.laufendePartie;
    if (!kennung) return;
    void k.dienste.liesErgebnis(kennung).then((e) => {
      const aktuell = k.standRef.current;
      if (!aktuell) return;
      if (!e) {
        setzen.offen(kennung);
        return;
      }
      setzen.ergebnis(e);
      void ladeSpieldaten().then((daten) => {
        const r = standNachPartie(k.standRef.current ?? aktuell, e, daten);
        setzen.nadel(r.nadel);
        setzen.vorherigeKarten(aktuell.partiekarten);
        if (wiedereinstiegMoeglich(e, r.begegnung, daten, aktuell)) {
          setzen.kipppunkt("suche");
          void k.dienste
            .sucheKipppunkt(kennung)
            .then((p) => setzen.kipppunkt(p))
            .catch(() => setzen.kipppunkt(null));
        }
        k.schreibe(r.stand);
      });
    });
    // Nur beim Aufbau; der Spielstand ändert sich danach nur noch durch die Oberwelt.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/**
 * Partien der Oberwelt. Beispiel: Nach dem Dialog mit Jo ruft die Oberwelt
 * `waehleOderStarte(auftrag)`; mit Karten im Besitz erscheint die Deckwahl, sonst startet die
 * Partie sofort.
 */
export function usePartiestart(k: Oberweltkern): Partien {
  const [deckwahl, setzeDeckwahl] = useState<Partieauftrag | null>(null);
  const [ergebnis, setzeErgebnis] = useState<Partieergebnis | null>(null);
  const [neueNadel, setzeNeueNadel] = useState<Nadelstufe | null>(null);
  const [kipppunkt, setzeKipppunkt] = useState<Kipppunkt | "suche" | null>(null);
  const [offenePartie, setzeOffenePartie] = useState<string | null>(null);
  // Deck und gespielte Karten der gerade beendeten Partie, für den Wiedereinstieg (R15).
  const vorherigeKarten = useRef<Partiekarten | null>(null);
  // Ein gelesenes Partieergebnis, das noch auf die Welt wartet (Quest-Ereignis „partie“).
  const offenesErgebnis = useRef<Partieergebnis | null>(null);
  useRueckwegDerPartie(k, {
    ergebnis: (e) => {
      setzeErgebnis(e);
      offenesErgebnis.current = e;
    },
    offen: setzeOffenePartie,
    nadel: setzeNeueNadel,
    kipppunkt: setzeKipppunkt,
    vorherigeKarten: (karten) => {
      vorherigeKarten.current = karten;
    },
  });
  const sorten = () => (k.welt?.daten.karten ?? []) as unknown as readonly Kartensorte[];
  const schliesseErgebnis = () => {
    setzeErgebnis(null);
    setzeNeueNadel(null);
    setzeKipppunkt(null);
  };
  const startePartie: Partien["startePartie"] = (begegnung, deck, schonGespielt = []) => {
    const aktuell = k.standRef.current;
    if (!aktuell) return;
    const p = partiestart(aktuell, begegnung, deck, schonGespielt, sorten(), k.position(aktuell));
    k.merke(p.stand);
    setzeDeckwahl(null);
    void k.dienste.schreibeStand(p.stand).then(() => k.dienste.startePartie(p.auftrag));
  };
  return {
    deckwahl,
    brichDeckwahlAb: () => setzeDeckwahl(null),
    ergebnis,
    neueNadel,
    kipppunkt,
    offenePartie,
    startePartie,
    waehleOderStarte: (auftrag) => {
      const aktuell = k.standRef.current;
      if (!aktuell) return;
      const waehlen =
        (auftrag.kartenErlaubt && aktuell.karten.length > 0) ||
        auftrag.zeitwahl === true ||
        aktuell.gegenstaende.includes(LUPE) ||
        (auftrag.freieKarten?.length ?? 0) > 0;
      if (waehlen) setzeDeckwahl(auftrag);
      else startePartie(auftrag, []);
    },
    // Reisebrett (docs/spiel/11, I3): eine freie Übungspartie, mit Bedenkzeit und Karten.
    starteUebungspartie: () => {
      const aktuell = k.standRef.current;
      const auftrag = k.welt && aktuell && auftragFuer(UEBUNGSPARTIE, k.welt.daten, aktuell);
      if (auftrag) setzeDeckwahl(auftrag);
    },
    starteWiedereinstieg: (e, p) => {
      const aktuell = k.standRef.current;
      const auftrag = k.welt && aktuell && auftragFuer(begegnungVon(e), k.welt.daten, aktuell);
      if (!auftrag) return;
      const karten = kartenFuerWiedereinstieg(
        vorherigeKarten.current,
        e.gespielteKarten,
        p,
        sorten(),
      );
      schliesseErgebnis();
      startePartie(
        {
          ...auftrag,
          // Dieselbe Bedenkzeit wie in der verlorenen Partie (gewählt oder fest).
          uhr: vorherigeKarten.current?.uhr ?? auftrag.uhr,
          farbe: amZugIn(p.fen),
          format: { art: "wiedereinstieg", vorherigeKennung: e.kennung },
          startstellung: { art: "fen", fen: p.fen },
        },
        karten.deck,
        karten.gespielt,
      );
    },
    schliesseErgebnis,
    gibOffenePartieAuf: () => {
      setzeOffenePartie(null);
      const aktuell = k.standRef.current;
      if (aktuell) k.schreibe({ ...aktuell, laufendePartie: null });
    },
    meldeErgebnis: (w) => {
      const e = offenesErgebnis.current;
      if (!e) return;
      offenesErgebnis.current = null;
      const ausgang = e.ausgang === "abgebrochen" ? "niederlage" : e.ausgang;
      k.melde({ art: "partie", begegnung: begegnungVon(e), ausgang: [ausgang] }, w);
    },
    gegnername: (e) => {
      const daten = k.welt?.daten;
      const begegnung = daten?.begegnungen.find((b) => b.kennung === begegnungVon(e));
      const gegner = begegnung && daten?.gegner.find((g) => g.kennung === begegnung.gegner);
      return gegner ? tSpiel(gegner.name) : "";
    },
  };
}
