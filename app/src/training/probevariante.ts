/**
 * Eine Probepartie als Abzweig in eine Variante übernehmen.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (1.11.2026): Am Ende einer Probepartie (oder beim
 * Abbrechen) bietet die App „Als Variante speichern“ an. Die gespielten Züge kommen als Abzweig an
 * genau die Stelle, von der aus gespielt wurde: in die Variante, aus der sie kam, oder (bei einer
 * Probepartie aus der Auswertung) in die Variante dieser Partie; gibt es sie nicht, entsteht eine
 * neue mit der Partie als Quelle. Der erste neue Zug bekommt den Kommentar „Gegen … zu Ende
 * gespielt: …“. Sonst wird nichts gespeichert (spiel/probepartie.ts). Reine Funktionen.
 * Abhängigkeiten: schach/variationsaenderung.ts, training/variationen.ts,
 * training/variationsquellen.ts, spiel/partie.ts, speicher/partieeintrag.ts.
 */
import { mitLinie, mitZugdaten } from "../schach/variationsaenderung";
import { knotenAm, type Pfad } from "../schach/variationsbaum";
import type { Partieeintrag } from "../speicher/partieeintrag";
import type { Partie } from "../spiel/partie";
import {
  gleicheQuelle,
  mitVariation,
  neueVariationskennung,
  ZUGKOMMENTAR_HOECHSTENS,
  type Grenze,
  type Variation,
} from "./variationen";
import { ausPartie, ENTWURF, entwurf } from "./variationsquellen";

/** Ziel der Übernahme: die Variante (vorhanden oder neu) und der Weg bis zur Startstellung. */
interface Ziel {
  readonly variation: Variation;
  readonly weg: readonly string[];
}

/** Die Variante, in die die Probepartie kommt, mit dem Weg bis zu ihrer Startstellung. */
function zielFuer(
  liste: readonly Variation[],
  partien: readonly Partieeintrag[],
  probe: Partie,
  titel: string,
  jetzt: Date,
): Ziel | null {
  const herkunft = probe.einstellung.probe;
  const startFen = probe.einstellung.startFen;
  const neu = () => entwurf({ titel, quelle: { art: "fen" }, startFen }, jetzt);
  if (herkunft?.art === "variante") {
    const v = liste.find((x) => x.id === herkunft.id);
    const ersatz = v ? null : neu();
    return v ? { variation: v, weg: herkunft.pfad } : ersatz && { variation: ersatz, weg: [] };
  }
  if (herkunft?.art !== "partie") return null;
  const quelle = { art: "partie", id: herkunft.id } as const;
  const vorhanden = liste.find((x) => gleicheQuelle(x.quelle, quelle));
  const eintrag = partien.find((e) => e.partie.id === herkunft.id)?.partie;
  const zuege = eintrag ? eintrag.zuege.map((z) => z.san) : [];
  const weg = zuege.slice(0, herkunft.stelle);
  if (vorhanden) return { variation: vorhanden, weg };
  const ausQuelle = eintrag
    ? ausPartie({ id: eintrag.id, startFen: eintrag.einstellung.startFen, zuege }, herkunft.stelle, titel, jetzt)
    : null;
  if (ausQuelle) return { variation: ausQuelle, weg };
  const ersatz = neu();
  return ersatz && { variation: ersatz, weg: [] };
}

/** Ergebnis: neue Liste, Kennung und Pfad zum Öffnen, oder die erreichte Grenze. */
export type Probeuebernahme =
  | { readonly liste: readonly Variation[]; readonly id: string; readonly pfad: Pfad }
  | { readonly grenze: Grenze };

/**
 * Übernimmt die Züge einer Probepartie als Abzweig.
 *
 * Eingaben: Varianten, gespeicherte Partien, die Probepartie, der Kommentar („Gegen Lotte zu Ende
 * gespielt: Matt! Du hast gewonnen.“), Ersatztitel für eine neue Variante, jetzt.
 * Beispiel: Probepartie aus der Variante „Petroff-Falle“ nach 3... Sxe4 mit 4. De2 De7 5. Dxe4 →
 * dort ein neuer Abzweig 4. De2 … mit dem Kommentar am ersten neuen Zug.
 * Sonderfälle: Ist die Variante inzwischen gelöscht, entsteht eine neue ab der Startstellung der
 * Probepartie. Ohne Herkunft (keine Probepartie) null.
 */
export function probeAlsVariante(
  liste: readonly Variation[],
  partien: readonly Partieeintrag[],
  probe: Partie,
  kommentar: string,
  titel: string,
  jetzt: Date,
): Probeuebernahme | null {
  const ziel = zielFuer(liste, partien, probe, titel, jetzt);
  if (!ziel) return null;
  const v = ziel.variation;
  const linie = mitLinie(v, [], [...ziel.weg, ...probe.zuege.map((z) => z.san)], "partie");
  const erster = linie.ersterNeuer;
  const alt = erster ? (knotenAm({ ...v, zuege: linie.zuege }, erster)?.kommentar ?? "") : "";
  const text = [alt, kommentar].filter((s) => s !== "").join(" ").slice(0, ZUGKOMMENTAR_HOECHSTENS);
  const zuege = erster ? mitZugdaten({ ...v, zuege: linie.zuege }, erster, { kommentar: text }) : linie.zuege;
  const id = v.id === ENTWURF ? neueVariationskennung(jetzt) : v.id;
  const neu = { ...v, id, zuege, geaendert: jetzt.toISOString() };
  const ergebnis = mitVariation(liste, neu);
  return "grenze" in ergebnis ? ergebnis : { liste: ergebnis.liste, id, pfad: linie.pfad };
}
