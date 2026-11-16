/*
 * Karteneditor – Zuschnitt im Bedienfeld und in der Bibliothek (Editor 1.5).
 *
 * Warum: Der Autor beschneidet Bilder (Wunsch des Autors, 16.11.2026; Regeln in zuschnitt.js) und
 * will einen Ausschnitt mehrfach setzen, etwa einen Pfosten aus einem Zaunstück. Das Bedienfeld
 * zeigt vier Zahlenfelder (Pixel des Katalogbilds, ± 1, mit Umschalt 16), den Modus „Zuschneiden“,
 * „Zuschnitt aufheben“ und „Als eigenes Bild merken“. Gemerkte Ausschnitte stehen in der Bibliothek
 * unter „Eigene Zuschnitte“ (nur in diesem Browser, localStorage) und werden mit ihrem Zuschnitt
 * eingefügt (Klick: Mitte der Ansicht, oder in die Karte ziehen).
 */
"use strict";

(function (KE) {
  const K = 16;
  const SPEICHER = "karteneditor-zuschnitte-v1";
  const ZIEHKENNUNG = "zuschnitt:";
  const SCHRITT_GROSS = 16;
  const el = (...a) => KE.el(...a);

  function knopf(text, titel, tu, klasse = "") {
    const k = el("button", klasse, text);
    k.title = titel;
    k.addEventListener("click", tu);
    return k;
  }

  /** Eine Zeile „links [−] [26] [+]“ für eine Bildseite. */
  function seitenzeile(q, wert) {
    const name = KE.ZUSCHNITTSEITEN[q];
    const feld = el("input");
    feld.type = "number";
    feld.min = "0";
    feld.step = "1";
    feld.value = String(wert);
    feld.id = `zuschnitt-${name}`;
    feld.addEventListener("change", () => KE.setzeZuschnitt(q, Number(feld.value) || 0));
    const reihe = el("div", "knopfreihe zuschnittreihe");
    const schritt = (e) => (e.shiftKey ? SCHRITT_GROSS : 1);
    reihe.append(
      el("span", "zuschnittname", name),
      knopf(
        "−",
        "1 Pixel weniger (Umschalt: 16)",
        (e) => KE.setzeZuschnitt(q, -schritt(e), true),
        `weniger-${name}`,
      ),
      feld,
      knopf(
        "+",
        "1 Pixel mehr (Umschalt: 16)",
        (e) => KE.setzeZuschnitt(q, schritt(e), true),
        `mehr-${name}`,
      ),
    );
    return reihe;
  }

  /** Bereich „Zuschnitt“ im Bedienfeld (panel.js), nur wenn Bilder ausgewählt sind. */
  KE.zuschnittfeld = function (ziel) {
    const ziele = KE.zuschnittZiele();
    if (!ziele.length) return;
    const e = ziele[0].eintrag;
    const angabe = KE.zustand.daten.moebel[e.moebel];
    const z = KE.zuschnittVon(e) || [0, 0, 0, 0];
    const b = angabe.breite - z[0] - z[2];
    const h = angabe.hoehe - z[1] - z[3];
    const box = el("div", "zuschnittfeld");
    const gleiche = ziele.length > 1 ? ` · gilt für ${ziele.length} gleiche Bilder` : "";
    box.append(
      el("div", "zwischentitel", "Zuschnitt"),
      el("div", "kurz", `${b} × ${h} von ${angabe.breite} × ${angabe.hoehe} px${gleiche}`),
    );
    for (let q = 0; q < 4; q++) box.append(seitenzeile(q, z[q]));
    const modus = KE.zustand.zuschnittModus;
    const reihe = el("div", "knopfreihe");
    reihe.append(
      knopf(
        modus ? "Fertig" : "Zuschneiden",
        "Kanten des Bildes ziehen (Alt: 16-px-Schritte)",
        () => KE.zuschneiden(),
        "zuschneiden" + (modus ? " an" : ""),
      ),
      knopf(
        "Zuschnitt aufheben",
        "Wieder das ganze Bild",
        () => KE.zuschnittAufheben(),
        "aufheben",
      ),
    );
    const merken = knopf(
      "Als eigenes Bild merken",
      "Diesen Ausschnitt in der Bibliothek unter „Eigene Zuschnitte“ ablegen",
      () => KE.merkeZuschnitt(e),
      "merken",
    );
    merken.disabled = !KE.zuschnittVon(e);
    box.append(reihe, merken);
    ziel.append(box);
  };

  /** Gemerkte Zuschnitte aus dem Browser: [{ moebel, zuschnitt, name }]. */
  function gemerkte() {
    try {
      const liste = JSON.parse(localStorage.getItem(SPEICHER) || "[]");
      return liste.filter((g) => KE.zustand.daten.moebel[g.moebel] && KE.zuschnittVon(g));
    } catch (fehler) {
      console.warn("Eigene Zuschnitte nicht lesbar", fehler);
      return [];
    }
  }

  function speichere(liste) {
    try {
      localStorage.setItem(SPEICHER, JSON.stringify(liste));
    } catch (fehler) {
      KE.status("Eigene Zuschnitte nicht gespeichert: " + fehler.message, true);
    }
  }

  /** „Als eigenes Bild merken“: der Ausschnitt dieses Objekts in die Bibliothek. */
  KE.merkeZuschnitt = function (e) {
    const z = KE.zuschnittVon(e);
    if (!z) return;
    const angabe = KE.zustand.daten.moebel[e.moebel];
    const b = angabe.breite - z[0] - z[2];
    const h = angabe.hoehe - z[1] - z[3];
    const liste = gemerkte().filter(
      (g) => !(g.moebel === e.moebel && g.zuschnitt.join() === z.join()),
    );
    liste.unshift({
      moebel: e.moebel,
      zuschnitt: z,
      name: `${angabe.name} (Ausschnitt ${b} × ${h})`,
    });
    speichere(liste);
    KE.zeichneBibliothek();
    KE.status(`Gemerkt: ${liste[0].name}. Steht in der Bibliothek unter „Eigene Zuschnitte“.`);
  };

  /** Fügt einen gemerkten Zuschnitt ein, mittig um den Punkt (Kartenpixel). */
  KE.fuegeZuschnittEin = function (g, px, py) {
    if (!KE.zustand.datei) return;
    const angabe = KE.zustand.daten.moebel[g.moebel];
    const z = KE.zuschnittVon(g);
    const b = angabe.breite - z[0] - z[2];
    const h = angabe.hoehe - z[1] - z[3];
    const eintrag = {
      moebel: g.moebel,
      feld: [Math.round((px - b / 2) / K), Math.round((py - h / 2) / K)],
      zuschnitt: z,
      _uid: KE.neueUid(),
    };
    KE.schritt("Zuschnitt einfügen", [KE.zustand.datei], () => {
      const szene = KE.szene();
      szene.objekte = szene.objekte || [];
      szene.objekte.push(eintrag);
      KE.zustand.auswahl = new Set([eintrag._uid]);
    });
  };

  /** Ablegen aus der Bibliothek (bedienung.js): true, wenn es ein eigener Zuschnitt war. */
  KE.legeZuschnittAb = function (kennung, px, py) {
    if (!kennung.startsWith(ZIEHKENNUNG)) return false;
    const g = gemerkte()[Number(kennung.slice(ZIEHKENNUNG.length))];
    if (g) KE.fuegeZuschnittEin(g, px, py);
    return true;
  };

  /** Kleines Vorschaubild nur des Ausschnitts. */
  function vorschau(g, groesse) {
    const angabe = KE.zustand.daten.moebel[g.moebel];
    const z = KE.zuschnittVon(g);
    const leinwand = document.createElement("canvas");
    leinwand.width = Math.max(1, angabe.breite - z[0] - z[2]);
    leinwand.height = Math.max(1, angabe.hoehe - z[1] - z[3]);
    leinwand.className = "vorschaubild";
    leinwand.style.maxWidth = leinwand.style.maxHeight = groesse + "px";
    const b = KE.bild(angabe.bild);
    const male = () => leinwand.getContext("2d").drawImage(b, -z[0], -z[1]);
    if (b && b.complete) male();
    else if (b) b.addEventListener("load", male, { once: true });
    return leinwand;
  }

  function eintragZeile(g, i, liste) {
    const zeile = el("div", "bibeintrag eigenerzuschnitt");
    zeile.draggable = true;
    zeile.title = `${g.moebel} · zuschnitt ${g.zuschnitt.join(", ")}`;
    const text = el("div", "bibtext");
    text.append(el("div", "bibname", g.name), el("div", "bibkennung", g.moebel));
    const weg = knopf("×", "Aus „Eigene Zuschnitte“ entfernen", (e) => {
      e.stopPropagation();
      speichere(liste.filter((_, j) => j !== i));
      KE.zeichneBibliothek();
    });
    zeile.append(vorschau(g, 40), text, weg);
    zeile.addEventListener("dragstart", (e) =>
      e.dataTransfer.setData("text/plain", ZIEHKENNUNG + i),
    );
    zeile.addEventListener("click", () => KE.fuegeZuschnittEin(g, ...KE.mitte()));
    return zeile;
  }

  /** Bibliothek (listen.js) mit dem Abschnitt „Eigene Zuschnitte“ ganz oben. */
  const bibliothekOhne = KE.zeichneBibliothek;
  KE.zeichneBibliothek = function () {
    bibliothekOhne();
    const liste = gemerkte();
    const suche = document.getElementById("bibsuche").value.trim().toLowerCase();
    const passend = liste
      .map((g, i) => [g, i])
      .filter(([g]) => !suche || `${g.name} ${g.moebel}`.toLowerCase().includes(suche));
    if (!passend.length) return;
    const abschnitt = el("div", "eigenezuschnitte");
    abschnitt.append(el("div", "zwischentitel", "Eigene Zuschnitte"));
    for (const [g, i] of passend) abschnitt.append(eintragZeile(g, i, liste));
    document.getElementById("bibliothek").prepend(abschnitt);
  };
})(window.KE);
