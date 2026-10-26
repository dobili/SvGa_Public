/**
 * Eigene Varianten für den Porträt-Baukasten (Wunsch des Autors vom 25.10.2026: „verdopple die
 * Auswahlmöglichkeiten … Nase, Augen, Mund, Bart, Oberteil“).
 *
 * Rolle im Gesamtbild: Der Stil „Personas“ (DiceBear) bringt je Merkmal nur wenige Formen mit. Jede
 * Form steht im SVG als Gruppe an fester Stelle (`<g transform="translate(20 24)">` für die Augen
 * usw.). Eine eigene Variante baut DiceBear mit einer Grundform und ersetzt danach den Inhalt dieser
 * Gruppe durch eigene Pfade im selben Stil: dunkles Violett für Gesichtszüge, Überlagerung für die
 * Nase, Haarfarbe für den Bart, Kleidungsfarbe mit hellen und dunklen Überlagerungen für Oberteile.
 * Gespeichert wird das fertige SVG; die Namen der Varianten stehen in den Merkmalen.
 * Abhängigkeiten: keine (reine Zeichenketten); genutzt von merkmale.ts.
 */

/** Farben, die eine eigene Variante braucht (Hexwerte ohne #). */
export interface Teilfarben {
  readonly haar: string;
  readonly kleidung: string;
}

/** Eine eigene Variante: Grundform für DiceBear und der neue Inhalt der Gruppe. */
interface EigenerTeil {
  readonly basis: string;
  readonly inhalt: (f: Teilfarben) => string;
}

/** Farbe der Gesichtszüge in Personas. */
const ZUG = "#1B0640";
const LIPPE = "#F57B98";
const LIPPE_DUNKEL = "#DC5C7A";
const LINIE = `stroke="${ZUG}" stroke-width="1.4" stroke-linecap="round" fill="none"`;
const NASE = 'style="mix-blend-mode:overlay" opacity=".36"';
const NASENLINIE = `stroke="#000" stroke-width="1.5" stroke-linecap="round" fill="none" ${NASE}`;
const HELL = 'fill="#fff" style="mix-blend-mode:overlay" opacity=".45"';
const DUNKEL = 'fill="#000" style="mix-blend-mode:overlay" opacity=".4"';
/** Grundform der Oberteile mit Halsausschnitt (wie „squared“). */
const OBERTEIL =
  "M16 5v3a5 5 0 0 0 10 0V5l6.65 2.05a9 9 0 0 1 6.35 8.6V20H3v-4.35a9 9 0 0 1 6.35-8.6L16 5Z";
/** Bartfläche mit Aussparung für den Mund (Mitte des Mundes bei 18 15 in Bartkoordinaten). */
const MUNDLOCH = "M13.5 15a4.5 2.6 0 1 0 9 0 4.5 2.6 0 1 0-9 0Z";
const SCHNURRBART =
  "M12.5 12.8c1.6-1.3 3.6-1.6 5.5-.6 1.9-1 3.9-.7 5.5.6-1.9.6-3.7.7-5.5.2-1.8.5-3.6.4-5.5-.2Z";

/** Zwei Pupillen an den Stellen von Personas „open“. */
const PUPILLEN = `<path d="M4 4.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Zm13 0a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Z" fill="${ZUG}"/>`;

const AUGEN: Readonly<Record<string, EigenerTeil>> = {
  big: {
    basis: "open",
    inhalt: () =>
      `<circle cx="5.5" cy="4.5" r="2.3" fill="${ZUG}"/><circle cx="18.5" cy="4.5" r="2.3" fill="${ZUG}"/>` +
      '<circle cx="6.3" cy="3.7" r=".8" fill="#fff"/><circle cx="19.3" cy="3.7" r=".8" fill="#fff"/>',
  },
  brows: {
    basis: "open",
    inhalt: () => `${PUPILLEN}<path d="M3.5 1.2q2-1.3 4 0M16.5 1.2q2-1.3 4 0" ${LINIE}/>`,
  },
  lashes: {
    basis: "open",
    inhalt: () =>
      `${PUPILLEN}<path d="M4.2 3.3 2.6 2.7M4.9 3 3.9 1.8M19.8 3.3l1.6-.6M19.1 3l1-1.2" stroke="${ZUG}" stroke-width=".9" stroke-linecap="round"/>`,
  },
  roundGlasses: {
    basis: "open",
    inhalt: () =>
      `${PUPILLEN}<circle cx="5.5" cy="4.5" r="3.6" stroke="${ZUG}" stroke-width="1.2" fill="#fff" fill-opacity=".25"/>` +
      `<circle cx="18.5" cy="4.5" r="3.6" stroke="${ZUG}" stroke-width="1.2" fill="#fff" fill-opacity=".25"/>` +
      `<path d="M9.1 4.2q2.9-1.4 5.8 0M1.9 4 0 3.2M22.1 4l1.9-.8" stroke="${ZUG}" stroke-width="1.1" stroke-linecap="round"/>`,
  },
  surprised: {
    basis: "open",
    inhalt: () =>
      `<circle cx="5.5" cy="4.5" r="2.6" fill="#fff" stroke="${ZUG}" stroke-width=".9"/><circle cx="18.5" cy="4.5" r="2.6" fill="#fff" stroke="${ZUG}" stroke-width=".9"/>` +
      `<circle cx="5.5" cy="4.6" r="1.1" fill="${ZUG}"/><circle cx="18.5" cy="4.6" r="1.1" fill="${ZUG}"/>`,
  },
  narrow: {
    basis: "open",
    inhalt: () =>
      `<path d="M3.8 4.6h3.4M16.8 4.6h3.4" stroke="${ZUG}" stroke-width="1.6" stroke-linecap="round"/>`,
  },
};

