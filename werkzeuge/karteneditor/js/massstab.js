/*
 * Karteneditor – Kollision skalierter Objekte: Die Standfläche des Katalogs wächst mit dem Bild
 * (Spiegel von pipeline/abenteuer/objektmassstab.py, KARTENREGELN 10.88, 17.11.2026).
 *
 * Warum: Mit `massstab` sperrte der Editor wie früher der Kartenbau nur ganze Kacheln ab der
 * linken oberen Ecke und ließ eine Katalogmaske fallen. Der Kartenbau rechnet jetzt anders; der
 * Editor soll dieselben gesperrten Kacheln zeigen wie das Spiel.
 * Regel: Die Standfläche des ungeskalierten (schon beschnittenen) Bildes, also die `maske` des
 * Katalogs oder die Standardregel (alles unter der obersten Kachelreihe, ohne `frei_unten`), wird
 * wie das Bild skaliert, gespiegelt und gedreht. Im Kachelraster des gesetzten Bildes (angefangene
 * Kacheln rechts und unten zählen mit) sperrt eine Kachel, wenn die Fläche sie zu mehr als einem
 * Viertel deckt. Eine eigene `maske` am Eintrag geht vor und gilt im selben Raster. Ohne Maßstab
 * ändert sich nichts.
 * Lädt nach zuschnitt.js (dessen Zuschnitt wirkt zuerst) und vor fein.js.
 */
"use strict";

