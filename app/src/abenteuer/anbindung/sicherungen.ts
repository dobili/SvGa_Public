/**
 * Sicherungen des Abenteuers: Der Leser speichert selbst und lädt später diesen Stand (Wunsch des
 * Autors, 28.11.2026: „Selbst speichern und laden außerhalb von Partien“).
 *
 * Rolle im Gesamtbild: Neben den Speicherplätzen (speicherplaetze.ts), die von selbst speichern,
 * liegen im Feld `abenteuersicherungen` der Nutzerdaten Kopien eines Platzes zu einem Zeitpunkt.
 * Das Spielmenü legt sie an („Speichern“), die Ladeliste des Hauptmenüs zeigt sie unter ihrem
 * Platz zum Laden und Löschen. Reine Funktionen; useSpeicherplaetze.ts schreibt sie.
 * Datenmodell (schlank): eine Sicherung ist { platz, gesichert, stand }, der Platz ist der Beginn
 * des Stands. Höchstens SICHERUNGEN_HOECHSTENS je Platz; die älteste fällt weg (das Spielmenü
 * sagt es). Ein Stand ist am Ende des Spiels etwa 30 bis 40 KB groß (Gesamtsimulation, Akt 4:
 * 30 KB), zehn Sicherungen also unter 0,5 MB je Spiel.
 * Offene Partie: Gesichert wird nur in der freien Welt ohne offene Partie, Aufgabenrunde oder
 * Ergebniskarte (sicherbar). Warum: Die App hält nur eine laufende Partie; eine Kopie mitten in
 * einer Partie hätte die Partie verdoppelt oder ihre Züge verloren. Beim Laden einer Sicherung
 * entfällt deshalb eine offene Partie ihres Platzes (sie gehört zum späteren Stand).
 * Abhängigkeiten: speicherplaetze.ts, speicher/format.ts (Typ), schnittstelle/spielstand.ts.
 */
import type { Nutzerdaten } from "../../speicher/format";
import type { Abenteuerstand, Sicherung } from "../schnittstelle/spielstand";
import {
  gehoertZumStand,
  mitGeladenemPlatz,
  platzkennung,
  type Platzdaten,
} from "./speicherplaetze";

/** So viele Sicherungen behält ein Spiel; danach fällt die älteste weg. */
export const SICHERUNGEN_HOECHSTENS = 10;

/** Der Teil der Nutzerdaten, den Sicherungen ändern. */
export type Sicherungsdaten = Platzdaten & Pick<Nutzerdaten, "abenteuersicherungen">;

/** Die Sicherungen eines Platzes, die neueste zuerst. */
export function sicherungenDes(
  d: Pick<Nutzerdaten, "abenteuersicherungen">,
  platz: string,
): Sicherung[] {
  return d.abenteuersicherungen
    .filter((s) => s.platz === platz)
    .sort((a, b) => b.gesichert.localeCompare(a.gesichert));
}

/**
 * Darf der Stand jetzt gesichert werden? Nur ohne offene Partie, Aufgabenrunde und Ergebniskarte
 * (siehe Dateikopf). Beispiel: Kim läuft durch Maple Falls → true; Kim mitten in der Partie gegen
 * Juno (laufendePartie gesetzt) → false.
 */
export function sicherbar(stand: Abenteuerstand): boolean {
  return stand.laufendePartie === null && stand.laufendeAufgaben === null && !stand.ergebniskarte;
}

/** Fällt beim nächsten Sichern des Platzes die älteste Sicherung weg? */
export function aeltesteFaelltWeg(
  d: Pick<Nutzerdaten, "abenteuersicherungen">,
  platz: string,
): boolean {
  return sicherungenDes(d, platz).length >= SICHERUNGEN_HOECHSTENS;
}

/**
 * Sichert den Stand des gespielten Platzes: Er wird auch der gespielte Stand (mit der Position
 * des Helden von eben), und eine Kopie kommt zu den Sicherungen.
 * Eingaben: Daten, der Stand (von der Oberwelt mit Position und Spielzeit, sicherungswunsch.ts),
 * der Zeitpunkt. Ausgabe: die neuen Daten.
 * Sonderfälle: Gehört der Stand nicht zum gespielten Platz oder ist er nicht sicherbar,
 * unverändert. Schon eine Sicherung zur selben Millisekunde: der Zeitpunkt rückt vor. Sind es
 * SICHERUNGEN_HOECHSTENS, fällt die älteste des Platzes weg.
 */
