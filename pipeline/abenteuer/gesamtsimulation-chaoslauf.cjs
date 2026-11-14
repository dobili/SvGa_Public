// Gesamtsimulation, Chaos-Prüfung, die Läufe: Vorlauf des gründlichen Spielers, Chaos-Spieler
// (gesamtsimulation-chaos.cjs), Übernahme und Bericht; dazu --kuerzen, --einzeln und --schnell.
// Aufteilung wegen der Größengrenze von 400 Zeilen (CLAUDE.md, Regel 4). Aufruf und Ablauf stehen
// im Kopf von gesamtsimulation-chaos.cjs.
"use strict";
const fs = require("fs");
const { berichtSammlung } = require("./gesamtsimulation-sammlung.cjs");
const {
  FOLGE,
  zufall,
  betrete,
  neuerStand,
} = require("./gesamtsimulation-regeln.cjs");
const {
  spieleChaos,
  weitestesGebiet,
  KAUFARTEN,
} = require("./gesamtsimulation-chaos.cjs");

const STANDARD_SCHRITTE = [30, 100, 300, 1000];
const LAUF_SEKUNDEN = 240;
const RUECKKEHR_CHAOS = 3000;
const AKT1 = ["mapleFalls", "wegMapleCedar", "cedarCreek"];
const ZIEL_SCHNELL = "riverton";

// ---------------------------------------------------------------- Aufruf

function argumente(liste) {
  const wert = (name, vorgabe) => {
    const i = liste.indexOf(name);
    return i >= 0 && liste[i + 1] !== undefined ? liste[i + 1] : vorgabe;
  };
  const bereich = wert("--startwerte", "1-4");
  const [von, bis] = bereich.includes("-")
    ? bereich.split("-").map(Number)
    : [Number(bereich), Number(bereich)];
  return {
    startwerte: Array.from({ length: bis - von + 1 }, (_, i) => von + i),
    sekunden: Number(wert("--sekunden", "3600")),
    laufSekunden: Number(wert("--lauf-sekunden", String(LAUF_SEKUNDEN))),
    schritte: wert("--schritte", STANDARD_SCHRITTE.join(","))
      .split(",")
      .map(Number),
    json: wert("--json", ""),
    kuerzen: wert("--kuerzen", ""),
    einzeln: wert("--einzeln", ""),
  };
}

// ---------------------------------------------------------------- Läufe

/**
 * Vorlauf des gründlichen Spielers mit echten Preisen; merkt sich den Stand bei jedem neuen Gebiet
 * (structuredClone), damit nicht jeder Chaos-Lauf von vorn beginnt.
 */
function vorlauf(welt, h, frist) {
  const st = neuerStand(1);
  Object.assign(st, { echt: true, protokoll: [] });
  const staende = [structuredClone(st)];
  let phase = 0;
  h.erkunde(welt, st, frist, 0, (s) => {
    if (s.phase !== phase) {
      phase = s.phase;
      staende.push(structuredClone(s));
    }
    return false;
  });
  return staende;
}

/**
 * Zu Beginn der Übernahme reist der gründliche Spieler mit der Monatskarte in die vorderste besuchte
 * Stadt, wie ein Mensch es täte: Zu Fuß führt von Ironwood kein Weg nach Silicon Bay (nur der Bus
 * aus einem Dialog), die Wegsuche fände sonst nicht zurück. Ohne Monatskarte geht er zu Fuß.
 */
function zurueckNachVorn(welt, st) {
  if (!st.besitz.has("monatskarte")) return;
  welt.ortMerker =
    welt.ortMerker || new Map(welt.orte.map((x) => [x.kennung, x]));
  const staedte = FOLGE.filter(
    (k) => st.besucht.has(k) && !welt.ortMerker.get(k).art,
  );
  const ziel = welt.ortMerker.get(staedte[staedte.length - 1]);
  if (!ziel || ziel.kennung === st.letzterOrt) return;
  const k = ziel.karten.find((x) => !x.innen) || ziel.karten[0];
  st.protokoll.push(`Übernahme: reise ${k.kennung}`);
  betrete(welt, st, k.kennung);
}

