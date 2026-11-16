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
 */
"use strict";

(function (KE) {
  const K = 16;
  const FELDER = ["kollision", "maske", "begehbar_grund"];
  const FARBE_FREI = "rgba(40, 200, 90, 0.35)";
  const FARBE_GESPERRT = "rgba(230, 40, 40, 0.5)";
  const el = (...a) => KE.el(...a);

  const objekte = () => KE.ausgewaehlt().filter((t) => t.liste === "objekte");
  const katalog = (e) => KE.zustand.daten.moebel[e.moebel] || {};
  const stueck = (uid) => KE.platziere(KE.szene()).find((s) => s.uid === uid);

  /** Ob ein Objekt an seiner Stelle ganz durchgehbar ist (objektkollision.durchgehbar). */
  KE.istDurchgehbar = function (e) {
    if (!KE.kollisionAn(katalog(e), e)) return true;
    return Array.isArray(e.maske) && !e.maske.some((z) => z.includes("#"));
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
    const offeneMaske = Array.isArray(e.maske) && !e.maske.some((z) => z.includes("#"));
    if (!sperrt || offeneMaske) delete e.maske;
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
    if (z.kollisionUid) z.kpinsel = null; // Modus je Bild statt Kollisionspinsel (pinsel.js)
    if (z.kollisionUid) KE.schalte("kollision", true);
    KE.meldeAenderung(z.kollisionUid ? "Kollision: Kachel anklicken schaltet sperrt/frei." : "");
  };

  /** Spalten und Reihen eines Stücks in Kacheln (wie maskenfelder). */
  const masse = (s) => [Math.max(1, Math.floor(s.b / K)), Math.max(1, Math.floor(s.h / K))];

  /** Die gesperrten Kacheln eines Stücks als Raster der gezeichneten (geformten) Lage. */
  function raster(s) {
    const [sp, re] = masse(s);
    const zeilen = Array.from({ length: re }, () => Array(sp).fill("."));
    if (s.kollision)
      for (const [x, y] of KE.maskenfelder(s.angabe)) if (y < re && x < sp) zeilen[y][x] = "#";
    return zeilen.map((z) => z.join(""));
  }

  /** Geformtes Raster zurück ins Raster des ungedrehten Bildes: erst zurückdrehen, dann spiegeln. */
  function zurueck(zeilen, e) {
    const drehung = (e.drehung || 0) % 360;
    let r = KE.dreheMaske(zeilen, zeilen[0].length, zeilen.length, (360 - drehung) % 360, false);
    if (e.spiegeln) r = r.map((z) => [...z].reverse().join(""));
    return r;
  }

  /** Klick in die Karte im Kollisionsmodus: schaltet die Kachel unter dem Punkt. */
  KE.kollisionsKlick = function (px, py) {
    const z = KE.zustand;
    const s = stueck(z.kollisionUid);
    if (!s) return (z.kollisionUid = null);
    const x = Math.floor(px / K) - Math.floor(s.x / K);
    const y = Math.floor(py / K) - Math.floor(s.y / K);
    const zeilen = raster(s);
    if (y < 0 || x < 0 || y >= zeilen.length || x >= zeilen[0].length)
      return KE.status("Diese Kachel gehört nicht zum Bild. Fertig mit „Fertig“ oder Esc.");
    const neu = zeilen[y][x] === "#" ? "." : "#";
    zeilen[y] = zeilen[y].slice(0, x) + neu + zeilen[y].slice(x + 1);
    KE.schritt("Kollision Kachel", [z.datei], () => {
      const e = KE.finde(z.kollisionUid).eintrag;
      if (!KE.kollisionAn(katalog(e), e)) setzeSperre(e, true);
      e.maske = zurueck(zeilen, e);
    });
  };

  /** Gitter über dem bearbeiteten Objekt: grün frei, rot gesperrt. */
  KE.zeichneKollisionsgitter = function (ctx, zoom) {
    const z = KE.zustand;
    if (!z.kollisionUid || z.schalter.vorher) return;
    const s = stueck(z.kollisionUid);
    if (!s) return (z.kollisionUid = null);
    const x0 = Math.floor(s.x / K) * K;
    const y0 = Math.floor(s.y / K) * K;
    raster(s).forEach((zeile, y) =>
      [...zeile].forEach((c, x) => {
        ctx.fillStyle = c === "#" ? FARBE_GESPERRT : FARBE_FREI;
        ctx.fillRect(x0 + x * K, y0 + y * K, K, K);
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1 / zoom;
        ctx.strokeRect(x0 + x * K, y0 + y * K, K, K);
      }),
    );
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
