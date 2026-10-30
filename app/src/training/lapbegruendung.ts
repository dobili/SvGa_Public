/**
 * Begründung der LAP-Übung: warum gerade diese Figur die am wenigsten aktive ist.
 *
 * Rolle im Gesamtbild: Regel L des Nebenchats (Wunsch des Autors, 30.10.2026: falsch heißt
 * begründet). Nach der Antwort nennt die App die freien Felder jeder eigenen Figur und, wenn der
 * Leser eine andere Figur oder ein anderes Ziel getippt hat, den Grund für die Lösung in der
 * Reihenfolge der Regel aus schach/aktivitaet.ts.
 * Abhängigkeiten: training/planbilanztrainer.ts (Lapaufgabe), schach/stellung.ts, i18n.
 * Buchbezug: Kapitel 6, „Frage 3: Welche Figur bringe ich dorthin?“ (Abb. 6.16, freie Felder
 * zählen) und Abb. 6.20 (der Läufer c1 noch zu Hause).
 */
import { t } from "../i18n/sprache";
import { ROLLENBUCHSTABE } from "../schach/stellung";
import type { Lapaufgabe, Lapfigur } from "./planbilanztrainer";

/** „Springer e7“. */
function name(f: Lapfigur): string {
  return `${t(`figur.${ROLLENBUCHSTABE[f.rolle]}`)} ${f.feld}`;
}

/** Leichtfiguren vor Türmen, Türme vor der Dame (Reihenfolge der App, aktivitaet.ts). */
function gruppe(f: Lapfigur): number {
  if (f.rolle === "rook") return 1;
  return f.rolle === "queen" ? 2 : 0;
}

/** Der Grund, warum die Lösung vor der getippten Figur kommt. */
function grundGegen(lap: Lapfigur, deine: Lapfigur): string {
  if (lap.zuHause && !deine.zuHause) {
    return t("planuebung.lapGrund.zuHause", { lap: name(lap) });
  }
  if (gruppe(lap) < gruppe(deine)) {
    return t("planuebung.lapGrund.leichtVorTurm", { lap: name(lap), deine: name(deine) });
  }
  if (lap.freie < deine.freie) {
    return t("planuebung.lapGrund.weniger", {
      lap: name(lap),
      n: lap.freie,
      deine: name(deine),
      m: deine.freie,
    });
  }
  return t("planuebung.lapGrund.gleich", { lap: name(lap), deine: name(deine) });
}

/**
 * Die Sätze nach der Antwort: zuerst die freien Felder aller Figuren, dann der Grund.
 *
 * Beispiel: Lösung Läufer c1 (zu Hause), getippt Turm f1 → „Läufer c1 steht noch auf seinem
 * Startfeld …“. Sonderfall: Getippt wurde keine eigene Figur → nur die Liste.
 */
export function lapbegruendung(
  aufgabe: Lapaufgabe,
  figur: string | null,
  ziel: string | null,
): string[] {
  const liste = aufgabe.figuren
    .map((f) => t("planuebung.lapFigur", { figur: name(f), freie: f.freie }))
    .join(", ");
  const saetze = [t("planuebung.lapFiguren", { liste })];
  const lap = aufgabe.figuren.find((f) => f.feld === aufgabe.figur);
  const deine = aufgabe.figuren.find((f) => f.feld === figur);
  if (lap && deine && deine !== lap) saetze.push(grundGegen(lap, deine));
  if (lap && figur === aufgabe.figur && ziel !== aufgabe.ziel && aufgabe.ziel) {
    saetze.push(t("planuebung.lapGrund.ziel", { lap: name(lap), ziel: aufgabe.ziel }));
  }
  return saetze;
}
