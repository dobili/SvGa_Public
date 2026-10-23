/**
 * Gemeinsamer Umriss zusammenhängender markierter Felder.
 *
 * Rolle im Gesamtbild: Brettmarken.tsx zeichnet Feldmarkierungen gleicher Farbe, die eine Kante
 * teilen, als eine Fläche mit einem äußeren Rahmen statt je Feld einem eigenen (Wunsch des
 * Autors, R36, 23.10.2026: ein 2 × 2-Quadrat soll ein Rahmen sein, ohne innere Ränder). Gelöst
 * zentral hier für alle Werkzeuge und Buchabbildungen. Es ist nur Darstellung: Die Buchdaten
 * bleiben Feld für Feld unverändert. Felder, die sich nur an einer Ecke berühren, bleiben getrennt.
 * Abhängigkeiten: geometrie.ts, masse.ts.
 */
import { feldEcke, type Punkt } from "./geometrie";
import { FELD } from "./masse";

/** Eine gerichtete Kante zwischen zwei Gitterpunkten (in Feldern gezählt). */
interface Kante {
  readonly von: readonly [number, number];
  readonly nach: readonly [number, number];
}

const schluessel = (x: number, y: number) => `${x},${y}`;

/**
 * Die Randkanten der markierten Felder im Uhrzeigersinn (auf dem Bildschirm, y nach unten):
 * Das Innere liegt rechts der Laufrichtung. Innere Kanten zwischen zwei Feldern fallen weg.
 */
function randkanten(zellen: ReadonlySet<string>): Kante[] {
  const kanten: Kante[] = [];
  for (const zelle of zellen) {
    const [x, y] = zelle.split(",").map(Number) as [number, number];
    const leer = (dx: number, dy: number) => !zellen.has(schluessel(x + dx, y + dy));
    if (leer(0, -1)) kanten.push({ von: [x, y], nach: [x + 1, y] });
    if (leer(1, 0)) kanten.push({ von: [x + 1, y], nach: [x + 1, y + 1] });
    if (leer(0, 1)) kanten.push({ von: [x + 1, y + 1], nach: [x, y + 1] });
    if (leer(-1, 0)) kanten.push({ von: [x, y + 1], nach: [x, y] });
  }
  return kanten;
}

/** Richtung einer Kante als Einheitsschritt. */
function richtung(kante: Kante): [number, number] {
  return [Math.sign(kante.nach[0] - kante.von[0]), Math.sign(kante.nach[1] - kante.von[1])];
}

/**
 * Reiht die Randkanten zu geschlossenen Zügen. Treffen sich zwei Felder nur an einer Ecke, gibt
 * es dort zwei weiterführende Kanten; dann gilt die Rechtskurve, damit jedes Feld seinen eigenen
 * Zug behält.
 */
function zuege(kanten: readonly Kante[]): Kante[][] {
  const abAnfang = new Map<string, Kante[]>();
  for (const k of kanten) {
    const s = schluessel(...k.von);
    abAnfang.set(s, [...(abAnfang.get(s) ?? []), k]);
  }
  const offen = new Set(kanten);
  const ergebnis: Kante[][] = [];
  for (const erste of kanten) {
    if (!offen.has(erste)) continue;
    const zug: Kante[] = [];
    let k: Kante | undefined = erste;
    while (k && offen.has(k)) {
      offen.delete(k);
      zug.push(k);
      const [dx, dy] = richtung(k);
      const weiter: Kante[] = abAnfang.get(schluessel(...k.nach)) ?? [];
      // Rechtskurve auf dem Bildschirm: (dx, dy) → (−dy, dx). Ist sie schon gezeichnet, ist
      // der Zug geschlossen.
      k =
        weiter.length > 1
          ? weiter.find((n) => richtung(n)[0] === -dy && richtung(n)[1] === dx)
          : weiter[0];
    }
    ergebnis.push(zug);
  }
  return ergebnis;
}

/**
 * Die Eckpunkte der Umrisse, um ``einzug`` nach innen versetzt, damit der Rahmen wie bisher
 * ganz im Feld liegt.
 *
 * Warum: Bisher hatte jedes Feld seinen Rahmen; bei Nachbarfeldern lagen innen zwei Rahmen
 * nebeneinander, und ein Block aus Feldern wirkte wie ein Gitter.
 * Eingaben: Feldnamen (doppelte zählen einmal), Drehung, Einzug in Einheiten des Brettes.
 * Ausgabe: je zusammenhängender Fläche ein Zug von Eckpunkten im Uhrzeigersinn, nur an den
 * Knicken (gerade Strecken haben keine Zwischenpunkte).
 * Beispiel: d4, e4, d5, e5 → ein Zug mit vier Ecken um das Quadrat d4–e5 (Zentrum, Kapitel 2).
 * Sonderfälle: ungültige Felder fallen weg; ein Ring um ein freies Feld ergibt zwei Züge (außen
 * und innen).
 */
export function umrisse(felder: readonly string[], gedreht: boolean, einzug: number): Punkt[][] {
  const zellen = new Set<string>();
  for (const feld of felder) {
    const ecke = feldEcke(feld, gedreht);
    if (ecke) zellen.add(schluessel(ecke.x / FELD, ecke.y / FELD));
  }
  return zuege(randkanten(zellen)).map((zug) => obenLinksZuerst(knickpunkte(zug, einzug)));
}

/** Beginnt einen Zug am obersten, dann linkesten Punkt, damit das Ergebnis eindeutig ist. */
function obenLinksZuerst(punkte: readonly Punkt[]): Punkt[] {
  let anfang = 0;
  punkte.forEach((p, i) => {
    const bisher = punkte[anfang];
    if (bisher && (p.y < bisher.y || (p.y === bisher.y && p.x < bisher.x))) anfang = i;
  });
  return [...punkte.slice(anfang), ...punkte.slice(0, anfang)];
}

/** Eckpunkte eines Zuges an den Knicken, nach innen versetzt (Innen liegt rechts). */
function knickpunkte(zug: readonly Kante[], einzug: number): Punkt[] {
  const punkte: Punkt[] = [];
  zug.forEach((kante, index) => {
    const davor = zug[(index + zug.length - 1) % zug.length] ?? kante;
    const [ax, ay] = richtung(davor);
    const [bx, by] = richtung(kante);
    if (ax === bx && ay === by) return;
    // Innen ist rechts der Laufrichtung: Normale (−dy, dx); an einem Knick zählen beide Kanten.
    const [px, py] = kante.von;
    punkte.push({
      x: px * FELD + einzug * (-ay - by),
      y: py * FELD + einzug * (ax + bx),
    });
  });
  return punkte;
}
