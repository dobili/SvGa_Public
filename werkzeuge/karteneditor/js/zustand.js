/*
 * Karteneditor des Schach-Abenteuers – Zustand: Daten des Pakets, bearbeitete Szenen, Auswahl,
 * Rückgängig/Wiederholen und die Sicherung im Browser (localStorage).
 *
 * Warum: Der Autor rückt Karten am Windows-PC selbst zurecht (Wunsch des Autors, 15.11.2026). Die
 * Originale bleiben unberührt; jede Änderung landet in einer Arbeitskopie je Szene, die nach
 * jedem Schritt im Browser gesichert wird, damit ein Neuladen nichts verliert.
 * Rolle: Grundlage aller anderen Teile (geometrie.js, zeichnen.js, bearbeiten.js …). Klassische
 * Skripte statt Module, weil Chrome Module über file:// nicht lädt; alles hängt an window.KE.
 */
"use strict";
window.KE = window.KE || {};

(function (KE) {
  /** Version des Editors; steht in jeder heruntergeladenen Änderungsdatei. */
  // 1.1: Kollision je Objekt, Auslöser anlegen und löschen. 1.2: Figuren und Belebung als Hindernis,
  // löschen (mit Rückfrage) und kopieren, Varianten in der Kartenliste, Bodenkacheln trotz Sperre.
  // 1.3: Kollisionspinsel (Kacheln sperren oder freigeben, unabhängig von den Bildern, pinsel.js).
  // 1.4: Übergänge zu beliebigen Karten, Ziele und Ankunftsfelder sehen (uebergaenge.js, ankunft.js).
  // 1.5: Zuschnitt (Objektfeld zuschnitt, zuschnitt.js, zuschnittfeld.js).
  KE.VERSION = "1.5.0";
  /** Schlüssel der Übergangsdefinitionen (orte.json) im Verlauf, neben den Szenendateien. */
  KE.ORTE = "#orte";
  const SPEICHERSCHLUESSEL = "karteneditor-zwischenstand-v1";
  const ZULETZT_SCHLUESSEL = "karteneditor-zuletzt-v1";
  const ZULETZT_HOECHSTENS = 16;
  const VERLAUF_HOECHSTENS = 200;

  const zustand = {
    daten: null, // window.EDITOR_DATEN
    nachDatei: {}, // Datei → Eintrag des Pakets (ortsname, hintergrund, geschwister, szene)
    original: {}, // Datei → Szene, wie im Paket (mit _uid je Objekt und Markierung)
    bearbeitet: {}, // Datei → Arbeitskopie (nur Szenen, die geöffnet oder geändert wurden)
    notizen: {}, // Datei → { karte: Text, objekte: { uid: Text } }
    datei: null, // aktuelle Karte
    auswahl: new Set(), // uids der ausgewählten Objekte und Markierungen
    verlauf: [],
    zukunft: [],
    zaehler: 0, // für neue uids
    zuletzt: [], // zuletzt benutzte Möbel der Bibliothek
    schalter: {
      raster: false,
      kollision: false,
      nurUmgebung: false,
      umgebungSperren: false,
      vorher: false,
      pinsel: false,
      markierungen: true,
    },
    pinselZeichen: ".",
    kollisionUid: null, // Objekt im Modus „Kollision bearbeiten“ (kollision.js)
    kpinsel: null, // Kollisionspinsel: null, "sperren", "freigeben" oder "radierer" (pinsel.js)
    uebergangVorlage: null, // Name des Auslösers für „Übergang hier“ (ausloeser.js)
    setzen: null, // Neuer Übergang, Gegenauslöser oder Ankunftsfeld setzen (ausloeser.js)
    uebergaenge: {}, // Ort → Übergänge aus orte.json, Arbeitskopie (uebergaenge.js)
    uebergaengeOriginal: {}, // Ort → Übergänge, wie im Paket
    neuForm: null, // Eingaben im Feld „Neuer Übergang“ (uebergangsfeld.js)
    ansicht: { zoom: 2, x: 0, y: 0 },
  };
  KE.zustand = zustand;

  /** Tiefe Kopie über JSON (Szenen sind reines JSON). */
  KE.kopie = (wert) => JSON.parse(JSON.stringify(wert));

  /** Versieht Objekte und Markierungen einer Szene mit stabilen Kennungen (_uid). */
  function vergibUids(szene) {
    (szene.objekte || []).forEach((o, i) => (o._uid = "o" + i));
    (szene.ausloeser || []).forEach((o, i) => (o._uid = "a" + i));
    (szene.figuren || []).forEach((o, i) => (o._uid = "f" + i));
    (szene.belebung || []).forEach((o, i) => (o._uid = "b" + i));
    return szene;
  }

  /** Lädt die Daten des Pakets und den gesicherten Zwischenstand. */
  KE.ladeDaten = function (daten) {
    zustand.daten = daten;
    for (const eintrag of daten.szenen) {
      zustand.nachDatei[eintrag.datei] = eintrag;
      zustand.original[eintrag.datei] = vergibUids(KE.kopie(eintrag.szene));
    }
    zustand.uebergaengeOriginal = KE.kopie(daten.uebergaenge || {});
    zustand.uebergaenge = KE.kopie(zustand.uebergaengeOriginal);
    ladeZwischenstand();
  };

  /** Die Arbeitskopie einer Szene (beim ersten Zugriff aus dem Original angelegt). */
  KE.szene = function (datei = zustand.datei) {
    if (!datei) return null;
    if (!zustand.bearbeitet[datei]) zustand.bearbeitet[datei] = KE.kopie(zustand.original[datei]);
    return zustand.bearbeitet[datei];
  };

  /** Szene ohne die Kennungen des Editors, so wie sie in die Datei kommt. */
  KE.ohneUids = function (szene) {
    return JSON.parse(JSON.stringify(szene, (k, v) => (k === "_uid" ? undefined : v)));
  };

  /** Ob eine Szene vom Original abweicht. */
  KE.istGeaendert = function (datei) {
    const b = zustand.bearbeitet[datei];
    if (!b) return false;
    return JSON.stringify(KE.ohneUids(b)) !== JSON.stringify(KE.ohneUids(zustand.original[datei]));
  };

  KE.geaenderteDateien = () => Object.keys(zustand.bearbeitet).filter(KE.istGeaendert);

  KE.neueUid = () => "n" + ++zustand.zaehler;

  /**
   * Führt eine Änderung als ein Schritt im Verlauf aus (Rückgängig macht sie ganz rückgängig).
   * dateien: betroffene Szenen; tu: Funktion, die sie ändert.
   */
  KE.schritt = function (name, dateien, tu) {
    const vorher = schnappschuss(dateien);
    tu();
    KE.schrittAbschliessen(name, vorher);
  };

  /** Für Ziehen: Zustand vor dem Ziehen merken, nach dem Loslassen abschließen. */
  KE.schnappschuss = schnappschuss;
  function schnappschuss(dateien) {
    const s = {};
    for (const d of dateien)
      s[d] = JSON.stringify(d === KE.ORTE ? zustand.uebergaenge : KE.szene(d));
    return s;
  }

  KE.schrittAbschliessen = function (name, vorher) {
    const nachher = schnappschuss(Object.keys(vorher));
    if (Object.keys(vorher).every((d) => vorher[d] === nachher[d])) return;
    zustand.verlauf.push({ name, vorher, nachher });
    if (zustand.verlauf.length > VERLAUF_HOECHSTENS) zustand.verlauf.shift();
    zustand.zukunft = [];
    KE.sichere();
    KE.meldeAenderung();
  };

  function setze(stand) {
    for (const [d, text] of Object.entries(stand)) {
      if (d === KE.ORTE) zustand.uebergaenge = JSON.parse(text);
      else zustand.bearbeitet[d] = JSON.parse(text);
    }
    const vorhanden = new Set(KE.alleUids());
    zustand.auswahl = new Set([...zustand.auswahl].filter((u) => vorhanden.has(u)));
    if (!vorhanden.has(zustand.kollisionUid)) zustand.kollisionUid = null;
  }

  KE.rueckgaengig = function () {
    const s = zustand.verlauf.pop();
    if (!s) return;
    setze(s.vorher);
    zustand.zukunft.push(s);
    KE.sichere();
    KE.meldeAenderung("Rückgängig: " + s.name);
  };

  KE.wiederholen = function () {
    const s = zustand.zukunft.pop();
    if (!s) return;
    setze(s.nachher);
    zustand.verlauf.push(s);
    KE.sichere();
    KE.meldeAenderung("Wiederholt: " + s.name);
  };

  /** Alle uids der aktuellen Szene (Objekte und Markierungen). */
  KE.alleUids = function () {
    const s = KE.szene();
    if (!s) return [];
    return ["objekte", "ausloeser", "figuren", "belebung"].flatMap((k) =>
      (s[k] || []).map((o) => o._uid),
    );
  };

  /** Eintrag (Objekt oder Markierung) der aktuellen Szene zu einer uid, mit Liste und Art. */
  KE.finde = function (uid, szene = KE.szene()) {
    for (const liste of ["objekte", "ausloeser", "figuren", "belebung"]) {
      const eintraege = szene[liste] || [];
      const i = eintraege.findIndex((o) => o._uid === uid);
      if (i >= 0) return { liste, index: i, eintrag: eintraege[i] };
    }
    return null;
  };

  /** Sichert den Zwischenstand im Browser; Fehler (voll, gesperrt) erscheinen in der Statuszeile. */
  KE.sichere = function () {
    const geaendert = {};
    for (const d of KE.geaenderteDateien()) geaendert[d] = zustand.bearbeitet[d];
    const stand = {
      version: KE.VERSION,
      paket: zustand.daten.erstellt,
      bearbeitet: geaendert,
      uebergaenge: geaenderteUebergaenge(),
      notizen: zustand.notizen,
      zaehler: zustand.zaehler,
    };
    try {
      localStorage.setItem(SPEICHERSCHLUESSEL, JSON.stringify(stand));
      localStorage.setItem(ZULETZT_SCHLUESSEL, JSON.stringify(zustand.zuletzt));
    } catch (fehler) {
      KE.status("Zwischenstand konnte nicht gesichert werden: " + fehler.message, true);
    }
  };

  function ladeZwischenstand() {
    try {
      const zuletzt = JSON.parse(localStorage.getItem(ZULETZT_SCHLUESSEL) || "[]");
      zustand.zuletzt = zuletzt.filter((k) => zustand.daten.moebel[k]);
      const stand = JSON.parse(localStorage.getItem(SPEICHERSCHLUESSEL) || "null");
      if (!stand) return;
      for (const [d, szene] of Object.entries(stand.bearbeitet || {})) {
        if (zustand.original[d]) zustand.bearbeitet[d] = szene;
      }
      for (const [ort, liste] of Object.entries(stand.uebergaenge || {}))
        if (zustand.uebergaenge[ort]) zustand.uebergaenge[ort] = liste;
      zustand.notizen = stand.notizen || {};
      zustand.zaehler = stand.zaehler || 0;
    } catch (fehler) {
      console.warn("Zwischenstand nicht lesbar", fehler);
    }
  }

  /** Orte, deren Übergänge vom Paket abweichen (Editor 1.4). */
  KE.geaenderteOrte = () =>
    Object.keys(zustand.uebergaenge).filter(
      (o) =>
        JSON.stringify(zustand.uebergaenge[o]) !== JSON.stringify(zustand.uebergaengeOriginal[o]),
    );

  function geaenderteUebergaenge() {
    const ergebnis = {};
    for (const o of KE.geaenderteOrte()) ergebnis[o] = zustand.uebergaenge[o];
    return ergebnis;
  }

  /** Verwirft alle Änderungen (nach Rückfrage in der Oberfläche). */
  KE.allesVerwerfen = function () {
    zustand.bearbeitet = {};
    zustand.uebergaenge = KE.kopie(zustand.uebergaengeOriginal);
    zustand.notizen = {};
    zustand.verlauf = [];
    zustand.zukunft = [];
    zustand.auswahl.clear();
    try {
      localStorage.removeItem(SPEICHERSCHLUESSEL);
    } catch (fehler) {
      KE.status("Sicherung nicht löschbar: " + fehler.message, true);
    }
    KE.meldeAenderung("Alle Änderungen verworfen");
  };

  /** Merkt ein Möbel als zuletzt benutzt (vorn in der Liste). */
  KE.merkeZuletzt = function (kennung) {
    zustand.zuletzt = [kennung, ...zustand.zuletzt.filter((k) => k !== kennung)].slice(
      0,
      ZULETZT_HOECHSTENS,
    );
  };
})(window.KE);
