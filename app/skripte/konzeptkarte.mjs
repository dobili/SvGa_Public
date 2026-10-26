// Liest den Quellcode der App aus und schreibt die Daten der Konzeptkarte (docs/konzeptkarte.html).
//
// Warum: Der Autor möchte sehen, welche Datei was tut und wie die Dateien zusammenhängen, ohne
// den Code selbst zu lesen (Wunsch vom 26.10.2026). Jede Datei hat einen Dateikopf (Regel 3 in
// CLAUDE.md); dieses Skript nimmt daraus den ersten Satz und die „Rolle im Gesamtbild“, dazu die
// exportierten Funktionen mit dem ersten Satz ihres Kommentars und die Importe zwischen den
// Dateien. Tests, Messungen und Testhilfen bleiben draußen, sie gehören nicht zur App.
// Dazu die Ordnertexte aus docs/codefuehrer/3-ordner.md, die Menschen dort frei ändern dürfen.
// Ergebnis: docs/konzeptkarte-daten.js (wird von docs/konzeptkarte.html geladen) und eine
// Zusammenfassung auf der Konsole (Dateien ohne Kopf, Exporte ohne Kommentar).
// Aufruf (im Ordner app/): node skripte/konzeptkarte.mjs
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const HIER = dirname(fileURLToPath(import.meta.url));
const QUELLE = resolve(HIER, "../src");
const ZIEL = resolve(HIER, "../../docs/konzeptkarte-daten.js");
/** Die von Menschen geschriebenen Ordnertexte (Abschnitte „## ordner“), auch im Codeführer zu lesen. */
const ORDNERTEXTE = resolve(HIER, "../../docs/codefuehrer/3-ordner.md");
const AUSSCHLUSS = /\.(test|messung)\.tsx?$|testhilfe|testdaten|\.d\.ts$/;
/** Längster Text je Feld, damit die Karte lesbar bleibt. */
const HOECHSTENS_ZEICHEN = 600;

/** Alle Quelldateien unter src/, ohne Tests und Messungen. */
function dateien(ordner) {
  return readdirSync(ordner).flatMap((name) => {
    const pfad = join(ordner, name);
    if (statSync(pfad).isDirectory()) return dateien(pfad);
    return /\.tsx?$/.test(name) && !AUSSCHLUSS.test(name) ? [pfad] : [];
  });
}

/** Der Kommentartext ohne Sternchen und Ränder. */
function kommentartext(roh) {
  return roh
    .replace(/^\/\*\*?/, "")
    .replace(/\*\/$/, "")
    .split("\n")
    .map((z) => z.replace(/^\s*\* ?/, ""))
    .join("\n")
    .trim();
}

/**
 * Der erste Satz eines Textes (bis zum ersten Punkt mit Leerzeichen oder Zeilenende; ein
 * Doppelpunkt beendet ihn nicht, viele Köpfe beginnen „Navigation der App: …“).
 */
function ersterSatz(text) {
  const flach = text.replace(/\s+/g, " ").trim();
  const ende = flach.search(/[.?](\s|$)/);
  return gekuerzt(ende < 0 ? flach : flach.slice(0, ende + 1));
}

/** Höchstens HOECHSTENS_ZEICHEN Zeichen, an einer Wortgrenze gekürzt und mit „…“ markiert. */
function gekuerzt(text) {
  if (text.length <= HOECHSTENS_ZEICHEN) return text;
  const schnitt = text.slice(0, HOECHSTENS_ZEICHEN);
  return `${schnitt.slice(0, schnitt.lastIndexOf(" "))} …`;
}

/** Ein Abschnitt des Dateikopfes, etwa „Rolle im Gesamtbild:“ bis zum nächsten Schlüsselwort. */
function abschnitt(kopf, name) {
  const flach = kopf.replace(/\s+/g, " ");
  const anfang = flach.indexOf(`${name}:`);
  if (anfang < 0) return "";
  const rest = flach.slice(anfang + name.length + 1);
  const ende = rest.search(/ (Abhängigkeiten|Buchbezug|Regel|Aufruf|Sonderfall|Beispiel):/);
  return gekuerzt((ende < 0 ? rest : rest.slice(0, ende)).trim());
}

/** Der Kommentar direkt vor einem Knoten (/** … *\/), oder leer. */
function kommentarVor(knoten, text) {
  const bereiche = ts.getLeadingCommentRanges(text, knoten.getFullStart()) ?? [];
  const letzter = bereiche.filter((b) => text.slice(b.pos, b.pos + 3) === "/**").at(-1);
  return letzter ? kommentartext(text.slice(letzter.pos, letzter.end)) : "";
}

