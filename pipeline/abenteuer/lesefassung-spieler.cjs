// Lesefassung, der Leser: ein neugieriger, freundlicher Spieler, der die Gesamtsimulation
// (gesamtsimulation.cjs) durchläuft und dabei jeden Dialog mitschreibt.
//
// Zweck: Die Lesefassung (lesefassung.cjs) soll die Geschichte so zeigen, wie ein normaler Spieler
// sie erlebt. Dafür braucht der Durchlauf feste Entscheidungen statt Zufall und ein Protokoll.
// Warum hier und nicht in der Simulation: Die Simulation prüft Sackgassen und wählt dafür zufällig;
// sie bekommt nur den Haken `st.leser` (gesamtsimulation-dialoge.cjs) und bleibt sonst unverändert.
// Partien und Aufgaben entscheidet der Leser über `st.chaos`, die Stelle, an der die Simulation
// schon bisher einen Spieler nach Ausgang und Bestehen fragt.
"use strict";
const fs = require("fs");
const path = require("path");
const { zufall, variablenname } = require("./gesamtsimulation-regeln.cjs");

const DIALOGE = path.join(
  __dirname,
  "..",
  "..",
  "inhalte",
  "abenteuer",
  "dialoge",
  "de",
);

/**
 * Begegnungen, in denen die Geschichte beim ersten Mal keinen Sieg vorsieht (Story-Bibel, Szene 12:
 * Die Niederlage gegen Victor in Maple Falls ist „der Normalfall“ und trägt Akt 1).
 */
const VORGESEHENER_AUSGANG = { "mapleFalls.victor": "niederlage" };

/**
 * Antworten, mit denen ein Spieler aufschiebt oder ablehnt („Nicht jetzt.“, „Später“). Der Leser
 * nimmt sie nur, wenn es keine andere gibt. Verglichen wird der Anfang der Antwort ohne
 * Anführungszeichen, in Kleinbuchstaben.
 */
const AUFSCHUB = [
  "nicht jetzt",
  "gleich",
  "noch nicht",
  "später",
  "ein andermal",
  "noch einen moment",
  "nach dem essen",
  "lieber nicht",
  "morgen",
  "bis morgen",
  "bis später",
  "ich bin zu müde",
  "vielleicht später",
  "weitergehen",
  "liegen lassen",
  "nichts fragen",
  "nicht hinsehen",
];
const NUR_GANZ = ["nein", "gehen", "hinausgehen"];
/** Größter Wert für den Startwert der Ink-Zufallsfolgen (wie inkjs: storySeed unter 100). */
const INK_SAAT_GRENZE = 100;

/**
 * Ob eine Antwort aufschiebt oder ablehnt.
 * Beispiel: „Nicht jetzt.“ (Coach Delgado bietet den Clubkampf an) → true; „Ich bin bereit.“ → false.
 */
