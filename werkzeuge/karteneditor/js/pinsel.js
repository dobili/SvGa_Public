/*
 * Karteneditor – Kollisionspinsel: Kacheln einer Karte als gesperrt oder frei malen, unabhängig von
 * den Bildern (Wunsch des Autors, 16.11.2026). Modi „Sperren“ (Taste S), „Freigeben“ (Taste O) und
 * „Radierer“ (Taste X); Malen mit gedrückter Maus, Umschalt+Ziehen malt ein Rechteck.
 *
 * Warum: Ein Gebäudebild sperrt eine Fläche, durch die man gehen können soll, oder am Rand fehlt eine
 * unsichtbare Sperre. „Kollision bearbeiten“ (kollision.js) ändert nur ein einzelnes Bild; der
 * Pinsel gilt für die Kachel, egal was darunter liegt. Die Szene speichert das in drei Feldern
 * (pipeline/abenteuer/kollisionspinsel.py): `sperren` und `freigeben` (Listen [x, y]) und
 * `freigeben_grund` (Pflicht, wenn eine Freigabe auf Wand oder Wasser des Rasters liegt).
 * Der Pinsel schreibt nur, was etwas ändert: „Sperren“ auf einer schon gesperrten Kachel nimmt nur
 * eine Freigabe weg, „Freigeben“ auf einer freien Kachel nur eine Sperre. Der Radierer entfernt
 * beides; dann gilt wieder, was Bilder und Raster sagen. Jeder Pinselstrich ist ein Schritt im Verlauf.
 * Mit „Fein“ (Taste F, Editor 1.6) malt er Zellen von 4 × 4 Pixeln (feinmalen.js, fein.js).
 */
"use strict";

