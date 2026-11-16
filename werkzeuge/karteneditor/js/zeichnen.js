/*
 * Karteneditor – Zeichnen: Hintergrund (Boden und Wände wie im Spiel), bemalte Felder, Objekte in
 * der Tiefe des Kartenbaus, Markierungen, Raster mit Koordinaten, Kollision und Auswahl.
 *
 * Warum: Der Autor soll die Karte sehen wie im Spiel (Wunsch des Autors, 15.11.2026). Der
 * Hintergrund ist das fertige Bild aus dem Kartenbau; Felder, die er mit dem Pinsel ändert,
 * zeichnet der Editor mit der Grundkachel des Bodens darüber (den genauen Rand macht erst der
 * Rücklauf).
 */
"use strict";

(function (KE) {
  const K = 16;
  const bilder = []; // Index → HTMLImageElement
  const pixel = []; // Index → ImageData (für die Trefferprüfung)
  const kacheln = { boeden: {}, waende: {} };
  const hintergruende = {}; // Datei → HTMLImageElement
  const FARBE_AUSWAHL = "#ffcc00";
  const FARBE_KOLLISION = "rgba(255, 210, 0, 0.30)"; // Wunsch des Autors: transparent gelb
  const RAND_KOLLISION = "rgba(255, 200, 0, 0.95)";
  const FARBE_MARKIERUNG = {
    ausloeser: "#2f7cf6",
    figuren: "#e0457b",
    belebung: "#2fb36b",
  };
  const DUNKEL = "#1a1612";

  function bild(url) {
    const b = new Image();
    b.src = url;
    return b;
  }

  /**
   * Gesperrte Kacheln: transparent gelb gefüllt, die Außenkante jeder gesperrten Fläche gelb
   * umrandet (Wunsch des Autors, 16.11.2026), damit Lücken und Engstellen sofort auffallen.
   */
  function zeichneSperren(ctx, gesperrt, zoom) {
    ctx.fillStyle = FARBE_KOLLISION;
    ctx.strokeStyle = RAND_KOLLISION;
    ctx.lineWidth = 1.5 / zoom;
    ctx.beginPath();
    for (const k of gesperrt) {
      const [x, y] = k.split(",").map(Number);
      ctx.fillRect(x * K, y * K, K, K);
      const kante = (dx, dy) => !gesperrt.has(x + dx + "," + (y + dy));
      if (kante(0, -1)) (ctx.moveTo(x * K, y * K), ctx.lineTo((x + 1) * K, y * K));
      if (kante(0, 1)) (ctx.moveTo(x * K, (y + 1) * K), ctx.lineTo((x + 1) * K, (y + 1) * K));
      if (kante(-1, 0)) (ctx.moveTo(x * K, y * K), ctx.lineTo(x * K, (y + 1) * K));
      if (kante(1, 0)) (ctx.moveTo((x + 1) * K, y * K), ctx.lineTo((x + 1) * K, (y + 1) * K));
    }
    ctx.stroke();
  }

  /** Sperrflächen von Möbeln abseits des Rasters, pixelgenau wie im Spiel (geometrie.js). */
  function zeichneFlaechen(ctx, flaechen, zoom) {
    ctx.fillStyle = FARBE_KOLLISION;
    ctx.strokeStyle = RAND_KOLLISION;
    ctx.lineWidth = 1.5 / zoom;
    for (const [px, py] of flaechen) {
      ctx.fillRect(px, py, K, K);
      ctx.strokeRect(px, py, K, K);
    }
  }

  /**
   * Gesperrte Zellen (Kollision fein, fein.js): je [px, py] ein Feld von 4 × 4 Pixeln, transparent
   * gelb; der gelbe Rand läuft nur außen um zusammenhängende Zellen.
   */
  function zeichneZellen(ctx, zellen, zoom) {
    const z = KE.ZELLE;
    const menge = new Set(zellen.map(([x, y]) => x + "," + y));
    ctx.fillStyle = FARBE_KOLLISION;
    ctx.strokeStyle = RAND_KOLLISION;
    ctx.lineWidth = 1 / zoom;
    ctx.beginPath();
    for (const k of menge) {
      const [x, y] = k.split(",").map(Number);
      ctx.fillRect(x, y, z, z);
      const kante = (dx, dy) => !menge.has(x + dx * z + "," + (y + dy * z));
      if (kante(0, -1)) (ctx.moveTo(x, y), ctx.lineTo(x + z, y));
      if (kante(0, 1)) (ctx.moveTo(x, y + z), ctx.lineTo(x + z, y + z));
      if (kante(-1, 0)) (ctx.moveTo(x, y), ctx.lineTo(x, y + z));
      if (kante(1, 0)) (ctx.moveTo(x + z, y), ctx.lineTo(x + z, y + z));
    }
    ctx.stroke();
  }

  /**
   * Kacheln, die eine Figur oder ein Statist nur unter einer Bedingung sperrt (orte.json „wenn“,
   * Tageszeit „wann“): transparent gelb mit eigener gestrichelter Umrandung je Kachel, damit der
   * Autor sieht, dass der Weg nur manchmal zu ist. Schon fest gesperrte Kacheln bleiben, wie sie sind.
   */
  function zeichneBedingte(ctx, bedingt, gesperrt, zoom) {
    ctx.fillStyle = FARBE_KOLLISION;
    ctx.strokeStyle = RAND_KOLLISION;
    ctx.lineWidth = 1.5 / zoom;
    ctx.setLineDash([4 / zoom, 3 / zoom]);
    const rand = 1 / zoom; // eine Spur nach innen, damit sich die Striche benachbarter Kacheln nicht decken
    for (const k of bedingt.keys()) {
      if (gesperrt.has(k)) continue;
      const [x, y] = k.split(",").map(Number);
      ctx.fillRect(x * K, y * K, K, K);
      ctx.strokeRect(x * K + rand, y * K + rand, K - 2 * rand, K - 2 * rand);
    }
    ctx.setLineDash([]);
  }

  /** Legt die Bilder des Pakets an (sie dekodieren im Hintergrund, gezeichnet wird, was fertig ist). */
  KE.ladeBilder = function (daten, fertig) {
    let offen = daten.bilder.length;
    daten.bilder.forEach((url, i) => {
      const b = bild(url);
      b.onload = b.onerror = () => {
        if (--offen === 0 && fertig) fertig();
      };
      bilder[i] = b;
    });
    for (const [n, url] of Object.entries(daten.kacheln.boeden)) kacheln.boeden[n] = bild(url);
    for (const [n, teile] of Object.entries(daten.kacheln.waende)) {
      kacheln.waende[n] = {};
      for (const [t, url] of Object.entries(teile)) kacheln.waende[n][t] = bild(url);
    }
  };

  KE.bild = (i) => bilder[i];

  /** Pixeldaten eines Bildes (zwischengespeichert), oder null, solange es nicht geladen ist. */
  KE.bildpixel = function (i) {
    if (pixel[i]) return pixel[i];
    const b = bilder[i];
    if (!b || !b.complete || !b.naturalWidth) return null;
    const c = document.createElement("canvas");
    c.width = b.naturalWidth;
    c.height = b.naturalHeight;
    const ctx = c.getContext("2d");
    ctx.drawImage(b, 0, 0);
    pixel[i] = ctx.getImageData(0, 0, c.width, c.height);
    return pixel[i];
  };

  function hintergrund(datei) {
    const url = KE.zustand.nachDatei[datei].hintergrund;
    if (!url) return null;
    if (!hintergruende[datei]) {
      hintergruende[datei] = bild(url);
      hintergruende[datei].onload = () => KE.zeichne();
    }
    return hintergruende[datei];
  }

  /** Größe der Karte in Pixeln. */
  KE.kartengroesse = function (szene) {
    const zeilen = szene.raster || [];
    return [Math.max(0, ...zeilen.map((z) => z.length)) * K, zeilen.length * K];
  };

  /**
   * Wandfläche einer Nordwand (szenen/README.md: oberste Reihe Krone, zwei Reihen Fläche): das
   * Wandfeld direkt über dem Boden zeigt „unten“, das darüber „oben“; sonst null (Krone).
   * Für Karten ohne Hintergrundbild (Varianten) und mit dem Pinsel gemalte Wände.
   */
  function wandflaeche(szene, x, y, wand) {
    const boden = (dy) => {
      const z = (szene.raster[y + dy] || "")[x];
      return z !== undefined && z !== "#" && z !== " ";
    };
    if (boden(1)) return wand.unten || null;
    if (!boden(1) && (szene.raster[y + 1] || "")[x] === "#" && boden(2)) return wand.oben || null;
    return null;
  }

  /** Zeichnet ein Feld mit der Grundkachel seines Bodens oder seiner Wand. */
  function feld(ctx, szene, zeichen, x, y) {
    const boeden = szene.boeden || {};
    let kachel = null;
    if (zeichen === "#" && szene.kante === "klippe") {
      // Felswand: Die echte Klippe zeichnet erst der Kartenbau (klippe.py) mit Kante und Höhe;
      // der Editor zeigt gemalte Felsfelder als braune Fläche, damit sie nicht wie Gras aussehen.
      ctx.fillStyle = "#8a5a3c";
      ctx.fillRect(x * K, y * K, K, K);
      ctx.strokeStyle = "#5b3a26";
      ctx.strokeRect(x * K + 0.5, y * K + 0.5, K - 1, K - 1);
      return;
    }
    if (zeichen === "#") {
      kachel = szene.wandart ? kacheln.boeden[szene.wandart] : null;
      if (!kachel) {
        const wand = kacheln.waende[szene.wand || "creme"] || {};
        kachel = wandflaeche(szene, x, y, wand) || wand.krone || null;
        if (!kachel) {
          ctx.fillStyle = "#f6f6f8";
          ctx.fillRect(x * K, y * K, K, K);
          ctx.strokeStyle = "#3a3a50";
          ctx.strokeRect(x * K + 0.5, y * K + 0.5, K - 1, K - 1);
          return;
        }
      }
    } else if (zeichen === "~") kachel = kacheln.boeden.wasser;
    else if (zeichen !== " ") kachel = kacheln.boeden[boeden[zeichen] || szene.boden || "holzHell"];
    if (kachel && kachel.complete) ctx.drawImage(kachel, x * K, y * K);
    else {
      ctx.fillStyle = DUNKEL;
      ctx.fillRect(x * K, y * K, K, K);
    }
  }

  /** Boden und Wände: das Bild des Kartenbaus, darüber die mit dem Pinsel geänderten Felder. */
  function zeichneGrund(ctx, szene, original, datei) {
    const grund = hintergrund(datei);
    const zeilen = szene.raster || [];
    const alt = original.raster || [];
    const ohneBild = !grund || !grund.complete;
    if (!ohneBild) ctx.drawImage(grund, 0, 0);
    zeilen.forEach((zeile, y) =>
      [...zeile].forEach((z, x) => {
        if (ohneBild || (alt[y] || "")[x] !== z) feld(ctx, szene, z, x, y);
      }),
    );
  }

  /** Zeichnet ein Objekt in seiner Form (Maßstab, Spiegeln, Drehung um die Mitte). */
  function zeichneStueck(ctx, s) {
    if (s.fehlt) {
      ctx.fillStyle = "rgba(255,0,0,0.5)";
      ctx.fillRect(s.x, s.y, s.b, s.h);
      return;
    }
    const b = bilder[KE.zustand.daten.moebel[s.kennung].bild];
    if (!b || !b.complete) return;
    const e = s.eintrag;
    if (KE.zuschnittVon(e)) return KE.zeichneBeschnitten(ctx, s, b); // Zuschnitt (zuschnitt.js)
    const m = Number(e.massstab ?? 1);
    const w = b.naturalWidth * m;
    const h = b.naturalHeight * m;
    if (!KE.hatForm(e)) {
      ctx.drawImage(b, s.x, s.y);
      return;
    }
    ctx.save();
    ctx.translate(s.x + s.b / 2, s.y + s.h / 2);
    ctx.rotate(((e.drehung || 0) * Math.PI) / 180);
    ctx.scale(e.spiegeln ? -1 : 1, 1);
    ctx.drawImage(b, -w / 2, -h / 2, w, h);
    ctx.restore();
  }

  function zeichneMarkierung(ctx, m, zoom) {
    ctx.fillStyle = FARBE_MARKIERUNG[m.liste];
    ctx.globalAlpha = 0.75;
    ctx.beginPath();
    ctx.arc(m.x + K / 2, m.y + K / 2, K / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#fff";
    ctx.font = `${Math.max(4, 10 / zoom)}px sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(m.name, m.x + K / 2, m.y - 2 / zoom);
  }

  function zeichneRaster(ctx, breite, hoehe, zoom) {
    ctx.strokeStyle = "rgba(255,255,255,0.28)";
    ctx.lineWidth = 1 / zoom;
    ctx.beginPath();
    for (let x = 0; x <= breite; x += K) (ctx.moveTo(x, 0), ctx.lineTo(x, hoehe));
    for (let y = 0; y <= hoehe; y += K) (ctx.moveTo(0, y), ctx.lineTo(breite, y));
    ctx.stroke();
    if (zoom < 2.5) return;
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.font = `${8 / zoom}px sans-serif`;
    ctx.textAlign = "left";
    for (let y = 0; y < hoehe; y += K)
      for (let x = 0; x < breite; x += K)
        ctx.fillText(`${x / K},${y / K}`, x + 1 / zoom, y + 8 / zoom);
  }

  /** Koordinaten am Rand des Fensters (Spalten oben, Reihen links), immer lesbar. */
  function zeichneLineale(ctx, a, breite, hoehe, canvas) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, canvas.width, 14);
    ctx.fillRect(0, 0, 22, canvas.height);
    ctx.fillStyle = "#fff";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "center";
    const schritt = a.zoom * K < 14 ? 5 : 1;
    for (let x = 0; x < breite / K; x += schritt) {
      const sx = (x * K + K / 2 - a.x) * a.zoom;
      if (sx > 22 && sx < canvas.width) ctx.fillText(String(x), sx, 11);
    }
    for (let y = 0; y < hoehe / K; y += schritt) {
      const sy = (y * K + K / 2 - a.y) * a.zoom;
      if (sy > 14 && sy < canvas.height) ctx.fillText(String(y), 11, sy + 4);
    }
  }

  function zeichneAuswahl(ctx, stuecke, marken, zoom) {
    const auswahl = KE.zustand.auswahl;
    ctx.lineWidth = 2 / zoom;
    for (const s of [...stuecke, ...marken]) {
      if (!auswahl.has(s.uid)) continue;
      ctx.strokeStyle = "#000";
      ctx.strokeRect(s.x, s.y, s.b, s.h);
      ctx.setLineDash([4 / zoom, 3 / zoom]);
      ctx.strokeStyle = FARBE_AUSWAHL;
      ctx.strokeRect(s.x, s.y, s.b, s.h);
      ctx.setLineDash([]);
    }
  }

  /** Zeichnet die aktuelle Karte (oder im Vergleich das Original). */
  KE.zeichne = function () {
    const canvas = document.getElementById("leinwand");
    const ctx = canvas.getContext("2d");
    const z = KE.zustand;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = "#2b2b33";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (!z.datei) return;
    const original = z.original[z.datei];
    const szene = z.schalter.vorher ? original : KE.szene();
    const a = z.ansicht;
    ctx.imageSmoothingEnabled = false;
    ctx.setTransform(a.zoom, 0, 0, a.zoom, -a.x * a.zoom, -a.y * a.zoom);
    const [breite, hoehe] = KE.kartengroesse(szene);
    zeichneGrund(ctx, szene, original, z.datei);
    const stuecke = KE.platziere(szene);
    const sichtbar = stuecke.filter((s) => !z.schalter.nurUmgebung || s.umgebung);
    for (const s of sichtbar) {
      ctx.globalAlpha = KE.deckkraftVon(s.eintrag) / 100; // Deckkraft in Stufen (deckkraft.js)
      zeichneStueck(ctx, s);
    }
    ctx.globalAlpha = 1;
    // Alle Stücke zählen, auch die bei „Nur Umgebung“ ausgeblendeten: Der Held stößt trotzdem an.
    // Figuren und stehende Statisten sperren wie Möbel; nur bedingt anwesende gestrichelt.
    if (z.schalter.kollision) {
      const gesperrt = KE.sperrkacheln(szene, stuecke);
      const anzeige = KE.sperranzeige(szene, stuecke);
      zeichneSperren(ctx, anzeige.kacheln, a.zoom);
      zeichneFlaechen(ctx, anzeige.flaechen, a.zoom);
      zeichneZellen(ctx, anzeige.zellen, a.zoom); // Kollision fein (fein.js)
      KE.zeichneTeilkacheln(ctx, anzeige.teilkacheln, a.zoom); // Punkt: Held steht dort nicht mittig
      zeichneBedingte(ctx, KE.figurensperren(szene).bedingt, gesperrt, a.zoom);
      KE.zeichnePinsel(ctx, szene, a.zoom); // Kreuz für gemalte Sperren, grün für Freigaben (pinsel.js)
    }
    const marken = z.schalter.markierungen && !z.schalter.nurUmgebung ? KE.markierungen(szene) : [];
    for (const m of marken) zeichneMarkierung(ctx, m, a.zoom);
    // Ziel und Ankunft jedes Übergangs, Kacheln beim Setzen (uebergaenge.js, ankunft.js).
    if (marken.length || z.setzen) KE.zeichneUebergaenge(ctx, szene, stuecke, a.zoom);
    KE.zeichneKollisionsgitter(ctx, a.zoom); // Modus „Kollision bearbeiten“ (kollision.js)
    if (z.fein && (z.kpinsel || z.kollisionUid)) {
      // 4-Pixel-Gitter des Fein-Modus, nur im sichtbaren Ausschnitt (feinmalen.js).
      const sicht = [a.x, a.y, a.x + canvas.width / a.zoom, a.y + canvas.height / a.zoom];
      KE.zeichneFeingitter(ctx, breite, hoehe, a.zoom, sicht);
    }
    KE.zeichneZuschnitt(ctx, a.zoom); // Modus „Zuschneiden“: Griffe, Weggeschnittenes (zuschnitt.js)
    if (z.schalter.raster) zeichneRaster(ctx, breite, hoehe, a.zoom);
    if (!z.schalter.vorher) zeichneAuswahl(ctx, sichtbar, marken, a.zoom);
    if (KE.rechteck) {
      const r = KE.rechteck;
      ctx.strokeStyle = FARBE_AUSWAHL;
      ctx.lineWidth = 1 / a.zoom;
      ctx.strokeRect(r.x0, r.y0, r.x1 - r.x0, r.y1 - r.y0);
    }
    if (z.schalter.raster) zeichneLineale(ctx, a, breite, hoehe, canvas);
    if (z.schalter.vorher) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = "rgba(200,40,40,0.85)";
      ctx.fillRect(canvas.width - 150, 8, 140, 24);
      ctx.fillStyle = "#fff";
      ctx.font = "13px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Vorher (Original)", canvas.width - 80, 25);
    }
  };

  /** Ein kleines Vorschaubild (Canvas) eines Möbels, für Listen. */
  KE.vorschau = function (kennung, groesse = 40) {
    const img = document.createElement("img");
    const angabe = KE.zustand.daten.moebel[kennung];
    if (angabe) img.src = KE.zustand.daten.bilder[angabe.bild];
    img.className = "vorschaubild";
    img.style.maxWidth = img.style.maxHeight = groesse + "px";
    img.alt = "";
    return img;
  };
})(window.KE);
