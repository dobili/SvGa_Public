// Gesamtsimulation, Bericht und Urteil (aus gesamtsimulation.cjs ausgelagert, Größengrenze 400 Zeilen):
// offene Quests, nie erreichte Knoten, Figuren ohne Karte und ob der Lauf in einer Sackgasse endet.
// Gebraucht vom gründlichen Durchlauf und von der Chaos-Prüfung (gesamtsimulation-chaos.cjs).
"use strict";

/**
 * Hilfskarten (karten.json), die der Lauf weder geschenkt bekam (Dialog, Quest) noch in einem
 * besuchten Laden hätte kaufen können (RO11, 15.11.2026: jede Karte ist im Spiel erreichbar).
 * Beispiel: Ist „sanduhr“ nur im Post-Game zu haben und der Lauf endet vorher, steht sie hier.
 */
function kartenOhneWeg(welt, st) {
  const laeden = new Set(
    st.zeitachse.filter((e) => e.art === "laden").map((e) => e.laden),
  );
  const kaufbar = new Set(
    welt.laeden
      .filter((l) => laeden.has(l.kennung))
      .flatMap((l) => l.angebot.map((w) => w.kennung)),
  );
  return Object.keys(welt.karten).filter(
    (k) => !st.karten[k] && !kaufbar.has(k),
  );
}

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
  zeilen.push(`Hilfskarten ohne Weg: ${kartenOhneWeg(welt, st).join(", ") || "keine"}`);
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

module.exports = { bericht, sackgasse };
