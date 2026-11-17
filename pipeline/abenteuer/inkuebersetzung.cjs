// Übersetzungsprüfung der Ink-Dialoge des Schach-Abenteuers: Jede .ink-Datei eines Ordners wird mit
// dem Compiler von inkjs übersetzt, genau wie im Paketbau (app/skripte/baue-abenteuerpaket.mjs) und
// in der Gesamtsimulation (gesamtsimulation-regeln.cjs): CompilerOptions(null, [], true), also mit
// Zählung aller Besuche.
//
// Warum: Am 17.11.2026 stand in ironwood-kantine.ink zweimal „VAR kaufGesehen“. Die Komponententests
// der App (npx vitest run src/abenteuer) übersetzen die echten Dialoge nicht und blieben grün; erst
// die Gesamtsimulation brach mit „Compilation failed“ ab, ohne Datei und Zeile. Diese Prüfung läuft
// in jedem „python -m pytest pipeline/tests“ (pipeline/tests/test_abenteuer_inkuebersetzung.py) und
// nennt zu jedem Fehler Datei, Zeile und Meldung des Compilers.
//
// Aufruf:  node pipeline/abenteuer/inkuebersetzung.cjs [--ordner ORDNER]
// Ausgabe: je Fehler und je Warnung eine Zeile „datei.ink:ZEILE: Art: Meldung“, am Ende
//          „71 Dateien, 0 Warnungen, 0 Fehler“. Rückgabewert 1 bei Fehlern, sonst 0.
//          Warnungen und Autorenhinweise (TODO) ändern den Rückgabewert nicht; der Test verlangt
//          aber auch 0 Warnungen, weil der Bestand keine hat (Stand 17.11.2026) und eine Warnung
//          wie „Apparent loose end“ ein Dialog ist, der ins Leere läuft.
"use strict";

const fs = require("fs");
const path = require("path");

const HAUPTORDNER = path.join(__dirname, "..", "..");
const INKJS = path.join(HAUPTORDNER, "app", "node_modules", "inkjs");
const DIALOGE = path.join(HAUPTORDNER, "inhalte", "abenteuer", "dialoge", "de");
const SCHALTER_ORDNER = "--ordner";
const ENDUNG = ".ink";

// Arten der Meldungen, wie inkjs sie dem errorHandler übergibt (engine/Error: ErrorType).
const ART_HINWEIS = 0;
const ART_WARNUNG = 1;
const ART_FEHLER = 2;
const ARTNAMEN = {
  [ART_HINWEIS]: "Hinweis",
  [ART_WARNUNG]: "Warnung",
  [ART_FEHLER]: "Fehler",
};
// inkjs schreibt „ERROR: line 12: Text“ (ohne Dateinamen: „ERROR: 'datei' line 12: Text“).
const MELDUNGSFORM = /^(?:ERROR|WARNING|TODO): (?:'[^']*' )?line (\d+): (.*)$/s;
// inkjs wirft nach dem Sammeln der Fehler diese Meldung; sie selbst ist kein eigener Befund.
const SAMMELMELDUNG = "Compilation failed.";

/**
 * Zerlegt eine Meldung des Compilers in Zeile und Text.
 * Warum: Die Ausgabe soll „datei.ink:ZEILE: …“ heißen, damit man die Stelle sofort findet.
 * Eingabe: Meldung von inkjs, z. B. „ERROR: line 7: found declaration variable 'kaufGesehen' that
 * was already declared (line 3)“. Ausgabe: { zeile: 7, text: "found declaration …" }.
 * Sonderfall: Meldungen ohne Zeilenangabe behalten ihren ganzen Text, zeile ist dann 0.
 */
function zerlegeMeldung(meldung) {
  const treffer = MELDUNGSFORM.exec(meldung);
  return treffer
    ? { zeile: Number(treffer[1]), text: treffer[2] }
    : { zeile: 0, text: meldung };
}

