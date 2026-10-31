/**
 * Die Arten von Vorschlägen für „Dein nächster Schritt“ (Gamifizierung P1) als Liste.
 *
 * Rolle im Gesamtbild: training/naechsterSchritt.ts fragt jede Art in der Reihenfolge ihres Rangs
 * und nimmt die ersten drei Antworten. Ein späterer Trainer oder ein Werkzeug trägt hier eine Zeile
 * ein (Kennung, Rang, Funktion); Lücken im Rang lassen Platz dazwischen (Wunsch des Autors,
 * 31.10.2026: eintragen statt umbauen).
 * Rangfolge nach gamifizierung.md P1: fällige Wiederholungen, Tagesaufgabe, Weiterlesen, offene
 * Übungen, schwaches Thema, Fehlerdatenbank.
 * Abhängigkeiten: training/wiederholung.ts, training/themenstand.ts, training/themennamen.ts,
 * training/fehlerdatenbank.ts.
 */
import type { Nutzerdaten } from "../speicher/format";
import type { Kapitelangabe, Lage, Vorschlag, Vorschlagsart } from "./naechsterSchritt";
import { auswertung, vorschlag as fehlervorschlag } from "./fehlerdatenbank";
import { schwaechstesThema } from "./themenstand";
import { themennameSchluessel, trainerZumThema } from "./themennamen";
import { faellige } from "./wiederholung";

/** Erst ab so vielen fälligen Karten lohnt der Vorschlag (P1, Fall 1). */
export const FAELLIG_AB = 3;
/** Geschätzte Sekunden je Wiederholungskarte. */
const SEKUNDEN_JE_KARTE = 40;
const SEKUNDEN_JE_MINUTE = 60;
/** Unter dieser Quote gilt ein Thema als unsicher (P1, Fall 5). */
export const UNSICHER_UNTER = 0.7;

/** Ab diesem Anteil gesehener Abbildungen schlägt die Karte die Übungen eines Kapitels vor. */
export const GESEHEN_FUER_UEBUNGEN = 0.8;

/** Kennung der eigenen Ansicht für Wiederholung und Tagesaufgabe (app/zusatzansichten.ts). */
export const NAECHSTER_ANSICHT = "naechster";

/**
 * Kapitel, deren Abbildungen zu mindestens 80 % gesehen sind; nur für sie lädt die Karte die
 * Übungen (damit der Start nicht alle Kapitel lädt).
 * Beispiel: Kapitel 1 mit 40 Abbildungen, 33 gesehen → dabei; 31 gesehen → nicht.
 */
export function kapitelFuerUebungen(
  daten: Nutzerdaten,
  kapitel: readonly Kapitelangabe[],
): number[] {
  const gesehen = daten.fortschritt.gesehen;
  return kapitel
    .filter(
      (k) =>
        k.abbildungen.length > 0 &&
        k.abbildungen.filter((n) => gesehen[n] !== undefined).length >=
          GESEHEN_FUER_UEBUNGEN * k.abbildungen.length,
    )
    .map((k) => k.kapitel);
}


/** Fall 1: mindestens drei fällige Wiederholungskarten, mit grober Dauer. */
function faelligeKarten({ daten, jetzt }: Lage): Vorschlag | null {
  const anzahl = faellige(daten.karten, jetzt).length;
  if (anzahl < FAELLIG_AB) return null;
  const minuten = Math.max(1, Math.ceil((anzahl * SEKUNDEN_JE_KARTE) / SEKUNDEN_JE_MINUTE));
  return {
    art: "faellig",
    text: "naechster.faellig",
    werte: { anzahl, minuten },
    knopf: "naechster.knopf.wiederholen",
    ziel: { bildschirm: "zusatz", kennung: NAECHSTER_ANSICHT, wert: "wiederholung" },
  };
}

/** Fall 2: Die Tagesaufgabe ist heute noch offen. */
function tagesaufgabe(lage: Lage): Vorschlag | null {
  if (lage.tagesaufgabeErledigt) return null;
  return {
    art: "tagesaufgabe",
    text: "naechster.tagesaufgabe",
    werte: {},
    knopf: "naechster.knopf.loesen",
    ziel: { bildschirm: "zusatz", kennung: NAECHSTER_ANSICHT, wert: "tagesaufgabe" },
  };
}

/** Die erste ungesehene Abbildung eines Kapitels, ab einer Stelle und dann von vorn. */
function ungesehenAb(
  kapitel: Kapitelangabe,
  ab: number,
  gesehen: Readonly<Record<string, string>>,
): string | null {
  const reihe = [...kapitel.abbildungen.slice(ab), ...kapitel.abbildungen.slice(0, ab)];
  return reihe.find((n) => gesehen[n] === undefined) ?? null;
}

