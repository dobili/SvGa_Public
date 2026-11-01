/**
 * Entwürfe aus den eigenen Daten: Grundstellung, Stellung, Partie (auf Wunsch mit Engine-Folgen),
 * Fehler, Lernsammlung und Lösungslinien (gelöste Trainer-Aufgaben), jeweils mit einem Titel in der Sprache des Lesers.
 *
 * Eine Variante aus einer ausgewerteten Partie übernimmt deren Engine-Werte (seit 1.11.2026), statt
 * sie bei der Analyse neu zu rechnen.
 * Rolle im Gesamtbild: Bindeglied zwischen dem Wert der Ansicht (variantenwert.ts) und den reinen
 * Quellen (training/variationsquellen.ts, training/enginefolgen.ts). Die Abbildung braucht die
 * Buchdaten und steht deshalb im Hook useVariantenentwurf.ts.
 * Abhängigkeiten: training/variationsquellen.ts, training/enginefolgen.ts, spiel/auswertung.ts,
 * speicher (Typen), i18n.
 */
import { datumText, t } from "../../../i18n/sprache";
import type { Nutzerdaten } from "../../../speicher/format";
import type { Partieeintrag } from "../../../speicher/partien";
import { zugurteile } from "../../../spiel/auswertung";
import { stellungen } from "../../../spiel/partie";
import { ergebnisseAusPartie, mitWerten } from "../../../training/variationswerte";
import { mitEngineFolgen } from "../../../training/enginefolgen";
import type { Variation } from "../../../training/variationen";
import {
  ausFehler,
  ausLinien,
  ausPartie,
  ausSammlung,
  ausStellung,
} from "../../../training/variationsquellen";
import type { Entwurfsquelle } from "./variantenwert";

/** „15.10.2026“ aus einem ISO-Zeitpunkt. */
function tag(iso: string): string {
  return datumText(new Date(iso));
}

/** Entwurf aus einer Partie der Liste; mit Engine-Folgen, wenn gewünscht und ausgewertet. */
export function ausPartieeintrag(
  eintrag: Partieeintrag,
  stelle: number,
  engine: boolean,
  jetzt: Date,
): Variation | null {
  const { partie } = eintrag;
  const zuege = partie.zuege.map((z) => z.san);
  const startFen = partie.einstellung.startFen;
  const titel = t("varianten.titel.partie", { datum: tag(partie.begonnen) });
  const roh = ausPartie({ id: partie.id, startFen, zuege }, stelle, titel, jetzt);
  const werte = ergebnisseAusPartie(
    stellungen(partie),
    eintrag.werte,
    eintrag.beste,
    eintrag.abstaende,
  );
  const v = roh ? mitWerten(roh, werte) : null;
  if (!v || !engine) return v;
  const urteile = zugurteile(partie, eintrag.werte, eintrag.beste, eintrag.abstaende);
  const folgen = mitEngineFolgen(
    v,
    {
      startFen,
      zuege,
      eigeneFarbe: partie.einstellung.eigeneFarbe,
      klassen: urteile.map((u) => u.klasse),
      beste: eintrag.beste,
      varianten: eintrag.varianten,
    },
    { besser: t("varianten.engine.besser"), strafe: t("varianten.engine.strafe") },
  );
  return mitWerten({ ...v, zuege: folgen.zuege }, werte);
}

/**
 * Der Entwurf zu einer Quelle aus den eigenen Daten; null, wenn es den Eintrag nicht (mehr) gibt.
 * Beispiel: { art: "fehler", id } → Stellung vor dem Fehler mit dem gespielten Zug, Titel
 * „Fehler vom 28.10.2026“.
 */
export function entwurfAusDaten(
  quelle: Exclude<Entwurfsquelle, { art: "abbildung" | "eroeffnung" | "uebung" }>,
  daten: Nutzerdaten,
  jetzt: Date,
): Variation | null {
  switch (quelle.art) {
    case "grund":
      return ausStellung("grund", "", t("varianten.titel.grund"), jetzt);
    case "fen":
    case "stellung":
      return ausStellung(quelle.art, quelle.fen, t("varianten.titel.stellung"), jetzt);
    case "partie": {
      const eintrag = daten.spiel.partien.find((e) => e.partie.id === quelle.id);
      return eintrag ? ausPartieeintrag(eintrag, quelle.stelle, quelle.engine, jetzt) : null;
    }
    case "fehler": {
      const fehler = daten.fehler.find((f) => f.id === quelle.id);
      const titel = fehler ? t("varianten.titel.fehler", { datum: tag(fehler.datum) }) : "";
      return fehler ? ausFehler(fehler, titel, jetzt) : null;
    }
    case "linie": {
      const teile = { titel: quelle.titel, quelle: { art: "fen" } as const, fen: quelle.fen };
      return ausLinien(teile, [quelle.zuege], "partie", jetzt);
    }
    case "sammlung": {
      const eintrag = daten.sammlung.find((s) => s.id === quelle.id);
      const titel = eintrag ? eintrag.eroeffnung || t("varianten.titel.sammlung") : "";
      return eintrag ? ausSammlung(eintrag, titel, jetzt) : null;
    }
  }
}
