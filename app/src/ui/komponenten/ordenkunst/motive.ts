/**
 * Formen und Motive der Ordenkunst im Stil „Nacht und Gold“ (Variante C der Entwürfe).
 *
 * Rolle im Gesamtbild: Der Autor hat am 30.10.2026 für alle Abzeichen und für die Orden der Buch-
 * und Teilringe die Variante C gewählt: dunkler Grund, leuchtende Kante in der Farbe des Stücks,
 * Motiv in Gold. Jedes Stück hat eine eigene Umrissform (FORM) und ein eigenes Motiv (MOTIV);
 * welche, steht in entwuerfe.ts. Motive sind in einem Kasten −20 … 20 um (0, 0) gezeichnet und
 * werden von `motiv` an ihren Platz gesetzt.
 * Abhängigkeiten: zeichnen.ts, figuren.ts.
 */
import { figur, type Figurname } from "./figuren";
import {
  blitz,
  flamme,
  funkeln,
  haken,
  kreis,
  r2,
  rosette,
  stern,
  text,
  vieleck,
  zahnrad,
} from "./zeichnen";

/** Eine Umrissform um (cx, cy) mit Radius r. */
type Formzeichner = (cx: number, cy: number, r: number) => string;

/** Die Umrissformen der gewählten Stücke. */
export const FORM = {
  kreis: (cx, cy, r) => kreis(cx, cy, r),
  stern8: (cx, cy, r) => stern(cx, cy, 8, r, r * 0.8),
  strahl24: (cx, cy, r) => stern(cx, cy, 24, r, r * 0.88),
  zahnrad: (cx, cy, r) => zahnrad(cx, cy, 12, r, r * 0.86),
  rosette: (cx, cy, r) => rosette(cx, cy, 14, r, r * 0.09),
  sechseck: (cx, cy, r) => vieleck(cx, cy, 6, r),
  achteck: (cx, cy, r) => vieleck(cx, cy, 8, r, -67.5),
  raute: (cx, cy, r) => vieleck(cx, cy, 4, r * 1.12),
  dreieck: (cx, cy, r) => vieleck(cx, cy, 3, r * 1.2),
  rundquadrat: (cx, cy, r) =>
    `M${cx - r + 10} ${cy - r} H${cx + r - 10} Q${cx + r} ${cy - r} ${cx + r} ${cy - r + 10} V${cy + r - 10} Q${cx + r} ${cy + r} ${cx + r - 10} ${cy + r} H${cx - r + 10} Q${cx - r} ${cy + r} ${cx - r} ${cy + r - 10} V${cy - r + 10} Q${cx - r} ${cy - r} ${cx - r + 10} ${cy - r} Z`,
  schild: (cx, cy, r) =>
    `M${cx - r * 0.9} ${cy - r} H${cx + r * 0.9} V${cy - r * 0.1} C${cx + r * 0.9} ${cy + r * 0.5} ${cx + r * 0.4} ${cy + r * 0.85} ${cx} ${cy + r * 1.05} C${cx - r * 0.4} ${cy + r * 0.85} ${cx - r * 0.9} ${cy + r * 0.5} ${cx - r * 0.9} ${cy - r * 0.1} Z`,
  banner: (cx, cy, r) =>
    `M${cx - r * 0.78} ${cy - r} H${cx + r * 0.78} V${cy + r} L${cx} ${cy + r * 0.62} L${cx - r * 0.78} ${cy + r} Z`,
  tropfen: (cx, cy, r) =>
    `M${cx} ${cy - r * 1.05} C${cx + r * 0.6} ${cy - r * 0.45} ${cx + r} ${cy} ${cx + r} ${cy + r * 0.25} A${r} ${r * 0.75} 0 0 1 ${cx - r} ${cy + r * 0.25} C${cx - r} ${cy} ${cx - r * 0.6} ${cy - r * 0.45} ${cx} ${cy - r * 1.05} Z`,
} as const satisfies Record<string, Formzeichner>;

export type Formname = keyof typeof FORM;

/** Farben eines Motivs: Hauptfarbe (Gold), Akzent (Farbe des Stücks), Grund (dunkel). */
export interface Motivfarben {
  readonly haupt: string;
  readonly akzent: string;
  readonly grund: string;
}

type Motivzeichner = (zusatz: string, f: Motivfarben) => string;

/** Brett 4 × 4, auf Wunsch schräg (Abbildungen angesehen). */
function brett(zusatz: string, f: Motivfarben): string {
  let felder = "";
  for (let z = 0; z < 4; z++)
    for (let k = 0; k < 4; k++)
      felder += `<rect x="${-14 + k * 7}" y="${-14 + z * 7}" width="7" height="7" fill="${(z + k) % 2 ? f.akzent : f.haupt}"/>`;
  return `<g transform="rotate(${zusatz === "schraeg" ? 45 : 0})">${felder}<rect x="-14" y="-14" width="28" height="28" fill="none" stroke="${f.akzent}" stroke-width="1.2"/></g>`;
}

