/**
 * Kleiner Markdown-Leser für das Wiki des Dashboards: Blöcke und Hervorhebungen als Daten, die
 * Markdown.tsx als React-Elemente zeigt (nie als HTML-Text, also ohne Einschleusen von Code).
 *
 * Rolle im Gesamtbild: Paket D (Wiki). Die Seiten sind die Markdown-Dateien aus docs/ und
 * CLAUDE.md; gebraucht werden nur Überschriften, Absätze, Listen (auch Aufgabenpunkte),
 * Codeblöcke, Tabellen, Fett, Code im Text und Links. Eine Bibliothek wäre mehr, als nötig ist.
 * Abhängigkeiten: keine.
 */

export type Inline =
  | { readonly art: "text"; readonly text: string }
  | { readonly art: "fett"; readonly text: string }
  | { readonly art: "code"; readonly text: string }
  | { readonly art: "link"; readonly text: string; readonly ziel: string };

export type Block =
  | { readonly art: "ueberschrift"; readonly ebene: number; readonly text: string }
  | { readonly art: "absatz"; readonly text: string }
  | { readonly art: "liste"; readonly punkte: readonly string[] }
  | { readonly art: "code"; readonly text: string }
  | { readonly art: "tabelle"; readonly zeilen: readonly (readonly string[])[] }
  | { readonly art: "zitat"; readonly text: string };

const UEBERSCHRIFT = /^(#{1,6})\s+(.*)$/;
const LISTENPUNKT = /^\s*(?:[-*]|\d+\.)\s+(.*)$/;
const TABELLENTRENNER = /^\s*\|?\s*:?-{3,}/;

/** Zeilen einer Tabelle in Zellen; die Trennzeile („|---|---|“) fällt weg. */
function tabellenzeilen(zeilen: readonly string[]): string[][] {
  return zeilen
    .filter((z) => !TABELLENTRENNER.test(z))
    .map((z) =>
      z
        .trim()
        .replace(/^\|/, "")
        .replace(/\|$/, "")
        .split("|")
        .map((zelle) => zelle.trim()),
    );
}

/** Sammelt Zeilen ab `i`, solange `passt` gilt; liefert sie und die nächste Stelle. */
function sammle(zeilen: readonly string[], i: number, passt: (z: string) => boolean) {
  const gesammelt: string[] = [];
  let j = i;
  while (j < zeilen.length && passt(zeilen[j] ?? "")) gesammelt.push(zeilen[j++] ?? "");
  return { gesammelt, weiter: j };
}

/**
 * Markdown in Blöcke. Eingerückte Folgezeilen gehören zum Listenpunkt davor (wie in
 * AUFGABEN_AUTOR.md). Beispiel: "# Titel\n\nText\n- a\n- b" → Überschrift, Absatz, Liste [a, b].
 */
export function bloecke(markdown: string): Block[] {
  const zeilen = markdown.replace(/\r/g, "").split("\n");
  const aus: Block[] = [];
  let i = 0;
  while (i < zeilen.length) {
    const zeile = zeilen[i] ?? "";
    const kopf = UEBERSCHRIFT.exec(zeile);
    if (zeile.trim() === "") {
      i++;
    } else if (zeile.startsWith("```")) {
      const { gesammelt, weiter } = sammle(zeilen, i + 1, (z) => !z.startsWith("```"));
      aus.push({ art: "code", text: gesammelt.join("\n") });
      i = weiter + 1;
    } else if (kopf) {
      aus.push({ art: "ueberschrift", ebene: kopf[1]?.length ?? 1, text: kopf[2] ?? "" });
      i++;
    } else if (zeile.trimStart().startsWith("|")) {
      const { gesammelt, weiter } = sammle(zeilen, i, (z) => z.trimStart().startsWith("|"));
      aus.push({ art: "tabelle", zeilen: tabellenzeilen(gesammelt) });
      i = weiter;
    } else if (zeile.startsWith(">")) {
      const { gesammelt, weiter } = sammle(zeilen, i, (z) => z.startsWith(">"));
      aus.push({ art: "zitat", text: gesammelt.map((z) => z.replace(/^>\s?/, "")).join(" ") });
      i = weiter;
    } else if (LISTENPUNKT.test(zeile)) {
      i = liste(zeilen, i, aus);
    } else {
      const { gesammelt, weiter } = sammle(
        zeilen,
        i,
        (z) =>
          z.trim() !== "" && !UEBERSCHRIFT.test(z) && !LISTENPUNKT.test(z) && !z.startsWith("```"),
      );
      aus.push({ art: "absatz", text: gesammelt.map((z) => z.trim()).join(" ") });
      i = weiter;
    }
  }
  return aus;
}

/** Liest eine Liste ab Zeile `i` in `aus`; liefert die nächste Zeile danach. */
function liste(zeilen: readonly string[], i: number, aus: Block[]): number {
  const punkte: string[] = [];
  let j = i;
  while (j < zeilen.length) {
    const zeile = zeilen[j] ?? "";
    const punkt = LISTENPUNKT.exec(zeile);
    if (punkt && !/^\s{4,}/.test(zeile)) {
      punkte.push(punkt[1] ?? "");
    } else if (zeile.trim() !== "" && /^\s+/.test(zeile) && punkte.length > 0) {
      punkte[punkte.length - 1] = `${punkte[punkte.length - 1]} ${zeile.trim()}`;
    } else {
      break;
    }
    j++;
  }
  aus.push({ art: "liste", punkte });
  return j;
}

const INLINE = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;

/**
 * Hervorhebungen in einer Zeile. Beispiel: "Siehe **Regel 1** in `CLAUDE.md`" → Text, Fett,
 * Text, Code. Links werden nur mit http(s) oder als Pfad übernommen, sonst bleibt der Text.
 */
export function inline(text: string): Inline[] {
  const aus: Inline[] = [];
  let rest = 0;
  for (const treffer of text.matchAll(INLINE)) {
    const stelle = treffer.index ?? 0;
    if (stelle > rest) aus.push({ art: "text", text: text.slice(rest, stelle) });
    const teil = treffer[0];
    if (teil.startsWith("`")) aus.push({ art: "code", text: teil.slice(1, -1) });
    else if (teil.startsWith("**")) aus.push({ art: "fett", text: teil.slice(2, -2) });
    else {
      const [, beschriftung = "", ziel = ""] = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(teil) ?? [];
      aus.push(
        /^https?:\/\//.test(ziel)
          ? { art: "link", text: beschriftung, ziel }
          : { art: "text", text: beschriftung },
      );
    }
    rest = stelle + teil.length;
  }
  if (rest < text.length) aus.push({ art: "text", text: text.slice(rest) });
  return aus;
}
