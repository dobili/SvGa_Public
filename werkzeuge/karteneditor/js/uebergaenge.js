/*
 * Karteneditor – Übergänge (ab 1.4): was ein Auslöser tut, steht in orte.json beim Ort unter
 * „ausloeser“ ({ name, karte?, art: "uebergang", ziel: { karte, ausloeser } }). Das Paket bringt
 * diese Definitionen je Ort mit (editorpaket.py, uebergangsdefinitionen) und das Verzeichnis aller
 * Karten als Ziele. Hier: Definition eines Auslösers finden, ändern, anlegen und entfernen, „Zum
 * Ziel“ springen und Ziel und Ankunft in der Karte beschriften.
 *
 * Warum: Der Autor will Übergänge zu beliebigen Karten anlegen und sehen, wohin jeder führt (Wunsch
 * des Autors, 16.11.2026). Änderungen landen in einer Arbeitskopie (zustand.uebergaenge), sind
 * Schritte im Verlauf (Schlüssel KE.ORTE) und gehen mit der Änderungsdatei in den Rücklauf
 * (pipeline/abenteuer/editoruebergaenge.py schreibt orte.json).
 * Regel wie uebergaenge.regel_fuer: Die Definition mit passender Karte geht vor der des ganzen Orts.
 */
"use strict";

