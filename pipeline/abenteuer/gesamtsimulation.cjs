// Gesamtsimulation des Schach-Abenteuers: ein Spieler, der vom Dachboden in Maple Falls bis zum
// Abspann alles anfasst, und eine Liste der Sackgassen.
//
// Zweck: Jeder Umbau an Dialogen (inhalte/abenteuer/dialoge/de/*.ink), Quests, Orten oder Karten
// soll gegen Sackgassen geprüft werden: Quests, die nie fertig werden, ein fehlender Abspann,
// Knoten ohne Einstieg, Figuren, die auf keiner gezeichneten Karte stehen.
// Warum ein Simulator statt einzelner Tests: Sackgassen entstehen aus der Reihenfolge (etwa Mama
// vor Ambrose), und die zeigt nur ein ganzer Durchlauf.
//
// Aufruf aus dem Hauptordner:
//   node pipeline/abenteuer/gesamtsimulation.cjs --startwert 1 [--sekunden 300] [--ersatz a.b,c.d]
// --startwert: Startwert des Zufalls für die Wahlen in Dialogen (wiederholbar).
// --sekunden: Zeitbudget, danach wird der Bericht trotzdem geschrieben.
// --ersatz: bekannte Figuren ohne Karte, die ersatzweise auf die Karte ihrer Dialogdatei gesetzt
//   werden (nur für den Test, bis die Karten sie haben).
// --wirtschaft: statt des Berichts die Auswertung der Wirtschaft je Ort für einen sparsamen und
//   einen verschwenderischen Spieler (gesamtsimulation-wirtschaft.cjs); --startwerte 1,2,3,4 legt
//   die Durchläufe fest.
//
// Ausgabe: hängende und nie begonnene Quests, nie erreichte Knoten, Figuren ohne Karte, nie
// besuchte Orte. Rückgabewert 1, wenn eine Hauptquest nicht fertig wird, eine begonnene Quest
// hängt, der Abspann fehlt oder Daten fehlen (Dialog, Knoten, Karte, Begegnung); sonst 0.
//
// Regeln wie in der App (app/src/abenteuer/oberwelt/Oberwelt.tsx, regeln/quests.ts,
// regeln/dialogvariablen.ts): Ein Knoten wird gemeldet, sobald eine Zeile in ihm steht; Quests
// laufen streng der Reihe nach; Übergänge mit Dialog prüfen `wenn` nach dem Dialog, ohne Dialog
// gelten sie sofort; was die Hülle während eines Dialogs setzt, gewinnt gegen Ink. Jede Begegnung
// läuft abgebrochen, niederlage, remis, sieg und danach immer sieg; jede Runde ist erst nicht
// bestanden, dann bestanden; Läden geben ihre Gegenstände her.
// Der Spieler geht die Gebiete in der Reihenfolge der Story-Bibel ab, fasst in jedem Gebiet alles
// an, bis sich nichts mehr ändert, und reist am Ende mit der Monatskarte zu offenen Quests zurück.
"use strict";
const {
  MUENZEN_ERSTE_NADEL,
  ladeWelt,
  figurenOhneKarte,
  neuerStand,
  zustand,
  dialog,
  wendeFolgenAn,
  betrete,
  ausloeserFuer,
  melde,
  FOLGE,
  VERSUCHE_JE_ZUSTAND,
  RUHE_NEUER_VERSUCH,
  RUHE_TAKT,
  RUHE_NAECHSTES_GEBIET,
  RUHE_ENDE,
  gilt,
} = require("./gesamtsimulation-regeln.cjs");
const { berichtWirtschaft } = require("./gesamtsimulation-wirtschaft.cjs");
const {
  nebenorte,
  rueckkehr,
  nachholen,
} = require("./gesamtsimulation-rueckkehr.cjs");

// ---------------------------------------------------------------- Aufruf

/** Liest --startwert, --sekunden, --ersatz, --wirtschaft, --startwerte aus der Befehlszeile. */
function argumente(liste) {
  const wert = (name, vorgabe) => {
    const i = liste.indexOf(name);
    return i >= 0 && liste[i + 1] !== undefined ? liste[i + 1] : vorgabe;
  };
  return {
    startwert: Number(wert("--startwert", "1")),
    sekunden: Number(wert("--sekunden", "300")),
    ersatz: wert("--ersatz", "").split(",").filter(Boolean),
    wirtschaft: liste.includes("--wirtschaft"),
    startwerte: wert("--startwerte", "1,2,3,4").split(",").map(Number),
  };
}

