/**
 * Das Ergebnis des gewählten Werkzeugs auf dem Abbildung-Bildschirm und ob es einen Sicht-Schalter
 * bekommt.
 *
 * Rolle im Gesamtbild: Verbindet die Wahl in der Werkzeugleiste mit dem Verzeichnis der Werkzeuge
 * (analyse/register.ts). Eigene Datei, damit der Abbildung-Bildschirm übersichtlich bleibt.
 * Abhängigkeiten: analyse/register.ts, Buchdaten (Typen), schach/.
 */
import { wende } from "../../analyse/register";
import type { Werkzeugergebnis } from "../../analyse/werkzeug";
import type { Bilanz, Fallencheck, Uebung } from "../../daten/generiert/kapitel";
import type { Eroeffnungsindex } from "../../schach/eroeffnungsindex";
import type { Farbe, Stellung } from "../../schach/stellung";
import type { Verlauf } from "../../schach/todsuenden";
import type { Werkzeugwahl } from "./Werkzeugleiste";

/**
 * Werkzeuge, deren Ergebnis nicht von der Sicht abhängt: Sie rechnen für das angetippte Feld,
 * die Seite am Zug, die stärkere Seite, beide Seiten oder ohne Farbe. Ihre Karte bekommt keinen
 * Sicht-Schalter. Der Test werkzeugergebnis.test.ts prüft an Buchabbildungen, dass diese Liste
 * stimmt (seit 0.2.28 auch Vorher und Erkennungsbild; seit C1.25 auch Turmendspiel: Mit
 * höchstens einem Bauern am Brett ist der Angreifer eindeutig, sonst folgt nur der Verweis).
 */
export const OHNE_SICHT: ReadonlySet<string> = new Set([
  "k1-zaehlen",
  "k2-eroeffnung",
  "k4-falle",
  "k5-vorher",
  "k7-motiv",
  "k8-opposition",
  "k8-elementarmatt",
  "k9-turmbegriffe",
  "k9-erkennungsbilder",
  // Die Phase gilt für beide Seiten gleich (Entscheidung des Autors zu C1.27, 0.2.33).
  "k11-phase",
]);

/** Hat das Werkzeug einen Sicht-Schalter (Entscheidung des Autors, 15.10.2026)? */
export function hatSicht(werkzeug: string): boolean {
  return !OHNE_SICHT.has(werkzeug);
}

/**
 * Ergebnis des gewählten Werkzeugs (null ohne Werkzeug): „Zählen“ für das angetippte Feld, ein Werkzeug des Buches
 * (etwa k1-roentgen) für die ganze Stellung aus der gewählten Sicht (Standard: die Seite am Zug,
 * Pflichtenheft 6.1; Schalter „Sicht“ seit 0.2.27). Der nächste Zug der Zugleiste gilt als
 * geplanter Zug (k4-prueffragen), der Eröffnungsindex kommt für k2-eroeffnung mit.
 */
export function werkzeugergebnis(
  wahl: Werkzeugwahl | null,
  zaehlfeld: string | null,
  stellung: Stellung,
  dazu: {
    sicht: Farbe;
    naechsterZug: string | null;
    verlauf: Verlauf;
    eroeffnungen: Eroeffnungsindex | undefined;
    fallencheck: Fallencheck | undefined;
    bilanz: Bilanz | undefined;
    fortsetzung: readonly string[];
    uebung: Uebung | undefined;
    abschnitt: string | undefined;
    buchstellung?: boolean;
  },
): Werkzeugergebnis | null {
  const eingabe = {
    stellung,
    perspektive: dazu.sicht,
    zug: dazu.naechsterZug ?? undefined,
    verlauf: dazu.verlauf,
    eroeffnungen: dazu.eroeffnungen,
    fallencheck: dazu.fallencheck,
    bilanz: dazu.bilanz,
    fortsetzung: dazu.fortsetzung,
    uebung: dazu.uebung,
    abschnitt: dazu.abschnitt,
    buchstellung: dazu.buchstellung,
  };
  if (wahl === "zaehlen")
    return zaehlfeld ? wende("k1-zaehlen", { ...eingabe, feld: zaehlfeld }) : null;
  if (wahl === null || wahl === "ziehen" || wahl === "engine") return null;
  return wende(wahl, eingabe);
}
