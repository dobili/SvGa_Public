/**
 * Fortschritt je Kapitel: angesehene Abbildungen, gelöste Übungen, Stand der Trainer.
 *
 * Rolle im Gesamtbild: Pflichtenheft 4, Stufe 2 „Fortschritt: je Kapitel angesehene Abbildungen,
 * gelöste Übungen, Stand der Trainer“. Reine Funktionen auf den Nutzerdaten (format.ts); der
 * Speicher (speicher.ts) schreibt das Ergebnis sofort. Übungen und Trainer füllen sich, sobald
 * es die Trainer gibt (AP 13); die Schnittstelle steht schon jetzt fest.
 * Abhängigkeiten: speicher/format.ts, training/trainer.ts.
 */
import { TRAINER, trainerZuKapitel, type TrainerKennung } from "../training/trainer";
import { beantworte, uebungskarte, type Antwortergebnis } from "../training/wiederholung";
import { zaehleAktivitaet } from "./aktivitaet";
import type { Fortschritt, Nutzerdaten, Trainerstand } from "./format";

/** Zähler „x von y“. */
export interface Anteil {
  readonly erreicht: number;
  readonly gesamt: number;
}

export interface Kapitelfortschritt {
  readonly abbildungen: Anteil;
  /** Beantwortete Warum-Fragen des Kapitels; gesamt 0, wenn es keine gibt. */
  readonly warum: Anteil;
  /** Gelöste Übungen; `versucht` zählt jede Übung mit mindestens einem Versuch. */
  readonly uebungen: Anteil & { readonly versucht: number };
  readonly trainer: readonly { kennung: TrainerKennung; stand: Trainerstand | null }[];
}

/** Ergebnis eines Durchgangs in einem Trainer. */
export interface Durchgang {
  readonly aufgaben: number;
  readonly richtig: number;
}

/**
 * Merkt eine Abbildung als angesehen (das Datum des ersten Ansehens bleibt).
 *
 * Ausgabe: dieselben Daten, wenn die Abbildung schon gesehen war (dann schreibt der Speicher
 * nichts). Beispiel: markiereGesehen(daten, "1.26", jetzt) beim Öffnen von Abb. 1.26.
 */
export function markiereGesehen(daten: Nutzerdaten, abbildung: string, jetzt: Date): Nutzerdaten {
  if (daten.fortschritt.gesehen[abbildung] !== undefined) return daten;
  const gesehen = { ...daten.fortschritt.gesehen, [abbildung]: jetzt.toISOString() };
  return zaehleAktivitaet(
    { ...daten, fortschritt: { ...daten.fortschritt, gesehen } },
    "abbildung",
    1,
    jetzt,
  );
}

/**
 * Hakt Abbildungen von Hand ab oder nimmt den Haken zurück (Kapitelübersicht).
 *
 * Warum: Wunsch des Autors (Nachtest 0.2.26): Wer eine Abbildung im Buch gelesen hat, soll sie
 * auch ohne 30 Sekunden in der App abhaken können, einzeln oder alle eines Kapitels.
 * Eingaben: Nummern, ob gesehen, Zeitpunkt. Ein schon gesetztes Datum bleibt beim Abhaken.
 * Beispiel: setzeGesehen(daten, ["1.1", "1.2"], true, jetzt) → beide gesehen.
 */
export function setzeGesehen(
  daten: Nutzerdaten,
  abbildungen: readonly string[],
  gesehen: boolean,
  jetzt: Date,
): Nutzerdaten {
  const betroffen = new Set(abbildungen);
  const behalten = Object.entries(daten.fortschritt.gesehen).filter(
    ([nummer]) => gesehen || !betroffen.has(nummer),
  );
  const neu: Record<string, string> = Object.fromEntries(behalten);
  if (gesehen) for (const nummer of abbildungen) neu[nummer] ??= jetzt.toISOString();
  // Gamifizierung G2: neu abgehakte Abbildungen zählen wie angesehene.
  const dazu = Object.keys(neu).length - behalten.length;
  return zaehleAktivitaet(
    { ...daten, fortschritt: { ...daten.fortschritt, gesehen: neu } },
    "abbildung",
    dazu,
    jetzt,
  );
}

/**
 * Notiert einen Versuch an einer Übung des Buches.
 *
 * Eingaben: Kennung wie im LaTeX („ueb:droh-ignorieren“), Kapitel, ob richtig gelöst.
 * Sonderfall: Einmal gelöst bleibt gelöst, auch nach einem späteren Fehlversuch.
 */
export function notiereUebung(
  daten: Nutzerdaten,
  uebung: { id: string; kapitel: number; richtig: boolean },
  jetzt: Date,
): Nutzerdaten {
  const alt = daten.fortschritt.uebungen[uebung.id];
  const neu = {
    kapitel: uebung.kapitel,
    versuche: (alt?.versuche ?? 0) + 1,
    geloest: (alt?.geloest ?? false) || uebung.richtig,
    zuletzt: jetzt.toISOString(),
  };
  const uebungen = { ...daten.fortschritt.uebungen, [uebung.id]: neu };
  const mitVersuch = zaehleAktivitaet(
    { ...daten, fortschritt: { ...daten.fortschritt, uebungen } },
    "uebung",
    1,
    jetzt,
  );
  return uebung.richtig ? zaehleAktivitaet(mitVersuch, "uebungGeloest", 1, jetzt) : mitVersuch;
}

