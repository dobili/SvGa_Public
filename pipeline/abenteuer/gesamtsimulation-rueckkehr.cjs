// Gesamtsimulation, letzter Teil: Rückkehr zu offenen Quests und Nachholen nie besuchter Orte.
//
// Warum: Nach dem Erkunden der FOLGE fehlten Nebenorte (Jahrmarkt, nur über Crossroads) und das
// Bayou (nur über Port Delacroix, die Simulation stand da schon in Capital Arena). Der Spieler
// reist in der App mit der Monatskarte (oberwelt/Reisen.tsx) in jede besuchte Stadt; so auch hier.
// Ziele sind ein Ort samt angrenzenden Nebenorten (Orte außerhalb der FOLGE, Vorschlag mittel-3),
// damit eine Quest in Crossroads ihren Schritt auf dem Jahrmarkt erreicht.
// Die Schritte (besucheKarte, waehleWeg, imZiel) kommen aus gesamtsimulation.cjs.
"use strict";
const { warte } = require("./gesamtsimulation-uhr.cjs");

/** Läuft die Simulation mit Uhr (SIM_STUNDE)? */
const mitUhr = (st) => st.stunde !== null && st.stunde !== undefined;

const {
  FOLGE,
  VERSUCHE_JE_ZUSTAND,
  betrete,
  gilt,
  gross,
} = require("./gesamtsimulation-regeln.cjs");
const { straenge } = require("./gesamtsimulation-sammlung.cjs");

const RUECKKEHR_SCHRITTE = 6000;
const NACHHOLEN_SCHRITTE = 1500;
const NEUER_VERSUCH_ALLE = 200;
const DRAUSSEN_SCHRITTE = 40;
const SAMMEL_SCHRITTE = 400;

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
    // Wer doch hinausgerät (etwa durch einen Dialog), reist zurück; zu Fuß geht er weiter. Mit
    // echten Preisen (Chaos-Prüfung) bleibt er erst eine Weile dort: Oma Ruths Heimfahrt führt zu
    // Mama in Maple Falls, danach geht es mit der Monatskarte zurück nach Ironwood.
    const draussen = !st.zuFuss && !h.imZiel(welt, st, st.karte);
    st.draussen = draussen ? (st.draussen || 0) + 1 : 0;
    if (draussen && (!st.echt || st.draussen > DRAUSSEN_SCHRITTE)) {
      st.draussen = 0;
      betrete(welt, st, start);
    }
    const drinnen = h
      .besucheKarte(welt, st)
      .filter((w) => st.zuFuss || h.imZiel(welt, st, w.ziel?.karte));
    h.waehleWeg(welt, st, drinnen, n + 1e6);
    if (n % NEUER_VERSUCH_ALLE === 0) {
      for (const k of Object.keys(st.versuche))
        st.versuche[k] = VERSUCHE_JE_ZUSTAND - 1;
      // Mit Uhr wartet der Spieler auch hier bis zur nächsten Phase (gesamtsimulation-uhr.cjs).
      warte(st);
    }
  }
}

/**
 * Hin zur Startkarte: mit der Monatskarte (oder ohne echte Preise, wie bisher) sofort; mit echten
 * Preisen ohne Monatskarte (Chaos-Prüfung) zu Fuß, die Suche läuft dann durch alle Orte.
 * Vereinfachung: Die Schnellreise der App führt nur in Städte, hier auf jede Karte.
 */
function hin(welt, st, karte) {
  st.zuFuss = st.echt && !st.besitz.has("monatskarte");
  if (!st.zuFuss) betrete(welt, st, karte);
}

/** Alle Voraussetzungen einer Quest sind erledigt (Beispiel: mapleFalls.epilog nach der Meisterschaft). */
function bereit(st, q) {
  return (q.voraussetzung || []).every((k) =>
    st.staende.some((x) => x.k === k && x.fertig),
  );
}

/**
 * Ort des Auslösers, der den Dialogknoten „datei.knoten“ öffnet (Fundstelle eines Stücks); sonst der
 * Ort mit einem Auslöser derselben Ink-Datei (kreidespringer_geloest folgt auf kreide1).
 */
function fundort(welt, knoten) {
  const datei = knoten.split(".")[0] + ".";
  const mit = (passt) =>
    welt.orte.find((o) => (o.ausloeser || []).some((a) => passt(a.dialog)));
  return (
    mit((d) => d === knoten) || mit((d) => Boolean(d && d.startsWith(datei)))
  );
}

/**
 * Fehlende Stücke der Sammelstränge holen (Finch-Figuren, Buchseiten, Spuren): je Stück in seinen
 * Ort und dort bleiben, bis der Fund im Stand steht.
 * Warum: Odette und der Wanderer warten auf alle Stücke, die Rückkehr ging aber nur zu ihnen. Lief
 * der Chaos-Spieler durch die Hochebene, ohne die Schule ganz abzusuchen, ging der gründliche
 * Spieler danach weiter vorn weiter, und die Finch-Jagd hing mit 14 von 15 Figuren (Startwert 3,
 * 14.11.2026). Ein Mensch geht zurück; Odettes Hinweis nennt ihm das Versteck. Hinein geht es über
 * die erste Karte des Ortes, wie bei der Rückkehr, damit der Weg zur Fundstelle mitgeprüft wird.
 */
