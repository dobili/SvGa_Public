/**
 * Die Warum-Zeile einer Fehlerkarte der Zeitleiste: Kategorie W2 bis W10 mit Satz, Fundstelle und
 * dem Trainer, den „Üben“ öffnet (Konzept „Fehler mit Buchbezug“, Abschnitt 4.1).
 *
 * Rolle im Gesamtbild: Warumzeile.tsx zeigt die Zeile; diese Datei holt aus der gespeicherten
 * Auswertung (Partieeintrag: beste Züge und Varianten) die Eingaben für spiel/warumkategorie.ts
 * und setzt die Texte zusammen. Die Rechnung kostet je Zug einige Millisekunden (am Handy mehr);
 * das Ergebnis bleibt deshalb je Partie im Speicher der Sitzung (Konzept 4.2), nicht im Speicher
 * des Lesers.
 * Abhängigkeiten: spiel/warumkategorie.ts, spiel/buchbezug.ts, spiel/erklaerung.ts
 * (widerlegungAus), training/themennamen.ts, i18n, React (useWarumzeile).
 */
import { useEffect, useState } from "react";
import { sprache, t } from "../../../i18n/sprache";
import { BUCHBEZUG, type Warumkennung } from "../../../spiel/buchbezug";
import type { Zugurteil } from "../../../spiel/auswertung";
import { widerlegungAus } from "../../../spiel/erklaerung";
import { stellungen } from "../../../spiel/partie";
import { warumKategorie } from "../../../spiel/warumkategorie";
import { sanZuUci } from "../../../spiel/zuege";
import type { Partieeintrag } from "../../../speicher/partien";
import { themennameSchluessel } from "../../../training/themennamen";
import type { TrainerKennung } from "../../../training/trainer";

/** Was die Karte zeigt und was „Üben“ öffnet. */
export interface Warumzeile {
  readonly kennung: Warumkennung;
  /** Kurzname, etwa „Drohung stehen gelassen“. */
  readonly anzeige: string;
  /** Fundstelle in Klammern, etwa „(Kapitel 1, Schach-Röntgen-Regel)“. */
  readonly quelle: string;
  /** Der Satz, etwa „Die Drohung Sxe4 stand schon vor deinem Zug …“. */
  readonly text: string;
  /** Aufschrift des Knopfes, etwa „Üben: Schach-Röntgen-Trainer“. */
  readonly ueben: string;
  readonly trainer: TrainerKennung;
  /** Thema für den Trainer (ui/trainer/trainerthema.ts); null ohne Vorwahl. */
  readonly thema: string | null;
}

/** Je Partie die schon gerechneten Zeilen (Index des Halbzuges und Sprache → Zeile oder null). */
const ZWISCHENSPEICHER = new WeakMap<Partieeintrag, Map<string, Warumzeile | null>>();

/** Der Name des Trainers oder seines Themas für „Üben: …“. */
function uebenName(trainer: TrainerKennung, thema: string | null): string {
  const schluessel = thema ? themennameSchluessel(thema) : null;
  return schluessel ? t(schluessel) : t(`trainer.${trainer}.name`);
}

/** Rechnet die Zeile ohne Zwischenspeicher; null ohne Kategorie oder ohne Daten. */
function rechne(eintrag: Partieeintrag, urteil: Zugurteil): Warumzeile | null {
  const { index } = urteil;
  const vorherFen = stellungen(eintrag.partie)[index];
  const san = eintrag.partie.zuege[index]?.san;
  const uci = vorherFen && san ? sanZuUci(vorherFen, san) : null;
  if (!vorherFen || !uci) return null;
  const befund = warumKategorie({
    vorherFen,
    uci,
    widerlegung: widerlegungAus(eintrag.beste[index + 1], eintrag.varianten[index + 1]),
    verlust: urteil.verlust,
    bester: eintrag.beste[index] || null,
  });
  if (!befund) return null;
  const bezug = BUCHBEZUG[befund.kennung];
  const thema = befund.thema ?? bezug.thema;
  return {
    kennung: befund.kennung,
    anzeige: t(bezug.anzeige),
    quelle: t("buchbezug.fundstelle", { quelle: t(befund.quelle) }),
    text: t(befund.text, befund.werte),
    ueben: t("buchbezug.ueben", { name: uebenName(bezug.trainer, thema) }),
    trainer: bezug.trainer,
    thema,
  };
}

/**
 * Die Warum-Zeile zum Zug, aus dem Zwischenspeicher der Sitzung oder neu gerechnet.
 *
 * Eingaben: gespeicherte Partie mit Auswertung, Urteil des Zuges (Index und Verlust).
 * Beispiel: Opernpartie gegen Derya, 12. O-O-O?? → W3 „Drohung stehen gelassen“, „Üben:
 * Schach-Röntgen-Trainer“.
 * Sonderfall: Ein Sprachwechsel rechnet neu (der Schlüssel enthält die Sprache).
 */
export function warumzeileFuer(eintrag: Partieeintrag, urteil: Zugurteil): Warumzeile | null {
  const schluessel = `${urteil.index}:${sprache()}`;
  const speicher = ZWISCHENSPEICHER.get(eintrag) ?? new Map<string, Warumzeile | null>();
  ZWISCHENSPEICHER.set(eintrag, speicher);
  const alt = speicher.get(schluessel);
  if (alt !== undefined) return alt;
  const neu = rechne(eintrag, urteil);
  speicher.set(schluessel, neu);
  return neu;
}

/**
 * Die Zeile, gerechnet nach dem ersten Bild; null ohne Urteil, solange sie fehlt oder wenn keine
 * Kategorie passt.
 */
export function useWarumzeile(eintrag: Partieeintrag, urteil: Zugurteil | null): Warumzeile | null {
  const [zeile, setzeZeile] = useState<Warumzeile | null>(null);
  useEffect(() => {
    if (!urteil) return undefined;
    let aktiv = true;
    const zeit = window.setTimeout(() => {
      if (aktiv) setzeZeile(warumzeileFuer(eintrag, urteil));
    }, 0);
    return () => {
      aktiv = false;
      window.clearTimeout(zeit);
    };
  }, [eintrag, urteil]);
  return urteil ? zeile : null;
}
