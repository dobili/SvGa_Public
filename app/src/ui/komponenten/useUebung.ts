/**
 * Ablauf einer Übung des Buches in der App: Züge prüfen, Hinweise in drei Stufen, Lösung zeigen,
 * Ergebnis speichern (AP 13, Konzept 9.2 „antworte“ und „hilfe“).
 *
 * Rolle im Gesamtbild: Zustand des Bildschirms Uebung.tsx. Der Leser zieht die Züge seiner
 * Seite; richtig gezogen spielt die App die Antwort der Gegenseite aus der Lösung. Das Ergebnis
 * (richtig, mit Hilfe, falsch) geht einmal in Fortschritt und Wiederholungskarte
 * (speicher/fortschritt.ts, notiereUebungsergebnis).
 * „Erst selbst denken“ (Einstellung „Strenge“): locker – Hinweise und Lösung erst nach „Ich habe
 * nachgedacht“; streng – erst nach einem eigenen Zug.
 * Abhängigkeiten: training/uebungsaufgabe.ts, schach/weiterspielen.ts, speicher.
 */
import { useState } from "react";
import type { Markierung } from "../../analyse/werkzeug";
import type { Strenge } from "../../speicher/format";
import { notiereUebungsergebnis } from "../../speicher/fortschritt";
import { aendere } from "../../speicher/speicher";
import { spieleZug, zugFelder } from "../../schach/weiterspielen";
import type { Rolle } from "../../schach/stellung";
import { pruefeZug, stellungNach, type Uebungsaufgabe } from "../../training/uebungsaufgabe";
import type { Antwortergebnis } from "../../training/wiederholung";

/** Höchste Hinweisstufe: 1 Motiv, 2 Figur, 3 Zug als Pfeil. */
export const HOECHSTE_STUFE = 3;

export type Uebungsstatus = "offen" | "geloest" | "gezeigt";
/** Rückmeldung zum letzten Zug. */
export type Meldung = "richtig" | "weiter" | "falsch" | null;

export interface Uebungssteuerung {
  readonly fen: string;
  readonly zuege: readonly string[];
  readonly status: Uebungsstatus;
  readonly meldung: Meldung;
  readonly stufe: number;
  /** Darf der Leser Hinweise und Lösung sehen („Erst selbst denken“)? */
  readonly hilfeFrei: boolean;
  /** Die Rolle der Figur, die als Nächstes zieht (für Hinweis 2), sonst null. */
  readonly naechsteFigur: Rolle | null;
  readonly markierungen: readonly Markierung[];
  readonly spiele: (
    von: string,
    nach: string,
    umwandlung?: Rolle,
  ) => "gespielt" | "umwandlung" | "ungueltig";
  readonly nachgedacht: () => void;
  readonly hinweis: () => void;
  readonly zeigeLoesung: () => void;
  /** Denkaufgabe: Selbsteinschätzung nach dem Lesen der Erklärung. */
  readonly schaetzeEin: (ergebnis: Antwortergebnis) => void;
  readonly eingeschaetzt: boolean;
}

type Zugaufgabe = Extract<Uebungsaufgabe, { art: "zug" }>;

/** Die Rolle der Figur, die einen Zug in Kurznotation ausführt („Nf3“ → Springer, „e4“ → Bauer). */
function rolleVon(san: string): Rolle {
  const buchstabe = san.charAt(0);
  const rollen: Readonly<Record<string, Rolle>> = {
    N: "knight",
    B: "bishop",
    R: "rook",
    Q: "queen",
    K: "king",
    O: "king",
  };
  return rollen[buchstabe] ?? "pawn";
}

/**
 * Steuerung einer Übung.
 *
 * Eingaben: Kennung und Kapitel der Übung, Aufgabe, Startstellung (Diagramm), Strenge.
 * Sonderfall: Bei einer Denkaufgabe gibt es keine Züge; der Leser schätzt sich nach der Erklärung
 * selbst ein.
 */
