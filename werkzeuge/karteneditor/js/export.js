/*
 * Karteneditor – Herunterladen der Änderungen: eine JSON-Datei mit allen bearbeiteten Szenen in
 * voller Fassung (vorher und nachher), Editor-Version, Zeitstempel und Notizen.
 *
 * Warum: Der Autor lädt die Datei im privaten Repository in editor/rueck/ hoch; der Rücklauf
 * (python -m pipeline.abenteuer.editorrueck DATEI.json) schreibt die Szenen zurück, berichtet je
 * Karte und baut sie neu. Die Originale im Paket bleiben unverändert.
 *
 * Format (Fassung 1):
 * { "format": "karteneditor-aenderungen", "fassung": 1, "editor_version", "zeitstempel",
 *   "paket_erstellt", "szenen": [ { "datei", "karte", "notiz", "vorher", "nachher",
 *   "zuordnung": [Index im Vorher oder null je Objekt im Nachher], "markierungen": { "ausloeser":
 *   [dasselbe je Auslöser], "figuren", "belebung" } (seit 1.1), "objektnotizen": [{ "index",
 *   "moebel", "notiz" }] } ] }
 */
"use strict";

(function (KE) {
  KE.FORMAT = "karteneditor-aenderungen";

  /** Index im Original zu jedem Objekt der bearbeiteten Szene (null = neu). */
  function zuordnung(szene) {
    return (szene.objekte || []).map((o) =>
      o._uid && o._uid[0] === "o" ? Number(o._uid.slice(1)) : null,
    );
  }

  /**
   * Index im Original je Auslöser, Figur und Belebung (null = neu, etwa „Übergang hier“), damit der
   * Rücklauf neue und gelöschte Auslöser nennt. Kennungen: a3, f0, b2 (zustand.js, vergibUids).
   */
  function markierungen(szene) {
    const zuordnungen = {};
    for (const [liste, buchstabe] of [
      ["ausloeser", "a"],
      ["figuren", "f"],
      ["belebung", "b"],
    ]) {
      zuordnungen[liste] = (szene[liste] || []).map((o) =>
        o._uid && o._uid[0] === buchstabe ? Number(o._uid.slice(1)) : null,
      );
    }
    return zuordnungen;
  }

  /** Die Änderungsdatei als Objekt (auch für den Test). */
  KE.aenderungen = function () {
    const z = KE.zustand;
    const szenen = KE.geaenderteDateien().map((datei) => {
      const nachher = z.bearbeitet[datei];
      const notizen = z.notizen[datei] || { karte: "", objekte: {} };
      const objektnotizen = (nachher.objekte || [])
        .map((o, index) => ({ index, moebel: o.moebel, notiz: notizen.objekte?.[o._uid] || "" }))
        .filter((n) => n.notiz.trim());
      return {
        datei,
        karte: nachher.karte,
        notiz: notizen.karte || "",
        vorher: KE.ohneUids(z.original[datei]),
        nachher: KE.ohneUids(nachher),
        zuordnung: zuordnung(nachher),
        markierungen: markierungen(nachher),
        objektnotizen,
      };
    });
    return {
      format: KE.FORMAT,
      fassung: 1,
      editor_version: KE.VERSION,
      zeitstempel: new Date().toISOString(),
      paket_erstellt: z.daten.erstellt,
      szenen,
    };
  };

  /** Lädt die Änderungen als Datei herunter (karteneditor-aenderungen-JJJJ-MM-TT-HHMM.json). */
  KE.herunterladen = function () {
    const daten = KE.aenderungen();
    if (!daten.szenen.length) return KE.status("Noch keine Änderungen zum Herunterladen.");
    const jetzt = new Date();
    const zwei = (n) => String(n).padStart(2, "0");
    const name =
      `karteneditor-aenderungen-${jetzt.getFullYear()}-${zwei(jetzt.getMonth() + 1)}-` +
      `${zwei(jetzt.getDate())}-${zwei(jetzt.getHours())}${zwei(jetzt.getMinutes())}.json`;
    const blob = new Blob([JSON.stringify(daten, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = name;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    KE.status(
      `${name} mit ${daten.szenen.length} Karte(n) heruntergeladen. Bitte in editor/rueck/ hochladen.`,
    );
  };
})(window.KE);