const NASEN: Readonly<Record<string, EigenerTeil>> = {
  pointed: {
    basis: "smallRound",
    inhalt: () => `<path d="M8.8 2.8 6.4 7.6c-.2.4.1.8.5.8h2.4" ${NASENLINIE}/>`,
  },
  broad: {
    basis: "smallRound",
    inhalt: () =>
      `<path d="M4.3 6c.6 1.6 1.9 2.4 3.7 2.4s3.1-.8 3.7-2.4" ${NASENLINIE}/>` +
      `<circle cx="6.4" cy="6.8" r=".8" fill="#000" ${NASE}/><circle cx="9.6" cy="6.8" r=".8" fill="#000" ${NASE}/>`,
  },
  button: {
    basis: "smallRound",
    inhalt: () => `<ellipse cx="8" cy="6.6" rx="2.2" ry="1.7" fill="#000" ${NASE}/>`,
  },
};

const MUENDER: Readonly<Record<string, EigenerTeil>> = {
  laugh: {
    basis: "smile",
    inhalt: () =>
      `<path d="M5 3.4h8a4 4 0 0 1-8 0Z" fill="${ZUG}"/><ellipse cx="9" cy="6.3" rx="1.9" ry=".9" fill="${LIPPE}"/>`,
  },
  tongue: {
    basis: "smile",
    inhalt: () =>
      `<path d="M7.2 5.6h3.6v2.4a1.8 1.8 0 0 1-3.6 0Z" fill="${LIPPE}"/><path d="M5.5 5q3.5 2 7 0" ${LINIE}/>`,
  },
  neutral: {
    basis: "smile",
    inhalt: () => `<path d="M6 5.2h6" stroke="${ZUG}" stroke-width="1.6" stroke-linecap="round"/>`,
  },
  whistle: {
    basis: "smile",
    inhalt: () =>
      `<circle cx="10" cy="5" r="1.4" fill="${LIPPE_DUNKEL}" stroke="${LIPPE}" stroke-width="1"/>`,
  },
  wavy: { basis: "smile", inhalt: () => `<path d="M5 5.4q1-1 2 0t2 0 2 0 2 0" ${LINIE}/>` },
  gapTooth: {
    basis: "smile",
    inhalt: () =>
      `<path d="M5.5 3h7v1a3.5 3.5 0 0 1-7 0V3Z" fill="#fff" stroke="${ZUG}" stroke-width=".6"/><path d="M8.6 3h.8v2h-.8Z" fill="${ZUG}"/>`,
  },
};

const BAERTE: Readonly<Record<string, EigenerTeil>> = {
  shortBeard: {
    basis: "walrus",
    inhalt: (f) =>
      `<path fill-rule="evenodd" d="M4 4c2 3.5 4.5 6.3 8 7.2 2-.9 4-1.3 6-1.3s4 .4 6 1.3c3.5-.9 6-3.7 8-7.2v5A14 14 0 1 1 4 9V4Z${MUNDLOCH}" fill="#${f.haar}"/>`,
  },
  longBeard: {
    basis: "walrus",
    inhalt: (f) =>
      `<path fill-rule="evenodd" d="M4 5c1.8 3.4 4.4 5.8 8 6.4 2-.9 4-1.3 6-1.3s4 .4 6 1.3c3.6-.6 6.2-3 8-6.4v6c0 9-6.5 18-14 20C10.5 29 4 20 4 11V5Z${MUNDLOCH}" fill="#${f.haar}"/>` +
      `<path d="M15 24q3 3 6 0M14 28q4 3 8 0" stroke="#000" stroke-opacity=".15" stroke-width=".8" fill="none"/>`,
  },
  thinMustache: { basis: "walrus", inhalt: (f) => `<path d="${SCHNURRBART}" fill="#${f.haar}"/>` },
  sideburns: {
    basis: "walrus",
    inhalt: (f) =>
      `<path d="M4 1h3v8.5a1.5 1.5 0 0 1-3 0V1ZM29 1h3v8.5a1.5 1.5 0 0 1-3 0V1Z" fill="#${f.haar}"/>`,
  },
  chinStrap: {
    basis: "walrus",
    inhalt: (f) =>
      `<path d="M4 7a14 14 0 0 0 28 0h-2.2a11.8 12.5 0 0 1-23.6 0Z" fill="#${f.haar}"/>`,
  },
  henriquatre: {
    basis: "walrus",
    inhalt: (f) =>
      `<path d="${SCHNURRBART}" fill="#${f.haar}"/><path d="M15.5 18.6h5L18 23.5Z" fill="#${f.haar}"/>`,
  },
};

