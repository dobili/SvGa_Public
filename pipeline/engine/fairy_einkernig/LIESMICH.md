# Fairy-Stockfish einkernig (Schachvarianten)

Fairy-Stockfish spielt die Varianten des Schach-Abenteuers (Drei-Schach, Atomschach, König der
Hügel, Königsrennen, Räuberschach, dazu Märchenfiguren und Ente). Das fertige npm-Paket
`fairy-stockfish-nnue.wasm` braucht Threads (SharedArrayBuffer, COOP/COEP-Kopfzeilen), die GitHub
Pages nicht setzt. Die App rechnet auf einem Kern (Entscheidung vom 13.10.2026). Deshalb wird die
Engine hier selbst gebaut.

- Quelle: `fairy-stockfish/fairy-stockfish.wasm` (Zweig nnue), Commit
  `718ebc6801702408f6650598cc52bcf87946696c` (19.11.2026), GPL 3.
- `einkernig.patch`: Schalter `SINGLE_THREAD`. Es startet kein Thread; `Thread::start_searching()`
  führt die Suche synchron aus, „Threads“ ist fest 1. Make-Variable `einkernig=yes` baut ohne
  pthreads und PROXY_TO_PTHREAD, mit `preamble-einkernig.js`: `postMessage` legt den Befehl direkt
  in die Warteschlange, aus der der UCI-Loop über ASYNCIFY liest.
- Bau: `source …/emsdk_env.sh`, dann `pipeline/engine/fairy_einkernig/bauen.sh [ZIEL]`. Vorgabe
  für das Ziel ist `app/public/engine/fairy/`. Am Ende rechnet `pruefe.mjs` je Variante einen Zug.

Grenzen des einkernigen Betriebs:

- Die Suche blockiert den Worker, solange sie rechnet. Deshalb immer mit Grenze rechnen
  (`go movetime …`, `go depth …` oder `go nodes …`), nie `go infinite`; `stop` wirkt erst danach.
- NNUE ist aus (`embedded_nnue=no`); die Anbindung sendet `setoption name Use NNUE value false`.
  Für die Stärken der Begegnungen (Leser bis etwa 2000) genügt die klassische Bewertung.
