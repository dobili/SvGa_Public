/**
 * Die Arten von Vorschlägen für „Dein nächster Schritt“ (Gamifizierung P1) als Liste.
 *
 * Rolle im Gesamtbild: training/naechsterSchritt.ts fragt jede Art in der Reihenfolge ihres Rangs
 * und nimmt die ersten drei Antworten. Ein späterer Trainer oder ein Werkzeug trägt hier eine Zeile
 * ein (Kennung, Rang, Funktion); Lücken im Rang lassen Platz dazwischen (Wunsch des Autors,
 * 31.10.2026: eintragen statt umbauen).
 * Rangfolge nach gamifizierung.md P1: fällige Wiederholungen, Tagesaufgabe, Weiterlesen, offene
 * Übungen, schwaches Thema, Fehlerdatenbank; zuletzt eine Partie (Bug-Test 1.11.2026: wer alles
 * erledigt hatte, bekam gar keinen Vorschlag mehr); davor ein Kurzplan (Wunsch des Autors, 6.11.2026).
 * Seit dem 7.11.2026 steht vor der schwächsten Phase das „Muster aus deinen Partien“ (Konzept
 * „Fehler mit Buchbezug“ 4.3): genauer als die Phase; zeigen beide auf denselben Trainer, entfällt
 * der Phasen-Vorschlag.
 * Abhängigkeiten: training/wiederholung.ts, training/themenstand.ts, training/themennamen.ts,
 * training/fehlerdatenbank.ts, training/phasenschwaeche.ts, training/musterausPartien.ts,
 * spiel/buchbezug.ts.
 */
import type { Textschluessel } from "../i18n/sprache";
import type { Nutzerdaten } from "../speicher/format";
import type { Kapitelangabe, Lage, Vorschlag, Vorschlagsart } from "./naechsterSchritt";
import { auswertung, VORSCHLAG_WOCHEN, vorschlag as fehlervorschlag } from "./fehlerdatenbank";
import { schwaechstesThema } from "./themenstand";
import { themennameSchluessel, trainerZumThema } from "./themennamen";
import { phasenschwaeche, UEBEN_JE_PHASE } from "./phasenschwaeche";
import { musterFuer } from "./musterausPartien";
import { BUCHBEZUG } from "../spiel/buchbezug";
import { faellige } from "./wiederholung";

/** Erst ab so vielen fälligen Karten lohnt der Vorschlag (P1, Fall 1). */
export const FAELLIG_AB = 3;
/**
 * Bei mehr fälligen Karten schlägt die Karte eine Portion dieser Größe vor (etwa 14 Minuten).
 * Warum: „200 Wiederholungen, etwa 134 Minuten“ schreckt ab (Bug-Test 1.11.2026); die Lernkartei
 * verträgt es, in Portionen abzuarbeiten.
 */
export const FAELLIG_PORTION = 20;
/** Erst ab so vielen Einträgen der letzten vier Wochen „häufen sich“ Fehler einer Art. */
export const FEHLER_AB = 2;
/** Geschätzte Sekunden je Wiederholungskarte. */
const SEKUNDEN_JE_KARTE = 40;
const SEKUNDEN_JE_MINUTE = 60;
/** Unter dieser Quote gilt ein Thema als unsicher (P1, Fall 5). */
export const UNSICHER_UNTER = 0.7;

/** Kapitel mit den Grundlagen (Regeln, Notation); erst danach kommen Aufgaben am Brett. */
const GRUNDLAGENKAPITEL = 0;

/** Ab diesem Anteil gesehener Abbildungen schlägt die Karte die Übungen eines Kapitels vor. */
export const GESEHEN_FUER_UEBUNGEN = 0.8;

/** Kennung der eigenen Ansicht für Wiederholung und Tagesaufgabe (app/zusatzansichten.ts). */
export const NAECHSTER_ANSICHT = "naechster";

/** Kapitel, deren Übungen ein angeheftetes Ziel verlangt (P13, Zielart „kapitel“). */
function zielkapitel(daten: Nutzerdaten): number[] {
  return daten.ziele.angeheftet.flatMap((z) => (z.art === "kapitel" ? [z.kapitel] : []));
}

