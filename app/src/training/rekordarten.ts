/**
 * Die Rekordarten der Rekordtafel (Gamifizierung P5), als Liste zum Eintragen.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (31.10.2026): eintragen statt umbauen. Ein späterer
 * Trainer oder ein neues Werkzeug ergänzt hier eine Zeile (Kennung, Quellen, Wert, Ziel des Knopfs
 * „Versuchen“) und zwei Texte „rekorde.art.<k>“ und „rekorde.wert.<k>“ in de.json und en.json;
 * ein Test prüft die Texte. Bringt der Trainer den Wert selbst mit, ruft er
 * pruefeRekorde(daten, { quelle, wert }, jetzt, REKORDARTEN) auf (wie die Zeitrunde); hat er einen
 * Rundenrahmen, genügt die Quelle „runde“ und ein Wert aus den Nutzerdaten.
 * Quellen: „runde“ (Ende jeder Trainerrunde, ui/trainer/nachDerRunde.ts), „partie“ (Partieende,
 * speicher/partieprotokoll.ts), „zeitrunde“ und „tagesserie“ (ui/trainer/ZeitrundeBereich.tsx);
 * beim Öffnen der Rekordtafel werden alle Werte aus den Nutzerdaten geprüft.
 * Die Aufgabenserie ohne Fehler (Serienmodus im Taktiktrainer) folgt mit Quelle „serie“.
 * Abhängigkeiten: training/rekorde.ts (Typ), training/rekordwerte.ts, speicher/rekordmerker.ts.
 */
import { REKORD_TAGESSERIE, REKORD_TAKTIKZEIT } from "../speicher/rekordmerker";
import type { Rekordart } from "./rekorde";
import {
  besteRatequote,
  hoechsteWertung,
  laengstePartieOhnePatzer,
  meisteLerntageInEinerWoche,
  meisteRichtigeAnEinemTag,
  staerksterBesiegterBot,
} from "./rekordwerte";

const KURZPLAENE = { bildschirm: "trainer", kennung: "kurzplaene" } as const;
const SPIELEN = { bildschirm: "spielen" } as const;

/** Alle Rekordarten in der Reihenfolge der Tafel; je neue Art eine Zeile. */
export const REKORDARTEN: readonly Rekordart[] = [
  { kennung: REKORD_TAKTIKZEIT, quellen: ["zeitrunde"], versuchen: KURZPLAENE },
  { kennung: REKORD_TAGESSERIE, quellen: ["tagesserie"], versuchen: KURZPLAENE },
  {
    kennung: "trainerTag",
    quellen: ["runde"],
    ausDaten: meisteRichtigeAnEinemTag,
    versuchen: { bildschirm: "training" },
  },
  {
    kennung: "lerntageWoche",
    quellen: ["runde", "partie"],
    ausDaten: meisteLerntageInEinerWoche,
    versuchen: { bildschirm: "training" },
  },
  {
    kennung: "zugErraten",
    quellen: ["runde"],
    ausDaten: besteRatequote,
    versuchen: { bildschirm: "trainer", kennung: "zugErraten" },
  },
  { kennung: "wertung", quellen: ["partie"], ausDaten: hoechsteWertung, versuchen: SPIELEN },
  { kennung: "bot", quellen: ["partie"], ausDaten: staerksterBesiegterBot, versuchen: SPIELEN },
  {
    kennung: "ohnePatzer",
    quellen: ["partie"],
    ausDaten: laengstePartieOhnePatzer,
    versuchen: SPIELEN,
  },
];