/** Zwei gekreuzte Schwerter, auf Wunsch mit einer Figur davor (Mittelspiel: Turm). */
function schwerter(zusatz: string, f: Motivfarben): string {
  const schwert = (dreh: number) =>
    `<g transform="rotate(${dreh})"><path d="M-2 -21 L0 -25 L2 -21 V12 H-2 Z" fill="${f.haupt}"/><rect x="-7" y="11" width="14" height="3" rx="1" fill="${f.akzent}"/><rect x="-1.4" y="14" width="2.8" height="6" fill="${f.akzent}"/></g>`;
  return (
    schwert(-40) + schwert(40) + (zusatz ? figur(zusatz as Figurname, 0, 0, 20, f.akzent) : "")
  );
}

/** Kalenderblatt mit sieben Flammen (eine Woche dabei). */
function kalender(_zusatz: string, f: Motivfarben): string {
  let flammen = "";
  for (let i = 0; i < 7; i++)
    flammen += flamme(
      -13.5 + (i % 4) * 9 + (i >= 4 ? 4.5 : 0),
      i < 4 ? 0 : 10.5,
      0.4,
      f.akzent,
      f.grund,
    );
  return `<rect x="-19" y="-15" width="38" height="36" rx="3" fill="${f.grund}" stroke="${f.haupt}" stroke-width="2"/><rect x="-19" y="-15" width="38" height="8" rx="2" fill="${f.haupt}"/><rect x="-11" y="-20" width="3" height="8" rx="1.5" fill="${f.haupt}"/><rect x="8" y="-20" width="3" height="8" rx="1.5" fill="${f.haupt}"/>${flammen}`;
}

