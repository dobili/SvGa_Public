// Auswahl und Verdichtung für das Zusatzpaket des Abenteuers (skripte/baue-abenteuerpaket.mjs).
//
// Warum: Das Paket war nach dem großen Merge (10.11.2026) etwa 25 MB groß. Gut die Hälfte waren
// eingerückte Tiled-Karten (13 MB, kompakt knapp 6 MB), dazu Möbelbilder, die keine Karte
// benutzt (etwa 780 Bilder, 1,6 MB), und Hintergründe alter Dateinamen. Ins Paket kommt nur, was
// die App laden kann; die Quellen bleiben unverändert lesbar.

/**
 * Eine Tiled-Karte ohne Einrückung und ohne Felder, die die App nie liest (rotation 0 und
 * visible true an Objekten, Tiled schreibt sie überall). Beispiel: Prärie 367 KB → etwa 150 KB.
 */
export function kompakteKarte(text) {
  const karte = JSON.parse(text);
  for (const ebene of karte.layers ?? []) {
    for (const objekt of ebene.objects ?? []) {
      if (objekt.rotation === 0) delete objekt.rotation;
      if (objekt.visible === true) delete objekt.visible;
    }
  }
  return JSON.stringify(karte);
}

/** „karten/port-delacroix-musikhaus.json“ → „port-delacroix-musikhaus“ (wie oberwelt/kartenfassung.ts). */
function stamm(datei) {
  return datei.replace(/^karten\//, "").replace(/\.json$/, "");
}

/** Name eines Zustands hinter der Grundkarte, gleiche Regel wie zustandsname in kartenfassung.ts. */
function zustandsname(datei, basis) {
  const s = stamm(datei);
  const b = `${stamm(basis)}-`;
  return s.startsWith(b) && s.length > b.length ? s.slice(b.length) : s;
}

/**
 * Was die App aus orte.json laden kann: Kartendateien (Grundkarte und Zustände) und die Namen der
 * Hintergründe (<kennung>.png, <kennung>-<zustand>.png).
 * Beispiel: mapleFalls.wohnzimmer mit Zustand „ausgepackt“ → maple-falls-wohnzimmer.json,
 * maple-falls-wohnzimmer-ausgepackt.json, mapleFalls.wohnzimmer.png, mapleFalls.wohnzimmer-ausgepackt.png.
 */
export function ladbareKarten(orte) {
  const dateien = new Set();
  const hintergruende = new Set();
  for (const ort of orte.orte) {
    for (const karte of ort.karten) {
      dateien.add(`${stamm(karte.datei)}.json`);
      hintergruende.add(`${karte.kennung}.png`);
      for (const datei of Object.values(karte.zustaende ?? {})) {
        dateien.add(`${stamm(datei)}.json`);
        hintergruende.add(`${karte.kennung}-${zustandsname(datei, karte.datei)}.png`);
      }
    }
  }
  return { dateien, hintergruende };
}

/**
 * Die Möbel, die im Paket vorkommen: Ein Name zählt, wenn er als Wort in einer Karte, in den Daten
 * oder in einem Dialog steht (großzügig, damit kein Möbel fehlt, das ein Auslöser oder eine Sperre
 * nennt). Eingaben: alle Möbel (Name → Angabe), die Texte der Paketdateien. Ausgabe: gefiltertes
 * Objekt in derselben Reihenfolge.
 */
export function genutzteMoebel(moebel, texte) {
  const woerter = new Set();
  for (const text of texte)
    for (const wort of text.match(/[A-Za-z0-9_]+/g) ?? []) woerter.add(wort);
  return Object.fromEntries(Object.entries(moebel).filter(([name]) => woerter.has(name)));
}