// ---------------------------------------------------------------- Erkunden

/**
 * Darf der Spieler in diesen Ort? Zu Fuß überall bis zum aktuellen Gebiet; mit einer Reise (Bus,
 * Zug) nur ins aktuelle Gebiet und das davor, sonst irrt er zwischen alten Städten umher.
 */
function erlaubt(welt, st, ort, reise = false) {
  const o = welt.orte.find((x) => x.kennung === ort);
  const hier = welt.karteZuOrt[st.karte];
  if (
    !o ||
    o.art === "erinnerung" ||
    hier.art === "erinnerung" ||
    ort === hier.kennung
  )
    return true;
  if (st.phase === FOLGE.length - 1) return true;
  const i = FOLGE.indexOf(ort);
  return i <= st.phase && (!reise || i >= st.phase - 1);
}

/** Eine Reise aus einem Dialog nur in erlaubte Orte, und nur in Ruhe oder ins neue Gebiet. */
function reiseErlaubtFuer(welt, st) {
  return (karte) => {
    const ort = welt.karteZuOrt[karte];
    if (!ort || !erlaubt(welt, st, ort.kennung, true)) return false;
    return (
      st.ruhe > RUHE_NEUER_VERSUCH ||
      FOLGE.indexOf(ort.kennung) === st.phase ||
      ort.art === "erinnerung"
    );
  };
}

/** Fasst auf der aktuellen Karte alles an, außer Übergängen; gibt die Übergänge zurück. */
function besucheKarte(welt, st) {
  const ort = welt.karteZuOrt[st.karte],
    hier = st.karte,
    wege = [];
  let jetzt = zustand(st);
  for (const o of welt.objekte[hier]) {
    if (st.karte !== hier) return [];
    const a = ausloeserFuer(ort, hier, o.name);
    if (a && a.art === "uebergang") {
      wege.push(a);
      continue;
    }
    const schl = hier + "." + o.name,
      gleich = st.letzteSig[schl] === jetzt;
    if (gleich && (st.versuche[schl] || 0) >= VERSUCHE_JE_ZUSTAND) continue;
    st.letzteSig[schl] = jetzt;
    st.versuche[schl] = gleich ? (st.versuche[schl] || 0) + 1 : 1;
    if (!fasseAn(welt, st, ort, hier, o, a)) continue;
    jetzt = zustand(st);
  }
  return st.karte === hier ? wege : [];
}

/** Spricht eine Figur an oder löst einen Auslöser aus; false, wenn nichts geschah. */
function fasseAn(welt, st, ort, hier, o, a) {
  const figur = ort.figuren.find(
    (f) => f.kennung === ort.kennung + "." + o.name,
  );
  if (figur) {
    wendeFolgenAn(
      welt,
      st,
      dialog(welt, st, figur.dialog),
      null,
      reiseErlaubtFuer(welt, st),
    );
    return true;
  }
  if (!a) {
    if (o.name !== "start")
      st.meldungen.add(`Objekt ohne Eintrag in orte.json: ${hier}.${o.name}`);
    return false;
  }
  if (a.art === "start") return false;
  melde(welt, st, { art: "ort", karte: hier, ausloeser: a.name });
  if (a.dialog)
    wendeFolgenAn(
      welt,
      st,
      dialog(welt, st, a.dialog),
      null,
      reiseErlaubtFuer(welt, st),
    );
  return true;
}

/** Übergänge, die von einer Karte wegführen (Objekt auf der Karte und Eintrag in orte.json). */
function wegeVon(welt, karte) {
  const ort = welt.karteZuOrt[karte];
  return welt.objekte[karte]
    .map((o) => ausloeserFuer(ort, karte, o.name))
    .filter((a) => a && a.art === "uebergang" && a.ziel);
}

/** Bei Rückkehr und Nachholen bleibt die Suche in den Zielorten und ihren Erinnerungen. */
function imZiel(welt, st, karte) {
  const o = welt.karteZuOrt[karte];
  return Boolean(o && (st.zielOrte?.has(o.kennung) || o.art === "erinnerung"));
}

