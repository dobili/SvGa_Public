/*
 * Karteneditor – Bearbeiten: Verschieben, Drehen, Spiegeln, Skalieren, Ebene, Duplizieren,
 * Löschen, Hinzufügen, Pinsel und Übertragen auf Zustandsfassungen. Jede Bearbeitung wirkt auf
 * die ganze Auswahl (Wunsch des Autors, 15.11.2026) und ist ein Schritt im Verlauf.
 *
 * Felder in der Szene (Format: inhalte/abenteuer/szenen/README.md, neu: objektform.py):
 * feld [x, y] in Kacheln, versatz [dx, dy] in Pixeln, drehung 0/90/180/270, spiegeln, massstab,
 * ebene (Verschiebung der Tiefe). Standardwerte werden weggelassen, damit die Datei schlank bleibt.
 */
"use strict";

(function (KE) {
  const K = 16;
  const MASSSTAB_MIN = 0.5;
  const MASSSTAB_MAX = 3;

  /** Die ausgewählten Einträge der aktuellen Szene (Objekte und Markierungen). */
  KE.ausgewaehlt = function () {
    return [...KE.zustand.auswahl].map((u) => KE.finde(u)).filter(Boolean);
  };
  const objekte = () => KE.ausgewaehlt().filter((t) => t.liste === "objekte");

  function aufraeumen(e) {
    if (e.versatz && !e.versatz[0] && !e.versatz[1]) delete e.versatz;
    if (!e.drehung) delete e.drehung;
    if (!e.spiegeln) delete e.spiegeln;
    if (e.massstab === undefined || Number(e.massstab) === 1) delete e.massstab;
    if (!e.ebene) delete e.ebene;
  }

  /**
   * Lage eines Eintrags um (dx, dy) Pixel gegenüber einem Ausgangsstand ändern.
   * Ganze Kacheln gehen ins feld, der Rest in den versatz; Gegenstände „auf“ einem anderen und
   * Markierungen kennen nur eines von beiden.
   */
  KE.setzeLage = function (e, start, dx, dy) {
    if (e.auf !== undefined) {
      const [vx, vy] = start.versatz || [0, 0];
      e.versatz = [vx + dx, vy + dy];
    } else if (e.moebel === undefined) {
      e.feld = [start.feld[0] + Math.round(dx / K), start.feld[1] + Math.round(dy / K)];
    } else {
      const kx = Math.round(dx / K);
      const ky = Math.round(dy / K);
      const [vx, vy] = start.versatz || [0, 0];
      e.feld = [start.feld[0] + kx, start.feld[1] + ky];
      e.versatz = [vx + dx - kx * K, vy + dy - ky * K];
    }
    aufraeumen(e);
  };

  /** Belebung: Laufweg (von, bis) mitnehmen, wenn er auf dem alten Feld lag. */
  function belebungMitnehmen(t, altesFeld) {
    const eig = t.eintrag.eigenschaften;
    if (t.liste !== "belebung" || !eig) return;
    const alt = altesFeld.join(",");
    for (const k of ["von", "bis"]) if (eig[k] === alt) eig[k] = t.eintrag.feld.join(",");
  }

  /** Verschiebt die Auswahl um (dx, dy) Pixel (Pfeile, Schaltflächen). */
  KE.verschiebe = function (dx, dy) {
    const auswahl = KE.ausgewaehlt();
    if (!auswahl.length) return;
    KE.schritt("Verschieben", [KE.zustand.datei], () => {
      for (const t of auswahl) {
        const alt = t.eintrag.feld ? [...t.eintrag.feld] : null;
        // Markierungen bewegen sich nur in ganzen Kacheln (ein Pfeildruck = eine Kachel).
        const kachel = (d) => (t.liste === "objekte" || d % K === 0 ? d : Math.sign(d) * K);
        KE.setzeLage(t.eintrag, KE.kopie(t.eintrag), kachel(dx), kachel(dy));
        if (alt) belebungMitnehmen(t, alt);
      }
    });
  };
  KE.belebungMitnehmen = belebungMitnehmen;

  /** Dreht die ausgewählten Objekte um 90 Grad (richtung +1 im, -1 gegen den Uhrzeigersinn). */
  KE.drehe = function (richtung) {
    const auswahl = objekte();
    if (!auswahl.length) return;
    KE.schritt("Drehen", [KE.zustand.datei], () => {
      for (const t of auswahl) {
        t.eintrag.drehung = ((((t.eintrag.drehung || 0) + 90 * richtung) % 360) + 360) % 360;
        aufraeumen(t.eintrag);
      }
    });
  };

  KE.spiegele = function () {
    const auswahl = objekte();
    if (!auswahl.length) return;
    KE.schritt("Spiegeln", [KE.zustand.datei], () => {
      for (const t of auswahl) {
        t.eintrag.spiegeln = !t.eintrag.spiegeln;
        aufraeumen(t.eintrag);
      }
    });
  };

  /** Setzt den Maßstab (Faktor) oder ändert ihn um einen Schritt (relativ). */
  KE.skaliere = function (wert, relativ = false) {
    const auswahl = objekte();
    if (!auswahl.length || !Number.isFinite(wert)) return;
    KE.schritt("Skalieren", [KE.zustand.datei], () => {
      for (const t of auswahl) {
        const neu = relativ ? Number(t.eintrag.massstab ?? 1) + wert : wert;
        t.eintrag.massstab =
          Math.round(Math.min(MASSSTAB_MAX, Math.max(MASSSTAB_MIN, neu)) * 100) / 100;
        aufraeumen(t.eintrag);
      }
    });
  };

  /**
   * Ebene: „vorn“ (+1), „hinten“ (-1), „ganzVorn“, „ganzHinten“. Die Ebene verschiebt die Tiefe
   * des Kartenbaus so, dass das Objekt am nächsten (oder an allen) überlappenden Nachbarn vorbei
   * nach vorn oder hinten kommt; ohne Nachbarn um 1.
   */
  KE.ebene = function (wie) {
    const auswahl = objekte();
    if (!auswahl.length) return;
    KE.schritt("Ebene", [KE.zustand.datei], () => {
      for (const t of auswahl) {
        const stuecke = KE.platziere(KE.szene());
        const ich = stuecke.find((s) => s.uid === t.eintrag._uid);
        if (!ich) continue;
        const nachbarn = stuecke.filter(
          (s) =>
            !KE.zustand.auswahl.has(s.uid) &&
            s.x < ich.x + ich.b &&
            s.x + s.b > ich.x &&
            s.y < ich.y + ich.h &&
            s.y + s.h > ich.y,
        );
        const pos = stuecke.indexOf(ich);
        const davor = nachbarn.filter((s) => stuecke.indexOf(s) > pos);
        const dahinter = nachbarn.filter((s) => stuecke.indexOf(s) < pos);
        let ziel = ich.tiefe;
        if (wie === "vorn") ziel = davor.length ? davor[0].tiefe + 1 : ich.tiefe + 1;
        if (wie === "hinten") ziel = dahinter.length ? dahinter.at(-1).tiefe - 1 : ich.tiefe - 1;
        if (wie === "ganzVorn") ziel = Math.max(ich.tiefe, ...davor.map((s) => s.tiefe + 1));
        if (wie === "ganzHinten") ziel = Math.min(ich.tiefe, ...dahinter.map((s) => s.tiefe - 1));
        t.eintrag.ebene = (t.eintrag.ebene || 0) + ziel - ich.tiefe;
        aufraeumen(t.eintrag);
      }
    });
  };

  /** Neue, eindeutige id für eine Kopie (Beispiel: „tisch“ → „tisch_2“). */
  function neueId(szene, id) {
    const vorhanden = new Set((szene.objekte || []).map((o) => o.id).filter(Boolean));
    let n = 2;
    while (vorhanden.has(`${id}_${n}`)) n++;
    return `${id}_${n}`;
  }

  /** Kopien der ausgewählten Objekte als Gruppe (innerhalb von KE.schritt); Ausgabe: neue uids. */
  function kopiereObjekte(szene, auswahl) {
    const ids = {};
    const neu = auswahl.map((t) => {
      const kopie = KE.kopie(t.eintrag);
      kopie._uid = KE.neueUid();
      if (kopie.id) {
        ids[kopie.id] = neueId(szene, kopie.id);
        kopie.id = ids[kopie.id];
      }
      return kopie;
    });
    for (const kopie of neu) {
      if (kopie.auf !== undefined && ids[kopie.auf]) kopie.auf = ids[kopie.auf];
      else KE.setzeLage(kopie, KE.kopie(kopie), K, K);
      szene.objekte.push(kopie);
    }
    return neu.map((k) => k._uid);
  }

  /**
   * Dupliziert die Auswahl: Objekte als Gruppe (Abstände bleiben, eine Kachel nach rechts unten;
   * was auf einem mitkopierten Möbel steht, steht danach auf der Kopie), Auslöser, Figuren und
   * Belebung eine Kachel rechts daneben (markierungen.js). Danach sind die Kopien ausgewählt.
   */
  KE.dupliziere = function () {
    const auswahl = objekte();
    const marken = KE.markierungenAusgewaehlt();
    if (!auswahl.length && !marken.length) return;
    const szene = KE.szene();
    KE.schritt("Duplizieren", [KE.zustand.datei], () => {
      const neu = [...kopiereObjekte(szene, auswahl), ...KE.kopiereMarkierungen(szene, marken)];
      KE.zustand.auswahl = new Set(neu);
    });
  };

  /**
   * Löscht die ausgewählten Objekte und was auf ihnen steht, dazu ausgewählte Auslöser, Figuren und
   * Belebung; Figuren und Belebung nur nach Rückfrage (sie gehören zur Handlung, markierungen.js).
   */
  KE.loesche = function () {
    const szene = KE.szene();
    const marken = KE.markierungenAusgewaehlt();
    const weg = new Set([...objekte(), ...marken].map((t) => t.eintrag._uid));
    if (!weg.size) return;
    if (!KE.frageLoeschen(marken)) return KE.status("Nicht gelöscht.");
    KE.schritt("Löschen", [KE.zustand.datei], () => {
      KE.entferneMarkierungen(szene, weg);
      let mehr = true;
      while (mehr) {
        mehr = false;
        const ids = new Set(
          (szene.objekte || []).filter((o) => weg.has(o._uid) && o.id).map((o) => o.id),
        );
        for (const o of szene.objekte || [])
          if (o.auf !== undefined && ids.has(o.auf) && !weg.has(o._uid))
            (weg.add(o._uid), (mehr = true));
      }
      szene.objekte = (szene.objekte || []).filter((o) => !weg.has(o._uid));
      KE.zustand.auswahl.clear();
    });
  };

  /** Fügt ein Möbel der Bibliothek ein, mittig um den Punkt (Kartenpixel). */
  KE.fuegeEin = function (kennung, px, py) {
    const angabe = KE.zustand.daten.moebel[kennung];
    if (!angabe || !KE.zustand.datei) return;
    const eintrag = {
      moebel: kennung,
      feld: [Math.round((px - angabe.breite / 2) / K), Math.round((py - angabe.hoehe / 2) / K)],
      _uid: KE.neueUid(),
    };
    KE.schritt("Hinzufügen", [KE.zustand.datei], () => {
      const szene = KE.szene();
      szene.objekte = szene.objekte || [];
      szene.objekte.push(eintrag);
      KE.zustand.auswahl = new Set([eintrag._uid]);
    });
    KE.merkeZuletzt(kennung);
    KE.sichere();
  };

  /** Pinsel: setzt ein Feld des Rasters auf ein Zeichen (Boden, Wand, Wasser). */
  KE.male = function (szene, x, y, zeichen) {
    const zeilen = szene.raster;
    if (y < 0 || y >= zeilen.length || x < 0 || x >= zeilen[y].length) return false;
    if (zeilen[y][x] === zeichen) return false;
    zeilen[y] = zeilen[y].slice(0, x) + zeichen + zeilen[y].slice(x + 1);
    return true;
  };

  const LAGEFELDER = ["feld", "versatz", "drehung", "spiegeln", "massstab", "ebene"].concat(
    ["kollision", "maske", "begehbar_grund"], // Kollision je Objekt (kollision.js)
  );
  const VERGLEICH = ["moebel", "feld", "versatz", "auf", "an_wand", "id"];
  const schluessel = (e) => JSON.stringify(VERGLEICH.map((k) => e[k] ?? null));

  /**
   * Überträgt die ausgewählten Objekte auf die Zustandsfassungen der Karte: Ein Objekt, das dort
   * genauso lag wie hier im Original, bekommt Lage und Form von hier; neu hinzugefügte Objekte
   * werden dort ebenfalls angelegt. Die Kacheln des Kollisionspinsels kommen mit (pinsel.js).
   * Ausgabe: { objekte, kacheln } (Zahl der übertragenen Objekte und Pinseländerungen).
   */
  KE.uebertrage = function () {
    const z = KE.zustand;
    const geschwister = z.nachDatei[z.datei].geschwister;
    const auswahl = objekte();
    let zahl = 0;
    let kacheln = 0;
    if (!geschwister.length) return { objekte: 0, kacheln };
    KE.schritt("Auf Fassungen übertragen", [z.datei, ...geschwister], () => {
      for (const d of geschwister) {
        const andere = KE.szene(d);
        kacheln += KE.pinselUebertragen(andere);
        andere.objekte = andere.objekte || [];
        const benutzt = new Set();
        for (const t of auswahl) {
          const uid = t.eintrag._uid;
          const vorher = uid[0] === "o" ? z.original[z.datei].objekte[Number(uid.slice(1))] : null;
          if (!vorher) {
            andere.objekte.push({ ...KE.kopie(t.eintrag), _uid: KE.neueUid() });
            zahl++;
            continue;
          }
          const ziel = andere.objekte.find(
            (o) => !benutzt.has(o._uid) && schluessel(o) === schluessel(vorher),
          );
          if (!ziel) continue;
          benutzt.add(ziel._uid);
          for (const k of LAGEFELDER) {
            if (t.eintrag[k] === undefined) delete ziel[k];
            else ziel[k] = KE.kopie(t.eintrag[k]);
          }
          zahl++;
        }
      }
    });
    return { objekte: zahl, kacheln };
  };
})(window.KE);
