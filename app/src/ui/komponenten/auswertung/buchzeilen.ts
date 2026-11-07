/**
 * Warum-Zeile und Findezeile eines Zuges: Kategorie mit Kurzname, Fundstelle, Satz und dem Trainer,
 * den „Üben“ öffnet (Konzept „Fehler mit Buchbezug“, Abschnitt 4.1).
 *
 * Rolle im Gesamtbild: Buchzeilen.tsx zeigt die Zeilen auf den Karten der Zeitleiste und im
 * Rückblick Zug für Zug; diese Datei holt die Befunde (spiel/buchzuege.ts: W1 bis W10, F1 bis
 * F10 mit den Regeln der Karte) und setzt die Texte zusammen. Die Rechnung kostet je Zug einige
 * Millisekunden (am Handy mehr); das Ergebnis bleibt deshalb je Partie im Speicher der Sitzung
 * (Konzept 4.2). Sie läuft erst nach dem ersten Bild und nachdem die Buchdaten (Fallen,
 * Buchvarianten) da sind, damit die Auswertung nicht stockt.
 * Abhängigkeiten: spiel/buchzuege.ts, spiel/findetext.ts, spiel/buchbezug.ts, buchkontext.ts,
 * training/themennamen.ts, i18n, React (useBuchzeilen).
 */
import { useEffect, useState } from "react";
import type { Findetreffer } from "../../../analyse/findekategorien";
import { sprache, t } from "../../../i18n/sprache";
import type { Zugklasse, Zugurteil } from "../../../spiel/auswertung";
import { BUCHBEZUG, type Buchkennung } from "../../../spiel/buchbezug";
import {
  buchbefundeFuer,
  type Auswertungsdaten,
  type Buchkontextdaten,
} from "../../../spiel/buchzuege";
import { findesatz } from "../../../spiel/findetext";
import type { Warumbefund } from "../../../spiel/warumkategorie";
import { themennameSchluessel } from "../../../training/themennamen";
import type { TrainerKennung } from "../../../training/trainer";
import { ladeBuchkontext } from "./buchkontext";

/** Was eine Zeile zeigt und was „Üben“ öffnet. */
export interface Buchzeile {
  readonly kennung: Buchkennung;
  /** Kurzname, etwa „Drohung stehen gelassen“. */
  readonly anzeige: string;
  /** Kapitel der Fundstelle in Klammern für die zugeklappte Zeile, etwa „(Kapitel 1)“. */
  readonly kapitel: string;
  /** Ganze Fundstelle in Klammern, etwa „(Kapitel 1, Schach-Röntgen-Regel)“. */
  readonly quelle: string;
  /** Der Satz, etwa „Die Drohung Sxe4 stand schon vor deinem Zug …“. */
  readonly text: string;
  /** Aufschrift des Knopfes, etwa „Üben: Schach-Röntgen-Trainer“. */
  readonly ueben: string;
  readonly trainer: TrainerKennung;
  /** Thema für den Trainer (ui/trainer/trainerthema.ts); null ohne Vorwahl. */
  readonly thema: string | null;
}

/** Beide Zeilen eines Zuges (Warum vor Finden); je null ohne Kategorie. */
export interface Buchzeilen {
  readonly warum: Buchzeile | null;
  readonly finde: Buchzeile | null;
}

const KEINE: Buchzeilen = { warum: null, finde: null };

/** Je Partie (an ihren Werten erkannt) die schon gerechneten Zeilen. */
const ZWISCHENSPEICHER = new WeakMap<readonly number[], Map<string, Buchzeilen>>();

/** Der Name des Trainers oder seines Themas für „Üben: …“. */
function uebenName(trainer: TrainerKennung, thema: string | null): string {
  const schluessel = thema ? themennameSchluessel(thema) : null;
  return schluessel ? t(schluessel) : t(`trainer.${trainer}.name`);
}