/**
 * Die nächste ungesehene Abbildung: im Kapitel der zuletzt geöffneten nach ihr, sonst im ersten
 * Kapitel mit ungesehenen Abbildungen. Beispiel: zuletzt 6.20, 6.21 ungesehen → 6.21.
 */
export function naechsteAbbildung(
  lage: Lage,
): { readonly kapitel: Kapitelangabe; readonly nummer: string } | null {
  const gesehen = lage.daten.fortschritt.gesehen;
  const aktuell = lage.kapitel.find((k) => lage.zuletzt && k.abbildungen.includes(lage.zuletzt));
  if (aktuell && lage.zuletzt) {
    const nummer = ungesehenAb(aktuell, aktuell.abbildungen.indexOf(lage.zuletzt) + 1, gesehen);
    if (nummer) return { kapitel: aktuell, nummer };
  }
  for (const kapitel of lage.kapitel) {
    const nummer = ungesehenAb(kapitel, 0, gesehen);
    if (nummer) return { kapitel, nummer };
  }
  return null;
}

/** Fall 3: weiterlesen; wer noch nichts gesehen hat, „fängt an“. */
function weiterlesen(lage: Lage): Vorschlag | null {
  const naechste = naechsteAbbildung(lage);
  if (!naechste) return null;
  const neu = Object.keys(lage.daten.fortschritt.gesehen).length === 0;
  return {
    art: "weiterlesen",
    text: neu ? "naechster.anfangen" : "naechster.weiterlesen",
    werte: {
      kapitel: naechste.kapitel.kapitel,
      titel: naechste.kapitel.titel,
      nummer: naechste.nummer,
    },
    knopf: neu ? "naechster.knopf.anfangen" : "naechster.knopf.weiterlesen",
    ziel: { bildschirm: "abbildung", nummer: naechste.nummer },
  };
}

/** Fall 4: offene Übungen im ersten Kapitel, dessen Abbildungen zu 80 % gesehen sind. */
function offeneUebungen({ daten, kapitel, uebungen }: Lage): Vorschlag | null {
  for (const nummer of kapitelFuerUebungen(daten, kapitel)) {
    const offen = (uebungen[nummer] ?? []).filter(
      (id) => daten.fortschritt.uebungen[id]?.geloest !== true,
    );
    const erste = offen[0];
    if (erste === undefined) continue;
    return {
      art: "uebungen",
      text: offen.length === 1 ? "naechster.uebungenEins" : "naechster.uebungen",
      werte: { kapitel: nummer, anzahl: offen.length },
      knopf: "naechster.knopf.ueben",
      ziel: {
        bildschirm: "uebung",
        kapitel: nummer,
        id: erste,
        reihe: offen.map((id) => ({ kapitel: nummer, id })),
      },
    };
  }
  return null;
}

/** Fall 5: das schwächste Thema aus dem Antwortprotokoll (G1), wenn unter 70 % richtig. */
function schwachesThema({ daten }: Lage): Vorschlag | null {
  const schwach = schwaechstesThema(daten.themen);
  if (!schwach || schwach.quote >= UNSICHER_UNTER) return null;
  const trainer = trainerZumThema(schwach.thema);
  const name = themennameSchluessel(schwach.thema);
  const letzte = daten.themen[schwach.thema]?.letzte ?? "";
  if (!trainer || !name || letzte.length === 0) return null;
  return {
    art: "thema",
    text: "naechster.thema",
    werte: { richtig: [...letzte].filter((z) => z === "r").length, anzahl: letzte.length },
    namen: { thema: name },
    knopf: "naechster.knopf.ueben",
    ziel: { bildschirm: "trainer", kennung: trainer },
  };
}

/** Fall 6: der Vorschlag der Fehlerdatenbank (häufigste Fehlerart der letzten vier Wochen). */
function fehlerdatenbank({ daten, jetzt }: Lage): Vorschlag | null {
  const treffer = fehlervorschlag(auswertung(daten.fehler, jetzt));
  if (!treffer) return null;
  return {
    art: "fehler",
    text: "naechster.fehler",
    werte: { kapitel: treffer.fehlerart },
    namen: { trainer: `trainer.${treffer.trainer}.name` },
    knopf: "naechster.knopf.trainer",
    ziel: { bildschirm: "trainer", kennung: treffer.trainer },
  };
}

/** Alle Arten; ein neuer Trainer ergänzt eine Zeile mit eigenem Rang. */
export const VORSCHLAGSARTEN: readonly Vorschlagsart[] = [
  { kennung: "faellig", rang: 10, ermittle: faelligeKarten },
  { kennung: "tagesaufgabe", rang: 20, ermittle: tagesaufgabe },
  { kennung: "weiterlesen", rang: 30, ermittle: weiterlesen },
  { kennung: "uebungen", rang: 40, ermittle: offeneUebungen },
  { kennung: "thema", rang: 50, ermittle: schwachesThema },
  { kennung: "fehler", rang: 60, ermittle: fehlerdatenbank },
];