/**
 * Trägt das Ergebnis einer Übung ein: Versuch im Fortschritt und Wiederholungskarte (AP 13).
 *
 * Warum: Konzept 9.1. Richtig gelöst rückt die Karte einen Kasten weiter, mit Hinweisen gelöst
 * bleibt sie, falsch oder mit „Lösung zeigen“ geht sie zurück in Kasten 1.
 * Entscheidung des Autors (Q6, ENTSCHEIDUNGEN.md, Rückmeldung zu 0.2.31): Eine Übung zählt auch
 * nach „Lösung anzeigen“ als gelöst. Deshalb gilt jede abgeschlossene Übung als gelöst; wie gut es
 * ging, steckt in der Wiederholungskarte (Kasten und Verlauf).
 * Beispiel: erste richtige Lösung von „ueb:droh-ignorieren“ → gelöst, Karte in Kasten 2;
 * „Lösung zeigen“ → ebenfalls gelöst, Karte in Kasten 1 (morgen wieder fällig).
 */
export function notiereUebungsergebnis(
  daten: Nutzerdaten,
  uebung: { id: string; kapitel: number; ergebnis: Antwortergebnis },
  jetzt: Date,
): Nutzerdaten {
  const mitVersuch = notiereUebung(
    daten,
    { id: uebung.id, kapitel: uebung.kapitel, richtig: true },
    jetzt,
  );
  const kennung = uebungskarte(uebung.id);
  const alt = daten.karten[kennung] ?? null;
  const karte = beantworte(alt, uebung.ergebnis, jetzt);
  const neu = { ...mitVersuch, karten: { ...daten.karten, [kennung]: karte } };
  // Gamifizierung G2: Eine schon vorhandene Karte zu beantworten ist eine Wiederholung.
  return alt === null ? neu : zaehleAktivitaet(neu, "karte", 1, jetzt);
}

/**
 * Notiert die Antwort auf eine Trainer-Aufgabe in ihrer Wiederholungskarte (Empfehlung U9).
 *
 * Warum: Eine falsch gelöste Aufgabe soll wiederkommen; jede richtig gelöste neue Aufgabe als
 * Karte würde die Wiederholung mit Bekanntem füllen. Deshalb legt nur eine falsche Antwort eine
 * Karte an; eine vorhandene Karte wandert mit jeder Antwort (richtig weiter, falsch zurück).
 * Beispiel: „taktik:taktik-b-7.6“ falsch → Kasten 1, morgen fällig; später richtig → Kasten 2.
 */
export function notiereTrainerantwort(
  daten: Nutzerdaten,
  karte: string,
  richtig: boolean,
  jetzt: Date,
): Nutzerdaten {
  const alt = daten.karten[karte] ?? null;
  if (alt === null && richtig) return daten;
  const neu = beantworte(alt, richtig ? "richtig" : "falsch", jetzt);
  const mitKarte = { ...daten, karten: { ...daten.karten, [karte]: neu } };
  return alt === null ? mitKarte : zaehleAktivitaet(mitKarte, "karte", 1, jetzt);
}

/** Notiert einen abgeschlossenen Durchgang eines Trainers (Aufgaben und richtige Antworten). */
export function notiereDurchgang(
  daten: Nutzerdaten,
  kennung: TrainerKennung,
  durchgang: Durchgang,
  jetzt: Date,
): Nutzerdaten {
  const alt = daten.fortschritt.trainer[kennung];
  const neu: Trainerstand = {
    durchgaenge: (alt?.durchgaenge ?? 0) + 1,
    aufgaben: (alt?.aufgaben ?? 0) + durchgang.aufgaben,
    richtig: (alt?.richtig ?? 0) + durchgang.richtig,
    zuletzt: jetzt.toISOString(),
  };
  const trainer = { ...daten.fortschritt.trainer, [kennung]: neu };
  // Gamifizierung G2: Runde, Antworten und richtige Antworten aller Trainer an einer Stelle.
  const mitRunde = zaehleAktivitaet(
    { ...daten, fortschritt: { ...daten.fortschritt, trainer } },
    "trainerRunde",
    1,
    jetzt,
  );
  const mitAntworten = zaehleAktivitaet(mitRunde, "trainerAntwort", durchgang.aufgaben, jetzt);
  return zaehleAktivitaet(mitAntworten, "trainerRichtig", durchgang.richtig, jetzt);
}

/**
 * Der Fortschritt eines Kapitels.
 *
 * Eingaben: Fortschritt, Kapitelnummer, Nummern seiner Abbildungen, Kennungen seiner Übungen
 * (leer, wenn das Kapitel nicht geladen ist), Zahl der Warum-Fragen je Abbildung (leer ohne
 * geladenes Kapitel). Ausgabe: Zähler und Trainerstände.
 * Beispiel: Kapitel 1 mit 40 Abbildungen, davon „1.26“ gesehen → abbildungen 1 von 40.
 * Sonderfall: Gesehene Nummern, die es in dieser Auflage nicht mehr gibt, zählen nicht.
 */
