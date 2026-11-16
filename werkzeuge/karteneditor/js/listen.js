/*
 * Karteneditor – Listen: Kartenliste links (nach Ort gruppiert, Varianten B und C in einer eigenen
 * Gruppe, mit Suche) und Bibliothek rechts
 * (Kategorie und Unterkategorie, Vorschaubild, Name, Kurzbeschreibung, Suche, zuletzt benutzt).
 * Hinzufügen per Ziehen in die Karte oder per Klick (in die Mitte der Ansicht).
 */
"use strict";

(function (KE) {
  const TREFFER_HOECHSTENS = 200;

  function el(tag, klasse, text) {
    const e = document.createElement(tag);
    if (klasse) e.className = klasse;
    if (text !== undefined) e.textContent = text;
    return e;
  }
  KE.el = el;

  /** Öffnet eine Karte: Auswahl leeren, Ansicht einpassen. */
  KE.oeffne = function (datei) {
    const z = KE.zustand;
    z.datei = datei;
    z.auswahl.clear();
    KE.szene(datei);
    KE.einpassen();
    KE.zeichneKartenliste();
  };

  /** Die Kartenliste, gefiltert nach dem Suchfeld. */
  KE.zeichneKartenliste = function () {
    const z = KE.zustand;
    const ziel = document.getElementById("kartenliste");
    const suche = document.getElementById("kartensuche").value.trim().toLowerCase();
    ziel.replaceChildren();
    const gruppen = new Map();
    for (const e of z.daten.szenen) {
      const text = `${e.ortsname} ${e.kartenname} ${e.datei}`.toLowerCase();
      if (suche && !text.includes(suche)) continue;
      // Varianten B und C (szenen/varianten/) bilden eine eigene Gruppe „Varianten“ am Ende.
      const gruppe = e.gruppe || e.ortsname;
      if (!gruppen.has(gruppe)) gruppen.set(gruppe, []);
      gruppen.get(gruppe).push(e);
    }
    for (const [ort, eintraege] of gruppen) {
      const gruppe = el("details", "kartengruppe");
      gruppe.open = !!suche || eintraege.some((e) => e.datei === z.datei);
      gruppe.append(el("summary", "", `${ort} (${eintraege.length})`));
      for (const e of eintraege) {
        const knopf = el("button", "kartenknopf");
        knopf.dataset.datei = e.datei;
        knopf.title = e.datei;
        const stamm = e.datei.replace(/\.json$/, "").replace(/^varianten\//, "");
        knopf.append(el("span", "kartenname", e.kartenname), el("span", "dateiname", stamm));
        if (KE.istGeaendert(e.datei)) knopf.append(el("span", "geaendert", "●"));
        if (e.geschwister.length) knopf.append(el("span", "fassungen", `+${e.geschwister.length}`));
        if (e.datei === z.datei) knopf.classList.add("aktiv");
        knopf.addEventListener("click", () => KE.oeffne(e.datei));
        gruppe.append(knopf);
      }
      ziel.append(gruppe);
    }
  };

  /** Ein Eintrag der Bibliothek (ziehbar, Klick fügt in der Mitte der Ansicht ein). */
  function bibliothekseintrag(kennung) {
    const m = KE.zustand.daten.moebel[kennung];
    const zeile = el("div", "bibeintrag");
    zeile.draggable = true;
    zeile.dataset.kennung = kennung;
    zeile.title = `${kennung} · ${m.breite} × ${m.hoehe} px · ${m.ort}\n${m.kurz || ""}`;
    const text = el("div", "bibtext");
    text.append(el("div", "bibname", m.name), el("div", "bibkurz", m.kurz || m.unterkategorie));
    text.append(el("div", "bibkennung", `${kennung} · ${m.breite}×${m.hoehe}`));
    zeile.append(KE.vorschau(kennung, 40), text);
    zeile.addEventListener("dragstart", (e) => e.dataTransfer.setData("text/plain", kennung));
    zeile.addEventListener("click", () => {
      const [x, y] = KE.mitte();
      KE.fuegeEin(kennung, x, y);
    });
    return zeile;
  }

  function passt(kennung, m, suche) {
    if (!suche) return true;
    const text = `${kennung} ${m.name} ${m.kurz} ${m.kategorie} ${m.unterkategorie} ${m.ort} ${
      m.thema || ""
    }`.toLowerCase();
    return suche.split(/\s+/).every((wort) => text.includes(wort));
  }

  /** Die Bibliothek: bei Suche eine flache Trefferliste, sonst Kategorien zum Aufklappen. */
  KE.zeichneBibliothek = function () {
    const z = KE.zustand;
    const ziel = document.getElementById("bibliothek");
    const suche = document.getElementById("bibsuche").value.trim().toLowerCase();
    const nurUmgebung = document.getElementById("bibumgebung").checked;
    ziel.replaceChildren();
    const zuletzt = el("div", "zuletzt");
    zuletzt.append(el("div", "zwischentitel", "Zuletzt benutzt"));
    for (const k of z.zuletzt) zuletzt.append(bibliothekseintrag(k));
    if (z.zuletzt.length && !suche) ziel.append(zuletzt);
    const alle = Object.entries(z.daten.moebel).filter(
      ([k, m]) => passt(k, m, suche) && (!nurUmgebung || m.umgebung),
    );
    if (suche) {
      ziel.append(el("div", "zwischentitel", `${alle.length} Treffer`));
      for (const [k] of alle.slice(0, TREFFER_HOECHSTENS)) ziel.append(bibliothekseintrag(k));
      return;
    }
    const baum = new Map();
    for (const [k, m] of alle) {
      if (!baum.has(m.kategorie)) baum.set(m.kategorie, new Map());
      const unter = baum.get(m.kategorie);
      if (!unter.has(m.unterkategorie)) unter.set(m.unterkategorie, []);
      unter.get(m.unterkategorie).push(k);
    }
    for (const [kat, unter] of [...baum].sort((a, b) => a[0].localeCompare(b[0], "de"))) {
      const gruppe = el("details", "bibgruppe");
      const zahl = [...unter.values()].reduce((s, l) => s + l.length, 0);
      gruppe.append(el("summary", "", `${kat} (${zahl})`));
      for (const [name, kennungen] of [...unter].sort((a, b) => a[0].localeCompare(b[0], "de"))) {
        const ug = el("details", "bibuntergruppe");
        ug.append(el("summary", "", `${name} (${kennungen.length})`));
        // Erst beim Aufklappen füllen: Tausende Bilder auf einmal machen die Seite träge.
        ug.addEventListener("toggle", () => {
          if (ug.open && ug.children.length === 1)
            for (const k of kennungen) ug.append(bibliothekseintrag(k));
        });
        gruppe.append(ug);
      }
      ziel.append(gruppe);
    }
  };
})(window.KE);
