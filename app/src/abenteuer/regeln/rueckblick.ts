/**
 * „Was bisher geschah“ im Tagebuch (Auftrag des Haupt-Chats, 20.11.2026): je abgeschlossenem Akt
 * eine kurze Zusammenfassung, für den laufenden Akt je erledigter Hauptquest ein, zwei Sätze, in
 * der Stimme des Tagebuchs („ich“, ohne Geschlecht des Helden).
 *
 * Warum: Das Spiel wird über viele Tage gespielt. Wer nach einer Pause zurückkommt, findet im
 * Tagebuch bisher nur Titel erledigter Aufgaben; was in Riverton geschah oder warum Ambrose fort
 * war, steht nirgends. Gute Abenteuer halten die Geschichte im Tagebuch mit, ohne vorzugreifen.
 * Regel: Nur, was gespielt ist. Ein Akt gilt als abgeschlossen, wenn seine letzte Hauptquest
 * erledigt ist; vorher erscheinen nur die Sätze der erledigten Hauptquests dieses Akts.
 * Rolle im Gesamtbild: reine Regel für oberwelt/WasBisherGeschah.tsx; Texte in texte/de.json
 * („rueckblick.*“). Abhängigkeiten: schnittstelle/spielstand.ts.
 */
import type { Abenteuerstand, Queststand } from "../schnittstelle/spielstand";

/** Hauptquests je Akt in Spielreihenfolge; die letzte schließt den Akt ab. */
export const AKTQUESTS: readonly (readonly string[])[] = [
  [
    "mapleFalls.einzug",
    "mapleFalls.dasBrett",
    "mapleFalls.ersterAbend",
    "mapleFalls.viertesBrett",
    "mapleFalls.besserWerden",
    "cedarCreek.archiv1858",
    "cedarCreek.clubkampf",
  ],
  ["riverton.parkclub", "ironwood.turnier", "ironwood.mamasFinale", "ironwood.clubkampf"],
  ["siliconBay.akademie", "portDelacroix.tiefpunkt", "desertSprings.versoehnung"],
  [
    "summitCity.endspiel",
    "crossroads.treffpunkt",
    "pinewoodCamp.sommercamp",
    "ghostTown.fernpartie",
    "capitalArena.meisterschaft",
  ],
];

/** Ein Eintrag: Überschrift (Schlüssel und Werte) und die Sätze (Schlüssel). */
export interface Rueckblickeintrag {
  readonly akt: number;
  /** true: Zusammenfassung eines abgeschlossenen Akts; false: der laufende Akt bis jetzt. */
  readonly abgeschlossen: boolean;
  readonly saetze: readonly string[];
}

/** Textschlüssel des Satzes zu einer Hauptquest. Beispiel: „rueckblick.quest.riverton.parkclub“. */
export function questsatz(kennung: string): string {
  return `rueckblick.quest.${kennung}`;
}

/** Ob die Quest im Stand erledigt ist. */
function erledigt(stand: Abenteuerstand, kennung: string): Queststand | null {
  return stand.quests.find((q) => q.kennung === kennung && q.erledigt) ?? null;
}

/**
 * Die Einträge von „Was bisher geschah“, ältester Akt zuerst.
 * Eingaben: Spielstand. Ausgabe: abgeschlossene Akte mit ihrer Zusammenfassung, dann der laufende
 * Akt mit den Sätzen seiner erledigten Hauptquests (nach Erledigung geordnet); fehlt er, wenn noch
 * nichts erledigt ist.
 * Beispiel: Akt 1 abgeschlossen (Cedar Creek erledigt), in Akt 2 „Der letzte Tisch“ erledigt →
 * [{ akt 1, abgeschlossen, [„rueckblick.akt1“] }, { akt 2, laufend, [„rueckblick.quest.riverton.parkclub“] }].
 * Sonderfall: Nach dem Finale (Akt 4 abgeschlossen) stehen alle vier Zusammenfassungen da.
 */
export function rueckblick(stand: Abenteuerstand): Rueckblickeintrag[] {
  const eintraege: Rueckblickeintrag[] = [];
  for (const [i, quests] of AKTQUESTS.entries()) {
    const akt = i + 1;
    const letzte = quests[quests.length - 1];
    if (letzte !== undefined && erledigt(stand, letzte)) {
      eintraege.push({ akt, abgeschlossen: true, saetze: [`rueckblick.akt${akt}`] });
      continue;
    }
    const fertig = quests
      .map((k) => erledigt(stand, k))
      .filter((q): q is Queststand => q !== null)
      .sort((a, b) => (a.erledigtAm ?? "").localeCompare(b.erledigtAm ?? ""));
    if (fertig.length > 0) {
      eintraege.push({
        akt,
        abgeschlossen: false,
        saetze: fertig.map((q) => questsatz(q.kennung)),
      });
    }
    break;
  }
  return eintraege;
}
