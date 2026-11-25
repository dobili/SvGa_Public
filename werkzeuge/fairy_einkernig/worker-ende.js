// Worker-Hülle der einkernigen Fairy-Stockfish (Schach-Abenteuer, Varianten). Angehängt an das
// Ergebnis des emscripten-Baus (bauen.sh), damit die Datei selbst als Worker läuft wie
// stockfish-19-lite-single.js: Befehle als Text per postMessage hinein, jede Zeile der Engine als
// Text heraus. Zusätzlich {datei, inhalt} schreibt eine Datei ins Dateisystem der Engine (etwa
// /varianten.ini für eigene Varianten wie den Drachen). Befehle vor dem Start werden gesammelt.
if (typeof self !== "undefined" && typeof importScripts === "function") {
  var wartend = [];
  var engine = null;
  var verarbeite = function (daten) {
    if (typeof daten === "string") engine.postMessage(daten);
    else if (daten && typeof daten.datei === "string")
      engine.FS.writeFile(daten.datei, daten.inhalt);
  };
  self.onmessage = function (e) {
    if (engine) verarbeite(e.data);
    else wartend.push(e.data);
  };
  Stockfish({
    locateFile: function (pfad) {
      return (
        self.location.href.replace(/[^/]*$/, "") +
        pfad.replace("stockfish.wasm", "fairy-stockfish-einkernig.wasm")
      );
    },
  }).then(function (sf) {
    sf.addMessageListener(function (zeile) {
      self.postMessage(zeile);
    });
    engine = sf;
    wartend.forEach(verarbeite);
    wartend = [];
  });
}
