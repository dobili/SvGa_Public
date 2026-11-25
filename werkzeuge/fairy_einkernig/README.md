# Fairy-Stockfish einkernig (Schach-Abenteuer, Varianten)

Variantenengine für Drei-Schach, Atomschach, König der Hügel, Königsrennen, Räuberschach,
Entenschach, Crazyhouse/Tandem, Falke und Bison (seirawan) und den Drachen (eigene variants.ini).

- Quelle: fairy-stockfish/fairy-stockfish.wasm, Stand 718ebc6 (GPL 3), dazu `einkernig.patch`:
  Schalter `SINGLE_THREAD` (Suche synchron, kein std::thread), UCI-Befehle über die exportierte
  Funktion `uci_befehl` statt ASYNCIFY, Stapel 8 MB (die Suche ist tief rekursiv), ohne NNUE
  (klassische Bewertung, etwa 1 MB), ohne große Bretter.
- Bau: `source …/emsdk_env.sh && werkzeuge/fairy_einkernig/bauen.sh` (emscripten 7.0.1 am
  25.11.2026). Ergebnis in `app/public/engine-varianten/`.
- Benutzung wie `stockfish-19-lite-single.js`: `new Worker(".../fairy-stockfish-einkernig.js")`,
  Befehle als Text; `{datei: "/varianten.ini", inhalt}` schreibt eine Datei, danach
  `setoption name VariantPath value /varianten.ini` und `setoption name UCI_Variant value <name>`.
- Geprüft (Node, 500 ms je Zug): 3check, atomic, kingofthehill, racingkings, antichess, duck,
  crazyhouse, bughouse, seirawan, drache, chess; Skill Level wirkt. Etwa 380 000 Knoten je Sekunde.
- Ein „go“ blockiert den Worker bis zum Ende der Suche; „stop“ wirkt deshalb nicht. Immer mit
  movetime, depth oder nodes suchen, nie „go infinite“.
