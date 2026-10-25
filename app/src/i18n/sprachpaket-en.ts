/**
 * Die englische Sprachdatei als eigener Baustein (V4, Nutzungsprüfung 25.10.2026).
 *
 * Rolle im Gesamtbild: i18n/sprache.ts lädt ihn erst, wenn Englisch gebraucht wird. Der Name
 * „sprachpaket-en“ wird zum Dateinamen des Bausteins (assets/sprachpaket-en-<hash>.js); daran
 * erkennt der Service Worker, dass er zum englischen Sprachpaket gehört und ihn nicht vorab lädt
 * (sw/dateiliste.ts).
 * Abhängigkeiten: en.json.
 */
import en from "./en.json";

/** Die englischen Texte, Schlüssel → Text. */
const texte: Readonly<Record<string, string>> = en;
export default texte;