/** Erster Übergang zu jeder erreichbaren Karte (Breitensuche über offene, erlaubte Wege). */
function ersteSchritte(welt, st) {
  // Ein Weg mit Dialog kann seine Bedingung selbst setzen (etwa das Abzeichen im Saloon): versuchen,
  // bis er im selben Zustand gesperrt war.
  const sig = zustand(st);
  const offen = (a, k) =>
    gilt(st, a.wenn) || (a.dialog && st.gesperrt[k + "." + a.name] !== sig);
  const erster = {},
    schlange = [st.karte],
    gesehen = new Set([st.karte]);
  while (schlange.length) {
    const k = schlange.shift();
    for (const a of wegeVon(welt, k)) {
      const z = a.ziel.karte;
      if (
        gesehen.has(z) ||
        !offen(a, k) ||
        !erlaubt(welt, st, welt.karteZuOrt[z]?.kennung)
      )
        continue;
      if (st.zielOrte && !imZiel(welt, st, z)) continue;
      gesehen.add(z);
      erster[z] = k === st.karte ? a : erster[k];
      schlange.push(z);
    }
  }
  return erster;
}

/** Ziel: erreichbare Karte des Gebiets, zuerst unbesucht, sonst die am längsten nicht besuchte. */
function naechsterWeg(welt, st) {
  // Angrenzende Nebenorte (Jahrmarkt an Crossroads) gehören zum Gebiet.
  const folge = [FOLGE[st.phase], FOLGE[st.phase - 1]].filter(Boolean);
  const gebiet = st.zielOrte
    ? [...st.zielOrte]
    : [...folge, ...nebenorte(welt, folge)];
  const erster = ersteSchritte(welt, st);
  // Erinnerungen gehören zum Gebiet, aus dem man sie erreicht.
  const karten = welt.orte
    .filter((o) => gebiet.includes(o.kennung) || o.art === "erinnerung")
    .flatMap((o) => o.karten.map((k) => k.kennung))
    .filter((k) => erster[k]);
  if (!karten.length) return null;
  karten.sort((x, y) => (st.karteBesucht[x] || 0) - (st.karteBesucht[y] || 0));
  return erster[karten[0]];
}

/** Ein Schritt in Richtung Ziel; geht nichts, der am längsten nicht benutzte Weg der Karte. */
function waehleWeg(welt, st, wege, schritt) {
  let w = naechsterWeg(welt, st);
  const schl = (x) => st.karte + "." + x.name;
  if (!w) {
    const offen = wege.filter(
      (x) =>
        erlaubt(welt, st, welt.karteZuOrt[x.ziel?.karte]?.kennung) &&
        st.gesperrt[schl(x)] !== zustand(st),
    );
    if (!offen.length) return;
    offen.sort(
      (x, y) => (st.letzterWeg[schl(x)] || 0) - (st.letzterWeg[schl(y)] || 0),
    );
    w = offen[0];
  }
  st.letzterWeg[schl(w)] = schritt;
  melde(welt, st, { art: "ort", karte: st.karte, ausloeser: w.name });
  const vorher = st.karte;
  if (w.dialog)
    wendeFolgenAn(
      welt,
      st,
      dialog(welt, st, w.dialog),
      w,
      reiseErlaubtFuer(welt, st),
    );
  else betrete(welt, st, w.ziel.karte);
  if (st.karte === vorher) st.gesperrt[vorher + "." + w.name] = zustand(st);
}

/** Ruhe zählen; in Ruhe neue Versuche, dann das nächste Gebiet; false am Ende. */
function nachSchritt(st) {
  const sig = zustand(st);
  if (sig !== st.signatur) {
    st.ruhe = 0;
    st.signatur = sig;
    return true;
  }
  st.ruhe++;
  if (st.ruhe % RUHE_TAKT === RUHE_NEUER_VERSUCH)
    for (const n of Object.keys(st.versuche))
      st.versuche[n] = VERSUCHE_JE_ZUSTAND - 1;
  // Das nächste Gebiet erst, wenn der Spieler im aktuellen angekommen ist.
  const dort =
    FOLGE.indexOf(st.letzterOrt) >= st.phase || st.besucht.has(FOLGE[st.phase]);
  if (st.ruhe >= RUHE_NAECHSTES_GEBIET && dort && st.phase < FOLGE.length - 1) {
    st.phase++;
    st.ruhe = 0;
  }
  return st.ruhe <= RUHE_ENDE;
}

function erkunde(welt, st, frist) {
  Object.assign(st, {
    phase: 0,
    ruhe: 0,
    signatur: "",
    letzteSig: {},
    versuche: {},
    letzterWeg: {},
    gesperrt: {},
  });
  betrete(welt, st, st.karte);
  for (let schritt = 1; Date.now() < frist; schritt++) {
    waehleWeg(welt, st, besucheKarte(welt, st), schritt);
    if (!nachSchritt(st)) return;
  }
  st.meldungen.add("Zeitbudget erreicht (der Lauf ist nicht zu Ende gekommen)");
}

