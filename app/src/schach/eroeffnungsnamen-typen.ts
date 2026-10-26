/**
 * Typen der Eröffnungsnamen außerhalb des Buches: eine bekannte Eröffnung (ECO und Name) und die
 * Tabelle Stellungsschlüssel → Eröffnung.
 *
 * Rolle im Gesamtbild: schach/eroeffnungsnamen.ts baut die Tabelle mit den Schlüsseln aus
 * schach/eroeffnungsindex.ts, und der Eröffnungsindex nimmt die Tabelle als Eingabe. Stehen die
 * Typen hier, benutzen sich die zwei Dateien nicht mehr gegenseitig (Ordnung im Code,
 * docs/codefuehrer/8-verbesserungen.md). Von außen geht der Import weiter über
 * schach/eroeffnungsnamen.ts, das die Typen weiterreicht.
 * Abhängigkeiten: keine.
 */
export interface BekannteEroeffnung {
  /** ECO-Schlüssel, etwa „B90“. */
  readonly eco: string;
  /** Name, die Familie auf Deutsch, die Variante englisch. */
  readonly name: string;
}

/** Stellungsschlüssel → bekannte Eröffnung. */
export type Eroeffnungsnamen = ReadonlyMap<string, BekannteEroeffnung>;