/**
 * Kapitel, deren Abbildungen zu mindestens 80 % gesehen sind, dazu die Kapitel eigener Ziele;
 * nur für sie lädt die Karte die Übungen (damit der Start nicht alle Kapitel lädt).
 * Beispiel: Kapitel 1 mit 40 Abbildungen, 33 gesehen → dabei; 31 gesehen → nicht, außer der
 * Leser hat sich „Übungen von Kapitel 1“ als Ziel angeheftet.
 */
export function kapitelFuerUebungen(
  daten: Nutzerdaten,
  kapitel: readonly Kapitelangabe[],
): number[] {
  const gesehen = daten.fortschritt.gesehen;
  const ziele = zielkapitel(daten);
  return kapitel
    .filter(
      (k) =>
        ziele.includes(k.kapitel) ||
        (k.abbildungen.length > 0 &&
          k.abbildungen.filter((n) => gesehen[n] !== undefined).length >=
            GESEHEN_FUER_UEBUNGEN * k.abbildungen.length),
    )
    .map((k) => k.kapitel);
}

/**
 * Reihenfolge der Kapitel für offene Übungen: erst die eigener Ziele, dann das Kapitel der
 * zuletzt geöffneten Abbildung, dann die übrigen nach Abstand zu ihm (bei Gleichstand das frühere).
 * Warum (Bug-Test 1.11.2026): Wer mitten in Kapitel 6 liest, bekam „Zu Kapitel 0 sind noch 3
 * Übungen offen“ (Notation lesen) statt der Übungen, die zum frisch Gelesenen passen.
 * Beispiel: zuletzt 6.33, Kapitel 0 bis 6 gelesen → 6, 5, 4, …, 0; Ziel Kapitel 2 → 2, 6, 5, …
 */
export function uebungskapitelFolge(lage: Lage): number[] {
  const kandidaten = kapitelFuerUebungen(lage.daten, lage.kapitel);
  const ziele = zielkapitel(lage.daten);
  const zuletzt = lage.zuletzt;
  const aktuell =
    lage.kapitel.find((k) => zuletzt !== null && k.abbildungen.includes(zuletzt))?.kapitel ??
    Math.max(...kandidaten);
  const schluessel = (n: number) => (ziele.includes(n) ? -1 : Math.abs(aktuell - n));
  return [...kandidaten].sort((a, b) => schluessel(a) - schluessel(b) || a - b);
}


/** Fall 1: mindestens drei fällige Wiederholungskarten, mit grober Dauer. */
function faelligeKarten({ daten, jetzt, faelligAnzahl }: Lage): Vorschlag | null {
  const anzahl = faelligAnzahl ?? faellige(daten.karten, jetzt).length;
  if (anzahl < FAELLIG_AB) return null;
  const portion = Math.min(anzahl, FAELLIG_PORTION);
  const minuten = Math.max(1, Math.ceil((portion * SEKUNDEN_JE_KARTE) / SEKUNDEN_JE_MINUTE));
  const viele = anzahl > FAELLIG_PORTION;
  return {
    art: "faellig",
    text: viele ? "naechster.faelligViele" : "naechster.faellig",
    werte: viele ? { anzahl, portion, minuten } : { anzahl, minuten },
    ...(viele ? { kurz: "buchlook.kurz.faelligViele" as const } : {}),
    knopf: "naechster.knopf.wiederholen",
    ziel: { bildschirm: "zusatz", kennung: NAECHSTER_ANSICHT, wert: "wiederholung" },
  };
}

/**
 * Ob Aufgaben am Brett schon passen: wer die Grundlagen aus Kapitel 0 (Regeln, Notation) zu 80 %
 * gesehen oder schon einen Trainer abgeschlossen hat. Warum: Ein Neuling, der noch keine Figur
 * ziehen kann, bekam sonst als Erstes eine Taktikaufgabe (Wunsch des Autors, 31.10.2026: Vorschläge
 * am Niveau des Nutzers ausrichten). Beispiel: frisch installiert → nein; Kapitel 0 gelesen → ja.
 */
