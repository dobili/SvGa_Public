/**
 * Wartet, bis der Browser das nächste Bild gezeichnet hat.
 *
 * Rolle im Gesamtbild: Nach einem Tipp zeichnet die App zuerst eine kleine Rückmeldung (goldener
 * Strich in der Leiste, „Partie beginnen“ gedrückt) und erst danach den schweren neuen
 * Bildschirm; ebenso baut sie den Eröffnungsindex erst nach dem Bild (V6, Nutzungsprüfung
 * 25.10.2026). Gemessen (CPU 4×): Ohne dieses Warten zeigte der Browser bis zu 0,2 s lang gar
 * nichts.
 * Abhängigkeiten: keine.
 */

/**
 * Erfüllt sich nach dem nächsten gezeichneten Bild: requestAnimationFrame läuft direkt vor dem
 * Zeichnen, die neue Aufgabe danach beginnt also erst nach dem Bild.
 *
 * Warum: React und schwere Rechnungen, die sofort nach dem Tipp starten, halten den Browser vom
 * Zeichnen ab; die Rückmeldung käme erst mit dem fertigen Bildschirm.
 * Ausgabe: Versprechen ohne Wert. Beispiel: await nachDemNaechstenBild(); dann navigieren.
 * Sonderfall: Im Hintergrund (document.hidden) gibt es keine Bilder; dann nur die neue Aufgabe,
 * sonst bliebe das Versprechen bis zur Rückkehr liegen. Ohne Dokument (Tests in Node) ebenso.
 */
export function nachDemNaechstenBild(): Promise<void> {
  return new Promise((weiter) => {
    if (typeof document === "undefined" || document.hidden) {
      setTimeout(weiter, 0);
      return;
    }
    requestAnimationFrame(() => setTimeout(weiter, 0));
  });
}
