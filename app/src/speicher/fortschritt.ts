/**
 * Fortschritt je Kapitel: angesehene Abbildungen, gelöste Übungen, Stand der Trainer.
 *
 * Rolle im Gesamtbild: Pflichtenheft 4, Stufe 2 „Fortschritt: je Kapitel angesehene Abbildungen,
 * gelöste Übungen, Stand der Trainer“. Reine Funktionen auf den Nutzerdaten (format.ts); der
 * Speicher (speicher.ts) schreibt das Ergebnis sofort. Übungen und Trainer füllen sich, sobald
 * es die Trainer gibt (AP 13); die Schnittstelle steht schon jetzt fest.
 * Abhängigkeiten: speicher/format.ts, training/trainer.ts.
 */
import { trainerZuKapitel, type TrainerKennung } from "../training/trainer";
import type { Fortschritt, Nutzerdaten, Trainerstand } from "./format";

/** Zähler „x von y“. */
export interface Anteil {
  readonly erreicht: number;
  readonly gesamt: number;
}

export interface Kapitelfortschritt {
  readonly abbildungen: Anteil;
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
  return { ...daten, fortschritt: { ...daten.fortschritt, gesehen } };
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
  return { ...daten, fortschritt: { ...daten.fortschritt, gesehen: neu } };
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
  return { ...daten, fortschritt: { ...daten.fortschritt, uebungen } };
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
  return { ...daten, fortschritt: { ...daten.fortschritt, trainer } };
}

/**
 * Der Fortschritt eines Kapitels.
 *
 * Eingaben: Fortschritt, Kapitelnummer, Nummern seiner Abbildungen, Kennungen seiner Übungen
 * (leer, wenn das Kapitel nicht geladen ist). Ausgabe: Zähler und Trainerstände.
 * Beispiel: Kapitel 1 mit 40 Abbildungen, davon „1.26“ gesehen → abbildungen 1 von 40.
 * Sonderfall: Gesehene Nummern, die es in dieser Auflage nicht mehr gibt, zählen nicht.
 */
export function kapitelfortschritt(
  fortschritt: Fortschritt,
  kapitel: number,
  abbildungen: readonly string[],
  uebungen: readonly string[],
): Kapitelfortschritt {
  const staende = uebungen.map((id) => fortschritt.uebungen[id]);
  return {
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