/** Die Motive der gewählten Stücke; `zusatz` ist der Teil nach dem Doppelpunkt der Angabe. */
const MOTIV = {
  figur: (zusatz, f) => figur(zusatz as Figurname, 0, 1, 34, f.haupt, { gepraegt: f.grund }),
  zahl: (zusatz, f) =>
    text(
      0,
      1,
      zusatz,
      zusatz.length > 1 ? 22 : 30,
      f.haupt,
      `stroke="${f.grund}" stroke-width="1" paint-order="stroke"`,
    ),
  haken: (_zusatz, f) => haken(1, 2, 1.25, f.haupt, 6),
  blick: (_zusatz, f) =>
    `<path d="M-17 0 Q0 -16 17 0 Q0 16 -17 0 Z" fill="${f.haupt}"/><circle r="7" fill="${f.akzent}"/><circle r="3.2" fill="${f.grund}"/><circle cx="2" cy="-2" r="1.3" fill="#fff"/>`,
  brett,
  hantel: (_zusatz, f) =>
    `<g transform="rotate(-30)"><rect x="-15" y="-2" width="30" height="4" rx="2" fill="${f.haupt}"/><rect x="-17" y="-10" width="5" height="20" rx="2" fill="${f.haupt}"/><rect x="12" y="-10" width="5" height="20" rx="2" fill="${f.haupt}"/><rect x="-21" y="-6" width="4" height="12" rx="1.5" fill="${f.akzent}"/><rect x="17" y="-6" width="4" height="12" rx="1.5" fill="${f.akzent}"/></g>`,
  schwerter,
  uhr: (_zusatz, f) =>
    `<rect x="-19" y="-9" width="38" height="21" rx="3" fill="${f.haupt}"/><rect x="-11" y="-13" width="5" height="4" rx="1" fill="${f.akzent}"/><rect x="6" y="-12" width="5" height="3" rx="1" fill="${f.akzent}"/><circle cx="-9" cy="1.5" r="7" fill="${f.grund}"/><circle cx="9" cy="1.5" r="7" fill="${f.grund}"/><path d="M-9 1.5 V-3.5 M9 1.5 L13 3.5" stroke="${f.haupt}" stroke-width="1.6" stroke-linecap="round"/>`,
  pokal: (_zusatz, f) =>
    `<path d="M-11 -17 H11 V-6 C11 3 5 7 0 7 C-5 7 -11 3 -11 -6 Z" fill="${f.haupt}"/><path d="M-11 -13 H-17 C-17 -5 -14 -2 -10 -2 M11 -13 H17 C17 -5 14 -2 10 -2" fill="none" stroke="${f.haupt}" stroke-width="2.4"/><rect x="-2.5" y="6" width="5" height="7" fill="${f.haupt}"/><rect x="-9" y="13" width="18" height="5" rx="1" fill="${f.haupt}"/>` +
    funkeln(0, -6, 0.8, f.akzent),
  krone: (_zusatz, f) =>
    `<path d="M-18 -8 L-9 2 L0 -14 L9 2 L18 -8 L15 12 H-15 Z" fill="${f.haupt}"/><rect x="-15" y="12" width="30" height="5" fill="${f.haupt}"/>` +
    [-18, 0, 18]
      .map((x, i) => `<circle cx="${x}" cy="${i === 1 ? -14 : -8}" r="2.6" fill="${f.akzent}"/>`)
      .join(""),
  koenigFaellt: (_zusatz, f) =>
    `<path d="M-16 15 H18" stroke="${f.haupt}" stroke-width="2.4" stroke-linecap="round"/>` +
    figur("koenig", 3, 0, 30, f.haupt, { neigung: 40, gepraegt: f.grund }) +
    `<path d="M-18 -12 q-4 7 -1 14 M-12 -16 q-5 6 -4 13" stroke="${f.akzent}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`,
  turmHalb: (_zusatz, f) =>
    figur("turm", -8, 1, 30, f.haupt, { gepraegt: f.grund }) + text(10, 3, "½", 16, f.akzent),
  edelstein: (_zusatz, f) =>
    `<path d="M-11 -14 H11 L19 -4 L0 18 L-19 -4 Z" fill="${f.haupt}"/><path d="M-11 -14 L-5 -4 H5 L11 -14 M-19 -4 H19 M-5 -4 L0 18 L5 -4" fill="none" stroke="${f.grund}" stroke-width="1"/>` +
    funkeln(14, -15, 0.6, f.akzent),
  rosette: (zusatz, f) =>
    `<path d="${rosette(0, -3, 12, 15, 2)}" fill="${f.haupt}"/><path d="M-7 8 L-12 21 L-7 18 L-4 22 L-1 10 Z M7 8 L12 21 L7 18 L4 22 L1 10 Z" fill="${f.akzent}"/>` +
    text(0, -2, zusatz, 14, f.grund),
  buchHaken: (_zusatz, f) =>
    `<path d="M-20 -12 C-12 -16 -5 -16 0 -12 C5 -16 12 -16 20 -12 V14 C12 10 5 10 0 14 C-5 10 -12 10 -20 14 Z" fill="${f.haupt}"/><path d="M0 -12 V14" stroke="${f.akzent}" stroke-width="1.4"/>` +
    haken(10, 1, 0.55, f.akzent, 3) +
    [-6, -1, 4]
      .map(
        (y) =>
          `<path d="M-16 ${y} H-4" stroke="${f.akzent}" stroke-width="1.6" stroke-linecap="round"/>`,
      )
      .join(""),
  frage: (_zusatz, f) =>
    text(0, 4, "?", 50, f.haupt, `stroke="${f.grund}" stroke-width="1.5" paint-order="stroke"`),
  lesezeichen: (_zusatz, f) =>
    `<path d="M-11 -20 H11 V20 L0 12 L-11 20 Z" fill="${f.haupt}"/><path d="${stern(0, -3, 5, 8, 3.4)}" fill="${f.akzent}"/>`,
  kreispfeil: (_zusatz, f) =>
    `<path d="M0 -17 A17 17 0 1 1 -15 -7" fill="none" stroke="${f.haupt}" stroke-width="4" stroke-linecap="round"/><path d="M-21 -10 L-14 -1 L-9 -12 Z" fill="${f.haupt}"/>` +
    text(1, 1, "!", 22, f.akzent),
  kalender,
  blitz: (zusatz, f) => blitz(0, -5, 1.4, f.haupt) + text(0, 15, zusatz, 10, f.akzent),
  stern: (zusatz, f) =>
    `<path d="${stern(0, 2, 5, 22, 11)}" fill="${f.haupt}"/>` + text(0, 3.5, zusatz, 8.5, f.grund),
} as const satisfies Record<string, Motivzeichner>;

export type Motivname = keyof typeof MOTIV;

/** Ein Motiv mit Zusatz: „figur:bauer“, „zahl:50“ oder nur „pokal“. */
export type Motivangabe = Motivname | `${Motivname}:${string}`;

/** Das Motiv an (x, y), Höhe etwa `groesse`. Beispiel: motiv("zahl:50", 50, 50, 46, …). */
export function motiv(
  angabe: Motivangabe,
  x: number,
  y: number,
  groesse: number,
  farben: Motivfarben,
): string {
  const [name, zusatz = ""] = angabe.split(":") as [Motivname, string?];
  const kasten = 40;
  return `<g transform="translate(${r2(x)} ${r2(y)}) scale(${r2(groesse / kasten)})">${MOTIV[name](zusatz, farben)}</g>`;
}
