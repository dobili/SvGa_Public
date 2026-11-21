// Pfeilziel: Bringt das Ziel des Hauptpfeils den Questschritt wirklich voran, oder schickt es nur
// weiter? (Auftrag des Hauptchats, 20.11.2026)
//
// Warum: In Desert Springs zeigte der Pfeil der Hauptquest auf Mira, für den Clubkampf. Solange der
// Brief von Mr. Okoro nicht gelesen war, sagte Mira aber nur „Dot sagt, du sollst erst zu Mr. Okoro.“
// Wer dem Pfeil folgte, wurde weitergeschickt. Seither kann ein Questschritt `umwege` tragen
// (quests.json: Bedingung und Ziel, oberwelt/zielsuche.ts); dieses Werkzeug findet die Stellen,
// an denen einer fehlt.
//
// Vorgehen: Die Gesamtsimulation spielt das Spiel (gesamtsimulation.cjs, Haken `bis`). Sobald ein
// Schritt einer Hauptquest neu ansteht, merkt sich das Werkzeug den Stand. Danach „spricht“ es mit
// genau diesem Stand das Pfeilziel an (Dialog der Figur oder des Auslösers, mehrere Versuche mit
// anderen Zufallswerten für die Wahlen). Fund ist ein Ziel, dessen Gespräch das Ereignis des
// Schritts in keinem Versuch auslöst: die Partie oder Runde des Schritts beginnt nicht, und sein
// Dialogknoten wird nicht erreicht.
// Geprüft werden Schritte mit Partie, Runde oder Dialog; Schritte mit Ort-Ereignis sind ein Weg
// dorthin und haben kein Gespräch.
//
// Aufruf aus dem Hauptordner: node pipeline/abenteuer/pfeilziel.cjs [--startwert 1] [--sekunden 300]
// [--zeige] (--zeige: je Fund die ersten Zeilen des Gesprächs).
// Ausgabe: je Fund Quest, Schritt, Ziel und Dialogknoten; zuletzt „N Funde“. Rückgabewert 1 bei
// Funden. Bewusst offene Stellen stehen in AUSNAHMEN mit Grund.
"use strict";
const fs = require("fs");
const path = require("path");
const { ladeWelt, neuerStand } = require("./gesamtsimulation-regeln.cjs");
const { erkunde } = require("./gesamtsimulation.cjs");
const { dialog } = require("./gesamtsimulation-dialoge.cjs");
const { erfuellt } = require("./bedingung.cjs");

const DATEN = path.join(__dirname, "..", "..", "inhalte", "abenteuer");
/** So oft spricht das Werkzeug ein Ziel an (andere Zufallswerte für die Wahlen im Gespräch). */
const VERSUCHE = 6;
/** Abstand der Startwerte der Versuche (beliebig, nur verschieden). */
const SAATABSTAND = 7919;
/** So oft spricht der Spieler dasselbe Ziel hintereinander an. */
const GESPRAECHE = 3;
/** So viele Zeilen des Gesprächs zeigt --zeige je Fund. */
const ZEILEN_IM_BERICHT = 8;

/**
 * Bewusst offene Stellen: „quest#schritt“ → Grund. Leer: Jede Stelle bekommt einen Umweg oder ein
 * passendes Ziel.
 */
const AUSNAHMEN = {};

function lies(datei) {
  return JSON.parse(fs.readFileSync(path.join(DATEN, datei), "utf8"));
}

/** Liest --name wert aus der Befehlszeile. */
function wert(liste, name, vorgabe) {
  const i = liste.indexOf(name);
  return i >= 0 && liste[i + 1] !== undefined ? liste[i + 1] : vorgabe;
}

/**
 * Das Ziel des Pfeils für einen Schritt bei diesen Variablen, wie zielangabe in
 * oberwelt/zielsuche.ts: erst ein passender Umweg, dann `ziel`, dann Gegner oder Steller.
 * Ausgabe: { figur } (Kennung „ort.name“) oder { karte, objekt } (bei einem Umweg mit seiner
 * Bedingung als `umweg`), sonst null.
 */
function pfeilziel(schritt, vars, daten) {
  for (const u of schritt.umwege || [])
    if (erfuellt(u.wenn, vars)) return { ...u.ziel, umweg: u.wenn };
  if (schritt.ziel) return schritt.ziel;
  const e = schritt.ereignis;
  if (e.art === "partie") {
    const b = daten.begegnungen.find((x) => x.kennung === e.begegnung);
    return b?.gegner ? { figur: b.gegner } : null;
  }
  if (e.art === "aufgaben") {
    const r = daten.runden.find((x) => x.kennung === e.runde);
    return r?.steller ? { figur: r.steller } : null;
  }
  return null;
}

/** Der Dialogknoten, den ein Antippen des Ziels öffnet (Figur oder Auslöser), oder null. */
function knotenZu(welt, z) {
  if (z.figur) {
    for (const o of welt.orte) {
      const f = o.figuren.find((x) => x.kennung === z.figur);
      if (f) return f.dialog || null;
    }
    return null;
  }
  for (const o of welt.orte) {
    const f = o.figuren.find(
      (x) =>
        x.kennung.split(".").pop() === z.objekt &&
        z.karte.startsWith(o.kennung + "."),
    );
    if (f) return f.dialog || null;
    const a = (o.ausloeser || []).find(
      (x) => x.name === z.objekt && x.karte === z.karte,
    );
    if (a) return a.dialog || null;
  }
  return null;
}

