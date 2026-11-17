/**
 * Startstellung aus dem Vorrat Bot gegen Bot für einen Partieauftrag (Startstellung `vorrat`).
 *
 * Rolle im Gesamtbild: dienste.ts löst vor dem Anlegen der Partie Abbildungen und Vorrat auf. Hier
 * wird der Vorrat einmal aus dem Zusatzpaket geladen (daten/stellungsvorrat.json), passend zur
 * Zielstärke des Gegners gewählt (regeln/vorrat.ts), die Kennung im Spielstand gemerkt und der
 * Auftrag umgeschrieben: Startstellung als FEN, der Leser übernimmt die Seite am Zug, die
 * Zugfolge bis dahin geht als Vorgeschichte in den erzählten Einstieg.
 * Abhängigkeiten: paket/paketlader.ts, speicher/speicher.ts, regeln/vorrat.ts.
 * Beispiel: Begegnung mit { art: "vorrat", format: "endspielSieg" }, Zielstärke 1350 → eine
 * Endspielstellung aus „band3“, die der Leser noch nicht hatte.
 */
import { aendere, speicherzustand } from "../../speicher/speicher";
import { liesPaketJson } from "../paket/paketlader";
import { seltensteEroeffnung } from "../regeln/fremdeEroeffnung";
import { bandZu, genutztNach, waehleAusVorrat, type Stellungsvorrat } from "../regeln/vorrat";
import type { Partieauftrag } from "../schnittstelle/partie";

let geladen: Promise<Stellungsvorrat> | null = null;

/** Lädt den Vorrat einmal; ein Fehler verwirft den Versuch, damit ein neuer möglich ist. */
function ladeVorrat(): Promise<Stellungsvorrat> {
  geladen ??= liesPaketJson<Stellungsvorrat>("daten/stellungsvorrat.json").catch(
    (fehler: unknown) => {
      geladen = null;
      throw fehler;
    },
  );
  return geladen;
}

/** Die Grundstellung, ab der die Partien des Lesers als Eröffnungsprofil zählen. */
const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/**
 * „Eröffnung fremd“ mit Alternativen (R13c): die Eröffnung, die der Leser in seinen Partien der App
 * am seltensten hatte; ohne Alternativen bleibt die Startstellung.
 */
export function mitFremderEroeffnung(auftrag: Partieauftrag): Partieauftrag {
  const stellung = auftrag.startstellung;
  if (stellung.art !== "eroeffnung" || !stellung.alternativen?.length) return auftrag;
  const partien = speicherzustand()
    .daten.spiel.partien.filter((e) => e.partie.einstellung.startFen === GRUNDSTELLUNG)
    .map((e) => e.partie.zuege.map((z) => z.san));
  const zuege = seltensteEroeffnung(
    [stellung.zuege, ...stellung.alternativen],
    partien,
    Math.random,
  );
  return { ...auftrag, startstellung: { art: "eroeffnung", zuege } };
}

/** Wer in einer FEN am Zug ist (zweites Feld); fehlt es, Weiß. */
function amZug(fen: string): "white" | "black" {
  return fen.split(" ")[1] === "b" ? "black" : "white";
}

/**
 * Löst eine Vorratsstellung auf; andere Startstellungen bleiben. Null, wenn das Format im Band
 * leer ist (dann startet die Begegnung nicht, wie bei einer fehlenden Abbildung).
 */
export async function mitVorratsstellung(auftrag: Partieauftrag): Promise<Partieauftrag | null> {
  const stellung = auftrag.startstellung;
  if (stellung.art !== "vorrat") return auftrag;
  const vorrat = await ladeVorrat();
  const genutzt = speicherzustand().daten.abenteuer?.vorratGenutzt ?? [];
  const elo = auftrag.staerke.zielElo;
  const eintrag = waehleAusVorrat(vorrat, stellung.format, elo, genutzt, Math.random);
  if (!eintrag) return null;
  const alle = bandZu(vorrat, elo)?.formate[stellung.format] ?? [];
  await aendere((d) =>
    d.abenteuer
      ? { ...d, abenteuer: { ...d.abenteuer, vorratGenutzt: genutztNach(genutzt, eintrag, alle) } }
      : d,
  );
  return {
    ...auftrag,
    startstellung: { art: "fen", fen: eintrag.fen },
    farbe: amZug(eintrag.fen),
    vorgeschichte: eintrag.zuege,
  };
}