(function (KE) {
  const K = 16;
  const ART = "uebergang";
  const FARBE_ZIEL = "#9fd3ff";

  /** Ort einer Karte. Beispiel: „mapleFalls.diner“ → „mapleFalls“. */
  KE.ortVon = (karte) => String(karte || "").split(".")[0];

  /** Die Definition des Übergangs `name` auf der Karte, oder null. */
  KE.regel = function (karte, name) {
    const liste = (KE.zustand.uebergaenge[KE.ortVon(karte)] || []).filter((d) => d.name === name);
    return liste.find((d) => d.karte === karte) || liste.find((d) => !d.karte) || null;
  };

  /** Das Verzeichnis der Karten (Paket: karten), nach Kennung. */
  KE.karteninfo = (kennung) =>
    (KE.zustand.daten.karten || []).find((k) => k.kennung === kennung) || null;

  /** Die Szenendatei der Grundkarte einer Kennung (nicht ein Zustand, keine Variante), oder null. */
  KE.grunddatei = (kennung) => KE.karteninfo(kennung)?.datei || null;

  /** Kartenname für Beschriftungen. Beispiel: „mapleFalls.diner“ → „Diner“. */
  KE.kartenname = (kennung) => KE.karteninfo(kennung)?.kartenname || kennung;

  /** Die verschiedenen Auslösernamen einer Szenendatei (ohne „start“), in der Reihenfolge der Karte. */
  KE.ausloesernamen = function (datei) {
    if (!datei || !KE.zustand.original[datei]) return [];
    const namen = (KE.szene(datei).ausloeser || []).map((a) => a.name);
    return [...new Set(namen)].filter((n) => n !== "start");
  };

  /**
   * Setzt das Ziel des Übergangs `name` auf `karte` (innerhalb von KE.schritt mit KE.ORTE). Gibt es
   * schon eine Definition (auch die des ganzen Orts), bekommt sie das neue Ziel; sonst entsteht eine
   * mit Karte. Beispiel: setzeZiel("mapleFalls.dachboden", "treppeDiner", { karte:
   * "mapleFalls.diner", ausloeser: "treppeDachboden" }).
   */
  KE.setzeZiel = function (karte, name, ziel) {
    const ort = KE.ortVon(karte);
    const vorhanden = KE.regel(karte, name);
    if (vorhanden && vorhanden.art === ART) return (vorhanden.ziel = { ...ziel });
    (KE.zustand.uebergaenge[ort] ??= []).push({ name, karte, art: ART, ziel: { ...ziel } });
  };

  /** Entfernt die Definition mit genau dieser Karte (innerhalb von KE.schritt mit KE.ORTE). */
  KE.entferneZiel = function (karte, name) {
    const ort = KE.ortVon(karte);
    const liste = KE.zustand.uebergaenge[ort] || [];
    KE.zustand.uebergaenge[ort] = liste.filter((d) => !(d.name === name && d.karte === karte));
  };

  /** Ob ein Name auf der Karte schon vergeben ist (Auslöser der Szene oder Definition dort). */
  function vergeben(karte, datei, name) {
    if (KE.ausloesernamen(datei).includes(name)) return true;
    return (KE.zustand.uebergaenge[KE.ortVon(karte)] || []).some(
      (d) => d.name === name && (!d.karte || d.karte === karte),
    );
  }

  /**
   * Vorschlag für einen freien Namen aus Art und Zielkarte. Beispiel: Art „treppe“, Ziel
   * „mapleFalls.diner“ → „treppeDiner“ (gibt es ihn auf der Karte schon: „treppeDiner2“).
   */
  KE.namensvorschlag = function (art, zielkarte, karte, datei) {
    const teil =
      String(zielkarte || "")
        .split(".")
        .pop() || "ziel";
    const basis = art + teil[0].toUpperCase() + teil.slice(1);
    let name = basis;
    for (let i = 2; vergeben(karte, datei, name); i++) name = basis + i;
    return name;
  };

  /** Rückt die Ansicht so, dass die Kachel (x, y) in der Mitte liegt. */
  KE.zentriere = function (x, y) {
    const canvas = document.getElementById("leinwand");
    const a = KE.zustand.ansicht;
    a.x = (x + 0.5) * K - canvas.width / a.zoom / 2;
    a.y = (y + 0.5) * K - canvas.height / a.zoom / 2;
  };

  /**
   * „Zum Ziel“: öffnet die Zielkarte des Übergangs `name` der aktuellen Karte und wählt dort den
   * Gegenauslöser (alle seine Felder) aus. Ohne Ziel oder Zielkarte im Paket: Hinweis.
   */
  KE.zumZiel = function (name) {
    const karte = KE.szene().karte;
    const ziel = KE.regel(karte, name)?.ziel;
    if (!ziel) return KE.status(`„${name}“ hat kein Ziel in orte.json.`, true);
    const datei = KE.grunddatei(ziel.karte);
    if (!datei) return KE.status(`Zielkarte ${ziel.karte} ist nicht im Paket.`, true);
    KE.oeffne(datei);
    const felder = (KE.szene().ausloeser || []).filter((a) => a.name === ziel.ausloeser);
    KE.zustand.auswahl = new Set(felder.map((a) => a._uid));
    if (felder.length) KE.zentriere(...felder[0].feld);
    KE.meldeAenderung(
      felder.length
        ? `${KE.kartenname(ziel.karte)}: Gegenauslöser „${ziel.ausloeser}“ ausgewählt.`
        : `${KE.kartenname(ziel.karte)} hat keinen Auslöser „${ziel.ausloeser}“.`,
    );
  };

  /** Beschriftung „→ Diner · treppeDachboden“ unter dem ersten Feld jedes Übergangs. */
  function beschrifte(ctx, a, regel, zoom) {
    const ziel = regel.ziel || {};
    const zielname = KE.grunddatei(ziel.karte)
      ? KE.kartenname(ziel.karte)
      : `${ziel.karte} (fehlt)`;
    const text = `→ ${zielname} · ${ziel.ausloeser || "?"}`;
    const groesse = Math.max(4, 9 / zoom);
    ctx.font = `${groesse}px sans-serif`;
    ctx.textAlign = "center";
    const x = a.feld[0] * K + K / 2;
    const y = (a.feld[1] + 1) * K + groesse + 1 / zoom;
    ctx.lineWidth = 3 / zoom;
    ctx.strokeStyle = "rgba(0,0,0,0.85)";
    ctx.strokeText(text, x, y);
    ctx.fillStyle = FARBE_ZIEL;
    ctx.fillText(text, x, y);
  }

  /**
   * Zeichnet zu jedem Übergang der Karte Ziel (Beschriftung) und Ankunftsfeld (Fußsymbol mit
   * Pfeil, ankunft.js), dazu die Kacheln, die gerade gesetzt werden (Ziehen im Modus „Neuer
   * Übergang“). Aufruf aus zeichnen.js, wenn die Markierungen sichtbar sind.
   */
  KE.zeichneUebergaenge = function (ctx, szene, stuecke, zoom) {
    const gesehen = new Set();
    for (const a of szene.ausloeser || []) {
      if (gesehen.has(a.name)) continue;
      gesehen.add(a.name);
      const regel = KE.regel(szene.karte, a.name);
      if (!regel || regel.art !== ART) continue;
      beschrifte(ctx, a, regel, zoom);
      const ankunft = KE.ankunftsort(szene, a.name, stuecke);
      if (ankunft) KE.zeichneFuss(ctx, ankunft, a, zoom);
    }
    for (const [x, y] of KE.zustand.setzen?.felder || []) {
      ctx.fillStyle = "rgba(47, 124, 246, 0.55)";
      ctx.fillRect(x * K, y * K, K, K);
    }
  };
})(window.KE);
