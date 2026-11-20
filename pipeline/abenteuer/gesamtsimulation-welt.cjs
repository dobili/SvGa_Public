// Laden der Welt für die Gesamtsimulation (gesamtsimulation-regeln.cjs): Spieldaten, Ink mit
// Besuchszählung und die Objekte jeder Karte samt Fassungen. Ausgelagert am 20.11.2026, damit jede
// Datei unter 400 Zeilen bleibt (CLAUDE.md, Regel 4); Verhalten unverändert.
"use strict";
const fs = require("fs");
const path = require("path");

const HAUPT = path.resolve(__dirname, "..", "..");
const APP = path.join(HAUPT, "app", "node_modules", "inkjs");
const { Compiler } = require(path.join(APP, "compiler", "Compiler"));
const { CompilerOptions } = require(
  path.join(APP, "compiler", "CompilerOptions"),
);
const DATEN = path.join(HAUPT, "inhalte", "abenteuer");

const lade = (name) =>
  JSON.parse(fs.readFileSync(path.join(DATEN, name), "utf8"));

/** Alle Spieldaten: Orte, Quests, Läden, Begegnungen, Ink (mit Besuchszählung), Objekte der Karten. */
function ladeWelt() {
  const orte = lade("orte.json").orte;
  const welt = {
    orte,
    quests: lade("quests.json").quests,
    laeden: lade("laeden.json").laeden,
    begegnungen: new Set(
      lade("begegnungen.json").begegnungen.map((b) => b.kennung),
    ),
    rolle: rollenJeBegegnung(),
    // Rückmeldung nach der Runde (runden.json `danach`, gesamtsimulation-dialoge.cjs).
    rundenDanach: Object.fromEntries(
      lade("runden.json")
        .runden.filter((r) => r.danach)
        .map((r) => [r.kennung, r.danach]),
    ),
    // Bretter je Simultan (partieformen.json): Die App setzt den Ausgang jedes Bretts.
    simultanBretter: Object.fromEntries(
      lade("partieformen.json").simultan.map((x) => [x.kennung, x.begegnungen]),
    ),
    begegnungDanach: Object.fromEntries(
      lade("begegnungen.json")
        .begegnungen.filter((b) => b.danach)
        .map((b) => [b.kennung, b.danach]),
    ),
    fundmuenzen: Object.fromEntries(
      lade("funde.json").funde.map((f) => [f.kennung, f.muenzen || 0]),
    ),
    karten: Object.fromEntries(
      lade("karten.json").karten.map((k) => [k.kennung, k]),
    ),
    kartenErlaubt: Object.fromEntries(
      lade("begegnungen.json").begegnungen.map((b) => [
        b.kennung,
        b.kartenErlaubt,
      ]),
    ),
    ink: {},
    knoten: {},
    objekte: {},
    fassungen: {},
    grundobjekte: {},
    karteZuOrt: {},
  };
  uebersetzeInk(welt);
  sammleObjekte(welt, orte);
  return welt;
}

/** Übersetzt alle deutschen Ink-Dateien wie der Paketbau (alle Besuche zählen) und merkt die Knoten. */
function uebersetzeInk(welt) {
  const ordner = path.join(DATEN, "dialoge", "de");
  for (const datei of fs
    .readdirSync(ordner)
    .filter((d) => d.endsWith(".ink"))) {
    const quelle = fs.readFileSync(path.join(ordner, datei), "utf8");
    const name = datei.replace(".ink", "");
    welt.ink[name] = new Compiler(quelle, new CompilerOptions(null, [], true))
      .Compile()
      .ToJson();
    welt.knoten[name] = [...quelle.matchAll(/^=== (\w+) ===/gm)].map(
      (m) => m[1],
    );
  }
}

/**
 * Objekte je Karte: alle Fassungen zusammen (welt.objekte), je Fassung (welt.fassungen) und die der
 * Grundkarte (welt.grundobjekte); dazu der Ort jeder Karte.
 */
function sammleObjekte(welt, orte) {
  for (const ort of orte)
    for (const k of ort.karten) {
      welt.karteZuOrt[k.kennung] = ort;
      // Zustandskarten (Runde 12): welt.objekte nimmt die Objekte aller Fassungen zusammen (für die
      // Wegsuche und „Figuren ohne Karte“); was der Spieler anfassen kann, gibt objekteJetzt je nach
      // Fassung (wie oberwelt/kartenfassung.ts). Sonst sprach die Simulation Ambrose am
      // Schreibtisch an, bevor es ihn dort gibt (Chaos-Prüfung, 14.11.2026).
      const objekteVon = (datei) =>
        JSON.parse(fs.readFileSync(path.join(DATEN, datei), "utf8"))
          .layers.filter((l) => l.type === "objectgroup")
          .flatMap((l) =>
            l.objects.map((o) => ({ name: o.name, typ: o.type || o.class })),
          )
          .filter((o) => o.typ !== "statist" && o.typ !== "tier");
      const grund = objekteVon(k.datei);
      const namen = new Set(grund.map((o) => o.name));
      const dazu = Object.values(k.zustaende || {})
        .flatMap(objekteVon)
        .filter((o) => !namen.has(o.name) && namen.add(o.name));
      welt.objekte[k.kennung] = [...grund, ...dazu];
      welt.fassungen[k.kennung] = Object.entries(k.zustaende || {}).map(
        ([wenn, datei]) => ({ wenn, objekte: objekteVon(datei) }),
      );
      welt.grundobjekte[k.kennung] = grund;
    }
}

/** Rolle des Gegners (strasse, clubchef …) je Begegnung, aus begegnungen.json und gegner.json. */
function rollenJeBegegnung() {
  const rollen = Object.fromEntries(
    lade("gegner.json").gegner.map((g) => [g.kennung, g.rolle]),
  );
  return Object.fromEntries(
    lade("begegnungen.json").begegnungen.map((b) => [
      b.kennung,
      rollen[b.gegner],
    ]),
  );
}

/** Figuren, die auf keiner Karte ihres Ortes stehen; die bekannten werden ersatzweise gesetzt. */
function figurenOhneKarte(welt, ersatz) {
  const ohne = [];
  for (const ort of welt.orte)
    for (const f of ort.figuren) {
      const kurz = f.kennung.split(".")[1];
      if (
        ort.karten.some((k) =>
          welt.objekte[k.kennung].some((o) => o.name === kurz),
        )
      )
        continue;
      ohne.push(f.kennung);
      if (!ersatz.includes(f.kennung)) continue;
      const datei = "karten/" + f.dialog.split(".")[0] + ".json";
      const k = ort.karten.find((x) => x.datei === datei) || ort.karten[0];
      welt.objekte[k.kennung].push({ name: kurz, typ: "figur" });
      welt.grundobjekte[k.kennung].push({ name: kurz, typ: "figur" });
    }
  return ohne;
}

module.exports = { ladeWelt, figurenOhneKarte };
