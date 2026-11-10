// Gesamtsimulation, letzter Teil: Rückkehr zu offenen Quests und Nachholen nie besuchter Orte.
//
// Warum: Nach dem Erkunden der FOLGE fehlten Nebenorte (Jahrmarkt, nur über Crossroads) und das
// Bayou (nur über Port Delacroix, die Simulation stand da schon in Capital Arena). Der Spieler
// reist in der App mit der Monatskarte (oberwelt/Reisen.tsx) in jede besuchte Stadt; so auch hier.
// Ziele sind ein Ort samt angrenzenden Nebenorten (Orte außerhalb der FOLGE, Vorschlag mittel-3),
// damit eine Quest in Crossroads ihren Schritt auf dem Jahrmarkt erreicht.
// Die Schritte (besucheKarte, waehleWeg, imZiel) kommen aus gesamtsimulation.cjs.
"use strict";

const {
  FOLGE,
  VERSUCHE_JE_ZUSTAND,
  betrete,
} = require("./gesamtsimulation-regeln.cjs");

const RUECKKEHR_SCHRITTE = 6000;
const NACHHOLEN_SCHRITTE = 1500;
const NEUER_VERSUCH_ALLE = 200;

/**
 * Orte (keine Erinnerungen), die an einen der Orte direkt angrenzen; mit `nurNeben` nur die
 * außerhalb der FOLGE (Jahrmarkt an Crossroads). Die Rückkehr braucht alle Nachbarn: Der letzte
 * Schritt von capitalArena.verloreneSeiten verlangt die Seitenabgabe auf dem Weg davor.
 */
function nachbarorte(welt, orte, nurNeben = false) {
  const angrenzend = new Set();
  for (const o of welt.orte) {
    for (const a of o.ausloeser || []) {
      const ziel = a.ziel && welt.karteZuOrt[a.ziel.karte];
      if (!ziel || ziel.kennung === o.kennung) continue;
      if (orte.includes(o.kennung)) angrenzend.add(ziel.kennung);
      if (orte.includes(ziel.kennung)) angrenzend.add(o.kennung);
    }
  }
  return [...angrenzend].filter((k) => {
    const o = welt.orte.find((x) => x.kennung === k);
    return o && o.art !== "erinnerung" && !(nurNeben && FOLGE.includes(k));
  });
}

/** Angrenzende Orte außerhalb der FOLGE (zum Gebiet beim Erkunden). */
function nebenorte(welt, orte) {
  return nachbarorte(welt, orte, true);
}

/** Bleibt bis zu `schritte` Schritte in den Zielorten; endet, wenn `fertig()` gilt. */
function bleibe(welt, st, h, start, schritte, fertig) {
  for (let n = 0; n < schritte && !fertig(); n++) {
    // Wer doch hinausgerät (etwa durch einen Dialog), reist zurück.
    if (!h.imZiel(welt, st, st.karte)) betrete(welt, st, start);
    const drinnen = h
      .besucheKarte(welt, st)
      .filter((w) => h.imZiel(welt, st, w.ziel?.karte));
    h.waehleWeg(welt, st, drinnen, n + 1e6);
    if (n % NEUER_VERSUCH_ALLE === 0)
      for (const k of Object.keys(st.versuche))
        st.versuche[k] = VERSUCHE_JE_ZUSTAND - 1;
  }
}

/** Mit der Monatskarte zu jedem Ort mit offener Quest, bis sie fertig ist; gibt die Ziele zurück. */
function rueckkehr(welt, st, frist, h) {
  const ziele = [];
  for (let runde = 0; runde < 3; runde++)
    for (const q of welt.quests) {
      const s = st.staende.find((x) => x.k === q.kennung);
      const ort = welt.orte.find((x) => x.kennung === q.ort);
      // Auch Wege: Odette (finchJagd) wartet auf dem Weg, bis alle Figuren gefunden sind.
      if (!s || s.fertig || !ort || Date.now() > frist) continue;
      ziele.push(q.ort);
      st.zielOrte = new Set([q.ort, ...nachbarorte(welt, [q.ort])]);
      betrete(welt, st, ort.karten[0].kennung);
      // Quests mit mehreren Partien (drei Sets Schach960) brauchen je Partie mehrere Anläufe.
      bleibe(
        welt,
        st,
        h,
        ort.karten[0].kennung,
        RUECKKEHR_SCHRITTE,
        () => s.fertig,
      );
    }
  st.zielOrte = null;
  return [...new Set(ziele)];
}

/**
 * Nie besuchte Orte nachholen: auf die Karte eines besuchten Ortes, von der ein Übergang hineinführt,
 * und dort bleiben, bis der Ort betreten ist (dann noch einmal so lange zum Erkunden).
 * Beispiel: Bayou über port-delacroix-aussen, Übergang „bayou“ mit wenn bayouOffen.
 */
function nachholen(welt, st, frist, h) {
  const geholt = [];
  for (const ziel of welt.orte) {
    if (
      st.besucht.has(ziel.kennung) ||
      ziel.art === "erinnerung" ||
      Date.now() > frist
    )
      continue;
    const quelle = welt.orte
      .filter((o) => st.besucht.has(o.kennung))
      .flatMap((o) => (o.ausloeser || []).map((a) => ({ o, a })))
      .find(
        ({ a }) =>
          a.ziel && welt.karteZuOrt[a.ziel.karte]?.kennung === ziel.kennung,
      );
    if (!quelle) continue;
    const start = quelle.a.karte || quelle.o.karten[0].kennung;
    st.zielOrte = new Set([ziel.kennung, quelle.o.kennung]);
    betrete(welt, st, start);
    bleibe(welt, st, h, start, NACHHOLEN_SCHRITTE, () =>
      st.besucht.has(ziel.kennung),
    );
    if (!st.besucht.has(ziel.kennung)) continue;
    geholt.push(ziel.kennung);
    st.zielOrte = new Set([ziel.kennung, ...nebenorte(welt, [ziel.kennung])]);
    bleibe(
      welt,
      st,
      h,
      ziel.karten[0].kennung,
      NACHHOLEN_SCHRITTE,
      () => false,
    );
  }
  st.zielOrte = null;
  return geholt;
}

module.exports = { nebenorte, rueckkehr, nachholen };