function bereitFuerAufgaben({ daten, kapitel }: Lage): boolean {
  if (Object.values(daten.fortschritt.trainer).some((s) => s.durchgaenge > 0)) return true;
  const grundlagen = kapitel.find((k) => k.kapitel === GRUNDLAGENKAPITEL);
  if (!grundlagen || grundlagen.abbildungen.length === 0) return true;
  const gesehen = grundlagen.abbildungen.filter((n) => daten.fortschritt.gesehen[n] !== undefined);
  return gesehen.length >= GESEHEN_FUER_UEBUNGEN * grundlagen.abbildungen.length;
}

/** Fall 2: Die Tagesaufgabe ist heute noch offen. */
function tagesaufgabe(lage: Lage): Vorschlag | null {
  if (lage.tagesaufgabeErledigt || !bereitFuerAufgaben(lage)) return null;
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
 * Die nächste ungesehene Abbildung: im Kapitel der zuletzt geöffneten nach ihr (oder sie selbst,
 * wenn sie nicht lange genug offen war), sonst im ersten Kapitel mit ungesehenen Abbildungen. Ohne
 * jede gesehene Abbildung die erste des Buches. Beispiel: zuletzt 6.20 gesehen, 6.21 ungesehen →
 * 6.21; zuletzt 0.10 nur kurz offen, nichts gesehen → 0.1.
 */
export function naechsteAbbildung(
  lage: Lage,
): { readonly kapitel: Kapitelangabe; readonly nummer: string } | null {
  const gesehen = lage.daten.fortschritt.gesehen;
  const aktuell = lage.kapitel.find((k) => lage.zuletzt && k.abbildungen.includes(lage.zuletzt));
  // Wer noch nichts gesehen hat, fängt vorn an, auch wenn er kurz in eine Abbildung geschaut hat.
  if (aktuell && lage.zuletzt && Object.keys(gesehen).length > 0) {
    // Eine nur kurz geöffnete Abbildung gilt nicht als gelesen: dort weiter (Befund des Autors,
    // 31.10.2026: Vorschlag „Abb. 0.11“, nachdem 0.10 nur kurz offen war).
    const ab = aktuell.abbildungen.indexOf(lage.zuletzt) + (gesehen[lage.zuletzt] ? 1 : 0);
    const nummer = ungesehenAb(aktuell, ab, gesehen);
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

/** Fall 4: offene Übungen, Kapitel in der Folge von uebungskapitelFolge. */
function offeneUebungen(lage: Lage): Vorschlag | null {
  const { daten, uebungen } = lage;
  for (const nummer of uebungskapitelFolge(lage)) {
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
    // Mit Thema geöffnet, wählt der Trainer es gleich vor (ui/trainer/trainerthema.ts).
    ziel: { bildschirm: "trainer", kennung: trainer, thema: schwach.thema },
  };
}

/** Fall 6: der Vorschlag der Fehlerdatenbank (häufigste Fehlerart der letzten vier Wochen). */
function fehlerdatenbank({ daten, jetzt }: Lage): Vorschlag | null {
  const zahlen = auswertung(daten.fehler, jetzt);
  const treffer = fehlervorschlag(zahlen);
  if (!treffer) return null;
  // Ein einzelner Eintrag „häuft sich“ noch nicht (Bug-Test 1.11.2026).
  const art = zahlen.find((z) => z.fehlerart === treffer.fehlerart);
  const juengst = (art?.jeWoche ?? []).slice(0, VORSCHLAG_WOCHEN).reduce((a, b) => a + b, 0);
  if (juengst < FEHLER_AB) return null;
  return {
    art: "fehler",
    text: "naechster.fehler",
    werte: { kapitel: treffer.fehlerart },
    namen: { trainer: `trainer.${treffer.trainer}.name` },
    knopf: "naechster.knopf.trainer",
    ziel: { bildschirm: "trainer", kennung: treffer.trainer },
  };
}

/**
 * Zuletzt: eine Partie gegen die Engine, wer schon Aufgaben am Brett lösen kann. Warum: Ohne sie
 * blieb die Karte leer, sobald alles gelesen, geübt und wiederholt war; als Alternative passt sie
 * immer, denn das Buch will das Gelernte in Partien anwenden.
 */
function partie(lage: Lage): Vorschlag | null {
  if (!bereitFuerAufgaben(lage)) return null;
  return {
    art: "partie",
    text: "naechster.partie",
    werte: {},
    knopf: "naechster.knopf.spielen",
    ziel: { bildschirm: "spielen" },
  };
}

/**
 * Fall 5b: Die schwächste Phase aus den eigenen Partien (training/phasenschwaeche.ts), mit Kapitel
 * und Trainer dazu. Warum dezent: Es ist eine Schätzung über wenige Partien; der Text sagt „etwa“
 * und verspricht nichts (Wunsch des Autors, 6.11.2026).
 */
function phase({ daten }: Lage): Vorschlag | null {
  const schwaeche = phasenschwaeche(daten);
  if (!schwaeche) return null;
  const ueben = UEBEN_JE_PHASE[schwaeche.phase];
  // Das Muster ist genauer; zeigt es auf denselben Trainer, sagt die Phase nichts Neues.
  const muster = musterFuer(daten);
  if (muster && BUCHBEZUG[muster.kennung].trainer === ueben.trainer) return null;
  return {
    art: "phase",
    text: "naechster.phase",
    werte: { anzahl: schwaeche.partien, abstand: schwaeche.abstand, kapitel: ueben.kapitel },
    namen: {
      phase: `naechster.phase.${schwaeche.phase}` as Textschluessel,
      trainer: `trainer.${ueben.trainer}.name` as Textschluessel,
    },
    knopf: "naechster.knopf.trainer",
    ziel: { bildschirm: "trainer", kennung: ueben.trainer },
  };
}

/**
 * Fall 5a: ein Muster aus den eigenen Partien (training/musterausPartien.ts): eine Kategorie
 * „Fehler mit Buchbezug“ in mindestens 3 der letzten 10 ausgewerteten Partien, mit Trainer und
 * Kapitel. Dezent wie der Phasen-Vorschlag: „Dazu passt vermutlich …“ (Konzept 4.3).
 */
function muster({ daten }: Lage): Vorschlag | null {
  const gefunden = musterFuer(daten);
  if (!gefunden) return null;
  const bezug = BUCHBEZUG[gefunden.kennung];
  const themenname = bezug.thema ? themennameSchluessel(bezug.thema) : null;
  return {
    art: "muster",
    text: "naechster.muster",
    werte: { anzahl: gefunden.anzahl, partien: gefunden.partien, kapitel: bezug.kapitel[0] ?? 0 },
    namen: { kategorie: bezug.anzeige, trainer: themenname ?? `trainer.${bezug.trainer}.name` },
    knopf: "naechster.knopf.ueben",
    ziel: bezug.thema
      ? { bildschirm: "trainer", kennung: bezug.trainer, thema: bezug.thema }
      : { bildschirm: "trainer", kennung: bezug.trainer },
  };
}

/**
 * Vor der Partie: ein fertig zusammengestellter Kurzplan (15 Minuten, Trainer „Kurzpläne“).
 * Warum: Wunsch des Autors (6.11.2026), die 15- und 30-Minuten-Pläne in die Empfehlungen der
 * Startseite zu holen; wer wenig Zeit hat, muss dann nichts selbst auswählen.
 */
function kurzplan(lage: Lage): Vorschlag | null {
  if (!bereitFuerAufgaben(lage)) return null;
  return {
    art: "kurzplan",
    text: "naechster.kurzplan",
    werte: {},
    knopf: "naechster.knopf.kurzplan",
    ziel: { bildschirm: "trainer", kennung: "kurzplaene" },
  };
}

/** Alle Arten; ein neuer Trainer ergänzt eine Zeile mit eigenem Rang. */
export const VORSCHLAGSARTEN: readonly Vorschlagsart[] = [
  { kennung: "faellig", rang: 10, ermittle: faelligeKarten },
  { kennung: "tagesaufgabe", rang: 20, ermittle: tagesaufgabe },
  { kennung: "weiterlesen", rang: 30, ermittle: weiterlesen },
  { kennung: "uebungen", rang: 40, ermittle: offeneUebungen },
  { kennung: "thema", rang: 50, ermittle: schwachesThema },
  { kennung: "muster", rang: 52, ermittle: muster },
  { kennung: "phase", rang: 55, ermittle: phase },
  { kennung: "fehler", rang: 60, ermittle: fehlerdatenbank },
  { kennung: "kurzplan", rang: 80, ermittle: kurzplan },
  { kennung: "partie", rang: 90, ermittle: partie },
];