/** Name, Art und erster Satz jedes Exports der Datei. */
function exporte(quelle, text) {
  const liste = [];
  for (const knoten of quelle.statements) {
    const exportiert = ts
      .getModifiers?.(knoten)
      ?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
    if (!exportiert) continue;
    const art = ts.isFunctionDeclaration(knoten)
      ? /^[A-Z]/.test(knoten.name?.text ?? "")
        ? "komponente"
        : "funktion"
      : ts.isVariableStatement(knoten)
        ? "wert"
        : ts.isInterfaceDeclaration(knoten) || ts.isTypeAliasDeclaration(knoten)
          ? "typ"
          : ts.isClassDeclaration(knoten)
            ? "klasse"
            : "sonst";
    const namen = ts.isVariableStatement(knoten)
      ? knoten.declarationList.declarations.map((d) => d.name.getText(quelle))
      : [knoten.name?.text ?? "default"];
    const satz = ersterSatz(kommentarVor(knoten, text));
    for (const name of namen) liste.push({ name, art, satz });
  }
  return liste;
}

/** Die Dateien unter src/, die diese Datei importiert (relative Importe). */
function importe(quelle, pfad, bekannt) {
  const ziele = new Set();
  for (const knoten of quelle.statements) {
    const modul =
      (ts.isImportDeclaration(knoten) || ts.isExportDeclaration(knoten)) && knoten.moduleSpecifier
        ? knoten.moduleSpecifier.text
        : null;
    if (!modul || !modul.startsWith(".")) continue;
    const basis = resolve(dirname(pfad), modul);
    const treffer = [`${basis}.ts`, `${basis}.tsx`, join(basis, "index.ts")].find((p) =>
      bekannt.has(p),
    );
    if (treffer) ziele.add(relative(QUELLE, treffer));
  }
  return [...ziele];
}

const alle = dateien(QUELLE);
const bekannt = new Set(alle);
const eintraege = alle.map((pfad) => {
  const text = readFileSync(pfad, "utf8");
  const quelle = ts.createSourceFile(pfad, text, ts.ScriptTarget.Latest, true);
  const erster = text.match(/^\s*\/\*\*[\s\S]*?\*\//)?.[0] ?? "";
  const kopf = kommentartext(erster);
  return {
    pfad: relative(QUELLE, pfad),
    ordner: relative(QUELLE, dirname(pfad)) || ".",
    zeilen: text.split("\n").length,
    zweck: ersterSatz(kopf),
    rolle: abschnitt(kopf, "Rolle im Gesamtbild"),
    exporte: exporte(quelle, text),
    importe: importe(quelle, pfad, bekannt),
  };
});

/** Die Abschnitte „## name“ aus 3-ordner.md als { name: Text in Markdown }. */
function ordnertexte() {
  const text = readFileSync(ORDNERTEXTE, "utf8").split("\n---\n")[0];
  const texte = {};
  for (const teil of text.split(/^## /m).slice(1)) {
    const [kopf, ...rest] = teil.split("\n");
    texte[kopf.trim()] = rest.join("\n").trim();
  }
  return texte;
}

writeFileSync(
  ZIEL,
  `// Erzeugt von app/skripte/konzeptkarte.mjs am ${new Date().toISOString().slice(0, 10)}; nicht von Hand ändern.\n` +
    `window.KONZEPTKARTE = ${JSON.stringify(eintraege)};\n` +
    `window.KONZEPTKARTE_ORDNER = ${JSON.stringify(ordnertexte())};\n`,
);
const ohneKopf = eintraege.filter((e) => !e.zweck).map((e) => e.pfad);
const ohneKommentar = eintraege.flatMap((e) =>
  e.exporte.filter((x) => x.art !== "typ" && !x.satz).map((x) => `${e.pfad}: ${x.name} (${x.art})`),
);
console.log(
  `${eintraege.length} Dateien, ${eintraege.reduce((s, e) => s + e.importe.length, 0)} Verbindungen`,
);
console.log(`ohne Dateikopf (${ohneKopf.length}):`, ohneKopf.join(", "));
console.log(`Exporte ohne Kommentar (${ohneKommentar.length}):`);
for (const z of ohneKommentar) console.log(`  ${z}`);