const OBERTEILE: Readonly<Record<string, EigenerTeil>> = {
  collar: {
    basis: "squared",
    inhalt: (f) =>
      `<path d="${OBERTEIL}" fill="#${f.kleidung}"/><path d="M16 5 21 10.6l-2.6 2.6L14.6 6.2ZM26 5l-5 5.6 2.6 2.6 3.8-7Z" fill="#fff"/>` +
      `<path d="M21 13.5v6.5" stroke="#000" stroke-opacity=".2" stroke-width=".8"/><circle cx="21" cy="15.5" r=".6" fill="#000" opacity=".3"/><circle cx="21" cy="18.3" r=".6" fill="#000" opacity=".3"/>`,
  },
  stripes: {
    basis: "squared",
    inhalt: (f) =>
      `<clipPath id="oberteilStreifen"><path d="${OBERTEIL}"/></clipPath><path d="${OBERTEIL}" fill="#${f.kleidung}"/>` +
      `<g clip-path="url(#oberteilStreifen)"><path d="M0 9h42v2H0ZM0 13h42v2H0ZM0 17h42v2H0Z" ${HELL}/></g>`,
  },
  hoodie: {
    basis: "rounded",
    inhalt: (f) =>
      `<path d="M16 7v.47a5 5 0 1 0 10 0V7c7.06 1.52 12.93 6.74 16 13H0C3.07 13.74 8.94 8.52 16 7Z" fill="#${f.kleidung}"/>` +
      `<path d="M13.5 6.5c0 5 3.3 8.7 7.5 8.7s7.5-3.7 7.5-8.7l-2.5.5a5 5 0 0 1-10 0Z" ${DUNKEL}/>` +
      '<path d="M19 15v4M23 15v4" stroke="#fff" stroke-width=".9" stroke-linecap="round"/>',
  },
  tie: {
    basis: "squared",
    inhalt: (f) =>
      `<path d="${OBERTEIL}" fill="#${f.kleidung}"/><path d="M16 5v3a5 5 0 0 0 10 0V5l-2 9h-6Z" fill="#fff"/>` +
      `<path d="M19.8 12.6h2.4l.6 1.4-.9 6h-1.8l-.9-6Z" fill="${ZUG}"/>`,
  },
};

/** Eigene Varianten je Feld des Baukastens. */
export const EIGENE_TEILE = {
  augen: AUGEN,
  nase: NASEN,
  mund: MUENDER,
  bart: BAERTE,
  koerper: OBERTEILE,
} as const;

/** Die Gruppe jedes Feldes im Personas-SVG (feste Stelle in allen Varianten). */
const GRUPPE: Readonly<Record<keyof typeof EIGENE_TEILE, string>> = {
  augen: '<g transform="translate(20 24)">',
  nase: '<g transform="translate(24 28)">',
  mund: '<g transform="translate(23 36)">',
  bart: '<g transform="translate(14 26)">',
  koerper: '<g transform="translate(11 44)">',
};

/** Grundform für DiceBear: bei einer eigenen Variante deren Basis, sonst der Wert selbst. */
export function grundform(feld: keyof typeof EIGENE_TEILE, wert: string): string {
  return EIGENE_TEILE[feld][wert]?.basis ?? wert;
}

/** Ende der Gruppe, die bei `start` beginnt (verschachtelte Gruppen mitgezählt); -1 ohne Ende. */
function gruppenende(svg: string, start: number): number {
  let tiefe = 0;
  const muster = /<g[\s>]|<\/g>/g;
  muster.lastIndex = start;
  for (let m = muster.exec(svg); m; m = muster.exec(svg)) {
    tiefe += m[0] === "</g>" ? -1 : 1;
    if (tiefe === 0) return m.index;
  }
  return -1;
}

/**
 * Setzt eigene Varianten in ein fertiges Personas-SVG ein. Beispiel: augen „roundGlasses“ → der
 * Inhalt der Augengruppe wird zu Pupillen und runder Brille. Ohne eigene Variante oder ohne die
 * Gruppe (andere DiceBear-Version) bleibt das SVG unverändert.
 */
export function mitEigenenTeilen(
  svg: string,
  werte: Readonly<Partial<Record<keyof typeof EIGENE_TEILE, string>>>,
  farben: Teilfarben,
): string {
  let aus = svg;
  for (const feld of Object.keys(GRUPPE) as (keyof typeof EIGENE_TEILE)[]) {
    const wert = werte[feld];
    const teil = wert ? EIGENE_TEILE[feld][wert] : undefined;
    const start = aus.indexOf(GRUPPE[feld]);
    if (!teil || start < 0) continue;
    const ende = gruppenende(aus, start);
    if (ende < 0) continue;
    aus = aus.slice(0, start) + GRUPPE[feld] + teil.inhalt(farben) + aus.slice(ende);
  }
  return aus;
}