function schiebtAuf(antwort) {
  const kern = antwort
    .toLowerCase()
    .replace(/[„“”"]/g, "")
    .replace(/[.!?…]+$/, "")
    .trim();
  return NUR_GANZ.includes(kern) || AUFSCHUB.some((a) => kern.startsWith(a));
}

/** Tags „name:wert“ als Objekt wie dialog/geschichte.ts (tagsAus); „pause“ ohne Wert wird „ja“. */
function tagsAus(tags) {
  const ergebnis = {};
  for (const tag of tags || []) {
    const trenner = tag.indexOf(":");
    if (trenner < 0) ergebnis[tag.trim()] = "ja";
    else ergebnis[tag.slice(0, trenner).trim()] = tag.slice(trenner + 1).trim();
  }
  return ergebnis;
}

/** Abbild der Queststände (Kennung → Schritt, fertig) zum Vergleichen vor und nach einem Dialog. */
function abbild(st) {
  return new Map(st.staende.map((s) => [s.k, { i: s.i, fertig: s.fertig }]));
}

/**
 * Was sich an den Quests zwischen zwei Abbildern geändert hat.
 * Ausgabe: Liste aus { quest, art: "begonnen" | "schritt" | "fertig", schritt } (Schritt ab 0).
 * Sonderfall: Springt eine Quest in einem Dialog um mehrere Schritte, steht jeder Schritt einzeln da.
 */
function questaenderungen(vorher, nachher) {
  const liste = [];
  for (const [k, neu] of nachher) {
    const alt = vorher.get(k);
    if (!alt) liste.push({ quest: k, art: "begonnen", schritt: 0 });
    for (let i = alt ? alt.i : 0; i < neu.i; i++)
      liste.push({ quest: k, art: "schritt", schritt: i });
    if (neu.fertig && !(alt && alt.fertig))
      liste.push({ quest: k, art: "fertig", schritt: neu.i });
  }
  return liste;
}

/**
 * Wie viele Siege die Dialoge gegen einen Gegner verlangen, sofern es mehr als einer ist: aus den
 * Bedingungen „siege<Begegnung> >= N“ der Ink-Dateien. Ausgabe: Map Variablenname → N.
 * Beispiel: Mr. Harlan schenkt seine Lupe nach drei Siegen (siegeRivertonHarlan >= 3).
 */
function verlangteSiege() {
  const verlangt = new Map();
  for (const datei of fs
    .readdirSync(DIALOGE)
    .filter((d) => d.endsWith(".ink"))) {
    const quelle = fs.readFileSync(path.join(DIALOGE, datei), "utf8");
    for (const [, name, zahl] of quelle.matchAll(/\bsiege(\w+) *>= *(\d+)/g))
      verlangt.set(name, Math.max(Number(zahl), verlangt.get(name) || 0));
  }
  return verlangt;
}

/**
 * Die Entscheidungen des Lesers bei Partien und Aufgaben (Form wie der Chaos-Spieler, `st.chaos`).
 * Regel: jede Partie gewonnen, jede Aufgabenrunde bestanden, jeweils beim ersten Versuch; nur wo
 * die Geschichte etwas anderes vorsieht (VORGESEHENER_AUSGANG), gilt das beim ersten Mal.
 * Eingaben: `geschafft` (Menge, wird gefüllt: „partie:…“ nach so vielen Siegen, wie die Dialoge
 * verlangen, meist einem; „runde:…“ nach dem Bestehen), `schreibe(folge)` hängt die Folge an den
 * zuletzt mitgeschriebenen Dialog.
 */
function entscheidungen(geschafft, schreibe) {
  const partien = {};
  const siege = {};
  const verlangt = verlangteSiege();
  return {
    dialogabbruch: () => null,
    ausgang(begegnung) {
      partien[begegnung] = (partien[begegnung] || 0) + 1;
      const vorgesehen = VORGESEHENER_AUSGANG[begegnung];
      const erste = partien[begegnung] === 1;
      const ausgang = erste && vorgesehen ? vorgesehen : "sieg";
      schreibe({ art: "partie", begegnung, ausgang, erneut: !erste });
      if (ausgang === "sieg") siege[begegnung] = (siege[begegnung] || 0) + 1;
      const genug = verlangt.get(variablenname(begegnung)) || 1;
      if (siege[begegnung] >= genug) geschafft.add("partie:" + begegnung);
      return ausgang;
    },
    bestanden(runde) {
      const erneut = geschafft.has("runde:" + runde);
      schreibe({ art: "runde", runde, bestanden: true, erneut });
      geschafft.add("runde:" + runde);
      return true;
    },
    kaufe: () => [],
  };
}

/**
 * Die Antwort des Lesers: die erste inhaltliche; steht dieselbe Auswahl wieder da, die nächste (wie
 * ein Spieler, der beim zweiten Gespräch die andere Frage stellt oder beim Rätsel die nächste Lösung
 * versucht). Aufschieben kommt erst, wenn nichts Inhaltliches da ist, eine Revanche gegen einen
 * schon besiegten Gegner (`revanchen`, gelernt in `merkeRevanche`) erst ganz zuletzt.
 * Eingaben: `merker` ({ zaehler, revanchen, erstwahl }), `datei`, `antworten` (Texte), `beginn`
 * (Startknoten des Gesprächs: Revanchen gelten je Figur oder Eingang, nicht je Datei; sonst mied der
 * Leser nach Mamas Partie in der Kantine auch Big Joes „Ich bin bereit.“, 20.11.2026).
 * Ausgabe: { index, erste }; `erste` sagt, ob diese Auswahl bisher immer so beantwortet wurde.
 * Beispiel: „Abgemacht.“ und „Ein andermal.“ (Skaterin Jo) → „Abgemacht.“; nach dem Sieg
 * „Revanche.“ und „Bis bald.“ → einmal „Revanche.“, danach „Bis bald.“.
 */
function naechsteAntwort(merker, datei, antworten, beginn = datei) {
  const alle = antworten.map((text, index) => ({ text, index }));
  const neu = alle.filter((a) => !merker.revanchen.has(beginn + "\n" + a.text));
  const inhaltlich = neu.filter((a) => !schiebtAuf(a.text));
  const moeglich = [inhaltlich, neu, alle].find((klasse) => klasse.length);
  const schluessel = datei + "\n" + antworten.join("\n");
  const n = merker.zaehler.get(schluessel) || 0;
  merker.zaehler.set(schluessel, n + 1);
  const index = moeglich[n % moeglich.length].index;
  if (!merker.erstwahl.has(schluessel)) merker.erstwahl.set(schluessel, index);
  return { index, erste: merker.erstwahl.get(schluessel) === index };
}

/**
 * Lernt Revanchen: Führte die letzte Antwort eines Dialogs in eine Partie oder Runde, die schon
 * (oft genug) gewonnen oder bestanden ist, gilt diese Antwort in Gesprächen mit demselben Startknoten künftig als Revanche.
 * Warum: Ein Spieler gewinnt den Clubkampf einmal; die Simulation nähme „Revanche um eine bessere
 * Nadel?“ sonst bei jedem Gespräch, und die Lesefassung bestünde aus Wiederholungspartien.
 */
function merkeRevanche(merker, geschafft, dialog, folgen) {
  const wahl = [...dialog.zeilen].reverse().find((z) => z.wahl !== undefined);
  if (!wahl) return;
  const ziele = [
    folgen.partie && "partie:" + folgen.partie,
    folgen.runde && "runde:" + folgen.runde,
    folgen.partieform && "runde:" + folgen.partieform,
  ].filter(Boolean);
  if (ziele.length && ziele.every((z) => geschafft.has(z)))
    merker.revanchen.add(dialog.knoten + "\n" + wahl.wahl);
}

/** Ein neuer, noch leerer Eintrag der Mitschrift für den Dialog ab `knoten`. */
function neuerEintrag(st, knoten, geschichte, davor) {
  return {
    karte: st.karte,
    knoten,
    zeilen: [],
    folgen: [],
    davor,
    danach: [],
    stand: abbild(st),
    zweitAb: null,
    geschichte,
    auswahlen: new Set(),
  };
}

/** Schließt einen Eintrag ab: besuchte Knoten, Queständerungen, Laden und Abspann als Folgen. */
function schliesse(welt, st, eintrag, folgen) {
  const datei = eintrag.knoten.split(".")[0];
  const zustand = eintrag.geschichte.state;
  eintrag.besucht = welt.knoten[datei]
    .filter((k) => zustand.VisitCountAtPathString(k) > 0)
    .map((k) => datei + "." + k);
  delete eintrag.geschichte;
  delete eintrag.auswahlen;
  eintrag.quests = questaenderungen(eintrag.stand, abbild(st));
  if (folgen.laden) eintrag.folgen.push({ art: "laden", laden: folgen.laden });
  if (folgen.abspann) eintrag.folgen.push({ art: "abspann" });
}

/**
 * Legt den Leser an und hängt ihn in den Stand (`st.leser`, `st.chaos`).
 * Eingaben: Welt und Stand der Simulation. Ausgabe: { dialoge, schliesseAb }; `dialoge` ist die
 * Mitschrift in Spielreihenfolge, je Dialog { karte, knoten, zeilen, folgen, davor, quests, danach,
 * stand, besucht (Knoten), zweitAb (Index der ersten Antwort, die anders ausfiel als beim ersten
 * Mal mit derselben Auswahl: ein Zweitgespräch; sonst null) }.
 * Beispiel: Der erste Eintrag mit dem Brett ist maple-falls-dachboden.dachboden_brett.
 * Nach einer Partie oder Runde öffnet die Simulation selbst die Rückmeldung (wie die App).
 * Sonderfall: Questschritte zwischen zwei Dialogen (Partieausgang, Betreten einer Karte) stehen in
 * `danach` des Dialogs davor, wenn er eine Partie oder Runde auslöste, sonst in `davor` des nächsten.
 */
function neuerLeser(welt, st) {
  const dialoge = [];
  const merker = {
    zaehler: new Map(),
    revanchen: new Set(),
    erstwahl: new Map(),
  };
  const geschafft = new Set();
  let offen = null;
  let letztes = abbild(st);
  const unterwegs = () => {
    const neu = questaenderungen(letztes, abbild(st));
    letztes = abbild(st);
    const davor = dialoge[dialoge.length - 1];
    if (!davor || !davor.folgen.length) return neu;
    davor.danach.push(...neu);
    return [];
  };
  st.chaos = entscheidungen(geschafft, (folge) => {
    if (dialoge.length) dialoge[dialoge.length - 1].folgen.push(folge);
  });
  st.leser = {
    beginn(knoten, geschichte) {
      // Ink würfelt wechselnde Sätze mit einem Startwert aus der Uhrzeit; hier aus dem Startwert.
      geschichte.state.storySeed = Math.floor(zufall(st) * INK_SAAT_GRENZE);
      offen = neuerEintrag(st, knoten, geschichte, unterwegs());
    },
    zeile(text, tags) {
      const sauber = text.trim();
      if (sauber) offen.zeilen.push({ text: sauber, tags: tagsAus(tags) });
    },
    waehle(antworten) {
      const datei = offen.knoten.split(".")[0];
      const { index, erste } = naechsteAntwort(
        merker,
        datei,
        antworten,
        offen.knoten,
      );
      // Kehrt dieselbe Auswahl im selben Dialog wieder (Schleife), ist die nächste Antwort normal.
      const schluessel = antworten.join("\n");
      if (!erste && !offen.auswahlen.has(schluessel) && offen.zweitAb === null)
        offen.zweitAb = offen.zeilen.length;
      offen.auswahlen.add(schluessel);
      const andere = antworten.filter((_, i) => i !== index);
      offen.zeilen.push({ wahl: antworten[index], andere });
      return index;
    },
    ende(knoten, folgen) {
      schliesse(welt, st, offen, folgen);
      merkeRevanche(merker, geschafft, offen, folgen);
      letztes = abbild(st);
      dialoge.push(offen);
    },
  };
  return { dialoge, schliesseAb: () => unterwegs() };
}

module.exports = { neuerLeser, schiebtAuf, VORGESEHENER_AUSGANG };
