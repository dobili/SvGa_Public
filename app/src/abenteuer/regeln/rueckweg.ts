/**
 * Rückweg aus Partie und Aufgabenrunde in den Spielstand (Regelwerk R18 bis R21, R31): reine
 * Funktionen, die aus Ergebnis und Spieldaten den neuen Spielstand bauen.
 *
 * Rolle im Gesamtbild: Die Oberwelt liest beim Aufbau ein offenes Ergebnis (Dienste der App) und
 * ruft diese Funktionen; sie selbst zeigt nur noch die Ergebniskarte. Hier entstehen Clubnadel
 * und Clubstand, Protokolleintrag, Rundenstand und Aufgabenreihe sowie die Dialogvariablen für die
 * Ink-Dateien (regeln/dialogvariablen.ts).
 * Abhängigkeiten: regeln/karten.ts, regeln/aufgaben.ts, regeln/dialogvariablen.ts, daten/laden.ts.
 * Beispiel: Sieg gegen Coach Delgado ohne Karten → Goldnadel für mapleFalls, Protokolleintrag mit
 * Gegner mapleFalls.coachDelgado, `ausgangMapleFallsClubkampf` = „sieg“, `nadelMapleFalls` = 3.
 */
import type { Spieldaten } from "../daten/laden";
import type { Aufgabenauftrag, Aufgabenergebnis } from "../schnittstelle/aufgaben";
import type { Nadelstufe, Partieergebnis } from "../schnittstelle/partie";
import type { Abenteuerstand, Clubstand } from "../schnittstelle/spielstand";
import { mitRundenergebnis, reiheBestanden, wertung } from "./aufgaben";
import { variablenNachNadel, variablenNachPartie, variablenNachRunde } from "./dialogvariablen";
import { besteNadel, clubnadel } from "./karten";
import { MUENZEN, strassensiegMuenzen } from "./muenzen";
import { nachStoryPartie } from "./wertung";

/** Ein Club mit geänderten Feldern; fehlt er noch, entsteht er leer. */
function mitClub(
  clubs: readonly Clubstand[],
  kennung: string,
  aenderung: (alt: Clubstand) => Clubstand,
): readonly Clubstand[] {
  const alt: Clubstand = clubs.find((c) => c.kennung === kennung) ?? {
    kennung,
    nadel: null,
    aufgabenreihe: false,
    versuche: 0,
    steckbrief: [],
  };
  return [...clubs.filter((c) => c.kennung !== kennung), aenderung(alt)];
}

/** Was der Rückweg einer Partie liefert: neuer Stand, Nadel dieser Partie, Begegnung. */
export interface Partierueckweg {
  readonly stand: Abenteuerstand;
  readonly nadel: Nadelstufe | null;
  readonly begegnung: string;
}

/**
 * Der Spielstand nach einer beendeten Partie: Clubkampf (Gegner ist der Clubchef des Ortes) →
 * Clubnadel und Versuch; Protokolleintrag; Dialogvariablen; laufende Partie und Karten gelöscht.
 */
