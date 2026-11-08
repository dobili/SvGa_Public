/**
 * Quest-Auswertung: Ereignisse der Welt gegen die Questdaten halten und den Spielstand
 * fortschreiben (Schritt 8c; Daten nach schemas/abenteuer-quests.schema.json).
 *
 * Rolle im Gesamtbild: Die Oberwelt meldet, was passiert (ein Dialogknoten wurde erreicht, eine
 * Begegnung endete, eine Aufgabenrunde wurde bestanden, eine Karte oder ein Auslöser wurde
 * betreten). Diese reine Funktion entscheidet, welche Quests dadurch beginnen oder einen Schritt
 * weiterkommen, und sammelt die Wirkungen (Karte, Steckbrief, Zustand, Szene, Fragment), die
 * die Oberwelt dann anwendet. Keine Oberfläche, keine Abhängigkeit vom Speicher.
 * Abhängigkeiten: daten/laden.ts (Typen der Questdaten), schnittstelle/spielstand.ts.
 * Beispiel: Ereignis „dialog maple-falls-dachboden.ambrose_erwacht“ → Quest „mapleFalls.dasBrett“
 * geht von Schritt 1 auf 2, Wirkungen: Szene „akt1.ambroseErwacht“, Karte „fingerzeig“.
 */
import type { Questdaten } from "../daten/laden";
import type { Abenteuerstand, Queststand } from "../schnittstelle/spielstand";

type Schritt = Questdaten["schritte"][number];
export type Questereignis = Questdaten["start"];
export type Questwirkung = NonNullable<Schritt["wirkungen"]>[number];

/** Ergebnis der Auswertung: neuer Stand, gesammelte Wirkungen, was sich änderte (für Meldungen). */
export interface Questergebnis {
  readonly stand: Abenteuerstand;
  readonly wirkungen: readonly Questwirkung[];
  readonly begonnen: readonly string[];
  readonly erledigt: readonly string[];
  readonly fortgeschritten: readonly string[];
}

/** Passt ein Ereignis der Welt zu dem Ereignis, auf das ein Schritt oder Start wartet? */
export function passtEreignis(erwartet: Questereignis, ereignis: Questereignis): boolean {
  if (erwartet.art !== ereignis.art) return false;
  switch (erwartet.art) {
    case "dialog":
      return ereignis.art === "dialog" && erwartet.knoten === ereignis.knoten;
    case "aufgaben":
      return ereignis.art === "aufgaben" && erwartet.runde === ereignis.runde;
    case "partie":
      return (
        ereignis.art === "partie" &&
        erwartet.begegnung === ereignis.begegnung &&
        ereignis.ausgang.some((a) => erwartet.ausgang.includes(a))
      );
    case "ort":
      return (
        ereignis.art === "ort" &&
        erwartet.karte === ereignis.karte &&
        (erwartet.ausloeser === undefined || erwartet.ausloeser === ereignis.ausloeser)
      );
  }
}

/** Sind alle Voraussetzungen einer Quest erledigt? */
function voraussetzungenErfuellt(quest: Questdaten, staende: readonly Queststand[]): boolean {
  return (quest.voraussetzung ?? []).every((v) =>
    staende.some((s) => s.kennung === v && s.erledigt),
  );
}

/**
 * Wertet ein Ereignis aus: Zuerst kommen laufende Quests einen Schritt weiter, dann beginnen
 * neue Quests, deren Start passt. Eine Quest, die mit demselben Ereignis beginnt und schon
 * ihren ersten Schritt erfüllt, braucht das Ereignis zweimal (so bleiben Schritte lesbar).
 */
