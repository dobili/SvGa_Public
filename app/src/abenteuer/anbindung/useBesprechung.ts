/**
 * Die Partiebesprechung als Hook: wertet die Partie aus (falls noch nicht geschehen), urteilt über
 * jeden Zug, wählt die Momente nach der Stufe und baut Ambroses Sätze.
 *
 * Rolle im Gesamtbild: Logik von anbindung/Besprechung.tsx (Entwurf docs/spiel/auftraege/
 * partiebesprechung_25-11.md). Die Auswertung ist die der App (useAuswertung: eigene Engine,
 * Zwischenspeicher je Stellung, Ergebnis im Speicher über mitWerten); Theoriezüge wie in der
 * Partieansicht der App (useTheorie, theorieJeZug). Stufe, Begriffe und Stimme kommen aus den
 * Dialogvariablen (regeln/besprechung.ts), die Themen der Runden aus den Spieldaten.
 * Abhängigkeiten: ui/komponenten/auswertung/useAuswertung.ts, ui/komponenten/rueckblick/useTheorie.ts,
 * spiel/auswertung.ts, schach/theorie.ts, regeln/besprechung*.ts, anbindung/besprechung*.ts.
 */
import { useEffect, useMemo, useState } from "react";
import { gambitJeZug } from "../../schach/theorienamen";
import { theorieJeZug, type Theoriequellen } from "../../schach/theorie";
import { zugurteile, type Zugklasse, type Zugurteil } from "../../spiel/auswertung";
import { stellungen } from "../../spiel/partie";
import type { Partieeintrag } from "../../speicher/partien";
import {
  useAuswertung,
  type Auswertungsstand,
} from "../../ui/komponenten/auswertung/useAuswertung";
import { useTheorie } from "../../ui/komponenten/rueckblick/useTheorie";
import { ladeSpieldaten } from "../daten/laden";
import {
  bekannteBegriffe,
  besprechungsstimme,
  besprechungsstufe,
  type Rundenthemen,
} from "../regeln/besprechung";
import { besprechungsmomente, type Besprechungsmoment } from "../regeln/besprechungsmomente";
import type { Abenteuerstand } from "../schnittstelle/spielstand";
import { momentangaben, momentpfeile, motivgrundlage } from "./besprechungsdaten";
import { zeigefolge, type Zeigefolge } from "./besprechungsfolge";
import {
  angebotssatz,
  auftaktsatz,
  momentsaetze,
  rechnetsatz,
  schlusssatz,
  type Besprechungskontext,
} from "./besprechungstexte";
import { ausgangAus } from "./partieergebnis";
import type { Markierung } from "../../analyse/werkzeug";

/** Ein Moment mit seinem Satz und den Pfeilen am Brett. */
export interface Besprochenermoment {
  readonly moment: Besprechungsmoment;
  readonly satz: string;
  readonly pfeile: readonly Markierung[];
  /** Die Folge, die die Besprechung auf Wunsch vorspielt („Soll ich es dir zeigen?“), oder null. */
  readonly folge: Zeigefolge | null;
}

/** Was der Bildschirm zeigt. */
export interface Besprechungsstand {
  readonly kontext: Besprechungskontext;
  readonly auswertung: Auswertungsstand;
  /** Klasse je Halbzug (leer, solange nicht ausgewertet). */
  readonly klassen: readonly (Zugklasse | null)[];
  readonly momente: readonly Besprochenermoment[];
  readonly auftakt: string;
  readonly schluss: string;
  readonly rechnet: string;
}

/** Die Themen aller Runden (für die Begriffe), leer, solange die Spieldaten laden. */
function useRundenthemen(): readonly Rundenthemen[] {
  const [runden, setzeRunden] = useState<readonly Rundenthemen[]>([]);
  useEffect(() => {
    let aktiv = true;
    ladeSpieldaten()
      .then(
        (d) =>
          aktiv && setzeRunden(d.runden.map((r) => ({ kennung: r.kennung, themen: r.themen }))),
      )
      .catch((fehler: unknown) => {
        // Ohne Spieldaten kennt die Besprechung keine Begriffe; sie läuft trotzdem (knapp).
        console.warn("Runden für die Besprechung nicht geladen", fehler);
      });
    return () => {
      aktiv = false;
    };
  }, []);
  return runden;
}