(function (KE) {
  const K = 16;
  /** Anteil einer Kachel, den die Standfläche überschreiten muss, damit die Kachel sperrt. */
  const SPERRANTEIL = 0.25;
  /** Spiel für Rundungsfehler der Gleitkommarechnung: genau ein Viertel sperrt nicht. */
  const RUNDUNGSSPIEL = 1e-9;
  const VIERTELDREHUNG = 90;
  const massstabVon = (e) => Number(e.massstab ?? 1);
  /** Spalten und Reihen eines Bildes, angefangene Kacheln zählen mit (objektzuschnitt.raster). */
  const raster = (b, h) => [Math.max(1, Math.ceil(b / K)), Math.max(1, Math.ceil(h / K))];
  const vierteldrehungen = (e) =>
    Math.floor(((((e.drehung || 0) % 360) + 360) % 360) / VIERTELDREHUNG);

  /**
   * Die sperrende Fläche des ungeskalierten Bildes als Rechtecke [links, oben, rechts, unten]
   * (objektmassstab.standflaeche). Mit `maske` je gesperrter Kachel ein Rechteck, auf das Bild
   * begrenzt; sonst die Standardregel als ein Rechteck.
   * Beispiel: Fassade 128 × 144 ohne Maske → [[0, 16, 128, 144]]; mit `frei_unten` 1 →
   * [[0, 16, 128, 128]]. Sonderfall: Ein Bild unter zwei Kacheln Höhe sperrt ab der oberen Kante.
   */
  KE.standflaeche = function (angabe) {
    const { breite, hoehe } = angabe;
    if (angabe.maske) {
      const flaeche = [];
      angabe.maske.forEach((zeile, y) =>
        [...zeile].forEach((zeichen, x) => {
          if (zeichen !== "#" || x * K >= breite || y * K >= hoehe) return;
          flaeche.push([x * K, y * K, Math.min(breite, (x + 1) * K), Math.min(hoehe, (y + 1) * K)]);
        }),
      );
      return flaeche;
    }
    const oben = Math.floor(hoehe / K) > 1 ? K : 0;
    const unten = hoehe - (angabe.frei_unten || 0) * K;
    return unten > oben ? [[0, oben, breite, unten]] : [];
  };

  /**
   * Die Rechtecke so, wie das Bild auf der Karte liegt: skaliert, gespiegelt, dann gedreht
   * (objektmassstab.geformte_flaeche). Der Faktor je Achse folgt der gerundeten Bildgröße, damit
   * die Fläche genau an der Bildkante endet.
   * Beispiel: [0, 16, 128, 144] in 128 × 144 mit `massstab` 1.2 → [0, 19.22, 154, 173].
   */
  KE.geformteFlaeche = function (flaeche, angabe, e) {
    let [breite, hoehe] = KE.wirksameGroesse(angabe.breite, angabe.hoehe, {
      massstab: massstabVon(e),
    });
    const fx = breite / angabe.breite;
    const fy = hoehe / angabe.hoehe;
    let neu = flaeche.map(([x0, y0, x1, y1]) => [x0 * fx, y0 * fy, x1 * fx, y1 * fy]);
    if (e.spiegeln) neu = neu.map(([x0, y0, x1, y1]) => [breite - x1, y0, breite - x0, y1]);
    for (let n = 0; n < vierteldrehungen(e); n++) {
      // Uhrzeigersinn: Der Punkt (x, y) wandert nach (hoehe − y, x), Breite und Höhe tauschen.
      const h = hoehe;
      neu = neu.map(([x0, y0, x1, y1]) => [h - y1, x0, h - y0, x1]);
      [breite, hoehe] = [hoehe, breite];
    }
    return neu;
  };

  /** Von den Rechtecken gedeckte Fläche der Kachel ab (links, oben) in Quadratpixeln. */
  function gedeckt(flaeche, links, oben) {
    let summe = 0;
    for (const [x0, y0, x1, y1] of flaeche) {
      const b = Math.max(0, Math.min(x1, links + K) - Math.max(x0, links));
      const h = Math.max(0, Math.min(y1, oben + K) - Math.max(y0, oben));
      summe += b * h;
    }
    return summe;
  }

  /**
   * Die Maske im Kachelraster eines Bildes breite × hoehe: „#“, wo die Rechtecke eine Kachel zu
   * mehr als einem Viertel decken (objektmassstab.deckmaske).
   * Beispiel: [[0, 16, 20, 40]] in 20 × 40 → ["..", "#.", "#."]: Der Rest rechts (4 Pixel) ist
   * genau ein Viertel und sperrt nicht, der Rest unten (8 Pixel) sperrt.
   */
  KE.deckmaske = function (flaeche, breite, hoehe) {
    const [spalten, reihen] = raster(breite, hoehe);
    const grenze = SPERRANTEIL * K * K + RUNDUNGSSPIEL;
    return Array.from({ length: reihen }, (_, reihe) =>
      Array.from({ length: spalten }, (_, spalte) =>
        gedeckt(flaeche, spalte * K, reihe * K) > grenze ? "#" : ".",
      ).join(""),
    );
  };

  /**
   * Die Sperrmaske eines Objekts mit `massstab`, so wie es auf der Karte liegt
   * (objektmassstab.skalierte_maske). Regel: KARTENREGELN 10.88.
   * Eingaben: Möbelangabe des ungeskalierten Bildes (nach einem Zuschnitt), Szeneneintrag.
   * Ausgabe: Maskenreihen im Raster des gesetzten (gedrehten) Bildes.
   * Beispiel: Eisenwarenladen 128 × 144 mit `massstab` 1.2 → 11 Reihen zu 10 Zeichen, die erste
   * frei, die anderen ganz gesperrt (auch die angefangene Reihe mit der Tür).
   */
  KE.skalierteMaske = function (angabe, e) {
    const flaeche = KE.geformteFlaeche(KE.standflaeche(angabe), angabe, e);
    const [breite, hoehe] = KE.wirksameGroesse(angabe.breite, angabe.hoehe, e);
    return KE.deckmaske(flaeche, breite, hoehe);
  };

  /** Die eigene Maske des Eintrags im Raster des skalierten Bildes, gespiegelt und gedreht. */
  function eigeneMaske(roh, e) {
    const [b, h] = KE.wirksameGroesse(roh.breite, roh.hoehe, { massstab: massstabVon(e) });
    const [spalten, reihen] = raster(b, h);
    return KE.dreheMaske(e.maske, spalten, reihen, e.drehung || 0, !!e.spiegeln);
  }

  const geformtOhne = KE.geformt;
  /**
   * objektform.geformt mit Maßstab: Größe wie bisher, die Maske nach der skalierten Standfläche.
   * Sonderfall: Ein Zuschnitt wirkt zuerst (zuschnitt.js liefert die beschnittene Angabe samt
   * Maske); eine eigene `maske` am Eintrag ersetzt die Rechnung.
   */
  KE.geformt = function (angabe, e) {
    const neu = geformtOhne(angabe, e);
    if (!angabe || massstabVon(e) === 1) return neu;
    const roh = KE.zuschnittVon(e) ? geformtOhne(angabe, { zuschnitt: e.zuschnitt }) : angabe;
    const maske = Array.isArray(e.maske) ? eigeneMaske(roh, e) : KE.skalierteMaske(roh, e);
    return { ...neu, maske };
  };

  const maskenmasseOhne = KE.maskenmasse;
  /** Spalten und Reihen der Maske eines Stücks (kollision.js): skaliert zählen angefangene mit. */
  KE.maskenmasse = (s) => (massstabVon(s.eintrag) === 1 ? maskenmasseOhne(s) : raster(s.b, s.h));
})(window.KE);
