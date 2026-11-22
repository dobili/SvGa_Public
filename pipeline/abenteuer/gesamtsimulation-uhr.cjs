// Spieluhr und Tagesabläufe in der Gesamtsimulation (Auftrag des Hauptchats, 22.11.2026).
//
// Warum: Die App stellt die Figuren beim Betreten einer Karte nach der Uhr auf
// (app/src/abenteuer/regeln/tagesablauf.ts, oberwelt/tagesaufstellung.ts). Die Simulation soll
// dasselbe tun, damit pfeilziel.cjs und der Aufschieber von questverfehlen zeigen, dass jeder
// Questschritt zu jeder Tageszeit erreichbar bleibt. Regel 1 wie in der App: Wer Ziel eines
// laufenden Questschritts ist (Ziel, Umweg, Steller der Runde, Gegner, Figur des Dialogs) oder in
// einer Variante mit erfüllter Bedingung steht, bleibt, wo die Szene ihn stellt.
//
// Uhr: st.stunde (null: ohne Uhr wie bisher). Die Umgebungsvariable SIM_STUNDE setzt sie zu Beginn
// (Läufe je Phase: 7, 12, 19, 22). Ink stellt sie mit `#uhr:morgen|mittag|abend|nacht|HH`
// (regeln/spieluhr.ts, ZIELE). Kommt die Simulation nicht weiter, wartet sie wie ein Spieler auf
// der Bank bis zur nächsten Phase (warte).
"use strict";
const fs = require("fs");
const path = require("path");

const DATEN = path.join(__dirname, "..", "..", "inhalte", "abenteuer");
const STUNDEN = 24;
/** Ziele der Uhr wie ZIELE in regeln/spieluhr.ts. */
const ZIELE = { morgen: 7, mittag: 12, tag: 12, abend: 19, nacht: 22 };
/** Reihenfolge beim Warten: die nächste dieser Stunden. */
const WARTEZIELE = [7, 12, 19, 22];
/** Ziele der Lücken zwischen den Quests wie LUECKENZIELE in oberwelt/zielsuche.ts. */
const LUECKENZIELE = ["brettSchreibtisch", "juno", "coachDelgado"];

const lies = (name) =>
  JSON.parse(fs.readFileSync(path.join(DATEN, name), "utf8"));

/** Die Stunde zu Beginn: SIM_STUNDE oder null (ohne Uhr). */
function startstunde() {
  const wert = process.env.SIM_STUNDE;
  return wert === undefined || wert === "" ? null : Number(wert) % STUNDEN;
}

/** Abläufe, Runden und Begegnungen, einmal je Welt. */
function uhrdaten(welt) {
  if (welt.uhr) return welt.uhr;
  const ablaeufe = lies("tagesablaeufe.json").figuren;
  const steller = Object.fromEntries(
    lies("runden.json").runden.map((r) => [r.kennung, r.steller]),
  );
  const gegner = Object.fromEntries(
    lies("begegnungen.json").begegnungen.map((b) => [b.kennung, b.gegner]),
  );
  welt.uhr = {
    ablaeufe,
    steller,
    gegner,
    person: personen(welt.orte, ablaeufe),
  };
  return welt.uhr;
}

/** Kennung einer Figur („mapleFalls.carlaClub“) → Person mit Ablauf („carla“), wie in der App. */
function personen(orte, ablaeufe) {
  const bild = (s) => s.slice(s.lastIndexOf("/") + 1).replace(/\.png$/, "");
  const nachBild = {};
  const zuordnung = {};
  for (const o of orte)
    for (const f of o.figuren) {
      const name = f.kennung.slice(f.kennung.indexOf(".") + 1);
      if (ablaeufe[name]) nachBild[bild(f.sprite)] = name;
    }
  for (const o of orte)
    for (const f of o.figuren) {
      const p = nachBild[bild(f.sprite)];
      if (p) zuordnung[f.kennung] = p;
    }
  return zuordnung;
}

/** Liegt `stunde` im Block (über Mitternacht, 0 bis 0 ganzer Tag)? */
function imBlock(b, stunde) {
  const laenge = (b.bis - b.von + STUNDEN) % STUNDEN || STUNDEN;
  return (stunde - b.von + STUNDEN) % STUNDEN < laenge;
}

