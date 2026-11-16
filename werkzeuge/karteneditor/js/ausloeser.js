/*
 * Karteneditor – Übergänge und Auslöser anlegen und ändern:
 * - „Übergang hier“: eine Kopie eines bestehenden Auslösers der Karte („wie Übergang X“) auf die
 *   nächste angeklickte Kachel (seit 1.1).
 * - „Neuer Übergang“ (seit 1.4): Name, Zielkarte und Zielauslöser frei wählen (Feld in
 *   uebergangsfeld.js); Kachel anklicken oder über Kacheln ziehen. Mit „neuen Gegenauslöser
 *   anlegen“ öffnet der Editor danach die Zielkarte, der Autor klickt die Stelle dort an, und beide
 *   Seiten verweisen aufeinander. Neue Felder kommen auch in die Zustandsfassungen der Karte.
 * - Ziel, Durchgangsrichtung und festes Ankunftsfeld eines Übergangs ändern, Übergang entfernen.
 * Duplizieren (Strg+D) und Löschen (Entf) eines Auslösers stehen in markierungen.js.
 *
 * Warum: Der Autor baut Treppenabgänge und Durchgänge selbst (Wunsch des Autors, 16.11.2026). Typ
 * und Ziel eines Übergangs stehen in orte.json unter seinem Namen (uebergaenge.js); ein Auslöser
 * gleichen Namens auf einer weiteren Kachel verbreitert ihn. Eigenschaften am Auslöser: durchgang
 * (Richtung in den Durchgang), ankunft („x,y“) und blick (ankunft.js).
 */
"use strict";

