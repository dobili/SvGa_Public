/**
 * „Was jetzt?“ im Tagebuch: ein Hinweis auf den nächsten Schritt, wenn gerade keine Quest läuft.
 *
 * Warum: Im Spieltest „einstieg“ (15.11.2026, Kind von 11 Jahren ohne Rollenspielerfahrung) stand
 * nach dem Abend mit Mama im Tagebuch nur „Gerade nichts. Ich sehe mich um.“, obwohl die Geschichte
 * weitergeht (die Nacht mit Ambrose, dann Juno an der Bushaltestelle und der Club in der Schule).
 * Zwischen diesen Szenen läuft keine Quest; gute Einsteigerspiele lassen den Spieler dort nie ohne
 * Ziel. Der Hinweis sagt, wohin, in der Stimme des Tagebuchs (ich).
 * Rolle im Gesamtbild: Reine Funktion über den Dialogvariablen des Spielstands; oberwelt/Tagebuch.tsx
 * zeigt den Text unter „Das habe ich vor“, wenn die Liste leer ist.
 * Abhängigkeiten: keine.
 */

/** Dialogvariablen des Spielstands (Abenteuerstand.dialogvariablen). */
type Variablen = Readonly<Record<string, number | string | boolean>>;

/**
 * Der Textschlüssel des Hinweises für die Lücke zwischen zwei Quests, oder null (dann bleibt es bei
 * „Gerade nichts“).
 * Eingaben: die Dialogvariablen. Ausgabe: Schlüssel in texte/de.json.
 * Beispiel: nach dem Abend mit Mama (ersterAbendGesehen) und vor der Nacht →
 * „tagebuch.wasJetzt.ersteNacht“; nach der Nacht, Juno noch nicht getroffen →
 * „tagebuch.wasJetzt.juno“; Juno getroffen, Club noch nicht → „tagebuch.wasJetzt.club“.
 * Sonderfall: Ab dem Beitritt zum Club führen Quests weiter, dann null.
 */
export function wasJetzt(variablen: Variablen): string | null {
  if (!variablen["ersterAbendGesehen"]) return null;
  if (!variablen["ersteNachtGesehen"]) return "tagebuch.wasJetzt.ersteNacht";
  if (variablen["clubBeigetreten"]) return null;
  return variablen["junoGetroffen"] ? "tagebuch.wasJetzt.club" : "tagebuch.wasJetzt.juno";
}