export function kapitelfortschritt(
  fortschritt: Fortschritt,
  kapitel: number,
  abbildungen: readonly string[],
  uebungen: readonly string[],
  fragen: Readonly<Record<string, number>> = {},
): Kapitelfortschritt {
  const staende = uebungen.map((id) => fortschritt.uebungen[id]);
  const mitFragen = Object.entries(fragen);
  return {
    warum: {
      erreicht: mitFragen.reduce(
        (summe, [id, anzahl]) => summe + beantworteteFragen(fortschritt, id, anzahl),
        0,
      ),
      gesamt: mitFragen.reduce((summe, [, anzahl]) => summe + anzahl, 0),
    },
    abbildungen: {
      erreicht: abbildungen.filter((id) => fortschritt.gesehen[id] !== undefined).length,
      gesamt: abbildungen.length,
    },
    uebungen: {
      erreicht: staende.filter((stand) => stand?.geloest === true).length,
      versucht: staende.filter((stand) => stand !== undefined).length,
      gesamt: uebungen.length,
    },
    trainer: trainerZuKapitel(kapitel).map((trainer) => ({
      kennung: trainer.kennung,
      stand: fortschritt.trainer[trainer.kennung] ?? null,
    })),
  };
}

/** Gelöste Übungen eines Kapitels ohne die Kapiteldaten (aus dem gespeicherten Kapitel). */
export function geloesteUebungen(fortschritt: Fortschritt, kapitel: number): number {
  return Object.values(fortschritt.uebungen).filter(
    (stand) => stand.kapitel === kapitel && stand.geloest,
  ).length;
}

/**
 * Wie viele der `anzahl` Warum-Fragen einer Abbildung schon beantwortet sind.
 * Beispiel: Abb. 1.26 mit einer Frage, beantwortet → 1.
 */
export function beantworteteFragen(
  fortschritt: Fortschritt,
  abbildung: string,
  anzahl: number,
): number {
  return (fortschritt.warum[abbildung] ?? []).filter((stelle) => stelle < anzahl).length;
}

/**
 * Merkt eine beantwortete Warum-Frage (richtig oder falsch: Sie gilt als bearbeitet, wie eine
 * Karte im Buch, die man gelesen hat). Beispiel: notiereWarumfrage(daten, "1.26", 0, jetzt).
 * Sonderfall: Schon gemerkt → dieselben Daten (der Speicher schreibt nichts).
 */
export function notiereWarumfrage(
  daten: Nutzerdaten,
  abbildung: string,
  stelle: number,
  jetzt: Date,
): Nutzerdaten {
  const bisher = daten.fortschritt.warum[abbildung] ?? [];
  if (bisher.includes(stelle)) return daten;
  const warum = {
    ...daten.fortschritt.warum,
    [abbildung]: [...bisher, stelle].sort((a, b) => a - b),
  };
  return zaehleAktivitaet(
    { ...daten, fortschritt: { ...daten.fortschritt, warum } },
    "warum",
    1,
    jetzt,
  );
}

/**
 * Merkt eine richtig eingeschätzte Abbildung (NA1, Wunsch des Autors vom 19.10.2026): Beim
 * nächsten Öffnen zeigt „Erst selbst denken“ die Werkzeuge gleich.
 * Beispiel: notiereEinschaetzung(daten, "1.26", jetzt) nach „ausgeglichen“ bei +0,3.
 * Sonderfall: Schon gemerkt → dieselben Daten (der Speicher schreibt nichts).
 */
export function notiereEinschaetzung(
  daten: Nutzerdaten,
  abbildung: string,
  jetzt: Date,
): Nutzerdaten {
  if (daten.fortschritt.eingeschaetzt[abbildung] !== undefined) return daten;
  const eingeschaetzt = { ...daten.fortschritt.eingeschaetzt, [abbildung]: jetzt.toISOString() };
  return zaehleAktivitaet(
    { ...daten, fortschritt: { ...daten.fortschritt, eingeschaetzt } },
    "eingeschaetzt",
    1,
    jetzt,
  );
}

/**
 * Wie viele Trainer aus „Training“ schon einmal abgeschlossen wurden (mindestens ein Durchgang).
 * Warum: dritter Ring „Trainings erstmalig absolviert“ in „Dein Fortschritt“ (Wunsch des Autors,
 * 25.10.2026, Fortschrittsuebersicht.tsx). Gezählt werden nur fertige Trainer.
 * Beispiel: ein Durchgang „Koordinaten“ und zwei „Zählen“ → 2 von 17.
 */
export function erstmalsTrainiert(fortschritt: Fortschritt): Anteil {
  const fertige = TRAINER.filter((trainer) => trainer.fertig);
  const erreicht = fertige.filter(
    (trainer) => (fortschritt.trainer[trainer.kennung]?.durchgaenge ?? 0) > 0,
  ).length;
  return { erreicht, gesamt: fertige.length };
}