(function (KE) {
  const K = 16;

  /** Die verschiedenen Auslöser der Karte als Vorlagen (je Name und Eigenschaften einmal). */
  function vorlagen(szene) {
    const gesehen = new Map();
    for (const a of szene.ausloeser || []) {
      const schluessel = JSON.stringify([a.name, a.eigenschaften || null, !!a.auf_moebel]);
      if (!gesehen.has(schluessel)) gesehen.set(schluessel, a);
    }
    return [...gesehen.values()];
  }
  KE.ausloeservorlagen = vorlagen;

  /** Startet „Übergang hier“: Der nächste Klick in die Karte setzt die Kopie der Vorlage. */
  KE.uebergangHier = function (name) {
    KE.zustand.uebergangVorlage = name;
    KE.zustand.kollisionUid = KE.zustand.kpinsel = KE.zustand.setzen = null;
    KE.meldeAenderung(
      `Kachel anklicken: dort entsteht ein Auslöser wie „${name}“ (Esc bricht ab).`,
    );
  };

  /** Klick in die Karte im Modus „Übergang hier“. */
  KE.setzeUebergang = function (px, py) {
    const z = KE.zustand;
    const szene = KE.szene();
    const vorlage = vorlagen(szene).find((a) => a.name === z.uebergangVorlage);
    z.uebergangVorlage = null;
    if (!vorlage) return KE.meldeAenderung();
    const neu = { ...KE.kopie(vorlage), feld: [Math.floor(px / K), Math.floor(py / K)] };
    neu._uid = KE.neueUid();
    KE.schritt("Übergang hier", [z.datei], () => {
      szene.ausloeser.push(neu);
      z.auswahl = new Set([neu._uid]);
    });
  };

  /** Setzt oder entfernt eine Eigenschaft eines Auslösers (leere Eigenschaften entfallen). */
  function eigenschaft(a, schluessel, wert) {
    a.eigenschaften = { ...(a.eigenschaften || {}) };
    if (wert === null || wert === undefined || wert === "") delete a.eigenschaften[schluessel];
    else a.eigenschaften[schluessel] = wert;
    if (!Object.keys(a.eigenschaften).length) delete a.eigenschaften;
  }

  /** Die Datei und ihre Zustandsfassungen (dieselbe Karte in anderem Zustand). */
  const mitFassungen = (datei) => [datei, ...(KE.zustand.nachDatei[datei]?.geschwister || [])];

  /** Wendet tu(auslöser) auf alle Felder `name` der Datei und ihrer Fassungen an. */
  function jedesFeld(datei, name, tu) {
    for (const d of mitFassungen(datei))
      for (const a of KE.szene(d).ausloeser || []) if (a.name === name) tu(a);
  }

  /** Legt Auslöser `name` auf die Felder (Datei und Fassungen); gibt die uids in der Datei zurück. */
  function legeAn(datei, name, felder, durchgang) {
    let uids = [];
    for (const d of mitFassungen(datei)) {
      const szene = KE.szene(d);
      szene.ausloeser ??= [];
      const neu = felder.map((feld) => {
        const a = { name, feld: [...feld], _uid: KE.neueUid() };
        if (durchgang) a.eigenschaften = { durchgang };
        return a;
      });
      szene.ausloeser.push(...neu);
      if (d === datei) uids = neu.map((a) => a._uid);
    }
    return uids;
  }

  /**
   * Startet einen Setzmodus. auftrag: { art: "neu", name, zielkarte, zielausloeser, gegen,
   * durchgang, rueckweg } | { art: "gegen", name, ziel } | { art: "ankunft", name }.
   */
  KE.starteSetzen = function (auftrag) {
    const z = KE.zustand;
    z.setzen = { ...auftrag, felder: [] };
    z.uebergangVorlage = z.kollisionUid = z.kpinsel = null;
    const was =
      auftrag.art === "ankunft"
        ? `das Ankunftsfeld für „${auftrag.name}“`
        : `„${auftrag.name}“ (ziehen für mehrere Kacheln)`;
    KE.meldeAenderung(`Kachel anklicken: ${was}. Esc bricht ab.`);
  };

  /** Maus gedrückt im Setzmodus; Ausgabe: Zustand des Ziehens für bedienung.js (oder null). */
  KE.setzenStart = function (px, py) {
    const z = KE.zustand;
    const feld = [Math.floor(px / K), Math.floor(py / K)];
    if (z.setzen.art === "ankunft") {
      const name = z.setzen.name;
      z.setzen = null;
      KE.schritt("Ankunftsfeld", mitFassungen(z.datei), () =>
        jedesFeld(z.datei, name, (a) => eigenschaft(a, "ankunft", feld.join(","))),
      );
      KE.status(`Ankunftsfeld für „${name}“: (${feld.join(", ")}).`);
      return null;
    }
    z.setzen.felder = [feld];
    KE.zeichne();
    return { art: "setzen", letzte: feld };
  };

  /** Maus bewegt: jede überstrichene Kachel kommt dazu (auch bei schnellen Bewegungen). */
  KE.setzenZiehen = function (ziehen, px, py) {
    const felder = KE.zustand.setzen?.felder;
    if (!felder) return;
    const [x, y] = [Math.floor(px / K), Math.floor(py / K)];
    const [ax, ay] = ziehen.letzte;
    const schritte = Math.max(Math.abs(x - ax), Math.abs(y - ay), 1);
    for (let i = 1; i <= schritte; i++) {
      const f = [
        Math.round(ax + ((x - ax) * i) / schritte),
        Math.round(ay + ((y - ay) * i) / schritte),
      ];
      if (!felder.some((g) => g[0] === f[0] && g[1] === f[1])) felder.push(f);
    }
    ziehen.letzte = [x, y];
    KE.zeichne();
  };

  /** Maus losgelassen: legt den Übergang (oder den Gegenauslöser) als einen Schritt an. */
  KE.setzenEnde = function () {
    const z = KE.zustand;
    const s = z.setzen;
    if (!s || !s.felder.length) return;
    const datei = z.datei;
    const karte = KE.szene().karte;
    z.setzen = null;
    if (s.art === "gegen") {
      KE.schritt("Gegenauslöser", [...mitFassungen(datei), KE.ORTE], () => {
        z.auswahl = new Set(legeAn(datei, s.name, s.felder, null));
        KE.setzeZiel(karte, s.name, s.ziel);
      });
      return KE.status(
        `Übergang angelegt: „${s.name}“ und „${s.ziel.ausloeser}“ verweisen aufeinander.`,
      );
    }
    const zielname = s.gegen || s.zielausloeser;
    KE.schritt("Neuer Übergang", [...mitFassungen(datei), KE.ORTE], () => {
      z.auswahl = new Set(legeAn(datei, s.name, s.felder, s.durchgang));
      KE.setzeZiel(karte, s.name, { karte: s.zielkarte, ausloeser: zielname });
      if (!s.gegen && s.rueckweg)
        KE.setzeZiel(s.zielkarte, s.zielausloeser, { karte, ausloeser: s.name });
    });
    if (!s.gegen)
      return KE.status(`Übergang „${s.name}“ führt nach ${KE.kartenname(s.zielkarte)}.`);
    KE.oeffne(KE.grunddatei(s.zielkarte));
    KE.starteSetzen({ art: "gegen", name: s.gegen, ziel: { karte, ausloeser: s.name } });
    KE.status(
      `${KE.kartenname(s.zielkarte)}: Stelle für den Gegenauslöser „${s.gegen}“ anklicken.`,
    );
  };

  /** Neues Ziel für den Übergang `name` der aktuellen Karte (mit Rückweg: auch die Gegenseite). */
  KE.aendereZiel = function (name, ziel, rueckweg) {
    const karte = KE.szene().karte;
    KE.schritt("Ziel ändern", [KE.ORTE], () => {
      KE.setzeZiel(karte, name, ziel);
      if (rueckweg) KE.setzeZiel(ziel.karte, ziel.ausloeser, { karte, ausloeser: name });
    });
  };

  /** Durchgangsrichtung der ausgewählten Auslöser (leer: entfernen). */
  KE.setzeDurchgang = function (richtung) {
    const z = KE.zustand;
    const felder = KE.ausgewaehlt().filter((t) => t.liste === "ausloeser");
    const stellen = new Set(felder.map((t) => t.eintrag.name + "@" + t.eintrag.feld.join(",")));
    KE.schritt("Durchgang", mitFassungen(z.datei), () => {
      for (const d of mitFassungen(z.datei))
        for (const a of KE.szene(d).ausloeser || [])
          if (stellen.has(a.name + "@" + a.feld.join(","))) eigenschaft(a, "durchgang", richtung);
    });
  };

  /** Blick bei der Ankunft (leer: vom Durchgang weg) für alle Felder des Übergangs. */
  KE.setzeBlick = function (name, blick) {
    const datei = KE.zustand.datei;
    KE.schritt("Blick", mitFassungen(datei), () =>
      jedesFeld(datei, name, (a) => eigenschaft(a, "blick", blick)),
    );
  };

  /** „Ankunft automatisch“: entfernt festes Feld und Blick. */
  KE.ankunftAutomatisch = function (name) {
    const datei = KE.zustand.datei;
    KE.schritt("Ankunft automatisch", mitFassungen(datei), () =>
      jedesFeld(
        datei,
        name,
        (a) => (eigenschaft(a, "ankunft", null), eigenschaft(a, "blick", null)),
      ),
    );
  };

  /** Entfernt alle Felder des Übergangs (auch in den Fassungen) und seine Definition dieser Karte. */
  KE.entferneUebergang = function (name) {
    const z = KE.zustand;
    const karte = KE.szene().karte;
    KE.schritt("Übergang entfernen", [...mitFassungen(z.datei), KE.ORTE], () => {
      for (const d of mitFassungen(z.datei)) {
        const szene = KE.szene(d);
        szene.ausloeser = (szene.ausloeser || []).filter((a) => a.name !== name);
      }
      KE.entferneZiel(karte, name);
      z.auswahl.clear();
    });
  };
})(window.KE);
