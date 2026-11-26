/**
 * Acht Laufrichtungen des Helden (Wunsch des Autors, 26.11.2026: „diagonales Laufen für den
 * Protagonisten ermöglichen“).
 *
 * Zwei Dinge sind getrennt: Die Laufrichtung (acht Werte) bestimmt Bewegung und Bild, die
 * Blickrichtung (vier Werte, Weltposition["richtung"]) alles Übrige: Ansprechen, Auslöser, die
 * Kachel vor dem Helden (ausloeserebene.ts, regeln/ansprechen.ts), Spielstand, Kamera. Bei einer
 * Schräge zählt die vorherrschende der beiden Hauptrichtungen; ist keine klar stärker (Tastatur,
 * genau 45 Grad), bleibt der bisherige Blick, wenn er einer der beiden ist.
 * Andere Figuren (geführte Wege, Statisten, Tiere, Begleiter) bleiben bei vier Richtungen.
 * Rolle im Gesamtbild: reine Regeln für heldsteuerung.ts, joystick.ts, schraeglauf.ts und
 * figurbilder.ts. Abhängigkeiten: keine.
 */

/** Eine der vier Hauptrichtungen (wie Weltposition["richtung"]). */
export type Hauptrichtung = "oben" | "unten" | "links" | "rechts";
/** Eine der vier Schrägen, in der Ordnung der diagonalen Reihen im Bogen (figurdiagonalen.mjs). */
export type Schraege = "rechtsOben" | "linksOben" | "linksUnten" | "rechtsUnten";
export type Achtrichtung = Hauptrichtung | Schraege;

/** Die Schrägen in der Ordnung des Bogens (PixelLab north-east, north-west, south-west, south-east). */
export const SCHRAEGEN: readonly Schraege[] = [
  "rechtsOben",
  "linksOben",
  "linksUnten",
  "rechtsUnten",
];

/** Einheitsschritt je Richtung (x nach rechts, y nach unten), Schrägen noch nicht normiert. */
const VEKTOR: Readonly<Record<Achtrichtung, { readonly x: number; readonly y: number }>> = {
  oben: { x: 0, y: -1 },
  unten: { x: 0, y: 1 },
  links: { x: -1, y: 0 },
  rechts: { x: 1, y: 0 },
  rechtsOben: { x: 1, y: -1 },
  linksOben: { x: -1, y: -1 },
  linksUnten: { x: -1, y: 1 },
  rechtsUnten: { x: 1, y: 1 },
};

/** Ist die Richtung eine Schräge? */
export function istSchraege(r: Achtrichtung): r is Schraege {
  return VEKTOR[r].x !== 0 && VEKTOR[r].y !== 0;
}

/** Die waagrechte und die senkrechte Hauptrichtung einer Schräge. Beispiel: rechtsOben → rechts, oben. */
export function bestandteile(r: Schraege): {
  readonly waag: Hauptrichtung;
  readonly senk: Hauptrichtung;
} {
  const v = VEKTOR[r];
  return { waag: v.x < 0 ? "links" : "rechts", senk: v.y < 0 ? "oben" : "unten" };
}

/**
 * Geschwindigkeit in einer Richtung: Länge `tempo` in jeder Richtung, auch schräg (nicht schneller).
 * Beispiel: rechtsOben bei 56 → (39,6; −39,6).
 */
export function geschwindigkeit(r: Achtrichtung, tempo: number): { x: number; y: number } {
  const v = VEKTOR[r];
  const laenge = Math.hypot(v.x, v.y);
  return { x: (v.x / laenge) * tempo, y: (v.y / laenge) * tempo };
}

/**
 * Die Laufrichtung aus vier gehaltenen Tasten (Pfeile oder WASD). Gegensätze heben sich auf.
 * Beispiel: rechts + oben → rechtsOben; links + rechts → null; links + rechts + unten → unten.
 */
export function ausTasten(t: Readonly<Record<Hauptrichtung, boolean>>): Achtrichtung | null {
  const x = Number(t.rechts) - Number(t.links);
  const y = Number(t.unten) - Number(t.oben);
  return ausVorzeichen(x, y);
}

/** Richtung zu den Vorzeichen eines Versatzes (−1, 0, 1); null ohne Versatz. */
export function ausVorzeichen(x: number, y: number): Achtrichtung | null {
  const sx = Math.sign(x);
  const sy = Math.sign(y);
  const treffer = (Object.keys(VEKTOR) as Achtrichtung[]).find(
    (r) => VEKTOR[r].x === sx && VEKTOR[r].y === sy,
  );
  return treffer ?? null;
}

/**
 * Blickrichtung zu einer Laufrichtung: Hauptrichtungen sind ihr eigener Blick; bei einer Schräge
 * der bisherige Blick, wenn er dazugehört, sonst die waagrechte Hälfte (seitlich sieht man das
 * Gesicht, das Bild der Schräge zeigt ohnehin nach vorn).
 * Dasselbe gilt als Rückfall für Figuren ohne Diagonalbilder (figurbilder.ts).
 * Beispiel: rechtsOben nach Blick „oben“ → oben; nach „unten“ → rechts.
 */
export function blickZu(r: Achtrichtung, alt: Hauptrichtung): Hauptrichtung {
  if (!istSchraege(r)) return r;
  const { waag, senk } = bestandteile(r);
  return alt === waag || alt === senk ? alt : waag;
}
