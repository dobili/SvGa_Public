/**
 * Alle Varianten der App angemeldet (Auftrag des Hauptchats, 26.11.2026): Wer eine Variante baut,
 * trägt ihre Datei hier mit einer Zeile ein. Speicher, Partie und Spielhülle importieren diese Datei
 * und sehen so jede angemeldete Variante, egal wo sie gebaut wurde.
 * Abhängigkeiten: die Variantenmodule (jedes meldet sich beim Laden an).
 */
import "./standardvarianten";
import "./maerchenfiguren";
// Sonderformen Nebel, Ente, Tandem (mittel-4; Partiekomponenten in abenteuer/varianten).
import "../../abenteuer/varianten/sonderformen";

export { alleVarianten, varianteVon } from "./variante";