export function standNachPartie(
  stand: Abenteuerstand,
  ergebnis: Partieergebnis,
  daten: Spieldaten,
): Partierueckweg {
  const begegnung = ergebnis.kennung.split("#")[0] ?? "";
  const b = daten.begegnungen.find((x) => x.kennung === begegnung);
  const ort = daten.orte.find((o) => o.club?.chef === b?.gegner);
  const nadel = ort ? clubnadel(ergebnis.ausgang, stand.partiekarten) : null;
  const clubs =
    ort && nadel
      ? mitClub(stand.clubs, ort.kennung, (alt) => ({
          ...alt,
          nadel: besteNadel(alt.nadel, nadel),
          versuche: alt.versuche + 1,
        }))
      : stand.clubs;
  const dialogvariablen = {
    ...stand.dialogvariablen,
    ...variablenNachPartie(begegnung, ergebnis.ausgang, stand.dialogvariablen),
    ...(ort
      ? variablenNachNadel(ort.kennung, clubs.find((c) => c.kennung === ort.kennung)?.nadel ?? null)
      : {}),
  };
  // Münzen (G1): Sieg gegen einen Straßengegner, erste Nadel eines Clubs.
  const rolle = daten.gegner.find((g) => g.kennung === b?.gegner)?.rolle;
  const ersteNadel = ort && nadel && !stand.clubs.find((c) => c.kennung === ort.kennung)?.nadel;
  const verdient =
    (rolle === "strasse" && ergebnis.ausgang === "sieg" && b
      ? strassensiegMuenzen(stand.protokoll, b.gegner, ergebnis.beendet)
      : 0) + (ersteNadel ? MUENZEN.ersteNadel : 0);
  // Abenteuerwertung (R2, R38): nur Partien, die beim Start als zählend vermerkt wurden.
  const laufend = stand.laufendeWertung;
  const gewertet = laufend?.zaehlt
    ? nachStoryPartie(stand, laufend.zielElo, ergebnis.ausgang, ergebnis.gespielteKarten)
    : stand;
  return {
    begegnung,
    nadel,
    stand: {
      ...gewertet,
      muenzen: gewertet.muenzen + verdient,
      clubs,
      dialogvariablen,
      laufendePartie: null,
      laufendeWertung: null,
      partiekarten: null,
      protokoll: [
        ...stand.protokoll,
        {
          ergebnis,
          ort: stand.position.karte.split(".")[0] ?? "",
          gegner: b?.gegner ?? begegnung,
          wiedereinstieg: stand.partiekarten?.wiedereinstieg ?? false,
        },
      ],
    },
  };
}

/** Was der Rückweg einer Aufgabenrunde liefert. */
export interface Rundenrueckweg {
  readonly stand: Abenteuerstand;
  readonly punkte: number;
  readonly moeglich: number;
  readonly bestanden: boolean;
  /** Mit dieser Runde ist die Aufgabenreihe des Clubs erstmals vollständig (R31). */
  readonly reiheGeschafft: boolean;
}

/**
 * Der Spielstand nach einer Aufgabenrunde: Rundenstand fortschreiben, Aufgabenreihe des Clubs
 * setzen, wenn alle Reihenblöcke bestanden sind, Dialogvariable, laufende Runde gelöscht.
 */
export function standNachRunde(
  stand: Abenteuerstand,
  auftrag: Aufgabenauftrag,
  ergebnis: Aufgabenergebnis,
  daten: Spieldaten,
): Rundenrueckweg {
  const w = wertung(ergebnis);
  const runden = mitRundenergebnis(stand.runden, auftrag, ergebnis);
  const runde = daten.runden.find((r) => r.kennung === auftrag.runde);
  const bloecke = daten.runden.filter((r) => r.ort === runde?.ort && r.reihe).map((r) => r.kennung);
  const ort = daten.orte.find((o) => o.kennung === runde?.ort);
  const alt = ort ? stand.clubs.find((c) => c.kennung === ort.kennung) : undefined;
  const reiheGeschafft = !!runde?.reihe && !alt?.aufgabenreihe && reiheBestanden(runden, bloecke);
  const clubs =
    ort && reiheGeschafft
      ? mitClub(stand.clubs, ort.kennung, (c) => ({ ...c, aufgabenreihe: true }))
      : stand.clubs;
  return {
    ...w,
    reiheGeschafft,
    stand: {
      ...stand,
      runden,
      clubs,
      // Münzen (G1): jede bestandene Runde, auch Wiederholungen nach einem Fehlversuch nur einmal.
      muenzen:
        stand.muenzen +
        (w.bestanden && !stand.runden.find((x) => x.kennung === auftrag.runde)?.bestanden
          ? MUENZEN.rundeBestanden
          : 0),
      dialogvariablen: {
        ...stand.dialogvariablen,
        ...variablenNachRunde(auftrag.runde, w.bestanden),
      },
      laufendeAufgaben: null,
      aufgabenergebnis: null,
    },
  };
}
