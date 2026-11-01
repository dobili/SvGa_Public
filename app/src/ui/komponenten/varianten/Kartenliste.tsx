/**
 * Die Karte einer Variante als Liste: dieselben Züge wie die Zeichnung, für Tastatur und
 * Bildschirmleser (und für alle, die lieber lesen als schieben).
 *
 * Rolle im Gesamtbild: Zugängliche Alternative zur Kartenfläche (Kartenflaeche.tsx), gewünscht im
 * Auftrag zur Karte (1.11.2026). Aufbau wie ein Inhaltsverzeichnis: Die Hauptvariante ist eine
 * Liste von Knöpfen; nach einem Zug mit mehreren Fortsetzungen steht jede weitere Fortsetzung als
 * eingerückte Unterliste („Abzweig mit 5 Zügen“). Jeder Knopf springt wie ein Tipp auf der Karte.
 * Die gezeigte Stellung trägt aria-current.
 * Abhängigkeiten: schach/baumlayout.ts, i18n.
 */
import { t, tZahl } from "../../../i18n/sprache";
import type { Kartenlayout } from "../../../schach/baumlayout";

/** Die Kinder jedes Knotens in der Reihenfolge der Fortsetzungen. */
function kinderVon(layout: Kartenlayout): number[][] {
  const kinder: number[][] = layout.knoten.map(() => []);
  for (const kante of layout.kanten) kinder[kante.von]?.push(kante.nach);
  return kinder;
}

/** Die Kette ab einem Knoten: er selbst und immer die erste Fortsetzung. */
function kette(start: number, kinder: readonly number[][]): number[] {
  const weg = [start];
  for (let k = kinder[start]?.[0]; k !== undefined; k = kinder[k]?.[0]) weg.push(k);
  return weg;
}

/** Zahl der Züge unter einem Knoten, ihn selbst eingeschlossen. */
function astgroesse(start: number, kinder: readonly number[][]): number {
  return 1 + (kinder[start] ?? []).reduce((s, k) => s + astgroesse(k, kinder), 0);
}

/** „Abzweig mit 5 Zügen“. */
function astname(ast: number, kinder: readonly number[][]): string {
  const anzahl = astgroesse(ast, kinder);
  return tZahl("varianten.karte.ast", anzahl, { anzahl });
}

interface Listenteile {
  readonly layout: Kartenlayout;
  readonly kinder: readonly number[][];
  readonly aktuell: number;
  readonly beiWahl: (stelle: number) => void;
}

/** Eine Linie (Kette) mit ihren Abzweigen als eingerückte Unterlisten. */
function Linie({ start, teile }: { start: number; teile: Listenteile }) {
  const { layout, kinder, aktuell, beiWahl } = teile;
  return (
    <ol className="kartenliste-linie">
      {kette(start, kinder).map((stelle) => {
        const k = layout.knoten[stelle];
        if (!k) return null;
        const weitere = (kinder[stelle] ?? []).slice(1);
        return (
          <li key={stelle} className={k.herkunft === undefined ? "eigen" : undefined}>
            <button
              type="button"
              className="knopf-flach"
              aria-current={stelle === aktuell ? "step" : undefined}
              onClick={() => beiWahl(stelle)}
            >
              {k.text}
              {stelle === aktuell && (
                <span className="hinweis"> ({t("varianten.karte.aktuell")})</span>
              )}
            </button>
            {weitere.length > 0 && (
              <ul className="kartenliste-aeste">
                {weitere.map((ast) => (
                  <li key={ast}>
                    <span className="hinweis">{astname(ast, kinder)}</span>
                    <Linie start={ast} teile={teile} />
                  </li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ol>
  );
}

/**
 * Die ganze Liste. Eingaben: Layout, Stelle der gezeigten Stellung, was die Wahl eines Zuges tut.
 * Beispiel: Petroff → „Start, 1. e4, e5, …, 3. Sxe5“ und darunter eingerückt „Abzweig mit 5
 * Zügen: 3... Sxe4?!, 4. De2 …“.
 */
export function Kartenliste({
  layout,
  aktuell,
  beiWahl,
}: {
  layout: Kartenlayout;
  aktuell: number;
  beiWahl: (stelle: number) => void;
}) {
  const teile: Listenteile = { layout, kinder: kinderVon(layout), aktuell, beiWahl };
  return (
    <nav
      className="karte kartenliste"
      aria-label={t("varianten.karte.listeTitel")}
      data-testid="kartenliste"
    >
      <h2>{t("varianten.karte.listeTitel")}</h2>
      <Linie start={0} teile={teile} />
    </nav>
  );
}