/** Objektnamen, die laufende Questschritte brauchen (Regel 1), wie zielangaben in der App. */
function zielobjekte(welt, st, gilt) {
  const u = uhrdaten(welt);
  const name = (kennung) =>
    kennung ? kennung.slice(kennung.indexOf(".") + 1) : null;
  const ziele = new Set();
  const laufend = st.staende.filter((s) => !s.fertig);
  // Laufende Schritte und der erste Schritt jeder noch nicht begonnenen Hauptquest (wie die App).
  const kommende = welt.quests
    .filter((q) => q.haupt && !st.staende.some((s) => s.k === q.kennung))
    .map((q) => ({ k: q.kennung, i: 0 }));
  for (const s of [...laufend, ...kommende]) {
    const schritt = welt.quests.find((q) => q.kennung === s.k)?.schritte[s.i];
    if (!schritt) continue;
    for (const umweg of schritt.umwege || [])
      if (gilt(st, umweg.wenn) && umweg.ziel.objekt)
        ziele.add(umweg.ziel.objekt);
    if (schritt.ziel?.objekt) ziele.add(schritt.ziel.objekt);
    const e = schritt.ereignis;
    if (e.ausloeser) ziele.add(e.ausloeser);
    if (e.art === "aufgaben") ziele.add(name(u.steller[e.runde]));
    if (e.art === "partie") ziele.add(name(u.gegner[e.begegnung]));
    if (e.knoten)
      for (const o of welt.orte)
        for (const f of o.figuren)
          if (f.dialog === e.knoten) ziele.add(name(f.kennung));
  }
  if (laufend.length === 0) for (const z of LUECKENZIELE) ziele.add(z);
  return ziele;
}

/**
 * Die Objekte der Karte nach der Uhr: Figuren mit Ablauf (nicht festgehalten) gehen dorthin, wo
 * ihr Block sie hinstellt; ohne Uhr bleibt alles, wie es ist.
 */
function nachUhr(welt, st, karte, objekte, gilt) {
  if (st.stunde === null || st.stunde === undefined) return objekte;
  const u = uhrdaten(welt);
  const ort = welt.karteZuOrt[karte];
  if (!ort) return objekte;
  const ziele = zielobjekte(welt, st, gilt);
  const fest = new Set();
  for (const f of ort.figuren) {
    const p = u.person[f.kennung];
    const name = f.kennung.slice(f.kennung.indexOf(".") + 1);
    if (p && (ziele.has(name) || (f.wenn && gilt(st, f.wenn)))) fest.add(p);
  }
  const beweglich = (o) => {
    const p = o.typ === "figur" && u.person[`${ort.kennung}.${o.name}`];
    // Nur im Heimatort zählt die Uhr; anderswo stellt die Geschichte (Mama in Ironwood).
    return (
      p &&
      !fest.has(p) &&
      u.ablaeufe[p]?.bloecke &&
      u.ablaeufe[p].ort === ort.kennung
    );
  };
  const neu = Object.entries(u.ablaeufe)
    .filter(([p, a]) => !fest.has(p) && a.bloecke)
    .filter(
      ([, a]) => a.bloecke.find((b) => imBlock(b, st.stunde))?.karte === karte,
    )
    .map(([p]) => ({ name: p, typ: "figur" }));
  return [...objekte.filter((o) => !beweglich(o)), ...neu];
}

/** `#uhr:…` aus Ink: die Uhr auf diese Stunde (nur mit Uhr). */
function stelleUhr(st, tags) {
  if (st.stunde === null || st.stunde === undefined) return;
  for (const tag of tags || []) {
    const m = /^uhr:(\w+)$/.exec(tag.trim());
    if (!m) continue;
    const ziel = ZIELE[m[1]] ?? Number(m[1]);
    if (Number.isInteger(ziel)) st.stunde = ziel % STUNDEN;
  }
}

/** Warten wie ein Spieler auf der Bank: zur nächsten Phase (7, 12, 19, 22). */
function warte(st) {
  if (st.stunde === null || st.stunde === undefined) return;
  st.stunde = WARTEZIELE.find((h) => h > st.stunde) ?? WARTEZIELE[0];
}

module.exports = { nachUhr, startstunde, stelleUhr, warte, imBlock };