(function (KE) {
  const K = 16;
  const MODI = { sperren: "Sperren", freigeben: "Freigeben", radierer: "Radierer" };
  const TASTEN = { sperren: "S", freigeben: "O", radierer: "X" };
  const FARBE_KREUZ = "rgba(150, 95, 0, 0.95)";
  const FARBE_FREI = "rgba(30, 190, 80, 1)";
  const FARBE_RAHMEN = { sperren: "#ffcc00", freigeben: "#1ebe50", radierer: "#ffffff" };
  const KREUZ = 0.22; // halbe Länge des Kreuzes, Anteil einer Kachel
  const ZP = 4; // Pixel je Zelle im Fein-Modus (fein.js)
  const GESPERRT = new Set(["#", "~", " "]);
  const el = (...a) => KE.el(...a);

  /** Schaltet den Kollisionspinsel in einen Modus; derselbe Modus oder null schaltet ihn aus. */
  KE.kollisionspinsel = function (modus) {
    const z = KE.zustand;
    z.kpinsel = !modus || z.kpinsel === modus ? null : modus;
    if (!z.kpinsel && !z.kollisionUid) z.fein = false; // „Fein“ endet mit dem Modus
    if (z.kpinsel) {
      // Andere Modi enden; die Kollisionsanzeige gehört zum Pinsel (Wunsch des Autors).
      z.schalter.kollision = true;
      z.schalter.pinsel = false;
      z.kollisionUid = z.uebergangVorlage = z.setzen = null;
    }
    KE.meldeAenderung(
      z.kpinsel
        ? `Kollisionspinsel: ${MODI[z.kpinsel]}. Ziehen malt, Umschalt+Ziehen ein Rechteck, Esc beendet.`
        : "Kollisionspinsel aus",
    );
  };

  function schreibe(szene, name, menge) {
    const liste = [...menge].map((k) => k.split(",").map(Number));
    liste.sort((a, b) => a[1] - b[1] || a[0] - b[0]);
    if (liste.length) szene[name] = liste;
    else delete szene[name];
  }

  /**
   * Malt eine Kachel. grund: Kacheln, die ohne Pinsel gesperrt sind (KE.grundsperren ohne Pinsel).
   * Ausgabe: ob sich etwas geändert hat. Kacheln außerhalb der Karte bleiben unberührt.
   */
  KE.malePinselkachel = function (szene, x, y, modus, grund) {
    const zeilen = szene.raster || [];
    const breite = Math.max(0, ...zeilen.map((z) => z.length));
    if (y < 0 || y >= zeilen.length || x < 0 || x >= breite) return false;
    const felder = () => JSON.stringify([szene.sperren, szene.freigeben, szene.sperren_fein]);
    const vorher = felder() + JSON.stringify(szene.freigeben_fein);
    const { sperren, freigeben } = KE.pinselmengen(szene);
    const k = x + "," + y;
    KE.entferneFein(szene, k); // die ganze Kachel: feine Zellen dort entfallen (feinmalen.js)
    sperren.delete(k);
    freigeben.delete(k);
    if (modus === "sperren" && !grund.has(k)) sperren.add(k);
    if (modus === "freigeben" && grund.has(k)) freigeben.add(k);
    schreibe(szene, "sperren", sperren);
    schreibe(szene, "freigeben", freigeben);
    if (!KE.hatFreigaben(szene)) delete szene.freigeben_grund;
    return felder() + JSON.stringify(szene.freigeben_fein) !== vorher;
  };

  /** Kachel oder (fein) Zelle unter einem Punkt in Pixeln. */
  const stelleVon = (ziehen, px, py) => {
    const e = ziehen.fein ? ZP : K;
    return [Math.floor(px / e), Math.floor(py / e)];
  };
  const male = (ziehen, szene, x, y) =>
    (ziehen.fein ? KE.malePinselzelle : KE.malePinselkachel)(
      szene,
      x,
      y,
      KE.zustand.kpinsel,
      ziehen.grund,
    );

  /** Beginnt einen Pinselstrich (Maus gedrückt); Ausgabe: der Zustand des Ziehens für bedienung.js. */
  KE.pinselStart = function (ereignis, px, py) {
    const z = KE.zustand;
    const szene = KE.szene();
    const fein = !!z.fein;
    const stuecke = KE.platziere(szene);
    const ziehen = {
      art: "kpinsel",
      fein,
      vorher: KE.schnappschuss([z.datei]),
      grund: fein ? KE.grundzellen(szene, stuecke, false) : KE.grundsperren(szene, stuecke, false),
      rechteck: ereignis.shiftKey,
      letzte: null,
    };
    const [x, y] = stelleVon(ziehen, px, py);
    [ziehen.x0, ziehen.y0] = [x, y];
    const einheit = fein ? ZP : K;
    if (ziehen.rechteck) KE.pinselRahmen = { x0: x, y0: y, x1: x, y1: y, einheit };
    else KE.pinselZiehen(ziehen, px, py);
    return ziehen;
  };

  /** Maus bewegt: malt jede überstrichene Kachel (auch bei schnellen Bewegungen) oder zieht das Rechteck. */
  KE.pinselZiehen = function (ziehen, px, py) {
    const [x, y] = stelleVon(ziehen, px, py);
    if (ziehen.rechteck) {
      KE.pinselRahmen = {
        einheit: ziehen.fein ? ZP : K,
        x0: Math.min(ziehen.x0, x),
        y0: Math.min(ziehen.y0, y),
        x1: Math.max(ziehen.x0, x),
        y1: Math.max(ziehen.y0, y),
      };
      return KE.zeichne();
    }
    const [ax, ay] = ziehen.letzte || [x, y];
    const schritte = Math.max(Math.abs(x - ax), Math.abs(y - ay), 1);
    let geaendert = false;
    for (let i = 1; i <= schritte; i++) {
      const kx = Math.round(ax + ((x - ax) * i) / schritte);
      const ky = Math.round(ay + ((y - ay) * i) / schritte);
      geaendert = male(ziehen, KE.szene(), kx, ky) || geaendert;
    }
    ziehen.letzte = [x, y];
    if (geaendert) KE.zeichne();
  };

  /** Maus losgelassen: Rechteck malen, den Strich als einen Schritt im Verlauf abschließen. */
  KE.pinselEnde = function (ziehen) {
    const r = KE.pinselRahmen;
    if (ziehen.rechteck && r) {
      const szene = KE.szene();
      for (let y = r.y0; y <= r.y1; y++)
        for (let x = r.x0; x <= r.x1; x++) male(ziehen, szene, x, y);
    }
    KE.pinselRahmen = null;
    KE.schrittAbschliessen("Kollision malen", ziehen.vorher);
  };

  /**
   * Gemalte Kacheln über der Kollisionsanzeige: Sperren mit einem kleinen Kreuz (die gelbe Fläche
   * zeichnet zeichnen.js), Freigaben grün umrandet, damit der Autor sieht, wo er übersteuert hat.
   */
  KE.zeichnePinsel = function (ctx, szene, zoom) {
    const { sperren, freigeben } = KE.pinselmengen(szene);
    ctx.lineWidth = 1.5 / zoom;
    ctx.strokeStyle = FARBE_KREUZ;
    ctx.beginPath();
    for (const k of sperren) {
      const [x, y] = k.split(",").map(Number);
      const [mx, my, d] = [(x + 0.5) * K, (y + 0.5) * K, KREUZ * K];
      (ctx.moveTo(mx - d, my - d), ctx.lineTo(mx + d, my + d));
      (ctx.moveTo(mx + d, my - d), ctx.lineTo(mx - d, my + d));
    }
    ctx.stroke();
    ctx.strokeStyle = FARBE_FREI;
    ctx.lineWidth = 2 / zoom;
    const rand = 1 / zoom;
    for (const k of freigeben) {
      const [x, y] = k.split(",").map(Number);
      ctx.strokeRect(x * K + rand, y * K + rand, K - 2 * rand, K - 2 * rand);
    }
    KE.zeichneFeinpinsel(ctx, szene, zoom); // feine Sperren und Freigaben (feinmalen.js)
    const r = KE.pinselRahmen;
    if (!r) return;
    const e = r.einheit || K;
    ctx.setLineDash([4 / zoom, 3 / zoom]);
    ctx.strokeStyle = FARBE_RAHMEN[KE.zustand.kpinsel] || "#fff";
    ctx.strokeRect(r.x0 * e, r.y0 * e, (r.x1 - r.x0 + 1) * e, (r.y1 - r.y0 + 1) * e);
    ctx.setLineDash([]);
  };

  /** Freigaben auf Wand, Wasser oder Leere des Rasters (brauchen freigeben_grund). */
  function freigabenInDerWand(szene) {
    return [...(szene.freigeben || []), ...(szene.freigeben_fein || [])]
      .filter(([x, y]) => GESPERRT.has(((szene.raster || [])[y] || "")[x] ?? " "))
      .map(([x, y]) => [x, y]);
  }

  function setzeGrund(text) {
    KE.schritt("Grund der Freigabe", [KE.zustand.datei], () => {
      const szene = KE.szene();
      if (text.trim()) szene.freigeben_grund = text.trim();
      else delete szene.freigeben_grund;
    });
  }

  /** Bedienfeld „Kollisionspinsel“ (in panel.js eingehängt): Zahl der Kacheln, Grund, Hinweis. */
  KE.pinselfeld = function (ziel) {
    const szene = KE.szene();
    const z = KE.zustand;
    const feine = (szene.sperren_fein || []).length + (szene.freigeben_fein || []).length;
    const anzahl = (szene.sperren || []).length + (szene.freigeben || []).length + feine;
    if (!z.kpinsel && !anzahl) return;
    const box = el("div", "pinselfeld");
    box.append(el("div", "zwischentitel", "Kollisionspinsel"));
    const zahl =
      `${(szene.sperren || []).length} gesperrt, ${(szene.freigeben || []).length} freigegeben` +
      (feine ? `, ${feine} Kacheln fein` : "");
    box.append(
      el("div", "kurz", `Gemalt: ${zahl}. Der Radierer stellt den Zustand der Bilder her.`),
    );
    const wand = freigabenInDerWand(szene);
    if (wand.length || szene.freigeben_grund) {
      const feld = el("input");
      feld.id = "freigabegrund";
      feld.placeholder = "Grund: warum geht man hier durch die Wand?";
      feld.value = szene.freigeben_grund || "";
      feld.addEventListener("change", () => setzeGrund(feld.value));
      box.append(feld);
    }
    if (wand.length && !String(szene.freigeben_grund || "").trim()) {
      const wo = wand.map((f) => `(${f.join(", ")})`).join(" ");
      box.append(
        el("div", "grundhinweis", `Freigabe in der Wand ${wo} ohne Grund: Befund im Kartenbau.`),
      );
    }
    ziel.append(box);
  };

  /** Zeigt den Stand an den Knöpfen der Leiste (Pinsel an, gewählter Modus). */
  KE.zeigePinselwahl = function () {
    const modus = KE.zustand.kpinsel;
    document.getElementById("kpinselknopf").classList.toggle("an", !!modus);
    document.getElementById("kpinselwahl").hidden = !modus;
    const fein = document.getElementById("feinknopf");
    fein.hidden = !modus && !KE.zustand.kollisionUid;
    fein.classList.toggle("an", !!KE.zustand.fein);
    for (const k of document.querySelectorAll("[data-kmodus]"))
      k.classList.toggle("an", k.dataset.kmodus === modus);
  };

  /** Verbindet die Knöpfe der Leiste (start.js). */
  KE.bindePinsel = function () {
    document
      .getElementById("kpinselknopf")
      .addEventListener("click", () => KE.kollisionspinsel(KE.zustand.kpinsel ? null : "sperren"));
    for (const k of document.querySelectorAll("[data-kmodus]")) {
      k.title = `${MODI[k.dataset.kmodus]} (Taste ${TASTEN[k.dataset.kmodus]})`;
      k.addEventListener("click", () => KE.kollisionspinsel(k.dataset.kmodus));
    }
    document.getElementById("feinknopf").addEventListener("click", () => KE.schalteFein());
  };

  /**
   * Überträgt die Pinselkacheln dieser Karte auf eine Zustandsfassung: was hier gegenüber dem
   * Original neu gemalt oder entfernt wurde, dort ebenso (eigene Kacheln der Fassung bleiben).
   * Ausgabe: Zahl der übertragenen Änderungen. Innerhalb von KE.schritt aufrufen.
   */
  KE.pinselUebertragen = function (andere) {
    const z = KE.zustand;
    const hier = KE.pinselmengen(KE.szene());
    const alt = KE.pinselmengen(z.original[z.datei]);
    const dort = KE.pinselmengen(andere);
    const gegenteil = { sperren: "freigeben", freigeben: "sperren" };
    let zahl = 0;
    for (const name of ["sperren", "freigeben"]) {
      for (const k of hier[name]) {
        if (alt[name].has(k) || dort[name].has(k)) continue;
        dort[name].add(k);
        dort[gegenteil[name]].delete(k); // eine Kachel ist nie zugleich gesperrt und frei
        zahl++;
      }
      for (const k of alt[name]) if (!hier[name].has(k) && dort[name].delete(k)) zahl++;
    }
    for (const name of ["sperren", "freigeben"]) schreibe(andere, name, dort[name]);
    for (const name of ["sperren", "freigeben"])
      for (const k of dort[name]) KE.entferneFein(andere, k);
    zahl += KE.feinUebertragen(andere); // feine Kacheln (feinmalen.js)
    const grund = KE.szene().freigeben_grund;
    if (grund && grund !== z.original[z.datei].freigeben_grund) andere.freigeben_grund = grund;
    return zahl;
  };

  /** Ob die Pinselkacheln dieser Karte vom Original abweichen (Knopf „auf Fassungen übertragen“). */
  KE.pinselGeaendert = function () {
    const z = KE.zustand;
    const felder = (s) =>
      JSON.stringify([s.sperren, s.freigeben, s.freigeben_grund, s.sperren_fein, s.freigeben_fein]);
    return felder(KE.szene()) !== felder(z.original[z.datei]);
  };
})(window.KE);