/** Die Zeile zu Kennung, Satz, Fundstelle und Thema. */
function zeile(kennung: Buchkennung, text: string, quelle: string, thema: string | null) {
  const bezug = BUCHBEZUG[kennung];
  return {
    kennung,
    anzeige: t(bezug.anzeige),
    // Zugeklappt nur das Kapitel (Teil vor dem ersten Komma), damit die Karte bei 320 px niedrig
    // bleibt (Höhentest der Zeitleiste); die ganze Fundstelle steht im aufgeklappten Satz.
    kapitel: t("buchbezug.fundstelle", { quelle: quelle.split(",")[0] ?? quelle }),
    quelle: t("buchbezug.fundstelle", { quelle }),
    text,
    ueben: t("buchbezug.ueben", { name: uebenName(bezug.trainer, thema) }),
    trainer: bezug.trainer,
    thema,
  };
}

/** Die Warum-Zeile aus einem Befund. */
export function warumzeileAus(befund: Warumbefund): Buchzeile {
  const thema = befund.thema ?? BUCHBEZUG[befund.kennung].thema;
  return zeile(befund.kennung, t(befund.text, befund.werte), t(befund.quelle), thema);
}

/** Die Findezeile aus einem Treffer. */
export function findezeileAus(treffer: Findetreffer): Buchzeile {
  const satz = findesatz(treffer);
  const bezug = BUCHBEZUG[treffer.kennung];
  return zeile(treffer.kennung, t(satz.text, satz.werte), t(bezug.quelle), satz.thema);
}

/**
 * Die Zeilen zum Zug, aus dem Zwischenspeicher der Sitzung oder neu gerechnet.
 *
 * Eingaben: Auswertungsdaten der Partie, Urteil des Zuges, Klassen mit Warum-Zeile, Buchdaten.
 * Beispiel: Opernpartie gegen Derya, 12. O-O-O?? → Warum W3 „Drohung stehen gelassen“, „Üben:
 * Schach-Röntgen-Trainer“.
 * Sonderfall: Ein Sprachwechsel rechnet neu (der Schlüssel enthält die Sprache).
 */
export function buchzeilenFuer(
  daten: Auswertungsdaten,
  urteil: Zugurteil,
  warumKlassen: ReadonlySet<Zugklasse>,
  kontext: Buchkontextdaten,
): Buchzeilen {
  const schluessel = `${urteil.index}:${urteil.klasse}:${warumKlassen.size}:${sprache()}`;
  const speicher = ZWISCHENSPEICHER.get(daten.werte) ?? new Map<string, Buchzeilen>();
  ZWISCHENSPEICHER.set(daten.werte, speicher);
  const alt = speicher.get(schluessel);
  if (alt) return alt;
  const { warum, finde } = buchbefundeFuer(daten, urteil, warumKlassen, kontext);
  const neu = {
    warum: warum ? warumzeileAus(warum) : null,
    finde: finde ? findezeileAus(finde) : null,
  };
  speicher.set(schluessel, neu);
  return neu;
}

/**
 * Die Zeilen, gerechnet nach dem ersten Bild und nach dem Laden der Buchdaten; ohne Urteil,
 * solange sie fehlen, oder ohne Kategorie beide null.
 */
export function useBuchzeilen(
  daten: Auswertungsdaten,
  urteil: Zugurteil | null,
  warumKlassen: ReadonlySet<Zugklasse>,
): Buchzeilen {
  const [stand, setzeStand] = useState<{ urteil: Zugurteil; zeilen: Buchzeilen } | null>(null);
  useEffect(() => {
    if (!urteil) return undefined;
    let aktiv = true;
    void ladeBuchkontext().then((kontext) => {
      if (aktiv)
        setzeStand({ urteil, zeilen: buchzeilenFuer(daten, urteil, warumKlassen, kontext) });
    });
    return () => {
      aktiv = false;
    };
  }, [daten, urteil, warumKlassen]);
  // Nur die Zeilen des gezeigten Zuges; ein älteres Ergebnis bleibt unsichtbar.
  const passt = stand && urteil && stand.urteil.index === urteil.index;
  return passt && stand.urteil.klasse === urteil.klasse ? stand.zeilen : KEINE;
}

/** Öffnen zwei Zeilen denselben Trainer mit demselben Thema? Dann genügt ein „Üben“. */
export function gleichesUeben(a: Buchzeile | null, b: Buchzeile | null): boolean {
  return a !== null && b !== null && a.trainer === b.trainer && a.thema === b.thema;
}