/**
 * Übersetzt eine Ink-Quelle und sammelt alle Meldungen des Compilers.
 * Warum: Ohne errorHandler wirft inkjs nur „Compilation failed.“; mit ihm (vierter Parameter der
 * CompilerOptions) kommt jede Meldung einzeln mit Zeile an.
 * Eingaben: Dateiname (nur für die Ausgabe) und Quelltext. Ausgabe: Liste von
 * { datei, zeile, art, text }, leer bei einer sauberen Datei.
 * Sonderfall: Wirft der Compiler etwas anderes als die Sammelmeldung (etwa bei INCLUDE, für das es
 * hier keinen Dateizugriff gibt), wird das als Fehler ohne Zeile gemeldet, nicht verschluckt.
 */
function uebersetze(datei, quelle) {
  const { Compiler } = require(path.join(INKJS, "compiler", "Compiler"));
  const { CompilerOptions } = require(
    path.join(INKJS, "compiler", "CompilerOptions"),
  );
  const befunde = [];
  const merke = (meldung, art) =>
    befunde.push({ datei, art, ...zerlegeMeldung(meldung) });
  try {
    new Compiler(quelle, new CompilerOptions(null, [], true, merke))
      .Compile()
      .ToJson();
  } catch (fehler) {
    const schonGemeldet = befunde.some((b) => b.art === ART_FEHLER);
    if (fehler.message !== SAMMELMELDUNG || !schonGemeldet)
      befunde.push({ datei, art: ART_FEHLER, zeile: 0, text: fehler.message });
  }
  return befunde;
}

/**
 * Übersetzt alle .ink-Dateien eines Ordners (ohne Unterordner), nach Namen geordnet.
 * Eingabe: Ordner, z. B. inhalte/abenteuer/dialoge/de. Ausgabe: { dateien: Anzahl, befunde: Liste }.
 * Sonderfall: Ein Ordner ohne .ink-Datei gilt als Fehler, damit ein falscher Pfad nicht als
 * „0 Fehler“ durchgeht.
 */
function pruefeOrdner(ordner) {
  const dateien = fs
    .readdirSync(ordner)
    .filter((d) => d.endsWith(ENDUNG))
    .sort();
  if (dateien.length === 0)
    return {
      dateien: 0,
      befunde: [
        {
          datei: ordner,
          art: ART_FEHLER,
          zeile: 0,
          text: "keine .ink-Datei gefunden",
        },
      ],
    };
  const befunde = dateien.flatMap((datei) =>
    uebersetze(datei, fs.readFileSync(path.join(ordner, datei), "utf8")),
  );
  return { dateien: dateien.length, befunde };
}

/** Liest den Ordner aus den Argumenten („--ordner PFAD“); ohne Schalter die deutschen Dialoge. */
function ordnerAus(argumente) {
  const stelle = argumente.indexOf(SCHALTER_ORDNER);
  if (stelle < 0) return DIALOGE;
  const ordner = argumente[stelle + 1];
  if (!ordner) throw new Error(`${SCHALTER_ORDNER} braucht einen Ordner`);
  return ordner;
}

/** Schreibt die Befunde und die Schlusszeile; gibt die Zahl der Fehler zurück. */
function berichte({ dateien, befunde }) {
  for (const b of befunde)
    console.log(`${b.datei}:${b.zeile}: ${ARTNAMEN[b.art]}: ${b.text}`);
  const fehler = befunde.filter((b) => b.art === ART_FEHLER).length;
  const warnungen = befunde.filter((b) => b.art === ART_WARNUNG).length;
  console.log(`${dateien} Dateien, ${warnungen} Warnungen, ${fehler} Fehler`);
  return fehler;
}

if (require.main === module) {
  const fehler = berichte(pruefeOrdner(ordnerAus(process.argv.slice(2))));
  process.exitCode = fehler > 0 ? 1 : 0;
}

module.exports = { pruefeOrdner, uebersetze, zerlegeMeldung };
