/*
 * Karteneditor – Kollision je Objekt: Schalter „Sperrt / Durchgehbar“ mit Grund, Bearbeiten der
 * Sperrmaske Kachel für Kachel und „Zurück zum Katalog“.
 *
 * Warum: Der Autor will festlegen, ob man durch ein Bild hindurchgehen kann oder ob es wie eine
 * Wand sperrt, und das nur an dieser Stelle (Wunsch des Autors, 16.11.2026). Die Szene speichert
 * das in drei Feldern am Objekt (pipeline/abenteuer/objektkollision.py): `kollision` (true/false),
 * `maske` (je Kachelreihe „#“ sperrt, „.“ frei; im Raster des ungedrehten Bildes, Drehung und
 * Spiegelung wirken darauf wie auf die Katalogmaske) und `begehbar_grund` (Pflicht, wenn ein
 * nicht flaches Möbel an dieser Stelle durchgehbar wird, Regel 10.69). Jede Änderung ist ein
 * Schritt im Verlauf (Rückgängig).
 * Fein (Editor 1.6, Taste F): Die Maske wird in Zellen von 4 Pixeln gemalt und als `maske_fein`
 * gespeichert (je Kachel 4 Zeichen und 4 Zeilen, ungedreht wie `maske`, fein.js). Ziehen malt mit
 * dem Wert der ersten Zelle weiter, Umschalt+Ziehen setzt ein Rechteck. Ist jede Kachel einheitlich,
 * schreibt der Editor wie bisher die grobe `maske`.
 */
"use strict";