export function mitSicherung<T extends Sicherungsdaten>(
  d: T,
  stand: Abenteuerstand,
  jetzt: Date,
): T {
  const platz = platzkennung(stand);
  if (!d.abenteuer || platzkennung(d.abenteuer) !== platz || !sicherbar(stand)) return d;
  const eigene = sicherungenDes(d, platz);
  const belegt = new Set(eigene.map((s) => s.gesichert));
  let zeit = jetzt.getTime();
  while (belegt.has(new Date(zeit).toISOString())) zeit += 1;
  const neu: Sicherung = { platz, gesichert: new Date(zeit).toISOString(), stand };
  const weg = eigene.slice(SICHERUNGEN_HOECHSTENS - 1);
  const bleiben = d.abenteuersicherungen.filter((s) => !weg.includes(s));
  return { ...d, abenteuer: stand, abenteuersicherungen: [neu, ...bleiben] };
}

/**
 * Lädt eine Sicherung: Ihr Platz wird der gespielte (ruht er, wie Laden in der Ladeliste), sein
 * Stand wird der gesicherte. Eine offene Partie des Platzes entfällt (siehe Dateikopf); die
 * Sicherung selbst bleibt, man kann sie wieder laden.
 * Sonderfall: Unbekannte Sicherung → unverändert.
 * Beispiel: Kim (Akt 2) gespielt, Sicherung von Kim in Akt 1 geladen → Kim spielt wieder Akt 1.
 */
export function mitGeladenerSicherung<T extends Sicherungsdaten>(
  d: T,
  platz: string,
  gesichert: string,
): T {
  const sicherung = d.abenteuersicherungen.find(
    (s) => s.platz === platz && s.gesichert === gesichert,
  );
  if (!sicherung) return d;
  const geladen = mitGeladenemPlatz(d, platz);
  const aktiv = geladen.abenteuer;
  if (!aktiv || platzkennung(aktiv) !== platz) return d;
  const laufend = geladen.spiel.laufend;
  const weg = laufend !== null && gehoertZumStand(laufend, aktiv);
  return {
    ...geladen,
    abenteuer: sicherung.stand,
    spiel: weg ? { ...geladen.spiel, laufend: null } : geladen.spiel,
  };
}

/** Löscht eine Sicherung; unbekannt → unverändert. */
export function ohneSicherung<T extends Sicherungsdaten>(
  d: T,
  platz: string,
  gesichert: string,
): T {
  const bleiben = d.abenteuersicherungen.filter(
    (s) => !(s.platz === platz && s.gesichert === gesichert),
  );
  return bleiben.length === d.abenteuersicherungen.length
    ? d
    : { ...d, abenteuersicherungen: bleiben };
}

/** Löscht alle Sicherungen eines Platzes (beim Löschen des Platzes). */
export function ohneSicherungenDes<T extends Sicherungsdaten>(d: T, platz: string): T {
  const bleiben = d.abenteuersicherungen.filter((s) => s.platz !== platz);
  return bleiben.length === d.abenteuersicherungen.length
    ? d
    : { ...d, abenteuersicherungen: bleiben };
}

/** Felder, die sich ohne Fortschritt ändern (Verlassen der Welt, Laufen, Uhr). */
const OHNE_FORTSCHRITT: ReadonlySet<string> = new Set([
  "position",
  "spielzeitSekunden",
  "spielzeitJeOrt",
  "zuletztGespielt",
  "spieluhr",
]);

/**
 * Der Fortschritt eines Stands als Vergleichstext: alles außer Zeit, Uhr und Position. Warum:
 * Schon das Verlassen der Welt schreibt Position, Spielzeit und „zuletzt gespielt“; das ist kein
 * Fortschritt, der beim Laden verloren ginge.
 */
function fortschrittVon(stand: Abenteuerstand): string {
  return JSON.stringify(Object.entries(stand).filter(([feld]) => !OHNE_FORTSCHRITT.has(feld)));
}

/**
 * Geht beim Laden einer Sicherung Fortschritt verloren? Nein, wenn der jetzige Stand des Platzes
 * im Fortschritt einer seiner Sicherungen gleicht (dann ist er gesichert). Sonst der Zeitpunkt,
 * seit dem nicht gesichert ist: die neueste Sicherung des Platzes.
 * Eingaben: der jetzige Stand des Platzes, seine Sicherungen (neueste zuerst, sicherungenDes).
 * Beispiel: Kim gesichert um 10:00, danach eine Quest gelöst → „2026-11-28T10:00:00.000Z“;
 * gleich nach dem Sichern geladen → null.
 */
export function ungesichertSeit(
  stand: Abenteuerstand,
  eigene: readonly Sicherung[],
): string | null {
  const jetzt = fortschrittVon(stand);
  if (eigene.some((s) => fortschrittVon(s.stand) === jetzt)) return null;
  return eigene[0]?.gesichert ?? null;
}