/** Die Schritte für Rückkehr und Nachholen (gesamtsimulation-rueckkehr.cjs). */
const SCHRITTE = { besucheKarte, waehleWeg, imZiel };

// ---------------------------------------------------------------- Bericht

function bericht(welt, st, ohneKarte, rueck) {
  const zeilen = [
    `Abspann: ${st.abspann ? "ja" : "NEIN"}`,
    `Besuchte Orte: ${st.besucht.size}/${welt.orte.length}`,
  ];
  const offen = [];
  for (const q of welt.quests) {
    const s = st.staende.find((x) => x.k === q.kennung);
    if (s && s.fertig) continue;
    const text = !s
      ? "nie begonnen"
      : `hängt bei Schritt ${s.i} (${JSON.stringify(q.schritte[s.i].ereignis)})`;
    offen.push(
      `  ${q.haupt ? "Hauptquest" : "Nebenquest"} ${q.kennung}: ${text}`,
    );
  }
  zeilen.push("Offene Quests:", ...(offen.length ? offen : ["  keine"]));
  zeilen.push("Nie erreichte Knoten:");
  for (const [datei, ks] of Object.entries(welt.knoten)) {
    const nie = ks.filter((k) => !st.gesehen.has(datei + "." + k));
    if (nie.length) zeilen.push(`  ${datei}: ${nie.join(", ")}`);
  }
  zeilen.push(`Figuren ohne Karte: ${ohneKarte.join(", ") || "keine"}`);
  zeilen.push(
    `Rückkehr mit der Monatskarte nach: ${rueck.join(", ") || "keine"}`,
  );
  zeilen.push(
    `Nie besuchte Orte: ${
      welt.orte
        .filter((o) => !st.besucht.has(o.kennung))
        .map((o) => o.kennung)
        .join(", ") || "keine"
    }`,
  );
  zeilen.push(`Meldungen: ${[...st.meldungen].join("; ") || "keine"}`);
  return zeilen.join("\n");
}

/**
 * Sackgasse: eine Hauptquest nicht fertig, eine begonnene Quest hängt, kein Abspann oder fehlende
 * Daten. Nie begonnene Nebenquests zählen nicht (manche sind freiwillig, etwa die Feier in Ironwood).
 */
function sackgasse(welt, st) {
  const haengt = st.staende.some((s) => !s.fertig);
  const hauptOffen =
    haengt ||
    welt.quests.some(
      (q) => q.haupt && !st.staende.some((s) => s.k === q.kennung && s.fertig),
    );
  const datenFehlen = [...st.meldungen].some(
    (m) => !m.startsWith("Zeitbudget"),
  );
  return hauptOffen || !st.abspann || datenFehlen;
}

/** --wirtschaft: je Startwert ein Durchlauf, dann die Auswertung der Wirtschaft beider Spieler. */
function wirtschaft(welt, arg) {
  const zeitachsen = [];
  for (const startwert of arg.startwerte) {
    welt.geschichten = {};
    const st = neuerStand(startwert);
    const frist = Date.now() + arg.sekunden * 1000;
    erkunde(welt, st, frist);
    rueckkehr(welt, st, frist, SCHRITTE);
    zeitachsen.push(st.zeitachse);
  }
  console.log(berichtWirtschaft(welt, zeitachsen, MUENZEN_ERSTE_NADEL));
}

function hauptprogramm(liste) {
  const arg = argumente(liste);
  const welt = ladeWelt();
  if (arg.wirtschaft) return wirtschaft(welt, arg);
  const ohneKarte = figurenOhneKarte(welt, arg.ersatz);
  const st = neuerStand(arg.startwert);
  const frist = Date.now() + arg.sekunden * 1000;
  erkunde(welt, st, frist);
  const geholt = nachholen(welt, st, frist, SCHRITTE);
  const rueck = rueckkehr(welt, st, frist, SCHRITTE);
  console.log(bericht(welt, st, ohneKarte, rueck));
  console.log(`Nachgeholte Orte: ${geholt.join(", ") || "keine"}`);
  process.exitCode = sackgasse(welt, st) ? 1 : 0;
}

if (require.main === module) hauptprogramm(process.argv.slice(2));