export function useUebung(
  uebung: { id: string; kapitel: number },
  aufgabe: Uebungsaufgabe,
  startFen: string,
  strenge: Strenge,
): Uebungssteuerung {
  const [zuege, setzeZuege] = useState<readonly string[]>([]);
  const [status, setzeStatus] = useState<Uebungsstatus>("offen");
  const [meldung, setzeMeldung] = useState<Meldung>(null);
  const [stufe, setzeStufe] = useState(0);
  const [fehler, setzeFehler] = useState(0);
  const [gedacht, setzeGedacht] = useState(false);
  const [eingeschaetzt, setzeEingeschaetzt] = useState(false);
  const fen = stellungNach(startFen, zuege);
  const hilfeFrei = strenge === "streng" ? fehler > 0 || zuege.length > 0 : gedacht;

  const speichere = (ergebnis: Antwortergebnis) =>
    void aendere((daten) =>
      notiereUebungsergebnis(
        daten,
        { id: uebung.id, kapitel: uebung.kapitel, ergebnis },
        new Date(),
      ),
    );

  const naechster =
    aufgabe.art === "zug" && status === "offen" ? naechsterZug(aufgabe, zuege) : null;
  const markierungen = pfeil(stufe, naechster, fen, status, aufgabe, zuege, startFen);

  const spiele = (von: string, nach: string, umwandlung?: Rolle) => {
    if (aufgabe.art !== "zug" || status !== "offen") return "ungueltig" as const;
    const versuch = spieleZug(fen, von, nach, umwandlung);
    if (versuch.art !== "gespielt") return versuch.art;
    const pruefung = pruefeZug(aufgabe, zuege, versuch.san);
    if (pruefung.art === "falsch") {
      setzeFehler(fehler + 1);
      setzeMeldung("falsch");
      return "gespielt" as const;
    }
    if (pruefung.art === "weiter") {
      setzeZuege([...zuege, versuch.san, pruefung.antwort]);
      setzeMeldung("weiter");
      return "gespielt" as const;
    }
    setzeZuege([...zuege, versuch.san]);
    setzeStatus("geloest");
    setzeMeldung("richtig");
    speichere(fehler === 0 && stufe === 0 ? "richtig" : "mitHilfe");
    return "gespielt" as const;
  };

  return {
    fen,
    zuege,
    status,
    meldung,
    stufe,
    hilfeFrei,
    naechsteFigur: naechster ? rolleVon(naechster) : null,
    markierungen,
    spiele,
    nachgedacht: () => setzeGedacht(true),
    hinweis: () => setzeStufe(Math.min(stufe + 1, HOECHSTE_STUFE)),
    zeigeLoesung: () => {
      if (status !== "offen") return;
      setzeStatus("gezeigt");
      setzeMeldung(null);
      if (aufgabe.art === "zug") {
        setzeZuege(aufgabe.linien[0] ?? []);
        speichere("falsch");
      }
    },
    schaetzeEin: (ergebnis) => {
      if (eingeschaetzt) return;
      setzeEingeschaetzt(true);
      speichere(ergebnis);
    },
    eingeschaetzt,
  };
}

/** Der nächste Zug des Lesers nach der Lösung des Buches (erste Linie, die zu den Zügen passt). */
function naechsterZug(aufgabe: Zugaufgabe, zuege: readonly string[]): string | null {
  const linie =
    aufgabe.linien.find((l) => zuege.every((z, i) => l[i] === z) && l.length > zuege.length) ??
    null;
  return linie?.[zuege.length] ?? null;
}

/** Hinweis 3 als goldener Pfeil; nach „Lösung zeigen“ der letzte Zug der Lösung. */
function pfeil(
  stufe: number,
  naechster: string | null,
  fen: string,
  status: Uebungsstatus,
  aufgabe: Uebungsaufgabe,
  zuege: readonly string[],
  startFen: string,
): Markierung[] {
  if (status === "offen" && stufe >= HOECHSTE_STUFE && naechster) {
    const felder = zugFelder(fen, naechster);
    return felder ? [{ typ: "pfeil", farbe: "gold", ...felder }] : [];
  }
  if (status !== "offen" && aufgabe.art === "zug" && zuege.length > 0) {
    const vorher = stellungNach(startFen, zuege.slice(0, -1));
    const felder = zugFelder(vorher, zuege[zuege.length - 1] ?? "");
    return felder ? [{ typ: "pfeil", farbe: "gold", ...felder }] : [];
  }
  return [];
}