function sammeln(welt, st, frist, h) {
  for (const stuecke of Object.values(straenge()))
    for (const { knoten, fund } of stuecke) {
      const gefunden = () => Boolean(st.vars["gefunden" + gross(fund)]);
      const ort = fundort(welt, knoten);
      if (gefunden() || !ort || Date.now() > frist) continue;
      st.zielOrte = new Set([ort.kennung]);
      const start = ort.karten[0].kennung;
      hin(welt, st, start);
      bleibe(welt, st, h, start, SAMMEL_SCHRITTE, gefunden);
    }
}

/**
 * Karte des ersten Umwegs, der für den laufenden Schritt gerade gilt (quests.json, `umwege`), oder
 * null: Der Spieler folgt dem Pfeil. Beispiel: Mamas Partie in Ironwood, aber Mama ist noch zu Hause
 * (nicht mamaInKantine) → hin ins Wohnzimmer in Maple Falls (Lauf um 22 Uhr, 22.11.2026).
 */
function umwegkarte(st, q, s) {
  const schritt = s && q.schritte[s.i];
  const umweg = (schritt?.umwege || []).find((u) => gilt(st, u.wenn));
  return umweg ? umweg.ziel.karte : null;
}

/**
 * Mit der Monatskarte zu jedem Ort mit offener Quest, bis sie fertig ist; gibt die Ziele zurück.
 * Mit `nur` (Menge von Quest-Kennungen) nur zu diesen Quests.
 */
function rueckkehr(welt, st, frist, h, nur = null) {
  const ziele = [];
  for (let runde = 0; runde < 3; runde++) {
    if (!nur) sammeln(welt, st, frist, h);
    for (const q of welt.quests) {
      // `nur`: nur diese Quests (schneller Chaos-Test, gesamtsimulation-chaos.cjs).
      if (nur && !nur.has(q.kennung)) continue;
      const s = st.staende.find((x) => x.k === q.kennung);
      const ort = welt.orte.find((x) => x.kennung === q.ort);
      // Auch Wege: Odette (finchJagd) wartet auf dem Weg, bis alle Figuren gefunden sind. Eine
      // Hauptquest, die nach dem Abspann beginnt (Epilog auf dem Dachboden), zählt mit, sobald ihre
      // Voraussetzungen erledigt sind.
      if ((s && s.fertig) || !ort || Date.now() > frist) continue;
      // Mit Uhr auch Nebenquests, die noch nicht begonnen sind: Wer sie anstößt, stand beim
      // Vorbeigehen vielleicht anderswo (die Bläserin sitzt nachts in der Turnhalle, Lauf um 22 Uhr).
      // Ein Spieler kommt zu einer anderen Tageszeit wieder; kürzer, bis die Quest begonnen ist.
      const spaeter = !s && !q.haupt && mitUhr(st);
      if (!s && !(q.haupt && bereit(st, q)) && !spaeter) continue;
      if (!spaeter) ziele.push(q.ort);
      const umweg = umwegkarte(st, q, s);
      st.zielOrte = new Set([q.ort, ...nachbarorte(welt, [q.ort])]);
      if (umweg) st.zielOrte.add(welt.karteZuOrt[umweg]?.kennung);
      // Die Startkarte nur, wenn sie im Zielort liegt: Finch-Jagd und verlorene Seiten beginnen
      // auf der Landstraße bei Maple Falls, ihre Schritte liegen aber auf Weg 12 und in Capital.
      const imOrt =
        q.start?.karte && welt.karteZuOrt[q.start.karte]?.kennung === q.ort;
      const startkarte =
        umweg || (imOrt ? q.start.karte : ort.karten[0].kennung);
      hin(welt, st, startkarte);
      // Quests mit mehreren Partien (drei Sets Schach960) brauchen je Partie mehrere Anläufe.
      // st.rueckkehrSchritte: kürzer in der Chaos-Prüfung, damit 200 Läufe in die Zeit passen.
      bleibe(
        welt,
        st,
        h,
        startkarte,
        spaeter ? NACHHOLEN_SCHRITTE : st.rueckkehrSchritte || RUECKKEHR_SCHRITTE,
        () =>
          st.staende.some((x) => x.k === q.kennung && (x.fertig || spaeter)),
      );
    }
  }
  st.zielOrte = null;
  st.zuFuss = false;
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
    hin(welt, st, start);
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
  st.zuFuss = false;
  return geholt;
}

// hin, bleibe, bereit: auch für den Aufschieber (questverfehlen-aufschieber.cjs).
module.exports = { nachbarorte, nebenorte, rueckkehr, nachholen, fundort, hin, bleibe, bereit };