/** Löst das Gespräch das Ereignis des Schritts aus? */
function loestAus(folgen, e) {
  if (e.art === "partie") return folgen.partie === e.begegnung;
  if (e.art === "aufgaben") return folgen.runde === e.runde;
  // Ein Dialogschritt nach einer Partie oder Runde (Vorrunde, dann „vorrunde_geschafft“): Startet
  // das Gespräch sie, bringt es weiter.
  if (e.art === "dialog") {
    return (
      (folgen.besucht || []).includes(e.knoten) ||
      Boolean(folgen.partie || folgen.runde)
    );
  }
  return true;
}

/**
 * Ein Mitleser für die Simulation (st.leser, gesamtsimulation-dialoge.cjs): sammelt die Zeilen und
 * wählt je Versuch anders, im ersten Versuch immer die erste Antwort, im zweiten die letzte, sonst
 * reihum versetzt. So kommen auch Antworten wie „Spielen“ an zweiter Stelle dran.
 */
function mitleser(versuch) {
  const zeilen = [];
  let zug = 0;
  return {
    zeilen,
    beginn() {},
    ende() {},
    zeile(text) {
      zeilen.push(text.trim());
    },
    waehle(wahlen) {
      zug += 1;
      zeilen.push(`[Wahl: ${wahlen.join(" | ")}]`);
      if (versuch === 1) return 0;
      if (versuch === 2) return wahlen.length - 1;
      return (versuch + zug) % wahlen.length;
    },
  };
}

/**
 * Spricht das Ziel mit dem gemerkten Stand an, mehrmals. Ausgabe: null, wenn ein Versuch
 * weiterbringt, sonst die Zeilen des ersten Versuchs (für den Bericht).
 */
function versuche(welt, stand, knoten, e, startwert, umweg) {
  let erste = [];
  for (let v = 1; v <= VERSUCHE; v++) {
    const st = neuerStand(startwert * SAATABSTAND + v);
    st.vars = { ...stand.vars };
    st.besitz = new Set(stand.besitz);
    st.karten = { ...stand.karten };
    st.muenzen = stand.muenzen;
    st.staende = stand.staende.map((s) => ({ ...s }));
    st.leser = mitleser(v);
    // Die Simulation baut jede Geschichte einmal, und ihre Rückrufe (beginnePartie …) schreiben in
    // den Stand, mit dem sie gebaut wurde. Für diesen Prüfstand also neu bauen.
    welt.geschichten = {};
    // Manche Figuren erzählen in mehreren Gesprächen nacheinander (Ward: bleib, Victors Krise,
    // Clubkampf); ein Spieler spricht sie dann wieder an. Die Variablen gehen von Gespräch zu Gespräch.
    for (let g = 0; g < GESPRAECHE; g++) {
      const folgen = dialog(welt, st, knoten);
      // Ein Umweg bringt weiter, wenn er seine Bedingung aufhebt oder etwas dafür startet (Okoro:
      // die Siegelrunde für den Brief).
      const weiter = umweg
        ? !erfuellt(umweg, st.vars) || Boolean(folgen.partie || folgen.runde)
        : loestAus(folgen, e);
      if (weiter) return null;
    }
    if (v === 1) erste = st.leser.zeilen;
  }
  return erste;
}

/** Spielt und merkt sich je neu anstehendem Hauptquestschritt den Stand. */
function sammle(welt, startwert, sekunden) {
  const haupt = new Set(
    welt.quests.filter((q) => q.haupt).map((q) => q.kennung),
  );
  const staende = new Map();
  const st = neuerStand(startwert);
  const merke = (s) => {
    for (const q of s.staende) {
      const schluessel = `${q.k}#${q.i}`;
      if (q.fertig || !haupt.has(q.k) || staende.has(schluessel)) continue;
      staende.set(schluessel, {
        k: q.k,
        i: q.i,
        vars: { ...s.vars },
        besitz: [...s.besitz],
        karten: { ...s.karten },
        muenzen: s.muenzen,
        staende: s.staende.map((x) => ({ ...x })),
      });
    }
    return false;
  };
  erkunde(welt, st, Date.now() + sekunden * 1000, 0, merke);
  return [...staende.values()];
}

function hauptprogramm(liste) {
  const startwert = Number(wert(liste, "--startwert", "1"));
  const zeige = liste.includes("--zeige");
  const welt = ladeWelt();
  const daten = {
    begegnungen: lies("begegnungen.json").begegnungen,
    runden: lies("runden.json").runden,
  };
  const funde = [];
  for (const stand of sammle(
    welt,
    startwert,
    Number(wert(liste, "--sekunden", "300")),
  )) {
    const q = welt.quests.find((x) => x.kennung === stand.k);
    const schritt = q.schritte[stand.i];
    if (!["partie", "aufgaben", "dialog"].includes(schritt.ereignis.art))
      continue;
    const z = pfeilziel(schritt, stand.vars, daten);
    const knoten = z ? knotenZu(welt, z) : null;
    if (!knoten) continue;
    const zeilen = versuche(
      welt,
      stand,
      knoten,
      schritt.ereignis,
      startwert,
      z.umweg,
    );
    if (!zeilen) continue;
    const schluessel = `${stand.k}#${stand.i}`;
    if (AUSNAHMEN[schluessel]) continue;
    funde.push(
      `${schluessel}: Pfeil auf ${z.figur || `${z.karte}.${z.objekt}`} (${knoten}) löst ${JSON.stringify(schritt.ereignis)} nicht aus` +
        (zeige
          ? `\n    ${zeilen.slice(0, ZEILEN_IM_BERICHT).join("\n    ")}`
          : ""),
    );
  }
  for (const f of funde) console.log(f);
  console.log(`${funde.length} Funde`);
  if (funde.length > 0) process.exitCode = 1;
}

if (require.main === module) hauptprogramm(process.argv.slice(2));

module.exports = { pfeilziel, knotenZu, loestAus };