/** Ein Lauf: Stand aus dem Vorlauf, Chaos, Übernahme; gibt das Ergebnis zurück. */
function lauf(welt, h, staende, startwert, gebiet, n, laufSekunden) {
  const st = structuredClone(staende[gebiet]);
  st.saat = startwert * 7919 + gebiet * 104729 + n;
  st.protokoll = [];
  const kaufart = KAUFARTEN[startwert % KAUFARTEN.length];
  welt.geschichten = {};
  spieleChaos(welt, st, h, n, kaufart);
  const chaosEnde = { karte: st.karte, muenzen: st.muenzen };
  zurueckNachVorn(welt, st);
  const frist = Date.now() + laufSekunden * 1000;
  st.rueckkehrSchritte = RUECKKEHR_CHAOS;
  const t0 = Date.now();
  h.erkunde(welt, st, frist, weitestesGebiet(st));
  const t1 = Date.now();
  h.nachholen(welt, st, frist, h.SCHRITTE);
  const t2 = Date.now();
  h.rueckkehr(welt, st, frist, h.SCHRITTE);
  const zeitUm = Date.now() > frist;
  const dauer = [t1 - t0, t2 - t1, Date.now() - t2].map((x) =>
    Math.round(x / 1000),
  );
  const ergebnis = {
    zeitUm,
    dauer,
    startwert,
    gebiet: FOLGE[gebiet] || "vorn",
    gebietNr: gebiet,
    n,
    kaufart,
    chaosEnde,
    sackgasse: h.sackgasse(welt, st),
    ursache: ursache(welt, st),
    muenzen: st.muenzen,
    zuTeuer: [...st.zuTeuer],
    protokoll: st.protokoll,
    sammlung: berichtSammlung(st),
  };
  // Der Stand selbst für die Fehlersuche, nicht in der JSON-Ausgabe.
  Object.defineProperty(ergebnis, "stand", { value: st });
  return ergebnis;
}

/** Kurzfassung der Ursache: erste hängende Hauptquest, dann Abspann, Meldungen, Nebenquests. */
function ursache(welt, st) {
  const teile = [];
  for (const q of welt.quests) {
    const s = st.staende.find((x) => x.k === q.kennung);
    if (s?.fertig || (!s && !q.haupt)) continue;
    const wo = s
      ? `Schritt ${s.i} ${JSON.stringify(q.schritte[s.i].ereignis)}`
      : "nie begonnen";
    teile.push(`${q.haupt ? "Hauptquest" : "Nebenquest"} ${q.kennung}: ${wo}`);
  }
  if (!st.abspann) teile.push("kein Abspann");
  for (const m of st.meldungen) teile.push(`Meldung: ${m}`);
  return teile;
}

/** Wählt Gebiet und N je Startwert: reihum alle N, das Gebiet zufällig (ein Drittel von vorn). */
function plan(startwert, staende, schritte) {
  const s = { saat: startwert * 31337 };
  const gebiet = zufall(s) < 1 / 3 ? 0 : Math.floor(zufall(s) * staende.length);
  return { gebiet, n: schritte[startwert % schritte.length] };
}

function zeile(e) {
  const kopf = `Startwert ${e.startwert}, Gebiet ${e.gebiet}, N ${e.n}, ${e.kaufart} (${e.dauer.join("/")} s)`;
  if (e.zeitUm) return `${kopf}: Zeitbudget erreicht (unentschieden)`;
  return e.sackgasse
    ? `${kopf}: SACKGASSE\n    ${e.ursache.join("\n    ")}`
    : `${kopf}: ok`;
}

