/**
 * Fehler des Abenteuers mit Textschlüssel: Die Meldung für den Spieler kommt aus den Spieltexten
 * der gewählten Sprache, nicht aus dem Code (Dokument 17, Regel 1 und Abschnitt 3, Punkt 3).
 *
 * Rolle im Gesamtbild: Der Paketlader und die Weltdaten werfen `Spielfehler`; die Oberwelt zeigt
 * ihn mit `tSpiel(schluessel, werte)`. Ohne Abhängigkeiten, damit der Paketlader (er läuft auch
 * außerhalb des nachgeladenen Spiels) die Texte nicht mitladen muss.
 * Beispiel: new Spielfehler("fehler.paket.datei", { pfad: "karten/x.json", status: 404 }).
 */
export class Spielfehler extends Error {
  constructor(
    readonly schluessel: string,
    readonly werte: Readonly<Record<string, string | number>> = {},
  ) {
    // Die technische Meldung (Konsole, Fehlerberichte) nennt Schlüssel und Werte.
    super(`${schluessel} ${JSON.stringify(werte)}`);
    this.name = "Spielfehler";
  }
}