(function (KE) {
  const K = 16;
  const FELDER = ["kollision", "maske", "maske_fein", "begehbar_grund"];
  const Z = 4; // Zellen je Kachelkante (fein.js)
  const ZP = K / Z;
  const FARBE_FREI = "rgba(40, 200, 90, 0.35)";
  const FARBE_GESPERRT = "rgba(230, 40, 40, 0.5)";
  const el = (...a) => KE.el(...a);

  const objekte = () => KE.ausgewaehlt().filter((t) => t.liste === "objekte");
  const katalog = (e) => KE.zustand.daten.moebel[e.moebel] || {};
  const stueck = (uid) => KE.platziere(KE.szene()).find((s) => s.uid === uid);

  /** Ob ein Objekt an seiner Stelle ganz durchgehbar ist (objektkollision.durchgehbar). */
  KE.istDurchgehbar = function (e) {
    if (!KE.kollisionAn(katalog(e), e)) return true;
    const maske = e.maske_fein || e.maske;
    return Array.isArray(maske) && !maske.some((z) => z.includes("#"));
  };

  /** Ob für dieses Objekt ein Grund fehlt (nicht flach, sperrt laut Katalog, hier durchgehbar). */
  KE.grundFehlt = function (e) {
    const k = katalog(e);
    if (!k.kollision || k.flach || e.auf !== undefined || e.an_wand || e.vorn) return false;
    return KE.istDurchgehbar(e) && !String(e.begehbar_grund || "").trim();
  };

  /** Setzt `kollision` so, dass das Objekt sperrt (true) oder nicht; Katalogwerte entfallen. */
  function setzeSperre(e, sperrt) {
    if (sperrt === !!katalog(e).kollision) delete e.kollision;
    else e.kollision = sperrt;
    const maske = e.maske_fein || e.maske;
    const offeneMaske = Array.isArray(maske) && !maske.some((z) => z.includes("#"));
    if (!sperrt || offeneMaske) (delete e.maske, delete e.maske_fein);
    if (sperrt) delete e.begehbar_grund;
  }

  /** Schalter „Sperrt / Durchgehbar“ für die ganze Auswahl. */
  KE.setzeDurchgehbar = function (durchgehbar) {
    const auswahl = objekte();
    if (!auswahl.length) return;
    const name = durchgehbar ? "Durchgehbar" : "Sperrt";
    KE.schritt(name, [KE.zustand.datei], () => {
      for (const t of auswahl) setzeSperre(t.eintrag, !durchgehbar);
    });
    if (durchgehbar) setTimeout(() => document.getElementById("begehbargrund")?.focus(), 0);
  };

  /** Grund für die ganze Auswahl (leer entfernt ihn). */
  KE.setzeGrund = function (text) {
    const auswahl = objekte();
    KE.schritt("Grund", [KE.zustand.datei], () => {
      for (const t of auswahl) {
        if (text.trim()) t.eintrag.begehbar_grund = text.trim();
        else delete t.eintrag.begehbar_grund;
      }
    });
  };

  /** „Zurück zum Katalog“: entfernt die Übersteuerung an der Auswahl. */
  KE.zumKatalog = function () {
    const auswahl = objekte();
    KE.schritt("Zurück zum Katalog", [KE.zustand.datei], () => {
      for (const t of auswahl) for (const k of FELDER) delete t.eintrag[k];
    });
    KE.zustand.kollisionUid = null;
  };

  /** Startet oder beendet den Modus „Kollision bearbeiten“ für das ausgewählte Objekt. */
  KE.kollisionBearbeiten = function (an) {
    const z = KE.zustand;
    const erstes = objekte()[0];
    z.kollisionUid = an && erstes ? erstes.eintrag._uid : null;
    if (z.kollisionUid)
      z.kpinsel = null; // Modus je Bild statt Kollisionspinsel (pinsel.js)
    else z.fein = false; // „Fein“ endet mit dem Modus (feinmalen.js)
    if (z.kollisionUid) KE.schalte("kollision", true);
    KE.meldeAenderung(
      z.kollisionUid
        ? "Kollision: Kachel anklicken schaltet sperrt/frei, Ziehen malt, F schaltet „Fein“."
        : "",
    );
  };

  /** Spalten und Reihen eines Stücks in Kacheln (wie maskenfelder; beschnitten: zuschnitt.js). */
  const masse = (s) => KE.maskenmasse(s);

  /** Die gesperrten Zellen eines Stücks als Raster der gezeichneten (geformten) Lage. */
  function feinraster(s) {
    const [sp, re] = masse(s);
    const zeilen = Array.from({ length: re * Z }, () => Array(sp * Z).fill("."));
    if (s.kollision)
      for (const [x, y] of KE.stueckzellenLokal(s))
        if (y < re * Z && x < sp * Z) zeilen[y][x] = "#";
    return zeilen;
  }

  /** Geformtes Raster zurück ins Raster des ungedrehten Bildes: erst zurückdrehen, dann spiegeln. */
  function zurueck(zeilen, e) {
    const drehung = (e.drehung || 0) % 360;
    let r = KE.dreheMaske(zeilen, zeilen[0].length, zeilen.length, (360 - drehung) % 360, false);
    if (e.spiegeln) r = r.map((z) => [...z].reverse().join(""));
    return r;
  }

  /** Ob jede Kachel eines feinen Rasters einheitlich ist (dann genügt die grobe Maske). */
  function einheitlich(zeilen) {
    for (let y = 0; y < zeilen.length; y++)
      for (let x = 0; x < zeilen[y].length; x++) {
        const ecke = zeilen[y - (y % Z)][x - (x % Z)];
        if (zeilen[y][x] !== ecke) return false;
      }
    return true;
  }

  /** Schreibt das feine Raster (gezeichnete Lage) an den Eintrag: grob, wenn es einheitlich ist. */
  function schreibeMaske(e, raster) {
    const ungedreht = zurueck(
      raster.map((z) => z.join("")),
      e,
    );
    if (!KE.kollisionAn(katalog(e), e)) setzeSperre(e, true);
    if (einheitlich(ungedreht)) {
      e.maske = KE.grobAusFein(ungedreht);
      delete e.maske_fein;
    } else {
      e.maske_fein = ungedreht;
      delete e.maske;
    }
  }

  /** Stelle (Spalte, Reihe) im Raster des Stücks, in Kacheln oder (fein) Zellen. */
  function stelle(s, px, py, fein) {
    const e = fein ? ZP : K;
    return [Math.floor((px - s.x) / e), Math.floor((py - s.y) / e)];
  }

  /** Setzt eine Kachel (alle 16 Zellen) oder eine Zelle im feinen Raster auf `wert`. */
  function setze(raster, x, y, wert, fein) {
    const n = fein ? 1 : Z;
    for (let j = 0; j < n; j++)
      for (let i = 0; i < n; i++) if (raster[y * n + j]) raster[y * n + j][x * n + i] = wert;
  }

  /**
   * Maus gedrückt im Modus „Kollision bearbeiten“: schaltet die Kachel (fein: die Zelle) unter dem
   * Punkt um. Ausgabe: der Zustand des Ziehens für bedienung.js, oder null außerhalb des Bildes.
   */
  KE.kollisionStart = function (ereignis, px, py) {
    const z = KE.zustand;
    const s = stueck(z.kollisionUid);
    if (!s) return (z.kollisionUid = null);
    const fein = !!z.fein;
    const [x, y] = stelle(s, px, py, fein);
    const [sp, re] = masse(s).map((v) => (fein ? v * Z : v));
    if (y < 0 || x < 0 || y >= re || x >= sp) {
      KE.status("Diese Stelle gehört nicht zum Bild. Fertig mit „Fertig“ oder Esc.");
      return null;
    }
    const raster = feinraster(s);
    const wert = raster[fein ? y : y * Z][fein ? x : x * Z] === "#" ? "." : "#";
    const ziehen = {
      art: "kollision",
      vorher: KE.schnappschuss([z.datei]),
      fein,
      wert,
      x0: x,
      y0: y,
    };
    ziehen.rechteck = ereignis.shiftKey;
    ziehen.einheit = fein ? ZP : K;
    if (ziehen.rechteck) KE.kollisionRahmen = { x0: x, y0: y, x1: x, y1: y, s, e: ziehen.einheit };
    else KE.kollisionZiehen(ziehen, px, py);
    return ziehen;
  };

  /** Maus bewegt: malt mit dem Wert der ersten Stelle weiter oder zieht das Rechteck auf. */
  KE.kollisionZiehen = function (ziehen, px, py) {
    const z = KE.zustand;
    const s = stueck(z.kollisionUid);
    if (!s) return;
    const [x, y] = stelle(s, px, py, ziehen.fein);
    if (ziehen.rechteck) {
      const [x0, y0] = [ziehen.x0, ziehen.y0];
      KE.kollisionRahmen = {
        ...KE.kollisionRahmen,
        x0: Math.min(x0, x),
        y0: Math.min(y0, y),
        x1: Math.max(x0, x),
        y1: Math.max(y0, y),
      };
      return KE.zeichne();
    }
    const raster = feinraster(s);
    setze(raster, x, y, ziehen.wert, ziehen.fein);
    schreibeMaske(KE.finde(z.kollisionUid).eintrag, raster);
    KE.zeichne();
  };

  /** Maus losgelassen: Rechteck setzen, alles als einen Schritt im Verlauf abschließen. */
  KE.kollisionEnde = function (ziehen) {
    const z = KE.zustand;
    const r = KE.kollisionRahmen;
    const s = stueck(z.kollisionUid);
    if (ziehen.rechteck && r && s) {
      const raster = feinraster(s);
      for (let y = r.y0; y <= r.y1; y++)
        for (let x = r.x0; x <= r.x1; x++) setze(raster, x, y, ziehen.wert, ziehen.fein);
      schreibeMaske(KE.finde(z.kollisionUid).eintrag, raster);
    }
    KE.kollisionRahmen = null;
    KE.schrittAbschliessen(ziehen.fein ? "Kollision Zellen" : "Kollision Kachel", ziehen.vorher);
  };

  /** Gitter über dem bearbeiteten Objekt: grün frei, rot gesperrt; fein in Zellen. */
  KE.zeichneKollisionsgitter = function (ctx, zoom) {
    const z = KE.zustand;
    if (!z.kollisionUid || z.schalter.vorher) return;
    const s = stueck(z.kollisionUid);
    if (!s) return (z.kollisionUid = null);
    // Am Bild ausgerichtet, nicht am Kartenraster: Die Maske gilt ab der linken oberen Ecke des
    // Bildes, auch wenn es um ein paar Pixel verschoben ist (Fehlerbericht des Autors, 16.11.2026).
    const fein = z.fein || !!s.angabe.maske_fein;
    const raster = feinraster(s);
    const e = fein ? ZP : K;
    ctx.lineWidth = 1 / zoom;
    for (let y = 0; y * e < raster.length * ZP; y++)
      for (let x = 0; x * e < raster[0].length * ZP; x++) {
        ctx.fillStyle =
          raster[fein ? y : y * Z][fein ? x : x * Z] === "#" ? FARBE_GESPERRT : FARBE_FREI;
        ctx.fillRect(s.x + x * e, s.y + y * e, e, e);
        ctx.strokeStyle = fein && (x % Z || y % Z) ? "rgba(255,255,255,0.35)" : "#fff";
        ctx.strokeRect(s.x + x * e, s.y + y * e, e, e);
      }
    const r = KE.kollisionRahmen;
    if (!r) return;
    ctx.setLineDash([4 / zoom, 3 / zoom]);
    ctx.strokeStyle = "#ffcc00";
    ctx.strokeRect(
      s.x + r.x0 * r.e,
      s.y + r.y0 * r.e,
      (r.x1 - r.x0 + 1) * r.e,
      (r.y1 - r.y0 + 1) * r.e,
    );
    ctx.setLineDash([]);
  };

  function knopf(text, titel, tu, klasse) {
    const k = el("button", klasse, text);
    k.title = titel;
    k.addEventListener("click", tu);
    return k;
  }

  /** Bedienfeld „Kollision“ für die Auswahl (in panel.js eingehängt). */
  KE.kollisionsfeld = function (ziel) {
    const auswahl = objekte();
    if (!auswahl.length) return;
    const z = KE.zustand;
    const durch = auswahl.map((t) => KE.istDurchgehbar(t.eintrag));
    const alle = durch.every(Boolean);
    const keins = !durch.some(Boolean);
    const box = el("div", "kollisionsfeld");
    box.append(el("div", "zwischentitel", "Kollision"));
    const reihe = el("div", "knopfreihe");
    const sperrt = knopf("Sperrt", "Wie eine Wand", () => KE.setzeDurchgehbar(false), "sperrt");
    const offen = knopf(
      "Durchgehbar",
      "Man geht hindurch",
      () => KE.setzeDurchgehbar(true),
      "durchgehbar",
    );
    sperrt.classList.toggle("an", keins);
    offen.classList.toggle("an", alle);
    reihe.append(sperrt, offen);
    box.append(reihe);
    const eigen = auswahl.some((t) => FELDER.some((k) => k in t.eintrag));
    const k = katalog(auswahl[0].eintrag);
    const katalogtext = k.kollision ? "sperrt" : "durchgehbar";
    box.append(
      el(
        "div",
        "kurz",
        eigen
          ? `Hier eigene Kollision (Katalog: ${katalogtext}).`
          : `Wie im Katalog (${katalogtext}).`,
      ),
    );
    if (
      auswahl.some((t) => KE.istDurchgehbar(t.eintrag)) ||
      auswahl.some((t) => t.eintrag.begehbar_grund)
    ) {
      const feld = el("input");
      feld.id = "begehbargrund";
      feld.placeholder = "Grund: warum kann man hier durchgehen?";
      feld.value = auswahl[0].eintrag.begehbar_grund || "";
      feld.addEventListener("change", () => KE.setzeGrund(feld.value));
      box.append(feld);
    }
    if (auswahl.some((t) => KE.grundFehlt(t.eintrag)))
      box.append(el("div", "grundhinweis", "Grund fehlt: Der Rücklauf meldet das (Regel 10.69)."));
    const modus = !!z.kollisionUid;
    const zweite = el("div", "knopfreihe");
    if (modus) {
      const fein = knopf(
        "Fein",
        "In Zellen von 4 Pixeln bearbeiten (F)",
        () => KE.schalteFein(),
        "fein",
      );
      fein.classList.toggle("an", !!z.fein);
      zweite.append(fein);
    }
    const bearbeiten = knopf(
      modus ? "Fertig" : "Kollision bearbeiten",
      "Kacheln des Bildes einzeln sperren oder freigeben",
      () => KE.kollisionBearbeiten(!modus),
      "kollisionbearbeiten",
    );
    bearbeiten.disabled = auswahl.length !== 1 && !modus;
    bearbeiten.classList.toggle("an", modus);
    const zurueckKnopf = knopf(
      "Zurück zum Katalog",
      "Übersteuerung entfernen",
      () => KE.zumKatalog(),
      "zumkatalog",
    );
    zurueckKnopf.disabled = !eigen;
    zweite.append(bearbeiten, zurueckKnopf);
    box.append(zweite);
    ziel.append(box);
  };
})(window.KE);