/** --kuerzen START:GEBIET:N: kleinstes N (Halbierung), bei dem der Lauf noch hängen bleibt. */
function kuerze(welt, h, staende, text, laufSekunden, nurEiner) {
  const [startwert, gebiet, n] = text.split(":").map(Number);
  let lo = 0,
    hi = n,
    best = lauf(welt, h, staende, startwert, gebiet, n, laufSekunden);
  console.log(zeile(best));
  if (!best.sackgasse || best.zeitUm) return;
  if (nurEiner) lo = hi;
  while (hi - lo > 1) {
    const mitte = Math.floor((lo + hi) / 2);
    const e = lauf(welt, h, staende, startwert, gebiet, mitte, laufSekunden);
    console.log(`  N ${mitte}: ${e.sackgasse ? "Sackgasse" : "ok"}`);
    if (e.sackgasse) [hi, best] = [mitte, e];
    else lo = mitte;
  }
  console.log(zeile(best));
  console.log("Aktionen des Chaos-Spielers:\n  " + best.protokoll.join("\n  "));
}

/**
 * --schnell (Pytest, unter einer Minute): Chaos ab dem Dachboden, dann der gründliche Spieler bis
 * Riverton und zurück zu offenen Hauptquests von Akt 1. Sackgasse: Riverton nie erreicht, eine
 * Hauptquest von Akt 1 (außer dem Epilog) nicht fertig, oder eine Meldung (Laufzeitfehler).
 */
function schnelltest(welt, h, arg) {
  const akt1 = welt.quests.filter(
    (q) => q.haupt && !q.voraussetzung && AKT1.includes(q.ort),
  );
  let funde = 0;
  for (const startwert of arg.startwerte) {
    welt.geschichten = {};
    const st = neuerStand(startwert);
    Object.assign(st, { echt: true, protokoll: [] });
    const n = arg.schritte[startwert % arg.schritte.length];
    spieleChaos(welt, st, h, n, KAUFARTEN[startwert % KAUFARTEN.length]);
    const frist = Date.now() + arg.laufSekunden * 1000;
    h.erkunde(welt, st, frist, weitestesGebiet(st), (s) =>
      s.besucht.has(ZIEL_SCHNELL),
    );
    h.rueckkehr(
      welt,
      st,
      frist,
      h.SCHRITTE,
      new Set(akt1.map((q) => q.kennung)),
    );
    const offen = akt1
      .filter((q) => !st.staende.some((x) => x.k === q.kennung && x.fertig))
      .map((q) => q.kennung);
    const fehler = [
      ...(st.besucht.has(ZIEL_SCHNELL) ? [] : [`${ZIEL_SCHNELL} nie erreicht`]),
      ...offen.map((k) => `Hauptquest offen: ${k}`),
      ...[...st.meldungen],
    ];
    console.log(`Startwert ${startwert}, N ${n}: ${fehler.join("; ") || "ok"}`);
    if (fehler.length) {
      funde++;
      console.log("  " + st.protokoll.join("\n  "));
    }
  }
  process.exitCode = funde ? 1 : 0;
}

function hauptprogrammChaos(welt, roh, h) {
  const arg = argumente(roh.liste);
  if (roh.liste.includes("--schnell")) return schnelltest(welt, h, arg);
  const ende = Date.now() + arg.sekunden * 1000;
  const staende = vorlauf(welt, h, Date.now() + arg.laufSekunden * 1000);
  if (arg.kuerzen || arg.einzeln)
    return kuerze(
      welt,
      h,
      staende,
      arg.kuerzen || arg.einzeln,
      arg.laufSekunden,
      !arg.kuerzen,
    );
  let funde = 0;
  for (const startwert of arg.startwerte) {
    if (Date.now() > ende) break;
    const { gebiet, n } = plan(startwert, staende, arg.schritte);
    const e = lauf(welt, h, staende, startwert, gebiet, n, arg.laufSekunden);
    console.log(zeile(e));
    if (arg.json) fs.appendFileSync(arg.json, JSON.stringify(e) + "\n");
    if (e.sackgasse && !e.zeitUm) funde++;
  }
  console.log(`Sackgassen: ${funde}`);
  process.exitCode = funde ? 1 : 0;
}

module.exports = { hauptprogrammChaos, vorlauf, lauf };
