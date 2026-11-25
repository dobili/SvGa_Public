/**
 * Ausgabe des Messlaufs der Partiebesprechung (besprechung.messung.ts): Textfassung zum Prüfen
 * und eine Seite mit Brett, Satz und Engine-Folge je Moment.
 *
 * Rolle im Gesamtbild: Nur für den Messlauf (nie in der App). Die Seite zeigt jede Stellung vor
 * dem Zug als Zeichenbrett (Unicode-Figuren), den gespielten Zug, den besten Zug und die
 * Widerlegung in der Sprache des Spiels, daneben Ambroses Satz, damit man jeden Satz gegen das
 * Brett prüfen kann. Ergebnis nur lokal (buch/arbeit/besprechung/, Notizblock).
 * Abhängigkeiten: anbindung/besprechungsdaten.ts (folgetext), spiel/zuege.ts, schach/notation.ts.
 */
import { sanInSprache } from "../schach/notation";
import { uciZuSan } from "../spiel/zuege";
import { folgetext } from "./anbindung/besprechungsdaten";

/** Ein besprochener Moment im Protokoll. */
export interface Protokollmoment {
  readonly halbzug: number;
  readonly kategorie: string;
  readonly fen: string;
  readonly fenNach: string;
  readonly zug: string;
  readonly beste: string;
  readonly folge: readonly string[];
  /** Hauptvariante vor dem Zug (der bessere Weg), für die Prüfung der Motive „für“. */
  readonly folgeVor: readonly string[];
  readonly wert: number;
  readonly satz: string;
}

/** Eine Besprechung im Protokoll. */
export interface Besprechungsprotokoll {
  readonly partie: number;
  readonly seite: string;
  readonly stufe: number;
  readonly stimme: string;
  readonly begriffe: boolean;
  readonly auftakt: string;
  readonly momente: readonly Protokollmoment[];
  readonly schluss: string;
}

const FIGUREN: Readonly<Record<string, string>> = {
  K: "♔",
  Q: "♕",
  R: "♖",
  B: "♗",
  N: "♘",
  P: "♙",
  k: "♚",
  q: "♛",
  r: "♜",
  b: "♝",
  n: "♞",
  p: "♟",
};
/** Halbzüge der Widerlegung in der Ausgabe. */
const FOLGE_HALBZUEGE = 6;

/** Das Brett einer FEN als acht Zeilen Zeichen (Weiß unten). */
function zeichenbrett(fen: string): string {
  const reihen = (fen.split(" ")[0] ?? "").split("/");
  return reihen
    .map(
      (r, i) =>
        `${8 - i} ` +
        [...r].map((c) => (/\d/.test(c) ? "·".repeat(Number(c)) : (FIGUREN[c] ?? "?"))).join(""),
    )
    .join("\n")
    .concat("\n  abcdefgh");
}

/** Die Zeilen eines Moments: Zug, bester Zug, Widerlegung, Wert, Satz. */
function momentzeilen(m: Protokollmoment): string[] {
  const besser = uciZuSan(m.fen, m.beste);
  return [
    `Halbzug ${m.halbzug} (${m.kategorie}): ${sanInSprache(m.zug, "de")}, beste ${besser ? sanInSprache(besser, "de") : "–"}, Wert vorher ${m.wert.toFixed(1)}`,
    `Widerlegung: ${folgetext(m.fenNach, m.folge, FOLGE_HALBZUEGE) ?? "–"}`,
    `FEN: ${m.fen}`,
    `Satz: ${m.satz}`,
  ];
}

/** Die Textfassung (Markdown) aller Besprechungen. */
export function textfassung(protokoll: readonly Besprechungsprotokoll[]): string {
  return protokoll
    .map((b, i) =>
      [
        `## ${i + 1}. Partie ${b.partie}, ${b.seite}, Stufe ${b.stufe}, ${b.stimme}${b.begriffe ? ", Begriffe bekannt" : ""}`,
        `Auftakt: ${b.auftakt}`,
        ...b.momente.flatMap((m) => ["", ...momentzeilen(m)]),
        "",
        `Schluss: ${b.schluss}`,
      ].join("\n"),
    )
    .join("\n\n");
}

/** Text für HTML sicher machen. */
function sicher(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Die Seite mit Brett und Satz je Moment. */
export function seiteVon(protokoll: readonly Besprechungsprotokoll[]): string {
  const teile = protokoll.map((b, i) => {
    const momente = b.momente
      .map(
        (m) =>
          `<div class="moment"><pre>${sicher(zeichenbrett(m.fen))}</pre><div><p class="kopf">${sicher(momentzeilen(m).slice(0, 2).join(" · "))}</p><p class="satz">${sicher(m.satz)}</p></div></div>`,
      )
      .join("");
    return `<section><h2>${i + 1}. Partie ${b.partie}, ${b.seite}, Stufe ${b.stufe}, ${b.stimme}${b.begriffe ? ", Begriffe bekannt" : ""}</h2><p>${sicher(b.auftakt)}</p>${momente}<p>${sicher(b.schluss)}</p></section>`;
  });
  return `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Messlauf Besprechung</title><style>
:root{--grund:#fff;--text:#1a1a1a;--linie:#ccc}@media (prefers-color-scheme:dark){:root{--grund:#161616;--text:#eee;--linie:#444}}
body{background:var(--grund);color:var(--text);font:15px/1.4 system-ui;margin:0 auto;max-width:900px;padding:0 16px}
.moment{display:flex;gap:16px;border-top:1px solid var(--linie);padding:8px 0;flex-wrap:wrap}
pre{font-size:20px;line-height:1.05;margin:0}.kopf{font-size:13px;opacity:.75}.satz{font-weight:600}
</style><h1>Messlauf Partiebesprechung (${protokoll.length} Besprechungen)</h1>${teile.join("")}`;
}
