/**
 * Der Rückweg aus einer Partie oder Aufgabenrunde des Abenteuers in die Oberwelt.
 *
 * Rolle im Gesamtbild: Die Oberwelt öffnet Partie und Runde als eigene Ansicht über sich
 * (anbindung/dienste.ts). Der Knopf „Weiter“ der Partiehülle und der Runde führt zurück. Legte er
 * die Oberwelt als neue Ansicht obendrauf, blieb die beendete Partie darunter liegen: Die
 * Zurück-Taste und „Zurück zur App“ führten dann nicht aus dem Spiel, sondern in die alte Partie
 * oder zu „Diese Aufgabenrunde ist nicht mehr offen“ (Funktionstest N2610, 15.11.2026). Deshalb
 * geht der Knopf zurück, wenn die Oberwelt direkt darunter liegt, und ersetzt sonst die Ansicht.
 * Seit dem Hauptmenü (27.11.2026) merkt sich der Rückweg vorher die Spielsitzung des Tabs
 * (spielsitzung.ts): Wer die Partie aus der App öffnete (Reiter „Spielen“, nach „Zurück zur
 * App“) oder nach einem Neustart der App in der Partie stand, landete nach „Weiter“ sonst im
 * Hauptmenü, beim Neustart sogar erst im Startbild, statt in der Welt, die das Ergebnis zeigt.
 * Abhängigkeiten: app/navigationsKontext.ts, app/stapel.ts, schnittstelle/modul.ts,
 * speicher/speicher.ts, spielsitzung.ts, speicherplaetze.ts.
 */
import { useNavigation } from "../../app/navigationsKontext";
import type { Stapel } from "../../app/stapel";
import { speicherzustand } from "../../speicher/speicher";
import { ANSICHT_ABENTEUER } from "../schnittstelle/modul";
import type { Abenteuerstand } from "../schnittstelle/spielstand";
import { platzkennung } from "./speicherplaetze";
import { merkeSitzung } from "./spielsitzung";

/**
 * Wie die Ansicht zur Oberwelt zurückkehrt.
 * Zweck: „zurueck“, wenn die Oberwelt direkt unter der obersten Ansicht liegt (der übliche Weg:
 * Welt → Partie), sonst „ersetze“ (etwa eine Partie, die nach dem Neuladen ohne Welt darunter
 * offen ist): Nie liegen zwei Oberwelten oder eine beendete Partie im Stapel.
 * Eingabe: der Stapel der Navigation. Ausgabe: „zurueck“ oder „ersetze“.
 * Beispiel: [Spielen, Abenteuer, Partie] → „zurueck“; [Spielen, Partie] → „ersetze“.
 */
export function wegZurWelt(stapel: Stapel): "zurueck" | "ersetze" {
  const darunter = stapel.ansichten[stapel.ansichten.length - 2];
  return darunter?.bildschirm === "zusatz" && darunter.kennung === ANSICHT_ABENTEUER
    ? "zurueck"
    : "ersetze";
}

/**
 * Merkt vor dem Rückweg, dass dieser Tab mit dem gespielten Stand in der Welt ist: Die Hülle
 * (AbenteuerAnsicht.tsx) geht dann ohne Startbild und Hauptmenü gleich in die Welt.
 * Sonderfall: ohne gespielten Stand (gelöscht) nichts; die Hülle zeigt dann das Hauptmenü.
 */
export function merkeWegInDieWelt(stand: Abenteuerstand | null): void {
  if (stand) merkeSitzung(platzkennung(stand));
}

/** Rückruf für den Knopf „Weiter“ von Partiehülle und Aufgabenrunde (siehe wegZurWelt). */
export function useZurWelt(): () => void {
  const { stapel, zurueck, ersetze } = useNavigation();
  return () => {
    merkeWegInDieWelt(speicherzustand().daten.abenteuer);
    if (wegZurWelt(stapel) === "zurueck") zurueck();
    else ersetze({ bildschirm: "zusatz", kennung: ANSICHT_ABENTEUER });
  };
}