export function werteEreignisAus(
  stand: Abenteuerstand,
  quests: readonly Questdaten[],
  ereignis: Questereignis,
  jetzt: Date,
): Questergebnis {
  const iso = jetzt.toISOString();
  const wirkungen: Questwirkung[] = [];
  const begonnen: string[] = [];
  const erledigt: string[] = [];
  const fortgeschritten: string[] = [];
  const staende = stand.quests.map((qs) => {
    const quest = quests.find((q) => q.kennung === qs.kennung);
    if (!quest || qs.erledigt) return qs;
    const schritt = quest.schritte[qs.schritt];
    if (!schritt || !passtEreignis(schritt.ereignis, ereignis)) return qs;
    wirkungen.push(...(schritt.wirkungen ?? []));
    const fertig = qs.schritt + 1 >= quest.schritte.length;
    (fertig ? erledigt : fortgeschritten).push(qs.kennung);
    return {
      ...qs,
      schritt: fertig ? qs.schritt : qs.schritt + 1,
      erledigt: fertig,
      erledigtAm: fertig ? iso : null,
    };
  });
  for (const quest of quests) {
    const bekannt = staende.some((s) => s.kennung === quest.kennung);
    if (bekannt || !passtEreignis(quest.start, ereignis)) continue;
    if (!voraussetzungenErfuellt(quest, staende)) continue;
    staende.push({
      kennung: quest.kennung,
      schritt: 0,
      erledigt: false,
      angenommen: iso,
      erledigtAm: null,
    });
    begonnen.push(quest.kennung);
  }
  return { stand: { ...stand, quests: staende }, wirkungen, begonnen, erledigt, fortgeschritten };
}

/** Wendet eine Wirkung auf den Spielstand an (reine Funktion; Texte löst die Oberfläche auf). */
export function wendeWirkungAn(
  stand: Abenteuerstand,
  wirkung: Questwirkung,
  jetzt: Date,
): Abenteuerstand {
  switch (wirkung.art) {
    case "karte": {
      const anzahl = wirkung.anzahl ?? 1;
      const vorhanden = stand.karten.find((k) => k.kennung === wirkung.karte);
      const karten = vorhanden
        ? stand.karten.map((k) =>
            k.kennung === wirkung.karte ? { ...k, anzahl: k.anzahl + anzahl } : k,
          )
        : [...stand.karten, { kennung: wirkung.karte, anzahl, erhalten: jetzt.toISOString() }];
      return { ...stand, karten };
    }
    case "steckbrief": {
      const ort = wirkung.gegner.split(".")[0] ?? "";
      const club = stand.clubs.find((c) => c.kennung === ort);
      const zeilen = club ? club.steckbrief : [];
      if (zeilen.includes(wirkung.zeile)) return stand;
      const neu = club
        ? { ...club, steckbrief: [...zeilen, wirkung.zeile] }
        : {
            kennung: ort,
            nadel: null,
            aufgabenreihe: false,
            versuche: 0,
            steckbrief: [wirkung.zeile],
          };
      return { ...stand, clubs: [...stand.clubs.filter((c) => c.kennung !== ort), neu] };
    }
    case "zustand": {
      const alt = stand.figuren.find((f) => f.kennung === wirkung.gegner);
      const figur = {
        kennung: wirkung.gegner,
        abgelenkt:
          wirkung.faktor !== undefined
            ? { faktor: wirkung.faktor, grund: wirkung.grund ?? "" }
            : (alt?.abgelenkt ?? null),
        analysiert: wirkung.analysiert ?? alt?.analysiert ?? false,
        dialogvariablen: alt?.dialogvariablen ?? {},
      };
      return {
        ...stand,
        figuren: [...stand.figuren.filter((f) => f.kennung !== wirkung.gegner), figur],
      };
    }
    case "gegenstand":
      return stand.gegenstaende.includes(wirkung.gegenstand)
        ? stand
        : { ...stand, gegenstaende: [...stand.gegenstaende, wirkung.gegenstand] };
    case "szene":
      return { ...stand, handlung: { ...stand.handlung, akt: wirkung.akt, szene: wirkung.szene } };
    case "fragment": {
      const gefunden = stand.fragmente.gefunden.includes(wirkung.halbzug)
        ? stand.fragmente.gefunden
        : [...stand.fragmente.gefunden, wirkung.halbzug].sort((a, b) => a - b);
      return { ...stand, fragmente: { gefunden } };
    }
  }
}

/** Alle Wirkungen nacheinander anwenden. */
export function wendeWirkungenAn(
  stand: Abenteuerstand,
  wirkungen: readonly Questwirkung[],
  jetzt: Date,
): Abenteuerstand {
  return wirkungen.reduce((s, w) => wendeWirkungAn(s, w, jetzt), stand);
}

/** Der nächste Schritt einer laufenden Quest für das Tagebuch (Textschlüssel) oder null. */
export function naechsterSchritt(quest: Questdaten, qs: Queststand): string | null {
  if (qs.erledigt) return null;
  return quest.schritte[qs.schritt]?.text ?? null;
}