/** Die Urteile aller Züge mit Theoriezügen, sobald die Partie ausgewertet ist. */
function urteileDer(eintrag: Partieeintrag, theorie: Theoriequellen | null): Zugurteil[] {
  const p = eintrag.partie;
  const fens = stellungen(p);
  const sans = p.zuege.map((z) => z.san);
  const jeZug = theorie ? theorieJeZug(theorie, fens, sans) : [];
  const gambits = theorie ? gambitJeZug(theorie, fens, sans) : [];
  return zugurteile(p, eintrag.werte, eintrag.beste, eintrag.abstaende, jeZug, gambits);
}

/** Momente mit Sätzen und Pfeilen. */
function besprocheneMomente(
  eintrag: Partieeintrag,
  urteile: readonly Zugurteil[],
  k: Besprechungskontext,
  theorie: Theoriequellen | null,
): Besprochenermoment[] {
  const vomHelden = eintrag.partie.zuege.map((z) => z.von === "leser");
  const theorieBekannt = k.begriffe.has("theorie");
  const momente = besprechungsmomente({ urteile, vomHelden, stufe: k.stufe, theorieBekannt });
  const g = motivgrundlage(
    eintrag,
    urteile.map((u) => u.verlust),
  );
  const angaben = momente.map((m) => momentangaben(eintrag, g, m, theorie));
  const saetze = momentsaetze(k, angaben);
  return angaben.map((a, i) => {
    const folge = zeigefolge(eintrag, a.moment, k.stufe);
    const angebot = folge ? angebotssatz(k, folge.besser, i) : "";
    return {
      moment: a.moment,
      satz: [saetze[i] ?? "", angebot].filter((t) => t !== "").join(" "),
      pfeile: momentpfeile(eintrag, a),
      folge,
    };
  });
}

/**
 * Der Stand der Besprechung einer Partie.
 * Beispiel: Clubkampf in Maple Falls, noch nicht ausgewertet → auswertung „laeuft“, Momente leer;
 * danach Stufe 1 mit bis zu vier Momenten.
 */
export function useBesprechung(
  eintrag: Partieeintrag,
  abenteuer: Abenteuerstand | null,
): Besprechungsstand {
  const auswertung = useAuswertung(eintrag.partie, eintrag, false);
  const theorie = useTheorie() ?? null;
  const runden = useRundenthemen();
  const variablen = abenteuer?.dialogvariablen;
  const kontext = useMemo<Besprechungskontext>(() => {
    const v = variablen ?? {};
    return {
      stimme: besprechungsstimme(v),
      // Aus dem Tagebuch kommt man erst nach der Ankündigung; ohne sie gilt die knappe Stufe.
      stufe: besprechungsstufe(v) || 1,
      begriffe: bekannteBegriffe(v, runden),
      partiekennung: eintrag.partie.id,
    };
  }, [variablen, runden, eintrag.partie.id]);
  const urteile = useMemo(() => urteileDer(eintrag, theorie), [eintrag, theorie]);
  const momente = useMemo(
    () => (urteile.length > 0 ? besprocheneMomente(eintrag, urteile, kontext, theorie) : []),
    [eintrag, urteile, kontext, theorie],
  );
  const ausgang = ausgangAus(eintrag.partie);
  return {
    kontext,
    auswertung,
    klassen: urteile.map((u) => u.klasse),
    momente,
    auftakt: auftaktsatz(kontext),
    schluss: schlusssatz(kontext, ausgang, momente.length === 0),
    rechnet: rechnetsatz(kontext),
  };
}
